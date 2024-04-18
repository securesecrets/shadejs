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
import { TokenInfo, BatchTokensInfo } from '~/types/contracts/snip20/model';
import {
  Contract,
  BatchQueryParams,
  BatchQueryParsedResponse,
  NodeHealthValidationConfig,
} from '~/types';
import { batchQuery$ } from './batchQuery';

const parseTokenInfo = (response: TokenInfoResponse): TokenInfo => ({
  name: response.token_info.name,
  symbol: response.token_info.symbol,
  decimals: response.token_info.decimals,
  totalSupply: response.token_info.total_supply,
});

/**
 * parses the token info reponse from a batch query of
 * multiple token contracts
 */
const parseBatchQueryTokensInfo = (
  response: BatchQueryParsedResponse,
): BatchTokensInfo => response.map((item) => ({
  tokenContractAddress: item.id as string,
  tokenInfo: parseTokenInfo(item.response),
  blockHeight: item.blockHeight,
}));

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
 * query the info for multiple tokens at one time
 */
function batchQuerySnip20TokensInfo$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  tokenContracts,
  nodeHealthValidationConfig,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  tokenContracts: Contract[]
  nodeHealthValidationConfig?: NodeHealthValidationConfig,
}) {
  const queries:BatchQueryParams[] = tokenContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: snip20.queries.tokenInfo(),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    nodeHealthValidationConfig,
  }).pipe(
    map(parseBatchQueryTokensInfo),
    first(),
  );
}

/**
 * query the info for multiple tokens at one time
 */
function batchQuerySnip20TokensInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  tokenContracts,
  nodeHealthValidationConfig,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  tokenContracts: Contract[]
  nodeHealthValidationConfig?: NodeHealthValidationConfig,
}) {
  return lastValueFrom(batchQuerySnip20TokensInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    tokenContracts,
    nodeHealthValidationConfig,
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
  parseBatchQueryTokensInfo,
  batchQuerySnip20TokensInfo$,
  batchQuerySnip20TokensInfo,
};
