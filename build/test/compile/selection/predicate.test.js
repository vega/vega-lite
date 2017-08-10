"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mixins_1 = require("../../../src/compile/mark/mixins");
var selection = require("../../../src/compile/selection/selection");
var filter_1 = require("../../../src/filter");
var util_1 = require("../../util");
var predicate = selection.predicate;
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
        "thr-ee": { "type": "interval", "resolve": "intersect" }
    });
    it('generates the predicate expression', function () {
        chai_1.assert.equal(predicate(model, "one"), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');
        chai_1.assert.equal(predicate(model, { "not": "one" }), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');
        chai_1.assert.equal(predicate(model, { "not": { "and": ["one", "two"] } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union"))))');
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
        chai_1.assert.equal(filter_1.expression(model, { "selection": "one" }), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "not": "one" } }), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "not": { "and": ["one", "two"] } } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union"))))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "and": ["one", "two", { "not": "thr-ee" }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) && ' +
            '(vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect"))))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "or": ["one", { "and": ["two", { "not": "thr-ee" }] }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) || ' +
            '((vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect")))))');
    });
    it('throws an error for unknown selections', function () {
        chai_1.assert.throws(function () { return predicate(model, 'helloworld'); }, 'Cannot find a selection named "helloworld"');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBNkQ7QUFDN0Qsb0VBQXNFO0FBQ3RFLDhDQUErQztBQUUvQyxtQ0FBMEM7QUFFMUMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztBQUV0QyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVM7Z0JBQ3ZDLFdBQVcsRUFBRTtvQkFDWCxXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUztnQkFDcEMsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQztvQkFDakUsT0FBTyxFQUFFLEdBQUc7aUJBQ2I7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDOUQsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQztRQUN6QixLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUM7UUFDNUMsUUFBUSxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFDO0tBQ3ZELENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtRQUN2QyxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQ2xDLGdFQUFnRSxDQUFDLENBQUM7UUFFcEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQzNDLG1FQUFtRSxDQUFDLENBQUM7UUFFdkUsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUFDLEVBQUMsQ0FBQyxFQUM3RCwrREFBK0Q7WUFDL0QsdUNBQXVDO1lBQ3ZDLDBDQUEwQyxDQUFDLENBQUM7UUFFOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFDdkUsK0ZBQStGO1lBQy9GLHFDQUFxQztZQUNyQyw0Q0FBNEM7WUFDNUMsc0RBQXNELENBQUMsQ0FBQztRQUUxRCxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUNqRiwrRkFBK0Y7WUFDL0YscUNBQXFDO1lBQ3JDLDZDQUE2QztZQUM3Qyx1REFBdUQsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLGlDQUFpQyxFQUFFO1FBQ3BDLGFBQU0sQ0FBQyxTQUFTLENBQWdCLG9CQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUMsQ0FBQyxFQUFFO1lBQ2hGLElBQUksRUFBRTtnQkFDSixFQUFDLElBQUksRUFBRSxnRUFBZ0UsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFDO2dCQUN2RixFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFdBQVcsRUFBQzthQUNyQztTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxTQUFTLENBQWdCLG9CQUFXLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQzdELE9BQU8sRUFBRTtnQkFDUCxFQUFDLElBQUksRUFBRSwrRkFBK0Y7d0JBQ2hHLHFDQUFxQzt3QkFDckMsNkNBQTZDO3dCQUM3Qyx1REFBdUQ7b0JBQzNELEtBQUssRUFBRSxHQUFHLEVBQUM7Z0JBQ2IsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7YUFDcEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtRQUNqQyxhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFVLENBQUMsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQ2xELGdFQUFnRSxDQUFDLENBQUM7UUFFcEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQzNELG1FQUFtRSxDQUFDLENBQUM7UUFFdkUsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBQyxFQUFDLEVBQUMsQ0FBQyxFQUM3RSwrREFBK0Q7WUFDL0QsdUNBQXVDO1lBQ3ZDLDBDQUEwQyxDQUFDLENBQUM7UUFFOUMsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsRUFDdkYsK0ZBQStGO1lBQy9GLHFDQUFxQztZQUNyQyw0Q0FBNEM7WUFDNUMsc0RBQXNELENBQUMsQ0FBQztRQUUxRCxhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFVLENBQUMsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxFQUNqRywrRkFBK0Y7WUFDL0YscUNBQXFDO1lBQ3JDLDZDQUE2QztZQUM3Qyx1REFBdUQsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHdDQUF3QyxFQUFFO1FBQzNDLGFBQU0sQ0FBQyxNQUFNLENBQUMsY0FBTSxPQUFBLFNBQVMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFDLEVBQTlCLENBQThCLEVBQUUsNENBQTRDLENBQUMsQ0FBQztJQUNwRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=