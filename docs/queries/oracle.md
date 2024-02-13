# Oracle Examples

This page demonstrates how to query the Shade Oracle Router, which serves price feeds from various sources inluding: Band Protocol, ShadeSwap pools, derivative redemption rates, and others.
## Single Oracle Price

**input**

```ts
async function queryPrice({
  contractAddress,
  codeHash,
  oracleKey,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  oracleKey: string,
  lcdEndpoint?: string,
  chainId?: string,
}) : Promise<ParsedOraclePriceResponse> 
```

**output**

```ts
type ParsedOraclePriceResponse = {
  oracleKey: string,
  rate: string,
  lastUpdatedBase: number,
  lastUpdatedQuote: number,
}


```

**example use**

```ts
const output = await queryPrice({
  contractAddress: '[ORACLE_CONTRACT_ADDRESS]',
  codeHash: '[ORACLE_CODE_HASH]',,
  oracleKey: 'BTC',
})
console.log(output) 
```
***console***
```md
const priceParsed = {
  oracleKey: 'BTC',
  rate: '27917207155600000000000',
  lastUpdatedBase: 1696644063,
  lastUpdatedQuote: 18446744073709552000,
};
```

## Multiple Oracle Prices

**input**

```ts
async function queryPrices({
  contractAddress,
  codeHash,
  oracleKeys,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  oracleKeys: string[],
  lcdEndpoint?: string,
  chainId?: string,
}) : Promise<ParsedOraclePricesResponse> 
```

**output**

```ts
type ParsedOraclePricesResponse = {
  [oracleKey: string]: ParsedOraclePriceResponse
}

// type reference below

type ParsedOraclePriceResponse = {
  oracleKey: string,
  rate: string,
  lastUpdatedBase: number,
  lastUpdatedQuote: number,
}


```

**example use**

```ts
const output = await queryPrices({
  contractAddress: '[ORACLE_CONTRACT_ADDRESS]',
  codeHash: '[ORACLE_CODE_HASH]',,
  oracleKeys: ['BTC', 'ETH'],
})
console.log(output) 
```
***console***
```md
{
  BTC: {
    oracleKey: 'BTC',
    rate: '27917207155600000000000',
    lastUpdatedBase: 1696644063,
    lastUpdatedQuote: 18446744073709552000,
  },
  ETH: {
    oracleKey: 'ETH',
    rate: '1644083682900000000000',
    lastUpdatedBase: 1696644063,
    lastUpdatedQuote: 18446744073709552000,
  },
}
```

## Batch Query Individual Prices

**input**

```ts
/**
 * queries individual prices utilizing a batch query.
 * This is a less efficient version of the multi-price query in the oracle
 * contract, however the benefits are that an error in any single price
 * will not cause all prices to fail. The recommended use would be to fall
 * back on this query when the standard queryPrices fails so that you
 * can determine which key is having issues, while also still getting
 * data back for the good keys.
 */
async function batchQueryIndividualPrices({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  oracleContractAddress,
  oracleCodeHash,
  oracleKeys,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  oracleContractAddress: string
  oracleCodeHash: string
  oracleKeys: string[],
}) : Promise<ParsedOraclePricesResponse> 
```

**output**

```ts
type ParsedOraclePricesResponse = {
  [oracleKey: string]: ParsedOraclePriceResponse
}

// type reference below

type ParsedOraclePriceResponse = {
  oracleKey: string,
  rate?: string,
  lastUpdatedBase?: number,
  lastUpdatedQuote?: number,
  error?: {
    type: OracleErrorType,
    msg: any,
  }
}
