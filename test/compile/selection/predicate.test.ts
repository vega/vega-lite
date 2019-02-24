/* tslint:disable quotemark */

import {nonPosition} from '../../../src/compile/mark/mixins';
import {expression} from '../../../src/compile/predicate';
import * as selection from '../../../src/compile/selection/selection';
import {parseUnitModel} from '../../util';

const predicate = selection.selectionPredicate;

describe('Selection Predicate', () => {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
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
          selection: {or: ['one', {and: ['two', {not: 'thr-ee'}]}]},
          value: 0.5
        }
      }
    }
  });

  model.parseScale();

  model.component.selection = selection.parseUnitSelection(model, {
    one: {type: 'single'},
    two: {type: 'multi', resolve: 'union'},
    'thr-ee': {type: 'interval', resolve: 'intersect'},
    four: {type: 'single', empty: 'none'}
  });

  it('generates the predicate expression', () => {
    expect(predicate(model, 'one')).toEqual('!(length(data("one_store"))) || (vlSelectionTest("one_store", datum))');

    expect(predicate(model, 'four')).toEqual('(vlSelectionTest("four_store", datum))');

    expect(predicate(model, {not: 'one'})).toEqual(
      '!(length(data("one_store"))) || (!(vlSelectionTest("one_store", datum)))'
    );

    expect(predicate(model, {not: {and: ['one', 'two']}})).toEqual(
      '!(length(data("one_store")) || length(data("two_store"))) || ' +
        '(!((vlSelectionTest("one_store", datum)) && ' +
        '(vlSelectionTest("two_store", datum, "union"))))'
    );

    expect(predicate(model, {not: {and: ['one', 'four']}})).toEqual(
      '!(length(data("one_store"))) || ' +
        '(!((vlSelectionTest("one_store", datum)) && ' +
        '(vlSelectionTest("four_store", datum))))'
    );

    expect(predicate(model, {and: ['one', 'two', {not: 'thr-ee'}]})).toEqual(
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSelectionTest("one_store", datum)) && ' +
        '(vlSelectionTest("two_store", datum, "union")) && ' +
        '(!(vlSelectionTest("thr_ee_store", datum, "intersect"))))'
    );

    expect(predicate(model, {or: ['one', {and: ['two', {not: 'thr-ee'}]}]})).toEqual(
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSelectionTest("one_store", datum)) || ' +
        '((vlSelectionTest("two_store", datum, "union")) && ' +
        '(!(vlSelectionTest("thr_ee_store", datum, "intersect")))))'
    );
  });

  it('generates Vega production rules', () => {
    expect(nonPosition('color', model, {vgChannel: 'fill'})).toEqual({
      fill: [
        {test: '!(length(data("one_store"))) || (vlSelectionTest("one_store", datum))', value: 'grey'},
        {scale: 'color', field: 'Cylinders'}
      ]
    });

    expect(nonPosition('opacity', model)).toEqual({
      opacity: [
        {
          test:
            '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSelectionTest("one_store", datum)) || ' +
            '((vlSelectionTest("two_store", datum, "union")) && ' +
            '(!(vlSelectionTest("thr_ee_store", datum, "intersect")))))',
          value: 0.5
        },
        {scale: 'opacity', field: 'Origin'}
      ]
    });
  });

  it('generates a selection filter', () => {
    expect(expression(model, {selection: 'one'})).toEqual(
      '!(length(data("one_store"))) || (vlSelectionTest("one_store", datum))'
    );

    expect(expression(model, {selection: {not: 'one'}})).toEqual(
      '!(length(data("one_store"))) || (!(vlSelectionTest("one_store", datum)))'
    );

    expect(expression(model, {selection: {not: {and: ['one', 'two']}}})).toEqual(
      '!(length(data("one_store")) || length(data("two_store"))) || ' +
        '(!((vlSelectionTest("one_store", datum)) && ' +
        '(vlSelectionTest("two_store", datum, "union"))))'
    );

    expect(expression(model, {selection: {and: ['one', 'two', {not: 'thr-ee'}]}})).toEqual(
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSelectionTest("one_store", datum)) && ' +
        '(vlSelectionTest("two_store", datum, "union")) && ' +
        '(!(vlSelectionTest("thr_ee_store", datum, "intersect"))))'
    );

    expect(expression(model, {selection: {or: ['one', {and: ['two', {not: 'thr-ee'}]}]}})).toEqual(
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSelectionTest("one_store", datum)) || ' +
        '((vlSelectionTest("two_store", datum, "union")) && ' +
        '(!(vlSelectionTest("thr_ee_store", datum, "intersect")))))'
    );
  });

  it('throws an error for unknown selections', () => {
    expect(() => predicate(model, 'helloworld')).toThrow();
  });
});
