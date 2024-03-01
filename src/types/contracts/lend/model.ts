type Vault = {
  id: string,
  collateralAddress: string,
  silkMaxAllowance: string,
  silkAllowanceUsed: string,
  interestRate: string,
  fee: string,
  maxLtv: string,
  totalDeposited: string,
  totalBorrow: string,
  isProtocolOwned: boolean,
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

export type {
  BatchVaults,
  Vault,
  Vaults,
  VaultUserData,
  VaultsUserData,
  BatchVaultsUserData,
};
