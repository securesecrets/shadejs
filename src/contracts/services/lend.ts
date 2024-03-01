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
} from '~/types/contracts/lend/model';
import {
  msgGetVault,
  msgGetVaults,
  msgGetVaultUserPosition,
  msgGetVaultUserPositions,
} from '~/contracts/definitions/lend';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { AccountPermit } from '~/types/permit';

/**
* Parse lend vault response
*/
function parseLendVault(vault: VaultResponse) {
  const {
    id,
    allowance,
    collateral,
    config,
    debt,
    collateral_addr: collateralAddress,
    is_protocol: isProtocol,
  } = vault.vault;
  return {
    id,
    collateralAddress,
    silkMaxAllowance: convertCoinFromUDenom(allowance.max, NormalizationFactor.LEND).toString(),
    silkAllowanceUsed: convertCoinFromUDenom(allowance.used, NormalizationFactor.LEND).toString(),
    interestRate: config.fees.interest_rate.current,
    fee: config.fees.borrow_fee.current,
    maxLtv: config.max_ltv,
    totalDeposited: convertCoinFromUDenom(collateral.elastic, NormalizationFactor.LEND).toString(),
    totalBorrow: convertCoinFromUDenom(debt.elastic, NormalizationFactor.LEND).toString(),
    isProtocolOwned: isProtocol,
  } as Vault;
}

/**
* Parse lend vaults response
*/
function parseLendVaults(vaults: VaultsResponse) {
  return vaults.vaults.reduce((prev, vault) => {
    const {
      id: vaultId,
    } = vault.vault;
    return {
      ...prev,
      [vaultId]: parseLendVault(vault),
    };
  }, {} as Vaults);
}

/**
 * parses the vaults reponse from a batch query of
 * multiple vaults contracts
 */
const parseBatchQueryVaultsInfo = (
  response: BatchQueryParsedResponse,
): BatchVaults => response.map((item) => ({
  vaultContractAddress: item.id as string,
  vaults: parseLendVaults(item.response),
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
  vaultContracts: Contract[]
}) {
  const queries:BatchQueryParams[] = vaultContracts.map((contract) => ({
    id: contract.address,
    contract: {
      address: contract.address,
      codeHash: contract.codeHash,
    },
    queryMsg: msgGetVaults(1), // starting page of 1, meaning that we will query all vaults
  }));
  return batchQuery$({
    contractAddress: queryRouterContractAddress,
    codeHash: queryRouterCodeHash,
    lcdEndpoint,
    chainId,
    queries,
  }).pipe(
    map(parseBatchQueryVaultsInfo),
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
  vaultContracts: Contract[]
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
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultContractAddress: string,
  vaultCodeHash?: string,
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
  map((response) => parseLendVault(response as VaultResponse)),
  first(),
);

/**
 * query a single vault
 */
async function queryVault({
  vaultContractAddress,
  vaultCodeHash,
  vaultId,
  lcdEndpoint,
  chainId,
}:{
  vaultContractAddress: string,
  vaultCodeHash?: string,
  vaultId: string,
  lcdEndpoint?: string,
  chainId?: string,
}) {
  return lastValueFrom(queryVault$({
    vaultContractAddress,
    vaultCodeHash,
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
