import {
  of,
  defer,
  tap,
  first,
  Observable,
} from 'rxjs';
import {
  SecretNetworkClient,
} from 'secretjs';
import { createFetchClient } from '~/client/services/createFetch';
import { WalletAccount } from '~/types/wallet';
import {
  DEFAULT_SECRET_LCD_ENDPOINT,
  SECRET_MAINNET_CHAIN_ID,
} from '~/config';
import { ClientData } from '~/types/client';

/**
 * Create and returns Secret Network client
 * @param lcdEndpoint LCD endpoint to make queries to
 * @param chainId chainID string from the config of the chain
 * @param walletAccount wallet account data - not required for making public queries
 */
const getSecretNetworkClient$ = ({
  lcdEndpoint,
  chainId,
  walletAccount,
}:{

  lcdEndpoint: string,
  chainId: string,
  walletAccount?: WalletAccount
}): Observable<ClientData> => createFetchClient(defer(
  () => {
    if (walletAccount) {
      return of({
        client: new SecretNetworkClient({
          url: lcdEndpoint,
          wallet: walletAccount.signer,
          walletAddress: walletAccount.walletAddress,
          chainId,
          encryptionUtils: walletAccount.encryptionUtils,
          encryptionSeed: walletAccount.encryptionSeed,
        }),
        endpoint: lcdEndpoint,
        chainId,
      });
    }
    return of({
      client: new SecretNetworkClient({
        url: lcdEndpoint,
        chainId,
      }),
      endpoint: lcdEndpoint,
      chainId,
    });
  },
));

let activeClient: ClientData | undefined;

/**
 * Gets the active query client. If one does not exist, initialize it and stores it for
 * future use.
 * @param lcdEndpoint uses a default mainnet endpoint if one is not provided
 * @param chainId uses a default mainnet chainID if one is not provided
 */
function getActiveQueryClient$(lcdEndpoint?: string, chainId?: string) {
  // check if a client exists and return it if it does
  // as long as the endpoint and chain Id haven't changed from previous.
  if (activeClient
    && lcdEndpoint
    && lcdEndpoint === activeClient.endpoint
    && chainId
    && chainId === activeClient.chainId
  ) {
    return of(activeClient);
  }

  // if no endpoint/chainId is provided, assume mainnet and use defaults
  return getSecretNetworkClient$({
    lcdEndpoint: lcdEndpoint ?? DEFAULT_SECRET_LCD_ENDPOINT,
    chainId: chainId ?? SECRET_MAINNET_CHAIN_ID,
  }).pipe(
    tap(({ client }) => {
      activeClient = {
        client,
        endpoint: lcdEndpoint ?? DEFAULT_SECRET_LCD_ENDPOINT,
        chainId: chainId ?? SECRET_MAINNET_CHAIN_ID,
      };
    }),
    first(),
  );
}

export {
  getSecretNetworkClient$,
  getActiveQueryClient$,
};
