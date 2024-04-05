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
  LendVaultContract,
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
    totalCollateral:
    (vaultType === VaultType.V1 || vaultType === VaultType.V2)
      ? elasticCollateral
      : BigNumber(elasticCollateral).plus(safeCollateral),
    totalSilkBorrowed: convertCoinFromUDenom(debt.elastic, NormalizationFactor.LEND).toString(),
    interestRate: Number(interestRate.current),
    borrowFee: Number(borrowFee.current),
    liquidationFee: {
      discount: Number(liquidationFee.discount),
      minimumDebt: liquidationFee.min_debt,
      treasuryShare: Number(liquidationFee.treasury_share),
      callerShare: Number(liquidationFee.caller_share),
    },
    isProtocolOwned: isProtocol,
    status: LendContractStatus.NORMAL,
    openPositions: 9,
    totalDeposited: convertCoinFromUDenom(elasticCollateral, NormalizationFactor.LEND).toString(),
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
  vaultContractAddress: item.id as string,
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
  vaultContractAddress: item.id as string,
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
  vaultContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultContracts: LendVaultContract[]
}) {
  const queries:BatchQueryParams[] = vaultContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgGetVaults(1), // starting page of 1, meaning that we will query all vaults
  }));

  const vaultTypes = vaultContracts.map((contract) => contract.vaultType);

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
  vaultContracts,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultContracts: LendVaultContract[]
}) {
  return lastValueFrom(batchQueryVaultsInfo$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    vaultContracts,
  }));
}

/**
 * Observable for querying a single vault
 */
const queryVault$ = ({
  vaultContractAddress,
  vaultCodeHash,
  vaultType,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultContractAddress: string,
  vaultCodeHash?: string,
  vaultType: VaultType,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgGetVault(vaultId),
    client,
    contractAddress: vaultContractAddress,
    codeHash: vaultCodeHash,
  })),
  map((response) => parseLendVault(response as VaultResponse, vaultType)),
  first(),
);

/**
 * query a single vault
 */
async function queryVault({
  vaultContractAddress,
  vaultCodeHash,
  vaultType,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultContractAddress: string,
  vaultCodeHash?: string,
  vaultType: VaultType,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryVault$({
    vaultContractAddress,
    vaultCodeHash,
    vaultType,
    vaultId,
    lcdEndpoint,
    chainId,
  }));
}

/**
 * query the user data for multiple lend vault contracts
 */
function batchQueryVaultsUserData$({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultContracts,
  permit,
  vaultIds,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultContracts: Contract[],
  permit: AccountPermit,
  vaultIds: string[]
}) {
  const queries:BatchQueryParams[] = vaultContracts.map((contract) => ({
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
 */
async function batchQueryVaultsUserData({
  queryRouterContractAddress,
  queryRouterCodeHash,
  lcdEndpoint,
  chainId,
  vaultContracts,
  permit,
  vaultIds,
}:{
  queryRouterContractAddress: string,
  queryRouterCodeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  vaultContracts: Contract[],
  permit: AccountPermit,
  vaultIds: string[]
}) {
  return lastValueFrom(batchQueryVaultsUserData$({
    queryRouterContractAddress,
    queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    vaultContracts,
    permit,
    vaultIds,
  }));
}

/**
 * Observable for querying a single vault user data
 */
const queryVaultUserData$ = ({
  vaultContractAddress,
  vaultCodeHash,
  vaultId,
  lcdEndpoint,
  chainId,
  permit,
}:{
  vaultContractAddress: string,
  vaultCodeHash?: string,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
  permit: AccountPermit,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgGetVaultUserPosition(permit, vaultId),
    client,
    contractAddress: vaultContractAddress,
    codeHash: vaultCodeHash,
  })),
  map((response) => parseLendVaultUserData(response as PositionResponse)),
  first(),
);

/**
 * query the info for multiple lend vault contracts
 */
async function queryVaultUserData({
  vaultContractAddress,
  vaultCodeHash,
  vaultId,
  lcdEndpoint,
  chainId,
  permit,
}:{
  vaultContractAddress: string,
  vaultCodeHash?: string,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
  permit: AccountPermit,
}) {
  return lastValueFrom(queryVaultUserData$({
    vaultContractAddress,
    vaultCodeHash,
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
  queryVault$,
  batchQueryVaultsInfo,
  queryVault,
  batchQueryVaultsUserData$,
  batchQueryVaultsUserData,
  queryVaultUserData,
  queryVaultUserData$,
};
