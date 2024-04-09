import {
  Vault,
  Vaults,
  VaultType,
} from '~/types/contracts/lend/model';
import { LendContractStatus } from '~/types/contracts/lend/response';

const vaultV3Parsed: Vault = {
  id: '1',
  vaultType: VaultType.V3,
  name: 'WBTC Vault',
  collateralAddress: 'secret1guyayjwg5f84daaxl7w84skd8naxvq8vz9upqx',
  silkMaxAllowance: '300000',
  silkAllowanceUsed: '143845.576549',
  maxLtv: 0.8,
  collateral: {
    total: '6.25687611',
    elastic: '2.438346496108978355',
    base: '2.438346496108978355',
  },
  debt: {
    total: '143845.576549',
    base: '143845.576549',
  },
  interestRate: 0,
  borrowFee: 0,
  liquidationFee: {
    discount: 0.1,
    minimumDebt: '100',
    treasuryShare: 0.2,
    callerShare: 0.1,
  },
  isProtocolOwned: false,
  status: LendContractStatus.NORMAL,
  openPositions: 20,
};

const vaultsV3Parsed: Vaults = {
  1: {
    id: '1',
    vaultType: VaultType.V3,
    name: 'WBTC Vault',
    collateralAddress: 'secret1guyayjwg5f84daaxl7w84skd8naxvq8vz9upqx',
    silkMaxAllowance: '150000',
    silkAllowanceUsed: '121848.577218',
    maxLtv: 0.8,
    collateral: {
      total: '6.14146888',
      elastic: '2.114626673839308796',
      base: '2.114626673839308796',
    },
    debt: {
      total: '121848.577218',
      base: '121848.577218',
    },
    interestRate: 0,
    borrowFee: 0,
    liquidationFee: {
      discount: 0.1,
      minimumDebt: '100',
      treasuryShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOwned: false,
    status: LendContractStatus.NORMAL,
    openPositions: 21,
  },
  2: {
    id: '2',
    vaultType: VaultType.V3,
    name: 'TIA Vault',
    collateralAddress: 'secret1s9h6mrp4k9gll4zfv5h78ll68hdq8ml7jrnn20',
    silkMaxAllowance: '50000',
    silkAllowanceUsed: '64.898575',
    maxLtv: 0.55,
    collateral: {
      total: '15.060663',
      elastic: '5.699935097070694443',
      base: '5.699935097070694443',
    },
    debt: {
      total: '64.898575',
      base: '64.898575',
    },
    interestRate: 0,
    borrowFee: 0,
    liquidationFee: {
      discount: 0.1,
      minimumDebt: '100',
      treasuryShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOwned: false,
    status: LendContractStatus.NORMAL,
    openPositions: 2,
  },
};

export {
  vaultV3Parsed,
  vaultsV3Parsed,
};
