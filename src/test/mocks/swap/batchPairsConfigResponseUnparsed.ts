const batchPairsConfigResponseUnparsed = [
  {
    id: 'secret1qyt4l47yq3x43ezle4nwlh5q0sn6f9sesat7ap',
    response: {
      get_config: {
        factory_contract: {
          address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
          code_hash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
        },
        lp_token: {
          address: 'secret10egcg03euavu336fzed87m4zdx8jkgzzz7zgmh',
          code_hash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
        },
        staking_contract: {
          address: 'secret1vgtmfvzdn7ztn7kcrqd7p6f2z97wvauavp3udh',
          code_hash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
        },
        pair: [
          {
            custom_token: {
              contract_addr: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
              token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
            },
          },
          {
            custom_token: {
              contract_addr: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
              token_code_hash: 'f6be719b3c6feb498d3554ca0398eb6b7e7db262acb33f84a8f12106da6bbb09',
            },
          },
          false,
        ],
        custom_fee: null,
      },
    },
    blockHeight: 1,
  },
  {
    id: 'secret1l34fyc9g23fnlk896693nw57phevnyha7pt6gj',
    response: {
      get_config: {
        factory_contract: {
          address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
          code_hash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
        },
        lp_token: {
          address: 'secret1zw9gwj6kx7vd3xax7wf45y6dmawkj3pd3dk7wt',
          code_hash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
        },
        staking_contract: {
          address: 'secret13j4n5gj8857h2j4cnempdkfygrw9snasx4yzw2',
          code_hash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
        },
        pair: [
          {
            custom_token: {
              contract_addr: 'secret1fl449muk5yq8dlad7a22nje4p5d2pnsgymhjfd',
              token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
            },
          },
          {
            custom_token: {
              contract_addr: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
              token_code_hash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
            },
          },
          false,
        ],
        custom_fee: {
          shade_dao_fee: {
            nom: 30,
            denom: 10000,
          },
          lp_fee: {
            nom: 0,
            denom: 10000,
          },
        },
      },
    },
    blockHeight: 1,
  },
];

export {
  batchPairsConfigResponseUnparsed,
};
