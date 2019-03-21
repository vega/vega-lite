/* tslint:disable quotemark */

import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import toggle from '../../../src/compile/selection/transforms/toggle';
import {parseUnitModel} from '../../util';

describe('Toggle Selection Transform', () => {
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
    one: {type: 'multi', clear: false},
    two: {
      type: 'multi',
      resolve: 'union',
      on: 'mouseover',
      clear: false,
      toggle: 'event.ctrlKey',
      encodings: ['y', 'color']
    },
    three: {type: 'multi', clear: false, toggle: false},
    four: {type: 'multi', clear: false, toggle: null},
    five: {type: 'single', clear: false},
    six: {type: 'interval', clear: false}
  }));

  it('identifies transform invocation', () => {
    expect(toggle.has(selCmpts['one'])).toBeTruthy();
    expect(toggle.has(selCmpts['two'])).toBeTruthy();
    expect(toggle.has(selCmpts['three'])).toBeFalsy();
    expect(toggle.has(selCmpts['four'])).toBeFalsy();
    expect(toggle.has(selCmpts['five'])).toBeFalsy();
    expect(toggle.has(selCmpts['six'])).toBeFalsy();
  });

  it('builds toggle signals', () => {
    const oneSg = toggle.signals(model, selCmpts['one'], []);
    expect(oneSg).toEqual([
      {
        name: 'one_toggle',
        value: false,
        on: [
          {
            events: selCmpts['one'].events,
            update: 'event.shiftKey'
          }
        ]
      }
    ]);

    const twoSg = toggle.signals(model, selCmpts['two'], []);
    expect(twoSg).toEqual([
      {
        name: 'two_toggle',
        value: false,
        on: [
          {
            events: selCmpts['two'].events,
            update: 'event.ctrlKey'
          }
        ]
      }
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg]));
  });

  it('builds modify expr', () => {
    const oneExpr = toggle.modifyExpr(model, selCmpts['one'], '');
    expect(oneExpr).toEqual('one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');

    const twoExpr = toggle.modifyExpr(model, selCmpts['two'], '');
    expect(twoExpr).toEqual(
      'two_toggle ? null : two_tuple, two_toggle ? null : {unit: ""}, two_toggle ? two_tuple : null'
    );

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(
      expect.arrayContaining([
        {
          name: 'one_modify',
          update: `modify(\"one_store\", ${oneExpr})`
        },
        {
          name: 'two_modify',
          update: `modify(\"two_store\", ${twoExpr})`
        }
      ])
    );
  });
});
