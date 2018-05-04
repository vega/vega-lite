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
                        "fill": { "value": "transparent" }
                    },
                    "update": {
                        "stroke": [
                            {
                                "test": "brush_x[0] !== brush_x[1] && brush_y[0] !== brush_y[1]",
                                "value": "white"
                            },
                            { "value": null }
                        ],
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5ZXJzLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvc2VsZWN0aW9uL2xheWVycy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7Ozs7Ozs7Ozs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUV0RSxtQ0FBMkM7QUFFM0MsUUFBUSxDQUFDLG9CQUFvQixFQUFFO0lBQzdCLElBQU0sTUFBTSxHQUFHLHNCQUFlLENBQUM7UUFDN0IsS0FBSyxFQUFFLENBQUM7Z0JBQ04sV0FBVyxFQUFFO29CQUNYLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUM7aUJBQzlCO2dCQUNELE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztvQkFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO2lCQUNoRDthQUNGLEVBQUU7Z0JBQ0QsV0FBVyxFQUFFO29CQUNYLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQztpQkFDL0M7Z0JBQ0QsTUFBTSxFQUFFLFFBQVE7Z0JBQ2hCLFVBQVUsRUFBRTtvQkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7b0JBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO29CQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7aUJB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RSx3REFBd0Q7Z0NBQ2hFLE9BQU8sRUFBRSxPQUFPOzZCQUNqQjs0QkFDRCxFQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUM7eUJBQ2hCO3dCQUNELEdBQUcsRUFBRTs0QkFDSDtnQ0FDRSxNQUFNLEVBQUUsK0VBQStFO2dDQUN2RixRQUFRLEVBQUUsWUFBWTs2QkFDdkI7NEJBQ0Q7Z0NBQ0UsT0FBTyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7d0JBQ0QsR0FBRyxFQUFFOzRCQUNIO2dDQUNFLE1BQU0sRUFBRSwrRUFBK0U7Z0NBQ3ZGLFFBQVEsRUFBRSxZQUFZOzZCQUN2Qjs0QkFDRDtnQ0FDRSxPQUFPLEVBQUUsQ0FBQzs2QkFDWDt5QkFDRjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0o7Z0NBQ0UsTUFBTSxFQUFFLCtFQUErRTtnQ0FDdkYsUUFBUSxFQUFFLFlBQVk7NkJBQ3ZCOzRCQUNEO2dDQUNFLE9BQU8sRUFBRSxDQUFDOzZCQUNYO3lCQUNGO3dCQUNELElBQUksRUFBRTs0QkFDSjtnQ0FDRSxNQUFNLEVBQUUsK0VBQStFO2dDQUN2RixRQUFRLEVBQUUsWUFBWTs2QkFDdkI7NEJBQ0Q7Z0NBQ0UsT0FBTyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3VuaXQnO1xuaW1wb3J0IHtwYXJzZUxheWVyTW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTGF5ZXJlZCBTZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IGxheWVycyA9IHBhcnNlTGF5ZXJNb2RlbCh7XG4gICAgbGF5ZXI6IFt7XG4gICAgICBcInNlbGVjdGlvblwiOiB7XG4gICAgICAgIFwiYnJ1c2hcIjoge1widHlwZVwiOiBcImludGVydmFsXCJ9XG4gICAgICB9LFxuICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXNfcGVyX0dhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgICB9XG4gICAgfSwge1xuICAgICAgXCJzZWxlY3Rpb25cIjoge1xuICAgICAgICBcImdyaWRcIjoge1widHlwZVwiOiBcImludGVydmFsXCIsIFwiYmluZFwiOiBcInNjYWxlc1wifVxuICAgICAgfSxcbiAgICAgIFwibWFya1wiOiBcInNxdWFyZVwiLFxuICAgICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgICAgfVxuICAgIH1dXG4gIH0pO1xuXG4gIGxheWVycy5wYXJzZSgpO1xuXG4gIGl0KCdzaG91bGQgYXBwcm9wcmlhdGVseSBuYW1lIHRoZSB1bml0JywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgdW5pdCA9IGxheWVycy5jaGlsZHJlblswXSBhcyBVbml0TW9kZWw7XG4gICAgYXNzZXJ0LmVxdWFsKHNlbGVjdGlvbi51bml0TmFtZSh1bml0KSwgJ1wibGF5ZXJfMFwiJyk7XG4gIH0pO1xuXG4gIC8vIFNlbGVjdGlvbnMgc2hvdWxkIGF1Z21lbnQgbGF5ZXJlZCBtYXJrcyB0b2dldGhlciwgcmF0aGVyIHRoYW4gZWFjaFxuICAvLyBtYXJrIGluZGl2aWR1YWxseS4gVGhpcyBlbnN1cmVzIGNvcnJlY3QgaW50ZXJsZWF2aW5nIG9mIGJydXNoIG1hcmtzXG4gIC8vIChpLmUuLCB0aGF0IHRoZSBicnVzaCBtYXJrIGFwcGVhcnMgYWJvdmUgYWxsIGxheWVycyBhbmQgdGh1cyBjYW4gYmVcbiAgLy8gbW92ZWQgYXJvdW5kKS5cbiAgaXQoJ3Nob3VsZCBwYXNzIHRocm91Z2ggdW5pdCBtYXJrIGFzc2VtYmx5JywgZnVuY3Rpb24oKSB7XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhsYXllcnMuY2hpbGRyZW5bMF0uYXNzZW1ibGVNYXJrcygpLCBbe1xuICAgICAgXCJuYW1lXCI6IFwibGF5ZXJfMF9tYXJrc1wiLFxuICAgICAgXCJ0eXBlXCI6IFwic3ltYm9sXCIsXG4gICAgICBcInN0eWxlXCI6IFtcImNpcmNsZVwiXSxcbiAgICAgIFwiZnJvbVwiOiB7XG4gICAgICAgIFwiZGF0YVwiOiBcImxheWVyXzBfbWFpblwiXG4gICAgICB9LFxuICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJzY2FsZVwiOiBcInhcIixcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJIb3JzZXBvd2VyXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcInNjYWxlXCI6IFwieVwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJmaWxsXCI6IHtcbiAgICAgICAgICAgIFwic2NhbGVcIjogXCJjb2xvclwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIk9yaWdpblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNoYXBlXCI6IHtcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJjaXJjbGVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGFjaXR5XCI6IHtcbiAgICAgICAgICAgIFwidmFsdWVcIjogMC43XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhsYXllcnMuY2hpbGRyZW5bMV0uYXNzZW1ibGVNYXJrcygpLCBbe1xuICAgICAgXCJuYW1lXCI6IFwibGF5ZXJfMV9tYXJrc1wiLFxuICAgICAgXCJ0eXBlXCI6IFwic3ltYm9sXCIsXG4gICAgICBcInN0eWxlXCI6IFtcInNxdWFyZVwiXSxcbiAgICAgIFwiZnJvbVwiOiB7XG4gICAgICAgIFwiZGF0YVwiOiBcImxheWVyXzFfbWFpblwiXG4gICAgICB9LFxuICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgXCJzY2FsZVwiOiBcInhcIixcbiAgICAgICAgICAgIFwiZmllbGRcIjogXCJIb3JzZXBvd2VyXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICBcInNjYWxlXCI6IFwieVwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIk1pbGVzX3Blcl9HYWxsb25cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJmaWxsXCI6IHtcbiAgICAgICAgICAgIFwic2NhbGVcIjogXCJjb2xvclwiLFxuICAgICAgICAgICAgXCJmaWVsZFwiOiBcIk9yaWdpblwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInNoYXBlXCI6IHtcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJzcXVhcmVcIlxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJvcGFjaXR5XCI6IHtcbiAgICAgICAgICAgIFwidmFsdWVcIjogMC43XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGFzc2VtYmxlIHNlbGVjdGlvbiBtYXJrcyBhY3Jvc3MgbGF5ZXJzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY2hpbGQwID0gbGF5ZXJzLmNoaWxkcmVuWzBdLmFzc2VtYmxlTWFya3MoKVswXTtcbiAgICBjb25zdCBjaGlsZDEgPSBsYXllcnMuY2hpbGRyZW5bMV0uYXNzZW1ibGVNYXJrcygpWzBdO1xuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhsYXllcnMuYXNzZW1ibGVNYXJrcygpLCBbXG4gICAgICAvLyBCYWNrZ3JvdW5kIGJydXNoIG1hcmsgZm9yIFwiYnJ1c2hcIiBzZWxlY3Rpb24uXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcImJydXNoX2JydXNoX2JnXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInJlY3RcIixcbiAgICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgICBcImVudGVyXCI6IHtcbiAgICAgICAgICAgIFwiZmlsbFwiOiB7XCJ2YWx1ZVwiOiBcIiMzMzNcIn0sXG4gICAgICAgICAgICBcImZpbGxPcGFjaXR5XCI6IHtcInZhbHVlXCI6IDAuMTI1fVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcImJydXNoX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcImJydXNoX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcImxheWVyXzBcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJicnVzaF94WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcImJydXNoX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcImJydXNoX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcImxheWVyXzBcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJicnVzaF95WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ4MlwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJsYXllcl8wXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwiYnJ1c2hfeFsxXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieTJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwibGF5ZXJfMFxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcImJydXNoX3lbMV1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyBMYXllciBtYXJrc1xuICAgICAgey4uLmNoaWxkMCwgY2xpcDogdHJ1ZX0sIHsuLi5jaGlsZDEsIGNsaXA6IHRydWV9LFxuICAgICAgLy8gRm9yZWdyb3VuZCBicnVzaCBtYXJrIGZvciBcImJydXNoXCIgc2VsZWN0aW9uLlxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJicnVzaF9icnVzaFwiLFxuICAgICAgICBcInR5cGVcIjogXCJyZWN0XCIsXG4gICAgICAgIFwiY2xpcFwiOiB0cnVlLFxuICAgICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgICAgXCJlbnRlclwiOiB7XG4gICAgICAgICAgICBcImZpbGxcIjoge1widmFsdWVcIjogXCJ0cmFuc3BhcmVudFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJzdHJva2VcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiYnJ1c2hfeFswXSAhPT0gYnJ1c2hfeFsxXSAmJiBicnVzaF95WzBdICE9PSBicnVzaF95WzFdXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIndoaXRlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1widmFsdWVcIjogbnVsbH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInhcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwibGF5ZXJfMFxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcImJydXNoX3hbMF1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInlcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwiYnJ1c2hfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwibGF5ZXJfMFxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcImJydXNoX3lbMF1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIngyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcImJydXNoX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcImJydXNoX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcImxheWVyXzBcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJicnVzaF94WzFdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5MlwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJicnVzaF9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJsYXllcl8wXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwiYnJ1c2hfeVsxXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0pO1xuICB9KTtcbn0pO1xuIl19