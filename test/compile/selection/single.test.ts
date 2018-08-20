/* tslint:disable quotemark */
import {assert} from 'chai';

import * as selection from '../../../src/compile/selection/selection';
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

  const selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
    one: {type: 'single'},
    two: {
      type: 'single',
      nearest: true,
      on: 'mouseover',
      encodings: ['y', 'color'],
      resolve: 'intersect'
    },
    'thr-ee': {
      type: 'single',
      fields: ['Horsepower'],
      init: {Horsepower: 50}
    },
    four: {
      type: 'single',
      encodings: ['x', 'color'],
      init: {x: 50, Origin: 'Japan'}
    }
  }));

  it('builds tuple signals', () => {
    const oneSg = single.signals(model, selCmpts['one']);
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

    const twoSg = single.signals(model, selCmpts['two']);
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

    const threeSg = single.signals(model, selCmpts['thr_ee']);
    assert.sameDeepMembers(threeSg, [
      {
        name: 'thr_ee_tuple',
        update: '{unit: "", fields: thr_ee_tuple_fields, values: [50]}',
        react: false,
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: thr_ee_tuple_fields, values: [datum["Horsepower"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const fourSg = single.signals(model, selCmpts['four']);
    assert.sameDeepMembers(fourSg, [
      {
        name: 'four_tuple',
        update: '{unit: "", fields: four_tuple_fields, values: [50,"Japan"]}',
        react: false,
        on: [
          {
            events: [{source: 'scope', type: 'click'}],
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: four_tuple_fields, values: [datum["Horsepower"], datum["Origin"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg, threeSg, fourSg));
  });

  it('builds modify signals', () => {
    const oneExpr = single.modifyExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'one_tuple, true');

    const twoExpr = single.modifyExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'two_tuple, {unit: ""}');

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        name: 'one_modify',
        update: `modify(\"one_store\", ${oneExpr})`
      },
      {
        name: 'two_modify',
        update: `modify(\"two_store\", ${twoExpr})`
      }
    ]);
  });

  it('builds top-level signals', () => {
    const signals = selection.assembleTopLevelSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        name: 'one',
        update: 'vlSelectionResolve("one_store")'
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
    ]);
  });

  it('builds unit datasets', () => {
    const data: any[] = [];
    assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
      {name: 'one_store'},
      {name: 'two_store'},
      {name: 'thr_ee_store'},
      {name: 'four_store'}
    ]);
  });

  it('leaves marks alone', () => {
    const marks: any[] = [];
    model.component.selection = {one: selCmpts['one']};
    assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
  });
});
