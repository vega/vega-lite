"use strict";
/* tslint:disable quotemark */
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
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
                    "color": { "field": "Origin", "type": "nominal" }
                }
            }, {
                "selection": {
                    "grid": { "type": "interval", "bind": "scales" }
                },
                "mark": "square",
                "encoding": {
                    "x": { "field": "Horsepower", "type": "quantitative" },
                    "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
                    "color": { "field": "Origin", "type": "nominal" }
                }
            }]
    });
    layers.parse();
    it('should appropriately name the unit', function () {
        var unit = layers.children[0];
        chai_1.assert.equal(selection.unitName(unit), '"layer_0"');
    });
    // Selections should augment layered marks together, rather than each
    // mark individually. This ensures correct interleaving of brush marks
    // (i.e., that the brush mark appears above all layers and thus can be
    // moved around).
    it('should pass through unit mark assembly', function () {
        chai_1.assert.sameDeepMembers(layers.children[0].assembleMarks(), [{
                "name": "layer_0_marks",
                "type": "symbol",
                "style": ["circle"],
                "from": {
                    "data": "layer_0_main"
                },
                "clip": true,
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
                "style": ["square"],
                "from": {
                    "data": "layer_1_main"
                },
                "clip": true,
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
        var child0 = layers.children[0].assembleMarks()[0];
        var child1 = layers.children[1].assembleMarks()[0];
        chai_1.assert.sameDeepMembers(layers.assembleMarks(), [
            // Background brush mark for "brush" selection.
            {
                "name": "brush_brush_bg",
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
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_x[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_y[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "x2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_x[1]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_y[1]"
                            },
                            {
                                "value": 0
                            }
                        ]
                    }
                }
            },
            __assign({}, child0, { clip: true }),
            __assign({}, child1, { clip: true }),
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
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_x[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_y[0]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "x2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
                                "signal": "brush_x[1]"
                            },
                            {
                                "value": 0
                            }
                        ],
                        "y2": [
                            {
                                "test": "data(\"brush_store\").length && data(\"brush_store\")[0].unit === \"layer_0\"",
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2xheWVycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7Ozs7Ozs7Ozs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUV0RSxtQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLElBQU0sTUFBTSxHQUFHLHNCQUFlLENBQUM7UUFDN0IsS0FBSyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFO29CQUNYLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7aUJBQzlCO2dCQUNELE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2lCQUNoRDthQUNGLEVBQUU7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQztpQkFDL0M7Z0JBQ0QsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJB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LEVBQUU7d0JBQ1IsR0FBRyxFQUFFOzRCQUNIO2dDQUNFLE1BQU0sRUFBRSwrRUFBK0U7Z0NBQ3ZGLFFBQVEsRUFBRSxZQUFZOzZCQUN2Qjs0QkFDRDtnQ0FDRSxPQUFPLEVBQUUsQ0FBQzs2QkFDWDt5QkFDRjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0g7Z0NBQ0UsTUFBTSxFQUFFLCtFQUErRTtnQ0FDdkYsUUFBUSxFQUFFLFlBQVk7NkJBQ3ZCOzRCQUNEO2dDQUNFLE9BQU8sRUFBRSxDQUFDOzZCQUNYO3lCQUNGO3dCQUNELElBQUksRUFBRTs0QkFDSjtnQ0FDRSxNQUFNLEVBQUUsK0VBQStFO2dDQUN2RixRQUFRLEVBQUUsWUFBWTs2QkFDdkI7NEJBQ0Q7Z0NBQ0UsT0FBTyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKO2dDQUNFLE1BQU0sRUFBRSwrRUFBK0U7Z0NBQ3ZGLFFBQVEsRUFBRSxZQUFZOzZCQUN2Qjs0QkFDRDtnQ0FDRSxPQUFPLEVBQUUsQ0FBQzs2QkFDWDt5QkFDRjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvdW5pdCc7XG5pbXBvcnQge3BhcnNlTGF5ZXJNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdMYXllcmVkIFNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbGF5ZXJzID0gcGFyc2VMYXllck1vZGVsKHtcbiAgICBsYXllcjogW3tcbiAgICAgIFwic2VsZWN0aW9uXCI6IHtcbiAgICAgICAgXCJicnVzaFwiOiB7XCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIn1cbiAgICAgIH0sXG4gICAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlc19wZXJfR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBcInNlbGVjdGlvblwiOiB7XG4gICAgICAgIFwiZ3JpZFwiOiB7XCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIiwgXCJiaW5kXCI6IFwic2NhbGVzXCJ9XG4gICAgICB9LFxuICAgICAgXCJtYXJrXCI6IFwic3F1YXJlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICB9XG4gICAgfV1cbiAgfSk7XG5cbiAgbGF5ZXJzLnBhcnNlKCk7XG5cbiAgaXQoJ3Nob3VsZCBhcHByb3ByaWF0ZWx5IG5hbWUgdGhlIHVuaXQnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCB1bml0ID0gbGF5ZXJzLmNoaWxkcmVuWzBdIGFzIFVuaXRNb2RlbDtcbiAgICBhc3NlcnQuZXF1YWwoc2VsZWN0aW9uLnVuaXROYW1lKHVuaXQpLCAnXCJsYXllcl8wXCInKTtcbiAgfSk7XG5cbiAgLy8gU2VsZWN0aW9ucyBzaG91bGQgYXVnbWVudCBsYXllcmVkIG1hcmtzIHRvZ2V0aGVyLCByYXRoZXIgdGhhbiBlYWNoXG4gIC8vIG1hcmsgaW5kaXZpZHVhbGx5LiBUaGlzIGVuc3VyZXMgY29ycmVjdCBpbnRlcmxlYXZpbmcgb2YgYnJ1c2ggbWFya3NcbiAgLy8gKGkuZS4sIHRoYXQgdGhlIGJydXNoIG1hcmsgYXBwZWFycyBhYm92ZSBhbGwgbGF5ZXJzIGFuZCB0aHVzIGNhbiBiZVxuICAvLyBtb3ZlZCBhcm91bmQpLlxuICBpdCgnc2hvdWxkIHBhc3MgdGhyb3VnaCB1bml0IG1hcmsgYXNzZW1ibHknLCBmdW5jdGlvbigpIHtcbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKGxheWVycy5jaGlsZHJlblswXS5hc3NlbWJsZU1hcmtzKCksIFt7XG4gICAgICBcIm5hbWVcIjogXCJsYXllcl8wX21hcmtzXCIsXG4gICAgICBcInR5cGVcIjogXCJzeW1ib2xcIixcbiAgICAgIFwic3R5bGVcIjogW1wiY2lyY2xlXCJdLFxuICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgXCJkYXRhXCI6IFwibGF5ZXJfMF9tYWluXCJcbiAgICAgIH0sXG4gICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcInNjYWxlXCI6IFwieFwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwic2NhbGVcIjogXCJ5XCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImZpbGxcIjoge1xuICAgICAgICAgICAgXCJzY2FsZVwiOiBcImNvbG9yXCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiT3JpZ2luXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hhcGVcIjoge1xuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcImNpcmNsZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wYWNpdHlcIjoge1xuICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwLjdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKGxheWVycy5jaGlsZHJlblsxXS5hc3NlbWJsZU1hcmtzKCksIFt7XG4gICAgICBcIm5hbWVcIjogXCJsYXllcl8xX21hcmtzXCIsXG4gICAgICBcInR5cGVcIjogXCJzeW1ib2xcIixcbiAgICAgIFwic3R5bGVcIjogW1wic3F1YXJlXCJdLFxuICAgICAgXCJmcm9tXCI6IHtcbiAgICAgICAgXCJkYXRhXCI6IFwibGF5ZXJfMV9tYWluXCJcbiAgICAgIH0sXG4gICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICBcInNjYWxlXCI6IFwieFwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgIFwic2NhbGVcIjogXCJ5XCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcImZpbGxcIjoge1xuICAgICAgICAgICAgXCJzY2FsZVwiOiBcImNvbG9yXCIsXG4gICAgICAgICAgICBcImZpZWxkXCI6IFwiT3JpZ2luXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwic2hhcGVcIjoge1xuICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcInNxdWFyZVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wYWNpdHlcIjoge1xuICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwLjdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgYXNzZW1ibGUgc2VsZWN0aW9uIG1hcmtzIGFjcm9zcyBsYXllcnMnLCBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjaGlsZDAgPSBsYXllcnMuY2hpbGRyZW5bMF0uYXNzZW1ibGVNYXJrcygpWzBdO1xuICAgIGNvbnN0IGNoaWxkMSA9IGxheWVycy5jaGlsZHJlblsxXS5hc3NlbWJsZU1hcmtzKClbMF07XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKGxheWVycy5hc3NlbWJsZU1hcmtzKCksIFtcbiAgICAgIC8vIEJhY2tncm91bmQgYnJ1c2ggbWFyayBmb3IgXCJicnVzaFwiIHNlbGVjdGlvbi5cbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwiYnJ1c2hfYnJ1c2hfYmdcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwicmVjdFwiLFxuICAgICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgICAgXCJlbmNvZGVcIjoge1xuICAgICAgICAgIFwiZW50ZXJcIjoge1xuICAgICAgICAgICAgXCJmaWxsXCI6IHtcInZhbHVlXCI6IFwiIzMzM1wifSxcbiAgICAgICAgICAgIFwiZmlsbE9wYWNpdHlcIjoge1widmFsdWVcIjogMC4xMjV9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcInhcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwibGF5ZXJfMFxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcImJydXNoX3hbMF1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInlcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwibGF5ZXJfMFxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcImJydXNoX3lbMF1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIngyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcImJydXNoX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcImJydXNoX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcImxheWVyXzBcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJicnVzaF94WzFdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5MlwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJsYXllcl8wXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwiYnJ1c2hfeVsxXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIExheWVyIG1hcmtzXG4gICAgICB7Li4uY2hpbGQwLCBjbGlwOiB0cnVlfSwgey4uLmNoaWxkMSwgY2xpcDogdHJ1ZX0sXG4gICAgICAvLyBGb3JlZ3JvdW5kIGJydXNoIG1hcmsgZm9yIFwiYnJ1c2hcIiBzZWxlY3Rpb24uXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImJydXNoX2JydXNoXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInJlY3RcIixcbiAgICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgICBcImVudGVyXCI6IHtcbiAgICAgICAgICAgIFwiZmlsbFwiOiB7XCJ2YWx1ZVwiOiBcInRyYW5zcGFyZW50XCJ9LFxuICAgICAgICAgICAgXCJzdHJva2VcIjoge1widmFsdWVcIjogXCJ3aGl0ZVwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcImJydXNoX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcImJydXNoX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcImxheWVyXzBcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJicnVzaF94WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcImJydXNoX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcImJydXNoX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcImxheWVyXzBcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJicnVzaF95WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ4MlwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJsYXllcl8wXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwiYnJ1c2hfeFsxXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieTJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwibGF5ZXJfMFxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcImJydXNoX3lbMV1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG59KTtcbiJdfQ==