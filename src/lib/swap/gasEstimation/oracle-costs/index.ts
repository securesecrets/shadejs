import OracleQueryCostRaw from './oracles.json';

const MsgCost = {
  SECRET_SWAP_CONSTANT: 300_000,
  SECRET_SWAP_STABLE: 200_000,
  SECRET_SWAP_NEWTON_ITERATION: 2_250,
  SECRET_SWAP_BASE: 210_000,
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
