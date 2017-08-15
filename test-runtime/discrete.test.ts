import {assert} from 'chai';
import {embedFn, hits as hitsMaster, pt, spec, testRenderFn} from './util';

['single', 'multi'].forEach(function(type) {
  describe(`${type} selections at runtime in unit views`, function() {
    const hits = hitsMaster.discrete;
    const embed = embedFn(browser);
    const testRender = testRenderFn(browser, `${type}/unit`);

    it('should add values to the store', function() {
      for (let i = 0; i < hits.qq.length; i++) {
        embed(spec('unit', i, {type}));
        const store = browser.execute(pt('qq', i)).value;
        assert.lengthOf(store, 1);
        assert.lengthOf(store[0].encodings, 0);
        assert.lengthOf(store[0].fields, 1);
        assert.lengthOf(store[0].values, 1);
        testRender(`click_${i}`);
      }
    });

    it('should respect projections', function() {
      let values:number[][] = [];
      let encodings: string[] = [];
      let fields: string[] = [];
      const test = (emb: Function) => {
        for (let i = 0; i < hits.qq.length; i++) {
          emb(i);
          const store = browser.execute(pt('qq', i)).value;
          assert.lengthOf(store, 1);
          assert.deepEqual(store[0].encodings, encodings);
          assert.deepEqual(store[0].fields, fields);
          assert.deepEqual(store[0].values, values[i]);
          testRender(`${encodings}_${fields}_${i}`);
        }
      };

      encodings = ['x', 'color'];
      fields = ['a', 'c'];
      values = [[2, 1], [6, 0]];
      test((i: number) => embed(spec('unit', i, {type, encodings})));

      encodings = [];
      fields = ['c', 'a', 'b'];
      values = [[1, 2, 53], [0, 6, 87]];
      test((i: number) => embed(spec('unit', i, {type, fields})));
    });

    it('should clear out the store', function() {
      for (let i = 0; i < hits.qq_clear.length; i++) {
        embed(spec('unit', i, {type}));
        let store = browser.execute(pt('qq', i)).value;
        assert.lengthOf(store, 1);

        store = browser.execute(pt('qq_clear', i)).value;
        assert.lengthOf(store, 0);
        testRender(`clear_${i}`);
      }
    });

    it('should support selecting bins', function() {
      const encodings = ['x', 'color', 'y'];
      const fields = ['a', 'c', 'b'];
      const values = [[[1, 2], 0, [40, 50]], [[8, 9], 1, [10, 20]]];

      for (let i = 0; i < hits.bins.length; i++) {
        embed(spec('unit', i, {type, encodings}, {x: {bin: true}, y: {bin: true}}));
        const store = browser.execute(pt('bins', i)).value;
        assert.lengthOf(store, 1);
        assert.sameMembers(store[0].encodings, encodings);
        assert.sameMembers(store[0].fields, fields);
        assert.sameDeepMembers(store[0].values, values[i]);
        assert.property(store[0], 'bin_a');
        assert.property(store[0], 'bin_b');
        assert.notProperty(store[0], 'bin_c');
        testRender(`bins_${i}`);
      }
    });
  });
});
