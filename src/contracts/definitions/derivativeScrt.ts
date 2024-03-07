import { generatePadding } from '~/lib/utils';

/**
 * Query the public contract staking info
 * ex: time = Math.round(new Date().getTime() / 1000)
 */
const msgQueryScrtDerivativeStakingInfo = (time: number) => ({ staking_info: { time } });

/**
 * Query the public contract fee information
 */
const msgQueryScrtDerivativeFees = () => ({ fee_info: {} });

/**
 * Query the users private unbondings
 */
const msgQueryScrtDerivativeUserUnbondings = (userAddress: string, viewingKey: string) => ({
  unbondings: {
    address: userAddress,
    key: viewingKey,
  },
});

/**
 * message to stake scrt to receive stkd-scrt
 */
function msgDerivativeScrtStake(stakeAmount: string) {
  return {
    msg: {
      stake: {
        padding: generatePadding(),
      },
    },
    transferAmount: {
      amount: stakeAmount,
      denom: 'uscrt',
    },
  };
}

/**
 * message to unbond stkd-scrt to eventually receive secret
 */
function msgDerivativeScrtUnbond(unbondAmount: string) {
  return {
    unbond: {
      redeem_amount: unbondAmount,
      padding: generatePadding(),
    },
  };
}

/**
 * message to claim unbonded stkd-scrt as secret
 */
function msgDerivativeScrtClaim() {
  return {
    claim: {
      padding: generatePadding(),
    },
  };
}

export {
  msgQueryScrtDerivativeStakingInfo,
  msgQueryScrtDerivativeFees,
  msgQueryScrtDerivativeUserUnbondings,
  msgDerivativeScrtStake,
  msgDerivativeScrtUnbond,
  msgDerivativeScrtClaim,
};
