/* tslint:disable:quotemark */
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
var mark_1 = require("../../../src/compile/mark/mark");
describe('Mark', function () {
    describe('parseMark', function () {
        // PATH
        describe('Multi-series Line', function () {
            it('should have a facet directive and a nested mark group that uses the faceted data.', function () {
                var model = util_1.parseUnitModel({
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" },
                        "color": { "field": "symbol", "type": "nominal" }
                    }
                });
                var markGroup = mark_1.parseMark(model)[0];
                chai_1.assert.equal(markGroup.name, 'pathgroup');
                chai_1.assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted-path-source',
                        data: 'source',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                chai_1.assert.equal(submarkGroup.name, 'marks');
                chai_1.assert.equal(submarkGroup.type, 'line');
                chai_1.assert.equal(submarkGroup.from.data, 'faceted-path-source');
            });
        });
        describe('Single Line', function () {
            it('should have a facet directive and a nested mark group', function () {
                var model = util_1.parseUnitModel({
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                });
                var markGroup = mark_1.parseMark(model)[0];
                chai_1.assert.equal(markGroup.name, 'marks');
                chai_1.assert.equal(markGroup.type, 'line');
                chai_1.assert.equal(markGroup.from.data, 'source');
            });
        });
        // NON-PATH
        describe('Aggregated Bar with a color with binned x', function () {
            it(' should use stacked data source', function () {
                var model = util_1.parseUnitModel({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                    }
                });
                var markGroup = mark_1.parseMark(model);
                chai_1.assert.equal(markGroup[0].from.data, 'stacked');
            });
        });
        describe('Faceted aggregated Bar with a color with binned x', function () {
            it('should use faceted data source', function () {
                var model = util_1.parseFacetModel({
                    facet: {
                        row: { field: 'a', type: 'nominal' }
                    },
                    spec: {
                        "mark": "bar",
                        "encoding": {
                            "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                            "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                            "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                        }
                    }
                });
                var markGroup = mark_1.parseMark(model.child);
                chai_1.assert.equal(markGroup[0].from.data, 'faceted-data');
            });
        });
        describe('Aggregated bar', function () {
            it('should use summary data source', function () {
                var model = util_1.parseUnitModel({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                    }
                });
                var markGroup = mark_1.parseMark(model);
                chai_1.assert.equal(markGroup[0].from.data, 'summary');
            });
        });
    });
});
//# sourceMappingURL=mark.test.js.map