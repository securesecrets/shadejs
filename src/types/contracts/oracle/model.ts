enum OracleErrorType {
  STALE_DERIVATIVE_RATE = 'stale derivative rate',
  UNKNOWN = 'unknown'
}

type ParsedOraclePriceResponse = {
  oracleKey: string,
  rate?: string,
  lastUpdatedBase?: number,
  lastUpdatedQuote?: number,
  error?: {
    type: OracleErrorType,
    msg: any,
  },
  blockHeight?: number // block height is only available when using a batch query router
}

type ParsedOraclePricesResponse = {
  [oracleKey: string]: ParsedOraclePriceResponse
}

export type {
  ParsedOraclePriceResponse,
  ParsedOraclePricesResponse,
};

export {
  OracleErrorType,
};
