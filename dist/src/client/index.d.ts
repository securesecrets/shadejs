import { Observable } from 'rxjs';
import { WalletAccount } from '../types/wallet';
import { ClientData } from '../types/client';
/**
 * Create and returns Secret Network client
 * @param walletAccount not required for making public queries
 */
declare const getSecretNetworkClient$: ({ walletAccount, lcdEndpoint, chainId, }: {
    walletAccount?: WalletAccount | undefined;
    lcdEndpoint: string;
    chainId: string;
}) => Observable<ClientData>;
/**
 * Gets the active query client. If one does not exist, initialize it and stores it for
 * future use.
 * @param lcdEndpoint uses a default mainnet endpoint if one is not provided
 * @param chainId uses a default mainnet chainID if one is not provided
 */
declare function getActiveQueryClient$(lcdEndpoint?: string, chainId?: string): Observable<ClientData>;
export { getSecretNetworkClient$, getActiveQueryClient$, };
