/* tslint:disable quotemark */

import {assert} from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import inputs from '../../../src/compile/selection/transforms/inputs';
import {parseUnitModel} from '../../util';

describe('Inputs Selection Transform', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });

  model.parseScale();
  const selCmpts = selection.parseUnitSelection(model, {
    "one": {
      "type": "single",
      "bind": {"input": "range", "min": 0, "max": 10, "step": 1}
    },
    "two": {
      "type": "single",
      "fields": ["Cylinders", "Horsepower"],
      "bind": {"input": "range", "min": 0, "max": 10, "step": 1}
    },
    "three": {
      "type": "single",
      "fields": ["Cylinders", "Origin"],
      "bind": {
        "Horsepower": {"input": "range", "min": 0, "max": 10, "step": 1},
        "Origin": {"input": "select", "options": ["Japan", "USA", "Europe"]}
      }
    },
    "four": {
      "type": "multi",
      "bind": {"input": "range", "min": 0, "max": 10, "step": 1}
    },
    "five": {
      "type": "interval",
      "bind": {"input": "range", "min": 0, "max": 10, "step": 1}
    },
    "six": {
      "type": "interval",
      "bind": "scales"
    },
    "seven": {
      "type": "single",
      "bind": "scales"
    }
  });

  it('identifies transform invocation', function() {
    assert.isTrue(inputs.has(selCmpts['one']));
    assert.isTrue(inputs.has(selCmpts['two']));
    assert.isTrue(inputs.has(selCmpts['three']));
    assert.isFalse(inputs.has(selCmpts['four']));
    assert.isFalse(inputs.has(selCmpts['five']));
    assert.isFalse(inputs.has(selCmpts['six']));
    assert.isFalse(inputs.has(selCmpts['four']));
  });

  it('adds widget binding for default projection', function() {
    model.component.selection = {one: selCmpts['one']};
    assert.includeDeepMembers(selection.assembleUnitSignals(model, []), [
      {
        "name": "one",
        "update": "{fields: [\"_id\"], values: [one__id]}"
      }
    ]);

    assert.includeDeepMembers(selection.assembleTopLevelSignals(model), [
      {
        "name": "one__id",
        "value": "",
        "on": [
          {
            "events": [{"source": "scope","type": "click"}],
            "update": "(item().isVoronoi ? datum.datum : datum)[\"_id\"]"
          }
        ],
        "bind": {"input": "range","min": 0,"max": 10,"step": 1}
      }
    ]);
  });

  it('adds single widget binding for compound projection', function() {
    model.component.selection = {two: selCmpts['two']};
    assert.includeDeepMembers(selection.assembleUnitSignals(model, []), [
      {
        "name": "two",
        "update": "{fields: [\"Cylinders\", \"Horsepower\"], values: [two_Cylinders, two_Horsepower]}"
      }
    ]);

    assert.includeDeepMembers(selection.assembleTopLevelSignals(model), [
      {
        "name": "two_Horsepower",
        "value": "",
        "on": [
          {
            "events": [{"source": "scope","type": "click"}],
            "update": "(item().isVoronoi ? datum.datum : datum)[\"Horsepower\"]"
          }
        ],
        "bind": {"input": "range","min": 0,"max": 10,"step": 1}
      },
      {
        "name": "two_Cylinders",
        "value": "",
        "on": [
          {
            "events": [{"source": "scope","type": "click"}],
            "update": "(item().isVoronoi ? datum.datum : datum)[\"Cylinders\"]"
          }
        ],
        "bind": {"input": "range","min": 0,"max": 10,"step": 1}
      }
    ]);
  });

  it('adds projection-specific widget bindings', function() {
    model.component.selection = {three: selCmpts['three']};
    assert.includeDeepMembers(selection.assembleUnitSignals(model, []), [
      {
        "name": "three",
        "update": "{fields: [\"Cylinders\", \"Origin\"], values: [three_Cylinders, three_Origin]}"
      }
    ]);

    assert.includeDeepMembers(selection.assembleTopLevelSignals(model), [
      {
        "name": "three_Origin",
        "value": "",
        "on": [
          {
            "events": [{"source": "scope","type": "click"}],
            "update": "(item().isVoronoi ? datum.datum : datum)[\"Origin\"]"
          }
        ],
        "bind": {
          "input": "select",
          "options": ["Japan","USA","Europe"]
        }
      },
      {
        "name": "three_Cylinders",
        "value": "",
        "on": [
          {
            "events": [{"source": "scope","type": "click"}],
            "update": "(item().isVoronoi ? datum.datum : datum)[\"Cylinders\"]"
          }
        ],
        "bind": {
          "Horsepower": {"input": "range","min": 0,"max": 10,"step": 1},
          "Origin": {
            "input": "select",
            "options": ["Japan","USA","Europe"]
          }
        }
      }
    ]);
  });
});
