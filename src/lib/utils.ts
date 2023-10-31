const encodeJsonToB64 = (toEncode:any) : string => Buffer.from(JSON.stringify(toEncode), 'utf8').toString('base64');

const decodeB64ToJson = (encodedData: string) => JSON.parse(Buffer.from(encodedData, 'base64').toString('utf8'));

export {
  encodeJsonToB64,
  decodeB64ToJson,
};
