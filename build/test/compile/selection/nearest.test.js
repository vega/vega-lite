"use strict";
/* tslint:disable quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var selection = require("../../../src/compile/selection/selection");
var nearest_1 = require("../../../src/compile/selection/transforms/nearest");
var log = require("../../../src/log");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
function getModel(markType) {
    var model = util_2.parseUnitModel({
        "mark": markType,
        "encoding": {
            "x": { "field": "Horsepower", "type": "quantitative" },
            "y": { "field": "Miles_per_Gallon", "type": "quantitative" },
            "color": { "field": "Origin", "type": "nominal" }
        }
    });
    model.parseScale();
    model.parseMarkGroup();
    model.component.selection = selection.parseUnitSelection(model, {
        "one": { "type": "single", "nearest": true },
        "two": { "type": "multi", "nearest": true },
        "three": { "type": "interval", "nearest": true },
        "four": { "type": "single", "nearest": false },
        "five": { "type": "multi" },
        "six": { "type": "multi", "nearest": null },
        "seven": { "type": "single", "nearest": true, "encodings": ["x"] },
        "eight": { "type": "single", "nearest": true, "encodings": ["y"] },
        "nine": { "type": "single", "nearest": true, "encodings": ["color"] }
    });
    return model;
}
function voronoiMark(x, y) {
    return [
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
                    "x": x || "datum.x",
                    "y": y || "datum.y",
                    "size": [{ "signal": "width" }, { "signal": "height" }]
                }
            ]
        }
    ];
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
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['one'], marks), voronoiMark());
    });
    it('should warn for path marks', log.wrap(function (localLogger) {
        var model = getModel('line');
        var selCmpts = model.component.selection;
        var marks = [];
        chai_1.assert.equal(nearest_1.default.marks(model, selCmpts['one'], marks), marks);
        chai_1.assert.equal(localLogger.warns[0], log.message.nearestNotSupportForContinuous('line'));
    }));
    it('limits to a single voronoi per unit', function () {
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: "world" }];
        var marks2 = nearest_1.default.marks(model, selCmpts['one'], marks);
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['two'], marks2), voronoiMark());
    });
    it('supports 1D voronoi', function () {
        var model = getModel('circle');
        var selCmpts = model.component.selection;
        var marks = [{ hello: "world" }];
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['seven'], util_1.duplicate(marks)), voronoiMark("datum.x", { "expr": "0" }));
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['eight'], util_1.duplicate(marks)), voronoiMark({ "expr": "0" }, "datum.y"));
        chai_1.assert.sameDeepMembers(nearest_1.default.marks(model, selCmpts['nine'], util_1.duplicate(marks)), voronoiMark("datum.x", "datum.y"));
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9uZWFyZXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUN0RSw2RUFBd0U7QUFDeEUsc0NBQXdDO0FBQ3hDLDBDQUE0QztBQUM1QyxtQ0FBMEM7QUFFMUMsa0JBQWtCLFFBQWE7SUFDN0IsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQzlELEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQztRQUMxQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUM7UUFDekMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFDO1FBQzlDLE1BQU0sRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBQztR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