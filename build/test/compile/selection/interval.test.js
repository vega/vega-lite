/* tslint:disable quotemark */
"use strict";
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
                    "name": "one_x",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
                            "update": "[one_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        }
                    ]
                }]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [{
                    "name": "two_y",
                    "on": [],
                    "value": []
                }]);
            var threeSg = interval_1.default.signals(model, selCmpts['three']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "three_x",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[three_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[three_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        }
                    ]
                },
                {
                    "name": "three_y",
                    "value": [],
                    "on": [
                        {
                            "events": vega_event_selector_1.selector('mousedown', 'scope')[0],
                            "update": "invert(\"y\", [y(unit), y(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[three_y[0], invert(\"y\", clamp(y(unit), 0, height))]"
                        },
                        {
                            "events": vega_event_selector_1.selector('keydown', 'scope')[0],
                            "update": "invert(\"y\", [y(unit), y(unit)])"
                        },
                        {
                            "events": vega_event_selector_1.selector('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[three_y[0], invert(\"y\", clamp(y(unit), 0, height))]"
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
                    "update": "[{field: \"Horsepower\", extent: one_x}]"
                }
            ]);
            var twoSg = interval_1.default.signals(model, selCmpts['two']);
            chai_1.assert.includeDeepMembers(twoSg, [
                {
                    "name": "two",
                    "update": "[{field: \"Miles_per_Gallon\", extent: two_y}]"
                }
            ]);
            var threeSg = interval_1.default.signals(model, selCmpts['three']);
            chai_1.assert.includeDeepMembers(threeSg, [
                {
                    "name": "three",
                    "update": "[{field: \"Horsepower\", extent: three_x}, {field: \"Miles_per_Gallon\", extent: three_y}]"
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
        var signals = selection.assembleUnitSignals(model, []);
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
        var signals = selection.assembleUnitSignals(model, []);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vaW50ZXJ2YWwudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFDNUIsMkRBQThEO0FBRTlELG9FQUErRDtBQUMvRCxvRUFBc0U7QUFDdEUsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1FBQzNCLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLFVBQVUsRUFBRTtZQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxZQUFZLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUNuRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztZQUN6RCxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxHQUFHLEVBQUM7U0FDMUM7S0FDRixDQUFDLENBQUM7SUFDSCxLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7SUFFbkIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDLGtCQUFrQixDQUFDLEtBQUssRUFBRTtRQUMvRSxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLFdBQVcsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQztRQUNsRixLQUFLLEVBQUU7WUFDTCxNQUFNLEVBQUUsVUFBVTtZQUNsQixXQUFXLEVBQUUsQ0FBQyxHQUFHLENBQUM7WUFDbEIsTUFBTSxFQUFFLFFBQVE7WUFDaEIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsTUFBTSxFQUFFLEtBQUs7U0FDZDtRQUNELE9BQU8sRUFBRTtZ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