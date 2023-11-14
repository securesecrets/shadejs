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
import { Paths } from '~/types/contracts/swap/model';
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
  const mockPath: Paths = [
    {
      poolContractAddress: 'POOL_1',
      poolCodeHash: 'POOL_HASH_1',
    },
    {
      poolContractAddress: 'POOL_2',
      poolCodeHash: 'POOL_HASH_2',
    },
    {
      poolContractAddress: 'POOL_3',
      poolCodeHash: 'POOL_HASH_3',
    },
  ];
  const swapInput = {
    sourceAddress: 'SOURCE_ADDRESS',
    snip20ContractAddress: 'SNIP_20_CONTRACT_ADDRESS',
    snip20CodeHash: 'SNIP_20_CODE_HASH',
    routerContractAddress: 'SNIP_20_CONTRACT_HASH',
    routerCodeHash: 'ROUTER_CODE_HASH',
    sendAmount: 'SEND_AMOUNT',
    minExpectedReturnAmount: 'MIN_EXPECTED_RETURN_AMOUNT',
    path: mockPath,
  };
  msgSwap(swapInput);

  expect(snip20.messages.send).toHaveBeenCalledWith({
    recipient: swapInput.routerContractAddress,
    recipientCodeHash: swapInput.routerCodeHash,
    amount: swapInput.sendAmount,
    handleMsg: {
      swap_tokens_for_exact: {
        expected_return: swapInput.minExpectedReturnAmount,
        path: [
          {
            addr: mockPath[0].poolContractAddress,
            code_hash: mockPath[0].poolCodeHash,
          },
          {
            addr: mockPath[1].poolContractAddress,
            code_hash: mockPath[1].poolCodeHash,
          },
          {
            addr: mockPath[2].poolContractAddress,
            code_hash: mockPath[2].poolCodeHash,
          },
        ],
      },
    },
    padding: 'RANDOM_PADDING',
  });
});
