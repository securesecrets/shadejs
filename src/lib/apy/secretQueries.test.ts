import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import {
  secretChainQuery$,
  secretChainQuery,
  secretChainQueries$,
  secretChainQueries,
  parseSecretQueryResponse,
  SecretQueryOptions,
} from './secretQueries';

beforeAll(async () => {
  vi.mock('~/client/services/createFetch', () => ({
    createFetch: vi.fn(() => of({ response: 'MOCK_API_RESPONSE' })),
  }));
});

test('it can parse chain queries', () => {
  expect(parseSecretQueryResponse(
    { inflation: 10 },
    SecretQueryOptions.INFLATION,
  )).toStrictEqual({ secretInflationPercent: 10 });

  expect(parseSecretQueryResponse(
    { pool: { bonded_tokens: 10 } },
    SecretQueryOptions.TOTAL_STAKED,
  )).toStrictEqual({ secretTotalStakedRaw: 10 });

  expect(parseSecretQueryResponse(
    { params: { community_tax: '10', secret_foundation_tax: '11' } },
    SecretQueryOptions.TAXES,
  )).toStrictEqual({ secretTaxes: { foundationTaxPercent: 11, communityTaxPercent: 10 } });

  expect(parseSecretQueryResponse(
    { validators: [{ commission: { commission_rates: { rate: '10' } }, operator_address: 'MOCK_ADDRESS' }] },
    SecretQueryOptions.VALIDATORS,
  )).toStrictEqual({ secretValidators: [{ ratePercent: 10, validatorAddress: 'MOCK_ADDRESS' }] });

  expect(parseSecretQueryResponse(
    'nonsence',
    '/nonsence/api',
  )).toStrictEqual('nonsence');
});

test('it can do a single chain query', async () => {
  let output;
  secretChainQuery$('MOCK_URL', 'MOCK_ENDPOINT').subscribe({
    next: (response) => {
      output = response;
    },
  });
  expect(output).toStrictEqual({ response: 'MOCK_API_RESPONSE' });
  const output2 = await secretChainQuery('MOCK_URL', 'MOCK_ENDPOINT');
  expect(output2).toStrictEqual({ response: 'MOCK_API_RESPONSE' });
});

test('it can do many chain queries', async () => {
  let output;
  secretChainQueries$('MOCK_URL', ['MOCK_ENDPOINT']).subscribe({
    next: (response) => {
      output = response;
    },
  });
  expect(output).toStrictEqual({ response: 'MOCK_API_RESPONSE' });
  const output2 = await secretChainQueries('MOCK_URL', ['MOCK_ENDPOINT']);
  expect(output2).toStrictEqual({ response: 'MOCK_API_RESPONSE' });
});
