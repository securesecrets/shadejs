import BigNumber from 'bignumber.js';
import {
  RouteV2,
  TokensConfig,
} from '~/types';
import { RoutesCalculatorCached } from './RoutesCalculatorCached';
import { RoutesCalculatorNoCalc } from './RoutesCalculatorNoCalc';
import {
  IRoutesCalculator,
  SimpleBatchPairInfo,
} from './types';

/**
 * SwapRoutesCalculator should be instantiated once as a singleton and reused for best performance
 * during the whole lifecycle of the client-side.
 * When pools/tokens change a SwapRoutesCalculator.update should be used.
 * ```
 * const swapRoutesCalculator = new SwapRoutesCalculator(batchPairsInfo, tokensConfig);
 * swapRoutesCalculator.calculateRoutes({
 *  inputTokenAmount: BigNumber(uDenomStringAmount),
 *  ...
 * })
 * ```
 */
export class SwapRoutesCalculator {
  private readonly tokenEdges: Record<string/* tokenAddress */, string/* poolAddress */[]> = {};

  private pools: Record<string /* poolAddress */, SimpleBatchPairInfo> = {};

  private v: number = 0;

  /**
   * Used as an entry point for calculating
   * @param {BatchPairsInfo} pairs
   * @param {TokensConfig} tokens
   * @param {number} version
   */
  constructor(
    pairs: SimpleBatchPairInfo[],
    private tokens: TokensConfig,
    version: number = 0,
  ) {
    this.update({
      pairs,
      tokens,
      version,
    });
  }

  get version(): number {
    return this.v;
  }

  private set version(value: number) {
    this.v = value;
  }

  update({
    pairs,
    tokens,
    version,
  }: {
    pairs?: SimpleBatchPairInfo[],
    tokens?: TokensConfig,
    version: number,
  }) {
    if (pairs) {
      pairs.forEach((pair) => {
        const { pairContractAddress } = pair;
        // if a new pool, add the edge to the token edges (an edge is only visited once)
        if (!this.pools[pairContractAddress]) {
          const token0Address = pair.pairInfo.token0Contract.address;
          this.tokenEdges[token0Address] = this.tokenEdges[token0Address] || [];
          this.tokenEdges[token0Address].push(pairContractAddress);

          const token1Address = pair.pairInfo.token1Contract.address;
          this.tokenEdges[token1Address] = this.tokenEdges[token1Address] || [];
          this.tokenEdges[token1Address].push(pairContractAddress);
        }
        // update the info for the pool when an update comes
        this.pools[pairContractAddress] = pair;
      });
    }
    if (tokens) {
      this.tokens = tokens;
    }
    this.version = version;
  }

  getPossiblePaths(args: {
    startingTokenAddress: string,
    endingTokenAddress: string,
    maxHops: number,
  }): string[][] {
    return this.calculateRoutesAndPossiblePaths({
      ...args,
      isReverse: false,
      /* mock amount, not used by RoutesCalculatorNoCalc, as we only want paths to be built */
      inputTokenAmount: BigNumber(1_000_000),
      routesCalculator: new RoutesCalculatorNoCalc(),
    }).possiblePaths;
  }

  /**
   * @param {BigNumber} inputTokenAmount amount of tokens in udenom format (i.e 1SCRT = 1_000_000)
   * @param {string} startingTokenAddress
   * @param {string} endingTokenAddress
   * @param {number} maxHops
   * @param {boolean} isReverse
   * @returns {RouteV2[]}
   */
  calculateRoutes({
    inputTokenAmount,
    startingTokenAddress,
    endingTokenAddress,
    maxHops,
    isReverse,
  }: {
    inputTokenAmount: BigNumber,
    startingTokenAddress: string,
    endingTokenAddress: string,
    maxHops: number,
    isReverse: boolean,
  }): RouteV2[] {
    const routesCalculator = new RoutesCalculatorCached(Object.values(this.pools), this.tokens);
    return this.calculateRoutesAndPossiblePaths({
      inputTokenAmount,
      startingTokenAddress,
      endingTokenAddress,
      maxHops,
      isReverse,
      routesCalculator,
    }).routes
      .filter((route) => !route.quoteOutputAmount.isNaN());
  }

  private getNeighbours(fromTokenAddress: string): SimpleBatchPairInfo[] {
    return this.tokenEdges[fromTokenAddress].map((pairAddress) => this.pools[pairAddress]);
  }

  /**
   * returns possible routes through one or multiple pools to complete a trade of two tokens
   * also uses the provided routeCalculator to calculate each route
   */
  private calculateRoutesAndPossiblePaths({
    inputTokenAmount,
    startingTokenAddress,
    endingTokenAddress,
    maxHops,
    isReverse,
    routesCalculator,
  }: {
    inputTokenAmount: BigNumber,
    startingTokenAddress: string,
    endingTokenAddress: string,
    maxHops: number,
    isReverse: boolean,
    routesCalculator: IRoutesCalculator,
  }): {
    possiblePaths: string[][],
    routes: RouteV2[],
  } {
    // Keeps track of all the paths found from the starting token to the ending token
    const result: string[][] = [];
    const routes: RouteV2[] = [];

    // Stack to manage the state during the iterative DFS
    const stack: Array<{
      tokenAddress: string,
      depth: number,
      path: string[],
    }> = [];

    // Initialize the stack with the starting token
    stack.push({
      tokenAddress: startingTokenAddress,
      depth: 0,
      path: [],
    });

    while (stack.length > 0) {
      const {
        tokenAddress,
        depth,
        path,
      } = stack.pop()!;

      // If the current depth exceeds the maximum number of hops, skip this branch
      if (depth > maxHops) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // If we have reached the ending token, record the path and calculate the route
      if (tokenAddress === endingTokenAddress) {
        result.push([...path]);
        const calc = routesCalculator.calculatePath({
          path,
          inputTokenAmount,
          startingTokenAddress,
          endingTokenAddress,
          maxHops,
          isReverse,
        });
        if (calc) {
          routes.push(calc);
        }
        // eslint-disable-next-line no-continue
        continue;
      }

      // Iterate through all edges of the current token
      this.getNeighbours(tokenAddress).forEach((pool) => {
        // Skip pools that have already been visited
        if (path.includes(pool.pairContractAddress)) {
          return;
        }

        // Determine the next token to explore
        let nextTokenId: string;
        if (pool.pairInfo.token0Contract.address === tokenAddress) {
          nextTokenId = pool.pairInfo.token1Contract.address;
        } else {
          nextTokenId = pool.pairInfo.token0Contract.address;
        }

        // Push the next state onto the stack
        stack.push({
          tokenAddress: nextTokenId,
          depth: depth + 1,
          path: [
            ...path,
            pool.pairContractAddress,
          ],
        });
      });
    }

    return {
      possiblePaths: result,
      routes,
    };
  }
}
