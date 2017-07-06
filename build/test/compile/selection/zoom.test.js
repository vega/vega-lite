"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = require("../../../src/compile/selection/selection");
var zoom_1 = require("../../../src/compile/selection/transforms/zoom");
var util_1 = require("../../util");
describe('Zoom Selection Transform', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    model.parseScale();
    var selCmpts = selection.parseUnitSelection(model, {
        "one": {
            "type": "single",
            "zoom": true
        },
        "two": {
            "type": "multi",
            "zoom": true
        },
        "three": {
            "type": "interval",
            "zoom": false
        },
        "four": {
            "type": "interval"
        },
        "five": {
            "type": "interval",
            "zoom": "wheel, pinch"
        },
        "six": {
            "type": "interval",
            "bind": "scales"
        },
        "seven": { "type": "interval", "zoom": null }
    });
    it('identifies transform invocation', function () {
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['one']));
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['three']));
        chai_1.assert.isNotFalse(zoom_1.default.has(selCmpts['four']));
        chai_1.assert.isNotFalse(zoom_1.default.has(selCmpts['five']));
        chai_1.assert.isNotFalse(zoom_1.default.has(selCmpts['six']));
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['seven']));
    });
    it('builds signals for default invocation', function () {
        model.component.selection = { four: selCmpts['four'] };
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "four_zoom_anchor",
                "on": [
                    {
                        "events": vega_event_selector_1.selector('@four_brush:wheel', 'scope'),
                        "update": "{x: x(unit), y: y(unit)}"
                    }
                ]
            },
            {
                "name": "four_zoom_delta",
                "on": [
                    {
                        "events": vega_event_selector_1.selector('@four_brush:wheel', 'scope'),
                        "force": true,
                        "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
            {
                "events": { "signal": "four_zoom_delta" },
                "update": "clampRange([four_zoom_anchor.x + (four_x[0] - four_zoom_anchor.x) * four_zoom_delta, four_zoom_anchor.x + (four_x[1] - four_zoom_anchor.x) * four_zoom_delta], 0, width)"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
            {
                "events": { "signal": "four_zoom_delta" },
                "update": "clampRange([four_zoom_anchor.y + (four_y[0] - four_zoom_anchor.y) * four_zoom_delta, four_zoom_anchor.y + (four_y[1] - four_zoom_anchor.y) * four_zoom_delta], 0, height)"
            }
        ]);
    });
    it('builds signals for custom events', function () {
        model.component.selection = { five: selCmpts['five'] };
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "five_zoom_anchor",
                "on": [
                    {
                        "events": vega_event_selector_1.selector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                        "update": "{x: x(unit), y: y(unit)}"
                    }
                ]
            },
            {
                "name": "five_zoom_delta",
                "on": [
                    {
                        "events": vega_event_selector_1.selector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                        "force": true,
                        "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_x'; })[0].on, [
            {
                "events": { "signal": "five_zoom_delta" },
                "update": "clampRange([five_zoom_anchor.x + (five_x[0] - five_zoom_anchor.x) * five_zoom_delta, five_zoom_anchor.x + (five_x[1] - five_zoom_anchor.x) * five_zoom_delta], 0, width)"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_y'; })[0].on, [
            {
                "events": { "signal": "five_zoom_delta" },
                "update": "clampRange([five_zoom_anchor.y + (five_y[0] - five_zoom_anchor.y) * five_zoom_delta, five_zoom_anchor.y + (five_y[1] - five_zoom_anchor.y) * five_zoom_delta], 0, height)"
            }
        ]);
    });
    it('builds signals for scale-bound zoom', function () {
        model.component.selection = { six: selCmpts['six'] };
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "six_zoom_anchor",
                "on": [
                    {
                        "events": vega_event_selector_1.selector('wheel', 'scope'),
                        "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
                    }
                ]
            },
            {
                "name": "six_zoom_delta",
                "on": [
                    {
                        "events": vega_event_selector_1.selector('wheel', 'scope'),
                        "force": true,
                        "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
            {
                "events": { "signal": "six_zoom_delta" },
                "update": "[six_zoom_anchor.x + (domain(\"x\")[0] - six_zoom_anchor.x) * six_zoom_delta, six_zoom_anchor.x + (domain(\"x\")[1] - six_zoom_anchor.x) * six_zoom_delta]"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
            {
                "events": { "signal": "six_zoom_delta" },
                "update": "[six_zoom_anchor.y + (domain(\"y\")[0] - six_zoom_anchor.y) * six_zoom_delta, six_zoom_anchor.y + (domain(\"y\")[1] - six_zoom_anchor.y) * six_zoom_delta]"
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi96b29tLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLDJEQUE4RDtBQUM5RCxvRUFBc0U7QUFDdEUsdUVBQWtFO0FBQ2xFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDbkQsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLElBQUk7U0FDYjtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLElBQUk7U0FDYjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsVUFBVTtTQUNuQjtRQUNELE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxjQUFjO1NBQ3ZCO1FBQ0QsS0FBSyxFQUFF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