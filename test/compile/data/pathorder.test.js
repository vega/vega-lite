/* tslint:disable:quotemark */
"use strict";
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
                        "field": "*",
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
                        "field": "*",
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
                            "field": "*",
                            "type": "quantitative"
                        }
                    }
                }
            });
            var child = model.child();
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
                        "field": "*",
                        "type": "quantitative"
                    }
                },
                "config": {
                    "overlay": {
                        "line": true
                    }
                }
            });
            var children = model.children();
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
//# sourceMappingURL=pathorder.test.js.map