"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../../../src/channel");
var text_1 = require("../../../src/compile/mark/text");
var util_1 = require("../../util");
describe('Mark: Text', function () {
    describe('with stacked x', function () {
        // This is a simplified example for stacked text.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "text",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = text_1.text.encodeEntry(model);
        it('should use stack_end on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked text.
        // In reality this will be used as stacked's overlayed marker
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
            "mark": "text",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = text_1.text.encodeEntry(model);
        it('should use stack_end on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative and format', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "field": "foo", "type": "quantitative", "format": "d" }
            }
        };
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text_1.text.encodeEntry(model);
        it('should use number template', function () {
            chai_1.assert.deepEqual(props.text, { signal: "format(datum[\"foo\"], \"d\")" });
        });
    });
    describe('with binned quantitative', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "bin": true, "field": "foo", "type": "quantitative", "format": "d" }
            }
        };
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text_1.text.encodeEntry(model);
        it('should output correct bin range', function () {
            chai_1.assert.deepEqual(props.text, { signal: "datum[\"bin_maxbins_10_foo\"] === null || isNaN(datum[\"bin_maxbins_10_foo\"]) ? \"null\" : format(datum[\"bin_maxbins_10_foo\"], \"d\") + \" - \" + format(datum[\"bin_maxbins_10_foo_end\"], \"d\")" });
        });
    });
    describe('with temporal', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "field": "foo", "type": "temporal" }
            }
        };
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text_1.text.encodeEntry(model);
        it('should use date template', function () {
            chai_1.assert.deepEqual(props.text, { signal: "timeFormat(datum[\"foo\"], '%b %d, %Y')" });
        });
    });
    describe('with x, y, text (ordinal)', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "x": { "field": "Acceleration", "type": "ordinal" },
                "y": { "field": "Displacement", "type": "quantitative" },
                "text": { "field": "Origin", "type": "ordinal" },
            },
            "data": { "url": "data/cars.json" }
        };
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text_1.text.encodeEntry(model);
        it('should scale on x', function () {
            chai_1.assert.deepEqual(props.x, { scale: channel_1.X, field: 'Acceleration' });
        });
        it('should scale on y', function () {
            chai_1.assert.deepEqual(props.y, { scale: channel_1.Y, field: 'Displacement' });
        });
        it('should be centered', function () {
            chai_1.assert.deepEqual(props.align, { value: "center" });
        });
        it('should map text without template', function () {
            chai_1.assert.deepEqual(props.text, { signal: "''+datum[\"Origin\"]" });
        });
    });
    describe('with row, column, text, and color', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "row": { "field": "Origin", "type": "ordinal" },
                "column": { "field": "Cylinders", "type": "ordinal" },
                "text": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" },
                "color": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" },
                "size": { "field": "Acceleration", "type": "quantitative", "aggregate": "mean" }
            },
            "data": { "url": "data/cars.json" }
        };
        var model = util_1.parseModelWithScale(spec);
        model.parseLayoutSize();
        var childModel = model.children[0];
        var props = text_1.text.encodeEntry(childModel);
        it('should fit the view on x', function () {
            chai_1.assert.deepEqual(props.x, { field: { group: 'width' }, offset: -5 });
        });
        it('should center on y', function () {
            chai_1.assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'child_height'
            });
        });
        it('should map text to expression', function () {
            chai_1.assert.deepEqual(props.text, {
                signal: "format(datum[\"mean_Acceleration\"], \"\")"
            });
        });
        it('should map color to fill', function () {
            chai_1.assert.deepEqual(props.fill, {
                scale: 'color',
                field: 'mean_Acceleration'
            });
        });
        it('should map size to fontSize', function () {
            chai_1.assert.deepEqual(props.fontSize, {
                scale: 'size',
                field: 'mean_Acceleration'
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGV4dC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixnREFBMEM7QUFDMUMsdURBQW9EO0FBR3BELG1DQUFxRjtBQUVyRixRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMvRCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7YUFDM0M7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7WUFDbkMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFHLE1BQU0sRUFBQztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsaURBQWlEO1FBQ2pELDZEQUE2RDtRQUM3RCxJQUFNLEtBQUssR0FBRywyQ0FBb0Ms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QyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUM7UUFDbkUsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0JBQW9CLEVBQUU7WUFDdkIsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEVBQUUsR0FBRztnQkFDVCxNQUFNLEVBQUUsY0FBYzthQUN2QixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQkFBK0IsRUFBRTtZQUNsQyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQzNCLE1BQU0sRUFBRSw0Q0FBd0M7YUFDakQsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDN0IsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFO2dCQUMzQixLQUFLLEVBQUUsT0FBTztnQkFDZCxLQUFLLEVBQUUsbUJBQW1CO2FBQzNCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLDZCQUE2QixFQUFFO1lBQ2hDLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRTtnQkFDL0IsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsS0FBSyxFQUFFLG1CQUFtQjthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtYLCBZfSBmcm9tICcuLi8uLi8uLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQge3RleHR9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGV4dCc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge0ZhY2V0ZWRDb21wb3NpdGVVbml0U3BlYywgVW5pdFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7cGFyc2VNb2RlbFdpdGhTY2FsZSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ01hcms6IFRleHQnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB4JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgZXhhbXBsZSBmb3Igc3RhY2tlZCB0ZXh0LlxuICAgIC8vIEluIHJlYWxpdHkgdGhpcyB3aWxsIGJlIHVzZWQgYXMgc3RhY2tlZCdzIG92ZXJsYXllZCBtYXJrZXJcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInN0YWNrXCI6ICBcInplcm9cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzdGFja19lbmQgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7c2NhbGU6IFgsIGZpZWxkOiAnc3VtX2FfZW5kJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBzdGFja2VkIHknLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBleGFtcGxlIGZvciBzdGFja2VkIHRleHQuXG4gICAgLy8gSW4gcmVhbGl0eSB0aGlzIHdpbGwgYmUgdXNlZCBhcyBzdGFja2VkJ3Mgb3ZlcmxheWVkIG1hcmtlclxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInlcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJjb25maWdcIjoge1wic3RhY2tcIjogIFwiemVyb1wifVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSB0ZXh0LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHN0YWNrX2VuZCBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICdzdW1fYV9lbmQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHF1YW50aXRhdGl2ZSBhbmQgZm9ybWF0JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogVW5pdFNwZWMgPSB7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiZm9vXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZvcm1hdFwiOiBcImRcIn1cbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBudW1iZXIgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMudGV4dCwge3NpZ25hbDogYGZvcm1hdChkYXR1bVtcImZvb1wiXSwgXCJkXCIpYH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBiaW5uZWQgcXVhbnRpdGF0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogVW5pdFNwZWMgPSB7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6IFwiZm9vXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZvcm1hdFwiOiBcImRcIn1cbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIG91dHB1dCBjb3JyZWN0IGJpbiByYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50ZXh0LCB7c2lnbmFsOiBgZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29cIl0gPT09IG51bGwgfHwgaXNOYU4oZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29cIl0pID8gXCJudWxsXCIgOiBmb3JtYXQoZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29cIl0sIFwiZFwiKSArIFwiIC0gXCIgKyBmb3JtYXQoZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29fZW5kXCJdLCBcImRcIilgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHRlbXBvcmFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogVW5pdFNwZWMgPSB7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiZm9vXCIsIFwidHlwZVwiOiBcInRlbXBvcmFsXCJ9XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShzcGVjKTtcbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2UgZGF0ZSB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50ZXh0LCB7c2lnbmFsOiBgdGltZUZvcm1hdChkYXR1bVtcImZvb1wiXSwgJyViICVkLCAlWScpYH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB4LCB5LCB0ZXh0IChvcmRpbmFsKScsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IFVuaXRTcGVjID0ge1xuICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkFjY2VsZXJhdGlvblwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJEaXNwbGFjZW1lbnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiBYLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHknLCBmdW5jdGlvbigpe1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAnRGlzcGxhY2VtZW50J30pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBiZSBjZW50ZXJlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5hbGlnbiwge3ZhbHVlOiBcImNlbnRlclwifSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1hcCB0ZXh0IHdpdGhvdXQgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMudGV4dCwge3NpZ25hbDogYCcnK2RhdHVtW1wiT3JpZ2luXCJdYH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCByb3csIGNvbHVtbiwgdGV4dCwgYW5kIGNvbG9yJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogRmFjZXRlZENvbXBvc2l0ZVVuaXRTcGVjID0ge1xuICAgICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwicm93XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJjb2x1bW5cIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9XG4gICAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbFdpdGhTY2FsZShzcGVjKTtcbiAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgIGNvbnN0IGNoaWxkTW9kZWwgPSBtb2RlbC5jaGlsZHJlblswXSBhcyBVbml0TW9kZWw7XG4gICAgY29uc3QgcHJvcHMgPSB0ZXh0LmVuY29kZUVudHJ5KGNoaWxkTW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBmaXQgdGhlIHZpZXcgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ30sIG9mZnNldDogLTV9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2VudGVyIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge1xuICAgICAgICBtdWx0OiAwLjUsXG4gICAgICAgIHNpZ25hbDogJ2NoaWxkX2hlaWdodCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtYXAgdGV4dCB0byBleHByZXNzaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnRleHQsIHtcbiAgICAgICAgc2lnbmFsOiBgZm9ybWF0KGRhdHVtW1wibWVhbl9BY2NlbGVyYXRpb25cIl0sIFwiXCIpYFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1hcCBjb2xvciB0byBmaWxsJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmZpbGwsIHtcbiAgICAgICAgc2NhbGU6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWFwIHNpemUgdG8gZm9udFNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuZm9udFNpemUsIHtcbiAgICAgICAgc2NhbGU6ICdzaXplJyxcbiAgICAgICAgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbidcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19