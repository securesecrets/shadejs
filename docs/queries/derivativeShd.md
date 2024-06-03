# Shade Derivative Examples

This contract and its services are currently in development and on testnet, not mainnet
This page demonstrates how to query the Shade derivative contracts


## Staking Info

**input**

```ts
/**
 * query derivative contract for the staking info
 */
async function queryDerivativeShdStakingInfo({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<ParsedStakingInfoResponse> 
```

**output**

```ts
type ParsedStakingInfoResponse = {
  unbondingTime: string,
  bondedShd: string,
  rewards: string,
  totalDerivativeTokenSupply: string,
  price: number,
  feeInfo: ParsedFeeResponse,
  status: StatusLevel,
}

// type references below

type ParsedFeeResponse = {
  stakingFee: number,
  unbondingFee: number,
  feeCollector: string,
}

enum StatusLevel {
  NORMAL_RUN = 'normal_run',
  PANICKED = 'panicked',
  STOP_ALL = 'stop_all'
}
```
