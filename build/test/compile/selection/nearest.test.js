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
        "five": { "type": "multi" },
        "six": { "type": "multi", "nearest": null }
    });
    return model;
}
describe('Nearest Selection Transform', function () {
    it('identifies transform invocation', function () {
        var selCmpts = getModel('circle').component.selection;
        chai_1.assert.isNotFalse(nearest_1.default.has(selCmpts['one']));
        chai_1.assert.isNotFalse(nearest_1.default.has(selCmpts['two']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['three']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['four']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['five']));
        chai_1.assert.isNotTrue(nearest_1.default.has(selCmpts['six']));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9uZWFyZXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUN0RSw2RUFBd0U7QUFDeEUsbUNBQTBDO0FBRTFDLGtCQUFrQixRQUFhO0lBQzdCLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7UUFDM0IsTUFBTSxFQUFFLFFBQVE7UUFDaEIsVUFBVSxFQUFFO1lBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ25ELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxrQkFBa0IsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO1lBQ3pELE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztTQUNoRDtLQUNGLENBQUMsQ0FBQztJQUVILEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7UUFDOUQsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDO1FBQzFDLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQztRQUN6QyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUM7UUFDOUMsTUFBTSxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDO1FBQzVDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUM7UUFDekIsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVB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