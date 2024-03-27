type DerivativeScrtValidatorResponse = {
  validator: string,
  weight: number,
}

type DerivativeScrtStakingInfoResponse = {
  staking_info: {
    available_scrt: string,
    batch_unbond_in_progress: boolean,
    bonded_scrt: string,
    next_unbonding_batch_time: number,
    price: string,
    reserved_scrt: string,
    rewards: string,
    total_derivative_token_supply: string,
    unbond_amount_of_next_batch: string,
    unbonding_batch_interval: number,
    unbonding_time: number,
    validators: DerivativeScrtValidatorResponse[],
  },
};

type DerivativeScrtFeeInfoResponse = {
  fee_info: {
    fee_collector: string,
    deposit: number,
    withdraw: number,
  },
}

export type {
  DerivativeScrtValidatorResponse,
  DerivativeScrtStakingInfoResponse,
  DerivativeScrtFeeInfoResponse,
};
