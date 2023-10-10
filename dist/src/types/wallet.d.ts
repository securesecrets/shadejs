type WalletSigner = {
    signer: any;
    encryptionSeed?: Uint8Array;
    encryptionUtils?: any;
};
type WalletAddress = {
    walletAddress: string;
};
type WalletAccount = WalletSigner & WalletAddress;
export { WalletAccount, };
