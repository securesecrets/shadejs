/**
 * Query single price from the oracle contract
 */
declare const msgQueryOraclePrice: (oracleKey: string) => {
    get_price: {
        key: string;
    };
};
/**
 * Query muliple prices from the oracle contract
 */
declare const msgQueryOraclePrices: (oracleKeys: string[]) => {
    get_prices: {
        keys: string[];
    };
};
export { msgQueryOraclePrice, msgQueryOraclePrices, };
