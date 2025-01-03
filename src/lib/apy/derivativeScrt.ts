import {
  SecretChainDataQueryModel,
} from '~/types/apy';
import {
  forkJoin,
  lastValueFrom,
  map,
  switchMap,
} from 'rxjs';
import {
  DerivativeScrtInfo,
} from '~/types/contracts/derivativeScrt/model';
import { convertCoinFromUDenom } from '~/lib/utils';
import { queryDerivativeScrtInfo$ } from '~/contracts/services/derivativeScrt';
import {
  queryScrtTotalSupply$,
  queryValidatorsCommission$,
  secretChainQueries$,
  SecretQueryOptions,
} from '~/lib/apy/secretQueries';
import { calcAggregateAPR, calcAPY } from './utils';

const SECRET_DECIMALS = 6;

/**
 * Will calculate APY for the stkd secret derivative contract
 *
 * returns a number that is the decimal form of the percent APY
 * @param lcdEndpoint is not optional due to the requirement of the secretChainQueries() function
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
    scrtTotalSupplyRaw: queryScrtTotalSupply$(lcdEndpoint, chainId),
    derivativeInfo: queryDerivativeScrtInfo$({
      queryRouterContractAddress,
      queryRouterCodeHash,
      contractAddress,
      codeHash,
      lcdEndpoint,
      chainId,
    }),
  }).pipe(
    switchMap((response: {
      chainParameters: SecretChainDataQueryModel,
      scrtTotalSupplyRaw: number,
      derivativeInfo: DerivativeScrtInfo,
    }) => queryValidatorsCommission$({
      lcdEndpoint,
      chainId,
      validatorAddresses: response.derivativeInfo.validators.map((
        validator,
      ) => validator.validatorAddress),
    }).pipe(
      map((validatorCommissions) => {
        const apr = calcAggregateAPR({
          networkValidatorList: validatorCommissions,
          validatorSet: response.derivativeInfo.validators,
          inflationRate: response.chainParameters.secretInflationPercent,
          totalScrtStaked: convertCoinFromUDenom(
            response.chainParameters.secretTotalStakedRaw,
            SECRET_DECIMALS,
          ).toNumber(),
          totalScrtSupply: convertCoinFromUDenom(
            response.scrtTotalSupplyRaw,
            SECRET_DECIMALS,
          ).toNumber(),
          foundationTax: response.chainParameters.secretTaxes!.foundationTaxPercent,
          communityTax: response.chainParameters.secretTaxes!.communityTaxPercent,
        });
        return calcAPY(365, apr);
      }),
    )),
  );
}

/**
 * Will calculate APY for the stkd secret derivative contract
 *
 * returns a number that is the decimal form of the percent APY
 * @param lcdEndpoint is not optional due to the requirement of the secretChainQueries() function
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
  calculateDerivativeScrtApy$,
  calculateDerivativeScrtApy,
};
