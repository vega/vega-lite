/* tslint:disable quotemark */

import {assert} from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import single from '../../../src/compile/selection/single';
import {parseUnitModel} from '../../util';

describe('Single Selection', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });

  const selCmpts = model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "single"},
    "two": {
      "type": "single",
      "on": "mouseover", "encodings": ["y", "color"]
    }
  });

  it('builds trigger signals', function() {
    const oneSg = single.signals(model, selCmpts['one']);
    assert.sameDeepMembers(oneSg, [{
      name: 'one',
      value: {},
      on: [{
        events: selCmpts['one'].events,
        update: "{fields: [\"_id\"], values: [(item().isVoronoi ? datum.datum : datum)[\"_id\"]]}"
      }]
    }]);

    const twoSg = single.signals(model, selCmpts['two']);
    assert.sameDeepMembers(twoSg, [{
      name: 'two',
      value: {},
      on: [{
        events: selCmpts['two'].events,
        update: "{fields: [\"Miles_per_Gallon\", \"Origin\"], values: [(item().isVoronoi ? datum.datum : datum)[\"Miles_per_Gallon\"], (item().isVoronoi ? datum.datum : datum)[\"Origin\"]]}"
      }]
    }]);

    const signals = selection.assembleUnitSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
  });

  it('builds tuple signals', function() {
    const oneExpr = single.tupleExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'fields: one.fields, values: one.values, _id: one.values[0]');

    const twoExpr = single.tupleExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'fields: two.fields, values: two.values, Miles_per_Gallon: two.values[0], Origin: two.values[1]');

    const signals = selection.assembleUnitSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "one_tuple",
        "on": [
          {
            "events": {"signal": "one"},
            "update": `{unit: unit.datum && unit.datum._id, ${oneExpr}}`
          }
        ]
      },
      {
        "name": "two_tuple",
        "on": [
          {
            "events": {"signal": "two"},
            "update": `{unit: unit.datum && unit.datum._id, ${twoExpr}}`
          }
        ]
      }
    ]);
  });

  it('builds modify signals', function() {
    const oneExpr = single.modifyExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'one_tuple, true');

    const twoExpr = single.modifyExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'two_tuple, true');

    const signals = selection.assembleUnitSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "one_modify",
        "on": [
          {
            "events": {"signal": "one"},
            "update": `modify(\"one_store\", ${oneExpr})`
          }
        ]
      },
      {
        "name": "two_modify",
        "on": [
          {
            "events": {"signal": "two"},
            "update": `modify(\"two_store\", ${twoExpr})`
          }
        ]
      }
    ]);
  });

  it('builds top-level signals', function() {
    const oneSg = single.topLevelSignals(model, selCmpts['one']);
    assert.sameDeepMembers(oneSg, [{
      name: 'one', update: 'data(\"one_store\")[0]'
    }]);

    const twoSg = single.topLevelSignals(model, selCmpts['two']);
    assert.sameDeepMembers(twoSg, [{
      name: 'two', update: 'data(\"two_store\")[0]'
    }]);

    const signals = selection.assembleTopLevelSignals(model);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
  });

  it('builds unit datasets', function() {
    const data: any[] = [];
    assert.sameDeepMembers(selection.assembleUnitData(model, data), [
      {name: 'one_store'}, {name: 'two_store'}
    ]);
  });

  it('leaves marks alone', function() {
    const marks: any[] = [];
    assert.equal(selection.assembleUnitMarks(model, marks), marks);
  });
});
