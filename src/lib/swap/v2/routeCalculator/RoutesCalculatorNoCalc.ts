import BigNumber from 'bignumber.js';
import { RouteV2 } from '~/types';
import { IRoutesCalculator } from './types';

/**
 * Used when only paths need to be calculated by the SwapRoutesCalculator
 */
export class RoutesCalculatorNoCalc implements IRoutesCalculator {
  // eslint-disable-next-line class-methods-use-this
  calculatePath(_arg: {
    inputTokenAmount: BigNumber,
    startingTokenAddress: string,
    endingTokenAddress: string,
    maxHops: number,
    isReverse: boolean,
    path: string[],
  }): RouteV2 | null {
    return null;
  }
}
