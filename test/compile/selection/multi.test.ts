/* tslint:disable quotemark */
import {assert} from 'chai';

import multi from '../../../src/compile/selection/multi';
import * as selection from '../../../src/compile/selection/selection';
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

  const selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
    one: {type: 'multi'},
    two: {
      type: 'multi',
      nearest: true,
      on: 'mouseover',
      toggle: 'event.ctrlKey',
      encodings: ['y', 'color']
    }
  }));

  it('builds tuple signals', () => {
    const oneSg = multi.signals(model, selCmpts['one']);
    assert.sameDeepMembers(oneSg, [
      {
        name: 'one_tuple',
        value: {},
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
        value: {},
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

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
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
