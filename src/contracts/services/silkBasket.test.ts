import {
  test,
  expect,
  vi,
  beforeAll,
  afterEach,
} from 'vitest';
import silkBasketResponse from '~/test/mocks/silkBasket/silkBasketResponse.json';
import { of } from 'rxjs';
import { MinBlockHeightValidationOptions } from '~/types';
import {
  silkBasketParsed,
  silkBasketParsedWithStatus,
} from '~/test/mocks/silkBasket/silkBasketParsed';
import { batchSilkBasketOraclePricesResponse } from '~/test/mocks/silkBasket/batchSilkBasketOraclePricesResponse';
import { batchSilkBasketWithMissingOraclePricesResponse } from '~/test/mocks/silkBasket/batchSilkBasketWithMissingOraclePricesResponse';
import { silkBasketWithMissingPricesParsed } from '~/test/mocks/silkBasket/silkBasketWithMissingPricesParsed';
import { batchSilkBasketWithOracleErrorResponse } from '~/test/mocks/silkBasket/batchSilkBasketWithOracleErrorResponse';
import { silkBasketWithOracleErrorParsed } from '~/test/mocks/silkBasket/silkBasketWithOracleErrorParsed';
import { batchSilkBasketWithBasketErrorResponse } from '~/test/mocks/silkBasket/batchSilkBasketWithBasketErrorResponse';
import { SilkBasketBatchResponseItem } from '~/types/contracts/silkBasket/service';
import {
  parseSilkBasketAndPricesResponse,
  parseSilkBasketAndPricesResponseFromQueryRouter,
  querySilkBasket$,
  querySilkBasket,
} from './silkBasket';

const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/silkBasket', () => ({
    msgGetSilkBasket: vi.fn(() => 'MSG_GET_SILK_BASKET'),
  }));

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$,
  }));
});

afterEach(() => {
  vi.clearAllMocks();
});

test('it can parse the silk basket response', () => {
  const silkBasketAndPricesResponse = parseSilkBasketAndPricesResponse({
    silkBasketResponse,
    batchBasketPricesResponse: batchSilkBasketOraclePricesResponse[1],
    silkBasketResponseBlockHeight: 1,
    basketPricesResponseBlockHeight: 1,
  });
  expect(silkBasketAndPricesResponse).toStrictEqual(silkBasketParsedWithStatus);
});

test('it can parse the silk basket response via the query router', () => {
  expect(parseSilkBasketAndPricesResponseFromQueryRouter(
    batchSilkBasketOraclePricesResponse,
  )).toStrictEqual(silkBasketParsedWithStatus);
});

test('it can parse the silk basket response when prices are missing', () => {
  expect(parseSilkBasketAndPricesResponseFromQueryRouter(
    batchSilkBasketWithMissingOraclePricesResponse,
  )).toStrictEqual(silkBasketWithMissingPricesParsed);
});

test('it can parse the silk basket response when the price query has an error', () => {
  expect(parseSilkBasketAndPricesResponseFromQueryRouter(
    batchSilkBasketWithOracleErrorResponse,
  )).toStrictEqual(silkBasketWithOracleErrorParsed);
});

test('it can detect and throw error for silk basket info error', () => {
  expect(() => parseSilkBasketAndPricesResponseFromQueryRouter(
    batchSilkBasketWithBasketErrorResponse,
  )).toThrowError('BASKET_ERROR_MESSAGE');
});
test('it can call silk basket info service', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    oracleContractAddress: 'ORACLE_CONTRACT_ADDRESS',
    oracleCodeHash: 'ORACLE_CODE_HASH',
    silkBasketExpectedOracleKeys: ['KEY_1, KEY_2'],
    silkIndexOracleContractAddress: 'SILK_INDEX_ORACLE_CONTRACT_ADDRESS',
    silkIndexOracleCodeHash: 'SILK_INDEX_ORACLE_CODE_HASH',
    minBlockHeightValidationOptions: 'BLOCK_HEIGHT_VALIDATION_OPTIONS' as unknown as MinBlockHeightValidationOptions,
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(batchSilkBasketOraclePricesResponse));

  let output;
  querySilkBasket$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  const batchQueryInput = {
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: SilkBasketBatchResponseItem.BASKET,
      contract: {
        address: input.silkIndexOracleContractAddress,
        codeHash: input.silkIndexOracleCodeHash,
      },
      queryMsg: 'MSG_GET_SILK_BASKET',
    },
    {
      id: SilkBasketBatchResponseItem.PRICES,
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: {
        get_prices: {
          keys: input.silkBasketExpectedOracleKeys,
        },
      },
    },
    ],
    minBlockHeightValidationOptions: input.minBlockHeightValidationOptions,
  };
  expect(batchQuery$).toHaveBeenCalledWith(batchQueryInput);

  expect(output).toStrictEqual(silkBasketParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchSilkBasketOraclePricesResponse));
  const response = await querySilkBasket(input);
  expect(batchQuery$).toHaveBeenCalledWith(batchQueryInput);
  expect(response).toStrictEqual(silkBasketParsed);
});

test('it can handle missing prices with a query retry', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    oracleContractAddress: 'ORACLE_CONTRACT_ADDRESS',
    oracleCodeHash: 'ORACLE_CODE_HASH',
    silkBasketExpectedOracleKeys: ['KEY_1, KEY_2'],
    silkIndexOracleContractAddress: 'SILK_INDEX_ORACLE_CONTRACT_ADDRESS',
    silkIndexOracleCodeHash: 'SILK_INDEX_ORACLE_CODE_HASH',
    minBlockHeightValidationOptions: 'BLOCK_HEIGHT_VALIDATION_OPTIONS' as unknown as MinBlockHeightValidationOptions,
  };
  // observables function
  batchQuery$
    .mockReturnValueOnce(of(batchSilkBasketWithMissingOraclePricesResponse))
    .mockReturnValueOnce(of(batchSilkBasketOraclePricesResponse));

  let output;
  querySilkBasket$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  const firstPriceQueryKeys = ['KEY_1, KEY_2'];
  const retryPriceQueryKeys = ['CAD', 'USD', 'JPY', 'BTC', 'EUR', 'XAU'];

  const batchQueryInput1 = {
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [
      {
        id: SilkBasketBatchResponseItem.BASKET,
        contract: {
          address: input.silkIndexOracleContractAddress,
          codeHash: input.silkIndexOracleCodeHash,
        },
        queryMsg: 'MSG_GET_SILK_BASKET',
      },
      {
        id: SilkBasketBatchResponseItem.PRICES,
        contract: {
          address: input.oracleContractAddress,
          codeHash: input.oracleCodeHash,
        },
        queryMsg: {
          get_prices: {
            keys: firstPriceQueryKeys,
          },
        },
      },
    ],
    minBlockHeightValidationOptions: input.minBlockHeightValidationOptions,
  };

  const batchQueryInput2 = {
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [
      {
        id: SilkBasketBatchResponseItem.BASKET,
        contract: {
          address: input.silkIndexOracleContractAddress,
          codeHash: input.silkIndexOracleCodeHash,
        },
        queryMsg: 'MSG_GET_SILK_BASKET',
      },
      {
        id: SilkBasketBatchResponseItem.PRICES,
        contract: {
          address: input.oracleContractAddress,
          codeHash: input.oracleCodeHash,
        },
        queryMsg: {
          get_prices: {
            keys: retryPriceQueryKeys,
          },
        },
      },
    ],
    minBlockHeightValidationOptions: input.minBlockHeightValidationOptions,
  };

  expect(batchQuery$).toHaveBeenNthCalledWith(1, batchQueryInput1);
  expect(batchQuery$).toHaveBeenNthCalledWith(2, batchQueryInput2);

  expect(output).toStrictEqual(silkBasketParsed);
});

test('it can properly catch the silk basket error', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    oracleContractAddress: 'ORACLE_CONTRACT_ADDRESS',
    oracleCodeHash: 'ORACLE_CODE_HASH',
    silkBasketExpectedOracleKeys: ['KEY_1, KEY_2'],
    silkIndexOracleContractAddress: 'SILK_INDEX_ORACLE_CONTRACT_ADDRESS',
    silkIndexOracleCodeHash: 'SILK_INDEX_ORACLE_CODE_HASH',
    minBlockHeightValidationOptions: 'BLOCK_HEIGHT_VALIDATION_OPTIONS' as unknown as MinBlockHeightValidationOptions,
  };
  // observables function
  batchQuery$.mockReturnValueOnce(of(batchSilkBasketWithBasketErrorResponse));

  let error;
  querySilkBasket$(input).subscribe({
    error: (err) => {
      error = err.message;
    },
  });

  expect(error).toStrictEqual('BASKET_ERROR_MESSAGE');
});
