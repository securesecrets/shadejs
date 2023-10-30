type CustomToken = {
  custom_token:{
     contract_addr: string,
     token_code_hash: string,
  }
}
type TokenPair = [CustomToken, CustomToken, boolean]

type AMMPair = {
  pair: TokenPair,
  address: string,
  code_hash:string,
  enabled: boolean,
}

type ContractInstantiationInfo = {
  code_hash: string,
  id: number,
}
type Contract = {
  address: string,
  code_hash:string,
}

type Fee = {
  nom: number,
  denom: number,
}

type AMMSettings = {
  lp_fee: Fee,
  shade_dao_fee: Fee,
  stable_lp_fee: Fee,
  stable_shade_dao_fee: Fee,
  shade_dao_address: Contract,
}

type FactoryConfigResponse = {
  get_config: {
    pair_contract: ContractInstantiationInfo,
    amm_settings: AMMSettings,
    lp_token_contract: ContractInstantiationInfo,
   authenticator: Contract | null,
   admin_auth: Contract,
  }
}

type FactoryPairsResponse = {
  list_a_m_m_pairs:{
     amm_pairs: AMMPair[]
  }
}

type CustomFee = {
  shade_dao_fee: Fee,
  lp_fee: Fee,
}

type PairConfigResponse = {
  get_config:{
     factory_contract: Contract | null,
     lp_token: Contract | null,
     staking_contract: Contract | null
     pair: TokenPair,
     custom_fee: CustomFee | null
  }
}

type StableTokenData = {
  oracle_key: string,
  decimals: number,
}

type CustomIterationControls = {
  epsilon: string,
  max_iter_newton: number,
  max_iter_bisect: number,
}

type StableInfo = {
  stable_params:{
    a: string,
    gamma1: string,
    gamma2: string,
    oracle: Contract,
    min_trade_size_x_for_y: string,
    min_trade_size_y_for_x: string,
    max_price_impact_allowed: string
    custom_iteration_controls: CustomIterationControls | null
  },
  stable_token0_data: StableTokenData,
  stable_token1_data: StableTokenData,
  p: string | null,
}

type PairInfoResponse = {
  get_pair_info:{
    liquidity_token: Contract,
    factory: Contract | null,
    pair: TokenPair,
     amount_0: string,
     amount_1: string,
     total_liquidity: string,
     contract_version: number,
     fee_info:{
        shade_dao_address: string,
        lp_fee: Fee,
        shade_dao_fee: Fee,
        stable_lp_fee: Fee,
        stable_shade_dao_fee: Fee
     },
     stable_info: StableInfo | null
  }
}

type RewardTokenInfo = {
  token: Contract,
  decimals: number,
  reward_per_second: string,
  reward_per_staked_token: string,
  valid_to: number,
  last_updated :number
}

type StakingConfigResponse = {
  lp_token: Contract,
  amm_pair: string,
  admin_auth: Contract,
  query_auth: Contract | null,
  total_amount_staked: string,
  reward_tokens: RewardTokenInfo[],
}

export type {
  FactoryConfigResponse,
  FactoryPairsResponse,
  PairConfigResponse,
  PairInfoResponse,
  StakingConfigResponse,
};
