/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
var inputs_1 = require("../../../src/compile/selection/transforms/inputs");
var util_1 = require("../../util");
describe('Inputs Selection Transform', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "N" }
        }
    });
    model.parseScale();
    var selCmpts = selection.parseUnitSelection(model, {
        "one": {
            "type": "single",
            "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
        },
        "two": {
            "type": "single",
            "fields": ["Cylinders", "Horsepower"],
            "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
        },
        "three": {
            "type": "single",
            "fields": ["Cylinders", "Origin"],
            "bind": {
                "Horsepower": { "input": "range", "min": 0, "max": 10, "step": 1 },
                "Origin": { "input": "select", "options": ["Japan", "USA", "Europe"] }
            }
        },
        "four": {
            "type": "multi",
            "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
        },
        "five": {
            "type": "interval",
            "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
        },
        "six": {
            "type": "interval",
            "bind": "scales"
        },
        "seven": {
            "type": "single",
            "bind": "scales"
        }
    });
    it('identifies transform invocation', function () {
        chai_1.assert.isTrue(inputs_1.default.has(selCmpts['one']));
        chai_1.assert.isTrue(inputs_1.default.has(selCmpts['two']));
        chai_1.assert.isTrue(inputs_1.default.has(selCmpts['three']));
        chai_1.assert.isFalse(inputs_1.default.has(selCmpts['four']));
        chai_1.assert.isFalse(inputs_1.default.has(selCmpts['five']));
        chai_1.assert.isFalse(inputs_1.default.has(selCmpts['six']));
        chai_1.assert.isFalse(inputs_1.default.has(selCmpts['four']));
    });
    it('adds widget binding for default projection', function () {
        model.component.selection = { one: selCmpts['one'] };
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "one",
                "update": "{fields: [\"_id\"], values: [one__id]}"
            }
        ]);
        chai_1.assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
            {
                "name": "one__id",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "(item().isVoronoi ? datum.datum : datum)[\"_id\"]"
                    }
                ],
                "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
            }
        ]);
    });
    it('adds single widget binding for compound projection', function () {
        model.component.selection = { two: selCmpts['two'] };
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "two",
                "update": "{fields: [\"Cylinders\", \"Horsepower\"], values: [two_Cylinders, two_Horsepower]}"
            }
        ]);
        chai_1.assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
            {
                "name": "two_Horsepower",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "(item().isVoronoi ? datum.datum : datum)[\"Horsepower\"]"
                    }
                ],
                "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
            },
            {
                "name": "two_Cylinders",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "(item().isVoronoi ? datum.datum : datum)[\"Cylinders\"]"
                    }
                ],
                "bind": { "input": "range", "min": 0, "max": 10, "step": 1 }
            }
        ]);
    });
    it('adds projection-specific widget bindings', function () {
        model.component.selection = { three: selCmpts['three'] };
        chai_1.assert.includeDeepMembers(selection.assembleUnitSelectionSignals(model, []), [
            {
                "name": "three",
                "update": "{fields: [\"Cylinders\", \"Origin\"], values: [three_Cylinders, three_Origin]}"
            }
        ]);
        chai_1.assert.includeDeepMembers(selection.assembleTopLevelSignals(model, []), [
            {
                "name": "three_Origin",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "(item().isVoronoi ? datum.datum : datum)[\"Origin\"]"
                    }
                ],
                "bind": {
                    "input": "select",
                    "options": ["Japan", "USA", "Europe"]
                }
            },
            {
                "name": "three_Cylinders",
                "value": "",
                "on": [
                    {
                        "events": [{ "source": "scope", "type": "click" }],
                        "update": "(item().isVoronoi ? datum.datum : datum)[\"Cylinders\"]"
                    }
                ],
                "bind": {
                    "Horsepower": { "input": "range", "min": 0, "max": 10, "step": 1 },
                    "Origin": {
                        "input": "select",
                        "options": ["Japan", "USA", "Europe"]
                    }
                }
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2lucHV0cy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixvRUFBc0U7QUFDdEUsMkVBQXNFO0FBQ3RFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7SUFDckMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO1NBQzFDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDbkQsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQztTQUMzRDtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFFBQVEsRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUM7WUFDckMsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFF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