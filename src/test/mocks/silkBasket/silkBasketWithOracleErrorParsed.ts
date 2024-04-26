import { SilkBasket, SilkBasketParsingStatus } from '~/types/contracts/silkBasket/model';

const silkBasketWithOracleErrorParsed: SilkBasket & { status: SilkBasketParsingStatus } = {
  symbol: 'SILK Peg',
  oracleRouterContract: {
    address: 'secret10n2xl5jmez6r9umtdrth78k0vwmce0l5m9f5dm',
    codeHash: '32c4710842b97a526c243a68511b15f58d6e72a388af38a7221ff3244c754e91',
  },
  staleInterval: 3600,
  peg: {
    value: '1.149881971',
    initialValue: '1.05',
    isFrozen: false,
    lastUpdatedAt: new Date(1714053218000),
  },
  basket: [{
    symbol: 'CAD',
    amount: '0.107192209875052435',
    price: undefined,
    weight: {
      current: undefined,
      initial: '0.077167854630036405',
    },
  },
  {
    symbol: 'USD',
    amount: '0.353843538457366364',
    price: undefined,
    weight: {
      current: undefined,
      initial: '0.337301580837853137',
    },
  },
  {
    symbol: 'JPY',
    amount: '15.684456395164345505',
    price: undefined,
    weight: {
      current: undefined,
      initial: '0.103589679459286984',
    },
  },
  {
    symbol: 'BTC',
    amount: '0.000002334689261109',
    price: undefined,
    weight: {
      current: undefined,
      initial: '0.068084956080984917',
    },
  },
  {
    symbol: 'EUR',
    amount: '0.223108470434723066',
    price: undefined,
    weight: {
      current: undefined,
      initial: '0.232086119065448055',
    },
  },
  {
    symbol: 'XAU',
    amount: '0.000099333104038645',
    price: undefined,
    weight: {
      current: undefined,
      initial: '0.181769809926390499',
    },
  }],
  blockHeight: 1,
  status: SilkBasketParsingStatus.PRICES_MISSING,
};

export {
  silkBasketWithOracleErrorParsed,
};
