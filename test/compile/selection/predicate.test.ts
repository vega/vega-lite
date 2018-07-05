/* tslint:disable quotemark */

import {assert} from 'chai';
import {nonPosition} from '../../../src/compile/mark/mixins';
import * as selection from '../../../src/compile/selection/selection';
import {expression} from '../../../src/predicate';
import {VgEncodeEntry} from '../../../src/vega.schema';
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
    assert.equal(predicate(model, 'one'), '!(length(data("one_store"))) || (vlSingle("one_store", datum))');

    assert.equal(predicate(model, 'four'), '(vlSingle("four_store", datum))');

    assert.equal(predicate(model, {not: 'one'}), '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))');

    assert.equal(
      predicate(model, {not: {and: ['one', 'two']}}),
      '!(length(data("one_store")) || length(data("two_store"))) || ' +
        '(!((vlSingle("one_store", datum)) && ' +
        '(vlMulti("two_store", datum, "union"))))'
    );

    assert.equal(
      predicate(model, {not: {and: ['one', 'four']}}),
      '!(length(data("one_store"))) || ' + '(!((vlSingle("one_store", datum)) && ' + '(vlSingle("four_store", datum))))'
    );

    assert.equal(
      predicate(model, {and: ['one', 'two', {not: 'thr-ee'}]}),
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSingle("one_store", datum)) && ' +
        '(vlMulti("two_store", datum, "union")) && ' +
        '(!(vlInterval("thr_ee_store", datum, "intersect"))))'
    );

    assert.equal(
      predicate(model, {or: ['one', {and: ['two', {not: 'thr-ee'}]}]}),
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSingle("one_store", datum)) || ' +
        '((vlMulti("two_store", datum, "union")) && ' +
        '(!(vlInterval("thr_ee_store", datum, "intersect")))))'
    );
  });

  it('generates Vega production rules', () => {
    assert.deepEqual<VgEncodeEntry>(nonPosition('color', model, {vgChannel: 'fill'}), {
      fill: [
        {test: '!(length(data("one_store"))) || (vlSingle("one_store", datum))', value: 'grey'},
        {scale: 'color', field: 'Cylinders'}
      ]
    });

    assert.deepEqual<VgEncodeEntry>(nonPosition('opacity', model), {
      opacity: [
        {
          test:
            '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
            '((vlSingle("one_store", datum)) || ' +
            '((vlMulti("two_store", datum, "union")) && ' +
            '(!(vlInterval("thr_ee_store", datum, "intersect")))))',
          value: 0.5
        },
        {scale: 'opacity', field: 'Origin'}
      ]
    });
  });

  it('generates a selection filter', () => {
    assert.equal(
      expression(model, {selection: 'one'}),
      '!(length(data("one_store"))) || (vlSingle("one_store", datum))'
    );

    assert.equal(
      expression(model, {selection: {not: 'one'}}),
      '!(length(data("one_store"))) || (!(vlSingle("one_store", datum)))'
    );

    assert.equal(
      expression(model, {selection: {not: {and: ['one', 'two']}}}),
      '!(length(data("one_store")) || length(data("two_store"))) || ' +
        '(!((vlSingle("one_store", datum)) && ' +
        '(vlMulti("two_store", datum, "union"))))'
    );

    assert.equal(
      expression(model, {selection: {and: ['one', 'two', {not: 'thr-ee'}]}}),
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSingle("one_store", datum)) && ' +
        '(vlMulti("two_store", datum, "union")) && ' +
        '(!(vlInterval("thr_ee_store", datum, "intersect"))))'
    );

    assert.equal(
      expression(model, {selection: {or: ['one', {and: ['two', {not: 'thr-ee'}]}]}}),
      '!(length(data("one_store")) || length(data("two_store")) || length(data("thr_ee_store"))) || ' +
        '((vlSingle("one_store", datum)) || ' +
        '((vlMulti("two_store", datum, "union")) && ' +
        '(!(vlInterval("thr_ee_store", datum, "intersect")))))'
    );
  });

  it('throws an error for unknown selections', () => {
    assert.throws(() => predicate(model, 'helloworld'), 'Cannot find a selection named "helloworld"');
  });
});
