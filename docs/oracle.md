# Oracle Examples

This page demonstrates how to query the Shade Oracle Router, which serves price feeds from various sources inluding: Band Protocol, ShadeSwap pools, derivative redemption rates, and others.
## Single Oracle Price

**input**

```js
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
::: warning
It is recommended that you provide your own LCD endpoint, although we do provide a default mainnet option. Performance of the default endpoint is not guaranteed.
:::

**output**

```js
type ParsedOraclePriceResponse = {
  oracleKey: string,
  rate: string,
  lastUpdatedBase: number,
  lastUpdatedQuote: number,
}


```

**example use**

```js
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

```js
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
::: warning
It is recommended that you provide your own LCD endpoint, although we do provide a default mainnet option. Performance of the default endpoint is not guaranteed.
:::

**output**

```js
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

```js
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
