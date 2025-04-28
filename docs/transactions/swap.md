# Swap Transactions

This page demonstrates how to generate messages and parse responses for  swap transactions.

## Swap Tokens
Swapping tokens on ShadeSwap is done via sending a SNIP20 to the router contract along with an accompanying handleMsg that describes the desired swap.

The easiest way to construct a swap message is to use the `msgSwap` provided by `~/contracts/definitions/swap`
```ts
function msgSwap({
  snip20ContractAddress: string,
  snip20CodeHash: string,
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  route,
}: {
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  route: Route,
}) 
```

**Input**

- `snip20ContractAddresss` and `snip20CodeHash` are the input token contract address and code hash.
- `routerContractAddress` and `routerCodeHash` describe the router contract that will execute the swap.
- `sendAmount` and `minExpectedReturnAmount` are the respective udenom converted amounts on the input and output tokens (see `convertCoinToUDenom` in `~/lib/utils/`)
- `route` is a parameter provided through `getRoutes` or `calculateRoute` from `~/lib/swap/router.ts`

**Type reference**
```ts
type Path = {
  poolContractAddress: string,
  poolCodeHash: string,
  poolType: SwapType,
  stableOracleKeys?: [string, string] | null,
}

type PathWithPair = Path & {
  pair: Contract[],
};

type Route = {
  inputAmount: BigNumber,
  quoteOutputAmount: BigNumber,
  quoteShadeDaoFee: BigNumber,
  quoteLPFee: BigNumber,
  priceImpact: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  path: PathWithPair[],
  iterationsCount: number,
}
```

### Response Parser
This function can be used to parse the transaction response after it has been broadcasted to the chain.
```ts
parseSwapResponse(response: TxResponse)
```
**input type**
```ts
type TxResponse // standard TxResponse as defined in secret.js
```

**output**
```ts
type ParsedSwapResponse = {
  txHash: string,
  inputTokenAddress: string | undefined,
  outputTokenAddress: string | undefined,
  inputTokenAmount: string | undefined,
  outputTokenAmount: string | undefined,
}
```
