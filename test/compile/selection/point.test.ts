import {
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals,
  assembleTopLevelSignals
} from '../../../src/compile/selection/assemble';
import point from '../../../src/compile/selection/point';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import {parseUnitModelWithScale} from '../../util';

describe('Multi Selection', () => {
  const model = parseUnitModelWithScale({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', bin: true},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'point', toggle: false, clear: false}
    },
    {
      name: 'two',
      select: {
        type: 'point',
        encodings: ['y', 'color'],
        nearest: true,
        clear: false,
        on: 'mouseover',
        toggle: false,
        resolve: 'intersect'
      }
    },
    {
      name: 'thr-ee',
      value: [{Horsepower: 50}],
      select: {
        type: 'point',
        fields: ['Horsepower'],
        clear: false
      }
    },
    {
      name: 'four',
      value: [{Horsepower: 50, color: 'Japan'}],
      select: {
        type: 'point',
        encodings: ['x', 'color'],
        clear: false
      }
    },
    {
      name: 'five',
      value: [
        {
          Origin: 'Japan',
          Year: {year: 1970, month: 1, date: 1}
        },
        {
          Origin: 'USA',
          Year: {year: 1980, month: 1, date: 1}
        }
      ],
      select: {
        type: 'point',
        fields: ['Year', 'Origin'],
        clear: false
      }
    },
    {
      name: 'six',
      select: {
        type: 'point',
        fields: ['nested.a', 'nested.b'],
        clear: false
      }
    },
    // Seven ensures a smooth abstraction gradient for "value" var params -> point selections
    {
      name: 'seven',
      value: 50,
      select: {type: 'point', fields: ['Horsepower']}
    },
    // Eight ensures this smooth "value" gradient logic doesn't kick in on unprojected point selections
    {
      name: 'eight',
      value: 75,
      select: 'point'
    }
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
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: one_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const twoSg = point.signals(model, selCmpts['two'], []);
    expect(twoSg).toEqual([
      {
        name: 'two_tuple',
        on: [
          {
            events: selCmpts['two'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: two_tuple_fields, values: [[(item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon"], (item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon_end"]], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const threeSg = point.signals(model, selCmpts['thr_ee'], []);
    expect(threeSg).toEqual([
      {
        name: 'thr_ee_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: thr_ee_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Horsepower"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const fourSg = point.signals(model, selCmpts['four'], []);
    expect(fourSg).toEqual([
      {
        name: 'four_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: four_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Horsepower"], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const fiveSg = point.signals(model, selCmpts['five'], []);
    expect(fiveSg).toEqual([
      {
        name: 'five_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: five_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Year"], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const sixSg = point.signals(model, selCmpts['six'], []);
    expect(sixSg).toEqual([
      {
        name: 'six_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: six_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["nested.a"], (item().isVoronoi ? datum.datum : datum)["nested.b"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg, ...threeSg, ...fourSg, ...fiveSg, ...sixSg]));

    // Ensure that interval brushes are accounted for.
    // (We define selections separately so as not to pollute other test cases.)
    const selCmpts2 = parseUnitSelection(model, [
      {name: 'one', select: 'point'},
      {name: 'two', select: 'interval'},
      {name: 'three', select: 'interval'}
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
              "datum && item().mark.marktype !== 'group' && indexof(item().mark.name, 'two_brush') < 0 && indexof(item().mark.name, 'three_brush') < 0 ? {unit: \"\", fields: one_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)[\"_vgsid_\"]]} : null",
            force: true
          }
        ]
      }
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
              update: `modify("one_store", one_tuple, true)`
            }
          ]
        },
        {
          name: 'two_modify',
          on: [
            {
              events: {signal: 'two_tuple'},
              update: `modify("two_store", two_tuple, {unit: ""})`
            }
          ]
        }
      ])
    );
  });

  it('builds top-level signals', () => {
    const signals = assembleTopLevelSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'one',
          update: 'vlSelectionResolve("one_store", "union", true, true)'
        },
        {
          name: 'two',
          update: 'vlSelectionResolve("two_store", "intersect", true, true)'
        },
        {
          name: 'unit',
          value: {},
          on: [{events: 'mousemove', update: 'isTuple(group()) ? group() : unit'}]
        }
      ])
    );
  });

  it('builds unit datasets', () => {
    expect(assembleUnitSelectionData(model, [])).toEqual([
      {name: 'one_store'},
      {name: 'two_store'},
      {
        name: 'thr_ee_store',
        values: [
          {
            unit: '',
            fields: [{type: 'E', field: 'Horsepower'}],
            values: [50]
          }
        ]
      },
      {
        name: 'four_store',
        values: [
          {
            unit: '',
            fields: [
              {field: 'Horsepower', channel: 'x', type: 'E'},
              {field: 'Origin', channel: 'color', type: 'E'}
            ],
            values: [50, 'Japan']
          }
        ]
      },
      {
        name: 'five_store',
        values: [
          {
            unit: '',
            fields: [
              {type: 'E', field: 'Year'},
              {type: 'E', field: 'Origin'}
            ],
            values: [+new Date(1970, 0, 1, 0, 0, 0, 0), 'Japan']
          },
          {
            unit: '',
            fields: [
              {type: 'E', field: 'Year'},
              {type: 'E', field: 'Origin'}
            ],
            values: [+new Date(1980, 0, 1, 0, 0, 0, 0), 'USA']
          }
        ]
      },
      {name: 'six_store'},
      {
        name: 'seven_store',
        values: [
          {
            unit: '',
            fields: [{type: 'E', field: 'Horsepower'}],
            values: [50]
          }
        ]
      },
      {
        name: 'eight_store',
        values: [
          {
            unit: '',
            fields: [{type: 'E', field: '_vgsid_'}],
            values: [75]
          }
        ]
      }
    ]);
  });

  it('leaves marks alone', () => {
    const marks: any[] = [];
    model.component.selection = {one: selCmpts['one']};
    expect(assembleUnitSelectionMarks(model, marks)).toEqual(marks);
  });
});
