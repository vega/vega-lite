"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var line_1 = require("../../../src/compile/mark/line");
var log = tslib_1.__importStar(require("../../../src/log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbGluZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIsZ0RBQWlEO0FBQ2pELHVEQUFvRDtBQUNwRCw0REFBd0M7QUFDeEMsbUNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxZQUFZLEVBQUU7SUFFckIsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7WUFDbkMsTUFBTSxFQUFFLE1BQU07WUFDZCxVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2dCQUN6QyxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7YUFDaEQ7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUM1QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxXQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDeEQsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILFFB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Q0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsUUFBUSxFQUFFO1FBQ2pCLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFLEVBQUMsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLEVBQUM7WUFDdkQsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLGtCQUFrQixFQUFDO1NBQ3BDLENBQUMsQ0FBQztRQUVILElBQU0sS0FBSyxHQUFHLFdBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFdEMsRUFBRSxDQUFDLHlCQUF5QixFQUFFO1lBQzVCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLEdBQUc7Z0JBQ1QsTUFBTSxFQUFFLE9BQU87YUFDaEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsbUJBQW1CLEVBQUU7WUFDdEIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLFdBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0NPTE9SLCBYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge2xpbmV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbGluZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vLi4vc3JjL2xvZyc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdNYXJrOiBMaW5lJywgZnVuY3Rpb24oKSB7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBsaW5lLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzY2FsZSBmb3IgeCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6IFgsIGZpZWxkOiAneWVhcid9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSBzY2FsZSBmb3IgeScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAneWllbGQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHgsIHksIGNvbG9yJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gbGluZS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgc2NhbGUgZm9yIGNvbG9yJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5zdHJva2UsIHtzY2FsZTogQ09MT1IsIGZpZWxkOiAnQWNjZWxlcmF0aW9uJ30pO1xuICAgIH0pO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCd3aXRoIHgsIHksIHNpemUnLCBmdW5jdGlvbiAoKSB7XG4gICAgaXQoJ3Nob3VsZCBoYXZlIHNjYWxlIGZvciBzaXplJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5ZWFyXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifSxcbiAgICAgICAgICBcInNpemVcIjoge1wiZmllbGRcIjogXCJ2YXJpZXR5XCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBjb25zdCBwcm9wcyA9IGxpbmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnN0cm9rZVdpZHRoLCB7c2NhbGU6ICdzaXplJywgZmllbGQ6ICd2YXJpZXR5J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBkcm9wIGFnZ3JlZ2F0ZSBzaXplIGZpZWxkJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9LFxuICAgICAgICAgIFwic2l6ZVwiOiB7XCJmaWVsZFwiOiBcIkFjY2VsZXJhdGlvblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBsaW5lLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgICAgLy8gSWYgc2l6ZSBmaWVsZCBpcyBkcm9wcGVkLCB0aGVuIHN0cm9rZVdpZHRoIG9ubHkgaGF2ZSB2YWx1ZVxuICAgICAgYXNzZXJ0LmlzTm90T2socHJvcHMuc3Ryb2tlV2lkdGggJiYgcHJvcHMuc3Ryb2tlV2lkdGhbJ3NjYWxlJ10pO1xuICAgICAgYXNzZXJ0LmVxdWFsKGxvY2FsTG9nZ2VyLndhcm5zWzBdLCBsb2cubWVzc2FnZS5MSU5FX1dJVEhfVkFSWUlOR19TSVpFKTtcbiAgICB9KSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHN0YWNrZWQgeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWllbGRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwic3VtXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJjb25maWdcIjoge1wic3RhY2tcIjogIFwiemVyb1wifVxuICAgIH0pO1xuICAgIGNvbnN0IHByb3BzID0gbGluZS5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSB5X2VuZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAnc3VtX3lpZWxkX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB4JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcIm1hcmtcIjogXCJsaW5lXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ5aWVsZFwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJzdW1cIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgIH0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiAgXCJ6ZXJvXCJ9XG4gICAgfSk7XG4gICAgY29uc3QgcHJvcHMgPSBsaW5lLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHhfZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICdzdW1feWllbGRfZW5kJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB4JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwibGluZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XCJ4XCI6IHtcImZpZWxkXCI6IFwieWVhclwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9fSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IGxpbmUuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjZW50ZXJlZCBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtcbiAgICAgICAgbXVsdDogMC41LFxuICAgICAgICBzaWduYWw6ICdoZWlnaHQnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6IFgsIGZpZWxkOiAneWVhcid9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcImxpbmVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1wieVwiOiB7XCJmaWVsZFwiOiBcInllYXJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifX0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSBsaW5lLmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgYmUgY2VudGVyZWQgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnd2lkdGgnXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgc2NhbGUgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAneWVhcid9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==