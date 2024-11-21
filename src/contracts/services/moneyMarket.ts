import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';

import {
  BatchQueryParsedResponse,
  BatchQueryParams,
} from '~/types/contracts/batchQuery/model';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { ConfigResponse, GetCollateralResponse, GetMarketsResponse } from '~/types/contracts/moneyMarket/response';
import {
  BatchMoneyMarketConfigs,
  BatchMoneyMarketGetCollaterals,
  BatchMoneyMarketGetMarkets,
  ContractAndPagination,
  Pagination, ParsedConfigResponse, ParsedGetCollateralResponse, ParsedGetMarketsResponse,
  ParsedRewardPoolsResponse,
} from '~/types/contracts/moneyMarket/model';
import { Contract } from '~/types/contracts/shared/index';
import { MinBlockHeightValidationOptions } from '~/types';
import { batchQuery$ } from './batchQuery';
import { msgQueryMoneyMarketCollaterals, msgQueryMoneyMarketConfig, msgQueryMoneyMarketMarkets } from '../definitions/moneyMarket';

/**
* Parses the get markets query into a cleaner data model
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
*/
const parseMoneyMarketGetMarkets = (
  response: GetMarketsResponse,
): ParsedGetMarketsResponse => ({
  page: response.page,
  pageSize: response.page_size,
  totalPages: response.total_pages,
  totalItems: response.total_items,
  data: response.data.reduce((prev, cur) => ({
    ...prev,
    [cur.market_token.address]: {
      marketToken: {
        contractAddress: cur.market_token.address,
        codeHash: cur.market_token.code_hash,
      },
      lToken: {
        contractAddress: cur.l_token.address,
        codeHash: cur.l_token.code_hash,
      },
      decimals: cur.decimals,
      oracleKey: cur.oracle_key,
      interest: {
        base: cur.interest.base,
        slope1: cur.interest.slope1,
        slope2: cur.interest.slope2,
        optimalUtilisation:
          cur.interest.optimal_utilisation,
      },
      loanableAmount: cur.loanable,
      lentAmount: cur.lent_amount,
      lifetimeInterestPaid: cur.lifetime_interest_paid,
      lifetimeInterestOwed: cur.lifetime_interest_owed,
      interestPerUtoken: cur.interest_per_utoken,
      lastInterestAccrued: new Date(cur.last_interest_accrued),
      maxSupplyAmount: cur.max_supply,
      daoInterestFee: cur.dao_interest_fee,
      flashLoanInterest: cur.flash_loan_interest,
      supplyEnabled: cur.status.supply_enabled,
      borrowEnabled: cur.status.borrow_enabled,
      repayEnabled: cur.status.repay_enabled,
      liquidationEnabled: cur.status.liquidation_enabled,
      interestAccrualEnabled: cur.status.interest_accrual_enabled,
    },
  }), {}),
});

/**
* Parses the config query into a cleaner data model
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
*/
const parseMoneyMarketConfig = (
  response: ConfigResponse,
):ParsedConfigResponse => ({
  adminAuth: {
    contractAddress: response.admin_auth.address,
    codeHash: response.admin_auth.code_hash,
  },
  queryAuth: {
    contractAddress: response.query_auth.address,
    codeHash: response.query_auth.code_hash,
  },
  oracle: {
    contractAddress: response.oracle.address,
    codeHash: response.query_auth.code_hash,
  },
  feeCollector: response.fee_collector,
  lTokenId: response.l_token_id,
  lTokenCodeHash: response.l_token_code_hash,
  lTokenBlockchainAdmin: response.l_token_blockchain_admin,
  supplyEnabled: response.status.supply_enabled,
  borrowEnabled: response.status.borrow_enabled,
  repayEnabled: response.status.repay_enabled,
  liquidationEnabled: response.status.liquidation_enabled,
  interestAccrualEnabled: response.status.interest_accrual_enabled,
  collateralDepositEnabled: response.status.collateral_deposit_enabled,
});

/**
* Parses the get collateral query into a cleaner data model
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
*/
const parseMoneyMarketGetCollateral = (
  response: GetCollateralResponse,
): ParsedGetCollateralResponse => ({
  page: response.page,
  pageSize: response.page_size,
  totalPages: response.total_pages,
  totalItems: response.total_items,
  data: response.data.reduce((prev, cur) => ({
    ...prev,
    [cur.token.address]: {
      token: {
        contractAddress: cur.token.address,
        codeHash: cur.token.code_hash,
      },
      collateralAmount: cur.amount,
      decimals: cur.decimals,
      maxInitialLtv: cur.max_initial_ltv,
      publicLiquidationThreshold: cur.public_liquidation_threshold,
      privateLiquidationThreshold: cur.private_liquidation_threshold,
      liquidationDiscount: cur.liquidation_discount,
      oracleKey: cur.oracle_key,
      depositEnabled: cur.status.deposit_enabled,
      liquidationEnabled: cur.status.liquidations_enabled,
    },
  }), {}),
});

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
  map((response) => parseMoneyMarketConfig(response as ConfigResponse)),
  first(),
);

/**
 * query the money market collateral
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const queryMoneyMarketGetCollateral$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  pagination,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pagination?: Pagination,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryMoneyMarketCollaterals(pagination),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseMoneyMarketGetCollateral(response as GetCollateralResponse)),
  first(),
);

/**
 * query the money market markets
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const queryMoneyMarketGetMarkets$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  pagination,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pagination?: Pagination,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryMoneyMarketMarkets(pagination),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseMoneyMarketGetMarkets(response as GetMarketsResponse)),
  first(),
);

/**
 * query the money market config
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function queryMoneyMarketConfig({
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
  return lastValueFrom(queryMoneyMarketConfig$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * query the money market get markets query
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function queryMoneyMarketGetMarkets({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  pageSize,
  page,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pageSize?: number,
  page?: number,
}) {
  return lastValueFrom(queryMoneyMarketGetMarkets$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    pagination: pageSize !== undefined && page !== undefined ? {
      page_size: pageSize,
      page,
    } : undefined,
  }));
}

/**
 * query the money market get collateral query
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function queryMoneyMarketGetCollateral({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  pageSize,
  page,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pageSize?: number,
  page?: number,
}) {
  return lastValueFrom(queryMoneyMarketGetCollateral$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    pagination: pageSize !== undefined && page !== undefined ? {
      page_size: pageSize,
      page,
    } : undefined,
  }));
}

/**
 * parses the config reponse from a batch query of
 * multiple money market contracts
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const parseBatchQueryMoneyMarketConfig = (
  response: BatchQueryParsedResponse,
): BatchMoneyMarketConfigs => response.map((item) => ({
  moneyMarketContractAddress: item.id as string,
  config: parseMoneyMarketConfig(item.response),
  blockHeight: item.blockHeight,
}));

/**
 * query the config for money market contracts at one time
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function batchQueryMoneyMarketConfig$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  batchSize,
  minBlockHeightValidationOptions,
  blockHeight,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: Contract[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
  blockHeight?: number,
}) {
  const queries:BatchQueryParams[] = moneyMarketContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryMoneyMarketConfig(),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
    minBlockHeightValidationOptions,
    blockHeight,
  }).pipe(
    map(parseBatchQueryMoneyMarketConfig),
    first(),
  );
}

/**
 * query the config for money market contracts at one time
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function batchQueryMoneyMarketConfig({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: Contract[]
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQueryMoneyMarketConfig$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    moneyMarketContracts,
    minBlockHeightValidationOptions,
  }));
}

/**
 * parses the markets response from a batch query of
 * multiple money market contracts
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const parseBatchQueryMoneyMarketGetMarkets = (
  response: BatchQueryParsedResponse,
): BatchMoneyMarketGetMarkets => response.map((item) => ({
  moneyMarketContractAddress: item.id as string,
  config: parseMoneyMarketGetMarkets(item.response),
  blockHeight: item.blockHeight,
}));

/**
 * query the markets for money market contracts at one time
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function batchQueryMoneyMarketGetMarkets$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  batchSize,
  minBlockHeightValidationOptions,
  blockHeight,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: ContractAndPagination[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
  blockHeight?: number,
}) {
  const queries:BatchQueryParams[] = moneyMarketContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryMoneyMarketMarkets(
      contract.pageSize !== undefined && contract.page !== undefined
        ? {
          page_size: contract.pageSize,
          page: contract.page,
        } : undefined,
    ),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
    minBlockHeightValidationOptions,
    blockHeight,
  }).pipe(
    map(parseBatchQueryMoneyMarketGetMarkets),
    first(),
  );
}

/**
 * query the markets for money market contracts at one time
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function batchQueryMoneyMarketGetMarkets({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: ContractAndPagination[],
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQueryMoneyMarketGetMarkets$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    moneyMarketContracts,
    minBlockHeightValidationOptions,
  }));
}

/**
 * parses the collateral response from a batch query of
 * multiple money market contracts
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
const parseBatchQueryMoneyMarketGetCollateral = (
  response: BatchQueryParsedResponse,
): BatchMoneyMarketGetCollaterals => response.map((item) => ({
  moneyMarketContractAddress: item.id as string,
  config: parseMoneyMarketGetCollateral(item.response),
  blockHeight: item.blockHeight,
}));

/**
 * query the collaterals for money market contracts at one time
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function batchQueryMoneyMarketGetCollateral$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  batchSize,
  minBlockHeightValidationOptions,
  blockHeight,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: ContractAndPagination[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
  blockHeight?: number,
}) {
  const queries:BatchQueryParams[] = moneyMarketContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryMoneyMarketCollaterals(
      contract.pageSize !== undefined && contract.page !== undefined
        ? {
          page_size: contract.pageSize,
          page: contract.page,
        } : undefined,
    ),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
    minBlockHeightValidationOptions,
    blockHeight,
  }).pipe(
    map(parseBatchQueryMoneyMarketGetCollateral),
    first(),
  );
}

/**
 * query the collaterals for money market contracts at one time
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function batchQueryMoneyMarketGetCollateral({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: ContractAndPagination[],
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQueryMoneyMarketGetCollateral$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    moneyMarketContracts,
    minBlockHeightValidationOptions,
  }));
}

// Parsing function for MoneyMarket Public Logs response
const parseMoneyMarketPublicLogs = (response: any) => ({
  page: response.page,
  pageSize: response.page_size,
  totalPages: response.total_pages,
  totalItems: response.total_items,
  data: response.data
    ? response.data.map((event: any) => ({
      timestamp: new Date(event.timestamp * 1000), // Convert UNIX timestamp to JS Date
      action: event.action, // Pass the full action JSON object without further parsing
    }))
    : [],
});

/**
 * Query the Public Logs for a single money market contract using RxJS
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function queryMoneyMarketPublicLogs$({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  pagination,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pagination?: Pagination,
}) {
  return getActiveQueryClient$(lcdEndpoint, chainId).pipe(
    switchMap(({ client }) => sendSecretClientContractQuery$({
      queryMsg: {
        public_logs: { pagination },
      },
      client,
      contractAddress,
      codeHash,
    })),
    map((response) => parseMoneyMarketPublicLogs(response)),
    first(),
  );
}

/**
 * Query the Public Logs for a single money market contract
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
async function queryMoneyMarketPublicLogs({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  pageSize,
  page,
}: {
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pageSize?: number,
  page?: number,
}) {
  return lastValueFrom(queryMoneyMarketPublicLogs$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    pagination: pageSize !== undefined && page !== undefined
      ? { page_size: pageSize, page }
      : undefined,
  }));
}

/**
 * Batch query the Public Logs for multiple money market contracts
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
 */
function batchQueryMoneyMarketPublicLogs$({
  queryPublicLogsContractAddress,
  queryPublicLogsCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  batchSize,
  minBlockHeightValidationOptions,
  blockHeight,
}: {
  queryPublicLogsContractAddress: string,
  queryPublicLogsCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: ContractAndPagination[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
  blockHeight?: number,
}) {
  const queries: BatchQueryParams[] = moneyMarketContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: {
      get_public_logs: {
        pagination: contract.pageSize && contract.page
          ? { page_size: contract.pageSize, page: contract.page } : undefined,
      },
    },
  }));

  return batchQuery$({
    contractAddress: queryPublicLogsContractAddress,
    codeHash: queryPublicLogsCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
    minBlockHeightValidationOptions,
    blockHeight,
  }).pipe(
    map((response) => response.map((item) => ({
      moneyMarketContractAddress: item.id as string,
      publicLogs: parseMoneyMarketPublicLogs(item.response),
      blockHeight: item.blockHeight,
    }))),
    first(),
  );
}

async function batchQueryMoneyMarketPublicLogs({
  queryPublicLogsContractAddress,
  queryPublicLogsCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarketContracts,
  minBlockHeightValidationOptions,
}: {
  queryPublicLogsContractAddress: string,
  queryPublicLogsCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarketContracts: ContractAndPagination[],
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQueryMoneyMarketPublicLogs$({
    queryPublicLogsContractAddress,
    queryPublicLogsCodeHash,
    lcdEndpoint,
    chainId,
    moneyMarketContracts,
    minBlockHeightValidationOptions,
  }));
}

const parseBatchQueryMoneyMarketRewardPools = (
  responses: BatchQueryParsedResponse,
): ParsedRewardPoolsResponse[] => (
  responses.map((response: any) => ({
    debtMarket: response.id,
    blockHeight: response.blockHeight,
    rewardPools: response.response.map((pool: any) => ({
      rewardPoolId: pool.id,
      amount: pool.amount,
      token: pool.token,
      start: pool.start,
      end: pool.end,
      rate: pool.rate,
    })),
  }))
);

function batchQueryMoneyMarketRewardPools$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarket,
  debtMarkets,
  batchSize,
  minBlockHeightValidationOptions,
  blockHeight,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarket: Contract,
  debtMarkets: string[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
  blockHeight?: number,
}) {
  const queries = debtMarkets.map((debtMarket) => ({
    id: debtMarket,
    contract: {
      address: moneyMarket.address,
      codeHash: moneyMarket.codeHash,
    },
    queryMsg: {
      reward_pools: {
        market: debtMarket,
      },
    },
  }));

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
    minBlockHeightValidationOptions,
    blockHeight,
  }).pipe(
    map((response) => parseBatchQueryMoneyMarketRewardPools(response)),
    first(),
  );
}

async function batchQueryMoneyMarketRewardPools({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  moneyMarket,
  debtMarkets,
  minBlockHeightValidationOptions,
}: {
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  moneyMarket: Contract,
  debtMarkets: string[],
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQueryMoneyMarketRewardPools$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    moneyMarket,
    debtMarkets,
    minBlockHeightValidationOptions,
  }));
}

export {
  queryMoneyMarketConfig,
  queryMoneyMarketGetMarkets,
  queryMoneyMarketGetCollateral,
  batchQueryMoneyMarketConfig$,
  batchQueryMoneyMarketGetMarkets$,
  batchQueryMoneyMarketGetCollateral$,
  batchQueryMoneyMarketConfig,
  batchQueryMoneyMarketGetMarkets,
  batchQueryMoneyMarketGetCollateral,
  queryMoneyMarketPublicLogs$,
  queryMoneyMarketPublicLogs,
  batchQueryMoneyMarketPublicLogs$,
  batchQueryMoneyMarketPublicLogs,
  batchQueryMoneyMarketRewardPools$,
  batchQueryMoneyMarketRewardPools,
};
