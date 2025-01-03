type SecretInflationResponse = {
  result: number,
};

type SecretSupplyItemResponse = {
  denom: string,
  amount: string,
}

type SecretTotalSupplyResponse = {
  amount: SecretSupplyItemResponse,
}

type SecretTotalStakedResponse = {
  result: {
    not_bonded_tokens: string,
    bonded_tokens: string,
  },
}

type SecretTaxesResponse = {
  result: {
    community_tax: string,
    secret_foundation_tax: string,
  },
}

type ValidatorRate = {
  validatorAddress: string,
  ratePercent: number,
}

type SecretChainDataQueryModel = {
  secretInflationPercent: number,
  secretTotalSupplyRaw: number,
  secretTotalStakedRaw: number,
  secretTaxes: {
    foundationTaxPercent: number,
    communityTaxPercent: number,
  },
  secretValidators: ValidatorRate[],
}

export type {
  SecretInflationResponse,
  SecretTotalSupplyResponse,
  SecretTotalStakedResponse,
  SecretTaxesResponse,
  ValidatorRate,
  SecretChainDataQueryModel,
};
