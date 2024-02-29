import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import {
  FeeResponse,
  ContractStatusResponse,
  StatusLevel,
  StakingInfoResponse,
} from '~/types/contracts/derivativeShd/response';
import {
  ParsedFeeResponse,
  ParsedStakingInfoResponse,
} from '~/types/contracts/derivativeShd/model';
import { convertCoinFromUDenom } from '~/lib/utils';
import { msgQueryStakingInfo } from '~/contracts/definitions/derivativeShd';

// Contract returns price as a rate of dSHD/SHD with 6 decimals
const DERIVATE_PRICE_DECIMALS = 6;

/**
* Parses the contract fee query into a cleaner data model
*/
const parseDerivativeShdFees = (response: FeeResponse): ParsedFeeResponse => ({
  stakingFee: response.staking.rate / (10 ** response.staking.decimal_places),
  unbondingFee: response.unbonding.rate / (
    10 ** response.unbonding.decimal_places
  ),
  feeCollector: response.collector,
});

/**
* Parses the contract status query into a cleaner data model
*/
const parseDerivativeShdContractStatus = (
  response: ContractStatusResponse,
): StatusLevel => response.contract_status.status;

/**
* Parses the staking info query into a cleaner data model
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
  feeInfo: parseDerivativeShdFees(response.staking_info.fee_info),
  status: response.staking_info.status,
});

/**
 * query the staking info
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
    queryMsg: msgQueryStakingInfo(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseDerivativeShdStakingInfo(response as StakingInfoResponse)),
  first(),
);

/**
 * query the staking info
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
  parseDerivativeShdFees,
  parseDerivativeShdContractStatus,
  parseDerivativeShdStakingInfo,
  queryDerivativeShdStakingInfo$,
  queryDerivativeShdStakingInfo,
};
