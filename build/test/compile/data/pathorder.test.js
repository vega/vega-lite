/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var pathorder_1 = require("../../../src/compile/data/pathorder");
var util_1 = require("../../util");
describe('compile/data/pathorder', function () {
    describe('compileUnit', function () {
        it('should order by order field for line with order (connected scatterplot)', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/driving.json" },
                "mark": "line",
                "encoding": {
                    "x": { "field": "miles", "type": "quantitative", "scale": { "zero": false } },
                    "y": { "field": "gas", "type": "quantitative", "scale": { "zero": false } },
                    "order": { "field": "year", "type": "temporal" }
                }
            });
            chai_1.assert.deepEqual(pathorder_1.pathOrder.parseUnit(model), {
                field: ['year'],
                order: ['ascending']
            });
        });
        it('should order by x by default if x is the dimension', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/movies.json" },
                "mark": "line",
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
            chai_1.assert.deepEqual(pathorder_1.pathOrder.parseUnit(model), {
                field: 'bin_IMDB_Rating_start',
                order: 'descending'
            });
        });
        it('should order by x by default if y is the dimension', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/movies.json" },
                "mark": "line",
                "encoding": {
                    "y": {
                        "bin": { "maxbins": 10 },
                        "field": "IMDB_Rating",
                        "type": "quantitative"
                    },
                    "color": {
                        "field": "Source",
                        "type": "nominal"
                    },
                    "x": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                }
            });
            chai_1.assert.deepEqual(pathorder_1.pathOrder.parseUnit(model), {
                field: 'bin_IMDB_Rating_start',
                order: 'descending'
            });
        });
    });
    describe('parseLayer', function () {
        it('should return line order for line when merging line and point', function () {
            var model = util_1.parseFacetModel({
                "data": { "url": "data/movies.json" },
                "facet": {
                    "column": {
                        "field": "Source",
                        "type": "nominal"
                    }
                },
                "spec": {
                    "mark": "line",
                    "encoding": {
                        "y": {
                            "bin": { "maxbins": 10 },
                            "field": "IMDB_Rating",
                            "type": "quantitative"
                        },
                        "x": {
                            "aggregate": "count",
                            "type": "quantitative"
                        }
                    }
                }
            });
            var child = model.child;
            child.component.data = {
                pathOrder: pathorder_1.pathOrder.parseUnit(child)
            };
            chai_1.assert.deepEqual(pathorder_1.pathOrder.parseFacet(model), {
                field: 'bin_IMDB_Rating_start',
                order: 'descending'
            });
        });
    });
    describe('parseFacet', function () {
        it('should return line order for line for faceted line', function () {
            var model = util_1.parseModel({
                "data": { "url": "data/movies.json" },
                "mark": "line",
                "encoding": {
                    "y": {
                        "bin": { "maxbins": 10 },
                        "field": "IMDB_Rating",
                        "type": "quantitative"
                    },
                    "color": {
                        "field": "Source",
                        "type": "nominal"
                    },
                    "x": {
                        "aggregate": "count",
                        "type": "quantitative"
                    }
                },
                "config": {
                    "overlay": {
                        "line": true
                    }
                }
            });
            var children = model.children;
            children[0].component.data = {
                pathOrder: pathorder_1.pathOrder.parseUnit(children[0])
            };
            children[1].component.data = {
                pathOrder: pathorder_1.pathOrder.parseUnit(children[1])
            };
            chai_1.assert.deepEqual(pathorder_1.pathOrder.parseLayer(model), {
                field: 'bin_IMDB_Rating_start',
                order: 'descending'
            });
        });
    });
    describe('assemble', function () {
        it('should correctly assemble a collect transform', function () {
            chai_1.assert.deepEqual(pathorder_1.pathOrder.assemble({
                field: 'a',
                order: 'ascending'
            }), {
                type: 'collect',
                sort: {
                    field: 'a',
                    order: 'ascending'
                }
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aG9yZGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9wYXRob3JkZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSw4QkFBOEI7OztBQUU5Qiw2QkFBNEI7QUFFNUIsaUVBQThEO0FBRTlELG1DQUF1RTtBQUV2RSxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsUUFBUSxDQUFDLGFBQWEsRUFBRTtRQUN0QixFQUFFLENBQUMseUVBQXlFLEVBQUU7WUFDNUUsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLG1CQUFtQixFQUFDO2dCQUNwQyxNQUFNLEVBQUUsTUFBTTtnQkFDZCxVQUFVLEVBQUU7b0JBQ1YsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDeEUsR0FBRyxFQUFFLEVBQUMsT0FBTyxFQUFFLEtBQUssRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsRUFBQztvQkFDdEUsT0FBTyxFQUFFLEVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQyxNQUFNLEVBQUUsVUFBVSxFQUFDO2lCQUM5QzthQUNGLENBQUMsQ0FBQztZQUNILGFBQU0sQ0FBQyxTQUFTLENBQUMscUJBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzNDLEtBQUssRUFBRSxDQUFDLE1BQU0sQ0FBQztnQkFDZixLQUFLLEVBQUUsQ0FBQyxXQUFXLENBQUM7YUFDckIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0RBQW9ELEVBQUU7WUFDdkQsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztnQkFD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