import { TxAction } from 'secretjs/dist/extensions/snip20/txTypes';

type Snip20Tx = {
  id: number;
  action: TxAction;
  denom: string,
  amount: string,
  memo?: string;
  blockTime?: number;
  blockHeight?: number;
}

type TransactionHistory = {
  txs: Snip20Tx[],
  totalTransactions?: number,
  blockHeight: number,
}

export type {
  Snip20Tx,
  TransactionHistory,
};
