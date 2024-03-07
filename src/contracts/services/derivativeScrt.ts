import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { convertCoinFromUDenom } from '~/lib/utils';
import {
  msgQueryScrtDerivativeFees,
  msgQueryScrtDerivativeStakingInfo,
} from '~/contracts/definitions/derivativeScrt';
import {
  StakingDerivativesFeesResponse,
  StakingDerivativesInfoResponse,
} from '~/types/contracts/derivativeScrt/response';
import {
  StakingDerivativesFee,
  StakingDerivativesInfo,
} from '~/types/contracts/derivativeScrt/model';

// Contract returns price as a rate of stkd-SCRT/SCRT with 6 decimals
const DERIVATE_PRICE_DECIMALS = 6;

/**
 * parses the response for the stkd-scrt contract info
 */
function parseDerivativeScrtStakingInfo(
  data: StakingDerivativesInfoResponse,
): StakingDerivativesInfo {
  const { staking_info: stakingInfo } = data;
  const {
    price: exchangeRate,
    rewards: communityRewards,
    total_derivative_token_supply: supply,
    unbond_amount_of_next_batch: nextUnboundAmount,
    next_unbonding_batch_time: nextUnbondingBatchEstimatedTime,
    validators,
  } = stakingInfo;

  return {
    validators,
    supply: convertCoinFromUDenom(supply, DERIVATE_PRICE_DECIMALS).toNumber(),
    exchangeRate: convertCoinFromUDenom(exchangeRate, DERIVATE_PRICE_DECIMALS).toNumber(),
    communityRewards: convertCoinFromUDenom(communityRewards, DERIVATE_PRICE_DECIMALS).toNumber(),
    nextUnboundAmount: convertCoinFromUDenom(nextUnboundAmount, DERIVATE_PRICE_DECIMALS).toNumber(),
    // Seconds to Miliseconds
    nextUnbondingBatchEstimatedTime: nextUnbondingBatchEstimatedTime * 1000,
  };
}

/**
 * query the staking info
 */
const queryDerivativeScrtStakingInfo$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryScrtDerivativeStakingInfo(Math.round(new Date().getTime() / 1000)),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseDerivativeScrtStakingInfo(response as StakingDerivativesInfoResponse)),
  first(),
);

/**
 * query the staking info
 */
async function queryDerivativeScrtStakingInfo({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryDerivativeScrtStakingInfo$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

/**
 *
 */
const parseDerivativeScrtFeeInfo = (
  response: StakingDerivativesFeesResponse,
): StakingDerivativesFee => ({
  withdrawFee: Number(response.fee_info.withdraw) / 100000,
  depositFee: Number(response.fee_info.deposit) / 100000,
});

/**
 * query the fee info
 */
const queryDerivativeScrtFeeInfo$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryScrtDerivativeFees(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseDerivativeScrtFeeInfo(response as StakingDerivativesFeesResponse)),
  first(),
);

/**
 * query the fee info
 */
async function queryDerivativeScrtFeeInfo({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryDerivativeScrtFeeInfo$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

export {
  parseDerivativeScrtStakingInfo,
  queryDerivativeScrtStakingInfo$,
  queryDerivativeScrtStakingInfo,
  parseDerivativeScrtFeeInfo,
  queryDerivativeScrtFeeInfo$,
  queryDerivativeScrtFeeInfo,
};
