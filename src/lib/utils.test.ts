import {
  test,
  expect,
  vi,
} from 'vitest';
import {
  encodeJsonToB64,
  decodeB64ToJson,
  randomPadding,
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
  expect(randomPadding()).toBe('bbbbbbbbbbb');

  // checks upper bound
  vi.spyOn(global.Math, 'random').mockReturnValue(0.99999999);
  expect(randomPadding()).toBe('999999999999999');

  // checks lower bound
  vi.spyOn(global.Math, 'random').mockReturnValue(0);
  expect(randomPadding()).toBe('AAAAAAAA');
});
