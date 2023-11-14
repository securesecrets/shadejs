import {
  test,
  expect,
} from 'vitest';
import {
  getPossiblePaths,
  calculateRoute,
  getRoutes,
} from '~/lib/swap/router';
import BigNumber from 'bignumber.js';
import {
  batchPairsInfoMock,
  batchPairsInfoMockForComplexRoute,
  tokenConfigMock,
} from '~/test/mocks/swap/router';
import { GasMultiplier } from '~/types/swap/router';

test('it can generate possible route paths', () => {
  // Returns single pair
  //
  // pair1
  // (A-B)
  const output1 = [['CONTRACT_ADDRESS_PAIR_1']];
  expect(getPossiblePaths({
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_B_CONTRACT_ADDRESS',
    maxHops: 5,
    pairs: batchPairsInfoMock,
  })).toStrictEqual(output1);

  // **************************************************
  // Returns a linear path
  //
  // pair1 -> pair2 -> pair3
  // (A-B) -> (B-C) -> (D-C)
  const output2 = [[
    'CONTRACT_ADDRESS_PAIR_1',
    'CONTRACT_ADDRESS_PAIR_2',
    'CONTRACT_ADDRESS_PAIR_3',
  ]];
  expect(getPossiblePaths({
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_D_CONTRACT_ADDRESS',
    maxHops: 5,
    pairs: batchPairsInfoMock,
  })).toStrictEqual(output2);

  // **************************************************
  // Returns circular pair of routes
  //
  // E -- pair4 -- F -- pair5 -- G -- pair6
  //      (E-F)         (G-F)         (G-H)
  //        |                            |
  //        F                            H
  //        |                            |
  //      pair7 -- I -- pair8 -- H --  pair9 -- J
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
  expect(getPossiblePaths({
    inputTokenContractAddress: 'TOKEN_E_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_J_CONTRACT_ADDRESS',
    maxHops: 5,
    pairs: batchPairsInfoMock,
  })).toStrictEqual(output3);

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
    ['CONTRACT_ADDRESS_PAIR_3',
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
  expect(getPossiblePaths({
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_G_CONTRACT_ADDRESS',
    maxHops: 5,
    pairs: batchPairsInfoMockForComplexRoute,
  }).sort()).toStrictEqual(output4.sort());
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

  const output = {
    inputAmount: BigNumber('1000000000'),
    quoteOutputAmount: BigNumber('1939982540'),
    quoteShadeDaoFee: BigNumber(0.01),
    quoteLPFee: BigNumber(0.02),
    priceImpact: BigNumber('0.000009000000009'),
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_B_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_1'],
    gasMultiplier: GasMultiplier.CONSTANT_PRODUCT,
  };
  expect(calculateRoute({
    inputTokenAmount: BigNumber('1000000000'),
    inputTokenContractAddress: output.inputTokenContractAddress,
    path: ['CONTRACT_ADDRESS_PAIR_1'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  })).toStrictEqual(output);
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

  // Pool A-B
  const constantProductSwap1Output = calculateRoute({
    inputTokenAmount: BigNumber('1000000000'),
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_1'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // pool C-B
  const constantProductSwap2Output = calculateRoute({
    inputTokenAmount: constantProductSwap1Output,
    inputTokenContractAddress: 'TOKEN_B_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_2'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // pool C-D
  const constantProductSwap3Output = calculateRoute({
    inputTokenAmount: constantProductSwap2Output,
    inputTokenContractAddress: 'TOKEN_C_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_3'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // combine into multi-hop routing (FORWARD)
  const calulatedRouteResult = calculateRoute({
    inputTokenAmount: BigNumber('1000000000'),
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_1',
      'CONTRACT_ADDRESS_PAIR_2',
      'CONTRACT_ADDRESS_PAIR_3',
    ],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  });

  const output = {
    inputAmount: BigNumber('1000000000'),
    quoteOutputAmount: BigNumber('1642621'),
    quoteShadeDaoFee: BigNumber(0.04),
    quoteLPFee: BigNumber(0.05),
    priceImpact: BigNumber('0.000009462162038267'),
    inputTokenContractAddress: 'TOKEN_A_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_D_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_1',
      'CONTRACT_ADDRESS_PAIR_2',
      'CONTRACT_ADDRESS_PAIR_3',
    ],
    gasMultiplier: GasMultiplier.CONSTANT_PRODUCT * 3,
  };

  // Output Object validation
  expect(calulatedRouteResult).toStrictEqual(output);

  // Output Amount validation
  expect(calulatedRouteResult.quoteOutputAmount).toStrictEqual(constantProductSwap3Output);
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

  // First simulate indidual swaps using outputs as inputs of the following

  // Pool K-L
  const stableSwap1Output = calculateRoute({
    inputTokenAmount: BigNumber('100000000'),
    inputTokenContractAddress: 'TOKEN_K_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_10'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // pool M-L
  const stableSwap2Output = calculateRoute({
    inputTokenAmount: stableSwap1Output,
    inputTokenContractAddress: 'TOKEN_L_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_11'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // pool M-N
  const stableSwap3Output = calculateRoute({
    inputTokenAmount: stableSwap2Output,
    inputTokenContractAddress: 'TOKEN_M_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_12'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // combine into multi-hop routing
  const calulatedStableRouteResult = calculateRoute({
    inputTokenAmount: BigNumber('100000000'),
    inputTokenContractAddress: 'TOKEN_K_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_10',
      'CONTRACT_ADDRESS_PAIR_11',
      'CONTRACT_ADDRESS_PAIR_12',
    ],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  });

  // expected output object
  const output = {
    inputAmount: BigNumber('100000000'),
    quoteOutputAmount: BigNumber('36551499'),
    quoteShadeDaoFee: BigNumber('0.03'),
    quoteLPFee: BigNumber('0.03'),
    priceImpact: BigNumber('6.23997608623458059756756e-7'),
    inputTokenContractAddress: 'TOKEN_K_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_N_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_10',
      'CONTRACT_ADDRESS_PAIR_11',
      'CONTRACT_ADDRESS_PAIR_12',
    ],
    gasMultiplier: GasMultiplier.STABLE * 3,
  };

  // Output Object validation
  expect(calulatedStableRouteResult).toStrictEqual(output);

  // Output Amount validation
  expect(calulatedStableRouteResult.quoteOutputAmount).toStrictEqual(stableSwap3Output);
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

  // First simulate indidual swaps using outputs as inputs of the following
  // Pool O-L

  const mixedSwapConstantProduct1Output = calculateRoute({
    inputTokenAmount: BigNumber('100000000'),
    inputTokenContractAddress: 'TOKEN_O_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_13'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // pool M-L
  const mixedSwapStableSwapOutput = calculateRoute({
    inputTokenAmount: mixedSwapConstantProduct1Output,
    inputTokenContractAddress: 'TOKEN_L_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_11'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // pool M-P
  const mixedSwapConstantProduct2Output = calculateRoute({
    inputTokenAmount: mixedSwapStableSwapOutput,
    inputTokenContractAddress: 'TOKEN_M_CONTRACT_ADDRESS',
    path: ['CONTRACT_ADDRESS_PAIR_14'],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  }).quoteOutputAmount;

  // combined multi-hop
  const mixedMultiHopResult = calculateRoute({
    inputTokenAmount: BigNumber('100000000'),
    inputTokenContractAddress: 'TOKEN_O_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_13',
      'CONTRACT_ADDRESS_PAIR_11',
      'CONTRACT_ADDRESS_PAIR_14',
    ],
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  });

  expect(mixedMultiHopResult.quoteOutputAmount).toStrictEqual(mixedSwapConstantProduct2Output);

  const output = {
    inputAmount: BigNumber('100000000'),
    quoteOutputAmount: BigNumber('949728643'),
    quoteShadeDaoFee: BigNumber('0.03'),
    quoteLPFee: BigNumber('0.05'),
    priceImpact: BigNumber('0.000006366091506753980711557256'),
    inputTokenContractAddress: 'TOKEN_O_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_P_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_13',
      'CONTRACT_ADDRESS_PAIR_11',
      'CONTRACT_ADDRESS_PAIR_14',
    ],
    gasMultiplier: GasMultiplier.CONSTANT_PRODUCT * 2 + GasMultiplier.STABLE,
  };

  // Output Object validation
  expect(mixedMultiHopResult).toStrictEqual(output);

  // Output Amount validation
  expect(mixedMultiHopResult.quoteOutputAmount).toStrictEqual(mixedSwapConstantProduct2Output);
});

test('it can calculate all routes for input + output token', () => {
  const result = getRoutes({
    inputTokenAmount: BigNumber('100000000'),
    inputTokenContractAddress: 'TOKEN_Q_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_T_CONTRACT_ADDRESS',
    maxHops: 5,
    pairs: batchPairsInfoMock,
    tokens: tokenConfigMock,
  });

  const output1 = {
    inputAmount: BigNumber('100000000'),
    quoteOutputAmount: BigNumber('36551499'),
    quoteShadeDaoFee: BigNumber('0.03'),
    quoteLPFee: BigNumber('0.03'),
    priceImpact: BigNumber('6.23997608623458059756756e-7'),
    inputTokenContractAddress: 'TOKEN_Q_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_T_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_15',
      'CONTRACT_ADDRESS_PAIR_16',
      'CONTRACT_ADDRESS_PAIR_17',
    ],
    gasMultiplier: GasMultiplier.STABLE * 3,
  };

  const output2 = {
    inputAmount: BigNumber('100000000'),
    quoteOutputAmount: BigNumber('96039896'),
    quoteShadeDaoFee: BigNumber('0.02'),
    quoteLPFee: BigNumber('0.02'),
    priceImpact: BigNumber('0.000001081968422993497890830615'),
    inputTokenContractAddress: 'TOKEN_Q_CONTRACT_ADDRESS',
    outputTokenContractAddress: 'TOKEN_T_CONTRACT_ADDRESS',
    path: [
      'CONTRACT_ADDRESS_PAIR_18',
      'CONTRACT_ADDRESS_PAIR_17',
    ],
    gasMultiplier: GasMultiplier.STABLE * 2,
  };

  expect(result).toStrictEqual([output2, output1]);
});
