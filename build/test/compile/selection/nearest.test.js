"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
var nearest_1 = require("../../../src/compile/selection/transforms/nearest");
var util_1 = require("../../util");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9uZWFyZXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUN0RSw2RUFBd0U7QUFDeEUsbUNBQTBDO0FBRTFDLGtCQUFrQixRQUFhO0lBQzdCLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ3pELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBQztTQUMxQztLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDOUQsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDO1FBQzFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQztRQUN6QyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUM7UUFDOUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDO1FBQzVDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENB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