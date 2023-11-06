import BigNumber from 'bignumber.js';

function isBigNumberWithinMarginOfError(
  desiredVal: BigNumber,
  actualVal: BigNumber,
  epsPercent?: BigNumber,
): boolean {
  let eps = new BigNumber('0.000000000000000001');
  if (epsPercent !== undefined) {
    eps = epsPercent;
  }
  const diff = desiredVal.minus(actualVal).abs();
  const allowedErrRange = desiredVal.abs().multipliedBy(eps);
  return diff.isLessThan(allowedErrRange);
}

export {
  isBigNumberWithinMarginOfError,
};
