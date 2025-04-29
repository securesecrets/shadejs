import OracleQueryCostRaw from './oracles.json';

const MsgCost = {
  SECRET_SWAP_HOP: 345_000,
  SECRET_SWAP_NEWTON_ITERATION: 2_250,
  SECRET_SWAP_BASE: 300_000,
};

const OracleQueryCost = OracleQueryCostRaw as Record<string, number>;

enum SwapType {
  STABLE = 'stable',
  CONSTANT_PRODUCT = 'constant_product'
}

export {
  MsgCost,
  SwapType,
  OracleQueryCost,
};
