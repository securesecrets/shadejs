# Snip20 Token Examples

This page demonstrates how to query Snip20 token contracts


## Token Info

**input**

```ts
async function querySnip20TokenInfo({
  snip20ContractAddress,
  snip20CodeHash,
  lcdEndpoint,
  chainId,
}:{
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<TokenInfo> 
```

**output**

```ts
type TokenInfo = {
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
}

```

**example use**

```ts
const output = await querySnip20TokenInfo = ({
  contractAddress: 'secret1fl449muk5yq8dlad7a22nje4p5d2pnsgymhjfd',
  codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e' 
})
console.log(output) 
```
***console***
```md
{
  name: 'Silk',
  symbol: 'SILK',
  decimals: 6,
  totalSupply: '2247680264140',
};

```

## Batch Tokens Info

**input**

```ts
function batchQuerySnip20TokensInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  tokenContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  tokenContracts: Contract[]
})
```

**output**

```ts
type BatchTokensInfo = BatchTokensInfoItem[]

type TokenInfo = {
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
}

type BatchTokensInfoItem = {
  tokenContractAddress: string,
  tokenInfo: TokenInfo,
}
```

**example use**

```ts
const output = await batchQuerySnip20TokensInfo = ({
  queryRouterContractAddress: '[QUERY_ROUTER_CONTRACT_ADDRESS]',
  queryRouterCodeHash: '[QUERY_ROUTER_CODE_HASH]',
  tokenContracts: [{
    address: '[TOKEN_1_ADDRESS]',
    codeHash: '[TOKEN_1_CODE_HASH]',
  },
  {
    address: '[TOKEN_2_ADDRESS]',
    codeHash: '[TOKEN_2_CODE_HASH]',
  }]
})
console.log(output)
```
***console***
```md
[
  {
    tokenContractAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
    tokenInfo: {
      name: 'Shade',
      symbol: 'SHD',
      decimals: 8,
      totalSupply: '248115955993665',
    },
  },
  {
    tokenContractAddress: 'secret1fl449muk5yq8dlad7a22nje4p5d2pnsgymhjfd',
    tokenInfo: {
      name: 'Silk',
      symbol: 'SILK',
      decimals: 6,
      totalSupply: '3688426236358',
    },
  },
];

```

## Get Balance

**input**

```ts
async function querySnip20Balance({
  snip20ContractAddress,
  snip20CodeHash,
  userAddress,
  viewingKey,
  lcdEndpoint,
  chainId,
}:{
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  userAddress: string,
  viewingKey: string,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<string>
```

**output**

```ts
type string // returned as a uDenom 

```

**example use**

```ts
const output = await querySnip20Balance = ({
  contractAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
  userAddress: '[USER_SECRET_NETWORK_ADDRESS]',
  viewingKey: 'VIEWING_KEY'
})
console.log(output) 
```
***console***
```md
'123'

```