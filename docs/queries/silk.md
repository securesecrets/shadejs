# Silk Peg Examples

This page demonstrates how to query the Silk peg and information about the basket of currencies that make up the Silk peg.

## Silk Basket
Query info for the silk basket

**input**
```ts
/**
 * query the silk basket data
 * 
 * silkBasketExpectedOracleKeys is set to optional because if oracle keys are
 * known in advance it will increase the efficiency of the response, but even if 
 * keys are unknown or incorrectly passed in compared to the true state of the  
 * basket this query will self-correct using a retry on the actual keys found.
 */
function querySilkBasket({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  oracleContractAddress,
  oracleCodeHash,
  silkBasketExpectedOracleKeys,
  silkIndexOracleContractAddress,
  silkIndexOracleCodeHash,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  oracleContractAddress: string,
  oracleCodeHash: string,
  silkBasketExpectedOracleKeys?: string[]
  silkIndexOracleContractAddress: string,
  silkIndexOracleCodeHash: string,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}): Promise<SilkBasket>
```

**output**
```ts
type SilkBasket = {
  symbol: string, // silk peg oracle key
  oracleRouterContract: Contract,
  staleInterval: number, // seconds before stale oracle would cause a peg freeze.
  peg: {
    value: string, // current value of the peg
    initialValue: string, // starting value of the peg
    isFrozen: boolean,
    lastUpdatedAt: Date,
  },
  basket: BasketItem[],
  blockHeight: number,
}

type BasketItem = {
  symbol: string, // oracle key
  amount: string, // fixed amount of the currency that makes up the peg
  price?: string, // price of the currency
  weight: {
    initial: string, // expressed as decimal percent
    current?: string, 
  }
}
```

```md
{
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
    price: '0.731678675',
    weight: {
      current: '0.068207221323326828',
      initial: '0.077167854630036405',
    },
  },
  {
    symbol: 'USD',
    amount: '0.353843538457366364',
    price: '1',
    weight: {
      current: '0.307721616114778065',
      initial: '0.337301580837853137',
    },
  },
  {
    symbol: 'JPY',
    amount: '15.684456395164345505',
    price: '0.006425558',
    weight: {
      current: '0.087644981665339478',
      initial: '0.103589679459286984',
    },
  },
  {
    symbol: 'BTC',
    amount: '0.000002334689261109',
    price: '64526.1',
    weight: {
      current: '0.131012048654205263',
      initial: '0.068084956080984917',
    },
  },
  {
    symbol: 'EUR',
    amount: '0.223108470434723066',
    price: '1.072833942',
    weight: {
      current: '0.20815905098669853',
      initial: '0.232086119065448055',
    },
  },
  {
    symbol: 'XAU',
    amount: '0.000099333104038645',
    price: '2332.0433247',
    weight: {
      current: '0.201454677990644557',
      initial: '0.181769809926390499',
    },
  }],
  blockHeight: 123456789,
}
```