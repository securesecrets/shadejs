type OraclePriceResponse = {
  key: string,
  data: {
    rate: string,
    last_updated_base: number,
    last_updated_quote: number,
  }
}

type OraclePricesResponse = OraclePriceResponse[]

export type {
  OraclePriceResponse,
  OraclePricesResponse,
};
