import {
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { convertCoinFromUDenom } from '~/lib/utils';
import {
  msgQueryScrtDerivativeFees,
  msgQueryScrtDerivativeStakingInfo,
} from '~/contracts/definitions/derivativeScrt';
import {
  DerivativeScrtFeeInfoResponse,
  DerivativeScrtStakingInfoResponse,
} from '~/types/contracts/derivativeScrt/response';
import {
  DerivativeScrtFeeInfo,
  DerivativeScrtStakingInfo,
  DerivativeScrtInfo,
  BatchRouterKeys,
} from '~/types/contracts/derivativeScrt/model';
import {
  BatchQueryParsedResponse,
  BatchQueryParsedResponseItem,
} from '~/types/contracts/batchQuery/model';
import { batchQuery$ } from './batchQuery';

// Contract returns price as a rate of stkd-SCRT/SCRT with 6 decimals
const DERIVATE_PRICE_DECIMALS = 6;

/**
 * parses the response for the stkd-scrt contract info
 */
function parseDerivativeScrtStakingInfo(
  data: DerivativeScrtStakingInfoResponse,
): DerivativeScrtStakingInfo {
  const { staking_info: stakingInfo } = data;
  const {
    price: exchangeRate,
    rewards: communityRewards,
    total_derivative_token_supply: supply,
    unbond_amount_of_next_batch: nextUnboundAmount,
    next_unbonding_batch_time: nextUnbondingBatchEstimatedTime,
    validators: validatorsResp,
  } = stakingInfo;

  const validators = validatorsResp.map((nextValidator) => ({
    validatorAddress: nextValidator.validator,
    weight: nextValidator.weight,
  }));

  return {
    validators,
    supply,
    exchangeRate: convertCoinFromUDenom(exchangeRate, DERIVATE_PRICE_DECIMALS).toNumber(),
    communityRewards,
    nextUnboundAmount,
    // Seconds to Milliseconds
    nextUnbondingBatchEstimatedTime: nextUnbondingBatchEstimatedTime * 1000,
  };
}

/**
 * parse the response for fee info
 */
const parseDerivativeScrtFeeInfo = (
  response: DerivativeScrtFeeInfoResponse,
): DerivativeScrtFeeInfo => ({
  withdrawFee: Number(response.fee_info.withdraw) / 100000,
  depositFee: Number(response.fee_info.deposit) / 100000,
});

/**
 * parse the response from the batch query contract
 */
const parseDerivativeScrtInfo = (
  response: BatchQueryParsedResponse,
): DerivativeScrtInfo => {
  const stakingInfoResponse = response.find(
    (
      nextBatchItem: BatchQueryParsedResponseItem,
    ) => nextBatchItem.id === BatchRouterKeys.STAKING_INFO,
  );
  const feeInfoResponse = response.find(
    (nextBatchItem: BatchQueryParsedResponseItem) => nextBatchItem.id === BatchRouterKeys.FEE_INFO,
  );
  if (!stakingInfoResponse || !feeInfoResponse) {
    throw new Error(`Unable to parse batch query response: ${response}`);
  }
  return {
    ...parseDerivativeScrtStakingInfo(stakingInfoResponse.response),
    ...parseDerivativeScrtFeeInfo(feeInfoResponse.response),
  };
};

/**
 * query both the staking info and the fee info
 *
 * queryTimeSeconds is a paramater to query the contract
 * at a specific time in seconds from the UNIX Epoch
 * Optional and will default to current time
 */
const queryDerivativeScrtInfo$ = ({
  queryRouterContractAddress,
  queryRouterCodeHash,
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queryTimeSeconds,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  contractAddress: string,
  codeHash: string,
  lcdEndpoint?: string,
  chainId?: string,
  queryTimeSeconds?: number,
}) => batchQuery$({
  queries: [
    {
      id: BatchRouterKeys.STAKING_INFO,
      contract: {
        address: contractAddress,
        codeHash,
      },
      queryMsg: msgQueryScrtDerivativeStakingInfo(
        queryTimeSeconds ?? Math.round(new Date().getTime() / 1000),
      ),
    },
    {
      id: BatchRouterKeys.FEE_INFO,
      contract: {
        address: contractAddress,
        codeHash,
      },
      queryMsg: msgQueryScrtDerivativeFees(),

    },
  ],
  lcdEndpoint,
  contractAddress: queryRouterContractAddress,
  codeHash: queryRouterCodeHash,
  chainId,
}).pipe(
  map((response: any) => parseDerivativeScrtInfo(response as BatchQueryParsedResponse)),
  first(),
);

/**
 * query the fee info and the staking info
 *
 * queryTimeSeconds is a paramater to query the contract
 * at a specific time in seconds from the UNIX Epoch
 * Optional and will default to current time
 */
async function queryDerivativeScrtInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queryTimeSeconds,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  contractAddress: string,
  codeHash: string,
  lcdEndpoint?: string,
  chainId?: string,
  queryTimeSeconds?: number,
}) {
  return lastValueFrom(queryDerivativeScrtInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    queryTimeSeconds,
  }));
}

export {
  parseDerivativeScrtInfo,
  queryDerivativeScrtInfo$,
  queryDerivativeScrtInfo,
};
