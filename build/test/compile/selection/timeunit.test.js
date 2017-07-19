"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var selection = require("../../../src/compile/selection/selection");
var util_1 = require("../../util");
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
        var data2 = model.assembleData().filter(function (d) { return d.name === 'data_2'; })[0].transform;
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
        var data2 = model.assembleData().filter(function (d) { return d.name === 'data_2'; })[0].transform;
        var tuIdx = -1;
        var selIdx = -1;
        data2.forEach(function (tx, idx) {
            if (tx.type === 'formula' && tx.as === 'seconds_date') {
                tuIdx = idx;
            }
            else if (tx.type === 'filter' && tx.expr.indexOf('vlPoint') >= 0) {
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
        var data2 = model.assembleData().filter(function (d) { return d.name === 'data_2'; })[0].transform;
        chai_1.assert.equal(data2.filter(function (tx) { return tx.type === 'formula' && tx.as === 'seconds_date'; }).length, 1);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXVuaXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9zZWxlY3Rpb24vdGltZXVuaXQudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsK0RBQWdFO0FBQ2hFLG9FQUFzRTtBQUV0RSxtQ0FBc0Q7QUFFdEQsa0JBQWtCLEtBQWU7SUFDL0IsSUFBTSxLQUFLLEdBQUcsaUJBQVUsQ0FBQztRQUN2QixNQUFNLEVBQUUsRUFBQyxRQUFRLEVBQUU7Z0JBQ2pCLEVBQUMsTUFBTSxFQUFFLDJCQUEyQixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUM7Z0JBQ2xELEVBQUMsTUFBTSxFQUFFLDJCQUEyQixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUM7Z0JBQ2xELEVBQUMsTUFBTSxFQUFFLDJCQUEyQixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUM7Z0JBQ2xELEVBQUMsTUFBTSxFQUFFLDJCQUEyQixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUM7Z0JBQ2xELEVBQUMsTUFBTSxFQUFFLDJCQUEyQixFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUM7YUFDbkQsRUFBQztRQUNGLFNBQVMsRUFBRSxDQUFDO2dCQUNWLE1BQU0sRUFBRSxPQUFPO2dCQUNmLFdBQVcsRUFBRTtvQkFDWCxLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQztpQkFDbkQ7Z0JBQ0QsVUFBVSxFQUFFO29CQUNWLEdBQUcsRUFBRTt3QkFDSCxPQUFPLEVBQUUsTUFBTTt3QkFDZixNQUFNLEVBQUUsVUFBVTt3QkFDbEIsVUFBVSxFQUFFLFNBQVM7cUJBQ3RCO29CQUNELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQztpQkFDL0M7YUFDRixFQUFFLEtBQUssQ0FBQztLQUNWLENBQUMsQ0FBQztJQUNILEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNuQyxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFDO2dCQUNqRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBQzthQUNsRTtTQUNGLENBQUMsQ0FBQztRQUNILElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUU7WUFDL0UsS0FBSyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQztZQUN6QixLQUFLLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFFLFdBQVcsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQztTQUNuRCxDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QyxhQUFNLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsdUJBQVksQ0FBQyxDQUFDO1FBRTFELElBQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRSxJQUFLLE9BQUEsRUFBRSxDQUFDLEVBQUUsRUFBTCxDQUFLLENBQUMsQ0FBQztRQUNsRSxhQUFNLENBQUMsZUFBZSxDQUFDLEVBQUUsRUFBRSxDQUFDLGNBQWMsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQy9ELENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHFDQUFxQyxFQUFFO1FBQ3hDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNyQixNQUFNLEVBQUUsT0FBTztZQUNmLFVBQVUsRUFBRTtnQkFDVixHQUFHLEVBQUU7b0JBQ0gsT0FBTyxFQUFFLE1BQU07b0JBQ2YsTUFBTSxFQUFFLFVBQVU7b0JBQ2xCLFVBQVUsRUFBRSxTQUFTO2lCQUN0QjtnQkFDRCxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLE1BQU0sRUFBRSxjQUFjLEVBQUM7Z0JBQzlDLE9BQU8sRUFBRTtvQkFDUCxXQUFXLEVBQUUsRUFBQyxXQUFXLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUM7b0JBQ3ZELE9BQU8sRUFBRSxXQUFXO2lCQUNyQjthQUNGO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ25GLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLEVBQUUsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssY0FBYyxFQUFqRCxDQUFpRCxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLG1DQUFtQyxFQUFFO1FBQ3RDLElBQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQztZQUNyQixXQUFXLEVBQUUsQ0FBQyxFQUFDLFFBQVEsRUFBRSxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUMsRUFBQyxDQUFDO1lBQy9DLE1BQU0sRUFBRSxPQUFPO1lBQ2YsVUFBVSxFQUFFO2dCQUNWLEdBQUcsRUFBRTtvQkFDSCxPQUFPLEVBQUUsTUFBTTtvQkFDZixNQUFNLEVBQUUsVUFBVTtvQkFDbEIsVUFBVSxFQUFFLFNBQVM7aUJBQ3RCO2dCQUNELEdBQUcsRUFBRSxFQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUMsTUFBTSxFQUFFLGNBQWMsRUFBQzthQUMvQztTQUNGLENBQUMsQ0FBQztRQUVILElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsVUFBQyxDQUFDLElBQUssT0FBQSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBbkIsQ0FBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUNuRixJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBRWhCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxFQUFFLEVBQUUsR0FBRztZQUNwQixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RELEtBQUssR0FBRyxHQUFHLENBQUM7WUFDZCxDQUFDO1lBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssUUFBUSxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ25FLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDZixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxhQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLGFBQU0sQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsYUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQ3JCLFdBQVcsRUFBRSxDQUFDLEVBQUMsUUFBUSxFQUFFLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxFQUFDLENBQUM7WUFDL0MsTUFBTSxFQUFFLE9BQU87WUFDZixVQUFVLEVBQUU7Z0JBQ1YsR0FBRyxFQUFFO29CQUNILE9BQU8sRUFBRSxNQUFNO29CQUNmLE1BQU0sRUFBRSxVQUFVO29CQUNsQixVQUFVLEVBQUUsU0FBUztpQkFDdEI7Z0JBQ0QsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFDO2FBQy9DO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ25GLGFBQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEVBQUUsSUFBSyxPQUFBLEVBQUUsQ0FBQyxJQUFJLEtBQUssU0FBUyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEtBQUssY0FBYyxFQUFqRCxDQUFpRCxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMifQ==