import { SecretNetworkClient } from 'secretjs';
/**
 * sets up the service observable for calling the querying with the secret client
 */
declare const sendSecretClientContractQuery$: ({ queryMsg, client, contractAddress, codeHash, }: {
    queryMsg: any;
    client: SecretNetworkClient;
    contractAddress: string;
    codeHash?: string | undefined;
}) => import("rxjs").Observable<unknown>;
export { sendSecretClientContractQuery$, };
