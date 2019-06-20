"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var properties = tslib_1.__importStar(require("../../../src/compile/axis/properties"));
var util_1 = require("../../util");
describe('compile/axis', function () {
    describe('grid()', function () {
        it('should return true by default for continuous scale that is not binned', function () {
            var grid = properties.grid('linear', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(grid, true);
        });
        it('should return false by default for binned field', function () {
            var grid = properties.grid('linear', { bin: true, field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(grid, false);
        });
        it('should return false by default for a discrete scale', function () {
            var grid = properties.grid('point', { field: 'a', type: 'quantitative' });
            chai_1.assert.deepEqual(grid, false);
        });
    });
    describe('orient()', function () {
        it('should return bottom for x by default', function () {
            var orient = properties.orient('x');
            chai_1.assert.deepEqual(orient, 'bottom');
        });
        it('should return left for y by default', function () {
            var orient = properties.orient('y');
            chai_1.assert.deepEqual(orient, 'left');
        });
    });
    describe('tickCount', function () {
        it('should return undefined by default for a binned field', function () {
            var tickCount = properties.tickCount('x', { bin: { maxbins: 10 }, field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' });
            chai_1.assert.deepEqual(tickCount, { signal: 'ceil(a/20)' });
        });
        var _loop_1 = function (timeUnit) {
            it("should return undefined by default for a temporal field with timeUnit=" + timeUnit, function () {
                var tickCount = properties.tickCount('x', { timeUnit: timeUnit, field: 'a', type: 'temporal' }, 'linear', { signal: 'a' });
                chai_1.assert.isUndefined(tickCount);
            });
        };
        for (var _i = 0, _a = ['month', 'hours', 'day', 'quarter']; _i < _a.length; _i++) {
            var timeUnit = _a[_i];
            _loop_1(timeUnit);
        }
        it('should return size/40 by default for linear scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' });
            chai_1.assert.deepEqual(tickCount, { signal: 'ceil(a/40)' });
        });
        it('should return undefined by default for log scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'log', undefined);
            chai_1.assert.deepEqual(tickCount, undefined);
        });
        it('should return undefined by default for point scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'point', undefined);
            chai_1.assert.deepEqual(tickCount, undefined);
        });
    });
    describe('title()', function () {
        it('should add return fieldTitle by default', function () {
            var title = properties.title(3, { field: 'a', type: "quantitative" }, {});
            chai_1.assert.deepEqual(title, 'a');
        });
        it('should add return fieldTitle by default', function () {
            var title = properties.title(10, { aggregate: 'sum', field: 'a', type: "quantitative" }, {});
            chai_1.assert.deepEqual(title, 'Sum of a');
        });
        it('should add return fieldTitle by default and truncate', function () {
            var title = properties.title(3, { aggregate: 'sum', field: 'a', type: "quantitative" }, {});
            chai_1.assert.deepEqual(title, 'Su…');
        });
    });
    describe('values', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, null, { field: 'a', type: 'temporal' }, "x");
            chai_1.assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, null, { field: 'a', type: 'quantitative' }, "x");
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
        it('should simply drop values when domain is specified', function () {
            var model1 = util_1.parseUnitModelWithScale({
                "mark": "bar",
                "encoding": {
                    "y": {
                        "type": "quantitative",
                        "field": 'US_Gross',
                        "scale": { "domain": [-1, 2] },
                        "bin": { "extent": [0, 1] }
                    }
                },
                "data": { "url": "data/movies.json" }
            });
            var values = properties.values({}, model1, model1.fieldDef("y"), "y");
            chai_1.assert.deepEqual(values, undefined);
        });
    });
});
//# sourceMappingURL=properties.test.js.map