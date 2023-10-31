import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import { of } from 'rxjs';
import batchPairConfigResponse from '~/test/mocks/batchQuery/batchPairConfigResponse.json';
import { batchPairConfigParsed } from '~/test/mocks/batchQuery/batchPairConfigParsed';
import { BatchQuery } from '~/types/contracts/bathQuery/model';
import { msgBatchQuery } from '~/contracts/definitions/batchQuery';
import {
  parseBatchQuery,
  batchQuery$,
} from './batchQuery';

beforeAll(() => {
  vi.mock('~/contracts/definitions/batchQuery', () => ({
    msgBatchQuery: vi.fn(() => 'MSG_BATCH_QUERY'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of('CLIENT')),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$: vi.fn(() => of(batchPairConfigResponse)),
  }));
});

afterAll(() => {
  vi.clearAllMocks();
});

test('it can parse the batch query response', () => {
  expect(parseBatchQuery(
    batchPairConfigResponse,
  )).toStrictEqual(batchPairConfigParsed);
});

test('it can call the batch query service', () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    queries: ['BATCH_QUERY' as unknown as BatchQuery],
  };

  let output;
  batchQuery$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(msgBatchQuery).toHaveBeenCalledWith(input.queries);

  expect(output).toStrictEqual(batchPairConfigParsed);
});
