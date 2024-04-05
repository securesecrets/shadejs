import {
  Vault,
  VaultType,
  Vaults,
} from '~/types/contracts/lend/model';
import { LendContractStatus } from '~/types/contracts/lend/response';

const vaultV1Parsed: Vault = {
  id: '1',
  vaultType: VaultType.V1,
  name: 'stkd-SCRT Vault',
  collateralAddress: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
  silkMaxAllowance: '0',
  silkAllowanceUsed: '11825.976211616265357496',
  maxLtv: 0.45,
  collateralAmount: '69822.082224544587516946',
  silkBorrowAmount: '12734.302492560037164766',
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
  openPositions: 32,
};

const vaultsV1Parsed: Vaults = {
  1: {
    id: '1',
    vaultType: VaultType.V1,
    name: 'stkd-SCRT Vault',
    collateralAddress: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
    silkMaxAllowance: '0',
    silkAllowanceUsed: '11825.976211616265357496',
    maxLtv: 0.45,
    collateralAmount: '69822.082224544587516946',
    silkBorrowAmount: '12734.302492560037164766',
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
    openPositions: 32,
  },
  2: {
    id: '2',
    vaultType: VaultType.V1,
    name: 'USDT Vault',
    collateralAddress: 'secret1wk5j2cntwg2fgklf0uta3tlkvt87alfj7kepuw',
    silkMaxAllowance: '0',
    silkAllowanceUsed: '0',
    maxLtv: 0.85,
    collateralAmount: '0',
    silkBorrowAmount: '0',
    interestRate: 0,
    borrowFee: 0,
    liquidationFee: {
      discount: 0.05,
      minimumDebt: '100',
      treasuryShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOwned: false,
    status: LendContractStatus.NORMAL,
    openPositions: 3,
  },
};

export {
  vaultV1Parsed,
  vaultsV1Parsed,
};
