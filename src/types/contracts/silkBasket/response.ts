import { ContractData } from '~/types/contracts/shared';

type BasketResponseItem = {
  symbol: string,
  weight: {
    initial: string,
    fixed: string,
  }
}

type SilkBasketResponse = {
  symbol: string,
  router: ContractData,
  when_stale: string,
  peg: {
    target: string,
    value: string,
    last_value: string,
    frozen: boolean,
    last_updated: string,
  },
  basket: BasketResponseItem[],
}

export type {
  SilkBasketResponse,
};
