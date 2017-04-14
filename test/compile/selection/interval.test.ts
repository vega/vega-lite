/* tslint:disable quotemark */

import {assert} from 'chai';
import {selector as parseSelector} from 'vega-event-selector';

import interval from '../../../src/compile/selection/interval';
import * as selection from '../../../src/compile/selection/selection';
import {parseUnitModel} from '../../util';

describe('Interval Selections', function() {
  const model = parseUnitModel({
    "mark": "circle",
    "encoding": {
      "x": {"field": "Horsepower","type": "quantitative"},
      "y": {"field": "Miles_per_Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "N"}
    }
  });
  model.parseScale();

  const selCmpts = model.component.selection = selection.parseUnitSelection(model, {
    "one": {"type": "interval", "encodings": ["x"], "translate": false, "zoom": false},
    "two": {
      "type": "interval",
      "encodings": ["y"],
      "bind": "scales",
      "translate": false,
      "zoom": false
    },
    "three": {
      "type": "interval",
      "on": "[mousedown, mouseup] > mousemove, [keydown, keyup] > keypress",
      "translate": false,
      "zoom": false
    }
  });

  describe('Trigger Signals', function() {
    it('builds projection signals', function() {
      const oneSg = interval.signals(model, selCmpts['one']);
      assert.includeDeepMembers(oneSg, [{
        "name": "one_x",
        "value": [],
        "on": [
          {
            "events": parseSelector('mousedown', 'scope')[0],
            "update": "invert(\"x\", [x(unit), x(unit)])"
          },
          {
            "events": parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
            "update": "[one_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
          }
        ]
      }]);

      const twoSg = interval.signals(model, selCmpts['two']);
      assert.includeDeepMembers(twoSg, [{
        "name": "two_y",
        "on": [],
        "value": []
      }]);

      const threeSg = interval.signals(model, selCmpts['three']);
      assert.includeDeepMembers(threeSg, [
        {
          "name": "three_x",
          "value": [],
          "on": [
            {
              "events": parseSelector('mousedown', 'scope')[0],
              "update": "invert(\"x\", [x(unit), x(unit)])"
            },
            {
              "events": parseSelector('[mousedown, mouseup] > mousemove', 'scope')[0],
              "update": "[three_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
            },
            {
              "events": parseSelector('keydown', 'scope')[0],
              "update": "invert(\"x\", [x(unit), x(unit)])"
            },
            {
              "events": parseSelector('[keydown, keyup] > keypress', 'scope')[0],
              "update": "[three_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
            }
          ]
        },
        {
          "name": "three_y",
          "value": [],
          "on": [
            {
              "events": parseSelector('mousedown', 'scope')[0],
              "update": "invert(\"y\", [y(unit), y(unit)])"
            },
            {
              "events": parseSelector('[mousedown, mouseup] > mousemove', 'scope')[0],
              "update": "[three_y[0], invert(\"y\", clamp(y(unit), 0, height))]"
            },
            {
              "events": parseSelector('keydown', 'scope')[0],
              "update": "invert(\"y\", [y(unit), y(unit)])"
            },
            {
              "events": parseSelector('[keydown, keyup] > keypress', 'scope')[0],
              "update": "[three_y[0], invert(\"y\", clamp(y(unit), 0, height))]"
            }
          ]
        }
      ]);
    });

    it('builds size signals', function() {
      const oneSg = interval.signals(model, selCmpts['one']);
      assert.includeDeepMembers(oneSg, [{
        "name": "one_size",
        "value": [],
        "on": [
          {
            "events": parseSelector('mousedown', 'scope')[0],
            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
          },
          {
            "events": parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
            "update": "{x: one_size.x, y: one_size.y, width: abs(x(unit) - one_size.x), height: abs(y(unit) - one_size.y)}"
          }
        ]
      }]);

      // Skip twoSg because bindScales should remove the size.

      const threeSg = interval.signals(model, selCmpts['three']);
      assert.includeDeepMembers(threeSg, [{
        "name": "three_size",
        "value": [],
        "on": [
          {
            "events": parseSelector('mousedown', 'scope')[0],
            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
          },
          {
            "events": parseSelector('[mousedown, mouseup] > mousemove', 'scope')[0],
            "update": "{x: three_size.x, y: three_size.y, width: abs(x(unit) - three_size.x), height: abs(y(unit) - three_size.y)}"
          },
          {
            "events": parseSelector('keydown', 'scope')[0],
            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
          },
          {
            "events": parseSelector('[keydown, keyup] > keypress', 'scope')[0],
            "update": "{x: three_size.x, y: three_size.y, width: abs(x(unit) - three_size.x), height: abs(y(unit) - three_size.y)}"
          }
        ]
      }]);
    });

    it('builds trigger signals', function() {
      const oneSg = interval.signals(model, selCmpts['one']);
      assert.includeDeepMembers(oneSg, [
        {
          "name": "one",
          "update": "[{field: \"Horsepower\", extent: one_x}]"
        }
      ]);

      const twoSg = interval.signals(model, selCmpts['two']);
      assert.includeDeepMembers(twoSg, [
        {
          "name": "two",
          "update": "[{field: \"Miles_per_Gallon\", extent: two_y}]"
        }
      ]);

      const threeSg = interval.signals(model, selCmpts['three']);
      assert.includeDeepMembers(threeSg, [
        {
          "name": "three",
          "update": "[{field: \"Horsepower\", extent: three_x}, {field: \"Miles_per_Gallon\", extent: three_y}]"
        }
      ]);
    });
  });

  it('builds tuple signals', function() {
    const oneExpr = interval.tupleExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'intervals: one');

    const twoExpr = interval.tupleExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'intervals: two');

    const threeExpr = interval.tupleExpr(model, selCmpts['three']);
    assert.equal(threeExpr, 'intervals: three');

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
      },
      {
        "name": "three_tuple",
        "on": [
          {
            "events": {"signal": "three"},
            "update": `{unit: unit.datum && unit.datum._id, ${threeExpr}}`
          }
        ]
      }
    ]);
  });

  it('builds modify signals', function() {
    const oneExpr = interval.modifyExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'one_tuple, {unit: one_tuple.unit}');

    const twoExpr = interval.modifyExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'two_tuple, {unit: two_tuple.unit}');

    const threeExpr = interval.modifyExpr(model, selCmpts['three']);
    assert.equal(threeExpr, 'three_tuple, {unit: three_tuple.unit}');

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
      },
      {
        "name": "three_modify",
        "on": [
          {
            "events": {"signal": "three"},
            "update": `modify(\"three_store\", ${threeExpr})`
          }
        ]
      }
    ]);
  });

  it('builds brush mark', function() {
    const marks: any[] = [{hello: "world"}];
    assert.sameDeepMembers(interval.marks(model, selCmpts['one'], marks), [
      {
        "name": undefined,
        "type": "rect",
        "encode": {
          "enter": {"fill": {"value": "#eee"}},
          "update": {
            "x": {
              "scale": "x",
              "signal": "one[0].extent[0]"
            },
            "x2": {
              "scale": "x",
              "signal": "one[0].extent[1]"
            },
            "y": {"value": 0},
            "y2": {"field": {"group": "height"}}
          }
        }
      },
      {"hello": "world"},
      {
        "name": "one_brush",
        "type": "rect",
        "encode": {
          "enter": {"fill": {"value": "transparent"}},
          "update": {
            "x": {
              "scale": "x",
              "signal": "one[0].extent[0]"
            },
            "x2": {
              "scale": "x",
              "signal": "one[0].extent[1]"
            },
            "y": {"value": 0},
            "y2": {"field": {"group": "height"}}
          }
        }
      }
    ]);

    // Scale-bound interval selections should not add a brush mark.
    assert.sameDeepMembers(interval.marks(model, selCmpts['two'], marks), marks);

    assert.sameDeepMembers(interval.marks(model, selCmpts['three'], marks), [
      {
        "name": undefined,
        "type": "rect",
        "encode": {
          "enter": {"fill": {"value": "#eee"}},
          "update": {
            "x": {
              "scale": "x",
              "signal": "three[0].extent[0]"
            },
            "x2": {
              "scale": "x",
              "signal": "three[0].extent[1]"
            },
            "y": {
              "scale": "y",
              "signal": "three[1].extent[0]"
            },
            "y2": {
              "scale": "y",
              "signal": "three[1].extent[1]"
            }
          }
        }
      },
      {"hello": "world"},
      {
        "name": "three_brush",
        "type": "rect",
        "encode": {
          "enter": {"fill": {"value": "transparent"}},
          "update": {
            "x": {
              "scale": "x",
              "signal": "three[0].extent[0]"
            },
            "x2": {
              "scale": "x",
              "signal": "three[0].extent[1]"
            },
            "y": {
              "scale": "y",
              "signal": "three[1].extent[0]"
            },
            "y2": {
              "scale": "y",
              "signal": "three[1].extent[1]"
            }
          }
        }
      }
    ]);
  });
});
