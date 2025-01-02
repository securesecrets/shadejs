type ConfigResponse = {
  admin_auth: {
    address: string,
    code_hash: string,
  }
  query_auth: {
    address: string,
    code_hash: string,
  }
  oracle: {
    address: string,
    code_hash: string,
  }
  fee_collector: string,
  l_token_id: number,
  l_token_code_hash: string,
  l_token_blockchain_admin: string,
  status: {
    supply_enabled: boolean,
    borrow_enabled: boolean,
    repay_enabled: boolean,
    liquidation_enabled: boolean,
    interest_accrual_enabled: boolean,
    collateral_deposit_enabled: boolean,
  }
}

type PaginatedResponse<T> = {
  page: number,
  page_size: number,
  total_pages: number,
  total_items: number,
  data: T[]
}

type VaultResponse = {
    token: {
      address: string,
      code_hash: string,
    },
    l_token: {
      address: string,
      code_hash: string,
    },
    decimals: number,
    oracle_key: string,
    interest: {
      base: string,
      slope1: string,
      slope2: string,
      optimal_utilisation: string,
    },
    loanable: string,
    lent_amount: string,
    lifetime_interest_paid: string,
    lifetime_interest_owed: string,
    interest_per_utoken: string,
    last_interest_accrued: number,
    max_supply: string,
    dao_interest_fee: string,
    flash_loan_interest: string,
    status: {
        supply_enabled: boolean,
        borrow_enabled: boolean,
        repay_enabled: boolean,
        liquidation_enabled: boolean,
        interest_accrual_enabled: boolean,
    }
}

type GetVaultsResponse = PaginatedResponse<VaultResponse>;

type CollateralResponse = {
  token: {
    address: string,
    code_hash: string,
  },
  amount: string,
  decimals: number,
  max_initial_ltv: string,
  public_liquidation_threshold: string,
  private_liquidation_threshold: string,
  liquidation_discount: string,
  oracle_key: string,
  status: {
    deposit_enabled: boolean,
    liquidation_enabled: boolean,
  }
}

type GetCollateralResponse = PaginatedResponse<CollateralResponse>;

type CalculatedUserCollateralResponse = {
  calculated_user_collateral: {
    token: string,
    amount: string,
    price: string,
    value: string,
  }
}

type CalculatedUserDebtResponse = {
  calculated_user_debt: {
    token: string,
    price: string,
    principal: string,
    principal_value: string,
    interest_accrued: string,
    interest_accrued_value: string,
  }
}

type UserPositionResponse = {
  calcualted_user_position: {
    id: string,
    collateral: CalculatedUserCollateralResponse[],
    debt: CalculatedUserDebtResponse[],
    total_collateral_value: string,
    total_principal_value: string,
    total_interest_accrued_value: string,
    loan_max_point: string,
    loan_liquidation_point: string,
  }
}

// Flexible type for actions, leaving it as a JSON object (blob)
type PublicLogResponse = {
  timestamp: number,
  action: Record<string, any>, // Flexible JSON blob for action
}

// Paginated response type for public events
type GetPublicLogsResponse = PaginatedResponse<PublicLogResponse>;

export type {
  ConfigResponse,
  GetVaultsResponse,
  GetCollateralResponse,
  UserPositionResponse,
  PublicLogResponse,
  GetPublicLogsResponse,
};
