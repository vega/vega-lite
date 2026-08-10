import {
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals,
  assembleTopLevelSignals,
} from '../../../src/compile/selection/assemble.js';
import point from '../../../src/compile/selection/point.js';
import {parseUnitSelection} from '../../../src/compile/selection/parse.js';
import {parseModel, parseUnitModelWithScale, parseUnitModelWithScaleAndSelection} from '../../util.js';
import {assembleRootData} from '../../../src/compile/data/assemble.js';
import {optimizeDataflow} from '../../../src/compile/data/optimize.js';
import * as log from '../../../src/log/index.js';

describe('Multi Selection', () => {
  const model = parseUnitModelWithScale({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', bin: true},
      color: {field: 'Origin', type: 'nominal'},
    },
  });

  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'point', toggle: false, clear: false},
    },
    {
      name: 'two',
      select: {
        type: 'point',
        encodings: ['y', 'color'],
        nearest: true,
        clear: false,
        on: 'pointerover',
        toggle: false,
        resolve: 'intersect',
      },
    },
    {
      name: 'thr-ee',
      value: [{Horsepower: 50}],
      select: {
        type: 'point',
        fields: ['Horsepower'],
        clear: false,
      },
    },
    {
      name: 'four',
      value: [{Horsepower: 50, color: 'Japan'}],
      select: {
        type: 'point',
        encodings: ['x', 'color'],
        clear: false,
      },
    },
    {
      name: 'five',
      value: [
        {
          Origin: 'Japan',
          Year: {year: 1970, month: 1, date: 1},
        },
        {
          Origin: 'USA',
          Year: {year: 1980, month: 1, date: 1},
        },
      ],
      select: {
        type: 'point',
        fields: ['Year', 'Origin'],
        clear: false,
      },
    },
    {
      name: 'six',
      select: {
        type: 'point',
        fields: ['nested.a', 'nested.b'],
        clear: false,
      },
    },
    // Seven ensures a smooth abstraction gradient for "value" var params -> point selections
    {
      name: 'seven',
      value: 50,
      select: {type: 'point', fields: ['Horsepower']},
    },
    // Eight ensures this smooth "value" gradient logic doesn't kick in on unprojected point selections
    {
      name: 'eight',
      value: 75,
      select: 'point',
    },
    {
      name: 'nine',
      value: [{_vgsid_: 75}, {_vgsid_: 80}],
      select: 'point',
    },
  ]));

  it('builds tuple signals', () => {
    const oneSg = point.signals(model, selCmpts['one'], []);
    expect(oneSg).toEqual([
      {
        name: 'one_tuple',
        on: [
          {
            events: selCmpts['one'].events,
            update:
              'datum && item().mark.marktype !== \'group\' && indexof(item().mark.role, \'legend\') < 0 ? {unit: "", _vgsid_: (item().isVoronoi ? datum.datum : datum)["_vgsid_"]} : null',
            force: true,
          },
        ],
      },
    ]);

    const twoSg = point.signals(model, selCmpts['two'], []);
    expect(twoSg).toEqual([
      {
        name: 'two_tuple',
        on: [
          {
            events: selCmpts['two'].events,
            update:
              'datum && item().mark.marktype !== \'group\' && indexof(item().mark.role, \'legend\') < 0 ? {unit: "", fields: two_tuple_fields, values: [[(item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon"], (item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon_end"]], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true,
          },
        ],
      },
    ]);

    const threeSg = point.signals(model, selCmpts['thr_ee'], []);
    expect(threeSg).toEqual([
      {
        name: 'thr_ee_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' && indexof(item().mark.role, \'legend\') < 0 ? {unit: "", fields: thr_ee_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Horsepower"]]} : null',
            force: true,
          },
        ],
      },
    ]);

    const fourSg = point.signals(model, selCmpts['four'], []);
    expect(fourSg).toEqual([
      {
        name: 'four_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' && indexof(item().mark.role, \'legend\') < 0 ? {unit: "", fields: four_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Horsepower"], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true,
          },
        ],
      },
    ]);

    const fiveSg = point.signals(model, selCmpts['five'], []);
    expect(fiveSg).toEqual([
      {
        name: 'five_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' && indexof(item().mark.role, \'legend\') < 0 ? {unit: "", fields: five_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Year"], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true,
          },
        ],
      },
    ]);

    const sixSg = point.signals(model, selCmpts['six'], []);
    expect(sixSg).toEqual([
      {
        name: 'six_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' && indexof(item().mark.role, \'legend\') < 0 ? {unit: "", fields: six_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["nested.a"], (item().isVoronoi ? datum.datum : datum)["nested.b"]]} : null',
            force: true,
          },
        ],
      },
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg, ...threeSg, ...fourSg, ...fiveSg, ...sixSg]));

    // Ensure that interval brushes are accounted for.
    // (We define selections separately so as not to pollute other test cases.)
    const selCmpts2 = parseUnitSelection(model, [
      {name: 'one', select: 'point'},
      {name: 'two', select: 'interval'},
      {name: 'three', select: 'interval'},
    ]);
    model.component.selection = selCmpts2;
    const oneSgInterval = point.signals(model, selCmpts['one'], []);
    expect(oneSgInterval).toEqual([
      {
        name: 'one_tuple',
        on: [
          {
            events: selCmpts['one'].events,
            update:
              "datum && item().mark.marktype !== 'group' && indexof(item().mark.role, 'legend') < 0 && indexof(item().mark.name, 'two_brush') < 0 && indexof(item().mark.name, 'three_brush') < 0 ? {unit: \"\", _vgsid_: (item().isVoronoi ? datum.datum : datum)[\"_vgsid_\"]} : null",
            force: true,
          },
        ],
      },
    ]);
    model.component.selection = selCmpts;
  });

  it('builds modify signals', () => {
    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'one_modify',
          on: [
            {
              events: {signal: 'one_tuple'},
              update: `modify("one_store", one_tuple, true)`,
            },
          ],
        },
        {
          name: 'two_modify',
          on: [
            {
              events: {signal: 'two_tuple'},
              update: `modify("two_store", two_tuple, {unit: ""})`,
            },
          ],
        },
      ]),
    );
  });

  it('builds top-level signals', () => {
    const signals = assembleTopLevelSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'one',
          update: 'vlSelectionResolve("one_store", "union", true, true)',
        },
        {
          name: 'two',
          update: 'vlSelectionResolve("two_store", "intersect", true, true)',
        },
        {
          name: 'unit',
          value: {},
          on: [{events: 'pointermove', update: 'isTuple(group()) ? group() : unit'}],
        },
      ]),
    );
  });

  it('builds unit datasets', () => {
    expect(assembleUnitSelectionData(model, [])).toEqual([
      {
        name: 'one_store',
        transform: [{type: 'collect', sort: {field: '_vgsid_'}}],
      },
      {name: 'two_store'},
      {
        name: 'thr_ee_store',
        values: [
          {
            unit: '',
            fields: [{type: 'E', field: 'Horsepower'}],
            values: [50],
          },
        ],
      },
      {
        name: 'four_store',
        values: [
          {
            unit: '',
            fields: [
              {field: 'Horsepower', channel: 'x', type: 'E'},
              {field: 'Origin', channel: 'color', type: 'E'},
            ],
            values: [50, 'Japan'],
          },
        ],
      },
      {
        name: 'five_store',
        values: [
          {
            unit: '',
            fields: [
              {type: 'E', field: 'Year'},
              {type: 'E', field: 'Origin'},
            ],
            values: [+new Date(1970, 0, 1, 0, 0, 0, 0), 'Japan'],
          },
          {
            unit: '',
            fields: [
              {type: 'E', field: 'Year'},
              {type: 'E', field: 'Origin'},
            ],
            values: [+new Date(1980, 0, 1, 0, 0, 0, 0), 'USA'],
          },
        ],
      },
      {name: 'six_store'},
      {
        name: 'seven_store',
        values: [
          {
            unit: '',
            fields: [{type: 'E', field: 'Horsepower'}],
            values: [50],
          },
        ],
      },
      {
        name: 'eight_store',
        transform: [{type: 'collect', sort: {field: '_vgsid_'}}],
        values: [{unit: '', _vgsid_: 75}],
      },
      {
        name: 'nine_store',
        transform: [{type: 'collect', sort: {field: '_vgsid_'}}],
        values: [
          {unit: '', _vgsid_: 75},
          {unit: '', _vgsid_: 80},
        ],
      },
    ]);
  });

  it('leaves marks alone', () => {
    const marks: any[] = [];
    model.component.selection = {one: selCmpts['one']};
    expect(assembleUnitSelectionMarks(model, marks)).toEqual(marks);
  });
});

describe('Animated Selection', () => {
  const model = parseUnitModelWithScaleAndSelection({
    data: {
      url: 'data/gapminder.json',
    },
    params: [
      {
        name: 'avl',
        select: {
          type: 'point',
          fields: ['year'],
          on: 'timer',
        },
      },
    ],
    transform: [
      {
        filter: {
          param: 'avl',
        },
      },
    ],
    mark: 'point',
    encoding: {
      color: {
        field: 'country',
      },
      x: {
        field: 'fertility',
        type: 'quantitative',
      },
      y: {
        field: 'life_expect',
        type: 'quantitative',
      },
      time: {
        field: 'year',
        type: 'ordinal',
      },
    },
  });

  model.parseData();
  optimizeDataflow(model.component.data, model);

  it('builds tuple signals', () => {
    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          // an update expression, not an on handler, so that the tuple has a
          // value on the initial pulse rather than only from the first tick
          name: 'avl_tuple',
          update: '{unit: "", fields: avl_tuple_fields, values: [anim_value ? anim_value : min_extent]}',
        },
      ]),
    );
  });

  it('builds clock signals', () => {
    const signals = assembleTopLevelSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'anim_clock',
          init: '0',
          on: [
            {
              events: {type: 'timer', throttle: 16.666666666666668},
              update:
                'is_playing ? (anim_clock + (now() - last_tick_at) > max_range_extent ? 0 : anim_clock + (now() - last_tick_at)) : anim_clock',
            },
          ],
        },
        {
          name: 'last_tick_at',
          init: 'now()',
          on: [{events: [{signal: 'anim_clock'}, {signal: 'is_playing'}], update: 'now()'}],
        },
      ]),
    );
  });

  it('builds scale signals', () => {
    // top-level, not unit-scope: one clock drives the whole view
    const signals = assembleTopLevelSignals(model, []);
    // TODO(jzong): uncomment commented signals when implementing interpolation
    expect(signals).toEqual(
      expect.arrayContaining([
        {name: 'avl_domain', init: "domain('time')"},
        {name: 'min_extent', init: 'extent(avl_domain)[0]'},
        // {name: 'max_extent', init: 'extent(avl_domain)[1]'},
        {name: 'max_range_extent', init: "extent(range('time'))[1]"},
        // {name: 't_index', update: 'indexof(avl_domain, anim_value)'},
        {name: 'anim_value', update: "invert('time', eased_anim_clock)"},
      ]),
    );
  });

  it('builds modify signals', () => {
    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          // likewise driven by an update expression, so the store is written
          // during the initial pulse and the first frame filters correctly
          name: 'avl_modify',
          update: 'modify("avl_store", avl_tuple, true)',
        },
      ]),
    );
  });

  it('builds top-level signals', () => {
    const signals = assembleTopLevelSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'avl',
          update: 'vlSelectionResolve("avl_store", "union", true, true)',
        },
        {
          name: 'unit',
          value: {},
          on: [{events: 'pointermove', update: 'isTuple(group()) ? group() : unit'}],
        },
      ]),
    );
  });

  it('builds animation frame datasets', () => {
    expect(assembleUnitSelectionData(model, assembleRootData(model.component.data, {}))).toEqual(
      expect.arrayContaining([
        {
          name: 'source_0_curr',
          source: 'source_0',
          transform: [
            {
              type: 'filter',
              expr: '!length(data("avl_store")) || vlSelectionTest("avl_store", datum)',
            },
          ],
        },
      ]),
    );
  });

  it('assigns correct animation frame dataset to marks', () => {
    model.parseMarkGroup();
    const marks = model.assembleMarks();
    expect(marks[0].from.data).toBe('source_0_curr');
  });

  it('builds no frame dataset when nothing filters on the animation', () => {
    // an animation may drive a conditional encoding or a bound scale while every
    // mark stays on the full data, so there is no frame to select
    const unfilteredModel = parseUnitModelWithScaleAndSelection({
      data: {url: 'data/gapminder.json'},
      params: [{name: 'avl', select: {type: 'point', fields: ['year'], on: 'timer'}}],
      mark: 'point',
      encoding: {
        x: {field: 'fertility', type: 'quantitative'},
        y: {field: 'life_expect', type: 'quantitative'},
        time: {field: 'year', type: 'ordinal'},
      },
    });

    unfilteredModel.parseData();
    optimizeDataflow(unfilteredModel.component.data, unfilteredModel);

    const datasets = assembleUnitSelectionData(unfilteredModel, assembleRootData(unfilteredModel.component.data, {}));
    expect(datasets.find((d) => d.name === 'source_0_curr')).toBeUndefined();

    unfilteredModel.parseMarkGroup();
    expect(unfilteredModel.assembleMarks()[0].from.data).toBe('source_0');
  });

  it('does not rewrite marks to the frame dataset without a timer selection', () => {
    const staticModel = parseUnitModelWithScaleAndSelection({
      data: {url: 'data/gapminder.json'},
      params: [{name: 'pt', select: {type: 'point', fields: ['year']}}],
      mark: 'point',
      encoding: {
        x: {field: 'fertility', type: 'quantitative'},
        y: {field: 'life_expect', type: 'quantitative'},
        time: {field: 'year', type: 'ordinal'},
      },
    });

    staticModel.parseData();
    optimizeDataflow(staticModel.component.data, staticModel);
    staticModel.parseMarkGroup();

    expect(staticModel.assembleMarks()[0].from.data).not.toMatch(/_curr$/);
  });

  it('assigns the animation frame dataset to faceted path groups', () => {
    // a line broken up by color compiles to a facet-backed group mark, so its
    // data reference lives on from.facet.data rather than from.data
    const groupedLineModel = parseUnitModelWithScaleAndSelection({
      data: {url: 'data/gapminder.json'},
      params: [{name: 'avl', select: {type: 'point', fields: ['year'], on: 'timer'}}],
      transform: [{filter: {param: 'avl'}}],
      mark: 'line',
      encoding: {
        x: {field: 'fertility', type: 'quantitative'},
        y: {field: 'life_expect', type: 'quantitative'},
        color: {field: 'country', type: 'nominal'},
        time: {field: 'year', type: 'ordinal'},
      },
    });

    groupedLineModel.parseData();
    optimizeDataflow(groupedLineModel.component.data, groupedLineModel);
    // data is assembled before marks, which is where the frame dataset is built
    assembleUnitSelectionData(groupedLineModel, assembleRootData(groupedLineModel.component.data, {}));
    groupedLineModel.parseMarkGroup();

    const marks = groupedLineModel.assembleMarks();
    expect(marks[0].from.facet.data).toMatch(/_curr$/);
  });

  it(
    'does not build extra signals for duplicate selection',
    log.wrap((localLogger) => {
      const modelDuplicateSelection = parseUnitModelWithScaleAndSelection({
        data: {
          url: 'data/gapminder.json',
        },
        params: [
          {
            name: 'avl',
            select: {
              type: 'point',
              fields: ['year'],
              on: 'timer',
            },
          },
          {
            name: 'avl_2',
            select: {
              type: 'point',
              fields: ['year'],
              on: 'timer',
            },
          },
        ],
        transform: [
          {
            filter: {
              param: 'avl',
            },
          },
        ],
        mark: 'point',
        encoding: {
          color: {
            field: 'country',
          },
          x: {
            field: 'fertility',
            type: 'quantitative',
          },
          y: {
            field: 'life_expect',
            type: 'quantitative',
          },
          time: {
            field: 'year',
            type: 'ordinal',
          },
        },
      });

      modelDuplicateSelection.parseData();
      optimizeDataflow(modelDuplicateSelection.component.data, modelDuplicateSelection);

      const signals = assembleTopLevelSignals(model, []);
      expect(signals).toEqual(
        expect.arrayContaining([
          {name: 'avl_domain', init: "domain('time')"},
          {name: 'min_extent', init: 'extent(avl_domain)[0]'},
          // {name: 'max_extent', init: 'extent(avl_domain)[1]'},
          {name: 'max_range_extent', init: "extent(range('time'))[1]"},
          // {name: 't_index', update: 'indexof(avl_domain, anim_value)'},
          {name: 'anim_value', update: "invert('time', eased_anim_clock)"},
        ]),
      );

      // The clock signals are emitted once and shared, so nothing collides.
      const names = signals.map((s) => s.name);
      expect(names).toHaveLength(new Set(names).size);

      // Sharing a clock is legitimate: neither selection is dropped and nothing
      // is warned about.
      expect(localLogger.warns).toHaveLength(0);
      expect(Object.keys(modelDuplicateSelection.component.selection)).toEqual(['avl', 'avl_2']);
    }),
  );

  it(
    'warns when two animated selections both configure the clock',
    log.wrap((localLogger) => {
      const clockConflictModel = parseUnitModelWithScaleAndSelection({
        data: {url: 'data/gapminder.json'},
        params: [
          {
            name: 'a',
            select: {type: 'point', fields: ['year'], on: 'timer', pause: [{value: 1960, duration: 500}]},
          },
          {
            name: 'b',
            select: {type: 'point', fields: ['year'], on: 'timer', pause: [{value: 1970, duration: 500}]},
          },
        ],
        transform: [{filter: {param: 'a'}}],
        mark: 'point',
        encoding: {
          x: {field: 'fertility', type: 'quantitative'},
          y: {field: 'life_expect', type: 'quantitative'},
          time: {field: 'year', type: 'ordinal'},
        },
      });

      // Both selections survive; only the second one's clock property is dropped.
      expect(Object.keys(clockConflictModel.component.selection)).toEqual(['a', 'b']);
      expect(clockConflictModel.component.selection['a'].pause).toBeDefined();
      expect(clockConflictModel.component.selection['b'].pause).toBeUndefined();
      expect(localLogger.warns[0]).toEqual(log.message.timerSelectionClockConflict('pause', 'a', 'b'));
    }),
  );

  it(
    'errors if you try to use animation on a faceted multi-view',
    log.wrap(() => {
      const facetModel = parseModel({
        data: {url: 'data/gapminder.json'},
        params: [{name: 'avl', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'avl'}}],
        mark: 'point',
        encoding: {
          x: {field: 'fertility', type: 'quantitative'},
          y: {field: 'life_expect', type: 'quantitative'},
          time: {field: 'year', type: 'ordinal'},
          facet: {field: 'cluster'},
        },
      });

      expect(() => facetModel.parseSelections()).toThrow(log.message.FACET_ANIMATION_UNSUPPORTED);
    }),
  );

  it(
    'allows animation in a layered multi-view',
    log.wrap(() => {
      const layerModel = parseModel({
        data: {url: 'data/gapminder.json'},
        params: [{name: 'avl', select: {type: 'point', fields: ['year'], on: 'timer'}}],
        transform: [{filter: {param: 'avl'}}],
        layer: [{mark: 'point'}, {mark: 'text'}],
        encoding: {
          x: {field: 'fertility', type: 'quantitative'},
          y: {field: 'life_expect', type: 'quantitative'},
          time: {field: 'year', type: 'ordinal'},
        },
      });

      expect(() => layerModel.parseSelections()).not.toThrow();
    }),
  );

  it(
    'allows animation in a concatenated multi-view',
    log.wrap(() => {
      const concatModel = parseModel({
        data: {url: 'data/gapminder.json'},
        vconcat: [
          {
            params: [{name: 'avl', select: {type: 'point', fields: ['year'], on: 'timer'}}],
            transform: [{filter: {param: 'avl'}}],
            mark: 'point',
            encoding: {
              x: {field: 'fertility', type: 'quantitative'},
              y: {field: 'life_expect', type: 'quantitative'},
              time: {field: 'year', type: 'ordinal'},
            },
          },
          {mark: 'point', encoding: {x: {field: 'year', type: 'ordinal'}}},
        ],
      });

      expect(() => concatModel.parseSelections()).not.toThrow();
    }),
  );
});
