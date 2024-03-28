import {
  Observable,
  defer,
  forkJoin,
  lastValueFrom,
  map,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { createFetch } from '~/client/services/createFetch';
import {
  SecretQueryOptions,
  SecretValidatorItemResponse,
} from '~/types/apy';

// NO DOCS NEEDED, THESE FUNCTIONS ARE NOT EXPORTED
// See src/index.ts

/**
 * Parses the response from the secretChainQuery service
 */
function parseSecretQueryResponse<ResponseType>(
  response: any,
  query: string,
): ResponseType {
  switch (query) {
    case SecretQueryOptions.INFLATION:
      return {
        secretInflationPercent: response?.result,
      } as ResponseType;
    case SecretQueryOptions.TOTAL_SUPPLY:
      return {
        secretTotalSupplyRaw: response?.amount?.amount,
      }as ResponseType;
    case SecretQueryOptions.TOTAL_STAKED:
      return {
        secretTotalStakedRaw: response?.result?.bonded_tokens,
      }as ResponseType;
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
        }as ResponseType;
      }
      return response as ResponseType;
    case SecretQueryOptions.VALIDATORS: {
      const parsedValidators = response?.result?.map((
        nextValidator: SecretValidatorItemResponse,
      ) => ({
        ratePercent: Number(nextValidator.commission.commission_rates.rate),
        validatorAddress: nextValidator.operator_address,
      }));
      return {
        secretValidators: parsedValidators,
      } as ResponseType;
    }
    default:
      return response as ResponseType;
  }
}

/**
 * Executes various chain queries throught the url provided
 *
 * ResponseType must be a javascript object
 *
 * @param lcdEndpoint is used here instead of client since URL is a private argument to client
 * The client does not support the types of queries specified in SecretQueryOptions
 * @param queries is the endpoint you'd like to hit, ex. '/minting/inflation'
 */
function secretChainQuery$<ResponseType>(url: string, query: string): Observable<ResponseType> {
  return createFetch(defer(
    () => fromFetch(`${url}${query}`),
  )).pipe(
    map((response: any) => parseSecretQueryResponse<ResponseType>(response, query)),
  );
}

/**
 * Executes various chain queries throught the url provided
 *
 * ResponseType must be a javascript object
 *
 * @param lcdEndpoint is used here instead of client since URL is a private argument to client
 * The client does not support the types of queries specified in SecretQueryOptions
 * @param queries is the endpoint you'd like to hit, ex. '/minting/inflation'
 */
async function secretChainQuery<ResponseType>(url: string, query: string): Promise<ResponseType> {
  return lastValueFrom(secretChainQuery$(url, query));
}

/**
 * Executes multiple chain queries throught the url provided
 *
 * ResponseType must be a javascript object
 *
 * @param lcdEndpoint is used here instead of client since URL is a private argument to client
 * The client does not support the types of queries specified in SecretQueryOptions
 * @param queries is the endpoint you'd like to hit, ex. ['/minting/inflation']
 */
function secretChainQueries$<ResponseType>(
  url: string,
  queries: string[],
): Observable<ResponseType> {
  return forkJoin(queries.map((nextQuery) => secretChainQuery$<ResponseType>(url, nextQuery))).pipe(
    map((response: ResponseType[]) => response.reduce((
      parsedResonse,
      nextResponse,
    ) => ({
      ...parsedResonse,
      ...nextResponse,
    } as ResponseType), {} as ResponseType)),
  );
}

/**
 * Executes multiple chain queries throught the url provided
 *
 * ResponseType must be a javascript object
 *
 * @param lcdEndpoint is used here instead of client since URL is a private argument to client
 * The client does not support the types of queries specified in SecretQueryOptions
 * @param queries is the endpoint you'd like to hit, ex. ['/minting/inflation']
 */
async function secretChainQueries<ResponseType>(
  url: string,
  queries: string[],
): Promise<ResponseType> {
  return lastValueFrom(secretChainQueries$(url, queries));
}

export {
  parseSecretQueryResponse,
  secretChainQuery$,
  secretChainQuery,
  secretChainQueries$,
  secretChainQueries,
};
