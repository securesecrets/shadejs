import { getActiveQueryClient$ } from '~/client';
import {
  switchMap,
  first,
  map,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { FactoryConfigResponse, FactoryPairsResponse, PairConfigResponse } from '~/types/contracts/swap/response';
import {
  FactoryConfig,
  FactoryPairs,
  PairConfig,
} from '~/types/contracts/swap/model';
import {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
} from '~/contracts/definitions/swap';

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

export {
  parseFactoryConfig,
  parseFactoryPairs,
  parsePairConfig,
  queryFactoryConfig$,
  queryFactoryPairs$,
  queryPairConfig$,
};
