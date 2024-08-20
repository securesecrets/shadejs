type Pagination = {
  page: number,
  page_size: number,
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
    linear?: {
      base: string,
      slope: string,
    },
    piecewise_linear?: {
      base: string,
      slope1: string,
      slope2: string,
      optimalUtilisation: string,
    }
  },
  loanableAmount: string,
  lentAmount: string,
  lifetimeInterestPaid: string,
  lifetimeInterestOwed: string,
  interestPerUtoken: string,
  lastInterestAccrued: Date,
  maxSupplyAmount: string,
  flashLoanInterest: string,
  supplyEnabled: boolean,
  borrowEnabled: boolean,
  repayEnabled: boolean,
  liquidationEnabled: boolean,
  interestAccrualEnabled: boolean,
}

export type {
  Pagination,
};
