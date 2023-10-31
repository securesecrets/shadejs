import { PairInfo } from '~/types/contracts/swap/model';

const pairInfoParsed: PairInfo = {
  token0Contract: {
    address: 'secret14706vxakdzkz9a36872cs62vpl5qd84kpwvpew',
    codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
  },
  token1Contract: {
    address: 'secret1eurddal3m0tphtapad9awgzcuxwz8ptrdx7h4n',
    codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
  },
  lpTokenContract: {
    address: 'secret17nmgfelgmmzdnzpfgr0g09kfjyk6sn5l9s0m2x',
    codeHash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
  },
  factoryContract: {
    address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
    codeHash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
  },
  daoContractAddress: 'secret1g86l6j393vtzd9jmmxu57mx4q8y9gza0tncjpp',
  isStable: true,
  token0Amount: '3218142110921700343525',
  token1Amount: '6366867216411002795778',
  lpTokenAmount: '4783477681443035000237',
  priceRatio: '1.08921896906564985',
  pairSettings: {
    lpFee: 0.0005,
    daoFee: 0.0005,
    stableLpFee: 0.0005,
    stableDaoFee: 0.0005,
    stableParams: {
      alpha: '150',
      gamma1: '6',
      gamma2: '50',
      oracle: {
        address: 'secret10n2xl5jmez6r9umtdrth78k0vwmce0l5m9f5dm',
        codeHash: '32c4710842b97a526c243a68511b15f58d6e72a388af38a7221ff3244c754e91',
      },
      token0Data: {
        oracleKey: 'Stableswap Rate Base',
        decimals: 18,
      },
      token1Data: {
        oracleKey: 'Stride INJ Rate',
        decimals: 18,
      },
      minTradeSizeXForY: '0.000000001',
      minTradeSizeYForX: '0.000000001',
      maxPriceImpactAllowed: '1000',
      customIterationControls: null,
    },

  },
  contractVersion: 1,
};

export {
  pairInfoParsed,
};
