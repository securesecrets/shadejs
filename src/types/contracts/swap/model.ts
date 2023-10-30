type Contract = {
  address: string,
  codeHash: string,
};

type FactoryContract = Contract & { isEnabled: boolean }

type ContractInstantiationInfo = {
  codeHash: string,
  id: number,
}

type FactoryConfig = {
  pairContractInstatiationInfo: ContractInstantiationInfo,
  lpTokenContractInstatiationInfo: ContractInstantiationInfo,
  adminAuthContract: Contract,
  authenticatorContract: Contract | null,
  defaultPairSettings: {
    lpFee: number,
    daoFee: number,
    stableLpFee: number,
    stableDaoFee: number,
    daoContract: Contract,
  }
}

type FactoryPairs = {
  pairs: FactoryContract[],
  startIndex: number,
  endIndex: number,
}

type CustomFee = {
  daoFee: number,
  lpFee: number,
}

type PairConfig = {
  factoryContract: Contract | null,
  lpTokenContract: Contract | null,
  stakingContract: Contract | null,
  token0Contract: Contract,
  token1Contract: Contract,
  isStable: boolean,
  fee: CustomFee | null,
}

export type {
  FactoryPairs,
  PairConfig,
  FactoryConfig,
};
