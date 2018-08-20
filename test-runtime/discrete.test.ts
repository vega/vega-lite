import {assert} from 'chai';
import {SELECTION_ID} from '../src/selection';
import {fill} from '../src/util';
import {embedFn, hits as hitsMaster, pt, spec, testRenderFn} from './util';

['single', 'multi'].forEach(type => {
  describe(`${type} selections at runtime in unit views`, () => {
    const hits = hitsMaster.discrete;
    const embed = embedFn(browser);
    const testRender = testRenderFn(browser, `${type}/unit`);

    it('should add values to the store', () => {
      for (let i = 0; i < hits.qq.length; i++) {
        embed(spec('unit', i, {type}));
        const store = browser.execute(pt('qq', i)).value;
        assert.lengthOf(store, 1);
        assert.lengthOf(store[0].fields, 1);
        assert.lengthOf(store[0].values, 1);
        assert.equal(store[0].fields[0].field, SELECTION_ID);
        assert.equal(store[0].fields[0].type, 'E');
        testRender(`click_${i}`);
      }
    });

    it('should respect projections', () => {
      let values: number[][] = [];
      let encodings: string[] = [];
      let fields: string[] = [];
      const test = (emb: (i: number) => void) => {
        for (let i = 0; i < hits.qq.length; i++) {
          emb(i);
          const store = browser.execute(pt('qq', i)).value;
          assert.lengthOf(store, 1);
          assert.lengthOf(store[0].fields, fields.length);
          assert.lengthOf(store[0].values, fields.length);
          assert.deepEqual(store[0].fields.map((f: any) => f.field), fields);
          assert.deepEqual(store[0].fields.map((f: any) => f.type), fill('E', fields.length));
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

    it('should initialize', () => {
      embed(
        spec('unit', 0, {
          type,
          encodings: ['x', 'color'],
          init: {x: 4, color: 0}
        })
      );
      const store = browser.execute('return view.data("sel_store")').value;
      assert.lengthOf(store, 1);
      assert.lengthOf(store[0].fields, 2);
      assert.lengthOf(store[0].values, 2);
      assert.deepEqual(store[0].values, [4, 0]);
      testRender('init');
    });

    it('should clear out the store', () => {
      for (let i = 0; i < hits.qq_clear.length; i++) {
        embed(spec('unit', i, {type}));
        let store = browser.execute(pt('qq', i)).value;
        assert.lengthOf(store, 1);

        store = browser.execute(pt('qq_clear', i)).value;
        assert.lengthOf(store, 0);
        testRender(`clear_${i}`);
      }
    });

    it('should support selecting bins', () => {
      const encodings = ['x', 'color', 'y'];
      const fields = ['a', 'c', 'b'];
      const types = ['R-RE', 'E', 'R-RE'];
      const values = [[[1, 2], 0, [40, 50]], [[8, 9], 1, [10, 20]]];

      for (let i = 0; i < hits.bins.length; i++) {
        embed(spec('unit', i, {type, encodings}, {x: {bin: true}, y: {bin: true}}));
        const store = browser.execute(pt('bins', i)).value;
        assert.lengthOf(store, 1);
        assert.lengthOf(store[0].fields, fields.length);
        assert.lengthOf(store[0].values, fields.length);
        assert.sameMembers(store[0].fields.map((f: any) => f.field), fields);
        assert.sameMembers(store[0].fields.map((f: any) => f.type), types);
        assert.sameDeepMembers(store[0].values, values[i]);
        testRender(`bins_${i}`);
      }
    });
  });
});
