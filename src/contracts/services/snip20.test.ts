import {
  parseTokenInfo,
  querySnip20TokenInfo$,
} from '~/contracts/services/snip20';
import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import tokenInfoResponse from '~/test/mocks/snip20/tokenInfoResponse.json';
import { tokenInfoParsed } from '~/test/mocks/snip20/tokenInfoParsed';
import { of } from 'rxjs';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/snip20', () => ({
    snip20: {
      queries: {
        tokenInfo: vi.fn(() => 'TOKEN_INFO_MSG'),
      },
    },
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

test('it can parse the response snip20 token info query', () => {
  expect(parseTokenInfo(
    tokenInfoResponse,
  )).toStrictEqual(tokenInfoParsed);
});

test('it can call the snip20 token info query', () => {
  sendSecretClientContractQuery$.mockReturnValue(of(tokenInfoResponse));

  const input = {
    snip20ContractAddress: 'CONTRACT_ADDRESS',
    snip20CodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  let output;
  querySnip20TokenInfo$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'TOKEN_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.snip20ContractAddress,
    codeHash: input.snip20CodeHash,
  });

  expect(output).toStrictEqual(tokenInfoParsed);
});
