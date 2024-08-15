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
 * @param blockHeight This is an optional property to query at a specific block height
 * and may require use of an archive node depending on how far into the history data
 * is required.
 */
const secretClientContractQuery$ = ({
  queryMsg,
  client,
  contractAddress,
  codeHash,
  blockHeight,
}: {
  queryMsg: any,
  client: SecretNetworkClient,
  contractAddress: string,
  codeHash?: string
  blockHeight?: number
}) => createFetchClient(defer(
  () => from(client.query.compute.queryContract(
    {
      contract_address: contractAddress,
      code_hash: codeHash,
      query: queryMsg,
    },
    blockHeight ? [['x-cosmos-block-height', blockHeight.toString()]] : undefined,
  )),
));

/**
 * sets up the service observable for calling the querying with the secret client
 */
const sendSecretClientContractQuery$ = ({
  queryMsg,
  client,
  contractAddress,
  codeHash,
  blockHeight,
}: {
  queryMsg: any,
  client: SecretNetworkClient,
  contractAddress: string,
  codeHash?: string,
  blockHeight?: number,
}) => secretClientContractQuery$({
  queryMsg,
  client,
  contractAddress,
  codeHash,
  blockHeight,
})
  .pipe(
    tap((response) => identifyQueryResponseErrors(response)),
    first(),
  );

export {
  sendSecretClientContractQuery$,
};
