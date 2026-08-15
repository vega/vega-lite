import {compile} from '../../../src/compile/compile.js';
import {assembleRootData} from '../../../src/compile/data/assemble.js';
import {
  assembleTopLevelSignals,
  assembleUnitSelectionData,
  assembleUnitSelectionSignals,
} from '../../../src/compile/selection/assemble.js';
import type {SelectionComponent} from '../../../src/compile/selection/index.js';
import {parseSelectionPredicate, parseUnitSelection} from '../../../src/compile/selection/parse.js';
import segment, {SEGMENT, segmentScopeField} from '../../../src/compile/selection/segment.js';
import * as log from '../../../src/log/index.js';
import {parseUnitModel} from '../../util.js';

describe('Segment Selection on Explicit Segments', () => {
  const model = parseUnitModel({
    mark: 'rule',
    encoding: {
      x: {field: 'x1', type: 'quantitative'},
      y: {field: 'y1', type: 'quantitative'},
      x2: {field: 'x2'},
      y2: {field: 'y2'},
    },
  });

  model.parseScale();
  model.component.selection = parseUnitSelection(model, [{name: 'seg', select: {type: 'segment'}}]);
  const selCmpt = model.component.selection.seg as SelectionComponent<'segment'>;

  it('builds tuple signals', () => {
    const signals = segment.signals(model, selCmpt, []);

    expect(signals).toContainEqual({
      name: 'seg_tuple',
      on: [
        {
          events: [{signal: 'seg_x1 || seg_y1'}],
          update: 'seg_x1 && seg_y1 ? {unit: "", values: [seg_x1[0], seg_y1[0], seg_x1[1], seg_y1[1]]} : null',
        },
      ],
    });
  });

  it('builds a visible segment mark', () => {
    const marks = segment.marks(model, selCmpt, []);
    expect(marks).toContainEqual({
      name: `seg${SEGMENT}`,
      type: 'rule',
      clip: true,
      encode: {
        enter: {},
        update: {
          x: [{test: 'data("seg_store").length && data("seg_store")[0].unit === ""', signal: 'seg_x[0]'}, {value: 0}],
          y: [{test: 'data("seg_store").length && data("seg_store")[0].unit === ""', signal: 'seg_y[0]'}, {value: 0}],
          x2: [{test: 'data("seg_store").length && data("seg_store")[0].unit === ""', signal: 'seg_x[1]'}, {value: 0}],
          y2: [{test: 'data("seg_store").length && data("seg_store")[0].unit === ""', signal: 'seg_y[1]'}, {value: 0}],
          stroke: {value: 'white'},
          strokeWidth: {value: 2},
        },
      },
    });
  });

  it('applies custom segment mark styling', () => {
    const styledModel = parseUnitModel({
      mark: 'rule',
      encoding: {
        x: {field: 'x1', type: 'quantitative'},
        y: {field: 'y1', type: 'quantitative'},
        x2: {field: 'x2'},
        y2: {field: 'y2'},
      },
    });

    styledModel.parseScale();
    styledModel.component.selection = parseUnitSelection(styledModel, [
      {
        name: 'seg',
        select: {
          type: 'segment',
          mark: {cursor: 'crosshair', stroke: 'firebrick', strokeWidth: 4, strokeDash: [4, 2]},
        },
      },
    ]);

    const styledSelCmpt = styledModel.component.selection.seg as SelectionComponent<'segment'>;
    const styledMark = segment.marks(styledModel, styledSelCmpt, []).find((mark) => mark.name === `seg${SEGMENT}`);

    expect(styledMark.encode.enter.cursor).toEqual({value: 'crosshair'});
    expect(styledMark.encode.update).toEqual(
      expect.objectContaining({
        stroke: {value: 'firebrick'},
        strokeWidth: {value: 4},
        strokeDash: {value: [4, 2]},
      }),
    );
  });

  it('builds a top-level segment signal', () => {
    expect(assembleTopLevelSignals(model, [])).toContainEqual({
      name: 'seg',
      update: 'length(data("seg_store")) ? data("seg_store")[0].values : null',
    });
  });

  it('replaces the current segment on redraw and clears visual extents', () => {
    const signals = assembleUnitSelectionSignals(model, []);

    expect(signals).toContainEqual({
      name: 'seg_modify',
      on: [{events: {signal: 'seg_tuple'}, update: 'modify("seg_store", seg_tuple, true)'}],
    });

    expect(signals.find((signal) => signal.name === 'seg_x')?.on).toEqual(
      expect.arrayContaining([{events: selCmpt.clear, update: '[0, 0]'}]),
    );
  });

  it('generates a segment intersection predicate', () => {
    const predicate = parseSelectionPredicate(model, {param: 'seg'});

    expect(predicate).toContain('!length(data("seg_store")) || ');
    expect(predicate).toContain('data("seg_store")[0].values[0]');
    expect(predicate).toContain('+(datum["x1"])');
    expect(predicate).toContain('+(datum["x2"])');
    expect(predicate).toContain('+(datum["y1"])');
    expect(predicate).toContain('+(datum["y2"])');
  });

  it('requires non-empty segment predicates when empty is false', () => {
    const predicate = parseSelectionPredicate(model, {param: 'seg', empty: false});

    expect(predicate).toContain('length(data("seg_store")) && ');
    expect(predicate).not.toContain('!length(data("seg_store")) || ');
  });
});

describe('Segment Selection on Grouped Path Marks', () => {
  const model = parseUnitModel({
    data: {
      values: [
        {step: 0, value: 1, series: 'a'},
        {step: 1, value: 2, series: 'a'},
        {step: 0, value: 3, series: 'b'},
        {step: 1, value: 1, series: 'b'},
      ],
    },
    mark: 'line',
    encoding: {
      x: {field: 'step', type: 'quantitative'},
      y: {field: 'value', type: 'quantitative'},
      detail: {field: 'series'},
    },
  });

  model.parseScale();
  model.component.selection = parseUnitSelection(model, [{name: 'seg', select: {type: 'segment'}}]);
  model.parseData();
  const selCmpt = model.component.selection.seg as SelectionComponent<'segment'>;

  it('builds tuple signals from intersected series tuples', () => {
    const signals = segment.signals(model, selCmpt, []);

    expect(signals).toContainEqual({
      name: 'seg_tuple',
      on: [
        {
          events: [{signal: 'seg_step || seg_value'}],
          update: 'seg_step && seg_value ? data("seg_tuples") : []',
        },
      ],
    });
  });

  it('builds a top-level resolved selection signal', () => {
    expect(assembleTopLevelSignals(model, [])).toContainEqual({
      name: 'seg',
      update: 'vlSelectionResolve("seg_store", "union", true, true)',
    });
  });

  it.each(['union', 'intersect'] as const)('resolves grouped path selections with %s', (resolve) => {
    const model = parseUnitModel({
      data: {
        values: [
          {step: 0, value: 1, series: 'a'},
          {step: 1, value: 2, series: 'a'},
          {step: 0, value: 3, series: 'b'},
          {step: 1, value: 1, series: 'b'},
        ],
      },
      mark: 'line',
      params: [{name: 'seg', select: {type: 'segment', resolve}}],
      encoding: {
        x: {field: 'step', type: 'quantitative'},
        y: {field: 'value', type: 'quantitative'},
        detail: {field: 'series'},
      },
    });

    model.parseScale();
    model.parseSelections();
    model.parseData();

    expect(assembleTopLevelSignals(model, [])).toContainEqual({
      name: 'seg',
      update: `vlSelectionResolve("seg_store", "${resolve}", true, true)`,
    });
    expect(parseSelectionPredicate(model, {param: 'seg'})).toBe(
      `!length(data("seg_store")) || vlSelectionTest("seg_store", datum, "${resolve}")`,
    );
  });

  it('materializes intersected line series as selection tuples', () => {
    const data = assembleUnitSelectionData(model, assembleRootData(model.component.data, {}));

    expect(data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'seg_tuples',
          source: expect.any(String),
          transform: [
            {
              type: 'window',
              ops: ['lead', 'lead'],
              fields: ['step', 'value'],
              params: [1, 1],
              as: ['seg_tuples_next_x', 'seg_tuples_next_y'],
              sort: {field: ['step'], order: ['ascending']},
              groupby: ['series'],
            },
            expect.objectContaining({
              type: 'filter',
              expr: expect.stringContaining('datum["seg_tuples_next_x"]'),
            }),
            {
              type: 'aggregate',
              groupby: ['series'],
              fields: [null],
              ops: ['count'],
              as: ['count'],
            },
            {type: 'formula', expr: '""', as: 'unit'},
            {type: 'formula', expr: '[{"field":"series","type":"E"}]', as: 'fields'},
            {type: 'formula', expr: '[datum["series"]]', as: 'values'},
          ],
        }),
      ]),
    );
  });

  it('uses standard selection predicates for linked grouped series', () => {
    expect(parseSelectionPredicate(model, {param: 'seg'})).toBe(
      '!length(data("seg_store")) || vlSelectionTest("seg_store", datum)',
    );
  });

  it('requires non-empty grouped path predicates when empty is false', () => {
    expect(parseSelectionPredicate(model, {param: 'seg', empty: false})).toBe(
      'length(data("seg_store")) && vlSelectionTest("seg_store", datum)',
    );
  });
});

describe('Segment Selection on Single Path Marks', () => {
  const model = parseUnitModel({
    data: {
      values: [
        {step: 0, value: 1},
        {step: 1, value: 3},
        {step: 2, value: 2},
      ],
    },
    mark: 'line',
    params: [{name: 'seg', select: {type: 'segment'}}],
    encoding: {
      x: {field: 'step', type: 'quantitative'},
      y: {field: 'value', type: 'quantitative'},
    },
  });

  model.parseScale();
  model.parseSelections();
  model.parseData();
  const selCmpt = model.component.selection.seg as SelectionComponent<'segment'>;

  const scopeField = segmentScopeField(selCmpt);

  it('materializes a synthetic scope field for the view-local fallback', () => {
    const data = assembleRootData(model.component.data, {});

    expect(JSON.stringify(data)).toContain(scopeField);
    expect(JSON.stringify(data)).toContain('"expr":"\\"\\""');
  });

  it('builds path tuples keyed by the synthetic scope field', () => {
    const selectionData = assembleUnitSelectionData(model, assembleRootData(model.component.data, {}));

    expect(selectionData).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'seg_tuples',
          transform: expect.arrayContaining([
            expect.objectContaining({
              type: 'window',
              groupby: [scopeField],
            }),
            expect.objectContaining({
              type: 'formula',
              expr: `[datum[${JSON.stringify(scopeField)}]]`,
              as: 'values',
            }),
          ]),
        }),
      ]),
    );
  });

  it('compiles same-view layered predicates against the fallback key', () => {
    const {spec} = compile({
      data: {
        values: [
          {step: 0, value: 1},
          {step: 1, value: 3},
          {step: 2, value: 2},
        ],
      },
      encoding: {
        x: {field: 'step', type: 'quantitative'},
        y: {field: 'value', type: 'quantitative'},
      },
      layer: [
        {
          params: [{name: 'seg', select: {type: 'segment'}}],
          mark: {type: 'line', stroke: 'transparent', strokeWidth: 10},
        },
        {
          mark: 'line',
          encoding: {
            opacity: {
              condition: {param: 'seg', value: 1},
              value: 0.2,
            },
          },
        },
      ],
    });

    expect(JSON.stringify(spec.data)).toContain(scopeField);
    expect(JSON.stringify(spec)).toContain('vlSelectionTest(\\"seg_store\\", datum)');
  });
});

describe('Segment Selection Compile Regressions', () => {
  it('filters linked views using standard selection tuples for grouped lines', () => {
    const {spec} = compile({
      data: {
        values: [
          {step: 0, value: 1, series: 'a'},
          {step: 1, value: 3, series: 'a'},
          {step: 0, value: 3, series: 'b'},
          {step: 1, value: 1, series: 'b'},
        ],
      },
      vconcat: [
        {
          layer: [
            {
              params: [{name: 'seg', select: {type: 'segment'}}],
              mark: {type: 'line', stroke: 'transparent', strokeWidth: 10},
            },
            {mark: 'line'},
          ],
          encoding: {
            x: {field: 'step', type: 'quantitative'},
            y: {field: 'value', type: 'quantitative'},
            detail: {field: 'series'},
          },
        },
        {
          transform: [{filter: {param: 'seg'}}],
          mark: 'bar',
          encoding: {
            x: {field: 'series', type: 'nominal'},
            y: {aggregate: 'count', type: 'quantitative'},
          },
        },
      ],
    });

    expect(JSON.stringify(spec.data)).toContain('"name":"seg_tuples"');
    expect(JSON.stringify(spec.data)).toContain('"groupby":["series"]');
    expect(JSON.stringify(spec)).toContain('!length(data(\\"seg_store\\")) || vlSelectionTest(\\"seg_store\\", datum)');
  });
});

describe('Segment Selection Warnings', () => {
  it(
    'warns for projected segment selections',
    log.wrap((localLogger) => {
      const model = parseUnitModel({
        mark: 'geoshape',
        encoding: {
          longitude: {field: 'lon', type: 'quantitative'},
          latitude: {field: 'lat', type: 'quantitative'},
        },
      });

      model.parseScale();
      parseUnitSelection(model, [{name: 'seg', select: {type: 'segment'}}]);

      expect(localLogger.warns).toContain(log.message.segmentSelectionRequiresCartesianXY());
    }),
  );

  it(
    'warns and never matches unsupported marks',
    log.wrap((localLogger) => {
      const model = parseUnitModel({
        mark: 'point',
        encoding: {
          x: {field: 'x', type: 'quantitative'},
          y: {field: 'y', type: 'quantitative'},
        },
      });

      model.parseScale();
      model.component.selection = parseUnitSelection(model, [{name: 'seg', select: {type: 'segment'}}]);

      expect(parseSelectionPredicate(model, {param: 'seg'})).toBe('!length(data("seg_store"))');
      expect(localLogger.warns).toContain(log.message.segmentSelectionUnsupportedMark('point'));
    }),
  );

  it(
    'warns and skips non-continuous x/y projections',
    log.wrap((localLogger) => {
      const model = parseUnitModel({
        mark: 'line',
        encoding: {
          x: {field: 'category', type: 'nominal'},
          y: {field: 'value', type: 'quantitative'},
        },
      });

      model.parseScale();
      model.component.selection = parseUnitSelection(model, [{name: 'seg', select: {type: 'segment'}}]);

      const selCmpt = model.component.selection.seg as SelectionComponent<'segment'>;
      expect(selCmpt.segment).toBeUndefined();
      expect(segment.signals(model, selCmpt, [])).toEqual([]);
      expect(segment.marks(model, selCmpt, [])).toEqual([]);
      expect(localLogger.warns).toContain(log.message.segmentSelectionRequiresContinuousXY());
    }),
  );
});
