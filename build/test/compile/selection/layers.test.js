/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        chai_1.assert.sameDeepMembers(layers.assembleMarks(), [{
                // Clipping mark introduced by "grid" selection.
                "type": "group",
                "encode": {
                    "enter": {
                        "width": {
                            "field": {
                                "group": "width"
                            }
                        },
                        "height": {
                            "field": {
                                "group": "height"
                            }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2xheWVycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUc1QixtQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLElBQU0sTUFBTSxHQUFHLHNCQUFlLENBQUM7UUFDN0IsS0FBSyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFO29CQUNYLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7aUJBQzlCO2dCQUNELE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDO2lCQUMxQzthQUNGLEVBQUU7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQztpQkFDL0M7Z0JBQ0QsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7aUJBQzFDO2FBQ0YsQ0FBQztLQUNILENB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