"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var scale = tslib_1.__importStar(require("../src/scale"));
var scale_1 = require("../src/scale");
var type_1 = require("../src/type");
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
    describe('getSupportedScaleType', function () {
        it('should return correct scale types for quantitative positional channels', function () {
            var type = type_1.Type.QUANTITATIVE;
            var positionalScaleTypes = [scale_1.ScaleType.LINEAR, scale_1.ScaleType.LOG, scale_1.ScaleType.POW, scale_1.ScaleType.SQRT];
            // x channel
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type);
            chai_1.assert.deepEqual(positionalScaleTypes, scaleTypes);
            // y channel
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type_1.Type.QUANTITATIVE);
            chai_1.assert.deepEqual(scaleTypes, positionalScaleTypes);
        });
        it('should return correct scale types for quantitative positional channels with bin', function () {
            var type = type_1.Type.QUANTITATIVE;
            var positionalScaleTypesBinned = [scale_1.ScaleType.LINEAR, scale_1.ScaleType.BIN_LINEAR];
            // x channel
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type, true);
            chai_1.assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
            // y channel
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type, true);
            chai_1.assert.deepEqual(scaleTypes, positionalScaleTypesBinned);
        });
        it('should return correct scale types for nominal positional channels', function () {
            var type = type_1.Type.NOMINAL;
            var nominalPositionalScaleTypes = [scale_1.ScaleType.POINT, scale_1.ScaleType.BAND];
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type);
            chai_1.assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type);
            chai_1.assert.deepEqual(scaleTypes, nominalPositionalScaleTypes);
        });
        it('should return correct scale types for temporal positional channels', function () {
            var type = type_1.Type.TEMPORAL;
            var temporalPositionalScaleTypes = [scale_1.ScaleType.TIME, scale_1.ScaleType.UTC];
            var scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.X, type);
            chai_1.assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
            scaleTypes = scale_1.getSupportedScaleType(channel_1.Channel.Y, type);
            chai_1.assert.deepEqual(scaleTypes, temporalPositionalScaleTypes);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNEI7QUFDNUIsMENBQXFFO0FBQ3JFLDBEQUFzQztBQUN0QyxzQ0FLc0I7QUFDdEIsb0NBQWlDO0FBQ2pDLG9DQUEwQztBQUUxQyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ2hCLFFBQVEsQ0FBQywwQkFBMEIsRUFBRTtRQUNuQyx3REFBd0Q7UUFDeEQsRUFBRSxDQUFDLHlFQUF5RSxFQUFFO29DQUNqRSxJQUFJO2dCQUNiLGFBQU0sQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxVQUFDLFNBQVM7b0JBQ3ZDLE9BQU8sS0FBSyxDQUFDLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDekQsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNOLENBQUM7WUFKRCxLQUFtQixVQUFzQixFQUF0QixLQUFBLEtBQUssQ0FBQyxnQkFBZ0IsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0I7Z0JBQXBDLElBQU0sSUFBSSxTQUFBO3dCQUFKLElBQUk7YUFJZDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsZ0ZBQWdGO1FBRWhGLGFBQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLFlBQVksRUFBRTtRQUNyQixFQUFFLENBQUMsd0RBQXdELEVBQUU7WUFDM0QsS0FBd0IsVUFBaUIsRUFBakIsS0FBQSxLQUFLLENBQUMsV0FBVyxFQUFqQixjQUFpQixFQUFqQixJQUFpQixFQUFFO2dCQUF0QyxJQUFNLFNBQVMsU0FBQTtnQkFDbEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLENB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QUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2Fzc2VydH0gZnJvbSAnY2hhaSc7XG5pbXBvcnQge0NoYW5uZWwsIFNDQUxFX0NIQU5ORUxTLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uL3NyYy9jaGFubmVsJztcbmltcG9ydCAqIGFzIHNjYWxlIGZyb20gJy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge1xuICBjaGFubmVsU3VwcG9ydFNjYWxlVHlwZSxcbiAgQ09OVElOVU9VU19UT19DT05USU5VT1VTX1NDQUxFUywgZ2V0U3VwcG9ydGVkU2NhbGVUeXBlLFxuICBTQ0FMRV9UWVBFUyxcbiAgU2NhbGVUeXBlXG59IGZyb20gJy4uL3NyYy9zY2FsZSc7XG5pbXBvcnQge1R5cGV9IGZyb20gJy4uL3NyYy90eXBlJztcbmltcG9ydCB7c29tZSwgd2l0aG91dH0gZnJvbSAnLi4vc3JjL3V0aWwnO1xuXG5kZXNjcmliZSgnc2NhbGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdzY2FsZVR5cGVTdXBwb3J0UHJvcGVydHknLCAoKSA9PiB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFsd2F5cyBlZGl0IHRoaXMgd2hlbiB3ZSBhZGQgbmV3IGNoYW5uZWxcbiAgICBpdCgnc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIHN1cHBvcnRlZCBzY2FsZSB0eXBlcyBmb3IgYWxsIHNjYWxlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHByb3Agb2Ygc2NhbGUuU0NBTEVfUFJPUEVSVElFUykge1xuICAgICAgICBhc3NlcnQoc29tZShzY2FsZS5TQ0FMRV9UWVBFUywgKHNjYWxlVHlwZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBzY2FsZS5zY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoc2NhbGVUeXBlLCBwcm9wKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogd3JpdGUgbW9yZSB0ZXN0IGJsaW5kbHkgKERvbid0IGxvb2sgYXQgb3VyIGNvZGUsIGp1c3QgbG9vayBhdCBEMyBjb2RlLilcblxuICAgIGFzc2VydC5pc0ZhbHNlKHNjYWxlLnNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eSgnYmluLWxpbmVhcicsICd6ZXJvJykpO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2NhbGVUeXBlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGVpdGhlciBoYXNDb250aW51b3VzRG9tYWluIG9yIGhhc0Rpc2NyZXRlRG9tYWluJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2Ygc2NhbGUuU0NBTEVfVFlQRVMpIHtcbiAgICAgICAgYXNzZXJ0KHNjYWxlLmhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAhPT0gc2NhbGUuaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2NoYW5uZWxTdXBwb3J0U2NhbGVUeXBlJywgKCkgPT4ge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhbHdheXMgZWRpdCB0aGlzIHdoZW4gd2UgYWRkIG5ldyBjaGFubmVsXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBzdXBwb3J0ZWQgc2NhbGUgdHlwZXMgZm9yIGFsbCBjaGFubmVscyB3aXRoIHNjYWxlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFNDQUxFX0NIQU5ORUxTKSB7XG4gICAgICAgIGFzc2VydChzb21lKFNDQUxFX1RZUEVTLCAoc2NhbGVUeXBlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhbHdheXMgZWRpdCB0aGlzIHdoZW4gd2UgYWRkIG5ldyBzY2FsZSB0eXBlXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBzdXBwb3J0ZWQgY2hhbm5lbCBmb3IgYWxsIHNjYWxlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2YgU0NBTEVfVFlQRVMpIHtcbiAgICAgICAgYXNzZXJ0KHNvbWUoU0NBTEVfQ0hBTk5FTFMsIChjaGFubmVsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaGFwZSBzaG91bGQgc3VwcG9ydCBvbmx5IG9yZGluYWwnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQoY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoJ3NoYXBlJywgJ29yZGluYWwnKSk7XG4gICAgICBjb25zdCBub25PcmRpbmFsID0gd2l0aG91dDxTY2FsZVR5cGU+KFNDQUxFX1RZUEVTLCBbJ29yZGluYWwnXSk7XG4gICAgICBmb3IgKGNvbnN0IHNjYWxlVHlwZSBvZiBub25PcmRpbmFsKSB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoJ3NoYXBlJywgc2NhbGVUeXBlKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnY29sb3Igc2hvdWxkIHN1cHBvcnQgYWxsIHNjYWxlIHR5cGVzIGV4Y2VwdCBiYW5kJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2YgU0NBTEVfVFlQRVMpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKCdjb2xvcicsIHNjYWxlVHlwZSksIHNjYWxlVHlwZSAhPT0gJ2JhbmQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4gICAgaXQoJ3gsIHksIHNpemUsIG9wYWNpdHkgc2hvdWxkIHN1cHBvcnQgYWxsIGNvbnRpbnVvdXMgc2NhbGUgdHlwZSBhcyB3ZWxsIGFzIGJhbmQgYW5kIHBvaW50JywgKCkgPT4ge1xuICAgICAgLy8geCx5IHNob3VsZCB1c2UgZWl0aGVyIGJhbmQgb3IgcG9pbnQgZm9yIG9yZGluYWwgaW5wdXRcbiAgICAgIGNvbnN0IHNjYWxlVHlwZXMgPSBbLi4uQ09OVElOVU9VU19UT19DT05USU5VT1VTX1NDQUxFUywgU2NhbGVUeXBlLkJBTkQsIFNjYWxlVHlwZS5QT0lOVF07XG5cbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBbJ3gnLCAneScsICdzaXplJywgJ29wYWNpdHknXSBhcyBTY2FsZUNoYW5uZWxbXSkge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsICdvcmRpbmFsJykpO1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsICdzZXF1ZW50aWFsJykpO1xuICAgICAgICBmb3IgKGNvbnN0IHNjYWxlVHlwZSBvZiBzY2FsZVR5cGVzKSB7XG4gICAgICAgICAgYXNzZXJ0KGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsIHNjYWxlVHlwZSksIGBFcnJvcjogJHtjaGFubmVsfSwgJHtzY2FsZVR5cGV9YCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2dldFN1cHBvcnRlZFNjYWxlVHlwZScsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIHJldHVybiBjb3JyZWN0IHNjYWxlIHR5cGVzIGZvciBxdWFudGl0YXRpdmUgcG9zaXRpb25hbCBjaGFubmVscycsICgpID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBUeXBlLlFVQU5USVRBVElWRTtcbiAgICAgIGNvbnN0IHBvc2l0aW9uYWxTY2FsZVR5cGVzID0gW1NjYWxlVHlwZS5MSU5FQVIsIFNjYWxlVHlwZS5MT0csIFNjYWxlVHlwZS5QT1csIFNjYWxlVHlwZS5TUVJUXTtcblxuICAgICAgLy8geCBjaGFubmVsXG4gICAgICBsZXQgc2NhbGVUeXBlcyA9IGdldFN1cHBvcnRlZFNjYWxlVHlwZShDaGFubmVsLlgsIHR5cGUpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChwb3NpdGlvbmFsU2NhbGVUeXBlcywgc2NhbGVUeXBlcyk7XG5cbiAgICAgIC8vIHkgY2hhbm5lbFxuICAgICAgc2NhbGVUeXBlcyA9IGdldFN1cHBvcnRlZFNjYWxlVHlwZShDaGFubmVsLlksIFR5cGUuUVVBTlRJVEFUSVZFKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGVUeXBlcywgcG9zaXRpb25hbFNjYWxlVHlwZXMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBzY2FsZSB0eXBlcyBmb3IgcXVhbnRpdGF0aXZlIHBvc2l0aW9uYWwgY2hhbm5lbHMgd2l0aCBiaW4nLCAoKSA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gVHlwZS5RVUFOVElUQVRJVkU7XG4gICAgICBjb25zdCBwb3NpdGlvbmFsU2NhbGVUeXBlc0Jpbm5lZCA9IFtTY2FsZVR5cGUuTElORUFSLCBTY2FsZVR5cGUuQklOX0xJTkVBUl07XG5cbiAgICAgIC8vIHggY2hhbm5lbFxuICAgICAgbGV0IHNjYWxlVHlwZXMgPSBnZXRTdXBwb3J0ZWRTY2FsZVR5cGUoQ2hhbm5lbC5YLCB0eXBlLCB0cnVlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGVUeXBlcywgcG9zaXRpb25hbFNjYWxlVHlwZXNCaW5uZWQpO1xuXG4gICAgICAvLyB5IGNoYW5uZWxcbiAgICAgIHNjYWxlVHlwZXMgPSBnZXRTdXBwb3J0ZWRTY2FsZVR5cGUoQ2hhbm5lbC5ZLCB0eXBlLCB0cnVlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGVUeXBlcywgcG9zaXRpb25hbFNjYWxlVHlwZXNCaW5uZWQpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBzY2FsZSB0eXBlcyBmb3Igbm9taW5hbCBwb3NpdGlvbmFsIGNoYW5uZWxzJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9IFR5cGUuTk9NSU5BTDtcbiAgICAgIGNvbnN0IG5vbWluYWxQb3NpdGlvbmFsU2NhbGVUeXBlcyA9IFtTY2FsZVR5cGUuUE9JTlQsIFNjYWxlVHlwZS5CQU5EXTtcblxuICAgICAgbGV0IHNjYWxlVHlwZXMgPSBnZXRTdXBwb3J0ZWRTY2FsZVR5cGUoQ2hhbm5lbC5YLCB0eXBlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGVUeXBlcywgbm9taW5hbFBvc2l0aW9uYWxTY2FsZVR5cGVzKTtcblxuICAgICAgc2NhbGVUeXBlcyA9IGdldFN1cHBvcnRlZFNjYWxlVHlwZShDaGFubmVsLlksIHR5cGUpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZVR5cGVzLCBub21pbmFsUG9zaXRpb25hbFNjYWxlVHlwZXMpO1xuICAgIH0pO1xuXG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBzY2FsZSB0eXBlcyBmb3IgdGVtcG9yYWwgcG9zaXRpb25hbCBjaGFubmVscycsICgpID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBUeXBlLlRFTVBPUkFMO1xuICAgICAgY29uc3QgdGVtcG9yYWxQb3NpdGlvbmFsU2NhbGVUeXBlcyA9IFtTY2FsZVR5cGUuVElNRSwgU2NhbGVUeXBlLlVUQ107XG5cbiAgICAgIGxldCBzY2FsZVR5cGVzID0gZ2V0U3VwcG9ydGVkU2NhbGVUeXBlKENoYW5uZWwuWCwgdHlwZSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlVHlwZXMsIHRlbXBvcmFsUG9zaXRpb25hbFNjYWxlVHlwZXMpO1xuXG4gICAgICBzY2FsZVR5cGVzID0gZ2V0U3VwcG9ydGVkU2NhbGVUeXBlKENoYW5uZWwuWSwgdHlwZSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlVHlwZXMsIHRlbXBvcmFsUG9zaXRpb25hbFNjYWxlVHlwZXMpO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19