import { assert } from 'chai';
import { assembleProjectionForModel } from '../../../src/compile/projection/assemble';
import { isVgSignalRef } from '../../../src/vega.schema';
import { parseUnitModelWithScaleAndLayoutSize } from '../../util';
describe('compile/projection/assemble', function () {
    describe('assembleProjectionForModel', function () {
        var model = parseUnitModelWithScaleAndLayoutSize({
            'mark': 'geoshape',
            'projection': {
                'type': 'albersUsa'
            },
            'data': {
                'url': 'data/us-10m.json',
                'format': {
                    'type': 'topojson',
                    'feature': 'states'
                }
            },
            'encoding': {}
        });
        model.parse();
        it('should not be empty', function () {
            assert.isNotEmpty(assembleProjectionForModel(model));
        });
        it('should have properties of right type', function () {
            var projection = assembleProjectionForModel(model)[0];
            assert.isDefined(projection.name);
            assert.isString(projection.name);
            assert.isDefined(projection.size);
            assert.isTrue(isVgSignalRef(projection.size));
            assert.isDefined(projection.fit);
            assert.isTrue(isVgSignalRef(projection.fit));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9wcm9qZWN0aW9uL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFDLE1BQU0sRUFBQyxNQUFNLE1BQU0sQ0FBQztBQUM1QixPQUFPLEVBQUMsMEJBQTBCLEVBQUMsTUFBTSwwQ0FBMEMsQ0FBQztBQUNwRixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sMEJBQTBCLENBQUM7QUFDdkQsT0FBTyxFQUFDLG9DQUFvQyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRWhFLFFBQVEsQ0FBQyw2QkFBNkIsRUFBRTtJQUN0QyxRQUFRLENBQUMsNEJBQTRCLEVBQUU7UUFDckMsSUFBTSxLQUFLLEdBQUcsb0NBQW9DLENBQUM7WUFDakQsTUFBTSxFQUFFLFVBQVU7WUFDbEIsWUFBWSxFQUFFO2dCQUNaLE1BQU0sRUFBRSxXQUFXO2FBQ3BCO1lBQ0QsTUFBTSxFQUFFO2dCQUNOLEtBQUssRUFBRSxrQkFBa0I7Z0JBQ3pCLFFBQVEsRUFBRTtvQkFDUixNQUFNLEVBQUUsVUFBVTtvQkFDbEIsU0FBUyxFQUFFLFFBQVE7aUJBQ3BCO2FBQ0Y7WUFDRCxVQUFVLEVBQUUsRUFBRTtTQUNmLENBQUMsQ0FBQztRQUNILEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUVkLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRTtZQUN4QixNQUFNLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsc0NBQXNDLEVBQUU7WUFDekMsSUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEQsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHthc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbH0gZnJvbSAnLi4vLi4vLi4vc3JjL2NvbXBpbGUvcHJvamVjdGlvbi9hc3NlbWJsZSc7XG5pbXBvcnQge2lzVmdTaWduYWxSZWZ9IGZyb20gJy4uLy4uLy4uL3NyYy92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3BhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5cbmRlc2NyaWJlKCdjb21waWxlL3Byb2plY3Rpb24vYXNzZW1ibGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdhc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbCcsICgpID0+IHtcbiAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAnbWFyayc6ICdnZW9zaGFwZScsXG4gICAgICAncHJvamVjdGlvbic6IHtcbiAgICAgICAgJ3R5cGUnOiAnYWxiZXJzVXNhJ1xuICAgICAgfSxcbiAgICAgICdkYXRhJzoge1xuICAgICAgICAndXJsJzogJ2RhdGEvdXMtMTBtLmpzb24nLFxuICAgICAgICAnZm9ybWF0Jzoge1xuICAgICAgICAgICd0eXBlJzogJ3RvcG9qc29uJyxcbiAgICAgICAgICAnZmVhdHVyZSc6ICdzdGF0ZXMnXG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAnZW5jb2RpbmcnOiB7fVxuICAgIH0pO1xuICAgIG1vZGVsLnBhcnNlKCk7XG5cbiAgICBpdCgnc2hvdWxkIG5vdCBiZSBlbXB0eScsICgpID0+IHtcbiAgICAgIGFzc2VydC5pc05vdEVtcHR5KGFzc2VtYmxlUHJvamVjdGlvbkZvck1vZGVsKG1vZGVsKSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgcHJvcGVydGllcyBvZiByaWdodCB0eXBlJywgKCkgPT4ge1xuICAgICAgY29uc3QgcHJvamVjdGlvbiA9IGFzc2VtYmxlUHJvamVjdGlvbkZvck1vZGVsKG1vZGVsKVswXTtcbiAgICAgIGFzc2VydC5pc0RlZmluZWQocHJvamVjdGlvbi5uYW1lKTtcbiAgICAgIGFzc2VydC5pc1N0cmluZyhwcm9qZWN0aW9uLm5hbWUpO1xuICAgICAgYXNzZXJ0LmlzRGVmaW5lZChwcm9qZWN0aW9uLnNpemUpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1ZnU2lnbmFsUmVmKHByb2plY3Rpb24uc2l6ZSkpO1xuICAgICAgYXNzZXJ0LmlzRGVmaW5lZChwcm9qZWN0aW9uLmZpdCk7XG4gICAgICBhc3NlcnQuaXNUcnVlKGlzVmdTaWduYWxSZWYocHJvamVjdGlvbi5maXQpKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==