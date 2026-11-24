import {compile} from '../../../src/compile/compile.js';
import {rebaseOntoItemDatum, valueRef, withOffset} from '../../../src/compile/mark/placement.js';
import * as log from '../../../src/log/index.js';
import {TopLevelSpec} from '../../../src/spec/index.js';

function marksOf(spec: TopLevelSpec): any[] {
  const vgSpec: any = compile(spec).spec;
  return vgSpec.marks;
}

function byName(marks: any[], name: string) {
  return marks.find((m) => m.name === name);
}

const LINE_DATA = {values: [{x: 1, y: 2, s: 'a'}]};

const LINE_WITH_LABELS: TopLevelSpec = {
  data: LINE_DATA,
  encoding: {
    x: {field: 'x', type: 'quantitative'},
    y: {field: 'y', type: 'quantitative'},
  },
  layer: [
    {name: 'lines', mark: 'line'},
    {
      name: 'labels',
      mark: {type: 'text', placement: {anchor: ['top', 'bottom'], offset: [3, 0], avoid: [{mark: 'line'}]}},
      encoding: {text: {field: 'y', type: 'quantitative'}},
    },
  ],
};

describe('compile/mark/placement', () => {
  it('compiles a text mark without placement as before', () => {
    const marks = marksOf({
      data: LINE_DATA,
      mark: 'text',
      encoding: {x: {field: 'x', type: 'quantitative'}, text: {field: 'y', type: 'quantitative'}},
    });
    expect(marks).toHaveLength(1);
    expect(marks[0].transform).toBeUndefined();
  });

  it('emits a hidden zero-size base and the placed labels, which keep the `_marks` name', () => {
    const marks = marksOf(LINE_WITH_LABELS);
    const base = byName(marks, 'labels_placement_base');
    const placed = byName(marks, 'labels_marks');

    expect(base).toMatchObject({type: 'symbol', interactive: false, aria: false});
    expect(base.encode.update).toEqual({
      x: {scale: 'x', field: 'x'},
      y: {scale: 'y', field: 'y'},
      size: {value: 0},
      opacity: {value: 0},
    });

    expect(placed.type).toBe('text');
    expect(placed.from).toEqual({data: 'labels_placement_base'});
    expect(placed.transform).toEqual([
      {
        type: 'label',
        size: {signal: '[width, height]'},
        avoidBaseMark: false,
        anchor: ['top', 'bottom'],
        offset: [3, 0],
        avoidMarks: ['lines_marks'],
      },
    ]);
  });

  it('places the labels after every mark they avoid', () => {
    const marks = marksOf({
      ...LINE_WITH_LABELS,
      layer: [LINE_WITH_LABELS.layer[1], LINE_WITH_LABELS.layer[0]],
    } as TopLevelSpec);
    expect(marks.map((m) => m.name)).toEqual(['labels_placement_base', 'lines_marks', 'labels_marks']);
  });

  it('moves data fields one level down, because the labels read the base items', () => {
    const placed = byName(marksOf(LINE_WITH_LABELS), 'labels_marks');
    expect(placed.encode.update.text).toEqual({signal: 'format(datum.datum["y"], "")'});
    expect(placed.encode.update.x).toBeUndefined();
    expect(placed.encode.update.y).toBeUndefined();
  });

  it('applies dx and dy to the base and resets them on the labels', () => {
    const marks = marksOf({
      data: LINE_DATA,
      mark: {type: 'text', dx: 4, dy: -10, placement: true},
      encoding: {x: {field: 'x', type: 'quantitative'}, y: {field: 'y', type: 'quantitative'}, text: {value: 'a'}},
    });
    const base = byName(marks, 'placement_base');
    const placed = byName(marks, 'marks');
    expect(base.encode.update.x).toEqual({scale: 'x', field: 'x', offset: {value: 4}});
    expect(base.encode.update.y).toEqual({scale: 'y', field: 'y', offset: {value: -10}});
    expect(placed.encode.update.dx).toEqual({value: 0});
    expect(placed.encode.update.dy).toEqual({value: 0});
  });

  it('compiles opacity, including selection conditions, to fillOpacity', () => {
    const marks = marksOf({
      data: LINE_DATA,
      params: [{name: 'hover', select: {type: 'point', on: 'pointerover'}}],
      mark: {type: 'text', placement: true},
      encoding: {
        x: {field: 'x', type: 'quantitative'},
        text: {field: 's', type: 'nominal'},
        opacity: {condition: {param: 'hover', value: 1}, value: 0.2},
      },
    });
    const update = byName(marks, 'marks').encode.update;
    expect(update.opacity).toBeUndefined();
    expect(update.fillOpacity).toEqual([
      {
        test: '!length(data("hover_store")) || vlSelectionIdTest("hover_store", datum.datum)',
        value: 1,
      },
      {value: 0.2},
    ]);
  });

  it(
    'warns about and ignores align, baseline, and angle',
    log.wrap((localLogger) => {
      const marks = marksOf({
        data: LINE_DATA,
        mark: {type: 'text', align: 'left', baseline: 'top', angle: 45, placement: true},
        encoding: {x: {field: 'x', type: 'quantitative'}, text: {value: 'a'}},
      });
      const update = byName(marks, 'marks').encode.update;
      expect(update.align).toBeUndefined();
      expect(update.baseline).toBeUndefined();
      expect(update.angle).toBeUndefined();
      expect(localLogger.warns).toEqual([
        log.message.placementIgnoresProperty('align'),
        log.message.placementIgnoresProperty('baseline'),
        log.message.placementIgnoresProperty('angle'),
      ]);
    }),
  );

  it(
    'ignores placement on non-text marks',
    log.wrap((localLogger) => {
      const marks = marksOf({
        data: LINE_DATA,
        mark: {type: 'point', placement: true} as any,
        encoding: {x: {field: 'x', type: 'quantitative'}},
      });
      expect(marks).toHaveLength(1);
      expect(localLogger.warns).toEqual([log.message.placementOnlyForText('point')]);
    }),
  );

  it('uses config.text.placement only as defaults for marks that opt in', () => {
    const spec: TopLevelSpec = {
      data: LINE_DATA,
      config: {text: {placement: {anchor: ['right', 'left']}}},
      layer: [
        {name: 'plain', mark: 'text', encoding: {text: {value: 'a'}}},
        {name: 'placed', mark: {type: 'text', placement: {offset: 3}}, encoding: {text: {value: 'b'}}},
      ],
    };
    const marks = marksOf(spec);
    expect(byName(marks, 'plain_marks').transform).toBeUndefined();
    expect(byName(marks, 'placed_marks').transform[0]).toMatchObject({anchor: ['right', 'left'], offset: [3]});
  });

  it('passes sort to the label transform, on the data row of each item', () => {
    const marks = marksOf({
      data: LINE_DATA,
      mark: {type: 'text', placement: {sort: {field: 'y', order: 'descending'}}},
      encoding: {text: {field: 's', type: 'nominal'}},
    });
    expect(byName(marks, 'marks').transform[0].sort).toEqual({field: 'datum.y', order: 'descending'});
  });

  describe('avoid', () => {
    const COMBO: TopLevelSpec = {
      data: LINE_DATA,
      encoding: {x: {field: 'x', type: 'ordinal'}},
      layer: [
        {name: 'bars', mark: 'bar', encoding: {y: {field: 'y', type: 'quantitative'}}},
        {
          name: 'bar_labels',
          mark: {type: 'text', dy: -4},
          encoding: {y: {field: 'y', type: 'quantitative'}, text: {field: 'y', type: 'quantitative'}},
        },
        {
          name: 'series',
          mark: {type: 'line', point: true},
          encoding: {y: {field: 'y', type: 'quantitative'}, color: {field: 's', type: 'nominal'}},
        },
        {
          name: 'line_labels',
          mark: {
            type: 'text',
            placement: {avoid: [{mark: ['line', 'bar']}, {views: ['bar_labels']}]},
          },
          encoding: {y: {field: 'y', type: 'quantitative'}, text: {field: 'y', type: 'quantitative'}},
        },
      ],
    };

    it('resolves mark and views selectors to compiled mark names, including series groups', () => {
      const placed = byName(marksOf(COMBO), 'line_labels_marks');
      expect(placed.transform[0].avoidMarks).toEqual(['bars_marks', 'bar_labels_marks', 'series_pathgroup']);
    });

    it('matches the point layer that `point: true` adds', () => {
      const spec = structuredClone(COMBO) as any;
      spec.layer[3].mark.placement.avoid = [{mark: 'point'}];
      const placed = byName(marksOf(spec), 'line_labels_marks');
      expect(placed.transform[0].avoidMarks).toEqual(['layer_2_layer_1_marks']);
    });

    it('selects a layer by name, but not the point layer that `point: true` adds to it', () => {
      // The normalizer keeps the name on the line and gives the added point layer a generated name.
      const spec = structuredClone(COMBO) as any;
      spec.layer[3].mark.placement.avoid = [{views: ['series']}];
      const placed = byName(marksOf(spec), 'line_labels_marks');
      expect(placed.transform[0].avoidMarks).toEqual(['series_pathgroup']);
    });

    it('selects every layer under a named layer', () => {
      const marks = marksOf({
        data: LINE_DATA,
        encoding: {x: {field: 'x', type: 'quantitative'}, y: {field: 'y', type: 'quantitative'}},
        layer: [
          {
            name: 'group',
            layer: [
              {name: 'lines', mark: 'line'},
              {name: 'points', mark: 'point'},
            ],
          },
          {
            name: 'labels',
            mark: {type: 'text', placement: {avoid: [{views: ['group']}]}},
            encoding: {text: {value: 'a'}},
          },
        ],
      });
      expect(byName(marks, 'labels_marks').transform[0].avoidMarks).toEqual(['lines_marks', 'points_marks']);
    });

    it('makes later placement layers avoid the labels of earlier ones, so earlier layers win', () => {
      const marks = marksOf({
        data: LINE_DATA,
        layer: [
          {name: 'first', mark: {type: 'text', placement: true}, encoding: {text: {value: 'a'}}},
          {name: 'second', mark: {type: 'text', placement: true}, encoding: {text: {value: 'b'}}},
        ],
      });
      expect(byName(marks, 'first_marks').transform[0].avoidMarks).toBeUndefined();
      expect(byName(marks, 'second_marks').transform[0].avoidMarks).toEqual(['first_marks']);
      expect(marks.map((m) => m.name)).toEqual([
        'first_placement_base',
        'second_placement_base',
        'first_marks',
        'second_marks',
      ]);
    });

    it('avoids marks in nested layers of the same view', () => {
      const marks = marksOf({
        data: LINE_DATA,
        encoding: {x: {field: 'x', type: 'quantitative'}, y: {field: 'y', type: 'quantitative'}},
        layer: [
          {layer: [{name: 'lines', mark: 'line'}]},
          {
            name: 'labels',
            mark: {type: 'text', placement: {avoid: [{mark: 'line'}]}},
            encoding: {text: {value: 'a'}},
          },
        ],
      });
      expect(byName(marks, 'labels_marks').transform[0].avoidMarks).toEqual(['lines_marks']);
    });
  });

  it(
    'warns and drops opacity when fillOpacity is also set',
    log.wrap((localLogger) => {
      const marks = marksOf({
        data: LINE_DATA,
        mark: {type: 'text', opacity: 0.5, fillOpacity: 0.8, placement: true},
        encoding: {text: {value: 'a'}},
      });
      const update = byName(marks, 'marks').encode.update;
      expect(update.opacity).toBeUndefined();
      expect(update.fillOpacity).toEqual({value: 0.8});
      expect(localLogger.warns).toEqual([log.message.placementDropsOpacity()]);
    }),
  );

  it('keeps key and sort on the base, which sets the order of the labels', () => {
    const marks = marksOf({
      data: LINE_DATA,
      mark: {type: 'text', placement: true},
      encoding: {
        text: {field: 's', type: 'nominal'},
        key: {field: 's'},
        order: {field: 'y', type: 'quantitative'},
      },
    });
    const base = byName(marks, 'placement_base');
    const placed = byName(marks, 'marks');
    expect(base.key).toBe('s');
    expect(base.sort).toEqual({field: ['datum["y"]'], order: ['ascending']});
    expect(placed.key).toBeUndefined();
    expect(placed.sort).toBeUndefined();
  });

  it('passes sort without an order', () => {
    const marks = marksOf({
      data: LINE_DATA,
      mark: {type: 'text', placement: {sort: {field: 'y'}}},
      encoding: {text: {value: 'a'}},
    });
    expect(byName(marks, 'marks').transform[0].sort).toEqual({field: 'datum.y'});
  });

  it('applies dx from config.text to the base', () => {
    const marks = marksOf({
      data: LINE_DATA,
      config: {text: {dx: 2}},
      mark: {type: 'text', placement: true},
      encoding: {x: {field: 'x', type: 'quantitative'}, text: {value: 'a'}},
    });
    expect(byName(marks, 'placement_base').encode.update.x).toEqual({scale: 'x', field: 'x', offset: {value: 2}});
  });

  it(
    'warns when an avoided mark compiles to an unnamed group',
    log.wrap((localLogger) => {
      const marks = marksOf({
        data: LINE_DATA,
        encoding: {x: {field: 'x', type: 'ordinal'}},
        layer: [
          {
            mark: {type: 'bar', cornerRadius: 2},
            encoding: {y: {field: 'y', type: 'quantitative', stack: 'zero'}, color: {field: 's', type: 'nominal'}},
          },
          {name: 'labels', mark: {type: 'text', placement: {avoid: [{mark: 'bar'}]}}, encoding: {text: {value: 'a'}}},
        ],
      });
      expect(byName(marks, 'labels_marks').transform[0].avoidMarks).toBeUndefined();
      expect(localLogger.warns).toEqual([log.message.placementAvoidUnnamedMark('bar')]);
    }),
  );

  describe('helpers', () => {
    it('valueRef wraps values and passes signals through', () => {
      expect(valueRef(undefined)).toBeUndefined();
      expect(valueRef(3)).toEqual({value: 3});
      expect(valueRef({signal: 'a'})).toEqual({signal: 'a'});
    });

    it('withOffset adds an offset or combines it with an existing one', () => {
      expect(withOffset(undefined, {value: 1})).toBeUndefined();
      expect(withOffset({field: 'x'}, undefined)).toEqual({field: 'x'});
      expect(withOffset({field: 'x'}, {value: 1})).toEqual({field: 'x', offset: {value: 1}});
      expect(withOffset({field: 'x', offset: 2}, {signal: 'a'})).toEqual({field: 'x', offset: {signal: '2 + (a)'}});
      expect(withOffset({field: 'x', offset: {value: 2}}, {value: 1})).toEqual({
        field: 'x',
        offset: {signal: '2 + 1'},
      });
      expect(withOffset([{test: 't', value: 0}, {field: 'x'}], {value: 1})).toEqual([
        {test: 't', value: 0, offset: {value: 1}},
        {field: 'x', offset: {value: 1}},
      ]);
    });

    it('rebaseOntoItemDatum moves data references one level down and leaves the rest', () => {
      expect(rebaseOntoItemDatum(3)).toBe(3);
      expect(
        rebaseOntoItemDatum({
          field: 'a',
          scale: 'color',
          band: 0.5,
          mult: {field: {group: 'width'}},
          signal: 'datum.b + datum["c"]',
        }),
      ).toEqual({
        field: 'datum.a',
        scale: 'color',
        band: 0.5,
        mult: {field: {group: 'width'}},
        signal: 'datum.datum.b + datum.datum["c"]',
      });
    });
  });
});
