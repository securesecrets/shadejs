import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import {
  parseFactoryConfig,
  parseFactoryPairs,
  parsePairConfig,
  queryFactoryConfig$,
  queryFactoryPairs$,
  queryPairConfig$,
} from '~/contracts/services/swap';
import factoryConfigResponse from '~/test/mocks/swap/factoryConfig.json';
import factoryPairsResponse from '~/test/mocks/swap/factoryPairs.json';
import pairConfigResponse from '~/test/mocks/swap/pairConfig.json';
import { of } from 'rxjs';
import {
  FactoryConfigResponse,
  FactoryPairsResponse,
  PairConfigResponse,
} from '~/types/contracts/swap/response';
import { factoryConfigParsed } from '~/test/mocks/swap/factoryConfigParsed';
import { factoryPairsParsed } from '~/test/mocks/swap/factoryPairsParsed';
import { pairConfigParsed } from '~/test/mocks/swap/pairConfigParsed';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/swap', () => ({
    msgQueryFactoryConfig: vi.fn(() => 'FACTORY_CONFIG_MSG'),
    msgQueryFactoryPairs: vi.fn(() => 'FACTORY_PAIRS_MSG'),
    msgQueryPairConfig: vi.fn(() => 'PAIR_CONFIG_MSG'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

test('it can parse the factory config', () => {
  expect(parseFactoryConfig(
    factoryConfigResponse as FactoryConfigResponse,
  )).toStrictEqual(factoryConfigParsed);
});

test('it can parse the factory pairs response', () => {
  expect(parseFactoryPairs({
    response: factoryPairsResponse as FactoryPairsResponse,
    startingIndex: 1,
    limit: 25,
  })).toStrictEqual(factoryPairsParsed);
});

test('it can parse the pair config response', () => {
  expect(parsePairConfig(pairConfigResponse as PairConfigResponse)).toStrictEqual(pairConfigParsed);
});

test('it can call the query factory config service', () => {
  sendSecretClientContractQuery$.mockReturnValue(of(factoryConfigResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  let output;
  queryFactoryConfig$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'FACTORY_CONFIG_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(factoryConfigParsed);

  vi.doUnmock('~/client/services/clientServices');
});

test('it can call the query factory pairs service', () => {
  sendSecretClientContractQuery$.mockReturnValue(of(factoryPairsResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    startingIndex: 1,
    limit: 25,
  };

  let output;
  queryFactoryPairs$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'FACTORY_PAIRS_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(factoryPairsParsed);
});

test('it can call the query factory pairs service', () => {
  sendSecretClientContractQuery$.mockReturnValue(of(pairConfigResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };
  let output;
  queryPairConfig$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'PAIR_CONFIG_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(pairConfigParsed);
});
