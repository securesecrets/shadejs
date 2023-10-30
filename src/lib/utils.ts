import BigNumber from 'bignumber.js';

const encodeJsonToB64 = (toEncode:any) : string => Buffer.from(JSON.stringify(toEncode), 'utf8').toString('base64');

/**
 * Convert from uDenom to the human readable equivalent as BigNumber type
 */
const convertCoinFromUDenom = (
  amount: number | string,
  decimals:number,
) => {
  BigNumber.config({ DECIMAL_PLACES: 18 });
  return BigNumber(
    amount,
  ).dividedBy(BigNumber(10).pow(decimals));
};

/**
 * Convert BigNumber to the uDenom string type
 */
const convertCoinToUDenom = (
  amount: BigNumber | number | string,
  decimals:number,
) => {
  BigNumber.config({ DECIMAL_PLACES: 18 });
  if (typeof amount === 'string' || typeof amount === 'number') {
    return BigNumber(amount).multipliedBy(BigNumber(10).pow(decimals)).toFixed(0);
  }
  return amount.multipliedBy(BigNumber(10).pow(decimals)).toFixed(0);
};

export {
  convertCoinToUDenom,
  convertCoinFromUDenom,
  encodeJsonToB64,
};
