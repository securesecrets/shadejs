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

enum BatchRouterKeys {
  FEE_INFO = 'FEE_INFO',
  STAKING_INFO = 'STAKING_INFO',
}

export type {
  DerivativeScrtValidator,
  DerivativeScrtStakingInfo,
  DerivativeScrtFeeInfo,
  DerivativeScrtInfo,
};
export {
  BatchRouterKeys,
};
