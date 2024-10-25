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

type ParsedGetMarketsResponse = ParsedPagination<Record<string, ParsedMarketResponse>>;

type BatchMoneyMarketGetMarket = {
  moneyMarketContractAddress: string,
  config: ParsedGetMarketsResponse,
  blockHeight: number,
}

type BatchMoneyMarketGetMarkets = BatchMoneyMarketGetMarket[];

type ParsedCollateralReponse = {
  token: {
    contractAddress: string,
    codeHash: string,
  },
  collateralAmount: string,
  decimals: number,
  maxInitialLtv: string,
  liquidationThreshold: string,
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
type PublicEvent = {
  timestamp: number,
  action: Record<string, any>
}

type PaginatedPublicEvent = {
  page: number,
  pageSize: number,
  totalPages: number,
  totalItems: number,
  data: PublicEvent[],
}

export type {
  Pagination,
  ContractAndPagination,
  ParsedPagination,
  ParsedConfigResponse,
  BatchMoneyMarketConfigs,
  ParsedMarketResponse,
  ParsedGetMarketsResponse,
  ParsedCollateralReponse,
  ParsedGetCollateralResponse,
  ParsedUserPositionResponse,
  BatchMoneyMarketGetMarkets,
  BatchMoneyMarketGetCollaterals,
  PublicEvent,
  PaginatedPublicEvent,
};
