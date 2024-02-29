type FeeResponse = {
   staking:{
      rate: number,
      decimal_places: number
   },
   unbonding:{
      rate: number,
      decimal_places: number,
   },
   collector: string,
}

enum StatusLevel {
  NORMAL_RUN = 'normal_run',
  PANICKED = 'panicked',
  STOP_ALL = 'stop_all'
}

type ContractStatusResponse = {
  contract_status:{
     status: StatusLevel,
  }
}

type StakingInfoResponse = {
  staking_info: {
    // unbonding time
    unbonding_time: string,
    // amount of bonded SHD
    bonded_shd: string,
    // amount of available SHD not reserved for mature unbondings
    available_shd: string,
    // unclaimed staking rewards
    rewards: string,
    // total supply of derivative token
    total_derivative_token_supply: string,
    // price of derivative token in SHD to 6 decimals
    price: string,
    fee_info: FeeResponse,
    status: StatusLevel,
  }
}

export type {
  FeeResponse,
  ContractStatusResponse,
  StatusLevel,
  StakingInfoResponse,
};
