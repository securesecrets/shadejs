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
  lpTokenAmount: string,
  lpTokenContract: Contract,
  token0Contract: Contract,
  token1Contract: Contract,
  factoryContract: Contract | null,
  daoContractAddress: string,
  isStable: boolean,
  token0Amount: string,
  token1Amount: string,
  priceRatio: string | null,
  pairSettings: {
    lpFee: number,
    daoFee: number,
    stableLpFee: number,
    stableDaoFee: number,
    stableParams: StableParams | null
  },
  contractVersion: number,
}

type BatchPairInfo = {
  pairContractAddress: string,
  pairInfo: PairInfo,
}

type BatchPairsInfo = BatchPairInfo[]

type RewardTokenInfo = {
  token: Contract,
  rewardPerSecond: string,
  rewardPerStakedToken: string,
  validTo: number,
  lastUpdated: number,
}

type StakingInfo = {
  lpTokenContract: Contract,
  pairContractAddress: string,
  adminAuthContract: Contract,
  queryAuthContract: Contract | null,
  totalStakedAmount: string,
  rewardTokens: RewardTokenInfo[],
}

type BatchSingleStakingInfo = {
  stakingContractAddress: string,
  stakingInfo: StakingInfo,
}

type BatchStakingInfo = BatchSingleStakingInfo[]

export type {
  FactoryPairs,
  PairConfig,
  FactoryConfig,
  PairInfo,
  BatchPairsInfo,
  StakingInfo,
  BatchSingleStakingInfo,
  BatchStakingInfo,
};
