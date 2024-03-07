import { StakingDerivativesValidator } from './response';

type StakingDerivativesInfo = {
  validators: StakingDerivativesValidator[],
  supply: number,
  exchangeRate: number,
  communityRewards: number,
  nextUnboundAmount: number,
  nextUnbondingBatchEstimatedTime: number,
}

type StakingDerivativesFee = {
  depositFee: number,
  withdrawFee: number,
}

export type {
  StakingDerivativesInfo,
  StakingDerivativesFee,
};
