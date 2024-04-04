# Shade Staking Examples

This page demonstrates how to query the shade staking contracts

## Staking Info

**input**

```ts
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
}): Promise<StakingInfoServiceModel>
```

**output**

```ts
type StakingInfoServiceModel = {
    stakeTokenAddress: string,
    totalStakedRaw: string,
    unbondingPeriod: number,
    rewardPools: StakingRewardPoolServiceModel[],
}

// type references below

type StakingRewardPoolServiceModel = {
    id: string,
    amountRaw: string,
    startDate: Date,
    endDate: Date,
    tokenAddress: string,
    rateRaw: string,
}
```
