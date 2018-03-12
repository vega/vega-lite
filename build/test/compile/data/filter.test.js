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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9maWx0ZXIudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsNkJBQTRCO0FBRTVCLCtEQUFnRTtBQUNoRSxxRUFBZ0U7QUFDaEUseURBQW9FO0FBRXBFLG1DQUEwQztBQUUxQyxRQUFRLENBQUMscUJBQXFCLEVBQUU7SUFDOUIsRUFBRSxDQUFDLHlDQUF5QyxFQUFFO1FBQzVDLElBQU0sS0FBSyxHQUFHLHFCQUFjLENBQUM7WUFDM0IsTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBQztZQUN6QixXQUFXLEVBQUU7Z0JBQ1gsRUFBQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBQyxFQUFDO2dCQUNqRCxFQUFDLFFBQVEsRUFBRSxFQUFDLE9BQU8sRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxFQUFDLEVBQUM7Z0JBQy9DLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsRUFBRSxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQyxFQUFDLEVBQUM7Z0JBQ2pFLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUMsRUFBQzthQUM1QztZQUNELE1BQU0sRUFBRSxPQUFPO1lBQ2YsUUFBUSxFQUFFLEVBQUU7U0FDYixDQUFDLENBQUM7UUFFSCxJQUFJLEtBQUssR0FBaUIsRUFBRSxDQUFDO1FBRTdCLHlGQUF5RjtRQUN6RixJQUFNLElBQUksR0FBRyxJQUFJLHVCQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsMkJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFNUIsT0FBTyxJQUFJLENBQUMsV0FBVyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDOUIsRUFBRSxDQUFDLENBQUMsSUFBSSxZQUFZLHVCQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUM5QixLQUFLLGdCQUFPLEtBQUssRUFBSyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsQ0FBQztZQUNELGFBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUM7UUFFRCxhQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRTtZQUN0QixDQUFDLEVBQUUsTUFBTTtZQUNULENBQUMsRUFBRSxRQUFRO1lBQ1gsQ0FBQyxFQUFFLE1BQU07WUFDVCxDQUFDLEVBQUUsUUFBUTtTQUNaLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5cbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2RhdGFmbG93JztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7cGFyc2VUcmFuc2Zvcm1BcnJheX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXJzZSc7XG5pbXBvcnQge0RpY3R9IGZyb20gJy4uLy4uLy4uL3NyYy91dGlsJztcbmltcG9ydCB7cGFyc2VVbml0TW9kZWx9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2ZpbHRlcicsICgpID0+IHtcbiAgaXQoJ3Nob3VsZCBjcmVhdGUgcGFyc2UgZm9yIGZpbHRlcmVkIGZpZWxkcycsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnYS5qc29uJ30sXG4gICAgICAndHJhbnNmb3JtJzogW1xuICAgICAgICB7J2ZpbHRlcic6IHsnZmllbGQnOiAnYScsICdlcXVhbCc6IHt5ZWFyOiAyMDAwfX19LFxuICAgICAgICB7J2ZpbHRlcic6IHsnZmllbGQnOiAnYicsICdvbmVPZic6IFsnYScsICdiJ119fSxcbiAgICAgICAgeydmaWx0ZXInOiB7J2ZpZWxkJzogJ2MnLCAncmFuZ2UnOiBbe3llYXI6IDIwMDB9LCB7eWVhcjogMjAwMX1dfX0sXG4gICAgICAgIHsnZmlsdGVyJzogeydmaWVsZCc6ICdkJywgJ3JhbmdlJzogWzEsIDJdfX1cbiAgICAgIF0sXG4gICAgICAnbWFyayc6ICdwb2ludCcsXG4gICAgICBlbmNvZGluZzoge31cbiAgICB9KTtcblxuICAgIGxldCBwYXJzZTogRGljdDxzdHJpbmc+ID0ge307XG5cbiAgICAvLyBleHRyYWN0IHRoZSBwYXJzZSBmcm9tIHRoZSBwYXJzZSBub2RlcyB0aGF0IHdlcmUgZ2VuZXJhdGVkIGFsb25nIHdpdGggdGhlIGZpbHRlciBub2Rlc1xuICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgIHBhcnNlVHJhbnNmb3JtQXJyYXkocm9vdCwgbW9kZWwpO1xuICAgIGxldCBub2RlID0gcm9vdC5jaGlsZHJlblswXTtcblxuICAgIHdoaWxlIChub2RlLm51bUNoaWxkcmVuKCkgPiAwKSB7XG4gICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFBhcnNlTm9kZSkge1xuICAgICAgICBwYXJzZSA9IHsuLi5wYXJzZSwgLi4ubm9kZS5wYXJzZX07XG4gICAgICB9XG4gICAgICBhc3NlcnQuZXF1YWwobm9kZS5udW1DaGlsZHJlbigpLCAxKTtcbiAgICAgIG5vZGUgPSBub2RlLmNoaWxkcmVuWzBdO1xuICAgIH1cblxuICAgIGFzc2VydC5kZWVwRXF1YWwocGFyc2UsIHtcbiAgICAgIGE6ICdkYXRlJyxcbiAgICAgIGI6ICdzdHJpbmcnLFxuICAgICAgYzogJ2RhdGUnLFxuICAgICAgZDogJ251bWJlcidcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==