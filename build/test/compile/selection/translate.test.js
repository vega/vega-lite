/* tslint:disable quotemark */
import { assert } from 'chai';
import { selector as parseSelector } from 'vega-event-selector';
import * as selection from '../../../src/compile/selection/selection';
import translate from '../../../src/compile/selection/transforms/translate';
import { parseUnitModel } from '../../util';
function getModel(xscale, yscale) {
    var model = parseUnitModel({
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
        assert.isNotTrue(translate.has(selCmpts['one']));
        assert.isNotTrue(translate.has(selCmpts['two']));
        assert.isNotTrue(translate.has(selCmpts['three']));
        assert.isNotFalse(translate.has(selCmpts['four']));
        assert.isNotFalse(translate.has(selCmpts['five']));
        assert.isNotFalse(translate.has(selCmpts['six']));
        assert.isNotTrue(translate.has(selCmpts['seven']));
    });
    describe('Anchor/Delta signals', function () {
        var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
        it('builds them for default invocation', function () {
            model.component.selection = { four: selCmpts['four'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            assert.includeDeepMembers(signals, [
                {
                    "name": "four_translate_anchor",
                    "value": {},
                    "on": [
                        {
                            "events": parseSelector('@four_brush:mousedown', 'scope'),
                            "update": "{x: x(unit), y: y(unit), extent_x: slice(four_x), extent_y: slice(four_y)}"
                        }
                    ]
                },
                {
                    "name": "four_translate_delta",
                    "value": {},
                    "on": [
                        {
                            "events": parseSelector('[@four_brush:mousedown, window:mouseup] > window:mousemove!', 'scope'),
                            "update": "{x: four_translate_anchor.x - x(unit), y: four_translate_anchor.y - y(unit)}"
                        }
                    ]
                }
            ]);
        });
        it('builds them for custom events', function () {
            model.component.selection = { five: selCmpts['five'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            assert.includeDeepMembers(signals, [
                {
                    "name": "five_translate_anchor",
                    "value": {},
                    "on": [
                        {
                            "events": parseSelector('@five_brush:mousedown, @five_brush:keydown', 'scope'),
                            "update": "{x: x(unit), y: y(unit), extent_x: slice(five_x), extent_y: slice(five_y)}"
                        }
                    ]
                },
                {
                    "name": "five_translate_delta",
                    "value": {},
                    "on": [
                        {
                            "events": parseSelector('[@five_brush:mousedown, mouseup] > mousemove, [@five_brush:keydown, keyup] > touchmove', 'scope'),
                            "update": "{x: five_translate_anchor.x - x(unit), y: five_translate_anchor.y - y(unit)}"
                        }
                    ]
                }
            ]);
        });
        it('builds them for scale-bound intervals', function () {
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            assert.includeDeepMembers(signals, [
                {
                    "name": "six_translate_anchor",
                    "value": {},
                    "on": [
                        {
                            "events": parseSelector('mousedown', 'scope'),
                            "update": "{x: x(unit), y: y(unit), extent_x: domain(\"x\"), extent_y: domain(\"y\")}"
                        }
                    ]
                },
                {
                    "name": "six_translate_delta",
                    "value": {},
                    "on": [
                        {
                            "events": parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope'),
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
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)"
                }
            ]);
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_y, four_translate_delta.y / span(four_translate_anchor.extent_y)), 0, height)"
                }
            ]);
            var model2 = getModel('log', 'pow').model;
            model2.component.selection = { four: selCmpts['four'] };
            signals = selection.assembleUnitSelectionSignals(model2, []);
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    "events": { "signal": "four_translate_delta" },
                    "update": "clampRange(panLinear(four_translate_anchor.extent_x, four_translate_delta.x / span(four_translate_anchor.extent_x)), 0, width)"
                }
            ]);
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
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
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panLinear(six_translate_anchor.extent_x, -six_translate_delta.x / width)"
                }
            ]);
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
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
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panLog(six_translate_anchor.extent_x, -six_translate_delta.x / width)"
                }
            ]);
            assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    "events": { "signal": "six_translate_delta" },
                    "update": "panPow(six_translate_anchor.extent_y, six_translate_delta.y / height, 1)"
                }
            ]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL3RyYW5zbGF0ZS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4QjtBQUU5QixPQUFPLEVBQUMsTUFBTSxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBQzVCLE9BQU8sRUFBQyxRQUFRLElBQUksYUFBYSxFQUFDLE1BQU0scUJBQXFCLENBQUM7QUFDOUQsT0FBTyxLQUFLLFNBQVMsTUFBTSwwQ0FBMEMsQ0FBQztBQUN0RSxPQUFPLFNBQVMsTUFBTSxxREFBcUQsQ0FBQztBQUU1RSxPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRTFDLGtCQUFrQixNQUFrQixFQUFFLE1BQWtCO0lBQ3RELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLE1BQU0sSUFBSSxRQUFRLEVBQUMsRUFBQztZQUMxRixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxJQUFJLFFBQVEsRUFBQyxFQUFDO1lBQ2hHLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNuQixJQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQ25ELEtBQUssRUFBRTtZQUNMLE1BQU0sRUFBRSxRQUFRO1NBQ2pCO1FBQ0QsS0FB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QUFDLEVBQUUsRUFBRTtnQkFDbEY7b0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFDO29CQUMzQyxRQUFRLEVBQUUsdUVBQXVFO2lCQUNsRjthQUNGLENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxDQUFDLElBQUksS0FBSyxzQkFBc0IsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtnQkFDeEY7b0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLHFCQUFxQixFQUFDO29CQUMzQyxRQUFRLEVBQUUsMEVBQTBFO2lCQUNyRjthQUNGLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3NlbGVjdG9yIGFzIHBhcnNlU2VsZWN0b3J9IGZyb20gJ3ZlZ2EtZXZlbnQtc2VsZWN0b3InO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHRyYW5zbGF0ZSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vdHJhbnNmb3Jtcy90cmFuc2xhdGUnO1xuaW1wb3J0IHtTY2FsZVR5cGV9IGZyb20gJy4uLy4uLy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZnVuY3Rpb24gZ2V0TW9kZWwoeHNjYWxlPzogU2NhbGVUeXBlLCB5c2NhbGU/OiBTY2FsZVR5cGUpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCIsIFwic2NhbGVcIjoge1widHlwZVwiOiB4c2NhbGUgfHwgXCJsaW5lYXJcIn19LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwiLCBcInNjYWxlXCI6IHtcInR5cGVcIjogeXNjYWxlIHx8IFwibGluZWFyXCJ9fSxcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIH1cbiAgfSk7XG5cbiAgbW9kZWwucGFyc2VTY2FsZSgpO1xuICBjb25zdCBzZWxDbXB0cyA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJzaW5nbGVcIlxuICAgIH0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwibXVsdGlcIlxuICAgIH0sXG4gICAgXCJ0aHJlZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJ0cmFuc2xhdGVcIjogZmFsc2VcbiAgICB9LFxuICAgIFwiZm91clwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiXG4gICAgfSxcbiAgICBcImZpdmVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwidHJhbnNsYXRlXCI6IFwiW21vdXNlZG93biwgbW91c2V1cF0gPiBtb3VzZW1vdmUsIFtrZXlkb3duLCBrZXl1cF0gPiB0b3VjaG1vdmVcIlxuICAgIH0sXG4gICAgXCJzaXhcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiYmluZFwiOiBcInNjYWxlc1wiXG4gICAgfSxcbiAgICBcInNldmVuXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcInRyYW5zbGF0ZVwiOiBudWxsXG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge21vZGVsLCBzZWxDbXB0c307XG59XG5cbmRlc2NyaWJlKCdUcmFuc2xhdGUgU2VsZWN0aW9uIFRyYW5zZm9ybScsIGZ1bmN0aW9uKCkge1xuICBpdCgnaWRlbnRpZmllcyB0cmFuc2Zvcm0gaW52b2NhdGlvbicsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IHttb2RlbDogX21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgIGFzc2VydC5pc05vdFRydWUodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1snb25lJ10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ3R3byddKSk7XG4gICAgYXNzZXJ0LmlzTm90VHJ1ZSh0cmFuc2xhdGUuaGFzKHNlbENtcHRzWyd0aHJlZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2UodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1snZm91ciddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2UodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1snZml2ZSddKSk7XG4gICAgYXNzZXJ0LmlzTm90RmFsc2UodHJhbnNsYXRlLmhhcyhzZWxDbXB0c1snc2l4J10pKTtcbiAgICBhc3NlcnQuaXNOb3RUcnVlKHRyYW5zbGF0ZS5oYXMoc2VsQ21wdHNbJ3NldmVuJ10pKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ0FuY2hvci9EZWx0YSBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuXG4gICAgaXQoJ2J1aWxkcyB0aGVtIGZvciBkZWZhdWx0IGludm9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgIG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSB7Zm91cjogc2VsQ21wdHNbJ2ZvdXInXX07XG4gICAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwiZm91cl90cmFuc2xhdGVfYW5jaG9yXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignQGZvdXJfYnJ1c2g6bW91c2Vkb3duJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IHgodW5pdCksIHk6IHkodW5pdCksIGV4dGVudF94OiBzbGljZShmb3VyX3gpLCBleHRlbnRfeTogc2xpY2UoZm91cl95KX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZvdXJfdHJhbnNsYXRlX2RlbHRhXCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiB7fSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW0Bmb3VyX2JydXNoOm1vdXNlZG93biwgd2luZG93Om1vdXNldXBdID4gd2luZG93Om1vdXNlbW92ZSEnLCAnc2NvcGUnKSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ7eDogZm91cl90cmFuc2xhdGVfYW5jaG9yLnggLSB4KHVuaXQpLCB5OiBmb3VyX3RyYW5zbGF0ZV9hbmNob3IueSAtIHkodW5pdCl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB0aGVtIGZvciBjdXN0b20gZXZlbnRzJywgZnVuY3Rpb24oKSB7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge2ZpdmU6IHNlbENtcHRzWydmaXZlJ119O1xuICAgICAgY29uc3Qgc2lnbmFscyA9IHNlbGVjdGlvbi5hc3NlbWJsZVVuaXRTZWxlY3Rpb25TaWduYWxzKG1vZGVsLCBbXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcImZpdmVfdHJhbnNsYXRlX2FuY2hvclwiLFxuICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ0BmaXZlX2JydXNoOm1vdXNlZG93biwgQGZpdmVfYnJ1c2g6a2V5ZG93bicsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiB4KHVuaXQpLCB5OiB5KHVuaXQpLCBleHRlbnRfeDogc2xpY2UoZml2ZV94KSwgZXh0ZW50X3k6IHNsaWNlKGZpdmVfeSl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJmaXZlX3RyYW5zbGF0ZV9kZWx0YVwiLFxuICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1tAZml2ZV9icnVzaDptb3VzZWRvd24sIG1vdXNldXBdID4gbW91c2Vtb3ZlLCBbQGZpdmVfYnJ1c2g6a2V5ZG93biwga2V5dXBdID4gdG91Y2htb3ZlJywgJ3Njb3BlJyksXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwie3g6IGZpdmVfdHJhbnNsYXRlX2FuY2hvci54IC0geCh1bml0KSwgeTogZml2ZV90cmFuc2xhdGVfYW5jaG9yLnkgLSB5KHVuaXQpfVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgdGhlbSBmb3Igc2NhbGUtYm91bmQgaW50ZXJ2YWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3NpeDogc2VsQ21wdHNbJ3NpeCddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhzaWduYWxzLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJzaXhfdHJhbnNsYXRlX2FuY2hvclwiLFxuICAgICAgICAgIFwidmFsdWVcIjoge30sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ21vdXNlZG93bicsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiB4KHVuaXQpLCB5OiB5KHVuaXQpLCBleHRlbnRfeDogZG9tYWluKFxcXCJ4XFxcIiksIGV4dGVudF95OiBkb21haW4oXFxcInlcXFwiKX1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInNpeF90cmFuc2xhdGVfZGVsdGFcIixcbiAgICAgICAgICBcInZhbHVlXCI6IHt9LFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdbbW91c2Vkb3duLCB3aW5kb3c6bW91c2V1cF0gPiB3aW5kb3c6bW91c2Vtb3ZlIScsICdzY29wZScpLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcInt4OiBzaXhfdHJhbnNsYXRlX2FuY2hvci54IC0geCh1bml0KSwgeTogc2l4X3RyYW5zbGF0ZV9hbmNob3IueSAtIHkodW5pdCl9XCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnVHJhbnNsYXRlIFNpZ25hbCcsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdhbHdheXMgYnVpbGRzIHBhbkxpbmVhciBleHBycyBmb3IgYnJ1c2hlcycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qge21vZGVsLCBzZWxDbXB0c30gPSBnZXRNb2RlbCgpO1xuICAgICAgbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmb3VyOiBzZWxDbXB0c1snZm91ciddfTtcbiAgICAgIGxldCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeCcpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2UocGFuTGluZWFyKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeCwgZm91cl90cmFuc2xhdGVfZGVsdGEueCAvIHNwYW4oZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF94KSksIDAsIHdpZHRoKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3knKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHBhbkxpbmVhcihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3ksIGZvdXJfdHJhbnNsYXRlX2RlbHRhLnkgLyBzcGFuKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeSkpLCAwLCBoZWlnaHQpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IG1vZGVsMiA9IGdldE1vZGVsKCdsb2cnLCAncG93JykubW9kZWw7XG4gICAgICBtb2RlbDIuY29tcG9uZW50LnNlbGVjdGlvbiA9IHtmb3VyOiBzZWxDbXB0c1snZm91ciddfTtcbiAgICAgIHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbDIsIFtdKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ2ZvdXJfeCcpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJmb3VyX3RyYW5zbGF0ZV9kZWx0YVwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcImNsYW1wUmFuZ2UocGFuTGluZWFyKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeCwgZm91cl90cmFuc2xhdGVfZGVsdGEueCAvIHNwYW4oZm91cl90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF94KSksIDAsIHdpZHRoKVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdmb3VyX3knKVswXS5vbiwgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwiZm91cl90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJjbGFtcFJhbmdlKHBhbkxpbmVhcihmb3VyX3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3ksIGZvdXJfdHJhbnNsYXRlX2RlbHRhLnkgLyBzcGFuKGZvdXJfdHJhbnNsYXRlX2FuY2hvci5leHRlbnRfeSkpLCAwLCBoZWlnaHQpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHBhbkxpbmVhciBleHBycyBmb3Igc2NhbGUtYm91bmQgaW50ZXJ2YWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3NpeDogc2VsQ21wdHNbJ3NpeCddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfSG9yc2Vwb3dlcicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwicGFuTGluZWFyKHNpeF90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF94LCAtc2l4X3RyYW5zbGF0ZV9kZWx0YS54IC8gd2lkdGgpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9NaWxlc19wZXJfR2FsbG9uJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJwYW5MaW5lYXIoc2l4X3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3ksIHNpeF90cmFuc2xhdGVfZGVsdGEueSAvIGhlaWdodClcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgcGFuTG9nL3BhblBvdyBleHBycyBmb3Igc2NhbGUtYm91bmQgaW50ZXJ2YWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB7bW9kZWwsIHNlbENtcHRzfSA9IGdldE1vZGVsKCdsb2cnLCAncG93Jyk7XG4gICAgICBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0ge3NpeDogc2VsQ21wdHNbJ3NpeCddfTtcbiAgICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuXG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMuZmlsdGVyKChzKSA9PiBzLm5hbWUgPT09ICdzaXhfSG9yc2Vwb3dlcicpWzBdLm9uLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJzaXhfdHJhbnNsYXRlX2RlbHRhXCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwicGFuTG9nKHNpeF90cmFuc2xhdGVfYW5jaG9yLmV4dGVudF94LCAtc2l4X3RyYW5zbGF0ZV9kZWx0YS54IC8gd2lkdGgpXCJcbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscy5maWx0ZXIoKHMpID0+IHMubmFtZSA9PT0gJ3NpeF9NaWxlc19wZXJfR2FsbG9uJylbMF0ub24sIFtcbiAgICAgICAge1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInNpeF90cmFuc2xhdGVfZGVsdGFcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJwYW5Qb3coc2l4X3RyYW5zbGF0ZV9hbmNob3IuZXh0ZW50X3ksIHNpeF90cmFuc2xhdGVfZGVsdGEueSAvIGhlaWdodCwgMSlcIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==