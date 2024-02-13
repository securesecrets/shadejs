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
import { BatchQueryParams } from '~/types/contracts/batchQuery/model';
import { msgBatchQuery } from '~/contracts/definitions/batchQuery';
import batchPricesWithError from '~/test/mocks/batchQuery/batchIndividualPricesWithErrorResponse.json';
import { batchPricesWithErrorParsed } from '~/test/mocks/batchQuery/batchPricesWithErrorParsed';
import {
  parseBatchQuery,
  batchQuery$,
  batchQuery,
} from './batchQuery';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/batchQuery', () => ({
    msgBatchQuery: vi.fn(() => 'MSG_BATCH_QUERY'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of('CLIENT')),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

afterAll(() => {
  vi.clearAllMocks();
});

test('it can parse the batch query success response', () => {
  expect(parseBatchQuery(
    batchPairConfigResponse,
  )).toStrictEqual(batchPairConfigParsed);
});

test('it can parse the batch query mixed succes/error response', () => {
  expect(parseBatchQuery(
    batchPricesWithError,
  )).toStrictEqual(batchPricesWithErrorParsed);
});

test('it can call the batch query service', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    queries: ['BATCH_QUERY' as unknown as BatchQueryParams],
  };
  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(batchPairConfigResponse));

  let output;
  batchQuery$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(msgBatchQuery).toHaveBeenNthCalledWith(1, input.queries);
  expect(output).toStrictEqual(batchPairConfigParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(batchPairConfigResponse));
  const response = await batchQuery(input);
  expect(msgBatchQuery).toHaveBeenNthCalledWith(2, input.queries);
  expect(response).toStrictEqual(batchPairConfigParsed);
});
