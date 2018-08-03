"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
var toggle_1 = tslib_1.__importDefault(require("../../../src/compile/selection/transforms/toggle"));
var util_1 = require("../../util");
describe('Toggle Selection Transform', function () {
    var model = util_1.parseUnitModel({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative' },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    var selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'multi' },
        two: {
            type: 'multi',
            resolve: 'union',
            on: 'mouseover',
            toggle: 'event.ctrlKey',
            encodings: ['y', 'color']
        },
        three: { type: 'multi', toggle: false },
        four: { type: 'multi', toggle: null },
        five: { type: 'single' },
        six: { type: 'interval' }
    }));
    it('identifies transform invocation', function () {
        chai_1.assert.isNotFalse(toggle_1.default.has(selCmpts['one']));
        chai_1.assert.isNotFalse(toggle_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['three']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['four']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['five']));
        chai_1.assert.isNotTrue(toggle_1.default.has(selCmpts['six']));
    });
    it('builds toggle signals', function () {
        var oneSg = toggle_1.default.signals(model, selCmpts['one'], []);
        chai_1.assert.sameDeepMembers(oneSg, [
            {
                name: 'one_toggle',
                value: false,
                on: [
                    {
                        events: selCmpts['one'].events,
                        update: 'event.shiftKey'
                    }
                ]
            }
        ]);
        var twoSg = toggle_1.default.signals(model, selCmpts['two'], []);
        chai_1.assert.sameDeepMembers(twoSg, [
            {
                name: 'two_toggle',
                value: false,
                on: [
                    {
                        events: selCmpts['two'].events,
                        update: 'event.ctrlKey'
                    }
                ]
            }
        ]);
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds modify expr', function () {
        var oneExpr = toggle_1.default.modifyExpr(model, selCmpts['one'], '');
        chai_1.assert.equal(oneExpr, 'one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');
        var twoExpr = toggle_1.default.modifyExpr(model, selCmpts['two'], '');
        chai_1.assert.equal(twoExpr, 'two_toggle ? null : two_tuple, two_toggle ? null : {unit: ""}, two_toggle ? two_tuple : null');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                name: 'one_modify',
                on: [
                    {
                        events: { signal: 'one_tuple' },
                        update: "modify(\"one_store\", " + oneExpr + ")"
                    }
                ]
            },
            {
                name: 'two_modify',
                on: [
                    {
                        events: { signal: 'two_tuple' },
                        update: "modify(\"two_store\", " + twoExpr + ")"
                    }
                ]
            }
        ]);
    });
});
//# sourceMappingURL=toggle.test.js.map