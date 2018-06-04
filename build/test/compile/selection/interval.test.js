"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var vega_event_selector_1 = require("vega-event-selector");
var interval_1 = tslib_1.__importDefault(require("../../../src/compile/selection/interval"));
var selection = tslib_1.__importStar(require("../../../src/compile/selection/selection"));
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
        it('namespaces signals when encoding/fields collide', function () {
            var model2 = util_1.parseUnitModel({
                "mark": "circle",
                "encoding": {
                    "x": { "field": "x", "type": "quantitative" },
                    "y": { "field": "y", "type": "quantitative" }
                }
            });
            var selCmpts2 = model2.component.selection = selection.parseUnitSelection(model2, {
                "one": {
                    "type": "interval",
                    "encodings": ["x"],
                    "translate": false, "zoom": false
                }
            });
            var sg = interval_1.default.signals(model, selCmpts2['one']);
            chai_1.assert.equal(sg[0].name, 'one_x');
            chai_1.assert.equal(sg[1].name, 'one_x_1');
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
                        "fill": { "value": "transparent" }
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
                        "fill": { "value": "transparent" }
                    },
                    "update": {
                        "stroke": [
                            {
                                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                                "value": "black"
                            },
                            { "value": null }
                        ],
                        "strokeWidth": [
                            {
                                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                                "value": 4
                            },
                            { "value": null }
                        ],
                        "strokeDash": [
                            {
                                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                                "value": [10, 5]
                            },
                            { "value": null }
                        ],
                        "strokeDashOffset": [
                            {
                                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                                "value": 3
                            },
                            { "value": null }
                        ],
                        "strokeOpacity": [
                            {
                                "test": "thr_ee_x[0] !== thr_ee_x[1] && thr_ee_y[0] !== thr_ee_y[1]",
                                "value": 0.25
                            },
                            { "value": null }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOzs7QUFFOUIsNkJBQTRCO0FBQzVCLDJEQUE4RDtBQUU5RCw2RkFBK0Q7QUFDL0QsMEZBQXNFO0FBQ3RFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBRW5CLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDL0UsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUM7UUFDbEYsS0FBSyxFQUFFO1lBQ0wsTUFBTSxFQUFFLFVBQVU7WUFDbEIsV0FBVyxFQUFFLENBQUMsR0FBRyxDQUFDO1lBQ2xCLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLE1BQU0sRUFBRSxLQUFLO1NBQ2Q7UUFDRCxRQUFRLEVBQUU7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TyxFQUFFLElBQUksRUFBQzt5QkFDaEI7d0JBQ0QsYUFBYSxFQUFFOzRCQUNiO2dDQUNFLE1BQU0sRUFBRSw0REFBNEQ7Z0NBQ3BFLE9BQU8sRUFBRSxDQUFDOzZCQUNYOzRCQUNELEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQzt5QkFDaEI7d0JBQ0QsWUFBWSxFQUFFOzRCQUNaO2dDQUNFLE1BQU0sRUFBRSw0REFBNEQ7Z0NBQ3BFLE9BQU8sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7NkJBQ2pCOzRCQUNELEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQzt5QkFDaEI7d0JBQ0Qsa0JBQWtCLEVBQUU7NEJBQ2xCO2dDQUNFLE1BQU0sRUFBRSw0REFBNEQ7Z0NBQ3BFLE9BQU8sRUFBRSxDQUFDOzZCQUNYOzRCQUNELEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQzt5QkFDaEI7d0JBQ0QsZUFBZSxFQUFFOzRCQUNmO2dDQUNFLE1BQU0sRUFBRSw0REFBNEQ7Z0NBQ3BFLE9BQU8sRUFBRSxJQUFJOzZCQUNkOzRCQUNELEVBQUMsT0FBTyxFQUFFLElBQUksRUFBQzt5QkFDaEI7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILFFBQVEsRUFBRSxhQUFhO3lCQUN4Qjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsUUFBUSxFQUFFLGFBQWE7eUJBQ3hCO3dCQUNELElBQUksRUFBRTs0QkFDSixRQUFRLEVBQUUsYUFBYTt5QkFDeEI7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKLFFBQVEsRUFBRSxhQUFhO3lCQUN4QjtxQkFDRjtpQkFDRjthQUNGO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIHRzbGludDpkaXNhYmxlIHF1b3RlbWFyayAqL1xuXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge3NlbGVjdG9yIGFzIHBhcnNlU2VsZWN0b3J9IGZyb20gJ3ZlZ2EtZXZlbnQtc2VsZWN0b3InO1xuXG5pbXBvcnQgaW50ZXJ2YWwgZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2VsZWN0aW9uL2ludGVydmFsJztcbmltcG9ydCAqIGFzIHNlbGVjdGlvbiBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnSW50ZXJ2YWwgU2VsZWN0aW9ucycsIGZ1bmN0aW9uKCkge1xuICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICBcIm1hcmtcIjogXCJjaXJjbGVcIixcbiAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcIkhvcnNlcG93ZXJcIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcInlcIjoge1wiZmllbGRcIjogXCJNaWxlcy1wZXItR2FsbG9uXCIsXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgXCJjb2xvclwiOiB7XCJmaWVsZFwiOiBcIk9yaWdpblwiLCBcInR5cGVcIjogXCJub21pbmFsXCJ9XG4gICAgfVxuICB9KTtcbiAgbW9kZWwucGFyc2VTY2FsZSgpO1xuXG4gIGNvbnN0IHNlbENtcHRzID0gbW9kZWwuY29tcG9uZW50LnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwsIHtcbiAgICBcIm9uZVwiOiB7XCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIiwgXCJlbmNvZGluZ3NcIjogW1wieFwiXSwgXCJ0cmFuc2xhdGVcIjogZmFsc2UsIFwiem9vbVwiOiBmYWxzZX0sXG4gICAgXCJ0d29cIjoge1xuICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgIFwiZW5jb2RpbmdzXCI6IFtcInlcIl0sXG4gICAgICBcImJpbmRcIjogXCJzY2FsZXNcIixcbiAgICAgIFwidHJhbnNsYXRlXCI6IGZhbHNlLFxuICAgICAgXCJ6b29tXCI6IGZhbHNlXG4gICAgfSxcbiAgICBcInRoci1lZVwiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJvblwiOiBcIlttb3VzZWRvd24sIG1vdXNldXBdID4gbW91c2Vtb3ZlLCBba2V5ZG93biwga2V5dXBdID4ga2V5cHJlc3NcIixcbiAgICAgIFwidHJhbnNsYXRlXCI6IGZhbHNlLFxuICAgICAgXCJ6b29tXCI6IGZhbHNlLFxuICAgICAgXCJyZXNvbHZlXCI6IFwiaW50ZXJzZWN0XCIsXG4gICAgICBcIm1hcmtcIjoge1xuICAgICAgICBcImZpbGxcIjogXCJyZWRcIixcbiAgICAgICAgXCJmaWxsT3BhY2l0eVwiOiAwLjc1LFxuICAgICAgICBcInN0cm9rZVwiOiBcImJsYWNrXCIsXG4gICAgICAgIFwic3Ryb2tlV2lkdGhcIjogNCxcbiAgICAgICAgXCJzdHJva2VEYXNoXCI6IFsxMCwgNV0sXG4gICAgICAgIFwic3Ryb2tlRGFzaE9mZnNldFwiOiAzLFxuICAgICAgICBcInN0cm9rZU9wYWNpdHlcIjogMC4yNVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ1R1cGxlIFNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYnVpbGRzIHByb2plY3Rpb24gc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb25lU2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhvbmVTZywgW3tcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX3hcIixcbiAgICAgICAgXCJ2YWx1ZVwiOiBbXSxcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignbW91c2Vkb3duJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt4KHVuaXQpLCB4KHVuaXQpXVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdbbW91c2Vkb3duLCB3aW5kb3c6bW91c2V1cF0gPiB3aW5kb3c6bW91c2Vtb3ZlIScsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbb25lX3hbMF0sIGNsYW1wKHgodW5pdCksIDAsIHdpZHRoKV1cIlxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwib25lX3NjYWxlX3RyaWdnZXJcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcIltzY2FsZShcXFwieFxcXCIsIG9uZV9Ib3JzZXBvd2VyWzBdKSwgc2NhbGUoXFxcInhcXFwiLCBvbmVfSG9yc2Vwb3dlclsxXSldXCJcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX0hvcnNlcG93ZXJcIixcbiAgICAgICAgXCJvblwiOiBbe1xuICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcIm9uZV94XCJ9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IFwib25lX3hbMF0gPT09IG9uZV94WzFdID8gbnVsbCA6IGludmVydChcXFwieFxcXCIsIG9uZV94KVwiXG4gICAgICAgIH1dXG4gICAgICB9LCB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9zY2FsZV90cmlnZ2VyXCIsXG4gICAgICAgIFwidXBkYXRlXCI6IFwiKCFpc0FycmF5KG9uZV9Ib3JzZXBvd2VyKSB8fCAoK2ludmVydChcXFwieFxcXCIsIG9uZV94KVswXSA9PT0gK29uZV9Ib3JzZXBvd2VyWzBdICYmICtpbnZlcnQoXFxcInhcXFwiLCBvbmVfeClbMV0gPT09ICtvbmVfSG9yc2Vwb3dlclsxXSkpID8gb25lX3NjYWxlX3RyaWdnZXIgOiB7fVwiXG4gICAgICB9XSk7XG5cbiAgICAgIGNvbnN0IHR3b1NnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnModHdvU2csIFt7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b19NaWxlc19wZXJfR2FsbG9uXCIsXG4gICAgICAgIFwib25cIjogW11cbiAgICAgIH1dKTtcblxuICAgICAgY29uc3QgdGhyZWVTZyA9IGludGVydmFsLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0aHJfZWUnXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHRocmVlU2csIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInRocl9lZV94XCIsXG4gICAgICAgICAgXCJ2YWx1ZVwiOiBbXSxcbiAgICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignbW91c2Vkb3duJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3godW5pdCksIHgodW5pdCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1ttb3VzZWRvd24sIG1vdXNldXBdID4gbW91c2Vtb3ZlJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3Rocl9lZV94WzBdLCBjbGFtcCh4KHVuaXQpLCAwLCB3aWR0aCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ2tleWRvd24nLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbeCh1bml0KSwgeCh1bml0KV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW2tleWRvd24sIGtleXVwXSA+IGtleXByZXNzJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3Rocl9lZV94WzBdLCBjbGFtcCh4KHVuaXQpLCAwLCB3aWR0aCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInRocl9lZV9zY2FsZV90cmlnZ2VyXCJ9LFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIltzY2FsZShcXFwieFxcXCIsIHRocl9lZV9Ib3JzZXBvd2VyWzBdKSwgc2NhbGUoXFxcInhcXFwiLCB0aHJfZWVfSG9yc2Vwb3dlclsxXSldXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfSG9yc2Vwb3dlclwiLFxuICAgICAgICAgIFwib25cIjogW3tcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInRocl9lZV94XCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ0aHJfZWVfeFswXSA9PT0gdGhyX2VlX3hbMV0gPyBudWxsIDogaW52ZXJ0KFxcXCJ4XFxcIiwgdGhyX2VlX3gpXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX3lcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFtdLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdtb3VzZWRvd24nLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbeSh1bml0KSwgeSh1bml0KV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW21vdXNlZG93biwgbW91c2V1cF0gPiBtb3VzZW1vdmUnLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbdGhyX2VlX3lbMF0sIGNsYW1wKHkodW5pdCksIDAsIGhlaWdodCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ2tleWRvd24nLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbeSh1bml0KSwgeSh1bml0KV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW2tleWRvd24sIGtleXVwXSA+IGtleXByZXNzJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3Rocl9lZV95WzBdLCBjbGFtcCh5KHVuaXQpLCAwLCBoZWlnaHQpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0aHJfZWVfc2NhbGVfdHJpZ2dlclwifSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbc2NhbGUoXFxcInlcXFwiLCB0aHJfZWVfTWlsZXNfcGVyX0dhbGxvblswXSksIHNjYWxlKFxcXCJ5XFxcIiwgdGhyX2VlX01pbGVzX3Blcl9HYWxsb25bMV0pXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX01pbGVzX3Blcl9HYWxsb25cIixcbiAgICAgICAgICBcIm9uXCI6IFt7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0aHJfZWVfeVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwidGhyX2VlX3lbMF0gPT09IHRocl9lZV95WzFdID8gbnVsbCA6IGludmVydChcXFwieVxcXCIsIHRocl9lZV95KVwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInRocl9lZV9zY2FsZV90cmlnZ2VyXCIsXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCIoIWlzQXJyYXkodGhyX2VlX0hvcnNlcG93ZXIpIHx8ICgraW52ZXJ0KFxcXCJ4XFxcIiwgdGhyX2VlX3gpWzBdID09PSArdGhyX2VlX0hvcnNlcG93ZXJbMF0gJiYgK2ludmVydChcXFwieFxcXCIsIHRocl9lZV94KVsxXSA9PT0gK3Rocl9lZV9Ib3JzZXBvd2VyWzFdKSkgJiYgKCFpc0FycmF5KHRocl9lZV9NaWxlc19wZXJfR2FsbG9uKSB8fCAoK2ludmVydChcXFwieVxcXCIsIHRocl9lZV95KVswXSA9PT0gK3Rocl9lZV9NaWxlc19wZXJfR2FsbG9uWzBdICYmICtpbnZlcnQoXFxcInlcXFwiLCB0aHJfZWVfeSlbMV0gPT09ICt0aHJfZWVfTWlsZXNfcGVyX0dhbGxvblsxXSkpID8gdGhyX2VlX3NjYWxlX3RyaWdnZXIgOiB7fVwiXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ2J1aWxkcyB0cmlnZ2VyIHNpZ25hbHMnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG9uZVNnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ29uZSddKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMob25lU2csIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcIm9uZV90dXBsZVwiLFxuICAgICAgICAgIFwib25cIjogW3tcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzaWduYWxcIjogXCJvbmVfSG9yc2Vwb3dlclwifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcIm9uZV9Ib3JzZXBvd2VyID8ge3VuaXQ6IFxcXCJcXFwiLCBpbnRlcnZhbHM6IFt7ZW5jb2Rpbmc6IFxcXCJ4XFxcIiwgZmllbGQ6IFxcXCJIb3JzZXBvd2VyXFxcIiwgZXh0ZW50OiBvbmVfSG9yc2Vwb3dlcn1dfSA6IG51bGxcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCB0d29TZyA9IGludGVydmFsLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0d28nXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHR3b1NnLCBbXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0d29fdHVwbGVcIixcbiAgICAgICAgICBcIm9uXCI6IFt7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBbe1wic2lnbmFsXCI6IFwidHdvX01pbGVzX3Blcl9HYWxsb25cIn1dLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ0d29fTWlsZXNfcGVyX0dhbGxvbiA/IHt1bml0OiBcXFwiXFxcIiwgaW50ZXJ2YWxzOiBbe2VuY29kaW5nOiBcXFwieVxcXCIsIGZpZWxkOiBcXFwiTWlsZXMtcGVyLUdhbGxvblxcXCIsIGV4dGVudDogdHdvX01pbGVzX3Blcl9HYWxsb259XX0gOiBudWxsXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9XG4gICAgICBdKTtcblxuICAgICAgY29uc3QgdGhyZWVTZyA9IGludGVydmFsLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWyd0aHJfZWUnXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHRocmVlU2csIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInRocl9lZV90dXBsZVwiLFxuICAgICAgICAgIFwib25cIjogW3tcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzaWduYWxcIjogXCJ0aHJfZWVfSG9yc2Vwb3dlclwifSwge1wic2lnbmFsXCI6IFwidGhyX2VlX01pbGVzX3Blcl9HYWxsb25cIn1dLFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ0aHJfZWVfSG9yc2Vwb3dlciAmJiB0aHJfZWVfTWlsZXNfcGVyX0dhbGxvbiA/IHt1bml0OiBcXFwiXFxcIiwgaW50ZXJ2YWxzOiBbe2VuY29kaW5nOiBcXFwieFxcXCIsIGZpZWxkOiBcXFwiSG9yc2Vwb3dlclxcXCIsIGV4dGVudDogdGhyX2VlX0hvcnNlcG93ZXJ9LCB7ZW5jb2Rpbmc6IFxcXCJ5XFxcIiwgZmllbGQ6IFxcXCJNaWxlcy1wZXItR2FsbG9uXFxcIiwgZXh0ZW50OiB0aHJfZWVfTWlsZXNfcGVyX0dhbGxvbn1dfSA6IG51bGxcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ25hbWVzcGFjZXMgc2lnbmFscyB3aGVuIGVuY29kaW5nL2ZpZWxkcyBjb2xsaWRlJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBtb2RlbDIgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcInhcIjoge1wiZmllbGRcIjogXCJ4XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgICAgICBcInlcIjoge1wiZmllbGRcIjogXCJ5XCIsIFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2VsQ21wdHMyID0gbW9kZWwyLmNvbXBvbmVudC5zZWxlY3Rpb24gPSBzZWxlY3Rpb24ucGFyc2VVbml0U2VsZWN0aW9uKG1vZGVsMiwge1xuICAgICAgICBcIm9uZVwiOiB7XG4gICAgICAgICAgXCJ0eXBlXCI6IFwiaW50ZXJ2YWxcIixcbiAgICAgICAgICBcImVuY29kaW5nc1wiOiBbXCJ4XCJdLFxuICAgICAgICAgIFwidHJhbnNsYXRlXCI6IGZhbHNlLCBcInpvb21cIjogZmFsc2VcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IHNnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHMyWydvbmUnXSk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2dbMF0ubmFtZSwgJ29uZV94Jyk7XG4gICAgICBhc3NlcnQuZXF1YWwoc2dbMV0ubmFtZSwgJ29uZV94XzEnKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyBtb2RpZnkgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG9uZUV4cHIgPSBpbnRlcnZhbC5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgIGFzc2VydC5lcXVhbChvbmVFeHByLCAnb25lX3R1cGxlLCB0cnVlJyk7XG5cbiAgICBjb25zdCB0d29FeHByID0gaW50ZXJ2YWwubW9kaWZ5RXhwcihtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICBhc3NlcnQuZXF1YWwodHdvRXhwciwgJ3R3b190dXBsZSwgdHJ1ZScpO1xuXG4gICAgY29uc3QgdGhyZWVFeHByID0gaW50ZXJ2YWwubW9kaWZ5RXhwcihtb2RlbCwgc2VsQ21wdHNbJ3Rocl9lZSddKTtcbiAgICBhc3NlcnQuZXF1YWwodGhyZWVFeHByLCAndGhyX2VlX3R1cGxlLCB7dW5pdDogXFxcIlxcXCJ9Jyk7XG5cbiAgICBjb25zdCBzaWduYWxzID0gc2VsZWN0aW9uLmFzc2VtYmxlVW5pdFNlbGVjdGlvblNpZ25hbHMobW9kZWwsIFtdKTtcbiAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKHNpZ25hbHMsIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX21vZGlmeVwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJvbmVfdHVwbGVcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBgbW9kaWZ5KFxcXCJvbmVfc3RvcmVcXFwiLCAke29uZUV4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInR3b19tb2RpZnlcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidHdvX3R1cGxlXCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogYG1vZGlmeShcXFwidHdvX3N0b3JlXFxcIiwgJHt0d29FeHByfSlgXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfbW9kaWZ5XCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInRocl9lZV90dXBsZVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IGBtb2RpZnkoXFxcInRocl9lZV9zdG9yZVxcXCIsICR7dGhyZWVFeHByfSlgXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xuXG4gIGl0KCdidWlsZHMgYnJ1c2ggbWFyaycsIGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IG1hcmtzOiBhbnlbXSA9IFt7aGVsbG86IFwid29ybGRcIn1dO1xuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoaW50ZXJ2YWwubWFya3MobW9kZWwsIHNlbENtcHRzWydvbmUnXSwgbWFya3MpLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9icnVzaF9iZ1wiLFxuICAgICAgICBcInR5cGVcIjogXCJyZWN0XCIsXG4gICAgICAgIFwiY2xpcFwiOiB0cnVlLFxuICAgICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgICAgXCJlbnRlclwiOiB7XG4gICAgICAgICAgICBcImZpbGxcIjoge1widmFsdWVcIjogXCIjMzMzXCJ9LFxuICAgICAgICAgICAgXCJmaWxsT3BhY2l0eVwiOiB7XCJ2YWx1ZVwiOiAwLjEyNX1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwieFwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcIlxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcIm9uZV94WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIngyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwib25lX3hbMV1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInkyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjoge1xuICAgICAgICAgICAgICAgICAgXCJncm91cFwiOiBcImhlaWdodFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XCJoZWxsb1wiOiBcIndvcmxkXCJ9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfYnJ1c2hcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwicmVjdFwiLFxuICAgICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgICAgXCJlbmNvZGVcIjoge1xuICAgICAgICAgIFwiZW50ZXJcIjoge1xuICAgICAgICAgICAgXCJmaWxsXCI6IHtcInZhbHVlXCI6IFwidHJhbnNwYXJlbnRcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwic3Ryb2tlXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcIm9uZV94WzBdICE9PSBvbmVfeFsxXVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJ3aGl0ZVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieFwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKS5sZW5ndGggJiYgZGF0YShcXFwib25lX3N0b3JlXFxcIilbMF0udW5pdCA9PT0gXFxcIlxcXCJcIixcbiAgICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcIm9uZV94WzBdXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ5XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcIngyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwib25lX3hbMV1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInkyXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwiZmllbGRcIjoge1xuICAgICAgICAgICAgICAgICAgXCJncm91cFwiOiBcImhlaWdodFwiXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdKTtcblxuICAgIC8vIFNjYWxlLWJvdW5kIGludGVydmFsIHNlbGVjdGlvbnMgc2hvdWxkIG5vdCBhZGQgYSBicnVzaCBtYXJrLlxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoaW50ZXJ2YWwubWFya3MobW9kZWwsIHNlbENtcHRzWyd0d28nXSwgbWFya3MpLCBtYXJrcyk7XG5cbiAgICBhc3NlcnQuc2FtZURlZXBNZW1iZXJzKGludGVydmFsLm1hcmtzKG1vZGVsLCBzZWxDbXB0c1sndGhyX2VlJ10sIG1hcmtzKSwgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfYnJ1c2hfYmdcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwicmVjdFwiLFxuICAgICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgICAgXCJlbmNvZGVcIjoge1xuICAgICAgICAgIFwiZW50ZXJcIjoge1xuICAgICAgICAgICAgXCJmaWxsXCI6IHtcInZhbHVlXCI6IFwicmVkXCJ9LFxuICAgICAgICAgICAgXCJmaWxsT3BhY2l0eVwiOiB7XCJ2YWx1ZVwiOiAwLjc1fVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeFswXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeVswXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3hbMV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV95WzFdXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB7XCJoZWxsb1wiOiBcIndvcmxkXCJ9LFxuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfYnJ1c2hcIixcbiAgICAgICAgXCJ0eXBlXCI6IFwicmVjdFwiLFxuICAgICAgICBcImNsaXBcIjogdHJ1ZSxcbiAgICAgICAgXCJlbmNvZGVcIjoge1xuICAgICAgICAgIFwiZW50ZXJcIjoge1xuICAgICAgICAgICAgXCJmaWxsXCI6IHtcInZhbHVlXCI6IFwidHJhbnNwYXJlbnRcIn1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFwidXBkYXRlXCI6IHtcbiAgICAgICAgICAgIFwic3Ryb2tlXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcInRocl9lZV94WzBdICE9PSB0aHJfZWVfeFsxXSAmJiB0aHJfZWVfeVswXSAhPT0gdGhyX2VlX3lbMV1cIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFwiYmxhY2tcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XCJ2YWx1ZVwiOiBudWxsfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic3Ryb2tlV2lkdGhcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwidGhyX2VlX3hbMF0gIT09IHRocl9lZV94WzFdICYmIHRocl9lZV95WzBdICE9PSB0aHJfZWVfeVsxXVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogNFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XCJ2YWx1ZVwiOiBudWxsfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic3Ryb2tlRGFzaFwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJ0aHJfZWVfeFswXSAhPT0gdGhyX2VlX3hbMV0gJiYgdGhyX2VlX3lbMF0gIT09IHRocl9lZV95WzFdXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBbMTAsIDVdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcInZhbHVlXCI6IG51bGx9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJzdHJva2VEYXNoT2Zmc2V0XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcInRocl9lZV94WzBdICE9PSB0aHJfZWVfeFsxXSAmJiB0aHJfZWVfeVswXSAhPT0gdGhyX2VlX3lbMV1cIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDNcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1widmFsdWVcIjogbnVsbH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInN0cm9rZU9wYWNpdHlcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwidGhyX2VlX3hbMF0gIT09IHRocl9lZV94WzFdICYmIHRocl9lZV95WzBdICE9PSB0aHJfZWVfeVsxXVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogMC4yNVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XCJ2YWx1ZVwiOiBudWxsfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieFwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3hbMF1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieVwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3lbMF1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieDJcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV94WzFdXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInkyXCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeVsxXVwiXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgXSk7XG4gIH0pO1xufSk7XG4iXX0=