import {
  assembleTopLevelSignals,
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals
} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import single from '../../../src/compile/selection/single';
import {parseUnitModelWithScale} from '../../util';

describe('Single Selection', () => {
  const model = parseUnitModelWithScale({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative', bin: true},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();

  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'single', clear: false}
    },
    {
      name: 'two',
      select: {
        type: 'single',
        encodings: ['y', 'color'],
        clear: false,
        nearest: true,
        on: 'mouseover',
        resolve: 'intersect'
      }
    },
    {
      name: 'thr-ee',
      value: {Horsepower: 50},
      select: {
        type: 'single',
        fields: ['Horsepower'],
        clear: false
      }
    },
    {
      name: 'four',
      value: {x: 50, Origin: 'Japan'},
      select: {
        type: 'single',
        encodings: ['x', 'color'],
        clear: false
      }
    },
    {
      name: 'five',
      select: {
        type: 'single',
        fields: ['nested.a', 'nested.b'],
        clear: false
      }
    }
  ]));

  it('builds tuple signals', () => {
    const oneSg = single.signals(model, selCmpts['one']);
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

    const twoSg = single.signals(model, selCmpts['two']);
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

    const threeSg = single.signals(model, selCmpts['thr_ee']);
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

    const fourSg = single.signals(model, selCmpts['four']);
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

    const fiveSg = single.signals(model, selCmpts['five']);
    expect(fiveSg).toEqual([
      {
        name: 'five_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: five_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["nested.a"], (item().isVoronoi ? datum.datum : datum)["nested.b"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg, ...threeSg, ...fourSg, ...fiveSg]));
  });

  it('builds modify signals', () => {
    const oneExpr = single.modifyExpr(model, selCmpts['one']);
    expect(oneExpr).toBe('one_tuple, true');

    const twoExpr = single.modifyExpr(model, selCmpts['two']);
    expect(twoExpr).toBe('two_tuple, {unit: ""}');

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'one_modify',
          on: [
            {
              events: {signal: 'one_tuple'},
              update: `modify("one_store", ${oneExpr})`
            }
          ]
        },
        {
          name: 'two_modify',
          on: [
            {
              events: {signal: 'two_tuple'},
              update: `modify("two_store", ${twoExpr})`
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
          update: 'vlSelectionResolve("one_store", "union")'
        },
        {
          name: 'two',
          update: 'vlSelectionResolve("two_store", "intersect")'
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
    const data: any[] = [];
    expect(assembleUnitSelectionData(model, data)).toEqual([
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
      {name: 'five_store'}
    ]);
  });

  it('leaves marks alone', () => {
    const marks: any[] = [];
    model.component.selection = {one: selCmpts['one']};
    expect(assembleUnitSelectionMarks(model, marks)).toEqual(marks);
  });
});
