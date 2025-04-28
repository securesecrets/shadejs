import {
  test,
  expect,
  vi,
} from 'vitest';
import {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
  msgQueryStakingConfig,
  msgSwap,
} from '~/contracts/definitions/swap';
import { SwapType } from '~/lib/swap/gasEstimation/oracle-costs';
import { Route } from '~/types';
import BigNumber from 'bignumber.js';
import { snip20 } from './snip20';

vi.mock('~/contracts/definitions/snip20', () => ({
  snip20: {
    messages: {
      send: vi.fn(() => 'SEND_MSG'),
    },
  },
}));

vi.mock('~/lib/utils', () => ({
  generatePadding: vi.fn(() => 'RANDOM_PADDING'),
}));

test('it tests the form of the query factory config msg', () => {
  const output = { get_config: {} };
  expect(msgQueryFactoryConfig()).toStrictEqual(output);
});

test('it tests the form of the query factory pairs msg', () => {
  const output = {
    list_a_m_m_pairs: {
      pagination: {
        start: 0,
        limit: 25,
      },
    },
  };
  expect(msgQueryFactoryPairs(0, 25)).toStrictEqual(output);
});

test('it tests the form of the query pair config msg', () => {
  const output = { get_config: {} };
  expect(msgQueryPairConfig()).toStrictEqual(output);
});

test('it tests the form of the query pair info msg', () => {
  const output = { get_pair_info: {} };
  expect(msgQueryPairInfo()).toStrictEqual(output);
});

test('it tests the form of the query staking config msg', () => {
  const output = { get_config: {} };
  expect(msgQueryStakingConfig()).toStrictEqual(output);
});

test('it checks the form of the swap message', () => {
  const mockaddress0 = 'MOCK_ADDRESS_0';
  const mockhash0 = 'MOCK_HASH_0';
  const mockaddress1 = 'MOCK_ADDRESS_1';
  const mockhash1 = 'MOCK_HASH_1';
  const mockaddress2 = 'MOCK_ADDRESS_2';
  const mockhash2 = 'MOCK_HASH_2';
  const mockaddress3 = 'MOCK_ADDRESS_3';
  const mockhash3 = 'MOCK_HASH_3';
  const mockRoute: Route = {
    inputAmount: BigNumber(0.1),
    inputTokenContractAddress: '',
    iterationsCount: 0,
    outputTokenContractAddress: '',
    priceImpact: BigNumber(0.1),
    quoteLPFee: BigNumber(0.1),
    quoteOutputAmount: BigNumber(0.1),
    quoteShadeDaoFee: BigNumber(0.1),
    path: [
      {
        poolContractAddress: 'POOL_1',
        poolCodeHash: 'POOL_HASH_1',
        pair: [
          {
            address: mockaddress0,
            codeHash: mockhash0,
          },
          {
            address: mockaddress1,
            codeHash: mockhash1,
          },
        ],
        poolType: SwapType.CONSTANT_PRODUCT,
      },
      {
        poolContractAddress: 'POOL_2',
        poolCodeHash: 'POOL_HASH_2',
        pair: [
          {
            address: mockaddress2,
            codeHash: mockhash2,
          },
          {
            address: mockaddress1,
            codeHash: mockhash1,
          },
        ],
        poolType: SwapType.CONSTANT_PRODUCT,
      },
      {
        poolContractAddress: 'POOL_3',
        poolCodeHash: 'POOL_HASH_3',
        pair: [
          {
            address: mockaddress2,
            codeHash: mockhash2,
          },
          {
            address: mockaddress3,
            codeHash: mockhash3,
          },
        ],
        poolType: SwapType.CONSTANT_PRODUCT,
      },
    ],
  };
  const swapInput = {
    sourceAddress: 'SOURCE_ADDRESS',
    snip20ContractAddress: 'SNIP_20_CONTRACT_ADDRESS',
    snip20CodeHash: 'SNIP_20_CODE_HASH',
    routerContractAddress: 'SNIP_20_CONTRACT_HASH',
    routerCodeHash: 'ROUTER_CODE_HASH',
    sendAmount: 'SEND_AMOUNT',
    minExpectedReturnAmount: 'MIN_EXPECTED_RETURN_AMOUNT',
    route: mockRoute,
  };
  msgSwap(swapInput);

  expect(snip20.messages.send).toHaveBeenCalledWith({
    recipient: swapInput.routerContractAddress,
    recipientCodeHash: swapInput.routerCodeHash,
    amount: swapInput.sendAmount,
    handleMsg: {
      swap_tokens_for_exact: {
        expected_return: {
          amount: swapInput.minExpectedReturnAmount,
          token: {
            address: mockaddress3,
            code_hash: mockhash3,
          },
        },
        path: [
          {
            address: mockRoute.path[0].poolContractAddress,
            code_hash: mockRoute.path[0].poolCodeHash,
            token0: {
              address: mockaddress0,
              code_hash: mockhash0,
            },
            token1: {
              address: mockaddress1,
              code_hash: mockhash1,
            },
          },
          {
            address: mockRoute.path[1].poolContractAddress,
            code_hash: mockRoute.path[1].poolCodeHash,
            token0: {
              address: mockaddress2,
              code_hash: mockhash2,
            },
            token1: {
              address: mockaddress1,
              code_hash: mockhash1,
            },
          },
          {
            address: mockRoute.path[2].poolContractAddress,
            code_hash: mockRoute.path[2].poolCodeHash,
            token0: {
              address: mockaddress2,
              code_hash: mockhash2,
            },
            token1: {
              address: mockaddress3,
              code_hash: mockhash3,
            },
          },
        ],
      },
    },
    padding: 'RANDOM_PADDING',
  });
});
