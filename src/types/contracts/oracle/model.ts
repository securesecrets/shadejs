type ParsedOraclePriceResponse = {
  oracleKey: string,
  rate: string,
  lastUpdatedBase: number,
  lastUpdatedQuote: number,
}
type ParsedOraclePricesResponse = {
  [oracleKey: string]: ParsedOraclePriceResponse
}

export type {
  ParsedOraclePriceResponse,
  ParsedOraclePricesResponse,
};
