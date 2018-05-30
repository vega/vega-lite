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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi96b29tLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLDJEQUE4RDtBQUM5RCxvRUFBc0U7QUFDdEUsdUVBQWtFO0FBRWxFLG1DQUEwQztBQUUxQyxrQkFBa0IsTUFBa0IsRUFBRSxNQUFrQjtJQUN0RCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFFBQVEsRUFBQyxFQUFDO1lBQzFGLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxNQUFNLElBQUksUUFBUSxFQUFDLEVBQUM7WUFDaEcsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLElBQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDbkQsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFFBQVE7U0FDakI7UUFDRCxLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsT0FBTztTQUNoQjtRQUNELE9BQU8sRUFBRTtZQUNQLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxNQUFNLEVBQUU7WUFDTixNQUFNLEVBQUUsVUFBVTtTQUNuQjtRQUNELE1BQU0sRUFB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QyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxzQkFBc0IsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEY7b0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLGdCQUFnQixFQUFDO29CQUN0QyxRQUFRLEVBQUUsOERBQThEO2lCQUN6RTthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3NlbGVjdG9yIGFzIHBhcnNlU2VsZWN0b3J9IGZyb20gJ3ZlZ2EtZXZlbnQtc2VsZWN0b3InO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHpvb20gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zZm9ybXMvem9vbSc7XG5pbXBvcnQge1NjYWxlVHlwZX0gZnJvbSAnLi4vLi4vLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5mdW5jdGlvbiBnZXRNb2RlbCh4c2NhbGU/OiBTY2FsZVR5cGUsIHlzY2FsZT86IFNjYWxlVHlwZSkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIiwgXCJzY2FsZVwiOiB7XCJ0eXBlXCI6IHhzY2FsZSB8fCBcImxpbmVhclwifX0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1widHlwZVwiOiB5c2NhbGUgfHwgXCJsaW5lYXJcIn19LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcblxuICBtb2RlbC5wYXJzZVNjYWxlKCk7XG4gIGNvbnN0IHNlbENtcHRzID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcInNpbmdsZVwiXG4gICAgfSxcbiAgICBcInR3b1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJtdWx0aVwiXG4gICAgfSxcbiAgICBcInRocmVlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcInpvb21cIjogZmFsc2VcbiAgICB9LFxuICAgIFwiZm91clwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiXG4gICAgfSxcbiAgICBcImZpdmVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiem9vbVwiOiBcIndoZWVsLCBwaW5jaFwiXG4gICAgfSxcbiAgICBcInNpeFwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJiaW5kXCI6IFwic2NhbGVzXCJcbiAgICB9LFxuICAgIFwic2V2ZW5cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiem9vbVwiOiBudWxsXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge21vZGVsLCBzZWxDbXB0c307XG59XG5cbmRlc2NyaWJlKCdab29tIFNlbGVjdGlvbiBUcmFuc2Zvcm0nLCBmdW5jdGlvbigpIHtcblxuICBpdCgnaWRlbnRpZmllcyB0cmFuc2Zvcm0gaW52b2NhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHttb2RlbDogX21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgIGFzc2VydC5pc05vdFRydWUoem9vbS5oYXMoc2VsQ21wdHNbJ29uZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh6b29tLmhhcyhzZWxDbXB0c1sndHdvJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHpvb20uaGFzKHNlbENtcHRzWyd0aHJlZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2Uoem9vbS5oYXMoc2VsQ21wdHNbJ2ZvdXInXSkpO1xuICAgIGFzc2VydC5pc05vdEZhbHNlKHpvb20uaGFzKHNlbENtcHRzWydmaXZlJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RGYWxzZSh6b29tLmhhcyhzZWxDbXB0c1snc2l4J10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHpvb20uaGFzKHNlbENtcHRzWydzZXZlbiddKSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdBbmNob3IvRGVsdGEgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdidWlsZHMgdGhlbiBmb3IgZGVmYXVsdCBpbnZvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZvdXI6IHNlbENtcHRzWydmb3VyJ119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZvdXJfem9vbV9hbmNob3JcIixcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignQGZvdXJfYnJ1c2g6d2hlZWwhJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IHgodW5pdCksIHk6IHkodW5pdCl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmb3VyX3pvb21fZGVsdGFcIixcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignQGZvdXJfYnJ1c2g6d2hlZWwhJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwiZm9yY2VcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJwb3coMS4wMDEsIGV2ZW50LmRlbHRhWSAqIHBvdygxNiwgZXZlbnQuZGVsdGFNb2RlKSlcIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHRoZW0gZm9yIGN1c3RvbSBldmVudHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHttb2RlbCwgc2VsQ21wdHN9ID0gZ2V0TW9kZWwoKTtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zml2ZTogc2VsQ21wdHNbJ2ZpdmUnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZml2ZV96b29tX2FuY2hvclwiLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdAZml2ZV9icnVzaDp3aGVlbCwgQGZpdmVfYnJ1c2g6cGluY2gnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogeCh1bml0KSwgeTogeSh1bml0KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZpdmVfem9vbV9kZWx0YVwiLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdAZml2ZV9icnVzaDp3aGVlbCwgQGZpdmVfYnJ1c2g6cGluY2gnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJmb3JjZVwiOiB0cnVlLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInBvdygxLjAwMSwgZXZlbnQuZGVsdGFZICogcG93KDE2LCBldmVudC5kZWx0YU1vZGUpKVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgdGhlbSBmb3Igc2NhbGUtYm91bmQgem9vbScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtzaXg6IHNlbENtcHRzWydzaXgnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwic2l4X3pvb21fYW5jaG9yXCIsXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ3doZWVsIScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiBpbnZlcnQoXFxcInhcXFwiLCB4KHVuaXQpKSwgeTogaW52ZXJ0KFxcXCJ5XFxcIiwgeSh1bml0KSl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJzaXhfem9vbV9kZWx0YVwiLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCd3aGVlbCEnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJmb3JjZVwiOiB0cnVlLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInBvdygxLjAwMSwgZXZlbnQuZGVsdGFZICogcG93KDE2LCBldmVudC5kZWx0YU1vZGUpKVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1pvb20gU2lnbmFsJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2Fsd2F5cyBidWlsZHMgem9vbUxpbmVhciBleHBycyBmb3IgYnJ1c2hlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmb3VyOiBzZWxDbXB0c1snZm91ciddfTtcbiAgICAgIGxldCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl94JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2Uoem9vbUxpbmVhcihmb3VyX3gsIGZvdXJfem9vbV9hbmNob3IueCwgZm91cl96b29tX2RlbHRhKSwgMCwgd2lkdGgpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeScpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHpvb21MaW5lYXIoZm91cl95LCBmb3VyX3pvb21fYW5jaG9yLnksIGZvdXJfem9vbV9kZWx0YSksIDAsIGhlaWdodClcIlxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgY29uc3QgbW9kZWwyID0gZ2V0TW9kZWwoJ2xvZycsICdwb3cnKS5tb2RlbDtcbiAgICAgIG1vZGVsMi5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZvdXI6IHNlbENtcHRzWydmb3VyJ119O1xuICAgICAgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsMiwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnZm91cl94JylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcImZvdXJfem9vbV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2Uoem9vbUxpbmVhcihmb3VyX3gsIGZvdXJfem9vbV9hbmNob3IueCwgZm91cl96b29tX2RlbHRhKSwgMCwgd2lkdGgpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeScpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHpvb21MaW5lYXIoZm91cl95LCBmb3VyX3pvb21fYW5jaG9yLnksIGZvdXJfem9vbV9kZWx0YSksIDAsIGhlaWdodClcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgem9vbUxpbmVhciBleHBycyBmb3Igc2NhbGUtYm91bmQgem9vbScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtzaXg6IHNlbENtcHRzWydzaXgnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X0hvcnNlcG93ZXInKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJ6b29tTGluZWFyKGRvbWFpbihcXFwieFxcXCIpLCBzaXhfem9vbV9hbmNob3IueCwgc2l4X3pvb21fZGVsdGEpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9NaWxlc19wZXJfR2FsbG9uJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiem9vbUxpbmVhcihkb21haW4oXFxcInlcXFwiKSwgc2l4X3pvb21fYW5jaG9yLnksIHNpeF96b29tX2RlbHRhKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB6b29tTG9nL1BvdyBleHBycyBmb3Igc2NhbGUtYm91bmQgem9vbScsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgnbG9nJywgJ3BvdycpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtzaXg6IHNlbENtcHRzWydzaXgnXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcblxuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLmZpbHRlcigocykgPT4gcy5uYW1lID09PSAnc2l4X0hvcnNlcG93ZXInKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwic2l4X3pvb21fZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJ6b29tTG9nKGRvbWFpbihcXFwieFxcXCIpLCBzaXhfem9vbV9hbmNob3IueCwgc2l4X3pvb21fZGVsdGEpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9NaWxlc19wZXJfR2FsbG9uJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF96b29tX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiem9vbVBvdyhkb21haW4oXFxcInlcXFwiKSwgc2l4X3pvb21fYW5jaG9yLnksIHNpeF96b29tX2RlbHRhLCAxKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19