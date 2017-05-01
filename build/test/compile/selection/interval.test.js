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
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "N" }
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
        "three": {
            "type": "interval",
            "on": "[mousedown, mouseup] > mousemove, [keydown, keyup] > keypress",
            "translate": false,
            "zoom": false,
            "resolve": "intersect"
        }
    });
    describe('Trigger Signals', function () {
        it('builds projection signals', function () {
            var oneSg = interval_1.default.signals(model, selCmpts['one']);
            chai_1.assert.includeDeepMembers(oneSg, [{
                    "name": "one_Horsepower",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
                            "update": "[one_Horsepower[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        }
                    ]
                }]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [{
                    "name": "two_Miles_per_Gallon",
                    "on": [],
                    "value": []
                }]);
            var threeSg = interval_1.default.signals(model, selCmpts['three']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "three_Horsepower",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[three_Horsepower[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[three_Horsepower[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        }
                    ]
                },
                {
                    "name": "three_Miles_per_Gallon",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "invert(\"y\", [y(unit), y(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[three_Miles_per_Gallon[0], invert(\"y\", clamp(y(unit), 0, height))]"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "invert(\"y\", [y(unit), y(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[three_Miles_per_Gallon[0], invert(\"y\", clamp(y(unit), 0, height))]"
                        }
                    ]
                }
            ]);
        });
        it('builds size signals', function () {
            var oneSg = interval_1.default.signals(model, selCmpts['one']);
            chai_1.assert.includeDeepMembers(oneSg, [{
                    "name": "one_size",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
                            "update": "{x: one_size.x, y: one_size.y, width: abs(x(unit) - one_size.x), height: abs(y(unit) - one_size.y)}"
                        }
                    ]
                }]);
            // Skip twoSg because bindScales should remove the size.
            var threeSg = interval_1.default.signals(model, selCmpts['three']);
            chai_1.assert.includeDeepMembers(threeSg, [{
                    "name": "three_size",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "{x: three_size.x, y: three_size.y, width: abs(x(unit) - three_size.x), height: abs(y(unit) - three_size.y)}"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "{x: three_size.x, y: three_size.y, width: abs(x(unit) - three_size.x), height: abs(y(unit) - three_size.y)}"
                        }
                    ]
                }]);
        });
        it('builds trigger signals', function () {
            var oneSg = interval_1.default.signals(model, selCmpts['one']);
            chai_1.assert.includeDeepMembers(oneSg, [
                {
                    "name": "one",
                    "update": "[{encoding: \"x\", field: \"Horsepower\", extent: one_Horsepower}]"
                }
            ]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [
                {
                    "name": "two",
                    "update": "[{encoding: \"y\", field: \"Miles_per_Gallon\", extent: two_Miles_per_Gallon}]"
                }
            ]);
            var threeSg = interval_1.default.signals(model, selCmpts['three']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "three",
                    "update": "[{encoding: \"x\", field: \"Horsepower\", extent: three_Horsepower}, {encoding: \"y\", field: \"Miles_per_Gallon\", extent: three_Miles_per_Gallon}]"
                }
            ]);
        });
    });
    it('builds tuple signals', function () {
        var oneExpr = interval_1.default.tupleExpr(model, selCmpts['one']);
        chai_1.assert.equal(oneExpr, 'intervals: one');
        var twoExpr = interval_1.default.tupleExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'intervals: two');
        var threeExpr = interval_1.default.tupleExpr(model, selCmpts['three']);
        chai_1.assert.equal(threeExpr, 'intervals: three');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "one_tuple",
                "on": [
                    {
                        "events": { "signal": "one" },
                        "update": "{unit: unit.datum && unit.datum._id, " + oneExpr + "}"
                    }
                ]
            },
            {
                "name": "two_tuple",
                "on": [
                    {
                        "events": { "signal": "two" },
                        "update": "{unit: unit.datum && unit.datum._id, " + twoExpr + "}"
                    }
                ]
            },
            {
                "name": "three_tuple",
                "on": [
                    {
                        "events": { "signal": "three" },
                        "update": "{unit: unit.datum && unit.datum._id, " + threeExpr + "}"
                    }
                ]
            }
        ]);
    });
    it('builds modify signals', function () {
        var oneExpr = interval_1.default.modifyExpr(model, selCmpts['one']);
        chai_1.assert.equal(oneExpr, 'one_tuple, true');
        var twoExpr = interval_1.default.modifyExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'two_tuple, true');
        var threeExpr = interval_1.default.modifyExpr(model, selCmpts['three']);
        chai_1.assert.equal(threeExpr, 'three_tuple, {unit: three_tuple.unit}');
        var signals = selection.assembleUnitSelectionSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, [
            {
                "name": "one_modify",
                "on": [
                    {
                        "events": { "signal": "one" },
                        "update": "modify(\"one_store\", " + oneExpr + ")"
                    }
                ]
            },
            {
                "name": "two_modify",
                "on": [
                    {
                        "events": { "signal": "two" },
                        "update": "modify(\"two_store\", " + twoExpr + ")"
                    }
                ]
            },
            {
                "name": "three_modify",
                "on": [
                    {
                        "events": { "signal": "three" },
                        "update": "modify(\"three_store\", " + threeExpr + ")"
                    }
                ]
            }
        ]);
    });
    it('builds brush mark', function () {
        var marks = [{ hello: "world" }];
        chai_1.assert.sameDeepMembers(interval_1.default.marks(model, selCmpts['one'], marks), [
            {
                "name": undefined,
                "type": "rect",
                "encode": {
                    "enter": { "fill": { "value": "#eee" } },
                    "update": {
                        "x": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "scale": "x",
                                "signal": "one[0].extent[0]"
                            },
                            { "value": 0 }
                        ],
                        "x2": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "scale": "x",
                                "signal": "one[0].extent[1]"
                            },
                            { "value": 0 }
                        ],
                        "y": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "value": 0
                            },
                            { "value": 0 }
                        ],
                        "y2": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "field": { "group": "height" }
                            },
                            { "value": 0 }
                        ]
                    }
                }
            },
            { "hello": "world" },
            {
                "name": "one_brush",
                "type": "rect",
                "encode": {
                    "enter": { "fill": { "value": "transparent" } },
                    "update": {
                        "x": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "scale": "x",
                                "signal": "one[0].extent[0]"
                            },
                            { "value": 0 }
                        ],
                        "x2": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "scale": "x",
                                "signal": "one[0].extent[1]"
                            },
                            { "value": 0 }
                        ],
                        "y": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "value": 0
                            },
                            { "value": 0 }
                        ],
                        "y2": [
                            {
                                "test": "data(\"one_store\").length && one_tuple && one_tuple.unit === data(\"one_store\")[0].unit",
                                "field": { "group": "height" }
                            },
                            { "value": 0 }
                        ]
                    }
                }
            }
        ]);
        // Scale-bound interval selections should not add a brush mark.
        chai_1.assert.sameDeepMembers(interval_1.default.marks(model, selCmpts['two'], marks), marks);
        chai_1.assert.sameDeepMembers(interval_1.default.marks(model, selCmpts['three'], marks), [
            {
                "name": undefined,
                "type": "rect",
                "encode": {
                    "enter": { "fill": { "value": "#eee" } },
                    "update": {
                        "x": {
                            "scale": "x",
                            "signal": "three[0].extent[0]"
                        },
                        "x2": {
                            "scale": "x",
                            "signal": "three[0].extent[1]"
                        },
                        "y": {
                            "scale": "y",
                            "signal": "three[1].extent[0]"
                        },
                        "y2": {
                            "scale": "y",
                            "signal": "three[1].extent[1]"
                        }
                    }
                }
            },
            { "hello": "world" },
            {
                "name": "three_brush",
                "type": "rect",
                "encode": {
                    "enter": { "fill": { "value": "transparent" } },
                    "update": {
                        "x": {
                            "scale": "x",
                            "signal": "three[0].extent[0]"
                        },
                        "x2": {
                            "scale": "x",
                            "signal": "three[0].extent[1]"
                        },
                        "y": {
                            "scale": "y",
                            "signal": "three[1].extent[0]"
                        },
                        "y2": {
                            "scale": "y",
                            "signal": "three[1].extent[1]"
                        }
                    }
                }
            }
        ]);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBRTlELG9FQUErRDtBQUMvRCxvRUFBc0U7QUFDdEUsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7U0FDMUM7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztRQUNsRixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDbEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELE9BQU8sRUFBRTtZ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