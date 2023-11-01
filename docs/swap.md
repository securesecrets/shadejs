# Swap Examples

This page demonstrates how to query the ShadeSwap contracts


## Factory Config

**input**

```js
async function queryFactoryConfig = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string, // defaults to mainnet
}): Promise<FactoryConfig> 
```
::: warning
It is recommended that you provide your own LCD endpoint, although we do provide a default mainnet option. Performance of the default endpoint is not guaranteed.
:::

**output**

```js
type FactoryConfig = {
  pairContractInstatiationInfo: ContractInstantiationInfo,
  lpTokenContractInstatiationInfo: ContractInstantiationInfo,
  adminAuthContract: Contract,
  authenticatorContract: Contract | null,
  defaultPairSettings: {
    lpFee: number,
    daoFee: number,
    stableLpFee: number,
    stableDaoFee: number,
    daoContract: Contract,
  }
}

// type references below

type Contract = {
  address: string,
  codeHash: string,
}

type ContractInstantiationInfo = {
  codeHash: string,
  id: number,
}

```

**example use**

```js
const output = await queryFactoryConfig = ({
  contractAddress: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
  codeHash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e' 
})
console.log(output) 
```
***console***
```md
{
  pairContractInstatiationInfo: {
    codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
    id: 914,
  },
  lpTokenContractInstatiationInfo: {
    codeHash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
    id: 913,
  },
  adminAuthContract: {
    address: 'secret1hcz23784w6znz3cmqml7ha8g4x6s7qq9v93mtl',
    codeHash: '6666d046c049b04197326e6386b3e65dbe5dd9ae24266c62b333876ce57adaa8',
  },
  authenticatorContract: null,
  defaultPairSettings: {
    lpFee: 0.0029,
    daoFee: 0.0001,
    stableLpFee: 0.000483,
    stableDaoFee: 0.000017,
    daoContract: {
      address: 'secret1g86l6j393vtzd9jmmxu57mx4q8y9gza0tncjpp',
      codeHash: '',
    },
  },
}
```

## Factory Registered Pairs
query the list of pairs registered in the factory contract

**input**

```js
async function queryFactoryPairs = ({
  contractAddress,
  codeHash,
  startingIndex,
  limit,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  startingIndex: number,
  limit: number,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<FactoryPairs>
```

**output**

```js
type FactoryPairs = {
  pairs: FactoryPair[],
  startIndex: number,
  endIndex: number,
}

// type references below

type Contract = {
  address: string,
  codeHash: string,
}

type FactoryPair = {
  pairContract: Contract,
  token0Contract: Contract,
  token1Contract: Contract,
  isStable: boolean,
  isEnabled: boolean
}

```

**example use**

```js
const output = await queryFactoryPairs$ = ({
  contractAddress: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
  codeHash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e'
  startingIndex: 0,
  limit: 100, // determines number of records to return
})

console.log(output)
```
***console***
```md
{
  pairs: [{
    pairContract: {
      address: 'secret1wn9tdlvut2nz0cpv28qtv74pqx20p847j8gx3w',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
    },
    token0Contract: {
      address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    token1Contract: {
      address: 'secret155w9uxruypsltvqfygh5urghd5v0zc6f9g69sq',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    isStable: false,
    isEnabled: true,
  }, {
    pairContract: {
      address: 'secret1qyt4l47yq3x43ezle4nwlh5q0sn6f9sesat7ap',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
    },
    token0Contract: {
      address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    token1Contract: {
      address: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
      codeHash: 'f6be719b3c6feb498d3554ca0398eb6b7e7db262acb33f84a8f12106da6bbb09',
    },
    isStable: false,
    isEnabled: true,
  }],
  startIndex: 1,
  endIndex: 25,
};
```

## Pair Config
query the configuration of the pair

**input**

```js
async function queryPairConfig = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<PairConfig>
```

**output**

```js

type PairConfig = {
  factoryContract: Contract | null,
  lpTokenContract: Contract | null,
  stakingContract: Contract | null,
  token0Contract: Contract,
  token1Contract: Contract,
  isStable: boolean,
  fee: CustomFee | null,
}

// type references below

type Contract = {
  address: string,
  codeHash: string,
}

type CustomFee = {
  daoFee: number,
  lpFee: number,
}

```

**example use**

```js
const output = await queryPairConfig({
  contractAddress: '[PAIR_CONTRACT_ADDRESS]',
  codeHash: '[PAIR_CODE_HASH]'
})

console.log(output)
```
***console***
```md
{
  factoryContract: {
    address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
    codeHash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
  },
  lpTokenContract: {
    address: 'secret1l2u35dcx2a4wyx9a6lxn9va6e66z493ycqxtmx',
    codeHash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
  },
  stakingContract: {
    address: 'secret16h5sqd79x43wutne8ge3pdz3e3lngw62vy5lmr',
    codeHash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
  },
  token0Contract: {
    address: 'secret19e75l25r6sa6nhdf4lggjmgpw0vmpfvsw5cnpe',
    codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
  },
  token1Contract: {
    address: 'secret16vjfe24un4z7d3sp9vd0cmmfmz397nh2njpw3e',
    codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
  },
  isStable: true,
  fee: {
    lpFee: 0.0005,
    daoFee: 0.0005,
  },
};
```

## Pairs Info
Query the info for multiple pairs
::: info
This query uses a smart contract batch query router to allow you to query many pairs in a single http request. This is a highly efficient method of interacting with the chain an minimizes the load on the LCD endpoint.
:::

**input**

```js
async function batchQueryPairsInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  pairsContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pairsContracts: Contract[]
}): Promise<BatchPairInfo>
```

**output**

```js
type BatchPairsInfo = BatchPairInfo[]

// type references below

type BatchPairInfo = {
  pairContractAddress: string,
  pairInfo: PairInfo,
}

type PairInfo = {
  lpTokenAmount: string,
  lpTokenContract: Contract,
  token0Contract: Contract,
  token1Contract: Contract,
  factoryContract: Contract | null,
  daoContractAddress: string,
  isStable: boolean,
  token0Amount: string,
  token1Amount: string,
  priceRatio: string | null,
  pairSettings: {
    lpFee: number,
    daoFee: number,
    stableLpFee: number,
    stableDaoFee: number,
    stableParams: StableParams | null
  },
  contractVersion: number,
}

type StableParams = {
  alpha: string,
  gamma1: string,
  gamma2: string,
  oracle: Contract,
  token0Data: StableTokenData,
  token1Data: StableTokenData,
  minTradeSizeXForY: string,
  minTradeSizeYForX: string,
  maxPriceImpactAllowed: string,
  customIterationControls: CustomIterationControls | null,
}

type CustomIterationControls = {
  epsilon: string,
  maxIteratorNewton: number,
  maxIteratorBisect: number,
}

type Contract = {
  address: string,
  codeHash: string,
}

type StableTokenData = {
  oracleKey: string,
  decimals: number,
}

```

**example use**

```js
const output = await batchQueryPairsInfo({
  queryRouterContractAddress: '[QUERY_ROUTER_CONTRACT_ADDRESS]',
  queryRouterCodeHash: '[QUERY_ROUTER_CODE_HASH]',
  pairsContracts: [{
    address: '[PAIR_1_ADDRESS]',
    codeHash: '[PAIR_1_CODE_HASH]',
  },
  {
    address: '[PAIR_2_ADDRESS]',
    codeHash: '[PAIR_2_CODE_HASH]',
  }]
})
console.log(output)
```
***console***
```md
Example coming soon...
```

## Staking Info
Query the staking info for multiple pairs


**input**

```js
async function batchQueryStakingInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stakingContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stakingContracts: Contract[]
}): Promise<BatchStakingInfo>
```
::: tip
This is a reminder that the staking contract is separate from the pairs contract. Be sure to input the staking contracts in this query.
:::

**output**

```js
type BatchStakingInfo = BatchSingleStakingInfo[]

// type references below

type BatchSingleStakingInfo = {
  stakingContractAddress: string,
  stakingInfo: StakingInfo,
}

type RewardTokenInfo = {
  token: Contract,
  rewardPerSecond: string,
  rewardPerStakedToken: string,
  validTo: number,
  lastUpdated: number,
}

type Contract = {
  address: string,
  codeHash: string,
}

type StakingInfo = {
  lpTokenContract: Contract,
  pairContractAddress: string,
  adminAuthContract: Contract,
  queryAuthContract: Contract | null,
  totalStakedAmount: string,
  rewardTokens: RewardTokenInfo[],
}


```

**example use**

```js
const output = await batchQueryStakingInfo({
  queryRouterContractAddress: '[QUERY_ROUTER_CONTRACT_ADDRESS]',
  queryRouterCodeHash: '[QUERY_ROUTER_CODE_HASH]',
  stakingContracts: [{
    address: '[STAKING_1_ADDRESS]',
    codeHash: '[STAKING_1_CODE_HASH]',
  },
  {
    address: '[STAKING_2_ADDRESS]',
    codeHash: '[STAKING_2_CODE_HASH]',
  }]
})
console.log(output)
```
***console***
```md
Example coming soon...
```
