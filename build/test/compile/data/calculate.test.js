/* tslint:disable:quotemark */
import { assert } from 'chai';
import { CalculateNode } from '../../../src/compile/data/calculate';
import { parseUnitModel } from '../../util';
function assembleFromSortArray(model) {
    var node = CalculateNode.parseAllForSortIndex(null, model);
    return node.assemble();
}
describe('compile/data/calculate', function () {
    describe('makeAllForSortIndex', function () {
        it('produces correct formula transform', function () {
            var model = parseUnitModel({
                data: {
                    values: [{ a: 'A', b: 28 }, { a: 'B', b: 55 }, { a: 'C', b: 43 }]
                },
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: ['B', 'A', 'C'] },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
            var nodes = assembleFromSortArray(model);
            expect(nodes).toEqual({
                type: 'formula',
                expr: 'datum["a"]==="B" ? 0 : datum["a"]==="A" ? 1 : datum["a"]==="C" ? 2 : 3',
                as: 'x_a_sort_index'
            });
        });
    });
    describe('dependentFields and producedFields', function () {
        it('returns the right fields', function () {
            var node = new CalculateNode(null, {
                calculate: 'datum.foo + 2',
                as: 'bar'
            });
            expect(node.dependentFields()).toEqual({ foo: true });
            expect(node.producedFields()).toEqual({ bar: true });
        });
    });
    describe('hash', function () {
        it('should generate the correct hash', function () {
            var model = parseUnitModel({
                data: {
                    values: [{ a: 'A', b: 28 }, { a: 'B', b: 55 }, { a: 'C', b: 43 }]
                },
                mark: 'bar',
                encoding: {
                    x: { field: 'a', type: 'ordinal', sort: ['B', 'A', 'C'] },
                    y: { field: 'b', type: 'quantitative' }
                }
            });
            var node = CalculateNode.parseAllForSortIndex(null, model);
            assert.deepEqual(node.hash(), 'Calculate 1019364572');
        });
    });
});
//# sourceMappingURL=calculate.test.js.map