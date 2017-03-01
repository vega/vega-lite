/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var event_selector_1 = require("vega-parser/src/parsers/event-selector");
var selection = require("../../../src/compile/selection/selection");
var interval_1 = require("../../../src/compile/selection/interval");
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
            "zoom": false
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
                            "events": event_selector_1.default('mousedown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": event_selector_1.default('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
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
                            "events": event_selector_1.default('mousedown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": event_selector_1.default('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[three_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        },
                        {
                            "events": event_selector_1.default('keydown', 'scope')[0],
                            "update": "invert(\"x\", [x(unit), x(unit)])"
                        },
                        {
                            "events": event_selector_1.default('[keydown, keyup] > keypress', 'scope')[0],
                            "update": "[three_x[0], invert(\"x\", clamp(x(unit), 0, width))]"
                        }
                    ]
                },
                {
                    "name": "three_y",
                    "value": [],
                    "on": [
                        {
                            "events": event_selector_1.default('mousedown', 'scope')[0],
                            "update": "invert(\"y\", [y(unit), y(unit)])"
                        },
                        {
                            "events": event_selector_1.default('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "[three_y[0], invert(\"y\", clamp(y(unit), 0, height))]"
                        },
                        {
                            "events": event_selector_1.default('keydown', 'scope')[0],
                            "update": "invert(\"y\", [y(unit), y(unit)])"
                        },
                        {
                            "events": event_selector_1.default('[keydown, keyup] > keypress', 'scope')[0],
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
                            "events": event_selector_1.default('mousedown', 'scope')[0],
                            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
                        },
                        {
                            "events": event_selector_1.default('[mousedown, window:mouseup] > window:mousemove!', 'scope')[0],
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
                            "events": event_selector_1.default('mousedown', 'scope')[0],
                            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
                        },
                        {
                            "events": event_selector_1.default('[mousedown, mouseup] > mousemove', 'scope')[0],
                            "update": "{x: three_size.x, y: three_size.y, width: abs(x(unit) - three_size.x), height: abs(y(unit) - three_size.y)}"
                        },
                        {
                            "events": event_selector_1.default('keydown', 'scope')[0],
                            "update": "{x: x(unit), y: y(unit), width: 0, height: 0}"
                        },
                        {
                            "events": event_selector_1.default('[keydown, keyup] > keypress', 'scope')[0],
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
        chai_1.assert.equal(oneExpr, 'one_tuple, {unit: one_tuple.unit}');
        var twoExpr = interval_1.default.modifyExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'two_tuple, {unit: two_tuple.unit}');
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
                        "x": {
                            "scale": "x",
                            "signal": "one[0].extent[0]"
                        },
                        "x2": {
                            "scale": "x",
                            "signal": "one[0].extent[1]"
                        },
                        "y": { "value": 0 },
                        "y2": { "field": { "group": "height" } }
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
                        "x": {
                            "scale": "x",
                            "signal": "one[0].extent[0]"
                        },
                        "x2": {
                            "scale": "x",
                            "signal": "one[0].extent[1]"
                        },
                        "y": { "value": 0 },
                        "y2": { "field": { "group": "height" } }
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
//# sourceMappingURL=interval.test.js.map