"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var data_1 = require("../../../src/compile/data");
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
        var t = parse_1.parseTransformArray(null, model, new data_1.AncestorParse);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9va3VwLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi90ZXN0L2NvbXBpbGUvZGF0YS9sb29rdXAudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixrREFBd0Q7QUFDeEQsMkRBQTREO0FBQzVELHlEQUFvRTtBQUNwRSxzQ0FBd0M7QUFFeEMsbUNBQTBDO0FBRTFDLFFBQVEsQ0FBQyxxQkFBcUIsRUFBRTtJQUM5QixFQUFFLENBQUMsZ0NBQWdDLEVBQUU7UUFDbkMsSUFBTSxLQUFLLEdBQUcscUJBQWMsQ0FBQztZQUMzQixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUM7WUFDekMsV0FBVyxFQUFFLENBQUM7b0JBQ1osUUFBUSxFQUFFLFFBQVE7b0JBQ2xCLE1BQU0sRUFBRTt3QkFDTixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUM7d0JBQ3pDLEtBQUssRUFBRSxNQUFNO3dCQUNiLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7cUJBQzVCO2lCQUNGLENBQUM7WUFDRixNQUFNLEVBQUUsS0FBSztZQUNiLFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQyxDQUFDO1FBRUgsSUFBTSxDQUFDLEdBQUcsMkJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLG9CQUFhLENBQUMsQ0FBQztRQUM5RCxhQUFNLENBQUMsU0FBUyxDQUFxQixDQUFnQixDQUFDLFFBQVEsRUFBRSxFQUFFO1lBQ2hFLElBQUksRUFBRSxRQUFRO1lBQ2QsSUFBSSxFQUFFLFVBQVU7WUFDaEIsR0FBRyxFQUFFLE1BQU07WUFDWCxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUM7WUFDbEIsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQztTQUMxQixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxvQ0FBb0MsRUFBRTtRQUN2QyxJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFVLENBQUMsSUFBSSxFQUFFO1lBQ2hDLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLE1BQU0sRUFBRTtnQkFDTixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsd0JBQXdCLEVBQUM7Z0JBQ3pDLEtBQUssRUFBRSxNQUFNO2dCQUNiLFFBQVEsRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7YUFDNUI7U0FDRixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpCLGFBQU0sQ0FBQyxTQUFTLENBQW9CLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNyRCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxVQUFVO1lBQ2hCLEdBQUcsRUFBRSxNQUFNO1lBQ1gsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ2xCLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDekMsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLElBQUksRUFBRTtZQUNoQyxRQUFRLEVBQUUsUUFBUTtZQUNsQixNQUFNLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLHdCQUF3QixFQUFDO2dCQUN6QyxLQUFLLEVBQUUsTUFBTTthQUNkO1lBQ0QsSUFBSSxFQUFFLEtBQUs7U0FDWixFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBRWpCLGFBQU0sQ0FBQyxTQUFTLENBQW9CLE1BQU0sQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUNyRCxJQUFJLEVBQUUsUUFBUTtZQUNkLElBQUksRUFBRSxVQUFVO1lBQ2hCLEdBQUcsRUFBRSxNQUFNO1lBQ1gsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDO1lBQ2xCLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQztTQUNaLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsRUFBRSxDQUFDLDJEQUEyRCxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBQyxXQUFXO1FBQ25GLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxJQUFJLEVBQUU7WUFDaEMsUUFBUSxFQUFFLFFBQVE7WUFDbEIsTUFBTSxFQUFFO2dCQUNOLE1BQU0sRUFBRSxFQUFDLEtBQUssRUFBRSx3QkFBd0IsRUFBQztnQkFDekMsS0FBSyxFQUFFLE1BQU07YUFDZDtTQUNGLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDakIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBRWxCLGFBQU0sQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDckUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNOLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtBbmNlc3RvclBhcnNlfSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhJztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9sb29rdXAnO1xuaW1wb3J0IHtwYXJzZVRyYW5zZm9ybUFycmF5fSBmcm9tICcuLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi8uLi9zcmMvbG9nJztcbmltcG9ydCB7VmdMb29rdXBUcmFuc2Zvcm19IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsfSBmcm9tICcuLi8uLi91dGlsJztcblxuZGVzY3JpYmUoJ2NvbXBpbGUvZGF0YS9sb29rdXAnLCBmdW5jdGlvbigpIHtcbiAgaXQoJ3Nob3VsZCBwYXJzZSBsb29rdXAgZnJvbSBhcnJheScsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsKHtcbiAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9sb29rdXBfZ3JvdXBzLmNzdid9LFxuICAgICAgJ3RyYW5zZm9ybSc6IFt7XG4gICAgICAgICdsb29rdXAnOiAncGVyc29uJyxcbiAgICAgICAgJ2Zyb20nOiB7XG4gICAgICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2xvb2t1cF9wZW9wbGUuY3N2J30sXG4gICAgICAgICAgJ2tleSc6ICduYW1lJyxcbiAgICAgICAgICAnZmllbGRzJzogWydhZ2UnLCAnaGVpZ2h0J11cbiAgICAgICAgfVxuICAgICAgfV0sXG4gICAgICAnbWFyayc6ICdiYXInLFxuICAgICAgJ2VuY29kaW5nJzoge31cbiAgICB9KTtcblxuICAgIGNvbnN0IHQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KG51bGwsIG1vZGVsLCBuZXcgQW5jZXN0b3JQYXJzZSk7XG4gICAgYXNzZXJ0LmRlZXBFcXVhbDxWZ0xvb2t1cFRyYW5zZm9ybT4oKHQgYXMgTG9va3VwTm9kZSkuYXNzZW1ibGUoKSwge1xuICAgICAgdHlwZTogJ2xvb2t1cCcsXG4gICAgICBmcm9tOiAnbG9va3VwXzAnLFxuICAgICAga2V5OiAnbmFtZScsXG4gICAgICBmaWVsZHM6IFsncGVyc29uJ10sXG4gICAgICB2YWx1ZXM6IFsnYWdlJywgJ2hlaWdodCddXG4gICAgfSk7XG4gIH0pO1xuXG4gIGl0KCdzaG91bGQgY3JlYXRlIG5vZGUgZm9yIGZsYXQgbG9va3VwJywgZnVuY3Rpb24gKCkge1xuICAgIGNvbnN0IGxvb2t1cCA9IG5ldyBMb29rdXBOb2RlKG51bGwsIHtcbiAgICAgICAgJ2xvb2t1cCc6ICdwZXJzb24nLFxuICAgICAgICAnZnJvbSc6IHtcbiAgICAgICAgICAnZGF0YSc6IHsndXJsJzogJ2RhdGEvbG9va3VwX3Blb3BsZS5jc3YnfSxcbiAgICAgICAgICAna2V5JzogJ25hbWUnLFxuICAgICAgICAgICdmaWVsZHMnOiBbJ2FnZScsICdoZWlnaHQnXVxuICAgICAgICB9XG4gICAgICB9LCAnbG9va3VwXzAnKTtcblxuICAgIGFzc2VydC5kZWVwRXF1YWw8VmdMb29rdXBUcmFuc2Zvcm0+KGxvb2t1cC5hc3NlbWJsZSgpLCB7XG4gICAgICB0eXBlOiAnbG9va3VwJyxcbiAgICAgIGZyb206ICdsb29rdXBfMCcsXG4gICAgICBrZXk6ICduYW1lJyxcbiAgICAgIGZpZWxkczogWydwZXJzb24nXSxcbiAgICAgIHZhbHVlczogWydhZ2UnLCAnaGVpZ2h0J11cbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3Nob3VsZCBjcmVhdGUgbm9kZSBmb3IgbmVzdGVkIGxvb2t1cCcsIGZ1bmN0aW9uICgpIHtcbiAgICBjb25zdCBsb29rdXAgPSBuZXcgTG9va3VwTm9kZShudWxsLCB7XG4gICAgICAgICdsb29rdXAnOiAncGVyc29uJyxcbiAgICAgICAgJ2Zyb20nOiB7XG4gICAgICAgICAgJ2RhdGEnOiB7J3VybCc6ICdkYXRhL2xvb2t1cF9wZW9wbGUuY3N2J30sXG4gICAgICAgICAgJ2tleSc6ICduYW1lJ1xuICAgICAgICB9LFxuICAgICAgICAnYXMnOiAnZm9vJ1xuICAgICAgfSwgJ2xvb2t1cF8wJyk7XG5cbiAgICBhc3NlcnQuZGVlcEVxdWFsPFZnTG9va3VwVHJhbnNmb3JtPihsb29rdXAuYXNzZW1ibGUoKSwge1xuICAgICAgdHlwZTogJ2xvb2t1cCcsXG4gICAgICBmcm9tOiAnbG9va3VwXzAnLFxuICAgICAga2V5OiAnbmFtZScsXG4gICAgICBmaWVsZHM6IFsncGVyc29uJ10sXG4gICAgICBhczogWydmb28nXVxuICAgIH0pO1xuICB9KTtcblxuICBpdCgnc2hvdWxkIHdhcm4gaWYgZmllbGRzIGFyZSBub3Qgc3BlY2lmaWVkIGFuZCBhcyBpcyBtaXNzaW5nJywgbG9nLndyYXAoKGxvY2FsTG9nZ2VyKSA9PiB7XG4gICAgY29uc3QgbG9va3VwID0gbmV3IExvb2t1cE5vZGUobnVsbCwge1xuICAgICAgICAnbG9va3VwJzogJ3BlcnNvbicsXG4gICAgICAgICdmcm9tJzoge1xuICAgICAgICAgICdkYXRhJzogeyd1cmwnOiAnZGF0YS9sb29rdXBfcGVvcGxlLmNzdid9LFxuICAgICAgICAgICdrZXknOiAnbmFtZSdcbiAgICAgICAgfVxuICAgICAgfSwgJ2xvb2t1cF8wJyk7XG4gICAgbG9va3VwLmFzc2VtYmxlKCk7XG5cbiAgICBhc3NlcnQuZXF1YWwobG9jYWxMb2dnZXIud2FybnNbMF0sIGxvZy5tZXNzYWdlLk5PX0ZJRUxEU19ORUVEU19BUyk7XG4gIH0pKTtcbn0pO1xuIl19