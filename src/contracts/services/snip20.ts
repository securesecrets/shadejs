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
import {
  TokenInfo,
  BatchTokensInfo,
} from '~/types/contracts/snip20/model';
import {
  Contract,
  BatchQueryParams,
  BatchQueryParsedResponse,
  MinBlockHeightValidationOptions,
  TransactionHistory,
  Snip20TransactionHistoryResponse,
  Snip20Tx,
  Snip20TransferHistoryResponse,
} from '~/types';
import { batchQuery$ } from './batchQuery';

/**
 * parses the token info response
 */
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

/**
 * parses the balance response
 */
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
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  tokenContracts: Contract[]
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
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
    minBlockHeightValidationOptions,
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
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  tokenContracts: Contract[]
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQuerySnip20TokensInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    tokenContracts,
    minBlockHeightValidationOptions,
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

/**
 * parses the snip20 transaction history response
 */
const parseSnip20TransactionHistoryResponse = (
  response: BatchQueryParsedResponse,
): TransactionHistory => {
  // validate that a single response is available, should only be true if parser is used incorrectly
  if (response.length !== 1) {
    throw new Error('Only one response is expected for the snip20 transaction history query');
  }
  const transactionHistoryResponse = response[0].response as Snip20TransactionHistoryResponse;

  if ('viewing_key_error' in transactionHistoryResponse) {
    throw new Error(transactionHistoryResponse.viewing_key_error.msg);
  }

  const parsedTxs: Snip20Tx[] = transactionHistoryResponse.transaction_history.txs.map((tx) => ({
    id: tx.id,
    action: tx.action,
    denom: tx.coins.denom,
    amount: tx.coins.amount,
    memo: tx.memo,
    blockTime: tx.block_time,
    blockHeight: tx.block_height,
  }));

  return {
    txs: parsedTxs,
    totalTransactions: transactionHistoryResponse.transaction_history.total,
    blockHeight: response[0].blockHeight,
  };
};

/**
 * query the snip20 transaction history
 */
function querySnip20TransactionHistory$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  snip20ContractAddress,
  snip20CodeHash,
  ownerAddress,
  viewingKey,
  page,
  pageSize,
  shouldFilterDecoys = true,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  snip20ContractAddress: string,
  snip20CodeHash: string,
  ownerAddress: string,
  viewingKey: string,
  page: number,
  pageSize: number,
  shouldFilterDecoys?: boolean,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const query:BatchQueryParams = {
    id: snip20ContractAddress,
    contract: {
      address: snip20ContractAddress,
      codeHash: snip20CodeHash,
    },
    queryMsg: snip20.queries.getTransactionHistory({
      ownerAddress,
      viewingKey,
      page,
      pageSize,
      shouldFilterDecoys,
    }),
  };

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries: [query],
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseSnip20TransactionHistoryResponse),
    first(),
  );
}

/**
 * query the snip20 transaction history
 */
async function querySnip20TransactionHistory({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  snip20ContractAddress,
  snip20CodeHash,
  ownerAddress,
  viewingKey,
  page,
  pageSize,
  shouldFilterDecoys,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  snip20ContractAddress: string,
  snip20CodeHash: string,
  ownerAddress: string,
  viewingKey: string,
  page: number,
  pageSize: number,
  shouldFilterDecoys?: boolean,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(querySnip20TransactionHistory$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    snip20ContractAddress,
    snip20CodeHash,
    ownerAddress,
    viewingKey,
    page,
    pageSize,
    shouldFilterDecoys,
    minBlockHeightValidationOptions,
  }));
}

/**
 * parses the snip20 transfer history response
 */
const parseSnip20TransferHistoryResponse = (
  response: BatchQueryParsedResponse,
): TransactionHistory => {
  // validate that a single response is available, should only be true if parser is used incorrectly
  if (response.length !== 1) {
    throw new Error('Only one response is expected for the snip20 transaction history query');
  }
  const transactionHistoryResponse = response[0].response as Snip20TransferHistoryResponse;

  if ('viewing_key_error' in transactionHistoryResponse) {
    throw new Error(transactionHistoryResponse.viewing_key_error.msg);
  }

  const parsedTxs: Snip20Tx[] = transactionHistoryResponse.transfer_history.txs.map((tx) => ({
    id: tx.id,
    action: {
      transfer: {
        from: tx.from,
        sender: tx.sender,
        recipient: tx.receiver,
      },
    },
    denom: tx.coins.denom,
    amount: tx.coins.amount,
    memo: tx.memo,
    blockTime: tx.block_time,
    blockHeight: tx.block_height,
  }));

  return {
    txs: parsedTxs,
    totalTransactions: undefined,
    blockHeight: response[0].blockHeight,
  };
};

/**
 * query the snip20 transfer history.
 * This function should be used for legacy snip20s that
 * do not support the newer transaction history query.
 */
function querySnip20TransferHistory$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  snip20ContractAddress,
  snip20CodeHash,
  ownerAddress,
  viewingKey,
  page,
  pageSize,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  snip20ContractAddress: string,
  snip20CodeHash: string,
  ownerAddress: string,
  viewingKey: string,
  page: number,
  pageSize: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const query:BatchQueryParams = {
    id: snip20ContractAddress,
    contract: {
      address: snip20ContractAddress,
      codeHash: snip20CodeHash,
    },
    queryMsg: snip20.queries.getTransferHistory({
      ownerAddress,
      viewingKey,
      page,
      pageSize,
    }),
  };

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries: [query],
    minBlockHeightValidationOptions,
  }).pipe(
    map(parseSnip20TransferHistoryResponse),
    first(),
  );
}

/**
 * query the snip20 transfer history.
 * This function should be used for legacy snip20s that
 * do not support the newer transaction history query.
 */
async function querySnip20TransferHistory({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  snip20ContractAddress,
  snip20CodeHash,
  ownerAddress,
  viewingKey,
  page,
  pageSize,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  snip20ContractAddress: string,
  snip20CodeHash: string,
  ownerAddress: string,
  viewingKey: string,
  page: number,
  pageSize: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(querySnip20TransferHistory$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    snip20ContractAddress,
    snip20CodeHash,
    ownerAddress,
    viewingKey,
    page,
    pageSize,
    minBlockHeightValidationOptions,
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
  querySnip20TransactionHistory$,
  querySnip20TransactionHistory,
  parseSnip20TransactionHistoryResponse,
  querySnip20TransferHistory$,
  querySnip20TransferHistory,
  parseSnip20TransferHistoryResponse,
};
