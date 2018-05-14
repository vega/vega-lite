import { assert } from 'chai';
import { FacetNode } from '../../../src/compile/data/facet';
import { parseFacetModelWithScale } from '../../util';
describe('compile/data/facet', function () {
    describe('assemble', function () {
        it('should calculate column distinct if child has an independent discrete scale with step', function () {
            var model = parseFacetModelWithScale({
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
            var node = new FacetNode(null, model, 'facetName', 'dataName');
            var data = node.assemble();
            assert.deepEqual(data[0], {
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
            var model = parseFacetModelWithScale({
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
            var node = new FacetNode(null, model, 'facetName', 'dataName');
            var data = node.assemble();
            // crossed data
            assert.deepEqual(data[0], {
                name: 'cross_column_domain_row_domain',
                source: 'dataName',
                transform: [{
                        type: 'aggregate',
                        groupby: ['c', 'r'],
                        fields: ['a', 'b'],
                        ops: ['distinct', 'distinct']
                    }]
            });
            assert.deepEqual(data[1], {
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
            assert.deepEqual(data[2], {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2ZhY2V0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0saUNBQWlDLENBQUM7QUFDMUQsT0FBTyxFQUFDLHdCQUF3QixFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXBELFFBQVEsQ0FBQyxvQkFBb0IsRUFBRTtJQUM3QixRQUFRLENBQUMsVUFBVSxFQUFFO1FBQ25CLEVBQUUsQ0FBQyx1RkFBdUYsRUFBRTtZQUMxRixJQUFNLEtBQUssR0FBRyx3QkFBd0IsQ0FBQztnQkFDckMsU0FBUyxFQUFFLGlEQUFpRDtnQkFDNUQsYUFBYSxFQUFFLDhGQUE4RjtnQkFDN0csTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHNCQUFzQixFQUFDO2dCQUN2QyxPQUFPLEVBQUUsRUFBQyxRQUFRLEVBQUUsRUFBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUMsRUFBQztnQkFDM0QsTUFBTSxFQUFFO29CQUNOLE1BQU0sRUFBRSxLQUFLO29CQUNiLFVBQVUsRUFBRTt3QkFDVixHQUFHLEVBQUU7NEJBQ0gsV0FBVyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxjQUFjOzRCQUM3RCxNQUFNLEVBQUUsRUFBQyxPQUFPLEVBQUUsWUFBWSxFQUFDO3lCQUNoQzt3QkFDRCxHQUFHLEVBQUU7NEJBQ0gsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUzs0QkFDakMsT0FBTyxFQUFFLEVBQUMsV0FBVyxFQUFFLEVBQUUsRUFBQzt5QkFDM0I7d0JBQ0QsT0FBTyxFQUFFOzRCQUNQLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVM7NEJBQ3BDLE9B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QUMsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsV0FBVzt3QkFDakIsT0FBTyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDbkIsTUFBTSxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQzt3QkFDbEIsR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLFVBQVUsQ0FBQztxQkFDOUIsQ0FBQzthQUNILENBQUMsQ0FBQztZQUVILE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN4QixJQUFJLEVBQUUsZUFBZTtnQkFDckIsTUFBTSxFQUFFLGdDQUFnQztnQkFDeEMsU0FBUyxFQUFDLENBQUM7d0JBQ1QsSUFBSSxFQUFFLFdBQVc7d0JBQ2pCLE9BQU8sRUFBRSxDQUFDLEdBQUcsQ0FBQzt3QkFDZCxNQUFNLEVBQUUsQ0FBQyxZQUFZLENBQUM7d0JBQ3RCLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQzt3QkFDWixFQUFFLEVBQUUsQ0FBQyxZQUFZLENBQUM7cUJBQ25CLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLFlBQVk7Z0JBQ2xCLE1BQU0sRUFBRSxnQ0FBZ0M7Z0JBQ3hDLFNBQVMsRUFBQyxDQUFDO3dCQUNULElBQUksRUFBRSxXQUFXO3dCQUNqQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQ2QsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUN0QixHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7d0JBQ1osRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO3FCQUNuQixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtGYWNldE5vZGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZmFjZXQnO1xuaW1wb3J0IHtwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9kYXRhL2ZhY2V0JywgZnVuY3Rpb24oKSB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGNhbGN1bGF0ZSBjb2x1bW4gZGlzdGluY3QgaWYgY2hpbGQgaGFzIGFuIGluZGVwZW5kZW50IGRpc2NyZXRlIHNjYWxlIHdpdGggc3RlcCcsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgJyRzY2hlbWEnOiAnaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb24nLFxuICAgICAgICAnZGVzY3JpcHRpb24nOiAnQSB0cmVsbGlzIGJhciBjaGFydCBzaG93aW5nIHRoZSBVUyBwb3B1bGF0aW9uIGRpc3RyaWJ1dGlvbiBvZiBhZ2UgZ3JvdXBzIGFuZCBnZW5kZXIgaW4gMjAwMC4nLFxuICAgICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvcG9wdWxhdGlvbi5qc29uJ30sXG4gICAgICAgICdmYWNldCc6IHsnY29sdW1uJzogeydmaWVsZCc6ICdnZW5kZXInLCAndHlwZSc6ICdub21pbmFsJ319LFxuICAgICAgICAnc3BlYyc6IHtcbiAgICAgICAgICAnbWFyayc6ICdiYXInLFxuICAgICAgICAgICdlbmNvZGluZyc6IHtcbiAgICAgICAgICAgICd5Jzoge1xuICAgICAgICAgICAgICAnYWdncmVnYXRlJzogJ3N1bScsICdmaWVsZCc6ICdwZW9wbGUnLCAndHlwZSc6ICdxdWFudGl0YXRpdmUnLFxuICAgICAgICAgICAgICAnYXhpcyc6IHsndGl0bGUnOiAncG9wdWxhdGlvbid9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ3gnOiB7XG4gICAgICAgICAgICAgICdmaWVsZCc6ICdhZ2UnLCAndHlwZSc6ICdvcmRpbmFsJyxcbiAgICAgICAgICAgICAgJ3NjYWxlJzogeydyYW5nZVN0ZXAnOiAxN31cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAnY29sb3InOiB7XG4gICAgICAgICAgICAgICdmaWVsZCc6ICdnZW5kZXInLCAndHlwZSc6ICdub21pbmFsJyxcbiAgICAgICAgICAgICAgJ3NjYWxlJzogeydyYW5nZSc6IFsnI0VBOThEMicsJyM2NTlDQ0EnXX1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdyZXNvbHZlJzoge1xuICAgICAgICAgICdzY2FsZSc6IHsneCc6ICdpbmRlcGVuZGVudCd9XG4gICAgICAgIH0sXG4gICAgICAgICdjb25maWcnOiB7J3ZpZXcnOiB7J2ZpbGwnOiAneWVsbG93J319XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgbm9kZSA9IG5ldyBGYWNldE5vZGUobnVsbCwgbW9kZWwsICdmYWNldE5hbWUnLCAnZGF0YU5hbWUnKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBub2RlLmFzc2VtYmxlKCk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZGF0YVswXSwge1xuICAgICAgICBuYW1lOiAnY29sdW1uX2RvbWFpbicsXG4gICAgICAgIHNvdXJjZTogJ2RhdGFOYW1lJyxcbiAgICAgICAgdHJhbnNmb3JtOlt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydnZW5kZXInXSxcbiAgICAgICAgICBmaWVsZHM6IFsnYWdlJ10sXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfV1cbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29sdW1uIGFuZCByb3cgZGlzdGluY3QgaWYgY2hpbGQgaGFzIGFuIGluZGVwZW5kZW50IGRpc2NyZXRlIHNjYWxlIHdpdGggc3RlcCBhbmQgdGhlIGZhY2V0IGhhcyBib3RoIHJvdyBhbmQgY29sdW1uJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZUZhY2V0TW9kZWxXaXRoU2NhbGUoe1xuICAgICAgICAnJHNjaGVtYSc6ICdodHRwczovL3ZlZ2EuZ2l0aHViLmlvL3NjaGVtYS92ZWdhLWxpdGUvdjIuanNvbicsXG4gICAgICAgICdkYXRhJzogeyd2YWx1ZXMnOiBbXG4gICAgICAgICAgeydyJzogJ3IxJywgJ2MnOiAnYzEnLCAnYSc6ICdhMScsICdiJzogJ2IxJ30sXG4gICAgICAgICAgeydyJzogJ3IxJywgJ2MnOiAnYzEnLCAnYSc6ICdhMicsICdiJzogJ2IyJ30sXG4gICAgICAgICAgeydyJzogJ3IyJywgJ2MnOiAnYzInLCAnYSc6ICdhMScsICdiJzogJ2IxJ30sXG4gICAgICAgICAgeydyJzogJ3IzJywgJ2MnOiAnYzInLCAnYSc6ICdhMycsICdiJzogJ2IyJ31cbiAgICAgICAgXX0sXG4gICAgICAgICdmYWNldCc6IHtcbiAgICAgICAgICAncm93JzogeydmaWVsZCc6ICdyJywgJ3R5cGUnOiAnbm9taW5hbCd9LFxuICAgICAgICAgICdjb2x1bW4nOiB7J2ZpZWxkJzogJ2MnLCAndHlwZSc6ICdub21pbmFsJ31cbiAgICAgICAgfSxcbiAgICAgICAgJ3NwZWMnOiB7XG4gICAgICAgICAgJ21hcmsnOiAncmVjdCcsXG4gICAgICAgICAgJ2VuY29kaW5nJzoge1xuICAgICAgICAgICAgJ3knOiB7J2ZpZWxkJzogJ2InLCAndHlwZSc6ICdub21pbmFsJ30sXG4gICAgICAgICAgICAneCc6IHsnZmllbGQnOiAnYScsICd0eXBlJzogJ25vbWluYWwnfVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ3Jlc29sdmUnOiB7XG4gICAgICAgICAgJ3NjYWxlJzoge1xuICAgICAgICAgICAgJ3gnOiAnaW5kZXBlbmRlbnQnLFxuICAgICAgICAgICAgJ3knOiAnaW5kZXBlbmRlbnQnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgY29uc3Qgbm9kZSA9IG5ldyBGYWNldE5vZGUobnVsbCwgbW9kZWwsICdmYWNldE5hbWUnLCAnZGF0YU5hbWUnKTtcbiAgICAgIGNvbnN0IGRhdGEgPSBub2RlLmFzc2VtYmxlKCk7XG5cbiAgICAgIC8vIGNyb3NzZWQgZGF0YVxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkYXRhWzBdLCB7XG4gICAgICAgIG5hbWU6ICdjcm9zc19jb2x1bW5fZG9tYWluX3Jvd19kb21haW4nLFxuICAgICAgICBzb3VyY2U6ICdkYXRhTmFtZScsXG4gICAgICAgIHRyYW5zZm9ybTpbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYycsICdyJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2EnLCAnYiddLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCcsICdkaXN0aW5jdCddXG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkYXRhWzFdLCB7XG4gICAgICAgIG5hbWU6ICdjb2x1bW5fZG9tYWluJyxcbiAgICAgICAgc291cmNlOiAnY3Jvc3NfY29sdW1uX2RvbWFpbl9yb3dfZG9tYWluJyxcbiAgICAgICAgdHJhbnNmb3JtOlt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydjJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2Rpc3RpbmN0X2EnXSxcbiAgICAgICAgICBvcHM6IFsnbWF4J10sXG4gICAgICAgICAgYXM6IFsnZGlzdGluY3RfYSddXG4gICAgICAgIH1dXG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChkYXRhWzJdLCB7XG4gICAgICAgIG5hbWU6ICdyb3dfZG9tYWluJyxcbiAgICAgICAgc291cmNlOiAnY3Jvc3NfY29sdW1uX2RvbWFpbl9yb3dfZG9tYWluJyxcbiAgICAgICAgdHJhbnNmb3JtOlt7XG4gICAgICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICAgICAgZ3JvdXBieTogWydyJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2Rpc3RpbmN0X2InXSxcbiAgICAgICAgICBvcHM6IFsnbWF4J10sXG4gICAgICAgICAgYXM6IFsnZGlzdGluY3RfYiddXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==