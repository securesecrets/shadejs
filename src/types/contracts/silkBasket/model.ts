import { Contract } from '~/types/contracts/shared';

enum SilkBasketParsingStatus {
  PRICES_MISSING = 'prices_missing',
  SUCCESS = 'success,'
}

type BasketItem = {
  symbol: string,
  amount: string,
  price?: string,
  weight: {
    initial: string,
    current?: string,
  }
}

type SilkBasket = {
  symbol: string,
  oracleRouterContract: Contract,
  staleInterval: number,
  peg: {
    value: string, // current value of the peg
    initialValue: string, // starting value of the peg
    isFrozen: boolean,
    lastUpdatedAt: Date,
  },
  basket: BasketItem[],
  blockHeight: number,
}

export type {
  SilkBasket,
  BasketItem,
};

export {
  SilkBasketParsingStatus,
};
