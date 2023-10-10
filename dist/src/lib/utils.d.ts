import BigNumber from 'bignumber.js';
/**
 * Convert from uDenom to the human readable equivalent as BigNumber type
 */
declare const convertCoinFromUDenom: (amount: number | string, decimals: number) => BigNumber;
/**
 * Convert BigNumber to the uDenom string type
 */
declare const convertCoinToUDenom: (amount: BigNumber | number | string, decimals: number) => string;
export { convertCoinToUDenom, convertCoinFromUDenom, };
