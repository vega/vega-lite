/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var selection = require("../../../src/compile/selection/selection");
var multi_1 = require("../../../src/compile/selection/multi");
describe('Multi Selection', function () {
    var model = util_1.parseUnitModel({
        "mark": "circle",
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "N" }
        }
    });
    var selCmpts = model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "multi" },
        "two": {
            "type": "multi",
            "on": "mouseover", "toggle": "event.ctrlKey", "encodings": ["y", "color"]
        }
    });
    it('builds trigger signals', function () {
        var oneSg = multi_1.default.signals(model, selCmpts['one']);
        chai_1.assert.sameDeepMembers(oneSg, [{
                name: 'one',
                value: {},
                on: [{
                        events: selCmpts['one'].events,
                        update: "{fields: [\"_id\"], values: [(item().isVoronoi ? datum.datum : datum)[\"_id\"]]}"
                    }]
            }]);
        var twoSg = multi_1.default.signals(model, selCmpts['two']);
        chai_1.assert.sameDeepMembers(twoSg, [{
                name: 'two',
                value: {},
                on: [{
                        events: selCmpts['two'].events,
                        update: "{fields: [\"Miles_per_Gallon\", \"Origin\"], values: [(item().isVoronoi ? datum.datum : datum)[\"Miles_per_Gallon\"], (item().isVoronoi ? datum.datum : datum)[\"Origin\"]]}"
                    }]
            }]);
        var signals = selection.assembleUnitSignals(model, []);
        chai_1.assert.includeDeepMembers(signals, oneSg.concat(twoSg));
    });
    it('builds tuple signals', function () {
        var oneExpr = multi_1.default.tupleExpr(model, selCmpts['one']);
        chai_1.assert.equal(oneExpr, 'fields: one.fields, values: one.values');
        var twoExpr = multi_1.default.tupleExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'fields: two.fields, values: two.values');
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
            }
        ]);
    });
    // Skipped because "toggle" transforms the modifyExpr.
    it.skip('builds modify signals', function () {
        var oneExpr = multi_1.default.modifyExpr(model, selCmpts['one']);
        chai_1.assert.equal(oneExpr, 'one_tuple');
        var twoExpr = multi_1.default.modifyExpr(model, selCmpts['two']);
        chai_1.assert.equal(twoExpr, 'two_tuple');
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
            }
        ]);
    });
    it('builds unit datasets', function () {
        var data = [];
        chai_1.assert.sameDeepMembers(selection.assembleUnitData(model, data), [
            { name: 'one_store' }, { name: 'two_store' }
        ]);
    });
    it('leaves marks alone', function () {
        var marks = [];
        chai_1.assert.equal(selection.assembleUnitMarks(model, marks), marks);
    });
});
//# sourceMappingURL=multi.test.js.map