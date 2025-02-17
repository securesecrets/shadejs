type StakingInfoServiceResponse = {
    staking_info: {
        info: {
            stake_token: string,
            total_staked: string,
            unbond_period: string,
            reward_pools: [{
                id: string,
                amount: string,
                start: string,
                end: string,
                token: {
                    address: string,
                    code_hash: string,
                },
                rate: string,
                official: boolean,
            }],
        },
    },
}

type StakingRewardPoolServiceModel = {
    id: string,
    amountRaw: string,
    startDate: Date,
    endDate: Date,
    tokenAddress: string,
    rateRaw: string,
}

type StakingInfoServiceModel = {
    stakeTokenAddress: string,
    totalStakedRaw: string,
    unbondingPeriod: number,
    rewardPools: StakingRewardPoolServiceModel[],
}

type BatchSingleShadeStakingOpportunity = {
    stakingContractAddress: string,
    stakingInfo: StakingInfoServiceModel,
    blockHeight: number,
  }

  type BatchShadeStakingOpportunity = BatchSingleShadeStakingOpportunity[]

export type {
  StakingInfoServiceResponse,
  StakingRewardPoolServiceModel,
  StakingInfoServiceModel,
  BatchShadeStakingOpportunity,
};
