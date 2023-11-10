import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { SecretNetworkClient } from 'secretjs';
import { TxResponse } from 'secretjs';

declare type BatchPairInfo = {
    pairContractAddress: string;
    pairInfo: PairInfo;
};

declare type BatchPairsInfo = BatchPairInfo[];

/**
 * batch query of multiple contracts/message at a time
 */
export declare const batchQuery$: ({ contractAddress, codeHash, lcdEndpoint, chainId, queries, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
    queries: BatchQuery[];
}) => Observable<BatchQueryParsedResponse>;

declare type BatchQuery = {
    id: string | number;
    contract: {
        address: string;
        codeHash: string;
    };
    queryMsg: any;
};

/**
 * batch query of multiple contracts/message at a time
 */
export declare function batchQuery({ contractAddress, codeHash, lcdEndpoint, chainId, queries, }: {
    contractAddress: string;
    codeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    queries: BatchQuery[];
}): Promise<BatchQueryParsedResponse>;

/**
 * query the pair info for multiple pools at one time
 */
export declare function batchQueryPairsInfo$({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, pairsContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    pairsContracts: Contract[];
}): Observable<BatchPairsInfo>;

/**
 * query the pair info for multiple pools at one time
 */
export declare function batchQueryPairsInfo({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, pairsContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    pairsContracts: Contract[];
}): Promise<BatchPairsInfo>;

declare type BatchQueryParsedResponse = BatchQueryParsedResponseItem[];

declare type BatchQueryParsedResponseItem = {
    id: string | number;
    response: any;
};

/**
 * query the staking info for multiple staking contracts at one time
 */
export declare function batchQueryStakingInfo$({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, stakingContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    stakingContracts: Contract[];
}): Observable<BatchStakingInfo>;

/**
 * query the staking info for multiple staking contracts at one time
 */
export declare function batchQueryStakingInfo({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, stakingContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    stakingContracts: Contract[];
}): Promise<BatchStakingInfo>;

declare type BatchSingleStakingInfo = {
    stakingContractAddress: string;
    stakingInfo: StakingInfo;
};

declare type BatchStakingInfo = BatchSingleStakingInfo[];

declare type ClientData = {
    client: SecretNetworkClient;
    endpoint: string;
    chainId: string;
};

/**
 * returns the price impact of a simulated swap of token 0 for token 1,
 * Price impact is the difference between the current market price and the
 * price you will actually pay.
 * Inputs may either be in human readable or raw form. There is no rounding performed, therefore
 * there is no risk of loss of precision
 * */
export declare function constantProductPriceImpactToken0for1({ token0LiquidityAmount, token1LiquidityAmount, token0InputAmount, }: {
    token0LiquidityAmount: BigNumber;
    token1LiquidityAmount: BigNumber;
    token0InputAmount: BigNumber;
}): BigNumber;

/**
 * returns the price impact of a simulated swap of token 1 for token 0,
 * Price impact is the difference between the current market price and the
 * price you will actually pay.
 * Inputs may either be in human readable or raw form. There is no rounding performed, therefore
 * there is no risk of loss of precision
 * */
export declare function constantProductPriceImpactToken1for0({ token0LiquidityAmount, token1LiquidityAmount, token1InputAmount, }: {
    token0LiquidityAmount: BigNumber;
    token1LiquidityAmount: BigNumber;
    token1InputAmount: BigNumber;
}): BigNumber;

/**
 * returns input of a simulated swap from token0 to token1 using the constant
 * product rule for non-stable pairs
 * The swap output is rounded to the nearest integer, so inputs should be in
 * raw number form to prevent loss of precision
 * */
export declare function constantProductReverseSwapToken0for1({ token0LiquidityAmount, token1LiquidityAmount, token1OutputAmount, fee, }: {
    token0LiquidityAmount: BigNumber;
    token1LiquidityAmount: BigNumber;
    token1OutputAmount: BigNumber;
    fee: BigNumber;
}): BigNumber;

/**
 * returns input of a simulated swap from token1 to token0 using the constant
 * product rule for non-stable pairs
 * The swap output is rounded to the nearest integer, so inputs should be in
 * raw number form to prevent loss of precision
 * */
export declare function constantProductReverseSwapToken1for0({ token0LiquidityAmount, token1LiquidityAmount, token0OutputAmount, fee, }: {
    token0LiquidityAmount: BigNumber;
    token1LiquidityAmount: BigNumber;
    token0OutputAmount: BigNumber;
    fee: BigNumber;
}): BigNumber;

/**
 * returns output of a simulated swap from token0 to token1 using the constant
 * product rule for non-stable pairs.
 * The swap output is rounded to the nearest integer, so inputs should be in
 * raw number form to prevent loss of precision
 * */
export declare function constantProductSwapToken0for1({ token0LiquidityAmount, token1LiquidityAmount, token0InputAmount, fee, }: {
    token0LiquidityAmount: BigNumber;
    token1LiquidityAmount: BigNumber;
    token0InputAmount: BigNumber;
    fee: BigNumber;
}): BigNumber;

/**
 * returns output of a simulated swap from token1 to token0 using the constant
 * product rule for non-stable pairs
 * The swap output is rounded to the nearest integer, so inputs should be in
 * raw number form to prevent loss of precision
 * */
export declare function constantProductSwapToken1for0({ token0LiquidityAmount, token1LiquidityAmount, token1InputAmount, fee, }: {
    token0LiquidityAmount: BigNumber;
    token1LiquidityAmount: BigNumber;
    token1InputAmount: BigNumber;
    fee: BigNumber;
}): BigNumber;

declare type Contract = {
    address: string;
    codeHash: string;
};

declare type ContractInstantiationInfo = {
    codeHash: string;
    id: number;
};

declare type CustomFee = {
    daoFee: number;
    lpFee: number;
};

declare type CustomIterationControls = {
    epsilon: string;
    maxIteratorNewton: number;
    maxIteratorBisect: number;
};

declare type FactoryConfig = {
    pairContractInstatiationInfo: ContractInstantiationInfo;
    lpTokenContractInstatiationInfo: ContractInstantiationInfo;
    adminAuthContract: Contract;
    authenticatorContract: Contract | null;
    defaultPairSettings: {
        lpFee: number;
        daoFee: number;
        stableLpFee: number;
        stableDaoFee: number;
        daoContract: Contract;
    };
};

declare type FactoryPair = {
    pairContract: Contract;
    token0Contract: Contract;
    token1Contract: Contract;
    isStable: boolean;
    isEnabled: boolean;
};

declare type FactoryPairs = {
    pairs: FactoryPair[];
    startIndex: number;
    endIndex: number;
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
 * @param lcdEndpoint LCD endpoint to make queries to
 * @param chainId chainID string from the config of the chain
 * @param walletAccount wallet account data - not required for making public queries
 */
export declare const getSecretNetworkClient$: ({ lcdEndpoint, chainId, walletAccount, }: {
    lcdEndpoint: string;
    chainId: string;
    walletAccount?: WalletAccount | undefined;
}) => Observable<ClientData>;

declare type HandleMsg = Record<string, unknown>;

/**
 * message to swap tokens
 */
export declare function msgSwap({ routerContractAddress, routerCodeHash, sendAmount, minExpectedReturnAmount, path, }: {
    snip20ContractAddress: string;
    snip20CodeHash?: string;
    routerContractAddress: string;
    routerCodeHash?: string;
    sendAmount: string;
    minExpectedReturnAmount: string;
    path: Paths;
}): HandleMsg;

declare type PairConfig = {
    factoryContract: Contract | null;
    lpTokenContract: Contract | null;
    stakingContract: Contract | null;
    token0Contract: Contract;
    token1Contract: Contract;
    isStable: boolean;
    fee: CustomFee | null;
};

declare type PairInfo = {
    lpTokenAmount: string;
    lpTokenContract: Contract;
    token0Contract: Contract;
    token1Contract: Contract;
    factoryContract: Contract | null;
    daoContractAddress: string;
    isStable: boolean;
    token0Amount: string;
    token1Amount: string;
    priceRatio: string | null;
    pairSettings: {
        lpFee: number;
        daoFee: number;
        stableLpFee: number;
        stableDaoFee: number;
        stableParams: StableParams | null;
    };
    contractVersion: number;
};

declare type ParsedOraclePriceResponse = {
    oracleKey: string;
    rate: string;
    lastUpdatedBase: number;
    lastUpdatedQuote: number;
};

declare type ParsedOraclePricesResponse = {
    [oracleKey: string]: ParsedOraclePriceResponse;
};

declare type ParsedSwapResponse = {
    txHash: string;
    inputTokenAddress: string | undefined;
    outputTokenAddress: string | undefined;
    inputTokenAmount: string | undefined;
    outputTokenAmount: string | undefined;
};

/**
 * parse the response from a successful token swap
 */
export declare const parseSwapResponse: (response: TxResponse) => ParsedSwapResponse;

declare type Path = {
    poolContractAddress: string;
    poolCodeHash: string;
};

declare type Paths = Path[];

/**
 * query the factory config
 */
export declare const queryFactoryConfig$: ({ contractAddress, codeHash, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<FactoryConfig>;

/**
 * query the factory config
 */
export declare function queryFactoryConfig({ contractAddress, codeHash, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<FactoryConfig>;

/**
 * query the list of pairs registered in the factory contract
 */
export declare const queryFactoryPairs$: ({ contractAddress, codeHash, startingIndex, limit, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    startingIndex: number;
    limit: number;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<FactoryPairs>;

/**
 * query the list of pairs registered in the factory contract
 */
export declare function queryFactoryPairs({ contractAddress, codeHash, startingIndex, limit, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string;
    startingIndex: number;
    limit: number;
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<FactoryPairs>;

/**
 * query the config for a pair
 */
export declare const queryPairConfig$: ({ contractAddress, codeHash, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string | undefined;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<PairConfig>;

/**
 * query the config for a pair
 */
export declare function queryPairConfig({ contractAddress, codeHash, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<PairConfig>;

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
 * query the price of an asset using the oracle key
 */
export declare function queryPrice({ contractAddress, codeHash, oracleKey, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string;
    oracleKey: string;
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<ParsedOraclePriceResponse>;

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

/**
 * query multiple asset prices using oracle keys
 */
export declare function queryPrices({ contractAddress, codeHash, oracleKeys, lcdEndpoint, chainId, }: {
    contractAddress: string;
    codeHash?: string;
    oracleKeys: string[];
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<ParsedOraclePricesResponse>;

/**
 * query a user's private snip20 balance using a viewing key
 */
export declare const querySnip20Balance$: ({ snip20ContractAddress, snip20CodeHash, userAddress, viewingKey, lcdEndpoint, chainId, }: {
    snip20ContractAddress: string;
    snip20CodeHash?: string | undefined;
    userAddress: string;
    viewingKey: string;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<string>;

/**
 * query a user's private snip20 balance using a viewing key
 */
export declare function querySnip20Balance({ snip20ContractAddress, snip20CodeHash, userAddress, viewingKey, lcdEndpoint, chainId, }: {
    snip20ContractAddress: string;
    snip20CodeHash?: string;
    userAddress: string;
    viewingKey: string;
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<string>;

/**
 * query the snip20 token info
 */
export declare const querySnip20TokenInfo$: ({ snip20ContractAddress, snip20CodeHash, lcdEndpoint, chainId, }: {
    snip20ContractAddress: string;
    snip20CodeHash?: string | undefined;
    lcdEndpoint?: string | undefined;
    chainId?: string | undefined;
}) => Observable<TokenInfo>;

/**
 * query the snip20 token info
 */
export declare function querySnip20TokenInfo({ snip20ContractAddress, snip20CodeHash, lcdEndpoint, chainId, }: {
    snip20ContractAddress: string;
    snip20CodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
}): Promise<TokenInfo>;

declare type RewardTokenInfo = {
    token: Contract;
    rewardPerSecond: string;
    rewardPerStakedToken: string;
    validTo: number;
    lastUpdated: number;
};

declare type StableParams = {
    alpha: string;
    gamma1: string;
    gamma2: string;
    oracle: Contract;
    token0Data: StableTokenData;
    token1Data: StableTokenData;
    minTradeSizeXForY: string;
    minTradeSizeYForX: string;
    maxPriceImpactAllowed: string;
    customIterationControls: CustomIterationControls | null;
};

/**
 * returns input of a simulated swap of token0 for token1 using the stableswap math
 * inputs token amounts must be passsed in as human readable form
 * */
export declare function stableReverseSwapToken0for1({ outputToken1Amount, poolToken0Amount, poolToken1Amount, priceRatio, alpha, gamma1, gamma2, liquidityProviderFee, daoFee, minTradeSizeToken0For1, minTradeSizeToken1For0, priceImpactLimit, }: {
    outputToken1Amount: BigNumber;
    poolToken0Amount: BigNumber;
    poolToken1Amount: BigNumber;
    priceRatio: BigNumber;
    alpha: BigNumber;
    gamma1: BigNumber;
    gamma2: BigNumber;
    liquidityProviderFee: BigNumber;
    daoFee: BigNumber;
    minTradeSizeToken0For1: BigNumber;
    minTradeSizeToken1For0: BigNumber;
    priceImpactLimit: BigNumber;
}): BigNumber;

/**
 * returns output of a simulated swap of token1 for token0 using the stableswap math
 * inputs token amounts must be passsed in as human readable form
 * */
export declare function stableReverseSwapToken1for0({ outputToken0Amount, poolToken0Amount, poolToken1Amount, priceRatio, alpha, gamma1, gamma2, liquidityProviderFee, daoFee, minTradeSizeToken0For1, minTradeSizeToken1For0, priceImpactLimit, }: {
    outputToken0Amount: BigNumber;
    poolToken0Amount: BigNumber;
    poolToken1Amount: BigNumber;
    priceRatio: BigNumber;
    alpha: BigNumber;
    gamma1: BigNumber;
    gamma2: BigNumber;
    liquidityProviderFee: BigNumber;
    daoFee: BigNumber;
    minTradeSizeToken0For1: BigNumber;
    minTradeSizeToken1For0: BigNumber;
    priceImpactLimit: BigNumber;
}): BigNumber;

/**
 * returns price impact of a simulated swap of token0 for token1
 * inputs token amounts must be passsed in as human readable form
 * */
export declare function stableSwapPriceImpactToken0For1({ inputToken0Amount, poolToken0Amount, poolToken1Amount, priceRatio, alpha, gamma1, gamma2, liquidityProviderFee, daoFee, minTradeSizeToken0For1, minTradeSizeToken1For0, priceImpactLimit, }: {
    inputToken0Amount: BigNumber;
    poolToken0Amount: BigNumber;
    poolToken1Amount: BigNumber;
    priceRatio: BigNumber;
    alpha: BigNumber;
    gamma1: BigNumber;
    gamma2: BigNumber;
    liquidityProviderFee: BigNumber;
    daoFee: BigNumber;
    minTradeSizeToken0For1: BigNumber;
    minTradeSizeToken1For0: BigNumber;
    priceImpactLimit: BigNumber;
}): BigNumber;

/**
 * returns price impact of a simulated swap of token1 for token0
 * inputs token amounts must be passsed in as human readable form
 * */
export declare function stableSwapPriceImpactToken1For0({ inputToken1Amount, poolToken0Amount, poolToken1Amount, priceRatio, alpha, gamma1, gamma2, liquidityProviderFee, daoFee, minTradeSizeToken0For1, minTradeSizeToken1For0, priceImpactLimit, }: {
    inputToken1Amount: BigNumber;
    poolToken0Amount: BigNumber;
    poolToken1Amount: BigNumber;
    priceRatio: BigNumber;
    alpha: BigNumber;
    gamma1: BigNumber;
    gamma2: BigNumber;
    liquidityProviderFee: BigNumber;
    daoFee: BigNumber;
    minTradeSizeToken0For1: BigNumber;
    minTradeSizeToken1For0: BigNumber;
    priceImpactLimit: BigNumber;
}): BigNumber;

/**
 * returns output of a simulated swap of token0 for token1 using the stableswap math
 * inputs token amounts must be passsed in as human readable form
 * */
export declare function stableSwapToken0for1({ inputToken0Amount, poolToken0Amount, poolToken1Amount, priceRatio, alpha, gamma1, gamma2, liquidityProviderFee, daoFee, minTradeSizeToken0For1, minTradeSizeToken1For0, priceImpactLimit, }: {
    inputToken0Amount: BigNumber;
    poolToken0Amount: BigNumber;
    poolToken1Amount: BigNumber;
    priceRatio: BigNumber;
    alpha: BigNumber;
    gamma1: BigNumber;
    gamma2: BigNumber;
    liquidityProviderFee: BigNumber;
    daoFee: BigNumber;
    minTradeSizeToken0For1: BigNumber;
    minTradeSizeToken1For0: BigNumber;
    priceImpactLimit: BigNumber;
}): BigNumber;

/**
 * returns output of a simulated swap of token1 for token0 using the stableswap math
 * inputs token amounts must be passsed in as human readable form
 * */
export declare function stableSwapToken1for0({ inputToken1Amount, poolToken0Amount, poolToken1Amount, priceRatio, alpha, gamma1, gamma2, liquidityProviderFee, daoFee, minTradeSizeToken0For1, minTradeSizeToken1For0, priceImpactLimit, }: {
    inputToken1Amount: BigNumber;
    poolToken0Amount: BigNumber;
    poolToken1Amount: BigNumber;
    priceRatio: BigNumber;
    alpha: BigNumber;
    gamma1: BigNumber;
    gamma2: BigNumber;
    liquidityProviderFee: BigNumber;
    daoFee: BigNumber;
    minTradeSizeToken0For1: BigNumber;
    minTradeSizeToken1For0: BigNumber;
    priceImpactLimit: BigNumber;
}): BigNumber;

declare type StableTokenData = {
    oracleKey: string;
    decimals: number;
};

declare type StakingInfo = {
    lpTokenContract: Contract;
    pairContractAddress: string;
    adminAuthContract: Contract;
    queryAuthContract: Contract | null;
    totalStakedAmount: string;
    rewardTokens: RewardTokenInfo[];
};

declare type TokenInfo = {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
};

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
