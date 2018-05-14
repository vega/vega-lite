/* tslint:disable quotemark */
import { assert } from 'chai';
import { geoshape } from '../../../src/compile/mark/geoshape';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('Mark: Geoshape', function () {
    describe('encode', function () {
        it('should create no properties', function () {
            var model = parseUnitModelWithScaleAndLayoutSize({
                "mark": "geoshape",
                "projection": {
                    "type": "albersUsa"
                },
                "data": {
                    "url": "data/us-10m.json",
                    "format": {
                        "type": "topojson",
                        "feature": "states"
                    }
                },
                "encoding": {
                    "color": {
                        "value": "black"
                    },
                    "opacity": {
                        "value": 0.8
                    }
                }
            });
            var props = geoshape.encodeEntry(model);
            assert.deepEqual({
                "fill": {
                    "value": "black"
                },
                "opacity": {
                    "value": 0.8
                }
            }, props);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vvc2hhcGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9tYXJrL2dlb3NoYXBlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsOEJBQThCO0FBRTlCLE9BQU8sRUFBQyxNQUFNLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUIsT0FBTyxFQUFDLFFBQVEsRUFBQyxNQUFNLG9DQUFvQyxDQUFDO0FBQzVELE9BQU8sRUFBQyxvQ0FBb0MsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUVoRSxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7SUFDekIsUUFBUSxDQUFDLFFBQVEsRUFBRTtRQUNqQixFQUFFLENBQUMsNkJBQTZCLEVBQUU7WUFDaEMsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7Z0JBQ2pELE1BQU0sRUFBRSxVQUFVO2dCQUNsQixZQUFZLEVBQUU7b0JBQ1osTUFBTSxFQUFFLFdBQVc7aUJBQ3BCO2dCQUNELE1BQU0sRUFBRTtvQkFDTixLQUFLLEVBQUUsa0JBQWtCO29CQUN6QixRQUFRLEVBQUU7d0JBQ1IsTUFBTSxFQUFFLFVBQVU7d0JBQ2xCLFNBQVMsRUFBRSxRQUFRO3FCQUNwQjtpQkFDRjtnQkFDRCxVQUFVLEVBQUU7b0JBQ1YsT0FBTyxFQUFFO3dCQUNQLE9BQU8sRUFBRSxPQUFPO3FCQUNqQjtvQkFDRCxTQUFTLEVBQUU7d0JBQ1QsT0FBTyxFQUFFLEdBQUc7cUJBQ2I7aUJBQ0Y7YUFDRixDQUFDLENBQUM7WUFDSCxJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzFDLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQ2YsTUFBTSxFQUFFO29CQUNOLE9BQU8sRUFBRSxPQUFPO2lCQUNqQjtnQkFDRCxTQUFTLEVBQUU7b0JBQ1QsT0FBTyxFQUFFLEdBQUc7aUJBQ2I7YUFDRixFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ1osQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyogdHNsaW50OmRpc2FibGUgcXVvdGVtYXJrICovXG5cbmltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7Z2Vvc2hhcGV9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvZ2Vvc2hhcGUnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnTWFyazogR2Vvc2hhcGUnLCBmdW5jdGlvbigpIHtcbiAgZGVzY3JpYmUoJ2VuY29kZScsIGZ1bmN0aW9uICgpIHtcbiAgICBpdCgnc2hvdWxkIGNyZWF0ZSBubyBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBcIm1hcmtcIjogXCJnZW9zaGFwZVwiLFxuICAgICAgICBcInByb2plY3Rpb25cIjoge1xuICAgICAgICAgIFwidHlwZVwiOiBcImFsYmVyc1VzYVwiXG4gICAgICAgIH0sXG4gICAgICAgIFwiZGF0YVwiOiB7XG4gICAgICAgICAgXCJ1cmxcIjogXCJkYXRhL3VzLTEwbS5qc29uXCIsXG4gICAgICAgICAgXCJmb3JtYXRcIjoge1xuICAgICAgICAgICAgXCJ0eXBlXCI6IFwidG9wb2pzb25cIixcbiAgICAgICAgICAgIFwiZmVhdHVyZVwiOiBcInN0YXRlc1wiXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcImVuY29kaW5nXCI6IHtcbiAgICAgICAgICBcImNvbG9yXCI6IHtcbiAgICAgICAgICAgIFwidmFsdWVcIjogXCJibGFja1wiXG4gICAgICAgICAgfSxcbiAgICAgICAgICBcIm9wYWNpdHlcIjoge1xuICAgICAgICAgICAgXCJ2YWx1ZVwiOiAwLjhcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgcHJvcHMgPSBnZW9zaGFwZS5lbmNvZGVFbnRyeShtb2RlbCk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHtcbiAgICAgICAgXCJmaWxsXCI6IHtcbiAgICAgICAgICBcInZhbHVlXCI6IFwiYmxhY2tcIlxuICAgICAgICB9LFxuICAgICAgICBcIm9wYWNpdHlcIjoge1xuICAgICAgICAgIFwidmFsdWVcIjogMC44XG4gICAgICAgIH1cbiAgICAgIH0sIHByb3BzKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==