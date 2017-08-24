"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../../src/log");
var chai_1 = require("chai");
var mark_1 = require("../../../src/mark");
var util_1 = require("../../util");
describe('compile/mark/normalize', function () {
    describe('orient', function () {
        it('should return correct default for QxQ', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                    "mark": "bar",
                    encoding: {}
                });
                chai_1.assert.equal(model.markDef.orient, undefined);
                chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(mark_1.BAR));
            });
        });
        it('should return correct orient for bar with both axes discrete', function () {
            log.runLocalLogger(function (localLogger) {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical bar with raw temporal dimension', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar with raw temporal dimension', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical tick', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick with bin', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar", "bin": true }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick of continuous timeUnit dotplot', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "temporal", "field": "foo", "timeUnit": "yearmonthdate" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal tick', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "tick",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal rule', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for horizontal rules without x2 ', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "field": "b", "type": "quantitative" },
                    "y": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rules without y2 ', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "field": "b", "type": "quantitative" },
                    "x": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical rule with range', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule with range and no ordinal', function () {
            var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvaW5pdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLHNDQUF3QztBQUV4Qyw2QkFBNEI7QUFDNUIsMENBQXNDO0FBQ3RDLG1DQUFvRTtBQUVwRSxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFFakMsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsdUNBQXVDLEVBQUU7WUFDMUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO29CQUNyRCxNQUFNLEVBQUUsS0FBSztvQkFDYixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO3dCQUM3QyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7cUJBQzlDO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQyxhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxVQUFHLENBQUMsQ0FBQyxDQUFDO1lBQy9FLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsR0FBRyxDQUFDLGNBQWMsQ0FBQyxVQUFDLFdBQVc7Z0JBQzdCLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO29CQUNyRCxNQUFNLEVBQUUsS0FBSztvQkFDYixRQUFRLEVBQUUsRUFBRTtp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