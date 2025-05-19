import BigNumber from 'bignumber.js';

interface ReverseTradeResult {
  newPool0: BigNumber,
  newPool1: BigNumber,
  tradeInput: BigNumber,
  tradeReturn: BigNumber,
  lpFeeAmount: BigNumber,
  shadeDaoFeeAmount: BigNumber,
}

interface TradeResult {
  newPool0: BigNumber,
  newPool1: BigNumber,
  tradeReturn: BigNumber,
  lpFeeAmount: BigNumber,
  shadeDaoFeeAmount: BigNumber,
}

type TradeResultV2 = TradeResult & {
  priceImpact: BigNumber,
  iterationsCount: number,
}

type ReverseTradeResultV2 = ReverseTradeResult & {
  iterationsCount: number,
}

enum StableswapCalculationErrorType {
  LIQUIDITY = 'liquidity error',
  MIN_TRADE_SIZE = 'min trade size',
}

export type {
  TradeResult,
  ReverseTradeResult,
  TradeResultV2,
  ReverseTradeResultV2,
  StableswapCalculationErrorType,
};
