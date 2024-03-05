type Permit = {
  params: {
    data: string,
    key: string,
  },
  signature: string,
  account_number?: number,
  chain_id?: string,
  sequence?: number,
  memo?: string,
}

type TokenConfig = {
  tokenContractAddress: string,
  decimals: number,
}

type TokensConfig = TokenConfig[]

export type {
  TokensConfig,
  Permit,
};
