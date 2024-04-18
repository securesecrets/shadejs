import {
  OraclePriceResponse,
  OraclePricesResponse,
} from '~/types/contracts/oracle/response';
import {
  ParsedOraclePriceResponse,
  ParsedOraclePricesResponse,
  OracleErrorType,
} from '~/types/contracts/oracle/model';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { getActiveQueryClient$ } from '~/client';
import { msgQueryOraclePrice, msgQueryOraclePrices } from '~/contracts/definitions/oracle';
import {
  BatchItemResponseStatus,
  BatchQueryParams,
  BatchQueryParsedResponse,
  MinBlockHeightValidationOptions,
} from '~/types';
import { batchQuery$ } from './batchQuery';

/**
* Parses the contract price query into the app data model
*/
const parsePriceFromContract = (
  response: OraclePriceResponse,
  blockHeight?: number,
): ParsedOraclePriceResponse => ({
  oracleKey: response.key,
  rate: response.data.rate,
  lastUpdatedBase: response.data.last_updated_base,
  lastUpdatedQuote: response.data.last_updated_quote,
  blockHeight,
});

/**
* Parses the contract prices query into the app data model
*/
function parsePricesFromContract(pricesResponse: OraclePricesResponse) {
  return pricesResponse.reduce((prev, curr) => ({
    ...prev,
    [curr.key]: {
      oracleKey: curr.key,
      rate: curr.data.rate,
      lastUpdatedBase: curr.data.last_updated_base,
      lastUpdatedQuote: curr.data.last_updated_quote,
    } as ParsedOraclePriceResponse,
  }), {} as ParsedOraclePricesResponse);
}

/**
 * parses the reponse from a batch query of
 * multiple individual prices
 */
const parseBatchQueryIndividualPrices = (
  response: BatchQueryParsedResponse,
): ParsedOraclePricesResponse => response.reduce((
  prev,
  item,
) => {
  if (
    item.status
    && item.status === BatchItemResponseStatus.ERROR) {
    let errorType = OracleErrorType.UNKNOWN;
    if (item.response.includes('Derivative rate is stale')) {
      errorType = OracleErrorType.STALE_DERIVATIVE_RATE;
    }

    return {
      ...prev,
      [item.id as string]: {
        oracleKey: item.id as string,
        error: {
          type: errorType,
          msg: item.response,
        },
        blockHeight: item.blockHeight,
      },
    };
  }
  return {
    ...prev,
    [item.id as string]: parsePriceFromContract(item.response, item.blockHeight),
  };
}, {});

/**
 * query the price of an asset using the oracle key
 */
const queryPrice$ = ({
  contractAddress,
  codeHash,
  oracleKey,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  oracleKey: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryOraclePrice(oracleKey),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parsePriceFromContract(response as OraclePriceResponse)),
  first(),
);

/**
 * query the price of an asset using the oracle key
 */
async function queryPrice({
  contractAddress,
  codeHash,
  oracleKey,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  oracleKey: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryPrice$({
    contractAddress,
    codeHash,
    oracleKey,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * query multiple asset prices using oracle keys
 */
const queryPrices$ = ({
  contractAddress,
  codeHash,
  oracleKeys,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  oracleKeys: string[],
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryOraclePrices(oracleKeys),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parsePricesFromContract(response as OraclePricesResponse)),
  first(),
);

/**
 * query multiple asset prices using oracle keys
 */
async function queryPrices({
  contractAddress,
  codeHash,
  oracleKeys,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  oracleKeys: string[],
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryPrices$({
    contractAddress,
    codeHash,
    oracleKeys,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * queries individual prices utilizing a batch query.
 * This is a less efficient version of the multi-price query in the oracle
 * contract, however the benefits are that an error in any single price
 * will not cause all prices to fail. The recommended use would be to fall
 * back on this query when the standard queryPrices fails so that you
 * can determine which key is having issues, while also still getting
 * data back for the good keys.
 */
function batchQueryIndividualPrices$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  oracleContractAddress,
  oracleCodeHash,
  oracleKeys,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  oracleContractAddress: string
  oracleCodeHash: string
  oracleKeys: string[],
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const queries:BatchQueryParams[] = oracleKeys.map((key) => ({
    id: key,
    contract: {
      address: oracleContractAddress,
      codeHash: oracleCodeHash,
    },
    queryMsg: msgQueryOraclePrice(key),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseBatchQueryIndividualPrices),
    first(),
  );
}

/**
 * queries individual prices utilizing a batch query.
 * This is a less efficient version of the multi-price query in the oracle
 * contract, however the benefits are that an error in any single price
 * will not cause all prices to fail. The recommended use would be to fall
 * back on this query when the standard queryPrices fails so that you
 * can determine which key is having issues, while also still getting
 * data back for the good keys.
 */
async function batchQueryIndividualPrices({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  oracleContractAddress,
  oracleCodeHash,
  oracleKeys,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  oracleContractAddress: string
  oracleCodeHash: string
  oracleKeys: string[],
}) {
  return lastValueFrom(batchQueryIndividualPrices$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    oracleContractAddress,
    oracleCodeHash,
    oracleKeys,
  }));
}

export {
  parsePriceFromContract,
  parsePricesFromContract,
  queryPrice$,
  queryPrices$,
  queryPrice,
  queryPrices,
  parseBatchQueryIndividualPrices,
  batchQueryIndividualPrices$,
  batchQueryIndividualPrices,
};
