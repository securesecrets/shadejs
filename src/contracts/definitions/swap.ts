import { PathsContractFormatted } from '~/types/contracts/swap/input';
import {
  Path,
  Paths,
} from '~/types/contracts/swap/model';
import { randomPadding } from '~/lib/utils';
import { snip20 } from './snip20';

/**
 * Query the factory config
 */
const msgQueryFactoryConfig = () => ({ get_config: {} });

/**
 * Query the factory for a list of registered pairs
 * @param startingIndex index of the list to return data from
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
    padding: randomPadding(),
  }).msg;
}

export {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
  msgQueryStakingConfig,
  msgSwap,
};
