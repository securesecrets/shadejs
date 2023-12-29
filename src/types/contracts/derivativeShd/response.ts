type FeeResponse = {
  fee_info:{
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

export type {
  FeeResponse,
  ContractStatusResponse,
  StatusLevel,
};
