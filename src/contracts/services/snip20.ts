import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  map,
  first,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { snip20 } from '~/contracts/definitions/snip20';
import {
  TokenInfoResponse,
  BalanceResponse,
} from '~/types/contracts/snip20/response';
import { TokenInfo } from '~/types/contracts/snip20/model';

const parseTokenInfo = (response: TokenInfoResponse): TokenInfo => ({
  name: response.token_info.name,
  symbol: response.token_info.symbol,
  decimals: response.token_info.decimals,
  totalSupply: response.token_info.total_supply,
});

const parseBalance = (response: BalanceResponse): string => response.balance.amount;

/**
 * query the snip20 token info
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
 * query the snip20 token info
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

/**
 * query a user's private snip20 balance using a viewing key
 */
const querySnip20Balance$ = ({
  snip20ContractAddress,
  snip20CodeHash,
  userAddress,
  viewingKey,
  lcdEndpoint,
  chainId,
}:{
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  userAddress: string,
  viewingKey: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: snip20.queries.getBalance(userAddress, viewingKey),
    client,
    contractAddress: snip20ContractAddress,
    codeHash: snip20CodeHash,
  })),
  map((response) => parseBalance(response as BalanceResponse)),
  first(),
);

/**
 * query a user's private snip20 balance using a viewing key
 */
async function querySnip20Balance({
  snip20ContractAddress,
  snip20CodeHash,
  userAddress,
  viewingKey,
  lcdEndpoint,
  chainId,
}:{
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  userAddress: string,
  viewingKey: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(querySnip20Balance$({
    snip20ContractAddress,
    snip20CodeHash,
    userAddress,
    viewingKey,
    lcdEndpoint,
    chainId,
  }));
}

export {
  querySnip20TokenInfo$,
  parseTokenInfo,
  parseBalance,
  querySnip20TokenInfo,
  querySnip20Balance$,
  querySnip20Balance,
};
