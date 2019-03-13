/* tslint:disable quotemark */

import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import multi from '../../../src/compile/selection/multi';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import clear from '../../../src/compile/selection/transforms/clear';
import {parseUnitModel} from '../../util';

describe('Clear Selection Transform', () => {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();
  const selCmpts = (model.component.selection = parseUnitSelection(model, {
    one: {type: 'multi'},
    two: {type: 'multi', clear: 'dblclick'},
    three: {type: 'multi', clear: false},
    four: {type: 'multi', clear: null},
    five: {type: 'single'},
    six: {type: 'interval'}
  }));

  it('identifies transform invocation', () => {
    expect(clear.has(selCmpts['one'])).toBeTruthy();
    expect(clear.has(selCmpts['two'])).toBeTruthy();
    expect(clear.has(selCmpts['three'])).toBeFalsy();
    expect(clear.has(selCmpts['four'])).toBeFalsy();
    expect(clear.has(selCmpts['five'])).toBeFalsy();
  });

  it('builds clear signals', () => {
    const multiOneSg = multi.signals(model, selCmpts['one']);
    expect(multiOneSg).toEqual([
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

    const oneSg = clear.signals(model, selCmpts['one'], multiOneSg);
    expect(oneSg).toEqual([
      {
        name: 'one_tuple',
        on: [
          {
            events: selCmpts['one'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: one_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          },
          {events: [{source: 'scope', type: selCmpts['one'].clear}], update: 'null'}
        ]
      }
    ]);

    const multiTwoSg = multi.signals(model, selCmpts['two']);
    expect(multiTwoSg).toEqual([
      {
        name: 'two_tuple',
        on: [
          {
            events: selCmpts['two'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: two_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          }
        ]
      }
    ]);

    const twoSg = clear.signals(model, selCmpts['two'], multiTwoSg);
    expect(twoSg).toEqual([
      {
        name: 'two_tuple',
        on: [
          {
            events: selCmpts['two'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: two_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          },
          {events: [{source: 'scope', type: selCmpts['two'].clear}], update: 'null'}
        ]
      }
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg]));
  });
});
