# ShadeSwap Calculations

This page demonstrates how to calculate outputs of a single pair swap on ShadeSwap

## Constant Product (CPMM)

### Forward Swap
Standard swap calculation of output token amount for a given input.
```js
/**
* returns output of a simulated swap from token0 to token1 using the constant
* product rule for non-stable pairs.
* The swap output is rounded to the nearest integer, so inputs should be in
* raw (udenom) number form to prevent loss of precision
* */
function constantProductSwapToken0for1({
  token0LiquidityAmount,
  token1LiquidityAmount,
  token0InputAmount,
  fee,
}:{
  token0LiquidityAmount: BigNumber,
  token1LiquidityAmount: BigNumber,
  token0InputAmount: BigNumber,
  fee: BigNumber  // decimal percent
})
```

```js
/**
* returns output of a simulated swap from token1 to token0 using the constant
* product rule for non-stable pairs
* The swap output is rounded to the nearest integer, so inputs should be in
* raw (udenom) number form to prevent loss of precision
* */
function constantProductSwapToken1for0({
  token0LiquidityAmount,
  token1LiquidityAmount,
  token1InputAmount,
  fee,
}:{
  token0LiquidityAmount: BigNumber,
  token1LiquidityAmount: BigNumber,
  token1InputAmount: BigNumber,
  fee: BigNumber // decimal percent
})
```

### Reverse Swap
Backwards calcuation for determining a token input amount for a given output amount.
```js
/**
* returns input of a simulated swap from token0 to token1 using the constant
* product rule for non-stable pairs
* The swap output is rounded to the nearest integer, so inputs should be in
* raw (udenom) number form to prevent loss of precision
* */
function constantProductReverseSwapToken0for1({
  token0LiquidityAmount,
  token1LiquidityAmount,
  token1OutputAmount,
  fee,
}:{
  token0LiquidityAmount: BigNumber,
  token1LiquidityAmount: BigNumber,
  token1OutputAmount: BigNumber,
  fee: BigNumber // decimal percent
})
```
```js
/**
* returns input of a simulated swap from token1 to token0 using the constant
* product rule for non-stable pairs
* The swap output is rounded to the nearest integer, so inputs should be in
* raw (udenom) number form to prevent loss of precision
* */
function constantProductReverseSwapToken1for0({
  token0LiquidityAmount,
  token1LiquidityAmount,
  token0OutputAmount,
  fee,
}:{
  token0LiquidityAmount: BigNumber,
  token1LiquidityAmount: BigNumber,
  token0OutputAmount: BigNumber,
  fee: BigNumber // decimal percent
})
```

## Stableswap

### Forward Swap
Standard swap calculation of output token amount for a given input.
```js
/**
* returns output of a simulated swap of token0 for 
* token1 using the stableswap math
* inputs token amounts must be passsed in as human readable form
* */
function stableSwapToken0for1({
  inputToken0Amount,
  poolToken0Amount,
  poolToken1Amount,
  priceRatio,
  alpha,
  gamma1,
  gamma2,
  liquidityProviderFee, 
  daoFee,
  minTradeSizeToken0For1,
  minTradeSizeToken1For0,
  priceImpactLimit,
}:{
  inputToken0Amount:BigNumber,
  poolToken0Amount: BigNumber,
  poolToken1Amount: BigNumber,
  priceRatio: BigNumber,
  alpha: BigNumber,
  gamma1: BigNumber,
  gamma2: BigNumber,
  liquidityProviderFee: BigNumber, // decimal percent
  daoFee: BigNumber, // decimal percent
  minTradeSizeToken0For1: BigNumber,
  minTradeSizeToken1For0: BigNumber,
  priceImpactLimit: BigNumber,
})
```

```js
/**
* returns output of a simulated swap of token1 for 
* token0 using the stableswap math
* inputs token amounts must be passsed in as human readable form
* */
function stableSwapToken1for0({
  inputToken1Amount,
  poolToken0Amount,
  poolToken1Amount,
  priceRatio,
  alpha,
  gamma1,
  gamma2,
  liquidityProviderFee,
  daoFee,
  minTradeSizeToken0For1,
  minTradeSizeToken1For0,
  priceImpactLimit,
}:{
  inputToken1Amount:BigNumber,
  poolToken0Amount: BigNumber,
  poolToken1Amount: BigNumber,
  priceRatio: BigNumber,
  alpha: BigNumber,
  gamma1: BigNumber,
  gamma2: BigNumber,
  liquidityProviderFee: BigNumber, // decimal percent
  daoFee: BigNumber, // decimal percent
  minTradeSizeToken0For1: BigNumber,
  minTradeSizeToken1For0: BigNumber,
  priceImpactLimit: BigNumber,
})
```

### Reverse Swap
Backwards calcuation for determining a token input amount for a given output amount.
```js
/**
* returns input of a simulated swap of token0 for 
* token1 using the stableswap math
* inputs token amounts must be passsed in as human readable form
* */
function stableReverseSwapToken0for1({
  outputToken1Amount,
  poolToken0Amount,
  poolToken1Amount,
  priceRatio,
  alpha,
  gamma1,
  gamma2,
  liquidityProviderFee,
  daoFee,
  minTradeSizeToken0For1,
  minTradeSizeToken1For0,
  priceImpactLimit,
}:{
  outputToken1Amount:BigNumber,
  poolToken0Amount: BigNumber,
  poolToken1Amount: BigNumber,
  priceRatio: BigNumber,
  alpha: BigNumber,
  gamma1: BigNumber,
  gamma2: BigNumber,
  liquidityProviderFee: BigNumber, // decimal percent
  daoFee: BigNumber, // decimal percent
  minTradeSizeToken0For1: BigNumber,
  minTradeSizeToken1For0: BigNumber,
  priceImpactLimit: BigNumber,
})
```
```js
/**
* returns output of a simulated swap of token1 for 
* token0 using the stableswap math
* inputs token amounts must be passsed in as human readable form
* */
function stableReverseSwapToken1for0({
  outputToken0Amount,
  poolToken0Amount,
  poolToken1Amount,
  priceRatio,
  alpha,
  gamma1,
  gamma2,
  liquidityProviderFee,
  daoFee,
  minTradeSizeToken0For1,
  minTradeSizeToken1For0,
  priceImpactLimit,
}:{
  outputToken0Amount:BigNumber,
  poolToken0Amount: BigNumber,
  poolToken1Amount: BigNumber,
  priceRatio: BigNumber,
  alpha: BigNumber,
  gamma1: BigNumber,
  gamma2: BigNumber,
  liquidityProviderFee: BigNumber, // decimal percent
  daoFee: BigNumber, // decimal percent
  minTradeSizeToken0For1: BigNumber,
  minTradeSizeToken1For0: BigNumber,
  priceImpactLimit: BigNumber,
})
```

## Price Impact
Price impact is the difference between the current market price and the price you will actually pay. This is 
sometimes referred to as "slippage", however slippage tends to be a misused term. Slippage is supposed to be the change in output between the time the user submits a transaction and the actual amount received due to unpredictable changes in liquidity (caused by other users' swaps).

### Constant Product (CPMM)
```js
/**
* Inputs may either be in human readable or raw form. 
* There is no rounding performed, 
* therefore there is no risk of loss of precision
* */
function constantProductPriceImpactToken0for1({
  token0LiquidityAmount,
  token1LiquidityAmount,
  token0InputAmount,
}:{
  token0LiquidityAmount: BigNumber,
  token1LiquidityAmount: BigNumber,
  token0InputAmount: BigNumber,
})
```
```js
/**
* Inputs may either be in human readable or raw form. 
* There is no rounding performed, therefore
* there is no risk of loss of precision
* */
function constantProductPriceImpactToken1for0({
  token0LiquidityAmount,
  token1LiquidityAmount,
  token1InputAmount,
}:{
  token0LiquidityAmount: BigNumber,
  token1LiquidityAmount: BigNumber,
  token1InputAmount: BigNumber,
})
```

### Stableswap 
```js
/**
* returns price impact of a simulated swap of token0 
* for token1 inputs token amounts must be passsed in 
* as human readable form (do not use udenom)
* */
function stableSwapPriceImpactToken0For1({
  inputToken0Amount,
  poolToken0Amount,
  poolToken1Amount,
  priceRatio,
  alpha,
  gamma1,
  gamma2,
  liquidityProviderFee,
  daoFee,
  minTradeSizeToken0For1,
  minTradeSizeToken1For0,
  priceImpactLimit,
}:{
  inputToken0Amount:BigNumber,
  poolToken0Amount: BigNumber,
  poolToken1Amount: BigNumber,
  priceRatio: BigNumber,
  alpha: BigNumber,
  gamma1: BigNumber,
  gamma2: BigNumber,
  liquidityProviderFee: BigNumber,
  daoFee: BigNumber,
  minTradeSizeToken0For1: BigNumber,
  minTradeSizeToken1For0: BigNumber,
  priceImpactLimit: BigNumber,
}) 
```
```js
/**
* returns price impact of a simulated swap of token1 
* for token0 inputs token amounts must be passsed in 
* as human readable form (do not use udenom).
* */
function stableSwapPriceImpactToken1For0({
  inputToken1Amount,
  poolToken0Amount,
  poolToken1Amount,
  priceRatio,
  alpha,
  gamma1,
  gamma2,
  liquidityProviderFee,
  daoFee,
  minTradeSizeToken0For1,
  minTradeSizeToken1For0,
  priceImpactLimit,
}:{
  inputToken1Amount:BigNumber,
  poolToken0Amount: BigNumber,
  poolToken1Amount: BigNumber,
  priceRatio: BigNumber,
  alpha: BigNumber,
  gamma1: BigNumber,
  gamma2: BigNumber,
  liquidityProviderFee: BigNumber,
  daoFee: BigNumber,
  minTradeSizeToken0For1: BigNumber,
  minTradeSizeToken1For0: BigNumber,
  priceImpactLimit: BigNumber,
})
```