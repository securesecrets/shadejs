import { LendContractStatus } from './response';

enum VaultType {
  V1 = 'v1', // deprecated
  V2 = 'v2', // we call this "V1" internally
  V3 = 'v3', // we call this "V2" internally
}

type Vault = {
  id: string,
  vaultType: VaultType,
  name: string,
  collateralAddress: string,
  silkMaxAllowance: string,
  silkAllowanceUsed: string,
  maxLtv: number,
  totalCollateral: string,
  totalSilkBorrowed: string,
  interestRate: number,
  borrowFee: number,
  liquidationFee: {
    discount: number,
    minimumDebt: string,
    treasuryShare: number,
    callerShare: number
  }
  isProtocolOwned: boolean,
  status: LendContractStatus,
  openPositions: number,
}

type Vaults = {
  [id: string]: Vault,
}

type BatchVaultsItem = {
  vaultContractAddress: string,
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
  vaultContractAddress: string,
  vaultsUserData: VaultsUserData | null,
}

type BatchVaultsUserData = BatchVaultsUserDataItem[]

type LendVaultContract = {
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
  LendVaultContract,
};

export {
  VaultType,
};
