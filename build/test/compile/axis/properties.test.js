/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as properties from '../../../src/compile/axis/properties';
import { labelAlign, labelAngle, labelBaseline } from '../../../src/compile/axis/properties';
import { parseUnitModelWithScale } from '../../util';
describe('compile/axis', function () {
    describe('grid()', function () {
        it('should return true by default for continuous scale that is not binned', function () {
            var grid = properties.grid('linear', { field: 'a', type: 'quantitative' });
            assert.deepEqual(grid, true);
        });
        it('should return false by default for binned field', function () {
            var grid = properties.grid('linear', { bin: true, field: 'a', type: 'quantitative' });
            assert.deepEqual(grid, false);
        });
        it('should return false by default for a discrete scale', function () {
            var grid = properties.grid('point', { field: 'a', type: 'quantitative' });
            assert.deepEqual(grid, false);
        });
    });
    describe('orient()', function () {
        it('should return bottom for x by default', function () {
            var orient = properties.orient('x');
            assert.deepEqual(orient, 'bottom');
        });
        it('should return left for y by default', function () {
            var orient = properties.orient('y');
            assert.deepEqual(orient, 'left');
        });
    });
    describe('tickCount', function () {
        it('should return undefined by default for a binned field', function () {
            var tickCount = properties.tickCount('x', { bin: { maxbins: 10 }, field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' }, undefined, {});
            assert.deepEqual(tickCount, { signal: 'ceil(a/20)' });
        });
        var _loop_1 = function (timeUnit) {
            it("should return undefined by default for a temporal field with timeUnit=" + timeUnit, function () {
                var tickCount = properties.tickCount('x', { timeUnit: timeUnit, field: 'a', type: 'temporal' }, 'linear', { signal: 'a' }, undefined, {});
                assert.isUndefined(tickCount);
            });
        };
        for (var _i = 0, _a = ['month', 'hours', 'day', 'quarter']; _i < _a.length; _i++) {
            var timeUnit = _a[_i];
            _loop_1(timeUnit);
        }
        it('should return size/40 by default for linear scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'linear', { signal: 'a' }, undefined, {});
            assert.deepEqual(tickCount, { signal: 'ceil(a/40)' });
        });
        it('should return undefined by default for log scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'log', undefined, undefined, {});
            assert.deepEqual(tickCount, undefined);
        });
        it('should return undefined by default for point scale', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'point', undefined, undefined, {});
            assert.deepEqual(tickCount, undefined);
        });
        it('should return prebin step signal for axis with tickStep', function () {
            var tickCount = properties.tickCount('x', { field: 'a', type: 'quantitative' }, 'linear', undefined, 'x', {
                tickStep: 3
            });
            assert.deepEqual(tickCount, { signal: "(domain('x')[1] - domain('x')[0]) / 3 + 1" });
        });
    });
    describe('values', function () {
        it('should return correct timestamp values for DateTimes', function () {
            var values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, null, { field: 'a', type: 'temporal' }, 'x');
            assert.deepEqual(values, [
                { signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)' },
                { signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)' }
            ]);
        });
        it('should simply return values for non-DateTime', function () {
            var values = properties.values({ values: [1, 2, 3, 4] }, null, { field: 'a', type: 'quantitative' }, 'x');
            assert.deepEqual(values, [1, 2, 3, 4]);
        });
        it('should simply drop values when domain is specified', function () {
            var model1 = parseUnitModelWithScale({
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
            assert.deepEqual(values, undefined);
        });
        it('should return value signal for axis with tickStep', function () {
            var model = parseUnitModelWithScale({
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
            assert.deepEqual(values, { signal: "sequence(domain('x')[0], domain('x')[1] + 3, 3)" });
        });
    });
    describe('labelAngle', function () {
        var axisModel = parseUnitModelWithScale({
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
        var configModel = parseUnitModelWithScale({
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
        var defaultModel = parseUnitModelWithScale({
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
        var bothModel = parseUnitModelWithScale({
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
        var neitherModel = parseUnitModelWithScale({
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
            assert.deepEqual(240, labelAngle(axisModel, axisModel.axis('y'), 'y', axisModel.fieldDef('y')));
        });
        it('should return the correct labelAngle from the axis config definition', function () {
            assert.deepEqual(140, labelAngle(configModel, configModel.axis('y'), 'y', configModel.fieldDef('y')));
        });
        it('should return the correct default labelAngle when not specified', function () {
            assert.deepEqual(270, labelAngle(defaultModel, defaultModel.axis('x'), 'x', defaultModel.fieldDef('x')));
        });
        it('should return the labelAngle declared in the axis when both the axis and axis config have labelAngle', function () {
            assert.deepEqual(240, labelAngle(bothModel, bothModel.axis('y'), 'y', bothModel.fieldDef('y')));
        });
        it('should return undefined when there is no default and no specified labelAngle', function () {
            assert.deepEqual(undefined, labelAngle(neitherModel, neitherModel.axis('y'), 'y', neitherModel.fieldDef('y')));
        });
    });
    describe('labelAlign', function () {
        describe('horizontal orients', function () {
            it('360 degree check for horizonatal orients return to see if they orient properly', function () {
                assert.equal(labelAlign(0, 'top'), 'center');
                assert.equal(labelAlign(15, 'top'), 'right');
                assert.equal(labelAlign(30, 'top'), 'right');
                assert.equal(labelAlign(45, 'top'), 'right');
                assert.equal(labelAlign(60, 'top'), 'right');
                assert.equal(labelAlign(75, 'top'), 'right');
                assert.equal(labelAlign(90, 'top'), 'right');
                assert.equal(labelAlign(105, 'top'), 'right');
                assert.equal(labelAlign(120, 'top'), 'right');
                assert.equal(labelAlign(135, 'top'), 'right');
                assert.equal(labelAlign(150, 'top'), 'right');
                assert.equal(labelAlign(165, 'top'), 'right');
                assert.equal(labelAlign(180, 'top'), 'center');
                assert.equal(labelAlign(195, 'bottom'), 'right');
                assert.equal(labelAlign(210, 'bottom'), 'right');
                assert.equal(labelAlign(225, 'bottom'), 'right');
                assert.equal(labelAlign(240, 'bottom'), 'right');
                assert.equal(labelAlign(255, 'bottom'), 'right');
                assert.equal(labelAlign(270, 'bottom'), 'right');
                assert.equal(labelAlign(285, 'bottom'), 'right');
                assert.equal(labelAlign(300, 'bottom'), 'right');
                assert.equal(labelAlign(315, 'bottom'), 'right');
                assert.equal(labelAlign(330, 'bottom'), 'right');
                assert.equal(labelAlign(345, 'bottom'), 'right');
            });
            it('360 degree check for vertical orients return to see if they orient properly', function () {
                assert.equal(labelAlign(0, 'left'), 'right');
                assert.equal(labelAlign(15, 'left'), 'right');
                assert.equal(labelAlign(30, 'left'), 'right');
                assert.equal(labelAlign(45, 'left'), 'right');
                assert.equal(labelAlign(60, 'left'), 'right');
                assert.equal(labelAlign(75, 'left'), 'right');
                assert.equal(labelAlign(90, 'left'), 'center');
                assert.equal(labelAlign(105, 'left'), 'left');
                assert.equal(labelAlign(120, 'left'), 'left');
                assert.equal(labelAlign(135, 'left'), 'left');
                assert.equal(labelAlign(150, 'left'), 'left');
                assert.equal(labelAlign(165, 'left'), 'left');
                assert.equal(labelAlign(180, 'left'), 'left');
                assert.equal(labelAlign(195, 'right'), 'right');
                assert.equal(labelAlign(210, 'right'), 'right');
                assert.equal(labelAlign(225, 'right'), 'right');
                assert.equal(labelAlign(240, 'right'), 'right');
                assert.equal(labelAlign(255, 'right'), 'right');
                assert.equal(labelAlign(270, 'right'), 'center');
                assert.equal(labelAlign(285, 'right'), 'left');
                assert.equal(labelAlign(300, 'right'), 'left');
                assert.equal(labelAlign(315, 'right'), 'left');
                assert.equal(labelAlign(330, 'right'), 'left');
                assert.equal(labelAlign(345, 'right'), 'left');
            });
            it('should return undefined if angle is undefined', function () {
                assert.deepEqual(labelAlign(undefined, 'left'), undefined);
            });
        });
    });
    describe('labelBaseline', function () {
        it('is middle for perpendiculars horizontal orients', function () {
            assert.deepEqual(labelBaseline(90, 'top'), 'middle');
            assert.deepEqual(labelBaseline(270, 'bottom'), 'middle');
        });
        it('is top for bottom orients for 1st and 4th quadrants', function () {
            assert.deepEqual(labelBaseline(45, 'bottom'), 'top');
            assert.deepEqual(labelBaseline(180, 'top'), 'top');
        });
        it('is bottom for bottom orients for 2nd and 3rd quadrants', function () {
            assert.deepEqual(labelBaseline(100, 'bottom'), 'middle');
            assert.deepEqual(labelBaseline(260, 'bottom'), 'middle');
        });
        it('is middle for 0 and 180 horizontal orients', function () {
            assert.deepEqual(labelBaseline(0, 'left'), 'middle');
            assert.deepEqual(labelBaseline(180, 'right'), 'middle');
        });
        it('is top for bottom orients for 1st and 2nd quadrants', function () {
            assert.deepEqual(labelBaseline(80, 'left'), 'top');
            assert.deepEqual(labelBaseline(100, 'left'), 'top');
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            assert.deepEqual(labelBaseline(280, 'left'), 'bottom');
            assert.deepEqual(labelBaseline(260, 'left'), 'bottom');
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            assert.deepEqual(labelBaseline(280, 'left'), 'bottom');
            assert.deepEqual(labelBaseline(260, 'left'), 'bottom');
        });
        it('should return undefined if angle is undefined', function () {
            assert.deepEqual(labelBaseline(undefined, 'left'), undefined);
        });
    });
});
//# sourceMappingURL=properties.test.js.map