"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("./util");
['single', 'multi'].forEach(function (type) {
    describe(type + " selections at runtime in unit views", function () {
        var hits = util_1.hits.discrete;
        var embed = util_1.embedFn(browser);
        var testRender = util_1.testRenderFn(browser, type + "/unit");
        it('should add values to the store', function () {
            for (var i = 0; i < hits.qq.length; i++) {
                embed(util_1.spec('unit', i, { type: type }));
                var store = browser.execute(util_1.pt('qq', i)).value;
                chai_1.assert.lengthOf(store, 1);
                chai_1.assert.lengthOf(store[0].encodings, 0);
                chai_1.assert.lengthOf(store[0].fields, 1);
                chai_1.assert.lengthOf(store[0].values, 1);
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
                    var store = browser.execute(util_1.pt('qq', i)).value;
                    chai_1.assert.lengthOf(store, 1);
                    chai_1.assert.deepEqual(store[0].encodings, encodings);
                    chai_1.assert.deepEqual(store[0].fields, fields);
                    chai_1.assert.deepEqual(store[0].values, values[i]);
                    testRender(encodings + "_" + fields + "_" + i);
                }
            };
            encodings = ['x', 'color'];
            fields = ['a', 'c'];
            values = [[2, 1], [6, 0]];
            test(function (i) { return embed(util_1.spec('unit', i, { type: type, encodings: encodings })); });
            encodings = [];
            fields = ['c', 'a', 'b'];
            values = [[1, 2, 53], [0, 6, 87]];
            test(function (i) { return embed(util_1.spec('unit', i, { type: type, fields: fields })); });
        });
        it('should clear out the store', function () {
            for (var i = 0; i < hits.qq_clear.length; i++) {
                embed(util_1.spec('unit', i, { type: type }));
                var store = browser.execute(util_1.pt('qq', i)).value;
                chai_1.assert.lengthOf(store, 1);
                store = browser.execute(util_1.pt('qq_clear', i)).value;
                chai_1.assert.lengthOf(store, 0);
                testRender("clear_" + i);
            }
        });
        it('should support selecting bins', function () {
            var encodings = ['x', 'color', 'y'];
            var fields = ['a', 'c', 'b'];
            var values = [[[1, 2], 0, [40, 50]], [[8, 9], 1, [10, 20]]];
            for (var i = 0; i < hits.bins.length; i++) {
                embed(util_1.spec('unit', i, { type: type, encodings: encodings }, { x: { bin: true }, y: { bin: true } }));
                var store = browser.execute(util_1.pt('bins', i)).value;
                chai_1.assert.lengthOf(store, 1);
                chai_1.assert.sameMembers(store[0].encodings, encodings);
                chai_1.assert.sameMembers(store[0].fields, fields);
                chai_1.assert.sameDeepMembers(store[0].values, values[i]);
                chai_1.assert.property(store[0], 'bin_a');
                chai_1.assert.property(store[0], 'bin_b');
                chai_1.assert.notProperty(store[0], 'bin_c');
                testRender("bins_" + i);
            }
        });
    });
});
//# sourceMappingURL=discrete.test.js.map