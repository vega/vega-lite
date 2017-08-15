import {assert} from 'chai';
import {
  bound,
  brush,
  compositeTypes,
  embedFn,
  parentSelector,
  spec,
  testRenderFn,
  tuples,
  unbound,
} from './util';

const hits = {
  zoom: [9, 23],
  bins: [8, 2]
};

type InOut = 'in' | 'out';

function zoom(key: string, idx: number, zoom: InOut, parent?: string, targetBrush?: boolean) {
  const delta = zoom === 'out' ? 200 : -200;
  return `return zoom(${hits[key][idx]}, ${delta}, ${parent}, ${targetBrush})`;
}

const cmp = (a: number, b: number) => a - b;

[bound, unbound].forEach(function(bind) {
  describe(`Zoom ${bind} interval selections at runtime`, function() {
    const type = 'interval';
    const embed = embedFn(browser);
    const testRender = testRenderFn(browser, `interval/zoom/${bind}`);
    const binding = bind === bound ? {bind: 'scales'} : {};

    const assertExtent = {
      in: ['isAtLeast', 'isAtMost'], out: ['isAtMost', 'isAtLeast']
    };

    function setup(brushKey: string, idx: number, encodings: string[], parent?: string) {
      const inOut: InOut = idx % 2 ? 'out' : 'in';
      let xold: number[];
      let yold: number[];

      if (bind === unbound) {
        const drag = browser.execute(brush(brushKey, idx, parent)).value[0];
        xold = drag.intervals[0].extent.sort(cmp);
        yold = encodings.indexOf('y') >= 0 ? drag.intervals[encodings.indexOf('x') + 1].extent.sort(cmp) : null;
      } else {
        xold = JSON.parse(browser.execute('return JSON.stringify(view._runtime.scales.x.value.domain())').value);
        yold = browser.execute('return view._runtime.scales.y.value.domain()').value;
      }

      return {inOut, xold, yold};
    }

    it('should zoom in and out', function() {
      for (let i = 0; i < hits.zoom.length; i++) {
        embed(spec('unit', i, {type, ...binding}));
        const {inOut, xold, yold} = setup('drag', i, ['x', 'y']);
        testRender(`${inOut}-0`);

        const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
        const xnew = zoomed.intervals[0].extent.sort(cmp);
        const ynew = zoomed.intervals[1].extent.sort(cmp);
        testRender(`${inOut}-1`);
        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);

      }
    });

    it('should work with binned domains', function() {
      for (let i = 0; i < hits.bins.length; i++) {
        const encodings = ['y'];
        embed(spec('unit', 1, {type, ...binding, encodings}, {
          x: {aggregate: 'count', field: '*', type: 'quantitative'},
          y: {bin: true},
          color: {value: 'steelblue', field: null, type: null}
        }));

        const {inOut, yold} = setup('bins', i, encodings);
        testRender(`bins_${inOut}-0`);

        const zoomed = browser.execute(zoom('bins', i, inOut, null, bind === unbound)).value[0];
        const ynew = zoomed.intervals[0].extent.sort(cmp);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
        testRender(`bins_${inOut}-1`);
      }
    });

    it('should work with temporal domains', function() {
      const values = tuples.map((d) => ({...d, a: new Date(2017, d.a)}));
      const encodings = ['x'];

      for (let i = 0; i < hits.zoom.length; i++) {
        embed(spec('unit', i, {type, ...binding, encodings},
          {values, x: {type: 'temporal'}}));
        const {inOut, xold} = setup('drag', i, encodings);
        testRender(`temporal_${inOut}-0`);

        const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
        const xnew = zoomed.intervals[0].extent.sort(cmp);
        assert[assertExtent[inOut][0]](+xnew[0], +(new Date(xold[0])));
        assert[assertExtent[inOut][1]](+xnew[1], +(new Date(xold[1])));
        testRender(`temporal_${inOut}-1`);
      }

    });

    it('should work with log/pow scales', function() {
      for (let i = 0; i < hits.zoom.length; i++) {
        embed(spec('unit', i, {type, ...binding}, {
          x: {scale: {type: 'pow', exponent: 1.5}},
          y: {scale: {type: 'log'}}
        }));
        const {inOut, xold, yold} = setup('drag', i, ['x', 'y']);
        testRender(`logpow_${inOut}-0`);

        const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
        const xnew = zoomed.intervals[0].extent.sort(cmp);
        const ynew = zoomed.intervals[1].extent.sort(cmp);
        assert[assertExtent[inOut][0]](xnew[0], xold[0]);
        assert[assertExtent[inOut][1]](xnew[1], xold[1]);
        assert[assertExtent[inOut][0]](ynew[0], yold[0]);
        assert[assertExtent[inOut][1]](ynew[1], yold[1]);
        testRender(`logpow_${inOut}-1`);
      }
    });

    if (bind === unbound) {
      it('should work with ordinal/nominal domains', function() {
        for (let i = 0; i < hits.zoom.length; i++) {
          embed(spec('unit', i, {type, ...binding}, {
            x: {type: 'ordinal'}, y: {type: 'nominal'}
          }));
          const {inOut, xold, yold} = setup('drag', i, ['x', 'y']);
          testRender(`ord_${inOut}-0`);

          const zoomed = browser.execute(zoom('zoom', i, inOut, null, bind === unbound)).value[0];
          const xnew = zoomed.intervals[0].extent.sort(cmp);
          const ynew = zoomed.intervals[1].extent.sort(cmp);

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
      compositeTypes.forEach(function(specType) {
        it(`should work with shared scales in ${specType} views`, function() {
          for (let i = 0; i < hits.bins.length; i++) {
            embed(spec(specType, 0, {type, ...binding},
              {resolve: {scale: {x: 'shared', y: 'shared'}}}));
            const parent = parentSelector(specType, i);
            const {inOut, xold, yold} = setup(specType, i, ['x', 'y'], parent);
            const zoomed = browser.execute(zoom('bins', i, inOut, null, bind === unbound)).value[0];
            const xnew = zoomed.intervals[0].extent.sort(cmp);
            const ynew = zoomed.intervals[1].extent.sort(cmp);
            assert[assertExtent[inOut][0]](xnew[0], xold[0]);
            assert[assertExtent[inOut][1]](xnew[1], xold[1]);
            assert[assertExtent[inOut][0]](ynew[0], yold[0]);
            assert[assertExtent[inOut][1]](ynew[1], yold[1]);
            testRender(`${specType}_${inOut}`);
          }
        });
      });
    }
  });
});
