"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var properties = tslib_1.__importStar(require("../../../src/compile/axis/properties"));
var properties_1 = require("../../../src/compile/axis/properties");
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
            var tickCount = properties.tickCount('x', { bin: { maxbins: 10 }, field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' }, undefined, {});
            chai_1.assert.deepEqual(tickCount, { signal: 'ceil(a/20)' });
        });
        var _loop_1 = function (timeUnit) {
            it("should return undefined by default for a temporal field with timeUnit=" + timeUnit, function () {
                var tickCount = properties.tickCount('x', { timeUnit: timeUnit, field: 'a', type: 'temporal' }, 'linear', { signal: 'a' }, undefined, {});
                chai_1.assert.isUndefined(tickCount);
            });
        };
        for (var _i = 0, _a = ['month', 'hours', 'day', 'quarter']; _i < _a.length; _i++) {
            var timeUnit = _a[_i];
            _loop_1(timeUnit);
        }
        it('should return size/40 by default for linear scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' }, undefined, {});
            chai_1.assert.deepEqual(tickCount, { signal: 'ceil(a/40)' });
        });
        it('should return undefined by default for log scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'log', undefined, undefined, {});
            chai_1.assert.deepEqual(tickCount, undefined);
        });
        it('should return undefined by default for point scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'point', undefined, undefined, {});
            chai_1.assert.deepEqual(tickCount, undefined);
        });
        it('should return prebin step signal for axis with tickStep', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'linear', undefined, 'x', {
                tickStep: 3
            });
            chai_1.assert.deepEqual(tickCount, { signal: "(domain('x')[1] - domain('x')[0]) / 3 + 1" });
        });
    });
    describe('values', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, null, { field: 'a', type: 'temporal' }, 'x');
            chai_1.assert.deepEqual(values, [
                { signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)' },
                { signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)' }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, null, { field: 'a', type: 'quantitative' }, 'x');
            chai_1.assert.deepEqual(values, [1, 2, 3, 4]);
        });
        it('should simply drop values when domain is specified', function () {
            var model1 = util_1.parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    y: {
                        type: 'quantitative',
                        field: 'US_Gross',
                        scale: { domain: [-1, 2] },
                        bin: { extent: [0, 1] }
                    }
                },
                data: { url: 'data/movies.json' }
            });
            var values = properties.values({}, model1, model1.fieldDef('y'), 'y');
            chai_1.assert.deepEqual(values, undefined);
        });
        it('should return value signal for axis with tickStep', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'bar',
                encoding: {
                    x: {
                        type: 'quantitative',
                        field: 'US_Gross'
                    }
                },
                data: { url: 'data/movies.json' }
            });
            var values = properties.values({ tickStep: 3 }, model, { type: 'quantitative' }, 'x');
            chai_1.assert.deepEqual(values, { signal: "sequence(domain('x')[0], domain('x')[1] + 3, 3)" });
        });
    });
    describe('labelAngle', function () {
        var axisModel = util_1.parseUnitModelWithScale({
            mark: 'bar',
            encoding: {
                y: {
                    type: 'quantitative',
                    field: 'US_Gross',
                    scale: { domain: [-1, 2] },
                    bin: { extent: [0, 1] },
                    axis: { labelAngle: 600 }
                }
            },
            data: { url: 'data/movies.json' }
        });
        var configModel = util_1.parseUnitModelWithScale({
            config: { axis: { labelAngle: 500 } },
            mark: 'bar',
            encoding: {
                y: {
                    type: 'quantitative',
                    field: 'US_Gross',
                    scale: { domain: [-1, 2] },
                    bin: { extent: [0, 1] }
                }
            },
            data: { url: 'data/movies.json' }
        });
        var defaultModel = util_1.parseUnitModelWithScale({
            data: {
                values: [
                    { a: 'A', b: 28 },
                    { a: 'B', b: 55 },
                    { a: 'C', b: 43 },
                    { a: 'D', b: 91 },
                    { a: 'E', b: 81 },
                    { a: 'F', b: 53 },
                    { a: 'G', b: 19 },
                    { a: 'H', b: 87 },
                    { a: 'I', b: 52 }
                ]
            },
            mark: 'bar',
            encoding: {
                x: { field: 'a', type: 'ordinal' },
                y: { field: 'b', type: 'quantitative' }
            }
        });
        var bothModel = util_1.parseUnitModelWithScale({
            config: { axis: { labelAngle: 500 } },
            mark: 'bar',
            encoding: {
                y: {
                    type: 'quantitative',
                    field: 'US_Gross',
                    scale: { domain: [-1, 2] },
                    bin: { extent: [0, 1] },
                    axis: { labelAngle: 600 }
                }
            },
            data: { url: 'data/movies.json' }
        });
        var neitherModel = util_1.parseUnitModelWithScale({
            mark: 'bar',
            encoding: {
                y: {
                    type: 'quantitative',
                    field: 'US_Gross',
                    scale: { domain: [-1, 2] },
                    bin: { extent: [0, 1] }
                }
            },
            data: { url: 'data/movies.json' }
        });
        it('should return the correct labelAngle from the axis definition', function () {
            chai_1.assert.deepEqual(240, properties_1.labelAngle(axisModel, axisModel.axis('y'), 'y', axisModel.fieldDef('y')));
        });
        it('should return the correct labelAngle from the axis config definition', function () {
            chai_1.assert.deepEqual(140, properties_1.labelAngle(configModel, configModel.axis('y'), 'y', configModel.fieldDef('y')));
        });
        it('should return the correct default labelAngle when not specified', function () {
            chai_1.assert.deepEqual(270, properties_1.labelAngle(defaultModel, defaultModel.axis('x'), 'x', defaultModel.fieldDef('x')));
        });
        it('should return the labelAngle declared in the axis when both the axis and axis config have labelAngle', function () {
            chai_1.assert.deepEqual(240, properties_1.labelAngle(bothModel, bothModel.axis('y'), 'y', bothModel.fieldDef('y')));
        });
        it('should return undefined when there is no default and no specified labelAngle', function () {
            chai_1.assert.deepEqual(undefined, properties_1.labelAngle(neitherModel, neitherModel.axis('y'), 'y', neitherModel.fieldDef('y')));
        });
    });
    describe('labelAlign', function () {
        describe('horizontal orients', function () {
            it('360 degree check for horizonatal orients return to see if they orient properly', function () {
                chai_1.assert.equal(properties_1.labelAlign(0, 'top'), 'center');
                chai_1.assert.equal(properties_1.labelAlign(15, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(30, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(45, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(60, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(75, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(90, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(105, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(120, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(135, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(150, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(165, 'top'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(180, 'top'), 'center');
                chai_1.assert.equal(properties_1.labelAlign(195, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(210, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(225, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(240, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(255, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(270, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(285, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(300, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(315, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(330, 'bottom'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(345, 'bottom'), 'right');
            });
            it('360 degree check for vertical orients return to see if they orient properly', function () {
                chai_1.assert.equal(properties_1.labelAlign(0, 'left'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(15, 'left'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(30, 'left'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(45, 'left'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(60, 'left'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(75, 'left'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(90, 'left'), 'center');
                chai_1.assert.equal(properties_1.labelAlign(105, 'left'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(120, 'left'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(135, 'left'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(150, 'left'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(165, 'left'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(180, 'left'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(195, 'right'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(210, 'right'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(225, 'right'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(240, 'right'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(255, 'right'), 'right');
                chai_1.assert.equal(properties_1.labelAlign(270, 'right'), 'center');
                chai_1.assert.equal(properties_1.labelAlign(285, 'right'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(300, 'right'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(315, 'right'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(330, 'right'), 'left');
                chai_1.assert.equal(properties_1.labelAlign(345, 'right'), 'left');
            });
            it('should return undefined if angle is undefined', function () {
                chai_1.assert.deepEqual(properties_1.labelAlign(undefined, 'left'), undefined);
            });
        });
    });
    describe('labelBaseline', function () {
        it('is middle for perpendiculars horizontal orients', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(90, 'top'), 'middle');
            chai_1.assert.deepEqual(properties_1.labelBaseline(270, 'bottom'), 'middle');
        });
        it('is top for bottom orients for 1st and 4th quadrants', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(45, 'bottom'), 'top');
            chai_1.assert.deepEqual(properties_1.labelBaseline(180, 'top'), 'top');
        });
        it('is bottom for bottom orients for 2nd and 3rd quadrants', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(100, 'bottom'), 'middle');
            chai_1.assert.deepEqual(properties_1.labelBaseline(260, 'bottom'), 'middle');
        });
        it('is middle for 0 and 180 horizontal orients', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(0, 'left'), 'middle');
            chai_1.assert.deepEqual(properties_1.labelBaseline(180, 'right'), 'middle');
        });
        it('is top for bottom orients for 1st and 2nd quadrants', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(80, 'left'), 'top');
            chai_1.assert.deepEqual(properties_1.labelBaseline(100, 'left'), 'top');
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(280, 'left'), 'bottom');
            chai_1.assert.deepEqual(properties_1.labelBaseline(260, 'left'), 'bottom');
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(280, 'left'), 'bottom');
            chai_1.assert.deepEqual(properties_1.labelBaseline(260, 'left'), 'bottom');
        });
        it('should return undefined if angle is undefined', function () {
            chai_1.assert.deepEqual(properties_1.labelBaseline(undefined, 'left'), undefined);
        });
    });
});
//# sourceMappingURL=properties.test.js.map