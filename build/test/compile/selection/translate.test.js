/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
var selection = require("../../../src/compile/selection/selection");
var translate_1 = require("../../../src/compile/selection/transforms/translate");
describe('Translate Selection Transform', function () {
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
            "translate": true
        },
        "two": {
            "type": "multi",
            "translate": true
        },
        "three": {
            "type": "interval",
            "translate": false
        },
        "four": {
            "type": "interval"
        },
        "five": {
            "type": "interval",
            "translate": "[mousedown, mouseup] > mousemove, [keydown, keyup] > touchmove"
        },
        "six": {
            "type": "interval",
            "bind": "scales"
        }
    });
    it('identifies transform invocation', function () {
        chai_1.assert.isFalse(translate_1.default.has(selCmpts['one']));
        chai_1.assert.isFalse(translate_1.default.has(selCmpts['two']));
        chai_1.assert.isFalse(translate_1.default.has(selCmpts['three']));
        chai_1.assert.isTrue(translate_1.default.has(selCmpts['four']));
        chai_1.assert.isTrue(translate_1.default.has(selCmpts['five']));
        chai_1.assert.isTrue(translate_1.default.has(selCmpts['six']));
    });
    it('builds signals for default invocation', function () {
        model.component.selection = { four: selCmpts['four'] };
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "four_translate_anchor",
                "value": {},
                "on": [
                    {
                        "events": event_selector_1.default('@four_brush:mousedown', 'scope'),
                        "update": "{x: x(unit), y: y(unit), width: four_size.width, height: four_size.height, extent_x: slice(four_x), extent_y: slice(four_y), }"
                    }
                ]
            },
            {
                "name": "four_translate_delta",
                "value": {},
                "on": [
                    {
                        "events": event_selector_1.default('[@four_brush:mousedown, window:mouseup] > window:mousemove!', 'scope'),
                        "update": "{x: x(unit) - four_translate_anchor.x, y: y(unit) - four_translate_anchor.y}"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
            {
                "events": { "signal": "four_translate_delta" },
                "update": "clampRange([four_translate_anchor.extent_x[0] + abs(span(four_translate_anchor.extent_x)) * four_translate_delta.x / four_translate_anchor.width, four_translate_anchor.extent_x[1] + abs(span(four_translate_anchor.extent_x)) * four_translate_delta.x / four_translate_anchor.width], invert(\"x\", 0), invert(\"x\", unit.width))"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
            {
                "events": { "signal": "four_translate_delta" },
                "update": "clampRange([four_translate_anchor.extent_y[0] - abs(span(four_translate_anchor.extent_y)) * four_translate_delta.y / four_translate_anchor.height, four_translate_anchor.extent_y[1] - abs(span(four_translate_anchor.extent_y)) * four_translate_delta.y / four_translate_anchor.height], invert(\"y\", unit.height), invert(\"y\", 0))"
            }
        ]);
    });
    it('builds signals for custom events', function () {
        model.component.selection = { five: selCmpts['five'] };
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "five_translate_anchor",
                "value": {},
                "on": [
                    {
                        "events": event_selector_1.default('@five_brush:mousedown, @five_brush:keydown', 'scope'),
                        "update": "{x: x(unit), y: y(unit), width: five_size.width, height: five_size.height, extent_x: slice(five_x), extent_y: slice(five_y), }"
                    }
                ]
            },
            {
                "name": "five_translate_delta",
                "value": {},
                "on": [
                    {
                        "events": event_selector_1.default('[@five_brush:mousedown, mouseup] > mousemove, [@five_brush:keydown, keyup] > touchmove', 'scope'),
                        "update": "{x: x(unit) - five_translate_anchor.x, y: y(unit) - five_translate_anchor.y}"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_x'; })[0].on, [
            {
                "events": { "signal": "five_translate_delta" },
                "update": "clampRange([five_translate_anchor.extent_x[0] + abs(span(five_translate_anchor.extent_x)) * five_translate_delta.x / five_translate_anchor.width, five_translate_anchor.extent_x[1] + abs(span(five_translate_anchor.extent_x)) * five_translate_delta.x / five_translate_anchor.width], invert(\"x\", 0), invert(\"x\", unit.width))"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_y'; })[0].on, [
            {
                "events": { "signal": "five_translate_delta" },
                "update": "clampRange([five_translate_anchor.extent_y[0] - abs(span(five_translate_anchor.extent_y)) * five_translate_delta.y / five_translate_anchor.height, five_translate_anchor.extent_y[1] - abs(span(five_translate_anchor.extent_y)) * five_translate_delta.y / five_translate_anchor.height], invert(\"y\", unit.height), invert(\"y\", 0))"
            }
        ]);
    });
    it('builds signals for scale-bound translate', function () {
        model.component.selection = { six: selCmpts['six'] };
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "six_translate_anchor",
                "value": {},
                "on": [
                    {
                        "events": event_selector_1.default('mousedown', 'scope'),
                        "update": "{x: x(unit), y: y(unit), width: unit.width, height: unit.height, extent_x: domain(\"x\"), extent_y: domain(\"y\"), }"
                    }
                ]
            },
            {
                "name": "six_translate_delta",
                "value": {},
                "on": [
                    {
                        "events": event_selector_1.default('[mousedown, window:mouseup] > window:mousemove!', 'scope'),
                        "update": "{x: x(unit) - six_translate_anchor.x, y: y(unit) - six_translate_anchor.y}"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_x'; })[0].on, [
            {
                "events": { "signal": "six_translate_delta" },
                "update": "[six_translate_anchor.extent_x[0] - abs(span(six_translate_anchor.extent_x)) * six_translate_delta.x / six_translate_anchor.width, six_translate_anchor.extent_x[1] - abs(span(six_translate_anchor.extent_x)) * six_translate_delta.x / six_translate_anchor.width]"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_y'; })[0].on, [
            {
                "events": { "signal": "six_translate_delta" },
                "update": "[six_translate_anchor.extent_y[0] + abs(span(six_translate_anchor.extent_y)) * six_translate_delta.y / six_translate_anchor.height, six_translate_anchor.extent_y[1] + abs(span(six_translate_anchor.extent_y)) * six_translate_delta.y / six_translate_anchor.height]"
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zbGF0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QixtQ0FBMEM7QUFDMUMseUVBQWdGO0FBQ2hGLG9FQUFzRTtBQUN0RSxpRkFBNEU7QUFFNUUsUUFBUSxDQUFDLCtCQUErQixFQUFFO0lBQ3hDLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ3pELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztTQUMxQztLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQ25ELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFdBQVcsRUFBRSxJQUFJO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLE9BQU87WUFDZixXQUFXLEVBQUUsSUFBSTtTQUNsQjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLFdBQVcsRUFBRSxLQUFLO1NBQ25CO1FBQ0QsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLFVBQVU7U0FDbkI7UUFDRCxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsZ0VBQWdFO1NBQzlF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