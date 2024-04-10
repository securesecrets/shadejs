import { LendContractStatus } from './response';

enum VaultType {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
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
    total: string, // aka "elastic"
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

type Vaults = {
  [id: string]: Vault,
}

type BatchVaultsItem = {
  vaultRegistryContractAddress: string,
  vaults: Vaults,
}

type BatchVaults = BatchVaultsItem[]

type VaultUserData = {
  vaultId: string,
  collateralAmount: string,
  debtAmount: string,
}

type VaultsUserData = {
  [vaultId: string]: VaultUserData,
}

type BatchVaultsUserDataItem = {
  vaultRegistryContractAddress: string,
  vaultsUserData: VaultsUserData | null,
}

type BatchVaultsUserData = BatchVaultsUserDataItem[]

type LendVaultRegistryContract = {
  address: string,
  codeHash: string,
  vaultType: VaultType,
};

export type {
  BatchVaults,
  Vault,
  Vaults,
  VaultUserData,
  VaultsUserData,
  BatchVaultsUserData,
  LendVaultRegistryContract,
};

export {
  VaultType,
};
