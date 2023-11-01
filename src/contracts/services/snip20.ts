import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  map,
  first,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { snip20 } from '~/contracts/definitions/snip20';
import { TokenInfoResponse } from '~/types/contracts/snip20/response';
import { TokenInfo } from '~/types/contracts/snip20/model';

const parseTokenInfo = (response: TokenInfoResponse): TokenInfo => ({
  name: response.token_info.name,
  symbol: response.token_info.symbol,
  decimals: response.token_info.decimals,
  totalSupply: response.token_info.total_supply,
});

/**
 * query the factory config
 */
const querySnip20TokenInfo$ = ({
  snip20ContractAddress,
  snip20CodeHash,
  lcdEndpoint,
  chainId,
}:{
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: snip20.queries.tokenInfo(),
    client,
    contractAddress: snip20ContractAddress,
    codeHash: snip20CodeHash,
  })),
  map((response) => parseTokenInfo(response as TokenInfoResponse)),
  first(),
);

/**
 * query the factory config
 */
async function querySnip20TokenInfo({
  snip20ContractAddress,
  snip20CodeHash,
  lcdEndpoint,
  chainId,
}:{
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(querySnip20TokenInfo$({
    snip20ContractAddress,
    snip20CodeHash,
    lcdEndpoint,
    chainId,
  }));
}

export {
  querySnip20TokenInfo$,
  parseTokenInfo,
  querySnip20TokenInfo,
};
