import { ContractData } from '~/types/contracts/shared';

type StabilityPoolContractData = {
  contract: ContractData,
  decimals: number,
  quote_symbol: string,
}

type StabilityPoolResponse = {
  silk: StabilityPoolContractData,
  pool_info: {
    assets: StabilityPoolContractData[],
    total_silk_deposited: string,
    total_bond_amount: string,
    bond_scaling: string,
    epoch: string,
  }
}

export type {
  StabilityPoolResponse,
};
