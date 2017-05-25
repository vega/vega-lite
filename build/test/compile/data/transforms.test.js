"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var transforms_1 = require("../../../src/compile/data/transforms");
var log = require("../../../src/log");
var util_1 = require("../../util");
describe('compile/data/transforms', function () {
    describe('parseTransformArray()', function () {
        it('should return a CalculateNode and a FilterNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ calculate: 'calculate', as: 'as' }, { filter: 'filter' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var result = transforms_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof transforms_1.CalculateNode);
            chai_1.assert.isTrue(result.last instanceof transforms_1.FilterNode);
        });
        it('should return a BinNode node and a TimeUnitNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { timeUnit: 'month', field: 'field', as: 'b' }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var result = transforms_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result.last instanceof timeunit_1.TimeUnitNode);
        });
        it('should return a BinNode and a AggregateNode', function () {
            var model = util_1.parseUnitModel({
                data: { values: [] },
                mark: 'point',
                transform: [{ bin: true, field: 'field', as: 'a' }, { summarize: [{ aggregate: 'count', field: 'f', as: 'b' }, { aggregate: 'sum', field: 'f', as: 'c' }], groupby: ['field'] }],
                encoding: {
                    x: { field: 'a', type: 'temporal', timeUnit: 'month' }
                }
            });
            var result = transforms_1.parseTransformArray(model);
            chai_1.assert.isTrue(result.first instanceof bin_1.BinNode);
            chai_1.assert.isTrue(result.last instanceof aggregate_1.AggregateNode);
        });
    });
    describe('lookup', function () {
        it('should parse lookup from array', function () {
            var model = util_1.parseUnitModel({
                "data": { "url": "data/lookup_groups.csv" },
                "transform": [{
                        "lookup": "person",
                        "from": {
                            "data": { "url": "data/lookup_people.csv" },
                            "key": "name",
                            "fields": ["age", "height"]
                        }
                    }],
                "mark": "bar",
                "encoding": {}
            });
            var t = transforms_1.parseTransformArray(model);
            chai_1.assert.deepEqual(t.first.assemble(), {
                type: 'lookup',
                from: 'lookup_0',
                key: 'name',
                fields: ['person'],
                values: ['age', 'height']
            });
        });
        it('should create node for flat lookup', function () {
            var lookup = new transforms_1.LookupNode({
                "lookup": "person",
                "from": {
                    "data": { "url": "data/lookup_people.csv" },
                    "key": "name",
                    "fields": ["age", "height"]
                }
            }, 'lookup_0');
            chai_1.assert.deepEqual(lookup.assemble(), {
                type: 'lookup',
                from: 'lookup_0',
                key: 'name',
                fields: ['person'],
                values: ['age', 'height']
            });
        });
        it('should create node for nested lookup', function () {
            var lookup = new transforms_1.LookupNode({
                "lookup": "person",
                "from": {
                    "data": { "url": "data/lookup_people.csv" },
                    "key": "name"
                },
                "as": "foo"
            }, 'lookup_0');
            chai_1.assert.deepEqual(lookup.assemble(), {
                type: 'lookup',
                from: 'lookup_0',
                key: 'name',
                fields: ['person'],
                as: ['foo']
            });
        });
        it('should warn if fields are not specified and as is missing', function () {
            log.runLocalLogger(function (localLogger) {
                var lookup = new transforms_1.LookupNode({
                    "lookup": "person",
                    "from": {
                        "data": { "url": "data/lookup_people.csv" },
                        "key": "name"
                    }
                }, 'lookup_0');
                lookup.assemble();
                chai_1.assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvdHJhbnNmb3Jtcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixpRUFBa0U7QUFDbEUscURBQXNEO0FBRXRELCtEQUFnRTtBQUNoRSxtRUFBZ0g7QUFFaEgsc0NBQXdDO0FBR3hDLG1DQUEwQztBQUUxQyxRQUFRLENBQUMseUJBQXlCLEVBQUU7SUFDbEMsUUFBUSxDQUFDLHVCQUF1QixFQUFFO1FBQ2hDLEVBQUUsQ0FBQyxnREFBZ0QsRUFBRTtZQUNuRCxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO2dCQUMzQixJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsRUFBRSxFQUFDO2dCQUNsQixJQUFJLEVBQUUsT0FBTztnQkFDYixTQUFTLEVBQUUsQ0FBQyxFQUFDLFNBQVMsRUFBRSxXQUFXLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDO2dCQUNuRSxRQUFRLEVBQUU7b0JBQ1IsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUM7aUJBQ3JEO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsSUFBTSxNQUFNLEdBQUcsZ0NBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsYUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxZQUFZLDBCQUFhLENBQUMsQ0FBQztZQUNyRCxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLFlBQVksdUJBQVUsQ0FBQyxDQUFDO1FBQ25ELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ3BELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7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