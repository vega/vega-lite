"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var zoom_1 = tslib_1.__importDefault(require("../../../src/compile/selection/transforms/zoom"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi96b29tLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBOEQ7QUFDOUQsMEZBQXNFO0FBQ3RFLGdHQUFrRTtBQUVsRSxtQ0FBMEM7QUFFMUMsa0JBQWtCLE1BQWtCLEVBQUUsTUFBa0I7SUFDdEQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxRQUFRLEVBQUMsRUFBQztZQUMxRixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFFBQVEsRUFBQyxFQUFDO1lBQ2hHLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQ25ELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRO1NBQ2pCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLE9BQU87U0FDaEI7UUFDRCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsVUFBVTtZQUNsQixNQUFNLEVBQUUsS0FBSztTQUNkO1FBQ0QsTUFBTSxFQUFFO1lBQ04sTUFBTSxFQUFFLFVBQVU7U0FDbkI7UUFDRCxNQUFNLEVB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QUMsa0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssc0JBQXNCLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hGO29CQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQztvQkFDdEMsUUFBUSxFQUFFLDhEQUE4RDtpQkFDekU7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtzZWxlY3RvciBhcyBwYXJzZVNlbGVjdG9yfSBmcm9tICd2ZWdhLWV2ZW50LXNlbGVjdG9yJztcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB6b29tIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3pvb20nO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZnVuY3Rpb24gZ2V0TW9kZWwoeHNjYWxlPzogU2NhbGVUeXBlLCB5c2NhbGU/OiBTY2FsZVR5cGUpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1widHlwZVwiOiB4c2NhbGUgfHwgXCJsaW5lYXJcIn19LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogeXNjYWxlIHx8IFwibGluZWFyXCJ9fSxcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIH1cbiAgfSk7XG5cbiAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICBjb25zdCBzZWxDbXB0cyA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJzaW5nbGVcIlxuICAgIH0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwibXVsdGlcIlxuICAgIH0sXG4gICAgXCJ0aHJlZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJ6b29tXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcImZvdXJcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIlxuICAgIH0sXG4gICAgXCJmaXZlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcInpvb21cIjogXCJ3aGVlbCwgcGluY2hcIlxuICAgIH0sXG4gICAgXCJzaXhcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiYmluZFwiOiBcInNjYWxlc1wiXG4gICAgfSxcbiAgICBcInNldmVuXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcInpvb21cIjogbnVsbFxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHttb2RlbCwgc2VsQ21wdHN9O1xufVxuXG5kZXNjcmliZSgnWm9vbSBTZWxlY3Rpb24gVHJhbnNmb3JtJywgZnVuY3Rpb24oKSB7XG5cbiAgaXQoJ2lkZW50aWZpZXMgdHJhbnNmb3JtIGludm9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB7bW9kZWw6IF9tb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHpvb20uaGFzKHNlbENtcHRzWydvbmUnXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUoem9vbS5oYXMoc2VsQ21wdHNbJ3R3byddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh6b29tLmhhcyhzZWxDbXB0c1sndGhyZWUnXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKHpvb20uaGFzKHNlbENtcHRzWydmb3VyJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh6b29tLmhhcyhzZWxDbXB0c1snZml2ZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2Uoem9vbS5oYXMoc2VsQ21wdHNbJ3NpeCddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh6b29tLmhhcyhzZWxDbXB0c1snc2V2ZW4nXSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnQW5jaG9yL0RlbHRhIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYnVpbGRzIHRoZW4gZm9yIGRlZmF1bHQgaW52b2NhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmb3VyOiBzZWxDbXB0c1snZm91ciddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmb3VyX3pvb21fYW5jaG9yXCIsXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ0Bmb3VyX2JydXNoOndoZWVsIScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiB4KHVuaXQpLCB5OiB5KHVuaXQpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZm91cl96b29tX2RlbHRhXCIsXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ0Bmb3VyX2JydXNoOndoZWVsIScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcImZvcmNlXCI6IHRydWUsXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwicG93KDEuMDAxLCBldmVudC5kZWx0YVkgKiBwb3coMTYsIGV2ZW50LmRlbHRhTW9kZSkpXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB0aGVtIGZvciBjdXN0b20gZXZlbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZpdmU6IHNlbENtcHRzWydmaXZlJ119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZpdmVfem9vbV9hbmNob3JcIixcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignQGZpdmVfYnJ1c2g6d2hlZWwsIEBmaXZlX2JydXNoOnBpbmNoJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IHgodW5pdCksIHk6IHkodW5pdCl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmaXZlX3pvb21fZGVsdGFcIixcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignQGZpdmVfYnJ1c2g6d2hlZWwsIEBmaXZlX2JydXNoOnBpbmNoJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwiZm9yY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJwb3coMS4wMDEsIGV2ZW50LmRlbHRhWSAqIHBvdygxNiwgZXZlbnQuZGVsdGFNb2RlKSlcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHRoZW0gZm9yIHNjYWxlLWJvdW5kIHpvb20nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7c2l4OiBzZWxDbXB0c1snc2l4J119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInNpeF96b29tX2FuY2hvclwiLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCd3aGVlbCEnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogaW52ZXJ0KFxcXCJ4XFxcIiwgeCh1bml0KSksIHk6IGludmVydChcXFwieVxcXCIsIHkodW5pdCkpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwic2l4X3pvb21fZGVsdGFcIixcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3Rvcignd2hlZWwhJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwiZm9yY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJwb3coMS4wMDEsIGV2ZW50LmRlbHRhWSAqIHBvdygxNiwgZXZlbnQuZGVsdGFNb2RlKSlcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdab29tIFNpZ25hbCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdhbHdheXMgYnVpbGRzIHpvb21MaW5lYXIgZXhwcnMgZm9yIGJydXNoZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zm91cjogc2VsQ21wdHNbJ2ZvdXInXX07XG4gICAgICBsZXQgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeCcpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHpvb21MaW5lYXIoZm91cl94LCBmb3VyX3pvb21fYW5jaG9yLngsIGZvdXJfem9vbV9kZWx0YSksIDAsIHdpZHRoKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3knKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZSh6b29tTGluZWFyKGZvdXJfeSwgZm91cl96b29tX2FuY2hvci55LCBmb3VyX3pvb21fZGVsdGEpLCAwLCBoZWlnaHQpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsMiA9IGdldE1vZGVsKCdsb2cnLCAncG93JykubW9kZWw7XG4gICAgICBtb2RlbDIuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmb3VyOiBzZWxDbXB0c1snZm91ciddfTtcbiAgICAgIHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbDIsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeCcpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHpvb21MaW5lYXIoZm91cl94LCBmb3VyX3pvb21fYW5jaG9yLngsIGZvdXJfem9vbV9kZWx0YSksIDAsIHdpZHRoKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3knKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZSh6b29tTGluZWFyKGZvdXJfeSwgZm91cl96b29tX2FuY2hvci55LCBmb3VyX3pvb21fZGVsdGEpLCAwLCBoZWlnaHQpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHpvb21MaW5lYXIgZXhwcnMgZm9yIHNjYWxlLWJvdW5kIHpvb20nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7c2l4OiBzZWxDbXB0c1snc2l4J119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9Ib3JzZXBvd2VyJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiem9vbUxpbmVhcihkb21haW4oXFxcInhcXFwiKSwgc2l4X3pvb21fYW5jaG9yLngsIHNpeF96b29tX2RlbHRhKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfTWlsZXNfcGVyX0dhbGxvbicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInpvb21MaW5lYXIoZG9tYWluKFxcXCJ5XFxcIiksIHNpeF96b29tX2FuY2hvci55LCBzaXhfem9vbV9kZWx0YSlcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgem9vbUxvZy9Qb3cgZXhwcnMgZm9yIHNjYWxlLWJvdW5kIHpvb20nLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoJ2xvZycsICdwb3cnKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7c2l4OiBzZWxDbXB0c1snc2l4J119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9Ib3JzZXBvd2VyJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiem9vbUxvZyhkb21haW4oXFxcInhcXFwiKSwgc2l4X3pvb21fYW5jaG9yLngsIHNpeF96b29tX2RlbHRhKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfTWlsZXNfcGVyX0dhbGxvbicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInpvb21Qb3coZG9tYWluKFxcXCJ5XFxcIiksIHNpeF96b29tX2FuY2hvci55LCBzaXhfem9vbV9kZWx0YSwgMSlcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==