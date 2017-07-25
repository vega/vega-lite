import {assert} from 'chai';
import {InlineData} from '../src/data';
import {compositeTypes, data, embed as embedFn, resolutions, TestSpec, unit, unitNames} from './util';

const coords = {
  drag: [[75, 75, 150, 150], [150, 150, 175, 175]],
  drag_clear: [[205, 205, 205, 205]],

  composite: [[160, 75, 175, 175], [160, 315, 175, 365], [160, 615, 175, 665]],
  composite_clear: [[150, 65, 150, 65], [150, 305, 150, 305], [150, 605, 150, 605]]
};

const brush = (key: string, idx?: number) => `return brush(${coords[key][idx || 0].join(', ')})`;

describe('Interval selections at runtime', function() {
  const embed = embedFn.bind(null, browser);

  describe('in unit views', function() {
    it('should add extents to the store', function() {
      embed('unit', null, null, {brush: {type: 'interval'}});
      const store = browser.execute(brush('drag')).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.equal(store[0].intervals[1].encoding, 'y');
      assert.equal(store[0].intervals[1].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
      assert.lengthOf(store[0].intervals[1].extent, 2);
    });

    it('should respect projections', function() {
      embed('unit', null, null, {brush: {type: 'interval', encodings: ['x']}});
      let store = browser.execute(brush('drag')).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.lengthOf(store[0].intervals[0].extent, 2);

      embed('unit', null, null, {brush: {type: 'interval', encodings: ['y']}});
      store = browser.execute(brush('drag')).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'y');
      assert.equal(store[0].intervals[0].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    });

    it('should clear out stored extents', function() {
      embed('unit', null, null, {brush: {type: 'interval'}});
      let store = browser.execute(brush('drag')).value;
      assert.lengthOf(store, 1);

      store = browser.execute(brush('drag_clear')).value;
      assert.lengthOf(store, 0);

      store = browser.execute(brush('drag', 1)).value;
      assert.lengthOf(store, 1);
    });

    it('should brush over binned domains', function() {
      embed('unit', null, unit({bin: true}, {bin: true}),
        {brush: {type: 'interval'}});
      let store = browser.execute(brush('drag')).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      // length == 2 indicates a quantitative scale was inverted.
      assert.lengthOf(store[0].intervals[0].extent, 2);
      assert.lengthOf(store[0].intervals[1].extent, 2);

      store = browser.execute(brush('drag_clear')).value;
      assert.lengthOf(store, 0);
    });

    it('should brush over ordinal/nominal domains', function() {
      embed('unit', null, unit({type: 'ordinal'}, {type: 'nominal'}),
        {brush: {type: 'interval'}});
      let store = browser.execute(brush('drag')).value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      assert.sameMembers(store[0].intervals[0].extent, [1, 2, 3]);
      assert.sameMembers(store[0].intervals[1].extent, [17, 19, 23]);

      store = browser.execute(brush('drag_clear')).value;
      assert.lengthOf(store, 0);
    });

    it('should brush over temporal domains', function() {
      const values = data.map((d) => ({...d, a: new Date(2017, d.a)}));
      const drag = brush('drag') + '[0].intervals[0].extent.map((d) => +d)';

      embed('unit', values, unit({type: 'temporal'}), {brush: {type: 'interval', encodings: ['x']}});
      let extent = browser.execute(drag).value;
      assert.sameMembers(extent, [1485262206000, 1494106056000]);

      let store = browser.execute(brush('drag_clear')).value;
      assert.lengthOf(store, 0);

      embed('unit', values, unit({type: 'temporal', timeUnit: 'day'}),
        {brush: {type: 'interval', encodings: ['x']}});
      extent = browser.execute(drag).value;
      assert.sameMembers(extent, [1136188800000, 1136275200000, 1136361600000]);

      store = browser.execute(brush('drag_clear')).value;
      assert.lengthOf(store, 0);
    });
  });

  compositeTypes.forEach(function(specType) {
    describe(`in ${specType} views`, function() {
      // Loop through the views, drag to add a selection instance.
      // Store size should stay constant, but unit names should vary.
      it('should have one global selection instance', function() {
        embed(specType, null, null, {brush: {type: 'interval', resolve: 'global'}});
        for (let i = 0; i < coords.composite.length; i++) {
          const store = browser.execute(brush('composite', i)).value;
          assert.lengthOf(store, 1);
          assert.equal(store[0].unit, unitNames[specType][i]);
        }

        const store = browser.execute(brush('composite_clear')).value;
        assert.lengthOf(store, 0);
      });

      resolutions.forEach(function(resolve) {
        // Loop through the views, drag to add selection instance and observe
        // incrementing store size. Then, loop again but click to clear and
        // observe decrementing store size. Check unit names in each case.
        it(`should have one selection instance per ${resolve} view`, function() {
          embed(specType, null, null, {brush: {type: 'interval', resolve}});
          for (let i = 0; i < coords.composite.length; i++) {
            const store = browser.execute(brush('composite', i)).value;
            assert.lengthOf(store, i + 1);
            assert.equal(store[i].unit, unitNames[specType][i]);
          }

          for (let i = coords.composite_clear.length -1; i >= 0; --i) {
            const store = browser.execute(brush('composite_clear', i)).value;
            assert.lengthOf(store, i);
            if (i > 0) {
              assert.equal(store[i - 1].unit, unitNames[specType][i - 1]);
            }
          }
        });
      });
    });
  });
});
