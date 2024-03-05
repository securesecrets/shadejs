import { snip20 } from '~/contracts/definitions/snip20';
import { generatePadding } from '~/lib/utils';
import { Permit } from '~/types/shared';

/**
 * Query the public contract staking info
 */
const msgQueryStakingInfo = () => ({ staking_info: {} });

/**
 * Query the users private holdings
 */
const msgQueryUserHoldings = (userAddress: string, viewingKey: string) => ({
  holdings: {
    address: userAddress,
    viewing_key: viewingKey,
  },
});

/**
 * Query the users private holdings with a permit
 */
const msgQueryUserHoldingsWithPermit = (permit: Permit) => ({
  with_permit: {
    permit,
    query: {
      holdings: {},
    },
  },
});

/**
 * Query the users private unbondings
 */
const msgQueryUserUnbondings = (userAddress: string, viewingKey: string) => ({
  unbondings: {
    address: userAddress,
    viewing_key: viewingKey,
  },
});

/**
 * Query the users private unbondings with a permit
 */
const msgQueryUserUnbondingsWithPermit = (permit: Permit) => ({
  with_permit: {
    permit,
    query: {
      unbondings: {},
    },
  },
});

/**
 * message to stake shd to receive derivative shade
 */
function msgDerivativeShdStake({
  derivativeShdContractAddress,
  derivativeShdCodeHash,
  sendAmount,
  // minExpectedReturnAmount,
}: {
  derivativeShdContractAddress: string,
  derivativeShdCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount?: string, // param doesn't exist in the contract yet
}) {
  return snip20.messages.send({
    recipient: derivativeShdContractAddress,
    recipientCodeHash: derivativeShdCodeHash,
    amount: sendAmount,
    handleMsg: { stake: {} }, // TBD for minExpectedReturn
    padding: generatePadding(),
  }).msg;
}

/**
 * message to unbond derivate shd to receive shade
 */
function msgDerivativeShdUnbond({
  derivativeShdContractAddress,
  derivativeShdCodeHash,
  sendAmount,
}: {
  derivativeShdContractAddress: string,
  derivativeShdCodeHash?: string,
  sendAmount: string,
}) {
  return snip20.messages.send({
    recipient: derivativeShdContractAddress,
    recipientCodeHash: derivativeShdCodeHash,
    amount: sendAmount,
    handleMsg: { unbond: {} },
    padding: generatePadding(),
  }).msg;
}

/**
 * message to transfer derivate shd to staked shade
 */
function msgDerivativeShdTransferStaked({
  derivativeShdContractAddress,
  derivativeShdCodeHash,
  sendAmount,
  receiver,
}: {
  derivativeShdContractAddress: string,
  derivativeShdCodeHash?: string,
  sendAmount: string,
  receiver: string,
}) {
  return snip20.messages.send({
    recipient: derivativeShdContractAddress,
    recipientCodeHash: derivativeShdCodeHash,
    amount: sendAmount,
    handleMsg: { transfer_staked: { receiver } },
    padding: generatePadding(),
  }).msg;
}

export {
  msgQueryStakingInfo,
  msgQueryUserHoldings,
  msgQueryUserUnbondings,
  msgQueryUserHoldingsWithPermit,
  msgQueryUserUnbondingsWithPermit,
  msgDerivativeShdStake,
  msgDerivativeShdUnbond,
  msgDerivativeShdTransferStaked,
};
