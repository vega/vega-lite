import {assert} from 'chai';
import {stringValue} from 'vega-util';
import {
  embedFn,
  hits as hitsMaster,
  pt,
  spec
} from './util';

['single', 'multi'].forEach(function(type) {
  describe(`${type} selections at runtime in unit views`, function() {
    const embed = embedFn(browser);
    const hits = hitsMaster.discrete;

    it('should add values to the store', function() {
      embed(spec('unit', {type}));
      for (let i = 0; i < hits.qq.length; i++) {
        const store = browser.execute(pt('qq', i)).value;
        assert.lengthOf(store, 1);
        assert.lengthOf(store[0].encodings, 0);
        assert.lengthOf(store[0].fields, 1);
        assert.lengthOf(store[0].values, 1);
      }
    });

    it('should respect projections', function() {
      let values:number[][] = [];
      let encodings: string[] = [];
      let fields: string[] = [];
      const test = () => {
        for (let i = 0; i < hits.qq.length; i++) {
          const store = browser.execute(pt('qq', i)).value;
          assert.lengthOf(store, 1);
          assert.deepEqual(store[0].encodings, encodings);
          assert.deepEqual(store[0].fields, fields);
          assert.deepEqual(store[0].values, values[i]);
        }
      };

      encodings = ['x', 'color'];
      fields = ['a', 'c'];
      values = [[2, 1], [6, 0]];
      embed(spec('unit', {type, encodings}));
      test();

      encodings = [];
      fields = ['c', 'a', 'b'];
      values = [[1, 2, 53], [0, 6, 87]];
      embed(spec('unit', {type, fields}));
      test();
    });

    it('should clear out the store', function() {
      embed(spec('unit', {type}));
      let store = browser.execute(pt('qq', 0)).value;
      assert.lengthOf(store, 1);

      store = browser.execute(pt('qq_clear', 0)).value;
      assert.lengthOf(store, 0);

      store = browser.execute(pt('qq', 1)).value;
      assert.lengthOf(store, 1);

      store = browser.execute(pt('qq_clear', 1)).value;
      assert.lengthOf(store, 0);
    });

    it('should support selecting bins', function() {
      const encodings = ['x', 'color', 'y'];
      const fields = ['a', 'c', 'b'];
      const values = [[[1, 2], 0, [40, 50]], [[8, 9], 1, [10, 20]]];

      embed(spec('unit', {type, encodings}, 'cond', {x: {bin: true}, y: {bin: true}}));

      for (let i = 0; i < hits.bins.length; i++) {
        const store = browser.execute(pt('bins', i)).value;
        assert.lengthOf(store, 1);
        assert.sameMembers(store[0].encodings, encodings);
        assert.sameMembers(store[0].fields, fields);
        assert.sameDeepMembers(store[0].values, values[i]);
        assert.property(store[0].bins, 'a');
        assert.property(store[0].bins, 'b');
        assert.notProperty(store[0].bins, 'c');
      }
    });
  });
});
