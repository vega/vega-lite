/// <reference types="webdriverio"/>

import {assert} from 'chai';
import {bound, brush, compositeTypes, embedFn, parentSelector, spec, testRenderFn, tuples, unbound} from './util';

const hits = {
  zoom: [9, 23],
  bins: [8, 2]
};

type InOut = 'in' | 'out';

function zoom(key: string, idx: number, direction: InOut, parent?: string, targetBrush?: boolean) {
  const delta = direction === 'out' ? 200 : -200;
  return `return zoom(${hits[key][idx]}, ${delta}, ${parent}, ${targetBrush})`;
}

const cmp = (a: number, b: number) => a - b;

for (const bind of [bound, unbound]) {
  describe(`Zoom ${bind} interval selections at runtime`, () => {
    const type = 'interval';
    const embed = embedFn(browser);
    const testRender = testRenderFn(browser, `interval/zoom/${bind}`);
    const binding = bind === bound ? {bind: 'scales'} : {};

    const assertExtent = {
      in: ['isAtLeast', 'isAtMost'],
      out: ['isAtMost', 'isAtLeast']
    };

    function setup(brushKey: string, idx: number, encodings: string[], parent?: string) {
      const inOut: InOut = idx % 2 ? 'out' : 'in';
      let xold: number[];
      let yold: number[];

      if (bind === unbound) {
        const drag = browser.execute(brush(brushKey, idx, parent))[0];
        xold = drag.values[0].sort(cmp);
        yold = encodings.indexOf('y') >= 0 ? drag.values[encodings.indexOf('x') + 1].sort(cmp) : null;
      } else {
        xold = JSON.parse(browser.execute('return JSON.stringify(view._runtime.scales.x.value.domain())'));
        yold = browser.execute('return view._runtime.scales.y.value.domain()');
      }

      return {inOut, xold, yold};
    }

    it('should zoom in and out', () => {
      for (let i = 0; i < hits.zoom.length; i++) {
        embed(spec('unit', i, {type, ...binding}));
        const {inOut, xold, yold} = setup('drag', i, ['x', 'y']);
        testRender(`${inOut}-0`);

        const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound))[0];
        const xnew = zoomed.values[0].sort(cmp);
        const ynew = zoomed.values[1].sort(cmp);
        testRender(`${inOut}-1`);
        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
      }
    });

    it('should work with binned domains', () => {
      for (let i = 0; i < hits.bins.length; i++) {
        const encodings = ['y'];
        embed(
          spec(
            'unit',
            1,
            {type, ...binding, encodings},
            {
              x: {aggregate: 'count', field: '*', type: 'quantitative'},
              y: {bin: true},
              color: {value: 'steelblue', field: null, type: null}
            }
          )
        );

        const {inOut, yold} = setup('bins', i, encodings);
        testRender(`bins_${inOut}-0`);

        const zoomed = browser.execute(zoom('bins', i, inOut, null, bind === unbound))[0];
        const ynew = zoomed.values[0].sort(cmp);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
        testRender(`bins_${inOut}-1`);
      }
    });

    it('should work with temporal domains', () => {
      const values = tuples.map(d => ({...d, a: new Date(2017, d.a)}));
      const encodings = ['x'];

      for (let i = 0; i < hits.zoom.length; i++) {
        embed(spec('unit', i, {type, ...binding, encodings}, {values, x: {type: 'temporal'}}));
        const {inOut, xold} = setup('drag', i, encodings);
        testRender(`temporal_${inOut}-0`);

        const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound))[0];
        const xnew = zoomed.values[0].sort(cmp);
        assert[assertExtent[inOut][0]](+xnew[0], +new Date(xold[0]));
        assert[assertExtent[inOut][1]](+xnew[1], +new Date(xold[1]));
        testRender(`temporal_${inOut}-1`);
      }
    });

    it('should work with log/pow scales', () => {
      for (let i = 0; i < hits.zoom.length; i++) {
        embed(
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
        const {inOut, xold, yold} = setup('drag', i, ['x', 'y']);
        testRender(`logpow_${inOut}-0`);

        const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound))[0];
        const xnew = zoomed.values[0].sort(cmp);
        const ynew = zoomed.values[1].sort(cmp);
        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
        testRender(`logpow_${inOut}-1`);
      }
    });

    if (bind === unbound) {
      it('should work with ordinal/nominal domains', () => {
        for (let i = 0; i < hits.zoom.length; i++) {
          embed(
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
          const {inOut, xold, yold} = setup('drag', i, ['x', 'y']);
          testRender(`ord_${inOut}-0`);

          const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound))[0];
          const xnew = zoomed.values[0].sort(cmp);
          const ynew = zoomed.values[1].sort(cmp);

          if (inOut === 'in') {
            assert.isAtMost(xnew.length, xold.length);
            assert.isAtMost(ynew.length, yold.length);
          } else {
            assert.isAtLeast(xnew.length, xold.length);
            assert.isAtLeast(ynew.length, yold.length);
          }

          testRender(`ord_${inOut}-1`);
        }
      });
    } else {
      for (const specType of compositeTypes) {
        it(`should work with shared scales in ${specType} views`, () => {
          for (let i = 0; i < hits.bins.length; i++) {
            embed(spec(specType, 0, {type, ...binding}, {resolve: {scale: {x: 'shared', y: 'shared'}}}));
            const parent = parentSelector(specType, i);
            const {inOut, xold, yold} = setup(specType, i, ['x', 'y'], parent);
            const zoomed = browser.execute(zoom('bins', i, inOut, null, bind === unbound))[0];
            const xnew = zoomed.values[0].sort(cmp);
            const ynew = zoomed.values[1].sort(cmp);
            assert[assertExtent[inOut][0]](xnew[0], xold[0]);
            assert[assertExtent[inOut][1]](xnew[1], xold[1]);
            assert[assertExtent[inOut][0]](ynew[0], yold[0]);
            assert[assertExtent[inOut][1]](ynew[1], yold[1]);
            testRender(`${specType}_${inOut}`);
          }
        });
      }
    }
  });
}
