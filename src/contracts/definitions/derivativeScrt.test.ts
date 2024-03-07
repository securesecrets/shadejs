import {
  test,
  expect,
  vi,
} from 'vitest';
import {
  msgQueryScrtDerivativeStakingInfo,
  msgQueryScrtDerivativeFees,
  msgQueryScrtDerivativeUserUnbondings,
  msgDerivativeScrtStake,
  msgDerivativeScrtUnbond,
  msgDerivativeScrtClaim,
} from '~/contracts/definitions/derivativeScrt';

vi.mock('~/lib/utils', () => ({
  generatePadding: vi.fn(() => 'RANDOM_PADDING'),
}));

test('it tests the form of the query staking info msg', () => {
  const time = Math.round(new Date().getTime() / 1000);
  const output = {
    staking_info: {
      time,
    },
  };
  expect(msgQueryScrtDerivativeStakingInfo(time)).toStrictEqual(output);
});

test('it tests the form of the query fee info msg', () => {
  const output = {
    fee_info: {
    },
  };
  expect(msgQueryScrtDerivativeFees()).toStrictEqual(output);
});

test('it tests the form of the query user unbondings msg', () => {
  const output = {
    unbondings: {
      address: 'USER_ADDR',
      key: 'VIEWING_KEY',
    },
  };
  expect(msgQueryScrtDerivativeUserUnbondings('USER_ADDR', 'VIEWING_KEY')).toStrictEqual(output);
});

test('it tests the form of the stake execute msg', () => {
  const output = {
    msg: {
      stake: {
        padding: 'RANDOM_PADDING',
      },
    },
    transferAmount: {
      amount: '123456789',
      denom: 'uscrt',
    },
  };
  expect(msgDerivativeScrtStake(output.transferAmount.amount)).toStrictEqual(output);
});

test('it tests the form of the unbond execute msg', () => {
  const output = {
    unbond: {
      redeem_amount: '12341234',
      padding: 'RANDOM_PADDING',
    },
  };
  expect(msgDerivativeScrtUnbond(output.unbond.redeem_amount)).toStrictEqual(output);
});

test('it tests the form of the transfer staked msg', () => {
  const output = {
    claim: {
      padding: 'RANDOM_PADDING',
    },
  };
  expect(msgDerivativeScrtClaim()).toStrictEqual(output);
});
