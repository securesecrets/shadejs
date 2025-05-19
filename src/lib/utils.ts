import BigNumber from 'bignumber.js';
import { TokensConfig } from '~/types/shared';

BigNumber.config({ DECIMAL_PLACES: 18 });

const encodeJsonToB64 = (toEncode:any) : string => Buffer.from(JSON.stringify(toEncode), 'utf8').toString('base64');

const decodeB64ToJson = (encodedData: string) => JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));

/**
* Generates random string of characters, used to add entropy to TX data
* */
const generatePadding = ():string => {
  enum length {
    MAX = 15,
    MIN = 8
  }
  const paddingLength = Math.floor(Math.random() * (length.MAX - length.MIN + 1)) + length.MIN;
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < paddingLength; i += 1) {
    result += characters.charAt(Math.floor(Math.random()
      * characters.length));
  }
  return result;
};

/**
 * Convert from uDenom to the human readable equivalent as BigNumber type
 */
const convertCoinFromUDenom = (
  amount: number | string | BigNumber,
  decimals:number,
) => BigNumber(
  amount,
).dividedBy(BigNumber(10).pow(decimals)).decimalPlaces(18);

/**
 * Convert BigNumber to the uDenom string type
 */
const convertCoinToUDenom = (
  amount: BigNumber | number | string,
  decimals:number,
) => {
  if (typeof amount === 'string' || typeof amount === 'number') {
    return BigNumber(amount).multipliedBy(BigNumber(10).pow(decimals)).toFixed(0);
  }
  return amount.multipliedBy(BigNumber(10).pow(decimals)).toFixed(0);
};

/**
 * function used to determine the decimals of a token given the contract address and a list
 * of token configs
 */
function getTokenDecimalsByTokenConfig(tokenContractAddress: string, tokens: TokensConfig) {
  const tokenConfigArr = tokens.filter(
    (token) => token.tokenContractAddress === tokenContractAddress,
  );

  if (tokenConfigArr.length === 0) {
    throw new Error(`token ${tokenContractAddress} not available`);
  }

  if (tokenConfigArr.length > 1) {
    throw new Error(`Duplicate ${tokenContractAddress} tokens found`);
  }
  // at this point we have determined there is a single match
  return tokenConfigArr[0].decimals;
}

export {
  BigNumber,
  encodeJsonToB64,
  decodeB64ToJson,
  generatePadding,
  convertCoinFromUDenom,
  convertCoinToUDenom,
  getTokenDecimalsByTokenConfig,
};
