/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var selection = require("../../../src/compile/selection/selection");
var mixins_1 = require("../../../src/compile/mark/mixins");
function getModel(selectionDef) {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": {
                "field": "Cylinders", "type": "O",
                "condition": {
                    "selection": "!one",
                    "value": "grey"
                }
            },
            "opacity": {
                "field": "Origin", "type": "N",
                "condition": {
                    "selection": "one",
                    "value": 0.5
                }
            }
        }
    });
    model.component.selection = selection.parseUnitSelection(model, {
        "one": selectionDef
    });
    return model;
}
describe('Selection Predicate', function () {
    it('generates Vega production rules', function () {
        var single = getModel({ type: 'single' });
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', single), {
            color: [
                { test: "!vlPoint(\"one_store\", parent._id, datum, \"union\", \"all\")", value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', single), {
            opacity: [
                { test: "vlPoint(\"one_store\", parent._id, datum, \"union\", \"all\")", value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
        var multi = getModel({ type: 'multi' });
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', multi), {
            color: [
                { test: "!vlPoint(\"one_store\", parent._id, datum, \"union\", \"all\")", value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', multi), {
            opacity: [
                { test: "vlPoint(\"one_store\", parent._id, datum, \"union\", \"all\")", value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
        var interval = getModel({ type: 'interval' });
        chai_1.assert.deepEqual(mixins_1.nonPosition('color', interval), {
            color: [
                { test: "!vlInterval(\"one_store\", parent._id, datum, \"union\", \"all\")", value: "grey" },
                { scale: "color", field: "Cylinders" }
            ]
        });
        chai_1.assert.deepEqual(mixins_1.nonPosition('opacity', interval), {
            opacity: [
                { test: "vlInterval(\"one_store\", parent._id, datum, \"union\", \"all\")", value: 0.5 },
                { scale: "opacity", field: "Origin" }
            ]
        });
    });
});
//# sourceMappingURL=predicate.test.js.map