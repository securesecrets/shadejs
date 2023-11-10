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
  parsePairInfo,
  parseStakingInfo,
  queryFactoryConfig$,
  queryFactoryConfig,
  queryFactoryPairs$,
  queryFactoryPairs,
  queryPairConfig$,
  queryPairConfig,
  parseSwapResponse,
  parseBatchQueryPairInfoResponse,
  parseBatchQueryStakingInfoResponse,
  batchQueryPairsInfo,
  batchQueryPairsInfo$,
  batchQueryStakingInfo,
  batchQueryStakingInfo$,
} from '~/contracts/services/swap';
import factoryConfigResponse from '~/test/mocks/swap/factoryConfig.json';
import factoryPairsResponse from '~/test/mocks/swap/factoryPairs.json';
import pairConfigResponse from '~/test/mocks/swap/pairConfig.json';
import pairInfoResponse from '~/test/mocks/swap/pairInfoResponse.json';
import stakingInfoResponse from '~/test/mocks/swap/stakingConfig.json';
import { of } from 'rxjs';
import {
  FactoryConfigResponse,
  FactoryPairsResponse,
  PairConfigResponse,
  PairInfoResponse,
  StakingConfigResponse,
} from '~/types/contracts/swap/response';
import { factoryConfigParsed } from '~/test/mocks/swap/factoryConfigParsed';
import { factoryPairsParsed } from '~/test/mocks/swap/factoryPairsParsed';
import { pairConfigParsed } from '~/test/mocks/swap/pairConfigParsed';
import { pairInfoParsed } from '~/test/mocks/swap/pairInfoParsed';
import { stakingConfigParsed } from '~/test/mocks/swap/stakingConfigParsed';
import swapResponse from '~/test/mocks/swap/swapResponse.json';
import { TxResponse } from 'secretjs';
import { parsedSwapResponse } from '~/test/mocks/swap/parsedSwapResponse';
import { pairsInfoResponseUnparsed } from '~/test/mocks/swap/batchPairsInfoResponseUnparsed';
import { pairsInfoParsed } from '~/test/mocks/swap/batchPairsInfoParsed';
import { batchStakingConfigUnparsed } from '~/test/mocks/swap/batchStakingConfigUnparsed';
import { batchStakingConfigParsed } from '~/test/mocks/swap/batchStakingConfigParsed';

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

test('it can parse the pair info response', () => {
  expect(parsePairInfo(pairInfoResponse as PairInfoResponse)).toStrictEqual(pairInfoParsed);
});

test('it can parse the staking info response', () => {
  expect(parseStakingInfo(
    stakingInfoResponse as StakingConfigResponse,
  )).toStrictEqual(stakingConfigParsed);
});

test('it can parse the swap token response', () => {
  expect(parseSwapResponse(
    swapResponse as unknown as TxResponse,
  )).toStrictEqual(parsedSwapResponse);
});

test('it can parse the batch pairs response', () => {
  expect(parseBatchQueryPairInfoResponse(
    pairsInfoResponseUnparsed,
  )).toStrictEqual(pairsInfoParsed);
});

test('it can parse the batch staking response', () => {
  expect(parseBatchQueryStakingInfoResponse(
    batchStakingConfigUnparsed,
  )).toStrictEqual(batchStakingConfigParsed);
});

test('it can call the query factory config service', async () => {
  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(factoryConfigResponse));

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

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(factoryConfigResponse));
  const output2 = await queryFactoryConfig(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'FACTORY_CONFIG_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output2).toStrictEqual(factoryConfigParsed);
});

test('it can call the query factory pairs service', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    startingIndex: 1,
    limit: 25,
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(factoryPairsResponse));

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

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(factoryPairsResponse));
  const response = await queryFactoryPairs(input);
  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'FACTORY_PAIRS_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });
  expect(response).toStrictEqual(factoryPairsParsed);
});

test('it can call the query pair config service', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(pairConfigResponse));
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

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(pairConfigResponse));
  const response = await queryPairConfig(input);
  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'PAIR_CONFIG_MSG',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });
  expect(response).toStrictEqual(pairConfigParsed);
});

test('it can call the batch pairs info query service', async () => {
  const input = {
    queryRouterContractAddress: 'CONTRACT_ADDRESS',
    queryRouterCodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    pairsContracts: [{
      address: 'PAIR_ADDRESS',
      codeHash: 'PAIR_CODE_HASH',
    }],
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(pairsInfoResponseUnparsed));
  let output;
  batchQueryPairsInfo$(input).subscribe({
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
      id: input.pairsContracts[0].address,
      contract: {
        address: input.pairsContracts[0].address,
        codeHash: input.pairsContracts[0].codeHash,
      },
      queryMsg: 'PAIR_INFO_MSG',
    }],
  });

  expect(output).toStrictEqual(pairsInfoParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(pairsInfoResponseUnparsed));
  const response = await batchQueryPairsInfo(input);
  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.pairsContracts[0].address,
      contract: {
        address: input.pairsContracts[0].address,
        codeHash: input.pairsContracts[0].codeHash,
      },
      queryMsg: 'PAIR_INFO_MSG',
    }],
  });
  expect(response).toStrictEqual(pairsInfoParsed);
});

test('it can call the batch staking info query service', async () => {
  const input = {
    queryRouterContractAddress: 'CONTRACT_ADDRESS',
    queryRouterCodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    stakingContracts: [{
      address: 'PAIR_ADDRESS',
      codeHash: 'PAIR_CODE_HASH',
    }],
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(batchStakingConfigUnparsed));
  let output;
  batchQueryStakingInfo$(input).subscribe({
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
      id: input.stakingContracts[0].address,
      contract: {
        address: input.stakingContracts[0].address,
        codeHash: input.stakingContracts[0].codeHash,
      },
      queryMsg: 'PAIR_INFO_MSG',
    }],
  });

  expect(output).toStrictEqual(batchStakingConfigParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchStakingConfigUnparsed));
  const response = await batchQueryStakingInfo(input);
  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.stakingContracts[0].address,
      contract: {
        address: input.stakingContracts[0].address,
        codeHash: input.stakingContracts[0].codeHash,
      },
      queryMsg: 'STAKING_CONFIG_MSG',
    }],
  });
  expect(response).toStrictEqual(batchStakingConfigParsed);
});
