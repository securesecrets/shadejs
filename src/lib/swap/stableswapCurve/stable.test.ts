/* eslint-disable max-len */
import {
  expect,
  test,
} from 'vitest';
import BigNumber from 'bignumber.js';
import { isBigNumberWithinMarginOfError } from '~/lib/test';
import {
  bisect,
  StableConfig,
} from './stable';

function getConf(): StableConfig {
  BigNumber.set({ DECIMAL_PLACES: 30 });
  return new StableConfig({
    pool0Size: BigNumber(30000.0),
    pool1Size: BigNumber(10000.0),
    priceRatio: BigNumber(3.0),
    alpha: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    lpFee: BigNumber(0),
    shadeDaoFee: BigNumber(0),
    minTradeSize0For1: BigNumber(0.000001),
    minTradeSize1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  });
}

function getConfFee(): StableConfig {
  BigNumber.set({ DECIMAL_PLACES: 30 });
  return new StableConfig({
    pool0Size: BigNumber(30000.0),
    pool1Size: BigNumber(10000.0),
    priceRatio: BigNumber(3.0),
    alpha: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    lpFee: BigNumber(0.01),
    shadeDaoFee: BigNumber(0.01),
    minTradeSize0For1: BigNumber(0.000001),
    minTradeSize1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  });
}

function getConfImbalanced(): StableConfig {
  BigNumber.set({ DECIMAL_PLACES: 30 });
  return new StableConfig({
    pool0Size: BigNumber(15000.0),
    pool1Size: BigNumber(10000.0),
    priceRatio: BigNumber(1.0),
    alpha: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    lpFee: BigNumber(0.01),
    shadeDaoFee: BigNumber(0.01),
    minTradeSize0For1: BigNumber(0.000001),
    minTradeSize1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  });
}

function getConfSmallPool(): StableConfig {
  BigNumber.set({ DECIMAL_PLACES: 30 });
  return new StableConfig({
    pool0Size: BigNumber(30.0),
    pool1Size: BigNumber(6.0),
    priceRatio: BigNumber(5.0),
    alpha: BigNumber(10.0),
    gamma1: BigNumber(4.0),
    gamma2: BigNumber(5.0),
    lpFee: BigNumber(0),
    shadeDaoFee: BigNumber(0),
    minTradeSize0For1: BigNumber(0.000001),
    minTradeSize1For0: BigNumber(0.000001),
    priceImpactLimit: BigNumber(500),
  });
}

test('min_trade_size vars work', () => {
  const conf: StableConfig = getConfFee();
  conf.minTradeSize0For1 = BigNumber(0.1);

  expect(() => conf.swapToken0WithToken1(BigNumber(0))).toThrowError();
  expect(() => conf.swapToken1WithToken0(BigNumber(0))).toThrowError();

  expect(() => conf.swapToken0WithToken1(BigNumber(0.000000001))).toThrowError();
  expect(() => conf.swapToken1WithToken0(BigNumber(0.000000001))).toThrowError();

  expect(() => conf.swapToken0WithToken1(BigNumber(0.001))).toThrowError();
  expect(conf.swapToken1WithToken0(BigNumber(0.001)));

  expect(conf.swapToken0WithToken1(BigNumber(0.2)));
  expect(conf.swapToken1WithToken0(BigNumber(0.2)));
});

test('trade size of zero is err', () => {
  const conf: StableConfig = getConfFee();
  expect(() => conf.swapToken0WithToken1(BigNumber(-1))).toThrowError(/^Trade size must be positive$/);
  expect(() => conf.swapToken0WithToken1(BigNumber(0))).toThrowError(/^Trade size must be positive$/);
});

test('slippage calculations correct', () => {
  // slippage calculation
  let conf: StableConfig = getConfFee();
  let priceImpact = conf.priceImpactToken0ForToken1(BigNumber(100));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.03175175092600500'),
    priceImpact,
    BigNumber('0.0000000001'),
  )).toBeTruthy();

  priceImpact = conf.priceImpactToken1ForToken0(BigNumber(10000));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('263.475268403553536'),
    priceImpact,
    BigNumber('0.0000000000001'),
  )).toBeTruthy();

  // negative slippage
  conf = getConfImbalanced();
  priceImpact = conf.priceImpactToken1ForToken0(BigNumber(10));
  const priceImpact2 = conf.priceImpactToken0ForToken1(BigNumber(10));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.01836051477801700'),
    priceImpact,
    BigNumber('0.00000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('0.01797227236599600'),
    priceImpact2,
    BigNumber('0.00000000001'),
  )).toBeTruthy();

  // slippage limit
  conf = getConfSmallPool();
  expect(() => conf.swapToken0WithToken1(BigNumber(100000000))).toThrowError(/^The slippage of this trade.*/);
});

test('py correct', () => {
  const conf: StableConfig = getConf();
  expect(
    conf.token1TvlInUnitsToken0().isEqualTo(BigNumber(30000)),
  ).toBeTruthy();
});

test('gm2 correct', () => {
  const conf: StableConfig = getConf();
  expect(
    isBigNumberWithinMarginOfError(
      BigNumber(60000),
      conf.geometricMeanDoubled(),
    ),
  ).toBeTruthy();
  conf.pool0Size = BigNumber(0.5);
  expect(conf.geometricMeanDoubled()).toEqual(BigNumber(0));
});

test('tvl correct', () => {
  const conf: StableConfig = getConf();
  expect(
    conf.totalTvl(),
  ).toEqual(BigNumber(60000));
});

test('price', () => {
  const conf: StableConfig = getConf();

  expect(isBigNumberWithinMarginOfError(
    BigNumber(3.0),
    conf.priceToken1,
    BigNumber('0.00000000000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber(1).dividedBy(BigNumber(3.0)),
    conf.priceToken0,
    BigNumber('0.00000000000000001'),
  )).toBeTruthy();
});

test('bisect', () => {
  const f = (input: &BigNumber): BigNumber => input.multipliedBy(5);
  let res = bisect(
    f,
    BigNumber(0),
    BigNumber(1),
    BigNumber('0.000000001'),
    50,
  );
  expect(res.result).toEqual(BigNumber(0));

  res = bisect(
    f,
    BigNumber(-1.0),
    BigNumber(0),
    BigNumber('0.000000001'),
    50,
  );
  expect(res.result).toEqual(BigNumber(0));

  expect(() => bisect(
    f,
    BigNumber(1),
    BigNumber(2),
    BigNumber('0.000000001'),
    50,
  )).toThrowError();
});

test('feeWithSwap', () => {
  const conf: StableConfig = getConfFee();
  const token1FromToken0Swap = conf.swapToken0WithToken1(BigNumber(100.0)).tradeReturn;
  expect(isBigNumberWithinMarginOfError(
    token1FromToken0Swap,
    BigNumber('32.661482043229410'),
    BigNumber('0.000000000001'),
  )).toBeTruthy();
  const token0FromToken1Swap = conf.swapToken1WithToken0(BigNumber(75.7564)).tradeReturn;
  expect(isBigNumberWithinMarginOfError(
    token0FromToken1Swap,
    BigNumber('222.713817729937016'),
    BigNumber('0.0000000000001'),
  )).toBeTruthy();
});

test('feeWithSwapReverse', () => {
  const conf: StableConfig = getConfFee();

  // test reverse 0 to 1
  let afterFeeOutput = BigNumber('32.661482043229410');
  let beforeFeeOutput = afterFeeOutput.dividedBy(BigNumber(1).minus(conf.lpFee).minus(conf.shadeDaoFee));
  expect(isBigNumberWithinMarginOfError(
    conf.simulateReverseToken0WithToken1Trade(beforeFeeOutput).tradeInput,
    BigNumber('100'),
    BigNumber('0.000000000001'),
  )).toBeTruthy();

  // actually run the trade above
  expect(isBigNumberWithinMarginOfError(
    conf.swapToken0WithToken1(BigNumber(100.0)).tradeReturn,
    BigNumber('32.661482043229410'),
    BigNumber('0.000000000001'),
  )).toBeTruthy();

  // test reverse 1 to 0 on the new pool sizes
  afterFeeOutput = BigNumber('222.713817729937016');
  beforeFeeOutput = afterFeeOutput.dividedBy(BigNumber(1).minus(conf.lpFee).minus(conf.shadeDaoFee));
  expect(isBigNumberWithinMarginOfError(
    conf.simulateReverseToken1WithToken0Trade(beforeFeeOutput).tradeInput,
    BigNumber(75.7564),
    BigNumber('0.0000000000001'),
  )).toBeTruthy();
});

test('invXyAndDerivs', () => {
  const conf: StableConfig = getConf();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('233276112000000000000000000000'),
    conf.invariantFnFromPoolSizes(conf.pool0Size, conf.token1TvlInUnitsToken0().dividedBy(conf.invariant.result)),
    BigNumber('0.000000000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('46655352000000000000000000'),
    conf.derivRespectToPool0OfInvFnFromPool0(conf.pool0Size, conf.token1TvlInUnitsToken0().dividedBy(conf.invariant.result)),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('2332768896000000000000000000000'),
    conf.derivRespectToPool1OfInvFn(conf.pool0Size, conf.token1TvlInUnitsToken0().dividedBy(conf.invariant.result)),
  )).toBeTruthy();
});

test('invDAndDerivs', () => {
  const conf: StableConfig = getConf();

  expect(
    conf.invariantFnFromInv(
      BigNumber(60000.0),
      BigNumber(5.0),
    ).isEqualTo(0),
  ).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('-1823408209.209154464'),
    conf.invariantFnFromInv(
      BigNumber(70000),
      BigNumber(5),
    ),
    BigNumber('0.000000000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber(-630000.0),
    conf.derivRespectToInvOfInvFn(
      BigNumber(60000),
      BigNumber(5),
    ),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('7811.66312026155610'),
    conf.derivRespectToInvOfInvFn(
      BigNumber(70000),
      BigNumber(5),
    ),
    BigNumber('0.000000000000001'),
  ));
});

test('calculateD', () => {
  const conf: StableConfig = getConf();
  expect(
    conf.recalculateInvariant(),
  ).toEqual({
    result: BigNumber(60000),
    iterationsCount: 1,
  });
});

test('solves', () => {
  const conf: StableConfig = getConf();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('1323.89078895106217'),
    conf.solveInvFnForPool0Size(BigNumber(200000.0)).result,
    BigNumber('0.000000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('551.16761895687093'),
    conf.solveInvFnForPool1Size(BigNumber(200000.0)).result,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
});

test('swapXWithY', () => {
  const conf: StableConfig = getConf();

  const firstSim = conf
    .simulateToken0WithToken1Trade(BigNumber(100))
    .tradeReturn;
  const firstTrade = conf
    .swapToken0WithToken1(BigNumber(100)).tradeReturn;
  const secondSim = conf
    .simulateToken0WithToken1Trade(BigNumber(5000))
    .tradeReturn;
  const secondTrade = conf
    .swapToken0WithToken1(BigNumber(5000)).tradeReturn;
  const thirdSim = conf
    .simulateToken0WithToken1Trade(BigNumber(100))
    .tradeReturn;
  const thirdTrade = conf
    .swapToken0WithToken1(BigNumber(100)).tradeReturn;

  expect(isBigNumberWithinMarginOfError(
    BigNumber('33.32804290125453'),
    firstTrade,
    BigNumber('0.00000000000001'),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('1651.13809727604920'),
    secondTrade,
    BigNumber('0.00000000000001'),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('32.63860689949264'),
    thirdTrade,
    BigNumber('0.00000000000001'),
  ));

  expect(isBigNumberWithinMarginOfError(
    BigNumber('33.32804290125453'),
    firstSim,
    BigNumber('0.00000000000001'),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('1651.13809727604920'),
    secondSim,
    BigNumber('0.00000000000001'),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('32.63860689949264'),
    thirdSim,
    BigNumber('0.00000000000001'),
  ));
});

test('swapXWithYReverse', () => {
  const conf: StableConfig = getConf();

  const firstSim = conf
    .simulateReverseToken0WithToken1Trade(BigNumber('33.32804290125453'))
    .tradeInput;
  conf.swapToken0WithToken1(BigNumber(100));

  const secondSim = conf
    .simulateReverseToken0WithToken1Trade(BigNumber('1651.13809727604920'))
    .tradeInput;
  conf.swapToken0WithToken1(BigNumber(5000));

  const thirdSim = conf
    .simulateReverseToken0WithToken1Trade(BigNumber('32.63860689949264'))
    .tradeInput;
  conf.swapToken0WithToken1(BigNumber(100));

  expect(isBigNumberWithinMarginOfError(
    BigNumber(100),
    firstSim,
    BigNumber('0.00000000000001'),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber(5000),
    secondSim,
    BigNumber('0.00000000000001'),
  ));
  expect(isBigNumberWithinMarginOfError(
    BigNumber(100),
    thirdSim,
    BigNumber('0.00000000000001'),
  ));
});

test('swapYWithX', () => {
  const conf: StableConfig = getConf();

  const firstSim = conf
    .simulateToken1WithToken0Trade(BigNumber(100))
    .tradeReturn;
  const firstTrade = conf
    .swapToken1WithToken0(BigNumber(100)).tradeReturn;
  const secondSim = conf
    .simulateToken1WithToken0Trade(BigNumber(5000))
    .tradeReturn;
  const secondTrade = conf
    .swapToken1WithToken0(BigNumber(5000)).tradeReturn;
  const thirdSim = conf
    .simulateToken1WithToken0Trade(BigNumber(100))
    .tradeReturn;
  const thirdTrade = conf
    .swapToken1WithToken0(BigNumber(100)).tradeReturn;

  expect(isBigNumberWithinMarginOfError(
    BigNumber('299.8571590852683'),
    firstTrade,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('14137.0480571128589'),
    secondTrade,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('239.8541826320275'),
    thirdTrade,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();

  expect(isBigNumberWithinMarginOfError(
    BigNumber('299.8571590852683'),
    firstSim,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('14137.0480571128589'),
    secondSim,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('239.8541826320275'),
    thirdSim,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
});

test('swapYWithXReverse', () => {
  const conf: StableConfig = getConf();

  const firstSim = conf
    .simulateReverseToken1WithToken0Trade(BigNumber('299.8571590852683'))
    .tradeInput;
  conf.swapToken1WithToken0(BigNumber(100));
  const secondSim = conf
    .simulateReverseToken1WithToken0Trade(BigNumber('14137.0480571128589'))
    .tradeInput;
  conf.swapToken1WithToken0(BigNumber(5000));
  const thirdSim = conf
    .simulateReverseToken1WithToken0Trade(BigNumber('239.8541826320275'))
    .tradeInput;
  conf.swapToken1WithToken0(BigNumber(100));

  expect(isBigNumberWithinMarginOfError(
    BigNumber(100),
    firstSim,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber(5000),
    secondSim,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber(100),
    thirdSim,
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
});

test('updateP', () => {
  const conf: StableConfig = getConf();
  conf.updatePriceOfToken1(new BigNumber(0.5));
  expect(conf.priceOfToken1).toEqual(new BigNumber(0.5));
  expect(isBigNumberWithinMarginOfError(
    BigNumber('31368.965682419663771680677678645059'),
    conf.invariant.result,
  )).toBeTruthy();
});

test('full', () => {
  const conf: StableConfig = getConf();
  const tradeResults: BigNumber[] = [];

  tradeResults.push(
    conf.swapToken1WithToken0(BigNumber(100.0)).tradeReturn,
  );
  tradeResults.push(
    conf.swapToken0WithToken1(BigNumber(5000.0)).tradeReturn,
  );
  tradeResults.push(
    conf.swapToken0WithToken1(BigNumber(505.83573)).tradeReturn,
  );
  tradeResults.push(
    conf.swapToken1WithToken0(BigNumber(52.4174)).tradeReturn,
  );
  tradeResults.push(
    conf.swapToken1WithToken0(BigNumber(100.0)).tradeReturn,
  );
  tradeResults.push(
    conf.swapToken0WithToken1(BigNumber(100.0)).tradeReturn,
  );

  conf.updatePriceOfToken1(BigNumber(5.0));

  tradeResults.push(
    conf.swapToken1WithToken0(BigNumber(100.0)).tradeReturn,
  );
  tradeResults.push(
    conf.swapToken0WithToken1(BigNumber(100.0)).tradeReturn,
  );

  expect(isBigNumberWithinMarginOfError(
    BigNumber('299.8571590852683'),
    tradeResults[0],
    BigNumber(0.00000000000001),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('1653.76516047358473'),
    tradeResults[1],
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('165.29027473582654'),
    tradeResults[2],
    BigNumber('0.0000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('160.5757289103973'),
    tradeResults[3],
    BigNumber('0.0000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('305.9182828422537'),
    tradeResults[4],
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('32.70785744983560'),
    tradeResults[5],
    BigNumber('0.000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('494.9225889474723'),
    tradeResults[6],
    BigNumber('0.00000000000001'),
  )).toBeTruthy();
  expect(isBigNumberWithinMarginOfError(
    BigNumber('20.21745201653727'),
    tradeResults[7],
    BigNumber('0.0000000000001'),
  )).toBeTruthy();
});

export { isBigNumberWithinMarginOfError };
