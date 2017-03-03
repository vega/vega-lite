/* tslint:disable quotemark */
"use strict";
var log = require("../../src/log");
var chai_1 = require("chai");
var config_1 = require("../../src/compile/config");
var mark_1 = require("../../src/mark");
var util_1 = require("../util");
describe('Config', function () {
    describe('orient', function () {
        it('should return correct default for QxQ', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    "mark": "bar",
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "quantitative", "field": "bar" }
                    },
                });
                chai_1.assert.equal(model.config().mark.orient, 'vertical');
                chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientContinuous(mark_1.BAR));
            });
        });
        it('should return correct default for empty plot', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    "mark": "bar",
                    encoding: {}
                });
                chai_1.assert.equal(model.config().mark.orient, undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(mark_1.BAR));
            });
        });
        it('should return correct orient for bar with both axes discrete', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "ordinal", "field": "foo" },
                        "y": { "type": "ordinal", "field": "bar" }
                    },
                });
                chai_1.assert.equal(model.config().mark.orient, undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(mark_1.BAR));
            });
        });
        it('should return correct orient for vertical bar', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'horizontal');
        });
        it('should return correct orient for vertical bar with raw temporal dimension', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar with raw temporal dimension', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'horizontal');
        });
        it('should return correct orient for vertical tick', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
        it('should return correct orient for vertical tick with bin', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar", "bin": true }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
        it('should return correct orient for vertical tick of continuous timeUnit dotplot', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "temporal", "field": "foo", "timeUnit": "yearmonthdate" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
        it('should return correct orient for horizontal tick', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
        it('should return correct orient for horizontal rule', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                },
            });
            chai_1.assert.equal(config_1.orient(model.mark(), model.encoding(), {}), 'horizontal');
        });
        it('should return correct orient for horizontal rules without x2 ', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "field": "b", "type": "quantitative" },
                    "y": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(config_1.orient(model.mark(), model.encoding(), {}), 'horizontal');
        });
        it('should return correct orient for vertical rules without y2 ', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "field": "b", "type": "quantitative" },
                    "x": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(config_1.orient(model.mark(), model.encoding(), {}), 'vertical');
        });
        it('should return correct orient for vertical rule with range', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "ordinal", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar" },
                    "y2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(config_1.orient(model.mark(), model.encoding(), {}), 'vertical');
        });
        it('should return correct orient for horizontal rule with range', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "type": "ordinal", "field": "foo" },
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(config_1.orient(model.mark(), model.encoding(), {}), 'horizontal');
        });
        it('should return correct orient for horizontal rule with range and no ordinal', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule with range and no ordinal', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "type": "quantitative", "field": "bar" },
                    "y2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(model.config().mark.orient, 'vertical');
        });
    });
});
//# sourceMappingURL=config.test.js.map