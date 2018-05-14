import { assert } from 'chai';
import { DataFlowNode } from '../../../src/compile/data/dataflow';
import { GeoPointNode } from '../../../src/compile/data/geopoint';
import { contains, every } from '../../../src/util';
import { parseUnitModel } from '../../util';
describe('compile/data/geopoint', function () {
    describe('geojson', function () {
        it('should make transform and assemble correctly', function () {
            var model = parseUnitModel({
                'data': {
                    'url': 'data/zipcodes.csv',
                    'format': {
                        'type': 'csv'
                    }
                },
                'mark': 'circle',
                'encoding': {
                    'longitude': {
                        'field': 'longitude',
                        'type': 'quantitative'
                    },
                    'latitude': {
                        'field': 'latitude',
                        'type': 'quantitative'
                    }
                }
            });
            model.parse();
            var root = new DataFlowNode(null);
            GeoPointNode.parseAll(root, model);
            var node = root.children[0];
            var _loop_1 = function () {
                assert.instanceOf(node, GeoPointNode);
                var transform = node.assemble();
                assert.equal(transform.type, 'geopoint');
                assert.isTrue(every(['longitude', 'latitude'], function (field) { return contains(transform.fields, field); }));
                assert.isTrue(every([model.getName('x'), model.getName('y')], function (a) { return contains(transform.as, a); }));
                assert.isDefined(transform.projection);
                assert.isAtMost(node.children.length, 1);
                node = node.children[0];
            };
            while (node != null) {
                _loop_1();
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvcG9pbnQudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9kYXRhL2dlb3BvaW50LnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sb0NBQW9DLENBQUM7QUFDaEUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQ2hFLE9BQU8sRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFbEQsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUUxQyxRQUFRLENBQUMsdUJBQXVCLEVBQUU7SUFDaEMsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUNsQixFQUFFLENBQUMsOENBQThDLEVBQUU7WUFDakQsSUFBTSxLQUFLLEdBQUcsY0FBYyxDQUFDO2dCQUMzQixNQUFNLEVBQUU7b0JBQ04sS0FBSyxFQUFFLG1CQUFtQjtvQkFDMUIsUUFBUSxFQUFFO3dCQUNSLE1BQU0sRUFBRSxLQUFLO3FCQUNkO2lCQUNGO2dCQUNELE1BQU0sRUFBRSxRQUFRO2dCQUNoQixVQUFVLEVBQUU7b0JBQ1YsV0FBVyxFQUFFO3dCQUNYLE9BQU8sRUFBRSxXQUFXO3dCQUNwQixNQUFNLEVBQUUsY0FBYztxQkFDdkI7b0JBQ0QsVUFBVSxFQUFFO3dCQUNWLE9BQU8sRUFBRSxVQUFVO3dCQUNuQixNQUFNLEVBQUUsY0FBYztxQkFDdkI7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7WUFFZCxJQUFNLElBQUksR0FBRyxJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNwQyxZQUFZLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVuQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDOztnQkFHMUIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBRXRDLElBQU0sU0FBUyxHQUF1QyxJQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3ZFLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQztnQkFDekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFDLEVBQUUsVUFBQyxLQUFLLElBQUssT0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzlGLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsVUFBQyxDQUFDLElBQUssT0FBQSxRQUFRLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBekIsQ0FBeUIsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUN2QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixDQUFDO1lBVkQsT0FBTyxJQUFJLElBQUksSUFBSTs7YUFVbEI7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9kYXRhZmxvdyc7XG5pbXBvcnQge0dlb1BvaW50Tm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9nZW9wb2ludCc7XG5pbXBvcnQge2NvbnRhaW5zLCBldmVyeX0gZnJvbSAnLi4vLi4vLi4vc3JjL3V0aWwnO1xuaW1wb3J0IHtWZ0dlb1BvaW50VHJhbnNmb3JtfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL2RhdGEvZ2VvcG9pbnQnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdnZW9qc29uJywgZnVuY3Rpb24gKCkge1xuICAgIGl0KCdzaG91bGQgbWFrZSB0cmFuc2Zvcm0gYW5kIGFzc2VtYmxlIGNvcnJlY3RseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWwoe1xuICAgICAgICAnZGF0YSc6IHtcbiAgICAgICAgICAndXJsJzogJ2RhdGEvemlwY29kZXMuY3N2JyxcbiAgICAgICAgICAnZm9ybWF0Jzoge1xuICAgICAgICAgICAgJ3R5cGUnOiAnY3N2J1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgJ21hcmsnOiAnY2lyY2xlJyxcbiAgICAgICAgJ2VuY29kaW5nJzoge1xuICAgICAgICAgICdsb25naXR1ZGUnOiB7XG4gICAgICAgICAgICAnZmllbGQnOiAnbG9uZ2l0dWRlJyxcbiAgICAgICAgICAgICd0eXBlJzogJ3F1YW50aXRhdGl2ZSdcbiAgICAgICAgICB9LFxuICAgICAgICAgICdsYXRpdHVkZSc6IHtcbiAgICAgICAgICAgICdmaWVsZCc6ICdsYXRpdHVkZScsXG4gICAgICAgICAgICAndHlwZSc6ICdxdWFudGl0YXRpdmUnXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICAgIGNvbnN0IHJvb3QgPSBuZXcgRGF0YUZsb3dOb2RlKG51bGwpO1xuICAgICAgR2VvUG9pbnROb2RlLnBhcnNlQWxsKHJvb3QsIG1vZGVsKTtcblxuICAgICAgbGV0IG5vZGUgPSByb290LmNoaWxkcmVuWzBdO1xuXG4gICAgICB3aGlsZSAobm9kZSAhPSBudWxsKSB7XG4gICAgICAgIGFzc2VydC5pbnN0YW5jZU9mKG5vZGUsIEdlb1BvaW50Tm9kZSk7XG5cbiAgICAgICAgY29uc3QgdHJhbnNmb3JtOiBWZ0dlb1BvaW50VHJhbnNmb3JtID0gKDxHZW9Qb2ludE5vZGU+bm9kZSkuYXNzZW1ibGUoKTtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKHRyYW5zZm9ybS50eXBlLCAnZ2VvcG9pbnQnKTtcbiAgICAgICAgYXNzZXJ0LmlzVHJ1ZShldmVyeShbJ2xvbmdpdHVkZScsICdsYXRpdHVkZSddLCAoZmllbGQpID0+IGNvbnRhaW5zKHRyYW5zZm9ybS5maWVsZHMsIGZpZWxkKSkpO1xuICAgICAgICBhc3NlcnQuaXNUcnVlKGV2ZXJ5KFttb2RlbC5nZXROYW1lKCd4JyksIG1vZGVsLmdldE5hbWUoJ3knKV0sIChhKSA9PiBjb250YWlucyh0cmFuc2Zvcm0uYXMsIGEpKSk7XG4gICAgICAgIGFzc2VydC5pc0RlZmluZWQodHJhbnNmb3JtLnByb2plY3Rpb24pO1xuICAgICAgICBhc3NlcnQuaXNBdE1vc3Qobm9kZS5jaGlsZHJlbi5sZW5ndGgsIDEpO1xuICAgICAgICBub2RlID0gbm9kZS5jaGlsZHJlblswXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==