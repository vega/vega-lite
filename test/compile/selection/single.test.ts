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
      encodings: ['y', 'color']
    }
  }));

  it('builds tuple signals', () => {
    const oneSg = single.signals(model, selCmpts['one']);
    assert.sameDeepMembers(oneSg, [
      {
        name: 'one_tuple',
        value: {},
        on: [
          {
            events: selCmpts['one'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", values: [datum["_vgsid_"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const twoSg = single.signals(model, selCmpts['two']);
    assert.sameDeepMembers(twoSg, [
      {
        name: 'two_tuple',
        value: {},
        on: [
          {
            events: selCmpts['two'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", values: [[(item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon"], (item().isVoronoi ? datum.datum : datum)["bin_maxbins_10_Miles_per_Gallon_end"]], (item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
  });

  it('builds modify signals', () => {
    const oneExpr = single.modifyExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'one_tuple, true');

    const twoExpr = single.modifyExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'two_tuple, true');

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        name: 'one_modify',
        on: [
          {
            events: {signal: 'one_tuple'},
            update: `modify(\"one_store\", ${oneExpr})`
          }
        ]
      },
      {
        name: 'two_modify',
        on: [
          {
            events: {signal: 'two_tuple'},
            update: `modify(\"two_store\", ${twoExpr})`
          }
        ]
      }
    ]);
  });

  it('builds top-level signals', () => {
    const oneSg = single.topLevelSignals(model, selCmpts['one'], []);
    assert.sameDeepMembers(oneSg, [
      {
        name: 'one',
        update: 'data("one_store").length && {_vgsid_: data("one_store")[0].values[0]}'
      }
    ]);

    const twoSg = single.topLevelSignals(model, selCmpts['two'], []);
    assert.sameDeepMembers(twoSg, [
      {
        name: 'two',
        update:
          'data("two_store").length && {Miles_per_Gallon: data("two_store")[0].values[0], Origin: data("two_store")[0].values[1]}'
      }
    ]);

    const signals = selection.assembleTopLevelSignals(model, []);
    assert.includeDeepMembers(
      signals,
      [
        {
          name: 'unit',
          value: {},
          on: [{events: 'mousemove', update: 'isTuple(group()) ? group() : unit'}]
        }
      ].concat(oneSg, twoSg)
    );
  });

  it('builds unit datasets', () => {
    const data: any[] = [];
    assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
      {name: 'one_store'},
      {name: 'two_store'}
    ]);
  });

  it('leaves marks alone', () => {
    const marks: any[] = [];
    model.component.selection = {one: selCmpts['one']};
    assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
  });
});
