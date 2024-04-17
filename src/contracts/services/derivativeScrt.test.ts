import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import {
  parseDerivativeScrtInfo,
  queryDerivativeScrtInfo,
  queryDerivativeScrtInfo$,
} from '~/contracts/services/derivativeScrt';
import stakingInfoResponse from '~/test/mocks/derivativeScrt/stakingInfoResponse.json';
import stakingInfoResponseParsed from '~/test/mocks/derivativeScrt/stakingInfoResponseParsed.json';
import feeInfoResponse from '~/test/mocks/derivativeScrt/feeInfoResponse.json';
import feeInfoResponseParsed from '~/test/mocks/derivativeScrt/feeInfoResponseParsed.json';
import { BatchQueryParsedResponse } from '~/types/contracts/batchQuery/model';
import { BatchRouterKeys } from '~/types/contracts/derivativeScrt/model';

const batchQueryResponse = [
  {
    id: BatchRouterKeys.STAKING_INFO,
    response: stakingInfoResponse,
    blockHeight: 1,
  },
  {
    id: BatchRouterKeys.FEE_INFO,
    response: feeInfoResponse,
    blockHeight: 1,
  },
];

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/derivativeScrt', () => ({
    msgQueryScrtDerivativeStakingInfo: vi.fn(() => 'STAKING_INFO_MSG'),
    msgQueryScrtDerivativeFees: vi.fn(() => 'FEE_INFO_MSG'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$: vi.fn(() => of(batchQueryResponse)),
  }));
});

test('it can parse the batch query resonse', () => {
  expect(parseDerivativeScrtInfo(
    batchQueryResponse as BatchQueryParsedResponse,
  )).toStrictEqual({
    ...feeInfoResponseParsed,
    ...stakingInfoResponseParsed,
    blockHeight: 1,
  });
});

test('it can call the query all info service', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CODE_HASH',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    contractAddress: 'DERIVATIVE_CONTRACT_ADDRESS',
    codeHash: 'DERIVATIVE_CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  let output;
  queryDerivativeScrtInfo$(input).subscribe({
    next: (response: any) => {
      output = response;
    },
  });

  expect(output).toStrictEqual({
    ...feeInfoResponseParsed,
    ...stakingInfoResponseParsed,
    blockHeight: 1,
  });

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(feeInfoResponse));
  const output2 = await queryDerivativeScrtInfo(input);

  expect(output2).toStrictEqual({
    ...feeInfoResponseParsed,
    ...stakingInfoResponseParsed,
    blockHeight: 1,
  });
});
