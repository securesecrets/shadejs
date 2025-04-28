import BigNumber from 'bignumber.js';

interface ReverseTradeResult {
  newPool0: BigNumber,
  newPool1: BigNumber,
  tradeInput: BigNumber,
  tradeReturn: BigNumber,
  lpFeeAmount: BigNumber,
  shadeDaoFeeAmount: BigNumber,
  iterationsCount: number,
}

interface TradeResult {
  newPool0: BigNumber,
  newPool1: BigNumber,
  tradeReturn: BigNumber,
  lpFeeAmount: BigNumber,
  shadeDaoFeeAmount: BigNumber,
  priceImpact: BigNumber,
  iterationsCount: number,
}

enum StableswapCalculationErrorType {
  LIQUIDITY = 'liquidity error',
  MIN_TRADE_SIZE = 'min trade size',
}

export type {
  TradeResult,
  ReverseTradeResult,
  StableswapCalculationErrorType,
};
