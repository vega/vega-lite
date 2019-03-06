/* tslint:disable quotemark */
import * as selection from '../../../src/compile/selection/selection';
import inputs from '../../../src/compile/selection/transforms/inputs';
import { parseUnitModel } from '../../util';
describe('Inputs Selection Transform', () => {
    const model = parseUnitModel({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative' },
            color: { field: 'Origin', type: 'nominal' }
        }
    });
    model.parseScale();
    const selCmpts = selection.parseUnitSelection(model, {
        one: {
            type: 'single',
            bind: { input: 'range', min: 0, max: 10, step: 1 }
        },
        two: {
            type: 'single',
            fields: ['Cylinders', 'Horsepower'],
            bind: { input: 'range', min: 0, max: 10, step: 1 }
        },
        three: {
            type: 'single',
            nearest: true,
            fields: ['Cylinders', 'Origin'],
            bind: {
                Horsepower: { input: 'range', min: 0, max: 10, step: 1 },
                Origin: { input: 'select', options: ['Japan', 'USA', 'Europe'] }
            }
        },
        four: {
            type: 'single',
            bind: null
        },
        six: {
            type: 'interval',
            bind: 'scales'
        },
        seven: {
            type: 'single',
            fields: ['Year'],
            bind: {
                Year: { input: 'range', min: 1970, max: 1980, step: 1 }
            },
            init: {
                Year: { year: 1970, month: 1, day: 1 }
            }
        }
    });
    it('identifies transform invocation', () => {
        expect(inputs.has(selCmpts['one'])).toBeTruthy();
        expect(inputs.has(selCmpts['two'])).toBeTruthy();
        expect(inputs.has(selCmpts['three'])).toBeTruthy();
        expect(inputs.has(selCmpts['four'])).toBeFalsy();
        expect(inputs.has(selCmpts['six'])).toBeFalsy();
        expect(inputs.has(selCmpts['seven'])).toBeTruthy();
    });
    it('adds widget binding for default projection', () => {
        model.component.selection = { one: selCmpts['one'] };
        expect(selection.assembleUnitSelectionSignals(model, [])).toContainEqual({
            name: 'one_tuple',
            update: 'one__vgsid_ !== null ? {fields: one_tuple_fields, values: [one__vgsid_]} : null'
        });
        expect(selection.assembleTopLevelSignals(model, [])).toContainEqual({
            name: 'one__vgsid_',
            value: null,
            on: [
                {
                    events: [{ source: 'scope', type: 'click' }],
                    update: 'datum && item().mark.marktype !== \'group\' ? datum["_vgsid_"] : null'
                }
            ],
            bind: { input: 'range', min: 0, max: 10, step: 1 }
        });
    });
    it('adds single widget binding for compound projection', () => {
        model.component.selection = { two: selCmpts['two'] };
        expect(selection.assembleUnitSelectionSignals(model, [])).toContainEqual({
            name: 'two_tuple',
            update: 'two_Cylinders !== null && two_Horsepower !== null ? {fields: two_tuple_fields, values: [two_Cylinders, two_Horsepower]} : null'
        });
        expect(selection.assembleTopLevelSignals(model, [])).toEqual(expect.arrayContaining([
            {
                name: 'two_Horsepower',
                value: null,
                on: [
                    {
                        events: [{ source: 'scope', type: 'click' }],
                        update: 'datum && item().mark.marktype !== \'group\' ? datum["Horsepower"] : null'
                    }
                ],
                bind: { input: 'range', min: 0, max: 10, step: 1 }
            },
            {
                name: 'two_Cylinders',
                value: null,
                on: [
                    {
                        events: [{ source: 'scope', type: 'click' }],
                        update: 'datum && item().mark.marktype !== \'group\' ? datum["Cylinders"] : null'
                    }
                ],
                bind: { input: 'range', min: 0, max: 10, step: 1 }
            }
        ]));
    });
    it('adds projection-specific widget bindings', () => {
        model.component.selection = { three: selCmpts['three'] };
        expect(selection.assembleUnitSelectionSignals(model, [])).toContainEqual({
            name: 'three_tuple',
            update: 'three_Cylinders !== null && three_Origin !== null ? {fields: three_tuple_fields, values: [three_Cylinders, three_Origin]} : null'
        });
        expect(selection.assembleTopLevelSignals(model, [])).toEqual(expect.arrayContaining([
            {
                name: 'three_Origin',
                value: null,
                on: [
                    {
                        events: [{ source: 'scope', type: 'click' }],
                        update: 'datum && item().mark.marktype !== \'group\' ? (item().isVoronoi ? datum.datum : datum)["Origin"] : null'
                    }
                ],
                bind: {
                    input: 'select',
                    options: ['Japan', 'USA', 'Europe']
                }
            },
            {
                name: 'three_Cylinders',
                value: null,
                on: [
                    {
                        events: [{ source: 'scope', type: 'click' }],
                        update: 'datum && item().mark.marktype !== \'group\' ? (item().isVoronoi ? datum.datum : datum)["Cylinders"] : null'
                    }
                ],
                bind: {
                    Horsepower: { input: 'range', min: 0, max: 10, step: 1 },
                    Origin: {
                        input: 'select',
                        options: ['Japan', 'USA', 'Europe']
                    }
                }
            }
        ]));
    });
    it('respects initialization', () => {
        model.component.selection = { seven: selCmpts['seven'] };
        expect(selection.assembleUnitSelectionSignals(model, [])).toEqual(expect.arrayContaining([
            {
                name: 'seven_tuple',
                update: 'seven_Year !== null ? {fields: seven_tuple_fields, values: [seven_Year]} : null'
            }
        ]));
        expect(selection.assembleTopLevelSignals(model, [])).toEqual(expect.arrayContaining([
            {
                name: 'seven_Year',
                init: 'datetime(1970, 1, 1+1, 0, 0, 0, 0)',
                on: [
                    {
                        events: [{ source: 'scope', type: 'click' }],
                        update: 'datum && item().mark.marktype !== \'group\' ? datum["Year"] : null'
                    }
                ],
                bind: { input: 'range', min: 1970, max: 1980, step: 1 }
            }
        ]));
    });
});
//# sourceMappingURL=inputs.test.js.map