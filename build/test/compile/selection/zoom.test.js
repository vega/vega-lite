"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = require("../../../src/compile/selection/selection");
var zoom_1 = require("../../../src/compile/selection/transforms/zoom");
var util_1 = require("../../util");
function getModel(xscale, yscale) {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative", "scale": { "type": xscale || "linear" } },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative", "scale": { "type": yscale || "linear" } },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    model.parseScale();
    var selCmpts = selection.parseUnitSelection(model, {
        "one": {
            "type": "single"
        },
        "two": {
            "type": "multi"
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
        "seven": {
            "type": "interval",
            "zoom": null
        }
    });
    return { model: model, selCmpts: selCmpts };
}
describe('Zoom Selection Transform', function () {
    it('identifies transform invocation', function () {
        var _a = getModel(), _model = _a.model, selCmpts = _a.selCmpts;
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['one']));
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['three']));
        chai_1.assert.isNotFalse(zoom_1.default.has(selCmpts['four']));
        chai_1.assert.isNotFalse(zoom_1.default.has(selCmpts['five']));
        chai_1.assert.isNotFalse(zoom_1.default.has(selCmpts['six']));
        chai_1.assert.isNotTrue(zoom_1.default.has(selCmpts['seven']));
    });
    describe('Anchor/Delta signals', function () {
        it('builds then for default invocation', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { four: selCmpts['four'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals, [
                {
                    "name": "four_zoom_anchor",
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('@four_brush:wheel!', 'scope'),
                            "update": "{x: x(unit), y: y(unit)}"
                        }
                    ]
                },
                {
                    "name": "four_zoom_delta",
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('@four_brush:wheel!', 'scope'),
                            "force": true,
                            "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                        }
                    ]
                }
            ]);
        });
        it('builds them for custom events', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
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
        });
        it('builds them for scale-bound zoom', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals, [
                {
                    "name": "six_zoom_anchor",
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('wheel!', 'scope'),
                            "update": "{x: invert(\"x\", x(unit)), y: invert(\"y\", y(unit))}"
                        }
                    ]
                },
                {
                    "name": "six_zoom_delta",
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('wheel!', 'scope'),
                            "force": true,
                            "update": "pow(1.001, event.deltaY * pow(16, event.deltaMode))"
                        }
                    ]
                }
            ]);
        });
    });
    describe('Zoom Signal', function () {
        it('always builds zoomLinear exprs for brushes', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { four: selCmpts['four'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    "events": { "signal": "four_zoom_delta" },
                    "update": "clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    "events": { "signal": "four_zoom_delta" },
                    "update": "clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)"
                }
            ]);
            var model2 = getModel('log', 'pow').model;
            model2.component.selection = { four: selCmpts['four'] };
            signals = selection.assembleUnitSelectionSignals(model2, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    "events": { "signal": "four_zoom_delta" },
                    "update": "clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    "events": { "signal": "four_zoom_delta" },
                    "update": "clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)"
                }
            ]);
        });
        it('builds zoomLinear exprs for scale-bound zoom', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    "events": { "signal": "six_zoom_delta" },
                    "update": "zoomLinear(domain(\"x\"), six_zoom_anchor.x, six_zoom_delta)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    "events": { "signal": "six_zoom_delta" },
                    "update": "zoomLinear(domain(\"y\"), six_zoom_anchor.y, six_zoom_delta)"
                }
            ]);
        });
        it('builds zoomLog/Pow exprs for scale-bound zoom', function () {
            var _a = getModel('log', 'pow'), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    "events": { "signal": "six_zoom_delta" },
                    "update": "zoomLog(domain(\"x\"), six_zoom_anchor.x, six_zoom_delta)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    "events": { "signal": "six_zoom_delta" },
                    "update": "zoomPow(domain(\"y\"), six_zoom_anchor.y, six_zoom_delta, 1)"
                }
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi96b29tLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLDJEQUE4RDtBQUM5RCxvRUFBc0U7QUFDdEUsdUVBQWtFO0FBRWxFLG1DQUEwQztBQUUxQyxrQkFBa0IsTUFBa0IsRUFBRSxNQUFrQjtJQUN0RCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFFBQVEsRUFBQyxFQUFDO1lBQzFGLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksUUFBUSxFQUFDLEVBQUM7WUFDaEcsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDbkQsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVE7U0FDakI7UUFDRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTztTQUNoQjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsVUFBVTtTQUNuQjtRQUNELE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxjQUFjO1NBQ3ZCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVU7WUFDbEIsTUFBTSxFQUFFLFFBQVE7U0FDakI7UUFDRCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsVUFBVTtZQUNsQixNQUFNLEVBQUUsSUFBSTtTQUNiO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEVBQUMsS0FBSyxPQUFBLEVBQUUsUUFBUSxVQUFBLEVBQUMsQ0FBQztBQUMzQixDQUFDO0FBRUQsUUFBUSxDQUFDLDBCQUEwQixFQUFFO0lBRW5DLEVBQUUsQ0FBQyxpQ0FBaUMsRUFBRTtRQUM5QixJQUFBLGVBQXNDLEVBQXJDLGlCQUFhLEVBQUUsc0JBQVEsQ0FBZTtRQUM3QyxhQUFNLENBQUMsU0FBUyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxhQUFNLENBQUMsU0FBUyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QyxhQUFNLENBQUMsU0FBUyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxhQUFNLENBQUMsVUFBVSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxhQUFNLENBQUMsVUFBVSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxhQUFNLENBQUMsVUFBVSxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QyxhQUFNLENBQUMsU0FBUyxDQUFDLGNBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtRQUMvQixFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDakMsSUFBQSxlQUE4QixFQUE3QixnQkFBSyxFQUFFLHNCQUFRLENBQWU7WUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUM7WUFDckQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUNsRSxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO2dCQUNqQztvQkFDRSxNQUFNLEVBQUUsa0JBQWtCO29CQUMxQixJQUFJLEVBQUU7d0JBQ0o7NEJBQ0UsUUFBUSxFQUFFLDhCQUFhLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDOzRCQUN0RCxRQUFRLEVBQUUsMEJBQTBCO3lCQUNyQztxQkFDRjtpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsaUJBQWlCO29CQUN6QixJQUFJLEVBQUU7d0JBQ0o7NEJBQ0UsUUFBUSxFQUFFLDhCQUFhLENBQUMsb0JBQW9CLEVBQUUsT0FBTyxDQUFDOzRCQUN0RCxPQUFPLEVBQUUsSUFBSTs0QkFDYixRQUFRLEVBQUUscURBQXFEO3lCQUNoRTtxQkFDRjtpQkFDRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLCtCQUErQixFQUFFO1lBQzVCLElBQUEsZUFBOEIsRUFBN0IsZ0JBQUssRUFBRSxzQkFBUSxDQUFlO1lBQ3JDLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDO1lBQ3JELElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFDbEUsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtnQkFDakM7b0JBQ0UsTUFBTSxFQUFFLGtCQUFrQjtvQkFDMUIsSUFBSSxFQUFFO3dCQUNKOzRCQUNFLFFBQVEsRUFBRSw4QkFBYSxDQUFDLHNDQUFzQyxFQUFFLE9BQU8sQ0FBQzs0QkFDeEUsUUFBUSxFQUFFLDBCQUEwQjt5QkFDckM7cUJBQ0Y7aUJBQ0Y7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLGlCQUFpQjtvQkFDekIsSUFBSSxFQUFFO3dCQUNKOzRCQUNFLFFBQVEsRUFBRSw4QkFBYSxDQUFDLHNDQUFzQyxFQUFFLE9BQU8sQ0FBQzs0QkFDeEUsT0FBTyxFQUFFLElBQUk7NEJBQ2IsUUFBUSxFQUFFLHFEQUFxRDt5QkFDaEU7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxrQ0FBa0MsRUFBRTtZQUMvQixJQUFBLGVBQThCLEVBQTdCLGdCQUFLLEVBQUUsc0JBQVEsQ0FBZTtZQUNyQyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxFQUFDLEdBQUcsRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUMsQ0FBQztZQUNuRCxJQUFNLE9BQU8sR0FBRyxTQUFTLENBQUMsNEJBQTRCLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQ2xFLGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDO29CQUNFLE1BQU0sRUFBRSxpQkFBaUI7b0JBQ3pCLElBQUksRUFBRTt3QkFDSjs0QkFDRSxRQUFRLEVBQUUsOEJBQWEsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDOzRCQUMxQyxRQUFRLEVBQUUsd0RBQXdEO3lCQUNuRTtxQkFDRjtpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixJQUFJLEVBQUU7d0JBQ0o7NEJBQ0UsUUFBUSxFQUFFLDhCQUFhLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQzs0QkFDMUMsT0FBTyxFQUFFLElBQUk7NEJBQ2IsUUFBUSxFQUFFLHFEQUFxRDt5QkFDaEU7cUJBQ0Y7aUJBQ0Y7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixFQUFFLENBQUMsNENBQTRDLEVBQUU7WUFDekMsSUFBQSxlQUE4QixFQUE3QixnQkFBSyxFQUFFLHNCQUFRLENBQWU7WUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUM7WUFDckQsSUFBSSxPQUFPLEdBQUcsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVoRSxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMxRTtvQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUM7b0JBQ3ZDLFFBQVEsRUFBRSwrRUFBK0U7aUJBQzFGO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDMUU7b0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDO29CQUN2QyxRQUFRLEVBQUUsZ0ZBQWdGO2lCQUMzRjthQUNGLENBQUMsQ0FBQztZQUVILElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDO1lBQ3RELE9BQU8sR0FBRyxTQUFTLENBQUMsNEJBQTRCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBQzdELGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQW5CLENBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQzFFO29CQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQztvQkFDdkMsUUFBUSxFQUFFLCtFQUErRTtpQkFDMUY7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUMxRTtvQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUM7b0JBQ3ZDLFFBQVEsRUFBRSxnRkFBZ0Y7aUJBQzNGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDM0MsSUFBQSxlQUE4QixFQUE3QixnQkFBSyxFQUFFLHNCQUFRLENBQWU7WUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7WUFDbkQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLDRCQUE0QixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztZQUVsRSxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLEVBQTNCLENBQTJCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xGO29CQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQztvQkFDdEMsUUFBUSxFQUFFLDhEQUE4RDtpQkFDekU7YUFDRixDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssc0JBQXNCLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hGO29CQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQztvQkFDdEMsUUFBUSxFQUFFLDhEQUE4RDtpQkFDekU7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUM1QyxJQUFBLDJCQUEwQyxFQUF6QyxnQkFBSyxFQUFFLHNCQUFRLENBQTJCO1lBQ2pELEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLEVBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDO1lBQ25ELElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFbEUsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLGdCQUFnQixFQUEzQixDQUEyQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUNsRjtvQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUM7b0JBQ3RDLFFBQVEsRUFBRSwyREFBMkQ7aUJBQ3RFO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLHNCQUFzQixFQUFqQyxDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN4RjtvQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsZ0JBQWdCLEVBQUM7b0JBQ3RDLFFBQVEsRUFBRSw4REFBOEQ7aUJBQ3pFO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7c2VsZWN0b3IgYXMgcGFyc2VTZWxlY3Rvcn0gZnJvbSAndmVnYS1ldmVudC1zZWxlY3Rvcic7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQgem9vbSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vdHJhbnNmb3Jtcy96b29tJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi8uLi8uLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIGdldE1vZGVsKHhzY2FsZT86IFNjYWxlVHlwZSwgeXNjYWxlPzogU2NhbGVUeXBlKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogeHNjYWxlIHx8IFwibGluZWFyXCJ9fSxcbiAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHlzY2FsZSB8fCBcImxpbmVhclwifX0sXG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9XG4gIH0pO1xuXG4gIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgY29uc3Qgc2VsQ21wdHMgPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsLCB7XG4gICAgXCJvbmVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwic2luZ2xlXCJcbiAgICB9LFxuICAgIFwidHdvXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIm11bHRpXCJcbiAgICB9LFxuICAgIFwidGhyZWVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiem9vbVwiOiBmYWxzZVxuICAgIH0sXG4gICAgXCJmb3VyXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCJcbiAgICB9LFxuICAgIFwiZml2ZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJ6b29tXCI6IFwid2hlZWwsIHBpbmNoXCJcbiAgICB9LFxuICAgIFwic2l4XCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcImJpbmRcIjogXCJzY2FsZXNcIlxuICAgIH0sXG4gICAgXCJzZXZlblwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJ6b29tXCI6IG51bGxcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7bW9kZWwsIHNlbENtcHRzfTtcbn1cblxuZGVzY3JpYmUoJ1pvb20gU2VsZWN0aW9uIFRyYW5zZm9ybScsIGZ1bmN0aW9uKCkge1xuXG4gIGl0KCdpZGVudGlmaWVzIHRyYW5zZm9ybSBpbnZvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qge21vZGVsOiBfbW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh6b29tLmhhcyhzZWxDbXB0c1snb25lJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHpvb20uaGFzKHNlbENtcHRzWyd0d28nXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUoem9vbS5oYXMoc2VsQ21wdHNbJ3RocmVlJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh6b29tLmhhcyhzZWxDbXB0c1snZm91ciddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2Uoem9vbS5oYXMoc2VsQ21wdHNbJ2ZpdmUnXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKHpvb20uaGFzKHNlbENtcHRzWydzaXgnXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUoem9vbS5oYXMoc2VsQ21wdHNbJ3NldmVuJ10pKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FuY2hvci9EZWx0YSBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2J1aWxkcyB0aGVuIGZvciBkZWZhdWx0IGludm9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zm91cjogc2VsQ21wdHNbJ2ZvdXInXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZm91cl96b29tX2FuY2hvclwiLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdAZm91cl9icnVzaDp3aGVlbCEnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogeCh1bml0KSwgeTogeSh1bml0KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZvdXJfem9vbV9kZWx0YVwiLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdAZm91cl9icnVzaDp3aGVlbCEnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJmb3JjZVwiOiB0cnVlLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInBvdygxLjAwMSwgZXZlbnQuZGVsdGFZICogcG93KDE2LCBldmVudC5kZWx0YU1vZGUpKVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgdGhlbSBmb3IgY3VzdG9tIGV2ZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmaXZlOiBzZWxDbXB0c1snZml2ZSddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmaXZlX3pvb21fYW5jaG9yXCIsXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ0BmaXZlX2JydXNoOndoZWVsLCBAZml2ZV9icnVzaDpwaW5jaCcsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiB4KHVuaXQpLCB5OiB5KHVuaXQpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZml2ZV96b29tX2RlbHRhXCIsXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ0BmaXZlX2JydXNoOndoZWVsLCBAZml2ZV9icnVzaDpwaW5jaCcsICdzY29wZScpLFxuICAgICAgICAgICAgICBcImZvcmNlXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwicG93KDEuMDAxLCBldmVudC5kZWx0YVkgKiBwb3coMTYsIGV2ZW50LmRlbHRhTW9kZSkpXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB0aGVtIGZvciBzY2FsZS1ib3VuZCB6b29tJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3NpeDogc2VsQ21wdHNbJ3NpeCddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJzaXhfem9vbV9hbmNob3JcIixcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3Rvcignd2hlZWwhJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IGludmVydChcXFwieFxcXCIsIHgodW5pdCkpLCB5OiBpbnZlcnQoXFxcInlcXFwiLCB5KHVuaXQpKX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInNpeF96b29tX2RlbHRhXCIsXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ3doZWVsIScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcImZvcmNlXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwicG93KDEuMDAxLCBldmVudC5kZWx0YVkgKiBwb3coMTYsIGV2ZW50LmRlbHRhTW9kZSkpXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnWm9vbSBTaWduYWwnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYWx3YXlzIGJ1aWxkcyB6b29tTGluZWFyIGV4cHJzIGZvciBicnVzaGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZvdXI6IHNlbENtcHRzWydmb3VyJ119O1xuICAgICAgbGV0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3gnKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZSh6b29tTGluZWFyKGZvdXJfeCwgZm91cl96b29tX2FuY2hvci54LCBmb3VyX3pvb21fZGVsdGEpLCAwLCB3aWR0aClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl95JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2Uoem9vbUxpbmVhcihmb3VyX3ksIGZvdXJfem9vbV9hbmNob3IueSwgZm91cl96b29tX2RlbHRhKSwgMCwgaGVpZ2h0KVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBtb2RlbDIgPSBnZXRNb2RlbCgnbG9nJywgJ3BvdycpLm1vZGVsO1xuICAgICAgbW9kZWwyLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zm91cjogc2VsQ21wdHNbJ2ZvdXInXX07XG4gICAgICBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwyLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3gnKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZSh6b29tTGluZWFyKGZvdXJfeCwgZm91cl96b29tX2FuY2hvci54LCBmb3VyX3pvb21fZGVsdGEpLCAwLCB3aWR0aClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl95JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2Uoem9vbUxpbmVhcihmb3VyX3ksIGZvdXJfem9vbV9hbmNob3IueSwgZm91cl96b29tX2RlbHRhKSwgMCwgaGVpZ2h0KVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB6b29tTGluZWFyIGV4cHJzIGZvciBzY2FsZS1ib3VuZCB6b29tJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3NpeDogc2VsQ21wdHNbJ3NpeCddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfSG9yc2Vwb3dlcicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInpvb21MaW5lYXIoZG9tYWluKFxcXCJ4XFxcIiksIHNpeF96b29tX2FuY2hvci54LCBzaXhfem9vbV9kZWx0YSlcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X01pbGVzX3Blcl9HYWxsb24nKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJ6b29tTGluZWFyKGRvbWFpbihcXFwieVxcXCIpLCBzaXhfem9vbV9hbmNob3IueSwgc2l4X3pvb21fZGVsdGEpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHpvb21Mb2cvUG93IGV4cHJzIGZvciBzY2FsZS1ib3VuZCB6b29tJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCdsb2cnLCAncG93Jyk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3NpeDogc2VsQ21wdHNbJ3NpeCddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfSG9yc2Vwb3dlcicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInpvb21Mb2coZG9tYWluKFxcXCJ4XFxcIiksIHNpeF96b29tX2FuY2hvci54LCBzaXhfem9vbV9kZWx0YSlcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X01pbGVzX3Blcl9HYWxsb24nKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJ6b29tUG93KGRvbWFpbihcXFwieVxcXCIpLCBzaXhfem9vbV9hbmNob3IueSwgc2l4X3pvb21fZGVsdGEsIDEpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=