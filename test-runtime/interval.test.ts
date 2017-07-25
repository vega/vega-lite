import {assert} from 'chai';
import {InlineData} from '../src/data';
import {compositeTypes, data, embed as embedFn, resolutions, TestSpec, unit, unitNames} from './util';

describe('Interval selections at runtime', function() {
  const embed = embedFn.bind(null, browser);

  describe('in unit views', function() {
    it('should add extents to the store', function() {
      embed('unit', null, null, {brush: {type: 'interval'}});
      const store = browser.execute('return brush(75, 75, 200, 200)').value;
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
      let store = browser.execute('return brush(75, 75, 200, 200)').value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.lengthOf(store[0].intervals[0].extent, 2);

      embed('unit', null, null, {brush: {type: 'interval', encodings: ['y']}});
      store = browser.execute('return brush(75, 75, 200, 200)').value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'y');
      assert.equal(store[0].intervals[0].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    });

    it('should clear out stored extents', function() {
      embed('unit', null, null, {brush: {type: 'interval'}});
      let store = browser.execute('return brush(75, 75, 150, 150)').value;
      assert.lengthOf(store, 1);

      store = browser.execute('return brush(205, 205, 205, 205)').value;
      assert.lengthOf(store, 0);

      store = browser.execute('return brush(75, 75, 125, 125)').value;
      assert.lengthOf(store, 1);
    });

    it('should brush over binned domains', function() {
      embed('unit', null, unit({bin: true}, {bin: true}),
        {brush: {type: 'interval'}});
      let store = browser.execute('return brush(75, 75, 150, 150)').value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      // length == 2 indicates a quantitative scale was inverted.
      assert.lengthOf(store[0].intervals[0].extent, 2);
      assert.lengthOf(store[0].intervals[1].extent, 2);

      store = browser.execute('return brush(205, 205, 205, 205)').value;
      assert.lengthOf(store, 0);
    });

    it('should brush over ordinal/nominal domains', function() {
      embed('unit', null, unit({type: 'ordinal'}, {type: 'nominal'}),
        {brush: {type: 'interval'}});
      let store = browser.execute('return brush(75, 75, 150, 150)').value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      assert.sameMembers(store[0].intervals[0].extent, [1, 2, 3]);
      assert.sameMembers(store[0].intervals[1].extent, [17, 19, 23]);

      store = browser.execute('return brush(205, 205, 205, 205)').value;
      assert.lengthOf(store, 0);
    });

    it('should brush over temporal domains', function() {
      const values = data.map((d) => ({...d, a: new Date(2017, d.a)}));
      const brush = () => window['brush'](75, 75, 150, 150)[0].intervals[0].extent.map((d: Date) => +d);

      embed('unit', values, unit({type: 'temporal'}), {brush: {type: 'interval', encodings: ['x']}});
      let extent = browser.execute(brush).value;
      assert.sameMembers(extent, [1485262206000, 1494106056000]);

      let store = browser.execute('return brush(205, 205, 205, 205)').value;
      assert.lengthOf(store, 0);

      embed('unit', values, unit({type: 'temporal', timeUnit: 'day'}),
        {brush: {type: 'interval', encodings: ['x']}});
      extent = browser.execute(brush).value;
      assert.sameMembers(extent, [1136188800000, 1136275200000, 1136361600000]);

      store = browser.execute('return brush(205, 205, 205, 205)').value;
      assert.lengthOf(store, 0);
    });
  });

  compositeTypes.forEach(function(specType) {
    describe(`in ${specType} views`, function() {
      it('should have one global selection instance', function() {
        embed(specType, null, null, {brush: {type: 'interval', resolve: 'global'}});
        let store = browser.execute('return brush(160, 75, 175, 175)').value;
        assert.lengthOf(store, 1);
        assert.equal(store[0].unit, unitNames[specType][0]);

        store = browser.execute('return brush(160, 315, 175, 365)').value;
        assert.lengthOf(store, 1);
        assert.equal(store[0].unit, unitNames[specType][1]);

        store = browser.execute('return brush(160, 615, 175, 665)').value;
        assert.lengthOf(store, 1);
        assert.equal(store[0].unit, unitNames[specType][2]);

        store = browser.execute('return brush(150, 75, 150, 75)').value;
        assert.lengthOf(store, 0);
      });

      resolutions.forEach(function(resolve) {
        it(`should have one selection instance per ${resolve} view`, function() {
          embed(specType, null, null, {brush: {type: 'interval', resolve}});
          let store = browser.execute('return brush(160, 75, 175, 175)').value;
          assert.lengthOf(store, 1);
          assert.equal(store[0].unit, unitNames[specType][0]);

          store = browser.execute('return brush(160, 315, 175, 365)').value;
          assert.lengthOf(store, 2);
          assert.equal(store[1].unit, unitNames[specType][1]);

          store = browser.execute('return brush(160, 615, 175, 665)').value;
          assert.lengthOf(store, 3);
          assert.equal(store[2].unit, unitNames[specType][2]);

          store = browser.execute('return brush(150, 615, 150, 615)').value;
          assert.lengthOf(store, 2);
          assert.equal(store[0].unit, unitNames[specType][0]);
          assert.equal(store[1].unit, unitNames[specType][1]);

          store = browser.execute('return brush(150, 315, 150, 315)').value;
          assert.lengthOf(store, 1);
          assert.equal(store[0].unit, unitNames[specType][0]);

          store = browser.execute('return brush(150, 75, 150, 75)').value;
          assert.lengthOf(store, 0);
        });
      });
    });
  });
});
