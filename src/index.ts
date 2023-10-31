import '~/polyfills/index';
import { getSecretNetworkClient$, getActiveQueryClient$ } from '~/client';
import { queryPrice$, queryPrices$ } from '~/contracts/services/oracle';
import { batchQuery$ } from '~/contracts/services/batchQuery';
import {
  queryFactoryConfig$,
  queryFactoryPairs$,
  queryPairConfig$,
  batchQueryPairsInfo$,
  batchQueryStakingInfo$,
} from '~/contracts/services/swap';
import { querySnip20TokenInfo$ } from './contracts/services/snip20';

export {
  getSecretNetworkClient$,
  getActiveQueryClient$,
  queryPrice$,
  queryPrices$,
  batchQuery$,
  queryFactoryConfig$,
  queryFactoryPairs$,
  queryPairConfig$,
  batchQueryPairsInfo$,
  batchQueryStakingInfo$,
  querySnip20TokenInfo$,
};
