/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var channel_1 = require("../../../src/channel");
var rules = require("../../../src/compile/axis/rules");
describe('compile/axis', function () {
    describe('grid()', function () {
        it('should return specified orient', function () {
            var grid = rules.grid(util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative', axis: { grid: false } }
                }
            }), channel_1.X, true);
            chai_1.assert.deepEqual(grid, false);
        });
        it('should return true by default', function () {
            var grid = rules.grid(util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }), channel_1.X, true);
            chai_1.assert.deepEqual(grid, true);
        });
        it('should return undefined for COLUMN', function () {
            var grid = rules.grid(util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }), channel_1.COLUMN, true);
            chai_1.assert.deepEqual(grid, false);
        });
        it('should return undefined for ROW', function () {
            var grid = rules.grid(util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }), channel_1.ROW, true);
            chai_1.assert.deepEqual(grid, false);
        });
        it('should return undefined for non-gridAxis', function () {
            var grid = rules.grid(util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: 'quantitative' }
                }
            }), channel_1.X, false);
            chai_1.assert.deepEqual(grid, undefined);
        });
    });
    describe('orient()', function () {
        it('should return specified orient', function () {
            var orient = rules.orient({ orient: 'bottom' }, 'x');
            chai_1.assert.deepEqual(orient, 'bottom');
        });
        it('should return bottom for x by default', function () {
            var orient = rules.orient({}, 'x');
            chai_1.assert.deepEqual(orient, 'bottom');
        });
        it('should return top for column by default', function () {
            var orient = rules.orient({}, 'column');
            chai_1.assert.deepEqual(orient, 'top');
        });
        it('should return left for row by default', function () {
            var orient = rules.orient({}, 'row');
            chai_1.assert.deepEqual(orient, 'left');
        });
        it('should return left for y by default', function () {
            var orient = rules.orient({}, 'y');
            chai_1.assert.deepEqual(orient, 'left');
        });
    });
    describe('tickCount', function () {
        it('should return undefined by default for non-x', function () {
            var tickCount = rules.tickCount({}, 'y', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(tickCount, undefined);
        });
        it('should return 5 by default for x', function () {
            var tickCount = rules.tickCount({}, 'x', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(tickCount, 5);
        });
        it('should return specified tickCount', function () {
            var tickCount = rules.tickCount({ tickCount: 10 }, 'x', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(tickCount, 10);
        });
    });
    describe('title()', function () {
        it('should add explicitly specified title', function () {
            var title = rules.title({ title: 'Custom' }, { field: 'a', type: "quantitative" }, {}, false);
            chai_1.assert.deepEqual(title, 'Custom');
        });
        it('should add return fieldTitle by default', function () {
            var title = rules.title({ titleMaxLength: 3 }, { field: 'a', type: "quantitative" }, {}, false);
            chai_1.assert.deepEqual(title, 'a');
        });
        it('should add return fieldTitle by default', function () {
            var title = rules.title({ titleMaxLength: 10 }, { aggregate: 'sum', field: 'a', type: "quantitative" }, {}, false);
            chai_1.assert.deepEqual(title, 'SUM(a)');
        });
        it('should add return fieldTitle by default and truncate', function () {
            var title = rules.title({ titleMaxLength: 3 }, { aggregate: 'sum', field: 'a', type: "quantitative" }, {}, false);
            chai_1.assert.deepEqual(title, 'SU…');
        });
        it('should add return undefined for gridAxis', function () {
            var title = rules.title({ titleMaxLength: 3 }, { field: 'a', type: "quantitative" }, {}, true);
            chai_1.assert.deepEqual(title, undefined);
        });
    });
    describe('values', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = rules.values({ values: [{ year: 1970 }, { year: 1980 }] });
            chai_1.assert.deepEqual(values, [
                new Date(1970, 0, 1).getTime(),
                new Date(1980, 0, 1).getTime()
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = rules.values({ values: [1, 2, 3, 4] });
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('zindex()', function () {
        it('should return undefined by default without grid defined', function () {
            var zindex = rules.zindex({}, false);
            chai_1.assert.deepEqual(zindex, 1);
        });
        it('should return back by default with grid defined', function () {
            var zindex = rules.zindex({}, true);
            chai_1.assert.deepEqual(zindex, 0);
        });
        it('should return specified zindex', function () {
            var zindex = rules.zindex({ zindex: 2 }, false);
            chai_1.assert.deepEqual(zindex, 2);
        });
    });
});
//# sourceMappingURL=rules.test.js.map