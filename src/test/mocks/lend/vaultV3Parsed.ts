import {
  Vault,
  Vaults,
  VaultVersion,
} from '~/types/contracts/lend/vaultRegistry/model';
import { LendContractStatus } from '~/types/contracts/lend/vaultRegistry/response';

const vaultV3Parsed: Vault = {
  id: '1',
  vaultVersion: VaultVersion.V3,
  name: 'WBTC Vault',
  collateralAddress: 'secret1guyayjwg5f84daaxl7w84skd8naxvq8vz9upqx',
  silkMaxAllowance: '300000',
  silkAllowanceUsed: '143845.576549',
  maxLtv: 0.8,
  collateral: {
    total: '6.25687611',
    elastic: '2.438346496108978355',
    base: '2.438346496108978355',
    safe: '3.818529613891021645',
    lastAccruedAt: new Date(1710183488000),
    oracleDelay: 600,
  },
  debt: {
    total: '143845.576549',
    base: '143845.576549',
    lastAccruedAt: new Date(1712343800000),
  },
  interestRate: {
    current: 0,
    target: 0,
    delta: 0.01,
    ratePerSecond: 0,
    lastUpdatedAt: new Date(1710183488000),
  },
  borrowFee: {
    current: 0,
    target: 0,
    delta: 0.01,
    ratePerSecond: 0,
    lastUpdatedAt: new Date(1710183488000),
  },
  liquidationFee: {
    discount: 0.1,
    minimumDebt: '100',
    daoShare: 0.2,
    callerShare: 0.1,
  },
  isProtocolOnly: false,
  status: LendContractStatus.NORMAL,
  openPositions: 20,
  totalPositions: 27,
  whitelist: [],
};

const vaultsV3Parsed: Vaults = {
  1: {
    id: '1',
    vaultVersion: VaultVersion.V3,
    name: 'WBTC Vault',
    collateralAddress: 'secret1guyayjwg5f84daaxl7w84skd8naxvq8vz9upqx',
    silkMaxAllowance: '150000',
    silkAllowanceUsed: '121848.577218',
    maxLtv: 0.8,
    collateral: {
      total: '6.14146888',
      elastic: '2.114626673839308796',
      base: '2.114626673839308796',
      safe: '4.026842206160691204',
      lastAccruedAt: new Date(1710183488000),
      oracleDelay: 600,
    },
    debt: {
      total: '121848.577218',
      base: '121848.577218',
      lastAccruedAt: new Date(1710953123000),
    },
    interestRate: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1710183488000),
    },
    borrowFee: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1710183488000),
    },
    liquidationFee: {
      discount: 0.1,
      minimumDebt: '100',
      daoShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOnly: false,
    status: LendContractStatus.NORMAL,
    openPositions: 21,
    totalPositions: 23,
    whitelist: [],
  },
  2: {
    id: '2',
    vaultVersion: VaultVersion.V3,
    name: 'TIA Vault',
    collateralAddress: 'secret1s9h6mrp4k9gll4zfv5h78ll68hdq8ml7jrnn20',
    silkMaxAllowance: '50000',
    silkAllowanceUsed: '64.898575',
    maxLtv: 0.55,
    collateral: {
      total: '15.060663',
      elastic: '5.699935097070694443',
      base: '5.699935097070694443',
      safe: '9.360727902929305557',
      lastAccruedAt: new Date(1710183538000),
      oracleDelay: 600,
    },
    debt: {
      total: '64.898575',
      base: '64.898575',
      lastAccruedAt: new Date(1710953123000),
    },
    interestRate: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1710183538000),
    },
    borrowFee: {
      current: 0,
      target: 0,
      delta: 0.01,
      ratePerSecond: 0,
      lastUpdatedAt: new Date(1710183538000),
    },
    liquidationFee: {
      discount: 0.1,
      minimumDebt: '100',
      daoShare: 0.2,
      callerShare: 0.1,
    },
    isProtocolOnly: false,
    status: LendContractStatus.NORMAL,
    openPositions: 2,
    totalPositions: 2,
    whitelist: [],
  },
};

export {
  vaultV3Parsed,
  vaultsV3Parsed,
};
