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

// Contract returns price as a rate of dSHD/SHD with 8 decimals
const DERIVATE_PRICE_DECIMALS = 8;

/**
* Parses the staking info query into a cleaner data model
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
*/
const parseDerivativeShdStakingInfo = (
  response: StakingInfoResponse,
): ParsedStakingInfoResponse => ({
  unbondingTime: response.staking_info.unbonding_time,
  bondedShd: response.staking_info.bonded_shd,
  availableShd: response.staking_info.available_shd,
  rewards: response.staking_info.rewards,
  totalDerivativeTokenSupply: response.staking_info.total_derivative_token_supply,
  price: convertCoinFromUDenom(
    response.staking_info.price,
    DERIVATE_PRICE_DECIMALS,
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
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryShdDerivativeStakingInfo(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseDerivativeShdStakingInfo(response as StakingInfoResponse)),
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
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryDerivativeShdStakingInfo$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

export {
  parseDerivativeShdStakingInfo,
  queryDerivativeShdStakingInfo$,
  queryDerivativeShdStakingInfo,
};
