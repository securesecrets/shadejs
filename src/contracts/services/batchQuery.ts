import {
  switchMap,
  first,
  map,
  lastValueFrom,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { getActiveQueryClient$ } from '~/client';
import { msgBatchQuery } from '~/contracts/definitions/batchQuery';
import {
  BatchQueryParams,
  BatchQueryParsedResponseItem,
  BatchQueryParsedResponse,
  BatchItemResponseStatus,
} from '~/types/contracts/batchQuery/model';
import { BatchQueryResponse } from '~/types/contracts/batchQuery/response';
import { decodeB64ToJson } from '~/lib/utils';

/**
 * a parses the batch query response into a usable data model
 */
function parseBatchQuery(response: BatchQueryResponse): BatchQueryParsedResponse {
  const { responses } = response.batch;
  return responses.map((item): BatchQueryParsedResponseItem => {
    // handle error state
    if (item.response.system_err) {
      return {
        id: decodeB64ToJson(item.id),
        response: item.response.system_err, // response is not B64 encoded
        status: BatchItemResponseStatus.ERROR,
      };
    }

    // handle success state
    return {
      id: decodeB64ToJson(item.id),
      // non-null asertation used here because non-error states will have
      // a response available.
      response: decodeB64ToJson(item.response.response!),
      status: BatchItemResponseStatus.SUCCESS,
    };
  });
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
  queries: BatchQueryParams[]
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

/**
 * batch query of multiple contracts/message at a time
 */
async function batchQuery({
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
  queries: BatchQueryParams[]
}) {
  return lastValueFrom(batchQuery$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    queries,
  }));
}

export {
  parseBatchQuery,
  batchQuery$,
  batchQuery,
};
