# shadejs

## 1.6.2

### Patch Changes

- a079550: change from individual validator queries to batch data

## 1.6.1

### Patch Changes

- 23bbb4c: change secret endpoints to new api after upgrade

## 1.6.0

### Minor Changes

- 63b774e: upgrade secretjs which includes breaking changes for the pre-upgraded version of secret network

### Patch Changes

- f79e968: SecretJs Bump

## 1.5.10

### Patch Changes

- ec0d62a: add batch query for shade staking

## 1.5.9

### Patch Changes

- bf1571a: patched a parsing bug where contract address was being used for code hash

## 1.5.8

### Patch Changes

- fee9669: fix withdraw collateral msg

## 1.5.7

### Patch Changes

- ba06893: rectified the feature with the contract

## 1.5.6

### Patch Changes

- fae6c9c: Money market interface, pending tests and docs

## 1.5.5

### Patch Changes

- 74393f0: query at a specific block height

## 1.5.4

### Patch Changes

- ed5f747: snip20 transaction history using a batch query
- 1cc4633: snip20 transfer history query

## 1.5.3

### Patch Changes

- 9cacf49: remove available shd from dshd query

## 1.5.2

### Patch Changes

- 873366b: patching a missing export

## 1.5.1

### Patch Changes

- ac69a0f: add missing exports for silk basket query

## 1.5.0

### Minor Changes

- c49dea7: silk basket query

## 1.4.1

### Patch Changes

- b41191a: lend stability pool query
- 2136ce7: lend contracts in docs

## 1.4.0

### Minor Changes

- a8b185f: lend vault queries

## 1.3.0

### Minor Changes

- 555f33e: add node health validation to query router and functions using the query router

## 1.2.0

### Minor Changes

- 34ce7af: added apy calculations for derivatives and shade staking query interface

### Patch Changes

- c4d8927: Batch query can split queries to avoid hitting query gas limits

## 1.1.7

### Patch Changes

- 2bc844c: clarity around price impact error

## 1.1.6

### Patch Changes

- e500c6f: Added stkd-scrt messages and services, and refactored dSHD names to derivativeShd
- 8566226: update the public node endpoint

## 1.1.5

### Patch Changes

- 80271e5: Fix umd exports and removed polyfill

## 1.1.4

### Patch Changes

- 031fa8d: export type for reward tokens, update test description

## 1.1.3

### Patch Changes

- 5c24f98: Fix build issues on client side applications

## 1.1.2

### Patch Changes

- 56713e2: missed more exports on the derivative shd pr

## 1.1.1

### Patch Changes

- 13d0684: Missed an export for the shade derviative implementation'

## 1.1.0

### Minor Changes

- f6a4f4f: Added dSHD contract interface and query services TESTNET ONLY

### Patch Changes

- fb41cf0: Corrected some typographical errors

## 1.0.9

### Patch Changes

- 4f74875: batch query error handling and batch query for oracle prices

## 1.0.8

### Patch Changes

- 1344e21: snip20 token info batch query

## 1.0.7

### Patch Changes

- 066773d: handle null stableswap price ratio
- 51ff8cf: fix unbound function in stableswap math

## 1.0.6

### Patch Changes

- 41c01ba: update typescript for batch query params which is causing build issues in a front end app

## 1.0.5

### Patch Changes

- b55aadb: update the reward token staking response type since we had a duplicate type
- 9b246b0: Batch Pair Config Queries
- 9b5d199: fix duplicate type exports for contract data

## 1.0.4

### Patch Changes

- af89f58: type exports added

## 1.0.3

### Patch Changes

- 352f79d: add missing types field in package.json#exports

## 1.0.2

### Patch Changes

- 46a970c: update shadejs image background and fix links

## 1.0.1

### Patch Changes

- 2eb2d00: update to vitepress build and package description/logo"

## 1.0.0

### Major Changes

- e0db0e2: initial release of shadejs
