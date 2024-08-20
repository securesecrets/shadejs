import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { msgQueryMoneyMarketConfig } from '../definitions/moneyMarket';

const parseMoneyMarketConfig = (
  response: ConfigResponse
):ParsedConfigResponse

/**
 * query the money market config
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const queryMoneyMarketConfig$ = ({
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
    queryMsg: msgQueryMoneyMarketConfig(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseDerivativeShdStakingInfo(response as StakingInfoResponse)),
  first(),
);

export {
};
