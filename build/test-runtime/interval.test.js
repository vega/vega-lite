"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var util_1 = require("./util");
describe('interval selections at runtime in unit views', function () {
    var type = 'interval';
    var hits = util_1.hits.interval;
    var embed = util_1.embedFn(browser);
    var testRender = util_1.testRenderFn(browser, type + "/unit");
    it('should add extents to the store', function () {
        for (var i = 0; i < hits.drag.length; i++) {
            embed(util_1.spec('unit', i, { type: type }));
            var store = browser.execute(util_1.brush('drag', i)).value;
            chai_1.assert.lengthOf(store, 1);
            chai_1.assert.lengthOf(store[0].intervals, 2);
            chai_1.assert.equal(store[0].intervals[0].encoding, 'x');
            chai_1.assert.equal(store[0].intervals[0].field, 'a');
            chai_1.assert.equal(store[0].intervals[1].encoding, 'y');
            chai_1.assert.equal(store[0].intervals[1].field, 'b');
            chai_1.assert.lengthOf(store[0].intervals[0].extent, 2);
            chai_1.assert.lengthOf(store[0].intervals[1].extent, 2);
            testRender("drag_" + i);
        }
    });
    it('should respect projections', function () {
        embed(util_1.spec('unit', 0, { type: type, encodings: ['x'] }));
        for (var i = 0; i < hits.drag.length; i++) {
            var store = browser.execute(util_1.brush('drag', i)).value;
            chai_1.assert.lengthOf(store, 1);
            chai_1.assert.lengthOf(store[0].intervals, 1);
            chai_1.assert.equal(store[0].intervals[0].encoding, 'x');
            chai_1.assert.equal(store[0].intervals[0].field, 'a');
            chai_1.assert.lengthOf(store[0].intervals[0].extent, 2);
            testRender("x_" + i);
        }
        embed(util_1.spec('unit', 1, { type: type, encodings: ['y'] }));
        for (var i = 0; i < hits.drag.length; i++) {
            var store = browser.execute(util_1.brush('drag', i)).value;
            chai_1.assert.lengthOf(store, 1);
            chai_1.assert.lengthOf(store[0].intervals, 1);
            chai_1.assert.equal(store[0].intervals[0].encoding, 'y');
            chai_1.assert.equal(store[0].intervals[0].field, 'b');
            chai_1.assert.lengthOf(store[0].intervals[0].extent, 2);
            testRender("y_" + i);
        }
    });
    it('should clear out stored extents', function () {
        for (var i = 0; i < hits.drag_clear.length; i++) {
            embed(util_1.spec('unit', i, { type: type }));
            var store = browser.execute(util_1.brush('drag', i)).value;
            chai_1.assert.lengthOf(store, 1);
            store = browser.execute(util_1.brush('drag_clear', i)).value;
            chai_1.assert.lengthOf(store, 0);
            testRender("clear_" + i);
        }
    });
    it('should brush over binned domains', function () {
        embed(util_1.spec('unit', 1, { type: type, encodings: ['y'] }, {
            x: { aggregate: 'count', field: '*', type: 'quantitative' },
            y: { bin: true },
            color: { value: 'steelblue', field: null, type: null }
        }));
        for (var i = 0; i < hits.bins.length; i++) {
            var store_1 = browser.execute(util_1.brush('bins', i)).value;
            chai_1.assert.lengthOf(store_1, 1);
            chai_1.assert.lengthOf(store_1[0].intervals, 1);
            // length == 2 indicates a quantitative scale was inverted.
            chai_1.assert.lengthOf(store_1[0].intervals[0].extent, 2);
            testRender("bins_" + i);
        }
        var store = browser.execute(util_1.brush('bins_clear', 0)).value;
        chai_1.assert.lengthOf(store, 0);
    });
    it('should brush over ordinal/nominal domains', function () {
        var xextents = [[2, 3, 4], [6, 7, 8]];
        var yextents = [
            [48, 49, 52, 53, 54, 55, 66, 67, 68, 76, 81, 87, 91],
            [16, 17, 19, 23, 24, 27, 28, 35, 39, 43, 48]
        ];
        for (var i = 0; i < hits.drag.length; i++) {
            embed(util_1.spec('unit', i, { type: type }, { x: { type: 'ordinal' }, y: { type: 'nominal' } }));
            var store_2 = browser.execute(util_1.brush('drag', i)).value;
            chai_1.assert.lengthOf(store_2, 1);
            chai_1.assert.lengthOf(store_2[0].intervals, 2);
            chai_1.assert.sameMembers(store_2[0].intervals[0].extent, xextents[i]);
            chai_1.assert.sameMembers(store_2[0].intervals[1].extent, yextents[i]);
            testRender("ord_" + i);
        }
        var store = browser.execute(util_1.brush('drag_clear', 0)).value;
        chai_1.assert.lengthOf(store, 0);
    });
    it('should brush over temporal domains', function () {
        var values = util_1.tuples.map(function (d) { return (tslib_1.__assign({}, d, { a: new Date(2017, d.a) })); });
        var toNumber = '[0].intervals[0].extent.map((d) => +d)';
        embed(util_1.spec('unit', 0, { type: type, encodings: ['x'] }, { values: values, x: { type: 'temporal' } }));
        var extents = [[1485969714000, 1493634384000], [1496346498000, 1504364922000]];
        for (var i = 0; i < hits.drag.length; i++) {
            var store = browser.execute(util_1.brush('drag', i) + toNumber).value;
            chai_1.assert.sameMembers(store, extents[i]);
            testRender("temporal_" + i);
        }
        var cleared = browser.execute(util_1.brush('drag_clear', 0)).value;
        chai_1.assert.lengthOf(cleared, 0);
        embed(util_1.spec('unit', 1, { type: type, encodings: ['x'] }, { values: values, x: { type: 'temporal', timeUnit: 'day' } }));
        extents = [[1136190528000, 1136361600000], [1136449728000, 1136535264000]];
        for (var i = 0; i < hits.drag.length; i++) {
            var store = browser.execute(util_1.brush('drag', i) + toNumber).value;
            chai_1.assert.sameMembers(store, extents[i]);
            testRender("dayTimeUnit_" + i);
        }
        cleared = browser.execute(util_1.brush('drag_clear', 0)).value;
        chai_1.assert.lengthOf(cleared, 0);
    });
    it('should brush over log/pow scales', function () {
        for (var i = 0; i < hits.drag.length; i++) {
            embed(util_1.spec('unit', i, { type: type }, {
                x: { scale: { type: 'pow', exponent: 1.5 } },
                y: { scale: { type: 'log' } }
            }));
            var store = browser.execute(util_1.brush('drag', i)).value;
            chai_1.assert.lengthOf(store, 1);
            chai_1.assert.lengthOf(store[0].intervals, 2);
            chai_1.assert.lengthOf(store[0].intervals[0].extent, 2);
            chai_1.assert.lengthOf(store[0].intervals[1].extent, 2);
            testRender("logpow_" + i);
        }
    });
});
//# sourceMappingURL=interval.test.js.map