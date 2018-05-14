/* tslint:disable quotemark */
import * as log from '../../../src/log';
import { assert } from 'chai';
import { BAR, CIRCLE, POINT, PRIMITIVE_MARKS, SQUARE, TICK } from '../../../src/mark';
import { without } from '../../../src/util';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('compile/mark/init', function () {
    describe('defaultOpacity', function () {
        it('should return 0.7 by default for unaggregated point, tick, circle, and square', function () {
            for (var _i = 0, _a = [POINT, TICK, CIRCLE, SQUARE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                var model = parseUnitModelWithScaleAndLayoutSize({
                    mark: mark,
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "quantitative", "field": "bar" }
                    },
                });
                assert.equal(model.markDef.opacity, 0.7);
            }
        });
        it('should return undefined by default for aggregated point, tick, circle, and square', function () {
            for (var _i = 0, _a = [POINT, TICK, CIRCLE, SQUARE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                var model = parseUnitModelWithScaleAndLayoutSize({
                    mark: mark,
                    "encoding": {
                        "y": { "aggregate": "mean", "type": "quantitative", "field": "foo" },
                        "x": { "type": "nominal", "field": "bar" }
                    },
                });
                assert.equal(model.markDef.opacity, undefined);
            }
        });
        it('should use specified opacity', function () {
            for (var _i = 0, _a = [POINT, TICK, CIRCLE, SQUARE]; _i < _a.length; _i++) {
                var mark = _a[_i];
                var model = parseUnitModelWithScaleAndLayoutSize({
                    mark: { type: mark, opacity: 0.9 },
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "quantitative", "field": "bar" }
                    },
                });
                assert.equal(model.markDef.opacity, 0.9);
            }
        });
        it('should return undefined by default for other marks', function () {
            var otherMarks = without(PRIMITIVE_MARKS, [POINT, TICK, CIRCLE, SQUARE]);
            for (var _i = 0, otherMarks_1 = otherMarks; _i < otherMarks_1.length; _i++) {
                var mark = otherMarks_1[_i];
                var model = parseUnitModelWithScaleAndLayoutSize({
                    mark: mark,
                    "encoding": {
                        "y": { "type": "quantitative", "field": "foo" },
                        "x": { "type": "nominal", "field": "bar" }
                    },
                });
                assert.equal(model.markDef.opacity, undefined);
            }
        });
    });
    describe('orient', function () {
        it('should return correct default for QxQ', log.wrap(function (localLogger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "quantitative", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
            assert.equal(localLogger.warns[0], log.message.unclearOrientContinuous(BAR));
        }));
        it('should return correct default for empty plot', log.wrap(function (localLogger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                encoding: {}
            });
            assert.equal(model.markDef.orient, undefined);
            assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(BAR));
        }));
        it('should return correct orient for bar with both axes discrete', log.wrap(function (localLogger) {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "ordinal", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, undefined);
            assert.equal(localLogger.warns[0], log.message.unclearOrientDiscreteOrEmpty(BAR));
        }));
        it('should return correct orient for vertical bar', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical bar with raw temporal dimension', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "temporal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal bar with raw temporal dimension', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "bar",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "temporal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical tick', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick with bin', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "quantitative", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar", "bin": true }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical tick of continuous timeUnit dotplot', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "x": { "type": "temporal", "field": "foo", "timeUnit": "yearmonthdate" },
                    "y": { "type": "ordinal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal tick', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "tick",
                "encoding": {
                    "y": { "type": "quantitative", "field": "foo" },
                    "x": { "type": "ordinal", "field": "bar" }
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "value": 0 },
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal rule', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return undefined for line segment rule', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                    "x": { "value": 0 },
                    "y2": { "value": 100 },
                    "x2": { "value": 100 },
                },
            });
            assert.equal(model.markDef.orient, undefined);
        });
        it('should return undefined for line segment rule with only x and y without x2, y2', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "value": 0 },
                    "x": { "value": 0 }
                },
            });
            assert.equal(model.markDef.orient, undefined);
        });
        it('should return correct orient for horizontal rules without x2 ', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "field": "b", "type": "quantitative" },
                    "y": { "field": "a", "type": "ordinal" },
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rules without y2 ', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "field": "b", "type": "quantitative" },
                    "x": { "field": "a", "type": "ordinal" },
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for vertical rule with range', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "ordinal", "field": "foo" },
                    "y": { "type": "quantitative", "field": "bar" },
                    "y2": { "type": "quantitative", "field": "baz" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
        it('should return correct orient for horizontal rule with range', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "type": "ordinal", "field": "foo" },
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for horizontal rule with range and no ordinal', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "x": { "type": "quantitative", "field": "bar" },
                    "x2": { "type": "quantitative", "field": "baz" }
                },
            });
            assert.equal(model.markDef.orient, 'horizontal');
        });
        it('should return correct orient for vertical rule with range and no ordinal', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "rule",
                "encoding": {
                    "y": { "type": "quantitative", "field": "bar" },
                    "y2": { "type": "quantitative", "field": "baz" }
                },
            });
            assert.equal(model.markDef.orient, 'vertical');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvaW5pdC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEtBQUssR0FBRyxNQUFNLGtCQUFrQixDQUFDO0FBRXhDLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLGVBQWUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDcEYsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzFDLE9BQU8sRUFBQyxvQ0FBb0MsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVoRSxRQUFRLENBQUMsbUJBQW1CLEVBQUU7SUFDNUIsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQywrRUFBK0UsRUFBRTtZQUNsRixLQUFtQixVQUE2QixFQUE3QixNQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUE3QixjQUE2QixFQUE3QixJQUE2QjtnQkFBM0MsSUFBTSxJQUFJLFNBQUE7Z0JBQ2IsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7b0JBQ2pELElBQUksTUFBQTtvQkFDSixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO3dCQUM3QyxHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7cUJBQzlDO2lCQUNGLENBQUMsQ0FBQztnQkFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQzFDO1FBQ0gsQ0FBQyxD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Q0FBQztZQUNILE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNEVBQTRFLEVBQUU7WUFDL0UsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRSxNQUFNO2dCQUNkLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7b0JBQzdDLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBQztpQkFDL0M7YUFDRixDQUFDLENBQUM7WUFDSCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDBFQUEwRSxFQUFFO1lBQzdFLElBQU0sS0FBSyxHQUFHLG9DQUFvQyxDQUFDO2dCQUNqRCxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFDO29CQUM3QyxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUM7aUJBQy9DO2FBQ0YsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uLy4uL3NyYy9sb2cnO1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0JBUiwgQ0lSQ0xFLCBQT0lOVCwgUFJJTUlUSVZFX01BUktTLCBTUVVBUkUsIFRJQ0t9IGZyb20gJy4uLy4uLy4uL3NyYy9tYXJrJztcbmltcG9ydCB7d2l0aG91dH0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9tYXJrL2luaXQnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2RlZmF1bHRPcGFjaXR5JywgKCkgPT4ge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIDAuNyBieSBkZWZhdWx0IGZvciB1bmFnZ3JlZ2F0ZWQgcG9pbnQsIHRpY2ssIGNpcmNsZSwgYW5kIHNxdWFyZScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgbWFyayBvZiBbUE9JTlQsIFRJQ0ssIENJUkNMRSwgU1FVQVJFXSkge1xuICAgICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgICAgbWFyayxcbiAgICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9wYWNpdHksIDAuNyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiB1bmRlZmluZWQgYnkgZGVmYXVsdCBmb3IgYWdncmVnYXRlZCBwb2ludCwgdGljaywgY2lyY2xlLCBhbmQgc3F1YXJlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBtYXJrIG9mIFtQT0lOVCwgVElDSywgQ0lSQ0xFLCBTUVVBUkVdKSB7XG4gICAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgICBtYXJrLFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcIm5vbWluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICAgIH0sXG4gICAgICAgIH0pO1xuICAgICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcGFjaXR5LCB1bmRlZmluZWQpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc3BlY2lmaWVkIG9wYWNpdHknLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IG1hcmsgb2YgW1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRV0pIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIG1hcms6IHt0eXBlOiBtYXJrLCBvcGFjaXR5OiAwLjl9LFxuICAgICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3BhY2l0eSwgMC45KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBieSBkZWZhdWx0IGZvciBvdGhlciBtYXJrcycsICgpID0+IHtcbiAgICAgIGNvbnN0IG90aGVyTWFya3MgPSB3aXRob3V0KFBSSU1JVElWRV9NQVJLUywgW1BPSU5ULCBUSUNLLCBDSVJDTEUsIFNRVUFSRV0pO1xuICAgICAgZm9yIChjb25zdCBtYXJrIG9mIG90aGVyTWFya3MpIHtcbiAgICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICAgIG1hcmssXG4gICAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJub21pbmFsXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3BhY2l0eSwgdW5kZWZpbmVkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ29yaWVudCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3QgZGVmYXVsdCBmb3IgUXhRJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudENvbnRpbnVvdXMoQkFSKSk7XG4gICAgfSkpO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBkZWZhdWx0IGZvciBlbXB0eSBwbG90JywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcImJhclwiLFxuICAgICAgICBlbmNvZGluZzoge31cbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCB1bmRlZmluZWQpO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS51bmNsZWFyT3JpZW50RGlzY3JldGVPckVtcHR5KEJBUikpO1xuICAgIH0pKTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBiYXIgd2l0aCBib3RoIGF4ZXMgZGlzY3JldGUnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwib3JkaW5hbFwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgdW5kZWZpbmVkKTtcbiAgICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UudW5jbGVhck9yaWVudERpc2NyZXRlT3JFbXB0eShCQVIpKTtcbiAgICB9KSk7XG5cblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciB2ZXJ0aWNhbCBiYXInLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBob3Jpem9udGFsIGJhcicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICdob3Jpem9udGFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgdmVydGljYWwgYmFyIHdpdGggcmF3IHRlbXBvcmFsIGRpbWVuc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJiYXJcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInRlbXBvcmFsXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBob3Jpem9udGFsIGJhciB3aXRoIHJhdyB0ZW1wb3JhbCBkaW1lbnNpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiYmFyXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcInR5cGVcIjogXCJ0ZW1wb3JhbFwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ2hvcml6b250YWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciB2ZXJ0aWNhbCB0aWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInRpY2tcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIHRpY2sgd2l0aCBiaW4nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwidGlja1wiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiZm9vXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIiwgXCJiaW5cIjogdHJ1ZX1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciB2ZXJ0aWNhbCB0aWNrIG9mIGNvbnRpbnVvdXMgdGltZVVuaXQgZG90cGxvdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwidGVtcG9yYWxcIiwgXCJmaWVsZFwiOiBcImZvb1wiLCBcInRpbWVVbml0XCI6IFwieWVhcm1vbnRoZGF0ZVwifSxcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImJhclwifVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICd2ZXJ0aWNhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIGhvcml6b250YWwgdGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJ0aWNrXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJmb29cIn0sXG4gICAgICAgICAgXCJ4XCI6IHtcInR5cGVcIjogXCJvcmRpbmFsXCIsIFwiZmllbGRcIjogXCJiYXJcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAnaG9yaXpvbnRhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIHJ1bGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1widmFsdWVcIjogMH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ3ZlcnRpY2FsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgaG9yaXpvbnRhbCBydWxlJywgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ2YWx1ZVwiOiAwfSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAnaG9yaXpvbnRhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciBsaW5lIHNlZ21lbnQgcnVsZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widmFsdWVcIjogMH0sXG4gICAgICAgICAgXCJ4XCI6IHtcInZhbHVlXCI6IDB9LFxuICAgICAgICAgIFwieTJcIjoge1widmFsdWVcIjogMTAwfSxcbiAgICAgICAgICBcIngyXCI6IHtcInZhbHVlXCI6IDEwMH0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgdW5kZWZpbmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgbGluZSBzZWdtZW50IHJ1bGUgd2l0aCBvbmx5IHggYW5kIHkgd2l0aG91dCB4MiwgeTInLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwibWFya1wiOiBcInJ1bGVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ5XCI6IHtcInZhbHVlXCI6IDB9LFxuICAgICAgICAgIFwieFwiOiB7XCJ2YWx1ZVwiOiAwfVxuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsIHVuZGVmaW5lZCk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgaG9yaXpvbnRhbCBydWxlcyB3aXRob3V0IHgyICcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZXF1YWwobW9kZWwubWFya0RlZi5vcmllbnQsICdob3Jpem9udGFsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgdmVydGljYWwgcnVsZXMgd2l0aG91dCB5MiAnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciB2ZXJ0aWNhbCBydWxlIHdpdGggcmFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9LFxuICAgICAgICAgIFwieTJcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiYmF6XCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ3ZlcnRpY2FsJyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IG9yaWVudCBmb3IgaG9yaXpvbnRhbCBydWxlIHdpdGggcmFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJtYXJrXCI6IFwicnVsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInlcIjoge1widHlwZVwiOiBcIm9yZGluYWxcIiwgXCJmaWVsZFwiOiBcImZvb1wifSxcbiAgICAgICAgICBcInhcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiYmFyXCJ9LFxuICAgICAgICAgIFwieDJcIjoge1widHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZpZWxkXCI6IFwiYmF6XCJ9XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICAgIGFzc2VydC5lcXVhbChtb2RlbC5tYXJrRGVmLm9yaWVudCwgJ2hvcml6b250YWwnKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgb3JpZW50IGZvciBob3Jpem9udGFsIHJ1bGUgd2l0aCByYW5nZSBhbmQgbm8gb3JkaW5hbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn0sXG4gICAgICAgICAgXCJ4MlwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXpcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAnaG9yaXpvbnRhbCcpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBvcmllbnQgZm9yIHZlcnRpY2FsIHJ1bGUgd2l0aCByYW5nZSBhbmQgbm8gb3JkaW5hbCcsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJydWxlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieVwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXJcIn0sXG4gICAgICAgICAgXCJ5MlwiOiB7XCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZmllbGRcIjogXCJiYXpcIn1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgICAgYXNzZXJ0LmVxdWFsKG1vZGVsLm1hcmtEZWYub3JpZW50LCAndmVydGljYWwnKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcblxuXG4iXX0=