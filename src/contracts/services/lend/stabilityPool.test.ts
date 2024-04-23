import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import stabilityPoolInfoResponse from '~/test/mocks/lend/stabilityPool/stabilityPoolInfoResponse.json';
import { stabilityPoolInfoParsed } from '~/test/mocks/lend/stabilityPool/stabilityPoolInfoParsed';
import { batchStabilityPoolResponseUnparsed } from '~/test/mocks/lend/stabilityPool/stabilityPoolInfoBatchResponse';
import { of } from 'rxjs';
import { MinBlockHeightValidationOptions } from '~/types';
import {
  parseStabilityPoolResponse,
  parseStabilityPoolResponseFromQueryRouter,
  queryStabilityPoolInfo$,
  queryStabilityPoolInfo,
} from './stabilityPool';

const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/lend/stabilityPool', () => ({
    msgGetStabilityPoolInfo: vi.fn(() => 'GET_STABILITY_POOL_MSG'),
  }));

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$,
  }));
});

test('it can parse the stability pool response', () => {
  expect(parseStabilityPoolResponse(
    stabilityPoolInfoResponse,
    1,
  )).toStrictEqual(stabilityPoolInfoParsed);
});

test('it can parse the stability pool response via the query router', () => {
  expect(parseStabilityPoolResponseFromQueryRouter(
    batchStabilityPoolResponseUnparsed,
  )).toStrictEqual(stabilityPoolInfoParsed);
});

test('it can call stability pool info service', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    stabilityPoolContractAddress: 'STABILITY_POOL_CONTRACT_ADDRESS',
    stabilityPoolCodeHash: 'STABILITY_POOL_CODE_HASH',
    minBlockHeightValidationOptions: 'BLOCK_HEIGHT_VALIDATION_OPTIONS' as unknown as MinBlockHeightValidationOptions,
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(batchStabilityPoolResponseUnparsed));
  let output;
  queryStabilityPoolInfo$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  const batchQueryInput = {
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.stabilityPoolContractAddress,
      contract: {
        address: input.stabilityPoolContractAddress,
        codeHash: input.stabilityPoolCodeHash,
      },
      queryMsg: 'GET_STABILITY_POOL_MSG',
    }], // array of length 1 for single query
    minBlockHeightValidationOptions: input.minBlockHeightValidationOptions,
  };
  expect(batchQuery$).toHaveBeenCalledWith(batchQueryInput);

  expect(output).toStrictEqual(stabilityPoolInfoParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchStabilityPoolResponseUnparsed));
  const response = await queryStabilityPoolInfo(input);
  expect(batchQuery$).toHaveBeenCalledWith(batchQueryInput);
  expect(response).toStrictEqual(stabilityPoolInfoParsed);
});
