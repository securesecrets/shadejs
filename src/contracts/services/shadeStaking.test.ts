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
  batchQueryShadeStakingOpportunity,
  batchQueryShadeStakingOpportunity$,
  parseStakingOpportunity,
  queryShadeStakingOpportunity,
  queryShadeStakingOpportunity$,
} from '~/contracts/services/shadeStaking';
import { StakingInfoServiceResponse } from '~/types/contracts/shadeStaking/index';
import { batchStakingInfoUnparsed } from '~/test/mocks/shadeStaking/batchStakingInfoUnparsed';
import { batchStakingInfoParsed } from '~/test/mocks/shadeStaking/batchStakingInfoParsed';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());
const batchQuery$ = vi.hoisted(() => vi.fn());

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

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$,
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

test('it can call the batch shade staking info query service', async () => {
  const input = {
    queryRouterContractAddress: 'CONTRACT_ADDRESS',
    queryRouterCodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    stakingContracts: [{
      address: 'STAKING_ADDRESS',
      codeHash: 'STAKING_CODE_HASH',
    }],
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(batchStakingInfoUnparsed));
  let output;
  batchQueryShadeStakingOpportunity$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.stakingContracts[0].address,
      contract: {
        address: input.stakingContracts[0].address,
        codeHash: input.stakingContracts[0].codeHash,
      },
      queryMsg: 'STAKING_INFO_MSG',
    }],
  });

  expect(output).toStrictEqual(batchStakingInfoParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchStakingInfoUnparsed));
  const response = await batchQueryShadeStakingOpportunity(input);
  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.stakingContracts[0].address,
      contract: {
        address: input.stakingContracts[0].address,
        codeHash: input.stakingContracts[0].codeHash,
      },
      queryMsg: 'STAKING_INFO_MSG',
    }],
  });
  expect(response).toStrictEqual(batchStakingInfoParsed);
});
