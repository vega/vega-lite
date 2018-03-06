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
            var node = new facet_1.FacetNode(model, 'facetName', 'dataName');
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
            var node = new facet_1.FacetNode(model, 'facetName', 'dataName');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2ZhY2V0LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIseURBQTBEO0FBQzFELG1DQUFvRDtBQUVwRCxRQUFRLENBQUMsb0JBQW9CLEVBQUU7SUFDN0IsUUFBUSxDQUFDLFVBQVUsRUFBRTtRQUNuQixFQUFFLENBQUMsdUZBQXVGLEVBQUU7WUFDMUYsSUFBTSxLQUFLLEdBQUcsK0JBQXdCLENBQUM7Z0JBQ3JDLFNBQVMsRUFBRSxpREFBaUQ7Z0JBQzVELGFBQWEsRUFBRSw4RkFBOEY7Z0JBQzdHLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSxzQkFBc0IsRUFBQztnQkFDdkMsT0FBTyxFQUFFLEVBQUMsUUFBUSxFQUFFLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLEVBQUM7Z0JBQzNELE1BQU0sRUFBRTtvQkFDTixNQUFNLEVBQUUsS0FBSztvQkFDYixVQUFVLEVBQUU7d0JBQ1YsR0FBRyxFQUFFOzRCQUNILFdBQVcsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsY0FBYzs0QkFDN0QsTUFBTSxFQUFFLEVBQUMsT0FBTyxFQUFFLFlBQVksRUFBQzt5QkFDaEM7d0JBQ0QsR0FBRyxFQUFFOzRCQUNILE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFNBQVM7NEJBQ2pDLE9BQU8sRUFBRSxFQUFDLFdBQVcsRUFBRSxFQUFFLEVBQUM7eUJBQzNCO3dCQUNELE9BQU8sRUFBRTs0QkFDUCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxTQUFTOzRCQUNwQyxPQUFPLEVBQUUsRUFBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUMsU0FBUyxDQUFDLEVBQUM7eUJBQzFDO3FCQUNGO2lCQUNGO2dCQUNELFNBQVMsRUFB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QUFHLENBQUM7d0JBQ2xCLEdBQUcsRUFBRSxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7cUJBQzlCLENBQUM7YUFDSCxDQUFDLENBQUM7WUFFSCxhQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDeEIsSUFBSSxFQUFFLGVBQWU7Z0JBQ3JCLE1BQU0sRUFBRSxnQ0FBZ0M7Z0JBQ3hDLFNBQVMsRUFBQyxDQUFDO3dCQUNULElBQUksRUFBRSxXQUFXO3dCQUNqQixPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUM7d0JBQ2QsTUFBTSxFQUFFLENBQUMsWUFBWSxDQUFDO3dCQUN0QixHQUFHLEVBQUUsQ0FBQyxLQUFLLENBQUM7d0JBQ1osRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDO3FCQUNuQixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3hCLElBQUksRUFBRSxZQUFZO2dCQUNsQixNQUFNLEVBQUUsZ0NBQWdDO2dCQUN4QyxTQUFTLEVBQUMsQ0FBQzt3QkFDVCxJQUFJLEVBQUUsV0FBVzt3QkFDakIsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDO3dCQUNkLE1BQU0sRUFBRSxDQUFDLFlBQVksQ0FBQzt3QkFDdEIsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO3dCQUNaLEVBQUUsRUFBRSxDQUFDLFlBQVksQ0FBQztxQkFDbkIsQ0FBQzthQUNILENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7RmFjZXROb2RlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0JztcbmltcG9ydCB7cGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9mYWNldCcsIGZ1bmN0aW9uKCkge1xuICBkZXNjcmliZSgnYXNzZW1ibGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBjYWxjdWxhdGUgY29sdW1uIGRpc3RpbmN0IGlmIGNoaWxkIGhhcyBhbiBpbmRlcGVuZGVudCBkaXNjcmV0ZSBzY2FsZSB3aXRoIHN0ZXAnLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlRmFjZXRNb2RlbFdpdGhTY2FsZSh7XG4gICAgICAgICckc2NoZW1hJzogJ2h0dHBzOi8vdmVnYS5naXRodWIuaW8vc2NoZW1hL3ZlZ2EtbGl0ZS92Mi5qc29uJyxcbiAgICAgICAgJ2Rlc2NyaXB0aW9uJzogJ0EgdHJlbGxpcyBiYXIgY2hhcnQgc2hvd2luZyB0aGUgVVMgcG9wdWxhdGlvbiBkaXN0cmlidXRpb24gb2YgYWdlIGdyb3VwcyBhbmQgZ2VuZGVyIGluIDIwMDAuJyxcbiAgICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL3BvcHVsYXRpb24uanNvbid9LFxuICAgICAgICAnZmFjZXQnOiB7J2NvbHVtbic6IHsnZmllbGQnOiAnZ2VuZGVyJywgJ3R5cGUnOiAnbm9taW5hbCd9fSxcbiAgICAgICAgJ3NwZWMnOiB7XG4gICAgICAgICAgJ21hcmsnOiAnYmFyJyxcbiAgICAgICAgICAnZW5jb2RpbmcnOiB7XG4gICAgICAgICAgICAneSc6IHtcbiAgICAgICAgICAgICAgJ2FnZ3JlZ2F0ZSc6ICdzdW0nLCAnZmllbGQnOiAncGVvcGxlJywgJ3R5cGUnOiAncXVhbnRpdGF0aXZlJyxcbiAgICAgICAgICAgICAgJ2F4aXMnOiB7J3RpdGxlJzogJ3BvcHVsYXRpb24nfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICd4Jzoge1xuICAgICAgICAgICAgICAnZmllbGQnOiAnYWdlJywgJ3R5cGUnOiAnb3JkaW5hbCcsXG4gICAgICAgICAgICAgICdzY2FsZSc6IHsncmFuZ2VTdGVwJzogMTd9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgJ2NvbG9yJzoge1xuICAgICAgICAgICAgICAnZmllbGQnOiAnZ2VuZGVyJywgJ3R5cGUnOiAnbm9taW5hbCcsXG4gICAgICAgICAgICAgICdzY2FsZSc6IHsncmFuZ2UnOiBbJyNFQTk4RDInLCcjNjU5Q0NBJ119XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAncmVzb2x2ZSc6IHtcbiAgICAgICAgICAnc2NhbGUnOiB7J3gnOiAnaW5kZXBlbmRlbnQnfVxuICAgICAgICB9LFxuICAgICAgICAnY29uZmlnJzogeyd2aWV3JzogeydmaWxsJzogJ3llbGxvdyd9fVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5vZGUgPSBuZXcgRmFjZXROb2RlKG1vZGVsLCAnZmFjZXROYW1lJywgJ2RhdGFOYW1lJyk7XG4gICAgICBjb25zdCBkYXRhID0gbm9kZS5hc3NlbWJsZSgpO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKGRhdGFbMF0sIHtcbiAgICAgICAgbmFtZTogJ2NvbHVtbl9kb21haW4nLFxuICAgICAgICBzb3VyY2U6ICdkYXRhTmFtZScsXG4gICAgICAgIHRyYW5zZm9ybTpbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnZ2VuZGVyJ10sXG4gICAgICAgICAgZmllbGRzOiBbJ2FnZSddLFxuICAgICAgICAgIG9wczogWydkaXN0aW5jdCddXG4gICAgICAgIH1dXG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgY2FsY3VsYXRlIGNvbHVtbiBhbmQgcm93IGRpc3RpbmN0IGlmIGNoaWxkIGhhcyBhbiBpbmRlcGVuZGVudCBkaXNjcmV0ZSBzY2FsZSB3aXRoIHN0ZXAgYW5kIHRoZSBmYWNldCBoYXMgYm90aCByb3cgYW5kIGNvbHVtbicsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VGYWNldE1vZGVsV2l0aFNjYWxlKHtcbiAgICAgICAgJyRzY2hlbWEnOiAnaHR0cHM6Ly92ZWdhLmdpdGh1Yi5pby9zY2hlbWEvdmVnYS1saXRlL3YyLmpzb24nLFxuICAgICAgICAnZGF0YSc6IHsndmFsdWVzJzogW1xuICAgICAgICAgIHsncic6ICdyMScsICdjJzogJ2MxJywgJ2EnOiAnYTEnLCAnYic6ICdiMSd9LFxuICAgICAgICAgIHsncic6ICdyMScsICdjJzogJ2MxJywgJ2EnOiAnYTInLCAnYic6ICdiMid9LFxuICAgICAgICAgIHsncic6ICdyMicsICdjJzogJ2MyJywgJ2EnOiAnYTEnLCAnYic6ICdiMSd9LFxuICAgICAgICAgIHsncic6ICdyMycsICdjJzogJ2MyJywgJ2EnOiAnYTMnLCAnYic6ICdiMid9XG4gICAgICAgIF19LFxuICAgICAgICAnZmFjZXQnOiB7XG4gICAgICAgICAgJ3Jvdyc6IHsnZmllbGQnOiAncicsICd0eXBlJzogJ25vbWluYWwnfSxcbiAgICAgICAgICAnY29sdW1uJzogeydmaWVsZCc6ICdjJywgJ3R5cGUnOiAnbm9taW5hbCd9XG4gICAgICAgIH0sXG4gICAgICAgICdzcGVjJzoge1xuICAgICAgICAgICdtYXJrJzogJ3JlY3QnLFxuICAgICAgICAgICdlbmNvZGluZyc6IHtcbiAgICAgICAgICAgICd5JzogeydmaWVsZCc6ICdiJywgJ3R5cGUnOiAnbm9taW5hbCd9LFxuICAgICAgICAgICAgJ3gnOiB7J2ZpZWxkJzogJ2EnLCAndHlwZSc6ICdub21pbmFsJ31cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgICdyZXNvbHZlJzoge1xuICAgICAgICAgICdzY2FsZSc6IHtcbiAgICAgICAgICAgICd4JzogJ2luZGVwZW5kZW50JyxcbiAgICAgICAgICAgICd5JzogJ2luZGVwZW5kZW50J1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IG5vZGUgPSBuZXcgRmFjZXROb2RlKG1vZGVsLCAnZmFjZXROYW1lJywgJ2RhdGFOYW1lJyk7XG4gICAgICBjb25zdCBkYXRhID0gbm9kZS5hc3NlbWJsZSgpO1xuXG4gICAgICAvLyBjcm9zc2VkIGRhdGFcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZGF0YVswXSwge1xuICAgICAgICBuYW1lOiAnY3Jvc3NfY29sdW1uX2RvbWFpbl9yb3dfZG9tYWluJyxcbiAgICAgICAgc291cmNlOiAnZGF0YU5hbWUnLFxuICAgICAgICB0cmFuc2Zvcm06W3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiBbJ2MnLCAnciddLFxuICAgICAgICAgIGZpZWxkczogWydhJywgJ2InXSxcbiAgICAgICAgICBvcHM6IFsnZGlzdGluY3QnLCAnZGlzdGluY3QnXVxuICAgICAgICB9XVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZGF0YVsxXSwge1xuICAgICAgICBuYW1lOiAnY29sdW1uX2RvbWFpbicsXG4gICAgICAgIHNvdXJjZTogJ2Nyb3NzX2NvbHVtbl9kb21haW5fcm93X2RvbWFpbicsXG4gICAgICAgIHRyYW5zZm9ybTpbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnYyddLFxuICAgICAgICAgIGZpZWxkczogWydkaXN0aW5jdF9hJ10sXG4gICAgICAgICAgb3BzOiBbJ21heCddLFxuICAgICAgICAgIGFzOiBbJ2Rpc3RpbmN0X2EnXVxuICAgICAgICB9XVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoZGF0YVsyXSwge1xuICAgICAgICBuYW1lOiAncm93X2RvbWFpbicsXG4gICAgICAgIHNvdXJjZTogJ2Nyb3NzX2NvbHVtbl9kb21haW5fcm93X2RvbWFpbicsXG4gICAgICAgIHRyYW5zZm9ybTpbe1xuICAgICAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgICAgIGdyb3VwYnk6IFsnciddLFxuICAgICAgICAgIGZpZWxkczogWydkaXN0aW5jdF9iJ10sXG4gICAgICAgICAgb3BzOiBbJ21heCddLFxuICAgICAgICAgIGFzOiBbJ2Rpc3RpbmN0X2InXVxuICAgICAgICB9XVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=