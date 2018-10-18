/* tslint:disable quotemark */
import {assert} from 'chai';
import {
  assembleUnitSelectionData,
  assembleUnitSelectionMarks,
  assembleUnitSelectionSignals
} from '../../../src/compile/selection/assemble';
import multi from '../../../src/compile/selection/multi';
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

  const selCmpts = (model.component.selection = parseUnitSelection(model, {
    one: {type: 'multi'},
    two: {
      type: 'multi',
      nearest: true,
      on: 'mouseover',
      toggle: 'event.ctrlKey',
      encodings: ['y', 'color']
    },
    'thr-ee': {
      type: 'multi',
      fields: ['Horsepower'],
      init: {Horsepower: 50}
    },
    four: {
      type: 'multi',
      encodings: ['x', 'color'],
      init: {Horsepower: 50, color: 'Japan'}
    },
    five: {
      type: 'multi',
      fields: ['Year', 'Origin'],
      init: [
        {
          Origin: 'Japan',
          Year: {year: 1970, month: 1, day: 1}
        },
        {
          Origin: 'USA',
          Year: {year: 1980, month: 1, day: 1}
        }
      ]
    }
  }));

  it('builds tuple signals', () => {
    const oneSg = multi.signals(model, selCmpts['one']);
    assert.sameDeepMembers(oneSg, [
      {
        name: 'one_tuple',
        on: [
          {
            events: selCmpts['one'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: one_tuple_fields, values: [datum["_vgsid_"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const twoSg = multi.signals(model, selCmpts['two']);
    assert.sameDeepMembers(twoSg, [
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

    const threeSg = multi.signals(model, selCmpts['thr_ee']);
    assert.sameDeepMembers(threeSg, [
      {
        name: 'thr_ee_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: thr_ee_tuple_fields, values: [datum["Horsepower"]]} : null',
            force: true
          }
        ]
      },
      {
        name: 'thr_ee_init',
        init: 'modify("thr_ee_store", [{unit: "", fields: thr_ee_tuple_fields, values: [50]}])'
      }
    ]);

    const fourSg = multi.signals(model, selCmpts['four']);
    assert.sameDeepMembers(fourSg, [
      {
        name: 'four_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: four_tuple_fields, values: [datum["Horsepower"], datum["Origin"]]} : null',
            force: true
          }
        ]
      },
      {
        name: 'four_init',
        init: 'modify("four_store", [{unit: "", fields: four_tuple_fields, values: [50, "Japan"]}])'
      }
    ]);

    const fiveSg = multi.signals(model, selCmpts['five']);
    assert.sameDeepMembers(fiveSg, [
      {
        name: 'five_tuple',
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: five_tuple_fields, values: [datum["Year"], datum["Origin"]]} : null',
            force: true
          }
        ]
      },
      {
        name: 'five_init',
        init:
          'modify("five_store", [{unit: "", fields: five_tuple_fields, values: [datetime(1970, 1, 1+1, 0, 0, 0, 0), "Japan"]},{unit: "", fields: five_tuple_fields, values: [datetime(1980, 1, 1+1, 0, 0, 0, 0), "USA"]}])'
      }
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg, threeSg, fourSg, fiveSg));
  });

  it('builds unit datasets', () => {
    const data: any[] = [];
    assert.sameDeepMembers(assembleUnitSelectionData(model, data), [
      {name: 'one_store'},
      {name: 'two_store'},
      {name: 'thr_ee_store'},
      {name: 'four_store'},
      {name: 'five_store'}
    ]);
  });

  it('leaves marks alone', () => {
    const marks: any[] = [];
    model.component.selection = {one: selCmpts['one']};
    assert.equal(assembleUnitSelectionMarks(model, marks), marks);
  });
});
