/* tslint:disable quotemark */

import {selector as parseSelector} from 'vega-event-selector';
import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import interval from '../../../src/compile/selection/interval';
import multi from '../../../src/compile/selection/multi';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import single from '../../../src/compile/selection/single';
import clear from '../../../src/compile/selection/transforms/clear';
import {parseUnitModel} from '../../util';

describe('Clear selection transform, single and multi types', () => {
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
    one: {type: 'single'},
    two: {type: 'multi'},
    three: {type: 'single', clear: 'mouseout'},
    four: {type: 'multi', clear: 'mouseout'},
    five: {type: 'single', clear: false},
    six: {type: 'multi', clear: false}
  }));

  it('identifies transform invocation', () => {
    expect(clear.has(selCmpts['one'])).toBeTruthy();
    expect(clear.has(selCmpts['two'])).toBeTruthy();
    expect(clear.has(selCmpts['three'])).toBeTruthy();
    expect(clear.has(selCmpts['four'])).toBeTruthy();
    expect(clear.has(selCmpts['five'])).toBeFalsy();
    expect(clear.has(selCmpts['six'])).toBeFalsy();
  });

  it('appends clear transform', () => {
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
          {events: parseSelector('dblclick', 'scope'), update: 'null'}
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
          {events: parseSelector('dblclick', 'scope'), update: 'null'}
        ]
      }
    ]);

    const singleThreeSg = single.signals(model, selCmpts['three']);
    const threeSg = clear.signals(model, selCmpts['three'], singleThreeSg);
    expect(threeSg).toEqual([
      {
        name: 'three_tuple',
        on: [
          {
            events: selCmpts['three'].events,
            update:
              'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: three_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["_vgsid_"]]} : null',
            force: true
          },
          {events: parseSelector(selCmpts['three'].clear, 'scope'), update: 'null'}
        ]
      }
    ]);

    const multiFourSg = multi.signals(model, selCmpts['four']);
    const fourSg = clear.signals(model, selCmpts['four'], multiFourSg);
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
          {events: parseSelector(selCmpts['four'].clear, 'scope'), update: 'null'}
        ]
      }
    ]);

    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals).toEqual(expect.arrayContaining([...oneSg, ...twoSg]));
  });
});

describe('Clear selection transform, interval type', () => {
  const model = parseUnitModel({
    mark: 'point',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();
  const selCmpts = (model.component.selection = parseUnitSelection(model, {
    one: {type: 'interval', encodings: ['x', 'y'], bind: 'scales', translate: false, zoom: false},
    two: {type: 'interval', encodings: ['x', 'y'], clear: false, translate: false, zoom: false}
  }));

  it('identifies transform invocation', () => {
    expect(clear.has(selCmpts['one'])).toBeTruthy();
    expect(clear.has(selCmpts['two'])).toBeFalsy();
  });

  it('appends clear transform', () => {
    const intervalOneSg = interval.signals(model, selCmpts['one']);
    const oneSg = clear.signals(model, selCmpts['one'], intervalOneSg);
    expect(oneSg).toEqual(
      expect.arrayContaining([
        {
          name: 'one_Horsepower',
          on: [
            {
              events: parseSelector('dblclick', 'scope'),
              update: 'null'
            }
          ]
        },
        {
          name: 'one_Miles_per_Gallon',
          on: [
            {
              events: parseSelector('dblclick', 'scope'),
              update: 'null'
            }
          ]
        },
        {
          name: 'one_tuple',
          on: [
            {
              events: [{signal: 'one_Horsepower || one_Miles_per_Gallon'}],
              update:
                'one_Horsepower && one_Miles_per_Gallon ? {unit: "", fields: one_tuple_fields, values: [one_Horsepower,one_Miles_per_Gallon]} : null'
            }
          ]
        }
      ])
    );
  });
});
