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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbGUudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3Rlc3Qvc2NhbGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QiwwQ0FBNEQ7QUFDNUQsb0NBQXNDO0FBQ3RDLHNDQUE4RztBQUM5RyxvQ0FBMEM7QUFFMUMsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUNoQixRQUFRLENBQUMsMEJBQTBCLEVBQUU7UUFDbkMsd0RBQXdEO1FBQ3hELEVBQUUsQ0FBQyx5RUFBeUUsRUFBRTtvQ0FDakUsSUFBSTtnQkFDYixhQUFNLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsVUFBQyxTQUFTO29CQUN2QyxPQUFPLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3pELENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDO1lBSkQsS0FBbUIsVUFBc0IsRUFBdEIsS0FBQSxLQUFLLENBQUMsZ0JBQWdCLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCO2dCQUFwQyxJQUFNLElBQUksU0FBQTt3QkFBSixJQUFJO2FBSWQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILGdGQUFnRjtRQUVoRixhQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyx3QkFBd0IsQ0FBQyxZQUFZLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxZQUFZLEVBQUU7UUFDckIsRUFBRSxDQUFDLHdEQUF3RCxFQUFFO1lBQzNELEtBQXdCLFVBQWlCLEVBQWpCLEtBQUEsS0FBSyxDQUFDLFdBQVcsRUFBakIsY0FBaUIsRUFBakIsSUFBaUI7Z0JBQXBDLElBQU0sU0FBUyxTQUFBO2dCQUNsQixhQUFNLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxTQUFT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QztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHthc3NlcnR9IGZyb20gJ2NoYWknO1xuaW1wb3J0IHtTQ0FMRV9DSEFOTkVMUywgU2NhbGVDaGFubmVsfSBmcm9tICcuLi9zcmMvY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBzY2FsZSBmcm9tICcuLi9zcmMvc2NhbGUnO1xuaW1wb3J0IHtjaGFubmVsU3VwcG9ydFNjYWxlVHlwZSwgQ09OVElOVU9VU19UT19DT05USU5VT1VTX1NDQUxFUywgU0NBTEVfVFlQRVMsIFNjYWxlVHlwZX0gZnJvbSAnLi4vc3JjL3NjYWxlJztcbmltcG9ydCB7c29tZSwgd2l0aG91dH0gZnJvbSAnLi4vc3JjL3V0aWwnO1xuXG5kZXNjcmliZSgnc2NhbGUnLCAoKSA9PiB7XG4gIGRlc2NyaWJlKCdzY2FsZVR5cGVTdXBwb3J0UHJvcGVydHknLCAoKSA9PiB7XG4gICAgLy8gTWFrZSBzdXJlIHdlIGFsd2F5cyBlZGl0IHRoaXMgd2hlbiB3ZSBhZGQgbmV3IGNoYW5uZWxcbiAgICBpdCgnc2hvdWxkIGhhdmUgYXQgbGVhc3Qgb25lIHN1cHBvcnRlZCBzY2FsZSB0eXBlcyBmb3IgYWxsIHNjYWxlIHByb3BlcnRpZXMnLCAoKSA9PiB7XG4gICAgICBmb3IgKGNvbnN0IHByb3Agb2Ygc2NhbGUuU0NBTEVfUFJPUEVSVElFUykge1xuICAgICAgICBhc3NlcnQoc29tZShzY2FsZS5TQ0FMRV9UWVBFUywgKHNjYWxlVHlwZSkgPT4ge1xuICAgICAgICAgIHJldHVybiBzY2FsZS5zY2FsZVR5cGVTdXBwb3J0UHJvcGVydHkoc2NhbGVUeXBlLCBwcm9wKTtcbiAgICAgICAgfSkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gVE9ETzogd3JpdGUgbW9yZSB0ZXN0IGJsaW5kbHkgKERvbid0IGxvb2sgYXQgb3VyIGNvZGUsIGp1c3QgbG9vayBhdCBEMyBjb2RlLilcblxuICAgIGFzc2VydC5pc0ZhbHNlKHNjYWxlLnNjYWxlVHlwZVN1cHBvcnRQcm9wZXJ0eSgnYmluLWxpbmVhcicsICd6ZXJvJykpO1xuICB9KTtcblxuICBkZXNjcmliZSgnc2NhbGVUeXBlcycsICgpID0+IHtcbiAgICBpdCgnc2hvdWxkIGVpdGhlciBoYXNDb250aW51b3VzRG9tYWluIG9yIGhhc0Rpc2NyZXRlRG9tYWluJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2Ygc2NhbGUuU0NBTEVfVFlQRVMpIHtcbiAgICAgICAgYXNzZXJ0KHNjYWxlLmhhc0NvbnRpbnVvdXNEb21haW4oc2NhbGVUeXBlKSAhPT0gc2NhbGUuaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xuXG5cbiAgZGVzY3JpYmUoJ2NoYW5uZWxTdXBwb3J0U2NhbGVUeXBlJywgKCkgPT4ge1xuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhbHdheXMgZWRpdCB0aGlzIHdoZW4gd2UgYWRkIG5ldyBjaGFubmVsXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBzdXBwb3J0ZWQgc2NhbGUgdHlwZXMgZm9yIGFsbCBjaGFubmVscyB3aXRoIHNjYWxlJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFNDQUxFX0NIQU5ORUxTKSB7XG4gICAgICAgIGFzc2VydChzb21lKFNDQUxFX1RZUEVTLCAoc2NhbGVUeXBlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIE1ha2Ugc3VyZSB3ZSBhbHdheXMgZWRpdCB0aGlzIHdoZW4gd2UgYWRkIG5ldyBzY2FsZSB0eXBlXG4gICAgaXQoJ3Nob3VsZCBoYXZlIGF0IGxlYXN0IG9uZSBzdXBwb3J0ZWQgY2hhbm5lbCBmb3IgYWxsIHNjYWxlIHR5cGVzJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2YgU0NBTEVfVFlQRVMpIHtcbiAgICAgICAgYXNzZXJ0KHNvbWUoU0NBTEVfQ0hBTk5FTFMsIChjaGFubmVsKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKGNoYW5uZWwsIHNjYWxlVHlwZSk7XG4gICAgICAgIH0pKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCdzaGFwZSBzaG91bGQgc3VwcG9ydCBvbmx5IG9yZGluYWwnLCAoKSA9PiB7XG4gICAgICBhc3NlcnQoY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoJ3NoYXBlJywgJ29yZGluYWwnKSk7XG4gICAgICBjb25zdCBub25PcmRpbmFsID0gd2l0aG91dDxTY2FsZVR5cGU+KFNDQUxFX1RZUEVTLCBbJ29yZGluYWwnXSk7XG4gICAgICBmb3IgKGNvbnN0IHNjYWxlVHlwZSBvZiBub25PcmRpbmFsKSB7XG4gICAgICAgIGFzc2VydCghY2hhbm5lbFN1cHBvcnRTY2FsZVR5cGUoJ3NoYXBlJywgc2NhbGVUeXBlKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpdCgnY29sb3Igc2hvdWxkIHN1cHBvcnQgYWxsIHNjYWxlIHR5cGVzIGV4Y2VwdCBiYW5kJywgKCkgPT4ge1xuICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2YgU0NBTEVfVFlQRVMpIHtcbiAgICAgICAgYXNzZXJ0LmVxdWFsKGNoYW5uZWxTdXBwb3J0U2NhbGVUeXBlKCdjb2xvcicsIHNjYWxlVHlwZSksIHNjYWxlVHlwZSAhPT0gJ2JhbmQnKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KCd4LCB5LCBzaXplLCBvcGFjaXR5IHNob3VsZCBzdXBwb3J0IGFsbCBjb250aW51b3VzIHNjYWxlIHR5cGUgYXMgd2VsbCBhcyBiYW5kIGFuZCBwb2ludCcsICgpID0+IHtcbiAgICAgIC8vIHgseSBzaG91bGQgdXNlIGVpdGhlciBiYW5kIG9yIHBvaW50IGZvciBvcmRpbmFsIGlucHV0XG4gICAgICBjb25zdCBzY2FsZVR5cGVzID0gWy4uLkNPTlRJTlVPVVNfVE9fQ09OVElOVU9VU19TQ0FMRVMsIFNjYWxlVHlwZS5CQU5ELCBTY2FsZVR5cGUuUE9JTlRdO1xuXG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgWyd4JywgJ3knLCAnc2l6ZScsICdvcGFjaXR5J10gYXMgU2NhbGVDaGFubmVsW10pIHtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCAnb3JkaW5hbCcpKTtcbiAgICAgICAgYXNzZXJ0KCFjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCAnc2VxdWVudGlhbCcpKTtcbiAgICAgICAgZm9yIChjb25zdCBzY2FsZVR5cGUgb2Ygc2NhbGVUeXBlcykge1xuICAgICAgICAgIGFzc2VydChjaGFubmVsU3VwcG9ydFNjYWxlVHlwZShjaGFubmVsLCBzY2FsZVR5cGUpLCBgRXJyb3I6ICR7Y2hhbm5lbH0sICR7c2NhbGVUeXBlfWApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=