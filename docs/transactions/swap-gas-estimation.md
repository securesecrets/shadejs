# Estimating Gas for Swap Transactions

In order to calculate how much gas a swap transaction needs using `shade.js`, you can use the method `calculateSwapGasEstimation` from `~/lib/swap/gasEstimation/swapGas.ts`

```ts
function calculateSwapGasEstimation(route: Route): BigNumber;
```

**input**

`route` is a parameter provided through `getRoutes` or `calculateRoute` from `~/lib/swap/router.ts`

**output**

`gasAmount` as a `BigNumber` which should be used when sending the transaction on Secret Network. 
