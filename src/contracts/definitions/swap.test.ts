import {
  test,
  expect,
} from 'vitest';
import {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
  msgQueryStakingConfig,
} from '~/contracts/definitions/swap';

test('it tests the form of the query factory config msg', () => {
  const output = { get_config: {} };
  expect(msgQueryFactoryConfig()).toStrictEqual(output);
});

test('it tests the form of the query factory pairs msg', () => {
  const output = {
    list_a_m_m_pairs: {
      pagination: {
        start: 0,
        limit: 25,
      },
    },
  };
  expect(msgQueryFactoryPairs(0, 25)).toStrictEqual(output);
});

test('it tests the form of the query pair config msg', () => {
  const output = { get_config: {} };
  expect(msgQueryPairConfig()).toStrictEqual(output);
});

test('it tests the form of the query pair info msg', () => {
  const output = { get_pair_info: {} };
  expect(msgQueryPairInfo()).toStrictEqual(output);
});

test('it tests the form of the query staking config msg', () => {
  const output = { get_config: {} };
  expect(msgQueryStakingConfig()).toStrictEqual(output);
});
