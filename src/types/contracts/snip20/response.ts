type TokenInfoResponse = {
  token_info: {
    name: string,
    symbol: string,
    decimals: number,
    total_supply:string
  }
}

type BalanceResponse = {
  balance: {
    amount: string,
  }
}

export type {
  TokenInfoResponse,
  BalanceResponse,
};
