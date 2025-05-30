/* eslint-disable max-len */
import BigNumber from 'bignumber.js';
import { ReverseTradeResultV2, TradeResultV2 } from '~/types/stableswap/stable';
import { NewtonMethodError } from '~/lib/swap/stableswapCurve/error';

const maxIterNewton = 80;
const maxIterBisect = 150;

// Throughout the comments I compare this curve with constant product curve -
// keep in mind that this is only for clarity, nothing here is actually a constant product curve

// Calculates a zero of f and its derivative df using newton's method.
// Accuracy is guaranteed to be <= epsilon.
// Errors out if maxIterations is exceeded.
export function newton(
  f: (a: BigNumber) => BigNumber,
  df: (a: BigNumber) => BigNumber,
  initialGuess: BigNumber,
  epsilon: BigNumber,
  maxIterations: number,
): {
  result: BigNumber,
  iterationsCount: number,
} {
  let xn: BigNumber = initialGuess;
  for (let i = 0; i < maxIterations; i += 1) {
    const xPrev: BigNumber = xn;

    const fxn: BigNumber = f(xn);
    const dfxn: BigNumber = df(xn);

    if (dfxn.isEqualTo(0)) {
      throw new NewtonMethodError('Newton encountered slope of 0');
    }

    xn = xn.minus(fxn.dividedBy(dfxn));
    if (xn.minus(xPrev).abs().isLessThanOrEqualTo(epsilon)) {
      return {
        result: xn,
        iterationsCount: i + 1,
      };
    }
  }

  throw new NewtonMethodError('Newton exceeded max iterations');
}

// Calculates a zero using bisection within bounds a and b. Similar o binary search.
// Accuracy is guaranteed to be <= epsilon.
// Errors out if maxIterations is exceeded.
// Precondition: f(a) and f(b) must have different signs,
// with a single zero of the equation between a and b.
// https://en.wikipedia.org/wiki/BisectionMethod
export function bisect(
  f: (input: BigNumber) => BigNumber,
  a: BigNumber,
  b: BigNumber,
  epsilon: BigNumber,
  maxIterations: number,
): {
  result: BigNumber,
  iterationsCount: number,
} {
  const fa = f(a);
  const fb = f(b);

  if (fa.isEqualTo(0)) {
    return {
      result: a,
      iterationsCount: maxIterNewton,
    };
  }
  if (fb.isEqualTo(0)) {
    return {
      result: b,
      iterationsCount: maxIterNewton,
    };
  }

  if ((fa.isGreaterThan(0) && fb.isGreaterThan(0)) || (fa.isLessThan(0) && fb.isLessThan(0))) {
    throw Error('bisect endpoints must have different signs');
  }
  let step: BigNumber = b.minus(a);
  let newLowerBound: BigNumber = a;
  for (let i = 0; i < maxIterations; i += 1) {
    step = step.multipliedBy(BigNumber(0.5));

    const mid = newLowerBound.plus(step);
    const fm = f(mid);

    if (fa.multipliedBy(fm).isGreaterThanOrEqualTo(0)) {
      newLowerBound = mid;
    }
    if (fm || step.abs().isLessThanOrEqualTo(epsilon)) {
      return {
        result: mid,
        iterationsCount: maxIterNewton + i + 1,
      };
    }
  }
  throw Error('Bisect exceeded max iterations');
}

// Finds a zero of f using Newtons method, or bisect method if that fails.
// Allows for the lower bound of bisect to be lazy evaluated, since the lower bound
// for invariant as a fn of d is GM2, which is expensive to calculate.
// Lazy evaluation works by passing a fn into the 'lazyLowerBoundBisect' param,
// and passing 'None' to 'lowerBoundBisect'.
// The given fn will be called only if it is needed.
// Precondition: Exactly ONE of 'lowerBoundBisect' and 'lazyLowerBoundBisect' must exist
export function calcZero(
  f: (a: BigNumber) => BigNumber,
  df: (a: BigNumber) => BigNumber,
  initialGuessNewton: BigNumber,
  upperBoundBisect: BigNumber,
  ignoreNegativeResult: boolean,
  lazyLowerBoundBisect?: () => BigNumber,
  lowerBoundBisect?: BigNumber,
): {
  result: BigNumber,
  iterationsCount: number,
} {
  const precision = BigNumber(0.0000000000000001); // 1e-16

  try {
    // attempt to find the zero with newton's method
    const newtonResult = newton(f, df, initialGuessNewton, precision, maxIterNewton);
    if (!ignoreNegativeResult || newtonResult.result.isGreaterThanOrEqualTo(0)) {
      return newtonResult;
    }
  } catch (error) {
    if (error instanceof NewtonMethodError) {
      // do nothing, if Newton failed this fn will fall back to bisect method
    } else {
      throw error;
    }
  }

  // if newton got a result and it's not negative when we are trying to avoid
  // negative results, return it (sometimes the invariant curve has both a negative
  // and a positive zero, and we want to avoid the negative one)

  // fall back to bisect method

  if (lowerBoundBisect !== undefined) {
    return bisect(
      f,
      lowerBoundBisect,
      upperBoundBisect,
      precision,
      maxIterBisect,
    );
  }
  if (lazyLowerBoundBisect !== undefined) {
    // actually evaluate the lower bound since it is needed now
    return bisect(
      f,
      lazyLowerBoundBisect(),
      upperBoundBisect,
      precision,
      maxIterBisect,
    );
  }
  throw Error(
    'No lower bound was found for bisect',
  );
}

// Generates an error if swapAmount is not a legal swap amount.
export function verifySwapAmountInBounds(swapAmount: BigNumber, minTradeSize: BigNumber) {
  if (swapAmount.isLessThanOrEqualTo(0)) {
    throw Error('Trade size must be positive');
  }
  if (swapAmount.isLessThanOrEqualTo(minTradeSize)) {
    throw Error(`Trade size must be larger than minimum trade size of ${minTradeSize}`);
  }
}

const memoizedInvariants: Record<string, {
  result: BigNumber,
  iterationsCount: number,
}> = {};

export class StableConfig {
  // pool size of first asset
  pool0Size: BigNumber;

  // pool size of second asset
  pool1Size: BigNumber;

  // price of asset 1 in terms of asset 0 (units: asset0 / asset1)
  // the value 'py' is common throughout the code. This is simply p*y,
  // or the total value locked (TVL) of asset y in terms of x
  priceOfToken1: BigNumber;

  // Returns the current price of y in terms of x.
  priceToken0: BigNumber;

  // Returns the current price of x in terms of y.
  priceToken1: BigNumber;

  // manually set param which controls the 'flatness' of the curve near equilibrium
  alpha: BigNumber;

  // manually set param which controls how the quickly the curve gains slippage when
  // X is underrepresented
  gamma1: BigNumber;

  // manually set param which controls how the quickly the curve gains slippage when
  // X is overrepresented
  gamma2: BigNumber;

  // the percentage fee to be taken from every trade for lp providers (eg 0.001 is a 0.1% fee)
  lpFee: BigNumber;

  // the percentage fee to be taken from every trade for shade dao (eg 0.001 is a 0.1% fee)
  shadeDaoFee: BigNumber;

  // the invariant of the pool, calculated by finding the zero of the invariant function
  // (analogous to x * y if this was a constant product curve)
  // referred to as 'd' occasionally
  invariant: { result: BigNumber; iterationsCount: number };

  minTradeSize0For1: BigNumber;

  minTradeSize1For0: BigNumber;

  priceImpactLimit: BigNumber;

  constructor({
    pool0Size,
    pool1Size,
    priceRatio,
    alpha,
    gamma1,
    gamma2,
    lpFee,
    shadeDaoFee,
    minTradeSize0For1,
    minTradeSize1For0,
    priceImpactLimit,
  }: {
    pool0Size: BigNumber,
    pool1Size: BigNumber,
    priceRatio: BigNumber,
    alpha: BigNumber,
    gamma1: BigNumber,
    gamma2: BigNumber,
    lpFee: BigNumber,
    shadeDaoFee: BigNumber,
    minTradeSize0For1: BigNumber,
    minTradeSize1For0: BigNumber,
    priceImpactLimit: BigNumber,
  }) {
    this.pool0Size = pool0Size;
    this.pool1Size = pool1Size;
    this.priceOfToken1 = priceRatio;
    this.alpha = alpha;
    this.gamma1 = gamma1;
    this.gamma2 = gamma2;
    const key = [
      pool0Size,
      pool1Size,
      priceRatio,
      alpha,
      gamma1,
      gamma2,
    ].map((n) => n?.toString()).join(',');
    if (!memoizedInvariants[key]) {
      memoizedInvariants[key] = this.recalculateInvariant();
    }
    this.invariant = memoizedInvariants[key];
    this.priceToken0 = this.priceToken0At(this.pool0Size, this.pool1Size);
    this.priceToken1 = this.priceToken1At(this.pool0Size, this.pool1Size);
    this.lpFee = lpFee;
    this.shadeDaoFee = shadeDaoFee;
    this.minTradeSize0For1 = minTradeSize0For1;
    this.minTradeSize1For0 = minTradeSize1For0;
    this.priceImpactLimit = priceImpactLimit;
  }

  public static create({
    poolToken0Amount,
    poolToken1Amount,
    priceRatio,
    alpha,
    gamma1,
    gamma2,
    liquidityProviderFee,
    daoFee,
    minTradeSizeToken0For1,
    minTradeSizeToken1For0,
    priceImpactLimit,
  }: {
    poolToken0Amount: BigNumber,
    poolToken1Amount: BigNumber,
    priceRatio: BigNumber,
    alpha: BigNumber,
    gamma1: BigNumber,
    gamma2: BigNumber,
    liquidityProviderFee: BigNumber,
    daoFee: BigNumber,
    minTradeSizeToken0For1: BigNumber,
    minTradeSizeToken1For0: BigNumber,
    priceImpactLimit: BigNumber,
  }): StableConfig {
    return new StableConfig(
      {
        pool0Size: poolToken0Amount,
        pool1Size: poolToken1Amount,
        priceRatio,
        alpha,
        gamma1,
        gamma2,
        lpFee: liquidityProviderFee,
        shadeDaoFee: daoFee,
        minTradeSize0For1: minTradeSizeToken0For1,
        minTradeSize1For0: minTradeSizeToken1For0,
        priceImpactLimit,
      },
    );
  }

  // solves the invariant fn to find the balanced amount of y for the given x
  // e.g. for a given pool size x, what is the correct pool size y so that the
  // invariant is not changed?
  // analogous to 'output = (x * y) / (x + input)' for constant product trades
  solveInvFnForPool1Size(pool0Size: BigNumber): {
    result: BigNumber,
    iterationsCount: number,
  } {
    const xOverD: BigNumber = pool0Size.dividedBy(this.invariant.result);

    const f = (py: BigNumber): BigNumber => this.invariantFnFromPoolSizes(xOverD, py);
    const df = (py: BigNumber): BigNumber => this.derivRespectToPool1OfInvFn(xOverD, py);

    const root = this.findZeroWithPool1Params(f, df);
    return {
      result: root.result.multipliedBy(this.invariant.result).dividedBy(this.priceOfToken1),
      iterationsCount: root.iterationsCount + this.invariant.iterationsCount,
    };
  }

  // solves the invariant fn to find the balanced amount of x for the given y
  // e.g. for a given pool size y, what is the correct pool size x so that the
  // invariant is not changed?
  // analogous to 'output = (x * y) / (y + input)' for constant product trades
  solveInvFnForPool0Size(pool1SizeInUnitsOfPool0: BigNumber): {
    result: BigNumber,
    iterationsCount: number,
  } {
    const pyOverD: BigNumber = pool1SizeInUnitsOfPool0.dividedBy(this.invariant.result);

    const f = (x: BigNumber): BigNumber => this.invariantFnFromPoolSizes(x, pyOverD);
    const df = (x: BigNumber): BigNumber => this.derivRespectToPool0OfInvFnFromPool0(x, pyOverD);

    const root = this.findZeroWithPool0Params(f, df);
    return {
      result: root.result.multipliedBy(this.invariant.result),
      iterationsCount: root.iterationsCount + this.invariant.iterationsCount,
    };
  }

  // Executes a swap of x for y, if the trade is within amount and slippage bounds.
  // executeTrade=true is only needed during testing
  swapToken0WithToken1(token0Input: BigNumber, executeTrade = false): TradeResultV2 {
    const tradeRes: TradeResultV2 = this.simulateToken0WithToken1Trade(token0Input);
    if (executeTrade) {
      return this.executeTrade(tradeRes);
    }
    return tradeRes;
  }

  // Executes a swap of y for x, if the trade is within amount and slippage bounds.
  // executeTrade=true is only needed during testing
  swapToken1WithToken0(token1Input: BigNumber, executeTrade = false): TradeResultV2 {
    const tradeRes: TradeResultV2 = this.simulateToken1WithToken0Trade(token1Input);
    if (executeTrade) {
      return this.executeTrade(tradeRes);
    }
    return tradeRes;
  }

  // Applies the data from a TradeResultV2 to the given conf.
  // takes a simulated trade and actually updates the config's values to reflect that the
  // trade went through
  private executeTrade(trade: TradeResultV2): TradeResultV2 {
    this.pool0Size = trade.newPool0;
    this.pool1Size = trade.newPool1;
    this.invariant = this.recalculateInvariant();
    this.recalculatePrices();
    return trade;
  }

  // Simulates a swap of x for y, given the output y, if the trade is within amount and slippage bounds.
  // Returns data about the state of the conf after the swap.
  simulateReverseToken0WithToken1Trade(token1Output: BigNumber): ReverseTradeResultV2 {
    const lpFeeAmount = this.lpFee.multipliedBy(token1Output);
    const shadeDaoFeeAmount = this.shadeDaoFee.multipliedBy(token1Output);

    const totalFeeAmount = lpFeeAmount.plus(shadeDaoFeeAmount);
    const token1OutputAfterFee = token1Output.minus(totalFeeAmount);

    // calculate the sizes of the pool after the trades go through
    const newToken1Pool: BigNumber = this.pool1Size.minus(token1Output);
    const newToken1PoolInUnitsToken0 = newToken1Pool.multipliedBy(this.priceOfToken1);
    const {
      result: newToken0Pool,
      iterationsCount,
    } = this.solveInvFnForPool0Size(newToken1PoolInUnitsToken0);

    // make sure the trade is within a reasonable price impact range
    this.verifySwapPriceImpactInBounds(newToken0Pool, newToken1Pool, true);

    const tradeInput = newToken0Pool.minus(this.pool0Size);
    verifySwapAmountInBounds(tradeInput, this.minTradeSize0For1);

    // add the fees to the pool
    const newToken1PoolFeeAdded = newToken1Pool.plus(lpFeeAmount);

    // return a TradeResultV2 with the new pool sizes, fee amounts, and trade return
    return {
      newPool0: newToken0Pool,
      newPool1: newToken1PoolFeeAdded,
      tradeInput,
      tradeReturn: token1OutputAfterFee,
      lpFeeAmount,
      shadeDaoFeeAmount,
      iterationsCount,
    };
  }

  // Simulates a swap of y for x, given the output x, if the trade is within amount and slippage bounds.
  // Returns data about the state of the conf after the swap.
  simulateReverseToken1WithToken0Trade(token0Output: BigNumber): ReverseTradeResultV2 {
    const lpFeeAmount = this.lpFee.multipliedBy(token0Output);
    const shadeDaoFeeAmount = this.shadeDaoFee.multipliedBy(token0Output);

    const totalFeeAmount = lpFeeAmount.plus(shadeDaoFeeAmount);
    const token0OutputAfterFee = token0Output.minus(totalFeeAmount);

    // calculate the sizes of the pool after the trades go through
    const newToken0Pool: BigNumber = this.pool0Size.minus(token0Output);
    const {
      result: newToken1Pool,
      iterationsCount,
    } = this.solveInvFnForPool1Size(newToken0Pool);

    // make sure the trade is within a reasonable price impact range
    this.verifySwapPriceImpactInBounds(newToken0Pool, newToken1Pool, false);

    const tradeInput = newToken1Pool.minus(this.pool1Size);
    verifySwapAmountInBounds(tradeInput, this.minTradeSize1For0);

    // add the fees to the pool
    const newToken0PoolFeeAdded = newToken0Pool.plus(lpFeeAmount);

    // return a TradeResultV2 with the new pool sizes, fee amounts, and trade return
    return {
      newPool0: newToken0PoolFeeAdded,
      newPool1: newToken1Pool,
      tradeInput,
      tradeReturn: token0OutputAfterFee,
      lpFeeAmount,
      shadeDaoFeeAmount,
      iterationsCount,
    };
  }

  // Simulates a swap of x for y, if the trade is within amount and slippage bounds.
  // Returns data about the state of the conf after the swap.
  simulateToken0WithToken1Trade(token0Input: BigNumber): TradeResultV2 {
    verifySwapAmountInBounds(token0Input, this.minTradeSize0For1);

    // calculate the sizes of the pool after the trades go through
    const newToken0Pool: BigNumber = this.pool0Size.plus(token0Input);
    const {
      result: newToken1Pool,
      iterationsCount,
    } = this.solveInvFnForPool1Size(newToken0Pool);

    // make sure the trade is within a reasonable price impact range
    this.verifySwapPriceImpactInBounds(newToken0Pool, newToken1Pool, true);

    // find the trade return amount by subtracting desired pool size from current pool size
    const tradeReturnBeforeFee = this.pool1Size.minus(newToken1Pool);

    // find fee sizes from trade return
    const lpFeeAmount = this.lpFee.multipliedBy(tradeReturnBeforeFee);
    const shadeDaoFeeAmount = this.shadeDaoFee.multipliedBy(tradeReturnBeforeFee);

    // add the fees to the pool
    const newToken1PoolFeeAdded = newToken1Pool.plus(lpFeeAmount);

    // calculate the price impact after getting the swap return (paid price)
    const marketPrice = this.priceToken1;
    const paidPrice = token0Input.dividedBy(tradeReturnBeforeFee);
    const priceImpact = paidPrice.dividedBy(marketPrice).minus(1);

    // return a TradeResultV2 with the new pool sizes, fee amounts, and trade return
    return {
      newPool0: newToken0Pool,
      newPool1: newToken1PoolFeeAdded,
      tradeReturn: tradeReturnBeforeFee.minus(lpFeeAmount).minus(shadeDaoFeeAmount),
      lpFeeAmount,
      shadeDaoFeeAmount,
      priceImpact,
      iterationsCount,
    };
  }

  // Simulates a swap of y for x, if the trade is within amount and slippage bounds.
  // Returns data about the state of the conf after the swap.
  simulateToken1WithToken0Trade(token1Input: BigNumber): TradeResultV2 {
    verifySwapAmountInBounds(token1Input, this.minTradeSize1For0);

    // calculate the sizes of the pool after the trades go through
    const newToken1Pool: BigNumber = this.pool1Size.plus(token1Input);

    // find the value of the y tokens in terms of x
    const newToken1PoolInUnitsToken0: BigNumber = this.priceOfToken1.multipliedBy(newToken1Pool);

    // find the x pool size needed to maintain the invariant
    const {
      result: newToken0Pool,
      iterationsCount,
    } = this.solveInvFnForPool0Size(newToken1PoolInUnitsToken0);

    this.verifySwapPriceImpactInBounds(newToken0Pool, newToken1Pool, false);

    // find the trade return amount by subtracting desired pool size from current pool size
    const tradeReturnBeforeFee = this.pool0Size.minus(newToken0Pool);

    // find fee sizes from trade return
    const lpFeeAmount = this.lpFee.multipliedBy(tradeReturnBeforeFee);
    const shadeDaoFeeAmount = this.shadeDaoFee.multipliedBy(tradeReturnBeforeFee);

    // add the fees to the pool
    const newToken0PoolFeeAdded = newToken0Pool.plus(lpFeeAmount);

    // calculate the price impact after getting the swap return (paid price)
    const marketPrice = this.priceToken0;
    const paidPrice = token1Input.dividedBy(tradeReturnBeforeFee);
    const priceImpact = paidPrice.dividedBy(marketPrice).minus(1);

    // return a TradeResultV2 with the new pool sizes, fee amounts, and trade return
    return {
      newPool0: newToken0PoolFeeAdded,
      newPool1: newToken1Pool,
      tradeReturn: tradeReturnBeforeFee.minus(lpFeeAmount).minus(shadeDaoFeeAmount),
      lpFeeAmount,
      shadeDaoFeeAmount,
      priceImpact,
      iterationsCount,
    };
  }

  // Generates an error if the swap's price impact exceeds the limit. Params x and y are the
  // new pool sizes after the trade in question is hypothetically completed.
  // Price impact results should never be negative, since it is measured in terms of the
  // incoming token.
  // The price of that token in the pool will always increase, leading to a positive price impact.
  private verifySwapPriceImpactInBounds(
    pool0Size: BigNumber,
    pool1Size: BigNumber,
    tradeDirIs0For1: boolean,
  ) {
    const priceImpact = this.priceImpactAt(pool0Size, pool1Size, tradeDirIs0For1);
    if (priceImpact.isGreaterThan(this.priceImpactLimit) || priceImpact.isLessThan(BigNumber(0))) {
      throw Error(`The slippage of this trade is outside of the acceptable range of 0% - ${this.priceImpactLimit}%.`);
    }
  }

  // Returns the price impact associated with new x and y values (pool sizes),
  // relative to the current values stored in conf.
  private priceImpactAt(
    newPool0: BigNumber,
    newPool1: BigNumber,
    tradeDirIs0For1: boolean,
  ): BigNumber {
    // price of the token, based on pool sizes in conf
    const currPrice: BigNumber = tradeDirIs0For1 ? this.priceToken1 : this.priceToken0;

    const finalPrice: BigNumber = tradeDirIs0For1
      ? this.priceToken1At(newPool0, newPool1)

      // price of the tokens based on function parameter input
      : this.priceToken0At(newPool0, newPool1);

    // calculate price impact between two prices
    return (finalPrice.dividedBy(currPrice).minus(BigNumber(1))).multipliedBy(100);
  }

  // Returns the price impact for a swap of x for y, given the trade input.
  // result is expresed as percent so no conversion is necessary, ex. 263.5 = 263.5%
  priceImpactToken0ForToken1(tradeX: BigNumber): BigNumber {
    const newPool0: BigNumber = this.pool0Size.plus(tradeX);
    const { result: pool1 } = this.solveInvFnForPool1Size(newPool0);
    return this.priceImpactAt(newPool0, pool1, true);
  }

  // Returns the price impact for a swap of y for x, given the trade input.
  // result is expresed as percent so no conversion is necessary, ex. 263.5 = 263.5%
  priceImpactToken1ForToken0(tradeY: BigNumber): BigNumber {
    const newPool1: BigNumber = this.pool1Size.plus(tradeY);
    const { result: pool0 } = this.solveInvFnForPool0Size(this.priceOfToken1.multipliedBy(newPool1));
    return this.priceImpactAt(pool0, newPool1, false);
  }

  // Helper method for price.
  // Returns -1 * slope of tangent to inv curve at (x, y)
  // The slope (tangent) of the curve is the price of the token
  private negativeTangent(
    pool0: &BigNumber,
    pool1: &BigNumber,
  ): BigNumber {
    return (this.derivRespectToPool0OfInvFnFromPool0(pool0, pool1)
      .dividedBy(this.derivRespectToPool1OfInvFn(pool0, pool1))).dividedBy(this.priceOfToken1);
  }

  private recalculatePrices() {
    this.priceToken0 = this.priceToken0At(this.pool0Size, this.pool1Size);
    this.priceToken1 = this.priceToken1At(this.pool0Size, this.pool1Size);
  }

  /// Returns the price of y in terms of x, for given pool sizes of x and y.
  private priceToken1At(
    pool0: BigNumber,
    pool1: BigNumber,
  ): BigNumber {
    return BigNumber(1)
      .dividedBy(this.negativeTangent(
        pool0.dividedBy(this.invariant.result),
        (this.priceOfToken1.multipliedBy(pool1)).dividedBy(this.invariant.result),
      ));
  }

  // Returns the price of x in terms of y, for given pool sizes of x and y.
  private priceToken0At(
    pool0: BigNumber,
    pool1: BigNumber,
  ): BigNumber {
    return this.negativeTangent(
      pool0.dividedBy(this.invariant.result),
      (this.priceOfToken1.multipliedBy(pool1)).dividedBy(this.invariant.result),
    );
  }

  // Stores a new value for p and recalculates the invariant
  updatePriceOfToken1(priceOfToken1: BigNumber) {
    this.priceOfToken1 = priceOfToken1;
    this.invariant = this.recalculateInvariant();
    this.recalculatePrices();
  }

  // Returns the TVL of asset y in terms of x.
  // A pool with 5 tokens of SILK at $1.05 SILK would return 1.05 * 5 = 5.25
  // This is the total value of y tokens in the pool, measured in terms of token x
  token1TvlInUnitsToken0(): BigNumber {
    return this.priceOfToken1.multipliedBy(this.pool1Size);
  }

  // Returns the total TVL of the pool in terms of x.
  totalTvl(): BigNumber {
    return this.pool0Size.plus(this.token1TvlInUnitsToken0());
  }

  // Returns twice the geometric mean of the current values of x and y
  // Returns 0 if either x or py is < 1
  geometricMeanDoubled(): BigNumber {
    const py = this.token1TvlInUnitsToken0();

    // sqrt does not work with numbers less than one
    if (this.pool0Size.isLessThanOrEqualTo(BigNumber(1)) || py.isLessThanOrEqualTo(BigNumber(1))) {
      return BigNumber(0);
    }
    return (this.pool0Size.sqrt().multipliedBy(py.sqrt())).multipliedBy(BigNumber(2));
  }

  // Calculates and returns the correct value of the invariant d, given the current conf,
  // by finding the 0 of the invariant fn.`
  recalculateInvariant(): {
    result: BigNumber,
    iterationsCount: number,
    } {
    const pY = this.token1TvlInUnitsToken0();
    const gamma = this.pool0Size.isLessThanOrEqualTo(pY)
      ? this.gamma1
      : this.gamma2;
    const f = (d: BigNumber): BigNumber => this.invariantFnFromInv(d, gamma);
    const df = (d: BigNumber): BigNumber => this.derivRespectToInvOfInvFn(d, gamma);

    return this.findZeroWithInvariantParams(f, df);
  }

  // INVARIANT AND DERIV FUNCTIONS

  // Returns the invariant as a function of d and gamma
  invariantFnFromInv(
    invariant: &BigNumber,
    gamma: &BigNumber,
  ): BigNumber {
    const py: BigNumber = this.token1TvlInUnitsToken0();
    const coeff: BigNumber = this.getCoeffScaledByInv(invariant, gamma, py);
    const term1: BigNumber = coeff.multipliedBy(invariant.multipliedBy((this.pool0Size.plus(py.minus(invariant)))));
    const term2: BigNumber = this.pool0Size.multipliedBy(py);
    const term3: BigNumber = (invariant.multipliedBy(invariant)).dividedBy(4);

    return term1.plus(term2).minus(term3);
  }

  // Returns the derivative of the invariant fn as a function of d and gamma.
  derivRespectToInvOfInvFn(
    invariant: &BigNumber,
    gamma: &BigNumber,
  ): BigNumber {
    const py = this.token1TvlInUnitsToken0();
    const coeff: BigNumber = this.getCoeffScaledByInv(invariant, gamma, py);
    const mainTerm: BigNumber = (BigNumber(-2)
      .multipliedBy(gamma)
      .plus(1)).multipliedBy((this.pool0Size.minus(invariant).plus(py)))
      .minus(invariant);
    return coeff.multipliedBy(mainTerm).minus(invariant.dividedBy(2));
  }

  // returns the 'coefficient' used in the invariant functions, scaled by d
  // this is just a simplification of the math, with no real world meaning
  // see whitepaper for full explanation
  private getCoeffScaledByInv(
    invariant: &BigNumber,
    gamma: &BigNumber,
    pool1SizeInUnitsPool0: &BigNumber,
  ): BigNumber {
    //
    return this.alpha.multipliedBy(((BigNumber(4)
      .multipliedBy((this.pool0Size.dividedBy(invariant)))).multipliedBy((pool1SizeInUnitsPool0.dividedBy(invariant)))).pow(
      gamma,
    ));
  }

  // returns the 'coefficient' used in the invariant functions
  // this is just a simplification of the math, with no real world meaning
  // see whitepaper for full explanation
  private getCoeff(
    pool0Size: &BigNumber,
    pool1SizeInUnitsPool0: &BigNumber,
    gamma: &BigNumber,
  ): BigNumber {
    const xpy: BigNumber = pool0Size.multipliedBy(pool1SizeInUnitsPool0);
    return this.alpha.multipliedBy((BigNumber(4).multipliedBy(xpy)).pow(gamma));
  }

  // Returns the invariant fn as a function of x and py
  invariantFnFromPoolSizes(
    pool0Size: &BigNumber,
    pool1SizeInUnitsPool0: &BigNumber,
  ): BigNumber {
    const gamma = pool0Size.isLessThanOrEqualTo(pool1SizeInUnitsPool0) ? this.gamma1 : this.gamma2;
    const xpy: BigNumber = pool0Size.multipliedBy(pool1SizeInUnitsPool0);

    const coeff: BigNumber = this.getCoeff(pool0Size, pool1SizeInUnitsPool0, gamma);
    const term1: BigNumber = coeff.multipliedBy((pool0Size.plus(pool1SizeInUnitsPool0).minus(1)));

    return term1.plus(xpy).minus(0.25);
  }

  // Returns the derivative of the invariant fn with respect to x as a function of x and py.
  derivRespectToPool0OfInvFnFromPool0(pool0Size: BigNumber, pool1SizeInUnitsOfPool0: BigNumber): BigNumber {
    const gamma = pool0Size.isLessThanOrEqualTo(pool1SizeInUnitsOfPool0) ? this.gamma1 : this.gamma2;
    const coeff: BigNumber = this.getCoeff(pool0Size, pool1SizeInUnitsOfPool0, gamma);
    const term1: BigNumber = (gamma.multipliedBy((pool0Size.plus(pool1SizeInUnitsOfPool0).minus(1)))).dividedBy(
      pool0Size,
    ).plus(1);
    return coeff.multipliedBy(term1).plus(pool1SizeInUnitsOfPool0);
  }

  // Returns the derivative of the invariant fn with respect to y as a function of x and py.
  derivRespectToPool1OfInvFn(pool0Size: BigNumber, pool1SizeInUnitsOfPool0: BigNumber): BigNumber {
    const gamma = pool0Size.isLessThanOrEqualTo(pool1SizeInUnitsOfPool0) ? this.gamma1 : this.gamma2;
    const coeff: BigNumber = this.getCoeff(pool0Size, pool1SizeInUnitsOfPool0, gamma);
    const term1: BigNumber = gamma.multipliedBy((pool0Size.plus(pool1SizeInUnitsOfPool0).minus(1)).dividedBy(
      pool1SizeInUnitsOfPool0,
    )).plus(1);
    return coeff.multipliedBy(term1).plus(pool0Size);
  }

  // ZERO FINDER

  // Finds and returns a zero for the given fn f (with its derivative df).

  // Uses guesses and bounds optimized for calculating the invariant as a fn of d
  private findZeroWithInvariantParams(
    f: (a: BigNumber) => BigNumber,
    df: (a: BigNumber) => BigNumber,
  ): {
    result: BigNumber,
    iterationsCount: number,
  } {
    const tvl: BigNumber = this.totalTvl();
    return calcZero(f, df, tvl, tvl, true, this.geometricMeanDoubled.bind(this), undefined);
  }

  // Finds and returns a zero for the given fn f (with its derivative df).
  // Uses guesses and bounds optimized for calculating the invariant as a fn of x
  private findZeroWithPool0Params(
    f: (a: BigNumber) => BigNumber,
    df: (a: BigNumber) => BigNumber,
  ): {
    result: BigNumber,
    iterationsCount: number,
  } {
    const xOverD = this.pool0Size.dividedBy(this.invariant.result);
    return calcZero(
      f,
      df,
      xOverD,
      xOverD,
      false,
      undefined,
      BigNumber(0),
    );
  }

  // Finds and returns a zero for the given fn f (with its derivative df)
  // Uses guesses and bounds optimized for calculating the invariant as a fn of y
  private findZeroWithPool1Params(
    f: (a: BigNumber) => BigNumber,
    df: (a: BigNumber) => BigNumber,
  ): {
    result: BigNumber,
    iterationsCount: number,
  } {
    const pyOverD = this.token1TvlInUnitsToken0().dividedBy(this.invariant.result);
    return calcZero(
      f,
      df,
      pyOverD,
      pyOverD,
      false,
      undefined,
      BigNumber(0),
    );
  }
}
