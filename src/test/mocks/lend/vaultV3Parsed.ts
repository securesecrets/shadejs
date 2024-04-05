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
  collateralAmount: '6.25687611',
  silkBorrowAmount: '143845.576549',
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
    collateralAmount: '6.14146888',
    silkBorrowAmount: '121848.577218',
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
    collateralAmount: '15.060663',
    silkBorrowAmount: '64.898575',
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
