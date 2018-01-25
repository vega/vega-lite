"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mixins_1 = require("../../../src/compile/mark/mixins");
var selection = require("../../../src/compile/selection/selection");
var predicate_1 = require("../../../src/predicate");
var util_1 = require("../../util");
var predicate = selection.selectionPredicate;
describe('Selection Predicate', function () {
    var model = util_1.parseUnitModel({
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
        chai_1.assert.equal(predicate(model, "one"), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');
        chai_1.assert.equal(predicate(model, "four"), '(vlSingle("four_store", datum))');
        chai_1.assert.equal(predicate(model, { "not": "one" }), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');
        chai_1.assert.equal(predicate(model, { "not": { "and": ["one", "two"] } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union"))))');
        chai_1.assert.equal(predicate(model, { "not": { "and": ["one", "four"] } }), '!(length(data("one_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlSingle("four_store", datum))))');
        chai_1.assert.equal(predicate(model, { "and": ["one", "two", { "not": "thr-ee" }] }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect"))))');
        chai_1.assert.equal(predicate(model, { "or": ["one", { "and": ["two", { "not": "thr-ee" }] }] }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) || ' +
            '((vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect")))))');
    });
    it('generates Vega production rules', function () {
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', model, { vgChannel: 'fill' }), {
            fill: [
                { test: '!(length(data("one_store"))) || (vlSingle("one_store", datum))', value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', model), {
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
        chai_1.assert.equal(predicate_1.expression(model, { "selection": "one" }), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');
        chai_1.assert.equal(predicate_1.expression(model, { "selection": { "not": "one" } }), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');
        chai_1.assert.equal(predicate_1.expression(model, { "selection": { "not": { "and": ["one", "two"] } } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union"))))');
        chai_1.assert.equal(predicate_1.expression(model, { "selection": { "and": ["one", "two", { "not": "thr-ee" }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect"))))');
        chai_1.assert.equal(predicate_1.expression(model, { "selection": { "or": ["one", { "and": ["two", { "not": "thr-ee" }] }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) || ' +
            '((vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect")))))');
    });
    it('throws an error for unknown selections', function () {
        chai_1.assert.throws(function () { return predicate(model, 'helloworld'); }, 'Cannot find a selection named "helloworld"');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBNkQ7QUFDN0Qsb0VBQXNFO0FBQ3RFLG9EQUFrRDtBQUVsRCxtQ0FBMEM7QUFFMUMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDO0FBRS9DLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUU7Z0JBQ1AsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsU0FBUztnQkFDdkMsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxLQUFLO29CQUNsQixPQUFPLEVBQUUsTUFBTTtpQkFDaEI7YUFDRjtZQUNELFNBQVMsRUFBRTtnQkFDVCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTO2dCQUNwQyxXQUFXLEVBQUU7b0JBQ1gsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDO29CQUNqRSxPQUFPLEVBQUUsR0FBRztpQkFDYjthQUNGO1NBQ0Y7S0FDRixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkIs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K0Y7WUFDL0YscUNBQXFDO1lBQ3JDLDZDQUE2QztZQUM3Qyx1REFBdUQsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1FBQzNDLGFBQU0sQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEVBQTlCLENBQThCLEVBQUUsNENBQTRDLENBQUMsQ0FBQztJQUNwRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7bm9uUG9zaXRpb259IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbWl4aW5zJztcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7ZXhwcmVzc2lvbn0gZnJvbSAnLi4vLi4vLi4vc3JjL3ByZWRpY2F0ZSc7XG5pbXBvcnQge1ZnRW5jb2RlRW50cnl9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuY29uc3QgcHJlZGljYXRlID0gc2VsZWN0aW9uLnNlbGVjdGlvblByZWRpY2F0ZTtcblxuZGVzY3JpYmUoJ1NlbGVjdGlvbiBQcmVkaWNhdGUnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwiY29sb3JcIjoge1xuICAgICAgICBcImZpZWxkXCI6IFwiQ3lsaW5kZXJzXCIsIFwidHlwZVwiOiBcIm9yZGluYWxcIixcbiAgICAgICAgXCJjb25kaXRpb25cIjoge1xuICAgICAgICAgIFwic2VsZWN0aW9uXCI6IFwib25lXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiBcImdyZXlcIlxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgXCJvcGFjaXR5XCI6IHtcbiAgICAgICAgXCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCIsXG4gICAgICAgIFwiY29uZGl0aW9uXCI6IHtcbiAgICAgICAgICBcInNlbGVjdGlvblwiOiB7XCJvclwiOiBbXCJvbmVcIiwge1wiYW5kXCI6IFtcInR3b1wiLCB7XCJub3RcIjogXCJ0aHItZWVcIn1dfV19LFxuICAgICAgICAgIFwidmFsdWVcIjogMC41XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIG1vZGVsLnBhcnNlU2NhbGUoKTtcblxuICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcInR5cGVcIjogXCJzaW5nbGVcIn0sXG4gICAgXCJ0d29cIjoge1widHlwZVwiOiBcIm11bHRpXCIsIFwicmVzb2x2ZVwiOiBcInVuaW9uXCJ9LFxuICAgIFwidGhyLWVlXCI6IHtcInR5cGVcIjogXCJpbnRlcnZhbFwiLCBcInJlc29sdmVcIjogXCJpbnRlcnNlY3RcIn0sXG4gICAgXCJmb3VyXCI6IHtcInR5cGVcIjogXCJzaW5nbGVcIiwgXCJlbXB0eVwiOiBcIm5vbmVcIn1cbiAgfSk7XG5cbiAgaXQoJ2dlbmVyYXRlcyB0aGUgcHJlZGljYXRlIGV4cHJlc3Npb24nLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCBcIm9uZVwiKSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSkgfHwgKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIFwiZm91clwiKSwgJyh2bFNpbmdsZShcImZvdXJfc3RvcmVcIiwgZGF0dW0pKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwge1wibm90XCI6IFwib25lXCJ9KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSkgfHwgKCEodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIHtcIm5vdFwiOiB7XCJhbmRcIjogW1wib25lXCIsIFwidHdvXCJdfX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCEoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgJiYgJyArXG4gICAgICAnKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpKSknKTtcblxuICAgICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwge1wibm90XCI6IHtcImFuZFwiOiBbXCJvbmVcIiwgXCJmb3VyXCJdfX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoISgodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSAmJiAnICtcbiAgICAgICcodmxTaW5nbGUoXCJmb3VyX3N0b3JlXCIsIGRhdHVtKSkpKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwge1wiYW5kXCI6IFtcIm9uZVwiLCBcInR3b1wiLCB7XCJub3RcIjogXCJ0aHItZWVcIn1dfSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidGhyX2VlX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpICYmICcgK1xuICAgICAgJyh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSAmJiAnICtcbiAgICAgICcoISh2bEludGVydmFsKFwidGhyX2VlX3N0b3JlXCIsIGRhdHVtLCBcImludGVyc2VjdFwiKSkpKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwge1wib3JcIjogW1wib25lXCIsIHtcImFuZFwiOiBbXCJ0d29cIiwge1wibm90XCI6IFwidGhyLWVlXCJ9XX1dfSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidGhyX2VlX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpIHx8ICcgK1xuICAgICAgJygodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkgJiYgJyArXG4gICAgICAnKCEodmxJbnRlcnZhbChcInRocl9lZV9zdG9yZVwiLCBkYXR1bSwgXCJpbnRlcnNlY3RcIikpKSkpJyk7XG4gIH0pO1xuXG4gIGl0KCdnZW5lcmF0ZXMgVmVnYSBwcm9kdWN0aW9uIHJ1bGVzJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0VuY29kZUVudHJ5Pihub25Qb3NpdGlvbignY29sb3InLCBtb2RlbCwge3ZnQ2hhbm5lbDogJ2ZpbGwnfSksIHtcbiAgICAgIGZpbGw6IFtcbiAgICAgICAge3Rlc3Q6ICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSkgfHwgKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSknLCB2YWx1ZTogXCJncmV5XCJ9LFxuICAgICAgICB7c2NhbGU6IFwiY29sb3JcIiwgZmllbGQ6IFwiQ3lsaW5kZXJzXCJ9XG4gICAgICBdXG4gICAgfSk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnRW5jb2RlRW50cnk+KG5vblBvc2l0aW9uKCdvcGFjaXR5JywgbW9kZWwpLCB7XG4gICAgICBvcGFjaXR5OiBbXG4gICAgICAgIHt0ZXN0OiAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidGhyX2VlX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAgICAgICAgICcoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgfHwgJyArXG4gICAgICAgICAgICAgICcoKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpICYmICcgK1xuICAgICAgICAgICAgICAnKCEodmxJbnRlcnZhbChcInRocl9lZV9zdG9yZVwiLCBkYXR1bSwgXCJpbnRlcnNlY3RcIikpKSkpJyxcbiAgICAgICAgICB2YWx1ZTogMC41fSxcbiAgICAgICAge3NjYWxlOiBcIm9wYWNpdHlcIiwgZmllbGQ6IFwiT3JpZ2luXCJ9XG4gICAgICBdXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdnZW5lcmF0ZXMgYSBzZWxlY3Rpb24gZmlsdGVyJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LmVxdWFsKGV4cHJlc3Npb24obW9kZWwsIHtcInNlbGVjdGlvblwiOiBcIm9uZVwifSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkpIHx8ICh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwoZXhwcmVzc2lvbihtb2RlbCwge1wic2VsZWN0aW9uXCI6IHtcIm5vdFwiOiBcIm9uZVwifX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpKSB8fCAoISh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHJlc3Npb24obW9kZWwsIHtcInNlbGVjdGlvblwiOiB7XCJub3RcIjoge1wiYW5kXCI6IFtcIm9uZVwiLCBcInR3b1wiXX19fSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpKSB8fCAnICtcbiAgICAgICcoISgodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSAmJiAnICtcbiAgICAgICcodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkpKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHJlc3Npb24obW9kZWwsIHtcInNlbGVjdGlvblwiOiB7XCJhbmRcIjogW1wib25lXCIsIFwidHdvXCIsIHtcIm5vdFwiOiBcInRoci1lZVwifV19fSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidGhyX2VlX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpICYmICcgK1xuICAgICAgJyh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSAmJiAnICtcbiAgICAgICcoISh2bEludGVydmFsKFwidGhyX2VlX3N0b3JlXCIsIGRhdHVtLCBcImludGVyc2VjdFwiKSkpKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHJlc3Npb24obW9kZWwsIHtcInNlbGVjdGlvblwiOiB7XCJvclwiOiBbXCJvbmVcIiwge1wiYW5kXCI6IFtcInR3b1wiLCB7XCJub3RcIjogXCJ0aHItZWVcIn1dfV19fSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkgfHwgbGVuZ3RoKGRhdGEoXCJ0d29fc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidGhyX2VlX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpIHx8ICcgK1xuICAgICAgJygodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkgJiYgJyArXG4gICAgICAnKCEodmxJbnRlcnZhbChcInRocl9lZV9zdG9yZVwiLCBkYXR1bSwgXCJpbnRlcnNlY3RcIikpKSkpJyk7XG4gIH0pO1xuXG4gIGl0KCd0aHJvd3MgYW4gZXJyb3IgZm9yIHVua25vd24gc2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC50aHJvd3MoKCkgPT4gcHJlZGljYXRlKG1vZGVsLCAnaGVsbG93b3JsZCcpLCAnQ2Fubm90IGZpbmQgYSBzZWxlY3Rpb24gbmFtZWQgXCJoZWxsb3dvcmxkXCInKTtcbiAgfSk7XG59KTtcbiJdfQ==