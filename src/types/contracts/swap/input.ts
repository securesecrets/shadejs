type PathContractFormatted = {
  addr: string,
  code_hash: string,
}

type PathsContractFormatted = PathContractFormatted[]

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
  PathsContractFormatted,
  PathsContractWithTokensFormatted,
};
