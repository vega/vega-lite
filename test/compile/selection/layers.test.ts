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
  it('should pass through unit mark assembly', function() {
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

    assert.sameDeepMembers(layers.assembleMarks(), [{
      // Clipping mark introduced by "grid" selection.
      "type": "group",
      "encode": {
        "enter": {
          "width": {
            "signal": "width"
          },
          "height": {
            "signal": "height"
          },
          "fill": {
            "value": "transparent"
          },
          "clip": {
            "value": true
          }
        }
      },
      "marks": [
        // Background brush mark for "brush" selection.
        {
          "name": undefined,
          "type": "rect",
          "encode": {
            "enter": {
              "fill": {
                "value": "#eee"
              }
            },
            "update": {
              "x": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "x",
                  "signal": "layer_0_brush[0].extent[0]"
                },
                {
                  "value": 0
                }
              ],
              "x2": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "x",
                  "signal": "layer_0_brush[0].extent[1]"
                },
                {
                  "value": 0
                }
              ],
              "y": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "y",
                  "signal": "layer_0_brush[1].extent[0]"
                },
                {
                  "value": 0
                }
              ],
              "y2": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "y",
                  "signal": "layer_0_brush[1].extent[1]"
                },
                {
                  "value": 0
                }
              ]
            }
          }
        },
        // Layer marks
        child0, child1,
        // Foreground brush mark for "brush" selection.
        {
          "name": "layer_0_brush_brush",
          "type": "rect",
          "encode": {
            "enter": {
              "fill": {
                "value": "transparent"
              }
            },
            "update": {
              "x": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "x",
                  "signal": "layer_0_brush[0].extent[0]"
                },
                {
                  "value": 0
                }
              ],
              "x2": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "x",
                  "signal": "layer_0_brush[0].extent[1]"
                },
                {
                  "value": 0
                }
              ],
              "y": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "y",
                  "signal": "layer_0_brush[1].extent[0]"
                },
                {
                  "value": 0
                }
              ],
              "y2": [
                {
                  "test": "data(\"layer_0_brush_store\").length && layer_0_brush_tuple && layer_0_brush_tuple.unit === data(\"layer_0_brush_store\")[0].unit",
                  "scale": "y",
                  "signal": "layer_0_brush[1].extent[1]"
                },
                {
                  "value": 0
                }
              ]
            }
          }
        }
      ]
    }]);
  });
});
