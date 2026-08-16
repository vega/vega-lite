import {describe, expect, it} from 'vitest';
import {compile} from '../../../src/compile/compile.js';
import * as log from '../../../src/log/index.js';
import {TopLevelSpec} from '../../../src/index.js';

/**
 * A selection's `predicate` replaces the values it captures with comparisons
 * against them. Because it changes only what goes into the store, everything
 * downstream that consumes a selection should keep working untouched -- these
 * tests pin that down at each of those consumption points.
 */

/** Select every car up to the horsepower of the one clicked. */
const UPTO = {field: 'Horsepower', lte: {expr: 'datum.Horsepower'}};

/** Select a twenty-horsepower window ending at the one clicked. */
const WINDOW = {
  field: 'Horsepower',
  range: [{expr: 'datum.Horsepower - 20'}, {expr: 'datum.Horsepower'}],
};

const cars = (params: any[], rest: any = {}): TopLevelSpec =>
  ({
    data: {url: 'data/cars.json'},
    params,
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
    },
    ...rest,
  }) as TopLevelSpec;

const signal = (spec: TopLevelSpec, name: string) => {
  const compiled = compile(spec).spec;
  const inGroups = compiled.marks?.flatMap((m: any) => m.signals ?? []) ?? [];
  return [...compiled.signals, ...inGroups].find((s) => s.name === name) as any;
};

describe('Selection Predicate Projection', () => {
  describe('tuple construction', () => {
    it('captures the comparison rather than the value', () => {
      const spec = cars([{name: 'p', select: {type: 'point', predicate: UPTO}}]);

      expect(signal(spec, 'p_tuple_fields').value).toEqual([{field: 'Horsepower', type: 'E-LTE', channel: 'x'}]);
      expect(signal(spec, 'p_tuple').on[0].update).toContain('values: [datum.Horsepower]');
    });

    it('keeps the guard that other point selections use', () => {
      // a predicate changes the values, not when they are captured
      const spec = cars([{name: 'p', select: {type: 'point', predicate: UPTO}}]);
      const update = signal(spec, 'p_tuple').on[0].update;

      expect(update).toContain("item().mark.marktype !== 'group'");
      expect(update).toContain("indexof(item().mark.role, 'legend') < 0");
      expect(update).toContain(': null');
    });

    it('does not deduplicate leaves on the same field', () => {
      // the store tests tuple fields positionally, so a windowed predicate needs
      // both of its comparisons on the same field
      const spec = cars([
        {
          name: 'p',
          select: {
            type: 'point',
            predicate: {
              and: [
                {field: 'Horsepower', gte: {expr: 'datum.Horsepower - 20'}},
                {field: 'Horsepower', lte: {expr: 'datum.Horsepower'}},
              ],
            },
          },
        },
      ]);

      expect(signal(spec, 'p_tuple_fields').value).toEqual([
        {field: 'Horsepower', type: 'E-GTE', channel: 'x'},
        {field: 'Horsepower', type: 'E-LTE', channel: 'x'},
      ]);
      expect(signal(spec, 'p_tuple').on[0].update).toContain('values: [datum.Horsepower - 20, datum.Horsepower]');
    });
  });

  describe('consumption points', () => {
    it('works in a filter transform', () => {
      const compiled = compile(
        cars([{name: 'p', select: {type: 'point', predicate: UPTO}}], {
          transform: [{filter: {param: 'p'}}],
        }),
      ).spec;

      const filters = compiled.data.flatMap((d) => d.transform ?? []).filter((t: any) => t.type === 'filter');
      expect(filters.map((t: any) => t.expr)).toContain(
        '!length(data("p_store")) || vlSelectionTest("p_store", datum)',
      );
    });

    it('honors empty semantics in a filter transform', () => {
      const compiled = compile(
        cars([{name: 'p', select: {type: 'point', predicate: UPTO}}], {
          transform: [{filter: {param: 'p', empty: false}}],
        }),
      ).spec;

      const filters = compiled.data.flatMap((d) => d.transform ?? []).filter((t: any) => t.type === 'filter');
      expect(filters.map((t: any) => t.expr)).toContain('length(data("p_store")) && vlSelectionTest("p_store", datum)');
    });

    it('works in a conditional encoding', () => {
      const compiled = compile(
        cars([{name: 'p', select: {type: 'point', predicate: UPTO}}], {
          mark: 'circle',
          encoding: {
            x: {field: 'Horsepower', type: 'quantitative'},
            y: {field: 'Miles_per_Gallon', type: 'quantitative'},
            color: {condition: {param: 'p', value: 'red'}, value: 'grey'},
          },
        }),
      ).spec;

      expect(compiled.marks[0].encode.update.fill).toEqual([
        {test: '!length(data("p_store")) || vlSelectionTest("p_store", datum)', value: 'red'},
        {value: 'grey'},
      ]);
    });

    it('works as a scale domain', () => {
      const compiled = compile(
        cars([{name: 'p', select: {type: 'point', predicate: WINDOW}}], {
          mark: 'circle',
          encoding: {
            x: {field: 'Horsepower', type: 'quantitative', scale: {domain: {param: 'p'}}},
            y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          },
        }),
      ).spec;

      const x = compiled.scales.find((s) => s.name === 'x') as any;
      expect(x.domainRaw).toEqual({signal: 'p["Horsepower"]'});
    });

    it('works bound to scales', () => {
      const compiled = compile(cars([{name: 'p', select: {type: 'point', predicate: WINDOW}, bind: 'scales'}])).spec;

      const x = compiled.scales.find((s) => s.name === 'x') as any;
      expect(x.domainRaw).toEqual({signal: 'p["Horsepower"]'});
      expect(compiled.marks[0].clip).toBe(true);
    });

    it('works bound to a legend', () => {
      // the legend supplies the comparison value, so clicking an entry selects
      // everything up to it rather than only that entry
      const compiled = compile({
        data: {url: 'data/cars.json'},
        params: [
          {
            name: 'p',
            select: {type: 'point', predicate: {field: 'Cylinders', lte: {expr: 'datum.Cylinders'}}},
            bind: 'legend',
          },
        ],
        mark: 'circle',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {field: 'Cylinders', type: 'ordinal'},
        },
      } as TopLevelSpec).spec;

      const tuple = compiled.signals.find((s) => s.name === 'p_tuple') as any;
      expect(tuple.update).toBe(
        'p_Cylinders_legend !== null ? {fields: p_tuple_fields, values: [p_Cylinders_legend]} : null',
      );
      expect((compiled.signals.find((s) => s.name === 'p_tuple_fields') as any).value).toEqual([
        {field: 'Cylinders', type: 'E-LTE', channel: 'color'},
      ]);
    });

    it('works across views in a layer', () => {
      const compiled = compile({
        data: {url: 'data/cars.json'},
        layer: [
          {
            params: [{name: 'p', select: {type: 'point', predicate: UPTO}}],
            mark: 'circle',
            encoding: {
              x: {field: 'Horsepower', type: 'quantitative'},
              y: {field: 'Miles_per_Gallon', type: 'quantitative'},
            },
          },
          {
            transform: [{filter: {param: 'p'}}],
            mark: {type: 'circle', color: 'red'},
            encoding: {
              x: {field: 'Horsepower', type: 'quantitative'},
              y: {field: 'Miles_per_Gallon', type: 'quantitative'},
            },
          },
        ],
      } as TopLevelSpec).spec;

      // the tuple records the unit it came from, so resolution still works
      const tuple = compiled.signals.find((s) => s.name === 'p_tuple') as any;
      expect(tuple.on[0].update).toContain('unit: "layer_0"');

      const filters = compiled.data.flatMap((d) => d.transform ?? []).filter((t: any) => t.type === 'filter');
      expect(filters.some((t: any) => t.expr.includes('vlSelectionTest("p_store"'))).toBe(true);
    });

    it('works across views in a concat', () => {
      const compiled = compile({
        data: {url: 'data/cars.json'},
        vconcat: [
          {
            params: [{name: 'p', select: {type: 'point', predicate: UPTO}}],
            mark: 'circle',
            encoding: {
              x: {field: 'Horsepower', type: 'quantitative'},
              y: {field: 'Miles_per_Gallon', type: 'quantitative'},
            },
          },
          {
            transform: [{filter: {param: 'p'}}],
            mark: 'bar',
            encoding: {
              x: {field: 'Origin', type: 'nominal'},
              y: {aggregate: 'count', type: 'quantitative'},
            },
          },
        ],
      } as TopLevelSpec).spec;

      const tuple = compiled.marks.flatMap((m: any) => m.signals ?? []).find((s: any) => s.name === 'p_tuple');
      expect(tuple.on[0].update).toContain('unit: "concat_0"');
    });

    it('initializes the store from a value', () => {
      const compiled = compile(
        cars([{name: 'p', value: [{Horsepower: 100}], select: {type: 'point', predicate: UPTO}}]),
      ).spec;

      const store = compiled.data.find((d) => d.name === 'p_store') as any;
      expect(store.values).toEqual([
        {unit: '', fields: [{field: 'Horsepower', type: 'E-LTE', channel: 'x'}], values: [100]},
      ]);
    });
  });

  describe('interaction with other selection properties', () => {
    it('leaves toggling intact', () => {
      const compiled = compile(
        cars([{name: 'p', select: {type: 'point', predicate: UPTO}}], {
          mark: 'circle',
          encoding: {
            x: {field: 'Horsepower', type: 'quantitative'},
            y: {field: 'Miles_per_Gallon', type: 'quantitative'},
            color: {condition: {param: 'p', value: 'red'}, value: 'grey'},
          },
        }),
      ).spec;

      expect(compiled.signals.find((s) => s.name === 'p_toggle')).toBeDefined();
      expect((compiled.signals.find((s) => s.name === 'p_modify') as any).on[0].update).toContain('p_toggle');
    });

    it('leaves clearing intact', () => {
      const spec = cars([{name: 'p', select: {type: 'point', predicate: UPTO}}]);
      const tuple = signal(spec, 'p_tuple');

      expect(tuple.on.some((h: any) => h.update === 'null')).toBe(true);
    });

    it('respects an explicit toggle: false', () => {
      const spec = cars([{name: 'p', select: {type: 'point', predicate: UPTO, toggle: false}}]);
      expect(signal(spec, 'p_toggle')).toBeUndefined();
    });
  });

  describe('validation', () => {
    const parse = (params: any[]) => compile(cars(params));

    it(
      'warns and ignores an "or" composition',
      log.wrap((localLogger) => {
        parse([
          {
            name: 'p',
            select: {
              type: 'point',
              predicate: {
                or: [
                  {field: 'a', gte: 1},
                  {field: 'a', lte: 2},
                ],
              },
            },
          },
        ]);
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_COMPOSITION_UNSUPPORTED);
      }),
    );

    it(
      'warns and ignores a nested "and"',
      log.wrap((localLogger) => {
        parse([
          {
            name: 'p',
            select: {
              type: 'point',
              predicate: {and: [{and: [{field: 'a', gte: 1}]}, {field: 'a', lte: 2}]},
            },
          },
        ]);
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_COMPOSITION_UNSUPPORTED);
      }),
    );

    it(
      'warns and ignores a leaf without a field',
      log.wrap((localLogger) => {
        parse([{name: 'p', select: {type: 'point', predicate: {lte: 1} as any}}]);
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_REQUIRES_FIELD);
      }),
    );

    it(
      'warns and ignores a predicate on an interval selection',
      log.wrap((localLogger) => {
        // the brush supplies an interval's tuple, and the rest of its compilation
        // needs the ordinary channel projection
        expect(() => parse([{name: 'p', select: {type: 'interval', predicate: UPTO} as any}])).not.toThrow();
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_REQUIRES_POINT);
      }),
    );

    it(
      'warns when a datum-comparing predicate is combined with nearest',
      log.wrap((localLogger) => {
        parse([{name: 'p', select: {type: 'point', predicate: UPTO, nearest: true}}]);
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_INCOMPATIBLE_WITH_NEAREST);
      }),
    );

    it(
      'does not warn about nearest when the predicate does not read datum',
      log.wrap((localLogger) => {
        parse([{name: 'p', select: {type: 'point', predicate: {field: 'Horsepower', lte: 150}, nearest: true}}]);
        expect(localLogger.warns).not.toContain(log.message.SELECTION_PREDICATE_INCOMPATIBLE_WITH_NEAREST);
      }),
    );

    it('falls back to the ordinary projection when the predicate is rejected', () => {
      log.wrap(() => {
        const compiled = compile(
          cars([
            {
              name: 'p',
              select: {
                type: 'point',
                fields: ['Origin'],
                predicate: {
                  or: [
                    {field: 'a', gte: 1},
                    {field: 'a', lte: 2},
                  ],
                } as any,
              },
            },
          ]),
        ).spec;

        expect((compiled.signals.find((s) => s.name === 'p_tuple_fields') as any).value).toEqual([
          {type: 'E', field: 'Origin'},
        ]);
      })();
    });
  });

  describe('normalization and edge cases', () => {
    it(
      'warns and ignores an empty "and"',
      log.wrap((localLogger) => {
        const spec = compile(cars([{name: 'p', select: {type: 'point', predicate: {and: []}}}])).spec;
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_EMPTY);
        // falls back to the ordinary projection rather than a match-all tuple
        expect(spec.signals.find((s) => s.name === 'p_tuple_fields')).toBeUndefined();
      }),
    );

    it(
      'warns and ignores {"valid": false}',
      log.wrap((localLogger) => {
        compile(cars([{name: 'p', select: {type: 'point', predicate: {field: 'Horsepower', valid: false}}}]));
        expect(localLogger.warns).toContain(log.message.SELECTION_PREDICATE_VALID_FALSE);
      }),
    );

    it('rewrites a one-sided range as the equivalent single comparison', () => {
      // the store's range test coerces a null bound to zero
      const spec = compile(
        cars([{name: 'p', select: {type: 'point', predicate: {field: 'Horsepower', range: [null, 100]}}}]),
      ).spec;
      expect((spec.signals.find((s) => s.name === 'p_tuple_fields') as any).value).toEqual([
        {field: 'Horsepower', type: 'E-LTE', channel: 'x'},
      ]);
    });

    it('orders lower bounds before upper bounds', () => {
      // vlSelectionResolve concatenates comparison values in tuple order, so
      // a selection bound to scales resolves to an ascending [low, high]
      const spec = compile(
        cars([
          {
            name: 'p',
            select: {
              type: 'point',
              predicate: {
                and: [
                  {field: 'Horsepower', lte: {expr: 'datum.Horsepower'}},
                  {field: 'Horsepower', gte: {expr: 'datum.Horsepower - 20'}},
                ],
              },
            },
          },
        ]),
      ).spec;
      const types = (spec.signals.find((s) => s.name === 'p_tuple_fields') as any).value.map((f: any) => f.type);
      expect(types).toEqual(['E-GTE', 'E-LTE']);
    });

    it('projects a timeUnit predicate onto the derived field and computes it', () => {
      // the comparison value applies the timeUnit, so the datum side has to
      // test the same floored field
      const spec = compile({
        data: {url: 'data/cars.json'},
        params: [{name: 'p', select: {type: 'point', predicate: {field: 'Year', timeUnit: 'year', lte: {year: 1975}}}}],
        transform: [{filter: {param: 'p'}}],
        mark: 'circle',
        encoding: {
          x: {field: 'Year', type: 'temporal'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        },
      } as TopLevelSpec).spec;

      expect((spec.signals.find((s) => s.name === 'p_tuple_fields') as any).value[0].field).toBe('year_Year');
      const timeunits = spec.data.flatMap((d: any) => (d.transform ?? []).filter((t: any) => t.type === 'timeunit'));
      expect(timeunits.some((t: any) => t.as?.includes('year_Year'))).toBe(true);
    });

    it('binds scales from inside a composed view without per-unit signals', () => {
      // a point selection's store and named signal assemble at the top level,
      // so its scale extent resolves without the interval-style signal routing
      const spec = compile({
        vconcat: [
          {
            data: {url: 'data/cars.json'},
            params: [
              {
                name: 'p',
                select: {type: 'point', predicate: {field: 'Horsepower', gte: {expr: 'datum.Horsepower - 20'}}},
                bind: 'scales',
              },
            ],
            mark: 'circle',
            encoding: {
              x: {field: 'Horsepower', type: 'quantitative'},
              y: {field: 'Miles_per_Gallon', type: 'quantitative'},
            },
          },
        ],
      } as TopLevelSpec).spec;

      expect(JSON.stringify(spec)).toContain('domainRaw');
    });
  });

  describe('comparison types', () => {
    const cases: [string, any, string][] = [
      ['equal', {field: 'Horsepower', equal: 1}, 'E'],
      ['lt', {field: 'Horsepower', lt: 1}, 'E-LT'],
      ['lte', {field: 'Horsepower', lte: 1}, 'E-LTE'],
      ['gt', {field: 'Horsepower', gt: 1}, 'E-GT'],
      ['gte', {field: 'Horsepower', gte: 1}, 'E-GTE'],
      ['range', {field: 'Horsepower', range: [1, 2]}, 'R'],
      ['oneOf', {field: 'Horsepower', oneOf: [1, 2]}, 'E-ONE'],
      ['valid', {field: 'Horsepower', valid: true}, 'E-VALID'],
    ];

    for (const [label, predicate, type] of cases) {
      it(`maps ${label} onto ${type}`, () => {
        const spec = cars([{name: 'p', select: {type: 'point', predicate}}]);
        expect(signal(spec, 'p_tuple_fields').value).toEqual([{field: 'Horsepower', type, channel: 'x'}]);
      });
    }

    it('renders array-valued comparisons as arrays', () => {
      const range = cars([{name: 'p', select: {type: 'point', predicate: {field: 'Horsepower', range: [1, 2]}}}]);
      expect(signal(range, 'p_tuple').on[0].update).toContain('values: [[1, 2]]');

      const oneOf = cars([{name: 'p', select: {type: 'point', predicate: {field: 'Horsepower', oneOf: [1, 2]}}}]);
      expect(signal(oneOf, 'p_tuple').on[0].update).toContain('values: [[1, 2]]');
    });

    it('resolves a timeUnit on the compared field', () => {
      const spec = {
        data: {url: 'data/seattle-weather.csv'},
        params: [
          {
            name: 'p',
            select: {type: 'point', predicate: {field: 'date', timeUnit: 'year', lte: {year: 2013}}},
          },
        ],
        mark: 'circle',
        encoding: {x: {field: 'date', type: 'temporal'}, y: {field: 'precipitation', type: 'quantitative'}},
      } as TopLevelSpec;

      expect(signal(spec, 'p_tuple').on[0].update).toContain('datetime(2013, 0, 1, 0, 0, 0, 0)');
    });
  });
});
