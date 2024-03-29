type BatchQueryResponseItem = {
  id: string,
  contract: {
    address: string,
    code_hash: string,
  },
  response: {
    response?: string,
    system_err?: string,
  },
}

type BatchQueryResponse = {
  batch: {
    responses: BatchQueryResponseItem[],
  }
}

export type {
  BatchQueryResponse,
};
