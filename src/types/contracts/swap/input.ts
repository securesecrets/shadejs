type PathContractWithTokensFormatted = {
  address: string,
  code_hash: string,
  token0: {
    address: string,
    code_hash?: string,
  },
  token1: {
    address: string,
    code_hash?: string,
  },
}
type PathsContractWithTokensFormatted = PathContractWithTokensFormatted[]

export type {
  PathsContractWithTokensFormatted,
};
