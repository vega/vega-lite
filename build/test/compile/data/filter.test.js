"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var dataflow_1 = require("../../../src/compile/data/dataflow");
var formatparse_1 = require("../../../src/compile/data/formatparse");
var parse_1 = require("../../../src/compile/data/parse");
var util_1 = require("../../util");
describe('compile/data/filter', function () {
    it('should create parse for filtered fields', function () {
        var model = util_1.parseUnitModel({
            'data': { 'url': 'a.json' },
            'transform': [
                { 'filter': { 'field': 'a', 'equal': { year: 2000 } } },
                { 'filter': { 'field': 'b', 'oneOf': ['a', 'b'] } },
                { 'filter': { 'field': 'c', 'range': [{ year: 2000 }, { year: 2001 }] } },
                { 'filter': { 'field': 'd', 'range': [1, 2] } }
            ],
            'mark': 'point',
            encoding: {}
        });
        var parse = {};
        // extract the parse from the parse nodes that were generated along with the filter nodes
        var root = new dataflow_1.DataFlowNode(null);
        parse_1.parseTransformArray(root, model);
        var node = root.children[0];
        while (node.numChildren() > 0) {
            if (node instanceof formatparse_1.ParseNode) {
                parse = __assign({}, parse, node.parse);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9maWx0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBRTVCLCtEQUFnRTtBQUNoRSxxRUFBZ0U7QUFDaEUseURBQW9FO0FBRXBFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1FBQzVDLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQztZQUN6QixXQUFXLEVBQUU7Z0JBQ1gsRUFBQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBQyxFQUFDO2dCQUNqRCxFQUFDLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDLEVBQUM7Z0JBQy9DLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFDLEVBQUM7Z0JBQ2pFLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBQzthQUM1QztZQUNELE1BQU0sRUFBRSxPQUFPO1lBQ2YsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssR0FBaUIsRUFBRSxDQUFDO1FBRTdCLHlGQUF5RjtRQUN6RixJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsMkJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUIsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLElBQUksSUFBSSxZQUFZLHVCQUFTLEVBQUU7Z0JBQzdCLEtBQUssZ0JBQU8sS0FBSyxFQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNuQztZQUNELGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDdEIsQ0FBQyxFQUFFLE1BQU07WUFDVCxDQUFDLEVBQUUsUUFBUTtZQUNYLENBQUMsRUFBRSxNQUFNO1lBQ1QsQ0FBQyxFQUFFLFFBQVE7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuXG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge3BhcnNlVHJhbnNmb3JtQXJyYXl9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvcGFyc2UnO1xuaW1wb3J0IHtEaWN0fSBmcm9tICcuLi8uLi8uLi9zcmMvdXRpbCc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9maWx0ZXInLCAoKSA9PiB7XG4gIGl0KCdzaG91bGQgY3JlYXRlIHBhcnNlIGZvciBmaWx0ZXJlZCBmaWVsZHMnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbCh7XG4gICAgICAnZGF0YSc6IHsndXJsJzogJ2EuanNvbid9LFxuICAgICAgJ3RyYW5zZm9ybSc6IFtcbiAgICAgICAgeydmaWx0ZXInOiB7J2ZpZWxkJzogJ2EnLCAnZXF1YWwnOiB7eWVhcjogMjAwMH19fSxcbiAgICAgICAgeydmaWx0ZXInOiB7J2ZpZWxkJzogJ2InLCAnb25lT2YnOiBbJ2EnLCAnYiddfX0sXG4gICAgICAgIHsnZmlsdGVyJzogeydmaWVsZCc6ICdjJywgJ3JhbmdlJzogW3t5ZWFyOiAyMDAwfSwge3llYXI6IDIwMDF9XX19LFxuICAgICAgICB7J2ZpbHRlcic6IHsnZmllbGQnOiAnZCcsICdyYW5nZSc6IFsxLCAyXX19XG4gICAgICBdLFxuICAgICAgJ21hcmsnOiAncG9pbnQnLFxuICAgICAgZW5jb2Rpbmc6IHt9XG4gICAgfSk7XG5cbiAgICBsZXQgcGFyc2U6IERpY3Q8c3RyaW5nPiA9IHt9O1xuXG4gICAgLy8gZXh0cmFjdCB0aGUgcGFyc2UgZnJvbSB0aGUgcGFyc2Ugbm9kZXMgdGhhdCB3ZXJlIGdlbmVyYXRlZCBhbG9uZyB3aXRoIHRoZSBmaWx0ZXIgbm9kZXNcbiAgICBjb25zdCByb290ID0gbmV3IERhdGFGbG93Tm9kZShudWxsKTtcbiAgICBwYXJzZVRyYW5zZm9ybUFycmF5KHJvb3QsIG1vZGVsKTtcbiAgICBsZXQgbm9kZSA9IHJvb3QuY2hpbGRyZW5bMF07XG5cbiAgICB3aGlsZSAobm9kZS5udW1DaGlsZHJlbigpID4gMCkge1xuICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBQYXJzZU5vZGUpIHtcbiAgICAgICAgcGFyc2UgPSB7Li4ucGFyc2UsIC4uLm5vZGUucGFyc2V9O1xuICAgICAgfVxuICAgICAgYXNzZXJ0LmVxdWFsKG5vZGUubnVtQ2hpbGRyZW4oKSwgMSk7XG4gICAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICB9XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsKHBhcnNlLCB7XG4gICAgICBhOiAnZGF0ZScsXG4gICAgICBiOiAnc3RyaW5nJyxcbiAgICAgIGM6ICdkYXRlJyxcbiAgICAgIGQ6ICdudW1iZXInXG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=