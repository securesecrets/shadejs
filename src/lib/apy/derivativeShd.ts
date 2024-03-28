import { queryShadeStakingOpportunity$ } from '~/contracts/services/shadeStaking';
import { lastValueFrom, map } from 'rxjs';
import { StakingInfoServiceModel } from '~/types/contracts/shadeStaking/index';
import { convertCoinFromUDenom } from '~/lib/utils';
import { calcAPY } from './derivativeScrt';

/**
 * Calculate APY
 * Formula is (1+r/n)^n-1
 * r = period rate
 * n = number of compounding periods
 */
function calculateRewardPoolAPY({
  rate,
  totalStaked,
  price,
  decimalPlaces,
}:{
  rate: number,
  totalStaked: string,
  price: string,
  decimalPlaces: number,
}) {
  // Check that price returned successfully
  if (!Number(price)) {
    return 0;
  }

  const SECONDS_PER_YEAR = 31536000;
  const rewardsPerYearPerStakedToken = (rate * SECONDS_PER_YEAR) / Number(totalStaked);
  // period rate = rewardsPerYear* price
  const periodRate = rewardsPerYearPerStakedToken * Number(price);
  // divide by stakedPrice to determine a percentage. Units are now ($)/($*day)
  const r = periodRate / Number(price);
  return calcAPY(365, r) * (10 ** decimalPlaces);
}

/**
 * Calculates the dSHD expected APY by querying the staking contract
 * TESTNET ONLY NOT READY FOR PRODUCTION
 *
 * returns a number that is the decimal form of the percent APY
 */
function calculateDerivativeShdApy$({
  shadeTokenContractAddress,
  shadeStakingContractAddress,
  shadeStakingCodeHash,
  decimals,
  price,
  lcdEndpoint,
  chainId,
}:{
  shadeTokenContractAddress: string,
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
  decimals: number,
  price: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return queryShadeStakingOpportunity$({
    shadeStakingContractAddress,
    shadeStakingCodeHash,
    lcdEndpoint,
    chainId,
  }).pipe(
    map((response: StakingInfoServiceModel) => response.rewardPools.reduce(
      (prev, current) => {
        // Make sure to check that we're only calculating for shd
        if (current.tokenAddress === shadeTokenContractAddress
            && current.endDate.getTime() > Date.now()) {
          return prev + calculateRewardPoolAPY({
            rate: convertCoinFromUDenom(current.rateRaw, decimals).toNumber(),
            totalStaked: response.totalStakedRaw,
            price,
            decimalPlaces: decimals,
          });
        }
        return prev;
      },
      0,
    )),
  );
}

/**
 * Calculates the dSHD expected APY by querying the staking contract
 * TESTNET ONLY NOT READY FOR PRODUCTION
 *
 * returns a number that is the decimal form of the percent APY
 */
async function calculateDerivativeShdApy({
  shadeTokenContractAddress,
  shadeStakingContractAddress,
  shadeStakingCodeHash,
  decimals,
  price,
  lcdEndpoint,
  chainId,
}:{
  shadeTokenContractAddress: string,
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
  decimals: number,
  price: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(calculateDerivativeShdApy$({
    shadeTokenContractAddress,
    shadeStakingContractAddress,
    shadeStakingCodeHash,
    decimals,
    price,
    lcdEndpoint,
    chainId,
  }));
}

export {
  calculateDerivativeShdApy$,
  calculateDerivativeShdApy,
};
