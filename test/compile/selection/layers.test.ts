/* tslint:disable quotemark */

import {assert} from 'chai';
import multi from '../../../src/compile/selection/multi';
import * as selection from '../../../src/compile/selection/selection';
import {parseLayerModel} from '../../util';

describe('Layered Selections', function() {
  const layers = parseLayerModel({
    layer: [{
      "selection": {
        "brush": {"type": "interval"}
      },
      "mark": "circle",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles_per_Gallon","type": "quantitative"},
        "color": {"field": "Origin", "type": "N"}
      }
    }, {
      "selection": {
        "grid": {"type": "interval", "bind": "scales"}
      },
      "mark": "square",
      "encoding": {
        "x": {"field": "Horsepower","type": "quantitative"},
        "y": {"field": "Miles_per_Gallon","type": "quantitative"},
        "color": {"field": "Origin", "type": "N"}
      }
    }]
  });

  layers.parseScale();
  layers.parseSelection();
  layers.parseMark();

  // Selections should augment layered marks together, rather than each
  // mark individually. This ensures correct interleaving of brush and
  // clipping marks (e.g., that the brush mark appears above all layers
  // and thus can be moved around).
  it('should pass through unit mark assembly', function () {
    assert.sameDeepMembers(layers.children[0].assembleMarks(), [{
      "name": "layer_0_marks",
      "type": "symbol",
      "role": "circle",
      "from": {
        "data": "layer_0_main"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "field": "Horsepower"
          },
          "y": {
            "scale": "y",
            "field": "Miles_per_Gallon"
          },
          "fill": {
            "scale": "color",
            "field": "Origin"
          },
          "shape": {
            "value": "circle"
          },
          "opacity": {
            "value": 0.7
          }
        }
      }
    }]);

    assert.sameDeepMembers(layers.children[1].assembleMarks(), [{
      "name": "layer_1_marks",
      "type": "symbol",
      "role": "square",
      "from": {
        "data": "layer_1_main"
      },
      "encode": {
        "update": {
          "x": {
            "scale": "x",
            "field": "Horsepower"
          },
          "y": {
            "scale": "y",
            "field": "Miles_per_Gallon"
          },
          "fill": {
            "scale": "color",
            "field": "Origin"
          },
          "shape": {
            "value": "square"
          },
          "opacity": {
            "value": 0.7
          }
        }
      }
    }]);
  });

  it('should assemble selection marks across layers', function() {
    const child0 = layers.children[0].assembleMarks()[0],
          child1 = layers.children[1].assembleMarks()[0];

    assert.sameDeepMembers(layers.assembleMarks(), [
      // Background brush mark for "brush" selection.
      {
        "name": undefined,
        "type": "rect",
        "clip": true,
        "encode": {
          "enter": {
            "fill": {"value": "#333"},
            "fillOpacity": {"value": 0.125},
            "stroke": undefined
          },
          "update": {
            "x": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "x",
                "signal": "brush[0].extent[0]"
              },
              {
                "value": 0
              }
            ],
            "x2": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "x",
                "signal": "brush[0].extent[1]"
              },
              {
                "value": 0
              }
            ],
            "y": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "y",
                "signal": "brush[1].extent[0]"
              },
              {
                "value": 0
              }
            ],
            "y2": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "y",
                "signal": "brush[1].extent[1]"
              },
              {
                "value": 0
              }
            ]
          }
        }
      },
      // Layer marks
      {...child0, clip: true}, {...child1, clip: true},
      // Foreground brush mark for "brush" selection.
      {
        "name": "brush_brush",
        "type": "rect",
        "clip": true,
        "encode": {
          "enter": {
            "fill": {"value": "transparent"},
            "fillOpacity": undefined,
            "stroke": {"value": "white"}
          },
          "update": {
            "x": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "x",
                "signal": "brush[0].extent[0]"
              },
              {
                "value": 0
              }
            ],
            "x2": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "x",
                "signal": "brush[0].extent[1]"
              },
              {
                "value": 0
              }
            ],
            "y": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "y",
                "signal": "brush[1].extent[0]"
              },
              {
                "value": 0
              }
            ],
            "y2": [
              {
                "test": "data(\"brush_store\").length && brush_tuple && brush_tuple.unit === data(\"brush_store\")[0].unit",
                "scale": "y",
                "signal": "brush[1].extent[1]"
              },
              {
                "value": 0
              }
            ]
          }
        }
      }
    ]);
  });
});
