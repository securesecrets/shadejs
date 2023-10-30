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
  queryPrice$,
  queryPrices$,
} from '~/contracts/services/oracle';
import priceResponse from '~/test/mocks/oracle/priceResponse.json';
import pricesResponse from '~/test/mocks/oracle/pricesResponse.json';
import { of } from 'rxjs';
import {
  priceParsed,
  pricesParsed,
} from '~/test/mocks/oracle/pricesParsed';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

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

test('it can send the query single price service', () => {
  sendSecretClientContractQuery$.mockReturnValue(of(priceResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    oracleKey: 'ORACLE_KEY',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };
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
});

test('it can send the query multiple prices service', () => {
  sendSecretClientContractQuery$.mockReturnValue(of(pricesResponse));

  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    oracleKeys: ['ORACLE_KEY'],
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };
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
});
