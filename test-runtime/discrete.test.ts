import {assert} from 'chai';
import {InlineData} from '../src/data';
import {compositeTypes, data, embed as embedFn, resolutions, spec, TestSpec, unit, unitNames} from './util';

const coords = {
  qq: [[103, 114], [190, 46]],
  qq_clear: [[113, 124], [195, 40]],

  bins: [[92, 143], [246, 208]],
  bins_clear: [[98, 157]],

  repeat: [[103, 114], [169, 436], [127, 707]],
  repeat_clear: [[113, 124], [159, 426], [157, 690]],

  facet: [[158, 135], [248, 365], [314, 570]],
  facet_clear: [[148, 145], [258, 346], [303, 575]]
};

const pt = (key: string, idx: number) => `return pt(${coords[key][idx].join(', ')})`;

['single', 'multi'].forEach(function(type) {
  describe(`${type} selections at runtime`, function() {
    const embed = embedFn.bind(null, browser);

    describe('in unit views', function() {
      it('should add values to the store', function() {
        embed('unit', null, null, {pts: {type}});
        for (let i = 0; i < coords.qq.length; i++) {
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
          for (let i = 0; i < coords.qq.length; i++) {
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
        embed('unit', null, null, {pts: {type, encodings}});
        test();

        encodings = [];
        fields = ['c', 'a', 'b'];
        values = [[1, 2, 53], [0, 6, 87]];
        embed('unit', null, null, {pts: {type, fields}});
        test();
      });

      it('should clear out the store', function() {
        embed('unit', null, null, {pts: {type}});
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

        embed('unit', null, unit({bin: true}, {bin: true}), {pts: {type, encodings}});

        for (let i = 0; i < coords.bins.length; i++) {
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

    compositeTypes.forEach(function(specType) {
      describe(`in ${specType} views`, function() {
        // Loop through the views, click to add a selection instance.
        // Store size should stay constant, but unit names should vary.
        it('should have one global selection instance', function() {
          embed(specType, null, null, {pts: {type, resolve: 'global'}});
          for (let i = 0; i < coords[specType].length; i++) {
            const store = browser.execute(pt(specType, i)).value;
            assert.lengthOf(store, 1);
            assert.equal(store[0].unit, unitNames[specType][i]);
          }

          const store = browser.execute(pt(`${specType}_clear`, 0)).value;
          assert.lengthOf(store, 0);
        });

        resolutions.forEach(function(resolve) {
          // Loop through the views, click to add selection instance and observe
          // incrementing store size. Then, loop again but click to clear and
          // observe decrementing store size. Check unit names in each case.
          it(`should have one selection instance per ${resolve} view`, function() {
            embed(specType, null, null, {pts: {type, resolve}});
            for (let i = 0; i < coords[specType].length; i++) {
              const store = browser.execute(pt(specType, i)).value;
              assert.lengthOf(store, i + 1);
              assert.equal(store[i].unit, unitNames[specType][i]);
            }

            for (let i = coords[specType].length - 1; i >= 0; i--) {
              const store = browser.execute(pt(`${specType}_clear`, i)).value;
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
});
