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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBRTlELG9FQUErRDtBQUMvRCxvRUFBc0U7QUFDdEUsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUM7U0FDaEQ7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztRQUNsRixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDbEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELFFBQVEsRUFBRTtZ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LEVBQUUsSUFBSSxFQUFDO3lCQUNoQjt3QkFDRCxhQUFhLEVBQUU7NEJBQ2I7Z0NBQ0UsTUFBTSxFQUFFLDREQUE0RDtnQ0FDcEUsT0FBTyxFQUFFLENBQUM7NkJBQ1g7NEJBQ0QsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDO3lCQUNoQjt3QkFDRCxZQUFZLEVBQUU7NEJBQ1o7Z0NBQ0UsTUFBTSxFQUFFLDREQUE0RDtnQ0FDcEUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQzs2QkFDakI7NEJBQ0QsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDO3lCQUNoQjt3QkFDRCxrQkFBa0IsRUFBRTs0QkFDbEI7Z0NBQ0UsTUFBTSxFQUFFLDREQUE0RDtnQ0FDcEUsT0FBTyxFQUFFLENBQUM7NkJBQ1g7NEJBQ0QsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDO3lCQUNoQjt3QkFDRCxlQUFlLEVBQUU7NEJBQ2Y7Z0NBQ0UsTUFBTSxFQUFFLDREQUE0RDtnQ0FDcEUsT0FBTyxFQUFFLElBQUk7NkJBQ2Q7NEJBQ0QsRUFBQyxPQUFPLEVBQUUsSUFBSSxFQUFDO3lCQUNoQjt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsUUFBUSxFQUFFLGFBQWE7eUJBQ3hCO3dCQUNELEdBQUcsRUFBRTs0QkFDSCxRQUFRLEVBQUUsYUFBYTt5QkFDeEI7d0JBQ0QsSUFBSSxFQUFFOzRCQUNKLFFBQVEsRUFBRSxhQUFhO3lCQUN4Qjt3QkFDRCxJQUFJLEVBQUU7NEJBQ0osUUFBUSxFQUFFLGFBQWE7eUJBQ3hCO3FCQUNGO2lCQUNGO2FBQ0Y7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7c2VsZWN0b3IgYXMgcGFyc2VTZWxlY3Rvcn0gZnJvbSAndmVnYS1ldmVudC1zZWxlY3Rvcic7XG5cbmltcG9ydCBpbnRlcnZhbCBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwnO1xuaW1wb3J0ICogYXMgc2VsZWN0aW9uIGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdJbnRlcnZhbCBTZWxlY3Rpb25zJywgZnVuY3Rpb24oKSB7XG4gIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgIFwibWFya1wiOiBcImNpcmNsZVwiLFxuICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgXCJ4XCI6IHtcImZpZWxkXCI6IFwiSG9yc2Vwb3dlclwiLFwidHlwZVwiOiBcInF1YW50aXRhdGl2ZVwifSxcbiAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcIk1pbGVzLXBlci1HYWxsb25cIixcInR5cGVcIjogXCJxdWFudGl0YXRpdmVcIn0sXG4gICAgICBcImNvbG9yXCI6IHtcImZpZWxkXCI6IFwiT3JpZ2luXCIsIFwidHlwZVwiOiBcIm5vbWluYWxcIn1cbiAgICB9XG4gIH0pO1xuICBtb2RlbC5wYXJzZVNjYWxlKCk7XG5cbiAgY29uc3Qgc2VsQ21wdHMgPSBtb2RlbC5jb21wb25lbnQuc2VsZWN0aW9uID0gc2VsZWN0aW9uLnBhcnNlVW5pdFNlbGVjdGlvbihtb2RlbCwge1xuICAgIFwib25lXCI6IHtcInR5cGVcIjogXCJpbnRlcnZhbFwiLCBcImVuY29kaW5nc1wiOiBbXCJ4XCJdLCBcInRyYW5zbGF0ZVwiOiBmYWxzZSwgXCJ6b29tXCI6IGZhbHNlfSxcbiAgICBcInR3b1wiOiB7XG4gICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgXCJlbmNvZGluZ3NcIjogW1wieVwiXSxcbiAgICAgIFwiYmluZFwiOiBcInNjYWxlc1wiLFxuICAgICAgXCJ0cmFuc2xhdGVcIjogZmFsc2UsXG4gICAgICBcInpvb21cIjogZmFsc2VcbiAgICB9LFxuICAgIFwidGhyLWVlXCI6IHtcbiAgICAgIFwidHlwZVwiOiBcImludGVydmFsXCIsXG4gICAgICBcIm9uXCI6IFwiW21vdXNlZG93biwgbW91c2V1cF0gPiBtb3VzZW1vdmUsIFtrZXlkb3duLCBrZXl1cF0gPiBrZXlwcmVzc1wiLFxuICAgICAgXCJ0cmFuc2xhdGVcIjogZmFsc2UsXG4gICAgICBcInpvb21cIjogZmFsc2UsXG4gICAgICBcInJlc29sdmVcIjogXCJpbnRlcnNlY3RcIixcbiAgICAgIFwibWFya1wiOiB7XG4gICAgICAgIFwiZmlsbFwiOiBcInJlZFwiLFxuICAgICAgICBcImZpbGxPcGFjaXR5XCI6IDAuNzUsXG4gICAgICAgIFwic3Ryb2tlXCI6IFwiYmxhY2tcIixcbiAgICAgICAgXCJzdHJva2VXaWR0aFwiOiA0LFxuICAgICAgICBcInN0cm9rZURhc2hcIjogWzEwLCA1XSxcbiAgICAgICAgXCJzdHJva2VEYXNoT2Zmc2V0XCI6IDMsXG4gICAgICAgIFwic3Ryb2tlT3BhY2l0eVwiOiAwLjI1XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBkZXNjcmliZSgnVHVwbGUgU2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgIGl0KCdidWlsZHMgcHJvamVjdGlvbiBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBvbmVTZyA9IGludGVydmFsLnNpZ25hbHMobW9kZWwsIHNlbENtcHRzWydvbmUnXSk7XG4gICAgICBhc3NlcnQuaW5jbHVkZURlZXBNZW1iZXJzKG9uZVNnLCBbe1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfeFwiLFxuICAgICAgICBcInZhbHVlXCI6IFtdLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdtb3VzZWRvd24nLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3godW5pdCksIHgodW5pdCldXCJcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ1ttb3VzZWRvd24sIHdpbmRvdzptb3VzZXVwXSA+IHdpbmRvdzptb3VzZW1vdmUhJywgJ3Njb3BlJylbMF0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcIltvbmVfeFswXSwgY2xhbXAoeCh1bml0KSwgMCwgd2lkdGgpXVwiXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJvbmVfc2NhbGVfdHJpZ2dlclwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3NjYWxlKFxcXCJ4XFxcIiwgb25lX0hvcnNlcG93ZXJbMF0pLCBzY2FsZShcXFwieFxcXCIsIG9uZV9Ib3JzZXBvd2VyWzFdKV1cIlxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSwge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfSG9yc2Vwb3dlclwiLFxuICAgICAgICBcIm9uXCI6IFt7XG4gICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwib25lX3hcIn0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjogXCJvbmVfeFswXSA9PT0gb25lX3hbMV0gPyBudWxsIDogaW52ZXJ0KFxcXCJ4XFxcIiwgb25lX3gpXCJcbiAgICAgICAgfV1cbiAgICAgIH0sIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX3NjYWxlX3RyaWdnZXJcIixcbiAgICAgICAgXCJ1cGRhdGVcIjogXCIoIWlzQXJyYXkob25lX0hvcnNlcG93ZXIpIHx8ICgraW52ZXJ0KFxcXCJ4XFxcIiwgb25lX3gpWzBdID09PSArb25lX0hvcnNlcG93ZXJbMF0gJiYgK2ludmVydChcXFwieFxcXCIsIG9uZV94KVsxXSA9PT0gK29uZV9Ib3JzZXBvd2VyWzFdKSkgPyBvbmVfc2NhbGVfdHJpZ2dlciA6IHt9XCJcbiAgICAgIH1dKTtcblxuICAgICAgY29uc3QgdHdvU2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyh0d29TZywgW3tcbiAgICAgICAgXCJuYW1lXCI6IFwidHdvX01pbGVzX3Blcl9HYWxsb25cIixcbiAgICAgICAgXCJvblwiOiBbXVxuICAgICAgfV0pO1xuXG4gICAgICBjb25zdCB0aHJlZVNnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3Rocl9lZSddKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnModGhyZWVTZywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX3hcIixcbiAgICAgICAgICBcInZhbHVlXCI6IFtdLFxuICAgICAgICAgIFwib25cIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdtb3VzZWRvd24nLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbeCh1bml0KSwgeCh1bml0KV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3RvcignW21vdXNlZG93biwgbW91c2V1cF0gPiBtb3VzZW1vdmUnLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbdGhyX2VlX3hbMF0sIGNsYW1wKHgodW5pdCksIDAsIHdpZHRoKV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3Rvcigna2V5ZG93bicsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt4KHVuaXQpLCB4KHVuaXQpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdba2V5ZG93biwga2V5dXBdID4ga2V5cHJlc3MnLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbdGhyX2VlX3hbMF0sIGNsYW1wKHgodW5pdCksIDAsIHdpZHRoKV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidGhyX2VlX3NjYWxlX3RyaWdnZXJcIn0sXG4gICAgICAgICAgICAgIFwidXBkYXRlXCI6IFwiW3NjYWxlKFxcXCJ4XFxcIiwgdGhyX2VlX0hvcnNlcG93ZXJbMF0pLCBzY2FsZShcXFwieFxcXCIsIHRocl9lZV9Ib3JzZXBvd2VyWzFdKV1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInRocl9lZV9Ib3JzZXBvd2VyXCIsXG4gICAgICAgICAgXCJvblwiOiBbe1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidGhyX2VlX3hcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcInRocl9lZV94WzBdID09PSB0aHJfZWVfeFsxXSA/IG51bGwgOiBpbnZlcnQoXFxcInhcXFwiLCB0aHJfZWVfeClcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfeVwiLFxuICAgICAgICAgIFwidmFsdWVcIjogW10sXG4gICAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHBhcnNlU2VsZWN0b3IoJ21vdXNlZG93bicsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt5KHVuaXQpLCB5KHVuaXQpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdbbW91c2Vkb3duLCBtb3VzZXVwXSA+IG1vdXNlbW92ZScsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt0aHJfZWVfeVswXSwgY2xhbXAoeSh1bml0KSwgMCwgaGVpZ2h0KV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJldmVudHNcIjogcGFyc2VTZWxlY3Rvcigna2V5ZG93bicsICdzY29wZScpWzBdLFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIlt5KHVuaXQpLCB5KHVuaXQpXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImV2ZW50c1wiOiBwYXJzZVNlbGVjdG9yKCdba2V5ZG93biwga2V5dXBdID4ga2V5cHJlc3MnLCAnc2NvcGUnKVswXSxcbiAgICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJbdGhyX2VlX3lbMF0sIGNsYW1wKHkodW5pdCksIDAsIGhlaWdodCldXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInRocl9lZV9zY2FsZV90cmlnZ2VyXCJ9LFxuICAgICAgICAgICAgICBcInVwZGF0ZVwiOiBcIltzY2FsZShcXFwieVxcXCIsIHRocl9lZV9NaWxlc19wZXJfR2FsbG9uWzBdKSwgc2NhbGUoXFxcInlcXFwiLCB0aHJfZWVfTWlsZXNfcGVyX0dhbGxvblsxXSldXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJfZWVfTWlsZXNfcGVyX0dhbGxvblwiLFxuICAgICAgICAgIFwib25cIjogW3tcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcInRocl9lZV95XCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogXCJ0aHJfZWVfeVswXSA9PT0gdGhyX2VlX3lbMV0gPyBudWxsIDogaW52ZXJ0KFxcXCJ5XFxcIiwgdGhyX2VlX3kpXCJcbiAgICAgICAgICB9XVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX3NjYWxlX3RyaWdnZXJcIixcbiAgICAgICAgICBcInVwZGF0ZVwiOiBcIighaXNBcnJheSh0aHJfZWVfSG9yc2Vwb3dlcikgfHwgKCtpbnZlcnQoXFxcInhcXFwiLCB0aHJfZWVfeClbMF0gPT09ICt0aHJfZWVfSG9yc2Vwb3dlclswXSAmJiAraW52ZXJ0KFxcXCJ4XFxcIiwgdGhyX2VlX3gpWzFdID09PSArdGhyX2VlX0hvcnNlcG93ZXJbMV0pKSAmJiAoIWlzQXJyYXkodGhyX2VlX01pbGVzX3Blcl9HYWxsb24pIHx8ICgraW52ZXJ0KFxcXCJ5XFxcIiwgdGhyX2VlX3kpWzBdID09PSArdGhyX2VlX01pbGVzX3Blcl9HYWxsb25bMF0gJiYgK2ludmVydChcXFwieVxcXCIsIHRocl9lZV95KVsxXSA9PT0gK3Rocl9lZV9NaWxlc19wZXJfR2FsbG9uWzFdKSkgPyB0aHJfZWVfc2NhbGVfdHJpZ2dlciA6IHt9XCJcbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnYnVpbGRzIHRyaWdnZXIgc2lnbmFscycsIGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3Qgb25lU2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0c1snb25lJ10pO1xuICAgICAgYXNzZXJ0LmluY2x1ZGVEZWVwTWVtYmVycyhvbmVTZywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwib25lX3R1cGxlXCIsXG4gICAgICAgICAgXCJvblwiOiBbe1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNpZ25hbFwiOiBcIm9uZV9Ib3JzZXBvd2VyXCJ9XSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IFwib25lX0hvcnNlcG93ZXIgPyB7dW5pdDogXFxcIlxcXCIsIGludGVydmFsczogW3tlbmNvZGluZzogXFxcInhcXFwiLCBmaWVsZDogXFxcIkhvcnNlcG93ZXJcXFwiLCBleHRlbnQ6IG9uZV9Ib3JzZXBvd2VyfV19IDogbnVsbFwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgXSk7XG5cbiAgICAgIGNvbnN0IHR3b1NnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3R3byddKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnModHdvU2csIFtcbiAgICAgICAge1xuICAgICAgICAgIFwibmFtZVwiOiBcInR3b190dXBsZVwiLFxuICAgICAgICAgIFwib25cIjogW3tcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IFt7XCJzaWduYWxcIjogXCJ0d29fTWlsZXNfcGVyX0dhbGxvblwifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcInR3b19NaWxlc19wZXJfR2FsbG9uID8ge3VuaXQ6IFxcXCJcXFwiLCBpbnRlcnZhbHM6IFt7ZW5jb2Rpbmc6IFxcXCJ5XFxcIiwgZmllbGQ6IFxcXCJNaWxlcy1wZXItR2FsbG9uXFxcIiwgZXh0ZW50OiB0d29fTWlsZXNfcGVyX0dhbGxvbn1dfSA6IG51bGxcIlxuICAgICAgICAgIH1dXG4gICAgICAgIH1cbiAgICAgIF0pO1xuXG4gICAgICBjb25zdCB0aHJlZVNnID0gaW50ZXJ2YWwuc2lnbmFscyhtb2RlbCwgc2VsQ21wdHNbJ3Rocl9lZSddKTtcbiAgICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnModGhyZWVTZywgW1xuICAgICAgICB7XG4gICAgICAgICAgXCJuYW1lXCI6IFwidGhyX2VlX3R1cGxlXCIsXG4gICAgICAgICAgXCJvblwiOiBbe1xuICAgICAgICAgICAgXCJldmVudHNcIjogW3tcInNpZ25hbFwiOiBcInRocl9lZV9Ib3JzZXBvd2VyXCJ9LCB7XCJzaWduYWxcIjogXCJ0aHJfZWVfTWlsZXNfcGVyX0dhbGxvblwifV0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBcInRocl9lZV9Ib3JzZXBvd2VyICYmIHRocl9lZV9NaWxlc19wZXJfR2FsbG9uID8ge3VuaXQ6IFxcXCJcXFwiLCBpbnRlcnZhbHM6IFt7ZW5jb2Rpbmc6IFxcXCJ4XFxcIiwgZmllbGQ6IFxcXCJIb3JzZXBvd2VyXFxcIiwgZXh0ZW50OiB0aHJfZWVfSG9yc2Vwb3dlcn0sIHtlbmNvZGluZzogXFxcInlcXFwiLCBmaWVsZDogXFxcIk1pbGVzLXBlci1HYWxsb25cXFwiLCBleHRlbnQ6IHRocl9lZV9NaWxlc19wZXJfR2FsbG9ufV19IDogbnVsbFwiXG4gICAgICAgICAgfV1cbiAgICAgICAgfVxuICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdCgnbmFtZXNwYWNlcyBzaWduYWxzIHdoZW4gZW5jb2RpbmcvZmllbGRzIGNvbGxpZGUnLCBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IG1vZGVsMiA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICAgXCJtYXJrXCI6IFwiY2lyY2xlXCIsXG4gICAgICAgIFwiZW5jb2RpbmdcIjoge1xuICAgICAgICAgIFwieFwiOiB7XCJmaWVsZFwiOiBcInhcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9LFxuICAgICAgICAgIFwieVwiOiB7XCJmaWVsZFwiOiBcInlcIiwgXCJ0eXBlXCI6IFwicXVhbnRpdGF0aXZlXCJ9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBzZWxDbXB0czIgPSBtb2RlbDIuY29tcG9uZW50LnNlbGVjdGlvbiA9IHNlbGVjdGlvbi5wYXJzZVVuaXRTZWxlY3Rpb24obW9kZWwyLCB7XG4gICAgICAgIFwib25lXCI6IHtcbiAgICAgICAgICBcInR5cGVcIjogXCJpbnRlcnZhbFwiLFxuICAgICAgICAgIFwiZW5jb2RpbmdzXCI6IFtcInhcIl0sXG4gICAgICAgICAgXCJ0cmFuc2xhdGVcIjogZmFsc2UsIFwiem9vbVwiOiBmYWxzZVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgc2cgPSBpbnRlcnZhbC5zaWduYWxzKG1vZGVsLCBzZWxDbXB0czJbJ29uZSddKTtcbiAgICAgIGFzc2VydC5lcXVhbChzZ1swXS5uYW1lLCAnb25lX3gnKTtcbiAgICAgIGFzc2VydC5lcXVhbChzZ1sxXS5uYW1lLCAnb25lX3hfMScpO1xuICAgIH0pO1xuICB9KTtcblxuICBpdCgnYnVpbGRzIG1vZGlmeSBzaWduYWxzJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3Qgb25lRXhwciA9IGludGVydmFsLm1vZGlmeUV4cHIobW9kZWwsIHNlbENtcHRzWydvbmUnXSk7XG4gICAgYXNzZXJ0LmVxdWFsKG9uZUV4cHIsICdvbmVfdHVwbGUsIHRydWUnKTtcblxuICAgIGNvbnN0IHR3b0V4cHIgPSBpbnRlcnZhbC5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1sndHdvJ10pO1xuICAgIGFzc2VydC5lcXVhbCh0d29FeHByLCAndHdvX3R1cGxlLCB0cnVlJyk7XG5cbiAgICBjb25zdCB0aHJlZUV4cHIgPSBpbnRlcnZhbC5tb2RpZnlFeHByKG1vZGVsLCBzZWxDbXB0c1sndGhyX2VlJ10pO1xuICAgIGFzc2VydC5lcXVhbCh0aHJlZUV4cHIsICd0aHJfZWVfdHVwbGUsIHt1bml0OiBcXFwiXFxcIn0nKTtcblxuICAgIGNvbnN0IHNpZ25hbHMgPSBzZWxlY3Rpb24uYXNzZW1ibGVVbml0U2VsZWN0aW9uU2lnbmFscyhtb2RlbCwgW10pO1xuICAgIGFzc2VydC5pbmNsdWRlRGVlcE1lbWJlcnMoc2lnbmFscywgW1xuICAgICAge1xuICAgICAgICBcIm5hbWVcIjogXCJvbmVfbW9kaWZ5XCIsXG4gICAgICAgIFwib25cIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwiZXZlbnRzXCI6IHtcInNpZ25hbFwiOiBcIm9uZV90dXBsZVwifSxcbiAgICAgICAgICAgIFwidXBkYXRlXCI6IGBtb2RpZnkoXFxcIm9uZV9zdG9yZVxcXCIsICR7b25lRXhwcn0pYFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwidHdvX21vZGlmeVwiLFxuICAgICAgICBcIm9uXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImV2ZW50c1wiOiB7XCJzaWduYWxcIjogXCJ0d29fdHVwbGVcIn0sXG4gICAgICAgICAgICBcInVwZGF0ZVwiOiBgbW9kaWZ5KFxcXCJ0d29fc3RvcmVcXFwiLCAke3R3b0V4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInRocl9lZV9tb2RpZnlcIixcbiAgICAgICAgXCJvblwiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJldmVudHNcIjoge1wic2lnbmFsXCI6IFwidGhyX2VlX3R1cGxlXCJ9LFxuICAgICAgICAgICAgXCJ1cGRhdGVcIjogYG1vZGlmeShcXFwidGhyX2VlX3N0b3JlXFxcIiwgJHt0aHJlZUV4cHJ9KWBcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG5cbiAgaXQoJ2J1aWxkcyBicnVzaCBtYXJrJywgZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgbWFya3M6IGFueVtdID0gW3toZWxsbzogXCJ3b3JsZFwifV07XG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhpbnRlcnZhbC5tYXJrcyhtb2RlbCwgc2VsQ21wdHNbJ29uZSddLCBtYXJrcyksIFtcbiAgICAgIHtcbiAgICAgICAgXCJuYW1lXCI6IFwib25lX2JydXNoX2JnXCIsXG4gICAgICAgIFwidHlwZVwiOiBcInJlY3RcIixcbiAgICAgICAgXCJjbGlwXCI6IHRydWUsXG4gICAgICAgIFwiZW5jb2RlXCI6IHtcbiAgICAgICAgICBcImVudGVyXCI6IHtcbiAgICAgICAgICAgIFwiZmlsbFwiOiB7XCJ2YWx1ZVwiOiBcIiMzMzNcIn0sXG4gICAgICAgICAgICBcImZpbGxPcGFjaXR5XCI6IHtcInZhbHVlXCI6IDAuMTI1fVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJ4XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwib25lX3hbMF1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInlcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieDJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJvbmVfeFsxXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieTJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiB7XG4gICAgICAgICAgICAgICAgICBcImdyb3VwXCI6IFwiaGVpZ2h0XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcImhlbGxvXCI6IFwid29ybGRcIn0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcIm9uZV9icnVzaFwiLFxuICAgICAgICBcInR5cGVcIjogXCJyZWN0XCIsXG4gICAgICAgIFwiY2xpcFwiOiB0cnVlLFxuICAgICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgICAgXCJlbnRlclwiOiB7XG4gICAgICAgICAgICBcImZpbGxcIjoge1widmFsdWVcIjogXCJ0cmFuc3BhcmVudFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJzdHJva2VcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwib25lX3hbMF0gIT09IG9uZV94WzFdXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiBcIndoaXRlXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ4XCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcImRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpLmxlbmd0aCAmJiBkYXRhKFxcXCJvbmVfc3RvcmVcXFwiKVswXS51bml0ID09PSBcXFwiXFxcIlwiLFxuICAgICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwib25lX3hbMF1cIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInlcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieDJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJvbmVfeFsxXVwiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwieTJcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwiZGF0YShcXFwib25lX3N0b3JlXFxcIikubGVuZ3RoICYmIGRhdGEoXFxcIm9uZV9zdG9yZVxcXCIpWzBdLnVuaXQgPT09IFxcXCJcXFwiXCIsXG4gICAgICAgICAgICAgICAgXCJmaWVsZFwiOiB7XG4gICAgICAgICAgICAgICAgICBcImdyb3VwXCI6IFwiaGVpZ2h0XCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDBcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIF0pO1xuXG4gICAgLy8gU2NhbGUtYm91bmQgaW50ZXJ2YWwgc2VsZWN0aW9ucyBzaG91bGQgbm90IGFkZCBhIGJydXNoIG1hcmsuXG4gICAgYXNzZXJ0LnNhbWVEZWVwTWVtYmVycyhpbnRlcnZhbC5tYXJrcyhtb2RlbCwgc2VsQ21wdHNbJ3R3byddLCBtYXJrcyksIG1hcmtzKTtcblxuICAgIGFzc2VydC5zYW1lRGVlcE1lbWJlcnMoaW50ZXJ2YWwubWFya3MobW9kZWwsIHNlbENtcHRzWyd0aHJfZWUnXSwgbWFya3MpLCBbXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInRocl9lZV9icnVzaF9iZ1wiLFxuICAgICAgICBcInR5cGVcIjogXCJyZWN0XCIsXG4gICAgICAgIFwiY2xpcFwiOiB0cnVlLFxuICAgICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgICAgXCJlbnRlclwiOiB7XG4gICAgICAgICAgICBcImZpbGxcIjoge1widmFsdWVcIjogXCJyZWRcIn0sXG4gICAgICAgICAgICBcImZpbGxPcGFjaXR5XCI6IHtcInZhbHVlXCI6IDAuNzV9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBcInVwZGF0ZVwiOiB7XG4gICAgICAgICAgICBcInhcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV94WzBdXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcInlcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV95WzBdXCJcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBcIngyXCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeFsxXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5MlwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3lbMV1cIlxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIHtcImhlbGxvXCI6IFwid29ybGRcIn0sXG4gICAgICB7XG4gICAgICAgIFwibmFtZVwiOiBcInRocl9lZV9icnVzaFwiLFxuICAgICAgICBcInR5cGVcIjogXCJyZWN0XCIsXG4gICAgICAgIFwiY2xpcFwiOiB0cnVlLFxuICAgICAgICBcImVuY29kZVwiOiB7XG4gICAgICAgICAgXCJlbnRlclwiOiB7XG4gICAgICAgICAgICBcImZpbGxcIjoge1widmFsdWVcIjogXCJ0cmFuc3BhcmVudFwifVxuICAgICAgICAgIH0sXG4gICAgICAgICAgXCJ1cGRhdGVcIjoge1xuICAgICAgICAgICAgXCJzdHJva2VcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwidGhyX2VlX3hbMF0gIT09IHRocl9lZV94WzFdICYmIHRocl9lZV95WzBdICE9PSB0aHJfZWVfeVsxXVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogXCJibGFja1wiXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcInZhbHVlXCI6IG51bGx9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJzdHJva2VXaWR0aFwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJ0aHJfZWVfeFswXSAhPT0gdGhyX2VlX3hbMV0gJiYgdGhyX2VlX3lbMF0gIT09IHRocl9lZV95WzFdXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiA0XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcInZhbHVlXCI6IG51bGx9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJzdHJva2VEYXNoXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwidGVzdFwiOiBcInRocl9lZV94WzBdICE9PSB0aHJfZWVfeFsxXSAmJiB0aHJfZWVfeVswXSAhPT0gdGhyX2VlX3lbMV1cIixcbiAgICAgICAgICAgICAgICBcInZhbHVlXCI6IFsxMCwgNV1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1widmFsdWVcIjogbnVsbH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBcInN0cm9rZURhc2hPZmZzZXRcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJ0ZXN0XCI6IFwidGhyX2VlX3hbMF0gIT09IHRocl9lZV94WzFdICYmIHRocl9lZV95WzBdICE9PSB0aHJfZWVfeVsxXVwiLFxuICAgICAgICAgICAgICAgIFwidmFsdWVcIjogM1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XCJ2YWx1ZVwiOiBudWxsfVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFwic3Ryb2tlT3BhY2l0eVwiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcInRlc3RcIjogXCJ0aHJfZWVfeFswXSAhPT0gdGhyX2VlX3hbMV0gJiYgdGhyX2VlX3lbMF0gIT09IHRocl9lZV95WzFdXCIsXG4gICAgICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwLjI1XG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcInZhbHVlXCI6IG51bGx9XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgXCJ4XCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeFswXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ5XCI6IHtcbiAgICAgICAgICAgICAgXCJzaWduYWxcIjogXCJ0aHJfZWVfeVswXVwiXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgXCJ4MlwiOiB7XG4gICAgICAgICAgICAgIFwic2lnbmFsXCI6IFwidGhyX2VlX3hbMV1cIlxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIFwieTJcIjoge1xuICAgICAgICAgICAgICBcInNpZ25hbFwiOiBcInRocl9lZV95WzFdXCJcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICBdKTtcbiAgfSk7XG59KTtcbiJdfQ==