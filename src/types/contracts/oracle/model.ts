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
  }
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
