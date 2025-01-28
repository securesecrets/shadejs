import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import {
  StakingInfoResponse,
} from '~/types/contracts/derivativeShd/response';
import {
  ParsedStakingInfoResponse,
} from '~/types/contracts/derivativeShd/model';
import { convertCoinFromUDenom } from '~/lib/utils';
import { msgQueryShdDerivativeStakingInfo } from '~/contracts/definitions/derivativeShd';

/**
* Parses the staking info query into a cleaner data model
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
*/
const parseDerivativeShdStakingInfo = (
  response: StakingInfoResponse,
  decimals: number,
): ParsedStakingInfoResponse => ({
  unbondingTime: response.staking_info.unbonding_time,
  bondedShd: response.staking_info.bonded_shd,
  rewards: response.staking_info.rewards,
  totalDerivativeTokenSupply: response.staking_info.total_derivative_token_supply,
  price: convertCoinFromUDenom(
    response.staking_info.price,
    decimals,
  ).toNumber(),
  feeInfo: {
    stakingFee: response.staking_info.fee_info.staking.rate / (
      10 ** response.staking_info.fee_info.staking.decimal_places
    ),
    unbondingFee: response.staking_info.fee_info.unbonding.rate / (
      10 ** response.staking_info.fee_info.unbonding.decimal_places
    ),
    feeCollector: response.staking_info.fee_info.collector,
  },
  status: response.staking_info.status,
});

/**
 * query the staking info
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const queryDerivativeShdStakingInfo$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  decimals,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  decimals: number,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryShdDerivativeStakingInfo(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseDerivativeShdStakingInfo(response as StakingInfoResponse, decimals)),
  first(),
);

/**
 * query the staking info
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function queryDerivativeShdStakingInfo({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  decimals,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  decimals: number,
}) {
  return lastValueFrom(queryDerivativeShdStakingInfo$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    decimals,
  }));
}

export {
  parseDerivativeShdStakingInfo,
  queryDerivativeShdStakingInfo$,
  queryDerivativeShdStakingInfo,
};
