type BatchQueryParams = {
  id: string | number,
  contract: {
    address: string,
    codeHash: string,
  },
  queryMsg: any,
}

enum BatchItemResponseStatus {
  SUCCESS = 'success',
  ERROR = 'error',
}

type BatchQueryParsedResponseItem = {
  id: string | number,
  response: any,
  status?: BatchItemResponseStatus
  blockHeight: number,
}

type BatchQueryParsedResponse = BatchQueryParsedResponseItem[]

export type {
  BatchQueryParams,
  BatchQueryParsedResponseItem,
  BatchQueryParsedResponse,
};

export {
  BatchItemResponseStatus,
};
