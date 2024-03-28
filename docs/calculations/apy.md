# APY Calculations

This page demonstrates how to calculate outputs the shade derivative contracts 

### stkd-SCRT APY
Calculates the apy expected for the stkd-SCRT token
```ts
/**
 * Will calculate APY for the stkd secret derivative contract
 *
 * returns a number that is the decimal form of the percent APY
 */
function calculateDerivativeScrtApy({
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
  lcdEndpoint: string,
  chainId?: string,
}): Promise<number> 
```

### dSHD APY
Calculates the apy expected for the stkd-SCRT token
```ts
/**
 * Calculates the dSHD expected APY by querying the staking contract
 * TESTNET ONLY NOT READY FOR PRODUCTION
 *
 * returns a number that is the decimal form of the percent APY
 */
async function calculateDerivativeShdApy({
  shadeTokenContractAddress,
  shadeStakingContractAddress,
  shadeStakingCodeHash,
  decimals,
  price,
  lcdEndpoint,
  chainId,
}:{
  shadeTokenContractAddress: string,
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
  decimals: number,
  price: string,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<number> 
```
