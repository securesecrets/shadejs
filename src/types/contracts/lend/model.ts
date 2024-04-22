import { LendContractStatus } from './response';

enum VaultVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
}

type Vault = {
  id: string,
  vaultVersion: VaultVersion,
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
    oracleDelay: number,
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
  whitelist: string[],
}

type Vaults = {
  [id: string]: Vault,
}

type BatchVaultsItem = {
  vaultRegistryContractAddress: string,
  vaults: Vaults,
  blockHeight: number,
}

type BatchVaults = BatchVaultsItem[]

type LendVaultRegistryContract = {
  address: string,
  codeHash: string,
  vaultVersion: VaultVersion,
};

export type {
  BatchVaults,
  Vault,
  Vaults,
  LendVaultRegistryContract,
};

export {
  VaultVersion,
};
