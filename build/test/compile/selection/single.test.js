/* tslint:disable quotemark */
import * as selection from '../../../src/compile/selection/selection';
import single from '../../../src/compile/selection/single';
import { parseUnitModelWithScale } from '../../util';
describe('Single Selection', () => {
    const model = parseUnitModelWithScale({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative', bin: true },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    const selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'single' },
        two: {
            type: 'single',
            nearest: true,
            on: 'mouseover',
            encodings: ['y', 'color'],
            resolve: 'intersect'
        }
    }));
    it('builds tuple signals', () => {
        const oneSg = single.signals(model, selCmpts['one']);
        expect(oneSg).toEqual([
            {
                name: 'one_tuple',
                value: {},
                on: [
                    {
                        events: selCmpts['one'].events,
                        update: 'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: one_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
                        force: true
                    }
                ]
            }
        ]);
        const twoSg = single.signals(model, selCmpts['two']);
        expect(twoSg).toEqual([
            {
                name: 'two_tuple',
                value: {},
                on: [
                    {
                        events: selCmpts['two'].events,
                        update: 'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: two_tuple_fields, values: [[(item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon"], (item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon_end"]], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
                        force: true
                    }
                ]
            }
        ]);
        const signals = selection.assembleUnitSelectionSignals(model, []);
        expect(signals).toEqual(expect.arrayContaining(oneSg.concat(twoSg)));
    });
    it('builds modify signals', () => {
        const oneExpr = single.modifyExpr(model, selCmpts['one']);
        expect(oneExpr).toEqual('one_tuple, true');
        const twoExpr = single.modifyExpr(model, selCmpts['two']);
        expect(twoExpr).toEqual('two_tuple, {unit: ""}');
        const signals = selection.assembleUnitSelectionSignals(model, []);
        expect(signals).toEqual(expect.arrayContaining([
            {
                name: 'one_modify',
                on: [
                    {
                        events: { signal: 'one_tuple' },
                        update: `modify(\"one_store\", ${oneExpr})`
                    }
                ]
            },
            {
                name: 'two_modify',
                on: [
                    {
                        events: { signal: 'two_tuple' },
                        update: `modify(\"two_store\", ${twoExpr})`
                    }
                ]
            }
        ]));
    });
    it('builds top-level signals', () => {
        const signals = selection.assembleTopLevelSignals(model, []);
        expect(signals).toEqual(expect.arrayContaining([
            {
                name: 'one',
                update: 'vlSelectionResolve("one_store")'
            },
            {
                name: 'two',
                update: 'vlSelectionResolve("two_store", "intersect")'
            },
            {
                name: 'unit',
                value: {},
                on: [{ events: 'mousemove', update: 'isTuple(group()) ? group() : unit' }]
            }
        ]));
    });
    it('builds unit datasets', () => {
        const data = [];
        expect(selection.assembleUnitSelectionData(model, data)).toEqual([{ name: 'one_store' }, { name: 'two_store' }]);
    });
    it('leaves marks alone', () => {
        const marks = [];
        model.component.selection = { one: selCmpts['one'] };
        expect(selection.assembleUnitSelectionMarks(model, marks)).toEqual(marks);
    });
});
//# sourceMappingURL=single.test.js.map