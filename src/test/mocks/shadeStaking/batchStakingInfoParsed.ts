const batchStakingInfoParsed = [
  {
    stakingContractAddress: 'secret17ue98qd2akjazu2w2r95cz06mh8pfl3v5hva4j',
    stakingInfo: {
      stakeTokenAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      totalStakedRaw: '158473829064218',
      unbondingPeriod: 604800,
      rewardPools: [
        {
          id: '1',
          amountRaw: '500000000000',
          startDate: new Date('2023-06-27T19:00:00.000Z'),
          endDate: new Date('2023-07-27T19:00:00.000Z'),
          tokenAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
          rateRaw: '192901.234567901234567901',
        },
      ],
    },
    blockHeight: 1,
  },
  {
    stakingContractAddress: 'secret17ue98qd2akjazu2w2r95cz06mh8pfl3v5hva4j',
    stakingInfo: {
      stakeTokenAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      totalStakedRaw: '258473829064218',
      unbondingPeriod: 704800,
      rewardPools: [
        {
          id: '1',
          amountRaw: '600000000000',
          startDate: new Date('2023-06-27T19:00:00.000Z'),
          endDate: new Date('2023-07-27T19:00:00.000Z'),
          tokenAddress: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
          rateRaw: '292901.234567901234567901',
        },
      ],
    },
    blockHeight: 1,
  },
];

export { batchStakingInfoParsed };
