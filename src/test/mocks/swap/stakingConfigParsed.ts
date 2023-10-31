import { StakingInfo } from '~/types/contracts/swap/model';

const stakingConfigParsed: StakingInfo = {
  lpTokenContract: {
    address: 'secret1u3mp0jtmszw0xn7s5dn69gl0332lx9f60kt8xk',
    codeHash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
  },
  pairContractAddress: 'secret14xsrnkfv5r5qh7m3csps72z9vg49tkgf7an0d5',
  adminAuthContract: {
    address: 'secret1hcz23784w6znz3cmqml7ha8g4x6s7qq9v93mtl',
    codeHash: '6666d046c049b04197326e6386b3e65dbe5dd9ae24266c62b333876ce57adaa8',
  },
  queryAuthContract: {
    address: 'secret1nd56rl8n63auxmwekkyqqq030paeqpap3dmw0w',
    codeHash: '1b7a863cd327d24323bfd067dbb975e03dc8a51edee55717ad6b9849b3d35234',
  },
  totalStakedAmount: '160118027695',
  rewardTokens: [{
    token: {
      address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    rewardPerSecond: '231481',
    rewardPerStakedToken: '74',
    validTo: 1688490000,
    lastUpdated: 1688490000,
  },
  {
    token: {
      address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    rewardPerSecond: '231481',
    rewardPerStakedToken: '2',
    validTo: 1690305188,
    lastUpdated: 1690305188,
  }],
};

export {
  stakingConfigParsed,
};
