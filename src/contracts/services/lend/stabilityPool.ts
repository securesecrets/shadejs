import {
  MinBlockHeightValidationOptions,
  BatchQueryParams,
  NormalizationFactor,
  BatchQueryParsedResponse,
  BatchItemResponseStatus,
} from '~/types';
import { msgGetStabilityPoolInfo } from '~/contracts/definitions';
import {
  map,
  first,
  firstValueFrom,
} from 'rxjs';
import { StabilityPoolInfo, StabilityPoolResponse } from '~/types/contracts/lend';
import { convertCoinFromUDenom } from '~/lib/utils';
import { batchQuery$ } from '../batchQuery';

/**
 * parses the direct contract query into the data model
 */
const parseStabilityPoolResponse = (
  response: StabilityPoolResponse,
  blockHeight: number,
): StabilityPoolInfo => ({
  silkDeposited: convertCoinFromUDenom(
    response.pool_info.total_silk_deposited,
    NormalizationFactor.LEND,
  ).toString(),
  bondAmount: convertCoinFromUDenom(
    response.pool_info.total_bond_amount,
    NormalizationFactor.LEND,
  ).toString(),
  blockHeight,
});

/**
 * parses the query router response into the data model
 */
function parseStabilityPoolResponseFromQueryRouter(
  batchQueryResponse: BatchQueryParsedResponse,
): StabilityPoolInfo {
  const responseCount = batchQueryResponse.length;
  if (responseCount !== 1) {
    throw new Error(`${responseCount} responses found, one response is expected`);
  }

  const response = batchQueryResponse[0];

  // handle error state
  if (response.status === BatchItemResponseStatus.ERROR) {
    throw new Error(response.response);
  }

  return {
    ...parseStabilityPoolResponse(
      response.response,
      response.blockHeight,
    ),
  };
}

/**
 * query the stability pool info
 */
function queryStabilityPoolInfo$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stabilityPoolContractAddress,
  stabilityPoolCodeHash,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stabilityPoolContractAddress: string,
  stabilityPoolCodeHash: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const query:BatchQueryParams = {
    id: stabilityPoolContractAddress,
    contract: {
      address: stabilityPoolContractAddress,
      codeHash: stabilityPoolCodeHash,
    },
    queryMsg: msgGetStabilityPoolInfo(),
  };

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries: [query], // array of length 1 for single query
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseStabilityPoolResponseFromQueryRouter),
    first(),
  );
}

/**
 * query the stability pool info
 */
function queryStabilityPoolInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stabilityPoolContractAddress,
  stabilityPoolCodeHash,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stabilityPoolContractAddress: string,
  stabilityPoolCodeHash: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return firstValueFrom(queryStabilityPoolInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    stabilityPoolContractAddress,
    stabilityPoolCodeHash,
    minBlockHeightValidationOptions,
  }));
}

export {
  queryStabilityPoolInfo,
  queryStabilityPoolInfo$,
  parseStabilityPoolResponse,
  parseStabilityPoolResponseFromQueryRouter,
};
