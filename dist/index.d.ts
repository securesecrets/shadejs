import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { SecretNetworkClient } from 'secretjs';

declare type ClientData = {
    client: SecretNetworkClient;
    endpoint: string;
    chainId: string;
};

/**
 * Gets the active query client. If one does not exist, initialize it and stores it for
 * future use.
 * @param lcdEndpoint uses a default mainnet endpoint if one is not provided
 * @param chainId uses a default mainnet chainID if one is not provided
 */
export declare function getActiveQueryClient$(lcdEndpoint?: string, chainId?: string): Observable<ClientData>;

/**
 * Create and returns Secret Network client
 * @param walletAccount not required for making public queries
 */
export declare const getSecretNetworkClient$: ({ walletAccount, lcdEndpoint, chainId, }: {
    walletAccount?: WalletAccount | undefined;
    lcdEndpoint: string;
    chainId: string;
}) => Observable<ClientData>;

declare type ParsedOraclePriceResponse = {
    oracleKey: string;
    rate: BigNumber;
    lastUpdatedBase: number;
    lastUpdatedQuote: number;
};

declare type ParsedOraclePricesResponse = {
    [oracleKey: string]: ParsedOraclePriceResponse;
};

/**
 * query the price of an asset using the oracle key
 */
export declare const queryPrice$: ({ contractAddress, codeHash, oracleKey, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    oracleKey: string;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<ParsedOraclePriceResponse>;

/**
 * query multiple asset prices using oracle keys
 */
export declare const queryPrices$: ({ contractAddress, codeHash, oracleKeys, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    oracleKeys: string[];
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<ParsedOraclePricesResponse>;

declare type WalletAccount = WalletSigner & WalletAddress;

declare type WalletAddress = {
    walletAddress: string;
};

declare type WalletSigner = {
    signer: any;
    encryptionSeed?: Uint8Array;
    encryptionUtils?: any;
};

export { }
