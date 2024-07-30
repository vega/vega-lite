/* eslint-disable jest/valid-expect */

import {
  bound,
  brush,
  compositeTypes,
  embedFn,
  geoSpec,
  hits as hitsMaster,
  parentSelector,
  spec,
  testRenderFn,
  tuples,
  unbound
} from './util';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';
import {TopLevelSpec} from '../src';

describe('Translate interval selections at runtime', () => {
  let page: Page;
  let embed: (specification: TopLevelSpec) => Promise<void>;
  let testRender: (filename: string) => Promise<void>;

  beforeAll(async () => {
    page = await (global as any).__BROWSER_GLOBAL__.newPage();
    embed = embedFn(page);
    await page.goto('http://0.0.0.0:8000/test-runtime/');
  });

  afterAll(async () => {
    await page.close();
  });

  const hits = hitsMaster.interval;

  for (const bind of [bound, unbound] as const) {
    describe(`${bind} intervals`, () => {
      beforeAll(() => {
        testRender = testRenderFn(page, `interval/translate/${bind}`);
      });

      const type = 'interval';
      const binding = bind === bound ? {bind: 'scales'} : {};

      const assertExtent = {
        [unbound]: {
          x: ['toBeGreaterThan', 'toBeLessThan'],
          y: ['toBeLessThan', 'toBeGreaterThan']
        },
        [bound]: {
          x: ['toBeLessThan', 'toBeGreaterThan'],
          y: ['toBeGreaterThan', 'toBeLessThan']
        }
      } as const;

      it('should move back-and-forth', async () => {
        for (let i = 0; i < hits.translate.length; i++) {
          await embed(spec('unit', i, {type, ...binding}));
          const drag = ((await page.evaluate(brush('drag', i))) as [any])[0];
          await testRender(`${i}-0`);
          const translate = ((await page.evaluate(brush('translate', i, null, bind === unbound))) as [any])[0];
          expect(translate.values[0][0])[assertExtent[bind].x[i]](drag.values[0][0]);
          expect(translate.values[0][1])[assertExtent[bind].x[i]](drag.values[0][1]);
          expect(translate.values[1][0])[assertExtent[bind].y[i]](drag.values[1][0]);
          expect(translate.values[1][1])[assertExtent[bind].y[i]](drag.values[1][1]);
          await testRender(`${i}-1`);
        }
      });

      it('should work with binned domains', async () => {
        for (let i = 0; i < hits.bins.length; i++) {
          await embed(
            spec(
              'unit',
              1,
              {type, ...binding, encodings: ['y']},
              {
                x: {aggregate: 'count', type: 'quantitative'},
                y: {bin: true},
                color: {value: 'steelblue', field: null, type: null}
              }
            )
          );
          const drag = ((await page.evaluate(brush('bins', i))) as [any])[0];
          await testRender(`bins_${i}-0`);
          const translate = ((await page.evaluate(brush('bins_translate', i, null, bind === unbound))) as [any])[0];
          expect(translate.values[0][0])[assertExtent[bind].y[i]](drag.values[0][0]);
          expect(translate.values[0][1])[assertExtent[bind].y[i]](drag.values[0][1]);
          await testRender(`bins_${i}-1`);
        }
      });

      it('should work with temporal domains', async () => {
        // await jestPuppeteer.debug();
        const values = tuples.map(d => ({...d, a: new Date(2017, d.a)}));
        const toNumber = (a: any) => a[0].values[0].map((d: any) => +d);

        for (let i = 0; i < hits.translate.length; i++) {
          await embed(spec('unit', i, {type, ...binding, encodings: ['x']}, {values, x: {type: 'temporal'}}));
          const drag = toNumber(await page.evaluate(brush('drag', i)));
          await testRender(`temporal_${i}-0`);
          const translate = toNumber(await page.evaluate(brush('translate', i, null, bind === unbound)));
          expect(translate[0])[assertExtent[bind].x[i]](drag[0]);
          expect(translate[1])[assertExtent[bind].x[i]](drag[1]);
          await testRender(`temporal_${i}-1`);
        }
      });

      it('should work with log/pow scales', async () => {
        for (let i = 0; i < hits.translate.length; i++) {
          await embed(
            spec(
              'unit',
              i,
              {type, ...binding},
              {
                x: {scale: {type: 'pow', exponent: 1.5}},
                y: {scale: {type: 'log'}}
              }
            )
          );
          const drag = ((await page.evaluate(brush('drag', i))) as [any])[0];
          await testRender(`logpow_${i}-0`);
          const translate = ((await page.evaluate(brush('translate', i, null, bind === unbound))) as [any])[0];
          expect(translate.values[0][0])[assertExtent[bind].x[i]](drag.values[0][0]);
          expect(translate.values[0][1])[assertExtent[bind].x[i]](drag.values[0][1]);
          expect(translate.values[1][0])[assertExtent[bind].y[i]](drag.values[1][0]);
          expect(translate.values[1][1])[assertExtent[bind].y[i]](drag.values[1][1]);
          await testRender(`logpow_${i}-1`);
        }
      });

      if (bind === unbound) {
        it('should work with ordinal/nominal domains', async () => {
          for (let i = 0; i < hits.translate.length; i++) {
            await embed(
              spec(
                'unit',
                i,
                {type, ...binding},
                {
                  x: {type: 'ordinal'},
                  y: {type: 'nominal'}
                }
              )
            );
            const drag = ((await page.evaluate(brush('drag', i))) as [any])[0];
            await testRender(`ord_${i}-0`);
            const translate = ((await page.evaluate(brush('translate', i, null, true))) as [any])[0];
            expect(translate.values[0][0])[assertExtent[bind].x[i]](drag.values[0][0]);
            expect(translate.values[0][1])[assertExtent[bind].x[i]](drag.values[0][1]);
            expect(translate.values[1][0])[assertExtent[bind].y[i]](drag.values[1][0]);
            expect(translate.values[1][1])[assertExtent[bind].y[i]](drag.values[1][1]);
            await testRender(`ord_${i}-1`);
          }
        });
      } else {
        for (const specType of compositeTypes) {
          const assertExtents = {
            repeat: {
              x: ['toBeLessThan', 'toBeLessThan', 'toBeLessThan'],
              y: ['toBeGreaterThan', 'toBeGreaterThan', 'toBeGreaterThan']
            },
            facet: {
              x: ['toBeLessThan', 'toBeLessThan', 'toBeLessThan'],
              y: ['toBeLessThan', 'toBeGreaterThan', 'toBeLessThan']
            }
          };
          it(`should work with shared scales in ${specType} views`, async () => {
            for (let i = 0; i < (hits as any)[specType].length; i++) {
              await embed(spec(specType, 0, {type, ...binding}, {resolve: {scale: {x: 'shared', y: 'shared'}}}));
              const parent = parentSelector(specType, i);
              const xscale = (await page.evaluate('view._runtime.scales.x.value.domain()')) as any[];
              const yscale = (await page.evaluate('view._runtime.scales.y.value.domain()')) as any[];
              const drag = ((await page.evaluate(brush(specType, i, parent))) as [any])[0];
              ((expect(drag.values[0][0]) as any)[(assertExtents as any)[specType].x[i]] as any)(xscale[0]);
              ((expect(drag.values[0][1]) as any)[(assertExtents as any)[specType].x[i]] as any)(xscale[1]);
              ((expect(drag.values[1][0]) as any)[(assertExtents as any)[specType].y[i]] as any)(yscale[0]);
              ((expect(drag.values[1][1]) as any)[(assertExtents as any)[specType].y[i]] as any)(yscale[1]);
              await testRender(`${specType}_${i}`);
            }
          });
        }
      }
    });
  }

  it('should work with geo intervals', async () => {
    testRender = testRenderFn(page, `interval/translate`);

    await embed(geoSpec());
    const drag = await page.evaluate(brush('drag', 1));
    expect(drag).toHaveLength(13);
    await testRender(`geo-0`);

    for (let i = 0; i < hits.translate.length; i++) {
      const translate: any = await page.evaluate(brush('translate', i, null, true));
      expect(translate.length).toBeGreaterThan(0);
      await testRender(`geo-${i + 1}`);
    }
  });
});
