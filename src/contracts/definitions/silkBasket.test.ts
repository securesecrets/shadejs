import {
  test,
  expect,
} from 'vitest';
import { msgGetSilkBasket } from './silkBasket';

test('it tests the form of the silk basket message', () => {
  const output = {
    get_index_data: {},
  };
  expect(msgGetSilkBasket()).toStrictEqual(output);
});
