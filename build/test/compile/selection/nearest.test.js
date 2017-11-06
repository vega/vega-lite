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
        "three": { "type": "interval" },
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
        chai_1.assert.equal(localLogger.warns[1], log.message.nearestNotSupportForContinuous('line'));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmVhcmVzdC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL3NlbGVjdGlvbi9uZWFyZXN0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDhCQUE4Qjs7QUFFOUIsNkJBQTRCO0FBQzVCLG9FQUFzRTtBQUN0RSw2RUFBd0U7QUFDeEUsc0NBQXdDO0FBQ3hDLDBDQUE0QztBQUM1QyxtQ0FBMEM7QUFFMUMsa0JBQWtCLFFBQWE7SUFDN0IsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztRQUMzQixNQUFNLEVBQUUsUUFBUTtRQUNoQixVQUFVLEVBQUU7WUFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDbkQsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLGtCQUFrQixFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7WUFDekQsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDO1NBQ2hEO0tBQ0YsQ0FBQyxDQUFDO0lBQ0gsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ25CLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN2QixLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsS0FBSyxFQUFFO1FBQzlELEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBQztRQUMxQyxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUM7UUFDekMsT0FBTyxFQUFFLEVBQUMsTUFBTSxFQUFFLFVBQVUsRUFBQztRQUM3QixNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUM7UUFDNUMsTUFBTSxFQUFFLEVBQUMs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