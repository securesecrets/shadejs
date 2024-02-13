import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  parsePriceFromContract,
  parsePricesFromContract,
  parseBatchQueryIndividualPrices,
  queryPrice$,
  queryPrices$,
  queryPrice,
  queryPrices,
  batchQueryIndividualPrices,
  batchQueryIndividualPrices$,
} from '~/contracts/services/oracle';
import priceResponse from '~/test/mocks/oracle/priceResponse.json';
import pricesResponse from '~/test/mocks/oracle/pricesResponse.json';
import { batchPricesWithErrorParsed } from '~/test/mocks/batchQuery/batchPricesWithErrorParsed';
import { of } from 'rxjs';
import {
  priceParsed,
  pricesParsed,
} from '~/test/mocks/oracle/pricesParsed';
import { batchPricesWithErrorParsedResponse } from '~/test/mocks/oracle/batchPricesParsed';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());
const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/oracle', () => ({
    msgQueryOraclePrice: vi.fn(() => 'MSG_QUERY_ORACLE_PRICE'),
    msgQueryOraclePrices: vi.fn(() => 'MSG_QUERY_ORACLE_PRICES'),
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

afterAll(() => {
  vi.clearAllMocks();
});

test('it can parse the price response', () => {
  expect(parsePriceFromContract(
    priceResponse,
  )).toStrictEqual(priceParsed);
});

test('it can parse the prices response', () => {
  expect(parsePricesFromContract(
    pricesResponse,
  )).toStrictEqual(pricesParsed);
});

test('it can parse the batch individual prices response', () => {
  expect(parseBatchQueryIndividualPrices(
    batchPricesWithErrorParsed,
  )).toStrictEqual(batchPricesWithErrorParsedResponse);
});

test('it can send the query single price service', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    oracleKey: 'ORACLE_KEY',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(priceResponse));

  let output;
  queryPrice$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(priceParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(priceResponse));
  const response = await queryPrice(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'MSG_QUERY_ORACLE_PRICE',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(response).toStrictEqual(priceParsed);
});

test('it can send the query multiple prices service', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    oracleKeys: ['ORACLE_KEY'],
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(pricesResponse));

  let output;
  queryPrices$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'MSG_QUERY_ORACLE_PRICES',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual(pricesParsed);

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(pricesResponse));
  const response = await queryPrices(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'MSG_QUERY_ORACLE_PRICES',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

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
