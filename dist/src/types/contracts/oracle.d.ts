import BigNumber from 'bignumber.js';
type OraclePriceResponse = {
    key: string;
    data: {
        rate: string;
        last_updated_base: number;
        last_updated_quote: number;
    };
};
type OraclePricesResponse = OraclePriceResponse[];
type ParsedOraclePriceResponse = {
    oracleKey: string;
    rate: BigNumber;
    lastUpdatedBase: number;
    lastUpdatedQuote: number;
};
type ParsedOraclePricesResponse = {
    [oracleKey: string]: ParsedOraclePriceResponse;
};
export { OraclePriceResponse, OraclePricesResponse, ParsedOraclePriceResponse, ParsedOraclePricesResponse, };
