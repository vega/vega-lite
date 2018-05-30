"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var channel_1 = require("../src/channel");
var scale = require("../src/scale");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QiwwQ0FBcUU7QUFDckUsb0NBQXNDO0FBQ3RDLHNDQUtzQjtBQUN0QixvQ0FBaUM7QUFDakMsb0NBQTBDO0FBRTFDLFFBQVEsQ0FBQyxPQUFPLEVBQUU7SUFDaEIsUUFBUSxDQUFDLDBCQUEwQixFQUFFO1FBQ25DLHdEQUF3RDtRQUN4RCxFQUFFLENBQUMseUVBQXlFLEVBQUU7b0NBQ2pFLElBQUk7Z0JBQ2IsYUFBTSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFVBQUMsU0FBUztvQkFDdkMsT0FBTyxLQUFLLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUN6RCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQztZQUpELEtBQW1CLFVBQXNCLEVBQXRCLEtBQUEsS0FBSyxDQUFDLGdCQUFnQixFQUF0QixjQUFzQixFQUF0QixJQUFzQjtnQkFBcEMsSUFBTSxJQUFJLFNBQUE7d0JBQUosSUFBSTthQUlkO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxnRkFBZ0Y7UUFFaEYsYUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsWUFBWSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsWUFBWSxFQUFFO1FBQ3JCLEVBQUUsQ0FBQyx3REFBd0QsRUFBRTtZQUMzRCxLQUF3QixVQUFpQixFQUFqQixLQUFBLEtBQUssQ0FBQyxXQUFXLEVBQWpCLGNBQWlCLEVBQWpCLElBQWlCO2dCQUFwQyxJQUFNLFNBQVMsU0FBQTtnQkFDbEIsYUFBTSxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsS0FBSyxLQUFLLENBQUMsaUJB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QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtDaGFubmVsLCBTQ0FMRV9DSEFOTkVMUywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBzY2FsZSBmcm9tICcuLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtcbiAgY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUsXG4gIENPTlRJTlVPVVNfVE9fQ09OVElOVU9VU19TQ0FMRVMsIGdldFN1cHBvcnRlZFNjYWxlVHlwZSxcbiAgU0NBTEVfVFlQRVMsXG4gIFNjYWxlVHlwZVxufSBmcm9tICcuLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtUeXBlfSBmcm9tICcuLi9zcmMvdHlwZSc7XG5pbXBvcnQge3NvbWUsIHdpdGhvdXR9IGZyb20gJy4uL3NyYy91dGlsJztcblxuZGVzY3JpYmUoJ3NjYWxlJywgKCkgPT4ge1xuICBkZXNjcmliZSgnc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5JywgKCkgPT4ge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhbHdheXMgZWRpdCB0aGlzIHdoZW4gd2UgYWRkIG5ldyBjaGFubmVsXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBzdXBwb3J0ZWQgc2NhbGUgdHlwZXMgZm9yIGFsbCBzY2FsZSBwcm9wZXJ0aWVzJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBwcm9wIG9mIHNjYWxlLlNDQUxFX1BST1BFUlRJRVMpIHtcbiAgICAgICAgYXNzZXJ0KHNvbWUoc2NhbGUuU0NBTEVfVFlQRVMsIChzY2FsZVR5cGUpID0+IHtcbiAgICAgICAgICByZXR1cm4gc2NhbGUuc2NhbGVUeXBlU3VwcG9ydFByb3BlcnR5KHNjYWxlVHlwZSwgcHJvcCk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIFRPRE86IHdyaXRlIG1vcmUgdGVzdCBibGluZGx5IChEb24ndCBsb29rIGF0IG91ciBjb2RlLCBqdXN0IGxvb2sgYXQgRDMgY29kZS4pXG5cbiAgICBhc3NlcnQuaXNGYWxzZShzY2FsZS5zY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoJ2Jpbi1saW5lYXInLCAnemVybycpKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NjYWxlVHlwZXMnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCBlaXRoZXIgaGFzQ29udGludW91c0RvbWFpbiBvciBoYXNEaXNjcmV0ZURvbWFpbicsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIHNjYWxlLlNDQUxFX1RZUEVTKSB7XG4gICAgICAgIGFzc2VydChzY2FsZS5oYXNDb250aW51b3VzRG9tYWluKHNjYWxlVHlwZSkgIT09IHNjYWxlLmhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuXG4gIGRlc2NyaWJlKCdjaGFubmVsU3VwcG9ydFNjYWxlVHlwZScsICgpID0+IHtcbiAgICAvLyBNYWtlIHN1cmUgd2UgYWx3YXlzIGVkaXQgdGhpcyB3aGVuIHdlIGFkZCBuZXcgY2hhbm5lbFxuICAgIGl0KCdzaG91bGQgaGF2ZSBhdCBsZWFzdCBvbmUgc3VwcG9ydGVkIHNjYWxlIHR5cGVzIGZvciBhbGwgY2hhbm5lbHMgd2l0aCBzY2FsZScsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3QgY2hhbm5lbCBvZiBTQ0FMRV9DSEFOTkVMUykge1xuICAgICAgICBhc3NlcnQoc29tZShTQ0FMRV9UWVBFUywgKHNjYWxlVHlwZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBNYWtlIHN1cmUgd2UgYWx3YXlzIGVkaXQgdGhpcyB3aGVuIHdlIGFkZCBuZXcgc2NhbGUgdHlwZVxuICAgIGl0KCdzaG91bGQgaGF2ZSBhdCBsZWFzdCBvbmUgc3VwcG9ydGVkIGNoYW5uZWwgZm9yIGFsbCBzY2FsZSB0eXBlcycsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIFNDQUxFX1RZUEVTKSB7XG4gICAgICAgIGFzc2VydChzb21lKFNDQUxFX0NIQU5ORUxTLCAoY2hhbm5lbCkgPT4ge1xuICAgICAgICAgIHJldHVybiBjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzY2FsZVR5cGUpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnc2hhcGUgc2hvdWxkIHN1cHBvcnQgb25seSBvcmRpbmFsJywgKCkgPT4ge1xuICAgICAgYXNzZXJ0KGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKCdzaGFwZScsICdvcmRpbmFsJykpO1xuICAgICAgY29uc3Qgbm9uT3JkaW5hbCA9IHdpdGhvdXQ8U2NhbGVUeXBlPihTQ0FMRV9UWVBFUywgWydvcmRpbmFsJ10pO1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2Ygbm9uT3JkaW5hbCkge1xuICAgICAgICBhc3NlcnQoIWNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKCdzaGFwZScsIHNjYWxlVHlwZSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaXQoJ2NvbG9yIHNob3VsZCBzdXBwb3J0IGFsbCBzY2FsZSB0eXBlcyBleGNlcHQgYmFuZCcsICgpID0+IHtcbiAgICAgIGZvciAoY29uc3Qgc2NhbGVUeXBlIG9mIFNDQUxFX1RZUEVTKSB7XG4gICAgICAgIGFzc2VydC5lcXVhbChjaGFubmVsU3VwcG9ydFNjYWxlVHlwZSgnY29sb3InLCBzY2FsZVR5cGUpLCBzY2FsZVR5cGUgIT09ICdiYW5kJyk7XG4gICAgICB9XG4gICAgfSk7XG5cblxuICAgIGl0KCd4LCB5LCBzaXplLCBvcGFjaXR5IHNob3VsZCBzdXBwb3J0IGFsbCBjb250aW51b3VzIHNjYWxlIHR5cGUgYXMgd2VsbCBhcyBiYW5kIGFuZCBwb2ludCcsICgpID0+IHtcbiAgICAgIC8vIHgseSBzaG91bGQgdXNlIGVpdGhlciBiYW5kIG9yIHBvaW50IGZvciBvcmRpbmFsIGlucHV0XG4gICAgICBjb25zdCBzY2FsZVR5cGVzID0gWy4uLkNPTlRJTlVPVVNfVE9fQ09OVElOVU9VU19TQ0FMRVMsIFNjYWxlVHlwZS5CQU5ELCBTY2FsZVR5cGUuUE9JTlRdO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knLCAnc2l6ZScsICdvcGFjaXR5J10gYXMgU2NhbGVDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCAnb3JkaW5hbCcpKTtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCAnc2VxdWVudGlhbCcpKTtcbiAgICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2Ygc2NhbGVUeXBlcykge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzY2FsZVR5cGUpLCBgRXJyb3I6ICR7Y2hhbm5lbH0sICR7c2NhbGVUeXBlfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdnZXRTdXBwb3J0ZWRTY2FsZVR5cGUnLCAoKSA9PiB7XG4gICAgaXQoJ3Nob3VsZCByZXR1cm4gY29ycmVjdCBzY2FsZSB0eXBlcyBmb3IgcXVhbnRpdGF0aXZlIHBvc2l0aW9uYWwgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gVHlwZS5RVUFOVElUQVRJVkU7XG4gICAgICBjb25zdCBwb3NpdGlvbmFsU2NhbGVUeXBlcyA9IFtTY2FsZVR5cGUuTElORUFSLCBTY2FsZVR5cGUuTE9HLCBTY2FsZVR5cGUuUE9XLCBTY2FsZVR5cGUuU1FSVF07XG5cbiAgICAgIC8vIHggY2hhbm5lbFxuICAgICAgbGV0IHNjYWxlVHlwZXMgPSBnZXRTdXBwb3J0ZWRTY2FsZVR5cGUoQ2hhbm5lbC5YLCB0eXBlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwocG9zaXRpb25hbFNjYWxlVHlwZXMsIHNjYWxlVHlwZXMpO1xuXG4gICAgICAvLyB5IGNoYW5uZWxcbiAgICAgIHNjYWxlVHlwZXMgPSBnZXRTdXBwb3J0ZWRTY2FsZVR5cGUoQ2hhbm5lbC5ZLCBUeXBlLlFVQU5USVRBVElWRSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlVHlwZXMsIHBvc2l0aW9uYWxTY2FsZVR5cGVzKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgc2NhbGUgdHlwZXMgZm9yIHF1YW50aXRhdGl2ZSBwb3NpdGlvbmFsIGNoYW5uZWxzIHdpdGggYmluJywgKCkgPT4ge1xuICAgICAgY29uc3QgdHlwZSA9IFR5cGUuUVVBTlRJVEFUSVZFO1xuICAgICAgY29uc3QgcG9zaXRpb25hbFNjYWxlVHlwZXNCaW5uZWQgPSBbU2NhbGVUeXBlLkxJTkVBUiwgU2NhbGVUeXBlLkJJTl9MSU5FQVJdO1xuXG4gICAgICAvLyB4IGNoYW5uZWxcbiAgICAgIGxldCBzY2FsZVR5cGVzID0gZ2V0U3VwcG9ydGVkU2NhbGVUeXBlKENoYW5uZWwuWCwgdHlwZSwgdHJ1ZSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlVHlwZXMsIHBvc2l0aW9uYWxTY2FsZVR5cGVzQmlubmVkKTtcblxuICAgICAgLy8geSBjaGFubmVsXG4gICAgICBzY2FsZVR5cGVzID0gZ2V0U3VwcG9ydGVkU2NhbGVUeXBlKENoYW5uZWwuWSwgdHlwZSwgdHJ1ZSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlVHlwZXMsIHBvc2l0aW9uYWxTY2FsZVR5cGVzQmlubmVkKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgc2NhbGUgdHlwZXMgZm9yIG5vbWluYWwgcG9zaXRpb25hbCBjaGFubmVscycsICgpID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBUeXBlLk5PTUlOQUw7XG4gICAgICBjb25zdCBub21pbmFsUG9zaXRpb25hbFNjYWxlVHlwZXMgPSBbU2NhbGVUeXBlLlBPSU5ULCBTY2FsZVR5cGUuQkFORF07XG5cbiAgICAgIGxldCBzY2FsZVR5cGVzID0gZ2V0U3VwcG9ydGVkU2NhbGVUeXBlKENoYW5uZWwuWCwgdHlwZSk7XG4gICAgICBhc3NlcnQuZGVlcEVxdWFsKHNjYWxlVHlwZXMsIG5vbWluYWxQb3NpdGlvbmFsU2NhbGVUeXBlcyk7XG5cbiAgICAgIHNjYWxlVHlwZXMgPSBnZXRTdXBwb3J0ZWRTY2FsZVR5cGUoQ2hhbm5lbC5ZLCB0eXBlKTtcbiAgICAgIGFzc2VydC5kZWVwRXF1YWwoc2NhbGVUeXBlcywgbm9taW5hbFBvc2l0aW9uYWxTY2FsZVR5cGVzKTtcbiAgICB9KTtcblxuICAgIGl0KCdzaG91bGQgcmV0dXJuIGNvcnJlY3Qgc2NhbGUgdHlwZXMgZm9yIHRlbXBvcmFsIHBvc2l0aW9uYWwgY2hhbm5lbHMnLCAoKSA9PiB7XG4gICAgICBjb25zdCB0eXBlID0gVHlwZS5URU1QT1JBTDtcbiAgICAgIGNvbnN0IHRlbXBvcmFsUG9zaXRpb25hbFNjYWxlVHlwZXMgPSBbU2NhbGVUeXBlLlRJTUUsIFNjYWxlVHlwZS5VVENdO1xuXG4gICAgICBsZXQgc2NhbGVUeXBlcyA9IGdldFN1cHBvcnRlZFNjYWxlVHlwZShDaGFubmVsLlgsIHR5cGUpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZVR5cGVzLCB0ZW1wb3JhbFBvc2l0aW9uYWxTY2FsZVR5cGVzKTtcblxuICAgICAgc2NhbGVUeXBlcyA9IGdldFN1cHBvcnRlZFNjYWxlVHlwZShDaGFubmVsLlksIHR5cGUpO1xuICAgICAgYXNzZXJ0LmRlZXBFcXVhbChzY2FsZVR5cGVzLCB0ZW1wb3JhbFBvc2l0aW9uYWxTY2FsZVR5cGVzKTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==