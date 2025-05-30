import {
  PathsContractFormatted,
  PathsContractWithTokensFormatted,
} from '~/types/contracts/swap/input';
import {
  Path,
  Paths,
  PathV2,
} from '~/types/contracts/swap/model';
import { generatePadding } from '~/lib/utils';
import {
  Contract,
} from '~/types';
import { snip20 } from './snip20';

/**
 * Query the factory config
 */
const msgQueryFactoryConfig = () => ({ get_config: {} });

/**
 * Query the factory for a list of registered pairs
 * @param startIndex index of the list to return data from
 * @param limit number of entries to be returned
 */
const msgQueryFactoryPairs = (startIndex: number, limit: number) => ({
  list_a_m_m_pairs: {
    pagination: {
      start: startIndex,
      limit,
    },
  },
});

/**
 * Query the pair config
 */
const msgQueryPairConfig = () => ({ get_config: {} });

/**
 * Query the pair info
 */
const msgQueryPairInfo = () => ({ get_pair_info: {} });

/**
 * Query the staking config
 */
const msgQueryStakingConfig = () => ({ get_config: {} });

/**
 * message to swap tokens
 */
function msgSwap({
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  path,
}: {
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  path: Paths,
}) {
  const pathFormatted: PathsContractFormatted = path.map((hop: Path) => ({
    addr: hop.poolContractAddress,
    code_hash: hop.poolCodeHash,
  }));

  const swapParamsMessage = {
    swap_tokens_for_exact: {
      expected_return: minExpectedReturnAmount,
      path: pathFormatted,
    },
  };

  return snip20.messages.send({
    recipient: routerContractAddress,
    recipientCodeHash: routerCodeHash,
    amount: sendAmount,
    handleMsg: swapParamsMessage,
    padding: generatePadding(),
  }).msg;
}

/**
 * message to swap tokens
 */
function msgSwapV2({
  snip20ContractAddress,
  snip20CodeHash,
  routerContractAddress,
  routerCodeHash,
  sendAmount,
  minExpectedReturnAmount,
  path,
}: {
  snip20ContractAddress: string,
  snip20CodeHash?: string,
  routerContractAddress: string,
  routerCodeHash?: string,
  sendAmount: string,
  minExpectedReturnAmount: string,
  path: PathV2[],
}) {
  const pathFormatted: PathsContractWithTokensFormatted = path.map((hop: PathV2) => {
    const tokens = hop.pair.map((p) => ({
      address: p.address,
      code_hash: p.codeHash,
    }));
    return ({
      address: hop.poolContractAddress,
      code_hash: hop.poolCodeHash,
      token0: tokens[0],
      token1: tokens[1],
    });
  });
  const lastToken = path.reduce(({ address }, hop) => {
    if (address === hop.pair[0].address) {
      return hop.pair[1];
    }
    return hop.pair[0];
  }, {
    address: snip20ContractAddress,
    codeHash: snip20CodeHash,
  } as Contract);

  const swapParamsMessage = {
    swap_tokens_for_exact: {
      expected_return: {
        amount: minExpectedReturnAmount,
        token: {
          address: lastToken.address,
          code_hash: lastToken.codeHash,
        },
      },
      path: pathFormatted,
    },
  };

  return snip20.messages.send({
    recipient: routerContractAddress,
    recipientCodeHash: routerCodeHash,
    amount: sendAmount,
    handleMsg: swapParamsMessage,
    padding: generatePadding(),
  }).msg;
}
export {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
  msgQueryStakingConfig,
  msgSwap,
  msgSwapV2,
};
