import {parseLayerModel, parseUnitModelWithScale} from '../../util.js';
import * as log from '../../../src/log/index.js';

describe('legend/assemble', () => {
  it('correctly applies labelExpr.', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          field: 'Origin',
          type: 'nominal',
          legend: {
            labelExpr: 'datum.label[0]',
          },
        },
      },
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends[0].encode.labels.update.text).toEqual({
      signal: 'datum.label[0]',
    });
  });

  it('correctly applies custom formatter to labelExpr.', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          field: 'Origin',
          type: 'nominal',
          legend: {
            format: {a: 'b'},
            formatType: 'myFormat',
            labelExpr: 'datum.label[0]',
          },
        },
      },
      config: {customFormatTypes: true},
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends[0].encode.labels.update.text).toEqual({
      signal: 'myFormat(datum.value, {"a":"b"})[0]',
    });
  });

  it('correctly applies labelExpr for timeUnit.', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {
          timeUnit: 'month',
          field: 'date',
          type: 'temporal',
          legend: {
            labelExpr: 'datum.label[0]',
          },
        },
      },
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends[0].encode.labels.update.text).toEqual({
      signal: 'datum.label[0]',
    });
  });

  it('merges legend of the same field with the default type.', () => {
    const model = parseUnitModelWithScale({
      $schema: 'https://vega.github.io/schema/vega-lite/v6.json',
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        x: {field: 'Horsepower', type: 'quantitative'},
        y: {field: 'Miles_per_Gallon', type: 'quantitative'},
        color: {field: 'Origin', type: 'nominal'},
        shape: {field: 'Origin', type: 'nominal'},
      },
    });
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);

    expect(legends[0].title).toBe('Origin');
    expect(legends[0].stroke).toBe('color');
  });

  it('merges legend of the same field and favor symbol legend over gradient', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [
          {a: 'A', b: 28},
          {a: 'B', b: 55},
        ],
      },
      mark: 'bar',
      encoding: {
        x: {field: 'a', type: 'ordinal'},
        y: {field: 'b', type: 'quantitative'},
        color: {field: 'b', type: 'quantitative'},
        size: {field: 'b', type: 'quantitative'},
      },
    });

    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].title).toBe('b');
    expect(legends[0].fill).toBe('color');
    expect(legends[0].size).toBe('size');
    expect(legends[0].encode.symbols.update?.fill).toBeUndefined();
  });

  it('sets aria to false if set in config', () => {
    const model = parseUnitModelWithScale({
      mark: 'point',
      encoding: {
        color: {field: 'b', type: 'quantitative'},
      },
      config: {
        aria: false,
      },
    });

    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].aria).toBe(false);
  });

  it('does not merge legends for different discrete fields', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        color: {field: 'Origin', type: 'nominal'},
        shape: {field: 'Cylinders', type: 'ordinal'},
      },
    });

    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(2);
    const titles = legends.map((l) => l.title);
    expect(titles).toEqual(expect.arrayContaining(['Origin', 'Cylinders']));
  });

  it('does not merge legends when same field is discrete vs continuous', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        color: {field: 'Horsepower', type: 'nominal'},
        size: {field: 'Horsepower', type: 'quantitative'},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(2);
  });

  it('merges same discrete field and unions array domains', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [{cat: 'A'}, {cat: 'B'}, {cat: 'C'}],
      },
      mark: 'point',
      encoding: {
        color: {field: 'cat', type: 'nominal', scale: {domain: ['A', 'B']}},
        shape: {field: 'cat', type: 'nominal', scale: {domain: ['B', 'C']}},
      },
    });

    // Capture warning
    log.wrap((localLogger: any) => {
      model.parseLegends();
      const legends = model.assembleLegends();
      expect(localLogger.warns).toContain('Unioning discrete legend values from color and shape.');
      expect(legends).toHaveLength(1);
      expect(legends[0].values).toEqual(['A', 'B', 'C']);
    })();
  });

  it('preserves explicit legend.values over unioned domains', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [{cat: 'A'}, {cat: 'B'}, {cat: 'C'}],
      },
      mark: 'point',
      encoding: {
        color: {
          field: 'cat',
          type: 'nominal',
          scale: {domain: ['A', 'B']},
          legend: {values: ['B', 'A']},
        },
        shape: {field: 'cat', type: 'nominal', scale: {domain: ['B', 'C']}},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].values).toEqual(['B', 'A']);
  });

  it('keeps same array when both discrete domains are equal', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [{cat: 'A'}, {cat: 'B'}],
      },
      mark: 'point',
      encoding: {
        color: {field: 'cat', type: 'nominal', scale: {domain: ['A', 'B']}},
        shape: {field: 'cat', type: 'nominal', scale: {domain: ['A', 'B']}},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].values).toEqual(['A', 'B']);
  });

  it('merges discrete field without arrays (data domains) and does not set values', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [{cat: 'A'}, {cat: 'B'}, {cat: 'C'}],
      },
      mark: 'point',
      encoding: {
        color: {field: 'cat', type: 'nominal'},
        shape: {field: 'cat', type: 'nominal'},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect((legends[0] as any).values).toBeUndefined();
  });

  it('does not merge different fields even if discrete domains arrays are identical', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [{cat1: 'A', cat2: 'A'}],
      },
      mark: 'point',
      encoding: {
        color: {field: 'cat1', type: 'nominal', scale: {domain: ['A', 'B']}},
        shape: {field: 'cat2', type: 'nominal', scale: {domain: ['A', 'B']}},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(2);
  });

  it('does not merge when explicit orient conflicts for the same field', () => {
    const model = parseUnitModelWithScale({
      data: {url: 'data/cars.json'},
      mark: 'point',
      encoding: {
        color: {field: 'Origin', type: 'nominal', legend: {orient: 'left'}},
        shape: {field: 'Origin', type: 'nominal', legend: {orient: 'right'}},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(2);
  });

  it('merges continuous same field without setting values', () => {
    const model = parseUnitModelWithScale({
      data: {
        values: [{v: 1}, {v: 2}],
      },
      mark: 'trail',
      encoding: {
        color: {field: 'v', type: 'quantitative'},
        size: {field: 'v', type: 'quantitative'},
      },
    });

    model.parseLegends();
    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect((legends[0] as any).values).toBeUndefined();
  });

  it('layer: groups by child field when shared and unions values from unioned domains', () => {
    const model = parseLayerModel({
      layer: [
        {
          mark: 'point',
          encoding: {
            color: {field: 'cat', type: 'nominal', scale: {domain: ['A', 'B']}},
            shape: {field: 'cat', type: 'nominal', scale: {domain: ['A', 'C']}},
          },
        },
        {
          mark: 'point',
          encoding: {
            color: {field: 'cat', type: 'nominal', scale: {domain: ['B', 'D']}},
            shape: {field: 'cat', type: 'nominal', scale: {domain: ['C', 'E']}},
          },
        },
      ],
    });

    model.parseScale();
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].title).toBe('cat');
    // Values should be the union of discrete arrays from unioned domains across channels
    expect(legends[0].values).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D', 'E']));
    expect((legends[0].values as any[]).length).toBe(5);
  });

  it('layer: ambiguous child fields fallback to channel grouping (unique > 1 path)', () => {
    const model = parseLayerModel({
      layer: [
        {
          mark: 'point',
          encoding: {
            color: {field: 'a', type: 'nominal'},
          },
        },
        {
          mark: 'point',
          encoding: {
            color: {field: 'b', type: 'nominal'},
          },
        },
      ],
    });

    model.parseScale();
    model.parseLegends();

    const legends = model.assembleLegends();
    expect(legends).toHaveLength(1);
    expect(legends[0].title).toBe('a, b');
  });
});
