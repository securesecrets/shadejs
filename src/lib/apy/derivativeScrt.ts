import {
  SecretChainDataQueryModel,
  SecretQueryOptions,
  ValidatorRate,
} from '~/types/apy';
import { lastValueFrom, map } from 'rxjs';
import { DerivativeScrtValidator } from '~/types/contracts/derivativeScrt/model';
import { secretChainQueries$ } from './secretQueries';
import { convertCoinFromUDenom } from '../utils';

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
  validatorSet.forEach((validator) => {
    // Get commission rate for a single validator
    const commissionRate = getValidatorCommission(validator.validatorAddress, networkValidatorList);
    // Calculate APR of a single validator
    const apr = (inflationRate / (totalScrtStaked / totalScrtSupply))
    * (1 - foundationTax - communityTax)
    * (1 - commissionRate);

    // Calculate weighted average APR
    aggregateApr += (apr * validator.weight) / 100;
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
 */
function calculateDerivativeScrtApy$(lcdEndpoint: string) {
  const queries = Object.values(SecretQueryOptions);
  return secretChainQueries$(lcdEndpoint, queries).pipe(
    map((response: SecretChainDataQueryModel) => {
      const apr = calcAggregateAPR({
        networkValidatorList: response.secretValidators!,
        validatorSet: [], // TODO
        inflationRate: response.secretInflationPercent!,
        totalScrtStaked: convertCoinFromUDenom(
          response.secretTotalStakedRaw!,
          SECRET_DECIMALS,
        ).toNumber(),
        totalScrtSupply: convertCoinFromUDenom(
          response.secretTotalSupplyRaw!,
          SECRET_DECIMALS,
        ).toNumber(),
        foundationTax: response.secretTaxes!.foundationTaxPercent,
        communityTax: response.secretTaxes!.communityTaxPercent,
      });
      return calcAPY(365, apr);
    }),
  );
}

function calculateDerivativeScrtApy(lcdEndpoint: string) {
  return lastValueFrom(calculateDerivativeScrtApy$(lcdEndpoint));
}

export {
  calcAPY,
  calculateDerivativeScrtApy$,
  calculateDerivativeScrtApy,
};
