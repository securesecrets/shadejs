import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import {
  FactoryConfigResponse,
  FactoryPairsResponse,
  PairConfigResponse,
  PairInfoResponse,
  StakingConfigResponse,
} from '~/types/contracts/swap/response';
import {
  BatchPairsInfo,
  BatchPairsConfig,
  BatchStakingInfo,
  FactoryConfig,
  FactoryPairs,
  PairConfig,
  PairInfo,
  StakingInfo,
  ParsedSwapResponse,
} from '~/types/contracts/swap/model';
import {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
  msgQueryStakingConfig,
} from '~/contracts/definitions/swap';
import { Contract } from '~/types/contracts/shared';
import {
  BatchQueryParams,
  BatchQueryParsedResponse,
} from '~/types/contracts/batchQuery/model';
import { TxResponse } from 'secretjs';
import { Attribute } from 'secretjs/dist/protobuf/cosmos/base/abci/v1beta1/abci';
import { batchQuery$ } from './batchQuery';
import { SERVICE_BATCH_SIZE } from './config';

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
    pairContract: {
      address: pair.address,
      codeHash: pair.code_hash,
    },
    token0Contract: {
      address: pair.pair[0].custom_token.contract_addr,
      codeHash: pair.pair[0].custom_token.token_code_hash,
    },
    token1Contract: {
      address: pair.pair[1].custom_token.contract_addr,
      codeHash: pair.pair[1].custom_token.token_code_hash,
    },
    isStable: pair.pair[2],
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
      daoFee: customFee.shade_dao_fee.nom / customFee.shade_dao_fee.denom,
    } : null,
  };
}

/**
 * parses the single pair info response
 */
function parsePairInfo(
  response: PairInfoResponse,
): PairInfo {
  const { get_pair_info: pairInfo } = response;
  const {
    fee_info: fees,
    stable_info: stableInfo,
  } = pairInfo;

  return {
    token0Contract: {
      address: pairInfo.pair[0].custom_token.contract_addr,
      codeHash: pairInfo.pair[0].custom_token.token_code_hash,
    },
    token1Contract: {
      address: pairInfo.pair[1].custom_token.contract_addr,
      codeHash: pairInfo.pair[1].custom_token.token_code_hash,
    },
    lpTokenContract: {
      address: pairInfo.liquidity_token.address,
      codeHash: pairInfo.liquidity_token.code_hash,
    },
    factoryContract: pairInfo.factory ? {
      address: pairInfo.factory.address,
      codeHash: pairInfo.factory.code_hash,
    } : null,
    daoContractAddress: fees.shade_dao_address,
    isStable: pairInfo.pair[2],
    token0Amount: pairInfo.amount_0,
    token1Amount: pairInfo.amount_1,
    lpTokenAmount: pairInfo.total_liquidity,
    lpFee: pairInfo.pair[2] ? fees.stable_lp_fee.nom / fees.stable_lp_fee.denom
      : fees.lp_fee.nom / fees.lp_fee.denom,
    daoFee: pairInfo.pair[2] ? fees.stable_shade_dao_fee.nom / fees.stable_shade_dao_fee.denom
      : fees.shade_dao_fee.nom / fees.shade_dao_fee.denom,
    stableParams: stableInfo ? {
      priceRatio: stableInfo.p,
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
  pairInfo: parsePairInfo(item.response),
}));

/**
 * parses the pair config response from a batch query of
 * multiple pair contracts
 */
const parseBatchQueryPairConfigResponse = (
  response: BatchQueryParsedResponse,
): BatchPairsConfig => response.map((item) => ({
  pairContractAddress: item.id as string,
  pairConfig: parsePairConfig(item.response),
}));
/**
 * parses the single staking info response
 */
function parseStakingInfo(response: StakingConfigResponse): StakingInfo {
  const {
    lp_token: lpToken,
    amm_pair: ammPair,
    admin_auth: adminAuth,
    query_auth: queryAuth,
    total_amount_staked: totalAmountStaked,
    reward_tokens: rewardTokens,
  } = response;

  return {
    lpTokenContract: {
      address: lpToken.address,
      codeHash: lpToken.code_hash,
    },
    pairContractAddress: ammPair,
    adminAuthContract: {
      address: adminAuth.address,
      codeHash: adminAuth.code_hash,
    },
    queryAuthContract: queryAuth ? {
      address: queryAuth.address,
      codeHash: queryAuth.code_hash,
    } : null,
    totalStakedAmount: totalAmountStaked,
    rewardTokens: rewardTokens.map((token) => ({
      token: {
        address: token.token.address,
        codeHash: token.token.code_hash,
      },
      rewardPerSecond: token.reward_per_second,
      rewardPerStakedToken: token.reward_per_staked_token,
      validTo: token.valid_to,
      lastUpdated: token.last_updated,
    })),
  };
}

/**
 * parses the staking info reponse from a batch query of
 * multiple staking contracts
 */
const parseBatchQueryStakingInfoResponse = (
  response: BatchQueryParsedResponse,
): BatchStakingInfo => response.map((item) => ({
  stakingContractAddress: item.id as string,
  stakingInfo: parseStakingInfo(item.response),
}));

/**
* parse the response from a successful token swap
*/
const parseSwapResponse = (
  response: TxResponse,
): ParsedSwapResponse => {
  let inputTokenAddress: string | undefined;
  let outputTokenAddress: string | undefined;
  let inputTokenAmount: string | undefined;
  let outputTokenAmount: string | undefined;
  const txHash = response.transactionHash;
  const { jsonLog } = response;

  if (jsonLog !== undefined
    && jsonLog.length > 0
  ) {
    const wasmAttributes = jsonLog[0].events.find((event) => (
      event.type === 'wasm'
    ));
    if (wasmAttributes === undefined) {
      return {
        txHash,
        inputTokenAddress,
        outputTokenAddress,
        inputTokenAmount,
        outputTokenAmount,
      };
    }
    wasmAttributes.attributes.forEach((attribute: Attribute) => {
      if (attribute.key.trim() === 'amount_out') {
        outputTokenAmount = attribute.value.trim();
      } else if (attribute.key.trim() === 'amount_in' && inputTokenAmount === undefined) {
        inputTokenAmount = attribute.value.trim();
      } else if (attribute.key.trim() === 'token_out_key') {
        outputTokenAddress = attribute.value.trim();
      } else if (attribute.key.trim() === 'token_in_key' && inputTokenAddress === undefined) {
        inputTokenAddress = attribute.value.trim();
      }
    });
  }
  return {
    txHash,
    inputTokenAddress,
    outputTokenAddress,
    inputTokenAmount,
    outputTokenAmount,
  };
};

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
 * query the factory config
 */
async function queryFactoryConfig({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryFactoryConfig$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

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
 * query the list of pairs registered in the factory contract
 */
async function queryFactoryPairs({
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
}) {
  return lastValueFrom(queryFactoryPairs$({
    contractAddress,
    codeHash,
    startingIndex,
    limit,
    lcdEndpoint,
    chainId,
  }));
}

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
 * query the config for a pair
 */
async function queryPairConfig({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryPairConfig$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * query the info for multiple pairs at one time
 */
function batchQueryPairsInfo$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  pairsContracts,
  batchSize = SERVICE_BATCH_SIZE.PAIR_INFO,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pairsContracts: Contract[],
  batchSize?: number,
}) {
  const queries:BatchQueryParams[] = pairsContracts.map((contract) => ({
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
    batchSize,
  }).pipe(
    map(parseBatchQueryPairInfoResponse),
    first(),
  );
}

/**
 * query the info for multiple pairs at one time
 */
async function batchQueryPairsInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  pairsContracts,
  batchSize,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pairsContracts: Contract[],
  batchSize?: number,
}) {
  return lastValueFrom(batchQueryPairsInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    pairsContracts,
    batchSize,
  }));
}

/**
 * query the config for multiple pairs at one time
 */
function batchQueryPairsConfig$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  pairsContracts,
  batchSize = SERVICE_BATCH_SIZE.PAIR_CONFIG,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pairsContracts: Contract[],
  batchSize?: number,
}) {
  const queries:BatchQueryParams[] = pairsContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryPairConfig(),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
  }).pipe(
    map(parseBatchQueryPairConfigResponse),
    first(),
  );
}

/**
 * query the config for multiple pairs at one time
 */
async function batchQueryPairsConfig({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  pairsContracts,
  batchSize,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  pairsContracts: Contract[],
  batchSize?: number,
}) {
  return lastValueFrom(batchQueryPairsConfig$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    pairsContracts,
    batchSize,
  }));
}

/**
 * query the staking info for multiple staking contracts at one time
 */
function batchQueryStakingInfo$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stakingContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stakingContracts: Contract[]
}) {
  const queries:BatchQueryParams[] = stakingContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgQueryStakingConfig(),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
  }).pipe(
    map(parseBatchQueryStakingInfoResponse),
    first(),
  );
}

/**
 * query the staking info for multiple staking contracts at one time
 */
async function batchQueryStakingInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  stakingContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  stakingContracts: Contract[]
}) {
  return lastValueFrom(batchQueryStakingInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    stakingContracts,
  }));
}

export {
  parseFactoryConfig,
  parseFactoryPairs,
  parsePairConfig,
  parsePairInfo,
  parseStakingInfo,
  queryFactoryConfig$,
  queryFactoryConfig,
  queryFactoryPairs$,
  queryFactoryPairs,
  queryPairConfig$,
  queryPairConfig,
  batchQueryPairsInfo$,
  batchQueryPairsInfo,
  batchQueryPairsConfig$,
  batchQueryPairsConfig,
  batchQueryStakingInfo$,
  batchQueryStakingInfo,
  parseSwapResponse,
  parseBatchQueryPairInfoResponse,
  parseBatchQueryStakingInfoResponse,
  parseBatchQueryPairConfigResponse,
};
