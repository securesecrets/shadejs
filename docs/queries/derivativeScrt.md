# Scrt Derivative Examples

This page demonstrates how to query the stkd Scrt derivative contracts


## Staking Info

**input**

```ts
/**
 * query derivative contract for the staking info
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
}): Promise<StakingDerivativesInfo> 
```

**output**

```ts
type StakingDerivativesInfo = {
  validators: StakingDerivativesValidator[],
  supply: number,
  exchangeRate: number,
  communityRewards: number,
  nextUnboundAmount: number,
  nextUnbondingBatchEstimatedTime: number,
}

// type references below

type StakingDerivativesValidator = {
  validator: string,
  weight: number,
}
```

## Fee Info

**input**

```ts
/**
 * query derivative contract for the staking info
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
}): Promise<StakingDerivativesFee> 
```

**output**

```ts
type StakingDerivativesFee = {
  depositFee: number,
  withdrawFee: number,
}
```
