"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var util_1 = require("../../util");
describe('Layered Selections', function () {
    var layers = util_1.parseLayerModel({
        layer: [{
                "selection": {
                    "brush": { "type": "interval" }
                },
                "mark": "circle",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
                    "color": { "field": "Origin", "type": "N" }
                }
            }, {
                "selection": {
                    "grid": { "type": "interval", "bind": "scales" }
                },
                "mark": "square",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
                    "color": { "field": "Origin", "type": "N" }
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
        chai_1.assert.sameDeepMembers(layers.children[0].assembleMarks(), [{
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
        chai_1.assert.sameDeepMembers(layers.children[1].assembleMarks(), [{
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
    it('should assemble selection marks across layers', function () {
        var child0 = layers.children[0].assembleMarks()[0], child1 = layers.children[1].assembleMarks()[0];
        chai_1.assert.sameDeepMembers(layers.assembleMarks(), [
            // Background brush mark for "brush" selection.
            {
                "type": "rect",
                "clip": true,
                "encode": {
                    "enter": {
                        "fill": { "value": "#333" },
                        "fillOpacity": { "value": 0.125 }
                    },
                    "update": {
                        "x": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_x[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_y[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "x2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_x[1]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_y[1]"
                            },
                            {
                                "value": 0
                            }
                        ]
                    }
                }
            },
            tslib_1.__assign({}, child0, { clip: true }),
            tslib_1.__assign({}, child1, { clip: true }),
            // Foreground brush mark for "brush" selection.
            {
                "name": "brush_brush",
                "type": "rect",
                "clip": true,
                "encode": {
                    "enter": {
                        "fill": { "value": "transparent" },
                        "stroke": { "value": "white" }
                    },
                    "update": {
                        "x": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_x[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_y[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "x2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_x[1]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0_\"",
                                "signal": "brush_y[1]"
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2xheWVycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFHNUIsbUNBQTJDO0FBRTNDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixJQUFNLE1BQU0sR0FBRyxzQkFBZSxDQUFDO1FBQzdCLEtBQUssRUFBRSxDQUFDO2dCQUNOLFdBQVcsRUFBRTtvQkFDWCxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDO2lCQUM5QjtnQkFDRCxNQUFNLEVBQUUsUUFBUTtnQkFDaEIsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ3pELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztpQkFDMUM7YUFDRixFQUFFO2dCQUNELFdBQVcsRUFBRTtvQkFDWCxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUM7aUJBQy9DO2dCQUNELE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO2lCQUMxQzthQUNGLENBQUM7S0FDSCxD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