import { TransactionHistory } from '~/types';

const transferHistoryParsed: TransactionHistory = {
  txs: [{
    id: 1234567,
    action: {
      transfer: {
        from: 'FROM_ADDRESS',
        sender: 'SENDER_ADDRESS',
        recipient: 'RECEIVER_ADDRESS',
      },
    },
    denom: 'SSCRT',
    amount: '10000',
    memo: undefined,
    blockTime: undefined,
    blockHeight: undefined,
  },
  {
    id: 21345678,
    action: {
      transfer: {
        from: 'FROM_ADDRESS',
        sender: 'SENDER_ADDRESS',
        recipient: 'RECEIVER_ADDRESS',
      },
    },
    denom: 'SSCRT',
    amount: '100000',
    memo: undefined,
    blockTime: undefined,
    blockHeight: undefined,
  }],
  totalTransactions: undefined,
  blockHeight: 3,
};

export {
  transferHistoryParsed,
};
