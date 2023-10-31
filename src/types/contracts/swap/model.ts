import { Contract } from '~/types/contracts/shared';

type FactoryContract = Contract & { isEnabled: boolean }

type ContractInstantiationInfo = {
  codeHash: string,
  id: number,
}

type FactoryConfig = {
  pairContractInstatiationInfo: ContractInstantiationInfo,
  lpTokenContractInstatiationInfo: ContractInstantiationInfo,
  adminAuthContract: Contract,
  authenticatorContract: Contract | null,
  defaultPairSettings: {
    lpFee: number,
    daoFee: number,
    stableLpFee: number,
    stableDaoFee: number,
    daoContract: Contract,
  }
}

type FactoryPairs = {
  pairs: FactoryContract[],
  startIndex: number,
  endIndex: number,
}

type CustomFee = {
  daoFee: number,
  lpFee: number,
}

type PairConfig = {
  factoryContract: Contract | null,
  lpTokenContract: Contract | null,
  stakingContract: Contract | null,
  token0Contract: Contract,
  token1Contract: Contract,
  isStable: boolean,
  fee: CustomFee | null,
}

type CustomIterationControls = {
  epsilon: string,
  maxIteratorNewton: number,
  maxIteratorBisect: number,
}

type StableTokenData = {
  oracleKey: string,
  decimals: number,
}

type StableParams = {
  alpha: string,
  gamma1: string,
  gamma2: string,
  oracle: Contract,
  token0Data: StableTokenData,
  token1Data: StableTokenData,
  minTradeSizeXForY: string,
  minTradeSizeYForX: string,
  maxPriceImpactAllowed: string,
  customIterationControls: CustomIterationControls | null,
}

type PairInfo = {
  token0Amount: string,
  token1Amount: string,
  lpTokenAmount: string,
  priceRatio: string | null,
  pairSettings: {
    lpFee: number,
    daoFee: number,
    stableLpFee: number,
    stableDaoFee: number,
    daoContractAddress: string,
    stableParams: StableParams | null
  },
  contractVersion: number,
}

type BatchPairInfo = {
  pairContractAddress: string,
  pairInfo: PairInfo,
}

type BatchPairsInfo = BatchPairInfo[]

export type {
  FactoryPairs,
  PairConfig,
  FactoryConfig,
  PairInfo,
  BatchPairsInfo,
};
