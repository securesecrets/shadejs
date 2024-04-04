import {
  ValidatorRate,
} from '~/types/apy';
import {
  DerivativeScrtValidator,
} from '~/types/contracts/derivativeScrt/model';

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
 * Calculate APR of a single validator based off inflation and commission rate
 */
function calcValidatorAPR({
  inflationRate,
  totalScrtStaked,
  totalScrtSupply,
  foundationTax,
  communityTax,
  commissionRate,
}:{
  inflationRate: number,
  totalScrtStaked: number,
  totalScrtSupply: number,
  foundationTax: number,
  communityTax: number,
  commissionRate: number,
}) {
  return (inflationRate / (totalScrtStaked / totalScrtSupply))
    * (1 - foundationTax - communityTax)
    * (1 - commissionRate);
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
    const apr = calcValidatorAPR({
      inflationRate,
      totalScrtStaked,
      totalScrtSupply,
      foundationTax,
      communityTax,
      commissionRate,
    });

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
 * Calculate APY for a shadeStaking reward pool
 * Formula is (1+r/n)^n-1
 * r = period rate
 * n = number of compounding periods
 *
 * @param rate is the rate of the reward token released normalized to that tokens decimals
 * @param totalStaked is the amount of shade that is staked to the pool (in udenom format)
 * @param price is the price of the reward token
 * @param stakedPrice is the price of the staking token
 * @param decimals is the decimals of the reward token
 */
function calculateRewardPoolAPY({
  rate,
  totalStaked,
  price,
  stakedPrice,
  decimals,
}:{
  rate: number,
  totalStaked: string,
  price: string,
  stakedPrice: string,
  decimals: number,
}) {
  // Check that price returned successfully
  if (!Number(stakedPrice)) {
    return 0;
  }

  const SECONDS_PER_YEAR = 31536000;
  const rewardsPerYearPerStakedToken = (rate * SECONDS_PER_YEAR) / Number(totalStaked);
  // period rate = rewardsPerYear* price
  const periodRate = rewardsPerYearPerStakedToken * Number(price);
  // divide by stakedPrice to determine a percentage. Units are now ($)/($*day)
  const r = periodRate / Number(stakedPrice);
  return calcAPY(365, r) * (10 ** decimals);
}

export {
  getValidatorCommission,
  calcValidatorAPR,
  calcAggregateAPR,
  calcAPY,
  calculateRewardPoolAPY,
};
