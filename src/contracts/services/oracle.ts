import {
  OraclePriceResponse,
  OraclePricesResponse,
} from '~/types/contracts/oracle/response';
import {
  ParsedOraclePriceResponse,
  ParsedOraclePricesResponse,
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

/**
* Parses the contract price query into the app data model
*/
const parsePriceFromContract = (response: OraclePriceResponse): ParsedOraclePriceResponse => ({
  oracleKey: response.key,
  rate: response.data.rate,
  lastUpdatedBase: response.data.last_updated_base,
  lastUpdatedQuote: response.data.last_updated_quote,
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

export {
  parsePriceFromContract,
  parsePricesFromContract,
  queryPrice$,
  queryPrices$,
  queryPrice,
  queryPrices,
};
