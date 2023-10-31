import { PairInfo } from '~/types/contracts/swap/model';

const pairInfoParsed: PairInfo = {
  token0Amount: '3218142110921700343525',
  token1Amount: '6366867216411002795778',
  lpTokenAmount: '4783477681443035000237',
  priceRatio: '1.08921896906564985',
  pairSettings: {
    lpFee: 0.0005,
    daoFee: 0.0005,
    stableLpFee: 0.0005,
    stableDaoFee: 0.0005,
    daoContractAddress: 'secret1g86l6j393vtzd9jmmxu57mx4q8y9gza0tncjpp',
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
