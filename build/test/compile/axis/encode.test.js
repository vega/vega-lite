/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var encode = require("../../../src/compile/axis/encode");
describe('compile/axis', function () {
    describe('encode.labels()', function () {
        it('should show truncated labels by default', function () {
            var labels = encode.labels(util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: "ordinal" }
                }
            }), 'x', {}, { orient: 'top' });
            chai_1.assert.deepEqual(labels.text.signal, 'truncate(datum.value, 25)');
        });
        it('should rotate label', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "month" }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            chai_1.assert.equal(labels.angle.value, 270);
        });
        it('should also rotate labels if the channel is column', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    column: { field: "a", type: "temporal", timeUnit: "month", axis: { labelAngle: 270 } }
                }
            });
            var labels = encode.labels(model, 'column', {}, {});
            chai_1.assert.equal(labels.angle.value, 270);
        });
        it('should have correct text.signal for quarter timeUnits', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "quarter" }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            var expected = "'Q' + quarter(datum.value)";
            chai_1.assert.equal(labels.text.signal, expected);
        });
        it('should have correct text.signal for yearquartermonth timeUnits', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "temporal", timeUnit: "yearquartermonth" }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            var expected = "'Q' + quarter(datum.value) + ' ' + timeFormat(datum.value, '%b %Y')";
            chai_1.assert.equal(labels.text.signal, expected);
        });
    });
});
//# sourceMappingURL=encode.test.js.map