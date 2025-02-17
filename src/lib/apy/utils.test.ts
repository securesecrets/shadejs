import {
  test,
  expect,
} from 'vitest';
import stakingInfoResponseMainnet from '~/test/mocks/derivativeScrt/stakingInfoResponseMainnet.json';
import { mockValidatorsCommissions } from '~/test/mocks/secretChainQueries/validatorsCommissionsParsedResponse';
import {
  getValidatorCommission,
  calcValidatorAPR,
  calcAggregateAPR,
  calcAPY,
  calculateRewardPoolAPY,
} from './utils';

test('It gets a validator commission', () => {
  expect(() => getValidatorCommission('MOCK_VAL_ADDR', [])).toThrowError(/^Error: validator address MOCK_VAL_ADDR not found in list$/);
  expect(getValidatorCommission('secretvaloper1rfnmcuwzf3zn7r025j9zr3ncc7mt9ge56l7se7', mockValidatorsCommissions)).toStrictEqual(0.08);
});

test('It calculates APR for a given validator', () => {
  expect(calcValidatorAPR({
    inflationRate: 100,
    totalScrtStaked: 1234567891234,
    totalScrtSupply: 5234567687823434,
    foundationTax: 0.01,
    communityTax: 0.02,
    commissionRate: 0.03,
  })).toStrictEqual(398941.5869669289);
});

test('It can calculate aggregate apr for a list of validators', () => {
  expect(calcAggregateAPR({
    networkValidatorList: mockValidatorsCommissions,
    validatorSet: stakingInfoResponseMainnet.validators,
    inflationRate: 100,
    totalScrtStaked: 1234567891234,
    totalScrtSupply: 5234567687823434,
    foundationTax: 0.01,
    communityTax: 0.02,
  })).toStrictEqual(390629.40197532275);
});

test('It can calculate APY from an APR', () => {
  expect(calcAPY(365, 20)).toStrictEqual(285937254.23695487);
});

test('It can calculate APY for a shade staking rewards pool', () => {
  expect(calculateRewardPoolAPY({
    rate: 1.2,
    totalStaked: '1023403432',
    price: '1.33',
    stakedPrice: '0.0',
    decimals: 8,
  })).toStrictEqual(0);
  expect(calculateRewardPoolAPY({
    rate: 1.2,
    totalStaked: '1023403432',
    price: '1.33',
    stakedPrice: '1.33',
    decimals: 8,
  })).toStrictEqual(3766803.32592374);
});
