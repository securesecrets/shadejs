import {
  describe,
  expect,
  test,
} from 'vitest';
import { isBigNumberWithinMarginOfError } from '~/lib/test';
import BigNumber from 'bignumber.js';
import {
  getRoutesV2,
  SwapRoutesCalculator,
} from '~/lib/swap';
import {
  forwardCalculateSingle,
  reverseCalculateSingle,
} from '~/lib/swap/v2/routeCalculator/calculateSingle';
import { RoutesCalculatorCached } from '~/lib/swap/v2/routeCalculator/RoutesCalculatorCached';

import {
  batchPairsInfoMock,
  batchPairsInfoMockForComplexRoute,
  tokenConfigMock,
} from '~/test/mocks/swap/router';
import { SwapType } from '~/lib/swap/v2/gasEstimation/oracleCosts';

function toV2Output(output: {
    'inputAmount': BigNumber,
    'priceImpact': BigNumber,
    'quoteLPFee': BigNumber,
    'quoteOutputAmount': BigNumber,
    'quoteShadeDaoFee': BigNumber,
    'route': {
      'address': string,
      'codeHash': string,
      'daoFee': BigNumber,
      'iterationsCount': number | undefined,
      'liquidityProviderFee': BigNumber,
      'pair': {
        'token0Id': string,
        'token1Id': string,
      },
    }[],
  'sourceTokenId': string,
  'targetTokenId': string
}) {
  return {
    inputAmount: output.inputAmount,
    inputTokenContractAddress: output.sourceTokenId,
    iterationsCount: output.route.reduce((acc, r) => acc + (r.iterationsCount || 0), 0),
    outputTokenContractAddress: output.targetTokenId,
    path: output.route.map((r) => {
      const batchPairInfo = batchPairsInfoMock.find((p) => p.pairContractAddress
        === r.address)!;
      return ({
        pair: [
          batchPairInfo.pairInfo.token0Contract,
          batchPairInfo.pairInfo.token1Contract,
        ],
        poolCodeHash: r.codeHash,
        poolContractAddress: r.address,
        poolType: r.iterationsCount ? SwapType.STABLE : SwapType.CONSTANT_PRODUCT,
        stableOracleKeys: batchPairInfo.pairInfo.stableParams ? [
          batchPairInfo.pairInfo.stableParams.token0Data.oracleKey,
          batchPairInfo.pairInfo.stableParams.token0Data.oracleKey,
        ] : null,
      });
    }),
    priceImpact: output.priceImpact,
    quoteLPFee: output.quoteLPFee,
    quoteOutputAmount: output.quoteOutputAmount,
    quoteShadeDaoFee: output.quoteShadeDaoFee,
  };
}

function getPairInfo(poolAddress: string) {
  return batchPairsInfoMock.find((d) => d.pairContractAddress === poolAddress)!;
}
function getPossiblePathsToCompare(a: string[][]): string {
  return a.map((b) => b.join(',')).sort().join('_');
}

function testPossiblePaths(
  simplePoolsSwapRouteCalculator: SwapRoutesCalculator,
  input3: {
    maxHops: number,
    endingTokenAddress: string,
    startingTokenAddress: string,
  },
  output3: string[][],
) {
  expect(getPossiblePathsToCompare(simplePoolsSwapRouteCalculator.getPossiblePaths(input3)))
    .toStrictEqual(getPossiblePathsToCompare(output3));
}

describe('production routing', () => {
  test('it can generate possible route paths', () => {
    // Returns single pair
    //
    // pool1
    // (A-B)
    const output1 = [['CONTRACT_ADDRESS_PAIR_1']];
    const simplePoolsSwapRouteCalculator = new SwapRoutesCalculator(
      batchPairsInfoMock,
      tokenConfigMock,
    );

    expect(simplePoolsSwapRouteCalculator.getPossiblePaths({
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      endingTokenAddress: 'TOKEN_B_CONTRACT_ADDRESS',
      maxHops: 5,
    })).toStrictEqual(output1);

    // **************************************************
    // Returns a linear path
    //
    // pool1 -> pool2 -> pool3
    // (A-B) -> (B-C) -> (D-C)
    const output2 = [
      [
        'CONTRACT_ADDRESS_PAIR_1',
        'CONTRACT_ADDRESS_PAIR_2',
        'CONTRACT_ADDRESS_PAIR_3',
      ],
    ];
    expect(simplePoolsSwapRouteCalculator.getPossiblePaths({
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      endingTokenAddress: 'TOKEN_D_CONTRACT_ADDRESS',
      maxHops: 5,
    })).toStrictEqual(output2);

    // **************************************************
    // Returns circular pair of routes
    //
    // E -- pool4 -- F -- pool5 -- G -- pool6
    //      (E-F)         (G-F)         (G-H)
    //        |                            |
    //        F                            H
    //        |                            |
    //      pool7 -- I -- pool8 -- H --  pool9 -- J
    //      (F-I)         (I-H)           (H-J)
    const output3 = [
      [
        'CONTRACT_ADDRESS_PAIR_4',
        'CONTRACT_ADDRESS_PAIR_5',
        'CONTRACT_ADDRESS_PAIR_6',
        'CONTRACT_ADDRESS_PAIR_9',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_4',
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_9',
      ],
    ];
    const input3 = {
      startingTokenAddress: 'TOKEN_E_CONTRACT_ADDRESS',
      endingTokenAddress: 'TOKEN_J_CONTRACT_ADDRESS',
      maxHops: 5,
    };
    testPossiblePaths(simplePoolsSwapRouteCalculator, input3, output3);

    // **************************************************
    //   A complex route
    //           F
    //         /   \
    //        /     \
    //       1       2
    //     (A-F)    (F-D)
    //     /           \
    //    /      3      \        4
    //   A --- (A-D) --- D --- (D-G) --- G
    //   |\            / |
    //   | \          /  |
    //   |  5        6   |
    //   | (A-C)   (D-C) |
    //   |    \     /    |
    //   7     \   /     8
    // (A-B)     C     (D-E)
    //   |      /  \     |
    //   |    9     10   |
    //   |  (C-B)  (C-E) |
    //   |  /         \  |
    //   | /    11     \ |
    //   B --- (B-E) --- E

    const output4 = [
      [
        'CONTRACT_ADDRESS_PAIR_1',
        'CONTRACT_ADDRESS_PAIR_2',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_3',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_3',
        'CONTRACT_ADDRESS_PAIR_6',
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_3',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_6',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_5',
        'CONTRACT_ADDRESS_PAIR_6',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_5',
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_5',
        'CONTRACT_ADDRESS_PAIR_9',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_5',
        'CONTRACT_ADDRESS_PAIR_9',
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_3',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_9',
        'CONTRACT_ADDRESS_PAIR_6',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_6',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_9',
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_8',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
      [
        'CONTRACT_ADDRESS_PAIR_7',
        'CONTRACT_ADDRESS_PAIR_9',
        'CONTRACT_ADDRESS_PAIR_5',
        'CONTRACT_ADDRESS_PAIR_3',
        'CONTRACT_ADDRESS_PAIR_4',
      ],
    ];
    const complexPoolsSwapRouteCalculator = new SwapRoutesCalculator(
      batchPairsInfoMockForComplexRoute,
      tokenConfigMock,
    );

    const input4 = {
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      endingTokenAddress: 'TOKEN_G_CONTRACT_ADDRESS',
      maxHops: 5,
    };
    testPossiblePaths(complexPoolsSwapRouteCalculator, input4, output4);
  });

  test('it can calculate the output of a single pool swap route', () => {
    // Single Pool calculations
    //
    // Pool 1: A-B
    //
    // Pool A-B params
    // Liquidity A: 111,111,111
    // Liquidity B: 222,222,222
    // Dao Fee: 0.1
    // LP Fee: 0.2
    //
    const output1 = toV2Output({
      inputAmount: BigNumber('1000000000'),
      quoteOutputAmount: BigNumber('1939982540'),
      quoteShadeDaoFee: BigNumber(0.01),
      quoteLPFee: BigNumber(0.02),
      priceImpact: BigNumber('0.000009000000009'),
      sourceTokenId: 'TOKEN_A_CONTRACT_ADDRESS',
      targetTokenId: 'TOKEN_B_CONTRACT_ADDRESS',
      route: [
        {
          pair: {
            token0Id: 'TOKEN_A_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_B_CONTRACT_ADDRESS',
          },
          iterationsCount: undefined,
          address: 'CONTRACT_ADDRESS_PAIR_1',
          codeHash: 'CONTRACT_HASH_PAIR_1',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.02),
        },
      ],
    });
    expect(forwardCalculateSingle({
      startingTokenAmount: BigNumber('1000000000'),
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_1'),
      tokens: tokenConfigMock,
    })).toStrictEqual(output1);

    expect(reverseCalculateSingle({
      endingTokenAmount: BigNumber('1939982540'),
      endingTokenAddress: 'TOKEN_B_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_1'),
      tokens: tokenConfigMock,
    })).toStrictEqual(output1);
  });

  test('it can calculate the output of a multi-hop constant product swap route', () => {
    // **************************************************
    // Constant Product Rule Only
    //
    // Pool 2 has order of token0 and token1 flipped
    // i.e.   A-B -> C-B -> C-D
    //
    // Pool A-B params
    // Liquidity A: 111,111,111
    // Liquidity B: 222,222,222
    // dao Fee: 0.01
    // liquidity provider Fee: 0.02
    //
    // Pool C-B params
    // Liquidity C: 333,333,333
    // Liquidity B: 4,444,444,444
    // dao Fee: 0.01
    // liquidity provider Fee: 0.01
    //
    // Pool C-B params
    // Liquidity C: 5,555,555,555
    // Liquidity D: 66,666,666
    // dao Fee: 0.02
    // liquidity provider Fee: 0.02

    const routeCalculator = new RoutesCalculatorCached(
      batchPairsInfoMock,
      tokenConfigMock,
    );

    // Pool A-B
    const constantProductSwap1Output = forwardCalculateSingle({
      startingTokenAmount: BigNumber('1000000000'),
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_1'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // pool C-B
    const constantProductSwap2Output = forwardCalculateSingle({
      startingTokenAmount: constantProductSwap1Output,
      startingTokenAddress: 'TOKEN_B_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_2'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // pool C-D
    const constantProductSwap3Output = forwardCalculateSingle({
      startingTokenAmount: constantProductSwap2Output,
      startingTokenAddress: 'TOKEN_C_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_3'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;
    // combine into multi-hop routing (FORWARD)
    const calculatedRouteResult = routeCalculator.calculatePath({
      inputTokenAmount: BigNumber('1000000000'),
      endingTokenAddress: 'TOKEN_C_CONTRACT_ADDRESS',
      isReverse: false,
      maxHops: Number.MAX_VALUE,
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      path: [
        'CONTRACT_ADDRESS_PAIR_1',
        'CONTRACT_ADDRESS_PAIR_2',
        'CONTRACT_ADDRESS_PAIR_3',
      ],
    });

    // REVERSE CALCULATION

    // pool C-D
    const constantProductReverseSwap1Input = reverseCalculateSingle({
      endingTokenAmount: BigNumber('1642621'),
      endingTokenAddress: 'TOKEN_D_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_3'),
      tokens: tokenConfigMock,
    }).inputAmount;

    // pool C-B
    const constantProductSwapReverse2Input = reverseCalculateSingle({
      endingTokenAmount: constantProductReverseSwap1Input,
      endingTokenAddress: 'TOKEN_C_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_2'),
      tokens: tokenConfigMock,
    }).inputAmount;

    // Pool A-B
    const constantProductSwapReverse3Route = reverseCalculateSingle({
      endingTokenAmount: constantProductSwapReverse2Input,
      endingTokenAddress: 'TOKEN_B_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_1'),
      tokens: tokenConfigMock,
    });

    // combine into multi-hop routing (REVERSE)
    const calculatedRouteReverseResult = routeCalculator.calculatePath({
      inputTokenAmount: BigNumber('1642621'),
      endingTokenAddress: 'TOKEN_D_CONTRACT_ADDRESS',
      isReverse: true,
      maxHops: Number.MAX_VALUE,
      startingTokenAddress: 'TOKEN_A_CONTRACT_ADDRESS',
      path: [
        'CONTRACT_ADDRESS_PAIR_1',
        'CONTRACT_ADDRESS_PAIR_2',
        'CONTRACT_ADDRESS_PAIR_3',
      ],
    });
    expect(
      calculatedRouteReverseResult!.inputAmount,
    ).toStrictEqual(constantProductSwapReverse3Route.inputAmount);

    const output2 = toV2Output({
      inputAmount: BigNumber('1000000000'),
      quoteOutputAmount: BigNumber('1642621'),
      quoteShadeDaoFee: BigNumber(0.04),
      quoteLPFee: BigNumber(0.05),
      priceImpact: BigNumber('0.000009462162038267'),
      sourceTokenId: 'TOKEN_A_CONTRACT_ADDRESS',
      targetTokenId: 'TOKEN_D_CONTRACT_ADDRESS',
      route: [
        {
          pair: {
            token0Id: 'TOKEN_A_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_B_CONTRACT_ADDRESS',
          },
          address: 'CONTRACT_ADDRESS_PAIR_1',
          codeHash: 'CONTRACT_HASH_PAIR_1',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.02),
          iterationsCount: undefined,
        },
        {
          pair: {
            token0Id: 'TOKEN_C_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_B_CONTRACT_ADDRESS',
          },
          iterationsCount: undefined,
          address: 'CONTRACT_ADDRESS_PAIR_2',
          codeHash: 'CONTRACT_HASH_PAIR_2',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
        {
          pair: {
            token0Id: 'TOKEN_C_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_D_CONTRACT_ADDRESS',
          },
          iterationsCount: undefined,
          address: 'CONTRACT_ADDRESS_PAIR_3',
          codeHash: 'CONTRACT_HASH_PAIR_3',
          daoFee: BigNumber(0.02),
          liquidityProviderFee: BigNumber(0.02),
        },
      ],
    });

    // Output Object validation
    expect(calculatedRouteResult).toStrictEqual(output2);
    expect(isBigNumberWithinMarginOfError(
      output2.inputAmount,
      calculatedRouteReverseResult!.inputAmount,
      BigNumber('0.000001'),
    )).toBeTruthy();
    // Output Amount validation
    expect(calculatedRouteResult!.quoteOutputAmount).toStrictEqual(constantProductSwap3Output);
  });

  test('it can calculate the output of a multi-hop stable swap route', () => {
    // **************************************************
    // Stable Swaps in all pools
    //
    // 2nd has order of token0 and token1 flipped
    // i.e.   K-L -> M-L -> M-N
    //
    // Pool K-L params
    // Liquidity K: 999,999,999
    // Liquidity L: 325,000,000
    // priceRatio: 3
    // a: 10,
    // gamma1: 4,
    // gamma2: 5,
    // dao Fee: 0.01
    // liquidity provider Fee: 0.01
    //
    // Pool M-L params
    // Liquidity M: 999,999,999
    // Liquidity L: 325,000,000
    // priceRatio: 3
    // a: 10,
    // gamma1: 4,
    // gamma2: 5,
    // dao Fee: 0.01
    // liquidity provider Fee: 0.01
    //
    // Pool M-N params
    // Liquidity M: 999,999,999
    // Liquidity N: 325,000,000
    // priceRatio: 3
    // a: 10,
    // gamma1: 4,
    // gamma2: 5,
    // dao Fee: 0.01
    // liquidity provider Fee: 0.01

    const routeCalculator = new RoutesCalculatorCached(
      batchPairsInfoMock,
      tokenConfigMock,
    );

    // First simulate indidual swaps using outputs as inputs of the following

    // Pool K-L
    const stableSwap1Output = forwardCalculateSingle({
      startingTokenAmount: BigNumber('100000000'),
      startingTokenAddress: 'TOKEN_K_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_10'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // pool M-L
    const stableSwap2Output = forwardCalculateSingle({
      startingTokenAmount: stableSwap1Output,
      startingTokenAddress: 'TOKEN_L_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_11'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // pool M-N
    const stableSwap3Output = forwardCalculateSingle({
      startingTokenAmount: stableSwap2Output,
      startingTokenAddress: 'TOKEN_M_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_12'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // combine into multi-hop routing

    const calculatedStableRouteResult = routeCalculator.calculatePath({
      inputTokenAmount: BigNumber('100000000'),
      endingTokenAddress: 'TOKEN_N_CONTRACT_ADDRESS',
      isReverse: false,
      maxHops: Number.MAX_VALUE,
      startingTokenAddress: 'TOKEN_K_CONTRACT_ADDRESS',
      path: [
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_12',
      ],
    });
    // REVERSE CALCULATION

    // pool M-N
    const reverseSwap1Input = reverseCalculateSingle({
      endingTokenAmount: BigNumber('36551499'),
      endingTokenAddress: 'TOKEN_N_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_12'),
      tokens: tokenConfigMock,
    }).inputAmount;

    // pool  M-L
    const reverseSwapReverse2Input = reverseCalculateSingle({
      endingTokenAmount: reverseSwap1Input,
      endingTokenAddress: 'TOKEN_M_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_11'),
      tokens: tokenConfigMock,
    }).inputAmount;

    // Pool K-L
    const reverseSwapReverse3Route = reverseCalculateSingle({
      endingTokenAmount: reverseSwapReverse2Input,
      endingTokenAddress: 'TOKEN_L_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_10'),
      tokens: tokenConfigMock,
    });

    // combine into multi-hop routing (REVERSE)
    const calculatedRouteReverseResult = routeCalculator.calculatePath({
      inputTokenAmount: BigNumber('36551499'),
      endingTokenAddress: 'TOKEN_N_CONTRACT_ADDRESS',
      isReverse: true,
      maxHops: Number.MAX_VALUE,
      startingTokenAddress: 'TOKEN_K_CONTRACT_ADDRESS',
      path: [
        'CONTRACT_ADDRESS_PAIR_10',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_12',
      ],
    });
    expect(
      reverseSwapReverse3Route.inputAmount,
    ).toStrictEqual(calculatedRouteReverseResult!.inputAmount);

    // expected output object
    const output = toV2Output({
      inputAmount: BigNumber('100000000'),
      quoteOutputAmount: BigNumber('36551499'),
      quoteShadeDaoFee: BigNumber('0.03'),
      quoteLPFee: BigNumber('0.03'),
      priceImpact: BigNumber('6.23997608623458059756756e-7'),
      sourceTokenId: 'TOKEN_K_CONTRACT_ADDRESS',
      targetTokenId: 'TOKEN_N_CONTRACT_ADDRESS',
      route: [
        {
          pair: {
            token0Id: 'TOKEN_K_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_L_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_10',
          codeHash: 'CONTRACT_HASH_PAIR_10',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
        {
          pair: {
            token0Id: 'TOKEN_M_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_L_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_11',
          codeHash: 'CONTRACT_HASH_PAIR_11',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
        {
          pair: {
            token0Id: 'TOKEN_M_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_N_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_12',
          codeHash: 'CONTRACT_HASH_PAIR_12',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
      ],
    });

    // Output Object validation
    expect(calculatedStableRouteResult).toStrictEqual(output);

    // Output Amount validation
    expect(calculatedStableRouteResult!.quoteOutputAmount).toStrictEqual(stableSwap3Output);

    // reverse validation
    expect(isBigNumberWithinMarginOfError(
      output.inputAmount,
      calculatedRouteReverseResult!.inputAmount,
      BigNumber('0.0000001'),
    )).toBeTruthy();
  });

  test('it can calculate the output of a multi-hop mixed swap route', () => {
    // **************************************************
    // Mix of constant product -> stableswap -> constant product
    // pools:   O-L ->  M-L -> M-P
    //
    // Pool O-L params
    // Liquidity O: 111,111,111
    // Liquidity L: 222,222,222
    // dao Fee: 0.01
    // liquidity provider Fee: 0.02
    //
    // Pool M-L params
    // Liquidity M: 999,999,999
    // Liquidity L: 325,000,000
    // priceRatio: 3
    // a: 10,
    // gamma1: 4,
    // gamma2: 5,
    // dao Fee: 0.01
    // liquidity provider Fee: 0.01
    //
    // Pool M-P params
    // Liquidity A: 111,111,111
    // Liquidity B: 222,222,222
    // dao Fee: 0.01
    // liquidity provider Fee: 0.02

    const routeCalculator = new RoutesCalculatorCached(
      batchPairsInfoMock,
      tokenConfigMock,
    );

    // First simulate indidual swaps using outputs as inputs of the following
    // Pool O-L

    const mixedSwapConstantProduct1Output = forwardCalculateSingle({
      startingTokenAmount: BigNumber('100000000'),
      startingTokenAddress: 'TOKEN_O_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_13'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // pool M-L
    const mixedSwapStableSwapOutput = forwardCalculateSingle({
      startingTokenAmount: mixedSwapConstantProduct1Output,
      startingTokenAddress: 'TOKEN_L_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_11'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // pool M-P
    const mixedSwapConstantProduct2Output = forwardCalculateSingle({
      startingTokenAmount: mixedSwapStableSwapOutput,
      startingTokenAddress: 'TOKEN_M_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_14'),
      tokens: tokenConfigMock,
    }).quoteOutputAmount;

    // combined multi-hop

    const mixedMultiHopResult = routeCalculator.calculatePath({
      inputTokenAmount: BigNumber('100000000'),
      endingTokenAddress: 'TOKEN_P_CONTRACT_ADDRESS',
      isReverse: false,
      maxHops: Number.MAX_VALUE,
      startingTokenAddress: 'TOKEN_O_CONTRACT_ADDRESS',
      path: [
        'CONTRACT_ADDRESS_PAIR_13',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_14',
      ],
    });

    expect(mixedMultiHopResult!.quoteOutputAmount).toStrictEqual(mixedSwapConstantProduct2Output);

    // REVERSE CALCULATION

    // pool M-P
    const reverseSwap1Input = reverseCalculateSingle({
      endingTokenAmount: BigNumber('949728643'),
      endingTokenAddress: 'TOKEN_P_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_14'),
      tokens: tokenConfigMock,
    }).inputAmount;

    // pool  M-L
    const reverseSwapReverse2Input = reverseCalculateSingle({
      endingTokenAmount: reverseSwap1Input,
      endingTokenAddress: 'TOKEN_M_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_11'),
      tokens: tokenConfigMock,
    }).inputAmount;

    // Pool O-L
    const reverseSwapReverse3Route = reverseCalculateSingle({
      endingTokenAmount: reverseSwapReverse2Input,
      endingTokenAddress: 'TOKEN_L_CONTRACT_ADDRESS',
      batchPairInfo: getPairInfo('CONTRACT_ADDRESS_PAIR_13'),
      tokens: tokenConfigMock,
    });

    // combine into multi-hop routing (REVERSE)
    const calculatedRouteReverseResult = routeCalculator.calculatePath({
      inputTokenAmount: BigNumber('949728643'),
      endingTokenAddress: 'TOKEN_P_CONTRACT_ADDRESS',
      isReverse: true,
      startingTokenAddress: 'TOKEN_O_CONTRACT_ADDRESS',
      maxHops: Number.MAX_VALUE,
      path: [
        'CONTRACT_ADDRESS_PAIR_13',
        'CONTRACT_ADDRESS_PAIR_11',
        'CONTRACT_ADDRESS_PAIR_14',
      ],
    });

    expect(
      reverseSwapReverse3Route.inputAmount,
    ).toStrictEqual(calculatedRouteReverseResult!.inputAmount);

    const output = toV2Output({
      inputAmount: BigNumber('100000000'),
      quoteOutputAmount: BigNumber('949728643'),
      quoteShadeDaoFee: BigNumber('0.03'),
      quoteLPFee: BigNumber('0.05'),
      priceImpact: BigNumber('0.000006366091506753980711557256'),
      sourceTokenId: 'TOKEN_O_CONTRACT_ADDRESS',
      targetTokenId: 'TOKEN_P_CONTRACT_ADDRESS',
      route: [
        {
          pair: {
            token0Id: 'TOKEN_O_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_L_CONTRACT_ADDRESS',
          },
          iterationsCount: undefined,
          address: 'CONTRACT_ADDRESS_PAIR_13',
          codeHash: 'CONTRACT_HASH_PAIR_13',
          daoFee: BigNumber('0.01'),
          liquidityProviderFee: BigNumber('0.02'),
        },
        {
          pair: {
            token0Id: 'TOKEN_M_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_L_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_11',
          codeHash: 'CONTRACT_HASH_PAIR_11',
          daoFee: BigNumber('0.01'),
          liquidityProviderFee: BigNumber('0.01'),
        },
        {
          pair: {
            token0Id: 'TOKEN_M_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_P_CONTRACT_ADDRESS',
          },
          iterationsCount: undefined,
          address: 'CONTRACT_ADDRESS_PAIR_14',
          codeHash: 'CONTRACT_HASH_PAIR_14',
          daoFee: BigNumber('0.01'),
          liquidityProviderFee: BigNumber('0.02'),
        },
      ],
    });

    // Output Object validation
    expect(mixedMultiHopResult).toStrictEqual(output);

    // Output Amount validation
    expect(mixedMultiHopResult!.quoteOutputAmount).toStrictEqual(mixedSwapConstantProduct2Output);

    // reverse validation
    expect(output.inputAmount).toStrictEqual(calculatedRouteReverseResult!.inputAmount);
  });

  test('it can calculate all routes for input + output token', () => {
    const routeCalculator = new SwapRoutesCalculator(
      batchPairsInfoMock,
      tokenConfigMock,
    );
    const result = getRoutesV2({
      endingTokenAddress: 'TOKEN_T_CONTRACT_ADDRESS',
      isReverse: false,
      startingTokenAddress: 'TOKEN_Q_CONTRACT_ADDRESS',
      swapRoutesCalculator: routeCalculator,
      inputTokenAmount: BigNumber('100000000'),
      maxHops: 5,
    });

    const outputRoute1 = toV2Output({
      inputAmount: BigNumber('100000000'),
      quoteOutputAmount: BigNumber('36551499'),
      quoteShadeDaoFee: BigNumber('0.03'),
      quoteLPFee: BigNumber('0.03'),
      priceImpact: BigNumber('6.23997608623458059756756e-7'),
      sourceTokenId: 'TOKEN_Q_CONTRACT_ADDRESS',
      targetTokenId: 'TOKEN_T_CONTRACT_ADDRESS',
      route: [
        {
          pair: {
            token0Id: 'TOKEN_Q_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_R_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_15',
          codeHash: 'CONTRACT_HASH_PAIR_15',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
        {
          pair: {
            token0Id: 'TOKEN_S_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_R_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_16',
          codeHash: 'CONTRACT_HASH_PAIR_16',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
        {
          pair: {
            token0Id: 'TOKEN_S_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_T_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_17',
          codeHash: 'CONTRACT_HASH_PAIR_17',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
      ],
    });

    const outputRoute2 = toV2Output({
      inputAmount: BigNumber('100000000'),
      quoteOutputAmount: BigNumber('96039896'),
      quoteShadeDaoFee: BigNumber('0.02'),
      quoteLPFee: BigNumber('0.02'),
      priceImpact: BigNumber('0.000001081968422993497890830615'),
      sourceTokenId: 'TOKEN_Q_CONTRACT_ADDRESS',
      targetTokenId: 'TOKEN_T_CONTRACT_ADDRESS',
      route: [
        {
          pair: {
            token0Id: 'TOKEN_S_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_Q_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_18',
          codeHash: 'CONTRACT_HASH_PAIR_18',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
        {
          pair: {
            token0Id: 'TOKEN_S_CONTRACT_ADDRESS',
            token1Id: 'TOKEN_T_CONTRACT_ADDRESS',
          },
          iterationsCount: 9,
          address: 'CONTRACT_ADDRESS_PAIR_17',
          codeHash: 'CONTRACT_HASH_PAIR_17',
          daoFee: BigNumber(0.01),
          liquidityProviderFee: BigNumber(0.01),
        },
      ],
    });
    expect(result)
      .toStrictEqual([
        outputRoute2,
        outputRoute1,
      ]);
  });
});
