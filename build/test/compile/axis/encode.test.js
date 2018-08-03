"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var encode = tslib_1.__importStar(require("../../../src/compile/axis/encode"));
var util_1 = require("../../util");
describe('compile/axis/encode', function () {
    describe('encode.labels()', function () {
        it('should not rotate label for temporal field by default', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            chai_1.assert.isUndefined(labels.angle);
        });
        it('should do not rotate label for temporal field if labelAngle is specified in axis config', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                },
                config: { axisX: { labelAngle: 90 } }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            chai_1.assert.isUndefined(labels.angle);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'quarter' }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = util_1.parseUnitModelWithScale({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'yearquartermonth' }
                }
            });
            var labels = encode.labels(model, 'x', {}, 'bottom');
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            chai_1.assert.equal(labels.text.signal, expected);
        });
    });
});
//# sourceMappingURL=encode.test.js.map