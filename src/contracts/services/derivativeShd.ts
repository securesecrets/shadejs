import {
  FeeResponse,
  ContractStatusResponse,
  StatusLevel,
} from '~/types/contracts/derivativeShd/response';
import {
  ParsedFeeResponse,
} from '~/types/contracts/derivativeShd/model';

/**
* Parses the contract fee query into a cleaner data model
*/
const parseDerivativeShdFees = (response: FeeResponse): ParsedFeeResponse => ({
  stakingFee: response.fee_info.staking.rate / (10 ** response.fee_info.staking.decimal_places),
  unbondingFee: response.fee_info.unbonding.rate / (
    10 ** response.fee_info.unbonding.decimal_places
  ),
  feeCollector: response.fee_info.collector,
});

/**
* Parses the contract status query into a cleaner data model
*/
const parseDerivativeShdContractStatus = (
  response: ContractStatusResponse,
): StatusLevel => response.contract_status.status;

export {
  parseDerivativeShdFees,
  parseDerivativeShdContractStatus,
};
