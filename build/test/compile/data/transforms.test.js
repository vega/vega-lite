"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var aggregate_1 = require("../../../src/compile/data/aggregate");
var bin_1 = require("../../../src/compile/data/bin");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var timeunit_1 = require("../../../src/compile/data/timeunit");
var transforms_1 = require("../../../src/compile/data/transforms");
var log = require("../../../src/log");
var util_1 = require("../../../src/util");
var util_2 = require("../../util");
describe('compile/data/transforms', function () {
    describe('parseTransformArray()', function () {
        it('should return a CalculateNode and a FilterNode', function () {
            var model = util_2.parseUnitModel({
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
            var model = util_2.parseUnitModel({
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
            var model = util_2.parseUnitModel({
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
    describe('filter', function () {
        it('should create parse for filtered fields', function () {
            var model = util_2.parseUnitModel({
                "data": { "url": "a.json" },
                "transform": [
                    { "filter": { "field": "a", "equal": { year: 2000 } } },
                    { "filter": { "field": "b", "oneOf": ["a", "b"] } },
                    { "filter": { "field": "c", "range": [{ year: 2000 }, { year: 2001 }] } },
                    { "filter": { "field": "d", "range": [1, 2] } }
                ],
                "mark": "point",
                encoding: {}
            });
            var parse = {};
            // extract the parse from the parse nodes that were generated along with the filter nodes
            var node = transforms_1.parseTransformArray(model).first;
            while (node.numChildren() > 0) {
                if (node instanceof formatparse_1.ParseNode) {
                    parse = util_1.extend(parse, node.parse);
                }
                chai_1.assert.equal(node.numChildren(), 1);
                node = node.children[0];
            }
            chai_1.assert.deepEqual(parse, {
                a: 'date',
                b: 'string',
                c: 'date',
                d: 'number'
            });
        });
    });
    describe('lookup', function () {
        it('should parse lookup from array', function () {
            var model = util_2.parseUnitModel({
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmb3Jtcy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vdGVzdC9jb21waWxlL2RhdGEvdHJhbnNmb3Jtcy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSw4QkFBOEI7O0FBRTlCLDZCQUE0QjtBQUM1QixpRUFBa0U7QUFDbEUscURBQXNEO0FBQ3RELHFFQUFnRTtBQUVoRSwrREFBZ0U7QUFDaEUsbUVBQWdIO0FBRWhILHNDQUF3QztBQUV4QywwQ0FBMEQ7QUFFMUQsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyx5QkFBeUIsRUFBRTtJQUNsQyxRQUFRLENBQUMsdUJBQXVCLEVBQUU7UUFDaEMsRUFBRSxDQUFDLGdEQUFnRCxFQUFFO1lBQ25ELElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7Z0JBQzNCLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUM7Z0JBQ2xCLElBQUksRUFBRSxPQUFPO2dCQUNiLFNBQVMsRUFBRSxDQUFDLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUM7Z0JBQ25FLFFBQVEsRUFBRTtvQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBQztpQkFDckQ7YUFDRixDQUFDLENBQUM7WUFFSCxJQUFNLE1BQU0sR0FBRyxnQ0FBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMxQyxhQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLFlBQVksMEJBQWEsQ0FBQyxDQUFDO1lBQ3JELGFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksWUFBWSx1QkFBVSxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsaURBQWlELEVBQUU7WUFDcEQs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