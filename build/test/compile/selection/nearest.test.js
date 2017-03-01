/* tslint:disable quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var selection = require("../../../src/compile/selection/selection");
var nearest_1 = require("../../../src/compile/selection/transforms/nearest");
function getModel(markType) {
    var model = util_1.parseUnitModel({
        "mark": markType,
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "N" }
        }
    });
    model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "single", "nearest": true },
        "two": { "type": "multi", "nearest": true },
        "three": { "type": "interval", "nearest": true },
        "four": { "type": "single", "nearest": false },
        "five": { "type": "multi" }
    });
    return model;
}
describe('Nearest Selection Transform', function () {
    it('identifies transform invocation', function () {
        var selCmpts = getModel('circle').component.selection;
        chai_1.assert.isTrue(nearest_1.default.has(selCmpts['one']));
        chai_1.assert.isTrue(nearest_1.default.has(selCmpts['two']));
        chai_1.assert.isTrue(nearest_1.default.has(selCmpts['three']));
        chai_1.assert.isFalse(nearest_1.default.has(selCmpts['four']));
        chai_1.assert.isFalse(nearest_1.default.has(selCmpts['five']));
    });
    it('adds voronoi for non-path marks', function () {
        var model = getModel('circle'), selCmpts = model.component.selection, marks = [{ hello: "world" }];
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['one'], marks, marks), [
            { hello: "world" },
            {
                "name": "voronoi",
                "type": "path",
                "from": { "data": "marks" },
                "encode": {
                    "enter": {
                        "fill": { "value": "transparent" },
                        "strokeWidth": { "value": 0.35 },
                        "stroke": { "value": "transparent" },
                        "isVoronoi": { "value": true }
                    }
                },
                "transform": [
                    {
                        "type": "voronoi",
                        "x": "datum.x",
                        "y": "datum.y",
                        "size": [{ "signal": "width" }, { "signal": "height" }]
                    }
                ]
            }
        ]);
    });
    it('adds voronoi for path marks', function () {
        var model = getModel('line'), selCmpts = model.component.selection, marks = [{ name: "pathgroup", hello: "world", marks: [{ foo: "bar" }] }];
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['one'], marks, marks), [
            {
                name: "pathgroup",
                hello: "world",
                marks: [
                    { foo: "bar" },
                    {
                        "name": "voronoi",
                        "type": "path",
                        "from": { "data": "marks" },
                        "encode": {
                            "enter": {
                                "fill": { "value": "transparent" },
                                "strokeWidth": { "value": 0.35 },
                                "stroke": { "value": "transparent" },
                                "isVoronoi": { "value": true }
                            }
                        },
                        "transform": [
                            {
                                "type": "voronoi",
                                "x": "datum.x",
                                "y": "datum.y",
                                "size": [{ "signal": "width" }, { "signal": "height" }]
                            }
                        ]
                    }
                ]
            }
        ]);
    });
    it('limits to a single voronoi per unit', function () {
        var model = getModel('circle'), selCmpts = model.component.selection, marks = [{ hello: "world" }];
        var marks2 = nearest_1.default.marks(model, selCmpts['one'], marks, marks);
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['two'], marks, marks2), [
            { hello: "world" },
            {
                "name": "voronoi",
                "type": "path",
                "from": { "data": "marks" },
                "encode": {
                    "enter": {
                        "fill": { "value": "transparent" },
                        "strokeWidth": { "value": 0.35 },
                        "stroke": { "value": "transparent" },
                        "isVoronoi": { "value": true }
                    }
                },
                "transform": [
                    {
                        "type": "voronoi",
                        "x": "datum.x",
                        "y": "datum.y",
                        "size": [{ "signal": "width" }, { "signal": "height" }]
                    }
                ]
            }
        ]);
        model = getModel('line');
        selCmpts = model.component.selection;
        marks = [{ name: "pathgroup", hello: "world", marks: [{ foo: "bar" }] }];
        marks2 = nearest_1.default.marks(model, selCmpts['one'], marks, marks);
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['two'], marks, marks2), [
            {
                name: "pathgroup",
                hello: "world",
                marks: [
                    { foo: "bar" },
                    {
                        "name": "voronoi",
                        "type": "path",
                        "from": { "data": "marks" },
                        "encode": {
                            "enter": {
                                "fill": { "value": "transparent" },
                                "strokeWidth": { "value": 0.35 },
                                "stroke": { "value": "transparent" },
                                "isVoronoi": { "value": true }
                            }
                        },
                        "transform": [
                            {
                                "type": "voronoi",
                                "x": "datum.x",
                                "y": "datum.y",
                                "size": [{ "signal": "width" }, { "signal": "height" }]
                            }
                        ]
                    }
                ]
            }
        ]);
    });
});
//# sourceMappingURL=nearest.test.js.map