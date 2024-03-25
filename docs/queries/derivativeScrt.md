# Scrt Derivative Examples

This page demonstrates how to query the stkd Scrt derivative contracts

## Derivative Info

**input**

```ts
/**
 * query both the staking info and the fee info
 *
 * queryTimeSeconds is a paramater to query the contract
 * at a specific time in seconds from the UNIX Epoch
 */
const queryDerivativeScrtInfo = ({
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
}): Promise<DerivativeScrtInfo>
```

**output**

```ts
type DerivativeScrtInfo = {
  validators: DerivativeScrtValidator[],
  supply: string,
  exchangeRate: number,
  communityRewards: string,
  nextUnboundAmount: string,
  nextUnbondingBatchEstimatedTime: number,
  depositFee: number,
  withdrawFee: number,
}

// type references below

type DerivativeScrtValidator = {
  validatorAddress: string,
  weight: number;
}
```
