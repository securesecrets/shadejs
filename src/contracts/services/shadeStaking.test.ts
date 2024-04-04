import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import stakingOpportunityResponse from '~/test/mocks/shadeStaking/stakingOpportunityResponse.json';
import { stakingOpportunityResponseParsed } from '~/test/mocks/shadeStaking/response';
import {
  parseStakingOpportunity,
  queryShadeStakingOpportunity,
  queryShadeStakingOpportunity$,
} from '~/contracts/services/shadeStaking';
import { StakingInfoServiceResponse } from '~/types/contracts/shadeStaking/index';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/shadeStaking', () => ({
    msgQueryShadeStakingOpportunity: vi.fn(() => 'STAKING_INFO_MSG'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

test('it can parse the shade staking info', () => {
  expect(parseStakingOpportunity(
    stakingOpportunityResponse as StakingInfoServiceResponse,
  )).toStrictEqual(stakingOpportunityResponseParsed);
});

test('it can call the query shade staking info service', async () => {
  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(stakingOpportunityResponse));

  const input = {
    shadeStakingContractAddress: 'CONTRACT_ADDRESS',
    shadeStakingCodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  let output;
  queryShadeStakingOpportunity$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'STAKING_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.shadeStakingContractAddress,
    codeHash: input.shadeStakingCodeHash,
  });

  expect(output).toStrictEqual(stakingOpportunityResponseParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(stakingOpportunityResponse));
  const output2 = await queryShadeStakingOpportunity(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'STAKING_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.shadeStakingContractAddress,
    codeHash: input.shadeStakingCodeHash,
  });

  expect(output2).toStrictEqual(stakingOpportunityResponseParsed);
});
