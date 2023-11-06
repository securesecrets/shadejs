# Swap Transactions

This page demonstrates how to generate messages and parse responses for  swap transactions

## Swap Tokens
```js
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
```js
type Path = {
  poolContractAddress: string,
  poolCodeHash: string,
}

type Paths = Path[]
```

### Response Parser
This function can be used to parse the transaction response after it has been broadcasted to the chain.
```js
parseSwapResponse(response: TxResponse)
```
**input type**
```js
type TxResponse // standard TxResponse as defined in secret.js
```

**output**
```js
type ParsedSwapResponse = {
  txHash: string,
  inputTokenAddress: string | undefined,
  outputTokenAddress: string | undefined,
  inputTokenAmount: string | undefined,
  outputTokenAmount: string | undefined,
}
```