import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest';
import { of } from 'rxjs';
import { queryMoneyMarketPublicEvents$ } from '~/contracts/services/moneyMarket';
import { queryMoneyMarketPublicEventsParsedMock } from '../../test/mocks/moneymarket/publiclogs/queryMoneyMarketParsed';
import queryMoneyMarketResponse from '../../test/mocks/moneymarket/publiclogs/queryMoneyMarketResponse.json';

// Mock the sendSecretClientContractQuery$ function
const sendSecretClientContractQuery$ = vi.hoisted(() => vi.fn());

beforeAll(() => {
  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of({ client: 'MOCK_CLIENT' })),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$,
  }));
});

afterAll(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.clearAllMocks();
});

test('it should parse the public events response correctly', async () => {
  // Mock the service call with the modified JSON response data
  sendSecretClientContractQuery$.mockReturnValueOnce(
    of(queryMoneyMarketResponse.batch.responses[0].response),
  );

  // Define the input parameters
  const contractAddress = 'secret18537ttv4l4k2ea0xp6ay3sv4c243fyjtj2uqz7';
  const lcdEndpoint = 'https://api.secret.com';
  const chainId = 'secret-4';
  const pagination = { page: 1, page_size: 10 };

  // Call the function to test
  const result$ = queryMoneyMarketPublicEvents$({
    contractAddress,
    lcdEndpoint,
    chainId,
    pagination,
  });

  // Convert the result$ observable to a promise and get the final value
  const result = await result$.toPromise();

  // Validate the output against the expected parsed result
  expect(result).toStrictEqual(queryMoneyMarketPublicEventsParsedMock);
});
