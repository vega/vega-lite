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
            "color": { "field": "Origin", "type": "nominal" }
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
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: "world" }];
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
        var model = getModel('line');
        var selCmpts = model.component.selection;
        var marks = [{ name: "pathgroup", hello: "world", marks: [{ foo: "bar" }] }];
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
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: "world" }];
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9uZWFyZXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUN0RSw2RUFBd0U7QUFDeEUsbUNBQTBDO0FBRTFDLGtCQUFrQixRQUFhO0lBQzdCLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ3pELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDOUQsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDO1FBQzFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQztRQUN6QyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUM7UUFDOUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDO1FBQzVDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7S0FDMUIsQ0FBQyxDQUFDO0lBRUgsTUFBTSxDQUFDLEtBQUssQ0FBQztBQUNmLENB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