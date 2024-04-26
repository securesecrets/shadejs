import { BatchItemResponseStatus, BatchQueryParsedResponse } from '~/types';
import { SilkBasketBatchResponseItem } from '~/types/contracts/silkBasket/service';

const batchSilkBasketWithOracleErrorResponse: BatchQueryParsedResponse = [
  {
    id: SilkBasketBatchResponseItem.BASKET,
    response: {
      symbol: 'SILK Peg',
      router: {
        address: 'secret10n2xl5jmez6r9umtdrth78k0vwmce0l5m9f5dm',
        code_hash: '32c4710842b97a526c243a68511b15f58d6e72a388af38a7221ff3244c754e91',
      },
      when_stale: '3600',
      peg: {
        target: '1050000000000000000',
        value: '1149881971000000000',
        last_value: '1149881971000000000',
        frozen: false,
        last_updated: '1714053218',
      },
      basket: [
        {
          symbol: 'CAD',
          weight: {
            initial: '0.077167854630036405',
            fixed: '0.107192209875052435',
          },
        },
        {
          symbol: 'USD',
          weight: {
            initial: '0.337301580837853137',
            fixed: '0.353843538457366364',
          },
        },
        {
          symbol: 'JPY',
          weight: {
            initial: '0.103589679459286984',
            fixed: '15.684456395164345505',
          },
        },
        {
          symbol: 'BTC',
          weight: {
            initial: '0.068084956080984917',
            fixed: '0.000002334689261109',
          },
        },
        {
          symbol: 'EUR',
          weight: {
            initial: '0.232086119065448055',
            fixed: '0.223108470434723066',
          },
        },
        {
          symbol: 'XAU',
          weight: {
            initial: '0.181769809926390499',
            fixed: '0.000099333104038645',
          },
        },
      ],
    },
    blockHeight: 1,
  },
  {
    id: SilkBasketBatchResponseItem.PRICES,
    response: 'PRICE_ERROR_MESSAGE',
    blockHeight: 1,
    status: BatchItemResponseStatus.ERROR,
  },
];

export {
  batchSilkBasketWithOracleErrorResponse,
};
