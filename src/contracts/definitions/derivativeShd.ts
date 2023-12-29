import { snip20 } from '~/contracts/definitions/snip20';
import { generatePadding } from '~/lib/utils';

/**
 * Query the public contract staking info
 */
const msgQueryStakingInfo = () => ({ staking_info: {} });

/**
 * Query the fee info
 */
const msgQueryFeeInfo = () => ({ fee_info: {} });

/**
 * Query the contract status
 */
const msgQueryContractStatus = () => ({ contract_status: {} });

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
 * Query the users private unbondings
 */
const msgQueryUserUnbondings = (userAddress: string, viewingKey: string) => ({
  unbondings: {
    address: userAddress,
    viewing_key: viewingKey,
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
  minExpectedReturnAmount: string, // param doesn't exist in the contract yet
}) {
  return snip20.messages.send({
    recipient: derivativeShdContractAddress,
    recipientCodeHash: derivativeShdCodeHash,
    amount: sendAmount,
    handleMsg: {}, // TBD for minExpectedReturn
    padding: generatePadding(),
  }).msg;
}

export {
  msgQueryStakingInfo,
  msgQueryFeeInfo,
  msgQueryContractStatus,
  msgQueryUserHoldings,
  msgQueryUserUnbondings,
  msgDerivativeShdStake,
};
