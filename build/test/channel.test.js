"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var channel_2 = require("../src/channel");
var util_1 = require("../src/util");
describe('channel', function () {
    describe('UNIT_CHANNELS', function () {
        it('should be CHANNELS without row and column', function () {
            chai_1.assert.deepEqual(channel_2.UNIT_CHANNELS, util_1.without(channel_2.CHANNELS, ['row', 'column']));
        });
    });
    describe('SINGLE_DEF_CHANNELS', function () {
        it('should be CHANNELS without detail and order', function () {
            chai_1.assert.deepEqual(channel_1.SINGLE_DEF_CHANNELS, util_1.without(channel_2.CHANNELS, ['detail', 'order']));
        });
    });
    describe('SCALE_CHANNELS', function () {
        it('should be UNIT_CHANNELS without X2, Y2, ORDER, DETAIL, TEXT, LABEL, TOOLTIP', function () {
            chai_1.assert.deepEqual(channel_2.SCALE_CHANNELS, util_1.without(channel_2.UNIT_CHANNELS, ['x2', 'y2', 'order', 'detail', 'text', 'label', 'tooltip']));
        });
    });
    describe('NONPOSITION_SCALE_CHANNELS', function () {
        it('should be SCALE_CHANNELS without x, y, x2, y2', function () {
            chai_1.assert.deepEqual(channel_2.NONPOSITION_SCALE_CHANNELS, util_1.without(channel_2.SCALE_CHANNELS, ['x', 'y']));
        });
    });
    describe('isScaleChannel', function () {
        it('should return true for all scale channel', function () {
            for (var _i = 0, SCALE_CHANNELS_1 = channel_2.SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                chai_1.assert(channel_1.isScaleChannel(channel));
            }
        });
    });
    describe('rangeType', function () {
        it('should be defined for all channels (no error).', function () {
            var _loop_1 = function (c) {
                chai_1.assert.doesNotThrow(function () {
                    channel_1.rangeType(c);
                });
            };
            for (var _i = 0, CHANNELS_1 = channel_2.CHANNELS; _i < CHANNELS_1.length; _i++) {
                var c = CHANNELS_1[_i];
                _loop_1(c);
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbm5lbC50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vdGVzdC9jaGFubmVsLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2QkFBNEI7QUFDNUIsMENBQXVGO0FBQ3ZGLDBDQUFtRztBQUNuRyxvQ0FBb0M7QUFFcEMsUUFBUSxDQUFDLFNBQVMsRUFBRTtJQUNsQixRQUFRLENBQUMsZUFBZSxFQUFFO1FBQ3hCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtZQUM5QyxhQUFNLENBQUMsU0FBUyxDQUFDLHVCQUFhLEVBQUUsY0FBTyxDQUFDLGtCQUFRLEVBQUUsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMscUJBQXFCLEVBQUU7UUFDOUIsRUFBRSxDQUFDLDZDQUE2QyxFQUFFO1lBQ2hELGFBQU0sQ0FBQyxTQUFTLENBQUMsNkJBQW1CLEVBQUUsY0FBTyxDQUFDLGtCQUFRLEVBQUUsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsZ0JBQWdCLEVBQUU7UUFDekIsRUFBRSxDQUFDLDZFQUE2RSxFQUFFO1lBQ2hGLGFBQU0sQ0FBQyxTQUFTLENBQUMsd0JBQWMsRUFBRSxjQUFPLENBQUMsdUJBQWEsRUFBRSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN4SCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLDRCQUE0QixFQUFFO1FBQ3JDLEVBQUUsQ0FBQywrQ0FBK0MsRUFBRTtZQUNsRCxhQUFNLENBQUMsU0FBUyxDQUFDLG9DQUEwQixFQUFFLGNBQU8sQ0FBQyx3QkFBYyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBQ3pCLEVBQUUsQ0FBQywwQ0FBMEMsRUFBRTtZQUM3QyxHQUFHLENBQUMsQ0FBa0IsVUFBYyxFQUFkLG1CQUFBLHdCQUFjLEVBQWQsNEJBQWMsRUFBZCxJQUFjO2dCQUEvQixJQUFNLE9BQU8sdUJBQUE7Z0JBQ2hCLGFBQU0sQ0FBQyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDakM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFdBQVcsRUFBRTtRQUNwQixFQUFFLENBQUMsZ0RBQWdELEVBQUU7b0NBQ3hDLENBQUM7Z0JBQ1YsYUFBTSxDQUFDLFlBQVksQ0FBQztvQkFDbEIsbUJBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDZixDQUFDLENBQUMsQ0FBQztZQUNMLENBQUM7WUFKRCxHQUFHLENBQUMsQ0FBWSxVQUFRLEVBQVIsYUFBQSxrQkFBUSxFQUFSLHNCQUFRLEVBQVIsSUFBUTtnQkFBbkIsSUFBTSxDQUFDLGlCQUFBO3dCQUFELENBQUM7YUFJWDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyJ9