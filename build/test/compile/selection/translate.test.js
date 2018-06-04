"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var translate_1 = tslib_1.__importDefault(require("../../../src/compile/selection/transforms/translate"));
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
        },
        "seven": {
            "type": "interval",
            "translate": null
        }
    });
    return { model: model, selCmpts: selCmpts };
}
describe('Translate Selection Transform', function () {
    it('identifies transform invocation', function () {
        var _a = getModel(), _model = _a.model, selCmpts = _a.selCmpts;
        chai_1.assert.isNotTrue(translate_1.default.has(selCmpts['one']));
        chai_1.assert.isNotTrue(translate_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(translate_1.default.has(selCmpts['three']));
        chai_1.assert.isNotFalse(translate_1.default.has(selCmpts['four']));
        chai_1.assert.isNotFalse(translate_1.default.has(selCmpts['five']));
        chai_1.assert.isNotFalse(translate_1.default.has(selCmpts['six']));
        chai_1.assert.isNotTrue(translate_1.default.has(selCmpts['seven']));
    });
    describe('Anchor/Delta signals', function () {
        var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
        it('builds them for default invocation', function () {
            model.component.selection = { four: selCmpts['four'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals, [
                {
                    "name": "four_translate_anchor",
                    "value": {},
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('@four_brush:mousedown', 'scope'),
                            "update": "{x: x(unit), y: y(unit), extent_x: slice(four_x), extent_y: slice(four_y)}"
                        }
                    ]
                },
                {
                    "name": "four_translate_delta",
                    "value": {},
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('[@four_brush:mousedown, window:mouseup] > window:mousemove!', 'scope'),
                            "update": "{x: four_translate_anchor.x - x(unit), y: four_translate_anchor.y - y(unit)}"
                        }
                    ]
                }
            ]);
        });
        it('builds them for custom events', function () {
            model.component.selection = { five: selCmpts['five'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals, [
                {
                    "name": "five_translate_anchor",
                    "value": {},
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('@five_brush:mousedown, @five_brush:keydown', 'scope'),
                            "update": "{x: x(unit), y: y(unit), extent_x: slice(five_x), extent_y: slice(five_y)}"
                        }
                    ]
                },
                {
                    "name": "five_translate_delta",
                    "value": {},
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('[@five_brush:mousedown, mouseup] > mousemove, [@five_brush:keydown, keyup] > touchmove', 'scope'),
                            "update": "{x: five_translate_anchor.x - x(unit), y: five_translate_anchor.y - y(unit)}"
                        }
                    ]
                }
            ]);
        });
        it('builds them for scale-bound intervals', function () {
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals, [
                {
                    "name": "six_translate_anchor",
                    "value": {},
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope'),
                            "update": "{x: x(unit), y: y(unit), extent_x: domain(\"x\"), extent_y: domain(\"y\")}"
                        }
                    ]
                },
                {
                    "name": "six_translate_delta",
                    "value": {},
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('[mousedown, window:mouseup] > window:mousemove!', 'scope'),
                            "update": "{x: six_translate_anchor.x - x(unit), y: six_translate_anchor.y - y(unit)}"
                        }
                    ]
                }
            ]);
        });
    });
    describe('Translate Signal', function () {
        it('always builds panLinear exprs for brushes', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { four: selCmpts['four'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)"
                }
            ]);
            var model2 = getModel('log', 'pow').model;
            model2.component.selection = { four: selCmpts['four'] };
            signals = selection.assembleUnitSelectionSignals(model2, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)"
                }
            ]);
        });
        it('builds panLinear exprs for scale-bound intervals', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panLinear(six_translate_anchor.extent_x, -six_translate_delta.x / width)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panLinear(six_translate_anchor.extent_y, six_translate_delta.y / height)"
                }
            ]);
        });
        it('builds panLog/panPow exprs for scale-bound intervals', function () {
            var _a = getModel('log', 'pow'), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panLog(six_translate_anchor.extent_x, -six_translate_delta.x / width)"
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panPow(six_translate_anchor.extent_y, six_translate_delta.y / height, 1)"
                }
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zbGF0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBQzlELDBGQUFzRTtBQUN0RSwwR0FBNEU7QUFFNUUsbUNBQTBDO0FBRTFDLGtCQUFrQixNQUFrQixFQUFFLE1BQWtCO0lBQ3RELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksUUFBUSxFQUFDLEVBQUM7WUFDMUYsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxRQUFRLEVBQUMsRUFBQztZQUNoRyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFFSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDbkIsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUNuRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsUUFBUTtTQUNqQjtRQUNELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxPQUFPO1NBQ2hCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsTUFBTSxFQUFFLFVBQVU7WUFDbEIsV0FBVyxFQUFFLEtBQUs7U0FDbkI7UUFDRCxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsVUFBVTtTQUNuQjtR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LGtCQUFrQixDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLHNCQUFzQixFQUFqQyxDQUFpQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFO2dCQUN4RjtvQkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUscUJBQXFCLEVBQUM7b0JBQzNDLFFBQVEsRUFBRSwwRUFBMEU7aUJBQ3JGO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7c2VsZWN0b3IgYXMgcGFyc2VTZWxlY3Rvcn0gZnJvbSAndmVnYS1ldmVudC1zZWxlY3Rvcic7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQgdHJhbnNsYXRlIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi90cmFuc2Zvcm1zL3RyYW5zbGF0ZSc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBnZXRNb2RlbCh4c2NhbGU/OiBTY2FsZVR5cGUsIHlzY2FsZT86IFNjYWxlVHlwZSkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHhzY2FsZSB8fCBcImxpbmVhclwifX0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1widHlwZVwiOiB5c2NhbGUgfHwgXCJsaW5lYXJcIn19LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcblxuICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gIGNvbnN0IHNlbENtcHRzID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInNpbmdsZVwiXG4gICAgfSxcbiAgICBcInR3b1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJtdWx0aVwiXG4gICAgfSxcbiAgICBcInRocmVlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcInRyYW5zbGF0ZVwiOiBmYWxzZVxuICAgIH0sXG4gICAgXCJmb3VyXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCJcbiAgICB9LFxuICAgIFwiZml2ZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJ0cmFuc2xhdGVcIjogXCJbbW91c2Vkb3duLCBtb3VzZXVwXSA+IG1vdXNlbW92ZSwgW2tleWRvd24sIGtleXVwXSA+IHRvdWNobW92ZVwiXG4gICAgfSxcbiAgICBcInNpeFwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJiaW5kXCI6IFwic2NhbGVzXCJcbiAgICB9LFxuICAgIFwic2V2ZW5cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwidHJhbnNsYXRlXCI6IG51bGxcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiB7bW9kZWwsIHNlbENtcHRzfTtcbn1cblxuZGVzY3JpYmUoJ1RyYW5zbGF0ZSBTZWxlY3Rpb24gVHJhbnNmb3JtJywgZnVuY3Rpb24oKSB7XG4gIGl0KCdpZGVudGlmaWVzIHRyYW5zZm9ybSBpbnZvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qge21vZGVsOiBfbW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWydvbmUnXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1sndHdvJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ3RocmVlJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWydmb3VyJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWydmaXZlJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWydzaXgnXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1snc2V2ZW4nXSkpO1xuICB9KTtcblxuICBkZXNjcmliZSgnQW5jaG9yL0RlbHRhIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG5cbiAgICBpdCgnYnVpbGRzIHRoZW0gZm9yIGRlZmF1bHQgaW52b2NhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmb3VyOiBzZWxDbXB0c1snZm91ciddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmb3VyX3RyYW5zbGF0ZV9hbmNob3JcIixcbiAgICAgICAgICBcInZhbHVlXCI6IHt9LFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdAZm91cl9icnVzaDptb3VzZWRvd24nLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogeCh1bml0KSwgeTogeSh1bml0KSwgZXh0ZW50X3g6IHNsaWNlKGZvdXJfeCksIGV4dGVudF95OiBzbGljZShmb3VyX3kpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZm91cl90cmFuc2xhdGVfZGVsdGFcIixcbiAgICAgICAgICBcInZhbHVlXCI6IHt9LFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdbQGZvdXJfYnJ1c2g6bW91c2Vkb3duLCB3aW5kb3c6bW91c2V1cF0gPiB3aW5kb3c6bW91c2Vtb3ZlIScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiBmb3VyX3RyYW5zbGF0ZV9hbmNob3IueCAtIHgodW5pdCksIHk6IGZvdXJfdHJhbnNsYXRlX2FuY2hvci55IC0geSh1bml0KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHRoZW0gZm9yIGN1c3RvbSBldmVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zml2ZTogc2VsQ21wdHNbJ2ZpdmUnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZml2ZV90cmFuc2xhdGVfYW5jaG9yXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignQGZpdmVfYnJ1c2g6bW91c2Vkb3duLCBAZml2ZV9icnVzaDprZXlkb3duJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IHgodW5pdCksIHk6IHkodW5pdCksIGV4dGVudF94OiBzbGljZShmaXZlX3gpLCBleHRlbnRfeTogc2xpY2UoZml2ZV95KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZpdmVfdHJhbnNsYXRlX2RlbHRhXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW0BmaXZlX2JydXNoOm1vdXNlZG93biwgbW91c2V1cF0gPiBtb3VzZW1vdmUsIFtAZml2ZV9icnVzaDprZXlkb3duLCBrZXl1cF0gPiB0b3VjaG1vdmUnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogZml2ZV90cmFuc2xhdGVfYW5jaG9yLnggLSB4KHVuaXQpLCB5OiBmaXZlX3RyYW5zbGF0ZV9hbmNob3IueSAtIHkodW5pdCl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB0aGVtIGZvciBzY2FsZS1ib3VuZCBpbnRlcnZhbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7c2l4OiBzZWxDbXB0c1snc2l4J119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInNpeF90cmFuc2xhdGVfYW5jaG9yXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignbW91c2Vkb3duJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IHgodW5pdCksIHk6IHkodW5pdCksIGV4dGVudF94OiBkb21haW4oXFxcInhcXFwiKSwgZXh0ZW50X3k6IGRvbWFpbihcXFwieVxcXCIpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwic2l4X3RyYW5zbGF0ZV9kZWx0YVwiLFxuICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1ttb3VzZWRvd24sIHdpbmRvdzptb3VzZXVwXSA+IHdpbmRvdzptb3VzZW1vdmUhJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IHNpeF90cmFuc2xhdGVfYW5jaG9yLnggLSB4KHVuaXQpLCB5OiBzaXhfdHJhbnNsYXRlX2FuY2hvci55IC0geSh1bml0KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdUcmFuc2xhdGUgU2lnbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2Fsd2F5cyBidWlsZHMgcGFuTGluZWFyIGV4cHJzIGZvciBicnVzaGVzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZvdXI6IHNlbENtcHRzWydmb3VyJ119O1xuICAgICAgbGV0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl94JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZShwYW5MaW5lYXIoZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF94LCBmb3VyX3RyYW5zbGF0ZV9kZWx0YS54IC8gc3Bhbihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3gpKSwgMCwgd2lkdGgpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeScpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2UocGFuTGluZWFyKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeSwgZm91cl90cmFuc2xhdGVfZGVsdGEueSAvIHNwYW4oZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF95KSksIDAsIGhlaWdodClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgY29uc3QgbW9kZWwyID0gZ2V0TW9kZWwoJ2xvZycsICdwb3cnKS5tb2RlbDtcbiAgICAgIG1vZGVsMi5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZvdXI6IHNlbENtcHRzWydmb3VyJ119O1xuICAgICAgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsMiwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl94JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZShwYW5MaW5lYXIoZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF94LCBmb3VyX3RyYW5zbGF0ZV9kZWx0YS54IC8gc3Bhbihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3gpKSwgMCwgd2lkdGgpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeScpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2UocGFuTGluZWFyKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeSwgZm91cl90cmFuc2xhdGVfZGVsdGEueSAvIHNwYW4oZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF95KSksIDAsIGhlaWdodClcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgcGFuTGluZWFyIGV4cHJzIGZvciBzY2FsZS1ib3VuZCBpbnRlcnZhbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7c2l4OiBzZWxDbXB0c1snc2l4J119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9Ib3JzZXBvd2VyJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJwYW5MaW5lYXIoc2l4X3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3gsIC1zaXhfdHJhbnNsYXRlX2RlbHRhLnggLyB3aWR0aClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X01pbGVzX3Blcl9HYWxsb24nKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInBhbkxpbmVhcihzaXhfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeSwgc2l4X3RyYW5zbGF0ZV9kZWx0YS55IC8gaGVpZ2h0KVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyBwYW5Mb2cvcGFuUG93IGV4cHJzIGZvciBzY2FsZS1ib3VuZCBpbnRlcnZhbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoJ2xvZycsICdwb3cnKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7c2l4OiBzZWxDbXB0c1snc2l4J119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9Ib3JzZXBvd2VyJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJwYW5Mb2coc2l4X3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3gsIC1zaXhfdHJhbnNsYXRlX2RlbHRhLnggLyB3aWR0aClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X01pbGVzX3Blcl9HYWxsb24nKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInBhblBvdyhzaXhfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeSwgc2l4X3RyYW5zbGF0ZV9kZWx0YS55IC8gaGVpZ2h0LCAxKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19