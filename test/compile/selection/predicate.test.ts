import {nonPosition} from '../../../src/compile/mark/encode/index.js';
import {expression} from '../../../src/compile/predicate.js';
import {parseSelectionPredicate as predicate, parseUnitSelection} from '../../../src/compile/selection/parse.js';
import {parseUnitModel} from '../../util.js';

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
          param: 'one',
          value: 'grey',
        },
      },
      opacity: {
        field: 'Acceleration',
        type: 'quantitative',
        condition: {
          param: 'two',
          empty: false,
          value: 0.5,
        },
      },
      size: {
        value: 50,
        condition: {
          param: 'varHelloWorld',
          field: 'Displacement',
          type: 'quantitative',
        },
      },
    },
  });

  model.parseScale();

  model.component.selection = parseUnitSelection(model, [
    {name: 'one', select: 'point'},
    {name: 'two', select: {type: 'point', resolve: 'union'}},
    {name: 'thr-ee', select: {type: 'interval', resolve: 'intersect'}},
  ]);

  it('generates the predicate expression', () => {
    // Different resolutions
    expect(predicate(model, {param: 'one'})).toBe(
      '!length(data("one_store")) || vlSelectionIdTest("one_store", datum)',
    );
    expect(predicate(model, {param: 'two'})).toBe(
      '!length(data("two_store")) || vlSelectionIdTest("two_store", datum, "union")',
    );
    expect(predicate(model, {param: 'thr-ee'})).toBe(
      '!length(data("thr_ee_store")) || vlSelectionTest("thr_ee_store", datum, "intersect")',
    );

    // Different emptiness
    expect(predicate(model, {param: 'one', empty: true})).toBe(
      '!length(data("one_store")) || vlSelectionIdTest("one_store", datum)',
    );
    expect(predicate(model, {param: 'two', empty: false})).toBe(
      'length(data("two_store")) && vlSelectionIdTest("two_store", datum, "union")',
    );

    // Variable parameters
    expect(predicate(model, {param: 'helloworld'})).toBe('!!helloworld');
  });

  it('generates Vega production rules', () => {
    expect(nonPosition('color', model, {vgChannel: 'fill'})).toEqual({
      fill: [
        {test: '!length(data("one_store")) || vlSelectionIdTest("one_store", datum)', value: 'grey'},
        {scale: 'color', field: 'Cylinders'},
      ],
    });

    expect(nonPosition('opacity', model)).toEqual({
      opacity: [
        {
          test: 'length(data("two_store")) && vlSelectionIdTest("two_store", datum, "union")',
          value: 0.5,
        },
        {scale: 'opacity', field: 'Acceleration'},
      ],
    });

    expect(nonPosition('size', model)).toEqual({
      size: [
        {
          test: '!!varHelloWorld',
          scale: 'size',
          field: 'Displacement',
        },
        {value: 50},
      ],
    });
  });

  it('generates a selection filter', () => {
    expect(expression(model, {param: 'one'})).toBe(
      '!length(data("one_store")) || vlSelectionIdTest("one_store", datum)',
    );

    expect(expression(model, {not: {param: 'two', empty: false}})).toBe(
      '!(length(data("two_store")) && vlSelectionIdTest("two_store", datum, "union"))',
    );

    expect(expression(model, {not: {param: 'varHelloWorld'}})).toBe('!(!!varHelloWorld)');
  });
});
