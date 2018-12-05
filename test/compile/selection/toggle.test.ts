/* tslint:disable quotemark */

import * as selection from '../../../src/compile/selection/selection';
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
  const selCmpts = (model.component.selection = selection.parseUnitSelection(model, {
    one: {type: 'multi'},
    two: {
      type: 'multi',
      resolve: 'union',
      on: 'mouseover',
      toggle: 'event.ctrlKey',
      encodings: ['y', 'color']
    },
    three: {type: 'multi', toggle: false},
    four: {type: 'multi', toggle: null},
    five: {type: 'single'},
    six: {type: 'interval'}
  }));

  it('identifies transform invocation', () => {
    expect(toggle.has(selCmpts['one'])).not.toBe(false);
    expect(toggle.has(selCmpts['two'])).not.toBe(false);
    expect(toggle.has(selCmpts['three'])).not.toBe(true);
    expect(toggle.has(selCmpts['four'])).not.toBe(true);
    expect(toggle.has(selCmpts['five'])).not.toBe(true);
    expect(toggle.has(selCmpts['six'])).not.toBe(true);
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

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
  });

  it('builds modify expr', () => {
    const oneExpr = toggle.modifyExpr(model, selCmpts['one'], '');
    expect(oneExpr).toEqual(
      'one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null'
    );

    const twoExpr = toggle.modifyExpr(model, selCmpts['two'], '');
    expect(twoExpr).toEqual(
      'two_toggle ? null : two_tuple, two_toggle ? null : {unit: ""}, two_toggle ? two_tuple : null'
    );

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
});
