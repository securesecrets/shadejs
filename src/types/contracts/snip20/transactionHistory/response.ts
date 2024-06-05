import {
  TransactionHistoryResponse as TransactionHistoryResponseSecretJS,
  TransferHistoryResponse as TransferHistoryResponseSecretJs,
} from 'secretjs/dist/extensions/snip20/types';

type ViewingKeyErrorResponse = {
  viewing_key_error: {
    msg: string
  }
}

type Snip20TransactionHistoryResponse = TransactionHistoryResponseSecretJS | ViewingKeyErrorResponse

type Snip20TransferHistoryResponse = TransferHistoryResponseSecretJs | ViewingKeyErrorResponse

export type {
  Snip20TransactionHistoryResponse,
  Snip20TransferHistoryResponse,
};
