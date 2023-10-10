import { test, expect, } from 'vitest';
import { msgQueryOraclePrice, msgQueryOraclePrices, } from '~/contracts/definitions/oracle';
test('it test the form of the query oracle msg', () => {
    const output = {
        get_price: {
            key: 'MOCK_KEY',
        },
    };
    expect(msgQueryOraclePrice('MOCK_KEY')).toStrictEqual(output);
});
test('it test the form of the query oracle msg', () => {
    const output = {
        get_prices: {
            keys: ['MOCK_KEY_1', 'MOCK_KEY_2'],
        },
    };
    expect(msgQueryOraclePrices(['MOCK_KEY_1', 'MOCK_KEY_2'])).toStrictEqual(output);
});
