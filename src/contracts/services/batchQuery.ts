import {
  switchMap,
  first,
  map,
  lastValueFrom,
  forkJoin,
  concatAll,
  reduce,
  catchError,
  of,
  throwError,
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
import { SecretNetworkClient } from 'secretjs';
import { MinBlockHeightValidationOptions } from '~/types/contracts/batchQuery/service';

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
        blockHeight: response.batch.block_height,
      };
    }

    // handle success state
    return {
      id: decodeB64ToJson(item.id),
      // non-null asertation used here because non-error states will have
      // a response available.
      response: decodeB64ToJson(item.response.response!),
      status: BatchItemResponseStatus.SUCCESS,
      blockHeight: response.batch.block_height,
    };
  });
}

// Function to divide an array of queries into batches of arrays
function divideSingleBatchIntoArrayOfMultipleBatches(array: BatchQueryParams[], batchSize: number) {
  const batches = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

/**
 * batch query of multiple contracts/message at a time
 */
const batchQuerySingleBatch$ = ({
  contractAddress,
  codeHash,
  queries,
  client,
  minBlockHeightValidationOptions,
}:{
  contractAddress: string,
  codeHash?: string,
  queries: BatchQueryParams[],
  client: SecretNetworkClient,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) => {
  let retryCount = 0;
  return of(1).pipe( // placeholder observable of(1) used here so that we can start a data stream
    // and retry from this level when certain error conditions are reached
    switchMap(() => sendSecretClientContractQuery$({
      queryMsg: msgBatchQuery(queries),
      client,
      contractAddress,
      codeHash,
    }).pipe(
      map((response) => response as BatchQueryResponse), // map used for typecast only
      switchMap((response) => {
      // create an error if stale node is detected
        if (minBlockHeightValidationOptions
          && response.batch.block_height < minBlockHeightValidationOptions.minBlockHeight
        ) {
        // callback for when stale node is detected. Useful for error logging.
        // check the retryCount to ensure that this only fires one time
          if (retryCount === 0
            && typeof minBlockHeightValidationOptions.onStaleNodeDetected === 'function') {
            minBlockHeightValidationOptions.onStaleNodeDetected();
          }
          return throwError(() => new Error('Stale node detected'));
        }
        return of(response);
      }),
      map(parseBatchQuery),
    )),
    first(),
    catchError((error, caught) => {
      if (error.message === 'Stale node detected') {
        retryCount += 1;
        if (
          minBlockHeightValidationOptions
          && retryCount <= minBlockHeightValidationOptions?.maxRetries
        ) {
          // retry the query
          return caught;
        }
        return throwError(() => new Error('Reached maximum retry attempts for stale node error.'));
      } if (error.message.includes('{wasm contract}')) {
        return throwError(() => new Error('{wasm contract} error that typically occurs when batch size is too large and node gas query limits are exceeded. Consider reducing the batch size.'));
      }
      return throwError(() => error);
    }),
  );
};

/**
 * batch query of multiple contracts/message at a time
 * @param batchSize defaults to processing all queries in a single batch
 * when the batchSize is not passed in.
 */
const batchQuery$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queries,
  batchSize,
  minBlockHeightValidationOptions,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  queries: BatchQueryParams[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) => {
  // if batch size is passed in, convert single batch into multiple batches,
  // otherwise process all data in a single batch
  const batches = batchSize
    ? divideSingleBatchIntoArrayOfMultipleBatches(queries, batchSize)
    : [queries]; // array of arrays required for the forkJoin

  return getActiveQueryClient$(lcdEndpoint, chainId).pipe(
    switchMap(({ client }) => forkJoin(
      batches.map((batch) => batchQuerySingleBatch$({
        contractAddress,
        codeHash,
        queries: batch,
        client,
        minBlockHeightValidationOptions,
      })),
    ).pipe(
      concatAll(),
      reduce((
        acc: BatchQueryParsedResponse,
        curr: BatchQueryParsedResponse,
      ) => acc.concat(curr), []), // Flatten nested arrays into a single array
      first(),
    )),
  );
};

/**
 * batch query of multiple contracts/message at a time
 * @param batchSize defaults to processing all queries in a single batch
 * when the batchSize is not passed in.
 */
async function batchQuery({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queries,
  batchSize,
  minBlockHeightValidationOptions,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  queries: BatchQueryParams[],
  batchSize?: number,
  minBlockHeightValidationOptions?: MinBlockHeightValidationOptions,
}) {
  return lastValueFrom(batchQuery$({
    contractAddress,
    codeHash,
    lcdEndpoint,
    chainId,
    queries,
    batchSize,
    minBlockHeightValidationOptions,
  }));
}

export {
  parseBatchQuery,
  batchQuery$,
  batchQuery,
  batchQuerySingleBatch$,
  divideSingleBatchIntoArrayOfMultipleBatches,
};
