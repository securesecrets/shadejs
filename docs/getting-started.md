# Getting Started

## Installation

::: code-group

```sh [npm]
$ npm add TBD_LIBRARY_NAME
```

```sh [yarn]
$ yarn add TBD_LIBRARY_NAME
```
:::

## Example Query

### Standard Syntax
```js
/*
* Queries the configuration for the swap pair
*/
async function queryPairConfig({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string, // recommended for fastest query performance
  lcdEndpoint?: string, // defaults to public endpoint
  chainId?: string, // defaults to mainnet
}): Promise<PairConfig>
```
::: warning
The LCD endpoint is an optional property. We provide one as a default inside ShadeJS to get you started quickly on Secret Network mainnet using a public API. It is still recommended that you provide your own because performance of the default endpoint is not guaranteed.
:::
```js
try{
  const output = await queryPairConfig({
    contractAddress: '[PAIR_CONTRACT_ADDRESS]',
  })
 // do something with the successful output
} catch {
  // do something with the error
}
```
### RxJS Syntax

Under the hood, ShadeJS uses <a href="https://rxjs.dev/" target="_blank">RxJS</a> as an observables library to build asynchronous functions. The async functions provided for interacting with the blockchain have an RxJS version as an alternative, and users can decide which one to use based on their preference. 
::: tip
The standard async/await syntax funcion is designed as a simple wrapper function around the RxJS, so either way you are calling the RxJS version!
:::

```js
/*
* Queries the configuration for the swap pair
*/
function queryPairConfig$({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string, 
  lcdEndpoint?: string,
  chainId?: string,
}): Observable<PairConfig>
```
```js
queryPairConfig$({
  contractAddress: '[PAIR_CONTRACT_ADDRESS]',
}).subscribe({
  next: () => {
    // do something with the successful output
  },
  error: () => {
  // do something with the error
  }
})

```

