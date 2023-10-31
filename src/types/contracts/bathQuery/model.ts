type BatchQuery = {
  id: string | number,
  contract: {
    address: string,
    codeHash: string,
  },
  queryMsg: any,
}

type BatchQueryParsedResponseItem = {
  id: string | number,
  response: any,
}

type BatchQueryParsedResponse = BatchQueryParsedResponseItem[]

export type {
  BatchQuery,
  BatchQueryParsedResponseItem,
  BatchQueryParsedResponse,
};
