import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { ConfigResponse, GetCollateralResponse, GetMarketsResponse } from '~/types/contracts/moneyMarket/response';
import {
  BatchMoneyMarketConfigs,
  BatchMoneyMarketGetCollaterals,
  BatchMoneyMarketGetMarkets,
  ContractAndPagination,
  Pagination, ParsedConfigResponse, ParsedGetCollateralResponse, ParsedGetMarketsResponse,
} from '~/types/contracts/moneyMarket/model';
import { Contract } from '~/types/contracts/shared/index';
import {
  BatchQueryParams, BatchQueryParsedResponse,
} from '~/types/contracts/batchQuery/model';
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
  page: response.paginated_response.page,
  pageSize: response.paginated_response.page_size,
  totalPages: response.paginated_response.total_pages,
  totalItems: response.paginated_response.total_items,
  data: response.paginated_response.data.reduce((prev, cur) => ({
    ...prev,
    [cur.market.market_token.address]: {
      marketToken: {
        contractAddress: cur.market.market_token.address,
        codeHash: cur.market.market_token.code_hash,
      },
      lToken: {
        contractAddress: cur.market.l_token.address,
        codeHash: cur.market.l_token.address,
      },
      decimals: cur.market.decimals,
      oracleKey: cur.market.oracle_key,
      interest: {
        base: cur.market.interest.inner.interest.linear?.base
          ?? cur.market.interest.inner.interest.piecewise_linear!.base,
        slope1: cur.market.interest.inner.interest.linear?.slope
          ?? cur.market.interest.inner.interest.piecewise_linear!.slope1,
        slope2: cur.market.interest.inner.interest.piecewise_linear?.slope2,
        optimalUtilisation:
          cur.market.interest.inner.interest.piecewise_linear?.optimal_utilisation,
      },
      loanableAmount: cur.market.loanable,
      lentAmount: cur.market.lent_amount,
      lifetimeInterestPaid: cur.market.lifetime_interest_paid,
      lifetimeInterestOwed: cur.market.lifetime_interest_owed,
      interestPerUtoken: cur.market.interest_per_utoken,
      lastInterestAccrued: new Date(cur.market.last_interest_accrued),
      maxSupplyAmount: cur.market.max_supply,
      flashLoanInterest: cur.market.flash_loan_interest,
      supplyEnabled: cur.market.status.market_status.supply_enabled,
      borrowEnabled: cur.market.status.market_status.borrow_enabled,
      repayEnabled: cur.market.status.market_status.repay_enabled,
      liquidationEnabled: cur.market.status.market_status.liquidation_enabled,
      interestAccrualEnabled: cur.market.status.market_status.interest_accrual_enabled,
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
    contractAddress: response.config.admin_auth.address,
    codeHash: response.config.admin_auth.code_hash,
  },
  queryAuth: {
    contractAddress: response.config.query_auth.address,
    codeHash: response.config.query_auth.code_hash,
  },
  oracle: {
    contractAddress: response.config.oracle.address,
    codeHash: response.config.query_auth.code_hash,
  },
  feeCollector: response.config.fee_collector,
  lTokenId: response.config.l_token_id,
  lTokenCodeHash: response.config.l_token_code_hash,
  lTokenBlockchainAdmin: response.config.l_token_blockchain_admin,
  supplyEnabled: response.config.status.global_status.supply_enabled,
  borrowEnabled: response.config.status.global_status.borrow_enabled,
  repayEnabled: response.config.status.global_status.repay_enabled,
  liquidationEnabled: response.config.status.global_status.liquidation_enabled,
  interestAccrualEnabled: response.config.status.global_status.interest_accrual_enabled,
  collateralDepositEnabled: response.config.status.global_status.collateral_deposit_enabled,
});

/**
* Parses the get collateral query into a cleaner data model
 * NOT FOR PRODUCTION USE, CONTRACT IS IN DEVELOPMENT ON TESTNET ONLY
*/
const parseMoneyMarketGetCollateral = (
  response: GetCollateralResponse,
): ParsedGetCollateralResponse => ({
  page: response.paginated_response.page,
  pageSize: response.paginated_response.page_size,
  totalPages: response.paginated_response.total_pages,
  totalItems: response.paginated_response.total_items,
  data: response.paginated_response.data.reduce((prev, cur) => ({
    ...prev,
    [cur.collateral_state.token.address]: {
      token: {
        contractAddress: cur.collateral_state.token.address,
        codeHash: cur.collateral_state.token.code_hash,
      },
      collateralAmount: cur.collateral_state.amount,
      decimals: cur.collateral_state.decimals,
      maxInitialLtv: cur.collateral_state.max_initial_ltv,
      liquidationThreshold: cur.collateral_state.liquidation_threshold,
      liquidationDiscount: cur.collateral_state.liquidation_discount,
      oracleKey: cur.collateral_state.oracle_key,
      depositEnabled: cur.collateral_state.status.collateral_status.deposit_enabled,
      liquidationEnabled: cur.collateral_state.status.collateral_status.liquidation_enabled,
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

export {
  queryMoneyMarketConfig,
  queryMoneyMarketGetMarkets,
  queryMoneyMarketGetCollateral,
  batchQueryMoneyMarketConfig,
  batchQueryMoneyMarketGetMarkets,
  batchQueryMoneyMarketGetCollateral,
};
