import {selector as parseSelector} from 'vega-event-selector';
import {assembleTopLevelSignals, assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import inputs from '../../../src/compile/selection/inputs';
import * as log from '../../../src/log';
import {parseUnitModel} from '../../util';

describe('Inputs Selection Transform', () => {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'}
    }
  });

  model.parseScale();
  const selCmpts = parseUnitSelection(model, [
    {
      name: 'one',
      select: 'point',
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'two',
      select: {
        type: 'point',
        fields: ['Cylinders', 'Horsepower']
      },
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'three',
      select: {
        type: 'point',
        fields: ['Cylinders', 'Origin'],
        nearest: true
      },
      bind: {
        Horsepower: {input: 'range', min: 0, max: 10, step: 1},
        Origin: {input: 'select', options: ['Japan', 'USA', 'Europe']}
      }
    },
    {
      name: 'four',
      select: 'point',
      bind: null
    },
    {
      name: 'six',
      select: 'interval',
      bind: 'scales'
    },
    {
      name: 'seven',
      value: [
        {
          Year: {year: 1970, month: 3, date: 9}
        }
      ],
      select: {type: 'point', fields: ['Year']},
      bind: {
        Year: {input: 'range', min: 1970, max: 1980, step: 1}
      }
    },
    {
      name: 'eight',
      select: {type: 'point', on: 'dblclick'},
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'nine',
      select: {
        type: 'point',
        on: 'click',
        clear: 'dblclick'
      },
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'ten',
      select: {type: 'point', fields: ['nested.a']},
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'eleven',
      select: {
        type: 'point',
        fields: ['nested.a'],
        on: 'click'
      },
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'space separated',
      select: 'point',
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'dash-separated',
      select: 'point',
      bind: {input: 'range', min: 0, max: 10, step: 1}
    }
  ]);

  it(
    'drop invalid selection',
    log.wrap(localLogger => {
      const model1 = parseUnitModel({
        mark: 'circle',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {field: 'Origin', type: 'nominal'}
        }
      });

      model1.parseScale();
      const invalidBindLegendSelCmpts = parseUnitSelection(model1, [
        {
          name: 'twelve',
          select: 'point',
          bind: 'legend'
        }
      ]);

      expect(inputs.defined(invalidBindLegendSelCmpts['twelve'])).toBeFalsy();
      expect(localLogger.warns[0]).toEqual(log.message.LEGEND_BINDINGS_MUST_HAVE_PROJECTION);
    })
  );

  it('identifies transform invocation', () => {
    expect(inputs.defined(selCmpts['one'])).toBeTruthy();
    expect(inputs.defined(selCmpts['two'])).toBeTruthy();
    expect(inputs.defined(selCmpts['three'])).toBeTruthy();
    expect(inputs.defined(selCmpts['four'])).toBeFalsy();
    expect(inputs.defined(selCmpts['six'])).toBeFalsy();
    expect(inputs.defined(selCmpts['seven'])).toBeTruthy();
    expect(inputs.defined(selCmpts['eight'])).toBeTruthy();
    expect(inputs.defined(selCmpts['nine'])).toBeTruthy();
    expect(inputs.defined(selCmpts['ten'])).toBeTruthy();
    expect(inputs.defined(selCmpts['eleven'])).toBeTruthy();

    expect(inputs.defined(selCmpts['space_separated'])).toBeTruthy();
    expect(inputs.defined(selCmpts['dash_separated'])).toBeTruthy();
  });

  it('adds widget binding for default projection', () => {
    model.component.selection = {one: selCmpts['one']};
    expect(assembleUnitSelectionSignals(model, [])).toContainEqual({
      name: 'one_tuple',
      update: 'one__vgsid_ !== null ? {fields: one_tuple_fields, values: [one__vgsid_]} : null'
    });

    expect(assembleTopLevelSignals(model, [])).toContainEqual({
      name: 'one__vgsid_',
      value: null,
      bind: {input: 'range', min: 0, max: 10, step: 1}
    });
  });

  it('adds single widget binding for compound projection', () => {
    model.component.selection = {two: selCmpts['two']};
    expect(assembleUnitSelectionSignals(model, [])).toContainEqual({
      name: 'two_tuple',
      update:
        'two_Cylinders !== null && two_Horsepower !== null ? {fields: two_tuple_fields, values: [two_Cylinders, two_Horsepower]} : null'
    });

    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'two_Horsepower',
          value: null,
          bind: {input: 'range', min: 0, max: 10, step: 1}
        },
        {
          name: 'two_Cylinders',
          value: null,
          bind: {input: 'range', min: 0, max: 10, step: 1}
        }
      ])
    );
  });

  it('adds projection-specific widget bindings', () => {
    model.component.selection = {three: selCmpts['three']};
    expect(assembleUnitSelectionSignals(model, [])).toContainEqual({
      name: 'three_tuple',
      update:
        'three_Cylinders !== null && three_Origin !== null ? {fields: three_tuple_fields, values: [three_Cylinders, three_Origin]} : null'
    });

    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'three_Origin',
          value: null,
          bind: {
            input: 'select',
            options: ['Japan', 'USA', 'Europe']
          }
        },
        {
          name: 'three_Cylinders',
          value: null,
          bind: {
            Horsepower: {input: 'range', min: 0, max: 10, step: 1},
            Origin: {
              input: 'select',
              options: ['Japan', 'USA', 'Europe']
            }
          }
        }
      ])
    );
  });

  it('adds widget binding for flattened projection', () => {
    model.component.selection = {one: selCmpts['ten']};
    expect(assembleUnitSelectionSignals(model, [])).toContainEqual({
      name: 'ten_tuple',
      update: 'ten_nested_a !== null ? {fields: ten_tuple_fields, values: [ten_nested_a]} : null'
    });

    expect(assembleTopLevelSignals(model, [])).toContainEqual({
      name: 'ten_nested_a',
      value: null,
      bind: {input: 'range', min: 0, max: 10, step: 1}
    });

    model.component.selection = {one: selCmpts['eleven']};
    expect(assembleUnitSelectionSignals(model, [])).toContainEqual({
      name: 'eleven_tuple',
      update: 'eleven_nested_a !== null ? {fields: eleven_tuple_fields, values: [eleven_nested_a]} : null'
    });

    expect(assembleTopLevelSignals(model, [])).toContainEqual({
      name: 'eleven_nested_a',
      value: null,
      on: [
        {
          events: [{source: 'scope', type: 'click'}],
          update: 'datum && item().mark.marktype !== \'group\' ? datum["nested.a"] : null'
        }
      ],
      bind: {input: 'range', min: 0, max: 10, step: 1}
    });
  });

  it('respects initialization', () => {
    model.component.selection = {seven: selCmpts['seven']};
    expect(assembleUnitSelectionSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'seven_tuple',
          update: 'seven_Year !== null ? {fields: seven_tuple_fields, values: [seven_Year]} : null'
        }
      ])
    );

    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'seven_Year',
          init: 'datetime(1970, 2, 9, 0, 0, 0, 0)',
          bind: {input: 'range', min: 1970, max: 1980, step: 1}
        }
      ])
    );
  });

  it('preserves explicit event triggers', () => {
    model.component.selection = {eight: selCmpts['eight'], nine: selCmpts['nine']};

    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'eight__vgsid_',
          value: null,
          on: [
            {
              events: [{source: 'scope', type: 'dblclick'}],
              update: 'datum && item().mark.marktype !== \'group\' ? datum["_vgsid_"] : null'
            }
          ],
          bind: {input: 'range', min: 0, max: 10, step: 1}
        },
        {
          name: 'nine__vgsid_',
          value: null,
          on: [
            {
              events: [{source: 'scope', type: 'click'}],
              update: 'datum && item().mark.marktype !== \'group\' ? datum["_vgsid_"] : null'
            },
            {events: parseSelector('dblclick', 'view'), update: 'null'}
          ],
          bind: {input: 'range', min: 0, max: 10, step: 1}
        }
      ])
    );
  });
});
