import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import toggle from '../../../src/compile/selection/toggle';
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
  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'point', clear: false}
    },
    {
      name: 'two',
      select: {
        type: 'point',
        encodings: ['y', 'color'],
        resolve: 'union',
        on: 'mouseover',
        clear: false,
        toggle: 'event.ctrlKey'
      }
    },
    {
      name: 'three',
      select: {type: 'point', clear: false, toggle: false}
    },
    {name: 'four', select: {type: 'point', clear: false, toggle: null}},
    {name: 'five', select: {type: 'interval', clear: false}}
  ]));

  it('identifies transform invocation', () => {
    expect(toggle.defined(selCmpts['one'])).toBeTruthy();
    expect(toggle.defined(selCmpts['two'])).toBeTruthy();
    expect(toggle.defined(selCmpts['three'])).toBeFalsy();
    expect(toggle.defined(selCmpts['four'])).toBeFalsy();
    expect(toggle.defined(selCmpts['five'])).toBeFalsy();
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
    expect(oneExpr).toBe('one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');

    const twoExpr = toggle.modifyExpr(model, selCmpts['two'], '');
    expect(twoExpr).toEqual(
      'two_toggle ? null : two_tuple, two_toggle ? null : {unit: ""}, two_toggle ? two_tuple : null'
    );

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
});
