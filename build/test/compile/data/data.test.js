/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data/data");
var util_1 = require("../../util");
function compileAssembleData(model) {
    model.parseData();
    return data_1.assembleData(model, []);
}
describe('data', function () {
    describe('compileData & assembleData', function () {
        describe('for aggregate encoding', function () {
            it('should contain 2 tables', function () {
                var model = util_1.parseUnitModel({
                    mark: "point",
                    encoding: {
                        x: { field: 'a', type: "temporal" },
                        y: { field: 'b', type: "quantitative", scale: { type: 'log' }, aggregate: 'sum' }
                    }
                });
                var data = compileAssembleData(model);
                chai_1.assert.equal(data.length, 2);
            });
        });
        describe('when contains log in non-aggregate', function () {
            var model = util_1.parseUnitModel({
                mark: "point",
                encoding: {
                    x: { field: 'a', type: "temporal" },
                    y: { field: 'b', type: "quantitative", scale: { type: 'log' } }
                }
            });
            var data = compileAssembleData(model);
            it('should contains 1 table', function () {
                chai_1.assert.equal(data.length, 1);
            });
            it('should have filter non-positive in source', function () {
                var sourceTransform = data[0].transform;
                chai_1.assert.deepEqual(sourceTransform[sourceTransform.length - 1], {
                    type: 'filter',
                    expr: 'datum["b"] > 0'
                });
            });
        });
        describe('stacked bar chart with binned dimension', function () {
            var model = util_1.parseUnitModel({
                "mark": "area",
                "encoding": {
                    "x": {
                        "bin": { "maxbins": 10 },
                        "field": "IMDB_Rating",
                        "type": "quantitative"
                    },
                    "color": {
                        "field": "Source",
                        "type": "nominal"
                    },
                    "y": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                }
            });
            var data = compileAssembleData(model);
            it('should contains 3 tables', function () {
                chai_1.assert.equal(data.length, 3);
            });
            it('should have collect transform as the last transform in stacked', function () {
                var stackedTransform = data[2].transform;
                chai_1.assert.deepEqual(stackedTransform[stackedTransform.length - 1], {
                    type: 'collect',
                    sort: {
                        "field": "bin_IMDB_Rating_start",
                        "order": "descending"
                    }
                });
            });
        });
    });
    describe('assemble', function () {
        it('should have correct order of transforms (null filter, timeUnit, bin then filter)', function () {
            var model = util_1.parseUnitModel({
                transform: {
                    calculate: [{
                            as: 'b2',
                            expr: '2 * datum["b"]'
                        }],
                    filter: 'datum["a"] > datum["b"] && datum["c"] === datum["d"]'
                },
                mark: "point",
                encoding: {
                    x: { field: 'a', type: "temporal", timeUnit: 'year' },
                    y: {
                        bin: {
                            extent: [0, 100]
                        },
                        'field': 'Acceleration',
                        'type': "quantitative"
                    },
                    size: { field: 'b2', type: 'quantitative' }
                }
            });
            var transform = compileAssembleData(model)[0].transform;
            chai_1.assert.deepEqual(transform[0].type, 'formula');
            chai_1.assert.deepEqual(transform[1].type, 'filter');
            chai_1.assert.deepEqual(transform[2].type, 'filter');
            chai_1.assert.deepEqual(transform[3].type, 'bin');
            chai_1.assert.deepEqual(transform[4].type, 'formula');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0YS50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvZGF0YS50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLDhCQUE4Qjs7O0FBRTlCLDZCQUE0QjtBQUM1Qix1REFBNEQ7QUFFNUQsbUNBQTBDO0FBRTFDLDZCQUE2QixLQUFZO0lBQ3ZDLEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNsQixNQUFNLENBQUMsbUJBQVksQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUVELFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsUUFBUSxDQUFDLHdCQUF3QixFQUFFO1lBQ2pDLEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtnQkFDNUIsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztvQkFDekIsSUFBSSxFQUFFLE9BQU87b0JBQ2IsUUFBUSxFQUFFO3dCQUNSLENBQUMsRUFBRSxFQUFDLEtBQUssRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBQzt3QkFDakMsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxLQUFLLEVBQUMsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDO3FCQUM5RTtpQkFDRixDQUFDLENBQUM7Z0JBRUwsSUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3hDLGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsUUFBUSxDQUFDLG9DQUFvQyxFQUFFO1lBQzdDLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElB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