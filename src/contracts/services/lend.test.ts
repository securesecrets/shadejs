import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import vaultV1Response from '~/test/mocks/lend/vaultV1Response.json';
import vaultsV1Response from '~/test/mocks/lend/vaultsV1Response.json';
import vaultV2Response from '~/test/mocks/lend/vaultV2Response.json';
import vaultsV2Response from '~/test/mocks/lend/vaultsV2Response.json';
import vaultV3Response from '~/test/mocks/lend/vaultV3Response.json';
import vaultsV3Response from '~/test/mocks/lend/vaultsV3Response.json';
import { VaultType } from '~/types/contracts/lend/model';
import { VaultResponse, VaultsResponse } from '~/types/contracts/lend/response';
import {
  vaultV1Parsed,
  vaultsV1Parsed,
} from '~/test/mocks/lend/vaultV1Parsed';
import {
  vaultV2Parsed,
  vaultsV2Parsed,
} from '~/test/mocks/lend/vaultV2Parsed';
import {
  vaultV3Parsed,
  vaultsV3Parsed,
} from '~/test/mocks/lend/vaultV3Parsed';
import { batchVaultsResponseUnparsed } from '~/test/mocks/lend/batchVaultsUnparsed';
import { BatchQueryParsedResponse } from '~/types';
import { batchVaultsParsed } from '~/test/mocks/lend/batchVaultsParsed';
import {
  parseLendVault,
  parseLendVaults,
  parseBatchQueryVaultsInfo,
  batchQueryVaultsInfo$,
  batchQueryVaultsInfo,
  queryVault$,
  queryVault,
} from './lend';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());
const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/lend', () => ({
    msgGetVaults: vi.fn(() => 'GET_VAULTS_MSG'),
    msgGetVault: vi.fn(() => 'GET_VAULT_MSG'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$,
  }));
});

test('it can parse the single lend vault V1 response', () => {
  expect(parseLendVault(
    vaultV1Response as VaultResponse,
    VaultType.V1,
  )).toStrictEqual(vaultV1Parsed);
});

test('it can parse the single lend vault V2 response', () => {
  expect(parseLendVault(
    vaultV2Response as VaultResponse,
    VaultType.V2,
  )).toStrictEqual(vaultV2Parsed);
});

test('it can parse the single lend vault V3 response', () => {
  expect(parseLendVault(
    vaultV3Response as VaultResponse,
    VaultType.V3,
  )).toStrictEqual(vaultV3Parsed);
});

test('it can parse the multiple lend vaults V1 response', () => {
  expect(parseLendVaults(
    vaultsV1Response as VaultsResponse,
    VaultType.V1,
  )).toStrictEqual(vaultsV1Parsed);
});

test('it can parse the multiple lend vaults V2 response', () => {
  expect(parseLendVaults(
    vaultsV2Response as VaultsResponse,
    VaultType.V2,
  )).toStrictEqual(vaultsV2Parsed);
});

test('it can parse the multiple lend vaults V3 response', () => {
  expect(parseLendVaults(
    vaultsV3Response as VaultsResponse,
    VaultType.V3,
  )).toStrictEqual(vaultsV3Parsed);
});

test('it can parse the batch query of multiple lend vault contracts', () => {
  expect(parseBatchQueryVaultsInfo(
    batchVaultsResponseUnparsed as BatchQueryParsedResponse,
    [VaultType.V1, VaultType.V2, VaultType.V3],
  )).toStrictEqual(batchVaultsParsed);
});

test('it can call the batch vaults query service', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    vaultRegistryContracts: [{
      address: 'ADDRESS_1',
      codeHash: 'CODE_HASH_1',
      vaultType: VaultType.V1,
    },
    {
      address: 'ADDRESS_2',
      codeHash: 'CODE_HASH_2',
      vaultType: VaultType.V2,
    },
    {
      address: 'ADDRESS_3',
      codeHash: 'CODE_HASH_3',
      vaultType: VaultType.V3,
    }],
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(batchVaultsResponseUnparsed));
  let output;
  batchQueryVaultsInfo$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.vaultRegistryContracts[0].address,
      contract: {
        address: input.vaultRegistryContracts[0].address,
        codeHash: input.vaultRegistryContracts[0].codeHash,
      },
      queryMsg: 'GET_VAULTS_MSG',
    },
    {
      id: input.vaultRegistryContracts[1].address,
      contract: {
        address: input.vaultRegistryContracts[1].address,
        codeHash: input.vaultRegistryContracts[1].codeHash,
      },
      queryMsg: 'GET_VAULTS_MSG',
    },
    {
      id: input.vaultRegistryContracts[2].address,
      contract: {
        address: input.vaultRegistryContracts[2].address,
        codeHash: input.vaultRegistryContracts[2].codeHash,
      },
      queryMsg: 'GET_VAULTS_MSG',
    }],
  });

  expect(output).toStrictEqual(batchVaultsParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchVaultsResponseUnparsed));
  const response = await batchQueryVaultsInfo(input);
  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.vaultRegistryContracts[0].address,
      contract: {
        address: input.vaultRegistryContracts[0].address,
        codeHash: input.vaultRegistryContracts[0].codeHash,
      },
      queryMsg: 'GET_VAULTS_MSG',
    },
    {
      id: input.vaultRegistryContracts[1].address,
      contract: {
        address: input.vaultRegistryContracts[1].address,
        codeHash: input.vaultRegistryContracts[1].codeHash,
      },
      queryMsg: 'GET_VAULTS_MSG',
    },
    {
      id: input.vaultRegistryContracts[2].address,
      contract: {
        address: input.vaultRegistryContracts[2].address,
        codeHash: input.vaultRegistryContracts[2].codeHash,
      },
      queryMsg: 'GET_VAULTS_MSG',
    }],
  });
  expect(response).toStrictEqual(batchVaultsParsed);
});

test('it can call single vault query service', async () => {
  const input = {
    vaultRegistryContractAddress: 'VAULT_CONTRACT_ADDRESS',
    vaultRegistryCodeHash: 'VAULT_CODE_HASH',
    vaultType: VaultType.V1,
    vaultId: '1',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };
  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(vaultV1Response));
  let output;
  queryVault$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'GET_VAULT_MSG',
    client: 'CLIENT',
    contractAddress: input.vaultRegistryContractAddress,
    codeHash: input.vaultRegistryCodeHash,
  });

  expect(output).toStrictEqual(vaultV1Parsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(vaultV1Response));
  const response = await queryVault(input);
  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'GET_VAULT_MSG',
    client: 'CLIENT',
    contractAddress: input.vaultRegistryContractAddress,
    codeHash: input.vaultRegistryCodeHash,
  });
  expect(response).toStrictEqual(vaultV1Parsed);
});
