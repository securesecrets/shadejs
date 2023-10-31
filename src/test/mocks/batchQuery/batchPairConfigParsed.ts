import { BatchQueryParsedResponse } from '~/types/contracts/batchQuery/model';

const batchPairConfigParsed: BatchQueryParsedResponse = [{
  id: 1,
  response: {
    get_config: {
      factory_contract: {
        address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
        code_hash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
      },
      lp_token: {
        address: 'secret1l2u35dcx2a4wyx9a6lxn9va6e66z493ycqxtmx',
        code_hash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
      },
      staking_contract: {
        address: 'secret16h5sqd79x43wutne8ge3pdz3e3lngw62vy5lmr',
        code_hash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
      },
      pair: [
        {
          custom_token: {
            contract_addr: 'secret19e75l25r6sa6nhdf4lggjmgpw0vmpfvsw5cnpe',
            token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
          },
        },
        {
          custom_token: {
            contract_addr: 'secret16vjfe24un4z7d3sp9vd0cmmfmz397nh2njpw3e',
            token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
          },
        },
        true,
      ],
      custom_fee: {
        shade_dao_fee: {
          nom: 500,
          denom: 1000000,
        },
        lp_fee: {
          nom: 500,
          denom: 1000000,
        },
      },
    },
  },
},
{
  id: 2,
  response: {
    get_config: {
      factory_contract: {
        address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
        code_hash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
      },
      lp_token: {
        address: 'secret1l2u35dcx2a4wyx9a6lxn9va6e66z493ycqxtmx',
        code_hash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
      },
      staking_contract: {
        address: 'secret16h5sqd79x43wutne8ge3pdz3e3lngw62vy5lmr',
        code_hash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
      },
      pair: [
        {
          custom_token: {
            contract_addr: 'secret19e75l25r6sa6nhdf4lggjmgpw0vmpfvsw5cnpe',
            token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
          },
        },
        {
          custom_token: {
            contract_addr: 'secret16vjfe24un4z7d3sp9vd0cmmfmz397nh2njpw3e',
            token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
          },
        },
        true,
      ],
      custom_fee: {
        shade_dao_fee: {
          nom: 500,
          denom: 1000000,
        },
        lp_fee: {
          nom: 500,
          denom: 1000000,
        },
      },
    },
  },
}];

export {
  batchPairConfigParsed,
};
