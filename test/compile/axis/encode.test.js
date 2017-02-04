/* tslint:disable:quotemark */
"use strict";
var chai_1 = require("chai");
var util_1 = require("../../util");
var encode = require("../../../src/compile/axis/encode");
describe('compile/axis', function () {
    describe('encode.domain()', function () {
        it('axisColor should change axis\'s color', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { axisColor: '#fff' } }
                }
            });
            var axes = encode.domain(model, 'x', {});
            chai_1.assert.equal(axes.stroke.value, '#fff');
        });
        it('axisWidth should change axis\'s width', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { axisWidth: 2 } }
                }
            });
            var axes = encode.domain(model, 'x', {});
            chai_1.assert.equal(axes.strokeWidth.value, 2);
        });
    });
    describe('encode.grid()', function () {
        it('gridColor should change grid\'s color', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { gridColor: '#fff' } }
                }
            });
            var axes = encode.grid(model, 'x', {});
            chai_1.assert.equal(axes.stroke.value, '#fff');
        });
        it('gridOpacity should change grid\'s opacity', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { grid: true, gridOpacity: 0.6 } }
                }
            });
            var axes = encode.grid(model, 'x', {});
            chai_1.assert.equal(axes.strokeOpacity.value, 0.6);
        });
        it('gridWidth should change grid\'s width', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { grid: true, gridWidth: 2 } }
                }
            });
            var axes = encode.grid(model, 'x', {});
            chai_1.assert.equal(axes.strokeWidth.value, 2);
        });
        it('gridDash should change grid\'s dash offset', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { grid: true, gridDash: [2] } }
                }
            });
            var axes = encode.grid(model, 'x', {});
            chai_1.assert.deepEqual(axes.strokeDashOffset.value, [2]);
        });
    });
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
        it('should rotate labels if labelAngle is defined', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { labelAngle: -45 } }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            chai_1.assert.equal(labels.angle.value, -45);
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
            chai_1.assert.equal(labels.baseline.value, 'middle');
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
            chai_1.assert.equal(labels.baseline.value, 'middle');
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
        it('tickLabelColor should change with axis\'s label\' color', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: 'quantitative', axis: { tickLabelColor: "blue" } }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            chai_1.assert.equal(labels.fill.value, "blue");
        });
        it('tickLabelFont should change with axis\'s label\'s font', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: 'quantitative', axis: { tickLabelFont: "Helvetica Neue" } }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            chai_1.assert.equal(labels.font.value, "Helvetica Neue");
        });
        it('tickLabelFontSize should change with axis\'s label\'s font size', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: 'quantitative', axis: { tickLabelFontSize: 20 } }
                }
            });
            var labels = encode.labels(model, 'x', {}, {});
            chai_1.assert.equal(labels.fontSize.value, 20);
        });
    });
    describe('encode.ticks()', function () {
        it('tickColor should change axis\'s ticks\'s color', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { tickColor: '#123' } }
                }
            });
            var axes = encode.ticks(model, 'x', {});
            chai_1.assert.equal(axes.stroke.value, '#123');
        });
        it('tickWidth should change axis\'s ticks\'s color', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { tickWidth: 13 } }
                }
            });
            var axes = encode.ticks(model, 'x', {});
            chai_1.assert.equal(axes.strokeWidth.value, 13);
        });
    });
    describe('encode.title()', function () {
        it('titleColor should change axis\'s title\'s color', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { titleColor: '#abc' } }
                }
            });
            var axes = encode.title(model, 'x', {});
            chai_1.assert.equal(axes.fill.value, '#abc');
        });
        it('titleFont should change axis\'s title\'s font', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { titleFont: 'anything' } }
                }
            });
            var axes = encode.title(model, 'x', {});
            chai_1.assert.equal(axes.font.value, 'anything');
        });
        it('titleFontSize should change axis\'s title\'s font size', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { titleFontSize: 56 } }
                }
            });
            var axes = encode.title(model, 'x', {});
            chai_1.assert.equal(axes.fontSize.value, 56);
        });
        it('titleFontWeight should change axis\'s title\'s font weight', function () {
            var model = util_1.parseModel({
                mark: "point",
                encoding: {
                    x: { field: "a", type: "quantitative", axis: { titleFontWeight: 'bold' } }
                }
            });
            var axes = encode.title(model, 'x', {});
            chai_1.assert.equal(axes.fontWeight.value, 'bold');
        });
    });
});
//# sourceMappingURL=encode.test.js.map