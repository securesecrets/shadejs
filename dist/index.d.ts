import BigNumber from 'bignumber.js';
import { Observable } from 'rxjs';
import { SecretNetworkClient } from 'secretjs';
import { TxResponse } from 'secretjs';

declare type AMMPair = {
    pair: TokenPair;
    address: string;
    code_hash: string;
    enabled: boolean;
};

declare type AMMSettings = {
    lp_fee: Fee;
    shade_dao_fee: Fee;
    stable_lp_fee: Fee;
    stable_shade_dao_fee: Fee;
    shade_dao_address: Contract;
};

declare type BalanceResponse = {
    balance: {
        amount: string;
    };
};

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

declare type BatchQuery_2 = {
    id: string;
    contract: {
        address: string;
        code_hash: string;
    };
    response: {
        response: string;
    };
};

/**
 * query the pair info for multiple pools at one time
 */
export declare function batchQueryPairsInfo$({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, pairsContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    pairsContracts: Contract_2[];
}): Observable<BatchPairsInfo>;

/**
 * query the pair info for multiple pools at one time
 */
export declare function batchQueryPairsInfo({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, pairsContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    pairsContracts: Contract_2[];
}): Promise<BatchPairsInfo>;

export declare type BatchQueryParsedResponse = BatchQueryParsedResponseItem[];

export declare type BatchQueryParsedResponseItem = {
    id: string | number;
    response: any;
};

declare type BatchQueryResponse = {
    batch: {
        responses: BatchQuery_2[];
    };
};

/**
 * query the staking info for multiple staking contracts at one time
 */
export declare function batchQueryStakingInfo$({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, stakingContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    stakingContracts: Contract_2[];
}): Observable<BatchStakingInfo>;

/**
 * query the staking info for multiple staking contracts at one time
 */
export declare function batchQueryStakingInfo({ queryRouterContractAddress, queryRouterCodeHash, lcdEndpoint, chainId, stakingContracts, }: {
    queryRouterContractAddress: string;
    queryRouterCodeHash?: string;
    lcdEndpoint?: string;
    chainId?: string;
    stakingContracts: Contract_2[];
}): Promise<BatchStakingInfo>;

declare type BatchSingleStakingInfo = {
    stakingContractAddress: string;
    stakingInfo: StakingInfo;
};

declare type BatchStakingInfo = BatchSingleStakingInfo[];

/**
 * calculates the estimated output of swapping through a route given an input token amount
 * and also transforms the data collected in each pool into the Route data model
 */
export declare function calculateRoute({ inputTokenAmount, inputTokenContractAddress, path, pairs, tokens, }: {
    inputTokenAmount: BigNumber;
    inputTokenContractAddress: string;
    path: string[];
    pairs: BatchPairsInfo;
    tokens: TokensConfig;
}): Route;

declare type ClientData = {
    client: SecretNetworkClient;
    endpoint: string;
    chainId: string;
};

declare type Coin = {
    denom: string;
    amount: string;
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
    code_hash: string;
};

declare type Contract_2 = {
    address: string;
    codeHash: string;
};

declare type ContractInstantiationInfo = {
    code_hash: string;
    id: number;
};

declare type ContractInstantiationInfo_2 = {
    codeHash: string;
    id: number;
};

/**
 * Convert from uDenom to the human readable equivalent as BigNumber type
 */
export declare const convertCoinFromUDenom: (amount: number | string | BigNumber, decimals: number) => BigNumber;

/**
 * Convert BigNumber to the uDenom string type
 */
export declare const convertCoinToUDenom: (amount: BigNumber | number | string, decimals: number) => string;

declare type CustomFee = {
    shade_dao_fee: Fee;
    lp_fee: Fee;
};

declare type CustomFee_2 = {
    daoFee: number;
    lpFee: number;
};

declare type CustomIterationControls = {
    epsilon: string;
    max_iter_newton: number;
    max_iter_bisect: number;
};

declare type CustomIterationControls_2 = {
    epsilon: string;
    maxIteratorNewton: number;
    maxIteratorBisect: number;
};

declare type CustomToken = {
    custom_token: {
        contract_addr: string;
        token_code_hash: string;
    };
};

export declare const decodeB64ToJson: (encodedData: string) => any;

export declare const encodeJsonToB64: (toEncode: any) => string;

declare type FactoryConfig = {
    pairContractInstatiationInfo: ContractInstantiationInfo_2;
    lpTokenContractInstatiationInfo: ContractInstantiationInfo_2;
    adminAuthContract: Contract_2;
    authenticatorContract: Contract_2 | null;
    defaultPairSettings: {
        lpFee: number;
        daoFee: number;
        stableLpFee: number;
        stableDaoFee: number;
        daoContract: Contract_2;
    };
};

declare type FactoryConfigResponse = {
    get_config: {
        pair_contract: ContractInstantiationInfo;
        amm_settings: AMMSettings;
        lp_token_contract: ContractInstantiationInfo;
        authenticator: Contract | null;
        admin_auth: Contract;
    };
};

declare type FactoryPair = {
    pairContract: Contract_2;
    token0Contract: Contract_2;
    token1Contract: Contract_2;
    isStable: boolean;
    isEnabled: boolean;
};

declare type FactoryPairs = {
    pairs: FactoryPair[];
    startIndex: number;
    endIndex: number;
};

declare type FactoryPairsResponse = {
    list_a_m_m_pairs: {
        amm_pairs: AMMPair[];
    };
};

declare type Fee = {
    nom: number;
    denom: number;
};

/**
 * Generates random string of characters, used to add entropy to TX data
 * */
export declare const generatePadding: () => string;

/**
 * Gets the active query client. If one does not exist, initialize it and stores it for
 * future use.
 * @param lcdEndpoint uses a default mainnet endpoint if one is not provided
 * @param chainId uses a default mainnet chainID if one is not provided
 */
export declare function getActiveQueryClient$(lcdEndpoint?: string, chainId?: string): Observable<ClientData>;

/**
 * retuns possible paths through one or multiple pools to complete a trade of two tokens
 */
export declare function getPossiblePaths({ inputTokenContractAddress, outputTokenContractAddress, maxHops, pairs, }: {
    inputTokenContractAddress: string;
    outputTokenContractAddress: string;
    maxHops: number;
    pairs: BatchPairsInfo;
}): string[][];

/**
 * retrieves all potential route options and the outputs of each route.
 * returns an array of routes in the order that will give the highest quoted
 * output amount
 */
export declare function getRoutes({ inputTokenAmount, inputTokenContractAddress, outputTokenContractAddress, maxHops, pairs, tokens, }: {
    inputTokenAmount: BigNumber;
    inputTokenContractAddress: string;
    outputTokenContractAddress: string;
    maxHops: number;
    pairs: BatchPairsInfo;
    tokens: TokensConfig;
}): Route[];

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
 * batch query multiple contracts/messages at one time
 */
export declare const msgBatchQuery: (queries: BatchQuery[]) => {
    batch: {
        queries: {
            id: string;
            contract: {
                address: string;
                code_hash: string;
            };
            query: string;
        }[];
    };
};

/**
 * Query the factory config
 */
export declare const msgQueryFactoryConfig: () => {
    get_config: {};
};

/**
 * Query the factory for a list of registered pairs
 * @param startingIndex index of the list to return data from
 * @param limit number of entries to be returned
 */
export declare const msgQueryFactoryPairs: (startIndex: number, limit: number) => {
    list_a_m_m_pairs: {
        pagination: {
            start: number;
            limit: number;
        };
    };
};

/**
 * Query single price from the oracle contract
 */
export declare const msgQueryOraclePrice: (oracleKey: string) => {
    get_price: {
        key: string;
    };
};

/**
 * Query muliple prices from the oracle contract
 */
export declare const msgQueryOraclePrices: (oracleKeys: string[]) => {
    get_prices: {
        keys: string[];
    };
};

/**
 * Query the pair config
 */
export declare const msgQueryPairConfig: () => {
    get_config: {};
};

/**
 * Query the pair info
 */
export declare const msgQueryPairInfo: () => {
    get_pair_info: {};
};

/**
 * Query the staking config
 */
export declare const msgQueryStakingConfig: () => {
    get_config: {};
};

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

declare type OraclePriceResponse = {
    key: string;
    data: {
        rate: string;
        last_updated_base: number;
        last_updated_quote: number;
    };
};

declare type OraclePricesResponse = OraclePriceResponse[];

declare type PairConfig = {
    factoryContract: Contract_2 | null;
    lpTokenContract: Contract_2 | null;
    stakingContract: Contract_2 | null;
    token0Contract: Contract_2;
    token1Contract: Contract_2;
    isStable: boolean;
    fee: CustomFee_2 | null;
};

declare type PairConfigResponse = {
    get_config: {
        factory_contract: Contract | null;
        lp_token: Contract | null;
        staking_contract: Contract | null;
        pair: TokenPair;
        custom_fee: CustomFee | null;
    };
};

declare type PairInfo = {
    lpTokenAmount: string;
    lpTokenContract: Contract_2;
    token0Contract: Contract_2;
    token1Contract: Contract_2;
    factoryContract: Contract_2 | null;
    daoContractAddress: string;
    isStable: boolean;
    token0Amount: string;
    token1Amount: string;
    lpFee: number;
    daoFee: number;
    stableParams: StableParams | null;
    contractVersion: number;
};

declare type PairInfoResponse = {
    get_pair_info: {
        liquidity_token: Contract;
        factory: Contract | null;
        pair: TokenPair;
        amount_0: string;
        amount_1: string;
        total_liquidity: string;
        contract_version: number;
        fee_info: {
            shade_dao_address: string;
            lp_fee: Fee;
            shade_dao_fee: Fee;
            stable_lp_fee: Fee;
            stable_shade_dao_fee: Fee;
        };
        stable_info: StableInfo | null;
    };
};

export declare const parseBalance: (response: BalanceResponse) => string;

/**
 * a parses the batch query response into a usable data model
 */
export declare function parseBatchQuery(response: BatchQueryResponse): BatchQueryParsedResponse;

/**
 * parses the pair info reponse from a batch query of
 * multiple pair contracts
 */
export declare const parseBatchQueryPairInfoResponse: (response: BatchQueryParsedResponse) => BatchPairsInfo;

/**
 * parses the staking info reponse from a batch query of
 * multiple staking contracts
 */
export declare const parseBatchQueryStakingInfoResponse: (response: BatchQueryParsedResponse) => BatchStakingInfo;

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
 * parses the factory config to a usable data model
 */
export declare function parseFactoryConfig(response: FactoryConfigResponse): FactoryConfig;

/**
 * parses the list of factory pairs to a usable data model
 */
export declare function parseFactoryPairs({ response, startingIndex, limit, }: {
    response: FactoryPairsResponse;
    startingIndex: number;
    limit: number;
}): FactoryPairs;

/**
 * parses the pair config data into a usable data model
 */
export declare function parsePairConfig(response: PairConfigResponse): PairConfig;

/**
 * parses the single pair info response
 */
export declare function parsePairInfo(response: PairInfoResponse): PairInfo;

/**
 * Parses the contract price query into the app data model
 */
export declare const parsePriceFromContract: (response: OraclePriceResponse) => ParsedOraclePriceResponse;

/**
 * Parses the contract prices query into the app data model
 */
export declare function parsePricesFromContract(pricesResponse: OraclePricesResponse): ParsedOraclePricesResponse;

/**
 * parses the single staking info response
 */
export declare function parseStakingInfo(response: StakingConfigResponse): StakingInfo;

/**
 * parse the response from a successful token swap
 */
export declare const parseSwapResponse: (response: TxResponse) => ParsedSwapResponse;

export declare const parseTokenInfo: (response: TokenInfoResponse) => TokenInfo;

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
    decimals: number;
    reward_per_second: string;
    reward_per_staked_token: string;
    valid_to: number;
    last_updated: number;
};

declare type RewardTokenInfo_2 = {
    token: Contract_2;
    rewardPerSecond: string;
    rewardPerStakedToken: string;
    validTo: number;
    lastUpdated: number;
};

declare type Route = {
    inputAmount: BigNumber;
    quoteOutputAmount: BigNumber;
    quoteShadeDaoFee: BigNumber;
    quoteLPFee: BigNumber;
    priceImpact: BigNumber;
    inputTokenContractAddress: string;
    outputTokenContractAddress: string;
    path: string[];
    gasMultiplier: number;
};

export declare const snip20: {
    queries: {
        getBalance(address: string, key: string): {
            balance: {
                address: string;
                key: string;
            };
        };
        tokenInfo(): {
            token_info: {};
        };
    };
    messages: {
        send({ recipient, recipientCodeHash, amount, handleMsg, padding, }: {
            recipient: string;
            recipientCodeHash?: string | undefined;
            amount: string;
            handleMsg: any;
            padding?: string | undefined;
        }): Snip20MessageRequest;
        transfer({ recipient, amount, padding, }: {
            recipient: string;
            amount: string;
            padding?: string | undefined;
        }): Snip20MessageRequest;
        deposit(amount: string, denom: string): Snip20MessageRequest;
        redeem({ amount, denom, padding, }: {
            amount: string;
            denom: string;
            padding?: string | undefined;
        }): Snip20MessageRequest;
        increaseAllowance({ spender, amount, expiration, padding, }: {
            spender: string;
            amount: string;
            expiration?: number | undefined;
            padding?: string | undefined;
        }): Snip20MessageRequest;
        createViewingKey(viewingKey: string, padding?: string): Snip20MessageRequest;
    };
};

declare type Snip20MessageRequest = {
    msg: HandleMsg;
    transferAmount?: Coin;
};

declare type StableInfo = {
    stable_params: {
        a: string;
        gamma1: string;
        gamma2: string;
        oracle: Contract;
        min_trade_size_x_for_y: string;
        min_trade_size_y_for_x: string;
        max_price_impact_allowed: string;
        custom_iteration_controls: CustomIterationControls | null;
    };
    stable_token0_data: StableTokenData;
    stable_token1_data: StableTokenData;
    p: string | null;
};

declare type StableParams = {
    priceRatio: string;
    alpha: string;
    gamma1: string;
    gamma2: string;
    oracle: Contract_2;
    token0Data: StableTokenData_2;
    token1Data: StableTokenData_2;
    minTradeSizeXForY: string;
    minTradeSizeYForX: string;
    maxPriceImpactAllowed: string;
    customIterationControls: CustomIterationControls_2 | null;
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
    oracle_key: string;
    decimals: number;
};

declare type StableTokenData_2 = {
    oracleKey: string;
    decimals: number;
};

declare type StakingConfigResponse = {
    lp_token: Contract;
    amm_pair: string;
    admin_auth: Contract;
    query_auth: Contract | null;
    total_amount_staked: string;
    reward_tokens: RewardTokenInfo[];
};

declare type StakingInfo = {
    lpTokenContract: Contract_2;
    pairContractAddress: string;
    adminAuthContract: Contract_2;
    queryAuthContract: Contract_2 | null;
    totalStakedAmount: string;
    rewardTokens: RewardTokenInfo_2[];
};

declare type TokenConfig = {
    tokenContractAddress: string;
    decimals: number;
};

declare type TokenInfo = {
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
};

declare type TokenInfoResponse = {
    token_info: {
        name: string;
        symbol: string;
        decimals: number;
        total_supply: string;
    };
};

declare type TokenPair = [CustomToken, CustomToken, boolean];

declare type TokensConfig = TokenConfig[];

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
