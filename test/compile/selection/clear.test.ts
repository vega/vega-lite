import {selector as parseSelector} from 'vega-event-selector';
import {assembleTopLevelSignals} from '../../../src/compile/selection/assemble';
import interval from '../../../src/compile/selection/interval';
import point from '../../../src/compile/selection/point';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import clear from '../../../src/compile/selection/clear';
import {parseUnitModel} from '../../util';

describe('Clear selection transform, point types', () => {
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
    {name: 'one', select: 'point'},
    {name: 'three', select: {type: 'point', clear: 'mouseout'}},
    {name: 'four', select: {type: 'point', clear: 'mouseout'}},
    {name: 'five', select: {type: 'point', clear: false}},
    {name: 'six', select: {type: 'point', clear: false}},
    {
      name: 'seven',
      select: {type: 'point', fields: ['Year']},
      bind: {
        Year: {input: 'range', min: 1970, max: 1980, step: 1}
      }
    },
    {
      name: 'eight',
      select: {
        type: 'point',
        fields: ['Year'],
        clear: 'click'
      },
      bind: {
        Year: {input: 'range', min: 1970, max: 1980, step: 1}
      }
    }
  ]));

  it('identifies transform invocation', () => {
    expect(clear.defined(selCmpts['one'])).toBeTruthy();
    expect(clear.defined(selCmpts['three'])).toBeTruthy();
    expect(clear.defined(selCmpts['four'])).toBeTruthy();
    expect(clear.defined(selCmpts['five'])).toBeFalsy();
    expect(clear.defined(selCmpts['six'])).toBeFalsy();
  });

  it('appends clear event trigger', () => {
    const singleOneSg = point.signals(model, selCmpts['one'], []);
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
          {events: parseSelector('dblclick', 'view'), update: 'null'}
        ]
      }
    ]);

    const singleThreeSg = point.signals(model, selCmpts['three'], []);
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
          {events: parseSelector('mouseout', 'view'), update: 'null'}
        ]
      }
    ]);

    const multiFourSg = point.signals(model, selCmpts['four'], []);
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
          {events: parseSelector('mouseout', 'view'), update: 'null'}
        ]
      }
    ]);
  });

  it('does not append clear event trigger for bound selections by default', () => {
    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'seven_Year',
          value: null,
          bind: {input: 'range', min: 1970, max: 1980, step: 1}
        }
      ])
    );
  });

  it('appends an explicit clear event trigger for bound selections', () => {
    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'eight_Year',
          value: null,
          on: [{events: parseSelector('click', 'view'), update: 'null'}],
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
  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'interval', encodings: ['x', 'y'], translate: false, zoom: false},
      bind: 'scales'
    },
    {
      name: 'two',
      select: {type: 'interval', translate: false, zoom: false}
    },
    {
      name: 'three',
      select: {type: 'interval', encodings: ['x', 'y'], clear: false, translate: false, zoom: false}
    }
  ]));

  it('identifies transform invocation', () => {
    expect(clear.defined(selCmpts['one'])).toBeTruthy();
    expect(clear.defined(selCmpts['two'])).toBeTruthy();
    expect(clear.defined(selCmpts['three'])).toBeFalsy();
  });

  it('appends clear transform', () => {
    const intervalOneSg = interval.signals(model, selCmpts['one'], []);
    const oneSg = clear.signals(model, selCmpts['one'], intervalOneSg);
    expect(oneSg).toEqual(
      expect.arrayContaining([
        {
          name: 'one_Horsepower',
          on: [
            {
              events: parseSelector('dblclick', 'view'),
              update: 'null'
            }
          ]
        },
        {
          name: 'one_Miles_per_Gallon',
          on: [
            {
              events: parseSelector('dblclick', 'view'),
              update: 'null'
            }
          ]
        }
      ])
    );
  });

  it('creates clear transform', () => {
    const intervalTwoSg = interval.signals(model, selCmpts['two'], []);
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
              events: parseSelector('dblclick', 'view'),
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
              events: parseSelector('dblclick', 'view'),
              update: '[0, 0]'
            }
          ]
        }
      ])
    );
  });
});
