import {
  parseTokenInfo,
  parseBalance,
  querySnip20TokenInfo$,
  querySnip20TokenInfo,
  querySnip20Balance$,
  querySnip20Balance,
  parseBatchQueryTokensInfo,
  batchQuerySnip20TokensInfo,
  batchQuerySnip20TokensInfo$,
} from '~/contracts/services/snip20';
import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import tokenInfoResponse from '~/test/mocks/snip20/tokenInfoResponse.json';
import { tokenInfoParsed } from '~/test/mocks/snip20/tokenInfoParsed';
import { batchTokensInfoParsed } from '~/test/mocks/snip20/batchQueryTokensInfoParsed';
import { batchTokensInfoUnparsed } from '~/test/mocks/snip20/batchQueryTokensInfoUnparsed';
import { of } from 'rxjs';
import balanceResponse from '~/test/mocks/snip20/balanceResponse.json';

const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());
const batchQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/contracts/definitions/snip20', () => ({
    snip20: {
      queries: {
        tokenInfo: vi.fn(() => 'TOKEN_INFO_MSG'),
        getBalance: vi.fn(() => 'GET_BALANCE_MSG'),
      },
    },
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));

  vi.mock('~/contracts/services/batchQuery', () => ({
    batchQuery$,
  }));
});

test('it can parse the response snip20 balance query', () => {
  expect(parseBalance(
    balanceResponse,
  )).toStrictEqual('123');
});

test('it can parse the response snip20 token info query', () => {
  expect(parseTokenInfo(
    tokenInfoResponse,
  )).toStrictEqual(tokenInfoParsed);
});

test('it can parse the batch snip20 token info query', () => {
  expect(parseBatchQueryTokensInfo(
    batchTokensInfoUnparsed,
  )).toStrictEqual(batchTokensInfoParsed);
});

test('it can call the snip20 token info query', async () => {
  const input = {
    snip20ContractAddress: 'CONTRACT_ADDRESS',
    snip20CodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  // observable function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(tokenInfoResponse));
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

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(tokenInfoResponse));
  const response = await querySnip20TokenInfo(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'TOKEN_INFO_MSG',
    client: 'CLIENT',
    contractAddress: input.snip20ContractAddress,
    codeHash: input.snip20CodeHash,
  });

  expect(response).toStrictEqual(tokenInfoParsed);
});

test('it can call the batch snip20 token info query', async () => {
  const input = {
    queryRouterContractAddress: 'CONTRACT_ADDRESS',
    queryRouterCodeHash: 'CODE_HASH',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
    tokenContracts: [{
      address: 'PAIR_ADDRESS',
      codeHash: 'PAIR_CODE_HASH',
    }],
  };

  // observables function
  batchQuery$.mockReturnValueOnce(of(batchTokensInfoUnparsed));
  let output;
  batchQuerySnip20TokensInfo$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.tokenContracts[0].address,
      contract: {
        address: input.tokenContracts[0].address,
        codeHash: input.tokenContracts[0].codeHash,
      },
      queryMsg: 'TOKEN_INFO_MSG',
    }],
  });

  expect(output).toStrictEqual(batchTokensInfoParsed);

  // async/await function
  batchQuery$.mockReturnValueOnce(of(batchTokensInfoUnparsed));
  const response = await batchQuerySnip20TokensInfo(input);
  expect(batchQuery$).toHaveBeenCalledWith({
    contractAddress: input.queryRouterContractAddress,
    codeHash: input.queryRouterCodeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
    queries: [{
      id: input.tokenContracts[0].address,
      contract: {
        address: input.tokenContracts[0].address,
        codeHash: input.tokenContracts[0].codeHash,
      },
      queryMsg: 'TOKEN_INFO_MSG',
    }],
  });
  expect(response).toStrictEqual(batchTokensInfoParsed);
});

test('it can call the snip20 balance query', async () => {
  const input = {
    snip20ContractAddress: 'CONTRACT_ADDRESS',
    snip20CodeHash: 'CODE_HASH',
    userAddress: 'USER_ADDRESS',
    viewingKey: 'VIEWING_KEY',
    lcdEndpoint: 'LCD_ENDPOINT',
    chainId: 'CHAIN_ID',
  };

  // observable function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(balanceResponse));
  let output;
  querySnip20Balance$(input).subscribe({
    next: (response) => {
      output = response;
    },
  });

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'GET_BALANCE_MSG',
    client: 'CLIENT',
    contractAddress: input.snip20ContractAddress,
    codeHash: input.snip20CodeHash,
  });

  expect(output).toStrictEqual('123');

  // async/await function
  sendSecretClientContractQuery$.mockReturnValueOnce(of(balanceResponse));
  const response = await querySnip20Balance(input);

  expect(sendSecretClientContractQuery$).toHaveBeenCalledWith({
    queryMsg: 'GET_BALANCE_MSG',
    client: 'CLIENT',
    contractAddress: input.snip20ContractAddress,
    codeHash: input.snip20CodeHash,
  });

  expect(response).toStrictEqual('123');
});
