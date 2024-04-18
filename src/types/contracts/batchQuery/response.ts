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
    block_height: number,
    responses: BatchQueryResponseItem[],
  }
}

export type {
  BatchQueryResponse,
};
