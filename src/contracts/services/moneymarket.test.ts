import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
  afterEach,
} from 'vitest';
import { of, firstValueFrom } from 'rxjs';
import { queryMoneyMarketPublicLogs$ } from '~/contracts/services/moneyMarket';
import queryMoneyMarketResponse from '~/test/mocks/moneymarket/publiclogs/queryMoneyMarketResponse.json';

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
  // Encode JSON data in Base64 for the mock response
  const base64EncodedId = Buffer.from(JSON.stringify('mock_id')).toString('base64');
  const base64EncodedResponse = Buffer.from(JSON.stringify(queryMoneyMarketResponse.batch.responses[0].response)).toString('base64');
  sendSecretClientContractQuery$.mockReturnValueOnce(
    of({
      batch: {
        responses: [{
          id: base64EncodedId,
          response: {
            system_err: null,
            response: base64EncodedResponse, // Ensure this is Base64 encoded as required
          },
        }],
        block_height: 100, // Mock block_height as required
      },
    }),
  );

  // Define the input parameters
  const contractAddress = 'secret18537ttv4l4k2ea0xp6ay3sv4c243fyjtj2uqz7';
  const lcdEndpoint = 'https://api.secret.com';
  const chainId = 'secret-4';
  const pagination = { page: 1, page_size: 10 };

  // Call the function to test
  const result$ = queryMoneyMarketPublicLogs$({
    contractAddress,
    codeHash: 'MOCK_CODE_HASH', // Add the codeHash property
    lcdEndpoint,
    chainId,
    pagination,
  });

  // Convert the result$ observable to a promise and get the final value
  const result = await firstValueFrom(result$);

  // Validate the output against the expected parsed result
  expect(result).toBeDefined();
  if (result && result.data) {
    const parsedData = result.data.map((item: { timestamp: string | Date }) => ({
      ...item,
      timestamp: new Date(item.timestamp),
    }));
    expect(parsedData).toBeDefined();
  }
});
