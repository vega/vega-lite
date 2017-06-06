/* tslint:disable quotemark */

import {assert} from 'chai';
import * as selection from '../../../src/compile/selection/selection';
import toggle from '../../../src/compile/selection/transforms/toggle';
import {parseUnitModel} from '../../util';

describe('Toggle Selection Transform', function() {
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
      "type": "multi", "resolve": "union",
      "on": "mouseover", "toggle": "event.ctrlKey", "encodings": ["y", "color"]
    }
  });

  it('builds toggle signals', function() {
    const oneSg = toggle.signals(model, selCmpts['one'], []);
    assert.sameDeepMembers(oneSg, [{
      name: 'one_toggle',
      value: false,
      on: [{
        events: selCmpts['one'].events,
        update: 'event.shiftKey'
      }]
    }]);

    const twoSg = toggle.signals(model, selCmpts['two'], []);
    assert.sameDeepMembers(twoSg, [{
      name: 'two_toggle',
      value: false,
      on: [{
        events: selCmpts['two'].events,
        update: 'event.ctrlKey'
      }]
    }]);

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, oneSg.concat(twoSg));
  });

  it('builds modify expr', function() {
    const oneExpr = toggle.modifyExpr(model, selCmpts['one'], '');
    assert.equal(oneExpr, 'one_toggle ? null : one_tuple, one_toggle ? null : true, one_toggle ? one_tuple : null');

    const twoExpr = toggle.modifyExpr(model, selCmpts['two'], '');
    assert.equal(twoExpr, 'two_toggle ? null : two_tuple, two_toggle ? null : {unit: \"\"}, two_toggle ? two_tuple : null');

    const signals = selection.assembleUnitSelectionSignals(model, []);
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
});
