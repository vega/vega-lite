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
                    "selection": { "or": ["one", { "and": ["two", { "not": "three" }] }] },
                    "value": 0.5
                }
            }
        }
    });
    model.parseScale();
    model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "single" },
        "two": { "type": "multi", "resolve": "union" },
        "three": { "type": "interval", "resolve": "intersect_others" }
    });
    it('generates the predicate expression', function () {
        chai_1.assert.equal(predicate(model, "one"), 'vlPoint("one_store", "", datum, "union", "all")');
        chai_1.assert.equal(predicate(model, { "not": "one" }), '!(vlPoint("one_store", "", datum, "union", "all"))');
        chai_1.assert.equal(predicate(model, { "not": { "and": ["one", "two"] } }), '!((vlPoint("one_store", "", datum, "union", "all")) && ' +
            '(vlPoint("two_store", "", datum, "union", "all")))');
        chai_1.assert.equal(predicate(model, { "and": ["one", "two", { "not": "three" }] }), '(vlPoint("one_store", "", datum, "union", "all")) && ' +
            '(vlPoint("two_store", "", datum, "union", "all")) && ' +
            '(!(vlInterval("three_store", "", datum, "intersect", "others")))');
        chai_1.assert.equal(predicate(model, { "or": ["one", { "and": ["two", { "not": "three" }] }] }), '(vlPoint("one_store", "", datum, "union", "all")) || ' +
            '((vlPoint("two_store", "", datum, "union", "all")) && ' +
            '(!(vlInterval("three_store", "", datum, "intersect", "others"))))');
    });
    it('generates Vega production rules', function () {
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', model, { vgChannel: 'fill' }), {
            fill: [
                { test: 'vlPoint("one_store", "", datum, "union", "all")', value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', model), {
            opacity: [
                { test: '(vlPoint("one_store", "", datum, "union", "all")) || ' +
                        '((vlPoint("two_store", "", datum, "union", "all")) && ' +
                        '(!(vlInterval("three_store", "", datum, "intersect", "others"))))',
                    value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
    });
    it('generates a selection filter', function () {
        chai_1.assert.equal(filter_1.expression(model, { "selection": "one" }), 'vlPoint("one_store", "", datum, "union", "all")');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "not": "one" } }), '!(vlPoint("one_store", "", datum, "union", "all"))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "not": { "and": ["one", "two"] } } }), '!((vlPoint("one_store", "", datum, "union", "all")) && ' +
            '(vlPoint("two_store", "", datum, "union", "all")))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "and": ["one", "two", { "not": "three" }] } }), '(vlPoint("one_store", "", datum, "union", "all")) && ' +
            '(vlPoint("two_store", "", datum, "union", "all")) && ' +
            '(!(vlInterval("three_store", "", datum, "intersect", "others")))');
        chai_1.assert.equal(filter_1.expression(model, { "selection": { "or": ["one", { "and": ["two", { "not": "three" }] }] } }), '(vlPoint("one_store", "", datum, "union", "all")) || ' +
            '((vlPoint("two_store", "", datum, "union", "all")) && ' +
            '(!(vlInterval("three_store", "", datum, "intersect", "others"))))');
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBNkQ7QUFDN0Qsb0VBQXNFO0FBQ3RFLDhDQUErQztBQUUvQyxtQ0FBMEM7QUFFMUMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztBQUV0QyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVM7Z0JBQ3ZDLFdBQVcsRUFBRTtvQkFDWCxXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUztnQkFDcEMsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQztvQkFDaEUsT0FBTyxFQUFFLEdBQUc7aUJBQ2I7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRW5CLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDOUQsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQztRQUN6QixLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUM7UUFDNUMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsa0JBQWtCLEVBQUM7S0FDN0QsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG9DQUFvQyxFQUFFO1FBQ3ZDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFDbEMsaURBQWlELENBQUMsQ0FBQztRQUVyRCxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFDM0Msb0RBQW9ELENBQUMsQ0FBQztRQUV4RCxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQUMsRUFBQyxDQUFDLEVBQzdELHlEQUF5RDtZQUN6RCxvREFBb0QsQ0FBQyxDQUFDO1FBRXhELGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQ3RFLHVEQUF1RDtZQUN2RCx1REFBdUQ7WUFDdkQsa0VBQWtFLENBQUMsQ0FBQztRQUV0RSxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUNoRix1REFBdUQ7WUFDdkQsd0RBQXdEO1lBQ3hELG1FQUFtRSxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7UUFDcEMsYUFBTSxDQUFDLFNBQVMsQ0FBZ0Isb0JBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsU0FBUyxFQUFFLE1BQU0sRUFBQyxDQUFDLEVBQUU7WUFDaEYsSUFBSSxFQUFFO2dCQUNKLEVBQUMsSUFBSSxFQUFFLGlEQUFpRCxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUM7Z0JBQ3hFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFDO2FBQ3JDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBZ0Isb0JBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUU7WUFDN0QsT0FBTyxFQUFFO2dCQUNQLEVBQUMsSUFBSSxFQUFFLHVEQUF1RDt3QkFDeEQsd0RBQXdEO3dCQUN4RCxtRUFBbUU7b0JBQ3ZFLEtBQUssRUFBRSxHQUFHLEVBQUM7Z0JBQ2IsRUFBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUM7YUFDcEM7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyw4QkFBOEIsRUFBRTtRQUNqQyxhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFVLENBQUMsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQ2xELGlEQUFpRCxDQUFDLENBQUM7UUFFckQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDLEVBQzNELG9EQUFvRCxDQUFDLENBQUM7UUFFeEQsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsRUFBQyxFQUFDLEVBQUMsQ0FBQyxFQUM3RSx5REFBeUQ7WUFDekQsb0RBQW9ELENBQUMsQ0FBQztRQUV4RCxhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFVLENBQUMsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLEVBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxFQUN0Rix1REFBdUQ7WUFDdkQsdURBQXVEO1lBQ3ZELGtFQUFrRSxDQUFDLENBQUM7UUFFdEUsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBVSxDQUFDLEtBQUssRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxFQUFDLENBQUMsRUFDaEcsdURBQXVEO1lBQ3ZELHdEQUF3RDtZQUN4RCxtRUFBbUUsQ0FBQyxDQUFDO0lBQ3pFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==