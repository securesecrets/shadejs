/**
 * Query single price from the oracle contract
 */
const msgQueryOraclePrice = (oracleKey: string) => ({
  get_price: {
    key: oracleKey,
  },
});

/**
 * Query muliple prices from the oracle contract
 */
const msgQueryOraclePrices = (oracleKeys: string[]) => ({
  get_prices: {
    keys: oracleKeys,
  },
});

export {
  msgQueryOraclePrice,
  msgQueryOraclePrices,
};
