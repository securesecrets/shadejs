const encodeJsonToB64 = (toEncode:any) : string => Buffer.from(JSON.stringify(toEncode), 'utf8').toString('base64');

const decodeB64ToJson = (encodedData: string) => JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));

/**
* Generates random string of characters, used to add entropy to TX data
* */
const randomPadding = ():string => {
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

export {
  encodeJsonToB64,
  decodeB64ToJson,
  randomPadding,
};
