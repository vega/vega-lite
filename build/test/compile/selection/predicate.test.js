"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var mixins_1 = require("../../../src/compile/mark/mixins");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQTZEO0FBQzdELDBGQUFzRTtBQUN0RSxvREFBa0Q7QUFFbEQsbUNBQTBDO0FBRTFDLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQztBQUUvQyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVM7Z0JBQ3ZDLFdBQVcsRUFBRTtvQkFDWCxXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUztnQkFDcEMsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQztvQkFDakUsT0FBTyxFQUFFLEdBQUc7aUJBQ2I7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRW5C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QStGO1lBQy9GLHFDQUFxQztZQUNyQyw2Q0FBNkM7WUFDN0MsdURBQXVELENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3Q0FBd0MsRUFBRTtRQUMzQyxhQUFNLENBQUMsTUFBTSxDQUFDLGNBQU0sT0FBQSxTQUFTLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQyxFQUE5QixDQUE4QixFQUFFLDRDQUE0QyxDQUFDLENBQUM7SUFDcEcsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge25vblBvc2l0aW9ufSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL21peGlucyc7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge2V4cHJlc3Npb259IGZyb20gJy4uLy4uLy4uL3NyYy9wcmVkaWNhdGUnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5fSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmNvbnN0IHByZWRpY2F0ZSA9IHNlbGVjdGlvbi5zZWxlY3Rpb25QcmVkaWNhdGU7XG5cbmRlc2NyaWJlKCdTZWxlY3Rpb24gUHJlZGljYXRlJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgXCJmaWVsZFwiOiBcIkN5bGluZGVyc1wiLCBcInR5cGVcIjogXCJvcmRpbmFsXCIsXG4gICAgICAgIFwiY29uZGl0aW9uXCI6IHtcbiAgICAgICAgICBcInNlbGVjdGlvblwiOiBcIm9uZVwiLFxuICAgICAgICAgIFwidmFsdWVcIjogXCJncmV5XCJcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIFwib3BhY2l0eVwiOiB7XG4gICAgICAgIFwiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwiLFxuICAgICAgICBcImNvbmRpdGlvblwiOiB7XG4gICAgICAgICAgXCJzZWxlY3Rpb25cIjoge1wib3JcIjogW1wib25lXCIsIHtcImFuZFwiOiBbXCJ0d29cIiwge1wibm90XCI6IFwidGhyLWVlXCJ9XX1dfSxcbiAgICAgICAgICBcInZhbHVlXCI6IDAuNVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBtb2RlbC5wYXJzZVNjYWxlKCk7XG5cbiAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XCJ0eXBlXCI6IFwic2luZ2xlXCJ9LFxuICAgIFwidHdvXCI6IHtcInR5cGVcIjogXCJtdWx0aVwiLCBcInJlc29sdmVcIjogXCJ1bmlvblwifSxcbiAgICBcInRoci1lZVwiOiB7XCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIiwgXCJyZXNvbHZlXCI6IFwiaW50ZXJzZWN0XCJ9LFxuICAgIFwiZm91clwiOiB7XCJ0eXBlXCI6IFwic2luZ2xlXCIsIFwiZW1wdHlcIjogXCJub25lXCJ9XG4gIH0pO1xuXG4gIGl0KCdnZW5lcmF0ZXMgdGhlIHByZWRpY2F0ZSBleHByZXNzaW9uJywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LmVxdWFsKHByZWRpY2F0ZShtb2RlbCwgXCJvbmVcIiksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkpIHx8ICh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCBcImZvdXJcIiksICcodmxTaW5nbGUoXCJmb3VyX3N0b3JlXCIsIGRhdHVtKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIHtcIm5vdFwiOiBcIm9uZVwifSksXG4gICAgICAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkpIHx8ICghKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkpJyk7XG5cbiAgICBhc3NlcnQuZXF1YWwocHJlZGljYXRlKG1vZGVsLCB7XCJub3RcIjoge1wiYW5kXCI6IFtcIm9uZVwiLCBcInR3b1wiXX19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInR3b19zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJyghKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpICYmICcgK1xuICAgICAgJyh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSkpJyk7XG5cbiAgICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIHtcIm5vdFwiOiB7XCJhbmRcIjogW1wib25lXCIsIFwiZm91clwiXX19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCEoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgJiYgJyArXG4gICAgICAnKHZsU2luZ2xlKFwiZm91cl9zdG9yZVwiLCBkYXR1bSkpKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIHtcImFuZFwiOiBbXCJvbmVcIiwgXCJ0d29cIiwge1wibm90XCI6IFwidGhyLWVlXCJ9XX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInRocl9lZV9zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJygodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSAmJiAnICtcbiAgICAgICcodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkgJiYgJyArXG4gICAgICAnKCEodmxJbnRlcnZhbChcInRocl9lZV9zdG9yZVwiLCBkYXR1bSwgXCJpbnRlcnNlY3RcIikpKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChwcmVkaWNhdGUobW9kZWwsIHtcIm9yXCI6IFtcIm9uZVwiLCB7XCJhbmRcIjogW1widHdvXCIsIHtcIm5vdFwiOiBcInRoci1lZVwifV19XX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInRocl9lZV9zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJygodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSB8fCAnICtcbiAgICAgICcoKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpICYmICcgK1xuICAgICAgJyghKHZsSW50ZXJ2YWwoXCJ0aHJfZWVfc3RvcmVcIiwgZGF0dW0sIFwiaW50ZXJzZWN0XCIpKSkpKScpO1xuICB9KTtcblxuICBpdCgnZ2VuZXJhdGVzIFZlZ2EgcHJvZHVjdGlvbiBydWxlcycsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdFbmNvZGVFbnRyeT4obm9uUG9zaXRpb24oJ2NvbG9yJywgbW9kZWwsIHt2Z0NoYW5uZWw6ICdmaWxsJ30pLCB7XG4gICAgICBmaWxsOiBbXG4gICAgICAgIHt0ZXN0OiAnIShsZW5ndGgoZGF0YShcIm9uZV9zdG9yZVwiKSkpIHx8ICh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpJywgdmFsdWU6IFwiZ3JleVwifSxcbiAgICAgICAge3NjYWxlOiBcImNvbG9yXCIsIGZpZWxkOiBcIkN5bGluZGVyc1wifVxuICAgICAgXVxuICAgIH0pO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0VuY29kZUVudHJ5Pihub25Qb3NpdGlvbignb3BhY2l0eScsIG1vZGVsKSwge1xuICAgICAgb3BhY2l0eTogW1xuICAgICAgICB7dGVzdDogJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInRocl9lZV9zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgICAgICAgICAnKCh2bFNpbmdsZShcIm9uZV9zdG9yZVwiLCBkYXR1bSkpIHx8ICcgK1xuICAgICAgICAgICAgICAnKCh2bE11bHRpKFwidHdvX3N0b3JlXCIsIGRhdHVtLCBcInVuaW9uXCIpKSAmJiAnICtcbiAgICAgICAgICAgICAgJyghKHZsSW50ZXJ2YWwoXCJ0aHJfZWVfc3RvcmVcIiwgZGF0dW0sIFwiaW50ZXJzZWN0XCIpKSkpKScsXG4gICAgICAgICAgdmFsdWU6IDAuNX0sXG4gICAgICAgIHtzY2FsZTogXCJvcGFjaXR5XCIsIGZpZWxkOiBcIk9yaWdpblwifVxuICAgICAgXVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnZ2VuZXJhdGVzIGEgc2VsZWN0aW9uIGZpbHRlcicsIGZ1bmN0aW9uKCkge1xuICAgIGFzc2VydC5lcXVhbChleHByZXNzaW9uKG1vZGVsLCB7XCJzZWxlY3Rpb25cIjogXCJvbmVcIn0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpKSB8fCAodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKScpO1xuXG4gICAgYXNzZXJ0LmVxdWFsKGV4cHJlc3Npb24obW9kZWwsIHtcInNlbGVjdGlvblwiOiB7XCJub3RcIjogXCJvbmVcIn19KSxcbiAgICAgICchKGxlbmd0aChkYXRhKFwib25lX3N0b3JlXCIpKSkgfHwgKCEodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChleHByZXNzaW9uKG1vZGVsLCB7XCJzZWxlY3Rpb25cIjoge1wibm90XCI6IHtcImFuZFwiOiBbXCJvbmVcIiwgXCJ0d29cIl19fX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSkgfHwgJyArXG4gICAgICAnKCEoKHZsU2luZ2xlKFwib25lX3N0b3JlXCIsIGRhdHVtKSkgJiYgJyArXG4gICAgICAnKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChleHByZXNzaW9uKG1vZGVsLCB7XCJzZWxlY3Rpb25cIjoge1wiYW5kXCI6IFtcIm9uZVwiLCBcInR3b1wiLCB7XCJub3RcIjogXCJ0aHItZWVcIn1dfX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInRocl9lZV9zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJygodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSAmJiAnICtcbiAgICAgICcodmxNdWx0aShcInR3b19zdG9yZVwiLCBkYXR1bSwgXCJ1bmlvblwiKSkgJiYgJyArXG4gICAgICAnKCEodmxJbnRlcnZhbChcInRocl9lZV9zdG9yZVwiLCBkYXR1bSwgXCJpbnRlcnNlY3RcIikpKSknKTtcblxuICAgIGFzc2VydC5lcXVhbChleHByZXNzaW9uKG1vZGVsLCB7XCJzZWxlY3Rpb25cIjoge1wib3JcIjogW1wib25lXCIsIHtcImFuZFwiOiBbXCJ0d29cIiwge1wibm90XCI6IFwidGhyLWVlXCJ9XX1dfX0pLFxuICAgICAgJyEobGVuZ3RoKGRhdGEoXCJvbmVfc3RvcmVcIikpIHx8IGxlbmd0aChkYXRhKFwidHdvX3N0b3JlXCIpKSB8fCBsZW5ndGgoZGF0YShcInRocl9lZV9zdG9yZVwiKSkpIHx8ICcgK1xuICAgICAgJygodmxTaW5nbGUoXCJvbmVfc3RvcmVcIiwgZGF0dW0pKSB8fCAnICtcbiAgICAgICcoKHZsTXVsdGkoXCJ0d29fc3RvcmVcIiwgZGF0dW0sIFwidW5pb25cIikpICYmICcgK1xuICAgICAgJyghKHZsSW50ZXJ2YWwoXCJ0aHJfZWVfc3RvcmVcIiwgZGF0dW0sIFwiaW50ZXJzZWN0XCIpKSkpKScpO1xuICB9KTtcblxuICBpdCgndGhyb3dzIGFuIGVycm9yIGZvciB1bmtub3duIHNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQudGhyb3dzKCgpID0+IHByZWRpY2F0ZShtb2RlbCwgJ2hlbGxvd29ybGQnKSwgJ0Nhbm5vdCBmaW5kIGEgc2VsZWN0aW9uIG5hbWVkIFwiaGVsbG93b3JsZFwiJyk7XG4gIH0pO1xufSk7XG4iXX0=