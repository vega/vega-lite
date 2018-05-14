/* tslint:disable quotemark */
import { assert } from 'chai';
import { nonPosition } from '../../../src/compile/mark/mixins';
import * as selection from '../../../src/compile/selection/selection';
import { expression } from '../../../src/predicate';
import { parseUnitModel } from '../../util';
var predicate = selection.selectionPredicate;
describe('Selection Predicate', function () {
    var model = parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": {
                "field": "Cylinders", "type": "ordinal",
                "condition": {
                    "selection": "one",
                    "value": "grey"
                }
            },
            "opacity": {
                "field": "Origin", "type": "nominal",
                "condition": {
                    "selection": { "or": ["one", { "and": ["two", { "not": "thr-ee" }] }] },
                    "value": 0.5
                }
            }
        }
    });
    model.parseScale();
    model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "single" },
        "two": { "type": "multi", "resolve": "union" },
        "thr-ee": { "type": "interval", "resolve": "intersect" },
        "four": { "type": "single", "empty": "none" }
    });
    it('generates the predicate expression', function () {
        assert.equal(predicate(model, "one"), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');
        assert.equal(predicate(model, "four"), '(vlSingle("four_store", datum))');
        assert.equal(predicate(model, { "not": "one" }), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');
        assert.equal(predicate(model, { "not": { "and": ["one", "two"] } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union"))))');
        assert.equal(predicate(model, { "not": { "and": ["one", "four"] } }), '!(length(data("one_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlSingle("four_store", datum))))');
        assert.equal(predicate(model, { "and": ["one", "two", { "not": "thr-ee" }] }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect"))))');
        assert.equal(predicate(model, { "or": ["one", { "and": ["two", { "not": "thr-ee" }] }] }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) || ' +
            '((vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect")))))');
    });
    it('generates Vega production rules', function () {
        assert.deepEqual(nonPosition('color', model, { vgChannel: 'fill' }), {
            fill: [
                { test: '!(length(data("one_store"))) || (vlSingle("one_store", datum))', value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        assert.deepEqual(nonPosition('opacity', model), {
            opacity: [
                { test: '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
                        '((vlSingle("one_store", datum)) || ' +
                        '((vlMulti("two_store", datum, "union")) && ' +
                        '(!(vlInterval("thr_ee_store", datum, "intersect")))))',
                    value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
    });
    it('generates a selection filter', function () {
        assert.equal(expression(model, { "selection": "one" }), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');
        assert.equal(expression(model, { "selection": { "not": "one" } }), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');
        assert.equal(expression(model, { "selection": { "not": { "and": ["one", "two"] } } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union"))))');
        assert.equal(expression(model, { "selection": { "and": ["one", "two", { "not": "thr-ee" }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect"))))');
        assert.equal(expression(model, { "selection": { "or": ["one", { "and": ["two", { "not": "thr-ee" }] }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) || ' +
            '((vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect")))))');
    });
    it('throws an error for unknown selections', function () {
        assert.throws(function () { return predicate(model, 'helloworld'); }, 'Cannot find a selection named "helloworld"');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUM3RCxPQUFPLEtBQUssU0FBUyxNQUFNLDBDQUEwQyxDQUFDO0FBQ3RFLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUVsRCxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTFDLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztBQUUvQyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsU0FBUztnQkFDdkMsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxLQUFLO29CQUNsQixPQUFPLEVBQUUsTUFBTTtpQkFDaEI7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO2dCQUNwQyxXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxF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LEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBQyxDQUFDLEVBQ2pHLCtGQUErRjtZQUMvRixxQ0FBcUM7WUFDckMsNkNBQTZDO1lBQzdDLHVEQUF1RCxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsd0NBQXdDLEVBQUU7UUFDM0MsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFNLE9BQUEsU0FBUyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUMsRUFBOUIsQ0FBOEIsRUFBRSw0Q0FBNEMsQ0FBQyxDQUFDO0lBQ3BHLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtub25Qb3NpdGlvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbWFyay9taXhpbnMnO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtleHByZXNzaW9ufSBmcm9tICcuLi8uLi8uLi9zcmMvcHJlZGljYXRlJztcbmltcG9ydCB7VmdFbmNvZGVFbnRyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5jb25zdCBwcmVkaWNhdGUgPSBzZWxlY3Rpb24uc2VsZWN0aW9uUHJlZGljYXRlO1xuXG5kZXNjcmliZSgnU2VsZWN0aW9uIFByZWRpY2F0ZScsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJjb2xvclwiOiB7XG4gICAgICAgIFwiZmllbGRcIjogXCJDeWxpbmRlcnNcIiwgXCJ0eXBlXCI6IFwib3JkaW5hbFwiLFxuICAgICAgICBcImNvbmRpdGlvblwiOiB7XG4gICAgICAgICAgXCJzZWxlY3Rpb25cIjogXCJvbmVcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFwiZ3JleVwiXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBcIm9wYWNpdHlcIjoge1xuICAgICAgICBcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIixcbiAgICAgICAgXCJjb25kaXRpb25cIjoge1xuICAgICAgICAgIFwic2VsZWN0aW9uXCI6IHtcIm9yXCI6IFtcIm9uZVwiLCB7XCJhbmRcIjogW1widHdvXCIsIHtcIm5vdFwiOiBcInRoci1lZVwifV19XX0sXG4gICAgICAgICAgXCJ2YWx1ZVwiOiAwLjVcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgbW9kZWwucGFyc2VTY2FsZSgpO1xuXG4gIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsLCB7XG4gICAgXCJvbmVcIjoge1widHlwZVwiOiBcInNpbmdsZVwifSxcbiAgICBcInR3b1wiOiB7XCJ0eXBlXCI6IFwibXVsdGlcIiwgXCJyZXNvbHZlXCI6IFwidW5pb25cIn0sXG4gICAgXCJ0aHItZWVcIjoge1widHlwZVwiOiBcImludGVydmFsXCIsIFwicmVzb2x2ZVwiOiBcImludGVyc2VjdFwifSxcbiAgICBcImZvdXJcIjoge1widHlwZVwiOiBcInNpbmdsZVwiLCBcImVtcHR5XCI6IFwibm9uZVwifVxuICB9KTtcblxuICBpdCgnZ2VuZXJhdGVzIHRoZSBwcmVkaWNhdGUgZXhwcmVzc2lvbicsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIFwib25lXCIpLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpKSB8fCAodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwgXCJmb3VyXCIpLCAnKHZsU2luZ2xlKFwiZm91cl9zdG9yZVwiLCBkYXR1bSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCB7XCJub3RcIjogXCJvbmVcIn0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpKSB8fCAoISh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwge1wibm90XCI6IHtcImFuZFwiOiBbXCJvbmVcIiwgXCJ0d29cIl19fSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoISgodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSAmJiAnICtcbiAgICAgICcodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkpKScpO1xuXG4gICAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCB7XCJub3RcIjoge1wiYW5kXCI6IFtcIm9uZVwiLCBcImZvdXJcIl19fSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJyghKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpICYmICcgK1xuICAgICAgJyh2bFNpbmdsZShcImZvdXJfc3RvcmVcIiwgZGF0dW0pKSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCB7XCJhbmRcIjogW1wib25lXCIsIFwidHdvXCIsIHtcIm5vdFwiOiBcInRoci1lZVwifV19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0aHJfZWVfc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgJiYgJyArXG4gICAgICAnKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpICYmICcgK1xuICAgICAgJyghKHZsSW50ZXJ2YWwoXCJ0aHJfZWVfc3RvcmVcIiwgZGF0dW0sIFwiaW50ZXJzZWN0XCIpKSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCB7XCJvclwiOiBbXCJvbmVcIiwge1wiYW5kXCI6IFtcInR3b1wiLCB7XCJub3RcIjogXCJ0aHItZWVcIn1dfV19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0aHJfZWVfc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgfHwgJyArXG4gICAgICAnKCh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSAmJiAnICtcbiAgICAgICcoISh2bEludGVydmFsKFwidGhyX2VlX3N0b3JlXCIsIGRhdHVtLCBcImludGVyc2VjdFwiKSkpKSknKTtcbiAgfSk7XG5cbiAgaXQoJ2dlbmVyYXRlcyBWZWdhIHByb2R1Y3Rpb24gcnVsZXMnLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRW5jb2RlRW50cnk+KG5vblBvc2l0aW9uKCdjb2xvcicsIG1vZGVsLCB7dmdDaGFubmVsOiAnZmlsbCd9KSwge1xuICAgICAgZmlsbDogW1xuICAgICAgICB7dGVzdDogJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpKSB8fCAodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKScsIHZhbHVlOiBcImdyZXlcIn0sXG4gICAgICAgIHtzY2FsZTogXCJjb2xvclwiLCBmaWVsZDogXCJDeWxpbmRlcnNcIn1cbiAgICAgIF1cbiAgICB9KTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdFbmNvZGVFbnRyeT4obm9uUG9zaXRpb24oJ29wYWNpdHknLCBtb2RlbCksIHtcbiAgICAgIG9wYWNpdHk6IFtcbiAgICAgICAge3Rlc3Q6ICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0aHJfZWVfc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICAgICAgICAgJygodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSB8fCAnICtcbiAgICAgICAgICAgICAgJygodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkgJiYgJyArXG4gICAgICAgICAgICAgICcoISh2bEludGVydmFsKFwidGhyX2VlX3N0b3JlXCIsIGRhdHVtLCBcImludGVyc2VjdFwiKSkpKSknLFxuICAgICAgICAgIHZhbHVlOiAwLjV9LFxuICAgICAgICB7c2NhbGU6IFwib3BhY2l0eVwiLCBmaWVsZDogXCJPcmlnaW5cIn1cbiAgICAgIF1cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2dlbmVyYXRlcyBhIHNlbGVjdGlvbiBmaWx0ZXInLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQuZXF1YWwoZXhwcmVzc2lvbihtb2RlbCwge1wic2VsZWN0aW9uXCI6IFwib25lXCJ9KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSkgfHwgKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChleHByZXNzaW9uKG1vZGVsLCB7XCJzZWxlY3Rpb25cIjoge1wibm90XCI6IFwib25lXCJ9fSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkpIHx8ICghKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwcmVzc2lvbihtb2RlbCwge1wic2VsZWN0aW9uXCI6IHtcIm5vdFwiOiB7XCJhbmRcIjogW1wib25lXCIsIFwidHdvXCJdfX19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJyghKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpICYmICcgK1xuICAgICAgJyh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwcmVzc2lvbihtb2RlbCwge1wic2VsZWN0aW9uXCI6IHtcImFuZFwiOiBbXCJvbmVcIiwgXCJ0d29cIiwge1wibm90XCI6IFwidGhyLWVlXCJ9XX19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0aHJfZWVfc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgJiYgJyArXG4gICAgICAnKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpICYmICcgK1xuICAgICAgJyghKHZsSW50ZXJ2YWwoXCJ0aHJfZWVfc3RvcmVcIiwgZGF0dW0sIFwiaW50ZXJzZWN0XCIpKSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwcmVzc2lvbihtb2RlbCwge1wic2VsZWN0aW9uXCI6IHtcIm9yXCI6IFtcIm9uZVwiLCB7XCJhbmRcIjogW1widHdvXCIsIHtcIm5vdFwiOiBcInRoci1lZVwifV19XX19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0aHJfZWVfc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgfHwgJyArXG4gICAgICAnKCh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSAmJiAnICtcbiAgICAgICcoISh2bEludGVydmFsKFwidGhyX2VlX3N0b3JlXCIsIGRhdHVtLCBcImludGVyc2VjdFwiKSkpKSknKTtcbiAgfSk7XG5cbiAgaXQoJ3Rocm93cyBhbiBlcnJvciBmb3IgdW5rbm93biBzZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LnRocm93cygoKSA9PiBwcmVkaWNhdGUobW9kZWwsICdoZWxsb3dvcmxkJyksICdDYW5ub3QgZmluZCBhIHNlbGVjdGlvbiBuYW1lZCBcImhlbGxvd29ybGRcIicpO1xuICB9KTtcbn0pO1xuIl19