import {
  switchMap,
  first,
  map,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { getActiveQueryClient$ } from '~/client';
import { msgBatchQuery } from '~/contracts/definitions/batchQuery';
import {
  BatchQuery,
  BatchQueryParsedResponseItem,
  BatchQueryParsedResponse,
} from '~/types/contracts/bathQuery/model';
import { BatchQueryResponse } from '~/types/contracts/bathQuery/response';
import { decodeB64ToJson } from '~/lib/utils';

/**
 * a parses the batch query response into a usable data model
 */
function parseBatchQuery(response: BatchQueryResponse): BatchQueryParsedResponse {
  const { responses } = response.batch;
  return responses.map((item): BatchQueryParsedResponseItem => ({
    id: decodeB64ToJson(item.id),
    response: decodeB64ToJson(item.response.response),
  }));
}

/**
 * batch query of multiple contracts/message at a time
 */
const batchQuery$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queries,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  queries: BatchQuery[]
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg: msgBatchQuery(queries),
    client,
    contractAddress,
    codeHash,
  })),
  map((response) => parseBatchQuery(response as BatchQueryResponse)),
  first(),
);

export {
  parseBatchQuery,
  batchQuery$,
};
