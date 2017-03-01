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
                        "field": "*",
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
//# sourceMappingURL=data.test.js.map