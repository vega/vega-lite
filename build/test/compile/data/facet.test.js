"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var facet_1 = require("../../../src/compile/data/facet");
var util_1 = require("../../util");
describe('compile/data/facet', function () {
    describe('assemble', function () {
        it('should calculate column distinct if child has an independent discrete scale with step', function () {
            var model = util_1.parseFacetModelWithScale({
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'description': 'A trellis bar chart showing the US population distribution of age groups and gender in 2000.',
                'data': { 'url': 'data/population.json' },
                'facet': { 'column': { 'field': 'gender', 'type': 'nominal' } },
                'spec': {
                    'mark': 'bar',
                    'encoding': {
                        'y': {
                            'aggregate': 'sum', 'field': 'people', 'type': 'quantitative',
                            'axis': { 'title': 'population' }
                        },
                        'x': {
                            'field': 'age', 'type': 'ordinal',
                            'scale': { 'rangeStep': 17 }
                        },
                        'color': {
                            'field': 'gender', 'type': 'nominal',
                            'scale': { 'range': ['#EA98D2', '#659CCA'] }
                        }
                    }
                },
                'resolve': {
                    'scale': { 'x': 'independent' }
                },
                'config': { 'view': { 'fill': 'yellow' } }
            });
            var node = new facet_1.FacetNode(null, model, 'facetName', 'dataName');
            var data = node.assemble();
            chai_1.assert.deepEqual(data[0], {
                name: 'column_domain',
                source: 'dataName',
                transform: [{
                        type: 'aggregate',
                        groupby: ['gender'],
                        fields: ['age'],
                        ops: ['distinct']
                    }]
            });
        });
        it('should calculate column and row distinct if child has an independent discrete scale with step and the facet has both row and column', function () {
            var model = util_1.parseFacetModelWithScale({
                '$schema': 'https://vega.github.io/schema/vega-lite/v2.json',
                'data': { 'values': [
                        { 'r': 'r1', 'c': 'c1', 'a': 'a1', 'b': 'b1' },
                        { 'r': 'r1', 'c': 'c1', 'a': 'a2', 'b': 'b2' },
                        { 'r': 'r2', 'c': 'c2', 'a': 'a1', 'b': 'b1' },
                        { 'r': 'r3', 'c': 'c2', 'a': 'a3', 'b': 'b2' }
                    ] },
                'facet': {
                    'row': { 'field': 'r', 'type': 'nominal' },
                    'column': { 'field': 'c', 'type': 'nominal' }
                },
                'spec': {
                    'mark': 'rect',
                    'encoding': {
                        'y': { 'field': 'b', 'type': 'nominal' },
                        'x': { 'field': 'a', 'type': 'nominal' }
                    }
                },
                'resolve': {
                    'scale': {
                        'x': 'independent',
                        'y': 'independent'
                    }
                }
            });
            var node = new facet_1.FacetNode(null, model, 'facetName', 'dataName');
            var data = node.assemble();
            // crossed data
            chai_1.assert.deepEqual(data[0], {
                name: 'cross_column_domain_row_domain',
                source: 'dataName',
                transform: [{
                        type: 'aggregate',
                        groupby: ['c', 'r'],
                        fields: ['a', 'b'],
                        ops: ['distinct', 'distinct']
                    }]
            });
            chai_1.assert.deepEqual(data[1], {
                name: 'column_domain',
                source: 'cross_column_domain_row_domain',
                transform: [{
                        type: 'aggregate',
                        groupby: ['c'],
                        fields: ['distinct_a'],
                        ops: ['max'],
                        as: ['distinct_a']
                    }]
            });
            chai_1.assert.deepEqual(data[2], {
                name: 'row_domain',
                source: 'cross_column_domain_row_domain',
                transform: [{
                        type: 'aggregate',
                        groupby: ['r'],
                        fields: ['distinct_b'],
                        ops: ['max'],
                        as: ['distinct_b']
                    }]
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2ZhY2V0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIseURBQTBEO0FBQzFELG1DQUFvRDtBQUVwRCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsdUZBQXVGLEVBQUU7WUFDMUYsSUFBTSxLQUFLLEdBQUcsK0JBQXdCLENBQUM7Z0JBQ3JDLFNBQVMsRUFBRSxpREFBaUQ7Z0JBQzVELGFBQWEsRUFBRSw4RkFBOEY7Z0JBQzdHLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQztnQkFDdkMsT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLEVBQUM7Z0JBQzNELE1BQU0sRUFBRTtvQkFDTixNQUFNLEVBQUUsS0FBSztvQkFDYixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsY0FBYzs0QkFDN0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQzt5QkFDaEM7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVM7NEJBQ2pDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUM7eUJBQzNCO3dCQUNELE9BQU8sRUFBRTs0QkFDUCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTOzRCQUNwQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLEVBQUM7eUJBQzFDO3FCQUNGO2lCQUNGO2dCQUNELFNBQVMsRUFB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QUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDbEIsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztxQkFDOUIsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEVBQUUsZUFBZTtnQkFDckIsTUFBTSxFQUFFLGdDQUFnQztnQkFDeEMsU0FBUyxFQUFDLENBQUM7d0JBQ1QsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQzt3QkFDZCxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7d0JBQ3RCLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDWixFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUM7cUJBQ25CLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLE1BQU0sRUFBRSxnQ0FBZ0M7Z0JBQ3hDLFNBQVMsRUFBQyxDQUFDO3dCQUNULElBQUksRUFBRSxXQUFXO3dCQUNqQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQ2QsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUN0QixHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7d0JBQ1osRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO3FCQUNuQixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtGYWNldE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmFjZXQnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2ZhY2V0JywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGN1bGF0ZSBjb2x1bW4gZGlzdGluY3QgaWYgY2hpbGQgaGFzIGFuIGluZGVwZW5kZW50IGRpc2NyZXRlIHNjYWxlIHdpdGggc3RlcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgJyRzY2hlbWEnOiAnaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb24nLFxuICAgICAgICAnZGVzY3JpcHRpb24nOiAnQSB0cmVsbGlzIGJhciBjaGFydCBzaG93aW5nIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGFuZCBnZW5kZXIgaW4gMjAwMC4nLFxuICAgICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvcG9wdWxhdGlvbi5qc29uJ30sXG4gICAgICAgICdmYWNldCc6IHsnY29sdW1uJzogeydmaWVsZCc6ICdnZW5kZXInLCAndHlwZSc6ICdub21pbmFsJ319LFxuICAgICAgICAnc3BlYyc6IHtcbiAgICAgICAgICAnbWFyayc6ICdiYXInLFxuICAgICAgICAgICdlbmNvZGluZyc6IHtcbiAgICAgICAgICAgICd5Jzoge1xuICAgICAgICAgICAgICAnYWdncmVnYXRlJzogJ3N1bScsICdmaWVsZCc6ICdwZW9wbGUnLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnLFxuICAgICAgICAgICAgICAnYXhpcyc6IHsndGl0bGUnOiAncG9wdWxhdGlvbid9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3gnOiB7XG4gICAgICAgICAgICAgICdmaWVsZCc6ICdhZ2UnLCAndHlwZSc6ICdvcmRpbmFsJyxcbiAgICAgICAgICAgICAgJ3NjYWxlJzogeydyYW5nZVN0ZXAnOiAxN31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29sb3InOiB7XG4gICAgICAgICAgICAgICdmaWVsZCc6ICdnZW5kZXInLCAndHlwZSc6ICdub21pbmFsJyxcbiAgICAgICAgICAgICAgJ3NjYWxlJzogeydyYW5nZSc6IFsnI0VBOThEMicsJyM2NTlDQ0EnXX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdyZXNvbHZlJzoge1xuICAgICAgICAgICdzY2FsZSc6IHsneCc6ICdpbmRlcGVuZGVudCd9XG4gICAgICAgIH0sXG4gICAgICAgICdjb25maWcnOiB7J3ZpZXcnOiB7J2ZpbGwnOiAneWVsbG93J319XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgbm9kZSA9IG5ldyBGYWNldE5vZGUobnVsbCwgbW9kZWwsICdmYWNldE5hbWUnLCAnZGF0YU5hbWUnKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBub2RlLmFzc2VtYmxlKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZGF0YVswXSwge1xuICAgICAgICBuYW1lOiAnY29sdW1uX2RvbWFpbicsXG4gICAgICAgIHNvdXJjZTogJ2RhdGFOYW1lJyxcbiAgICAgICAgdHJhbnNmb3JtOlt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydnZW5kZXInXSxcbiAgICAgICAgICBmaWVsZHM6IFsnYWdlJ10sXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29sdW1uIGFuZCByb3cgZGlzdGluY3QgaWYgY2hpbGQgaGFzIGFuIGluZGVwZW5kZW50IGRpc2NyZXRlIHNjYWxlIHdpdGggc3RlcCBhbmQgdGhlIGZhY2V0IGhhcyBib3RoIHJvdyBhbmQgY29sdW1uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAnJHNjaGVtYSc6ICdodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvbicsXG4gICAgICAgICdkYXRhJzogeyd2YWx1ZXMnOiBbXG4gICAgICAgICAgeydyJzogJ3IxJywgJ2MnOiAnYzEnLCAnYSc6ICdhMScsICdiJzogJ2IxJ30sXG4gICAgICAgICAgeydyJzogJ3IxJywgJ2MnOiAnYzEnLCAnYSc6ICdhMicsICdiJzogJ2IyJ30sXG4gICAgICAgICAgeydyJzogJ3IyJywgJ2MnOiAnYzInLCAnYSc6ICdhMScsICdiJzogJ2IxJ30sXG4gICAgICAgICAgeydyJzogJ3IzJywgJ2MnOiAnYzInLCAnYSc6ICdhMycsICdiJzogJ2IyJ31cbiAgICAgICAgXX0sXG4gICAgICAgICdmYWNldCc6IHtcbiAgICAgICAgICAncm93JzogeydmaWVsZCc6ICdyJywgJ3R5cGUnOiAnbm9taW5hbCd9LFxuICAgICAgICAgICdjb2x1bW4nOiB7J2ZpZWxkJzogJ2MnLCAndHlwZSc6ICdub21pbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgJ3NwZWMnOiB7XG4gICAgICAgICAgJ21hcmsnOiAncmVjdCcsXG4gICAgICAgICAgJ2VuY29kaW5nJzoge1xuICAgICAgICAgICAgJ3knOiB7J2ZpZWxkJzogJ2InLCAndHlwZSc6ICdub21pbmFsJ30sXG4gICAgICAgICAgICAneCc6IHsnZmllbGQnOiAnYScsICd0eXBlJzogJ25vbWluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc29sdmUnOiB7XG4gICAgICAgICAgJ3NjYWxlJzoge1xuICAgICAgICAgICAgJ3gnOiAnaW5kZXBlbmRlbnQnLFxuICAgICAgICAgICAgJ3knOiAnaW5kZXBlbmRlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgbm9kZSA9IG5ldyBGYWNldE5vZGUobnVsbCwgbW9kZWwsICdmYWNldE5hbWUnLCAnZGF0YU5hbWUnKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBub2RlLmFzc2VtYmxlKCk7XG5cbiAgICAgIC8vIGNyb3NzZWQgZGF0YVxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkYXRhWzBdLCB7XG4gICAgICAgIG5hbWU6ICdjcm9zc19jb2x1bW5fZG9tYWluX3Jvd19kb21haW4nLFxuICAgICAgICBzb3VyY2U6ICdkYXRhTmFtZScsXG4gICAgICAgIHRyYW5zZm9ybTpbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYycsICdyJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCcsICdkaXN0aW5jdCddXG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkYXRhWzFdLCB7XG4gICAgICAgIG5hbWU6ICdjb2x1bW5fZG9tYWluJyxcbiAgICAgICAgc291cmNlOiAnY3Jvc3NfY29sdW1uX2RvbWFpbl9yb3dfZG9tYWluJyxcbiAgICAgICAgdHJhbnNmb3JtOlt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydjJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2Rpc3RpbmN0X2EnXSxcbiAgICAgICAgICBvcHM6IFsnbWF4J10sXG4gICAgICAgICAgYXM6IFsnZGlzdGluY3RfYSddXG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkYXRhWzJdLCB7XG4gICAgICAgIG5hbWU6ICdyb3dfZG9tYWluJyxcbiAgICAgICAgc291cmNlOiAnY3Jvc3NfY29sdW1uX2RvbWFpbl9yb3dfZG9tYWluJyxcbiAgICAgICAgdHJhbnNmb3JtOlt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydyJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2Rpc3RpbmN0X2InXSxcbiAgICAgICAgICBvcHM6IFsnbWF4J10sXG4gICAgICAgICAgYXM6IFsnZGlzdGluY3RfYiddXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==