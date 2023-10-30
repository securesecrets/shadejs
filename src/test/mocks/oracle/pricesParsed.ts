import BigNumber from 'bignumber.js';

const priceParsed = {
  oracleKey: 'BTC',
  rate: BigNumber('27917.2071556'),
  lastUpdatedBase: 1696644063,
  lastUpdatedQuote: 18446744073709552000,
};

const pricesParsed = {
  BTC: {
    oracleKey: 'BTC',
    rate: BigNumber('27917.2071556'),
    lastUpdatedBase: 1696644063,
    lastUpdatedQuote: 18446744073709552000,
  },
  ETH: {
    oracleKey: 'ETH',
    rate: BigNumber('1644.0836829'),
    lastUpdatedBase: 1696644063,
    lastUpdatedQuote: 18446744073709552000,
  },
};

export {
  priceParsed,
  pricesParsed,
};
