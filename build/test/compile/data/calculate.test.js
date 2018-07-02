/* tslint:disable:quotemark */
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
                    values: [
                        { a: 'A', b: 28 }, { a: 'B', b: 55 }, { a: 'C', b: 43 }
                    ]
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
});
//# sourceMappingURL=calculate.test.js.map