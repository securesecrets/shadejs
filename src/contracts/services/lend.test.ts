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
} from './lend';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());
const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/swap', () => ({
    msgQueryFactoryConfig: vi.fn(() => 'FACTORY_CONFIG_MSG'),
    msgQueryFactoryPairs: vi.fn(() => 'FACTORY_PAIRS_MSG'),
    msgQueryPairConfig: vi.fn(() => 'PAIR_CONFIG_MSG'),
    msgQueryPairInfo: vi.fn(() => 'PAIR_INFO_MSG'),
    msgQueryStakingConfig: vi.fn(() => 'STAKING_CONFIG_MSG'),
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
