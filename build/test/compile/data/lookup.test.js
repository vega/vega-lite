"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var lookup_1 = require("../../../src/compile/data/lookup");
var parse_1 = require("../../../src/compile/data/parse");
var log = require("../../../src/log");
var util_1 = require("../../util");
describe('compile/data/lookup', function () {
    it('should parse lookup from array', function () {
        var model = util_1.parseUnitModel({
            'data': { 'url': 'data/lookup_groups.csv' },
            'transform': [{
                    'lookup': 'person',
                    'from': {
                        'data': { 'url': 'data/lookup_people.csv' },
                        'key': 'name',
                        'fields': ['age', 'height']
                    }
                }],
            'mark': 'bar',
            'encoding': {}
        });
        var t = parse_1.parseTransformArray(null, model);
        chai_1.assert.deepEqual(t.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            values: ['age', 'height']
        });
    });
    it('should create node for flat lookup', function () {
        var lookup = new lookup_1.LookupNode(null, {
            'lookup': 'person',
            'from': {
                'data': { 'url': 'data/lookup_people.csv' },
                'key': 'name',
                'fields': ['age', 'height']
            }
        }, 'lookup_0');
        chai_1.assert.deepEqual(lookup.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            values: ['age', 'height']
        });
    });
    it('should create node for nested lookup', function () {
        var lookup = new lookup_1.LookupNode(null, {
            'lookup': 'person',
            'from': {
                'data': { 'url': 'data/lookup_people.csv' },
                'key': 'name'
            },
            'as': 'foo'
        }, 'lookup_0');
        chai_1.assert.deepEqual(lookup.assemble(), {
            type: 'lookup',
            from: 'lookup_0',
            key: 'name',
            fields: ['person'],
            as: ['foo']
        });
    });
    it('should warn if fields are not specified and as is missing', log.wrap(function (localLogger) {
        var lookup = new lookup_1.LookupNode(null, {
            'lookup': 'person',
            'from': {
                'data': { 'url': 'data/lookup_people.csv' },
                'key': 'name'
            }
        }, 'lookup_0');
        lookup.assemble();
        chai_1.assert.equal(localLogger.warns[0], log.message.NO_FIELDS_NEEDS_AS);
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9va3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9sb29rdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QiwyREFBNEQ7QUFDNUQseURBQW9FO0FBQ3BFLHNDQUF3QztBQUV4QyxtQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLHFCQUFxQixFQUFFO0lBQzlCLEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtRQUNuQyxJQUFNLEtBQUssR0FBRyxxQkFBYyxDQUFDO1lBQzNCLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBQztZQUN6QyxXQUFXLEVBQUUsQ0FBQztvQkFDWixRQUFRLEVBQUUsUUFBUTtvQkFDbEIsTUFBTSxFQUFFO3dCQUNOLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBQzt3QkFDekMsS0FBSyxFQUFFLE1BQU07d0JBQ2IsUUFBUSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztxQkFDNUI7aUJBQ0YsQ0FBQztZQUNGLE1BQU0sRUFBRSxLQUFLO1lBQ2IsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDLENBQUM7UUFFSCxJQUFNLENBQUMsR0FBRywyQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0MsYUFBTSxDQUFDLFNBQVMsQ0FBcUIsQ0FBZ0IsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNoRSxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxVQUFVO1lBQ2hCLEdBQUcsRUFBRSxNQUFNO1lBQ1gsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ2xCLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7UUFDdkMsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLElBQUksRUFBRTtZQUNoQyxRQUFRLEVBQUUsUUFBUTtZQUNsQixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFDO2dCQUN6QyxLQUFLLEVBQUUsTUFBTTtnQkFDYixRQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO2FBQzVCO1NBQ0YsRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqQixhQUFNLENBQUMsU0FBUyxDQUFvQixNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDckQsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsVUFBVTtZQUNoQixHQUFHLEVBQUUsTUFBTTtZQUNYLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNsQixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDO1NBQzFCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLHNDQUFzQyxFQUFFO1FBQ3pDLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDaEMsUUFBUSxFQUFFLFFBQVE7WUFDbEIsTUFBTSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBQztnQkFDekMsS0FBSyxFQUFFLE1BQU07YUFDZDtZQUNELElBQUksRUFBRSxLQUFLO1NBQ1osRUFBRSxVQUFVLENBQUMsQ0FBQztRQUVqQixhQUFNLENBQUMsU0FBUyxDQUFvQixNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDckQsSUFBSSxFQUFFLFFBQVE7WUFDZCxJQUFJLEVBQUUsVUFBVTtZQUNoQixHQUFHLEVBQUUsTUFBTTtZQUNYLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNsQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUM7U0FDWixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQywyREFBMkQsRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQUMsV0FBVztRQUNuRixJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFVLENBQUMsSUFBSSxFQUFFO1lBQ2hDLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUM7Z0JBQ3pDLEtBQUssRUFBRSxNQUFNO2FBQ2Q7U0FDRixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ2pCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVsQixhQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ3JFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9sb29rdXAnO1xuaW1wb3J0IHtwYXJzZVRyYW5zZm9ybUFycmF5fSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7VmdMb29rdXBUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9sb29rdXAnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCBwYXJzZSBsb29rdXAgZnJvbSBhcnJheScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9sb29rdXBfZ3JvdXBzLmNzdid9LFxuICAgICAgJ3RyYW5zZm9ybSc6IFt7XG4gICAgICAgICdsb29rdXAnOiAncGVyc29uJyxcbiAgICAgICAgJ2Zyb20nOiB7XG4gICAgICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2xvb2t1cF9wZW9wbGUuY3N2J30sXG4gICAgICAgICAgJ2tleSc6ICduYW1lJyxcbiAgICAgICAgICAnZmllbGRzJzogWydhZ2UnLCAnaGVpZ2h0J11cbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICAnbWFyayc6ICdiYXInLFxuICAgICAgJ2VuY29kaW5nJzoge31cbiAgICB9KTtcblxuICAgIGNvbnN0IHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KG51bGwsIG1vZGVsKTtcbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTG9va3VwVHJhbnNmb3JtPigodCBhcyBMb29rdXBOb2RlKS5hc3NlbWJsZSgpLCB7XG4gICAgICB0eXBlOiAnbG9va3VwJyxcbiAgICAgIGZyb206ICdsb29rdXBfMCcsXG4gICAgICBrZXk6ICduYW1lJyxcbiAgICAgIGZpZWxkczogWydwZXJzb24nXSxcbiAgICAgIHZhbHVlczogWydhZ2UnLCAnaGVpZ2h0J11cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgbm9kZSBmb3IgZmxhdCBsb29rdXAnLCBmdW5jdGlvbiAoKSB7XG4gICAgY29uc3QgbG9va3VwID0gbmV3IExvb2t1cE5vZGUobnVsbCwge1xuICAgICAgICAnbG9va3VwJzogJ3BlcnNvbicsXG4gICAgICAgICdmcm9tJzoge1xuICAgICAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9sb29rdXBfcGVvcGxlLmNzdid9LFxuICAgICAgICAgICdrZXknOiAnbmFtZScsXG4gICAgICAgICAgJ2ZpZWxkcyc6IFsnYWdlJywgJ2hlaWdodCddXG4gICAgICAgIH1cbiAgICAgIH0sICdsb29rdXBfMCcpO1xuXG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0xvb2t1cFRyYW5zZm9ybT4obG9va3VwLmFzc2VtYmxlKCksIHtcbiAgICAgIHR5cGU6ICdsb29rdXAnLFxuICAgICAgZnJvbTogJ2xvb2t1cF8wJyxcbiAgICAgIGtleTogJ25hbWUnLFxuICAgICAgZmllbGRzOiBbJ3BlcnNvbiddLFxuICAgICAgdmFsdWVzOiBbJ2FnZScsICdoZWlnaHQnXVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIGNyZWF0ZSBub2RlIGZvciBuZXN0ZWQgbG9va3VwJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxvb2t1cCA9IG5ldyBMb29rdXBOb2RlKG51bGwsIHtcbiAgICAgICAgJ2xvb2t1cCc6ICdwZXJzb24nLFxuICAgICAgICAnZnJvbSc6IHtcbiAgICAgICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvbG9va3VwX3Blb3BsZS5jc3YnfSxcbiAgICAgICAgICAna2V5JzogJ25hbWUnXG4gICAgICAgIH0sXG4gICAgICAgICdhcyc6ICdmb28nXG4gICAgICB9LCAnbG9va3VwXzAnKTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdMb29rdXBUcmFuc2Zvcm0+KGxvb2t1cC5hc3NlbWJsZSgpLCB7XG4gICAgICB0eXBlOiAnbG9va3VwJyxcbiAgICAgIGZyb206ICdsb29rdXBfMCcsXG4gICAgICBrZXk6ICduYW1lJyxcbiAgICAgIGZpZWxkczogWydwZXJzb24nXSxcbiAgICAgIGFzOiBbJ2ZvbyddXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgd2FybiBpZiBmaWVsZHMgYXJlIG5vdCBzcGVjaWZpZWQgYW5kIGFzIGlzIG1pc3NpbmcnLCBsb2cud3JhcCgobG9jYWxMb2dnZXIpID0+IHtcbiAgICBjb25zdCBsb29rdXAgPSBuZXcgTG9va3VwTm9kZShudWxsLCB7XG4gICAgICAgICdsb29rdXAnOiAncGVyc29uJyxcbiAgICAgICAgJ2Zyb20nOiB7XG4gICAgICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2xvb2t1cF9wZW9wbGUuY3N2J30sXG4gICAgICAgICAgJ2tleSc6ICduYW1lJ1xuICAgICAgICB9XG4gICAgICB9LCAnbG9va3VwXzAnKTtcbiAgICBsb29rdXAuYXNzZW1ibGUoKTtcblxuICAgIGFzc2VydC5lcXVhbChsb2NhbExvZ2dlci53YXJuc1swXSwgbG9nLm1lc3NhZ2UuTk9fRklFTERTX05FRURTX0FTKTtcbiAgfSkpO1xufSk7XG4iXX0=