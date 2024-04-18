import {
  switchMap,
  first,
} from 'rxjs';
import { sendSecretClientContractQuery$ } from '~/client/services/clientServices';
import { getActiveQueryClient$ } from '~/client';

/**
 * batch query of multiple contracts/message at a time
 */
const queryContract$ = ({
  contractAddress,
  codeHash,
  lcdEndpoint,
  chainId,
  queryMsg,
}:{
  contractAddress: string,
  codeHash?: string,
  lcdEndpoint?: string,
  chainId?: string,
  queryMsg: Object,
}) => getActiveQueryClient$(lcdEndpoint, chainId).pipe(
  switchMap(({ client }) => sendSecretClientContractQuery$({
    queryMsg,
    client,
    contractAddress,
    codeHash,
  })),
  first(),
);

export {
  queryContract$,
};
