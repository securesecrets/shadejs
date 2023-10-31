import { encodeJsonToB64 } from '~/lib/utils';
import { BatchQuery } from '~/types/contracts/batchQuery/model';

/**
 * batch query multiple contracts/messages at one time
 */
const msgBatchQuery = (queries: BatchQuery[]) => ({
  batch: {
    queries: queries.map((batchQuery) => ({
      id: encodeJsonToB64(batchQuery.id),
      contract: {
        address: batchQuery.contract.address,
        code_hash: batchQuery.contract.codeHash,
      },
      query: encodeJsonToB64(batchQuery.queryMsg),
    })),
  },
});

export {
  msgBatchQuery,
};
