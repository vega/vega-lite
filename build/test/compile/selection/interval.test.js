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
            "resolve": "intersect"
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
                            "update": "invert(\"x\", one_x)"
                        }]
                }, {
                    "name": "one_scale_trigger",
                    "update": "(!isArray(one_Horsepower) || (invert(\"x\", one_x)[0] === one_Horsepower[0] && invert(\"x\", one_x)[1] === one_Horsepower[1])) ? one_scale_trigger : {}"
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
                            "update": "invert(\"x\", thr_ee_x)"
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
                            "update": "invert(\"y\", thr_ee_y)"
                        }]
                },
                {
                    "name": "thr_ee_scale_trigger",
                    "update": "(!isArray(thr_ee_Horsepower) || (invert(\"x\", thr_ee_x)[0] === thr_ee_Horsepower[0] && invert(\"x\", thr_ee_x)[1] === thr_ee_Horsepower[1])) && (!isArray(thr_ee_Miles_per_Gallon) || (invert(\"y\", thr_ee_y)[0] === thr_ee_Miles_per_Gallon[0] && invert(\"y\", thr_ee_y)[1] === thr_ee_Miles_per_Gallon[1])) ? thr_ee_scale_trigger : {}"
                }
            ]);
        });
        it('builds trigger signals', function () {
            var oneSg = interval_1.default.signals(model, selCmpts['one']);
            chai_1.assert.includeDeepMembers(oneSg, [
                {
                    "name": "one_tuple",
                    "update": "{unit: \"\", intervals: [{encoding: \"x\", field: \"Horsepower\", extent: one_Horsepower}]}"
                }
            ]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [
                {
                    "name": "two_tuple",
                    "update": "{unit: \"\", intervals: [{encoding: \"y\", field: \"Miles-per-Gallon\", extent: two_Miles_per_Gallon}]}"
                }
            ]);
            var threeSg = interval_1.default.signals(model, selCmpts['thr_ee']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "thr_ee_tuple",
                    "update": "{unit: \"\", intervals: [{encoding: \"x\", field: \"Horsepower\", extent: thr_ee_Horsepower}, {encoding: \"y\", field: \"Miles-per-Gallon\", extent: thr_ee_Miles_per_Gallon}]}"
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
                "type": "rect",
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
                "type": "rect",
                "encode": {
                    "enter": {
                        "fill": { "value": "#333" },
                        "fillOpacity": { "value": 0.125 }
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
                "encode": {
                    "enter": {
                        "fill": { "value": "transparent" },
                        "stroke": { "value": "white" }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBRTlELG9FQUErRDtBQUMvRCxvRUFBc0U7QUFDdEUsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztRQUNsRixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDbEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELFFBQVEsRUFBRTtZ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