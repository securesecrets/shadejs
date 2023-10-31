type BatchQuery = {
  id: string,
  contract: {
    address: string,
    code_hash: string,
  },
  response: {
    response: string,
  },
}

type BatchQueryResponse = {
  batch: {
    responses: BatchQuery[],
  }
}

export type {
  BatchQueryResponse,
};
