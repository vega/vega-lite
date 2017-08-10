"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var mark_1 = require("../../../src/compile/mark/mark");
var util_1 = require("../../util");
describe('Mark', function () {
    describe('parseMarkGroup', function () {
        // PATH
        describe('Multi-series Line', function () {
            it('should have a facet directive and a nested mark group that uses the faceted data.', function () {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                    "mark": { "type": "line", "style": "trend" },
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" },
                        "color": { "field": "symbol", "type": "nominal" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'pathgroup');
                chai_1.assert.deepEqual(markGroup.from, {
                    facet: {
                        name: 'faceted_path_main',
                        data: 'main',
                        groupby: ['symbol']
                    }
                });
                var submarkGroup = markGroup.marks[0];
                chai_1.assert.equal(submarkGroup.name, 'marks');
                chai_1.assert.equal(submarkGroup.type, 'line');
                chai_1.assert.equal(submarkGroup.style, 'trend');
                chai_1.assert.equal(submarkGroup.from.data, 'faceted_path_main');
            });
        });
        describe('Single Line', function () {
            it('should have a facet directive and a nested mark group', function () {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                    "mark": "line",
                    "encoding": {
                        "x": { "field": "date", "type": "temporal", "axis": { "format": "%Y" } },
                        "y": { "field": "price", "type": "quantitative" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model)[0];
                chai_1.assert.equal(markGroup.name, 'marks');
                chai_1.assert.equal(markGroup.type, 'line');
                chai_1.assert.equal(markGroup.from.data, 'main');
            });
        });
        // NON-PATH
        describe('Aggregated Bar with a color with binned x', function () {
            it(' should use main stacked data source', function () {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "color": { "type": "ordinal", "field": "Effect__Amount_of_damage" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
                chai_1.assert.equal(markGroup[0].style, 'bar');
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
                model.parseScale();
                model.parseLayoutSize();
                var markGroup = mark_1.parseMarkGroup(model.child);
                chai_1.assert.equal(markGroup[0].from.data, 'child_main');
            });
        });
        describe('Aggregated bar', function () {
            it('should use main aggregated data source', function () {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].from.data, 'main');
            });
        });
        describe('Bar with tooltip', function () {
            it('should pass tooltip value to encoding', function () {
                var model = util_1.parseUnitModelWithScaleMarkDefLayoutSize({
                    "mark": "bar",
                    "encoding": {
                        "x": { "type": "quantitative", "field": "Cost__Other", "aggregate": "sum" },
                        "y": { "bin": true, "type": "quantitative", "field": "Cost__Total_$" },
                        "tooltip": { "value": "foo" }
                    }
                });
                var markGroup = mark_1.parseMarkGroup(model);
                chai_1.assert.equal(markGroup[0].encode.update.tooltip.value, 'foo');
            });
        });
    });
    describe('getPathSort', function () {
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
                chai_1.assert.deepEqual(mark_1.getPathSort(model), {
                    field: ['datum[\"year\"]'],
                    order: ['ascending']
                });
            });
            it('should order by x by default if x is the dimension', function () {
                var model = util_1.parseUnitModelWithScale({
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
                chai_1.assert.deepEqual(mark_1.getPathSort(model), {
                    field: 'datum[\"bin_maxbins_10_IMDB_Rating_start\"]',
                    order: 'descending'
                });
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFyay50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL21hcmsvbWFyay50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUU1Qix1REFBMkU7QUFFM0UsbUNBQThIO0FBRTlILFFBQVEsQ0FBQyxNQUFNLEVBQUU7SUFDZixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsT0FBTztRQUNQLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QixFQUFFLENBQUMsbUZBQW1GLEVBQUU7Z0JBQ3RGLElBQU0sS0FBSyxHQUFHLCtDQUF3QyxDQUFDO29CQUNyRCxNQUFNLEVBQUUsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUM7b0JBQzFDLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLEVBQUMsUUFBUSxFQUFFLElBQUksRUFBQyxFQUFDO3dCQUNwRSxHQUFHLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUM7d0JBQy9DLE9BQU8sRUFBRSxFQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBQztxQkFDaEQ7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILElBQU0sU0FBUyxHQUFHLHFCQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNDLGFBQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztnQkFDMUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFO29CQUMvQixLQUFLLEVBQUU7d0JBQ0wsSUFBSSxFQUFFLG1CQUFtQjt3QkFDekIsSUFBSSxFQUFFLE1BQU07d0JB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