# APY Calculations

This page demonstrates how to calculate outputs the shade derivative contracts 

### stkd-SCRT APY
Calculates the apy expected for the stkd-SCRT token
```ts
/**
 * Will calculate APY for the stkd secret derivative contract
 *
 * returns a number that is the decimal form of the percent APY
 * @param lcdEndpoint is not optional due to the requirement of the secretChainQueries() function
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
