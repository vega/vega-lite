/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
var selection = require("../../../src/compile/selection/selection");
var zoom_1 = require("../../../src/compile/selection/transforms/zoom");
describe('Zoom Selection Transform', function () {
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
        }
    });
    it('identifies transform invocation', function () {
        chai_1.assert.isFalse(zoom_1.default.has(selCmpts['one']));
        chai_1.assert.isFalse(zoom_1.default.has(selCmpts['two']));
        chai_1.assert.isFalse(zoom_1.default.has(selCmpts['three']));
        chai_1.assert.isTrue(zoom_1.default.has(selCmpts['four']));
        chai_1.assert.isTrue(zoom_1.default.has(selCmpts['five']));
        chai_1.assert.isTrue(zoom_1.default.has(selCmpts['six']));
    });
    it('builds signals for default invocation', function () {
        model.component.selection = { four: selCmpts['four'] };
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "four_zoom_anchor",
                "on": [
                    {
                        "events": event_selector_1.default('@four_brush:wheel', 'scope'),
                        "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
                    }
                ]
            },
            {
                "name": "four_zoom_delta",
                "on": [
                    {
                        "events": event_selector_1.default('@four_brush:wheel', 'scope'),
                        "force": true,
                        "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
            {
                "events": { "signal": "four_zoom_delta" },
                "update": "clampRange([four_zoom_anchor.x + (four_x[0] - four_zoom_anchor.x) * four_zoom_delta, four_zoom_anchor.x + (four_x[1] - four_zoom_anchor.x) * four_zoom_delta], invert(\"x\", 0), invert(\"x\", unit.width))"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
            {
                "events": { "signal": "four_zoom_delta" },
                "update": "clampRange([four_zoom_anchor.y + (four_y[0] - four_zoom_anchor.y) * four_zoom_delta, four_zoom_anchor.y + (four_y[1] - four_zoom_anchor.y) * four_zoom_delta], invert(\"y\", unit.height), invert(\"y\", 0))"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_size'; })[0].on, [
            {
                "events": { "signal": "four_zoom_delta" },
                "update": "{x: four_size.x, y: four_size.y, width: four_size.width * four_zoom_delta , height: four_size.height * four_zoom_delta}"
            }
        ]);
    });
    it('builds signals for custom events', function () {
        model.component.selection = { five: selCmpts['five'] };
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "five_zoom_anchor",
                "on": [
                    {
                        "events": event_selector_1.default('@five_brush:wheel, @five_brush:pinch', 'scope'),
                        "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
                    }
                ]
            },
            {
                "name": "five_zoom_delta",
                "on": [
                    {
                        "events": event_selector_1.default('@five_brush:wheel, @five_brush:pinch', 'scope'),
                        "force": true,
                        "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_x'; })[0].on, [
            {
                "events": { "signal": "five_zoom_delta" },
                "update": "clampRange([five_zoom_anchor.x + (five_x[0] - five_zoom_anchor.x) * five_zoom_delta, five_zoom_anchor.x + (five_x[1] - five_zoom_anchor.x) * five_zoom_delta], invert(\"x\", 0), invert(\"x\", unit.width))"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_y'; })[0].on, [
            {
                "events": { "signal": "five_zoom_delta" },
                "update": "clampRange([five_zoom_anchor.y + (five_y[0] - five_zoom_anchor.y) * five_zoom_delta, five_zoom_anchor.y + (five_y[1] - five_zoom_anchor.y) * five_zoom_delta], invert(\"y\", unit.height), invert(\"y\", 0))"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'five_size'; })[0].on, [
            {
                "events": { "signal": "five_zoom_delta" },
                "update": "{x: five_size.x, y: five_size.y, width: five_size.width * five_zoom_delta , height: five_size.height * five_zoom_delta}"
            }
        ]);
    });
    it('builds signals for scale-bound zoom', function () {
        model.component.selection = { six: selCmpts['six'] };
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "six_zoom_anchor",
                "on": [
                    {
                        "events": event_selector_1.default('wheel', 'scope'),
                        "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
                    }
                ]
            },
            {
                "name": "six_zoom_delta",
                "on": [
                    {
                        "events": event_selector_1.default('wheel', 'scope'),
                        "force": true,
                        "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                    }
                ]
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_x'; })[0].on, [
            {
                "events": { "signal": "six_zoom_delta" },
                "update": "[six_zoom_anchor.x + (domain(\"x\")[0] - six_zoom_anchor.x) * six_zoom_delta, six_zoom_anchor.x + (domain(\"x\")[1] - six_zoom_anchor.x) * six_zoom_delta]"
            }
        ]);
        chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_y'; })[0].on, [
            {
                "events": { "signal": "six_zoom_delta" },
                "update": "[six_zoom_anchor.y + (domain(\"y\")[0] - six_zoom_anchor.y) * six_zoom_delta, six_zoom_anchor.y + (domain(\"y\")[1] - six_zoom_anchor.y) * six_zoom_delta]"
            }
        ]);
    });
});
//# sourceMappingURL=zoom.test.js.map