type Pagination = {
  page: number,
  page_size: number,
}

type ContractAndPagination = {
  address: string,
  codeHash: string,
  page?: number,
  pageSize?: number,
}

type ParsedPagination<T> = {
  page: number,
  pageSize: number,
  totalPages: number,
  totalItems: number,
  data: T,
}

type ParsedConfigResponse = {
  adminAuth: {
    contractAddress: string
    codeHash: string,
  },
  queryAuth: {
    contractAddress: string,
    codeHash: string,
  },
  oracle: {
    contractAddress: string,
    codeHash: string,
  },
  feeCollector: string,
  lTokenId: number,
  lTokenCodeHash: string,
  lTokenBlockchainAdmin: string,
  supplyEnabled: boolean,
  borrowEnabled: boolean,
  repayEnabled: boolean,
  liquidationEnabled: boolean,
  interestAccrualEnabled: boolean,
  collateralDepositEnabled: boolean,
}

type BatchMoneyMarketConfig = {
  moneyMarketContractAddress: string,
  config: ParsedConfigResponse,
  blockHeight: number,
}

type BatchMoneyMarketConfigs = BatchMoneyMarketConfig[];

type ParsedMarketResponse = {
  marketToken: {
    contractAddress: string,
    codeHash: string,
  },
  lToken: {
    contractAddress: string,
    codeHash: string,
  },
  decimals: number,
  oracleKey: string,
  interest: {
    base: string,
    slope1: string,
    slope2?: string,
    optimalUtilisation?: string,
  },
  loanableAmount: string,
  lentAmount: string,
  lifetimeInterestPaid: string,
  lifetimeInterestOwed: string,
  interestPerUtoken: string,
  lastInterestAccrued: Date,
  maxSupplyAmount: string,
  daoInterestFee: string,
  flashLoanInterest: string,
  supplyEnabled: boolean,
  borrowEnabled: boolean,
  repayEnabled: boolean,
  liquidationEnabled: boolean,
  interestAccrualEnabled: boolean,
}

type ParsedGetVaultsResponse = ParsedPagination<Record<string, ParsedMarketResponse>>;

type BatchMoneyMarketGetMarket = {
  moneyMarketContractAddress: string,
  config: ParsedGetVaultsResponse,
  blockHeight: number,
}

type BatchMoneyMarketGetVaults = BatchMoneyMarketGetMarket[];

type ParsedCollateralReponse = {
  token: {
    contractAddress: string,
    codeHash: string,
  },
  collateralAmount: string,
  decimals: number,
  maxInitialLtv: string,
  publicLiquidationThreshold: string,
  privateLiquidationThreshold: string,
  liquidationDiscount: string,
  oracleKey: string,
  depositEnabled: boolean,
  liquidationEnabled: boolean,
}

type ParsedGetCollateralResponse = ParsedPagination<Record<string, ParsedCollateralReponse>>;

type BatchMoneyMarketGetCollateral = {
  moneyMarketContractAddress: string,
  config: ParsedGetCollateralResponse,
  blockHeight: number,
}

type BatchMoneyMarketGetCollaterals = BatchMoneyMarketGetCollateral[];

type ParsedCalculatedUserCollateralReponse = {
    [token: string]: {
      token: string,
      amount: string,
      price: string,
      value: string,
    }
}

type ParsedCalculatedUserDebtResponse = {
  [token: string]: {
    token: string,
    price: string,
    principal: string,
    principalValue: string,
    interestAccrued: string,
    interestAccruedValue: string,
  }
}

type ParsedUserPositionResponse = {
  id: string,
  collateral: ParsedCalculatedUserCollateralReponse,
  debt: ParsedCalculatedUserDebtResponse,
  totalCollateralValue: string,
  totalPrincipalValue: string,
  totalInterestAccruedValue: string,
  loanMaxPoint: string,
  loanLiquidationPoint: string,
}

// New types for public events
type PublicLog = {
  timestamp: Date,
  action: Record<string, any>
}

type PaginatedPublicLogs = {
  page: number,
  pageSize: number,
  totalPages: number,
  totalItems: number,
  data: PublicLog[],
}

type RewardPool = {
    rewardPoolId: string,
    amount: string,
    token: string,
    start: string,
    end: string,
    rate: string,
}

type RewardPoolResponse = {
    id: string,
    amount: string,
    token: string,
    start: string,
    end: string,
    rate: string,
}

type ParsedRewardPoolsResponse = {
    vault: string,
    blockHeight: number,
    rewardPools: RewardPool[],
}

export type {
  Pagination,
  ContractAndPagination,
  ParsedPagination,
  ParsedConfigResponse,
  BatchMoneyMarketConfigs,
  ParsedMarketResponse,
  ParsedGetVaultsResponse,
  ParsedCollateralReponse,
  ParsedGetCollateralResponse,
  ParsedUserPositionResponse,
  BatchMoneyMarketGetVaults,
  BatchMoneyMarketGetCollaterals,
  PublicLog,
  PaginatedPublicLogs,
  RewardPool,
  RewardPoolResponse,
  ParsedRewardPoolsResponse,
};
