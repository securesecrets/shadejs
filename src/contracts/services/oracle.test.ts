import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  parsePriceFromContract,
  parseBatchPrices,
  queryPrice$,
  queryPrices$,
  queryPrice,
  queryPrices,
  batchQueryIndividualPrices,
  batchQueryIndividualPrices$,
  parseBatchPrice,
  parseBatchQueryIndividualPrices,
} from '~/contracts/services/oracle';
import priceResponse from '~/test/mocks/oracle/priceResponse.json';
import { batchPricesWithErrorParsed } from '~/test/mocks/batchQuery/batchPricesWithErrorParsed';
import { of } from 'rxjs';
import {
  priceParsed,
  pricesParsed,
} from '~/test/mocks/oracle/pricesParsed';
import {
  batchPricesWithErrorParsedResponse,
  batchPricesParsedResponse,
} from '~/test/mocks/oracle/batchPrices';
import { batchPrice } from '~/test/mocks/oracle/batchPrice';

const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/oracle', () => ({
    msgQueryOraclePrice: vi.fn(() => 'MSG_QUERY_ORACLE_PRICE'),
    msgQueryOraclePrices: vi.fn(() => 'MSG_QUERY_ORACLE_PRICES'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$,
  }));
});

afterAll(() => {
  vi.clearAllMocks();
});

test('it can parse the price contract response', () => {
  expect(parsePriceFromContract(
    priceResponse,
    123456789,
  )).toStrictEqual(priceParsed);
});

test('it can parse the batch single price response', () => {
  expect(parseBatchPrice(
    batchPrice,
  )).toStrictEqual(priceParsed);
});

test('it can parse the batch individual prices response', () => {
  expect(parseBatchQueryIndividualPrices(
    batchPricesWithErrorParsed,
  )).toStrictEqual(batchPricesWithErrorParsedResponse);

  expect(parseBatchPrices(
    batchPricesParsedResponse,
  )).toStrictEqual(pricesParsed);
});

test('it can send the query single price service', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    oracleContractAddress: 'ORACLE_CONTRACT_ADDRESS',
    oracleCodeHash: 'ORACLE_CODE_HASH',
    oracleKey: 'ORACLE_KEY',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    minBlockHeightValidationOptions: {
      minBlockHeight: 1,
      maxRetries: 2,
    },
  };

  // observables function
  batchQuery$.mockReturnValueOnce(of(batchPrice));

  let output;
  queryPrice$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  const batchQueryParams = {
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: 1,
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    }],
    minBlockHeightValidationOptions: input.minBlockHeightValidationOptions,
  };
  expect(batchQuery$).toHaveBeenCalledWith(batchQueryParams);
  expect(output).toStrictEqual(priceParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchPrice));
  const response = await queryPrice(input);

  expect(batchQuery$).toHaveBeenCalledWith(batchQueryParams);
  expect(response).toStrictEqual(priceParsed);
});

test('it can send the query multiple prices service', async () => {
  const input = {
    queryRouterContractAddress: 'QUERY_ROUTER_CONTRACT_ADDRESS',
    queryRouterCodeHash: 'QUERY_ROUTER_CODE_HASH',
    oracleContractAddress: 'ORACLE_CONTRACT_ADDRESS',
    oracleCodeHash: 'ORACLE_CODE_HASH',
    oracleKeys: ['ORACLE_KEY_1, ORACLE_KEY_2'],
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    minBlockHeightValidationOptions: {
      minBlockHeight: 1,
      maxRetries: 2,
    },
  };

  // observables function
  batchQuery$.mockReturnValueOnce(of(batchPricesParsedResponse));

  let output;
  queryPrices$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  const batchQueryParams = {
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: 1,
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: 'MSG_QUERY_ORACLE_PRICES',
    }],
    minBlockHeightValidationOptions: input.minBlockHeightValidationOptions,
  };

  expect(batchQuery$).toHaveBeenCalledWith(batchQueryParams);
  expect(output).toStrictEqual(pricesParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchPricesParsedResponse));
  const response = await queryPrices(input);

  expect(batchQuery$).toHaveBeenCalledWith(batchQueryParams);
  expect(response).toStrictEqual(pricesParsed);
});

test('it can send the batch query of multiple individual prices', async () => {
  const input = {
    queryRouterContractAddress: 'CONTRACT_ADDRESS',
    queryRouterCodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    oracleContractAddress: 'ORACLE_CONTRACT_ADDRESS',
    oracleCodeHash: 'ORACLE_CODE_HASH',
    oracleKeys: ['BTC', 'Quicksilver ATOM'],
  };

  // observables function
  batchQuery$.mockReturnValueOnce(of(batchPricesWithErrorParsed));
  let output;
  batchQueryIndividualPrices$(input).subscribe({
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
      id: input.oracleKeys[0],
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    },
    {
      id: input.oracleKeys[1],
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    }],
  });

  expect(output).toStrictEqual(batchPricesWithErrorParsedResponse);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchPricesWithErrorParsed));
  const response = await batchQueryIndividualPrices(input);
  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.oracleKeys[0],
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    },
    {
      id: input.oracleKeys[1],
      contract: {
        address: input.oracleContractAddress,
        codeHash: input.oracleCodeHash,
      },
      queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    }],
  });

  expect(response).toStrictEqual(batchPricesWithErrorParsedResponse);
});
