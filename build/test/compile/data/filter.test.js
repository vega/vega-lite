"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var filter_1 = require("../../../src/compile/data/filter");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var parse_1 = require("../../../src/compile/data/parse");
var util_1 = require("../../util");
describe('compile/data/filter', function () {
    it('should create parse for filtered fields', function () {
        var model = util_1.parseUnitModel({
            data: { url: 'a.json' },
            transform: [
                { filter: { field: 'a', equal: { year: 2000 } } },
                { filter: { field: 'b', oneOf: ['a', 'b'] } },
                { filter: { field: 'c', range: [{ year: 2000 }, { year: 2001 }] } },
                { filter: { field: 'd', range: [1, 2] } }
            ],
            mark: 'point',
            encoding: {}
        });
        var parse = {};
        // extract the parse from the parse nodes that were generated along with the filter nodes
        var root = new dataflow_1.DataFlowNode(null);
        parse_1.parseTransformArray(root, model, new data_1.AncestorParse());
        var node = root.children[0];
        while (node.numChildren() > 0) {
            if (node instanceof formatparse_1.ParseNode) {
                parse = tslib_1.__assign({}, parse, node.parse);
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
    describe('dependentFields and producedFields', function () {
        it('returns the right fields', function () {
            var node = new filter_1.FilterNode(null, null, 'datum.foo > 2');
            expect(node.dependentFields()).toEqual({ foo: true });
            expect(node.producedFields()).toEqual({});
        });
    });
    describe('hash', function () {
        it('should generate the correct hash', function () {
            var filterNode = new filter_1.FilterNode(null, null, { field: 'a', equal: { year: 2000 } });
            chai_1.assert.deepEqual(filterNode.hash(), 'Filter {"equal":{"year":2000},"field":"a"}');
        });
    });
});
//# sourceMappingURL=filter.test.js.map