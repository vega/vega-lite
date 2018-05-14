/* tslint:disable quotemark */
import { assert } from 'chai';
import { X, Y } from '../../../src/channel';
import { text } from '../../../src/compile/mark/text';
import { parseModelWithScale, parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Text', function () {
    describe('with stacked x', function () {
        // This is a simplified example for stacked text.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "text",
            "encoding": {
                "x": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = text.encodeEntry(model);
        it('should use stack_end on x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'sum_a_end' });
        });
    });
    describe('with stacked y', function () {
        // This is a simplified example for stacked text.
        // In reality this will be used as stacked's overlayed marker
        var model = parseUnitModelWithScaleAndLayoutSize({
            "mark": "text",
            "encoding": {
                "y": { "aggregate": "sum", "field": "a", "type": "quantitative" },
                "color": { "field": "b", "type": "ordinal" }
            },
            "data": { "url": "data/barley.json" },
            "config": { "stack": "zero" }
        });
        var props = text.encodeEntry(model);
        it('should use stack_end on y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'sum_a_end' });
        });
    });
    describe('with quantitative and format', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "field": "foo", "type": "quantitative", "format": "d" }
            }
        };
        var model = parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text.encodeEntry(model);
        it('should use number template', function () {
            assert.deepEqual(props.text, { signal: "format(datum[\"foo\"], \"d\")" });
        });
    });
    describe('with binned quantitative', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "bin": true, "field": "foo", "type": "quantitative", "format": "d" }
            }
        };
        var model = parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text.encodeEntry(model);
        it('should output correct bin range', function () {
            assert.deepEqual(props.text, { signal: "datum[\"bin_maxbins_10_foo\"] === null || isNaN(datum[\"bin_maxbins_10_foo\"]) ? \"null\" : format(datum[\"bin_maxbins_10_foo\"], \"d\") + \" - \" + format(datum[\"bin_maxbins_10_foo_end\"], \"d\")" });
        });
    });
    describe('with temporal', function () {
        var spec = {
            "mark": "text",
            "encoding": {
                "text": { "field": "foo", "type": "temporal" }
            }
        };
        var model = parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text.encodeEntry(model);
        it('should use date template', function () {
            assert.deepEqual(props.text, { signal: "timeFormat(datum[\"foo\"], '')" });
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
        var model = parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text.encodeEntry(model);
        it('should scale on x', function () {
            assert.deepEqual(props.x, { scale: X, field: 'Acceleration' });
        });
        it('should scale on y', function () {
            assert.deepEqual(props.y, { scale: Y, field: 'Displacement' });
        });
        it('should be centered', function () {
            assert.deepEqual(props.align, { value: "center" });
        });
        it('should map text without template', function () {
            assert.deepEqual(props.text, { signal: "''+datum[\"Origin\"]" });
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
        var model = parseUnitModelWithScaleAndLayoutSize(spec);
        var props = text.encodeEntry(model);
        it('should map size to fontSize', function () {
            assert.deepEqual(props.fontSize, { value: 5 });
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
        var model = parseModelWithScale(spec);
        model.parseLayoutSize();
        var childModel = model.children[0];
        var props = text.encodeEntry(childModel);
        it('should fit the view on x', function () {
            assert.deepEqual(props.x, { field: { group: 'width' }, offset: -5 });
        });
        it('should center on y', function () {
            assert.deepEqual(props.y, {
                mult: 0.5,
                signal: 'child_height'
            });
        });
        it('should map text to expression', function () {
            assert.deepEqual(props.text, {
                signal: "format(datum[\"mean_Acceleration\"], \"\")"
            });
        });
        it('should map color to fill', function () {
            assert.deepEqual(props.fill, {
                scale: 'color',
                field: 'mean_Acceleration'
            });
        });
        it('should map size to fontSize', function () {
            assert.deepEqual(props.fontSize, {
                scale: 'size',
                field: 'mean_Acceleration'
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvdGV4dC50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUM5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBRTVCLE9BQU8sRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLE1BQU0sc0JBQXNCLENBQUM7QUFDMUMsT0FBTyxFQUFDLElBQUksRUFBQyxNQUFNLGdDQUFnQyxDQUFDO0FBR3BELE9BQU8sRUFBQyxtQkFBbUIsRUFBRSxvQ0FBb0MsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUdyRixRQUFRLENBQUMsWUFBWSxFQUFFO0lBQ3JCLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtRQUN6QixpREFBaUQ7UUFDakQsNkRBQTZEO1FBQzdELElBQU0sS0FBSyxHQUFHLG9DQUFvQyxDQUFDO1lBQ2pELE1BQU0sRUFBRSxNQUFNO1lBQ2QsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsY0FBYyxFQUFDO2dCQUMvRCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7YUFDM0M7WUFDRCxNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsa0JBQWtCLEVBQUM7WUFDbkMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFHLE1BQU0sRUFBQztTQUM3QixDQUFDLENBQUM7UUFFSCxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXRDLEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM5QixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxXQUFX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O1FBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFO1lBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRTtnQkFDM0IsTUFBTSxFQUFFLDRDQUF3QzthQUNqRCxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtZQUM3QixNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUU7Z0JBQzNCLEtBQUssRUFBRSxPQUFPO2dCQUNkLEtBQUssRUFBRSxtQkFBbUI7YUFDM0IsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsNkJBQTZCLEVBQUU7WUFDaEMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO2dCQUMvQixLQUFLLEVBQUUsTUFBTTtnQkFDYixLQUFLLEVBQUUsbUJBQW1CO2FBQzNCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge1gsIFl9IGZyb20gJy4uLy4uLy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCB7dGV4dH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay90ZXh0JztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS91bml0JztcbmltcG9ydCB7Tm9ybWFsaXplZFVuaXRTcGVjLCBUb3BMZXZlbFNwZWN9IGZyb20gJy4uLy4uLy4uL3NyYy9zcGVjJztcbmltcG9ydCB7cGFyc2VNb2RlbFdpdGhTY2FsZSwgcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplfSBmcm9tICcuLi8uLi91dGlsJztcblxuXG5kZXNjcmliZSgnTWFyazogVGV4dCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnd2l0aCBzdGFja2VkIHgnLCBmdW5jdGlvbigpIHtcbiAgICAvLyBUaGlzIGlzIGEgc2ltcGxpZmllZCBleGFtcGxlIGZvciBzdGFja2VkIHRleHQuXG4gICAgLy8gSW4gcmVhbGl0eSB0aGlzIHdpbGwgYmUgdXNlZCBhcyBzdGFja2VkJ3Mgb3ZlcmxheWVkIG1hcmtlclxuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiYWdncmVnYXRlXCI6IFwic3VtXCIsIFwiZmllbGRcIjogXCJhXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcImJcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifVxuICAgICAgfSxcbiAgICAgIFwiZGF0YVwiOiB7XCJ1cmxcIjogXCJkYXRhL2JhcmxleS5qc29uXCJ9LFxuICAgICAgXCJjb25maWdcIjoge1wic3RhY2tcIjogIFwiemVyb1wifVxuICAgIH0pO1xuXG4gICAgY29uc3QgcHJvcHMgPSB0ZXh0LmVuY29kZUVudHJ5KG1vZGVsKTtcblxuICAgIGl0KCdzaG91bGQgdXNlIHN0YWNrX2VuZCBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICdzdW1fYV9lbmQnfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHN0YWNrZWQgeScsIGZ1bmN0aW9uKCkge1xuICAgIC8vIFRoaXMgaXMgYSBzaW1wbGlmaWVkIGV4YW1wbGUgZm9yIHN0YWNrZWQgdGV4dC5cbiAgICAvLyBJbiByZWFsaXR5IHRoaXMgd2lsbCBiZSB1c2VkIGFzIHN0YWNrZWQncyBvdmVybGF5ZWQgbWFya2VyXG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieVwiOiB7XCJhZ2dyZWdhdGVcIjogXCJzdW1cIiwgXCJmaWVsZFwiOiBcImFcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiYlwiLCBcInR5cGVcIjogXCJvcmRpbmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvYmFybGV5Lmpzb25cIn0sXG4gICAgICBcImNvbmZpZ1wiOiB7XCJzdGFja1wiOiAgXCJ6ZXJvXCJ9XG4gICAgfSk7XG5cbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCB1c2Ugc3RhY2tfZW5kIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge3NjYWxlOiBZLCBmaWVsZDogJ3N1bV9hX2VuZCd9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3dpdGggcXVhbnRpdGF0aXZlIGFuZCBmb3JtYXQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBzcGVjOiBOb3JtYWxpemVkVW5pdFNwZWMgPSB7XG4gICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiZm9vXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImZvcm1hdFwiOiBcImRcIn1cbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBudW1iZXIgdGVtcGxhdGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMudGV4dCwge3NpZ25hbDogYGZvcm1hdChkYXR1bVtcImZvb1wiXSwgXCJkXCIpYH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCBiaW5uZWQgcXVhbnRpdGF0aXZlJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgXCJtYXJrXCI6IFwidGV4dFwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwidGV4dFwiOiB7XCJiaW5cIjogdHJ1ZSwgXCJmaWVsZFwiOiBcImZvb1wiLCBcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJmb3JtYXRcIjogXCJkXCJ9XG4gICAgICB9XG4gICAgfTtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShzcGVjKTtcbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBvdXRwdXQgY29ycmVjdCBiaW4gcmFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMudGV4dCwge3NpZ25hbDogYGRhdHVtW1wiYmluX21heGJpbnNfMTBfZm9vXCJdID09PSBudWxsIHx8IGlzTmFOKGRhdHVtW1wiYmluX21heGJpbnNfMTBfZm9vXCJdKSA/IFwibnVsbFwiIDogZm9ybWF0KGRhdHVtW1wiYmluX21heGJpbnNfMTBfZm9vXCJdLCBcImRcIikgKyBcIiAtIFwiICsgZm9ybWF0KGRhdHVtW1wiYmluX21heGJpbnNfMTBfZm9vX2VuZFwiXSwgXCJkXCIpYH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCB0ZW1wb3JhbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJmb29cIiwgXCJ0eXBlXCI6IFwidGVtcG9yYWxcIn1cbiAgICAgIH1cbiAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHNwZWMpO1xuICAgIGNvbnN0IHByb3BzID0gdGV4dC5lbmNvZGVFbnRyeShtb2RlbCk7XG5cbiAgICBpdCgnc2hvdWxkIHVzZSBkYXRlIHRlbXBsYXRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnRleHQsIHtzaWduYWw6IGB0aW1lRm9ybWF0KGRhdHVtW1wiZm9vXCJdLCAnJylgfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHgsIHksIHRleHQgKG9yZGluYWwpJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IHNwZWM6IE5vcm1hbGl6ZWRVbml0U3BlYyA9IHtcbiAgICAgIFwibWFya1wiOiBcInRleHRcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiRGlzcGxhY2VtZW50XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9XG4gICAgfTtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShzcGVjKTtcbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB4JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLngsIHtzY2FsZTogWCwgZmllbGQ6ICdBY2NlbGVyYXRpb24nfSk7XG4gICAgfSk7XG4gICAgaXQoJ3Nob3VsZCBzY2FsZSBvbiB5JywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnksIHtzY2FsZTogWSwgZmllbGQ6ICdEaXNwbGFjZW1lbnQnfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGJlIGNlbnRlcmVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmFsaWduLCB7dmFsdWU6IFwiY2VudGVyXCJ9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWFwIHRleHQgd2l0aG91dCB0ZW1wbGF0ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy50ZXh0LCB7c2lnbmFsOiBgJycrZGF0dW1bXCJPcmlnaW5cIl1gfSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCd3aXRoIHNpemUgaW4gbWFyayBkZWYnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3Qgc3BlYzogTm9ybWFsaXplZFVuaXRTcGVjID0ge1xuICAgICAgXCJtYXJrXCI6IHt0eXBlOiBcInRleHRcIiwgc2l6ZTogNX0sXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ0ZXh0XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICB9LFxuICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9XG4gICAgfTtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZShzcGVjKTtcbiAgICBjb25zdCBwcm9wcyA9IHRleHQuZW5jb2RlRW50cnkobW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBtYXAgc2l6ZSB0byBmb250U2l6ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuZm9udFNpemUsIHt2YWx1ZTogNX0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnd2l0aCByb3csIGNvbHVtbiwgdGV4dCwgY29sb3IsIGFuZCBzaXplJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgc3BlYzogVG9wTGV2ZWxTcGVjID0ge1xuICAgICAgICBcIm1hcmtcIjogXCJ0ZXh0XCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwicm93XCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIn0sXG4gICAgICAgICAgXCJjb2x1bW5cIjoge1wiZmllbGRcIjogXCJDeWxpbmRlcnNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwifSxcbiAgICAgICAgICBcInRleHRcIjoge1wiZmllbGRcIjogXCJBY2NlbGVyYXRpb25cIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwiYWdncmVnYXRlXCI6IFwibWVhblwifSxcbiAgICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn0sXG4gICAgICAgICAgXCJzaXplXCI6IHtcImZpZWxkXCI6IFwiQWNjZWxlcmF0aW9uXCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcImFnZ3JlZ2F0ZVwiOiBcIm1lYW5cIn1cbiAgICAgICAgfSxcbiAgICAgICAgXCJkYXRhXCI6IHtcInVybFwiOiBcImRhdGEvY2Fycy5qc29uXCJ9XG4gICAgICB9O1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VNb2RlbFdpdGhTY2FsZShzcGVjKTtcbiAgICBtb2RlbC5wYXJzZUxheW91dFNpemUoKTtcblxuICAgIGNvbnN0IGNoaWxkTW9kZWwgPSBtb2RlbC5jaGlsZHJlblswXSBhcyBVbml0TW9kZWw7XG4gICAgY29uc3QgcHJvcHMgPSB0ZXh0LmVuY29kZUVudHJ5KGNoaWxkTW9kZWwpO1xuXG4gICAgaXQoJ3Nob3VsZCBmaXQgdGhlIHZpZXcgb24geCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwcm9wcy54LCB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ30sIG9mZnNldDogLTV9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2VudGVyIG9uIHknLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMueSwge1xuICAgICAgICBtdWx0OiAwLjUsXG4gICAgICAgIHNpZ25hbDogJ2NoaWxkX2hlaWdodCdcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBtYXAgdGV4dCB0byBleHByZXNzaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLnRleHQsIHtcbiAgICAgICAgc2lnbmFsOiBgZm9ybWF0KGRhdHVtW1wibWVhbl9BY2NlbGVyYXRpb25cIl0sIFwiXCIpYFxuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIG1hcCBjb2xvciB0byBmaWxsJywgZnVuY3Rpb24oKSB7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHByb3BzLmZpbGwsIHtcbiAgICAgICAgc2NhbGU6ICdjb2xvcicsXG4gICAgICAgIGZpZWxkOiAnbWVhbl9BY2NlbGVyYXRpb24nXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgbWFwIHNpemUgdG8gZm9udFNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocHJvcHMuZm9udFNpemUsIHtcbiAgICAgICAgc2NhbGU6ICdzaXplJyxcbiAgICAgICAgZmllbGQ6ICdtZWFuX0FjY2VsZXJhdGlvbidcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19