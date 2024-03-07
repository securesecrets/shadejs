import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import { StakingDerivativesFeesResponse, StakingDerivativesInfoResponse } from '~/types/contracts/derivativeScrt/response';
import {
  parseDerivativeScrtFeeInfo,
  parseDerivativeScrtStakingInfo,
  queryDerivativeScrtFeeInfo,
  queryDerivativeScrtFeeInfo$,
  queryDerivativeScrtStakingInfo,
  queryDerivativeScrtStakingInfo$,
} from '~/contracts/services/derivativeScrt';
import stakingInfoResponse from '~/test/mocks/derivativeScrt/stakingInfoResponse.json';
import stakingInfoResponseParsed from '~/test/mocks/derivativeScrt/stakingInfoResponseParsed.json';
import feeInfoResponse from '~/test/mocks/derivativeScrt/feeInfoResponse.json';
import feeInfoResponseParsed from '~/test/mocks/derivativeScrt/feeInfoResponseParsed.json';

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
});

test('it can parse the staking info', () => {
  expect(parseDerivativeScrtStakingInfo(
    stakingInfoResponse as StakingDerivativesInfoResponse,
  )).toStrictEqual(stakingInfoResponseParsed);
});

test('it can call the query staking info service', async () => {
  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(stakingInfoResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  let output;
  queryDerivativeScrtStakingInfo$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'STAKING_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(stakingInfoResponseParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(stakingInfoResponse));
  const output2 = await queryDerivativeScrtStakingInfo(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'STAKING_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output2).toStrictEqual(stakingInfoResponseParsed);
});

test('it can parse the fee info', () => {
  expect(parseDerivativeScrtFeeInfo(
    feeInfoResponse as StakingDerivativesFeesResponse,
  )).toStrictEqual(feeInfoResponseParsed);
});

test('it can call the query fees info service', async () => {
  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(feeInfoResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  let output;
  queryDerivativeScrtFeeInfo$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'FEE_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(feeInfoResponseParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(feeInfoResponse));
  const output2 = await queryDerivativeScrtFeeInfo(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'FEE_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output2).toStrictEqual(feeInfoResponseParsed);
});
