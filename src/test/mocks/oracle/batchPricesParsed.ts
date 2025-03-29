import { OracleErrorType, ParsedOraclePricesResponse } from '~/types';

const batchPricesWithErrorParsedResponse: ParsedOraclePricesResponse = {
  BTC: {
    oracleKey: 'BTC',
    rate: '49521843708800000000000',
    lastUpdatedBase: 1707858482,
     
    lastUpdatedQuote: 18446744073709551615,
    blockHeight: 3,
  },
  'Quicksilver ATOM': {
    oracleKey: 'Quicksilver ATOM',
    error: {
      type: OracleErrorType.STALE_DERIVATIVE_RATE,
      msg: 'Cannot parse response: expected value at line 1 column 1 in: Generic error: Querier system error: Cannot parse response: expected value at line 1 column 1 in: Generic error: Derivative rate is stale. Last updated 1704806636. Current time 1707858606.',
    },
    blockHeight: 3,
  },
};

export {
  batchPricesWithErrorParsedResponse,
};
