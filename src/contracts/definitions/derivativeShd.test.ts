import {
  test,
  expect,
  vi,
} from 'vitest';
import {
  msgQueryStakingInfo,
  msgQueryFeeInfo,
  msgQueryContractStatus,
  msgQueryUserHoldings,
  msgQueryUserUnbondings,
  msgDerivativeShdStake,
  msgDerivativeShdUnbond,
  msgDerivativeShdTransferStaked,
} from '~/contracts/definitions/derivativeShd';
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

test('it tests the form of the query staking info msg', () => {
  const output = { staking_info: {} };
  expect(msgQueryStakingInfo()).toStrictEqual(output);
});

test('it tests the form of the query fee info msg', () => {
  const output = { fee_info: {} };
  expect(msgQueryFeeInfo()).toStrictEqual(output);
});

test('it tests the form of the query contract status msg', () => {
  const output = { contract_status: {} };
  expect(msgQueryContractStatus()).toStrictEqual(output);
});

test('it tests the form of the query user holdings msg', () => {
  const output = {
    holdings: {
      address: 'USER_ADDR',
      viewing_key: 'VIEWING_KEY',
    },
  };
  expect(msgQueryUserHoldings('USER_ADDR', 'VIEWING_KEY')).toStrictEqual(output);
});

test('it tests the form of the query user unbondings msg', () => {
  const output = {
    unbondings: {
      address: 'USER_ADDR',
      viewing_key: 'VIEWING_KEY',
    },
  };
  expect(msgQueryUserUnbondings('USER_ADDR', 'VIEWING_KEY')).toStrictEqual(output);
});

test('it tests the form of the stake execute msg', () => {
  const stakeInput = {
    derivativeShdContractAddress: 'SHD_DERIVATIVE_CONTRACT_ADDRESS',
    derivativeShdCodeHash: 'SHD_DERIVATIVE_CODE_HASH',
    sendAmount: 'SEND_AMOUNT',
    minExpectedReturnAmount: 'MINIMUM_RETURN',
  };
  msgDerivativeShdStake(stakeInput);
  expect(snip20.messages.send).toHaveBeenCalledWith({
    recipient: stakeInput.derivativeShdContractAddress,
    recipientCodeHash: stakeInput.derivativeShdCodeHash,
    amount: stakeInput.sendAmount,
    handleMsg: {
      stake: {},
    },
    padding: 'RANDOM_PADDING',
  });
});

test('it tests the form of the unbond execute msg', () => {
  const stakeInput = {
    derivativeShdContractAddress: 'SHD_DERIVATIVE_CONTRACT_ADDRESS',
    derivativeShdCodeHash: 'SHD_DERIVATIVE_CODE_HASH',
    sendAmount: 'SEND_AMOUNT',
  };
  msgDerivativeShdUnbond(stakeInput);
  expect(snip20.messages.send).toHaveBeenCalledWith({
    recipient: stakeInput.derivativeShdContractAddress,
    recipientCodeHash: stakeInput.derivativeShdCodeHash,
    amount: stakeInput.sendAmount,
    handleMsg: {
      unbond: {},
    },
    padding: 'RANDOM_PADDING',
  });
});

test('it tests the form of the unbond execute msg', () => {
  const stakeInput = {
    derivativeShdContractAddress: 'SHD_DERIVATIVE_CONTRACT_ADDRESS',
    derivativeShdCodeHash: 'SHD_DERIVATIVE_CODE_HASH',
    sendAmount: 'SEND_AMOUNT',
    receiver: 'RECEIVER_ADDRESS',
  };
  msgDerivativeShdTransferStaked(stakeInput);
  expect(snip20.messages.send).toHaveBeenCalledWith({
    recipient: stakeInput.derivativeShdContractAddress,
    recipientCodeHash: stakeInput.derivativeShdCodeHash,
    amount: stakeInput.sendAmount,
    handleMsg: {
      unbond: {},
    },
    padding: 'RANDOM_PADDING',
  });
});
