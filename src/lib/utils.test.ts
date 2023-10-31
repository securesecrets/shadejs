import {
  test,
  expect,
} from 'vitest';
import {
  encodeJsonToB64,
  decodeB64ToJson,
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
