# ShadeSwap Multi-Hop Routing

This page contains an example router that determines the optimal path for maximizing the users output tokens received

## Router

### Determine Possible Paths
Returns possible paths through one or multiple pools to complete a trade of two tokens.
```ts
function getPossiblePaths({
  inputTokenContractAddress,
  outputTokenContractAddress,
  maxHops,
  pairs,
}:{
  inputTokenContractAddress:string,
  outputTokenContractAddress:string
  maxHops: number // max number of pairs used
  pairs: BatchPairsInfo
}): string[][]
```
See [Batch Pairs Query](../queries/swap.html#pairs-info) for input type BatchPairsInfo.

::: warning
Increasing the max hops too much can cause decreased performance due to the large amount of computations required to calculate all routes. The current recommendation is 4 max based on the route paths available, but this is subject to change as more pairs are supported over time.
:::

### Calculate Route
Calculates the output amount received for a given path

```ts
function calculateRoute({
  inputTokenAmount,
  inputTokenContractAddress,
  path,
  pairs,
  tokens,
}:{
  inputTokenAmount: BigNumber,
  inputTokenContractAddress: string,
  path: string[], // path determined by getPossiblePaths
  pairs: BatchPairsInfo,
  tokens: TokensConfig, // list of all possible swap tokens
}): Route
```

::: tip
We pass in a list of all possible tokens (TokensConfig) so that we have access to their decimals for uDenom conversions. This is not the most elegant solution as it may be preferrable to reference your own data store for token data. In that case, you can create your own route calculator and use the ShadeJS one as a guide.
:::
```ts
type TokenConfig = {
  tokenContractAddress: string,
  decimals: number,
}

type TokensConfig = TokenConfig[]
```
**output**

```ts
type Route = {
  inputAmount: BigNumber,
  quoteOutputAmount: BigNumber,
  quoteShadeDaoFee: BigNumber,
  quoteLPFee: BigNumber,
  priceImpact: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  path: string[],
  gasMultiplier: number, // multiplier which is to be applied 
  // to the base gas cost of a swap
};
```


### Calculate All Possible Routes
Retrieves all potential route options and the outputs of each route.
Returns an array of routes in the order that will give the highest quoted
output amount. This function utilizes both getPossiblePaths and calculateRoute.

```ts
function getRoutes({
  inputTokenAmount,
  inputTokenContractAddress,
  outputTokenContractAddress,
  maxHops,
  pairs,
  tokens,
}: {
  inputTokenAmount: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  maxHops: number,
  pairs: BatchPairsInfo,
  tokens: TokensConfig,
}): Route[] 
```

::: warning
This function optimizes for maximizing the output token amount only. It does NOT factor in the value of the gas for the extra hops (i.e. gas multiplier) relative to the value of tokens received. This will especially impact small trades where there is perceived arbitrage opportunities through certain paths, without factoring in the gas cost to perform the arbitrage. It is recommended that you create your own route calculator to handle token values and use the one provided here as a guide.
:::

