/* tslint:disable quotemark */
import { assert } from 'chai';
import { nonPosition } from '../../../src/compile/mark/mixins';
import * as selection from '../../../src/compile/selection/selection';
import { expression } from '../../../src/predicate';
import { parseUnitModel } from '../../util';
var predicate = selection.selectionPredicate;
describe('Selection Predicate', function () {
    var model = parseUnitModel({
        mark: 'circle',
        encoding: {
            x: { field: 'Horsepower', type: 'quantitative' },
            y: { field: 'Miles_per_Gallon', type: 'quantitative' },
            color: {
                field: 'Cylinders',
                type: 'ordinal',
                condition: {
                    selection: 'one',
                    value: 'grey'
                }
            },
            opacity: {
                field: 'Origin',
                type: 'nominal',
                condition: {
                    selection: { or: ['one', { and: ['two', { not: 'thr-ee' }] }] },
                    value: 0.5
                }
            }
        }
    });
    model.parseScale();
    model.component.selection = selection.parseUnitSelection(model, {
        one: { type: 'single' },
        two: { type: 'multi', resolve: 'union' },
        'thr-ee': { type: 'interval', resolve: 'intersect' },
        four: { type: 'single', empty: 'none' }
    });
    it('generates the predicate expression', function () {
        assert.equal(predicate(model, 'one'), '!(length(data("one_store"))) || (vlSelectionTest("one_store", datum))');
        assert.equal(predicate(model, 'four'), '(vlSelectionTest("four_store", datum))');
        assert.equal(predicate(model, { not: 'one' }), '!(length(data("one_store"))) || (!(vlSelectionTest("one_store", datum)))');
        assert.equal(predicate(model, { not: { and: ['one', 'two'] } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSelectionTest("one_store", datum)) && ' +
            '(vlSelectionTest("two_store", datum, "union"))))');
        assert.equal(predicate(model, { not: { and: ['one', 'four'] } }), '!(length(data("one_store"))) || ' +
            '(!((vlSelectionTest("one_store", datum)) && ' +
            '(vlSelectionTest("four_store", datum))))');
        assert.equal(predicate(model, { and: ['one', 'two', { not: 'thr-ee' }] }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSelectionTest("one_store", datum)) && ' +
            '(vlSelectionTest("two_store", datum, "union")) && ' +
            '(!(vlSelectionTest("thr_ee_store", datum, "intersect"))))');
        assert.equal(predicate(model, { or: ['one', { and: ['two', { not: 'thr-ee' }] }] }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSelectionTest("one_store", datum)) || ' +
            '((vlSelectionTest("two_store", datum, "union")) && ' +
            '(!(vlSelectionTest("thr_ee_store", datum, "intersect")))))');
    });
    it('generates Vega production rules', function () {
        assert.deepEqual(nonPosition('color', model, { vgChannel: 'fill' }), {
            fill: [
                { test: '!(length(data("one_store"))) || (vlSelectionTest("one_store", datum))', value: 'grey' },
                { scale: 'color', field: 'Cylinders' }
            ]
        });
        assert.deepEqual(nonPosition('opacity', model), {
            opacity: [
                {
                    test: '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
                        '((vlSelectionTest("one_store", datum)) || ' +
                        '((vlSelectionTest("two_store", datum, "union")) && ' +
                        '(!(vlSelectionTest("thr_ee_store", datum, "intersect")))))',
                    value: 0.5
                },
                { scale: 'opacity', field: 'Origin' }
            ]
        });
    });
    it('generates a selection filter', function () {
        assert.equal(expression(model, { selection: 'one' }), '!(length(data("one_store"))) || (vlSelectionTest("one_store", datum))');
        assert.equal(expression(model, { selection: { not: 'one' } }), '!(length(data("one_store"))) || (!(vlSelectionTest("one_store", datum)))');
        assert.equal(expression(model, { selection: { not: { and: ['one', 'two'] } } }), '!(length(data("one_store")) || length(data("two_store"))) || ' +
            '(!((vlSelectionTest("one_store", datum)) && ' +
            '(vlSelectionTest("two_store", datum, "union"))))');
        assert.equal(expression(model, { selection: { and: ['one', 'two', { not: 'thr-ee' }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSelectionTest("one_store", datum)) && ' +
            '(vlSelectionTest("two_store", datum, "union")) && ' +
            '(!(vlSelectionTest("thr_ee_store", datum, "intersect"))))');
        assert.equal(expression(model, { selection: { or: ['one', { and: ['two', { not: 'thr-ee' }] }] } }), '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSelectionTest("one_store", datum)) || ' +
            '((vlSelectionTest("two_store", datum, "union")) && ' +
            '(!(vlSelectionTest("thr_ee_store", datum, "intersect")))))');
    });
    it('throws an error for unknown selections', function () {
        assert.throws(function () { return predicate(model, 'helloworld'); }, 'Cannot find a selection named "helloworld"');
    });
});
//# sourceMappingURL=predicate.test.js.map