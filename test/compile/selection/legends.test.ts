import {assembleTopLevelSignals, assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import legends from '../../../src/compile/selection/legends';
import * as log from '../../../src/log';
import {parseUnitModel} from '../../util';

describe('Interactive Legends', () => {
  it(
    'throws drops invalid legend binding without projection',
    log.wrap(localLogger => {
      const m = parseUnitModel({
        mark: 'circle',
        encoding: {
          x: {field: 'Horsepower', type: 'quantitative'},
          y: {field: 'Miles_per_Gallon', type: 'quantitative'},
          color: {field: 'Origin', type: 'nominal'},
          size: {field: 'Cylinders', type: 'ordinal'}
        }
      });

      m.parseScale();
      const selCmpts = (m.component.selection = parseUnitSelection(m, [
        {
          name: 'three',
          select: {type: 'point', fields: ['Origin', 'Cylinders']},
          bind: 'legend'
        },
        {
          name: 'five',
          select: {type: 'point', encodings: ['color', 'size']},
          bind: 'legend'
        },
        {
          name: 'six',
          select: 'point',
          bind: 'legend'
        }
      ]));
      m.parseLegends();
      expect(legends.defined(selCmpts['three'])).toBeFalsy();
      expect(localLogger.warns[0]).toEqual(log.message.LEGEND_BINDINGS_MUST_HAVE_PROJECTION);

      expect(legends.defined(selCmpts['five'])).toBeFalsy();
      expect(localLogger.warns[1]).toEqual(log.message.LEGEND_BINDINGS_MUST_HAVE_PROJECTION);

      expect(legends.defined(selCmpts['six'])).toBeFalsy();
      expect(localLogger.warns[2]).toEqual(log.message.LEGEND_BINDINGS_MUST_HAVE_PROJECTION);
    })
  );

  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'},
      size: {field: 'Cylinders', type: 'ordinal'}
    }
  });

  model.parseScale();
  const selCmpts = (model.component.selection = parseUnitSelection(model, [
    {
      name: 'one',
      select: {type: 'point', fields: ['Origin']},
      bind: 'legend'
    },
    {
      name: 'two',
      select: {type: 'point', fields: ['Origin']},
      bind: {legend: 'dblclick, mouseover'}
    },
    {
      name: 'four',
      select: {type: 'point', encodings: ['color']},
      bind: 'legend'
    },
    {
      name: 'seven',
      select: {type: 'point', fields: ['Origin'], on: 'click'},
      bind: {legend: 'mouseover'}
    },
    {
      name: 'eight',
      select: {type: 'point', encodings: ['color'], on: 'click', clear: 'dblclick'},
      bind: {legend: 'mouseover'}
    },
    {
      name: 'nine',
      select: 'point',
      bind: {input: 'range', min: 0, max: 10, step: 1}
    },
    {
      name: 'ten',
      value: [{Origin: 'USA'}, {Origin: 'Japan'}],
      select: {
        type: 'point',
        fields: ['Origin']
      },
      bind: 'legend'
    }
  ]));
  model.parseLegends();

  it('identifies transform invocation', () => {
    expect(legends.defined(selCmpts['one'])).toBeTruthy();
    expect(legends.defined(selCmpts['two'])).toBeTruthy();

    expect(legends.defined(selCmpts['four'])).toBeTruthy();

    expect(legends.defined(selCmpts['seven'])).toBeTruthy();
    expect(legends.defined(selCmpts['eight'])).toBeTruthy();
    expect(legends.defined(selCmpts['nine'])).toBeFalsy();
    expect(legends.defined(selCmpts['ten'])).toBeTruthy();
  });

  it('adds legend binding top-level signal', () => {
    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'one_Origin_legend',
          value: null,
          on: [
            {
              events: [
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_entries'
                }
              ],
              update: 'datum.value || item().items[0].items[0].datum.value',
              force: true
            },
            {
              events: [{source: 'view', type: 'click'}],
              update: '!event.item || !datum ? null : one_Origin_legend',
              force: true
            }
          ]
        },
        {
          name: 'two_Origin_legend',
          value: null,
          on: [
            {
              events: [
                {
                  source: 'view',
                  type: 'dblclick',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'dblclick',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'dblclick',
                  markname: 'Origin_legend_entries'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_entries'
                }
              ],
              update: 'datum.value || item().items[0].items[0].datum.value',
              force: true
            },
            {
              events: [
                {
                  source: 'view',
                  type: 'dblclick'
                },
                {
                  source: 'view',
                  type: 'mouseover'
                }
              ],
              update: '!event.item || !datum ? null : two_Origin_legend',
              force: true
            }
          ]
        },
        {
          name: 'four_Origin_legend',
          value: null,
          on: [
            {
              events: [
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_entries'
                }
              ],
              update: 'datum.value || item().items[0].items[0].datum.value',
              force: true
            },
            {
              events: [
                {
                  source: 'view',
                  type: 'click'
                }
              ],
              update: '!event.item || !datum ? null : four_Origin_legend',
              force: true
            }
          ]
        },
        {
          name: 'seven_Origin_legend',
          value: null,
          on: [
            {
              events: [
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_entries'
                }
              ],
              update: 'datum.value || item().items[0].items[0].datum.value',
              force: true
            },
            {
              events: [
                {
                  source: 'view',
                  type: 'mouseover'
                }
              ],
              update: '!event.item || !datum ? null : seven_Origin_legend',
              force: true
            }
          ]
        },
        {
          name: 'eight_Origin_legend',
          value: null,
          on: [
            {
              events: [
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'mouseover',
                  markname: 'Origin_legend_entries'
                }
              ],
              update: 'datum.value || item().items[0].items[0].datum.value',
              force: true
            },
            {
              events: [
                {
                  source: 'view',
                  type: 'mouseover'
                }
              ],
              update: '!event.item || !datum ? null : eight_Origin_legend',
              force: true
            }
          ]
        }
      ])
    );
  });

  it('updates tuple signal to use bound top-level signal', () => {
    expect(assembleUnitSelectionSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'one_tuple',
          update: 'one_Origin_legend !== null ? {fields: one_tuple_fields, values: [one_Origin_legend]} : null'
        },
        {
          name: 'two_tuple',
          update: 'two_Origin_legend !== null ? {fields: two_tuple_fields, values: [two_Origin_legend]} : null'
        },
        {
          name: 'four_tuple',
          update: 'four_Origin_legend !== null ? {fields: four_tuple_fields, values: [four_Origin_legend]} : null'
        }
      ])
    );
  });

  it('preserves explicit event triggers', () => {
    expect(assembleUnitSelectionSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'seven_tuple',
          on: [
            {
              events: [
                {
                  source: 'scope',
                  type: 'click',
                  filter: ['event.item && indexof(event.item.mark.role, "legend") < 0']
                }
              ],
              update:
                'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: seven_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
              force: true
            },
            {
              events: [
                {
                  signal: 'seven_Origin_legend'
                }
              ],
              update:
                'seven_Origin_legend !== null ? {fields: seven_tuple_fields, values: [seven_Origin_legend]} : null'
            }
          ]
        },
        {
          name: 'eight_tuple',
          on: [
            {
              events: [
                {
                  source: 'scope',
                  type: 'click',
                  filter: ['event.item && indexof(event.item.mark.role, "legend") < 0']
                }
              ],
              update:
                'datum && item().mark.marktype !== \'group\' ? {unit: "", fields: eight_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)["Origin"]]} : null',
              force: true
            },
            {
              events: [
                {
                  signal: 'eight_Origin_legend'
                }
              ],
              update:
                'eight_Origin_legend !== null ? {fields: eight_tuple_fields, values: [eight_Origin_legend]} : null'
            },
            {
              events: [
                {
                  source: 'view',
                  type: 'dblclick'
                }
              ],
              update: 'null'
            }
          ]
        }
      ])
    );
  });

  it('respects initialization', () => {
    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'ten_Origin_legend',
          on: [
            {
              events: [
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_symbols'
                },
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_labels'
                },
                {
                  source: 'view',
                  type: 'click',
                  markname: 'Origin_legend_entries'
                }
              ],
              update: 'datum.value || item().items[0].items[0].datum.value',
              force: true
            },
            {
              events: [{source: 'view', type: 'click'}],
              update: '!event.item || !datum ? null : ten_Origin_legend',
              force: true
            }
          ]
        }
      ])
    );
  });
});
