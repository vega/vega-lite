import {nonPosition} from '../../../src/compile/mark/encode';
import {expression} from '../../../src/compile/predicate';
import {parseSelectionPredicate as predicate, parseUnitSelection} from '../../../src/compile/selection/parse';
import {parseUnitModel} from '../../util';

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
        field: 'Acceleration',
        type: 'quantitative',
        condition: {
          selection: 'one',
          empty: false,
          value: 0.5
        }
      }
    }
  });

  model.parseScale();

  model.component.selection = parseUnitSelection(model, [
    {name: 'one', select: 'point'},
    {name: 'two', select: {type: 'point', resolve: 'union'}},
    {name: 'thr-ee', select: {type: 'interval', resolve: 'intersect'}}
  ]);

  it('generates the predicate expression', () => {
    // Different resolutions
    expect(predicate(model, {selection: 'one'})).toBe(
      '!length(data("one_store")) || vlSelectionTest("one_store", datum)'
    );
    expect(predicate(model, {selection: 'two'})).toBe(
      '!length(data("two_store")) || vlSelectionTest("two_store", datum, "union")'
    );
    expect(predicate(model, {selection: 'thr-ee'})).toBe(
      '!length(data("thr_ee_store")) || vlSelectionTest("thr_ee_store", datum, "intersect")'
    );

    // Different emptiness
    expect(predicate(model, {selection: 'one', empty: true})).toBe(
      '!length(data("one_store")) || vlSelectionTest("one_store", datum)'
    );
    expect(predicate(model, {selection: 'one', empty: false})).toBe(
      'length(data("one_store")) && vlSelectionTest("one_store", datum)'
    );
  });

  it('generates Vega production rules', () => {
    expect(nonPosition('color', model, {vgChannel: 'fill'})).toEqual({
      fill: [
        {test: '!length(data("one_store")) || vlSelectionTest("one_store", datum)', value: 'grey'},
        {scale: 'color', field: 'Cylinders'}
      ]
    });

    expect(nonPosition('opacity', model)).toEqual({
      opacity: [
        {
          test: 'length(data("one_store")) && vlSelectionTest("one_store", datum)',
          value: 0.5
        },
        {scale: 'opacity', field: 'Acceleration'}
      ]
    });
  });

  it('generates a selection filter', () => {
    expect(expression(model, {selection: 'one'})).toEqual(
      '!length(data("one_store")) || vlSelectionTest("one_store", datum)'
    );

    expect(expression(model, {not: {selection: 'one', empty: false}})).toEqual(
      '!(length(data("one_store")) && vlSelectionTest("one_store", datum))'
    );
  });

  it('throws an error for unknown selections', () => {
    expect(() => predicate(model, {selection: 'helloworld'})).toThrow();
  });
});
