/* tslint:disable quotemark */

import {assert} from 'chai';
import multi from '../../../src/compile/selection/multi';
import * as selection from '../../../src/compile/selection/selection';
import {parseUnitModel} from '../../util';

describe('Multi Selection', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });

  const selCmpts = model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "multi"},
    "two": {
      "type": "multi",
      "on": "mouseover", "toggle": "event.ctrlKey", "encodings": ["y", "color"]
    }
  });

  it('builds trigger signals', function() {
    const oneSg = multi.signals(model, selCmpts['one']);
    assert.sameDeepMembers(oneSg, [{
      name: 'one',
      value: {},
      on: [{
        events: selCmpts['one'].events,
        update: "{encodings: [], fields: [\"_id\"], values: [(item().isVoronoi ? datum.datum : datum)[\"_id\"]]}"
      }]
    }]);

    const twoSg = multi.signals(model, selCmpts['two']);
    assert.sameDeepMembers(twoSg, [{
      name: 'two',
      value: {},
      on: [{
        events: selCmpts['two'].events,
        update: "{encodings: [\"y\", \"color\"], fields: [\"Miles_per_Gallon\", \"Origin\"], values: [(item().isVoronoi ? datum.datum : datum)[\"Miles_per_Gallon\"], (item().isVoronoi ? datum.datum : datum)[\"Origin\"]]}"
      }]
    }]);

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
  });

  it('builds tuple signals', function() {
    const oneExpr = multi.tupleExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'encodings: one.encodings, fields: one.fields, values: one.values');

    const twoExpr = multi.tupleExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'encodings: two.encodings, fields: two.fields, values: two.values');

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "one_tuple",
        "on": [
          {
            "events": {"signal": "one"},
            "update": `{unit: \"\", ${oneExpr}}`
          }
        ]
      },
      {
        "name": "two_tuple",
        "on": [
          {
            "events": {"signal": "two"},
            "update": `{unit: \"\", ${twoExpr}}`
          }
        ]
      }
    ]);
  });

  it('builds unit datasets', function() {
    const data: any[] = [];
    assert.sameDeepMembers(selection.assembleUnitSelectionData(model, data), [
      {name: 'one_store'}, {name: 'two_store'}
    ]);
  });

  it('leaves marks alone', function() {
    const marks: any[] = [];
    assert.equal(selection.assembleUnitSelectionMarks(model, marks), marks);
  });
});
