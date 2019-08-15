import {assembleUnitSelectionSignals} from '../../../src/compile/selection/assemble';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import {parseUnitModel} from '../../util';

describe('Inputs Selection Transform', () => {
  const model = parseUnitModel({
    mark: 'circle',
    encoding: {
      x: {field: 'Horsepower', type: 'quantitative'},
      y: {field: 'Miles_per_Gallon', type: 'quantitative'},
      color: {field: 'Origin', type: 'nominal'},
      size: {field: 'Cylinders', type: 'nominal'}
    }
  });
  model.parseScale();
  const selCmpts = parseUnitSelection(model, {
    one: {
      type: 'multi',
      fields: ['Origin']
    },
    two: {
      type: 'multi',
      fields: ['Cylinders']
    },
    three: {
      type: 'multi',
      fields: ['Origin', 'Cylinders']
    }
  });

  it('modify the tuple singals when interactive legend is present', () => {
    model.component.selection = {one: selCmpts['one'], two: selCmpts['two']};
    const signals = assembleUnitSelectionSignals(model, []);
    expect(signals.filter(s => s.name === 'one_tuple')[0].on).toEqual(
      expect.arrayContaining([
        {
          events: [{source: 'scope', type: 'click'}],
          update:
            "item().mark.name !== 'symbols_Cylinders_legend' && item().mark.name !== 'labels_Cylinders_legend' && item().mark.name !== 'symbols_Origin_legend' && item().mark.name !== 'labels_Origin_legend' && datum && item().mark.marktype !== 'group' ? {unit: \"\", fields: one_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)[\"Origin\"]]} : null",
          force: true
        },
        {
          events: '@symbols_Origin_legend:click, @labels_Origin_legend:click, ',
          update: '{unit: "", fields: one_tuple_fields, values: [datum.value]}'
        }
      ])
    );
    expect(signals.filter(s => s.name === 'two_tuple')[0].on).toEqual(
      expect.arrayContaining([
        {
          events: [{source: 'scope', type: 'click'}],
          update:
            "item().mark.name !== 'symbols_Cylinders_legend' && item().mark.name !== 'labels_Cylinders_legend' && item().mark.name !== 'symbols_Origin_legend' && item().mark.name !== 'labels_Origin_legend' && datum && item().mark.marktype !== 'group' ? {unit: \"\", fields: two_tuple_fields, values: [(item().isVoronoi ? datum.datum : datum)[\"Cylinders\"]]} : null",
          force: true
        },
        {
          events: '@symbols_Cylinders_legend:click, @labels_Cylinders_legend:click, ',
          update: '{unit: "", fields: two_tuple_fields, values: [datum.value]}'
        }
      ])
    );
  });

  it('adds the signals for legends when one signal populate all encoding fields', () => {
    model.component.selection = {three: selCmpts['three']};
    expect(assembleUnitSelectionSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'three_Cylinders_legend',
          on: [
            {
              events: [{source: 'scope', type: 'click'}],
              update:
                "item().mark.name !== 'symbols_Cylinders_legend' && item().mark.name !== 'labels_Cylinders_legend' && item().mark.name !== 'symbols_Origin_legend' && item().mark.name !== 'labels_Origin_legend' &&  item().mark.marktype !== 'group' ? (item().isVoronoi ? datum.datum : datum)['Cylinders'] : (!(item().mark.name !== 'symbols_Cylinders_legend' && item().mark.name !== 'labels_Cylinders_legend' && item().mark.name !== 'symbols_Origin_legend' && item().mark.name !== 'labels_Origin_legend') ? three_Cylinders_legend : null)"
            },
            {
              events: '@symbols_Cylinders_legend:click, @labels_Cylinders_legend:click',
              update: 'datum.value'
            }
          ]
        },
        {
          name: 'three_Origin_legend',
          on: [
            {
              events: [{source: 'scope', type: 'click'}],
              update:
                "item().mark.name !== 'symbols_Cylinders_legend' && item().mark.name !== 'labels_Cylinders_legend' && item().mark.name !== 'symbols_Origin_legend' && item().mark.name !== 'labels_Origin_legend' &&  item().mark.marktype !== 'group' ? (item().isVoronoi ? datum.datum : datum)['Origin'] : (!(item().mark.name !== 'symbols_Cylinders_legend' && item().mark.name !== 'labels_Cylinders_legend' && item().mark.name !== 'symbols_Origin_legend' && item().mark.name !== 'labels_Origin_legend') ? three_Origin_legend : null)"
            },
            {
              events: '@symbols_Origin_legend:click, @labels_Origin_legend:click',
              update: 'datum.value'
            }
          ]
        }
      ])
    );
  });
});
