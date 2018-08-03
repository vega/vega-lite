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
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative', scale: { type: xscale || 'linear' } },
            y: { field: 'Miles_per_Gallon', type: 'quantitative', scale: { type: yscale || 'linear' } },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    var selCmpts = selection.parseUnitSelection(model, {
        one: {
            type: 'single'
        },
        two: {
            type: 'multi'
        },
        three: {
            type: 'interval',
            zoom: false
        },
        four: {
            type: 'interval'
        },
        five: {
            type: 'interval',
            zoom: 'wheel, pinch'
        },
        six: {
            type: 'interval',
            bind: 'scales'
        },
        seven: {
            type: 'interval',
            zoom: null
        }
    });
    return { model: model, selCmpts: selCmpts };
}
describe('Zoom Selection Transform', function () {
    it('identifies transform invocation', function () {
        var selCmpts = getModel().selCmpts;
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
                    name: 'four_zoom_anchor',
                    on: [
                        {
                            events: vega_event_selector_1.selector('@four_brush:wheel!', 'scope'),
                            update: '{x: x(unit), y: y(unit)}'
                        }
                    ]
                },
                {
                    name: 'four_zoom_delta',
                    on: [
                        {
                            events: vega_event_selector_1.selector('@four_brush:wheel!', 'scope'),
                            force: true,
                            update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
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
                    name: 'five_zoom_anchor',
                    on: [
                        {
                            events: vega_event_selector_1.selector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                            update: '{x: x(unit), y: y(unit)}'
                        }
                    ]
                },
                {
                    name: 'five_zoom_delta',
                    on: [
                        {
                            events: vega_event_selector_1.selector('@five_brush:wheel, @five_brush:pinch', 'scope'),
                            force: true,
                            update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
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
                    name: 'six_zoom_anchor',
                    on: [
                        {
                            events: vega_event_selector_1.selector('wheel!', 'scope'),
                            update: '{x: invert("x", x(unit)), y: invert("y", y(unit))}'
                        }
                    ]
                },
                {
                    name: 'six_zoom_delta',
                    on: [
                        {
                            events: vega_event_selector_1.selector('wheel!', 'scope'),
                            force: true,
                            update: 'pow(1.001, event.deltaY * pow(16, event.deltaMode))'
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
                    events: { signal: 'four_zoom_delta' },
                    update: 'clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)'
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    events: { signal: 'four_zoom_delta' },
                    update: 'clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)'
                }
            ]);
            var model2 = getModel('log', 'pow').model;
            model2.component.selection = { four: selCmpts['four'] };
            signals = selection.assembleUnitSelectionSignals(model2, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_x'; })[0].on, [
                {
                    events: { signal: 'four_zoom_delta' },
                    update: 'clampRange(zoomLinear(four_x, four_zoom_anchor.x, four_zoom_delta), 0, width)'
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'four_y'; })[0].on, [
                {
                    events: { signal: 'four_zoom_delta' },
                    update: 'clampRange(zoomLinear(four_y, four_zoom_anchor.y, four_zoom_delta), 0, height)'
                }
            ]);
        });
        it('builds zoomLinear exprs for scale-bound zoom', function () {
            var _a = getModel(), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    events: { signal: 'six_zoom_delta' },
                    update: 'zoomLinear(domain("x"), six_zoom_anchor.x, six_zoom_delta)'
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    events: { signal: 'six_zoom_delta' },
                    update: 'zoomLinear(domain("y"), six_zoom_anchor.y, six_zoom_delta)'
                }
            ]);
        });
        it('builds zoomLog/Pow exprs for scale-bound zoom', function () {
            var _a = getModel('log', 'pow'), model = _a.model, selCmpts = _a.selCmpts;
            model.component.selection = { six: selCmpts['six'] };
            var signals = selection.assembleUnitSelectionSignals(model, []);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Horsepower'; })[0].on, [
                {
                    events: { signal: 'six_zoom_delta' },
                    update: 'zoomLog(domain("x"), six_zoom_anchor.x, six_zoom_delta)'
                }
            ]);
            chai_1.assert.includeDeepMembers(signals.filter(function (s) { return s.name === 'six_Miles_per_Gallon'; })[0].on, [
                {
                    events: { signal: 'six_zoom_delta' },
                    update: 'zoomPow(domain("y"), six_zoom_anchor.y, six_zoom_delta, 1)'
                }
            ]);
        });
    });
});
//# sourceMappingURL=zoom.test.js.map