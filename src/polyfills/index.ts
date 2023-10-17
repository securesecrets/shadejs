// eslint-disable-next-line import/no-extraneous-dependencies
import 'whatwg-fetch';

if (typeof window === 'undefined') {
  // @ts-ignore
  global.window = globalThis;
}
