import { BatchQueryParsedResponse } from '~/types';

const batchVaultsResponseUnparsed: BatchQueryParsedResponse = [
  {
    id: 'secret18y86hldtdp9ndj0jekcch49kwr0gwy7upe3ffw',
    response: {
      vaults: [
        {
          vault: {
            id: '1',
            epoch: '0',
            name: 'stkd-SCRT Vault',
            collateral_addr: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
            safe_collateral: '3076606761056046617547',
            collateral: {
              elastic: '69822082224544587516946',
              base: '69822082224544587516946',
              last_accrued: '1681764653',
            },
            debt: {
              elastic: '12734302492560037164766',
              base: '12734302492560037164766',
              last_accrued: '1710953012',
            },
            config: {
              max_ltv: '0.45',
              collateral_oracle_delay: '600',
              fees: {
                interest_rate: {
                  last_changed: '1681764653',
                  current: '0',
                  target: '0',
                  minimum_fee_update_interval: '1681764653',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                borrow_fee: {
                  last_changed: '1681764653',
                  current: '0',
                  target: '0',
                  minimum_fee_update_interval: '1681764653',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                liquidation_fee: {
                  discount: '0.1',
                  min_debt: '100000000000000000000',
                  treasury_share: '0.2',
                  caller_share: '0.1',
                },
              },
            },
            allowance: {
              used: '11825976211616265357496',
              max: '0',
            },
            open_positions: {
              value: '32',
            },
            is_protocol: false,
            position_id_counter: {
              value: '73',
            },
          },
          status: 'deprecated',
          whitelist: [],
        },
        {
          vault: {
            id: '2',
            epoch: '0',
            name: 'USDT Vault',
            collateral_addr: 'secret1wk5j2cntwg2fgklf0uta3tlkvt87alfj7kepuw',
            safe_collateral: '4653229977094',
            collateral: {
              elastic: '0',
              base: '0',
              last_accrued: '1681764653',
            },
            debt: {
              elastic: '0',
              base: '0',
              last_accrued: '1710953012',
            },
            config: {
              max_ltv: '0.85',
              collateral_oracle_delay: '600',
              fees: {
                interest_rate: {
                  last_changed: '1681764653',
                  current: '0',
                  target: '0',
                  minimum_fee_update_interval: '1681764653',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                borrow_fee: {
                  last_changed: '1681764653',
                  current: '0',
                  target: '0',
                  minimum_fee_update_interval: '1681764653',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                liquidation_fee: {
                  discount: '0.05',
                  min_debt: '100000000000000000000',
                  treasury_share: '0.2',
                  caller_share: '0.1',
                },
              },
            },
            allowance: {
              used: '0',
              max: '0',
            },
            open_positions: {
              value: '3',
            },
            is_protocol: false,
            position_id_counter: {
              value: '9',
            },
          },
          status: 'deprecated',
          whitelist: [],
        },
      ],
      page: '0',
      total_pages: '1',
      total_vaults: '3',
    },
    blockHeight: 1,
  },
  {
    id: 'secret1qxk2scacpgj2mmm0af60674afl9e6qneg7yuny',
    response: {
      vaults: [
        {
          vault: {
            id: '1',
            epoch: '0',
            name: 'stkd-SCRT Vault',
            collateral_addr: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
            safe_collateral: '31445759105000000000000',
            collateral: {
              elastic: '3740763561877000000000000',
              base: '3740763561877000000000000',
              last_accrued: '1682191940',
              decimals: 6,
            },
            debt: {
              elastic: '700859978232000000000000',
              base: '700859978232000000000000',
              last_accrued: '1710952834',
              decimals: 6,
            },
            config: {
              max_ltv: '0.5',
              collateral_oracle_delay: '600',
              fees: {
                interest_rate: {
                  last_changed: '1682191940',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                borrow_fee: {
                  last_changed: '1682191940',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                liquidation_fee: {
                  discount: '0.1',
                  min_debt: '100000000000000000000',
                  treasury_share: '0.2',
                  caller_share: '0.1',
                },
              },
            },
            allowance: {
              used: '700859978232000000000000',
              max: '750000000000000000000000',
            },
            open_positions: {
              value: '182',
            },
            is_protocol: false,
            position_id_counter: {
              value: '389',
            },
          },
          status: 'normal',
          whitelist: [],
        },
        {
          vault: {
            id: '2',
            epoch: '0',
            name: 'USDT Vault',
            collateral_addr: 'secret1wk5j2cntwg2fgklf0uta3tlkvt87alfj7kepuw',
            safe_collateral: '73431644000000000000',
            collateral: {
              elastic: '350148899892000000000000',
              base: '350148899892000000000000',
              last_accrued: '1682191940',
              decimals: 6,
            },
            debt: {
              elastic: '227873904431360577633957',
              base: '226847073546658394171419',
              last_accrued: '1710952834',
              decimals: 6,
            },
            config: {
              max_ltv: '0.85',
              collateral_oracle_delay: '600',
              fees: {
                interest_rate: {
                  last_changed: '1696699251',
                  current: '0.01',
                  target: '0.01',
                  delta: '0.01',
                  rate_per_second: '0.000000000316887385',
                },
                borrow_fee: {
                  last_changed: '1682191940',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                liquidation_fee: {
                  discount: '0.05',
                  min_debt: '100000000000000000000',
                  treasury_share: '0.2',
                  caller_share: '0.1',
                },
              },
            },
            allowance: {
              used: '226463256570000000000000',
              max: '700000000000000000000000',
            },
            open_positions: {
              value: '15',
            },
            is_protocol: false,
            position_id_counter: {
              value: '60',
            },
          },
          status: 'normal',
          whitelist: [],
        },
      ],
      page: '0',
      total_pages: '1',
      total_vaults: '3',
    },
    blockHeight: 1,
  },
  {
    id: 'secret1wj2czeeknya2n6jag7kpfxlm28dw7q96dgqmfs',
    response: {
      vaults: [
        {
          vault: {
            id: '1',
            epoch: '0',
            name: 'WBTC Vault',
            collateral_addr: 'secret1guyayjwg5f84daaxl7w84skd8naxvq8vz9upqx',
            safe_collateral: '4026842206160691204',
            collateral: {
              elastic: '2114626673839308796',
              base: '2114626673839308796',
              last_accrued: '1710183488',
              decimals: 8,
            },
            debt: {
              elastic: '121848577218000000000000',
              base: '121848577218000000000000',
              last_accrued: '1710953123',
              decimals: 6,
            },
            config: {
              max_ltv: '0.8',
              collateral_oracle_delay: '600',
              fees: {
                interest_rate: {
                  last_changed: '1710183488',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                borrow_fee: {
                  last_changed: '1710183488',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                liquidation_fee: {
                  discount: '0.1',
                  min_debt: '100000000000000000000',
                  treasury_share: '0.2',
                  caller_share: '0.1',
                },
              },
            },
            allowance: {
              used: '121848577218000000000000',
              max: '150000000000000000000000',
            },
            open_positions: {
              value: '21',
            },
            is_protocol: false,
            position_id_counter: {
              value: '23',
            },
          },
          status: 'normal',
          whitelist: [],
        },
        {
          vault: {
            id: '2',
            epoch: '0',
            name: 'TIA Vault',
            collateral_addr: 'secret1s9h6mrp4k9gll4zfv5h78ll68hdq8ml7jrnn20',
            safe_collateral: '9360727902929305557',
            collateral: {
              elastic: '5699935097070694443',
              base: '5699935097070694443',
              last_accrued: '1710183538',
              decimals: 6,
            },
            debt: {
              elastic: '64898575000000000000',
              base: '64898575000000000000',
              last_accrued: '1710953123',
              decimals: 6,
            },
            config: {
              max_ltv: '0.55',
              collateral_oracle_delay: '600',
              fees: {
                interest_rate: {
                  last_changed: '1710183538',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                borrow_fee: {
                  last_changed: '1710183538',
                  current: '0',
                  target: '0',
                  delta: '0.01',
                  rate_per_second: '0',
                },
                liquidation_fee: {
                  discount: '0.1',
                  min_debt: '100000000000000000000',
                  treasury_share: '0.2',
                  caller_share: '0.1',
                },
              },
            },
            allowance: {
              used: '64898575000000000000',
              max: '50000000000000000000000',
            },
            open_positions: {
              value: '2',
            },
            is_protocol: false,
            position_id_counter: {
              value: '2',
            },
          },
          status: 'normal',
          whitelist: [],
        },
      ],
      page: '0',
      total_pages: '1',
      total_vaults: '3',
    },
    blockHeight: 1,
  },
];

export {
  batchVaultsResponseUnparsed,
};
