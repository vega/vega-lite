"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var encode = require("../../../src/compile/axis/encode");
var encode_1 = require("../../../src/compile/axis/encode");
var util_1 = require("../../util");
describe('compile/axis/encode', function () {
    describe('encode.labels()', function () {
        it('should not rotate label for temporal field by default', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            chai_1.assert.isUndefined(labels.angle);
        });
        it('should do not rotate label for temporal field if labelAngle is specified in axis config', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                },
                config: { axisX: { labelAngle: 90 } }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            chai_1.assert.isUndefined(labels.angle);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "yearquartermonth" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            chai_1.assert.equal(labels.text.signal, expected);
        });
    });
    describe('labelAlign', function () {
        describe('horizontal orients', function () {
            it('360 degree check for horizonatal orients return to see if they orient properly', function () {
                chai_1.assert.equal(encode_1.labelAlign(0, 'top'), 'center');
                chai_1.assert.equal(encode_1.labelAlign(15, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(30, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(45, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(60, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(75, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(90, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(105, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(120, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(135, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(150, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(165, 'top'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(180, 'top'), 'center');
                chai_1.assert.equal(encode_1.labelAlign(195, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(210, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(225, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(240, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(255, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(270, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(285, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(300, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(315, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(330, 'bottom'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(345, 'bottom'), 'right');
            });
            it('360 degree check for vertical orients return to see if they orient properly', function () {
                chai_1.assert.equal(encode_1.labelAlign(0, 'left'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(15, 'left'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(30, 'left'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(45, 'left'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(60, 'left'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(75, 'left'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(90, 'left'), 'center');
                chai_1.assert.equal(encode_1.labelAlign(105, 'left'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(120, 'left'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(135, 'left'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(150, 'left'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(165, 'left'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(180, 'left'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(195, 'right'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(210, 'right'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(225, 'right'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(240, 'right'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(255, 'right'), 'right');
                chai_1.assert.equal(encode_1.labelAlign(270, 'right'), 'center');
                chai_1.assert.equal(encode_1.labelAlign(285, 'right'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(300, 'right'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(315, 'right'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(330, 'right'), 'left');
                chai_1.assert.equal(encode_1.labelAlign(345, 'right'), 'left');
            });
        });
    });
    describe('labelBaseline', function () {
        it('is middle for perpendiculars horizontal orients', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(90, 'top'), { value: 'middle' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(270, 'bottom'), { value: 'middle' });
        });
        it('is top for bottom orients for 1st and 4th quadrants', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(45, 'bottom'), { value: 'top' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(180, 'top'), { value: 'top' });
        });
        it('is bottom for bottom orients for 2nd and 3rd quadrants', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(100, 'bottom'), { value: 'middle' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(260, 'bottom'), { value: 'middle' });
        });
        it('is middle for 0 and 180 horizontal orients', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(0, 'left'), { value: 'middle' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(180, 'right'), { value: 'middle' });
        });
        it('is top for bottom orients for 1st and 2nd quadrants', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(80, 'left'), { value: 'top' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(100, 'left'), { value: 'top' });
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(280, 'left'), { value: 'bottom' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(260, 'left'), { value: 'bottom' });
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            chai_1.assert.deepEqual(encode_1.labelBaseline(280, 'left'), { value: 'bottom' });
            chai_1.assert.deepEqual(encode_1.labelBaseline(260, 'left'), { value: 'bottom' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5jb2RlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvYXhpcy9lbmNvZGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFFNUIseURBQTJEO0FBQzNELDJEQUEyRTtBQUMzRSxtQ0FBbUQ7QUFHbkQsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtRQUMxQixFQUFFLENBQUMsdURBQXVELEVBQUU7WUFDMUQsSUFBTSxLQUFLLEdBQUcsOEJBQXVCLENBQUM7Z0JBQ3BDLElBQUksRUFBRSxPQUFPO2dCQUNiLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlGQUF5RixFQUFFO1lBQzVGLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JEO2dCQUNELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUMsRUFBQzthQUNsQyxDQUFDLENBQUM7WUFDSCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELGFBQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHVEQUF1RCxFQUFFO1lBQzFELElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUM7aUJBQ3ZEO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUN2RCxJQUFNLFFBQVEsR0FBRyw0QkFBNEIsQ0FBQztZQUM5QyxhQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGdFQUFnRSxFQUFFO1lBQ25FLElBQU0sS0FBSyxHQUFHLDhCQUF1QixDQUFDO2dCQUNwQyxJQUFJLEVBQUUsT0FBTztnQkFDYixRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBQztpQkFDaEU7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQ3ZELElBQU0sUUFBUSxHQUFHLHFFQUFxRSxDQUFDO1lBQ3ZGLGFBQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDN0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsUUFBUSxDQUFDLG9CQUFvQixFQUFFO1lBQzdCLEVBQUUsQ0FBQyxnRkFBZ0YsRUFBRTtnQkFDbkYsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDL0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztZQUNuRCxDQUFDLENBQUMsQ0FBQztZQUNILEVBQUUsQ0FBQyw2RUFBNkUsRUFBRTtnQkFDaEYsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDN0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDL0MsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFDaEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztnQkFDakQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFD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c0JBQWEsQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtZQUMzRCxhQUFNLENBQUMsU0FBUyxDQUFDLHNCQUFhLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLENBQUM7WUFDaEUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxzQkFBYSxDQUFDLEdBQUcsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlOnF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCAqIGFzIGVuY29kZSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9heGlzL2VuY29kZSc7XG5pbXBvcnQge2xhYmVsQWxpZ24sIGxhYmVsQmFzZWxpbmV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2F4aXMvZW5jb2RlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbmRlc2NyaWJlKCdjb21waWxlL2F4aXMvZW5jb2RlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnZW5jb2RlLmxhYmVscygpJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgbm90IHJvdGF0ZSBsYWJlbCBmb3IgdGVtcG9yYWwgZmllbGQgYnkgZGVmYXVsdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcIm1vbnRoXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbGFiZWxzID0gZW5jb2RlLmxhYmVscyhtb2RlbCwgJ3gnLCB7fSwgJ2JvdHRvbScpO1xuICAgICAgYXNzZXJ0LmlzVW5kZWZpbmVkKGxhYmVscy5hbmdsZSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRvIG5vdCByb3RhdGUgbGFiZWwgZm9yIHRlbXBvcmFsIGZpZWxkIGlmIGxhYmVsQW5nbGUgaXMgc3BlY2lmaWVkIGluIGF4aXMgY29uZmlnJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgbWFyazogXCJwb2ludFwiLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogXCJhXCIsIHR5cGU6IFwidGVtcG9yYWxcIiwgdGltZVVuaXQ6IFwibW9udGhcIn1cbiAgICAgICAgfSxcbiAgICAgICAgY29uZmlnOiB7YXhpc1g6IHtsYWJlbEFuZ2xlOiA5MH19XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGxhYmVscyA9IGVuY29kZS5sYWJlbHMobW9kZWwsICd4Jywge30sICdib3R0b20nKTtcbiAgICAgIGFzc2VydC5pc1VuZGVmaW5lZChsYWJlbHMuYW5nbGUpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGNvcnJlY3QgdGV4dC5zaWduYWwgZm9yIHF1YXJ0ZXIgdGltZVVuaXRzJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgIG1hcms6IFwicG9pbnRcIixcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6IFwiYVwiLCB0eXBlOiBcInRlbXBvcmFsXCIsIHRpbWVVbml0OiBcInF1YXJ0ZXJcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBsYWJlbHMgPSBlbmNvZGUubGFiZWxzKG1vZGVsLCAneCcsIHt9LCAnYm90dG9tJyk7XG4gICAgICBjb25zdCBleHBlY3RlZCA9IFwiJ1EnICsgcXVhcnRlcihkYXR1bS52YWx1ZSlcIjtcbiAgICAgIGFzc2VydC5lcXVhbChsYWJlbHMudGV4dC5zaWduYWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBjb3JyZWN0IHRleHQuc2lnbmFsIGZvciB5ZWFycXVhcnRlcm1vbnRoIHRpbWVVbml0cycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICBtYXJrOiBcInBvaW50XCIsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiBcImFcIiwgdHlwZTogXCJ0ZW1wb3JhbFwiLCB0aW1lVW5pdDogXCJ5ZWFycXVhcnRlcm1vbnRoXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgbGFiZWxzID0gZW5jb2RlLmxhYmVscyhtb2RlbCwgJ3gnLCB7fSwgJ2JvdHRvbScpO1xuICAgICAgY29uc3QgZXhwZWN0ZWQgPSBcIidRJyArIHF1YXJ0ZXIoZGF0dW0udmFsdWUpICsgJyAnICsgdGltZUZvcm1hdChkYXR1bS52YWx1ZSwgJyViICVZJylcIjtcbiAgICAgIGFzc2VydC5lcXVhbChsYWJlbHMudGV4dC5zaWduYWwsIGV4cGVjdGVkKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xhYmVsQWxpZ24nLCAoKSA9PiB7XG4gICAgZGVzY3JpYmUoJ2hvcml6b250YWwgb3JpZW50cycsICgpID0+IHtcbiAgICAgIGl0KCczNjAgZGVncmVlIGNoZWNrIGZvciBob3Jpem9uYXRhbCBvcmllbnRzIHJldHVybiB0byBzZWUgaWYgdGhleSBvcmllbnQgcHJvcGVybHknLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDAsICd0b3AnKSwgJ2NlbnRlcicpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigxNSwgJ3RvcCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMzAsICd0b3AnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDQ1LCAndG9wJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbig2MCwgJ3RvcCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oNzUsICd0b3AnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDkwLCAndG9wJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigxMDUsICd0b3AnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDEyMCwgJ3RvcCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMTM1LCAndG9wJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigxNTAsICd0b3AnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDE2NSwgJ3RvcCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMTgwLCAndG9wJyksICdjZW50ZXInKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMTk1LCAnYm90dG9tJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigyMTAsICdib3R0b20nKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDIyNSwgJ2JvdHRvbScpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMjQwLCAnYm90dG9tJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigyNTUsICdib3R0b20nKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDI3MCwgJ2JvdHRvbScpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMjg1LCAnYm90dG9tJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigzMDAsICdib3R0b20nKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDMxNSwgJ2JvdHRvbScpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMzMwLCAnYm90dG9tJyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigzNDUsICdib3R0b20nKSwgJ3JpZ2h0Jyk7XG4gICAgICB9KTtcbiAgICAgIGl0KCczNjAgZGVncmVlIGNoZWNrIGZvciB2ZXJ0aWNhbCBvcmllbnRzIHJldHVybiB0byBzZWUgaWYgdGhleSBvcmllbnQgcHJvcGVybHknLCAoKSA9PiB7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDAsICdsZWZ0JyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigxNSwgJ2xlZnQnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDMwLCAnbGVmdCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oNDUsICdsZWZ0JyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbig2MCwgJ2xlZnQnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDc1LCAnbGVmdCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oOTAsICdsZWZ0JyksICdjZW50ZXInKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMTA1LCAnbGVmdCcpLCAnbGVmdCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigxMjAsICdsZWZ0JyksICdsZWZ0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDEzNSwgJ2xlZnQnKSwgJ2xlZnQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMTUwLCAnbGVmdCcpLCAnbGVmdCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigxNjUsICdsZWZ0JyksICdsZWZ0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDE4MCwgJ2xlZnQnKSwgJ2xlZnQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMTk1LCAncmlnaHQnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDIxMCwgJ3JpZ2h0JyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigyMjUsICdyaWdodCcpLCAncmlnaHQnKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGxhYmVsQWxpZ24oMjQwLCAncmlnaHQnKSwgJ3JpZ2h0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDI1NSwgJ3JpZ2h0JyksICdyaWdodCcpO1xuICAgICAgICBhc3NlcnQuZXF1YWwobGFiZWxBbGlnbigyNzAsICdyaWdodCcpLCAnY2VudGVyJyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDI4NSwgJ3JpZ2h0JyksICdsZWZ0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDMwMCwgJ3JpZ2h0JyksICdsZWZ0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDMxNSwgJ3JpZ2h0JyksICdsZWZ0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDMzMCwgJ3JpZ2h0JyksICdsZWZ0Jyk7XG4gICAgICAgIGFzc2VydC5lcXVhbChsYWJlbEFsaWduKDM0NSwgJ3JpZ2h0JyksICdsZWZ0Jyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2xhYmVsQmFzZWxpbmUnLCAoKSA9PiB7XG4gICAgaXQoJ2lzIG1pZGRsZSBmb3IgcGVycGVuZGljdWxhcnMgaG9yaXpvbnRhbCBvcmllbnRzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDkwLCAndG9wJyksIHt2YWx1ZTogJ21pZGRsZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSgyNzAsICdib3R0b20nKSwge3ZhbHVlOiAnbWlkZGxlJ30pO1xuICAgIH0pO1xuXG5cbiAgICBpdCgnaXMgdG9wIGZvciBib3R0b20gb3JpZW50cyBmb3IgMXN0IGFuZCA0dGggcXVhZHJhbnRzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDQ1LCAnYm90dG9tJyksIHt2YWx1ZTogJ3RvcCd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSgxODAsICd0b3AnKSwge3ZhbHVlOiAndG9wJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2lzIGJvdHRvbSBmb3IgYm90dG9tIG9yaWVudHMgZm9yIDJuZCBhbmQgM3JkIHF1YWRyYW50cycsICgpID0+IHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSgxMDAsICdib3R0b20nKSwge3ZhbHVlOiAnbWlkZGxlJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDI2MCwgJ2JvdHRvbScpLCB7dmFsdWU6ICdtaWRkbGUnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXMgbWlkZGxlIGZvciAwIGFuZCAxODAgaG9yaXpvbnRhbCBvcmllbnRzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDAsICdsZWZ0JyksIHt2YWx1ZTogJ21pZGRsZSd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSgxODAsICdyaWdodCcpLCB7dmFsdWU6ICdtaWRkbGUnfSk7XG4gICAgfSk7XG5cblxuICAgIGl0KCdpcyB0b3AgZm9yIGJvdHRvbSBvcmllbnRzIGZvciAxc3QgYW5kIDJuZCBxdWFkcmFudHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQmFzZWxpbmUoODAsICdsZWZ0JyksIHt2YWx1ZTogJ3RvcCd9KTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobGFiZWxCYXNlbGluZSgxMDAsICdsZWZ0JyksIHt2YWx1ZTogJ3RvcCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdpcyBib3R0b20gZm9yIGJvdHRvbSBvcmllbnRzIGZvciAzcmQgYW5kIDR0aCBxdWFkcmFudHMnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQmFzZWxpbmUoMjgwLCAnbGVmdCcpLCB7dmFsdWU6ICdib3R0b20nfSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGxhYmVsQmFzZWxpbmUoMjYwLCAnbGVmdCcpLCB7dmFsdWU6ICdib3R0b20nfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnaXMgYm90dG9tIGZvciBib3R0b20gb3JpZW50cyBmb3IgM3JkIGFuZCA0dGggcXVhZHJhbnRzJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDI4MCwgJ2xlZnQnKSwge3ZhbHVlOiAnYm90dG9tJ30pO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChsYWJlbEJhc2VsaW5lKDI2MCwgJ2xlZnQnKSwge3ZhbHVlOiAnYm90dG9tJ30pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19