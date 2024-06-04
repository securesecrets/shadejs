import { TransactionHistoryResponse as TransactionHistoryResponseSecretJS } from 'secretjs/dist/extensions/snip20/types';

type ViewingKeyErrorResponse = {
  viewing_key_error: {
    msg: string
  }
}

type Snip20TransactionHistoryResponse = TransactionHistoryResponseSecretJS | ViewingKeyErrorResponse

export type {
  Snip20TransactionHistoryResponse,
};
