"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var scale = require("../src/scale");
var scale_1 = require("../src/scale");
var util_1 = require("../src/util");
describe('scale', function () {
    describe('scaleTypeSupportProperty', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all scale properties', function () {
            var _loop_1 = function (prop) {
                chai_1.assert(util_1.some(scale.SCALE_TYPES, function (scaleType) {
                    return scale.scaleTypeSupportProperty(scaleType, prop);
                }));
            };
            for (var _i = 0, _a = scale.SCALE_PROPERTIES; _i < _a.length; _i++) {
                var prop = _a[_i];
                _loop_1(prop);
            }
        });
        // TODO: write more test blindly (Don't look at our code, just look at D3 code.)
        chai_1.assert.isFalse(scale.scaleTypeSupportProperty('bin-linear', 'zero'));
    });
    describe('scaleTypes', function () {
        it('should either hasContinuousDomain or hasDiscreteDomain', function () {
            for (var _i = 0, _a = scale.SCALE_TYPES; _i < _a.length; _i++) {
                var scaleType = _a[_i];
                chai_1.assert(scale.hasContinuousDomain(scaleType) !== scale.hasDiscreteDomain(scaleType));
            }
        });
    });
    describe('channelSupportScaleType', function () {
        // Make sure we always edit this when we add new channel
        it('should have at least one supported scale types for all channels with scale', function () {
            var _loop_2 = function (channel) {
                chai_1.assert(util_1.some(scale_1.SCALE_TYPES, function (scaleType) {
                    return scale_1.channelSupportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_CHANNELS_1 = channel_1.SCALE_CHANNELS; _i < SCALE_CHANNELS_1.length; _i++) {
                var channel = SCALE_CHANNELS_1[_i];
                _loop_2(channel);
            }
        });
        // Make sure we always edit this when we add new scale type
        it('should have at least one supported channel for all scale types', function () {
            var _loop_3 = function (scaleType) {
                chai_1.assert(util_1.some(channel_1.SCALE_CHANNELS, function (channel) {
                    return scale_1.channelSupportScaleType(channel, scaleType);
                }));
            };
            for (var _i = 0, SCALE_TYPES_1 = scale_1.SCALE_TYPES; _i < SCALE_TYPES_1.length; _i++) {
                var scaleType = SCALE_TYPES_1[_i];
                _loop_3(scaleType);
            }
        });
        it('shape should support only ordinal', function () {
            chai_1.assert(scale_1.channelSupportScaleType('shape', 'ordinal'));
            var nonOrdinal = util_1.without(scale_1.SCALE_TYPES, ['ordinal']);
            for (var _i = 0, nonOrdinal_1 = nonOrdinal; _i < nonOrdinal_1.length; _i++) {
                var scaleType = nonOrdinal_1[_i];
                chai_1.assert(!scale_1.channelSupportScaleType('shape', scaleType));
            }
        });
        it('color should support all scale types except band', function () {
            for (var _i = 0, SCALE_TYPES_2 = scale_1.SCALE_TYPES; _i < SCALE_TYPES_2.length; _i++) {
                var scaleType = SCALE_TYPES_2[_i];
                chai_1.assert.equal(scale_1.channelSupportScaleType('color', scaleType), scaleType !== 'band');
            }
        });
        it('x, y, size, opacity should support all continuous scale type as well as band and point', function () {
            // x,y should use either band or point for ordinal input
            var scaleTypes = scale_1.CONTINUOUS_TO_CONTINUOUS_SCALES.concat([scale_1.ScaleType.BAND, scale_1.ScaleType.POINT]);
            for (var _i = 0, _a = ['x', 'y', 'size', 'opacity']; _i < _a.length; _i++) {
                var channel = _a[_i];
                chai_1.assert(!scale_1.channelSupportScaleType(channel, 'ordinal'));
                chai_1.assert(!scale_1.channelSupportScaleType(channel, 'sequential'));
                for (var _b = 0, scaleTypes_1 = scaleTypes; _b < scaleTypes_1.length; _b++) {
                    var scaleType = scaleTypes_1[_b];
                    chai_1.assert(scale_1.channelSupportScaleType(channel, scaleType), "Error: " + channel + ", " + scaleType);
                }
            }
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QiwwQ0FBNEQ7QUFDNUQsb0NBQXNDO0FBQ3RDLHNDQUE4RztBQUM5RyxvQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDbkMsd0RBQXdEO1FBQ3hELEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtvQ0FDakUsSUFBSTtnQkFDYixhQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsVUFBQyxTQUFTO29CQUN2QyxNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLENBQUM7WUFKRCxHQUFHLENBQUMsQ0FBZSxVQUFzQixFQUF0QixLQUFBLEtBQUssQ0FBQyxnQkFBZ0IsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7Z0JBQXBDLElBQU0sSUFBSSxTQUFBO3dCQUFKLElBQUk7YUFJZDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsZ0ZBQWdGO1FBRWhGLGFBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMsd0RBQXdELEVBQUU7WUFDM0QsR0FBRyxDQUFDLENBQW9CLFVBQWlCLEVBQWpCLEtBQUEsS0FBSyxDQUFDLFdBQVcsRUFBakIsY0FBaUIsRUFBakIsSUFBaUI7Z0JBQXBDLElBQU0sU0FBUyxTQUFBO2dCQUNsQixhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEtB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QUFTLENBQUMsRUFBRSxZQUFVLE9BQU8sVUFBSyxTQUFXLENBQUMsQ0FBQztpQkFDeEY7YUFDRjtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXNzZXJ0fSBmcm9tICdjaGFpJztcbmltcG9ydCB7U0NBTEVfQ0hBTk5FTFMsIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vc3JjL2NoYW5uZWwnO1xuaW1wb3J0ICogYXMgc2NhbGUgZnJvbSAnLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7Y2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUsIENPTlRJTlVPVVNfVE9fQ09OVElOVU9VU19TQ0FMRVMsIFNDQUxFX1RZUEVTLCBTY2FsZVR5cGV9IGZyb20gJy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge3NvbWUsIHdpdGhvdXR9IGZyb20gJy4uL3NyYy91dGlsJztcblxuZGVzY3JpYmUoJ3NjYWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5JywgKCkgPT4ge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhbHdheXMgZWRpdCB0aGlzIHdoZW4gd2UgYWRkIG5ldyBjaGFubmVsXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBzdXBwb3J0ZWQgc2NhbGUgdHlwZXMgZm9yIGFsbCBzY2FsZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBwcm9wIG9mIHNjYWxlLlNDQUxFX1BST1BFUlRJRVMpIHtcbiAgICAgICAgYXNzZXJ0KHNvbWUoc2NhbGUuU0NBTEVfVFlQRVMsIChzY2FsZVR5cGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUuc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5KHNjYWxlVHlwZSwgcHJvcCk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRPRE86IHdyaXRlIG1vcmUgdGVzdCBibGluZGx5IChEb24ndCBsb29rIGF0IG91ciBjb2RlLCBqdXN0IGxvb2sgYXQgRDMgY29kZS4pXG5cbiAgICBhc3NlcnQuaXNGYWxzZShzY2FsZS5zY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoJ2Jpbi1saW5lYXInLCAnemVybycpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NjYWxlVHlwZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBlaXRoZXIgaGFzQ29udGludW91c0RvbWFpbiBvciBoYXNEaXNjcmV0ZURvbWFpbicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIHNjYWxlLlNDQUxFX1RZUEVTKSB7XG4gICAgICAgIGFzc2VydChzY2FsZS5oYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgIT09IHNjYWxlLmhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCdjaGFubmVsU3VwcG9ydFNjYWxlVHlwZScsICgpID0+IHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgYWx3YXlzIGVkaXQgdGhpcyB3aGVuIHdlIGFkZCBuZXcgY2hhbm5lbFxuICAgIGl0KCdzaG91bGQgaGF2ZSBhdCBsZWFzdCBvbmUgc3VwcG9ydGVkIHNjYWxlIHR5cGVzIGZvciBhbGwgY2hhbm5lbHMgd2l0aCBzY2FsZScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBTQ0FMRV9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQoc29tZShTQ0FMRV9UWVBFUywgKHNjYWxlVHlwZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBNYWtlIHN1cmUgd2UgYWx3YXlzIGVkaXQgdGhpcyB3aGVuIHdlIGFkZCBuZXcgc2NhbGUgdHlwZVxuICAgIGl0KCdzaG91bGQgaGF2ZSBhdCBsZWFzdCBvbmUgc3VwcG9ydGVkIGNoYW5uZWwgZm9yIGFsbCBzY2FsZSB0eXBlcycsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIFNDQUxFX1RZUEVTKSB7XG4gICAgICAgIGFzc2VydChzb21lKFNDQUxFX0NIQU5ORUxTLCAoY2hhbm5lbCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hhcGUgc2hvdWxkIHN1cHBvcnQgb25seSBvcmRpbmFsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0KGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKCdzaGFwZScsICdvcmRpbmFsJykpO1xuICAgICAgY29uc3Qgbm9uT3JkaW5hbCA9IHdpdGhvdXQ8U2NhbGVUeXBlPihTQ0FMRV9UWVBFUywgWydvcmRpbmFsJ10pO1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2Ygbm9uT3JkaW5hbCkge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKCdzaGFwZScsIHNjYWxlVHlwZSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ2NvbG9yIHNob3VsZCBzdXBwb3J0IGFsbCBzY2FsZSB0eXBlcyBleGNlcHQgYmFuZCcsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIFNDQUxFX1RZUEVTKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChjaGFubmVsU3VwcG9ydFNjYWxlVHlwZSgnY29sb3InLCBzY2FsZVR5cGUpLCBzY2FsZVR5cGUgIT09ICdiYW5kJyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgneCwgeSwgc2l6ZSwgb3BhY2l0eSBzaG91bGQgc3VwcG9ydCBhbGwgY29udGludW91cyBzY2FsZSB0eXBlIGFzIHdlbGwgYXMgYmFuZCBhbmQgcG9pbnQnLCAoKSA9PiB7XG4gICAgICAvLyB4LHkgc2hvdWxkIHVzZSBlaXRoZXIgYmFuZCBvciBwb2ludCBmb3Igb3JkaW5hbCBpbnB1dFxuICAgICAgY29uc3Qgc2NhbGVUeXBlcyA9IFsuLi5DT05USU5VT1VTX1RPX0NPTlRJTlVPVVNfU0NBTEVTLCBTY2FsZVR5cGUuQkFORCwgU2NhbGVUeXBlLlBPSU5UXTtcblxuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5JywgJ3NpemUnLCAnb3BhY2l0eSddIGFzIFNjYWxlQ2hhbm5lbFtdKSB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoY2hhbm5lbCwgJ29yZGluYWwnKSk7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoY2hhbm5lbCwgJ3NlcXVlbnRpYWwnKSk7XG4gICAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIHNjYWxlVHlwZXMpIHtcbiAgICAgICAgICBhc3NlcnQoY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoY2hhbm5lbCwgc2NhbGVUeXBlKSwgYEVycm9yOiAke2NoYW5uZWx9LCAke3NjYWxlVHlwZX1gKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19