import {
  test,
  expect,
} from 'vitest';
import {
  queryOraclePrice,
  queryOraclePrices,
} from '~/contracts/definitions/oracle';

test('it test the form of the query oracle msg', () => {
  const output = {
    get_price: {
      key: 'MOCK_KEY',
    },
  };
  expect(queryOraclePrice('MOCK_KEY')).toStrictEqual(output);
});

test('it test the form of the query oracle msg', () => {
  const output = {
    get_prices: {
      keys: ['MOCK_KEY_1', 'MOCK_KEY_2'],
    },
  };
  expect(queryOraclePrices(['MOCK_KEY_1', 'MOCK_KEY_2'])).toStrictEqual(output);
});
