import {
  BatchQueryParams,
  BatchQueryParsedResponse,
  MinBlockHeightValidationOptions,
} from '~/types';
import { batchQuery$ } from '~/contracts/services/batchQuery';
import {
  map,
  first,
  switchMap,
  lastValueFrom,
} from 'rxjs';
import {
  VaultResponse,
  VaultsResponse,
  NormalizationFactor,
} from '~/types/contracts/lend/vaultRegistry/response';
import {
  convertCoinFromUDenom,
  getActiveQueryClient$,
} from '~/index';
import {
  Vaults,
  Vault,
  BatchVaults,
  VaultVersion,
  LendVaultRegistryContract,
} from '~/types/contracts/lend/vaultRegistry/model';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import BigNumber from 'bignumber.js';
import {
  msgGetVault,
  msgGetVaults,
} from '~/contracts/definitions/lend/vaultRegistry';

/**
* Parse lend vault response
*/
function parseLendVault(vault: VaultResponse, vaultVersion: VaultVersion) {
  const {
    id,
    allowance,
    collateral: {
      elastic: elasticCollateral,
      base: baseCollateral,
      last_accrued: collateralLastAccrued,
    },
    safe_collateral: safeCollateral,
    config: {
      max_ltv: maxLtv,
      collateral_oracle_delay: collateralOracleDelay,
      fees: {
        interest_rate: interestRate,
        borrow_fee: borrowFee,
        liquidation_fee: liquidationFee,
      },
    },
    debt,
    collateral_addr: collateralAddress,
    is_protocol: isProtocolOnly,
    name,
    open_positions: openPositions,
    position_id_counter: positionIdCounter,
  } = vault.vault;

  return {
    id,
    vaultVersion,
    name,
    collateralAddress,
    silkMaxAllowance: convertCoinFromUDenom(allowance.max, NormalizationFactor.LEND).toString(),
    silkAllowanceUsed: convertCoinFromUDenom(allowance.used, NormalizationFactor.LEND).toString(),
    maxLtv: Number(maxLtv),
    // Collateral is expressed differently depending on vault type
    collateral: {
      total:
    (vaultVersion === VaultVersion.V1 || vaultVersion === VaultVersion.V2)
      ? convertCoinFromUDenom(elasticCollateral, NormalizationFactor.LEND).toString()
      : convertCoinFromUDenom(
        BigNumber(elasticCollateral).plus(safeCollateral),
        NormalizationFactor.LEND,
      ).toString(),
      elastic: convertCoinFromUDenom(elasticCollateral, NormalizationFactor.LEND).toString(),
      base: convertCoinFromUDenom(baseCollateral, NormalizationFactor.LEND).toString(),
      safe: convertCoinFromUDenom(safeCollateral, NormalizationFactor.LEND).toString(),
      lastAccruedAt: new Date(Number(collateralLastAccrued) * 1000),
      oracleDelay: Number(collateralOracleDelay),
    },
    debt: {
      total: convertCoinFromUDenom(debt.elastic, NormalizationFactor.LEND).toString(),
      base: convertCoinFromUDenom(debt.base, NormalizationFactor.LEND).toString(),
      lastAccruedAt: new Date(Number(debt.last_accrued) * 1000),
    },
    interestRate: {
      current: Number(interestRate.current),
      target: Number(interestRate.target),
      delta: Number(interestRate.delta),
      ratePerSecond: Number(interestRate.rate_per_second),
      lastUpdatedAt: new Date(
        Number(interestRate.last_changed) * 1000,
      ),
    },
    borrowFee: {
      current: Number(borrowFee.current),
      target: Number(borrowFee.target),
      delta: Number(borrowFee.delta),
      ratePerSecond: Number(borrowFee.rate_per_second),
      lastUpdatedAt: new Date(Number(borrowFee.last_changed) * 1000),
    },
    liquidationFee: {
      discount: Number(liquidationFee.discount),
      minimumDebt: convertCoinFromUDenom(
        liquidationFee.min_debt,
        NormalizationFactor.LEND,
      ).toString(),
      daoShare: Number(liquidationFee.treasury_share),
      callerShare: Number(liquidationFee.caller_share),
    },
    isProtocolOnly,
    status: vault.status,
    openPositions: Number(openPositions.value),
    totalPositions: Number(positionIdCounter.value),
    whitelist: vault.whitelist,
  } as Vault;
}

/**
* Parse lend vaults response
*/
function parseLendVaults(vaults: VaultsResponse, vaultVersion: VaultVersion): Vaults {
  return vaults.vaults.reduce((prev: Vaults, vault: VaultResponse) => {
    const {
      id: vaultId,
    } = vault.vault;
    return {
      ...prev,
      [vaultId]: parseLendVault(vault, vaultVersion),
    };
  }, {});
}

/**
 * parses the vaults reponse from a batch query of
 * multiple vaults contracts
 */
const parseBatchQueryVaultsInfo = (
  response: BatchQueryParsedResponse,
  vaultVersions: VaultVersion[],
): BatchVaults => response.map((item, index) => ({
  vaultRegistryContractAddress: item.id as string,
  vaults: parseLendVaults(item.response, vaultVersions[index]),
  blockHeight: item.blockHeight,
}));

/**
 * query the info for multiple lend vaults contracts
 */
function queryVaults$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: LendVaultRegistryContract[],
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  const queries:BatchQueryParams[] = vaultRegistryContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgGetVaults('1'), // starting page of 1, meaning that we will query all vaults
  }));

  const vaultVersions = vaultRegistryContracts.map((contract) => contract.vaultVersion);

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
    minBlockHeightValidationOptions,
  }).pipe(
    map((response) => parseBatchQueryVaultsInfo(response, vaultVersions)),
    first(),
  );
}

/**
 * query the info for multiple lend vault contracts
 */
async function queryVaults({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
  minBlockHeightValidationOptions,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: LendVaultRegistryContract[]
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(queryVaults$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    vaultRegistryContracts,
    minBlockHeightValidationOptions,
  }));
}

/**
 * Observable for querying a single vault
 */
const queryVault$ = ({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultVersion,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultVersion: VaultVersion,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgGetVault(vaultId),
    client,
    contractAddress: vaultRegistryContractAddress,
    codeHash: vaultRegistryCodeHash,
  })),
  map((response) => parseLendVault(response as VaultResponse, vaultVersion)),
  first(),
);

/**
 * query a single vault
 */
async function queryVault({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultVersion,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultVersion: VaultVersion,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryVault$({
    vaultRegistryContractAddress,
    vaultRegistryCodeHash,
    vaultVersion,
    vaultId,
    lcdEndpoint,
    chainId,
  }));
}

export {
  parseLendVault,
  parseLendVaults,
  parseBatchQueryVaultsInfo,
  queryVaults$,
  queryVaults,
  queryVault$,
  queryVault,
};
