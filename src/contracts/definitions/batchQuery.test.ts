import {
  test,
  expect,
} from 'vitest';
import {
  msgBatchQuery,
} from '~/contracts/definitions/batchQuery';
import { BatchQuery } from '~/types/contracts/batchQuery/model';
import { encodeJsonToB64 } from '~/lib/utils';

test('it test the form of the query oracle msg', () => {
  const input: BatchQuery[] = [{
    id: 'ID',
    contract: {
      address: 'CONTRACT_ADDRESS',
      codeHash: 'CODE_HASH',
    },
    queryMsg: 'QUERY_MESSAGE',
  }];

  const output = {
    batch: {
      queries: [{
        id: encodeJsonToB64(input[0].id),
        contract: {
          address: 'CONTRACT_ADDRESS',
          code_hash: 'CODE_HASH',
        },
        query: encodeJsonToB64(input[0].queryMsg),
      }],
    },
  };
  expect(msgBatchQuery(input)).toStrictEqual(output);
});
