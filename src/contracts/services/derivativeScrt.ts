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
  DerivativeScrtFeeInfoResponse,
  DerivativeScrtStakingInfoResponse,
} from '~/types/contracts/derivativeScrt/response';
import {
  DerivativeScrtFeeInfo,
  DerivativeScrtStakingInfo,
  DerivativeScrtInfo,
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
    supply: convertCoinFromUDenom(supply, DERIVATE_PRICE_DECIMALS).toString(),
    exchangeRate: convertCoinFromUDenom(exchangeRate, DERIVATE_PRICE_DECIMALS).toNumber(),
    communityRewards: convertCoinFromUDenom(communityRewards, DERIVATE_PRICE_DECIMALS).toString(),
    nextUnboundAmount: convertCoinFromUDenom(nextUnboundAmount, DERIVATE_PRICE_DECIMALS).toString(),
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
  switchMap(({ client }: {client:any}) => sendSecretClientContractQuery$({
    queryMsg: msgQueryScrtDerivativeStakingInfo(Math.round(new Date().getTime() / 1000)),
    client,
    contractAddress,
    codeHash,
  })),
  map((response: any) => parseDerivativeScrtStakingInfo(
    response as DerivativeScrtStakingInfoResponse,
  )),
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
const parseDerivativeScrtAllInfo = (
  response: BatchQueryParsedResponse,
): DerivativeScrtInfo => {
  const stakingInfoResponse = response.find(
    (nextBatchItem: BatchQueryParsedResponseItem) => nextBatchItem.id === 'staking_info',
  );
  const feeInfoResponse = response.find(
    (nextBatchItem: BatchQueryParsedResponseItem) => nextBatchItem.id === 'fee_info',
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
  switchMap(({ client }: { client: any }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryScrtDerivativeFees(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response: any) => parseDerivativeScrtFeeInfo(response as DerivativeScrtFeeInfoResponse)),
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

/**
 * query both the staking info and the fee info
 */
const queryDerivativeScrtAllInfo$ = ({
  queryRouterContractAddress,
  queryRouterCodeHash,
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  contractAddress: string,
  codeHash: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => batchQuery$({
  queries: [
    {
      id: 'staking_info',
      contract: {
        address: contractAddress,
        codeHash,
      },
      queryMsg: msgQueryScrtDerivativeStakingInfo(Math.round(new Date().getTime() / 1000)),
    },
    {
      id: 'fee_info',
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
  map((response: any) => parseDerivativeScrtAllInfo(response as BatchQueryParsedResponse)),
  first(),
);

/**
 * query the fee info and the staking info
*/
async function queryDerivativeScrtAllInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  contractAddress: string,
  codeHash: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryDerivativeScrtAllInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
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
  parseDerivativeScrtAllInfo,
  queryDerivativeScrtAllInfo$,
  queryDerivativeScrtAllInfo,
};
