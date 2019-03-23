/* tslint:disable:quotemark */
import * as properties from '../../../src/compile/axis/properties';
import { defaultLabelAlign, defaultLabelBaseline, labelAngle } from '../../../src/compile/axis/properties';
import { parseUnitModelWithScale } from '../../util';
describe('compile/axis', () => {
    describe('defaultGrid()', () => {
        it('should return true by default for continuous scale that is not binned', () => {
            const grid = properties.defaultGrid('linear', { field: 'a', type: 'quantitative' });
            expect(grid).toBe(true);
        });
        it('should return false by default for binned field', () => {
            const grid = properties.defaultGrid('linear', { bin: true, field: 'a', type: 'quantitative' });
            expect(grid).toBe(false);
        });
        it('should return false by default for a discrete scale', () => {
            const grid = properties.defaultGrid('point', { field: 'a', type: 'quantitative' });
            expect(grid).toBe(false);
        });
    });
    describe('orient()', () => {
        it('should return bottom for x by default', () => {
            const orient = properties.orient('x');
            expect(orient).toBe('bottom');
        });
        it('should return left for y by default', () => {
            const orient = properties.orient('y');
            expect(orient).toBe('left');
        });
    });
    describe('defaultTickCount()', () => {
        it('should return undefined by default for a binned field', () => {
            const tickCount = properties.defaultTickCount({
                fieldDef: { bin: { maxbins: 10 }, field: 'a', type: 'quantitative' },
                scaleType: 'linear',
                size: { signal: 'a' }
            });
            expect(tickCount).toEqual({ signal: 'ceil(a/10)' });
        });
        for (const timeUnit of ['month', 'hours', 'day', 'quarter']) {
            it(`should return undefined by default for a temporal field with timeUnit=${timeUnit}`, () => {
                const tickCount = properties.defaultTickCount({
                    fieldDef: { timeUnit, field: 'a', type: 'temporal' },
                    scaleType: 'linear',
                    size: { signal: 'a' }
                });
                expect(tickCount).not.toBeDefined();
            });
        }
        it('should return size/40 by default for linear scale', () => {
            const tickCount = properties.defaultTickCount({
                fieldDef: { field: 'a', type: 'quantitative' },
                scaleType: 'linear',
                size: { signal: 'a' }
            });
            expect(tickCount).toEqual({ signal: 'ceil(a/40)' });
        });
        it('should return undefined by default for log scale', () => {
            const tickCount = properties.defaultTickCount({ fieldDef: { field: 'a', type: 'quantitative' }, scaleType: 'log' });
            expect(tickCount).toBeUndefined();
        });
        it('should return undefined by default for point scale', () => {
            const tickCount = properties.defaultTickCount({
                fieldDef: { field: 'a', type: 'quantitative' },
                scaleType: 'point'
            });
            expect(tickCount).toBeUndefined();
        });
    });
    describe('values', () => {
        it('should return correct timestamp values for DateTimes', () => {
            const values = properties.values({ values: [{ year: 1970 }, { year: 1980 }] }, null, { field: 'a', type: 'temporal' }, 'x');
            expect(values).toEqual([
                { signal: 'datetime(1970, 0, 1, 0, 0, 0, 0)' },
                { signal: 'datetime(1980, 0, 1, 0, 0, 0, 0)' }
            ]);
        });
        it('should simply return values for non-DateTime', () => {
            const values = properties.values({ values: [1, 2, 3, 4] }, null, { field: 'a', type: 'quantitative' }, 'x');
            expect(values).toEqual([1, 2, 3, 4]);
        });
        it('should simply drop values when domain is specified', () => {
            const model1 = parseUnitModelWithScale({
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
            const values = properties.values({}, model1, model1.fieldDef('y'), 'y');
            expect(values).toBeUndefined();
        });
    });
    describe('labelAngle', () => {
        const axisModel = parseUnitModelWithScale({
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
        const configModel = parseUnitModelWithScale({
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
        const defaultModel = parseUnitModelWithScale({
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
        const bothModel = parseUnitModelWithScale({
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
        const neitherModel = parseUnitModelWithScale({
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
        it('should return the correct labelAngle from the axis definition', () => {
            expect(240).toEqual(labelAngle(axisModel, axisModel.axis('y'), 'y', axisModel.fieldDef('y')));
        });
        it('should return the correct labelAngle from the axis config definition', () => {
            expect(140).toEqual(labelAngle(configModel, configModel.axis('y'), 'y', configModel.fieldDef('y')));
        });
        it('should return the correct default labelAngle when not specified', () => {
            expect(270).toEqual(labelAngle(defaultModel, defaultModel.axis('x'), 'x', defaultModel.fieldDef('x')));
        });
        it('should return the labelAngle declared in the axis when both the axis and axis config have labelAngle', () => {
            expect(240).toEqual(labelAngle(bothModel, bothModel.axis('y'), 'y', bothModel.fieldDef('y')));
        });
        it('should return undefined when there is no default and no specified labelAngle', () => {
            expect(undefined).toEqual(labelAngle(neitherModel, neitherModel.axis('y'), 'y', neitherModel.fieldDef('y')));
        });
    });
    describe('defaultLabelAlign', () => {
        describe('horizontal orients', () => {
            it('360 degree check for horizonatal orients return to see if they orient properly', () => {
                expect(defaultLabelAlign(0, 'top')).toEqual('center');
                expect(defaultLabelAlign(15, 'top')).toEqual('right');
                expect(defaultLabelAlign(30, 'top')).toEqual('right');
                expect(defaultLabelAlign(45, 'top')).toEqual('right');
                expect(defaultLabelAlign(60, 'top')).toEqual('right');
                expect(defaultLabelAlign(75, 'top')).toEqual('right');
                expect(defaultLabelAlign(90, 'top')).toEqual('right');
                expect(defaultLabelAlign(105, 'top')).toEqual('right');
                expect(defaultLabelAlign(120, 'top')).toEqual('right');
                expect(defaultLabelAlign(135, 'top')).toEqual('right');
                expect(defaultLabelAlign(150, 'top')).toEqual('right');
                expect(defaultLabelAlign(165, 'top')).toEqual('right');
                expect(defaultLabelAlign(180, 'top')).toEqual('center');
                expect(defaultLabelAlign(195, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(210, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(225, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(240, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(255, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(270, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(285, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(300, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(315, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(330, 'bottom')).toEqual('right');
                expect(defaultLabelAlign(345, 'bottom')).toEqual('right');
            });
            it('360 degree check for vertical orients return to see if they orient properly', () => {
                expect(defaultLabelAlign(0, 'left')).toEqual('right');
                expect(defaultLabelAlign(15, 'left')).toEqual('right');
                expect(defaultLabelAlign(30, 'left')).toEqual('right');
                expect(defaultLabelAlign(45, 'left')).toEqual('right');
                expect(defaultLabelAlign(60, 'left')).toEqual('right');
                expect(defaultLabelAlign(75, 'left')).toEqual('right');
                expect(defaultLabelAlign(90, 'left')).toEqual('center');
                expect(defaultLabelAlign(105, 'left')).toEqual('left');
                expect(defaultLabelAlign(120, 'left')).toEqual('left');
                expect(defaultLabelAlign(135, 'left')).toEqual('left');
                expect(defaultLabelAlign(150, 'left')).toEqual('left');
                expect(defaultLabelAlign(165, 'left')).toEqual('left');
                expect(defaultLabelAlign(180, 'left')).toEqual('left');
                expect(defaultLabelAlign(195, 'right')).toEqual('right');
                expect(defaultLabelAlign(210, 'right')).toEqual('right');
                expect(defaultLabelAlign(225, 'right')).toEqual('right');
                expect(defaultLabelAlign(240, 'right')).toEqual('right');
                expect(defaultLabelAlign(255, 'right')).toEqual('right');
                expect(defaultLabelAlign(270, 'right')).toEqual('center');
                expect(defaultLabelAlign(285, 'right')).toEqual('left');
                expect(defaultLabelAlign(300, 'right')).toEqual('left');
                expect(defaultLabelAlign(315, 'right')).toEqual('left');
                expect(defaultLabelAlign(330, 'right')).toEqual('left');
                expect(defaultLabelAlign(345, 'right')).toEqual('left');
            });
            it('should return undefined if angle is undefined', () => {
                expect(defaultLabelAlign(undefined, 'left')).toEqual(undefined);
            });
        });
    });
    describe('defaultLabelBaseline', () => {
        it('is middle for perpendiculars horizontal orients', () => {
            expect(defaultLabelBaseline(90, 'top')).toEqual('middle');
            expect(defaultLabelBaseline(270, 'bottom')).toEqual('middle');
        });
        it('is top for bottom orients for 1st and 4th quadrants', () => {
            expect(defaultLabelBaseline(45, 'bottom')).toEqual('top');
            expect(defaultLabelBaseline(180, 'top')).toEqual('top');
        });
        it('is bottom for bottom orients for 2nd and 3rd quadrants', () => {
            expect(defaultLabelBaseline(100, 'bottom')).toEqual('middle');
            expect(defaultLabelBaseline(260, 'bottom')).toEqual('middle');
        });
        it('is middle for 0 and 180 horizontal orients', () => {
            expect(defaultLabelBaseline(0, 'left')).toEqual('middle');
            expect(defaultLabelBaseline(180, 'right')).toEqual('middle');
        });
        it('is top for bottom orients for 1st and 2nd quadrants', () => {
            expect(defaultLabelBaseline(80, 'left')).toEqual('top');
            expect(defaultLabelBaseline(100, 'left')).toEqual('top');
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', () => {
            expect(defaultLabelBaseline(280, 'left')).toEqual('bottom');
            expect(defaultLabelBaseline(260, 'left')).toEqual('bottom');
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', () => {
            expect(defaultLabelBaseline(280, 'left')).toEqual('bottom');
            expect(defaultLabelBaseline(260, 'left')).toEqual('bottom');
        });
        it('should return undefined if angle is undefined', () => {
            expect(defaultLabelBaseline(undefined, 'left')).toEqual(undefined);
        });
    });
});
//# sourceMappingURL=properties.test.js.map