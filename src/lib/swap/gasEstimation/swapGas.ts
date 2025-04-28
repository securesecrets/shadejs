import BigNumber from 'bignumber.js';
import {
  Route,
} from '~/types';
import {
  MsgCost,
  OracleQueryCost,
  SwapType,
} from '~/lib/swap/gasEstimation/oracle-costs';

function getStableOracleKeyGasCost(oracleKey: string | null): number {
  return oracleKey
    ? OracleQueryCost[oracleKey] || OracleQueryCost.DEFAULT
    : OracleQueryCost.DEFAULT;
}

function calculateSwapGasEstimation(route: Route): BigNumber {
  const paths = route.path;
  return BigNumber(MsgCost.SECRET_SWAP_BASE)
    .plus((paths.length - 1) * 30_000) // to do: be removed after validating factory refactor
    .plus(paths.reduce(
      (acc, path) => acc + (
        (path.poolType === SwapType.STABLE)
          ? MsgCost.SECRET_SWAP_STABLE
          : MsgCost.SECRET_SWAP_CONSTANT
      ),
      0,
    ))
    .plus(BigNumber(route.iterationsCount)
      .times(MsgCost.SECRET_SWAP_NEWTON_ITERATION))
    .plus(paths.reduce(
      (acc, path) => acc.plus(
        path.stableOracleKeys?.reduce(
          (
            oraclesCostAcc,
            key,
          ) => oraclesCostAcc.plus(getStableOracleKeyGasCost(key)),
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
