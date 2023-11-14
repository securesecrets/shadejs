import {
  constantProductSwapToken0for1,
  constantProductSwapToken1for0,
  stableSwapToken0for1,
  stableSwapToken1for0,
  constantProductPriceImpactToken0for1,
  constantProductPriceImpactToken1for0,
  stableSwapPriceImpactToken0For1,
  stableSwapPriceImpactToken1For0,
} from '~/lib/swap/swapCalculations';
import BigNumber from 'bignumber.js';
import { BatchPairsInfo } from '~/types/contracts/swap/model';
import {
  GasMultiplier,
  Route,
} from '~/types/swap/router';
import { TokensConfig } from '~/types/shared';
import {
  convertCoinToUDenom,
  convertCoinFromUDenom,
  getTokenDecimalsByTokenConfig,
} from '~/lib/utils';

/**
* retuns possible paths through one or multiple pools to complete a trade of two tokens
*/
function getPossiblePaths({
  inputTokenContractAddress,
  outputTokenContractAddress,
  maxHops,
  pairs,
}:{
  inputTokenContractAddress:string,
  outputTokenContractAddress:string
  maxHops: number
  pairs: BatchPairsInfo
}) {
  // keeps track of the current path we are exploring
  const path: string[] = [];
  // keeps track of all the paths found from the starting token to the ending token
  const result: string[][] = [];
  // keeps track of the pools that have been visited to avoid loops
  const visited = new Set<string>();

  // depth-first search function
  function dfs(tokenContractAddress: string, depth: number) {
    // if the current depth exceeds the maximum number of hops, return
    if (depth > maxHops) {
      return;
    }

    // if we have reached the ending token, add the current path to the result and return
    if (tokenContractAddress === outputTokenContractAddress) {
      result.push([...path]);
      return;
    }

    // iterate through all the pools
    Object.values(pairs).forEach((pair) => {
      const {
        pairContractAddress,
        pairInfo,
      } = pair;

      // if the current pool has already been visited, return
      if (visited.has(pairContractAddress)) {
        return;
      }

      // if the current pool contains the token we are currently exploring,
      // add it to the path and mark it as visited
      if (pairInfo.token0Contract.address === tokenContractAddress
        || pairInfo.token1Contract.address === tokenContractAddress) {
        path.push(pairContractAddress);
        visited.add(pairContractAddress);

        // if the token we are currently exploring is token0 in the current pool,
        // explore token1 tokenAddress
        if (pairInfo.token0Contract.address === tokenContractAddress) {
          dfs(pairInfo.token1Contract.address, depth + 1);
        } else {
          // if the token we are currently exploring is token1 in the current pool,
          // explore token0 next
          dfs(pairInfo.token0Contract.address, depth + 1);
        }

        // backtrack by removing the current pool from the path and marking it as unvisited
        visited.delete(pairContractAddress);
        path.pop();
      }
    });
  }

  // start exploring from the starting token
  dfs(inputTokenContractAddress, 0);
  return result;
}

/**
* calculates the estimated output of swapping through a route given an input token amount
* and also transforms the data collected in each pool into the Route data model
*/
function forwardCalculateRoute({
  inputTokenAmount,
  inputTokenContractAddress,
  path,
  pairs,
  tokens,
}:{
  inputTokenAmount: BigNumber,
  inputTokenContractAddress: string,
  path: string[],
  pairs: BatchPairsInfo,
  tokens: TokensConfig, // list of all possible swap tokens
}): Route {
  // calculate output of the route
  const routeCalculation = path.reduce((prev, poolContractAddress) => {
    const {
      // set previous pool swap output as the new input
      outputTokenContractAddress: currentTokenContractAddress,
      quoteOutputAmount: inputAmount,
      quoteShadeDaoFee,
      quotePriceImpact,
      quoteLPFee,
      gasMultiplier,
    } = prev;

    let swapAmountOutput;
    let swapPriceImpact;
    let poolMultiplier;

    const pairArr = pairs.filter(
      (pair) => pair.pairContractAddress === poolContractAddress,
    );
    if (pairArr.length === 0) {
      throw new Error(`Pair ${poolContractAddress} not available`);
    }

    if (pairArr.length > 1) {
      throw new Error(`Duplicate ${poolContractAddress} pairs found`);
    }

    // at this point we have determined there is a single match
    const pair = pairArr[0];

    const {
      pairInfo: {
        token0Contract,
        token1Contract,
        token0Amount,
        token1Amount,
        lpFee,
        daoFee,
        isStable,
        stableParams,
      },
    } = pair;
    // Convert pool liquidity from human readable to raw number for
    // constant product swap calculations
    // at this point we have determined there is a single match
    const poolToken0Decimals = getTokenDecimalsByTokenConfig(
      token0Contract.address,
      tokens,
    );
    const poolToken1Decimals = getTokenDecimalsByTokenConfig(
      token1Contract.address,
      tokens,
    );

    const poolToken0AmountHumanReadable = convertCoinFromUDenom(
      token0Amount,
      poolToken0Decimals,
    );
    const poolToken1AmountHumanReadable = convertCoinFromUDenom(
      token1Amount,
      poolToken1Decimals,
    );

    // converts input amount from raw number to human readable for use as an input
    // to the stableswap calculations.
    const inputTokenDecimals = getTokenDecimalsByTokenConfig(
      currentTokenContractAddress,
      tokens,
    );

    const inputAmountHumanReadable = convertCoinFromUDenom(
      inputAmount,
      inputTokenDecimals,
    );

    // determine token id of the output token in the swap
    let outputTokenContractAddress;
    if (currentTokenContractAddress === token0Contract.address) {
      outputTokenContractAddress = token1Contract.address;
    } else {
      outputTokenContractAddress = token0Contract.address;
    }

    // determine decimals of the output token
    const outputTokenDecimals = getTokenDecimalsByTokenConfig(
      outputTokenContractAddress,
      tokens,
    );

    // Stable Pool calculations
    if (isStable && stableParams) {
      poolMultiplier = GasMultiplier.STABLE;

      // token0 as the input
      if (currentTokenContractAddress === token0Contract.address) {
        const swapParams = {
          inputToken0Amount: inputAmountHumanReadable,
          poolToken0Amount: poolToken0AmountHumanReadable,
          poolToken1Amount: poolToken1AmountHumanReadable,
          priceRatio: BigNumber(stableParams.priceRatio),
          alpha: BigNumber(stableParams.alpha),
          gamma1: BigNumber(stableParams.gamma1),
          gamma2: BigNumber(stableParams.gamma2),
          liquidityProviderFee: BigNumber(lpFee),
          daoFee: BigNumber(daoFee),
          minTradeSizeToken0For1: BigNumber(stableParams.minTradeSizeXForY),
          minTradeSizeToken1For0: BigNumber(stableParams.minTradeSizeYForX),
          priceImpactLimit: BigNumber(stableParams.maxPriceImpactAllowed),
        };

        const swapAmountOutputHumanReadable = stableSwapToken0for1(swapParams);

        swapAmountOutput = BigNumber(convertCoinToUDenom(
          swapAmountOutputHumanReadable,
          outputTokenDecimals,
        ));
        swapPriceImpact = stableSwapPriceImpactToken0For1(swapParams);
      // token1 as the input
      } else if (currentTokenContractAddress === token1Contract.address) {
        const swapParams = {
          inputToken1Amount: inputAmountHumanReadable,
          poolToken0Amount: poolToken0AmountHumanReadable,
          poolToken1Amount: poolToken1AmountHumanReadable,
          priceRatio: BigNumber(stableParams.priceRatio),
          alpha: BigNumber(stableParams.alpha),
          gamma1: BigNumber(stableParams.gamma1),
          gamma2: BigNumber(stableParams.gamma2),
          liquidityProviderFee: BigNumber(lpFee),
          daoFee: BigNumber(daoFee),
          minTradeSizeToken0For1: BigNumber(stableParams.minTradeSizeXForY),
          minTradeSizeToken1For0: BigNumber(stableParams.minTradeSizeYForX),
          priceImpactLimit: BigNumber(stableParams.maxPriceImpactAllowed),
        };

        const swapAmountOutputHumanReadable = stableSwapToken1for0(swapParams);

        swapAmountOutput = BigNumber(convertCoinToUDenom(
          swapAmountOutputHumanReadable,
          outputTokenDecimals,
        ));
        swapPriceImpact = stableSwapPriceImpactToken1For0(swapParams);
      } else {
        throw Error('stableswap parameter error');
      }
    } else {
      poolMultiplier = GasMultiplier.CONSTANT_PRODUCT;
      // non-stable pools using constant product rule math
      // token0 as the input
      if (currentTokenContractAddress === token0Contract.address) {
        swapAmountOutput = constantProductSwapToken0for1({
          token0LiquidityAmount: BigNumber(token0Amount),
          token1LiquidityAmount: BigNumber(token1Amount),
          token0InputAmount: inputAmount,
          fee: BigNumber(lpFee).plus(daoFee),
        });

        swapPriceImpact = constantProductPriceImpactToken0for1({
          token0LiquidityAmount: BigNumber(token0Amount),
          token1LiquidityAmount: BigNumber(token1Amount),
          token0InputAmount: inputAmount,
        });
        // non-stable pools using constant product rule math
        // token1 as the input
      } else if (currentTokenContractAddress === token1Contract.address) {
        swapAmountOutput = constantProductSwapToken1for0({
          token0LiquidityAmount: BigNumber(token0Amount),
          token1LiquidityAmount: BigNumber(token1Amount),
          token1InputAmount: inputAmount,
          fee: BigNumber(lpFee).plus(daoFee),
        });

        swapPriceImpact = constantProductPriceImpactToken1for0({
          token0LiquidityAmount: BigNumber(token0Amount),
          token1LiquidityAmount: BigNumber(token1Amount),
          token1InputAmount: inputAmount,
        });
      } else {
        throw Error('constant product rule swap parameter error');
      }
    }

    // output data for the reduce function
    return {
      outputTokenContractAddress,
      quoteOutputAmount: swapAmountOutput,
      quoteShadeDaoFee: quoteShadeDaoFee.plus(daoFee),
      quoteLPFee: quoteLPFee.plus(lpFee),
      quotePriceImpact: quotePriceImpact.plus(swapPriceImpact),
      gasMultiplier: gasMultiplier + poolMultiplier,
    };

    // reduce function starting values
  }, {
    outputTokenContractAddress: inputTokenContractAddress,
    quoteOutputAmount: inputTokenAmount,
    quoteShadeDaoFee: BigNumber(0),
    quoteLPFee: BigNumber(0),
    quotePriceImpact: BigNumber(0),
    gasMultiplier: 0,
  });

  // formulate the Routes data model
  const {
    outputTokenContractAddress,
    quoteOutputAmount,
    quoteShadeDaoFee,
    quoteLPFee,
    quotePriceImpact,
    gasMultiplier,
  } = routeCalculation;

  return {
    inputAmount: inputTokenAmount,
    quoteOutputAmount,
    quoteShadeDaoFee,
    quoteLPFee,
    priceImpact: quotePriceImpact,
    inputTokenContractAddress,
    outputTokenContractAddress,
    path,
    gasMultiplier,
  };
}

/**
* retrieves all potential route options and the outputs of each route.
* returns an array of routes in the order that will give the highest quoted
* output amount
*/
function getRoutes({
  inputTokenAmount,
  inputTokenContractAddress,
  outputTokenContractAddress,
  maxHops,
  pairs,
  tokens,
}: {
  inputTokenAmount: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  maxHops: number,
  pairs: BatchPairsInfo,
  tokens: TokensConfig,
}) {
  // generates possible routes as the swap path
  const possiblePaths = getPossiblePaths({
    inputTokenContractAddress,
    outputTokenContractAddress,
    maxHops,
    pairs,
  });

  if (possiblePaths.length === 0) {
    return [];
  }

  const routes = possiblePaths.reduce((prev, path) => {
    try {
      const newRoute = forwardCalculateRoute({
        inputTokenAmount,
        inputTokenContractAddress,
        path,
        pairs,
        tokens,
      });
      prev.push(newRoute);
      return prev;
      // for any errors skip the path as a possible route
    } catch {
      return prev;
    }
  }, [] as Route[]);

  // returns routes in the order that maximizes the users output
  return routes.sort((a: Route, b: Route) => {
    // sort by output amounts

    if (a.quoteOutputAmount.isGreaterThan(b.quoteOutputAmount)) {
      return -1; // sort a before b
    }
    if (a.quoteOutputAmount.isLessThan(b.quoteOutputAmount)) {
      return 1; // sort a after b
    }
    return 0; // keep original order of a and b
  });
}
export {
  getPossiblePaths,
  forwardCalculateRoute,
  getRoutes,
};
