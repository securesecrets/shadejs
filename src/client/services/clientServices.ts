import {
  first,
  defer,
  from,
  tap,
} from 'rxjs';
import { SecretNetworkClient } from 'secretjs';
import { createFetchClient } from '~/client/services/createFetch';
import { identifyQueryResponseErrors } from '~/errors';

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

export {
  sendSecretClientContractQuery$,
};
