import { TransactionHistory } from '~/types';

const transactionHistoryParsed: TransactionHistory = {
  txs: [{
    id: 123456,
    action: {
      mint: {
        minter: 'MINTER_ADDRESS_1',
        recipient: 'RECIPIENT_ADDRESS_1',
      },
    },
    denom: 'SHD',
    amount: '100000000',
    memo: undefined,
    blockTime: 1717603001,
    blockHeight: 14537355,
  },
  {
    id: 789456,
    action: {
      transfer: {
        from: 'FROM_ADDRESS',
        sender: 'SENDER_ADDRESS',
        recipient: 'RECIPIENT_ADDRESS',
      },
    },
    denom: 'SHD',
    amount: '70',
    memo: undefined,
    blockTime: 1717689401,
    blockHeight: 14537363,
  }],
  tokenAddress: 'MOCK_ADDRESS',
  totalTransactions: 99,
  blockHeight: 3,
};

export {
  transactionHistoryParsed,
};
