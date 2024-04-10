import {
  BatchQueryParams,
  Contract,
  BatchQueryParsedResponse,
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
  PositionResponse,
  PositionsResponse,
  LendContractStatus,
} from '~/types/contracts/lend/response';
import {
  convertCoinFromUDenom,
  getActiveQueryClient$,
} from '~/index';
import {
  Vaults,
  Vault,
  BatchVaults,
  VaultUserData,
  VaultsUserData,
  BatchVaultsUserData,
  VaultType,
  LendVaultRegistryContract,
} from '~/types/contracts/lend/model';
import {
  msgGetVault,
  msgGetVaults,
  msgGetVaultUserPosition,
  msgGetVaultUserPositions,
} from '~/contracts/definitions/lend';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { AccountPermit } from '~/types/permit';
import BigNumber from 'bignumber.js';

/**
* Parse lend vault response
*/
function parseLendVault(vault: VaultResponse, vaultType: VaultType) {
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
      fees: {
        interest_rate: interestRate,
        borrow_fee: borrowFee,
        liquidation_fee: liquidationFee,
      },
    },
    debt,
    collateral_addr: collateralAddress,
    is_protocol: isProtocol,
    name,
    open_positions: openPositions,
    position_id_counter: positionIdCounter,
  } = vault.vault;
  return {
    id,
    vaultType,
    name,
    collateralAddress,
    silkMaxAllowance: convertCoinFromUDenom(allowance.max, NormalizationFactor.LEND).toString(),
    silkAllowanceUsed: convertCoinFromUDenom(allowance.used, NormalizationFactor.LEND).toString(),
    maxLtv: Number(maxLtv),
    // Collateral is expressed differently depending on vault type
    collateral: {
      total:
    (vaultType === VaultType.V1 || vaultType === VaultType.V2)
      ? convertCoinFromUDenom(elasticCollateral, NormalizationFactor.LEND).toString()
      : convertCoinFromUDenom(
        BigNumber(elasticCollateral).plus(safeCollateral),
        NormalizationFactor.LEND,
      ).toString(),
      elastic: convertCoinFromUDenom(elasticCollateral, NormalizationFactor.LEND).toString(),
      base: convertCoinFromUDenom(baseCollateral, NormalizationFactor.LEND).toString(),
      safe: convertCoinFromUDenom(safeCollateral, NormalizationFactor.LEND).toString(),
      lastAccruedAt: new Date(Number(collateralLastAccrued) * 1000),
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
    isProtocolOnly: isProtocol,
    status: LendContractStatus.NORMAL,
    openPositions: Number(openPositions.value),
    totalPositions: Number(positionIdCounter.value),
  } as Vault;
}

/**
* Parse lend vaults response
*/
function parseLendVaults(vaults: VaultsResponse, vaultType: VaultType) {
  return vaults.vaults.reduce((prev, vault) => {
    const {
      id: vaultId,
    } = vault.vault;
    return {
      ...prev,
      [vaultId]: parseLendVault(vault, vaultType),
    };
  }, {} as Vaults);
}

/**
 * parses the vaults reponse from a batch query of
 * multiple vaults contracts
 */
const parseBatchQueryVaultsInfo = (
  response: BatchQueryParsedResponse,
  vaultTypes: VaultType[],
): BatchVaults => response.map((item, index) => ({
  vaultRegistryContractAddress: item.id as string,
  vaults: parseLendVaults(item.response, vaultTypes[index]),
}));

/**
* Parse lend single vault user data response
*/
function parseLendVaultUserData(
  userPosition: PositionResponse,
) {
  const { position } = userPosition.position_info;
  if (position !== null) {
    const {
      collateral_amount: collateralAmount,
      debt_amount: debtAmount,
      vault_id: vaultId,
    } = position;

    return {
      vaultId,
      collateralAmount: convertCoinFromUDenom(
        collateralAmount,
        NormalizationFactor.LEND,
      ).toString(),
      debtAmount: convertCoinFromUDenom(debtAmount, NormalizationFactor.LEND).toString(),
    } as VaultUserData;
  }
  return null;
}

/**
* Parse lend multiple vaults user data response
*/
function parseLendVaultsUserData(
  userPositions: PositionsResponse,
) {
  const { positions } = userPositions.positions;
  if (positions !== null) {
    return positions.reduce((prev, curr) => {
      const {
        collateral_amount: collateralAmount,
        debt_amount: debtAmount,
        vault_id: vaultId,
      } = curr;
      return {
        ...prev,
        [vaultId]: {
          vaultId,
          collateralAmount: convertCoinFromUDenom(collateralAmount, 18).toString(),
          debtAmount: convertCoinFromUDenom(debtAmount, 18).toString(),
        } as VaultUserData,
      };
    }, {} as VaultsUserData);
  }
  return null;
}

/**
 * parses the vaults user data reponse from a batch query of
 * multiple vaults contracts
 */
const parseBatchQueryVaultsUserData = (
  response: BatchQueryParsedResponse,
): BatchVaultsUserData => response.map((item) => ({
  vaultRegistryContractAddress: item.id as string,
  vaultsUserData: parseLendVaultsUserData(item.response),
}));

/**
 * query the info for multiple lend vault contracts
 */
function batchQueryVaultsInfo$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: LendVaultRegistryContract[]
}) {
  const queries:BatchQueryParams[] = vaultRegistryContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgGetVaults(1), // starting page of 1, meaning that we will query all vaults
  }));

  const vaultTypes = vaultRegistryContracts.map((contract) => contract.vaultType);

  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
  }).pipe(
    map((response) => parseBatchQueryVaultsInfo(response, vaultTypes)),
    first(),
  );
}

/**
 * query the info for multiple lend vault contracts
 */
async function batchQueryVaultsInfo({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: LendVaultRegistryContract[]
}) {
  return lastValueFrom(batchQueryVaultsInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    vaultRegistryContracts,
  }));
}

/**
 * Observable for querying a single vault
 */
const queryVault$ = ({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultType,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultType: VaultType,
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
  map((response) => parseLendVault(response as VaultResponse, vaultType)),
  first(),
);

/**
 * query a single vault
 */
async function queryVault({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultType,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultType: VaultType,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryVault$({
    vaultRegistryContractAddress,
    vaultRegistryCodeHash,
    vaultType,
    vaultId,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * query the user data for multiple lend vault contracts
 *
 * EXPERIMENTAL QUERY. This has not yet been
 * validated/unit tested in shadeJS for production use
 */
function batchQueryVaultsUserData$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
  permit,
  vaultIds,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: Contract[],
  permit: AccountPermit,
  vaultIds: string[]
}) {
  const queries:BatchQueryParams[] = vaultRegistryContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgGetVaultUserPositions(permit, vaultIds),
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
  }).pipe(
    map(parseBatchQueryVaultsUserData),
    first(),
  );
}

/**
 * query the info for multiple lend vault contracts
 *
 * EXPERIMENTAL QUERY. This has not yet been
 * validated/unit tested in shadeJS for production use
 */
async function batchQueryVaultsUserData({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultRegistryContracts,
  permit,
  vaultIds,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultRegistryContracts: Contract[],
  permit: AccountPermit,
  vaultIds: string[]
}) {
  return lastValueFrom(batchQueryVaultsUserData$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    vaultRegistryContracts,
    permit,
    vaultIds,
  }));
}

/**
 * Observable for querying a single vault user data
 *
 * EXPERIMENTAL QUERY. This has not yet been
 * validated/unit tested in shadeJS for production use
 */
const queryVaultUserData$ = ({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultId,
  lcdEndpoint,
  chainId,
  permit,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
  permit: AccountPermit,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgGetVaultUserPosition(permit, vaultId),
    client,
    contractAddress: vaultRegistryContractAddress,
    codeHash: vaultRegistryCodeHash,
  })),
  map((response) => parseLendVaultUserData(response as PositionResponse)),
  first(),
);

/**
 * query the info for multiple lend vault contracts
 *
 * EXPERIMENTAL QUERY. This has not yet been
 * validated/unit tested in shadeJS for production use.
 */
async function queryVaultUserData({
  vaultRegistryContractAddress,
  vaultRegistryCodeHash,
  vaultId,
  lcdEndpoint,
  chainId,
  permit,
}:{
  vaultRegistryContractAddress: string,
  vaultRegistryCodeHash?: string,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
  permit: AccountPermit,
}) {
  return lastValueFrom(queryVaultUserData$({
    vaultRegistryContractAddress,
    vaultRegistryCodeHash,
    vaultId,
    lcdEndpoint,
    chainId,
    permit,
  }));
}

export {
  parseLendVault,
  parseLendVaults,
  parseBatchQueryVaultsInfo,
  batchQueryVaultsInfo$,
  batchQueryVaultsInfo,
  queryVault$,
  queryVault,
  batchQueryVaultsUserData$,
  batchQueryVaultsUserData,
  queryVaultUserData,
  queryVaultUserData$,
};
