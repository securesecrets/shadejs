# Swap Transactions

This page demonstrates how to generate messages and parse responses for  swap transactions

## Swap Tokens
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