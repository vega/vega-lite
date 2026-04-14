import {nonPosition} from '../../../src/compile/mark/encode/index.js';
import {compile} from '../../../src/compile/compile.js';
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

  it('resolves selection comparator refs across composed views', () => {
    const {spec} = compile({
      data: {
        values: [
          {year: 2000, age: 0, people: 1},
          {year: 2001, age: 1, people: 2},
        ],
      },
      params: [
        {
          name: 'bar_click',
          select: {type: 'point', fields: ['year']},
          views: ['bars'],
        },
      ],
      vconcat: [
        {
          transform: [{filter: {field: 'year', lte: {param: 'bar_click', field: 'year'}}}],
          mark: 'line',
          encoding: {
            x: {field: 'age', type: 'ordinal'},
            y: {aggregate: 'sum', field: 'people', type: 'quantitative'},
            color: {field: 'year', type: 'ordinal'},
          },
        },
        {
          name: 'bars',
          mark: 'bar',
          encoding: {
            x: {field: 'year', type: 'ordinal'},
            y: {aggregate: 'sum', field: 'people', type: 'quantitative'},
          },
        },
      ],
    } as any);

    const filterExprs = spec.data
      .flatMap((d: any) => d.transform ?? [])
      .filter((t: any) => t.type === 'filter')
      .map((t: any) => t.expr);

    expect(filterExprs).toContain(
      '(!length(data("bar_click_store")) || (datum["year"]<=(length(data("bar_click_store")) ? data("bar_click_store")[0].values[0] : null)))',
    );
  });

  it('supports all comparator operators with selection param refs', () => {
    const opModel = parseUnitModel({
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      },
    });
    opModel.parseScale();
    opModel.component.selection = parseUnitSelection(opModel, [
      {name: 'pick', select: {type: 'point', fields: ['Horsepower']}},
    ]);

    expect(expression(opModel, {field: 'Horsepower', equal: {param: 'pick', field: 'Horsepower'}})).toBe(
      '(!length(data("pick_store")) || (datum["Horsepower"]===(length(data("pick_store")) ? data("pick_store")[0].values[0] : null)))',
    );
    expect(expression(opModel, {field: 'Horsepower', lt: {param: 'pick', field: 'Horsepower'}})).toBe(
      '(!length(data("pick_store")) || (datum["Horsepower"]<(length(data("pick_store")) ? data("pick_store")[0].values[0] : null)))',
    );
    expect(expression(opModel, {field: 'Horsepower', gt: {param: 'pick', field: 'Horsepower'}})).toBe(
      '(!length(data("pick_store")) || (datum["Horsepower"]>(length(data("pick_store")) ? data("pick_store")[0].values[0] : null)))',
    );
    expect(expression(opModel, {field: 'Horsepower', gte: {param: 'pick', field: 'Horsepower'}})).toBe(
      '(!length(data("pick_store")) || (datum["Horsepower"]>=(length(data("pick_store")) ? data("pick_store")[0].values[0] : null)))',
    );
  });

  it('falls back to plain parameter access when no matching selection exists', () => {
    expect(expression(model, {field: 'Horsepower', lte: {param: 'missing', field: 'Horsepower', empty: false}})).toBe(
      'datum["Horsepower"]<=missing["Horsepower"]',
    );
  });
});
