import {parseUnitModel} from '../../util';
import {parseUnitSelection} from '../../../src/compile/selection/parse';
import {assembleTopLevelSignals} from '../../../src/compile/selection/assemble';

describe('Interactive Legends', () => {
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
  model.component.selection = parseUnitSelection(model, {
    one: {type: 'single', fields: ['Origin']},
    two: {type: 'multi', fields: ['Origin']},
    three: {type: 'multi', fields: ['Origin', 'Cylinders']},
    four: {type: 'single', encodings: ['color']},
    five: {type: 'single', encodings: ['color', 'size']},
    six: {type: 'multi', fields: ['Origin', 'Year']}
  });
  model.parseLegends();

  it('should match single field projections', () => {
    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'one_legend',
          on: [
            {
              events: '@Origin_legend_symbols:click, @Origin_legend_labels:click',
              update:
                'modify("one_store", {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true}, true) && {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true}',
              force: true
            },
            {
              events: 'click',
              update: '!event.item || !datum ? modify("one_store", null, true): one_legend'
            }
          ]
        },
        {
          name: 'two_legend',
          on: [
            {
              events: '@Origin_legend_symbols:click, @Origin_legend_labels:click',
              update:
                'modify("two_store", event.shiftKey ? null : {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true}, event.shiftKey ? null : true, event.shiftKey ? {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true} : null) && {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true}',
              force: true
            },
            {
              events: 'click',
              update: '!event.item || !datum ? modify("two_store", null, event.shiftKey ? null : true): two_legend'
            }
          ]
        }
      ])
    );
  });

  it('should match multiple field projections', () => {
    expect(assembleTopLevelSignals(model, [])).toEqual(
      expect.arrayContaining([
        {
          name: 'three_legend',
          on: [
            {
              events: '@Origin_legend_symbols:click, @Origin_legend_labels:click',
              update:
                'modify("three_store", event.shiftKey ? null : {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true}, event.shiftKey ? null : true, event.shiftKey ? {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true} : null) && {unit: "Origin_legend", fields: [{"type":"E","field":"Origin"}], values: [datum.value], legend: true}',
              force: true
            },
            {
              events: '@Cylinders_legend_symbols:click, @Cylinders_legend_labels:click',
              update:
                'modify("three_store", event.shiftKey ? null : {unit: "Cylinders_legend", fields: [{"type":"E","field":"Cylinders"}], values: [datum.value], legend: true}, event.shiftKey ? null : true, event.shiftKey ? {unit: "Cylinders_legend", fields: [{"type":"E","field":"Cylinders"}], values: [datum.value], legend: true} : null) && {unit: "Cylinders_legend", fields: [{"type":"E","field":"Cylinders"}], values: [datum.value], legend: true}',
              force: true
            },
            {
              events: 'click',
              update: '!event.item || !datum ? modify("three_store", null, event.shiftKey ? null : true): three_legend'
            }
          ]
        }
      ])
    );
  });
});
