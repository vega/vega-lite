/* tslint:disable quotemark */
import * as selection from '../../../src/compile/selection/selection';
import toggle from '../../../src/compile/selection/transforms/toggle';
import { parseUnitModel } from '../../util';
describe('Toggle Selection Transform', () => {
    const model = parseUnitModel({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative' },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    const selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
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
    it('identifies transform invocation', () => {
        expect(toggle.has(selCmpts['one'])).toBeTruthy();
        expect(toggle.has(selCmpts['two'])).toBeTruthy();
        expect(toggle.has(selCmpts['three'])).toBeFalsy();
        expect(toggle.has(selCmpts['four'])).toBeFalsy();
        expect(toggle.has(selCmpts['five'])).toBeFalsy();
        expect(toggle.has(selCmpts['six'])).toBeFalsy();
    });
    it('builds toggle signals', () => {
        const oneSg = toggle.signals(model, selCmpts['one'], []);
        expect(oneSg).toEqual([
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
        const twoSg = toggle.signals(model, selCmpts['two'], []);
        expect(twoSg).toEqual([
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
        const signals = selection.assembleUnitSelectionSignals(model, []);
        expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg]));
    });
    it('builds modify expr', () => {
        const oneExpr = toggle.modifyExpr(model, selCmpts['one'], '');
        expect(oneExpr).toEqual('one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');
        const twoExpr = toggle.modifyExpr(model, selCmpts['two'], '');
        expect(twoExpr).toEqual('two_toggle ? null : two_tuple, two_toggle ? null : {unit: ""}, two_toggle ? two_tuple : null');
        const signals = selection.assembleUnitSelectionSignals(model, []);
        expect(signals).toEqual(expect.arrayContaining([
            {
                name: 'one_modify',
                update: `modify(\"one_store\", ${oneExpr})`
            },
            {
                name: 'two_modify',
                update: `modify(\"two_store\", ${twoExpr})`
            }
        ]));
    });
});
//# sourceMappingURL=toggle.test.js.map