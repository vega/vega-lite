/* eslint-disable jest/expect-expect */

import {assert} from 'chai';
import {bound, brush, compositeTypes, embedFn, parentSelector, spec, testRenderFn, tuples, unbound} from './util';
const hits = {
  zoom: [9, 23],
  bins: [8, 2]
};
import {Page} from 'puppeteer/lib/cjs/puppeteer/common/Page';
import {TopLevelSpec} from '../src';

type InOut = 'in' | 'out';

function zoom(key: string, idx: number, direction: InOut, parent?: string, targetBrush?: boolean) {
  const delta = direction === 'out' ? 200 : -200;
  return `zoom(${hits[key][idx]}, ${delta}, ${parent}, ${targetBrush})`;
}

const cmp = (a: number, b: number) => a - b;

for (const bind of [bound, unbound]) {
  describe(`Zoom ${bind} interval selections at runtime`, () => {
    let page: Page;
    let embed: (specification: TopLevelSpec) => Promise<void>;
    let testRender: (filename: string) => Promise<void>;

    beforeAll(async () => {
      page = await (global as any).__BROWSER__.newPage();
      embed = embedFn(page);
      testRender = testRenderFn(page, `interval/zoom/${bind}`);
      await page.goto('http://0.0.0.0:8000/test-runtime/');
    });

    afterAll(async () => {
      await page.close();
    });

    const type = 'interval';
    const binding = bind === bound ? {bind: 'scales'} : {};

    const assertExtent = {
      in: ['isAtLeast', 'isAtMost'],
      out: ['isAtMost', 'isAtLeast']
    };

    async function setup(brushKey: string, idx: number, encodings: string[], parent?: string) {
      const inOut: InOut = idx % 2 ? 'out' : 'in';
      let xold: number[];
      let yold: number[];

      if (bind === unbound) {
        const drag = (await page.evaluate(brush(brushKey, idx, parent)))[0];
        xold = drag.values[0].sort(cmp);
        yold = encodings.includes('y') ? drag.values[encodings.indexOf('x') + 1].sort(cmp) : null;
      } else {
        xold = JSON.parse((await page.evaluate('JSON.stringify(view._runtime.scales.x.value.domain())')) as string);
        yold = (await page.evaluate('view._runtime.scales.y.value.domain()')) as number[];
      }

      return {inOut, xold, yold};
    }

    it('should zoom in and out', async () => {
      for (let i = 0; i < hits.zoom.length; i++) {
        await embed(spec('unit', i, {type, ...binding}));
        const {inOut, xold, yold} = await setup('drag', i, ['x', 'y']);
        await testRender(`${inOut}-0`);

        const zoomed = (await page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
        const xnew = zoomed.values[0].sort(cmp);
        const ynew = zoomed.values[1].sort(cmp);
        await testRender(`${inOut}-1`);
        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
      }
    });

    it('should work with binned domains', async () => {
      for (let i = 0; i < hits.bins.length; i++) {
        const encodings = ['y'];
        await embed(
          spec(
            'unit',
            1,
            {type, ...binding, encodings},
            {
              x: {aggregate: 'count', type: 'quantitative'},
              y: {bin: true},
              color: {value: 'steelblue', field: null, type: null}
            }
          )
        );

        const {inOut, yold} = await setup('bins', i, encodings);
        await testRender(`bins_${inOut}-0`);

        const zoomed = (await page.evaluate(zoom('bins', i, inOut, null, bind === unbound)))[0];
        const ynew = zoomed.values[0].sort(cmp);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
        await testRender(`bins_${inOut}-1`);
      }
    });

    it('should work with temporal domains', async () => {
      const values = tuples.map(d => ({...d, a: new Date(2017, d.a)}));
      const encodings = ['x'];

      for (let i = 0; i < hits.zoom.length; i++) {
        await embed(spec('unit', i, {type, ...binding, encodings}, {values, x: {type: 'temporal'}}));
        const {inOut, xold} = await setup('drag', i, encodings);
        await testRender(`temporal_${inOut}-0`);

        const zoomed = (await page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
        const xnew = zoomed.values[0].sort(cmp);
        assert[assertExtent[inOut][0]](+xnew[0], +new Date(xold[0]));
        assert[assertExtent[inOut][1]](+xnew[1], +new Date(xold[1]));
        await testRender(`temporal_${inOut}-1`);
      }
    });

    it('should work with log/pow scales', async () => {
      for (let i = 0; i < hits.zoom.length; i++) {
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
        const {inOut, xold, yold} = await setup('drag', i, ['x', 'y']);
        await testRender(`logpow_${inOut}-0`);

        const zoomed = (await page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
        const xnew = zoomed.values[0].sort(cmp);
        const ynew = zoomed.values[1].sort(cmp);
        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
        await testRender(`logpow_${inOut}-1`);
      }
    });

    if (bind === unbound) {
      it('should work with ordinal/nominal domains', async () => {
        for (let i = 0; i < hits.zoom.length; i++) {
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
          const {inOut, xold, yold} = await setup('drag', i, ['x', 'y']);
          await testRender(`ord_${inOut}-0`);

          const zoomed = (await page.evaluate(zoom('zoom', i, inOut, null, bind === unbound)))[0];
          const xnew = zoomed.values[0].sort(cmp);
          const ynew = zoomed.values[1].sort(cmp);

          if (inOut === 'in') {
            expect(xnew.length).toBeLessThanOrEqual(xold.length);
            expect(ynew.length).toBeLessThanOrEqual(yold.length);
          } else {
            expect(xnew.length).toBeGreaterThanOrEqual(xold.length);
            expect(ynew.length).toBeGreaterThanOrEqual(yold.length);
          }

          await testRender(`ord_${inOut}-1`);
        }
      });
    } else {
      for (const specType of compositeTypes) {
        it(`should work with shared scales in ${specType} views`, async () => {
          for (let i = 0; i < hits.bins.length; i++) {
            await embed(spec(specType, 0, {type, ...binding}, {resolve: {scale: {x: 'shared', y: 'shared'}}}));
            const parent = parentSelector(specType, i);
            const {inOut, xold, yold} = await setup(specType, i, ['x', 'y'], parent);
            const zoomed = (await page.evaluate(zoom('bins', i, inOut, null, bind === unbound)))[0];
            const xnew = zoomed.values[0].sort(cmp);
            const ynew = zoomed.values[1].sort(cmp);
            assert[assertExtent[inOut][0]](xnew[0], xold[0]);
            assert[assertExtent[inOut][1]](xnew[1], xold[1]);
            assert[assertExtent[inOut][0]](ynew[0], yold[0]);
            assert[assertExtent[inOut][1]](ynew[1], yold[1]);
            await testRender(`${specType}_${inOut}`);
          }
        });
      }
    }
  });
}
