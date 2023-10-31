import { FactoryPairs } from '~/types/contracts/swap/model';

const factoryPairsParsed: FactoryPairs = {
  pairs: [{
    pairContract: {
      address: 'secret1wn9tdlvut2nz0cpv28qtv74pqx20p847j8gx3w',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
    },
    token0Contract: {
      address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    token1Contract: {
      address: 'secret155w9uxruypsltvqfygh5urghd5v0zc6f9g69sq',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    isStable: false,
    isEnabled: true,
  }, {
    pairContract: {
      address: 'secret1qyt4l47yq3x43ezle4nwlh5q0sn6f9sesat7ap',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
    },
    token0Contract: {
      address: 'secret153wu605vvp934xhd4k9dtd640zsep5jkesstdm',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    token1Contract: {
      address: 'secret1k6u0cy4feepm6pehnz804zmwakuwdapm69tuc4',
      codeHash: 'f6be719b3c6feb498d3554ca0398eb6b7e7db262acb33f84a8f12106da6bbb09',
    },
    isStable: false,
    isEnabled: true,
  }],
  startIndex: 1,
  endIndex: 25,
};

export {
  factoryPairsParsed,
};
