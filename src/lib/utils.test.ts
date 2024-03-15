import BigNumber from 'bignumber.js';
import {
  test,
  expect,
  vi,
} from 'vitest';
import {
  encodeJsonToB64,
  decodeB64ToJson,
  generatePadding,
  convertCoinFromUDenom,
  convertCoinToUDenom,
} from './utils';

test('It encodes a JSON into a base64 string', () => {
  const testJSON = {
    value1: 'teststring1',
    value2: 'teststring2',
  };
  expect(encodeJsonToB64(testJSON)).toBe('eyJ2YWx1ZTEiOiJ0ZXN0c3RyaW5nMSIsInZhbHVlMiI6InRlc3RzdHJpbmcyIn0=');
});

test('It decodes a base64 string into JSON', () => {
  const outputJSON = {
    value1: 'teststring1',
    value2: 'teststring2',
  };
  expect(decodeB64ToJson('eyJ2YWx1ZTEiOiJ0ZXN0c3RyaW5nMSIsInZhbHVlMiI6InRlc3RzdHJpbmcyIn0=')).toStrictEqual(outputJSON);
});

test('Generates random padding of length 8-15', () => {
  // checks midpoint
  vi.spyOn(global.Math, 'random').mockReturnValue(0.44351455);
  expect(generatePadding()).toBe('bbbbbbbbbbb');

  // checks upper bound
  vi.spyOn(global.Math, 'random').mockReturnValue(0.99999999);
  expect(generatePadding()).toBe('999999999999999');

  // checks lower bound
  vi.spyOn(global.Math, 'random').mockReturnValue(0);
  expect(generatePadding()).toBe('AAAAAAAA');
});

test('It converts token from U denom', () => {
  expect(convertCoinFromUDenom(1000, 2)).toStrictEqual(BigNumber(10));
  expect(convertCoinFromUDenom('1000', 2)).toStrictEqual(BigNumber(10));
  expect(convertCoinFromUDenom('1000000000000000000000000000', 2)).toStrictEqual(BigNumber('10000000000000000000000000'));
  expect(convertCoinFromUDenom(1e100, 2)).toStrictEqual(BigNumber(1e98));
  expect(convertCoinFromUDenom('1e100', 2)).toStrictEqual(BigNumber(1e98));
  expect(convertCoinFromUDenom('100000000000000000000005555.123456789123456789', 2)).toStrictEqual(BigNumber('1000000000000000000000055.551234567891234568'));
  expect(convertCoinFromUDenom(BigNumber('987654321987654321987654321'), 18)).toStrictEqual(BigNumber('987654321.987654321987654321'));
});

test('It converts token to U denom', () => {
  const testBigNumber1 = BigNumber(1000);
  expect(convertCoinToUDenom(testBigNumber1, 2)).toBe('100000');
  const testBigNumber2 = BigNumber('0.123456789123456789');
  expect(convertCoinToUDenom(testBigNumber2, 18)).toBe('123456789123456789');
  const testBigNumber3 = BigNumber('123456789123456789.123456789123456789');
  expect(convertCoinToUDenom(testBigNumber3, 18)).toBe('123456789123456789123456789123456789');
  expect(convertCoinToUDenom('1111.123456789101213141', 18)).toBe('1111123456789101213141');
});
