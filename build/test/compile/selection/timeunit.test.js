"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/data/assemble");
var optimize_1 = require("../../../src/compile/data/optimize");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var selection = require("../../../src/compile/selection/selection");
var util_1 = require("../../util");
function getData(model) {
    optimize_1.optimizeDataflow(model.component.data);
    return assemble_1.assembleRootData(model.component.data);
}
function getModel(unit2) {
    var model = util_1.parseModel({
        "data": { "values": [
                { "date": "Sun, 01 Jan 2012 23:00:01", "price": 150 },
                { "date": "Sun, 02 Jan 2012 00:10:02", "price": 100 },
                { "date": "Sun, 02 Jan 2012 01:20:03", "price": 170 },
                { "date": "Sun, 02 Jan 2012 02:30:04", "price": 165 },
                { "date": "Sun, 02 Jan 2012 03:40:05", "price": 200 }
            ] },
        "hconcat": [{
                "mark": "point",
                "selection": {
                    "two": { "type": "single", "encodings": ["x", "y"] }
                },
                "encoding": {
                    "x": {
                        "field": "date",
                        "type": "temporal",
                        "timeUnit": "seconds"
                    },
                    "y": { "field": "price", "type": "quantitative" }
                }
            }, unit2]
    });
    model.parse();
    return model;
}
describe('Selection time unit', function () {
    it('dataflow nodes are constructed', function () {
        var model = util_1.parseUnitModel({
            "mark": "point",
            "encoding": {
                "x": { "field": "date", "type": "temporal", "timeUnit": "seconds" },
                "y": { "field": "date", "type": "temporal", "timeUnit": "minutes" }
            }
        });
        var selCmpts = model.component.selection = selection.parseUnitSelection(model, {
            "one": { "type": "single" },
            "two": { "type": "single", "encodings": ["x", "y"] }
        });
        chai_1.assert.isUndefined(selCmpts['one'].timeUnit);
        chai_1.assert.instanceOf(selCmpts['two'].timeUnit, timeunit_1.TimeUnitNode);
        var as = selCmpts['two'].timeUnit.assemble().map(function (tx) { return tx.as; });
        chai_1.assert.sameDeepMembers(as, ['seconds_date', 'minutes_date']);
    });
    it('is added with conditional encodings', function () {
        var model = getModel({
            "mark": "point",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "timeUnit": "minutes"
                },
                "y": { "field": "price", "type": "quantitative" },
                "color": {
                    "condition": { "selection": "two", "value": "goldenrod" },
                    "value": "steelblue"
                }
            }
        });
        var data2 = getData(model).filter(function (d) { return d.name === 'data_2'; })[0].transform;
        chai_1.assert.equal(data2.filter(function (tx) { return tx.type === 'formula' && tx.as === 'seconds_date'; }).length, 1);
    });
    it('is added before selection filters', function () {
        var model = getModel({
            "transform": [{ "filter": { "selection": "two" } }],
            "mark": "point",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "timeUnit": "minutes"
                },
                "y": { "field": "price", "type": "quantitative" }
            }
        });
        var data2 = getData(model).filter(function (d) { return d.name === 'data_2'; })[0].transform;
        var tuIdx = -1;
        var selIdx = -1;
        data2.forEach(function (tx, idx) {
            if (tx.type === 'formula' && tx.as === 'seconds_date') {
                tuIdx = idx;
            }
            else if (tx.type === 'filter' && tx.expr.indexOf('vlSingle') >= 0) {
                selIdx = idx;
            }
        });
        chai_1.assert.notEqual(tuIdx, -1);
        chai_1.assert.notEqual(selIdx, -1);
        chai_1.assert.isAbove(selIdx, tuIdx);
    });
    it('removes duplicate time unit formulae', function () {
        var model = getModel({
            "transform": [{ "filter": { "selection": "two" } }],
            "mark": "point",
            "encoding": {
                "x": {
                    "field": "date",
                    "type": "temporal",
                    "timeUnit": "seconds"
                },
                "y": { "field": "price", "type": "quantitative" }
            }
        });
        var data2 = getData(model).filter(function (d) { return d.name === 'data_2'; })[0].transform;
        chai_1.assert.equal(data2.filter(function (tx) { return tx.type === 'formula' && tx.as === 'seconds_date'; }).length, 1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vdGltZXVuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsK0RBQW9FO0FBQ3BFLCtEQUFvRTtBQUNwRSwrREFBZ0U7QUFFaEUsb0VBQXNFO0FBRXRFLG1DQUFzRDtBQUV0RCxpQkFBaUIsS0FBWTtJQUMzQiwyQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sQ0FBQywyQkFBZ0IsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxrQkFBa0IsS0FBZTtJQUMvQixJQUFNLEtBQUssR0FBRyxpQkFBVSxDQUFDO1FBQ3ZCLE1BQU0sRUFBRSxFQUFDLFFBQVEsRUFBRTtnQkFDakIsRUFBQyxNQUFNLEVBQUUsMkJBQTJCLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQztnQkFDbEQsRUFBQyxNQUFNLEVBQUUsMkJBQTJCLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQztnQkFDbEQsRUFBQyxNQUFNLEVBQUUsMkJBQTJCLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQztnQkFDbEQsRUFBQyxNQUFNLEVBQUUsMkJBQTJCLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQztnQkFDbEQsRUFBQyxNQUFNLEVBQUUsMkJBQTJCLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBQzthQUNuRCxFQUFDO1FBQ0YsU0FBUyxFQUFFLENBQUM7Z0JBQ1YsTUFBTSxFQUFFLE9BQU87Z0JBQ2YsV0FBVyxFQUFFO29CQUNYLEtBQUssRUFBRSxFQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsV0FBVyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDO2lCQUNuRDtnQkFDRCxVQUFVLEVB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