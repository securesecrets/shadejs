type Coin = {
  denom: string;
  amount: string;
}

type HandleMsg = Record<string, unknown>

type Snip20MessageRequest = {
  msg: HandleMsg;
  transferAmount?: Coin;
}

type TokenInfo = {
  name: string,
  symbol: string,
  decimals: number,
  totalSupply: string,
}

type BatchTokensInfoItem = {
  tokenContractAddress: string,
  tokenInfo: TokenInfo,
  blockHeight: number,
}

type BatchTokensInfo = BatchTokensInfoItem[]

export type {
  HandleMsg,
  Snip20MessageRequest,
  TokenInfo,
  BatchTokensInfo,
};
