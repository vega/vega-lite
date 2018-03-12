"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var interval_1 = require("../../../src/compile/selection/interval");
var selection = require("../../../src/compile/selection/selection");
var util_1 = require("../../util");
describe('Interval Selections', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles-per-Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    model.parseScale();
    var selCmpts = model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "interval", "encodings": ["x"], "translate": false, "zoom": false },
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
    describe('Tuple Signals', function () {
        it('builds projection signals', function () {
            var oneSg = interval_1.default.signals(model, selCmpts['one']);
            chai_1.assert.includeDeepMembers(oneSg, [{
                    "name": "one_x",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "[x(unit), x(unit)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
                            "update": "[one_x[0], clamp(x(unit), 0, width)]"
                        },
                        {
                            "events": { "signal": "one_scale_trigger" },
                            "update": "[scale(\"x\", one_Horsepower[0]), scale(\"x\", one_Horsepower[1])]"
                        }
                    ]
                }, {
                    "name": "one_Horsepower",
                    "on": [{
                            "events": { "signal": "one_x" },
                            "update": "one_x[0] === one_x[1] ? null : invert(\"x\", one_x)"
                        }]
                }, {
                    "name": "one_scale_trigger",
                    "update": "(!isArray(one_Horsepower) || (+invert(\"x\", one_x)[0] === +one_Horsepower[0] && +invert(\"x\", one_x)[1] === +one_Horsepower[1])) ? one_scale_trigger : {}"
                }]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [{
                    "name": "two_Miles_per_Gallon",
                    "on": []
                }]);
            var threeSg = interval_1.default.signals(model, selCmpts['thr_ee']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "thr_ee_x",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "[x(unit), x(unit)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[thr_ee_x[0], clamp(x(unit), 0, width)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "[x(unit), x(unit)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[thr_ee_x[0], clamp(x(unit), 0, width)]"
                        },
                        {
                            "events": { "signal": "thr_ee_scale_trigger" },
                            "update": "[scale(\"x\", thr_ee_Horsepower[0]), scale(\"x\", thr_ee_Horsepower[1])]"
                        }
                    ]
                },
                {
                    "name": "thr_ee_Horsepower",
                    "on": [{
                            "events": { "signal": "thr_ee_x" },
                            "update": "thr_ee_x[0] === thr_ee_x[1] ? null : invert(\"x\", thr_ee_x)"
                        }]
                },
                {
                    "name": "thr_ee_y",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "[y(unit), y(unit)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[thr_ee_y[0], clamp(y(unit), 0, height)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "[y(unit), y(unit)]"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[thr_ee_y[0], clamp(y(unit), 0, height)]"
                        },
                        {
                            "events": { "signal": "thr_ee_scale_trigger" },
                            "update": "[scale(\"y\", thr_ee_Miles_per_Gallon[0]), scale(\"y\", thr_ee_Miles_per_Gallon[1])]"
                        }
                    ]
                },
                {
                    "name": "thr_ee_Miles_per_Gallon",
                    "on": [{
                            "events": { "signal": "thr_ee_y" },
                            "update": "thr_ee_y[0] === thr_ee_y[1] ? null : invert(\"y\", thr_ee_y)"
                        }]
                },
                {
                    "name": "thr_ee_scale_trigger",
                    "update": "(!isArray(thr_ee_Horsepower) || (+invert(\"x\", thr_ee_x)[0] === +thr_ee_Horsepower[0] && +invert(\"x\", thr_ee_x)[1] === +thr_ee_Horsepower[1])) && (!isArray(thr_ee_Miles_per_Gallon) || (+invert(\"y\", thr_ee_y)[0] === +thr_ee_Miles_per_Gallon[0] && +invert(\"y\", thr_ee_y)[1] === +thr_ee_Miles_per_Gallon[1])) ? thr_ee_scale_trigger : {}"
                }
            ]);
        });
        it('builds trigger signals', function () {
            var oneSg = interval_1.default.signals(model, selCmpts['one']);
            chai_1.assert.includeDeepMembers(oneSg, [
                {
                    "name": "one_tuple",
                    "on": [{
                            "events": [{ "signal": "one_Horsepower" }],
                            "update": "one_Horsepower ? {unit: \"\", intervals: [{encoding: \"x\", field: \"Horsepower\", extent: one_Horsepower}]} : null"
                        }]
                }
            ]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [
                {
                    "name": "two_tuple",
                    "on": [{
                            "events": [{ "signal": "two_Miles_per_Gallon" }],
                            "update": "two_Miles_per_Gallon ? {unit: \"\", intervals: [{encoding: \"y\", field: \"Miles-per-Gallon\", extent: two_Miles_per_Gallon}]} : null"
                        }]
                }
            ]);
            var threeSg = interval_1.default.signals(model, selCmpts['thr_ee']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "thr_ee_tuple",
                    "on": [{
                            "events": [{ "signal": "thr_ee_Horsepower" }, { "signal": "thr_ee_Miles_per_Gallon" }],
                            "update": "thr_ee_Horsepower && thr_ee_Miles_per_Gallon ? {unit: \"\", intervals: [{encoding: \"x\", field: \"Horsepower\", extent: thr_ee_Horsepower}, {encoding: \"y\", field: \"Miles-per-Gallon\", extent: thr_ee_Miles_per_Gallon}]} : null"
                        }]
                }
            ]);
        });
    });
    it('builds modify signals', function () {
        var oneExpr = interval_1.default.modifyExpr(model, selCmpts['one']);
        chai_1.assert.equal(oneExpr, 'one_tuple, true');
        var twoExpr = interval_1.default.modifyExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'two_tuple, true');
        var threeExpr = interval_1.default.modifyExpr(model, selCmpts['thr_ee']);
        chai_1.assert.equal(threeExpr, 'thr_ee_tuple, {unit: \"\"}');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "one_modify",
                "on": [
                    {
                        "events": { "signal": "one_tuple" },
                        "update": "modify(\"one_store\", " + oneExpr + ")"
                    }
                ]
            },
            {
                "name": "two_modify",
                "on": [
                    {
                        "events": { "signal": "two_tuple" },
                        "update": "modify(\"two_store\", " + twoExpr + ")"
                    }
                ]
            },
            {
                "name": "thr_ee_modify",
                "on": [
                    {
                        "events": { "signal": "thr_ee_tuple" },
                        "update": "modify(\"thr_ee_store\", " + threeExpr + ")"
                    }
                ]
            }
        ]);
    });
    it('builds brush mark', function () {
        var marks = [{ hello: "world" }];
        chai_1.assert.sameDeepMembers(interval_1.default.marks(model, selCmpts['one'], marks), [
            {
                "name": "one_brush_bg",
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
            { "hello": "world" },
            {
                "name": "one_brush",
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
        chai_1.assert.sameDeepMembers(interval_1.default.marks(model, selCmpts['two'], marks), marks);
        chai_1.assert.sameDeepMembers(interval_1.default.marks(model, selCmpts['thr_ee'], marks), [
            {
                "name": "thr_ee_brush_bg",
                "type": "rect",
                "clip": true,
                "encode": {
                    "enter": {
                        "fill": { "value": "red" },
                        "fillOpacity": { "value": 0.75 }
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
            { "hello": "world" },
            {
                "name": "thr_ee_brush",
                "type": "rect",
                "clip": true,
                "encode": {
                    "enter": {
                        "fill": { "value": "transparent" },
                        "stroke": { "value": "black" },
                        "strokeWidth": { "value": 4 },
                        "strokeDash": { "value": [10, 5] },
                        "strokeDashOffset": { "value": 3 },
                        "strokeOpacity": { "value": 0.25 }
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
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBRTlELG9FQUErRDtBQUMvRCxvRUFBc0U7QUFDdEUsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztRQUNsRixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDbEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELFFBQVEsRUFBRTtZQUNSLE1BQU0sRUFBRSxVQUFVO1lBQ2xCLElBQUksRUFBRSwrREFBK0Q7WUFDckUsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7WUFDYixTQUFTLEVBQUUsV0FBVztZQUN0QixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLFFBQVEsRUFBRSxPQUFPO2dCQUNqQixhQUFhLEVBQUUsQ0FBQztnQkFDaEIsWUFBWSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztnQkFDckIsa0JBQWtCLEVBQUUsQ0FBQztnQkFDckIsZUFBZSxFQUFFLElBQUk7YUFDdEI7U0FDRjtLQUNGLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxlQUFlLEVBQUU7UUFDeEIsRUFBRSxDQUFDLDJCQUEyQixFQUFFO1lBQzlCLElBQU0sS0FBSyxHQUFHLGtCQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN2RCxhQUFNLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLENBQUM7b0JBQ2hDLE1BQU0sRUFBRSxPQUFPO29CQUNmLE9BQU8sRUFBRSxFQUFFO29CQUNYLElBQUksRUFBRTt3QkFDSjs0QkFDRSxRQUFRLEVBQUUsOEJBQWEsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoRCxRQUFRLEVBQUUsb0JBQW9CO3lCQUMvQjt3QkFDRDs0QkFDRSxRQUFRLEVBQUUsOEJBQWEsQ0FBQyxpREFBaUQsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3RGLFFBQVEsRUFBRSxzQ0FBc0M7eUJBQ2pEO3dCQUNEOzRCQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBQzs0QkFDekMsUUFBUSxFQUFFLG9FQUFvRTt5QkFDL0U7cUJBQ0Y7aUJBQ0YsRUFBRTtvQkFDRCxNQUFNLEVBQUUsZ0JBQWdCO29CQUN4QixJQUFJLEVBQUUsQ0FBQzs0QkFDTCxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsT0FBTyxFQUFDOzRCQUM3QixRQUFRLEVBQUUscURBQXFEO3lCQUNoRSxDQUFDO2lCQUNILEVBQUU7b0JBQ0QsTUFBTSxFQUFFLG1CQUFtQjtvQkFDM0IsUUFBUSxFQUFFLDZKQUE2SjtpQkFDeEssQ0FBQyxDQUFDLENBQUM7WUFFSixJQUFNLEtBQUssR0FBRyxrQkFBUSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDdkQsYUFBTSxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRSxDQUFDO29CQUNoQyxNQUFNLEVBQUUsc0JBQXNCO29CQUM5QixJQUFJLEVBQUUsRUFBRTtpQkFDVCxDQUFDLENBQUMsQ0FBQztZQUVKLElBQU0sT0FBTyxHQUFHLGtCQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztZQUM1RCxhQUFNLENBQUMsa0JBQWtCLENBQUMsT0FBTyxFQUFFO2dCQUNqQztvQkFDRSxNQUFNLEVBQUUsVUFBVTtvQkFDbEIsT0FBTyxFQUFFLEVBQUU7b0JBQ1gsSUFBSSxFQUFFO3dCQUNKOzRCQUNFLFFBQVEsRUFBRSw4QkFBYSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ2hELFFBQVEsRUFBRSxvQkFBb0I7eUJBQy9CO3dCQUNEOzRCQUNFLFFBQVEsRUFBRSw4QkFBYSxDQUFDLGtDQUFrQyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDdkUsUUFBUSxFQUFFLHlDQUF5Qzt5QkFDcEQ7d0JBQ0Q7NEJBQ0UsUUFBUSxFQUFFLDhCQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDOUMsUUFBUSxFQUFFLG9CQUFvQjt5QkFDL0I7d0JBQ0Q7NEJBQ0UsUUFBUSxFQUFFLDhCQUFhLENBQUMsNkJBQTZCLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsRSxRQUFRLEVBQUUseUNBQXlDO3lCQUNwRDt3QkFDRDs0QkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsc0JBQXNCLEVBQUM7NEJBQzVDLFFBQVEsRUFBRSwwRUFBMEU7eUJBQ3JGO3FCQUNGO2lCQUNGO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxtQkFBbUI7b0JBQzNCLElBQUksRUFBRSxDQUFDOzRCQUNMLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxVQUFVLEVBQUM7NEJBQ2hDLFFBQVEsRUFBRSw4REFBOEQ7eUJBQ3pFLENBQUM7aUJBQ0g7Z0JBQ0Q7b0JBQ0UsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLE9BQU8sRUFBRSxFQUFFO29CQUNYLElBQUksRUFBRTt3QkFDSjs0QkFDRSxRQUFRLEVBQUUsOEJBQWEsQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNoRCxRQUFRLEVBQUUsb0JBQW9CO3lCQUMvQjt3QkFDRDs0QkFDRSxRQUFRLEVBQUUsOEJBQWEsQ0FBQyxrQ0FBa0MsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQ3ZFLFFBQVEsRUFBRSwwQ0FBMEM7eUJBQ3JEO3dCQUNEOzRCQUNFLFFBQVEsRUFBRSw4QkFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7NEJBQzlDLFFBQVEsRUFBRSxvQkFBb0I7eUJBQy9CO3dCQUNEOzRCQUNFLFFBQVEsRUFBRSw4QkFBYSxDQUFDLDZCQUE2QixFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDbEUsUUFBUSxFQUFFLDBDQUEwQzt5QkFDckQ7d0JBQ0Q7NEJBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLHNCQUFzQixFQUFDOzRCQUM1QyxRQUFRLEVBQUUsc0ZBQXNGO3lCQUNqRztxQkFDRjtpQkFDRjtnQkFDRDtvQkFDRSxNQUFNLEVBQUUseUJBQXlCO29CQUNqQyxJQUFJLEVBQUUsQ0FBQzs0QkFDTCxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsVUFBVSxFQUFDOzRCQUNoQyxRQUFRLEVBQUUsOERBQThEO3lCQUN6RSxDQUFDO2lCQUNIO2dCQUNEO29CQUNFLE1BQU0sRUFBRSxzQkFBc0I7b0JBQzlCLFFBQVEsRUFBRSxzVkFBc1Y7aUJBQ2pXO2FBQ0YsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsd0JBQXdCLEVBQUU7WUFDM0IsSUFBTSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7Z0JBQy9CO29CQUNFLE1BQU0sRUFBRSxXQUFXO29CQUNuQixJQUFJLEVBQUUsQ0FBQzs0QkFDTCxRQUFRLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxnQkFBZ0IsRUFBQyxDQUFDOzRCQUN4QyxRQUFRLEVBQUUscUhBQXFIO3lCQUNoSSxDQUFDO2lCQUNIO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxLQUFLLEdBQUcsa0JBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3ZELGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7Z0JBQy9CO29CQUNFLE1BQU0sRUFBRSxXQUFXO29CQUNuQixJQUFJLEVBQUUsQ0FBQzs0QkFDTCxRQUFRLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxzQkFBc0IsRUFBQyxDQUFDOzRCQUM5QyxRQUFRLEVBQUUsdUlBQXVJO3lCQUNsSixDQUFDO2lCQUNIO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxPQUFPLEdBQUcsa0JBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQzVELGFBQU0sQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pDO29CQUNFLE1BQU0sRUFBRSxjQUFjO29CQUN0QixJQUFJLEVBQUUsQ0FBQzs0QkFDTCxRQUFRLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxtQkFBbUIsRUFBQyxFQUFFLEVBQUMsUUFBUSxFQUFFLHlCQUF5QixFQUFDLENBQUM7NEJBQ2xGLFFBQVEsRUFBRSx1T0FBdU87eUJBQ2xQLENBQUM7aUJBQ0g7YUFDRixDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1FBQzFCLElBQU0sT0FBTyxHQUFHLGtCQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1RCxhQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRXpDLElBQU0sT0FBTyxHQUFHLGtCQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM1RCxhQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO1FBRXpDLElBQU0sU0FBUyxHQUFHLGtCQUFRLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNqRSxhQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO1FBRXRELElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDbEUsYUFBTSxDQUFDLGtCQUFrQixDQUFDLE9BQU8sRUFBRTtZQUNqQztnQkFDRSxNQUFNLEVBQUUsWUFBWTtnQkFDcEIsSUFBSSxFQUFFO29CQUNKO3dCQUNFLFFBQVEsRUFBRSxFQUFDLFFBQVEsRUFBRSxXQUFXLEVBQUM7d0JBQ2pDLFFBQVEsRUFBRSwyQkFBeUIsT0FBTyxNQUFHO3FCQUM5QztpQkFDRjthQUNGO1lBQ0Q7Z0JBQ0UsTUFBTSxFQUFFLFlBQVk7Z0JBQ3BCLElBQUksRUFBRTtvQkFDSjt3QkFDRSxRQUFRLEVBQUUsRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDO3dCQUNqQyxRQUFRLEVBQUUsMkJBQXlCLE9BQU8sTUFBRztxQkFDOUM7aUJBQ0Y7YUFDRjtZQUNEO2dCQUNFLE1BQU0sRUFBRSxlQUFlO2dCQUN2QixJQUFJLEVBQUU7b0JBQ0o7d0JBQ0UsUUFBUSxFQUFFLEVBQUMsUUFBUSxFQUFFLGNBQWMsRUFBQzt3QkFDcEMsUUFBUSxFQUFFLDhCQUE0QixTQUFTLE1BQUc7cUJBQ25EO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxtQkFBbUIsRUFBRTtRQUN0QixJQUFNLEtBQUssR0FBVSxDQUFDLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUM7UUFDeEMsYUFBTSxDQUFDLGVBQWUsQ0FBQyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3BFO2dCQUNFLE1BQU0sRUFBRSxjQUFjO2dCQUN0QixNQUFNLEVBQUUsTUFBTTtnQkFDZCxNQUFNLEVBQUUsSUFBSTtnQkFDWixRQUFRLEVBQUU7b0JBQ1IsT0FBTyxFQUFFO3dCQUNQLE1BQU0sRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUM7d0JBQ3pCLGFBQWEsRUFBRSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUM7cUJBQ2hDO29CQUNELFFBQVEsRUFBRTt3QkFDUixHQUFHLEVBQUU7NEJBQ0g7Z0NBQ0UsTUFBTSxFQUFFLG9FQUFvRTtnQ0FDNUUsUUFBUSxFQUFFLFVBQVU7NkJBQ3JCOzRCQUNEO2dDQUNFLE9BQU8sRUFBRSxDQUFDOzZCQUNYO3lCQUNGO3dCQUNELEdBQUcsRUFBRTs0QkFDSDtnQ0FDRSxNQUFNLEVBQUUsb0VBQW9FO2dDQUM1RSxPQUFPLEVBQUUsQ0FBQzs2QkFDWDs0QkFDRDtnQ0FDRSxPQUFPLEVBQUUsQ0FBQzs2QkFDWDt5QkFDRjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0o7Z0NBQ0UsTUFBTSxFQUFFLG9FQUFvRTtnQ0FDNUUsUUFBUSxFQUFFLFVBQVU7NkJBQ3JCOzRCQUNEO2dDQUNFLE9BQU8sRUFBRSxDQUFDOzZCQUNYO3lCQUNGO3dCQUNELElBQUksRUFBRTs0QkFDSjtnQ0FDRSxNQUFNLEVBQUUsb0VBQW9FO2dDQUM1RSxPQUFPLEVBQUU7b0NBQ1AsT0FBTyxFQUFFLFFBQVE7aUNBQ2xCOzZCQUNGOzRCQUNEO2dDQUNFLE9BQU8sRUFBRSxDQUFDOzZCQUNYO3lCQUNGO3FCQUNGO2lCQUNGO2FBQ0Y7WUFDRCxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUM7WUFDbEI7Z0JBQ0UsTUFBTSxFQUFFLFdBQVc7Z0JBQ25CLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBQzt3QkFDaEMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQztxQkFDN0I7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLEdBQUcsRUFBRTs0QkFDSDtnQ0FDRSxNQUFNLEVBQUUsb0VBQW9FO2dDQUM1RSxRQUFRLEVBQUUsVUFBVTs2QkFDckI7NEJBQ0Q7Z0NBQ0UsT0FBTyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7d0JBQ0QsR0FBRyxFQUFFOzRCQUNIO2dDQUNFLE1BQU0sRUFBRSxvRUFBb0U7Z0NBQzVFLE9BQU8sRUFBRSxDQUFDOzZCQUNYOzRCQUNEO2dDQUNFLE9BQU8sRUFBRSxDQUFDOzZCQUNYO3lCQUNGO3dCQUNELElBQUksRUFBRTs0QkFDSjtnQ0FDRSxNQUFNLEVBQUUsb0VBQW9FO2dDQUM1RSxRQUFRLEVBQUUsVUFBVTs2QkFDckI7NEJBQ0Q7Z0NBQ0UsT0FBTyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKO2dDQUNFLE1BQU0sRUFBRSxvRUFBb0U7Z0NBQzVFLE9BQU8sRUFBRTtvQ0FDUCxPQUFPLEVBQUUsUUFBUTtpQ0FDbEI7NkJBQ0Y7NEJBQ0Q7Z0NBQ0UsT0FBTyxFQUFFLENBQUM7NkJBQ1g7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILCtEQUErRDtRQUMvRCxhQUFNLENBQUMsZUFBZSxDQUFDLGtCQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFN0UsYUFBTSxDQUFDLGVBQWUsQ0FBQyxrQkFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLEtBQUssQ0FBQyxFQUFFO1lBQ3ZFO2dCQUNFLE1BQU0sRUFBRSxpQkFBaUI7Z0JBQ3pCLE1BQU0sRUFBRSxNQUFNO2dCQUNkLE1BQU0sRUFBRSxJQUFJO2dCQUNaLFFBQVEsRUFBRTtvQkFDUixPQUFPLEVBQUU7d0JBQ1AsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQzt3QkFDeEIsYUFBYSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQztxQkFDL0I7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLEdBQUcsRUFBRTs0QkFDSCxRQUFRLEVBQUUsYUFBYTt5QkFDeEI7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILFFBQVEsRUFBRSxhQUFhO3lCQUN4Qjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osUUFBUSxFQUFFLGFBQWE7eUJBQ3hCO3dCQUNELElBQUksRUFBRTs0QkFDSixRQUFRLEVBQUUsYUFBYTt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtZQUNELEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQztZQUNsQjtnQkFDRSxNQUFNLEVBQUUsY0FBYztnQkFDdEIsTUFBTSxFQUFFLE1BQU07Z0JBQ2QsTUFBTSxFQUFFLElBQUk7Z0JBQ1osUUFBUSxFQUFFO29CQUNSLE9BQU8sRUFBRTt3QkFDUCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsYUFBYSxFQUFDO3dCQUNoQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDO3dCQUM1QixhQUFhLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFDO3dCQUMzQixZQUFZLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUM7d0JBQ2hDLGtCQUFrQixFQUFFLEVBQUMsT0FBTyxFQUFFLENBQUMsRUFBQzt3QkFDaEMsZUFBZSxFQUFFLEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQztxQkFDakM7b0JBQ0QsUUFBUSxFQUFFO3dCQUNSLEdBQUcsRUFBRTs0QkFDSCxRQUFRLEVBQUUsYUFBYTt5QkFDeEI7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILFFBQVEsRUFBRSxhQUFhO3lCQUN4Qjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osUUFBUSxFQUFFLGFBQWE7eUJBQ3hCO3dCQUNELElBQUksRUFBRTs0QkFDSixRQUFRLEVBQUUsYUFBYTt5QkFDeEI7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiB0c2xpbnQ6ZGlzYWJsZSBxdW90ZW1hcmsgKi9cblxuaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtzZWxlY3RvciBhcyBwYXJzZVNlbGVjdG9yfSBmcm9tICd2ZWdhLWV2ZW50LXNlbGVjdG9yJztcblxuaW1wb3J0IGludGVydmFsIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9pbnRlcnZhbCc7XG5pbXBvcnQgKiBhcyBzZWxlY3Rpb24gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ0ludGVydmFsIFNlbGVjdGlvbnMnLCBmdW5jdGlvbigpIHtcbiAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgXCJlbmNvZGluZ1wiOiB7XG4gICAgICBcInhcIjoge1wiZmllbGRcIjogXCJIb3JzZXBvd2VyXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJ5XCI6IHtcImZpZWxkXCI6IFwiTWlsZXMtcGVyLUdhbGxvblwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwiY29sb3JcIjoge1wiZmllbGRcIjogXCJPcmlnaW5cIiwgXCJ0eXBlXCI6IFwibm9taW5hbFwifVxuICAgIH1cbiAgfSk7XG4gIG1vZGVsLnBhcnNlU2NhbGUoKTtcblxuICBjb25zdCBzZWxDbXB0cyA9IG1vZGVsLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsLCB7XG4gICAgXCJvbmVcIjoge1widHlwZVwiOiBcImludGVydmFsXCIsIFwiZW5jb2RpbmdzXCI6IFtcInhcIl0sIFwidHJhbnNsYXRlXCI6IGZhbHNlLCBcInpvb21cIjogZmFsc2V9LFxuICAgIFwidHdvXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcImVuY29kaW5nc1wiOiBbXCJ5XCJdLFxuICAgICAgXCJiaW5kXCI6IFwic2NhbGVzXCIsXG4gICAgICBcInRyYW5zbGF0ZVwiOiBmYWxzZSxcbiAgICAgIFwiem9vbVwiOiBmYWxzZVxuICAgIH0sXG4gICAgXCJ0aHItZWVcIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwib25cIjogXCJbbW91c2Vkb3duLCBtb3VzZXVwXSA+IG1vdXNlbW92ZSwgW2tleWRvd24sIGtleXVwXSA+IGtleXByZXNzXCIsXG4gICAgICBcInRyYW5zbGF0ZVwiOiBmYWxzZSxcbiAgICAgIFwiem9vbVwiOiBmYWxzZSxcbiAgICAgIFwicmVzb2x2ZVwiOiBcImludGVyc2VjdFwiLFxuICAgICAgXCJtYXJrXCI6IHtcbiAgICAgICAgXCJmaWxsXCI6IFwicmVkXCIsXG4gICAgICAgIFwiZmlsbE9wYWNpdHlcIjogMC43NSxcbiAgICAgICAgXCJzdHJva2VcIjogXCJibGFja1wiLFxuICAgICAgICBcInN0cm9rZVdpZHRoXCI6IDQsXG4gICAgICAgIFwic3Ryb2tlRGFzaFwiOiBbMTAsIDVdLFxuICAgICAgICBcInN0cm9rZURhc2hPZmZzZXRcIjogMyxcbiAgICAgICAgXCJzdHJva2VPcGFjaXR5XCI6IDAuMjVcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdUdXBsZSBTaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgaXQoJ2J1aWxkcyBwcm9qZWN0aW9uIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9uZVNnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ29uZSddKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMob25lU2csIFt7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV94XCIsXG4gICAgICAgIFwidmFsdWVcIjogW10sXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ21vdXNlZG93bicsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbeCh1bml0KSwgeCh1bml0KV1cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW21vdXNlZG93biwgd2luZG93Om1vdXNldXBdID4gd2luZG93Om1vdXNlbW92ZSEnLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW29uZV94WzBdLCBjbGFtcCh4KHVuaXQpLCAwLCB3aWR0aCldXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcIm9uZV9zY2FsZV90cmlnZ2VyXCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbc2NhbGUoXFxcInhcXFwiLCBvbmVfSG9yc2Vwb3dlclswXSksIHNjYWxlKFxcXCJ4XFxcIiwgb25lX0hvcnNlcG93ZXJbMV0pXVwiXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LCB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9Ib3JzZXBvd2VyXCIsXG4gICAgICAgIFwib25cIjogW3tcbiAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJvbmVfeFwifSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcIm9uZV94WzBdID09PSBvbmVfeFsxXSA/IG51bGwgOiBpbnZlcnQoXFxcInhcXFwiLCBvbmVfeClcIlxuICAgICAgICB9XVxuICAgICAgfSwge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfc2NhbGVfdHJpZ2dlclwiLFxuICAgICAgICBcInVwZGF0ZVwiOiBcIighaXNBcnJheShvbmVfSG9yc2Vwb3dlcikgfHwgKCtpbnZlcnQoXFxcInhcXFwiLCBvbmVfeClbMF0gPT09ICtvbmVfSG9yc2Vwb3dlclswXSAmJiAraW52ZXJ0KFxcXCJ4XFxcIiwgb25lX3gpWzFdID09PSArb25lX0hvcnNlcG93ZXJbMV0pKSA/IG9uZV9zY2FsZV90cmlnZ2VyIDoge31cIlxuICAgICAgfV0pO1xuXG4gICAgICBjb25zdCB0d29TZyA9IGludGVydmFsLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0d28nXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHR3b1NnLCBbe1xuICAgICAgICBcIm5hbWVcIjogXCJ0d29fTWlsZXNfcGVyX0dhbGxvblwiLFxuICAgICAgICBcIm9uXCI6IFtdXG4gICAgICB9XSk7XG5cbiAgICAgIGNvbnN0IHRocmVlU2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndGhyX2VlJ10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyh0aHJlZVNnLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfeFwiLFxuICAgICAgICAgIFwidmFsdWVcIjogW10sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ21vdXNlZG93bicsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt4KHVuaXQpLCB4KHVuaXQpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdbbW91c2Vkb3duLCBtb3VzZXVwXSA+IG1vdXNlbW92ZScsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt0aHJfZWVfeFswXSwgY2xhbXAoeCh1bml0KSwgMCwgd2lkdGgpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdrZXlkb3duJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3godW5pdCksIHgodW5pdCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1trZXlkb3duLCBrZXl1cF0gPiBrZXlwcmVzcycsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt0aHJfZWVfeFswXSwgY2xhbXAoeCh1bml0KSwgMCwgd2lkdGgpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0aHJfZWVfc2NhbGVfdHJpZ2dlclwifSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbc2NhbGUoXFxcInhcXFwiLCB0aHJfZWVfSG9yc2Vwb3dlclswXSksIHNjYWxlKFxcXCJ4XFxcIiwgdGhyX2VlX0hvcnNlcG93ZXJbMV0pXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX0hvcnNlcG93ZXJcIixcbiAgICAgICAgICBcIm9uXCI6IFt7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0aHJfZWVfeFwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwidGhyX2VlX3hbMF0gPT09IHRocl9lZV94WzFdID8gbnVsbCA6IGludmVydChcXFwieFxcXCIsIHRocl9lZV94KVwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInRocl9lZV95XCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiBbXSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignbW91c2Vkb3duJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3kodW5pdCksIHkodW5pdCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1ttb3VzZWRvd24sIG1vdXNldXBdID4gbW91c2Vtb3ZlJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3Rocl9lZV95WzBdLCBjbGFtcCh5KHVuaXQpLCAwLCBoZWlnaHQpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdrZXlkb3duJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3kodW5pdCksIHkodW5pdCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1trZXlkb3duLCBrZXl1cF0gPiBrZXlwcmVzcycsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt0aHJfZWVfeVswXSwgY2xhbXAoeSh1bml0KSwgMCwgaGVpZ2h0KV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidGhyX2VlX3NjYWxlX3RyaWdnZXJcIn0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3NjYWxlKFxcXCJ5XFxcIiwgdGhyX2VlX01pbGVzX3Blcl9HYWxsb25bMF0pLCBzY2FsZShcXFwieVxcXCIsIHRocl9lZV9NaWxlc19wZXJfR2FsbG9uWzFdKV1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInRocl9lZV9NaWxlc19wZXJfR2FsbG9uXCIsXG4gICAgICAgICAgXCJvblwiOiBbe1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidGhyX2VlX3lcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcInRocl9lZV95WzBdID09PSB0aHJfZWVfeVsxXSA/IG51bGwgOiBpbnZlcnQoXFxcInlcXFwiLCB0aHJfZWVfeSlcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfc2NhbGVfdHJpZ2dlclwiLFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwiKCFpc0FycmF5KHRocl9lZV9Ib3JzZXBvd2VyKSB8fCAoK2ludmVydChcXFwieFxcXCIsIHRocl9lZV94KVswXSA9PT0gK3Rocl9lZV9Ib3JzZXBvd2VyWzBdICYmICtpbnZlcnQoXFxcInhcXFwiLCB0aHJfZWVfeClbMV0gPT09ICt0aHJfZWVfSG9yc2Vwb3dlclsxXSkpICYmICghaXNBcnJheSh0aHJfZWVfTWlsZXNfcGVyX0dhbGxvbikgfHwgKCtpbnZlcnQoXFxcInlcXFwiLCB0aHJfZWVfeSlbMF0gPT09ICt0aHJfZWVfTWlsZXNfcGVyX0dhbGxvblswXSAmJiAraW52ZXJ0KFxcXCJ5XFxcIiwgdGhyX2VlX3kpWzFdID09PSArdGhyX2VlX01pbGVzX3Blcl9HYWxsb25bMV0pKSA/IHRocl9lZV9zY2FsZV90cmlnZ2VyIDoge31cIlxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KCdidWlsZHMgdHJpZ2dlciBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBvbmVTZyA9IGludGVydmFsLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWydvbmUnXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKG9uZVNnLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJvbmVfdHVwbGVcIixcbiAgICAgICAgICBcIm9uXCI6IFt7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic2lnbmFsXCI6IFwib25lX0hvcnNlcG93ZXJcIn1dLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJvbmVfSG9yc2Vwb3dlciA/IHt1bml0OiBcXFwiXFxcIiwgaW50ZXJ2YWxzOiBbe2VuY29kaW5nOiBcXFwieFxcXCIsIGZpZWxkOiBcXFwiSG9yc2Vwb3dlclxcXCIsIGV4dGVudDogb25lX0hvcnNlcG93ZXJ9XX0gOiBudWxsXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgY29uc3QgdHdvU2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyh0d29TZywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidHdvX3R1cGxlXCIsXG4gICAgICAgICAgXCJvblwiOiBbe1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNpZ25hbFwiOiBcInR3b19NaWxlc19wZXJfR2FsbG9uXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwidHdvX01pbGVzX3Blcl9HYWxsb24gPyB7dW5pdDogXFxcIlxcXCIsIGludGVydmFsczogW3tlbmNvZGluZzogXFxcInlcXFwiLCBmaWVsZDogXFxcIk1pbGVzLXBlci1HYWxsb25cXFwiLCBleHRlbnQ6IHR3b19NaWxlc19wZXJfR2FsbG9ufV19IDogbnVsbFwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHRocmVlU2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndGhyX2VlJ10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyh0aHJlZVNnLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfdHVwbGVcIixcbiAgICAgICAgICBcIm9uXCI6IFt7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic2lnbmFsXCI6IFwidGhyX2VlX0hvcnNlcG93ZXJcIn0sIHtcInNpZ25hbFwiOiBcInRocl9lZV9NaWxlc19wZXJfR2FsbG9uXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwidGhyX2VlX0hvcnNlcG93ZXIgJiYgdGhyX2VlX01pbGVzX3Blcl9HYWxsb24gPyB7dW5pdDogXFxcIlxcXCIsIGludGVydmFsczogW3tlbmNvZGluZzogXFxcInhcXFwiLCBmaWVsZDogXFxcIkhvcnNlcG93ZXJcXFwiLCBleHRlbnQ6IHRocl9lZV9Ib3JzZXBvd2VyfSwge2VuY29kaW5nOiBcXFwieVxcXCIsIGZpZWxkOiBcXFwiTWlsZXMtcGVyLUdhbGxvblxcXCIsIGV4dGVudDogdGhyX2VlX01pbGVzX3Blcl9HYWxsb259XX0gOiBudWxsXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICBdKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyBtb2RpZnkgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG9uZUV4cHIgPSBpbnRlcnZhbC5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgIGFzc2VydC5lcXVhbChvbmVFeHByLCAnb25lX3R1cGxlLCB0cnVlJyk7XG5cbiAgICBjb25zdCB0d29FeHByID0gaW50ZXJ2YWwubW9kaWZ5RXhwcihtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICBhc3NlcnQuZXF1YWwodHdvRXhwciwgJ3R3b190dXBsZSwgdHJ1ZScpO1xuXG4gICAgY29uc3QgdGhyZWVFeHByID0gaW50ZXJ2YWwubW9kaWZ5RXhwcihtb2RlbCwgc2VsQ21wdHNbJ3Rocl9lZSddKTtcbiAgICBhc3NlcnQuZXF1YWwodGhyZWVFeHByLCAndGhyX2VlX3R1cGxlLCB7dW5pdDogXFxcIlxcXCJ9Jyk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX21vZGlmeVwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJvbmVfdHVwbGVcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBgbW9kaWZ5KFxcXCJvbmVfc3RvcmVcXFwiLCAke29uZUV4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b19tb2RpZnlcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidHdvX3R1cGxlXCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogYG1vZGlmeShcXFwidHdvX3N0b3JlXFxcIiwgJHt0d29FeHByfSlgXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfbW9kaWZ5XCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInRocl9lZV90dXBsZVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IGBtb2RpZnkoXFxcInRocl9lZV9zdG9yZVxcXCIsICR7dGhyZWVFeHByfSlgXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgYnJ1c2ggbWFyaycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1hcmtzOiBhbnlbXSA9IFt7aGVsbG86IFwid29ybGRcIn1dO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoaW50ZXJ2YWwubWFya3MobW9kZWwsIHNlbENtcHRzWydvbmUnXSwgbWFya3MpLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9icnVzaF9iZ1wiLFxuICAgICAgICBcInR5cGVcIjogXCJyZWN0XCIsXG4gICAgICAgIFwiY2xpcFwiOiB0cnVlLFxuICAgICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgICAgXCJlbnRlclwiOiB7XG4gICAgICAgICAgICBcImZpbGxcIjoge1widmFsdWVcIjogXCIjMzMzXCJ9LFxuICAgICAgICAgICAgXCJmaWxsT3BhY2l0eVwiOiB7XCJ2YWx1ZVwiOiAwLjEyNX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcIlxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcIm9uZV94WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIngyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwib25lX3hbMV1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInkyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjoge1xuICAgICAgICAgICAgICAgICAgXCJncm91cFwiOiBcImhlaWdodFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XCJoZWxsb1wiOiBcIndvcmxkXCJ9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfYnJ1c2hcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwicmVjdFwiLFxuICAgICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgICAgXCJlbmNvZGVcIjoge1xuICAgICAgICAgIFwiZW50ZXJcIjoge1xuICAgICAgICAgICAgXCJmaWxsXCI6IHtcInZhbHVlXCI6IFwidHJhbnNwYXJlbnRcIn0sXG4gICAgICAgICAgICBcInN0cm9rZVwiOiB7XCJ2YWx1ZVwiOiBcIndoaXRlXCJ9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcInhcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJvbmVfeFswXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcIlxcXCJcIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ4MlwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcIlxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcIm9uZV94WzFdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5MlwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcIlxcXCJcIixcbiAgICAgICAgICAgICAgICBcImZpZWxkXCI6IHtcbiAgICAgICAgICAgICAgICAgIFwiZ3JvdXBcIjogXCJoZWlnaHRcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSk7XG5cbiAgICAvLyBTY2FsZS1ib3VuZCBpbnRlcnZhbCBzZWxlY3Rpb25zIHNob3VsZCBub3QgYWRkIGEgYnJ1c2ggbWFyay5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKGludGVydmFsLm1hcmtzKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10sIG1hcmtzKSwgbWFya3MpO1xuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhpbnRlcnZhbC5tYXJrcyhtb2RlbCwgc2VsQ21wdHNbJ3Rocl9lZSddLCBtYXJrcyksIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX2JydXNoX2JnXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInJlY3RcIixcbiAgICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgICBcImVudGVyXCI6IHtcbiAgICAgICAgICAgIFwiZmlsbFwiOiB7XCJ2YWx1ZVwiOiBcInJlZFwifSxcbiAgICAgICAgICAgIFwiZmlsbE9wYWNpdHlcIjoge1widmFsdWVcIjogMC43NX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3hbMF1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3lbMF1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV94WzFdXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeVsxXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuICAgICAge1wiaGVsbG9cIjogXCJ3b3JsZFwifSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX2JydXNoXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInJlY3RcIixcbiAgICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgICBcImVudGVyXCI6IHtcbiAgICAgICAgICAgIFwiZmlsbFwiOiB7XCJ2YWx1ZVwiOiBcInRyYW5zcGFyZW50XCJ9LFxuICAgICAgICAgICAgXCJzdHJva2VcIjoge1widmFsdWVcIjogXCJibGFja1wifSxcbiAgICAgICAgICAgIFwic3Ryb2tlV2lkdGhcIjoge1widmFsdWVcIjogNH0sXG4gICAgICAgICAgICBcInN0cm9rZURhc2hcIjoge1widmFsdWVcIjogWzEwLCA1XX0sXG4gICAgICAgICAgICBcInN0cm9rZURhc2hPZmZzZXRcIjoge1widmFsdWVcIjogM30sXG4gICAgICAgICAgICBcInN0cm9rZU9wYWNpdHlcIjoge1widmFsdWVcIjogMC4yNX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3hbMF1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3lbMF1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV94WzFdXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeVsxXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=