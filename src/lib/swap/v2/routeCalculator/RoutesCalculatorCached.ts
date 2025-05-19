// eslint-disable-next-line max-classes-per-file
import BigNumber from 'bignumber.js';
import {
  PathV2,
  RouteV2,
  TokensConfig,
} from '~/types';
import {
  forwardCalculateSingle,
  reverseCalculateSingle,
} from './calculateSingle';
import {
  IRoutesCalculator,
  SimpleBatchPairInfo,
} from './types';

/**
 * Used by SwapRoutesCalculator to cache calculations for a particular batch of pair infos.
 */
export class RoutesCalculatorCached implements IRoutesCalculator {
  private readonly calculationCache: Record<string, RouteV2 | null> = {};

  /**
   * Used for a single routes calculation
   * as it caches past calculation for a certain amount and poolId.
   */
  // eslint-disable-next-line no-useless-constructor
  constructor(
    private readonly batchPairInfos: SimpleBatchPairInfo[],
    private readonly tokens: TokensConfig,
    // eslint-disable-next-line no-empty-function
  ) {}

  private forwardCalculateSingleCached(args: {
    startingTokenAmount: BigNumber,
    startingTokenAddress: string,
    batchPairInfo: SimpleBatchPairInfo,
  }) {
    const key = RoutesCalculatorCached.formatCacheKey({
      tokenAddress: args.startingTokenAddress,
      poolAddress: args.batchPairInfo.pairContractAddress,
      tokenAmount: args.startingTokenAmount,
    });
    if (this.calculationCache[key] === undefined) {
      try {
        this.calculationCache[key] = forwardCalculateSingle({
          ...args,
          tokens: this.tokens,
        });
      } catch {
        this.calculationCache[key] = null;
      }
    }
    return this.calculationCache[key];
  }

  private static formatCacheKey(args: {
    tokenAmount: BigNumber,
    tokenAddress: string,
    poolAddress: string,
  }) {
    return `${args.tokenAddress}_${args.poolAddress}_${args.tokenAmount.toString()}`;
  }

  private reverseCalculateSingleCached(args: {
    endingTokenAmount: BigNumber,
    endingTokenAddress: string,
    batchPairInfo: SimpleBatchPairInfo,
  }) {
    const key = RoutesCalculatorCached.formatCacheKey({
      tokenAddress: args.endingTokenAddress,
      poolAddress: args.batchPairInfo.pairContractAddress,
      tokenAmount: args.endingTokenAmount,
    });
    if (this.calculationCache[key] === undefined) {
      try {
        this.calculationCache[key] = reverseCalculateSingle({
          ...args,
          tokens: this.tokens,
        });
      } catch {
        this.calculationCache[key] = null;
      }
    }
    return this.calculationCache[key];
  }

  calculatePath({
    inputTokenAmount,
    startingTokenAddress,
    endingTokenAddress,
    isReverse,
    path: pathToCalculate,
  }: {
    inputTokenAmount: BigNumber,
    startingTokenAddress: string,
    endingTokenAddress: string,
    maxHops: number,
    isReverse: boolean,
    path: string[],
  }): RouteV2 | null {
    let currentTokenAddress = isReverse ? endingTokenAddress : startingTokenAddress;
    let accumulatedRoute: RouteV2 = {
      // Initial dummy value when reverse
      inputAmount: isReverse ? null as never as BigNumber : inputTokenAmount,
      // Initial dummy value when forward
      quoteOutputAmount: isReverse ? inputTokenAmount : null as never as BigNumber,
      quoteShadeDaoFee: new BigNumber(0),
      quoteLPFee: new BigNumber(0),
      priceImpact: new BigNumber(0),
      // Updated as we traverse in reverse or remains fixed when forward
      inputTokenContractAddress: isReverse ? null as never as string : currentTokenAddress,
      // Updated as we traverse in forward or remains fixed when reverse
      outputTokenContractAddress: isReverse ? currentTokenAddress : null as never as string,
      iterationsCount: 0,
      path: [] as PathV2[],
    };

    const foundError = (
      isReverse
        ? [...pathToCalculate].reverse()
        : pathToCalculate
    ).find((poolContractAddress) => {
      const pairArr = this.batchPairInfos.filter(
        (pair) => pair.pairContractAddress === poolContractAddress,
      );
      if (pairArr.length === 0) {
        throw new Error(`Pair ${poolContractAddress} not available`);
      }

      if (pairArr.length > 1) {
        throw new Error(`Duplicate ${poolContractAddress} pairs found`);
      }

      // at this point we have determined there is a single match
      const batchPairInfo = pairArr[0];

      let nextTokenAddress;
      // if the token we are currently exploring is token0 in the current pair,
      // explore token1 next
      if (batchPairInfo.pairInfo.token0Contract.address === currentTokenAddress) {
        nextTokenAddress = batchPairInfo.pairInfo.token1Contract.address;
      } else {
        // if the token we are currently exploring is token1 in the current pair,
        // explore token0 next
        nextTokenAddress = batchPairInfo.pairInfo.token0Contract.address;
      }
      let currentEdgeRouteOutput: RouteV2 | null;
      const {
        inputAmount,
        quoteOutputAmount,
      } = accumulatedRoute;
      const tokenAmount = (isReverse ? inputAmount : quoteOutputAmount) || inputTokenAmount;
      try {
        if (!isReverse) {
          currentEdgeRouteOutput = this.forwardCalculateSingleCached({
            startingTokenAmount: tokenAmount,
            startingTokenAddress: currentTokenAddress,
            batchPairInfo,
          });
        } else {
          currentEdgeRouteOutput = this.reverseCalculateSingleCached({
            endingTokenAmount: tokenAmount,
            endingTokenAddress: currentTokenAddress,
            batchPairInfo,
          });
        }
      } catch {
        return true;
      }
      if (currentEdgeRouteOutput === null) { // memoized error
        return true;
      }
      accumulatedRoute = {
        inputAmount: isReverse
          ? currentEdgeRouteOutput.inputAmount
          : accumulatedRoute.inputAmount,
        quoteOutputAmount: isReverse
          ? accumulatedRoute.quoteOutputAmount
          : currentEdgeRouteOutput.quoteOutputAmount,
        quoteShadeDaoFee: accumulatedRoute.quoteShadeDaoFee.plus(
          currentEdgeRouteOutput.quoteShadeDaoFee,
        ),
        quoteLPFee: accumulatedRoute.quoteLPFee.plus(
          currentEdgeRouteOutput.quoteLPFee,
        ),
        priceImpact: accumulatedRoute.priceImpact.plus(
          currentEdgeRouteOutput.priceImpact,
        ),
        inputTokenContractAddress: isReverse
          ? currentEdgeRouteOutput.inputTokenContractAddress
          : accumulatedRoute.inputTokenContractAddress,
        outputTokenContractAddress: isReverse
          ? accumulatedRoute.outputTokenContractAddress
          : currentEdgeRouteOutput.outputTokenContractAddress,
        path: isReverse
          ? [
            ...currentEdgeRouteOutput.path,
            ...accumulatedRoute.path,
          ]
          : [
            ...accumulatedRoute.path,
            ...currentEdgeRouteOutput.path,
          ],
        iterationsCount: accumulatedRoute.iterationsCount
          + (currentEdgeRouteOutput.iterationsCount || 0),
      };
      currentTokenAddress = nextTokenAddress;
      return false; // no error -- continue
    });
    if (foundError) {
      return null;
    }
    return accumulatedRoute;
  }
}
