import { queryShadeStakingOpportunity$ } from '~/contracts/services/shadeStaking';
import { lastValueFrom, map } from 'rxjs';
import { StakingInfoServiceModel } from '~/types/contracts/shadeStaking/index';
import { convertCoinFromUDenom } from '~/lib/utils';
import { calcAPY } from './derivativeScrt';

const SHADE_DECIMALS = 8;

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
}:{
  rate: number,
  totalStaked: string,
  price: string,
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
  return calcAPY(365, r) * (10 ** SHADE_DECIMALS);
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
  price,
  lcdEndpoint,
  chainId,
}:{
  shadeTokenContractAddress: string,
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
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
            rate: convertCoinFromUDenom(current.rateRaw, SHADE_DECIMALS).toNumber(),
            totalStaked: response.totalStakedRaw,
            price,
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
  price,
  lcdEndpoint,
  chainId,
}:{
  shadeTokenContractAddress: string,
  shadeStakingContractAddress: string,
  shadeStakingCodeHash?: string,
  price: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(calculateDerivativeShdApy$({
    shadeTokenContractAddress,
    shadeStakingContractAddress,
    shadeStakingCodeHash,
    price,
    lcdEndpoint,
    chainId,
  }));
}

export {
  calculateDerivativeShdApy$,
  calculateDerivativeShdApy,
};
