import { PaginatedPublicEvent } from '~/types/contracts/moneyMarket';

const queryMoneyMarketPublicEventsParsedMock: PaginatedPublicEvent = {
  page: 0,
  pageSize: 10,
  totalPages: 1,
  totalItems: 2,
  data: [
    {
      timestamp: 1693800000000,
      action: {
        contract_init: {
        },
      },
    },
    {
      timestamp: 1693805000000,
      action: {
        contract_init: {
        },
      },
    },
  ],
};

export { queryMoneyMarketPublicEventsParsedMock };
