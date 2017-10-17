"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var properties = require("../../../src/compile/axis/properties");
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
    describe('minMaxExtent', function () {
        it('returns specified extent for a non-grid axis', function () {
            chai_1.assert.equal(properties.minMaxExtent(25, false), 25);
        });
        it('returns 0 for a grid axis', function () {
            chai_1.assert.equal(properties.minMaxExtent(0, true), 0);
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
            chai_1.assert.deepEqual(tickCount, { signal: 'min(ceil(a/40), 10)' });
        });
        ['month', 'hours', 'day', 'quarter'].forEach(function (timeUnit) {
            it("should return undefined by default for a temporal field with timeUnit=" + timeUnit, function () {
                var tickCount = properties.tickCount('x', { timeUnit: timeUnit, field: 'a', type: 'temporal' }, 'linear', { signal: 'a' });
                chai_1.assert.isUndefined(tickCount);
            });
        });
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
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, null, null);
            chai_1.assert.deepEqual(values, [
                { "signal": "datetime(1970, 0, 1, 0, 0, 0, 0)" },
                { "signal": "datetime(1980, 0, 1, 0, 0, 0, 0)" }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, null, null);
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
    });
    describe('zindex()', function () {
        it('should return undefined by default without grid defined', function () {
            var zindex = properties.zindex(false);
            chai_1.assert.deepEqual(zindex, 1);
        });
        it('should return back by default with grid defined', function () {
            var zindex = properties.zindex(true);
            chai_1.assert.deepEqual(zindex, 0);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydGllcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2F4aXMvcHJvcGVydGllcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixpRUFBbUU7QUFHbkUsUUFBUSxDQUFDLGNBQWMsRUFBRTtJQUN2QixRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLEVBQUUsQ0FBQyx1RUFBdUUsRUFBRTtZQUMxRSxJQUFNLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7WUFDM0UsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLGNBQWMsRUFBQyxDQUFDLENBQUM7WUFDdEYsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMscURBQXFELEVBQUU7WUFDeEQsSUFBTSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUMsQ0FBQyxDQUFDO1lBQzFFLGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFR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