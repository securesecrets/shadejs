import { test, expect } from 'vitest';
import { snip20 } from '~/contracts/definitions/snip20';

test('it checks the shape of the snip20 send', () => {
  const params = {
    recipient: 'MOCK_RECIPIENT',
    amount: 'MOCK_AMOUNT',
    handleMsg: { msg: 'MOCK_MESSAGE' },
    padding: 'MOCK_PADDING',
  };

  const output = {
    msg: {
      send: {
        recipient: params.recipient,
        recipient_code_hash: undefined,
        amount: params.amount,
        msg: 'eyJtc2ciOiJNT0NLX01FU1NBR0UifQ==',
        padding: params.padding,
      },
    },
  };
  expect(snip20.messages.send(params)).toStrictEqual(output);

  const params2 = {
    recipient: 'MOCK_RECIPIENT',
    recipientCodeHash: 'MOCK_RECIPIENT_CODE_HASH',
    amount: 'MOCK_AMOUNT',
    handleMsg: { msg: 'MOCK_MESSAGE' },
    padding: 'MOCK_PADDING',
  };

  const output2 = {
    msg: {
      send: {
        recipient: params2.recipient,
        recipient_code_hash: params2.recipientCodeHash,
        amount: params2.amount,
        msg: 'eyJtc2ciOiJNT0NLX01FU1NBR0UifQ==',
        padding: params2.padding,
      },
    },
  };

  expect(snip20.messages.send(params2)).toStrictEqual(output2);
});

test('it checks the shape of the snip20 transfer', () => {
  const params = {
    recipient: 'MOCK_RECIPIENT',
    amount: 'MOCK_AMOUNT',
    padding: 'MOCK_PADDING',
  };

  const output = {
    msg: {
      transfer: {
        recipient: params.recipient,
        amount: params.amount,
        padding: params.padding,
      },
    },
  };

  expect(snip20.messages.transfer(params)).toStrictEqual(output);
});

test('it checks the shape of the snip20 deposit', () => {
  const inputAmount = 'MOCK_AMOUNT';
  const inputDenom = 'MOCK_DENOM';

  const msg = { deposit: { } };
  const transferAmount = { amount: inputAmount, denom: inputDenom };

  const output = {
    msg,
    transferAmount,
  };
  expect(snip20.messages.deposit(
    inputAmount,
    inputDenom,
  )).toStrictEqual(output);
});

test('it checks the shape of the snip20 redeem', () => {
  const inputAmount = 'MOCK_AMOUNT';
  const inputDenom = 'MOCK_DENOM';
  const mockPadding = 'MOCK_PADDING';

  const output = {
    msg: {
      redeem: {
        amount: inputAmount,
        denom: inputDenom,
        padding: mockPadding,
      },
    },
  };
  expect(snip20.messages.redeem({
    amount: inputAmount,
    denom: inputDenom,
    padding: mockPadding,
  })).toStrictEqual(output);
});

test('it checks the shape of the snip20 token info query', () => {
  const output = {
    token_info: {},
  };
  expect(snip20.queries.tokenInfo()).toStrictEqual(output);
});

test('it checks the shape of the snip20 increase allowance', () => {
  const inputSpender = 'MOCK_SPENDER';
  const inputAmount = 'MOCK_AMOUNT';
  const inputExpiration = 10;
  const mockPadding = 'MOCK_PADDING';

  const output = {
    msg: {
      increase_allowance: {
        spender: inputSpender,
        amount: inputAmount,
        expiration: inputExpiration,
        padding: mockPadding,
      },
    },
  };
  expect(snip20.messages.increaseAllowance({
    spender: inputSpender,
    amount: inputAmount,
    expiration: inputExpiration,
    padding: mockPadding,
  })).toStrictEqual(output);
});

test('it checks the shape of the snip20 viewing', () => {
  const viewingKey = 'MOCK_VIEWING_KEY';
  const padding = 'PADDING';

  const output = {
    msg: {
      set_viewing_key: {
        key: viewingKey,
        padding,
      },
    },
  };
  expect(snip20.messages.createViewingKey(viewingKey, padding)).toStrictEqual(output);
});
