import { test, expect, vi, beforeAll, afterAll, } from 'vitest';
import { parsePriceFromContract, parsePricesFromContract, } from '~/contracts/services/oracle';
import priceResponse from '~/test/mocks/oracle/priceResponse.json';
import pricesResponse from '~/test/mocks/oracle/pricesResponse.json';
import BigNumber from 'bignumber.js';
import { of } from 'rxjs';
beforeAll(() => {
    vi.mock('~/contracts/definitions/oracle', () => ({
        msgQueryOraclePrice: vi.fn(() => 'MSG_QUERY_ORACLE_PRICE'),
        msgQueryOraclePrices: vi.fn(() => 'MSG_QUERY_ORACLE_PRICES'),
    }));
    vi.mock('~/client/index', () => ({
        getActiveQueryClient$: vi.fn(() => of('CLIENT')),
    }));
    vi.mock('~/client/services/clientServices', () => ({
        sendSecretClientContractQuery$: vi.fn(() => of()),
    }));
    vi.mock('~/client/services/clientServices', () => ({
        sendSecretClientContractQuery$: vi.fn(() => of()),
    }));
});
afterAll(() => {
    vi.clearAllMocks();
});
test('it can parse the price response', () => {
    expect(parsePriceFromContract(priceResponse)).toStrictEqual({
        oracleKey: 'BTC',
        rate: BigNumber('27917.2071556'),
        lastUpdatedBase: 1696644063,
        lastUpdatedQuote: 18446744073709552000,
    });
});
test('it can parse the prices response', () => {
    const parsedOutput = {
        BTC: {
            oracleKey: 'BTC',
            rate: BigNumber('27917.2071556'),
            lastUpdatedBase: 1696644063,
            lastUpdatedQuote: 18446744073709552000,
        },
        ETH: {
            oracleKey: 'ETH',
            rate: BigNumber('1644.0836829'),
            lastUpdatedBase: 1696644063,
            lastUpdatedQuote: 18446744073709552000,
        },
    };
    expect(parsePricesFromContract(pricesResponse)).toStrictEqual(parsedOutput);
});
