import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  queryContract$,
} from '~/contracts/services/queryContract';
import { of } from 'rxjs';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

afterAll(() => {
  vi.clearAllMocks();
});

test('it can send the query to contract', async () => {
  const input = {
    contractAddress: 'CONTRACT_ADDRESS',
    codeHash: 'CODE_HASH',
    queryMsg: 'QUERY',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  // observables function
  sendSecretClientContractQuery$.mockReturnValueOnce(of('QUERY_RESPONSE'));

  let output;
  queryContract$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'QUERY',
    client: 'CLIENT',
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
  });

  expect(output).toStrictEqual('QUERY_RESPONSE');

});
