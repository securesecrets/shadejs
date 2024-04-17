# Batch Query Examples

This page demonstrates how to query using a smart contract batch query router. The purpose of a query router is to combine multiple queries to one or more contracts into a single http request. This reduces load on the node infrastructure and is faster for retrieving data than would otherwise be obtained by individual contract queries.

The batch query function is generalized to work with any contract queries. Miscellaneous ShadeJS services already implement the batch query router, for example the <a href="./swap.html#pairs-info" target="_blank">Pairs Info Query</a>

By default, the batch query will process all queries in a single 
thread, i.e. using a single node to query. However, there are query
gas limitations controlled by the node provider that will throw errors when batch size is too large. When a batch size is provided as an input to the batch query, it will divide the batch into multi-threaded batches of batches of that size. There are certain batch sizes that have already been tested and are provided for specific ShadeJS services and recommended node settings, however your batch size will vary based on the type of query you are performing and your node provider settings.

## Batch Query

**input**

```ts
type BatchQueryParams = {
  id: string | number,
  contract: {
    address: string,
    codeHash: string,
  },
  queryMsg: any,
}

// NodeHealthValidationConfig is an optional property that is used to validate the 
// accuracy of the data in the batch response using an expected minimum 
// block height associated with the data. The query will be retried until 
// non-stale data is found (up to a max number of retries before error is thrown).
// The assumption is that you are working with a node cluster where one or more
// stale nodes are mixed into healthy nodes, and eventually the query will be 
// tried with a healthy node and meet the minimum block height threshold.
// onStaleNodeDetected is a callback function for when stale nodes are found. This 
// can be useful for error/node monitoring services.
type NodeHealthValidationConfig = {
  minBlockHeight: number, // data must come from this block height or newer block
  maxRetries: number,
  onStaleNodeDetected?: () => void 
}


async function batchQuery({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queries,
  batchSize, // defaults to all queries in single batch
  nodeHealthValidationConfig,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  queries: BatchQueryParams[],
  batchSize?: number, 
  nodeHealthValidationConfig?: NodeHealthValidationConfig,
}): Promise<BatchQueryParsedResponse> 
```

**output**

```ts
type BatchQueryParsedResponse = BatchQueryParsedResponseItem[]

enum BatchItemResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

type BatchQueryParsedResponseItem = {
  id: string | number,
  response: any,
  status?: BatchItemResponseStatus
  blockHeight: number, // the block height that the data is from
}


```

**example use**

```ts
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
  blockHeight: 123456789,
}];
```