import * as tslib_1 from "tslib";
import { assert } from 'chai';
import { AncestorParse } from '../../../src/compile/data';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { ParseNode } from '../../../src/compile/data/formatparse';
import { parseTransformArray } from '../../../src/compile/data/parse';
import { parseUnitModel } from '../../util';
describe('compile/data/filter', function () {
    it('should create parse for filtered fields', function () {
        var model = parseUnitModel({
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
        var root = new DataFlowNode(null);
        parseTransformArray(root, model, new AncestorParse());
        var node = root.children[0];
        while (node.numChildren() > 0) {
            if (node instanceof ParseNode) {
                parse = tslib_1.__assign({}, parse, node.parse);
            }
            assert.equal(node.numChildren(), 1);
            node = node.children[0];
        }
        assert.deepEqual(parse, {
            a: 'date',
            b: 'string',
            c: 'date',
            d: 'number'
        });
    });
});
//# sourceMappingURL=filter.test.js.map