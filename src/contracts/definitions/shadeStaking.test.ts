import {
  test,
  expect,
} from 'vitest';
import { msgQueryShadeStakingOpportunity } from './shadeStaking';

test('it tests the form of the query staking info msg', () => {
  const output = { staking_info: {} };
  expect(msgQueryShadeStakingOpportunity()).toStrictEqual(output);
});
