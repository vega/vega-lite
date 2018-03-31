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
      "y": {"field": "Miles-per-Gallon","type": "quantitative"},
      "color": {"field": "Origin", "type": "nominal"}
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
    "thr-ee": {
      "type": "interval",
      "on": "[mousedown, mouseup] > mousemove, [keydown, keyup] > keypress",
      "translate": false,
      "zoom": false,
      "resolve": "intersect",
      "mark": {
        "fill": "red",
        "fillOpacity": 0.75,
        "stroke": "black",
        "strokeWidth": 4,
        "strokeDash": [10, 5],
        "strokeDashOffset": 3,
        "strokeOpacity": 0.25
      }
    }
  });

  describe('Tuple Signals', function() {
    it('builds projection signals', function() {
      const oneSg = interval.signals(model, selCmpts['one']);
      assert.includeDeepMembers(oneSg, [{
        "name": "one_x",
        "value": [],
        "on": [
          {
            "events": parseSelector('mousedown', 'scope')[0],
            "update": "[x(unit), x(unit)]"
          },
          {
            "events": parseSelector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
            "update": "[one_x[0], clamp(x(unit), 0, width)]"
          },
          {
            "events": {"signal": "one_scale_trigger"},
            "update": "[scale(\"x\", one_Horsepower[0]), scale(\"x\", one_Horsepower[1])]"
          }
        ]
      }, {
        "name": "one_Horsepower",
        "on": [{
          "events": {"signal": "one_x"},
          "update": "one_x[0] === one_x[1] ? null : invert(\"x\", one_x)"
        }]
      }, {
        "name": "one_scale_trigger",
        "update": "(!isArray(one_Horsepower) || (+invert(\"x\", one_x)[0] === +one_Horsepower[0] && +invert(\"x\", one_x)[1] === +one_Horsepower[1])) ? one_scale_trigger : {}"
      }]);

      const twoSg = interval.signals(model, selCmpts['two']);
      assert.includeDeepMembers(twoSg, [{
        "name": "two_Miles_per_Gallon",
        "on": []
      }]);

      const threeSg = interval.signals(model, selCmpts['thr_ee']);
      assert.includeDeepMembers(threeSg, [
        {
          "name": "thr_ee_x",
          "value": [],
          "on": [
            {
              "events": parseSelector('mousedown', 'scope')[0],
              "update": "[x(unit), x(unit)]"
            },
            {
              "events": parseSelector('[mousedown, mouseup] > mousemove', 'scope')[0],
              "update": "[thr_ee_x[0], clamp(x(unit), 0, width)]"
            },
            {
              "events": parseSelector('keydown', 'scope')[0],
              "update": "[x(unit), x(unit)]"
            },
            {
              "events": parseSelector('[keydown, keyup] > keypress', 'scope')[0],
              "update": "[thr_ee_x[0], clamp(x(unit), 0, width)]"
            },
            {
              "events": {"signal": "thr_ee_scale_trigger"},
              "update": "[scale(\"x\", thr_ee_Horsepower[0]), scale(\"x\", thr_ee_Horsepower[1])]"
            }
          ]
        },
        {
          "name": "thr_ee_Horsepower",
          "on": [{
            "events": {"signal": "thr_ee_x"},
            "update": "thr_ee_x[0] === thr_ee_x[1] ? null : invert(\"x\", thr_ee_x)"
          }]
        },
        {
          "name": "thr_ee_y",
          "value": [],
          "on": [
            {
              "events": parseSelector('mousedown', 'scope')[0],
              "update": "[y(unit), y(unit)]"
            },
            {
              "events": parseSelector('[mousedown, mouseup] > mousemove', 'scope')[0],
              "update": "[thr_ee_y[0], clamp(y(unit), 0, height)]"
            },
            {
              "events": parseSelector('keydown', 'scope')[0],
              "update": "[y(unit), y(unit)]"
            },
            {
              "events": parseSelector('[keydown, keyup] > keypress', 'scope')[0],
              "update": "[thr_ee_y[0], clamp(y(unit), 0, height)]"
            },
            {
              "events": {"signal": "thr_ee_scale_trigger"},
              "update": "[scale(\"y\", thr_ee_Miles_per_Gallon[0]), scale(\"y\", thr_ee_Miles_per_Gallon[1])]"
            }
          ]
        },
        {
          "name": "thr_ee_Miles_per_Gallon",
          "on": [{
            "events": {"signal": "thr_ee_y"},
            "update": "thr_ee_y[0] === thr_ee_y[1] ? null : invert(\"y\", thr_ee_y)"
          }]
        },
        {
          "name": "thr_ee_scale_trigger",
          "update": "(!isArray(thr_ee_Horsepower) || (+invert(\"x\", thr_ee_x)[0] === +thr_ee_Horsepower[0] && +invert(\"x\", thr_ee_x)[1] === +thr_ee_Horsepower[1])) && (!isArray(thr_ee_Miles_per_Gallon) || (+invert(\"y\", thr_ee_y)[0] === +thr_ee_Miles_per_Gallon[0] && +invert(\"y\", thr_ee_y)[1] === +thr_ee_Miles_per_Gallon[1])) ? thr_ee_scale_trigger : {}"
        }
      ]);
    });

    it('builds trigger signals', function() {
      const oneSg = interval.signals(model, selCmpts['one']);
      assert.includeDeepMembers(oneSg, [
        {
          "name": "one_tuple",
          "on": [{
            "events": [{"signal": "one_Horsepower"}],
            "update": "one_Horsepower ? {unit: \"\", intervals: [{encoding: \"x\", field: \"Horsepower\", extent: one_Horsepower}]} : null"
          }]
        }
      ]);

      const twoSg = interval.signals(model, selCmpts['two']);
      assert.includeDeepMembers(twoSg, [
        {
          "name": "two_tuple",
          "on": [{
            "events": [{"signal": "two_Miles_per_Gallon"}],
            "update": "two_Miles_per_Gallon ? {unit: \"\", intervals: [{encoding: \"y\", field: \"Miles-per-Gallon\", extent: two_Miles_per_Gallon}]} : null"
          }]
        }
      ]);

      const threeSg = interval.signals(model, selCmpts['thr_ee']);
      assert.includeDeepMembers(threeSg, [
        {
          "name": "thr_ee_tuple",
          "on": [{
            "events": [{"signal": "thr_ee_Horsepower"}, {"signal": "thr_ee_Miles_per_Gallon"}],
            "update": "thr_ee_Horsepower && thr_ee_Miles_per_Gallon ? {unit: \"\", intervals: [{encoding: \"x\", field: \"Horsepower\", extent: thr_ee_Horsepower}, {encoding: \"y\", field: \"Miles-per-Gallon\", extent: thr_ee_Miles_per_Gallon}]} : null"
          }]
        }
      ]);
    });
  });

  it('builds modify signals', function() {
    const oneExpr = interval.modifyExpr(model, selCmpts['one']);
    assert.equal(oneExpr, 'one_tuple, true');

    const twoExpr = interval.modifyExpr(model, selCmpts['two']);
    assert.equal(twoExpr, 'two_tuple, true');

    const threeExpr = interval.modifyExpr(model, selCmpts['thr_ee']);
    assert.equal(threeExpr, 'thr_ee_tuple, {unit: \"\"}');

    const signals = selection.assembleUnitSelectionSignals(model, []);
    assert.includeDeepMembers(signals, [
      {
        "name": "one_modify",
        "on": [
          {
            "events": {"signal": "one_tuple"},
            "update": `modify(\"one_store\", ${oneExpr})`
          }
        ]
      },
      {
        "name": "two_modify",
        "on": [
          {
            "events": {"signal": "two_tuple"},
            "update": `modify(\"two_store\", ${twoExpr})`
          }
        ]
      },
      {
        "name": "thr_ee_modify",
        "on": [
          {
            "events": {"signal": "thr_ee_tuple"},
            "update": `modify(\"thr_ee_store\", ${threeExpr})`
          }
        ]
      }
    ]);
  });

  it('builds brush mark', function() {
    const marks: any[] = [{hello: "world"}];
    assert.sameDeepMembers(interval.marks(model, selCmpts['one'], marks), [
      {
        "name": "one_brush_bg",
        "type": "rect",
        "clip": true,
        "encode": {
          "enter": {
            "fill": {"value": "#333"},
            "fillOpacity": {"value": 0.125}
          },
          "update": {
            "x": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "signal": "one_x[0]"
              },
              {
                "value": 0
              }
            ],
            "y": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "value": 0
              },
              {
                "value": 0
              }
            ],
            "x2": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "signal": "one_x[1]"
              },
              {
                "value": 0
              }
            ],
            "y2": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "field": {
                  "group": "height"
                }
              },
              {
                "value": 0
              }
            ]
          }
        }
      },
      {"hello": "world"},
      {
        "name": "one_brush",
        "type": "rect",
        "clip": true,
        "encode": {
          "enter": {
            "fill": {"value": "transparent"}
          },
          "update": {
            "stroke": [
              {
                "test": "one_x[0] !== one_x[1]",
                "value": "white"
              },
              {
                "value": null
              }
            ],
            "x": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "signal": "one_x[0]"
              },
              {
                "value": 0
              }
            ],
            "y": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "value": 0
              },
              {
                "value": 0
              }
            ],
            "x2": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "signal": "one_x[1]"
              },
              {
                "value": 0
              }
            ],
            "y2": [
              {
                "test": "data(\"one_store\").length && data(\"one_store\")[0].unit === \"\"",
                "field": {
                  "group": "height"
                }
              },
              {
                "value": 0
              }
            ]
          }
        }
      }
    ]);

    // Scale-bound interval selections should not add a brush mark.
    assert.sameDeepMembers(interval.marks(model, selCmpts['two'], marks), marks);

    assert.sameDeepMembers(interval.marks(model, selCmpts['thr_ee'], marks), [
      {
        "name": "thr_ee_brush_bg",
        "type": "rect",
        "clip": true,
        "encode": {
          "enter": {
            "fill": {"value": "red"},
            "fillOpacity": {"value": 0.75}
          },
          "update": {
            "x": {
              "signal": "thr_ee_x[0]"
            },
            "y": {
              "signal": "thr_ee_y[0]"
            },
            "x2": {
              "signal": "thr_ee_x[1]"
            },
            "y2": {
              "signal": "thr_ee_y[1]"
            }
          }
        }
      },
      {"hello": "world"},
      {
        "name": "thr_ee_brush",
        "type": "rect",
        "clip": true,
        "encode": {
          "enter": {
            "fill": {"value": "transparent"}
          },
          "update": {
            "stroke": [
              {
                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                "value": "black"
              },
              {"value": null}
            ],
            "strokeWidth": [
              {
                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                "value": 4
              },
              {"value": null}
            ],
            "strokeDash": [
              {
                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                "value": [10, 5]
              },
              {"value": null}
            ],
            "strokeDashOffset": [
              {
                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                "value": 3
              },
              {"value": null}
            ],
            "strokeOpacity": [
              {
                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                "value": 0.25
              },
              {"value": null}
            ],
            "x": {
              "signal": "thr_ee_x[0]"
            },
            "y": {
              "signal": "thr_ee_y[0]"
            },
            "x2": {
              "signal": "thr_ee_x[1]"
            },
            "y2": {
              "signal": "thr_ee_y[1]"
            }
          }
        }
      }
    ]);
  });
});
