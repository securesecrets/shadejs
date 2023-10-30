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

export {
  msgQueryFactoryConfig,
  msgQueryFactoryPairs,
  msgQueryPairConfig,
  msgQueryPairInfo,
  msgQueryStakingConfig,
};
