"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable quotemark */
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
            chai_1.assert.deepEqual(props.text, { signal: "timeFormat(datum[\"foo\"], '')" });
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
    describe('with size in mark def', function () {
        var spec = {
            "mark": { type: "text", size: 5 },
            "encoding": {
                "text": { "field": "Origin", "type": "ordinal" },
            },
            "data": { "url": "data/cars.json" }
        };
        var model = util_1.parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text_1.text.encodeEntry(model);
        it('should map size to fontSize', function () {
            chai_1.assert.deepEqual(props.fontSize, { value: 5 });
        });
    });
    describe('with row, column, text, color, and size', function () {
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
            chai_1.assert.deepEqual(props.x, { signal: 'child_width', mult: 0.5 });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGV4dC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsOEJBQThCO0FBQzlCLDZCQUE0QjtBQUU1QixnREFBMEM7QUFDMUMsdURBQW9EO0FBR3BELG1DQUFxRjtBQUdyRixRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMvRCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7YUFDM0M7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7WUFDbkMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFHLE1BQU0sRUFBQztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFNLEtBQUssR0FBRyxXQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsV0FBQyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsaURBQWlEO1FBQ2pELDZEQUE2RDtRQUM3RCxJQUFNLEtBQUssR0FBRywyQ0FBb0Ms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QzdCLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDM0IsS0FBSyxFQUFFLE9BQU87Z0JBQ2QsS0FBSyxFQUFFLG1CQUFtQjthQUMzQixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyw2QkFBNkIsRUFBRTtZQUNoQyxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUU7Z0JBQy9CLEtBQUssRUFBRSxNQUFNO2dCQUNiLEtBQUssRUFBRSxtQkFBbUI7YUFDM0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7WCwgWX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0IHt0ZXh0fSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3RleHQnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtOb3JtYWxpemVkVW5pdFNwZWMsIFRvcExldmVsU3BlY30gZnJvbSAnLi4vLi4vLi4vc3JjL3NwZWMnO1xuaW1wb3J0IHtwYXJzZU1vZGVsV2l0aFNjYWxlLCBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5cbmRlc2NyaWJlKCdNYXJrOiBUZXh0JywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCd3aXRoIHN0YWNrZWQgeCcsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGlmaWVkIGV4YW1wbGUgZm9yIHN0YWNrZWQgdGV4dC5cbiAgICAvLyBJbiByZWFsaXR5IHRoaXMgd2lsbCBiZSB1c2VkIGFzIHN0YWNrZWQncyBvdmVybGF5ZWQgbWFya2VyXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiAgXCJ6ZXJvXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc3RhY2tfZW5kIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiBYLCBmaWVsZDogJ3N1bV9hX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggc3RhY2tlZCB5JywgZnVuY3Rpb24oKSB7XG4gICAgLy8gVGhpcyBpcyBhIHNpbXBsaWZpZWQgZXhhbXBsZSBmb3Igc3RhY2tlZCB0ZXh0LlxuICAgIC8vIEluIHJlYWxpdHkgdGhpcyB3aWxsIGJlIHVzZWQgYXMgc3RhY2tlZCdzIG92ZXJsYXllZCBtYXJrZXJcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ5XCI6IHtcImFnZ3JlZ2F0ZVwiOiBcInN1bVwiLCBcImZpZWxkXCI6IFwiYVwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJiXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn1cbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9iYXJsZXkuanNvblwifSxcbiAgICAgIFwiY29uZmlnXCI6IHtcInN0YWNrXCI6ICBcInplcm9cIn1cbiAgICB9KTtcblxuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBzdGFja19lbmQgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7c2NhbGU6IFksIGZpZWxkOiAnc3VtX2FfZW5kJ30pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBxdWFudGl0YXRpdmUgYW5kIGZvcm1hdCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJmb29cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiZm9ybWF0XCI6IFwiZFwifVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoc3BlYyk7XG4gICAgY29uc3QgcHJvcHMgPSB0ZXh0LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIG51bWJlciB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50ZXh0LCB7c2lnbmFsOiBgZm9ybWF0KGRhdHVtW1wiZm9vXCJdLCBcImRcIilgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIGJpbm5lZCBxdWFudGl0YXRpdmUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMgPSB7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImJpblwiOiB0cnVlLCBcImZpZWxkXCI6IFwiZm9vXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZvcm1hdFwiOiBcImRcIn1cbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIG91dHB1dCBjb3JyZWN0IGJpbiByYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50ZXh0LCB7c2lnbmFsOiBgZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29cIl0gPT09IG51bGwgfHwgaXNOYU4oZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29cIl0pID8gXCJudWxsXCIgOiBmb3JtYXQoZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29cIl0sIFwiZFwiKSArIFwiIC0gXCIgKyBmb3JtYXQoZGF0dW1bXCJiaW5fbWF4Ymluc18xMF9mb29fZW5kXCJdLCBcImRcIilgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHRlbXBvcmFsJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwidGV4dFwiOiB7XCJmaWVsZFwiOiBcImZvb1wiLCBcInR5cGVcIjogXCJ0ZW1wb3JhbFwifVxuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoc3BlYyk7XG4gICAgY29uc3QgcHJvcHMgPSB0ZXh0LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIGRhdGUgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMudGV4dCwge3NpZ25hbDogYHRpbWVGb3JtYXQoZGF0dW1bXCJmb29cIl0sICcnKWB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggeCwgeSwgdGV4dCAob3JkaW5hbCknLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkFjY2VsZXJhdGlvblwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJEaXNwbGFjZW1lbnRcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHgnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueCwge3NjYWxlOiBYLCBmaWVsZDogJ0FjY2VsZXJhdGlvbid9KTtcbiAgICB9KTtcbiAgICBpdCgnc2hvdWxkIHNjYWxlIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiBZLCBmaWVsZDogJ0Rpc3BsYWNlbWVudCd9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgYmUgY2VudGVyZWQnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuYWxpZ24sIHt2YWx1ZTogXCJjZW50ZXJcIn0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtYXAgdGV4dCB3aXRob3V0IHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnRleHQsIHtzaWduYWw6IGAnJytkYXR1bVtcIk9yaWdpblwiXWB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggc2l6ZSBpbiBtYXJrIGRlZicsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMgPSB7XG4gICAgICBcIm1hcmtcIjoge3R5cGU6IFwidGV4dFwiLCBzaXplOiA1fSxcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgIH0sXG4gICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIG1hcCBzaXplIHRvIGZvbnRTaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5mb250U2l6ZSwge3ZhbHVlOiA1fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHJvdywgY29sdW1uLCB0ZXh0LCBjb2xvciwgYW5kIHNpemUnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBUb3BMZXZlbFNwZWMgPSB7XG4gICAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgICAgXCJyb3dcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcImNvbHVtblwiOiB7XCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9LFxuICAgICAgICAgIFwidGV4dFwiOiB7XCJmaWVsZFwiOiBcIkFjY2VsZXJhdGlvblwiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJhZ2dyZWdhdGVcIjogXCJtZWFuXCJ9LFxuICAgICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifSxcbiAgICAgICAgICBcInNpemVcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifVxuICAgICAgICB9LFxuICAgICAgICBcImRhdGFcIjoge1widXJsXCI6IFwiZGF0YS9jYXJzLmpzb25cIn1cbiAgICAgIH07XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZU1vZGVsV2l0aFNjYWxlKHNwZWMpO1xuICAgIG1vZGVsLnBhcnNlTGF5b3V0U2l6ZSgpO1xuXG4gICAgY29uc3QgY2hpbGRNb2RlbCA9IG1vZGVsLmNoaWxkcmVuWzBdIGFzIFVuaXRNb2RlbDtcbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkoY2hpbGRNb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIGZpdCB0aGUgdmlldyBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzaWduYWw6ICdjaGlsZF93aWR0aCcsIG11bHQ6IDAuNX0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjZW50ZXIgb24geScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy55LCB7XG4gICAgICAgIG11bHQ6IDAuNSxcbiAgICAgICAgc2lnbmFsOiAnY2hpbGRfaGVpZ2h0J1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1hcCB0ZXh0IHRvIGV4cHJlc3Npb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMudGV4dCwge1xuICAgICAgICBzaWduYWw6IGBmb3JtYXQoZGF0dW1bXCJtZWFuX0FjY2VsZXJhdGlvblwiXSwgXCJcIilgXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWFwIGNvbG9yIHRvIGZpbGwnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuZmlsbCwge1xuICAgICAgICBzY2FsZTogJ2NvbG9yJyxcbiAgICAgICAgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbidcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtYXAgc2l6ZSB0byBmb250U2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy5mb250U2l6ZSwge1xuICAgICAgICBzY2FsZTogJ3NpemUnLFxuICAgICAgICBmaWVsZDogJ21lYW5fQWNjZWxlcmF0aW9uJ1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=