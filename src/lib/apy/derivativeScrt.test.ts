import {
  test,
  expect,
  vi,
  beforeAll,
} from 'vitest';
import { of } from 'rxjs';
import { queryDerivativeScrtInfo$ } from '~/contracts/services/derivativeScrt';
import { SecretQueryOptions } from '~/types/apy';
import { secretChainQueries$ } from './secretQueries';
import {
  calculateDerivativeScrtApy,
  calculateDerivativeScrtApy$,
} from './derivativeScrt';

beforeAll(() => {
  vi.mock('~/lib/apy/secretQueries', () => ({
    secretChainQueries$: vi.fn(() => of({
      secretInflationPercent: 0.09,
      secretTotalSupplyRaw: 292470737038201,
      secretTotalStakedRaw: 161156183048148,
      secretTaxes: {
        foundationTaxPercent: 0,
        communityTaxPercent: 0.02,
      },
      secretValidators: [
        {
          ratePercent: 0.01,
          validatorAddress: 'secretvaloper1q0rth4fu4svxnw63vjd7w74nadzsdp0fmkhj3d',
        },
        {
          ratePercent: 0.04,
          validatorAddress: 'secretvaloper1qjk5uduu3zg356chmstcp2eqgdn35jp3ztxh4x',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1p5l3hyhe45ck4xy6eysujpeskezz2s59vhqzwm',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1pujrvwt9xve0u0t472x5wm0lf5r37thakp7pvw',
        },
        {
          ratePercent: 0.03,
          validatorAddress: 'secretvaloper1p7hzp7y50l9f7jl3yv6cdd95a3hc2dfrqfncpt',
        },
        {
          ratePercent: 0.08,
          validatorAddress: 'secretvaloper1rfnmcuwzf3zn7r025j9zr3ncc7mt9ge56l7se7',
        },
        {
          ratePercent: 0.09,
          validatorAddress: 'secretvaloper1rtx7h36z9u0pd8kt3detrz5mg5ulys5zupfa35',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1y9efhftxlaf30cgzvqp2362sgt233yuw4p9gwa',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1yv9f4tankaktdtf8lq6rjsx9c9rpfptc7kzhz2',
        },
        {
          ratePercent: 0.02,
          validatorAddress: 'secretvaloper19z74520tdw5gps5sp5tr8y2mxr40artly6rsw3',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper19dw5tuep06ke9smem3df0lqvhpd25ke3we95n3',
        },
        {
          ratePercent: 0.07,
          validatorAddress: 'secretvaloper193wdevxmace2katdzpdm9l0z6t0zmeht02v95e',
        },
        {
          ratePercent: 0.045,
          validatorAddress: 'secretvaloper1xyvlmw93ytmcju4suuk8tpuhzu6rtnnwqc6a7y',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1xtg9ypjasxxxjen8k2n5zcxgc73pq7pnvsmm70',
        },
        {
          ratePercent: 0,
          validatorAddress: 'secretvaloper1xj5ykuzn0mkq9642yxgqmh4ycplzhr2pza25mk',
        },
        {
          ratePercent: 0.01,
          validatorAddress: 'secretvaloper1x6efs0le7f9f3r4u2rq4jykcjunsq4us99p7xu',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1xmu8meef8ynlsev3a9hpl5wdxhpzzj0efmzpcj',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1x76f2c2cuwa4e3lttjgqeqva0725ftmqvgvfnv',
        },
        {
          ratePercent: 0.0949,
          validatorAddress: 'secretvaloper182dg8p7nshdjjt5sypcx6hw9p8vlwqpntpm5k6',
        },
        {
          ratePercent: 0.03,
          validatorAddress: 'secretvaloper18w7rm926ue3nmy8ay58e3lc2nqnttrlhhgpch6',
        },
        {
          ratePercent: 0.099,
          validatorAddress: 'secretvaloper18acdn4vaxfkqj0ta25u3ulzdyzekrqe5w9q2n4',
        },
        {
          ratePercent: 0.099,
          validatorAddress: 'secretvaloper18762353s6ulgla3efvf0hpe5rjjxp5ndfvl8z7',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1gkk02na77t83dvmf9vd7lajptejaqkyug62h56',
        },
        {
          ratePercent: 0.07,
          validatorAddress: 'secretvaloper1ghq67qyjf9exqjw4s3ltg56zf5yceve7s4kj5u',
        },
        {
          ratePercent: 0.08,
          validatorAddress: 'secretvaloper1glyaxntl2jm3sruafq4rhxfrq4vzrgz0mg9m90',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1f8chr3y3s9h8g4vc5pg8wvzzhfy3hcxm0re5zc',
        },
        {
          ratePercent: 0,
          validatorAddress: 'secretvaloper12y30xefd0wg53xtyv9lw7mjcdvf8nxgzzva3sr',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper12haa5h8wker0x07e6unxgjjvr9wtqn68sptvvh',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper126d4dqs02l5xd4e74vkcdspqeeels7vd0hmkt5',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper12ancx2qcgk04rrkexuhjq93etgktq4nn58z9yu',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1t5wtcuwjkdct9qkw2h6m48zu2hectpd6ulmekk',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1tmtcu980raqvypdf0dd6hsgh6qcm7ex7l29u58',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1tums792cvpugaydvqgl7t6r5khfsgh7n78hs5w',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1vp05jj9t0u228j3ph8qav642mh84lp2q6r8vhx',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1vzkdmu0sa8gaj686jh5all7hpmmsp8x87vyz8z',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1vws5gh9pcpd6xeljl9qgu28mkqtvket49aqn7e',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1dpajv4su00mzf4r7rhzytc0vs23njkh2wll6lp',
        },
        {
          ratePercent: 0.01,
          validatorAddress: 'secretvaloper1dyfats3mqaphz7wyj8r89lt3gze88eenwu7tmf',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1dc6lhau0gnqh9rup2zv7z2jj4q9wwtkcm3edmq',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1wg085tj9xtv84q9l2zgdml46n6ju3mryun4fsu',
        },
        {
          ratePercent: 0.04,
          validatorAddress: 'secretvaloper1wt0s0zmvvf3rcdufeut8c9w9cr5n4mc7y0xu0f',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1w3lugsau69vm0kl9rxnf7wd8w68tr2ehlq00w0',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1sa8av4qw3xerr58kwvnm8wvd87zgp36mv6cnyg',
        },
        {
          ratePercent: 0.2,
          validatorAddress: 'secretvaloper13dryehdzcwj555fg9jwatyutvmhmskzna4azxq',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1jgx4pn3acae9esq5zha5ym3kzhq6x60frjwkrp',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1nqxdqq6qhtaj9m2t2mgvzds0xa6fa2g9sk5ymu',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1nsf2zmhe3ktn5fqtrpffnktc4g7uag05ggse54',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1njvnz9dyd2suqzsuetxvfdsu6pjx5yxrpt3wr0',
        },
        {
          ratePercent: 0.08,
          validatorAddress: 'secretvaloper1nnt3t7ms82vf86jwq88zvwvzvm2mkhxx67zl3z',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1nc2justrp64paes6vrkk5atqxheqkjnl5sc76q',
        },
        {
          ratePercent: 0.01,
          validatorAddress: 'secretvaloper15q3f508smwa0v79qd0rjkdpfs475yd8vm0lr2n',
        },
        {
          ratePercent: 0.08,
          validatorAddress: 'secretvaloper15urq2dtp9qce4fyc85m6upwm9xul30490eylnc',
        },
        {
          ratePercent: 0.13,
          validatorAddress: 'secretvaloper1404h4aet3jn8uw7660670nqej2plsgqul74mjp',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper14cmhv376dth9tm3shcuextyhksu8cnfs0kq76p',
        },
        {
          ratePercent: 0.02,
          validatorAddress: 'secretvaloper14mwwdad00y7lwwmmk3yw2l2qhn6jzjpy28fmfw',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1kn73a34p004dzjyf0mzwmluh2692nptxkkaft9',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1keq6g42q5vxq86cg7xrcng4tmxer8ufvcakg6u',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1hqlvlvps8rrd2jn05p3ugetu7z40z8vzszfnx9',
        },
        {
          ratePercent: 0.01,
          validatorAddress: 'secretvaloper1hzryhvapnq4x6cvx0yakd49vzkld5wx25h00fd',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1hf2y3x956cw9v43ruj060zjdamwh9xs2h02gyg',
        },
        {
          ratePercent: 0.04,
          validatorAddress: 'secretvaloper1hscf4cjrhzsea5an5smt4z9aezhh4sf5jjrqka',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1hjd20hjvkx06y8p42xl0uzr3gr3ue3nkvd79jj',
        },
        {
          ratePercent: 0.08,
          validatorAddress: 'secretvaloper1cpp4s3t962tsn737fj4v8jr7net50qgxpn3nap',
        },
        {
          ratePercent: 0.1,
          validatorAddress: 'secretvaloper1c9g5k7svhxpl8vq6az25npwugj6m2srlnd3qcr',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1en4uz9wpztlcyexz8xgza4rkjc6l0a06lzsz09',
        },
        {
          ratePercent: 0.04,
          validatorAddress: 'secretvaloper16p9uqwcq2gvz75y5p9zvhn7vek9ra9zfunwyf0',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper16zkp5ngqkxtpr4wz3ew7jhyq2elsyaer6xj32s',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper16w5hlcf389le2n60t32eqf43plp539ged9sruy',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper16k26akna7h295rfjx3278s7xusnt736vy437y8',
        },
        {
          ratePercent: 0.02,
          validatorAddress: 'secretvaloper1mu525lvsdafu2f2s5ngf2qc5vufvmwej9ww64l',
        },
        {
          ratePercent: 1,
          validatorAddress: 'secretvaloper1utjz56dymhnu97jdzy8rhpwp9y97pt7duaa5ut',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1arfql9hv2m8nq3ssyjd0z8t4r4vh5senz5sj00',
        },
        {
          ratePercent: 1,
          validatorAddress: 'secretvaloper1agl5a3nlthtkxm7z58z4ttfcu348pt7wd06w9a',
        },
        {
          ratePercent: 0.03,
          validatorAddress: 'secretvaloper1ahawe276d250zpxt0xgpfg63ymmu63a0svuvgw',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper17m3c795fz4f36zjgjhr3vkf7e9pn3xxuryeww9',
        },
        {
          ratePercent: 0,
          validatorAddress: 'secretvaloper1lyafdwwzwfmjc8zhsew5pdcdu46na6pg09fql4',
        },
        {
          ratePercent: 0.05,
          validatorAddress: 'secretvaloper1larnhgur2ts7hlhphmtk65c3qz6dt52y79szst',
        },
      ],
    })),
  }));

  vi.mock('~/contracts/services/derivativeScrt', () => ({
    queryDerivativeScrtInfo$: vi.fn(() => of({
      validators: [
        {
          validatorAddress: 'secretvaloper12ancx2qcgk04rrkexuhjq93etgktq4nn58z9yu',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper16k26akna7h295rfjx3278s7xusnt736vy437y8',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper18acdn4vaxfkqj0ta25u3ulzdyzekrqe5w9q2n4',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper19dw5tuep06ke9smem3df0lqvhpd25ke3we95n3',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1ahawe276d250zpxt0xgpfg63ymmu63a0svuvgw',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1cpp4s3t962tsn737fj4v8jr7net50qgxpn3nap',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1dpajv4su00mzf4r7rhzytc0vs23njkh2wll6lp',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1gkk02na77t83dvmf9vd7lajptejaqkyug62h56',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1jgx4pn3acae9esq5zha5ym3kzhq6x60frjwkrp',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1lyafdwwzwfmjc8zhsew5pdcdu46na6pg09fql4',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1nqxdqq6qhtaj9m2t2mgvzds0xa6fa2g9sk5ymu',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1pujrvwt9xve0u0t472x5wm0lf5r37thakp7pvw',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1q0rth4fu4svxnw63vjd7w74nadzsdp0fmkhj3d',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1qjk5uduu3zg356chmstcp2eqgdn35jp3ztxh4x',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1t5wtcuwjkdct9qkw2h6m48zu2hectpd6ulmekk',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1tums792cvpugaydvqgl7t6r5khfsgh7n78hs5w',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1vzkdmu0sa8gaj686jh5all7hpmmsp8x87vyz8z',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1wg085tj9xtv84q9l2zgdml46n6ju3mryun4fsu',
          weight: 4,
        },
        {
          validatorAddress: 'secretvaloper1xyvlmw93ytmcju4suuk8tpuhzu6rtnnwqc6a7y',
          weight: 4,
        },
      ],
    })),
  }));
});

test('it can calculate the correct derivative apy', async () => {
  const input = {
    queryRouterContractAddress: 'MOCK_QUERY_ADDRESS',
    queryRouterCodeHash: 'MOCK_QUERY_ROUTER_CODE_HASH',
    contractAddress: 'MOCK_STKD_ADDRESS',
    codeHash: 'MOCK_STKD_HASH',
    lcdEndpoint: 'MOCK_ENDPOINT',
    chainId: 'MOCK_CHAIN_ID',
  };

  let output;
  calculateDerivativeScrtApy$(input).subscribe({
    next: (response: number) => {
      output = response;
    },
  });

  expect(secretChainQueries$).toHaveBeenCalledWith(
    input.lcdEndpoint,
    Object.values(SecretQueryOptions),
  );

  expect(queryDerivativeScrtInfo$).toHaveBeenCalledWith({
    queryRouterContractAddress: input.queryRouterContractAddress,
    queryRouterCodeHash: input.queryRouterCodeHash,
    contractAddress: input.contractAddress,
    codeHash: input.codeHash,
    lcdEndpoint: input.lcdEndpoint,
    chainId: input.chainId,
  });

  expect(output).toStrictEqual(0.1641591628625081);

  const output2 = await calculateDerivativeScrtApy(input);

  expect(output2).toStrictEqual(0.1641591628625081);
});
