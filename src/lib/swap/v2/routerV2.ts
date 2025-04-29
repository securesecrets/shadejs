import { RouteV2 } from '~/types';
import BigNumber from 'bignumber.js';
import { type SwapRoutesCalculator } from './routeCalculator';

function compareRoutes(
  a: RouteV2,
  b: RouteV2,
  isReverse: boolean,
) {
  const aAmountToCompare = isReverse ? a.inputAmount : a.quoteOutputAmount;
  const bAmountToCompare = isReverse ? b.inputAmount : b.quoteOutputAmount;
  if (aAmountToCompare.isGreaterThan(bAmountToCompare)) {
    return -1; // sort a before b
  }
  if (aAmountToCompare.isLessThan(bAmountToCompare)) {
    return 1; // sort a after b
  }
  // when amounts are the same, optimize for largest shade dao fee or least price impact
  return b.quoteShadeDaoFee.plus(b.quoteLPFee)
    .comparedTo(a.quoteShadeDaoFee.plus(a.quoteLPFee))
    || a.priceImpact
      .comparedTo(b.priceImpact) || 0;
}

/**
 * retrieves all potential route options and the outputs of each route.
 * returns an array of routes in the order that will give the highest quoted
 * output amount
 * An instance of SwapRoutesCalculator should be reused
 * during the lifecycle of the batchPairs and tokens for best results
 */
function getRoutes({
  inputTokenAmount,
  startingTokenAddress,
  endingTokenAddress,
  maxHops,
  maxRoutes = Number.MAX_SAFE_INTEGER,
  isReverse = false,
  compareRoutesFn = compareRoutes,
  swapRoutesCalculator,
}: {
  inputTokenAmount: BigNumber,
  startingTokenAddress: string,
  endingTokenAddress: string,
  maxHops: number,
  maxRoutes?: number,
  isReverse: boolean,
  swapRoutesCalculator: SwapRoutesCalculator,
  compareRoutesFn?: (a: RouteV2, b: RouteV2, isReverse: boolean) => number,
}): RouteV2[] {
  const routes = swapRoutesCalculator.calculateRoutes({
    startingTokenAddress,
    endingTokenAddress,
    inputTokenAmount,
    maxHops,
    isReverse,
  });
  if (!isReverse) {
    return routes.sort(
      (a: RouteV2, b: RouteV2) => compareRoutesFn(a, b, false),
    ).slice(0, maxRoutes);
    // eslint-disable-next-line no-else-return
  } else {
    // if all reverse calculations returned errors, then return an empty array
    // since there are no possible reverse paths. Common cause of no reverse paths
    // is not enough liquidity
    if (routes.length === 0) {
      return [];
    }
    // finds the cheapest of the returned routes
    const cheapestReverseRoute = routes.sort(
      (a: RouteV2, b: RouteV2) => compareRoutesFn(a, b, true),
    ).pop()!;

    const cheapestReverseInputAmount = cheapestReverseRoute.inputAmount;

    // forward calculates the costs/outputs of each of the route using a new
    // fixed input (which was the output of the reverse calculation)
    const forwardRoutes = getRoutes({
      inputTokenAmount: cheapestReverseInputAmount,
      startingTokenAddress,
      endingTokenAddress,
      maxHops,
      maxRoutes,
      swapRoutesCalculator,
      compareRoutesFn,
      isReverse: false,
    });

    return forwardRoutes
      // to prevent rounding issues when calculating reverse -> forward
      // on the same path, we will replace the cheapest reverse calculation in the list
      // of forward calculations so that the user controlled output doesn't change.
      .map((route) => {
        if (JSON.stringify(route.path) === JSON.stringify(cheapestReverseRoute.path)) {
          return cheapestReverseRoute;
        }
        return route;
      })
      // returns routes in the order that maximizes the users output while
      // ensuring that the cheapestReverseRoute is returned first.
      .sort((a: RouteV2, b: RouteV2) => {
        // ensure cheapestReverseRoute is first selected.
        // this is added to prevent any rounding issues from impacting the order of the
        // items. In a low probability event where a backwards -> forward calculation resulted in
        // a different order of items, we will default to the initial reverse calculation
        if (JSON.stringify(a.path) === JSON.stringify(cheapestReverseRoute.path)) {
          return -1; // sort a before b
        }

        if (JSON.stringify(b.path) === JSON.stringify(cheapestReverseRoute.path)) {
          return 1; // sort a after b
        }

        return compareRoutesFn(a, b, false);
      }).slice(0, maxRoutes);
  }
}
export {
  getRoutes,
};
