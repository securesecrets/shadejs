import { PaginatedPublicLogs } from '~/types/contracts/moneyMarket';

const queryMoneyMarketPublicLogsParsedMock: PaginatedPublicLogs = {
  page: 0,
  pageSize: 10,
  totalPages: 1,
  totalItems: 2,
  data: [
    {
      timestamp: new Date('2024-10-31T18:18:55.500Z'),
      action: {
        contract_init: {
        },
      },
    },
    {
      timestamp: new Date('2024-10-31T18:18:55.500Z'),
      action: {
        contract_init: {
        },
      },
    },
  ],
};

export { queryMoneyMarketPublicLogsParsedMock };
