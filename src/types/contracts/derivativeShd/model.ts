import { StatusLevel } from './response';

type ParsedFeeResponse = {
  stakingFee: number,
  unbondingFee: number,
  feeCollector: string,
}

type ParsedStakingInfoResponse = {
  unbondingTime: string,
  bondedShd: string,
  availableShd: string,
  rewards: string,
  totalDerivativeTokenSupply: string,
  price: number,
  feeInfo: ParsedFeeResponse,
  status: StatusLevel,
}

export type {
  ParsedFeeResponse,
  ParsedStakingInfoResponse,
};
