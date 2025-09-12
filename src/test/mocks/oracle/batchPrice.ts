import { BatchItemResponseStatus, BatchQueryParsedResponse } from '~/types/contracts/batchQuery/model';

const batchPrice: BatchQueryParsedResponse = [{
  id: 1,
  response: {
    key: 'BTC',
    data: {
      rate: '27917207155600000000000',
      last_updated_base: 1696644063,
      last_updated_quote: 18446744073709552000,
    },
  },
  status: BatchItemResponseStatus.SUCCESS,
  blockHeight: 123456789,
}];

export {
  batchPrice,
};
