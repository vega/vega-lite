/* tslint:disable quotemark */
import { assert } from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import single from '../../../src/compile/selection/single';
import { parseUnitModelWithScale } from '../../util';
describe('Single Selection', function () {
    var model = parseUnitModelWithScale({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative', bin: true },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    var selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'single' },
        two: {
            type: 'single',
            nearest: true,
            on: 'mouseover',
            encodings: ['y', 'color'],
            resolve: 'intersect'
        }
    }));
    it('builds tuple signals', function () {
        var oneSg = single.signals(model, selCmpts['one']);
        assert.sameDeepMembers(oneSg, [
            {
                name: 'one_tuple',
                value: {},
                on: [
                    {
                        events: selCmpts['one'].events,
                        update: 'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: one_tuple_fields, values: [datum["_vgsid_"]]} : null',
                        force: true
                    }
                ]
            }
        ]);
        var twoSg = single.signals(model, selCmpts['two']);
        assert.sameDeepMembers(twoSg, [
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
        var signals = selection.assembleUnitSelectionSignals(model, []);
        assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds modify signals', function () {
        var oneExpr = single.modifyExpr(model, selCmpts['one']);
        assert.equal(oneExpr, 'one_tuple, true');
        var twoExpr = single.modifyExpr(model, selCmpts['two']);
        assert.equal(twoExpr, 'two_tuple, {unit: ""}');
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
    it('builds top-level signals', function () {
        var signals = selection.assembleTopLevelSignals(model, []);
        assert.includeDeepMembers(signals, [
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
        ]);
    });
    it('builds unit datasets', function () {
        var data = [];
        assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
            { name: 'one_store' },
            { name: 'two_store' }
        ]);
    });
    it('leaves marks alone', function () {
        var marks = [];
        model.component.selection = { one: selCmpts['one'] };
        assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
    });
});
//# sourceMappingURL=single.test.js.map