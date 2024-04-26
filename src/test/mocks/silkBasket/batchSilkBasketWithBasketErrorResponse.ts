import { BatchItemResponseStatus, BatchQueryParsedResponse } from '~/types';
import { SilkBasketBatchResponseItem } from '~/types/contracts/silkBasket/service';

const batchSilkBasketWithBasketErrorResponse: BatchQueryParsedResponse = [
  {
    id: SilkBasketBatchResponseItem.BASKET,
    response: 'BASKET_ERROR_MESSAGE',
    blockHeight: 1,
    status: BatchItemResponseStatus.ERROR,
  },
  {
    id: SilkBasketBatchResponseItem.PRICES,
    response: [
      {
        key: 'CAD',
        data: {
          rate: '731678675000000000',
          last_updated_base: 1714070751,
          last_updated_quote: 18446744073709552000,
        },
      },
      {
        key: 'BTC',
        data: {
          rate: '64526100000000000000000',
          last_updated_base: 1714070794,
          last_updated_quote: 18446744073709552000,
        },
      },
      {
        key: 'JPY',
        data: {
          rate: '6425558000000000',
          last_updated_base: 1714070751,
          last_updated_quote: 18446744073709552000,
        },
      },
      {
        key: 'USD',
        data: {
          rate: '1000000000000000000',
          last_updated_base: 18446744073709552000,
          last_updated_quote: 18446744073709552000,
        },
      },
      {
        key: 'EUR',
        data: {
          rate: '1072833942000000000',
          last_updated_base: 1714070751,
          last_updated_quote: 18446744073709552000,
        },
      },
      {
        key: 'XAU',
        data: {
          rate: '2332043324700000000000',
          last_updated_base: 1714070751,
          last_updated_quote: 18446744073709552000,
        },
      },
    ],
    blockHeight: 1,
    status: BatchItemResponseStatus.SUCCESS,
  },
];

export {
  batchSilkBasketWithBasketErrorResponse,
};
