import { assert } from 'chai';
import { SELECTION_ID } from '../src/selection';
import { fill } from '../src/util';
import { embedFn, hits as hitsMaster, pt, spec, testRenderFn } from './util';
['single', 'multi'].forEach(function (type) {
    describe(type + " selections at runtime in unit views", function () {
        var hits = hitsMaster.discrete;
        var embed = embedFn(browser);
        var testRender = testRenderFn(browser, type + "/unit");
        it('should add values to the store', function () {
            for (var i = 0; i < hits.qq.length; i++) {
                embed(spec('unit', i, { type: type }));
                var store = browser.execute(pt('qq', i)).value;
                assert.lengthOf(store, 1);
                assert.lengthOf(store[0].fields, 1);
                assert.lengthOf(store[0].values, 1);
                assert.equal(store[0].fields[0].field, SELECTION_ID);
                assert.equal(store[0].fields[0].type, 'E');
                testRender("click_" + i);
            }
        });
        it('should respect projections', function () {
            var values = [];
            var encodings = [];
            var fields = [];
            var test = function (emb) {
                for (var i = 0; i < hits.qq.length; i++) {
                    emb(i);
                    var store = browser.execute(pt('qq', i)).value;
                    assert.lengthOf(store, 1);
                    assert.lengthOf(store[0].fields, fields.length);
                    assert.lengthOf(store[0].values, fields.length);
                    assert.deepEqual(store[0].fields.map(function (f) { return f.field; }), fields);
                    assert.deepEqual(store[0].fields.map(function (f) { return f.type; }), fill('E', fields.length));
                    assert.deepEqual(store[0].values, values[i]);
                    testRender(encodings + "_" + fields + "_" + i);
                }
            };
            encodings = ['x', 'color'];
            fields = ['a', 'c'];
            values = [[2, 1], [6, 0]];
            test(function (i) { return embed(spec('unit', i, { type: type, encodings: encodings })); });
            encodings = [];
            fields = ['c', 'a', 'b'];
            values = [[1, 2, 53], [0, 6, 87]];
            test(function (i) { return embed(spec('unit', i, { type: type, fields: fields })); });
        });
        it('should clear out the store', function () {
            for (var i = 0; i < hits.qq_clear.length; i++) {
                embed(spec('unit', i, { type: type }));
                var store = browser.execute(pt('qq', i)).value;
                assert.lengthOf(store, 1);
                store = browser.execute(pt('qq_clear', i)).value;
                assert.lengthOf(store, 0);
                testRender("clear_" + i);
            }
        });
        it('should support selecting bins', function () {
            var encodings = ['x', 'color', 'y'];
            var fields = ['a', 'c', 'b'];
            var types = ['R-RE', 'E', 'R-RE'];
            var values = [[[1, 2], 0, [40, 50]], [[8, 9], 1, [10, 20]]];
            for (var i = 0; i < hits.bins.length; i++) {
                embed(spec('unit', i, { type: type, encodings: encodings }, { x: { bin: true }, y: { bin: true } }));
                var store = browser.execute(pt('bins', i)).value;
                assert.lengthOf(store, 1);
                assert.lengthOf(store[0].fields, fields.length);
                assert.lengthOf(store[0].values, fields.length);
                assert.sameMembers(store[0].fields.map(function (f) { return f.field; }), fields);
                assert.sameMembers(store[0].fields.map(function (f) { return f.type; }), types);
                assert.sameDeepMembers(store[0].values, values[i]);
                testRender("bins_" + i);
            }
        });
    });
});
//# sourceMappingURL=discrete.test.js.map