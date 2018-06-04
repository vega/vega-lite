"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var log = tslib_1.__importStar(require("../../../src/log"));
var chai_1 = require("chai");
var mark_1 = require("../../../src/mark");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/mark/init', function () {
    describe('defaultOpacity', function () {
        it('should return 0.7 by default for unaggregated point, tick, circle, and square', function () {
            for (var _i = 0, _a = [mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                    mark: mark,
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "quantitative", "field": "bar" }
                    },
                });
                chai_1.assert.equal(model.markDef.opacity, 0.7);
            }
        });
        it('should return undefined by default for aggregated point, tick, circle, and square', function () {
            for (var _i = 0, _a = [mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                    mark: mark,
                    "encoding": {
                        "y": { "aggregate": "mean", "type": "quantitative", "field": "foo" },
                        "x": { "type": "nominal", "field": "bar" }
                    },
                });
                chai_1.assert.equal(model.markDef.opacity, undefined);
            }
        });
        it('should use specified opacity', function () {
            for (var _i = 0, _a = [mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                    mark: { type: mark, opacity: 0.9 },
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "quantitative", "field": "bar" }
                    },
                });
                chai_1.assert.equal(model.markDef.opacity, 0.9);
            }
        });
        it('should return undefined by default for other marks', function () {
            var otherMarks = util_1.without(mark_1.PRIMITIVE_MARKS, [mark_1.POINT, mark_1.TICK, mark_1.CIRCLE, mark_1.SQUARE]);
            for (var _i = 0, otherMarks_1 = otherMarks; _i < otherMarks_1.length; _i++) {
                var mark = otherMarks_1[_i];
                var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                    mark: mark,
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "nominal", "field": "bar" }
                    },
                });
                chai_1.assert.equal(model.markDef.opacity, undefined);
            }
        });
    });
    describe('orient', function () {
        it('should return correct default for QxQ', log.wrap(function (localLogger) {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "quantitative", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
            chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientContinuous(mark_1.BAR));
        }));
        it('should return correct default for empty plot', log.wrap(function (localLogger) {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                encoding: {}
            });
            chai_1.assert.equal(model.markDef.orient, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(mark_1.BAR));
        }));
        it('should return correct orient for bar with both axes discrete', log.wrap(function (localLogger) {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "ordinal", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, undefined);
            chai_1.assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(mark_1.BAR));
        }));
        it('should return correct orient for vertical bar', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical bar with raw temporal dimension', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar with raw temporal dimension', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "temporal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical tick', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick with bin', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar", "bin": true }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick of continuous timeUnit dotplot', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "temporal", "field": "foo", "timeUnit": "yearmonthdate" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal tick', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal rule', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return undefined for line segment rule', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                    "x": { "value": 0 },
                    "y2": { "value": 100 },
                    "x2": { "value": 100 },
                },
            });
            chai_1.assert.equal(model.markDef.orient, undefined);
        });
        it('should return undefined for line segment rule with only x and y without x2, y2', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                    "x": { "value": 0 }
                },
            });
            chai_1.assert.equal(model.markDef.orient, undefined);
        });
        it('should return correct orient for horizontal rules without x2 ', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "field": "b", "type": "quantitative" },
                    "y": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rules without y2 ', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "field": "b", "type": "quantitative" },
                    "x": { "field": "a", "type": "ordinal" },
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical rule with range', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
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
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
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
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            chai_1.assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule with range and no ordinal', function () {
            var model = util_2.parseUnitModelWithScaleAndLayoutSize({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvaW5pdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw0REFBd0M7QUFFeEMsNkJBQTRCO0FBQzVCLDBDQUFvRjtBQUNwRiwwQ0FBMEM7QUFDMUMsbUNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtJQUM1QixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLCtFQUErRSxFQUFFO1lBQ2xGLEtBQW1CLFVBQTZCLEVBQTdCLE1BQUMsWUFBSyxFQUFFLFdBQUksRUFBRSxhQUFNLEVBQUUsYUFBTSxDQUFDLEVBQTdCLGNBQTZCLEVBQTdCLElBQTZCLEVBQUU7Z0JBQTdDLElBQU0sSUFBSSxTQUFBO2dCQUNiLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO29CQUNqRCxJQUFJLE1BQUE7b0JBQ0osVUFBVSxFQUFFO3dCQUNWLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQzt3QkFDN0MsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO3FCQUM5QztpQkFDRixDQUFDLENBQUM7Z0JBQ0gsYUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxHQUFHLENBQUMsQ0FBQzthQUMxQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLG1GQUFtRixFQUFFO1lBQ3RGLEtBQW1CLFVBQTZCLEVBQTdCLE1BQUMsWUFBSyxFQUFFLFdBQUksRUFBRSxhQUFNLEVBQUUsYUFBTSxDQUFDLEVBQTdCLGNBQTZCLEVBQTdCLElBQTZCLEVBQUU7Z0JBQTdDLElBQU0sSUFBSSxTQUFBO2dCQUNiLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxD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QUFFLE1BQU07Z0JBQ2QsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQztvQkFDN0MsSUFBSSxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO2lCQUMvQzthQUNGLENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEVBQTBFLEVBQUU7WUFDN0UsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRSxNQUFNO2dCQUNkLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7b0JBQzdDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQztpQkFDL0M7YUFDRixDQUFDLENBQUM7WUFDSCxhQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7QkFSLCBDSVJDTEUsIFBPSU5ULCBQUklNSVRJVkVfTUFSS1MsIFNRVUFSRSwgVElDS30gZnJvbSAnLi4vLi4vLi4vc3JjL21hcmsnO1xuaW1wb3J0IHt3aXRob3V0fSBmcm9tICcuLi8uLi8uLi9zcmMvdXRpbCc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL21hcmsvaW5pdCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnZGVmYXVsdE9wYWNpdHknLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gMC43IGJ5IGRlZmF1bHQgZm9yIHVuYWdncmVnYXRlZCBwb2ludCwgdGljaywgY2lyY2xlLCBhbmQgc3F1YXJlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBtYXJrIG9mIFtQT0lOVCwgVElDSywgQ0lSQ0xFLCBTUVVBUkVdKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3BhY2l0eSwgMC43KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBieSBkZWZhdWx0IGZvciBhZ2dyZWdhdGVkIHBvaW50LCB0aWNrLCBjaXJjbGUsIGFuZCBzcXVhcmUnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hcmsgb2YgW1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRV0pIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwibWVhblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwibm9taW5hbFwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9wYWNpdHksIHVuZGVmaW5lZCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzcGVjaWZpZWQgb3BhY2l0eScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgbWFyayBvZiBbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgbWFyazoge3R5cGU6IG1hcmssIG9wYWNpdHk6IDAuOX0sXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcGFjaXR5LCAwLjkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGJ5IGRlZmF1bHQgZm9yIG90aGVyIG1hcmtzJywgKCkgPT4ge1xuICAgICAgY29uc3Qgb3RoZXJNYXJrcyA9IHdpdGhvdXQoUFJJTUlUSVZFX01BUktTLCBbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSk7XG4gICAgICBmb3IgKGNvbnN0IG1hcmsgb2Ygb3RoZXJNYXJrcykge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcIm5vbWluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcGFjaXR5LCB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnb3JpZW50JywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkZWZhdWx0IGZvciBReFEnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS51bmNsZWFyT3JpZW50Q29udGludW91cyhCQVIpKTtcbiAgICB9KSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IGRlZmF1bHQgZm9yIGVtcHR5IHBsb3QnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIGVuY29kaW5nOiB7fVxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsIHVuZGVmaW5lZCk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLnVuY2xlYXJPcmllbnREaXNjcmV0ZU9yRW1wdHkoQkFSKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIGJhciB3aXRoIGJvdGggYXhlcyBkaXNjcmV0ZScsIGxvZy53cmFwKChsb2NhbExvZ2dlcikgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS51bmNsZWFyT3JpZW50RGlzY3JldGVPckVtcHR5KEJBUikpO1xuICAgIH0pKTtcblxuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIGJhcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIGhvcml6b250YWwgYmFyJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ2hvcml6b250YWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciB2ZXJ0aWNhbCBiYXIgd2l0aCByYXcgdGVtcG9yYWwgZGltZW5zaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIGhvcml6b250YWwgYmFyIHdpdGggcmF3IHRlbXBvcmFsIGRpbWVuc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAnaG9yaXpvbnRhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIHRpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ3ZlcnRpY2FsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgdmVydGljYWwgdGljayB3aXRoIGJpbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhclwiLCBcImJpblwiOiB0cnVlfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIHRpY2sgb2YgY29udGludW91cyB0aW1lVW5pdCBkb3RwbG90JywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImZpZWxkXCI6IFwiZm9vXCIsIFwidGltZVVuaXRcIjogXCJ5ZWFybW9udGhkYXRlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ3ZlcnRpY2FsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgaG9yaXpvbnRhbCB0aWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICdob3Jpem9udGFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgdmVydGljYWwgcnVsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ2YWx1ZVwiOiAwfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBob3Jpem9udGFsIHJ1bGUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInZhbHVlXCI6IDB9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICdob3Jpem9udGFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgZm9yIGxpbmUgc2VnbWVudCBydWxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ2YWx1ZVwiOiAwfSxcbiAgICAgICAgICBcInhcIjoge1widmFsdWVcIjogMH0sXG4gICAgICAgICAgXCJ5MlwiOiB7XCJ2YWx1ZVwiOiAxMDB9LFxuICAgICAgICAgIFwieDJcIjoge1widmFsdWVcIjogMTAwfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCB1bmRlZmluZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciBsaW5lIHNlZ21lbnQgcnVsZSB3aXRoIG9ubHkgeCBhbmQgeSB3aXRob3V0IHgyLCB5MicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widmFsdWVcIjogMH0sXG4gICAgICAgICAgXCJ4XCI6IHtcInZhbHVlXCI6IDB9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBob3Jpem9udGFsIHJ1bGVzIHdpdGhvdXQgeDIgJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICB9LFxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ2hvcml6b250YWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciB2ZXJ0aWNhbCBydWxlcyB3aXRob3V0IHkyICcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIHJ1bGUgd2l0aCByYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn0sXG4gICAgICAgICAgXCJ5MlwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXpcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBob3Jpem9udGFsIHJ1bGUgd2l0aCByYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn0sXG4gICAgICAgICAgXCJ4MlwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXpcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAnaG9yaXpvbnRhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIGhvcml6b250YWwgcnVsZSB3aXRoIHJhbmdlIGFuZCBubyBvcmRpbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhclwifSxcbiAgICAgICAgICBcIngyXCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhelwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICdob3Jpem9udGFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgdmVydGljYWwgcnVsZSB3aXRoIHJhbmdlIGFuZCBubyBvcmRpbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhclwifSxcbiAgICAgICAgICBcInkyXCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImJhelwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5cbiJdfQ==