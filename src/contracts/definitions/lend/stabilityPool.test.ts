import {
  test,
  expect,
} from 'vitest';
import { msgGetStabilityPoolInfo } from './stabilityPool';

test('it tests the form of the stability pool info message', () => {
  const output = {
    get_pool_info: {},
  };
  expect(msgGetStabilityPoolInfo()).toStrictEqual(output);
});
