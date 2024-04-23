import {
  test,
  expect,
} from 'vitest';
import {
  msgGetVault,
  msgGetVaults,
  msgGetVaultUserPosition,
  msgGetVaultUserPositions,
  msgBorrow,
  msgWithdraw,
} from './vaultRegistry';

test('it tests the form of the vault info message', () => {
  const inputVaultId = '1';

  const output = {
    vault: {
      vault_id: inputVaultId,
    },
  };
  expect(msgGetVault(inputVaultId)).toStrictEqual(output);
});

test('it tests the form of the multiple vaults info message', () => {
  const inputStartingPageNumber = '1';

  const output = {
    vaults: {
      starting_page: inputStartingPageNumber,
    },
  };
  expect(msgGetVaults(inputStartingPageNumber)).toStrictEqual(output);
});

test('it tests the form of the vault user position message', () => {
  const inputVaultId = '1';
  const permit = {
    params: {
      data: 'PERMIT_DATA',
      contract: 'CONTRACT',
      key: 'KEY',
    },
    chain_id: 'CHAIN_ID',
    signature: {
      pub_key: {
        type: 'TYPE',
        value: 'VALUE',
      },
      signature: 'SIGNATURE',
    },
  };

  const output = {
    with_permit: {
      permit,
      query: {
        position: {
          vault_id: inputVaultId,
        },
      },
    },
  };
  expect(msgGetVaultUserPosition(permit, inputVaultId)).toStrictEqual(output);
});

test('it tests the form of the vaults user position message', () => {
  const inputVaultIds = ['1', '2'];
  const permit = {
    params: {
      data: 'PERMIT_DATA',
      contract: 'CONTRACT',
      key: 'KEY',
    },
    chain_id: 'CHAIN_ID',
    signature: {
      pub_key: {
        type: 'TYPE',
        value: 'VALUE',
      },
      signature: 'SIGNATURE',
    },
  };

  const output = {
    with_permit: {
      permit,
      query: {
        positions: {
          vault_ids: inputVaultIds,
        },
      },
    },
  };
  expect(msgGetVaultUserPositions(permit, inputVaultIds)).toStrictEqual(output);
});

test('it test the form of the borrow message', () => {
  const input = {
    borrowAmount: 'BORROW_AMOUNT',
    maxBorrowFee: 'BORROW_FEE',
    vaultId: 'VAULT_ID',
  };

  const output = {
    vault_action: {
      vault_id: input.vaultId,
      msg: {
        borrow: {
          amount: input.borrowAmount,
          max_fee: input.maxBorrowFee,
        },
      },
    },
  };
  expect(msgBorrow(input)).toStrictEqual(output);
});

test('it test the form of the withdraw message', () => {
  const input = {
    withdrawAmount: 'WITHDRAW_AMOUNT',
    vaultId: 'VAULT_ID',
  };

  const output = {
    vault_action: {
      vault_id: input.vaultId,
      msg: { withdraw: input.withdrawAmount },
    },
  };
  expect(msgWithdraw(input.withdrawAmount, input.vaultId)).toStrictEqual(output);
});
