import { BatchQueryParsedResponse } from '~/types';

const batchSnip20TransactionHistoryUnparsed:BatchQueryParsedResponse = [
  {
    id: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
    response: {
      transaction_history: {
        txs: [
          {
            id: 123456,
            action: {
              mint: {
                minter: 'MINTER_ADDRESS_1',
                recipient: 'RECIPIENT_ADDRESS_1',
              },
            },
            coins: {
              denom: 'SHD',
              amount: '100000000',
            },
            block_time: 1717603001,
            block_height: 14537355,
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
            coins: {
              denom: 'SHD',
              amount: '70',
            },
            block_time: 1717689401,
            block_height: 14537363,
          },
        ],
        total: 99,
      },
    },
    blockHeight: 3,
  },
];

export {
  batchSnip20TransactionHistoryUnparsed,
};
