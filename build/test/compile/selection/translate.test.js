"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var selection = require("../../../src/compile/selection/selection");
var translate_1 = require("../../../src/compile/selection/transforms/translate");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zbGF0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QiwyREFBOEQ7QUFDOUQsb0VBQXNFO0FBQ3RFLGlGQUE0RTtBQUU1RSxtQ0FBMEM7QUFFMUMsa0JBQWtCLE1BQWtCLEVBQUUsTUFBa0I7SUFDdEQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxRQUFRLEVBQUMsRUFBQztZQUMxRixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFFBQVEsRUFBQyxFQUFDO1lBQ2hHLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQ25ELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRO1NBQ2pCO1FBQ0QsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLE9BQU87U0FDaEI7UUFDRCxPQUFPLEVBQUU7WUFDUCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsS0FBSztTQUNuQjtRQUNELE1BQU0sRUFBRTtZQUNOLE1BQU0sRUFBRSxVQUFVO1NBQ25CO1FB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a0JBQWtCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssc0JBQXNCLEVBQWpDLENBQWlDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3hGO29CQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxxQkFBcUIsRUFBQztvQkFDM0MsUUFBUSxFQUFFLDBFQUEwRTtpQkFDckY7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtzZWxlY3RvciBhcyBwYXJzZVNlbGVjdG9yfSBmcm9tICd2ZWdhLWV2ZW50LXNlbGVjdG9yJztcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB0cmFuc2xhdGUgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvdHJhbnNsYXRlJztcbmltcG9ydCB7U2NhbGVUeXBlfSBmcm9tICcuLi8uLi8uLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIGdldE1vZGVsKHhzY2FsZT86IFNjYWxlVHlwZSwgeXNjYWxlPzogU2NhbGVUeXBlKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogeHNjYWxlIHx8IFwibGluZWFyXCJ9fSxcbiAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHlzY2FsZSB8fCBcImxpbmVhclwifX0sXG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9XG4gIH0pO1xuXG4gIG1vZGVsLnBhcnNlU2NhbGUoKTtcbiAgY29uc3Qgc2VsQ21wdHMgPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsLCB7XG4gICAgXCJvbmVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwic2luZ2xlXCJcbiAgICB9LFxuICAgIFwidHdvXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcIm11bHRpXCJcbiAgICB9LFxuICAgIFwidGhyZWVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwidHJhbnNsYXRlXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcImZvdXJcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIlxuICAgIH0sXG4gICAgXCJmaXZlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcInRyYW5zbGF0ZVwiOiBcIlttb3VzZWRvd24sIG1vdXNldXBdID4gbW91c2Vtb3ZlLCBba2V5ZG93biwga2V5dXBdID4gdG91Y2htb3ZlXCJcbiAgICB9LFxuICAgIFwic2l4XCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcImJpbmRcIjogXCJzY2FsZXNcIlxuICAgIH0sXG4gICAgXCJzZXZlblwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJ0cmFuc2xhdGVcIjogbnVsbFxuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHttb2RlbCwgc2VsQ21wdHN9O1xufVxuXG5kZXNjcmliZSgnVHJhbnNsYXRlIFNlbGVjdGlvbiBUcmFuc2Zvcm0nLCBmdW5jdGlvbigpIHtcbiAgaXQoJ2lkZW50aWZpZXMgdHJhbnNmb3JtIGludm9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB7bW9kZWw6IF9tb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ29uZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWyd0d28nXSkpO1xuICAgIGFzc2VydC5pc05vdFRydWUodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1sndGhyZWUnXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ2ZvdXInXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ2ZpdmUnXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ3NpeCddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWydzZXZlbiddKSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdBbmNob3IvRGVsdGEgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcblxuICAgIGl0KCdidWlsZHMgdGhlbSBmb3IgZGVmYXVsdCBpbnZvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZvdXI6IHNlbENtcHRzWydmb3VyJ119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZvdXJfdHJhbnNsYXRlX2FuY2hvclwiLFxuICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ0Bmb3VyX2JydXNoOm1vdXNlZG93bicsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiB4KHVuaXQpLCB5OiB5KHVuaXQpLCBleHRlbnRfeDogc2xpY2UoZm91cl94KSwgZXh0ZW50X3k6IHNsaWNlKGZvdXJfeSl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmb3VyX3RyYW5zbGF0ZV9kZWx0YVwiLFxuICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1tAZm91cl9icnVzaDptb3VzZWRvd24sIHdpbmRvdzptb3VzZXVwXSA+IHdpbmRvdzptb3VzZW1vdmUhJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IGZvdXJfdHJhbnNsYXRlX2FuY2hvci54IC0geCh1bml0KSwgeTogZm91cl90cmFuc2xhdGVfYW5jaG9yLnkgLSB5KHVuaXQpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgdGhlbSBmb3IgY3VzdG9tIGV2ZW50cycsIGZ1bmN0aW9uKCkge1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmaXZlOiBzZWxDbXB0c1snZml2ZSddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmaXZlX3RyYW5zbGF0ZV9hbmNob3JcIixcbiAgICAgICAgICBcInZhbHVlXCI6IHt9LFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdAZml2ZV9icnVzaDptb3VzZWRvd24sIEBmaXZlX2JydXNoOmtleWRvd24nLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogeCh1bml0KSwgeTogeSh1bml0KSwgZXh0ZW50X3g6IHNsaWNlKGZpdmVfeCksIGV4dGVudF95OiBzbGljZShmaXZlX3kpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZml2ZV90cmFuc2xhdGVfZGVsdGFcIixcbiAgICAgICAgICBcInZhbHVlXCI6IHt9LFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdbQGZpdmVfYnJ1c2g6bW91c2Vkb3duLCBtb3VzZXVwXSA+IG1vdXNlbW92ZSwgW0BmaXZlX2JydXNoOmtleWRvd24sIGtleXVwXSA+IHRvdWNobW92ZScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiBmaXZlX3RyYW5zbGF0ZV9hbmNob3IueCAtIHgodW5pdCksIHk6IGZpdmVfdHJhbnNsYXRlX2FuY2hvci55IC0geSh1bml0KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHRoZW0gZm9yIHNjYWxlLWJvdW5kIGludGVydmFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtzaXg6IHNlbENtcHRzWydzaXgnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwic2l4X3RyYW5zbGF0ZV9hbmNob3JcIixcbiAgICAgICAgICBcInZhbHVlXCI6IHt9LFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdtb3VzZWRvd24nLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogeCh1bml0KSwgeTogeSh1bml0KSwgZXh0ZW50X3g6IGRvbWFpbihcXFwieFxcXCIpLCBleHRlbnRfeTogZG9tYWluKFxcXCJ5XFxcIil9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJzaXhfdHJhbnNsYXRlX2RlbHRhXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW21vdXNlZG93biwgd2luZG93Om1vdXNldXBdID4gd2luZG93Om1vdXNlbW92ZSEnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogc2l4X3RyYW5zbGF0ZV9hbmNob3IueCAtIHgodW5pdCksIHk6IHNpeF90cmFuc2xhdGVfYW5jaG9yLnkgLSB5KHVuaXQpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1RyYW5zbGF0ZSBTaWduYWwnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYWx3YXlzIGJ1aWxkcyBwYW5MaW5lYXIgZXhwcnMgZm9yIGJydXNoZXMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zm91cjogc2VsQ21wdHNbJ2ZvdXInXX07XG4gICAgICBsZXQgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3gnKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHBhbkxpbmVhcihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3gsIGZvdXJfdHJhbnNsYXRlX2RlbHRhLnggLyBzcGFuKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeCkpLCAwLCB3aWR0aClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl95JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZShwYW5MaW5lYXIoZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF95LCBmb3VyX3RyYW5zbGF0ZV9kZWx0YS55IC8gc3Bhbihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3kpKSwgMCwgaGVpZ2h0KVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCBtb2RlbDIgPSBnZXRNb2RlbCgnbG9nJywgJ3BvdycpLm1vZGVsO1xuICAgICAgbW9kZWwyLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zm91cjogc2VsQ21wdHNbJ2ZvdXInXX07XG4gICAgICBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwyLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3gnKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHBhbkxpbmVhcihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3gsIGZvdXJfdHJhbnNsYXRlX2RlbHRhLnggLyBzcGFuKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeCkpLCAwLCB3aWR0aClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl95JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiY2xhbXBSYW5nZShwYW5MaW5lYXIoZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF95LCBmb3VyX3RyYW5zbGF0ZV9kZWx0YS55IC8gc3Bhbihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3kpKSwgMCwgaGVpZ2h0KVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyBwYW5MaW5lYXIgZXhwcnMgZm9yIHNjYWxlLWJvdW5kIGludGVydmFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtzaXg6IHNlbENtcHRzWydzaXgnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X0hvcnNlcG93ZXInKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInBhbkxpbmVhcihzaXhfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeCwgLXNpeF90cmFuc2xhdGVfZGVsdGEueCAvIHdpZHRoKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfTWlsZXNfcGVyX0dhbGxvbicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwicGFuTGluZWFyKHNpeF90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF95LCBzaXhfdHJhbnNsYXRlX2RlbHRhLnkgLyBoZWlnaHQpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHBhbkxvZy9wYW5Qb3cgZXhwcnMgZm9yIHNjYWxlLWJvdW5kIGludGVydmFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgnbG9nJywgJ3BvdycpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtzaXg6IHNlbENtcHRzWydzaXgnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X0hvcnNlcG93ZXInKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcInBhbkxvZyhzaXhfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeCwgLXNpeF90cmFuc2xhdGVfZGVsdGEueCAvIHdpZHRoKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfTWlsZXNfcGVyX0dhbGxvbicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwicGFuUG93KHNpeF90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF95LCBzaXhfdHJhbnNsYXRlX2RlbHRhLnkgLyBoZWlnaHQsIDEpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=