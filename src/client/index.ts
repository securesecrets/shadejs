import {
  of,
  defer,
  tap,
  first,
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

/**
 * Create and returns Secret Network client
 * @param walletAccount not required for making public queries
 */
const getSecretNetworkClient$ = ({
  walletAccount,
  lcdEndpoint,
  chainId,
}:{
  walletAccount?: WalletAccount
  lcdEndpoint: string,
  chainId: string,
}) => createFetchClient(defer(
  () => {
    if (walletAccount) {
      return of(new SecretNetworkClient({
        url: lcdEndpoint,
        wallet: walletAccount.signer,
        walletAddress: walletAccount.walletAddress,
        chainId,
        encryptionUtils: walletAccount.encryptionUtils,
        encryptionSeed: walletAccount.encryptionSeed,
      }));
    }
    return of(new SecretNetworkClient({
      url: lcdEndpoint,
      chainId,
    }));
  },
));

let activeClient: SecretNetworkClient | undefined;

/**
 * Gets the active query client. If one does not exist, initialize it and stores it for
 * future use.
 * @param lcdEndpoint uses a default mainnet endpoint if one is not provided
 * @param chainId uses a default mainnet chainID if one is not provided
 */
function getActiveQueryClient$(lcdEndpoint?: string, chainId?: string) {
  // check if a client exists for a given chain and return it if it exists
  if (activeClient) {
    return of(activeClient);
  }

  // if no endpoint/chainId is provided, assume mainnet and use defaults
  return getSecretNetworkClient$({
    lcdEndpoint: lcdEndpoint ?? DEFAULT_SECRET_LCD_ENDPOINT,
    chainId: chainId ?? SECRET_MAINNET_CHAIN_ID,
  }).pipe(
    tap((client) => {
      activeClient = client;
    }),
    first(),
  );
}

export {
  getSecretNetworkClient$,
  getActiveQueryClient$,
};
