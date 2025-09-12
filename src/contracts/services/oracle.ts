import { OraclePriceResponse } from '~/types/contracts/oracle/response';
import {
  ParsedOraclePriceResponse,
  ParsedOraclePricesResponse,
  OracleErrorType,
} from '~/types/contracts/oracle/model';
import {
  first,
  map,
  lastValueFrom,
} from 'rxjs';
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
  blockHeight: number,
): ParsedOraclePriceResponse => ({
  oracleKey: response.key,
  rate: response.data.rate,
  lastUpdatedBase: response.data.last_updated_base,
  lastUpdatedQuote: response.data.last_updated_quote,
  blockHeight,
});

/**
 * parses the reponse from a batch query of
 * multiple individual prices
 */
const parseBatchPrice = (
  response: BatchQueryParsedResponse,
): ParsedOraclePriceResponse => {
  if (response.length > 1) {
    throw new Error('Error parsing price, multiple prices returned when only 1 was expected');
  }
  const { response: priceResponse, blockHeight } = response[0];
  return parsePriceFromContract(priceResponse as OraclePriceResponse, blockHeight);
};

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
 * parses the reponse from a batch query of
 * multiple prices returned as a group
 */
const parseBatchPrices = (
  response: BatchQueryParsedResponse,
): ParsedOraclePricesResponse => {
  if (response.length > 1) {
    throw new Error('Error parsing prices, multiple groups of prices were returned when only 1 was expected');
  }
  const pricesResponse = response[0];

  if (
    pricesResponse.status
    && pricesResponse.status === BatchItemResponseStatus.ERROR
  ) {
    let errorType = OracleErrorType.UNKNOWN;
    if (pricesResponse.response.includes('Derivative rate is stale')) {
      errorType = OracleErrorType.STALE_DERIVATIVE_RATE;
    }
    throw new Error(`ORACLE ERROR: ${errorType}`);
  }

  return pricesResponse.response.reduce((
    acc:ParsedOraclePricesResponse,
    curr: OraclePriceResponse,
  ) => ({
    ...acc,
    [curr.key]: parsePriceFromContract(curr, pricesResponse.blockHeight),
  }), {} as ParsedOraclePricesResponse);
};
/**
 * query the price of an asset using the oracle key
 */
const queryPrice$ = ({
  queryRouterContractAddress,
  queryRouterCodeHash,
  oracleContractAddress,
  oracleCodeHash,
  oracleKey,
  lcdEndpoint,
  chainId,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  oracleKey: string,
  lcdEndpoint?: string,
  chainId?: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) => {
  const query: BatchQueryParams[] = [{
    id: 1,
    contract: {
      address: oracleContractAddress,
      codeHash: oracleCodeHash,
    },
    queryMsg: msgQueryOraclePrice(oracleKey),
  }];

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries: query,
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseBatchPrice),
    first(),
  );
};

/**
 * query the price of an asset using the oracle key
 */
async function queryPrice({
  queryRouterContractAddress,
  queryRouterCodeHash,
  oracleContractAddress,
  oracleCodeHash,
  oracleKey,
  lcdEndpoint,
  chainId,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  oracleKey: string,
  lcdEndpoint?: string,
  chainId?: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(queryPrice$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    oracleContractAddress,
    oracleCodeHash,
    oracleKey,
    lcdEndpoint,
    chainId,
    minBlockHeightValidationOptions,
  }));
}

/**
 * query multiple asset prices using oracle keys
 */
const queryPrices$ = ({
  queryRouterContractAddress,
  queryRouterCodeHash,
  oracleContractAddress,
  oracleCodeHash,
  oracleKeys,
  lcdEndpoint,
  chainId,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  oracleKeys: string[],
  lcdEndpoint?: string,
  chainId?: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) => {
  const query: BatchQueryParams[] = [{
    id: 1,
    contract: {
      address: oracleContractAddress,
      codeHash: oracleCodeHash,
    },
    queryMsg: msgQueryOraclePrices(oracleKeys),
  }];

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries: query,
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseBatchPrices),
    first(),
  );
};
/**
 * query multiple asset prices using oracle keys
 */
async function queryPrices({
  queryRouterContractAddress,
  queryRouterCodeHash,
  oracleContractAddress,
  oracleCodeHash,
  oracleKeys,
  lcdEndpoint,
  chainId,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  oracleKeys: string[],
  lcdEndpoint?: string,
  chainId?: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(queryPrices$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    oracleContractAddress,
    oracleCodeHash,
    oracleKeys,
    lcdEndpoint,
    chainId,
    minBlockHeightValidationOptions,
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
  queryPrice$,
  queryPrices$,
  queryPrice,
  queryPrices,
  batchQueryIndividualPrices$,
  batchQueryIndividualPrices,
  parseBatchPrice,
  parseBatchPrices,
  parseBatchQueryIndividualPrices,
};
