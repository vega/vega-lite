"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var encode = tslib_1.__importStar(require("../../../src/compile/axis/encode"));
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
//# sourceMappingURL=encode.test.js.map