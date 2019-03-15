/* tslint:disable quotemark */

import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import interval from '../../../src/compile/selection/interval';
import multi from '../../../src/compile/selection/multi';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import single from '../../../src/compile/selection/single';
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
    one: {type: 'single', clear: true},
    two: {type: 'multi'},
    three: {type: 'interval', encodings: ['x']},
    four: {type: 'single', clear: 'mouseout'},
    five: {type: 'multi', clear: 'mouseout'},
    six: {type: 'interval', encodings: ['x'], clear: 'mouseout'},
    seven: {type: 'single'},
    eight: {type: 'multi', clear: false},
    nine: {type: 'interval', encodings: ['x'], clear: false},
    ten: {type: 'single', clear: null},
    eleven: {type: 'multi', clear: null},
    twelve: {type: 'interval', encodings: ['x'], clear: null}
  }));

  it('identifies transform invocation', () => {
    expect(clear.has(selCmpts['one'])).toBeTruthy();
    expect(clear.has(selCmpts['two'])).toBeTruthy();
    expect(clear.has(selCmpts['three'])).toBeTruthy();
    expect(clear.has(selCmpts['four'])).toBeTruthy();
    expect(clear.has(selCmpts['five'])).toBeTruthy();
    expect(clear.has(selCmpts['six'])).toBeTruthy();
    expect(clear.has(selCmpts['seven'])).toBeFalsy();
    expect(clear.has(selCmpts['eight'])).toBeFalsy();
    expect(clear.has(selCmpts['nine'])).toBeFalsy();
    expect(clear.has(selCmpts['ten'])).toBeFalsy();
    expect(clear.has(selCmpts['eleven'])).toBeFalsy();
    expect(clear.has(selCmpts['twelve'])).toBeFalsy();
  });

  it('builds clear signals', () => {
    const singleOneSg = single.signals(model, selCmpts['one']);
    const oneSg = clear.signals(model, selCmpts['one'], singleOneSg);
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

    const intervalThreeSg = interval.signals(model, selCmpts['three']);
    const threeSg = clear.signals(model, selCmpts['three'], intervalThreeSg);
    expect(threeSg).toContainEqual({
      name: 'three_tuple',
      on: [
        {
          events: [{signal: 'three_Horsepower'}],
          update: 'three_Horsepower ? {unit: "", fields: three_tuple_fields, values: [three_Horsepower]} : null'
        },
        {events: [{source: 'scope', type: selCmpts['three'].clear}], update: 'null'}
      ]
    });

    const singleFourSg = single.signals(model, selCmpts['four']);
    const fourSg = clear.signals(model, selCmpts['four'], singleFourSg);
    expect(fourSg).toEqual([
      {
        name: 'four_tuple',
        on: [
          {
            events: selCmpts['four'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: four_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          },
          {events: [{source: 'scope', type: selCmpts['four'].clear}], update: 'null'}
        ]
      }
    ]);

    const multiFiveSg = multi.signals(model, selCmpts['five']);
    const fiveSg = clear.signals(model, selCmpts['five'], multiFiveSg);
    expect(fiveSg).toEqual([
      {
        name: 'five_tuple',
        on: [
          {
            events: selCmpts['five'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: five_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          },
          {events: [{source: 'scope', type: selCmpts['five'].clear}], update: 'null'}
        ]
      }
    ]);

    const intervalSixSg = interval.signals(model, selCmpts['six']);
    const sixSg = clear.signals(model, selCmpts['six'], intervalSixSg);
    expect(sixSg).toContainEqual({
      name: 'six_tuple',
      on: [
        {
          events: [{signal: 'six_Horsepower'}],
          update: 'six_Horsepower ? {unit: "", fields: six_tuple_fields, values: [six_Horsepower]} : null'
        },
        {events: [{source: 'scope', type: selCmpts['six'].clear}], update: 'null'}
      ]
    });

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg]));
  });
});
