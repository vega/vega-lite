/* tslint:disable quotemark */

import {assert} from 'chai';
import {nonPosition} from '../../../src/compile/mark/mixins';
import * as selection from '../../../src/compile/selection/selection';
import {parseUnitModel} from '../../util';

function getModel(selectionDef: any) {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {
        "field": "Cylinders", "type": "O",
        "condition": {
          "selection": "!one",
          "value": "grey"
        }
      },
      "opacity": {
        "field": "Origin", "type": "N",
        "condition": {
          "selection": "one",
          "value": 0.5
        }
      }
    }
  });

  model.component.selection = selection.parseUnitSelection(model, {
    "one": selectionDef
  });

  return model;
}


describe('Selection Predicate', function() {
  it('generates Vega production rules', function() {
    const single = getModel({type: 'single'});
    assert.deepEqual(nonPosition('color', single), {
      color: [
        {test: "!vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: "grey"},
        {scale: "color", field: "Cylinders"}
      ]
    });

    assert.deepEqual(nonPosition('opacity', single), {
      opacity: [
        {test: "vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: 0.5},
        {scale: "opacity", field: "Origin"}
      ]
    });

    const multi = getModel({type: 'multi'});
    assert.deepEqual(nonPosition('color', multi), {
      color: [
        {test: "!vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: "grey"},
        {scale: "color", field: "Cylinders"}
      ]
    });

    assert.deepEqual(nonPosition('opacity', multi), {
      opacity: [
        {test: "vlPoint(\"one_store\", \"\", datum, \"union\", \"all\")", value: 0.5},
        {scale: "opacity", field: "Origin"}
      ]
    });

    const interval = getModel({type: 'interval'});
    assert.deepEqual(nonPosition('color', interval), {
      color: [
        {test: "!vlInterval(\"one_store\", \"\", datum, \"union\", \"all\")", value: "grey"},
        {scale: "color", field: "Cylinders"}
      ]
    });

    assert.deepEqual(nonPosition('opacity', interval), {
      opacity: [
        {test: "vlInterval(\"one_store\", \"\", datum, \"union\", \"all\")", value: 0.5},
        {scale: "opacity", field: "Origin"}
      ]
    });
  });
});
