# Swap Transactions

This page demonstrates how to generate messages and parse responses for  swap transactions

## Swap Tokens

### V2 (Recommended)

V2 also allows precise gas estimation to be done on the client side. See [Swap Gas Estimation](./swap-gas-estimation.html)

```ts
function msgSwapV2({
  snip20ContractAddress: string,
  snip20CodeHash: string,
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  path,
}: {
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  path: PathV2[],
}) 
```

### V1 (Legacy)

```ts
function msgSwap({
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  path,
}: {
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  path: Paths,
}) 
```

**input type**
```ts
type Path = {
  poolContractAddress: string,
  poolCodeHash: string,
}

type Paths = Path[]
```

**Type reference**
```ts
type Path = {
  poolContractAddress: string,
  poolCodeHash: string,
}

type PathV2 = Path & {
  batchPairInfo: Contract[],
  poolType: SwapType,
  stableOracleKeys?: [string, string] | null,
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
