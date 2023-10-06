/**
 * Query single price from the oracle contract
 */
const queryOraclePrice = (oracleKey: string) => ({
  get_price: {
    key: oracleKey,
  },
});

/**
 * Query muliple prices from the oracle contract
 */
const queryOraclePrices = (oracleKeys: string[]) => ({
  get_prices: {
    keys: oracleKeys,
  },
});

export {
  queryOraclePrice,
  queryOraclePrices,
};
