/* eslint-disable jest/expect-expect */

import {assert} from 'chai';
import {
  bound,
  brush,
  compositeTypes,
  embedFn,
  hits as hitsMaster,
  parentSelector,
  spec,
  testRenderFn,
  tuples,
  unbound
} from './util';
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';
import {TopLevelSpec} from '../src';

for (const bind of [bound, unbound]) {
  describe(`Translate ${bind} interval selections at runtime`, () => {
    let page: Page;
    let embed: (specification: TopLevelSpec) => Promise<void>;
    let testRender: (filename: string) => Promise<void>;

    beforeAll(async () => {
      page = await (global as any).__BROWSER__.newPage();
      embed = embedFn(page);
      testRender = testRenderFn(page, `interval/translate/${bind}`);
      await page.goto('http://0.0.0.0:8000/test-runtime/');
    });

    afterAll(async () => {
      await page.close();
    });

    const type = 'interval';
    const hits = hitsMaster.interval;
    const binding = bind === bound ? {bind: 'scales'} : {};

    const assertExtent = {
      [unbound]: {
        x: ['isAbove', 'isBelow'],
        y: ['isBelow', 'isAbove']
      },
      [bound]: {
        x: ['isBelow', 'isAbove'],
        y: ['isAbove', 'isBelow']
      }
    };

    it('should move back-and-forth', async () => {
      for (let i = 0; i < hits.translate.length; i++) {
        await embed(spec('unit', i, {type, ...binding}));
        const drag = (await page.evaluate(brush('drag', i)))[0];
        await testRender(`${i}-0`);
        const translate = (await page.evaluate(brush('translate', i, null, bind === unbound)))[0];
        assert[assertExtent[bind].x[i]](translate.values[0][0], drag.values[0][0]);
        assert[assertExtent[bind].x[i]](translate.values[0][1], drag.values[0][1]);
        assert[assertExtent[bind].y[i]](translate.values[1][0], drag.values[1][0]);
        assert[assertExtent[bind].y[i]](translate.values[1][1], drag.values[1][1]);
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
        const drag = (await page.evaluate(brush('bins', i)))[0];
        await testRender(`bins_${i}-0`);
        const translate = (await page.evaluate(brush('bins_translate', i, null, bind === unbound)))[0];
        assert[assertExtent[bind].y[i]](translate.values[0][0], drag.values[0][0]);
        assert[assertExtent[bind].y[i]](translate.values[0][1], drag.values[0][1]);
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
        assert[assertExtent[bind].x[i]](translate[0], drag[0]);
        assert[assertExtent[bind].x[i]](translate[1], drag[1]);
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
        const drag = (await page.evaluate(brush('drag', i)))[0];
        await testRender(`logpow_${i}-0`);
        const translate = (await page.evaluate(brush('translate', i, null, bind === unbound)))[0];
        assert[assertExtent[bind].x[i]](translate.values[0][0], drag.values[0][0]);
        assert[assertExtent[bind].x[i]](translate.values[0][1], drag.values[0][1]);
        assert[assertExtent[bind].y[i]](translate.values[1][0], drag.values[1][0]);
        assert[assertExtent[bind].y[i]](translate.values[1][1], drag.values[1][1]);
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
          const drag = (await page.evaluate(brush('drag', i)))[0];
          await testRender(`ord_${i}-0`);
          const translate = (await page.evaluate(brush('translate', i, null, true)))[0];
          assert[assertExtent[bind].x[i]](translate.values[0][0], drag.values[0][0]);
          assert[assertExtent[bind].x[i]](translate.values[0][1], drag.values[0][1]);
          assert[assertExtent[bind].y[i]](translate.values[1][0], drag.values[1][0]);
          assert[assertExtent[bind].y[i]](translate.values[1][1], drag.values[1][1]);
          await testRender(`ord_${i}-1`);
        }
      });
    } else {
      for (const specType of compositeTypes) {
        const assertExtents = {
          repeat: {
            x: ['isBelow', 'isBelow', 'isBelow'],
            y: ['isAbove', 'isAbove', 'isAbove']
          },
          facet: {
            x: ['isBelow', 'isBelow', 'isBelow'],
            y: ['isBelow', 'isAbove', 'isBelow']
          }
        };
        it(`should work with shared scales in ${specType} views`, async () => {
          for (let i = 0; i < hits[specType].length; i++) {
            await embed(spec(specType, 0, {type, ...binding}, {resolve: {scale: {x: 'shared', y: 'shared'}}}));
            const parent = parentSelector(specType, i);
            const xscale = await page.evaluate('view._runtime.scales.x.value.domain()');
            const yscale = await page.evaluate('view._runtime.scales.y.value.domain()');
            const drag = (await page.evaluate(brush(specType, i, parent)))[0];
            assert[assertExtents[specType].x[i]](drag.values[0][0], xscale[0], `iter: ${i}`);
            assert[assertExtents[specType].x[i]](drag.values[0][1], xscale[1], `iter: ${i}`);
            assert[assertExtents[specType].y[i]](drag.values[1][0], yscale[0], `iter: ${i}`);
            assert[assertExtents[specType].y[i]](drag.values[1][1], yscale[1], `iter: ${i}`);
            await testRender(`${specType}_${i}`);
          }
        });
      }
    }
  });
}
