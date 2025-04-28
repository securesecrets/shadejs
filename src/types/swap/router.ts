import BigNumber from 'bignumber.js';
import { PathsWithPair } from '~/types';

type Route = {
  inputAmount: BigNumber,
  quoteOutputAmount: BigNumber,
  quoteShadeDaoFee: BigNumber,
  quoteLPFee: BigNumber,
  priceImpact: BigNumber,
  inputTokenContractAddress: string,
  outputTokenContractAddress: string,
  path: PathsWithPair,
  iterationsCount: number,
};

export type {
  Route,
};
