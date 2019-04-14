/* tslint:disable quotemark */

import {selector as parseSelector} from 'vega-event-selector';
import {assembleTopLevelSignals} from '../../../src/compile/selection/assemble';
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
    six: {type: 'multi', clear: false},
    seven: {
      type: 'single',
      fields: ['Year'],
      bind: {
        Year: {input: 'range', min: 1970, max: 1980, step: 1}
      }
    }
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
          {events: parseSelector('mouseout', 'scope'), update: 'null'}
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
          {events: parseSelector('mouseout', 'scope'), update: 'null'}
        ]
      }
    ]);

    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'seven_Year',
          value: null,
          on: [
            {
              events: [{source: 'scope', type: 'click'}],
              update: 'datum && item().mark.marktype !== \'group\' ? datum["Year"] : null'
            },
            {
              events: [{source: 'scope', type: 'dblclick'}],
              update: 'null'
            }
          ],
          bind: {input: 'range', min: 1970, max: 1980, step: 1}
        }
      ])
    );
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
    two: {type: 'interval', translate: false, zoom: false},
    three: {type: 'interval', encodings: ['x', 'y'], clear: false, translate: false, zoom: false}
  }));

  it('identifies transform invocation', () => {
    expect(clear.has(selCmpts['one'])).toBeTruthy();
    expect(clear.has(selCmpts['two'])).toBeTruthy();
    expect(clear.has(selCmpts['three'])).toBeFalsy();
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
        }
      ])
    );
  });

  it('creates clear transform', () => {
    const intervalTwoSg = interval.signals(model, selCmpts['two']);
    const twoSg = clear.signals(model, selCmpts['two'], intervalTwoSg);
    expect(twoSg).toEqual(
      expect.arrayContaining([
        {
          name: 'two_x',
          value: [],
          on: [
            {
              events: parseSelector('mousedown', 'scope')[0],
              update: '[x(unit), x(unit)]'
            },
            {
              events: parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
              update: '[two_x[0], clamp(x(unit), 0, width)]'
            },
            {
              events: {signal: 'two_scale_trigger'},
              update: '[scale("x", two_Horsepower[0]), scale("x", two_Horsepower[1])]'
            },
            {
              events: parseSelector('dblclick', 'scope'),
              update: '[0, 0]'
            }
          ]
        },
        {
          name: 'two_y',
          value: [],
          on: [
            {
              events: parseSelector('mousedown', 'scope')[0],
              update: '[y(unit), y(unit)]'
            },
            {
              events: parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
              update: '[two_y[0], clamp(y(unit), 0, height)]'
            },
            {
              events: {signal: 'two_scale_trigger'},
              update: '[scale("y", two_Miles_per_Gallon[0]), scale("y", two_Miles_per_Gallon[1])]'
            },
            {
              events: parseSelector('dblclick', 'scope'),
              update: '[0, 0]'
            }
          ]
        }
      ])
    );
  });
});
