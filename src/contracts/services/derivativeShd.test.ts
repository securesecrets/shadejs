import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import stakingInfoResponse from '~/test/mocks/derivativeShd/stakingInfoResponse.json';
import { stakingInfoResponseParsed } from '~/test/mocks/derivativeShd/stakingInfoResponseParsed';
import { StakingInfoResponse } from '~/types/contracts/derivativeShd/response';
import { parseDerivativeShdStakingInfo, queryDerivativeShdStakingInfo, queryDerivativeShdStakingInfo$ } from '~/contracts/services/derivativeShd';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/derivativeShd', () => ({
    msgQueryShdDerivativeStakingInfo: vi.fn(() => 'STAKING_INFO_MSG'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

test('it can parse the staking info', () => {
  expect(parseDerivativeShdStakingInfo(
    stakingInfoResponse as StakingInfoResponse,
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
  queryDerivativeShdStakingInfo$(input).subscribe({
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
  const output2 = await queryDerivativeShdStakingInfo(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'STAKING_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output2).toStrictEqual(stakingInfoResponseParsed);
});
