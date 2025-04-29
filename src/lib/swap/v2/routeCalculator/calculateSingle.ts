import BigNumber from 'bignumber.js';
import {
  constantProductSwapToken0for1,
  constantProductSwapToken1for0,
  stableSwapToken0for1,
  stableSwapToken1for0,
  constantProductPriceImpactToken0for1,
  constantProductPriceImpactToken1for0,
  stableSwapPriceImpactToken0For1,
  stableSwapPriceImpactToken1For0,
  constantProductReverseSwapToken0for1,
  constantProductReverseSwapToken1for0,
  stableReverseSwapToken0for1,
  stableReverseSwapToken1for0,
} from '~/lib/swap/v2/swapCalculationsV2';
import {
  RouteV2,
  TokensConfig,
} from '~/types';
import { SwapType } from '~/lib/swap/v2/gasEstimation/oracleCosts';
import {
  convertCoinFromUDenom,
  convertCoinToUDenom,
  getTokenDecimalsByTokenConfig,
} from '~/lib/utils';
import { SimpleBatchPairInfo } from './types';

/**
 * calculates the estimated output of swapping through a route given an input token amount
 * and also transforms the data collected in each pool into the RouteV2 data model
 */
function forwardCalculateSingle({
  startingTokenAmount,
  startingTokenAddress,
  batchPairInfo,
  tokens,
}:{
  startingTokenAmount: BigNumber,
  startingTokenAddress: string,
  batchPairInfo: SimpleBatchPairInfo,
  tokens: TokensConfig, // list of all possible swap tokens
}): RouteV2 {
  let swapAmountOutput;
  let swapPriceImpact;
  let iterationsCount = 0;
  const pair = batchPairInfo.pairInfo;
  const {
    stableParams,
    lpFee,
    daoFee,
  } = pair;
  // converts input amount from raw number to human readable for use as an input
  // to the stableswap calculations.
  const inputTokenDecimals = getTokenDecimalsByTokenConfig(startingTokenAddress, tokens);
  const inputAmountHumanReadable = convertCoinFromUDenom(
    startingTokenAmount,
    inputTokenDecimals,
  );

  // determine token id of the output token in the swap
  let outputTokenAddress;
  if (startingTokenAddress === pair.token0Contract.address) {
    outputTokenAddress = pair.token1Contract.address;
  } else {
    outputTokenAddress = pair.token0Contract.address;
  }

  // determine decimals of the output token
  const outputTokenDecimals = getTokenDecimalsByTokenConfig(outputTokenAddress, tokens);

  // Convert pool liquidity from human readable to raw number for
  // constant product swap calculations
  // at this point we have determined there is a single match
  const poolToken0Decimals = getTokenDecimalsByTokenConfig(
    pair.token0Contract.address,
    tokens,
  );
  const poolToken1Decimals = getTokenDecimalsByTokenConfig(
    pair.token1Contract.address,
    tokens,
  );

  const poolToken0AmountHumanReadable = convertCoinFromUDenom(
    pair.token0Amount,
    poolToken0Decimals,
  );
  const poolToken1AmountHumanReadable = convertCoinFromUDenom(
    pair.token1Amount,
    poolToken1Decimals,
  );
  // Stable PairInfo calculations
  if (pair.isStable) {
    // token0 as the input
    if (startingTokenAddress === pair.token0Contract.address
      && stableParams !== null && stableParams.priceRatio) {
      const tradeResult = stableSwapToken0for1({
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
      });

      swapAmountOutput = BigNumber(convertCoinToUDenom(
        tradeResult.tradeReturn,
        outputTokenDecimals,
      ));
      swapPriceImpact = tradeResult.priceImpact;
      iterationsCount = tradeResult.iterationsCount;
      // token1 as the input
    } else if (startingTokenAddress === pair.token1Contract.address
      && stableParams !== null && stableParams.priceRatio) {
      const tradeResult = stableSwapToken1for0({
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
      });

      swapAmountOutput = BigNumber(convertCoinToUDenom(
        tradeResult.tradeReturn,
        outputTokenDecimals,
      ));
      swapPriceImpact = tradeResult.priceImpact;
      iterationsCount = tradeResult.iterationsCount;
    } else {
      throw Error('stableswap parameter error');
    }
  } else {
    // non-stable pools using constant product rule math
    // token0 as the input
    // eslint-disable-next-line no-lonely-if
    if (startingTokenAddress === pair.token0Contract.address) {
      swapAmountOutput = constantProductSwapToken0for1({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token0InputAmount: startingTokenAmount,
        fee: BigNumber(pair.lpFee).plus(pair.daoFee),
      });

      swapPriceImpact = constantProductPriceImpactToken0for1({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token0InputAmount: startingTokenAmount,
      });
      // non-stable pools using constant product rule math
      // token1 as the input
    } else if (startingTokenAddress === pair.token1Contract.address) {
      swapAmountOutput = constantProductSwapToken1for0({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token1InputAmount: startingTokenAmount,
        fee: BigNumber(pair.lpFee).plus(pair.daoFee),
      });

      swapPriceImpact = constantProductPriceImpactToken1for0({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token1InputAmount: startingTokenAmount,
      });
    } else {
      throw Error('constant product rule swap parameter error');
    }
  }

  if (!swapAmountOutput || swapAmountOutput.isNaN()) {
    throw Error('invalid swap result');
  }

  // output data for the reduce function
  return {
    path: [{
      pair: [
        pair.token0Contract,
        pair.token1Contract,
      ],
      poolType: pair.isStable ? SwapType.STABLE : SwapType.CONSTANT_PRODUCT,
      stableOracleKeys: pair.stableParams ? [
        pair.stableParams.token0Data.oracleKey,
        pair.stableParams.token1Data.oracleKey,
      ] : null,
      poolContractAddress: batchPairInfo.pairContractAddress,
      poolCodeHash: batchPairInfo.pairCodeHash,
    }],
    inputAmount: startingTokenAmount,
    outputTokenContractAddress: outputTokenAddress,
    inputTokenContractAddress: startingTokenAddress,
    quoteOutputAmount: swapAmountOutput,
    quoteShadeDaoFee: BigNumber(pair.daoFee),
    quoteLPFee: BigNumber(pair.lpFee),
    priceImpact: swapPriceImpact,
    iterationsCount,
  };
}

/**
 * calculates the estimated input of swapping through a route given an output token amount
 * and also transforms the data collected in each pool into the RouteV2 data model
 */
function reverseCalculateSingle({
  endingTokenAmount,
  endingTokenAddress,
  batchPairInfo,
  tokens,
}:{
  endingTokenAmount: BigNumber,
  endingTokenAddress: string,
  batchPairInfo: SimpleBatchPairInfo,
  tokens: TokensConfig, // list of all possible swap tokens
}): RouteV2 {
  let swapAmountInput;
  let swapPriceImpact;
  let iterationsCount = 0;

  const pair = batchPairInfo.pairInfo;
  const {
    stableParams,
    lpFee,
    daoFee,
  } = pair;
  // converts input amount from raw number to human readable for use as an input
  // to the stableswap calculations.
  const inputTokenDecimals = getTokenDecimalsByTokenConfig(endingTokenAddress, tokens);
  const outputAmountHumanReadable = convertCoinFromUDenom(
    endingTokenAmount,
    inputTokenDecimals,
  );

  // determine token id of the output token in the swap
  let outputTokenAddress;
  if (endingTokenAddress === pair.token0Contract.address) {
    outputTokenAddress = pair.token1Contract.address;
  } else {
    outputTokenAddress = pair.token0Contract.address;
  }

  // determine decimals of the output token
  const outputTokenDecimals = getTokenDecimalsByTokenConfig(outputTokenAddress, tokens);

  // Convert pool liquidity from human readable to raw number for
  // constant product swap calculations
  // at this point we have determined there is a single match
  const poolToken0Decimals = getTokenDecimalsByTokenConfig(
    pair.token0Contract.address,
    tokens,
  );
  const poolToken1Decimals = getTokenDecimalsByTokenConfig(
    pair.token1Contract.address,
    tokens,
  );

  const poolToken0AmountHumanReadable = convertCoinFromUDenom(
    pair.token0Amount,
    poolToken0Decimals,
  );
  const poolToken1AmountHumanReadable = convertCoinFromUDenom(
    pair.token1Amount,
    poolToken1Decimals,
  );
  // Stable PairInfo calculations
  if (pair.isStable) {
    // token0 as the input, token1 as the output
    if (endingTokenAddress === pair.token1Contract.address
      && stableParams !== null && stableParams.priceRatio) {
      const {
        result: swapAmountInputHumanReadable,
        iterationsCount: stableSwapIterationsCount,
      } = stableReverseSwapToken0for1({
        outputToken1Amount: outputAmountHumanReadable,
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
      });
      iterationsCount = stableSwapIterationsCount;
      swapAmountInput = BigNumber(convertCoinToUDenom(
        swapAmountInputHumanReadable,
        outputTokenDecimals,
      ));

      // price impact, use a forward swap with the reverse output for price impact
      const swapPriceImpactToken0For1 = stableSwapPriceImpactToken0For1({
        inputToken0Amount: swapAmountInputHumanReadable,
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
      });
      swapPriceImpact = swapPriceImpactToken0For1.result;

      // token1 as the input, token0 as output
    } else if (endingTokenAddress === pair.token0Contract.address
      && stableParams !== null && stableParams.priceRatio) {
      const {
        result: swapAmountInputHumanReadable,
        iterationsCount: stableSwapIterationsCount,
      } = stableReverseSwapToken1for0({
        outputToken0Amount: outputAmountHumanReadable,
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
      });
      iterationsCount = stableSwapIterationsCount;

      swapAmountInput = BigNumber(convertCoinToUDenom(
        swapAmountInputHumanReadable,
        inputTokenDecimals,
      ));

      // Price Impact, use a forward swap with the reverse output for price impact
      const swapPriceImpactToken1For0 = stableSwapPriceImpactToken1For0({
        inputToken1Amount: swapAmountInputHumanReadable,
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
      });
      swapPriceImpact = swapPriceImpactToken1For0.result;
    } else {
      throw Error('stableswap parameter error');
    }
  } else {
    // non-stable pools using constant product rule math
    // token0 as the input, token1 as the output
    // eslint-disable-next-line no-lonely-if
    if (endingTokenAddress === pair.token1Contract.address) {
      swapAmountInput = constantProductReverseSwapToken0for1({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token1OutputAmount: endingTokenAmount,
        fee: BigNumber(pair.lpFee).plus(pair.daoFee),
      });

      swapPriceImpact = constantProductPriceImpactToken0for1({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token0InputAmount: swapAmountInput,
      });
      // non-stable pools using constant product rule math
      // token1 as the input
    } else if (endingTokenAddress === pair.token0Contract.address) {
      swapAmountInput = constantProductReverseSwapToken1for0({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token0OutputAmount: endingTokenAmount,
        fee: BigNumber(pair.lpFee).plus(pair.daoFee),
      });

      swapPriceImpact = constantProductPriceImpactToken1for0({
        token0LiquidityAmount: BigNumber(pair.token0Amount),
        token1LiquidityAmount: BigNumber(pair.token1Amount),
        token1InputAmount: swapAmountInput,
      });
    } else {
      throw Error('constant product rule swap parameter error');
    }
  }

  if (!swapAmountInput || swapAmountInput.isNaN()) {
    throw Error('invalid swap result');
  }

  return {
    inputAmount: swapAmountInput,
    quoteOutputAmount: endingTokenAmount,
    quoteShadeDaoFee: BigNumber(daoFee),
    quoteLPFee: BigNumber(lpFee),
    priceImpact: swapPriceImpact,
    inputTokenContractAddress: outputTokenAddress,
    outputTokenContractAddress: endingTokenAddress,
    iterationsCount,
    path: [{
      pair: [
        pair.token0Contract,
        pair.token1Contract,
      ],
      poolType: pair.isStable ? SwapType.STABLE : SwapType.CONSTANT_PRODUCT,
      stableOracleKeys: pair.stableParams ? [
        pair.stableParams.token0Data.oracleKey,
        pair.stableParams.token1Data.oracleKey,
      ] : null,
      poolContractAddress: batchPairInfo.pairContractAddress,
      poolCodeHash: batchPairInfo.pairCodeHash,
    }],
  };
}

export {
  forwardCalculateSingle,
  reverseCalculateSingle,
};
