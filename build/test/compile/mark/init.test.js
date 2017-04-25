/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../../src/log");
var chai_1 = require("chai");
var mark_1 = require("../../../src/mark");
var util_1 = require("../../util");
describe('compile/mark/init', function () {
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
                chai_1.assert.equal(model.markDef.orient, 'vertical');
                chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientContinuous(mark_1.BAR));
            });
        });
        it('should return correct default for empty plot', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModel({
                    "mark": "bar",
                    encoding: {}
                });
                chai_1.assert.equal(model.markDef.orient, undefined);
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
                chai_1.assert.equal(model.markDef.orient, undefined);
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
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical bar with raw temporal dimension', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar with raw temporal dimension', function () {
            var model = util_1.parseUnitModel({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical tick', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick with bin', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar", "bin": true }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick of continuous timeUnit dotplot', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "temporal", "field": "foo", "timeUnit": "yearmonthdate" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal tick', function () {
            var model = util_1.parseUnitModel({
                "mark": "tick",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal rule', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for horizontal rules without x2 ', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "field": "b", "type": "quantitative" },
                    "y": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rules without y2 ', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "field": "b", "type": "quantitative" },
                    "x": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
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
            chai_1.assert.equal(model.markDef.orient, 'vertical');
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
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for horizontal rule with range and no ordinal', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule with range and no ordinal', function () {
            var model = util_1.parseUnitModel({
                "mark": "rule",
                "encoding": {
                    "y": { "type": "quantitative", "field": "bar" },
                    "y2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvaW5pdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLHNDQUF3QztBQUV4Qyw2QkFBNEI7QUFDNUIsMENBQXNDO0FBQ3RDLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFDNUIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7b0JBQzNCLE1BQU0sRUFBRSxLQUFLO29CQUNiLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7d0JBQzdDLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQztxQkFDOUM7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7Z0JBQy9DLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLFVBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0UsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw4Q0FBOEMsRUFBRTtZQUNqRCxHQUFHLENBQUMsY0FBYyxDQUFDLFVBQUMsV0FBVztnQkFDN0IsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztvQkFDM0IsTUFBTSxFQUFFLEtBQUs7b0JBQ2IsUUFBUSxFQUFFLEVBQUU7aUJB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