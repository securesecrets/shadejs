import BigNumber from 'bignumber.js';
import { RouteV2 } from '~/types';
import {
  MsgCost,
  OracleQueryCost,
} from './oracleCosts';

function getStableOracleKeyGasCost(oracleKey: string | null): number {
  return oracleKey
    ? OracleQueryCost[oracleKey] || OracleQueryCost.DEFAULT
    : OracleQueryCost.DEFAULT;
}

function calculateSwapGasEstimation(route: Pick<RouteV2, 'path' | 'iterationsCount'>, legacy = false): BigNumber {
  const paths = route.path;
  return BigNumber(MsgCost.SECRET_SWAP_BASE)
    .plus((paths.length) * MsgCost.SECRET_SWAP_HOP)
    .plus(BigNumber(route.iterationsCount)
      .times(MsgCost.SECRET_SWAP_NEWTON_ITERATION))
    .plus(paths.reduce(
      (acc, path) => acc.plus(
        path.stableOracleKeys?.reduce(
          (
            oraclesCostAcc,
            key,
          ) => oraclesCostAcc.plus(getStableOracleKeyGasCost(key) * (legacy ? 2.5 : 1)),
          BigNumber(0),
        ) || 0,
      ),
      BigNumber(0),
    ))
    .integerValue(BigNumber.ROUND_CEIL);
}

export {
  calculateSwapGasEstimation,
};
