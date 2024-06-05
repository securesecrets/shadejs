import { BatchQueryParsedResponse } from '~/types';

const batchSnip20TransferHistoryUnparsed:BatchQueryParsedResponse = [
  {
    id: 'secret1k0jntykt7e4g3y88ltc60czgjuqdy4c9e8fzek',
    response: {
      transfer_history: {
        txs: [
          {
            id: 1234567,
            from: 'FROM_ADDRESS',
            sender: 'SENDER_ADDRESS',
            receiver: 'RECEIVER_ADDRESS',
            coins: {
              denom: 'SSCRT',
              amount: '10000',
            },
          },
          {
            id: 21345678,
            from: 'FROM_ADDRESS',
            sender: 'SENDER_ADDRESS',
            receiver: 'RECEIVER_ADDRESS',
            coins: {
              denom: 'SSCRT',
              amount: '100000',
            },
          },
        ],
      },
    },
    blockHeight: 3,
  },
];

export {
  batchSnip20TransferHistoryUnparsed,
};
