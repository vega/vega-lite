"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:quotemark */
var chai_1 = require("chai");
var calculate_1 = require("../../../src/compile/data/calculate");
var util_1 = require("../../util");
function assembleFromSortArray(model) {
    var node = calculate_1.CalculateNode.parseAllForSortIndex(null, model);
    return node.assemble();
}
describe('compile/data/calculate', function () {
    it('makeAllForSortIndex', function () {
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
    it('calculateExpressionFromSortField', function () {
        var expression = calculate_1.CalculateNode.calculateExpressionFromSortField('a', ["B", "A", "C"]);
        chai_1.assert.equal(expression, "datum.a === 'B' ? 0 : datum.a === 'A' ? 1 : datum.a === 'C' ? 2 : 3");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FsY3VsYXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDhCQUE4QjtBQUM5Qiw2QkFBNEI7QUFFNUIsaUVBQWtFO0FBRWxFLG1DQUEwQztBQUcxQywrQkFBK0IsS0FBcUI7SUFDbEQsSUFBTSxJQUFJLEdBQUcseUJBQWEsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFrQixDQUFDO0lBQzlFLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3pCLENBQUM7QUFFRCxRQUFRLENBQUMsd0JBQXdCLEVBQUU7SUFDakMsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1FBQ3hCLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsSUFBSSxFQUFFO2dCQUNKLE1BQU0sRUFBRTtvQkFDTixFQUFDLENBQUMsRUFBRSxHQUFHLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLEVBQUUsRUFBQyxDQUFDLEVBQUUsR0FBRyxFQUFDLENBQUMsRUFBRSxFQUFFLEVBQUM7aUJBQy9DO2FBQ0Y7WUFDRCxJQUFJLEVBQUUsS0FBSztZQUNULFFBQVEsRUFBRTtnQkFDUixDQUFDLEVBQUUsRUFBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsSUFBSSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsRUFBQztnQkFDdkQsQ0FBQyxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFDO2FBQ3RDO1NBQ0osQ0FBQyxDQUFDO1FBQ0gsSUFBTSxLQUFLLEdBQUcscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDM0MsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDdEIsSUFBSSxFQUFFLFNBQVM7WUFDZixJQUFJLEVBQUUscUVBQXFFO1lBQzNFLEVBQUUsRUFBRSxnQkFBZ0I7U0FDckIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsa0NBQWtDLEVBQUU7UUFDckMsSUFBTSxVQUFVLEdBQUcseUJBQWEsQ0FBQyxnQ0FBZ0MsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDeEYsYUFBTSxDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUscUVBQXFFLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGU6cXVvdGVtYXJrICovXG5pbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvbW9kZWwnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cblxuZnVuY3Rpb24gYXNzZW1ibGVGcm9tU29ydEFycmF5KG1vZGVsOiBNb2RlbFdpdGhGaWVsZCkge1xuICBjb25zdCBub2RlID0gQ2FsY3VsYXRlTm9kZS5wYXJzZUFsbEZvclNvcnRJbmRleChudWxsLCBtb2RlbCkgYXMgQ2FsY3VsYXRlTm9kZTtcbiAgcmV0dXJuIG5vZGUuYXNzZW1ibGUoKTtcbn1cblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9jYWxjdWxhdGUnLCAoKSA9PiB7XG4gIGl0KCdtYWtlQWxsRm9yU29ydEluZGV4JywgKCkgPT4ge1xuICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgZGF0YToge1xuICAgICAgICB2YWx1ZXM6IFtcbiAgICAgICAgICB7YTogJ0EnLGI6IDI4fSwge2E6ICdCJyxiOiA1NX0sIHthOiAnQycsYjogNDN9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICBtYXJrOiAnYmFyJyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnLCBzb3J0OiBbJ0InLCAnQScsICdDJ119LFxuICAgICAgICAgIHk6IHtmaWVsZDogJ2InLCB0eXBlOiAncXVhbnRpdGF0aXZlJ31cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IG5vZGVzID0gYXNzZW1ibGVGcm9tU29ydEFycmF5KG1vZGVsKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsKG5vZGVzLCB7XG4gICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICBleHByOiBcImRhdHVtLmEgPT09ICdCJyA/IDAgOiBkYXR1bS5hID09PSAnQScgPyAxIDogZGF0dW0uYSA9PT0gJ0MnID8gMiA6IDNcIixcbiAgICAgIGFzOiAneF9hX3NvcnRfaW5kZXgnXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdjYWxjdWxhdGVFeHByZXNzaW9uRnJvbVNvcnRGaWVsZCcsICgpID0+IHtcbiAgICBjb25zdCBleHByZXNzaW9uID0gQ2FsY3VsYXRlTm9kZS5jYWxjdWxhdGVFeHByZXNzaW9uRnJvbVNvcnRGaWVsZCgnYScsIFtcIkJcIiwgXCJBXCIsIFwiQ1wiXSk7XG4gICAgYXNzZXJ0LmVxdWFsKGV4cHJlc3Npb24sIFwiZGF0dW0uYSA9PT0gJ0InID8gMCA6IGRhdHVtLmEgPT09ICdBJyA/IDEgOiBkYXR1bS5hID09PSAnQycgPyAyIDogM1wiKTtcbiAgfSk7XG59KTtcbiJdfQ==