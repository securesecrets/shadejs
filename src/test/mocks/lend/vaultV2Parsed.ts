import {
  Vault,
  Vaults,
  VaultVersion,
} from '~/types/contracts/lend/vaultRegistry/model';
import { LendContractStatus } from '~/types/contracts/lend/vaultRegistry/response';

const vaultV2Parsed: Vault = {
  id: '1',
  vaultVersion: VaultVersion.V2,
  name: 'stkd-SCRT Vault',
  collateralAddress: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
  silkMaxAllowance: '850000',
  silkAllowanceUsed: '696262.021091',
  maxLtv: 0.5,
  collateral: {
    total: '3689766.59451',
    elastic: '3689766.59451',
    base: '3689766.59451',
    safe: '31325.698319',
    lastAccruedAt: new Date(1682191940000),
    oracleDelay: 600,
  },
  debt: {
    total: '696262.021091',
    base: '696262.021091',
    lastAccruedAt: new Date(1712343614000),
  },
  interestRate: {
    current: 0,
    target: 0,
    delta: 0.01,
    ratePerSecond: 0,
    lastUpdatedAt: new Date(1682191940000),
  },
  borrowFee: {
    current: 0,
    target: 0,
    delta: 0.01,
    ratePerSecond: 0,
    lastUpdatedAt: new Date(1682191940000),
  },
  liquidationFee: {
    discount: 0.1,
    minimumDebt: '100',
    daoShare: 0.2,
    callerShare: 0.1,
  },
  isProtocolOnly: false,
  status: LendContractStatus.NORMAL,
  openPositions: 183,
  totalPositions: 403,
  whitelist: [],
};

const vaultsV2Parsed: Vaults = {
  1: {
    id: '1',
    vaultVersion: VaultVersion.V2,
    name: 'stkd-SCRT Vault',
    collateralAddress: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
    silkMaxAllowance: '750000',
    silkAllowanceUsed: '700859.978232',
    maxLtv: 0.5,
    collateral: {
      total: '3740763.561877',
      elastic: '3740763.561877',
      base: '3740763.561877',
      safe: '31445.759105',
      lastAccruedAt: new Date(1682191940000),
      oracleDelay: 600,
    },
    debt: {
      total: '700859.978232',
      base: '700859.978232',
      lastAccruedAt: new Date(1710952834000),
    },
    interestRate: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1682191940000),
    },
    borrowFee: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1682191940000),
    },
    liquidationFee: {
      discount: 0.1,
      minimumDebt: '100',
      daoShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOnly: false,
    status: LendContractStatus.NORMAL,
    openPositions: 182,
    totalPositions: 389,
    whitelist: [],
  },
  2: {
    id: '2',
    vaultVersion: VaultVersion.V2,
    name: 'USDT Vault',
    collateralAddress: 'secret1wk5j2cntwg2fgklf0uta3tlkvt87alfj7kepuw',
    silkMaxAllowance: '700000',
    silkAllowanceUsed: '226463.25657',
    maxLtv: 0.85,
    collateral: {
      total: '350148.899892',
      elastic: '350148.899892',
      base: '350148.899892',
      safe: '73.431644',
      lastAccruedAt: new Date(1682191940000),
      oracleDelay: 600,
    },
    debt: {
      total: '227873.904431360577633957',
      base: '226847.073546658394171419',
      lastAccruedAt: new Date(1710952834000),
    },
    interestRate: {
      current: 0.01,
      target: 0.01,
      delta: 0.01,
      ratePerSecond: 0.000000000316887385,
      lastUpdatedAt: new Date(1696699251000),
    },
    borrowFee: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1682191940000),
    },
    liquidationFee: {
      discount: 0.05,
      minimumDebt: '100',
      daoShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOnly: false,
    status: LendContractStatus.NORMAL,
    openPositions: 15,
    totalPositions: 60,
    whitelist: [],
  },
};

export {
  vaultV2Parsed,
  vaultsV2Parsed,
};
