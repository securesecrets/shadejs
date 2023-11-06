# Batch Query Examples

This page demonstrates how to query using a smart contract batch query router. The purposes of a query router is to combine multiple queries to one or more contracts into a single http request. This reduces load on the node infrastructure and is faster for retrieving data than would otherwise be obtained by individual contract queries.

The batch query function is generalized to work with any contract queries. Miscellaneous ShadeJS services already implement the batch query router, for example the <a href="/swap.html#pairs-info" target="_blank">Pairs Info Query</a>


## Performance 
All of the following results are run with 500 total queries

| Batch Size | RPC Queries | Time  | Success |
|------------|-------------|-------|---------|
| N/A        | 500         | 5.56s | 26.6%   |
| 5          | 100         | 6.51s | 100%    |
| 10         | 50          | 9.24s | 100%    |
| 25         | 20          | 7.27s | 100%    |
| 50         | 10          | 8.78s | 100%    |
| 100        | 5           | 7.72s | 100%    |

::: warning
This testing was completed with a limited sample size and optimal batch size has 
not yet determined. There is also an unknown variable of the quality of the infrastructure you would be using to perform these queries. It is encouraged to perform your own optimization testing when working with a batch query router.
:::
## Batch Query

**input**

```js
type BatchQuery = {
  id: string | number,
  contract: {
    address: string,
    codeHash: string,
  },
  queryMsg: any,
}

async function batchQuery({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queries,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  queries: BatchQuery[]
}): Promise<BatchQueryParsedResponse> 
```

**output**

```js
type BatchQueryParsedResponse = BatchQueryParsedResponseItem[]

type BatchQueryParsedResponseItem = {
  id: string | number,
  response: any,
}


```

**example use**

```js
const output = await batchQuery({
  contractAddress: '[QUERY_ROUTER_CONTRACT_ADDRESS]',
  codeHash: '[QUERY_ROUTER_CODE_HASH]',
  queries: [{
    id: 1,
    contract: {
      address: 'PAIR_CONTRACT_ADDRESS',
      codeHash: 'PAIR_CODE_HASH',
    },
    queryMsg: { get_config:{}},
  }],
})

console.log(output) 
```
***console***
```md
[{
  id: 1,
  response: {
    get_config: {
      factory_contract: {
        address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
        code_hash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
      },
      lp_token: {
        address: 'secret1l2u35dcx2a4wyx9a6lxn9va6e66z493ycqxtmx',
        code_hash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
      },
      staking_contract: {
        address: 'secret16h5sqd79x43wutne8ge3pdz3e3lngw62vy5lmr',
        code_hash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
      },
      pair: [
        {
          custom_token: {
            contract_addr: 'secret19e75l25r6sa6nhdf4lggjmgpw0vmpfvsw5cnpe',
            token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
          },
        },
        {
          custom_token: {
            contract_addr: 'secret16vjfe24un4z7d3sp9vd0cmmfmz397nh2njpw3e',
            token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
          },
        },
        true,
      ],
      custom_fee: {
        shade_dao_fee: {
          nom: 500,
          denom: 1000000,
        },
        lp_fee: {
          nom: 500,
          denom: 1000000,
        },
      },
    },
  },
}];
```