import {
  SecretChainDataQueryModel,
  SecretQueryOptions,
  ValidatorRate,
} from '~/types/apy';
import { forkJoin, lastValueFrom, map } from 'rxjs';
import {
  DerivativeScrtValidator,
  DerivativeScrtInfo,
} from '~/types/contracts/derivativeScrt/model';
import { convertCoinFromUDenom } from '~/lib/utils';
import { queryDerivativeScrtInfo$ } from '~/contracts/services/derivativeScrt';
import { secretChainQueries$ } from './secretQueries';

const SECRET_DECIMALS = 6;

/**
* Get single validator commission rate from a list of all validators
* @example Example usage of getValidatorCommission
* // returns 0.05 if commission was 5%
*/
function getValidatorCommission(
  validatorAddress: string,
  validatorList: ValidatorRate[],
):number {
  const result = validatorList.filter((
    validator,
  ) => validator.validatorAddress === validatorAddress);
  if (result[0]) {
    const commission = Number(result[0].ratePercent);
    return commission;
  }
  throw new Error(`Error: validator address ${validatorAddress} not found in list`);
}

/**
* Calculate an Aggregate Staking Rewards Return Rate based on commission rates and weights assigned
* to each validator and their commission rates.
*/
function calcAggregateAPR({
  networkValidatorList,
  validatorSet,
  inflationRate,
  totalScrtStaked,
  totalScrtSupply,
  foundationTax,
  communityTax,
}:
{
  networkValidatorList:ValidatorRate[],
  validatorSet: DerivativeScrtValidator[],
  inflationRate:number,
  totalScrtStaked:number,
  totalScrtSupply:number,
  foundationTax:number,
  communityTax:number,
}) {
  let aggregateApr = 0;
  // typically total weight will equal 100, but in rare situations the stkd-SCRT contract
  // will automatically remove validators from the active set and the total will not add up to 100
  const totalWeight = validatorSet.reduce((acc, validator) => acc + validator.weight, 0);

  validatorSet.forEach((validator) => {
    // Get commission rate for a single validator
    const commissionRate = getValidatorCommission(validator.validatorAddress, networkValidatorList);
    // Calculate APR of a single validator
    const apr = (inflationRate / (totalScrtStaked / totalScrtSupply))
    * (1 - foundationTax - communityTax)
    * (1 - commissionRate);

    // Calculate weighted average APR
    aggregateApr += (apr * validator.weight) / totalWeight;
  });
  return aggregateApr;
}

/**
 * Convert APR to APY (Annual Percentage Yield)
 * @param {number} periodRate - compounding times per year,
 * ex. for daily compounding periodRate=365
 * @param {number} apr - Annual Percentage Rate
 */
const calcAPY = (periodRate:number, apr:number):number => (1 + apr / periodRate) ** periodRate - 1;

/**
 * Will calculate APY for the stkd secret derivative contract
 *
 * returns a number that is the decimal form of the percent APY
 */
function calculateDerivativeScrtApy$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  contractAddress: string,
  codeHash: string,
  lcdEndpoint: string,
  chainId?: string,
}) {
  const queries = Object.values(SecretQueryOptions);
  return forkJoin({
    chainParameters: secretChainQueries$<SecretChainDataQueryModel>(lcdEndpoint, queries),
    derivativeInfo: queryDerivativeScrtInfo$({
      queryRouterContractAddress,
      queryRouterCodeHash,
      contractAddress,
      codeHash,
      lcdEndpoint,
      chainId,
    }),
  }).pipe(
    map((response: {
      chainParameters: SecretChainDataQueryModel,
      derivativeInfo: DerivativeScrtInfo,
    }) => {
      const apr = calcAggregateAPR({
        networkValidatorList: response.chainParameters.secretValidators,
        validatorSet: response.derivativeInfo.validators,
        inflationRate: response.chainParameters.secretInflationPercent,
        totalScrtStaked: convertCoinFromUDenom(
          response.chainParameters.secretTotalStakedRaw,
          SECRET_DECIMALS,
        ).toNumber(),
        totalScrtSupply: convertCoinFromUDenom(
          response.chainParameters.secretTotalSupplyRaw,
          SECRET_DECIMALS,
        ).toNumber(),
        foundationTax: response.chainParameters.secretTaxes!.foundationTaxPercent,
        communityTax: response.chainParameters.secretTaxes!.communityTaxPercent,
      });
      return calcAPY(365, apr);
    }),
  );
}

/**
 * Will calculate APY for the stkd secret derivative contract
 *
 * returns a number that is the decimal form of the percent APY
 */
function calculateDerivativeScrtApy({
  queryRouterContractAddress,
  queryRouterCodeHash,
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  contractAddress: string,
  codeHash: string,
  lcdEndpoint: string,
  chainId?: string,
}) {
  return lastValueFrom(calculateDerivativeScrtApy$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

export {
  calcAPY,
  calculateDerivativeScrtApy$,
  calculateDerivativeScrtApy,
};
