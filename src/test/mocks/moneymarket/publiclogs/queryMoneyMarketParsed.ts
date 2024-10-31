import { PaginatedPublicEvent } from '~/types/contracts/moneyMarket';

const queryMoneyMarketPublicEventsParsedMock: PaginatedPublicEvent = {
  page: 0,
  pageSize: 10,
  totalPages: 1,
  totalItems: 2,
  data: [
    {
      timestamp: new Date(Date.now()),
      action: {
        contract_init: {
        },
      },
    },
    {
      timestamp: new Date(Date.now()),
      action: {
        contract_init: {
        },
      },
    },
  ],
};

export { queryMoneyMarketPublicEventsParsedMock };
