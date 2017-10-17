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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlZGljYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3ByZWRpY2F0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBNkQ7QUFDN0Qsb0VBQXNFO0FBQ3RFLDhDQUErQztBQUUvQyxtQ0FBMEM7QUFFMUMsSUFBTSxTQUFTLEdBQUcsU0FBUyxDQUFDLFNBQVMsQ0FBQztBQUV0QyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFO2dCQUNQLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxFQUFFLFNBQVM7Z0JBQ3ZDLFdBQVcsRUFBRTtvQkFDWCxXQUFXLEVBQUUsS0FBSztvQkFDbEIsT0FBTyxFQUFFLE1BQU07aUJBQ2hCO2FBQ0Y7WUFDRCxTQUFTLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUztnQkFDcEMsV0FBVyxFQUFFO29CQUNYLFdBQVcsRUFBRSxFQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQztvQkFDakUsT0FBTyxFQUFFLEdBQUc7aUJBQ2I7YUFDRjtTQUNGO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRW5CLEtB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