enum NormalizationFactor {
  LEND = 18,
  LEND_BORROW_FEE = 16,
}

type Counter = {
  value: string,
}

enum LendContractStatus {
  NORMAL = 'normal',
  DEPRECATED = 'deprecated',
  FROZEN = 'frozen'
}

type VaultResponse = {
  vault: {
    id: string,
    name: string,
    collateral_addr: string,
    safe_collateral: string,
    collateral: {
      elastic: string,
      base: string,
      last_accrued: string,
      decimals?: number, // not included in Vault V1
    },
    debt: {
      elastic: string,
      base: string,
      last_accrued: string,
      decimals?: number, // not included in Vault V1
    },
    config: {
      max_ltv: string,
      collateral_oracle_delay: string,
      fees: {
        interest_rate: {
          last_changed: string,
          current: string,
          target: string,
          delta: string,
          rate_per_second: string,
          minimum_fee_update_interval?: string // V1 only
        },
        borrow_fee: {
          last_changed: string,
          current: string,
          target: string,
          delta: string,
          rate_per_second: string,
          minimum_fee_update_interval?: string // V1 only
        },
        liquidation_fee: {
          discount: string,
          min_debt: string,
          treasury_share: string,
          caller_share: string,
        },
      },
    },
    allowance: {
      used: string,
      max: string,
    },
    position_id_counter: Counter,
    open_positions: Counter,
    is_protocol: boolean,
  },
  status: LendContractStatus,
  whitelist: string[],
}

type VaultsResponse = {
  vaults: VaultResponse[],
  page: string,
  total_pages: string,
  total_vaults: string,
}

type PositionInfo = {
  vault_id: string,
  debt_amount: string,
  collateral_amount: string,
}

type PositionResponse = {
  position_info: { position: PositionInfo | null },
}

type PositionsResponse = {
  positions: {
    positions: PositionInfo[] | null,
  },
}

export type {
  VaultsResponse,
  VaultResponse,
  PositionResponse,
  PositionsResponse,
};
export {
  NormalizationFactor,
  LendContractStatus,
};
