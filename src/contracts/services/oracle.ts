import {
  OraclePriceResponse,
  OraclePricesResponse,
  ParsedOraclePriceResponse,
  ParsedOraclePricesResponse,
} from '~/types/contracts/oracle'
import { 
  switchMap,
  first, 
  map,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { queryOraclePrice, queryOraclePrices } from '../definitions/oracle';
import { getActiveQueryClient$ } from '~/client';
import { convertCoinFromUDenom } from '~/lib/utils';

/**
* Parses the contract price query into the app data model
*/
const parsePriceFromContract = (response: OraclePriceResponse): ParsedOraclePriceResponse => ({
  oracleKey: response.key,
  rate: convertCoinFromUDenom(response.data.rate, 18),
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
      rate: convertCoinFromUDenom(curr.data.rate, 18),
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
  switchMap((client) =>  sendSecretClientContractQuery$({
    queryMsg: queryOraclePrice(oracleKey), 
    client, 
    contractAddress, 
    codeHash,
  })),
  map((response) => parsePriceFromContract(response as OraclePriceResponse)),
  first(),
)
  
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
  switchMap((client) =>  sendSecretClientContractQuery$({
    queryMsg: queryOraclePrices(oracleKeys), 
    client, 
    contractAddress, 
    codeHash,
  })),
  map((response) => parsePricesFromContract(response as OraclePricesResponse)),
  first(),
)

  

export {
  queryPrice$,
  queryPrices$,
};