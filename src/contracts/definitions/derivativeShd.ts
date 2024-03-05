import { snip20 } from '~/contracts/definitions/snip20';
import { generatePadding } from '~/lib/utils';
import { AccountPermit } from '~/types/permit';

/**
 * Query the public contract staking info
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryStakingInfo = () => ({ staking_info: {} });

/**
 * Query the users private holdings
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryUserHoldingsWithViewingKey = (userAddress: string, viewingKey: string) => ({
  holdings: {
    address: userAddress,
    viewing_key: viewingKey,
  },
});

/**
 * Query the users private holdings with a permit
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryUserHoldingsWithPermit = (permit: AccountPermit) => ({
  with_permit: {
    permit,
    query: {
      holdings: {},
    },
  },
});

/**
 * Query the users private unbondings
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryUserUnbondingsWithViewingKey = (userAddress: string, viewingKey: string) => ({
  unbondings: {
    address: userAddress,
    viewing_key: viewingKey,
  },
});

/**
 * Query the users private unbondings with a permit
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryUserUnbondingsWithPermit = (permit: AccountPermit) => ({
  with_permit: {
    permit,
    query: {
      unbondings: {},
    },
  },
});

/**
 * message to stake shd to receive derivative shade
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
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
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
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
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
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
  msgQueryUserHoldingsWithViewingKey,
  msgQueryUserUnbondingsWithViewingKey,
  msgQueryUserHoldingsWithPermit,
  msgQueryUserUnbondingsWithPermit,
  msgDerivativeShdStake,
  msgDerivativeShdUnbond,
  msgDerivativeShdTransferStaked,
};
