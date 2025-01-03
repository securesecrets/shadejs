import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import chainQueryParsedResponse from '~/test/mocks/secretChainQueries/chainQueryParsedResponse.json';
import { queryDerivativeScrtInfo$ } from '~/contracts/services/derivativeScrt';
import stakingInfoResponseMainnet from '~/test/mocks/derivativeScrt/stakingInfoResponseMainnet.json';
import { mockValidatorsCommissions } from '~/test/mocks/secretChainQueries/validatorsCommissionsParsedResponse';
import {
  secretChainQueries$,
  SecretQueryOptions,
} from './secretQueries';
import {
  calculateDerivativeScrtApy,
  calculateDerivativeScrtApy$,
} from './derivativeScrt';

beforeAll(() => {
  vi.mock('~/lib/apy/secretQueries', async (importOriginal: any) => ({
    ...(await importOriginal()),
    secretChainQueries$: vi.fn(() => of(chainQueryParsedResponse)),
    queryScrtTotalSupply$: vi.fn(() => of(292470737038201)),
    queryValidatorsCommission$: vi.fn(() => of(mockValidatorsCommissions)),
  }));

  vi.mock('~/contracts/services/derivativeScrt', () => ({
    queryDerivativeScrtInfo$: vi.fn(() => of(stakingInfoResponseMainnet)),
  }));
});

test('it can calculate the correct derivative apy', async () => {
  const input = {
    queryRouterContractAddress: 'MOCK_QUERY_ADDRESS',
    queryRouterCodeHash: 'MOCK_QUERY_ROUTER_CODE_HASH',
    contractAddress: 'MOCK_STKD_ADDRESS',
    codeHash: 'MOCK_STKD_HASH',
    lcdEndpoint: 'MOCK_ENDPOINT',
    chainId: 'MOCK_CHAIN_ID',
  };

  let output;
  calculateDerivativeScrtApy$(input).subscribe({
    next: (response: number) => {
      output = response;
    },
  });

  expect(secretChainQueries$).toHaveBeenCalledWith(
    input.lcdEndpoint,
    Object.values(SecretQueryOptions),
  );

  expect(queryDerivativeScrtInfo$).toHaveBeenCalledWith({
    queryRouterContractAddress: input.queryRouterContractAddress,
    queryRouterCodeHash: input.queryRouterCodeHash,
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
  });

  expect(output).toStrictEqual(0.1641591628625081);

  const output2 = await calculateDerivativeScrtApy(input);

  expect(output2).toStrictEqual(0.1641591628625081);
});
