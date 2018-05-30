"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var line_1 = require("../../../src/compile/mark/line");
var log = require("../../../src/log");
var util_1 = require("../../util");
describe('Mark: Line', function () {
    describe('with x, y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "x": { "field": "year", "type": "ordinal" },
                "y": { "field": "yield", "type": "quantitative" }
            }
        });
        var props = line_1.line.encodeEntry(model);
        it('should have scale for x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'year' });
        });
        it('should have scale for y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'yield' });
        });
    });
    describe('with x, y, color', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "x": { "field": "year", "type": "ordinal" },
                "y": { "field": "yield", "type": "quantitative" },
                "color": { "field": "Acceleration", "type": "quantitative" }
            }
        });
        var props = line_1.line.encodeEntry(model);
        it('should have scale for color', function () {
            chai_1.assert.deepEqual(props.stroke, { scale: channel_1.COLOR, field: 'Acceleration' });
        });
    });
    describe('with x, y, size', function () {
        it('should have scale for size', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/barley.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "year", "type": "ordinal" },
                    "y": { "field": "yield", "type": "quantitative", "aggregate": "mean" },
                    "size": { "field": "variety", "type": "nominal" }
                }
            });
            var props = line_1.line.encodeEntry(model);
            chai_1.assert.deepEqual(props.strokeWidth, { scale: 'size', field: 'variety' });
        });
        it('should drop aggregate size field', log.wrap(function (localLogger) {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                "data": { "url": "data/barley.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "year", "type": "ordinal" },
                    "y": { "field": "yield", "type": "quantitative", "aggregate": "mean" },
                    "size": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" }
                }
            });
            var props = line_1.line.encodeEntry(model);
            // If size field is dropped, then strokeWidth only have value
            chai_1.assert.isNotOk(props.strokeWidth && props.strokeWidth['scale']);
            chai_1.assert.equal(localLogger.warns[0], log.message.LINE_WITH_VARYING_SIZE);
        }));
    });
    describe('with stacked y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "x": { "field": "year", "type": "ordinal" },
                "y": { "field": "yield", "type": "quantitative", "aggregate": "sum" },
                "color": { "field": "a", "type": "nominal" }
            },
            "config": { "stack": "zero" }
        });
        var props = line_1.line.encodeEntry(model);
        it('should use y_end', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'sum_yield_end' });
        });
    });
    describe('with stacked x', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "data": { "url": "data/barley.json" },
            "mark": "line",
            "encoding": {
                "y": { "field": "year", "type": "ordinal" },
                "x": { "field": "yield", "type": "quantitative", "aggregate": "sum" },
                "color": { "field": "a", "type": "nominal" }
            },
            "config": { "stack": "zero" }
        });
        var props = line_1.line.encodeEntry(model);
        it('should use x_end', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'sum_yield_end' });
        });
    });
    describe('with x', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "line",
            "encoding": { "x": { "field": "year", "type": "ordinal" } },
            "data": { "url": "data/barley.json" }
        });
        var props = line_1.line.encodeEntry(model);
        it('should be centered on y', function () {
            chai_1.assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'height'
            });
        });
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'year' });
        });
    });
    describe('with y', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "line",
            "encoding": { "y": { "field": "year", "type": "ordinal" } },
            "data": { "url": "data/barley.json" }
        });
        var props = line_1.line.encodeEntry(model);
        it('should be centered on x', function () {
            chai_1.assert.deepEqual(props.x, {
                mult: 0.5,
                signal: 'width'
            });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'year' });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbGluZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1QixnREFBaUQ7QUFDakQsdURBQW9EO0FBQ3BELHNDQUF3QztBQUN4QyxtQ0FBZ0U7QUFFaEUsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUVyQixRQUFRLENBQUMsV0FBVyxFQUFFO1FBQ3BCLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxrQkFBa0IsRUFBQztZQUNuQyxNQUFNLEVBQUUsTUFBTTtZQUNkLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7Z0JBQ3pDLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLGNBQWMsRUFBQzthQUNoRDtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQUMsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztRQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFB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QUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxRQUFRLEVBQUU7UUFDakIsSUFBTSxLQUFLLEdBQUcsMkNBQW9DLENBQUM7WUFDakQsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUUsRUFBQyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUMsRUFBQztZQUN2RCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7U0FDcEMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsV0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMseUJBQXlCLEVBQUU7WUFDNUIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEVBQUUsR0FBRztnQkFDVCxNQUFNLEVBQUUsT0FBTzthQUNoQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtZQUN0QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Q09MT1IsIFgsIFl9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7bGluZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9saW5lJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcms6IExpbmUnLCBmdW5jdGlvbigpIHtcblxuICBkZXNjcmliZSgnd2l0aCB4LCB5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn1cbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGxpbmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICd5ZWFyJ30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICd5aWVsZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgY29sb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBsaW5lLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzY2FsZSBmb3IgY29sb3InLCBmdW5jdGlvbiAoKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZSwge3NjYWxlOiBDT0xPUiwgZmllbGQ6ICdBY2NlbGVyYXRpb24nfSk7XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgc2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIHNpemUnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJmaWVsZFwiOiBcInZhcmlldHlcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IHByb3BzID0gbGluZS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuc3Ryb2tlV2lkdGgsIHtzY2FsZTogJ3NpemUnLCBmaWVsZDogJ3ZhcmlldHknfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGRyb3AgYWdncmVnYXRlIHNpemUgZmllbGQnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGxpbmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgICAvLyBJZiBzaXplIGZpZWxkIGlzIGRyb3BwZWQsIHRoZW4gc3Ryb2tlV2lkdGggb25seSBoYXZlIHZhbHVlXG4gICAgICBhc3NlcnQuaXNOb3RPayhwcm9wcy5zdHJva2VXaWR0aCAmJiBwcm9wcy5zdHJva2VXaWR0aFsnc2NhbGUnXSk7XG4gICAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLkxJTkVfV0lUSF9WQVJZSU5HX1NJWkUpO1xuICAgIH0pKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgIH0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiAgXCJ6ZXJvXCJ9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBsaW5lLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHlfZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICdzdW1feWllbGRfZW5kJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBzdGFja2VkIHgnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInlpZWxkXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcInN1bVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgfSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInN0YWNrXCI6ICBcInplcm9cIn1cbiAgICB9KTtcbiAgICBjb25zdCBwcm9wcyA9IGxpbmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgeF9lbmQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiBYLCBmaWVsZDogJ3N1bV95aWVsZF9lbmQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHgnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcInhcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn19LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gbGluZS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNlbnRlcmVkIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge1xuICAgICAgICBtdWx0OiAwLjUsXG4gICAgICAgIHNpZ25hbDogJ2hlaWdodCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICd5ZWFyJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB5JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XCJ5XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9fSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IGxpbmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjZW50ZXJlZCBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICd3aWR0aCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICd5ZWFyJ30pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19