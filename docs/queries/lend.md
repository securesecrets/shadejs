# Lend Examples

This page demonstrates how to query the Shade Lend contracts.

## All Vaults
Query multiple vault registry contracts and return info about all the vaults in each registry.

**input**
```ts
async function queryVaults({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: LendVaultRegistryContract[]
}): Promise<BatchVaults>

type LendVaultRegistryContract = {
  address: string,
  codeHash: string,
  vaultType: VaultType,
};

enum VaultType {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}
```

**output**

```ts

type BatchVaults = BatchVaultsItem[]

type BatchVaultsItem = {
  vaultRegistryContractAddress: string,
  vaults: Vaults,
}

type Vaults = {
  [id: string]: Vault,
}

type Vault = {
  id: string,
  vaultType: VaultType,
  name: string,
  collateralAddress: string,
  silkMaxAllowance: string,
  silkAllowanceUsed: string,
  maxLtv: number,
  collateral: {
    total: string,
    elastic: string,
    base: string,
    safe: string,
    lastAccruedAt: Date,
  },
  debt: {
    total: string,
    base: string,
    lastAccruedAt: Date,
  }
  interestRate: {
    current: number,
    target: number,
    delta: number,
    ratePerSecond: number,
    lastUpdatedAt: Date,
  },
  borrowFee: {
    current: number,
    target: number,
    delta: number,
    ratePerSecond: number,
    lastUpdatedAt: Date,
  },
  liquidationFee: {
    discount: number,
    minimumDebt: string,
    daoShare: number,
    callerShare: number
  }
  isProtocolOnly: boolean,
  status: LendContractStatus,
  openPositions: number,
  totalPositions: number,
}

enum LendContractStatus {
  NORMAL = 'normal',
  DEPRECATED = 'deprecated',
  FROZEN = 'frozen'
}
```

## Single Vault
Query info for a single vault.

**input**
```ts
async function queryVault({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultType,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultType: VaultType,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}): Promise<Vault>
```

**output**

See "Vault" type in the all vaults output.