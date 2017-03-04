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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi96b29tLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBQzVCLG1DQUEwQztBQUMxQyx5RUFBZ0Y7QUFDaEYsb0VBQXNFO0FBQ3RFLHVFQUFrRTtBQUVsRSxRQUFRLENBQUMsMEJBQTBCLEVBQUU7SUFDbkMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO1NBQzFDO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDbkQsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLElBQUk7U0FDYjtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLElBQUk7U0FDYjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsVUFBVTtTQUNuQjtRQUNELE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxjQUFjO1NBQ3ZCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVU7WUFDbEIsTUFBTSxFQUFFLFFBQVE7U0FDakI7S0FDRixDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsaUNBQWlDLEVBQUU7UUFDcEMsYUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsYUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsYUFBTSxDQUFDLE9BQU8sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsdUNBQXVDLEVBQUU7UUFDMUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUM7UUFDckQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO1lBQ2pDO2dCQUNFLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLElBQUksRUFBRTtvQkFDSjt3QkFDRSxRQUFRLEVBQUUsd0JBQWEsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUM7d0JBQ3JELFFBQVEsRUFBRSx3REFBd0Q7cUJBQ25FO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxNQUFNLEVBQUUsaUJBQWlCO2dCQUN6QixJQUFJLEVBQUU7b0JBQ0o7d0JBQ0UsUUFBUSxFQUFFLHdCQUFhLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDO3dCQUNyRCxPQUFPLEVBQUUsSUFBSTt3QkFDYixRQUFRLEVBQUUscURBQXFEO3FCQUNoRTtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUMxRTtnQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUM7Z0JBQ3ZDLFFBQVEsRUFBRSw2TUFBNk07YUFDeE47U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzFFO2dCQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQztnQkFDdkMsUUFBUSxFQUFFLDhNQUE4TTthQUN6TjtTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDN0U7Z0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDO2dCQUN2QyxRQUFRLEVBQUUseUhBQXlIO2FBQ3BJO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUU7UUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUM7UUFDckQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO1lBQ2pDO2dCQUNFLE1BQU0sRUFBRSxrQkFBa0I7Z0JBQzFCLElBQUksRUFBRTtvQkFDSjt3QkFDRSxRQUFRLEVBQUUsd0JBQWEsQ0FBQyxzQ0FBc0MsRUFBRSxPQUFPLENBQUM7d0JBQ3hFLFFBQVEsRUFBRSx3REFBd0Q7cUJBQ25FO2lCQUNGO2FBQ0Y7WUFDRDtnQkFDRSxNQUFNLEVBQUUsaUJBQWlCO2dCQUN6QixJQUFJLEVBQUU7b0JBQ0o7d0JBQ0UsUUFBUSxFQUFFLHdCQUFhLENBQUMsc0NBQXNDLEVBQUUsT0FBTyxDQUFDO3dCQUN4RSxPQUFPLEVBQUUsSUFBSTt3QkFDYixRQUFRLEVBQUUscURBQXFEO3FCQUNoRTtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUMxRTtnQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUM7Z0JBQ3ZDLFFBQVEsRUFBRSw2TUFBNk07YUFDeE47U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQzFFO2dCQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxpQkFBaUIsRUFBQztnQkFDdkMsUUFBUSxFQUFFLDhNQUE4TTthQUN6TjtTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxXQUFXLEVBQXRCLENBQXNCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDN0U7Z0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLGlCQUFpQixFQUFDO2dCQUN2QyxRQUFRLEVBQUUseUhBQXlIO2FBQ3BJO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscUNBQXFDLEVBQUU7UUFDeEMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsRUFBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFDLENBQUM7UUFDbkQsSUFBTSxPQUFPLEdBQUcsU0FBUyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN6RCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO1lBQ2pDO2dCQUNFLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLElBQUksRUFBRTtvQkFDSjt3QkFDRSxRQUFRLEVBQUUsd0JBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDO3dCQUN6QyxRQUFRLEVBQUUsd0RBQXdEO3FCQUNuRTtpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLGdCQUFnQjtnQkFDeEIsSUFBSSxFQUFFO29CQUNKO3dCQUNFLFFBQVEsRUFBRSx3QkFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUM7d0JBQ3pDLE9BQU8sRUFBRSxJQUFJO3dCQUNiLFFBQVEsRUFBRSxxREFBcUQ7cUJBQ2hFO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFsQixDQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO1lBQ3pFO2dCQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQztnQkFDdEMsUUFBUSxFQUFFLDRKQUE0SjthQUN2SztTQUNGLENBQUMsQ0FBQztRQUVILGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxPQUFPLEVBQWxCLENBQWtCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDekU7Z0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFDO2dCQUN0QyxRQUFRLEVBQUUsNEpBQTRKO2FBQ3ZLO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9