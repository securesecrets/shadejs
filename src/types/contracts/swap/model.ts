import { Contract } from '~/types/contracts/shared';

type FactoryPair = {
  pairContract: Contract,
  token0Contract: Contract,
  token1Contract: Contract,
  isStable: boolean,
  isEnabled: boolean
}

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
  pairs: FactoryPair[],
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
  priceRatio: string,
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
  lpFee: number,
  daoFee: number,
  stableParams: StableParams | null
  contractVersion: number,
}

type BatchPairInfo = {
  pairContractAddress: string,
  pairInfo: PairInfo,
}

type BatchPairsInfo = BatchPairInfo[]

type BatchPairConfig = {
  pairContractAddress: string,
  pairConfig: PairConfig,
}

type BatchPairsConfig = BatchPairConfig[]

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

type Path = {
  poolContractAddress: string,
  poolCodeHash: string,
}

type Paths = Path[]

type ParsedSwapResponse = {
  txHash: string,
  inputTokenAddress: string | undefined,
  outputTokenAddress: string | undefined,
  inputTokenAmount: string | undefined,
  outputTokenAmount: string | undefined,
}

export type {
  FactoryPairs,
  PairConfig,
  BatchPairsConfig,
  FactoryConfig,
  PairInfo,
  BatchPairsInfo,
  StakingInfo,
  BatchSingleStakingInfo,
  BatchStakingInfo,
  Path,
  Paths,
  ParsedSwapResponse,
};
