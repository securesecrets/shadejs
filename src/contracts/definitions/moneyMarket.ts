import { AccountPermit } from '~/types/permit';
import { Pagination } from '~/types/contracts/moneyMarket/model';
import { generatePadding } from '~/index';
import { snip20 } from './snip20';

/**
 * Query the contract status info
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryMoneyMarketConfig = () => ({ config: {} });

/**
 * Query the collateral state and config info
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryMoneyMarketCollaterals = (
  pagination?: Pagination,
) => ({
  get_collateral: {
    pagination,
  },
});

/**
 * Query the markets' state and config info
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryMoneyMarketMarkets = (
  pagination?: Pagination,
) => ({
  get_markets: {
    pagination,
  },
});

/**
 * Query a user's collateral and debt positions
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const msgQueryMoneyMarketUserPosition = (
  address: string,
  permit: AccountPermit,
) => ({
  user_position: {
    address,
    authentication: {
      permit: {
        query_permit: permit,
      },
    },
  },
});

/**
 * message to borrow a debt token against deposited collateral
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function msgMoneyMarketBorrow({
  borrowAmount,
  debtTokenAddress,
}: {
  borrowAmount: string,
  debtTokenAddress: string,
}) {
  return {
    borrow: {
      token: debtTokenAddress,
      amount: borrowAmount,
    },
  };
}

/**
 * message to withdraw collateral against an existing user position
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function msgMoneyMarketWithdrawCollateral({
  withdrawAmount,
  collateralTokenAddress,
}: {
  withdrawAmount: string,
  collateralTokenAddress: string,
}) {
  return {
    withdraw_collateral: {
      token: collateralTokenAddress,
      amount: withdrawAmount,
    },
  };
}

/**
 * message to deposit collateral to borrow against
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function msgMoneyMarketDepositCollateral({
  moneyMarketContractAddress,
  moneyMarketCodeHash,
  depositAmount,
}: {
  moneyMarketContractAddress: string,
  moneyMarketCodeHash?: string,
  depositAmount: string,
}) {
  return snip20.messages.send({
    recipient: moneyMarketContractAddress,
    recipientCodeHash: moneyMarketCodeHash,
    amount: depositAmount,
    handleMsg: { deposit_collateral: {} },
    padding: generatePadding(),
  }).msg;
}

/**
 * message to supply tokens to be lent out
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function msgMoneyMarketSupply({
  moneyMarketContractAddress,
  moneyMarketCodeHash,
  supplyAmount,
}: {
  moneyMarketContractAddress: string,
  moneyMarketCodeHash?: string,
  supplyAmount: string,
}) {
  return snip20.messages.send({
    recipient: moneyMarketContractAddress,
    recipientCodeHash: moneyMarketCodeHash,
    amount: supplyAmount,
    handleMsg: { supply: {} },
    padding: generatePadding(),
  }).msg;
}

/**
 * message to withdraw supply by sending an ltoken amount
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function msgMoneyMarketWithdrawSupply({
  moneyMarketContractAddress,
  moneyMarketCodeHash,
  withdrawAmount,
}: {
  moneyMarketContractAddress: string,
  moneyMarketCodeHash?: string,
  withdrawAmount: string,
}) {
  return snip20.messages.send({
    recipient: moneyMarketContractAddress,
    recipientCodeHash: moneyMarketCodeHash,
    amount: withdrawAmount,
    handleMsg: { withdraw_supply: {} },
    padding: generatePadding(),
  }).msg;
}

/**
 * message to repay a loan that has been taken out
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function msgMoneyMarketRepay({
  moneyMarketContractAddress,
  moneyMarketCodeHash,
  repayAmount,
}: {
  moneyMarketContractAddress: string,
  moneyMarketCodeHash?: string,
  repayAmount: string,
}) {
  return snip20.messages.send({
    recipient: moneyMarketContractAddress,
    recipientCodeHash: moneyMarketCodeHash,
    amount: repayAmount,
    handleMsg: { repay: {} },
    padding: generatePadding(),
  }).msg;
}

export {
  msgQueryMoneyMarketConfig,
  msgQueryMoneyMarketCollaterals,
  msgQueryMoneyMarketMarkets,
  msgQueryMoneyMarketUserPosition,
  msgMoneyMarketBorrow,
  msgMoneyMarketWithdrawCollateral,
  msgMoneyMarketDepositCollateral,
  msgMoneyMarketSupply,
  msgMoneyMarketWithdrawSupply,
  msgMoneyMarketRepay,
};
