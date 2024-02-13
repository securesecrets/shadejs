import { BatchItemResponseStatus, BatchQueryParsedResponse } from '~/types/contracts/batchQuery/model';

const batchPricesWithErrorParsed: BatchQueryParsedResponse = [{
  id: 'BTC',
  response: {
    key: 'BTC',
    data: {
      rate: '49521843708800000000000',
      last_updated_base: 1707858482,
      // eslint-disable-next-line
      last_updated_quote: 18446744073709551615,
    },
  },
  status: BatchItemResponseStatus.SUCCESS,
},
{
  id: 'Quicksilver ATOM',
  response: 'Cannot parse response: expected value at line 1 column 1 in: Generic error: Querier system error: Cannot parse response: expected value at line 1 column 1 in: Generic error: Derivative rate is stale. Last updated 1704806636. Current time 1707858606.',
  status: BatchItemResponseStatus.ERROR,
}];

export {
  batchPricesWithErrorParsed,
};
