import {
  BatchQueryParsedResponse,
  OracleErrorType,
  ParsedOraclePricesResponse,
  BatchItemResponseStatus,
} from '~/types';

const batchPricesParsedResponse: BatchQueryParsedResponse = [{
  id: 1,
  response: [
    {
      key: 'BTC',
      data: {
        rate: '27917207155600000000000',
        last_updated_base: 1696644063,
        last_updated_quote: 18446744073709552000,
      },
    },
    {
      key: 'ETH',
      data: {
        rate: '1644083682900000000000',
        last_updated_base: 1696644063,
        last_updated_quote: 18446744073709552000,
      },
    },
  ],
  status: BatchItemResponseStatus.SUCCESS,
  blockHeight: 3,
}];

const batchPricesWithErrorParsedResponse: ParsedOraclePricesResponse = {
  BTC: {
    oracleKey: 'BTC',
    rate: '49521843708800000000000',
    lastUpdatedBase: 1707858482,
    // eslint-disable-next-line
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
  batchPricesParsedResponse,
  batchPricesWithErrorParsedResponse,
};
