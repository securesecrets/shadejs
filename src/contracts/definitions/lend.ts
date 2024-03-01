import { AccountPermit } from '~/types/permit';

/**
 * message for the getting the vault info
 */
const msgGetVault = (vaultId: string) => ({
  vault: {
    vault_id: vaultId,
  },
});

/**
 * message for the getting multiple vaults info.
 * @param startingPage The data is paginated and returned
 * for the starting page and all pages after. Use 1 to query all vaults.
 */
const msgGetVaults = (startingPage: number) => ({
  vaults: {
    starting_page: startingPage.toString(),
  },
});

/**
 * message for the getting a user position
 */
const msgGetVaultUserPosition = (permit: AccountPermit, vaultId: string) => ({
  with_permit: {
    permit,
    query: {
      position: {
        vault_id: vaultId,
      },
    },
  },
});

/**
 * message for getting multiple user positions
 */
const msgGetVaultUserPositions = (permit: AccountPermit, vaultIds: string[]) => ({
  with_permit: {
    permit,
    query: {
      positions: {
        vault_ids: vaultIds,
      },
    },
  },
});

/**
 * message to borrow silk from a lend vault
 */
const msgBorrow = ({
  borrowAmount,
  maxBorrowFee,
  vaultId,
}: {
  borrowAmount: string,
  maxBorrowFee: string,
  vaultId: string,
}) => ({
  vault_action: {
    vault_id: vaultId,
    msg: {
      borrow: {
        amount: borrowAmount,
        max_fee: maxBorrowFee,
      },
    },
  },
});

/**
 * message to withdraw collateral from a lend vault
 */
const msgWithdraw = (
  withdrawAmount: string,
  vaultId: string,
) => ({
  vault_action: {
    vault_id: vaultId,
    msg: {
      withdraw: withdrawAmount,
    },
  },
});

export {
  msgGetVault,
  msgGetVaults,
  msgGetVaultUserPosition,
  msgGetVaultUserPositions,
  msgBorrow,
  msgWithdraw,
};
