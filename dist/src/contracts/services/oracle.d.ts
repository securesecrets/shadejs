import { OraclePriceResponse, OraclePricesResponse, ParsedOraclePriceResponse, ParsedOraclePricesResponse } from '../../types/contracts/oracle';
/**
* Parses the contract price query into the app data model
*/
declare const parsePriceFromContract: (response: OraclePriceResponse) => ParsedOraclePriceResponse;
/**
* Parses the contract prices query into the app data model
*/
declare function parsePricesFromContract(pricesResponse: OraclePricesResponse): ParsedOraclePricesResponse;
/**
 * query the price of an asset using the oracle key
 */
declare const queryPrice$: ({ contractAddress, codeHash, oracleKey, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    oracleKey: string;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => import("rxjs").Observable<ParsedOraclePriceResponse>;
/**
 * query multiple asset prices using oracle keys
 */
declare const queryPrices$: ({ contractAddress, codeHash, oracleKeys, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    oracleKeys: string[];
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => import("rxjs").Observable<ParsedOraclePricesResponse>;
export { parsePriceFromContract, parsePricesFromContract, queryPrice$, queryPrices$, };
