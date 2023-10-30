import {
  first,
  defer,
  from,
  tap,
} from 'rxjs';
import { SecretNetworkClient } from 'secretjs';
import { createFetchClient } from '~/client/services/createFetch';
import { identifyQueryResponseErrors } from '~/errors';

import { encodeJsonToB64 } from '~/lib/utils';

/**
 * query the contract using a secret client
 */
const secretClientContractQuery$ = ({
  queryMsg,
  client,
  contractAddress,
  codeHash,
}: {
  queryMsg: any,
  client: SecretNetworkClient,
  contractAddress: string,
  codeHash?: string
}) => createFetchClient(defer(
  () => from(client.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: codeHash,
    query: queryMsg,
  })),
));

type BatchQuery = {
  contract: {
    address: string,
    code_hash: string,
  },
  query: any,
}

const secretClientBatchQuery$ = ({
  client,
  queryRouterAddress,
  queryRouterCodeHash,
  queries,
}: {
  client: SecretNetworkClient,
  queryRouterAddress: string,
  queryRouterCodeHash?: string
  queries: BatchQuery[],
}) => createFetchClient(defer(
  () => from(client.query.compute.queryContract({
    contract_address: queryRouterAddress,
    code_hash: queryRouterCodeHash,
    query: {
      batch: {
        queries: queries.map((q, i) => ({
          id: encodeJsonToB64(i),
          contract: q.contract,
          query: encodeJsonToB64(q.query),
        })),
      },
    },
  })),
));

/**
 * sets up the service observable for calling the querying with the secret client
 */
const sendSecretClientContractQuery$ = ({
  queryMsg,
  client,
  contractAddress,
  codeHash,
}: {
  queryMsg: any,
  client: SecretNetworkClient,
  contractAddress: string,
  codeHash?: string
}) => secretClientContractQuery$({
  queryMsg,
  client,
  contractAddress,
  codeHash,
})
  .pipe(
    tap((response) => identifyQueryResponseErrors(response)),
    first(),
  );

const sendSecretClientBatchQuery$ = ({
  client,
  queryRouterAddress,
  queryRouterCodeHash,
  queries,
}: {
  client: SecretNetworkClient,
  queryRouterAddress: string,
  queryRouterCodeHash?: string
  queries: BatchQuery[],
}) => secretClientBatchQuery$({
  client,
  queryRouterAddress,
  queryRouterCodeHash,
  queries,
})
  .pipe(
    tap((response) => identifyQueryResponseErrors(response)),
    first(),
  );

export {
  sendSecretClientContractQuery$,
  sendSecretClientBatchQuery$,
};
