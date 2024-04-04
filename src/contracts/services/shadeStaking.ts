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
} from '~/types/contracts/shadeStaking/index';

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
      // data returned from the contract in normalized form with
      // 18 decimals, in addition to any decimals on the individual token
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

export {
  parseStakingOpportunity,
  queryShadeStakingOpportunity$,
  queryShadeStakingOpportunity,
};
