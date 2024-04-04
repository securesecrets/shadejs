import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import { stakingOpportunityResponseParsed } from '~/test/mocks/shadeStaking/response';
import { queryShadeStakingOpportunity$ } from '~/contracts/services/shadeStaking';
import {
  calculateDerivativeShdApy$,
  calculateDerivativeShdApy,
} from './derivativeShd';

beforeAll(() => {
  vi.setSystemTime(new Date('2024-03-26T18:00:00.000Z'));
  vi.mock('~/contracts/services/shadeStaking', () => ({
    queryShadeStakingOpportunity$: vi.fn(() => of(stakingOpportunityResponseParsed)),
  }));
});

test('it can calculate the correct derivative apy', async () => {
  const input = {
    shadeTokenContractAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
    shadeStakingContractAddress: 'MOCK_STAKING_ADDRESS',
    shadeStakingCodeHash: 'MOCK_STAKING_HASH',
    price: '7.15',
    lcdEndpoint: 'MOCK_ENDPOINT',
    chainId: 'MOCK_CHAIN_ID',
  };

  let output;
  calculateDerivativeShdApy$(input).subscribe({
    next: (response: any) => {
      output = response;
    },
  });

  expect(queryShadeStakingOpportunity$).toHaveBeenCalledWith({
    shadeStakingContractAddress: input.shadeStakingContractAddress,
    shadeStakingCodeHash: input.shadeStakingCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
  });

  expect(output).toStrictEqual(0.051269877232584804);

  const output2 = await calculateDerivativeShdApy(input);

  expect(output2).toStrictEqual(0.051269877232584804);
});
