type DerivativeScrtValidator = {
  validatorAddress: string,
  weight: number;
}

type DerivativeScrtStakingInfo = {
  validators: DerivativeScrtValidator[],
  supply: string,
  exchangeRate: number,
  communityRewards: string,
  nextUnboundAmount: string,
  nextUnbondingBatchEstimatedTime: number,
}

type DerivativeScrtFeeInfo = {
  depositFee: number,
  withdrawFee: number,
}

type DerivativeScrtInfo = {
  validators: DerivativeScrtValidator[],
  supply: string,
  exchangeRate: number,
  communityRewards: string,
  nextUnboundAmount: string,
  nextUnbondingBatchEstimatedTime: number,
  depositFee: number,
  withdrawFee: number,
}

export type {
  DerivativeScrtValidator,
  DerivativeScrtStakingInfo,
  DerivativeScrtFeeInfo,
  DerivativeScrtInfo,
};
