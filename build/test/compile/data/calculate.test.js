"use strict";
/* tslint:disable:quotemark */
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var calculate_1 = require("../../../src/compile/data/calculate");
var util_1 = require("../../util");
function assembleFromSortArray(model) {
    var node = calculate_1.CalculateNode.parseAllForSortIndex(null, model);
    return node.assemble();
}
describe('compile/data/calculate', function () {
    describe('makeAllForSortIndex', function () {
        var model = util_1.parseUnitModel({
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
        chai_1.assert.deepEqual(nodes, {
            type: 'formula',
            expr: "datum.a === 'B' ? 0 : datum.a === 'A' ? 1 : datum.a === 'C' ? 2 : 3",
            as: 'x_a_sort_index'
        });
    });
    describe('calculateExpressionFromSortField', function () {
        var expression = calculate_1.CalculateNode.calculateExpressionFromSortField('a', ["B", "A", "C"]);
        chai_1.assert.equal(expression, "datum.a === 'B' ? 0 : datum.a === 'A' ? 1 : datum.a === 'C' ? 2 : 3");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsOEJBQThCOztBQUU5Qiw2QkFBNEI7QUFDNUIsaUVBQWtFO0FBRWxFLG1DQUEwQztBQUUxQywrQkFBK0IsS0FBcUI7SUFDbEQsSUFBTSxJQUFJLEdBQUcseUJBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFrQixDQUFDO0lBQzlFLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pCLENBQUM7QUFFRCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsUUFBUSxDQUFDLHFCQUFxQixFQUFFO1FBQzlCLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRTtvQkFDTixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUM7aUJBQy9DO2FBQ0Y7WUFDRCxJQUFJLEVBQUUsS0FBSztZQUNULFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQztnQkFDdkQsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2FBQ3RDO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBTSxLQUFLLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDdEIsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUscUVBQXFFO1lBQzNFLEVBQUUsRUFBRSxnQkFBZ0I7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsa0NBQWtDLEVBQUU7UUFDM0MsSUFBTSxVQUFVLEdBQUcseUJBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEYsYUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUscUVBQXFFLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmZ1bmN0aW9uIGFzc2VtYmxlRnJvbVNvcnRBcnJheShtb2RlbDogTW9kZWxXaXRoRmllbGQpIHtcbiAgY29uc3Qgbm9kZSA9IENhbGN1bGF0ZU5vZGUucGFyc2VBbGxGb3JTb3J0SW5kZXgobnVsbCwgbW9kZWwpIGFzIENhbGN1bGF0ZU5vZGU7XG4gIHJldHVybiBub2RlLmFzc2VtYmxlKCk7XG59XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvY2FsY3VsYXRlJywgZnVuY3Rpb24gKCkge1xuICBkZXNjcmliZSgnbWFrZUFsbEZvclNvcnRJbmRleCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgdmFsdWVzOiBbXG4gICAgICAgICAge2E6ICdBJyxiOiAyOH0sIHthOiAnQicsYjogNTV9LCB7YTogJ0MnLGI6IDQzfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAgbWFyazogJ2JhcicsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdvcmRpbmFsJywgc29ydDogWydCJywgJ0EnLCAnQyddfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCBub2RlcyA9IGFzc2VtYmxlRnJvbVNvcnRBcnJheShtb2RlbCk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbChub2Rlcywge1xuICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgZXhwcjogXCJkYXR1bS5hID09PSAnQicgPyAwIDogZGF0dW0uYSA9PT0gJ0EnID8gMSA6IGRhdHVtLmEgPT09ICdDJyA/IDIgOiAzXCIsXG4gICAgICBhczogJ3hfYV9zb3J0X2luZGV4J1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnY2FsY3VsYXRlRXhwcmVzc2lvbkZyb21Tb3J0RmllbGQnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgZXhwcmVzc2lvbiA9IENhbGN1bGF0ZU5vZGUuY2FsY3VsYXRlRXhwcmVzc2lvbkZyb21Tb3J0RmllbGQoJ2EnLCBbXCJCXCIsIFwiQVwiLCBcIkNcIl0pO1xuICAgIGFzc2VydC5lcXVhbChleHByZXNzaW9uLCBcImRhdHVtLmEgPT09ICdCJyA/IDAgOiBkYXR1bS5hID09PSAnQScgPyAxIDogZGF0dW0uYSA9PT0gJ0MnID8gMiA6IDNcIik7XG4gIH0pO1xufSk7XG4iXX0=