import {
  test,
  expect,
  vi,
  beforeAll,
  afterAll,
} from 'vitest';
import {
  parseFactoryConfig,
  parseFactoryPairs,
  parsePairConfig,
} from '~/contracts/services/swap';
import factoryConfigResponse from '~/test/mocks/swap/factoryConfig.json';
import factoryPairsResponse from '~/test/mocks/swap/factoryPairs.json';
import pairConfigResponse from '~/test/mocks/swap/pairConfig.json';
import { of } from 'rxjs';
import { FactoryConfigResponse, FactoryPairsResponse, PairConfigResponse } from '~/types/contracts/swap/response';

beforeAll(() => {
  vi.mock('~/contracts/definitions/oracle', () => ({
    msgQueryOraclePrice: vi.fn(() => 'MSG_QUERY_ORACLE_PRICE'),
    msgQueryOraclePrices: vi.fn(() => 'MSG_QUERY_ORACLE_PRICES'),
  }));

  vi.mock('~/client/index', () => ({
    getActiveQueryClient$: vi.fn(() => of('CLIENT')),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$: vi.fn(() => of()),
  }));

  vi.mock('~/client/services/clientServices', () => ({
    sendSecretClientContractQuery$: vi.fn(() => of()),
  }));
});

afterAll(() => {
  vi.clearAllMocks();
});

test('it can parse the factory config', () => {
  const parsedOutput = {
    pairContractInstatiationInfo: {
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
      id: 914,
    },
    lpTokenContractInstatiationInfo: {
      codeHash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
      id: 913,
    },
    adminAuthContract: {
      address: 'secret1hcz23784w6znz3cmqml7ha8g4x6s7qq9v93mtl',
      codeHash: '6666d046c049b04197326e6386b3e65dbe5dd9ae24266c62b333876ce57adaa8',
    },
    authenticatorContract: null,
    defaultPairSettings: {
      lpFee: 0.0029,
      daoFee: 0.0001,
      stableLpFee: 0.000483,
      stableDaoFee: 0.000017,
      daoContract: {
        address: 'secret1g86l6j393vtzd9jmmxu57mx4q8y9gza0tncjpp',
        codeHash: '',
      },
    },
  };

  expect(parseFactoryConfig(
    factoryConfigResponse as FactoryConfigResponse,
  )).toStrictEqual(parsedOutput);
});

test('it can parse the factory pairs response', () => {
  const parsedOutput = {
    pairs: [{
      address: 'secret1wn9tdlvut2nz0cpv28qtv74pqx20p847j8gx3w',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
      isEnabled: true,
    }, {
      address: 'secret1qyt4l47yq3x43ezle4nwlh5q0sn6f9sesat7ap',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
      isEnabled: true,
    }, {
      address: 'secret1uekg0c2qenz4mxwpg5j4s439rqu25p4a6wlhk6',
      codeHash: 'e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2',
      isEnabled: true,
    }],
    startIndex: 1,
    endIndex: 26,
  };
  expect(parseFactoryPairs({
    response: factoryPairsResponse as FactoryPairsResponse,
    startingIndex: 1,
    limit: 25,
  })).toStrictEqual(parsedOutput);
});

test('it can parse the pair config response', () => {
  const parsedOutput = {
    factoryContract: {
      address: 'secret1ja0hcwvy76grqkpgwznxukgd7t8a8anmmx05pp',
      codeHash: '2ad4ed2a4a45fd6de3daca9541ba82c26bb66c76d1c3540de39b509abd26538e',
    },
    lpTokenContract: {
      address: 'secret1l2u35dcx2a4wyx9a6lxn9va6e66z493ycqxtmx',
      codeHash: 'b0c2048d28a0ca0b92274549b336703622ecb24a8c21f417e70c03aa620fcd7b',
    },
    stakingContract: {
      address: 'secret16h5sqd79x43wutne8ge3pdz3e3lngw62vy5lmr',
      codeHash: 'a83f0fdc6e5bcdb1f59e39200a084401309fc5338dbb2e54a2bcdc08fa3eaf49',
    },
    token0Contract: {
      address: 'secret19e75l25r6sa6nhdf4lggjmgpw0vmpfvsw5cnpe',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    token1Contract: {
      address: 'secret16vjfe24un4z7d3sp9vd0cmmfmz397nh2njpw3e',
      codeHash: '638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e',
    },
    isStable: true,
    fee: {
      lpFee: 0.0005,
      daoFee: 0.0005,
    },
  };
  expect(parsePairConfig(pairConfigResponse as PairConfigResponse)).toStrictEqual(parsedOutput);
});
