/* tslint:disable:quotemark */
import { assert } from 'chai';
import * as encode from '../../../src/compile/axis/encode';
import { labelAlign, labelBaseline } from '../../../src/compile/axis/encode';
import { parseUnitModelWithScale } from '../../util';
describe('compile/axis/encode', function () {
    describe('encode.labels()', function () {
        it('should not rotate label for temporal field by default', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            assert.isUndefined(labels.angle);
        });
        it('should do not rotate label for temporal field if labelAngle is specified in axis config', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                },
                config: { axisX: { labelAngle: 90 } }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            assert.isUndefined(labels.angle);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value)";
            assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = parseUnitModelWithScale({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "yearquartermonth" }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            assert.equal(labels.text.signal, expected);
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
        });
    });
    describe('labelBaseline', function () {
        it('is middle for perpendiculars horizontal orients', function () {
            assert.deepEqual(labelBaseline(90, 'top'), { value: 'middle' });
            assert.deepEqual(labelBaseline(270, 'bottom'), { value: 'middle' });
        });
        it('is top for bottom orients for 1st and 4th quadrants', function () {
            assert.deepEqual(labelBaseline(45, 'bottom'), { value: 'top' });
            assert.deepEqual(labelBaseline(180, 'top'), { value: 'top' });
        });
        it('is bottom for bottom orients for 2nd and 3rd quadrants', function () {
            assert.deepEqual(labelBaseline(100, 'bottom'), { value: 'middle' });
            assert.deepEqual(labelBaseline(260, 'bottom'), { value: 'middle' });
        });
        it('is middle for 0 and 180 horizontal orients', function () {
            assert.deepEqual(labelBaseline(0, 'left'), { value: 'middle' });
            assert.deepEqual(labelBaseline(180, 'right'), { value: 'middle' });
        });
        it('is top for bottom orients for 1st and 2nd quadrants', function () {
            assert.deepEqual(labelBaseline(80, 'left'), { value: 'top' });
            assert.deepEqual(labelBaseline(100, 'left'), { value: 'top' });
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            assert.deepEqual(labelBaseline(280, 'left'), { value: 'bottom' });
            assert.deepEqual(labelBaseline(260, 'left'), { value: 'bottom' });
        });
        it('is bottom for bottom orients for 3rd and 4th quadrants', function () {
            assert.deepEqual(labelBaseline(280, 'left'), { value: 'bottom' });
            assert.deepEqual(labelBaseline(260, 'left'), { value: 'bottom' });
        });
    });
});
//# sourceMappingURL=encode.test.js.map