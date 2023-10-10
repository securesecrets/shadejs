/**
 * Query single price from the oracle contract
 */
const msgQueryOraclePrice = (oracleKey) => ({
    get_price: {
        key: oracleKey,
    },
});
/**
 * Query muliple prices from the oracle contract
 */
const msgQueryOraclePrices = (oracleKeys) => ({
    get_prices: {
        keys: oracleKeys,
    },
});
export { msgQueryOraclePrice, msgQueryOraclePrices, };
