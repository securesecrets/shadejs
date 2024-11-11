import { PaginatedPublicLogs } from '~/types/contracts/moneyMarket';

const queryMoneyMarketPublicLogsParsedMock: PaginatedPublicLogs = {
  page: 0,
  pageSize: 3,
  totalPages: 1,
  totalItems: 3,
  data: [
    {
      timestamp: new Date(1731103428000), // Convert UNIX timestamp to Date
      action: {
        market_added: {
          dao_interest_fee: "0.1",
          decimals: 8,
          flash_loan_interest: "1",
          interest: {
            base: "0.02",
            optimal_utilisation: "0.7",
            slope1: "0.1",
            slope2: "0.2",
          },
          interest_per_utoken: "0",
          l_token: {
            address: "",
            code_hash: "4d7ab2164a33cfebbb6384b4221b7ca3de9936f2ce5b0de5cacd2fd1b932cc07",
          },
          last_interest_accrued: 0,
          lent_amount: "0",
          lifetime_interest_owed: "0",
          lifetime_interest_paid: "0",
          loanable: "0",
          market_token: {
            address: "secret1myggj2h49xhsm8pl8yq96cjaytzvudf39mexwk",
            code_hash: "1691e4e24714e324a8d2345183027a918bba5c737bb2cbdbedda3cf8e7672faf",
          },
          max_supply: "100000000000000000",
          oracle_key: "BTC",
          status: {
            borrow_enabled: true,
            interest_accrual_enabled: true,
            liquidation_enabled: true,
            repay_enabled: true,
            supply_enabled: true,
          },
        },
      },
    },
    {
      timestamp: new Date(1731103034000), // Convert UNIX timestamp to Date
      action: {
        collateral_added: {
          liquidation_discount: "0.1",
          max_initial_ltv: "0.9",
          oracle_key: "SILK",
          private_liquidation_threshold: "0.05",
          public_liquidation_threshold: "0.07",
          token: {
            address: "secret15e5k97pfrwpkqwfxxeel0p6yn5dxztcfk9twvs",
            code_hash: "1691e4e24714e324a8d2345183027a918bba5c737bb2cbdbedda3cf8e7672faf",
          },
        },
      },
    },
    {
      timestamp: new Date(1730241028000), // Convert UNIX timestamp to Date
      action: {
        contract_init: {
          admin_auth: {
            address: "secret1wqymuexhhnsk5je5g2m08y848mfq9a0fvchwle",
            code_hash: "1f86c1b8c5b923f5ace279632e6d9fc2c9c7fdd35abad5171825698c125134f3",
          },
          fee_collector: "secret1t6w88lh492zel8z9mdkeghnfh9qnfjnkel6xrs",
          l_token_blockchain_admin: "secret1t6w88lh492zel8z9mdkeghnfh9qnfjnkel6xrs",
          l_token_code_hash: "4d7ab2164a33cfebbb6384b4221b7ca3de9936f2ce5b0de5cacd2fd1b932cc07",
          l_token_id: 10113,
          max_constant_product_price_impact: "0.1",
          max_stableswap_tvl_percent: "0.1",
          oracle: {
            address: "secret1nxdxgftuay7ny34epkfnn3kvvk3lcyrevuqzpe",
            code_hash: "113c47c016667817b315dde03b4ee9774edf1fb293a7ea3f02d983c6b1fa1cf1",
          },
          private_liquidation_interval: 10,
          private_liquidation_protocol_share: "0.1",
          public_liquidation_protocol_fee: "0.1",
          query_auth: {
            address: "secret1e0k5jza9jqctc5dt7mltnxmwpu3a3kqe0a6hf3",
            code_hash: "b6ec3cc640d26b6658d52e0cfb5f79abc3afd1643ec5112cfc6a9fb51d848e69",
          },
          swap_router: {
            address: "secret137sjm7hgqdp4d0dldqnrxe2ktw02meaygnjd0e",
            code_hash: "93dac48bf508eeb4c619fcb8b1cb260f9957e31450740a2b7325440ddf92daa8",
          },
        },
      },
    },
  ],
};

export { queryMoneyMarketPublicLogsParsedMock };
