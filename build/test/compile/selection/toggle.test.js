/* tslint:disable quotemark */
import { assert } from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import toggle from '../../../src/compile/selection/transforms/toggle';
import { parseUnitModel } from '../../util';
describe('Toggle Selection Transform', function () {
    var model = parseUnitModel({
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
        assert.isNotFalse(toggle.has(selCmpts['one']));
        assert.isNotFalse(toggle.has(selCmpts['two']));
        assert.isNotTrue(toggle.has(selCmpts['three']));
        assert.isNotTrue(toggle.has(selCmpts['four']));
        assert.isNotTrue(toggle.has(selCmpts['five']));
        assert.isNotTrue(toggle.has(selCmpts['six']));
    });
    it('builds toggle signals', function () {
        var oneSg = toggle.signals(model, selCmpts['one'], []);
        assert.sameDeepMembers(oneSg, [
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
        var twoSg = toggle.signals(model, selCmpts['two'], []);
        assert.sameDeepMembers(twoSg, [
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
        assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds modify expr', function () {
        var oneExpr = toggle.modifyExpr(model, selCmpts['one'], '');
        assert.equal(oneExpr, 'one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');
        var twoExpr = toggle.modifyExpr(model, selCmpts['two'], '');
        assert.equal(twoExpr, 'two_toggle ? null : two_tuple, two_toggle ? null : {unit: ""}, two_toggle ? two_tuple : null');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        assert.includeDeepMembers(signals, [
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