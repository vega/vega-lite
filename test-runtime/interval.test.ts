/* tslint:disable quotemark no-shadowed-variable */

import {assert} from 'chai';
import {SelectionResolutions} from '../src/selection';
import {TopLevelExtendedSpec} from '../src/spec';

type TestSpec = 'unit' | 'repeat' | 'facet';

describe('Interval selections at runtime', function() {
  const unit: TopLevelExtendedSpec = {
    "mark": "circle",
    "encoding": {
      "x": {"field": "a", "type": "quantitative"},
      "y": {"field": "b","type": "quantitative"},
      "color": {"field": "c", "type": "nominal"}
    }
  };

  function spec(type: TestSpec, selection: any) {
    return {
      data: {values: [
        {"a": 0, "b": 28, "c": 0}, {"a": 0, "b": 55, "c": 1}, {"a": 0, "b": 23, "c": 2},
        {"a": 1, "b": 43, "c": 0}, {"a": 1, "b": 91, "c": 1}, {"a": 1, "b": 54, "c": 2},
        {"a": 2, "b": 81, "c": 0}, {"a": 2, "b": 53, "c": 1}, {"a": 2, "b": 76, "c": 2},
        {"a": 3, "b": 19, "c": 0}, {"a": 3, "b": 87, "c": 1}, {"a": 3, "b": 12, "c": 2},
        {"a": 4, "b": 52, "c": 0}, {"a": 4, "b": 48, "c": 1}, {"a": 4, "b": 35, "c": 2},
        {"a": 5, "b": 24, "c": 0}, {"a": 5, "b": 49, "c": 1}, {"a": 5, "b": 48, "c": 2},
        {"a": 6, "b": 87, "c": 0}, {"a": 6, "b": 66, "c": 1}, {"a": 6, "b": 23, "c": 2},
        {"a": 7, "b": 17, "c": 0}, {"a": 7, "b": 27, "c": 1}, {"a": 7, "b": 39, "c": 2},
        {"a": 8, "b": 68, "c": 0}, {"a": 8, "b": 16, "c": 1}, {"a": 8, "b": 67, "c": 2},
        {"a": 9, "b": 49, "c": 0}, {"a": 9, "b": 15, "c": 1}, {"a": 9, "b": 48, "c": 2}
      ]},

      ...(type === 'unit' ? {...unit, selection} : {}),
      ...(type === 'facet' ? {
        facet: {row: {field: 'c', type: 'nominal'}},
        spec: {...unit, selection}
      } : {}),
      ...(type === 'repeat' ? {
        repeat: {row: ['d', 'e', 'f']},
        spec: {...unit, selection}
      } : {})
    };
  }

  function embed(type: TestSpec, selection: any) {
    browser.execute((_) => window['embed'](_), spec(type, selection));
  }

  function brush(mdX: number, mdY: number, muX: number, muY: number) {
    const store = browser.execute((mdX, mdY, muX, muY) => {
      window['mouseEvt']('mousedown', {clientX: mdX, clientY: mdY});
      window['mouseEvt']('mousemove', {clientX: (muX - mdX) / 2, clientY: (muY - muY) / 2});
      window['mouseEvt']('mouseup', {clientX: muX, clientY: muY});
      return window['view'].data('brush_store');
    }, mdX, mdY, muX, muY);
    return store.value;
  }

  describe('in unit views', function() {
    it('should add extents to the store', function() {
      embed('unit', {brush: {type: 'interval'}});
      let store = brush(75, 75, 200, 200);
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 2);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.equal(store[0].intervals[1].encoding, 'y');
      assert.equal(store[0].intervals[1].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
      assert.lengthOf(store[0].intervals[1].extent, 2);

      embed('unit', {brush: {type: 'interval', encodings: ['x']}});
      store = brush(75, 75, 200, 200);
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'x');
      assert.equal(store[0].intervals[0].field, 'a');
      assert.lengthOf(store[0].intervals[0].extent, 2);

      embed('unit', {brush: {type: 'interval', encodings: ['y']}});
      store = brush(75, 75, 200, 200);
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].intervals, 1);
      assert.equal(store[0].intervals[0].encoding, 'y');
      assert.equal(store[0].intervals[0].field, 'b');
      assert.lengthOf(store[0].intervals[0].extent, 2);
    });

    it('should clear out stored extents', function() {
      embed('unit', {brush: {type: 'interval'}});
      let store = brush(75, 75, 150, 150);
      assert.lengthOf(store, 1);

      store = brush(205, 205, 205, 205);
      assert.lengthOf(store, 0);

      store = brush(75, 75, 125, 125);
      assert.lengthOf(store, 1);
    });
  });

  ['repeat', 'facet'].forEach(function(specType: TestSpec) {
    describe(`in ${specType} views`, function() {
      it('should have one global selection instance', function() {
        embed(specType, {brush: {type: 'interval', resolve: 'global'}});
        let store = brush(160, 75, 175, 175);
        assert.lengthOf(store, 1);

        store = brush(160, 315, 175, 365);
        assert.lengthOf(store, 1);

        store = brush(160, 615, 175, 665);
        assert.lengthOf(store, 1);

        store = brush(150, 75, 150, 75);
        assert.lengthOf(store, 0);
      });

      ['independent', 'union', 'intersect', 'union_others', 'intersect_others'].forEach(function(resolve: SelectionResolutions) {
        it(`should have one selection instance per ${resolve} view`, function() {
          embed(specType, {brush: {type: 'interval', resolve}});
          let store = brush(160, 75, 175, 175);
          assert.lengthOf(store, 1);

          store = brush(160, 315, 175, 365);
          assert.lengthOf(store, 2);

          store = brush(160, 615, 175, 665);
          assert.lengthOf(store, 3);

          store = brush(150, 615, 150, 615);
          assert.lengthOf(store, 2);

          store = brush(150, 315, 150, 315);
          assert.lengthOf(store, 1);

          store = brush(150, 75, 150, 75);
          assert.lengthOf(store, 0);
        });
      });
    });
  });
});
