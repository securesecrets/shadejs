import { getActiveQueryClient$ } from '~/client';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { convertCoinFromUDenom } from '~/lib/utils';
import { msgQueryShadeStakingOpportunity } from '~/contracts/definitions/shadeStaking';
import {
  StakingInfoServiceResponse,
  StakingRewardPoolServiceModel,
  StakingInfoServiceModel,
  BatchShadeStakingOpportunity,
} from '~/types/contracts/shadeStaking/index';
import {
  BatchQueryParams,
  BatchQueryParsedResponse,
  Contract,
  MinBlockHeightValidationOptions,
} from '~/types';
import { batchQuery$ } from './batchQuery';

// data returned from the contract in normalized form with
// 18 decimals, in addition to any decimals on the individual token
const NORMALIZATION_FACTOR = 18;

/**
 * parses the response from the shade staking contract into a model
 */
function parseStakingOpportunity(data: StakingInfoServiceResponse): StakingInfoServiceModel {
  const stakeTokenAddress = data.staking_info.info.stake_token;
  const totalStakedRaw = data.staking_info.info.total_staked;
  const unbondingPeriod = Number(data.staking_info.info.unbond_period);
  const rewardPools: StakingRewardPoolServiceModel[] = data.staking_info.info.reward_pools
    .map((reward) => ({
      id: reward.id,
      amountRaw: reward.amount,
      startDate: new Date(Number(reward.start) * 1000),
      endDate: new Date(Number(reward.end) * 1000),
      tokenAddress: reward.token.address,
      rateRaw: convertCoinFromUDenom(reward.rate, NORMALIZATION_FACTOR).toString(),
    }));
  return {
    stakeTokenAddress,
    totalStakedRaw,
    unbondingPeriod,
    rewardPools,
  };
}

/**
 * parses the staking info reponse from a batch query of
 * multiple staking contracts
 */
const parseBatchQueryShadeStakingOpportunityResponse = (
  response: BatchQueryParsedResponse,
): BatchShadeStakingOpportunity => response.map((item) => ({
  stakingContractAddress: item.id as string,
  stakingInfo: parseStakingOpportunity(item.response),
  blockHeight: item.blockHeight,
}));

/**
 * query the staking info from the shade staking contract
 */
const queryShadeStakingOpportunity$ = ({
  shadeStakingContractAddress,
  shadeStakingCodeHash,
  lcdEndpoint,
  chainId,
}: {
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryShadeStakingOpportunity(),
    client,
    contractAddress: shadeStakingContractAddress,
    codeHash: shadeStakingCodeHash,
  })),
  map((response) => parseStakingOpportunity(response as StakingInfoServiceResponse)),
  first(),
);

/**
 * query the staking info from the shade staking contract
 */
async function queryShadeStakingOpportunity({
  shadeStakingContractAddress,
  shadeStakingCodeHash,
  lcdEndpoint,
  chainId,
}: {
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryShadeStakingOpportunity$({
    shadeStakingContractAddress,
    shadeStakingCodeHash,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * query the staking info for multiple staking contracts at one time
 */
function batchQueryShadeStakingOpportunity$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stakingContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stakingContracts: Contract[]
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const queries:BatchQueryParams[] = stakingContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryShadeStakingOpportunity(),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseBatchQueryShadeStakingOpportunityResponse),
    first(),
  );
}

/**
 * query the staking info for multiple staking contracts at one time
 */
async function batchQueryShadeStakingOpportunity({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stakingContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stakingContracts: Contract[]
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQueryShadeStakingOpportunity$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    stakingContracts,
    minBlockHeightValidationOptions,
  }));
}

export {
  parseStakingOpportunity,
  queryShadeStakingOpportunity$,
  queryShadeStakingOpportunity,
  batchQueryShadeStakingOpportunity$,
  batchQueryShadeStakingOpportunity,
};
