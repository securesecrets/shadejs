import {
  constantProductSwapToken0for1,
  constantProductSwapToken1for0,
  stableSwapToken0for1,
  stableSwapToken1for0,
  constantProductPriceImpactToken0for1,
  constantProductPriceImpactToken1for0,
  stableSwapPriceImpactToken0For1,
  stableSwapPriceImpactToken1For0,
  constantProductReverseSwapToken0for1,
  constantProductReverseSwapToken1for0,
  stableReverseSwapToken0for1,
  stableReverseSwapToken1for0,
} from '~/lib/swap/swapCalculations';
import { test, expect } from 'vitest';
import BigNumber from 'bignumber.js';
import { isBigNumberWithinMarginOfError } from '~/lib/test';

test('it tests constant product swap token 0', () => {
  const inputParams1 = {
    token0LiquidityAmount: BigNumber('111000000'),
    token1LiquidityAmount: BigNumber('100000000'),
    token0InputAmount: BigNumber('10000000'),
    fee: BigNumber('0.1'),
  };

  const inputParams2 = {
    token0LiquidityAmount: BigNumber('50000000'),
    token1LiquidityAmount: BigNumber('150000000'),
    token0InputAmount: BigNumber('30000000'),
    fee: BigNumber('0.25'),
  };
  expect(constantProductSwapToken0for1(inputParams1)).toStrictEqual(BigNumber('7438017'));
  expect(constantProductSwapToken0for1(inputParams2)).toStrictEqual(BigNumber('42187500'));
});

test('it tests a reverse constant product swap token 0', () => {
  const inputParams1 = {
    token0LiquidityAmount: BigNumber('111000000'),
    token1LiquidityAmount: BigNumber('100000000'),
    token1OutputAmount: BigNumber('7438017'),
    fee: BigNumber('0.1'),
  };

  const inputParams2 = {
    token0LiquidityAmount: BigNumber('50000000'),
    token1LiquidityAmount: BigNumber('150000000'),
    token1OutputAmount: BigNumber('42187500'),
    fee: BigNumber('0.25'),
  };

  expect(constantProductReverseSwapToken0for1(inputParams1)).toStrictEqual(BigNumber('10000001'));
  expect(constantProductReverseSwapToken0for1(inputParams2)).toStrictEqual(BigNumber('30000000'));
});

test('it tests constant product swap token 1', () => {
  const inputParams1 = {
    token0LiquidityAmount: BigNumber('111000000'),
    token1LiquidityAmount: BigNumber('100000000'),
    token1InputAmount: BigNumber('10000000'),
    fee: BigNumber('0.1'),
  };

  const inputParams2 = {
    token0LiquidityAmount: BigNumber('50000000'),
    token1LiquidityAmount: BigNumber('150000000'),
    token1InputAmount: BigNumber('30000000'),
    fee: BigNumber('0.25'),
  };

  expect(constantProductSwapToken1for0(inputParams1)).toStrictEqual(BigNumber('9081818'));
  expect(constantProductSwapToken1for0(inputParams2)).toStrictEqual(BigNumber('6250000'));
});

test('it tests reverse constant product swap token 1', () => {
  const inputParams1 = {
    token0LiquidityAmount: BigNumber('111000000'),
    token1LiquidityAmount: BigNumber('100000000'),
    token0OutputAmount: BigNumber('9081818'),
    fee: BigNumber('0.1'),
  };

  const inputParams2 = {
    token0LiquidityAmount: BigNumber('50000000'),
    token1LiquidityAmount: BigNumber('150000000'),
    token0OutputAmount: BigNumber('6250000'),
    fee: BigNumber('0.25'),
  };

  expect(constantProductReverseSwapToken1for0(inputParams1)).toStrictEqual(BigNumber('10000000'));
  expect(constantProductReverseSwapToken1for0(inputParams2)).toStrictEqual(BigNumber('30000000'));
});

test('it tests stableswap with input of token 0', () => {
  const inputParams = {
    inputToken0Amount: BigNumber(100),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0),
    daoFee: BigNumber(0),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResult = stableSwapToken0for1(inputParams);
  expect(isBigNumberWithinMarginOfError(
    BigNumber('33.32804290125453'),
    swapResult,
    BigNumber('0.0000000001'),
  )).toBeTruthy();
});

test('it tests reverse stableswap with output of token 1', () => {
  const inputParams = {
    outputToken1Amount: BigNumber('33.32804290125453'),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0),
    daoFee: BigNumber(0),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResult = stableReverseSwapToken0for1(inputParams);
  expect(isBigNumberWithinMarginOfError(
    BigNumber(100),
    swapResult,
    BigNumber('0.0000000001'),
  )).toBeTruthy();
});

test('it tests reverse stableswap token 0 input with fees', () => {
  const inputParamsForward = {
    inputToken0Amount: BigNumber(100),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0.05),
    daoFee: BigNumber(0.05),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResultForward = stableSwapToken0for1(inputParamsForward);

  const inputParamsBackward = {
    outputToken1Amount: swapResultForward,
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0.05),
    daoFee: BigNumber(0.05),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResultBackward = stableReverseSwapToken0for1(inputParamsBackward);
  expect(isBigNumberWithinMarginOfError(
    inputParamsForward.inputToken0Amount,
    swapResultBackward,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
});

test('it tests stableswap with input of token 0', () => {
  const inputParams = {
    inputToken0Amount: BigNumber(100),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0),
    daoFee: BigNumber(0),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResult = stableSwapToken0for1(inputParams);
  expect(isBigNumberWithinMarginOfError(
    BigNumber('33.32804290125453'),
    swapResult,
    BigNumber('0.0000000001'),
  )).toBeTruthy();
});

test('it tests stableswap with input of token 1', () => {
  const inputParams1 = {
    inputToken1Amount: BigNumber(100.0),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0),
    daoFee: BigNumber(0),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResult = stableSwapToken1for0(inputParams1);
  expect(isBigNumberWithinMarginOfError(
    BigNumber('299.8571590852683'),
    swapResult,
    BigNumber('0.0000000001'),
  )).toBeTruthy();
});

test('it tests reverse stableswap with output of token 0', () => {
  const inputParams1 = {
    outputToken0Amount: BigNumber('299.8571590852683'),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0),
    daoFee: BigNumber(0),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResult = stableReverseSwapToken1for0(inputParams1);
  expect(isBigNumberWithinMarginOfError(
    BigNumber(100.0),
    swapResult,
    BigNumber('0.0000000001'),
  )).toBeTruthy();
});

test('it tests reverse stableswap token 1 input with fees', () => {
  const inputParamsForward = {
    inputToken1Amount: BigNumber(100),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0.05),
    daoFee: BigNumber(0.05),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResultForward = stableSwapToken1for0(inputParamsForward);

  const inputParamsBackward = {
    outputToken0Amount: swapResultForward,
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0.05),
    daoFee: BigNumber(0.05),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const swapResultBackward = stableReverseSwapToken1for0(inputParamsBackward);
  expect(isBigNumberWithinMarginOfError(
    inputParamsForward.inputToken1Amount,
    swapResultBackward,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
});

test('it tests stableswap price impact with input of token 0', () => {
  // output is validated against the stableswap unit test to ensure
  // this wrapper function is configured correctly.
  const inputParams = {
    inputToken0Amount: BigNumber(1000.0),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0.01),
    daoFee: BigNumber(0.01),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const priceImpact = stableSwapPriceImpactToken0For1(inputParams);
  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.001595308670509'),
    priceImpact,
    BigNumber('0.0000000001'),
  )).toBeTruthy();
});

test('it tests stableswap price impact with input of token 1', () => {
  // output is validated against the stableswap unit test to ensure
  // this wrapper function is configured correctly.
  const inputParams = {
    inputToken1Amount: BigNumber(10000),
    poolToken0Amount: BigNumber(30000.0),
    poolToken1Amount: BigNumber(10000.0),
    priceRatio: BigNumber(3),
    a: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    liquidityProviderFee: BigNumber(0.01),
    daoFee: BigNumber(0.01),
    minTradeSizeToken0For1: BigNumber(0.000001),
    minTradeSizeToken1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  };
  const priceImpact = stableSwapPriceImpactToken1For0(inputParams);
  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.370012139540090'),
    priceImpact,
    BigNumber('0.00000000001'),
  )).toBeTruthy();
});

test('it tests price impact of a constant product swap token 0 for 1', () => {
  const inputParams1 = {
    token0LiquidityAmount: BigNumber(3024),
    token1LiquidityAmount: BigNumber(4318),
    token0InputAmount: BigNumber(100),
  };
  const priceImpact1 = constantProductPriceImpactToken0for1(inputParams1);

  const inputParams2 = {
    token0LiquidityAmount: BigNumber(3024),
    token1LiquidityAmount: BigNumber(4318),
    token0InputAmount: BigNumber(1000),
  };
  const priceImpact2 = constantProductPriceImpactToken0for1(inputParams2);

  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.03306878306878'),
    priceImpact1,
    BigNumber('0.000000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.33068783068783'),
    priceImpact2,
    BigNumber('0.0000000000001'),
  )).toBeTruthy();
});

test('it tests price impact of a constant product swap token 1 for 0', () => {
  const inputParams1 = {
    token0LiquidityAmount: BigNumber(100000),
    token1LiquidityAmount: BigNumber(1234567),
    token1InputAmount: BigNumber(25000),
  };
  const priceImpact1 = constantProductPriceImpactToken1for0(inputParams1);

  const inputParams2 = {
    token0LiquidityAmount: BigNumber(100000),
    token1LiquidityAmount: BigNumber(1234567),
    token1InputAmount: BigNumber(250000),
  };
  const priceImpact2 = constantProductPriceImpactToken1for0(inputParams2);

  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.02025001478251'),
    priceImpact1,
    BigNumber('0.00000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.20250014782511'),
    priceImpact2,
    BigNumber('0.000000000001'),
  )).toBeTruthy();
});
