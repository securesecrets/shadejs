import BigNumber from 'bignumber.js';
import {
  BatchPairInfo,
  PairInfo,
  RouteV2,
  StableParams,
} from '~/types';

export type SimpleBatchPairInfo = Omit<BatchPairInfo, 'pairInfo' | 'blockHeight'> & {
  pairInfo: Omit<PairInfo, 'daoContractAddress' | 'factoryContract' | 'contractVersion' | 'lpTokenContract' | 'lpTokenAmount' | 'stableParams'> & {
    stableParams: Omit<StableParams, 'oracle' | 'customIterationControls'> | null
  }
}

export interface IRoutesCalculator {
  calculatePath(arg: {
    inputTokenAmount: BigNumber,
    startingTokenAddress: string,
    endingTokenAddress: string,
    maxHops: number,
    isReverse: boolean,
    path: string[],
  }): RouteV2 | null,
}
