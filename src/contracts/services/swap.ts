import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import {
  FactoryConfigResponse, FactoryPairsResponse, PairConfigResponse, PairInfoResponse,
} from '~/types/contracts/swap/response';
import {
  BatchPairsInfo,
  FactoryConfig,
  FactoryPairs,
  PairConfig,
  PairInfo,
} from '~/types/contracts/swap/model';
import {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
} from '~/contracts/definitions/swap';
import { Contract } from '~/types/contracts/shared';
import { BatchQuery, BatchQueryParsedResponse } from '~/types/contracts/batchQuery/model';
import { batchQuery$ } from './batchQuery';

/**
 * parses the factory config to a usable data model
 */
function parseFactoryConfig(response: FactoryConfigResponse): FactoryConfig {
  const { get_config: config } = response;
  const { amm_settings: ammSettings } = config;
  return {
    pairContractInstatiationInfo: {
      codeHash: config.pair_contract.code_hash,
      id: config.pair_contract.id,
    },
    lpTokenContractInstatiationInfo: {
      codeHash: config.lp_token_contract.code_hash,
      id: config.lp_token_contract.id,
    },
    adminAuthContract: {
      address: config.admin_auth.address,
      codeHash: config.admin_auth.code_hash,
    },
    authenticatorContract: config.authenticator ? {
      address: config.authenticator.address,
      codeHash: config.authenticator.code_hash,
    } : null,
    defaultPairSettings: {
      lpFee: ammSettings.lp_fee.nom / ammSettings.lp_fee.denom,
      daoFee: ammSettings.shade_dao_fee.nom / ammSettings.shade_dao_fee.denom,
      stableLpFee: ammSettings.stable_lp_fee.nom / ammSettings.stable_lp_fee.denom,
      stableDaoFee: ammSettings.stable_shade_dao_fee.nom / ammSettings.stable_shade_dao_fee.denom,
      daoContract: {
        address: ammSettings.shade_dao_address.address,
        codeHash: ammSettings.shade_dao_address.code_hash,
      },
    },
  };
}

/**
 * parses the list of factory pairs to a usable data model
 */
function parseFactoryPairs({
  response,
  startingIndex,
  limit,
}:{
  response: FactoryPairsResponse,
  startingIndex: number,
  limit: number,
}): FactoryPairs {
  const { amm_pairs: pairs } = response.list_a_m_m_pairs;

  const pairsFormatted = pairs.map((pair) => ({
    address: pair.address,
    codeHash: pair.code_hash,
    isEnabled: pair.enabled,
  }));

  return {
    pairs: pairsFormatted,
    startIndex: startingIndex,
    endIndex: startingIndex + limit - 1,
  };
}

/**
 * parses the pair config data into a usable data model
 */
function parsePairConfig(response: PairConfigResponse): PairConfig {
  const {
    get_config: {
      factory_contract: factoryContract,
      lp_token: lpTokenContract,
      staking_contract: stakingContract,
      pair,
      custom_fee: customFee,
    },
  } = response;

  return {
    factoryContract: factoryContract ? {
      address: factoryContract.address,
      codeHash: factoryContract.code_hash,
    } : null,
    lpTokenContract: lpTokenContract ? {
      address: lpTokenContract.address,
      codeHash: lpTokenContract.code_hash,
    } : null,
    stakingContract: stakingContract ? {
      address: stakingContract.address,
      codeHash: stakingContract.code_hash,
    } : null,
    token0Contract: {
      address: pair[0].custom_token.contract_addr,
      codeHash: pair[0].custom_token.token_code_hash,
    },
    token1Contract: {
      address: pair[1].custom_token.contract_addr,
      codeHash: pair[1].custom_token.token_code_hash,
    },
    isStable: pair[2],
    fee: customFee ? {
      lpFee: customFee.lp_fee.nom / customFee.lp_fee.denom,
      daoFee: customFee.lp_fee.nom / customFee.lp_fee.denom,
    } : null,
  };
}

/**
 * parses the single pair info response
 */
function parsePairInfoResponse(
  response: PairInfoResponse,
): PairInfo {
  const { get_pair_info: pairInfo } = response;
  const {
    fee_info: fees,
    stable_info: stableInfo,
  } = pairInfo;

  return {
    token0Amount: pairInfo.amount_0,
    token1Amount: pairInfo.amount_1,
    lpTokenAmount: pairInfo.total_liquidity,
    priceRatio: stableInfo ? stableInfo.p : null,
    pairSettings: {
      lpFee: fees.lp_fee.nom / fees.lp_fee.denom,
      daoFee: fees.shade_dao_fee.nom / fees.shade_dao_fee.denom,
      stableLpFee: fees.stable_lp_fee.nom / fees.stable_lp_fee.denom,
      stableDaoFee: fees.stable_shade_dao_fee.nom / fees.stable_shade_dao_fee.denom,
      daoContractAddress: fees.shade_dao_address,
      stableParams: stableInfo ? {
        alpha: stableInfo.stable_params.a,
        gamma1: stableInfo.stable_params.gamma1,
        gamma2: stableInfo.stable_params.gamma2,
        oracle: {
          address: stableInfo.stable_params.oracle.address,
          codeHash: stableInfo.stable_params.oracle.code_hash,
        },
        token0Data: {
          oracleKey: stableInfo.stable_token0_data.oracle_key,
          decimals: stableInfo.stable_token0_data.decimals,
        },
        token1Data: {
          oracleKey: stableInfo.stable_token1_data.oracle_key,
          decimals: stableInfo.stable_token1_data.decimals,
        },
        minTradeSizeXForY: stableInfo.stable_params.min_trade_size_x_for_y,
        minTradeSizeYForX: stableInfo.stable_params.min_trade_size_y_for_x,
        maxPriceImpactAllowed: stableInfo.stable_params.max_price_impact_allowed,
        customIterationControls: stableInfo.stable_params.custom_iteration_controls ? {
          epsilon: stableInfo.stable_params.custom_iteration_controls.epsilon,
          maxIteratorNewton: stableInfo.stable_params.custom_iteration_controls.max_iter_newton,
          maxIteratorBisect: stableInfo.stable_params.custom_iteration_controls.max_iter_bisect,
        } : null,
      } : null,
    },
    contractVersion: pairInfo.contract_version,
  };
}

/**
 * parses the pair info reponse from a batch query of
 * multiple pair contracts
 */
const parseBatchQueryPairInfoResponse = (
  response: BatchQueryParsedResponse,
): BatchPairsInfo => response.map((item) => ({
  pairContractAddress: item.id as string,
  pairInfo: parsePairInfoResponse(item.response),
}));

/**
 * query the factory config
 */
const queryFactoryConfig$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryFactoryConfig(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseFactoryConfig(response as FactoryConfigResponse)),
  first(),
);

/**
 * query the list of pairs registered in the factory contract
 */
const queryFactoryPairs$ = ({
  contractAddress,
  codeHash,
  startingIndex,
  limit,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  startingIndex: number,
  limit: number,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryFactoryPairs(startingIndex, limit),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseFactoryPairs({
    response: response as FactoryPairsResponse,
    startingIndex,
    limit,
  })),
  first(),
);

/**
 * query the config for a pair
 */
const queryPairConfig$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgQueryPairConfig(),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parsePairConfig(response as PairConfigResponse)),
  first(),
);

/**
 * query the pair info for multiple pools at one time
 */
function queryPairsInfo$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  pairsContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pairsContracts: Contract[]
}) {
  const queries:BatchQuery[] = pairsContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryPairInfo(),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
  }).pipe(
    map(parseBatchQueryPairInfoResponse),
    first(),
  );
}

export {
  parseFactoryConfig,
  parseFactoryPairs,
  parsePairConfig,
  queryFactoryConfig$,
  queryFactoryPairs$,
  queryPairConfig$,
  queryPairsInfo$,
};
