"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var util_1 = require("../../util");
describe('compile/layout', function () {
    describe('parseUnitLayoutSize', function () {
        it('should have width, height = provided top-level width, height', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                width: 123,
                height: 456,
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            chai_1.assert.deepEqual(model.component.layoutSize.explicit.width, 123);
            chai_1.assert.deepEqual(model.component.layoutSize.explicit.height, 456);
        });
        it('should have width = default textXRangeStep for text mark without x', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'text',
                encoding: {},
                config: { scale: { textXRangeStep: 91 } }
            });
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.width, 91);
        });
        it('should have width/height = config.scale.rangeStep  for non-text mark without x,y', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {},
                config: { scale: { rangeStep: 23 } }
            });
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.width, 23);
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.height, 23);
        });
        it('should have width/height = config.view.width/height for non-ordinal x,y', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'quantitative' },
                    y: { field: 'b', type: 'quantitative' }
                },
                config: { view: { width: 123, height: 456 } }
            });
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.width, 123);
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.height, 456);
        });
        it('should have width/height = config.view.width/height for non-ordinal x,y', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal', scale: { rangeStep: null } },
                    y: { field: 'b', type: 'ordinal', scale: { rangeStep: null } }
                },
                config: { view: { width: 123, height: 456 } }
            });
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.width, 123);
            chai_1.assert.deepEqual(model.component.layoutSize.implicit.height, 456);
        });
        it('should have width/height = undefined for non-ordinal x,y', function () {
            var model = util_1.parseUnitModelWithScaleAndLayoutSize({
                mark: 'point',
                encoding: {
                    x: { field: 'a', type: 'ordinal' },
                    y: { field: 'b', type: 'ordinal' }
                },
                config: { view: { width: 123, height: 456 } }
            });
            chai_1.assert.deepEqual(model.component.layoutSize.get('width'), 'range-step');
            chai_1.assert.deepEqual(model.component.layoutSize.get('height'), 'range-step');
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Rlc3QvY29tcGlsZS9sYXlvdXRzaXplL3BhcnNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsbUNBQWdFO0FBRWhFLFFBQVEsQ0FBQyxnQkFBZ0IsRUFBRTtJQUN4QixRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDL0IsRUFBRSxDQUFDLDhEQUE4RCxFQUFFO1lBQ2pFLElBQU0sS0FBSyxHQUFHLDJDQUFvQyxDQUFDO2dCQUNqRCxLQUFLLEVBQUUsR0FBRztnQkFDVixNQUFNLEVBQUUsR0FBRztnQkFDWCxJQUFJLEVBQUUsTUFBTTtnQkFDWixRQUFRLEVBQUUsRUFBRTtnQkFDWixNQUFNLEVBQUUsRUFBQyxLQUFLLEVBQUUsRUFBQyxjQUFjLEVBQUUsRUFBRSxFQUFDLEVBQUM7YUFDdEMsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQ2pFLGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNwRSxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxvRUFBb0UsRUFBRTtZQUN2RSxJQUFNLEtBQUssR0FBRywyQ0FBb0MsQ0FBQztnQkFDakQsSUFBSSxFQUFFLE1BQU07Z0JBQ1osUUFBUSxFQUFFLEVBQUU7Z0JBQ1osTUFBTSxFQUFFLEVBQUMsS0FBSyxFQUFFLEVBQUMsY0FBYyxFQUFFLEVBQUUsRUFBQyxFQUFDO2FBQ3RDLENBQUMsQ0FBQztZQUVILGFBQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssRUFB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QUMsSUFBSSxFQUFFLEVBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFDLEVBQUM7YUFDMUMsQ0FBQyxDQUFDO1lBRUgsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDeEUsYUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDM0UsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemV9IGZyb20gJy4uLy4uL3V0aWwnO1xuXG5kZXNjcmliZSgnY29tcGlsZS9sYXlvdXQnLCAoKSA9PiB7XG4gICBkZXNjcmliZSgncGFyc2VVbml0TGF5b3V0U2l6ZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGhhdmUgd2lkdGgsIGhlaWdodCA9IHByb3ZpZGVkIHRvcC1sZXZlbCB3aWR0aCwgaGVpZ2h0JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICB3aWR0aDogMTIzLFxuICAgICAgICBoZWlnaHQ6IDQ1NixcbiAgICAgICAgbWFyazogJ3RleHQnLFxuICAgICAgICBlbmNvZGluZzoge30sXG4gICAgICAgIGNvbmZpZzoge3NjYWxlOiB7dGV4dFhSYW5nZVN0ZXA6IDkxfX1cbiAgICAgIH0pO1xuXG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplLmV4cGxpY2l0LndpZHRoLCAxMjMpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZS5leHBsaWNpdC5oZWlnaHQsIDQ1Nik7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgd2lkdGggPSBkZWZhdWx0IHRleHRYUmFuZ2VTdGVwIGZvciB0ZXh0IG1hcmsgd2l0aG91dCB4JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBtYXJrOiAndGV4dCcsXG4gICAgICAgIGVuY29kaW5nOiB7fSxcbiAgICAgICAgY29uZmlnOiB7c2NhbGU6IHt0ZXh0WFJhbmdlU3RlcDogOTF9fVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuaW1wbGljaXQud2lkdGgsIDkxKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB3aWR0aC9oZWlnaHQgPSBjb25maWcuc2NhbGUucmFuZ2VTdGVwICBmb3Igbm9uLXRleHQgbWFyayB3aXRob3V0IHgseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHt9LFxuICAgICAgICBjb25maWc6IHtzY2FsZToge3JhbmdlU3RlcDogMjN9fVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuaW1wbGljaXQud2lkdGgsIDIzKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuaW1wbGljaXQuaGVpZ2h0LCAyMyk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2hvdWxkIGhhdmUgd2lkdGgvaGVpZ2h0ID0gY29uZmlnLnZpZXcud2lkdGgvaGVpZ2h0IGZvciBub24tb3JkaW5hbCB4LHknLCAoKSA9PiB7XG4gICAgICBjb25zdCBtb2RlbCA9IHBhcnNlVW5pdE1vZGVsV2l0aFNjYWxlQW5kTGF5b3V0U2l6ZSh7XG4gICAgICAgIG1hcms6ICdwb2ludCcsXG4gICAgICAgIGVuY29kaW5nOiB7XG4gICAgICAgICAgeDoge2ZpZWxkOiAnYScsIHR5cGU6ICdxdWFudGl0YXRpdmUnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ3F1YW50aXRhdGl2ZSd9XG4gICAgICAgIH0sXG4gICAgICAgIGNvbmZpZzoge3ZpZXc6IHt3aWR0aDogMTIzLCBoZWlnaHQ6IDQ1Nn19XG4gICAgICB9KTtcblxuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZS5pbXBsaWNpdC53aWR0aCwgMTIzKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuaW1wbGljaXQuaGVpZ2h0LCA0NTYpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCBoYXZlIHdpZHRoL2hlaWdodCA9IGNvbmZpZy52aWV3LndpZHRoL2hlaWdodCBmb3Igbm9uLW9yZGluYWwgeCx5JywgKCkgPT4ge1xuICAgICAgY29uc3QgbW9kZWwgPSBwYXJzZVVuaXRNb2RlbFdpdGhTY2FsZUFuZExheW91dFNpemUoe1xuICAgICAgICBtYXJrOiAncG9pbnQnLFxuICAgICAgICBlbmNvZGluZzoge1xuICAgICAgICAgIHg6IHtmaWVsZDogJ2EnLCB0eXBlOiAnb3JkaW5hbCcsIHNjYWxlOiB7cmFuZ2VTdGVwOiBudWxsfX0sXG4gICAgICAgICAgeToge2ZpZWxkOiAnYicsIHR5cGU6ICdvcmRpbmFsJywgc2NhbGU6IHtyYW5nZVN0ZXA6IG51bGx9fVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHt2aWV3OiB7d2lkdGg6IDEyMywgaGVpZ2h0OiA0NTZ9fVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuaW1wbGljaXQud2lkdGgsIDEyMyk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKG1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplLmltcGxpY2l0LmhlaWdodCwgNDU2KTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgaGF2ZSB3aWR0aC9oZWlnaHQgPSB1bmRlZmluZWQgZm9yIG5vbi1vcmRpbmFsIHgseScsICgpID0+IHtcbiAgICAgIGNvbnN0IG1vZGVsID0gcGFyc2VVbml0TW9kZWxXaXRoU2NhbGVBbmRMYXlvdXRTaXplKHtcbiAgICAgICAgbWFyazogJ3BvaW50JyxcbiAgICAgICAgZW5jb2Rpbmc6IHtcbiAgICAgICAgICB4OiB7ZmllbGQ6ICdhJywgdHlwZTogJ29yZGluYWwnfSxcbiAgICAgICAgICB5OiB7ZmllbGQ6ICdiJywgdHlwZTogJ29yZGluYWwnfVxuICAgICAgICB9LFxuICAgICAgICBjb25maWc6IHt2aWV3OiB7d2lkdGg6IDEyMywgaGVpZ2h0OiA0NTZ9fVxuICAgICAgfSk7XG5cbiAgICAgIGFzc2VydC5kZWVwRXF1YWwobW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuZ2V0KCd3aWR0aCcpLCAncmFuZ2Utc3RlcCcpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXQoJ2hlaWdodCcpLCAncmFuZ2Utc3RlcCcpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19