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
  unbound,
} from './util';

[bound, unbound].forEach(function(bind, idx) {
  describe(`Translate ${bind} interval selections at runtime`, function() {
    const type = 'interval';
    const hits = hitsMaster.interval;
    const embed = embedFn(browser);
    const testRender = testRenderFn(browser, `interval/translate/${bind}`);
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

    it('should move back-and-forth', function() {
      for (let i = 0; i < hits.translate.length; i++) {
        embed(spec('unit', i, {type, ...binding}));
        const drag = browser.execute(brush('drag', i)).value[0];
        testRender(`${i}-0`);
        const translate = browser.execute(brush('translate', i, null, bind === unbound)).value[0];
        assert[assertExtent[bind].x[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
        assert[assertExtent[bind].x[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
        assert[assertExtent[bind].y[i]](translate.intervals[1].extent[0], drag.intervals[1].extent[0]);
        assert[assertExtent[bind].y[i]](translate.intervals[1].extent[1], drag.intervals[1].extent[1]);
        testRender(`${i}-1`);
      }
    });

    it('should work with binned domains', function() {
      for (let i = 0; i < hits.bins.length; i++) {
        embed(spec('unit', 1, {type, ...binding, encodings: ['y']}, {
          x: {aggregate: 'count', field: '*', type: 'quantitative'},
          y: {bin: true},
          color: {value: 'steelblue', field: null, type: null}
        }));
        const drag = browser.execute(brush('bins', i)).value[0];
        testRender(`bins_${i}-0`);
        const translate = browser.execute(brush('bins_translate', i, null, bind === unbound)).value[0];
        assert[assertExtent[bind].y[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
        assert[assertExtent[bind].y[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
        testRender(`bins_${i}-1`);
      }
    });

    it('should work with temporal domains', function() {
      const values = tuples.map((d) => ({...d, a: new Date(2017, d.a)}));
      const toNumber = '[0].intervals[0].extent.map((d) => +d)';

      for (let i = 0; i < hits.translate.length; i++) {
        embed(spec('unit', i, {type, ...binding, encodings: ['x']},
          {values, x: {type: 'temporal'}}));
        const drag = browser.execute(brush('drag', i) + toNumber).value;
        testRender(`temporal_${i}-0`);
        const translate = browser.execute(brush('translate', i, null, bind === unbound) + toNumber).value;
        assert[assertExtent[bind].x[i]](translate[0], drag[0]);
        assert[assertExtent[bind].x[i]](translate[1], drag[1]);
        testRender(`temporal_${i}-1`);
      }

    });

    it('should work with log/pow scales', function() {
      for (let i = 0; i < hits.translate.length; i++) {
        embed(spec('unit', i, {type, ...binding}, {
          x: {scale: {type: 'pow', exponent: 1.5}},
          y: {scale: {type: 'log'}}
        }));
        const drag = browser.execute(brush('drag', i)).value[0];
        testRender(`logpow_${i}-0`);
        const translate = browser.execute(brush('translate', i, null, bind === unbound)).value[0];
        assert[assertExtent[bind].x[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
        assert[assertExtent[bind].x[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
        assert[assertExtent[bind].y[i]](translate.intervals[1].extent[0], drag.intervals[1].extent[0]);
        assert[assertExtent[bind].y[i]](translate.intervals[1].extent[1], drag.intervals[1].extent[1]);
        testRender(`logpow_${i}-1`);
      }
    });

    if (bind === unbound) {
      it('should work with ordinal/nominal domains', function() {
        for (let i = 0; i < hits.translate.length; i++) {
          embed(spec('unit', i, {type, ...binding}, {
            x: {type: 'ordinal'}, y: {type: 'nominal'}
          }));
          const drag = browser.execute(brush('drag', i)).value[0];
          testRender(`ord_${i}-0`);
          const translate = browser.execute(brush('translate', i, null, true)).value[0];
          assert[assertExtent[bind].x[i]](translate.intervals[0].extent[0], drag.intervals[0].extent[0]);
          assert[assertExtent[bind].x[i]](translate.intervals[0].extent[1], drag.intervals[0].extent[1]);
          assert[assertExtent[bind].y[i]](translate.intervals[1].extent[0], drag.intervals[1].extent[0]);
          assert[assertExtent[bind].y[i]](translate.intervals[1].extent[1], drag.intervals[1].extent[1]);
          testRender(`ord_${i}-1`);
        }
      });
    } else {
      compositeTypes.forEach(function(specType) {
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
        it(`should work with shared scales in ${specType} views`, function() {
          for (let i = 0; i < hits[specType].length; i++) {
            embed(spec(specType, 0, {type, ...binding},
              {resolve: {scale: {x:'shared', y: 'shared'}}}));
            const parent = parentSelector(specType, i);
            const xscale = browser.execute('return view._runtime.scales.x.value.domain()').value;
            const yscale = browser.execute('return view._runtime.scales.y.value.domain()').value;
            const drag = browser.execute(brush(specType, i, parent)).value[0];
            assert[assertExtents[specType].x[i]](drag.intervals[0].extent[0], xscale[0], `iter: ${i}`);
            assert[assertExtents[specType].x[i]](drag.intervals[0].extent[1], xscale[1], `iter: ${i}`);
            assert[assertExtents[specType].y[i]](drag.intervals[1].extent[0], yscale[0], `iter: ${i}`);
            assert[assertExtents[specType].y[i]](drag.intervals[1].extent[1], yscale[1], `iter: ${i}`);
            testRender(`${specType}_${i}`);
          }
        });
      });
    }
  });
});
