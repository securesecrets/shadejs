import BigNumber from 'node_modules/bignumber.js/bignumber';
import { queryShadeStakingOpportunity$ } from '~/contracts/services/shadeStaking';
import { map } from 'rxjs';
import { StakingInfoServiceModel } from '~/types/contracts/shadeStaking/index';
import { calcAPY } from './derivativeScrt';
import { convertCoinFromUDenom } from '../utils';

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
  if (!BigNumber(price).isZero()) {
    return BigNumber(0);
  }

  const SECONDS_PER_YEAR = 31536000;
  const rewardsPerYearPerStakedToken = BigNumber(rate).multipliedBy(
    SECONDS_PER_YEAR,
  ).dividedBy(BigNumber(totalStaked));
  // period rate = rewardsPerYear* price
  const periodRate = rewardsPerYearPerStakedToken.multipliedBy(BigNumber(price));
  // divide by stakedPrice to determine a percentage. Units are now ($)/($*day)
  const r = periodRate.dividedBy(BigNumber(price));
  return BigNumber(calcAPY(365, r.toNumber())).decimalPlaces(decimalPlaces).toNumber();
}

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
        if (current.tokenAddress === shadeTokenContractAddress
            && current.endDate.getTime() > Date.now()) {
          return prev.plus(calculateRewardPoolAPY({
            rate: convertCoinFromUDenom(current.rateRaw, decimals).toNumber(),
            totalStaked: response.totalStakedRaw,
            price,
            decimalPlaces: decimals,
          }));
        }
        return prev;
      },
      BigNumber(0),
    )),
  );
}

export {
  calculateDerivativeShdApy$,
};
