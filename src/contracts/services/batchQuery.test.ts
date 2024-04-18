import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest';
import { of } from 'rxjs';
import batchPairConfigResponse from '~/test/mocks/batchQuery/batchPairConfigResponse.json';
import { batchPairConfigParsed } from '~/test/mocks/batchQuery/batchPairConfigParsed';
import { BatchQueryParams } from '~/types/contracts/batchQuery/model';
import { msgBatchQuery } from '~/contracts/definitions/batchQuery';
import batchPricesWithError from '~/test/mocks/batchQuery/batchIndividualPricesWithErrorResponse.json';
import { batchPricesWithErrorParsed } from '~/test/mocks/batchQuery/batchPricesWithErrorParsed';
import { SecretNetworkClient } from 'secretjs';
import {
  parseBatchQuery,
  batchQuery$,
  batchQuery,
  batchQuerySingleBatch$,
  divideSingleBatchIntoArrayOfMultipleBatches,
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

afterEach(() => {
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

test('it can call the single batch query service', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    queries: ['BATCH_QUERY' as unknown as BatchQueryParams],
    client: 'SECRET_CLIENT' as unknown as SecretNetworkClient,
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(batchPairConfigResponse));

  let output;
  batchQuerySingleBatch$(input).subscribe({
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

test('it can call the single batch query service and retry on stale node found', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    queries: ['BATCH_QUERY' as unknown as BatchQueryParams],
    client: 'SECRET_CLIENT' as unknown as SecretNetworkClient,
    nodeHealthValidationConfig: {
      minBlockHeight: 3,
      maxRetries: 3,
    },
  };

  const batchPairResponse1 = {
    batch: {
      ...batchPairConfigResponse.batch,
      block_height: 2, // simulate stale node
    },
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairConfigResponse),
  );

  let output;
  batchQuerySingleBatch$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(msgBatchQuery).toHaveBeenNthCalledWith(1, input.queries);
  expect(output).toStrictEqual(batchPairConfigParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairConfigResponse),
  );
  const response = await batchQuery(input);
  expect(msgBatchQuery).toHaveBeenNthCalledWith(2, input.queries);
  expect(response).toStrictEqual(batchPairConfigParsed);
});

test('it can call the single batch query service and detect query retry limit exceeded', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    queries: ['BATCH_QUERY' as unknown as BatchQueryParams],
    client: 'SECRET_CLIENT' as unknown as SecretNetworkClient,
    nodeHealthValidationConfig: {
      minBlockHeight: 3,
      maxRetries: 2,
    },
  };

  const batchPairResponse1 = {
    batch: {
      ...batchPairConfigResponse.batch,
      block_height: 2, // simulate stale node
    },
  };

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairResponse1),
  ).mockReturnValueOnce(
    of(batchPairConfigResponse), // will never reach final case due to retry limit
  );

  await expect(() => batchQuery(input)).rejects.toThrowError('Reached maximum retry attempts for stale node error.');
});

test('it can call the multi-batch query service on a single batch', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    queries: ['BATCH_QUERY' as unknown as BatchQueryParams],
    // no batch param passed in, so it will process as a single batch
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

test('it can call the multi-batch query service for multiple batches', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    queries: [
      'BATCH_QUERY_1' as unknown as BatchQueryParams,
      'BATCH_QUERY_2' as unknown as BatchQueryParams,
    ],
    batchSize: 1,
  };

  // combined array of two of the outputs
  const combinedOutput = batchPairConfigParsed.concat(batchPairConfigParsed);

  // observables function
  // provide two mocks of the same data
  sendSecretClientContractQuery$
    .mockReturnValueOnce(of(batchPairConfigResponse))
    .mockReturnValueOnce(of(batchPairConfigResponse));

  let output;
  batchQuery$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(msgBatchQuery).toHaveBeenNthCalledWith(1, [input.queries[0]]);
  expect(msgBatchQuery).toHaveBeenNthCalledWith(2, [input.queries[1]]);

  expect(output).toStrictEqual(combinedOutput);

  // async/await function
  sendSecretClientContractQuery$
    .mockReturnValueOnce(of(batchPairConfigResponse))
    .mockReturnValueOnce(of(batchPairConfigResponse));

  const response = await batchQuery(input);
  expect(msgBatchQuery).toHaveBeenNthCalledWith(3, [input.queries[0]]);
  expect(msgBatchQuery).toHaveBeenNthCalledWith(4, [input.queries[1]]);
  expect(response).toStrictEqual(combinedOutput);
});

test('it can divide a batch of queries into an array of multiple batches', () => {
  const input1 = [
    1 as unknown as BatchQueryParams,
    2 as unknown as BatchQueryParams,
    3 as unknown as BatchQueryParams,
    4 as unknown as BatchQueryParams,
    5 as unknown as BatchQueryParams,
    6 as unknown as BatchQueryParams,
    7 as unknown as BatchQueryParams,
    8 as unknown as BatchQueryParams,
  ];

  expect(divideSingleBatchIntoArrayOfMultipleBatches(input1, 2)).toStrictEqual([
    [1, 2],
    [3, 4],
    [5, 6],
    [7, 8],
  ]);

  expect(divideSingleBatchIntoArrayOfMultipleBatches(input1, 3)).toStrictEqual([
    [1, 2, 3],
    [4, 5, 6],
    [7, 8],
  ]);

  expect(divideSingleBatchIntoArrayOfMultipleBatches(input1, 1)).toStrictEqual([
    [1],
    [2],
    [3],
    [4],
    [5],
    [6],
    [7],
    [8],
  ]);

  expect(divideSingleBatchIntoArrayOfMultipleBatches(input1, 10)).toStrictEqual([
    [1, 2, 3, 4, 5, 6, 7, 8],
  ]);
});
