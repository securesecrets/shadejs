import { queryShadeStakingOpportunity$ } from '~/contracts/services/shadeStaking';
import { lastValueFrom, map } from 'rxjs';
import { StakingInfoServiceModel } from '~/types/contracts/shadeStaking/index';
import { convertCoinFromUDenom } from '~/lib/utils';
import { calculateRewardPoolAPY } from './utils';

const SHADE_DECIMALS = 8;

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
            stakedPrice: price,
            decimals: SHADE_DECIMALS,
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
