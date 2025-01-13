# ShadeJS  


<img src="./docs/public/shadejsBlackBackground.svg" alt="ShadeJS Logo" width="150" height="150" />
<p align="center">
  <img alt="npm" src="https://img.shields.io/npm/v/@shadeprotocol/shadejs" />
  <img alt="ci" style="margin-left: 0.3em" src="https://github.com/securesecrets/shadejs/actions/workflows/test.yml/badge.svg?branch=main" />
</p>

# What is ShadeJS?

ShadeJS is a typescript SDK for interacting with <a href="https://shadeprotocol.io/" target="_blank">Shade Protocol</a> and <a href="https://scrt.network/" target="_blank">Secret Network</a> smart contracts. It is designed as a wrapper for <a href="https://github.com/scrtlabs/secret.js" target="_blank">Secret.js</a> and abstracts the complexity of secret client management (for queries), as well as providing simple-to-use typescript interfaces for the inputs and outputs of contracts. In addition, it implements multi-query optimizations in order to obtain large on-chain data sets in a highly efficient manner.

<a href="https://shadejs.dev" target="_blank">Docs >></a> 

## Out of Scope
In its current state, ShadeJS does NOT include services to execute contracts via a <a href="https://secretjs.scrt.network/#integrations" target="_blank">Secret Signing Client.</a> This is because signing transactions requires a complex integration with multiple types of wallets. However, ShadeJS DOES include message creator functions for executions that can be easily imported into your project, so that you can call them from your own signing client manager.

## Contributing
Interested in contributing to this repository? Check our [Contributing Guide](./docs/CONTRIBUTING.md).


## Yarn
Yarn is the default package manager.

## Install 
```
$ yarn
```

## Test 
```
$ yarn test
```

## Build 
```
$ yarn build
```

## Docs
Docs will be available on a vitepress site. You can run the site locally with this command:
 
```
$ yarn docs:dev
```

## Building new version run for deployment via Github
```bash
yarn changeset
```


## Publish ShadeJs manually
```bash
yarn build
npm publish --tag beta
```
