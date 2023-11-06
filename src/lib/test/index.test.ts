import {
  isBigNumberWithinMarginOfError,
} from '~/lib/test';
import { expect, test } from 'vitest';
import BigNumber from 'bignumber.js';

test('it tests that BigNumber margin of error calculations', () => {
  expect(isBigNumberWithinMarginOfError(
    BigNumber('101.123456789'),
    BigNumber('101.123456789123456789'),
    BigNumber('0.00000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('101.123456789'),
    BigNumber('101.123456789123456789'),
    BigNumber('0.000000000001'),
  )).toBeFalsy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('-101.123456789'),
    BigNumber('-101.123456789123456789'),
    BigNumber('0.00000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('-101.123456789'),
    BigNumber('-101.123456789123456789'),
    BigNumber('0.000000000001'),
  )).toBeFalsy();
});
