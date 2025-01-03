import {
  Observable,
  defer,
  forkJoin,
  lastValueFrom,
  map,
  first, switchMap,
} from 'rxjs';
import { fromFetch } from 'rxjs/fetch';
import { createFetch } from '~/client/services/createFetch';
import {
  SecretValidatorItemResponse,
} from '~/types/apy';

import { QuerySupplyOfResponse } from 'secretjs/dist/grpc_gateway/cosmos/bank/v1beta1/query.pb';
import { getActiveQueryClient$ } from '~/client';
import { secretClientTokenSupplyQuery$ } from '~/client/services/clientServices';

enum SecretQueryOptions {
  INFLATION = '/cosmos/mint/v1beta1/inflation',
  TOTAL_STAKED = '/cosmos/staking/v1beta1/pool',
  TAXES = '/cosmos/distribution/v1beta1/params',
  VALIDATORS = '/cosmos/staking/v1beta1/validators',
}

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
        secretInflationPercent: response?.inflation,
      } as ResponseType;
    case SecretQueryOptions.TOTAL_STAKED:
      return {
        secretTotalStakedRaw: response?.pool?.bonded_tokens,
      }as ResponseType;
    case SecretQueryOptions.TAXES:
      if (response.params
          && response.params.community_tax
          && response.params.secret_foundation_tax
      ) {
        return {
          secretTaxes: {
            foundationTaxPercent: Number(response.params.secret_foundation_tax),
            communityTaxPercent: Number(response.params.community_tax),
          },
        }as ResponseType;
      }
      return response as ResponseType;
    case SecretQueryOptions.VALIDATORS: {
      const parsedValidators = response?.validators?.map((
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

const parseTotalSupplyResponse = (response:QuerySupplyOfResponse) => {
  if (response === undefined
    || response.amount === undefined
    || response.amount.amount === undefined
  ) {
    throw new Error('No response from the total supply query');
  }
  return Number(response.amount.amount);
};

/**
 * query the staking info from the shade staking contract
 */
const queryScrtTotalSupply$ = (
  lcdEndpoint?: string,
  chainId?: string,
) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => secretClientTokenSupplyQuery$(client, 'uscrt')),
  map((response) => parseTotalSupplyResponse(response)),
  first(),
);

export {
  SecretQueryOptions,
  parseSecretQueryResponse,
  secretChainQuery$,
  secretChainQuery,
  secretChainQueries$,
  secretChainQueries,
  queryScrtTotalSupply$,
};
