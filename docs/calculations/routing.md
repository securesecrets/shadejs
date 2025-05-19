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

::: tip
We pass in a list of all possible tokens (TokensConfig) so that we have access to their decimals for uDenom conversions. This is not the most elegant solution as it may be preferable to reference your own data store for token data. In that case, you can create your own route calculator and use the ShadeJS one as a guide.
:::
::: warning
Ensure tokenConfig contains no duplicate tokens as this will trigger an error in order to prevent a bad config from being used.
:::
```ts
type TokenConfig = {
  tokenContractAddress: string,
  decimals: number,
}

type TokensConfig = TokenConfig[]
```

#### V2 (Recommended)
V2 router and is better gas optimized and allows gas estimation on the client-side  (see [Swap Gas Estimation](../transactions/swap-gas-estimation.html))

With V2, the SwapRoutesCalculator is introduced. SwapRoutesCalculator is designed to be used as a singleton instance across the app and implements useful caching of calculations and routes.

**getRoutesV2**

Gets sorted routes using a swapRoutesCalculator instance similar to how you would previously use getRoutes (legacy)
```ts
function getRoutesV2({
  inputTokenAmount,
  startingTokenAddress,
  endingTokenAddress,
  maxHops,
  maxRoutes = Number.MAX_SAFE_INTEGER,
  isReverse = false,
  compareRoutesFn = compareRoutes,
  swapRoutesCalculator,
}: {
  inputTokenAmount: BigNumber,
  startingTokenAddress: string,
  endingTokenAddress: string,
  maxHops: number,
  maxRoutes?: number,
  isReverse: boolean,
  swapRoutesCalculator: SwapRoutesCalculator, // see below
  compareRoutesFn?: (a: RouteV2, b: RouteV2, isReverse: boolean) => number,
}): RouteV2[]
```

**Required: Managing the SwapRoutesCalculator singleton instance**

```ts
const pairs: BatchPairsInfo = ...;
const tokens: TokensConfig = ...;
const version = Date.now(); // initial version of the pairs info used for caching routes

// SwapRoutesCalculator should be a single global instance for best results
window.swapRoutesCalculator = new SwapRoutesCalculator(
  pairs,
  tokensForRoutes,
  version,
);
// do calculations using getRoutesV2(..) or swapRoutesCalculator.calculateRoutes(..)

// ... update pools ...
window.swapRoutesCalculator.update({
  pairs: newPairs,
  tokens: newTokens,
  version: Date.now(),
})
```

**Alternatively, calculate routes using `swapRoutesCalculator.calculateRoutes`**
```ts
const routes: RouteV2[] = swapRoutesCalculator.calculateRoutes({
  startingTokenAddress,
  endingTokenAddress,
  inputTokenAmount,
  maxHops,
  isReverse,
})
```

**output**
```ts
type RouteV2 = {
  inputAmount: BigNumber,
  quoteOutputAmount: BigNumber,
  quoteShadeDaoFee: BigNumber,
  quoteLPFee: BigNumber,
  priceImpact: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  path: PathV2[], // changed from string[] in v2
  iterationsCount: number, // used for gas estimation
};
```

#### V1 (Legacy)
Calculates the output amount received for a given path

```ts
function calculateRoute({
  inputTokenAmount,
  inputTokenContractAddress,
  path,
  pairs,
  tokens,
}:{
  inputTokenAmount: BigNumber, // amount in uDenom
  inputTokenContractAddress: string,
  path: string[], // path determined by getPossiblePaths
  pairs: BatchPairsInfo,
  tokens: TokensConfig, // list of all possible swap tokens
}): Route
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

#### V1 (Legacy)
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
These functions optimizes for maximizing the output token amount only. It does NOT factor in the value of the gas for the extra hops (i.e. gas multiplier) relative to the value of tokens received. This will especially impact small trades where there is perceived arbitrage opportunities through certain paths, without factoring in the gas cost to perform the arbitrage. It is recommended that you create your own route calculator to handle token values and use the one provided here as a guide.
:::
::: tip
Any errors encountered during a route calculation (ex: stableswap price impact tolerance exceeded, bad token config, missing batchPairInfo data, etc.) will result in skipping this route as an option in the output. Errors in all possible routes will return an empty array, meaning that no successful route exists. You are encouraged to modify this example router if you wish to collect specific errors on each possible route and do something with that error data.
:::

## Types

### Legacy Route
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
  gasMultiplier: number,
};
```

### RouteV2
```ts
type RouteV2 = {
  inputAmount: BigNumber,
  quoteOutputAmount: BigNumber,
  quoteLPFee: BigNumber,
  priceImpact: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  path: PathsWithPair[], // required by V2 router
  iterationsCount: number, // required for gas estimation
};
```
