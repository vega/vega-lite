"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var assemble_1 = require("../../../src/compile/projection/assemble");
var vega_schema_1 = require("../../../src/vega.schema");
var util_1 = require("../../util");
describe('compile/projection/assemble', function () {
    describe('assembleProjectionForModel', function () {
        var model = util_1.parseUnitModelWithScaleAndLayoutSize({
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
            chai_1.assert.isNotEmpty(assemble_1.assembleProjectionForModel(model));
        });
        it('should have properties of right type', function () {
            var projection = assemble_1.assembleProjectionForModel(model)[0];
            chai_1.assert.isDefined(projection.name);
            chai_1.assert.isString(projection.name);
            chai_1.assert.isDefined(projection.size);
            chai_1.assert.isTrue(vega_schema_1.isVgSignalRef(projection.size));
            chai_1.assert.isDefined(projection.fit);
            chai_1.assert.isTrue(vega_schema_1.isVgSignalRef(projection.fit));
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9wcm9qZWN0aW9uL2Fzc2VtYmxlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIscUVBQW9GO0FBQ3BGLHdEQUF1RDtBQUN2RCxtQ0FBZ0U7QUFFaEUsUUFBUSxDQUFDLDZCQUE2QixFQUFFO0lBQ3RDLFFBQVEsQ0FBQyw0QkFBNEIsRUFBRTtRQUNyQyxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztZQUNqRCxNQUFNLEVBQUUsVUFBVTtZQUNsQixZQUFZLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLFdBQVc7YUFDcEI7WUFDRCxNQUFNLEVBQUU7Z0JBQ04sS0FBSyxFQUFFLGtCQUFrQjtnQkFDekIsUUFBUSxFQUFFO29CQUNSLE1BQU0sRUFBRSxVQUFVO29CQUNsQixTQUFTLEVBQUUsUUFBUTtpQkFDcEI7YUFDRjtZQUNELFVBQVUsRUFBRSxFQUFFO1NBQ2YsQ0FBQyxDQUFDO1FBQ0gsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRWQsRUFBRSxDQUFDLHFCQUFxQixFQUFFO1lBQ3hCLGFBQU0sQ0FBQyxVQUFVLENBQUMscUNBQTBCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRTtZQUN6QyxJQUFNLFVBQVUsR0FBRyxxQ0FBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4RCxhQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxhQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQyxhQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQyxhQUFNLENBQUMsTUFBTSxDQUFDLDJCQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7WUFDOUMsYUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDakMsYUFBTSxDQUFDLE1BQU0sQ0FBQywyQkFBYSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7YXNzZW1ibGVQcm9qZWN0aW9uRm9yTW9kZWx9IGZyb20gJy4uLy4uLy4uL3NyYy9jb21waWxlL3Byb2plY3Rpb24vYXNzZW1ibGUnO1xuaW1wb3J0IHtpc1ZnU2lnbmFsUmVmfSBmcm9tICcuLi8uLi8uLi9zcmMvdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9wcm9qZWN0aW9uL2Fzc2VtYmxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnYXNzZW1ibGVQcm9qZWN0aW9uRm9yTW9kZWwnLCAoKSA9PiB7XG4gICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgJ21hcmsnOiAnZ2Vvc2hhcGUnLFxuICAgICAgJ3Byb2plY3Rpb24nOiB7XG4gICAgICAgICd0eXBlJzogJ2FsYmVyc1VzYSdcbiAgICAgIH0sXG4gICAgICAnZGF0YSc6IHtcbiAgICAgICAgJ3VybCc6ICdkYXRhL3VzLTEwbS5qc29uJyxcbiAgICAgICAgJ2Zvcm1hdCc6IHtcbiAgICAgICAgICAndHlwZSc6ICd0b3BvanNvbicsXG4gICAgICAgICAgJ2ZlYXR1cmUnOiAnc3RhdGVzJ1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgJ2VuY29kaW5nJzoge31cbiAgICB9KTtcbiAgICBtb2RlbC5wYXJzZSgpO1xuXG4gICAgaXQoJ3Nob3VsZCBub3QgYmUgZW1wdHknLCAoKSA9PiB7XG4gICAgICBhc3NlcnQuaXNOb3RFbXB0eShhc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbChtb2RlbCkpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHByb3BlcnRpZXMgb2YgcmlnaHQgdHlwZScsICgpID0+IHtcbiAgICAgIGNvbnN0IHByb2plY3Rpb24gPSBhc3NlbWJsZVByb2plY3Rpb25Gb3JNb2RlbChtb2RlbClbMF07XG4gICAgICBhc3NlcnQuaXNEZWZpbmVkKHByb2plY3Rpb24ubmFtZSk7XG4gICAgICBhc3NlcnQuaXNTdHJpbmcocHJvamVjdGlvbi5uYW1lKTtcbiAgICAgIGFzc2VydC5pc0RlZmluZWQocHJvamVjdGlvbi5zaXplKTtcbiAgICAgIGFzc2VydC5pc1RydWUoaXNWZ1NpZ25hbFJlZihwcm9qZWN0aW9uLnNpemUpKTtcbiAgICAgIGFzc2VydC5pc0RlZmluZWQocHJvamVjdGlvbi5maXQpO1xuICAgICAgYXNzZXJ0LmlzVHJ1ZShpc1ZnU2lnbmFsUmVmKHByb2plY3Rpb24uZml0KSk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=