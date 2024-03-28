import {
  defer,
  forkJoin,
  lastValueFrom,
  map,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { createFetch } from '~/client/services/createFetch';
import {
  SecretChainDataQueryModel,
  SecretQueryOptions,
  SecretValidatorItemResponse,
} from '~/types/apy';

/**
 * Parses the response from the secretChainQuery service
 */
function parseSecretQueryResponse(
  response: any,
  query: SecretQueryOptions,
): SecretChainDataQueryModel {
  switch (query) {
    case SecretQueryOptions.INFLATION:
      return {
        secretInflationPercent: response?.result,
      };
    case SecretQueryOptions.TOTAL_SUPPLY:
      return {
        secretTotalSupplyRaw: response?.amount?.amount,
      };
    case SecretQueryOptions.TOTAL_STAKED:
      return {
        secretTotalStakedRaw: response?.result?.bonded_tokens,
      };
    case SecretQueryOptions.TAXES:
      if (response.result
          && response.result.community_tax
          && response.result.secret_foundation_tax
      ) {
        return {
          secretTaxes: {
            foundationTaxPercent: Number(response.result.secret_foundation_tax),
            communityTaxPercent: Number(response.result.community_tax),
          },
        };
      }
      return {};
    case SecretQueryOptions.VALIDATORS: {
      const parsedValidators = response?.result?.map((
        nextValidator: SecretValidatorItemResponse,
      ) => ({
        ratePercent: Number(nextValidator.commission.commission_rates.rate),
        validatorAddress: nextValidator.operator_address,
      }));
      return {
        secretValidators: parsedValidators,
      };
    }
    default:
      return {};
  }
}

/**
 * Executes various chain queries throught the url provided
 *
 * URL is used here instead of client since URL is a private argument to client
 * The client does not support the types of queries specified in SecretQueryOptions
 */
function secretChainQuery$(url: string, query: SecretQueryOptions) {
  return createFetch(defer(
    () => fromFetch(`${url}${query}`),
  )).pipe(
    map((response: any) => parseSecretQueryResponse(response, query)),
  );
}

/**
 * Executes various chain queries throught the url provided
 */
async function secretChainQuery(url: string, query: SecretQueryOptions) {
  return lastValueFrom(secretChainQuery$(url, query));
}

/**
 * Executes multiple chain queries throught the url provided
 */
function secretChainQueries$(url: string, queries: SecretQueryOptions[]) {
  return forkJoin(queries.map((nextQuery) => secretChainQuery$(url, nextQuery))).pipe(
    map((response: SecretChainDataQueryModel[]) => response.reduce((
      parsedResonse,
      nextResponse,
    ) => ({
      ...parsedResonse,
      ...nextResponse,
    }), {})),
  );
}

/**
 * Executes multiple chain queries throught the url provided
 */
async function secretChainQueries(url: string, queries: SecretQueryOptions[]) {
  return lastValueFrom(secretChainQueries$(url, queries));
}

export {
  secretChainQuery$,
  secretChainQuery,
  secretChainQueries$,
  secretChainQueries,
};
