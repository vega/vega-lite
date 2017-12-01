"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var mixins = require("./mixins");
var ref = require("./valueref");
exports.rule = {
    vgMark: 'rule',
    encodeEntry: function (model) {
        var _config = model.config, markDef = model.markDef, width = model.width, height = model.height;
        var orient = markDef.orient;
        if (!model.encoding.x && !model.encoding.y) {
            // if we have neither x or y, show nothing
            return {};
        }
        return __assign({}, mixins.markDefProperties(model.markDef, true), mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)), mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)), mixins.pointPosition2(model, 'zeroOrMax'), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHNCQUFlLEVBQUUsdUJBQU8sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7UUFDeEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLDBDQUEwQztZQUMxQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVELE1BQU0sY0FDRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFDN0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN4RixNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ3ZGLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFdBQVcsQ0FBQyxFQUV6QyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFDN0IsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQ3BDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNuQyxTQUFTLEVBQUUsYUFBYSxDQUFFLGdDQUFnQztTQUMzRCxDQUFDLEVBQ0Y7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuXG5leHBvcnQgY29uc3QgcnVsZTogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdydWxlJyxcbiAgZW5jb2RlRW50cnk6IChtb2RlbDogVW5pdE1vZGVsKSA9PiB7XG4gICAgY29uc3Qge2NvbmZpZzogX2NvbmZpZywgbWFya0RlZiwgd2lkdGgsIGhlaWdodH0gPSBtb2RlbDtcbiAgICBjb25zdCBvcmllbnQgPSBtYXJrRGVmLm9yaWVudDtcblxuICAgIGlmICghbW9kZWwuZW5jb2RpbmcueCAmJiAhbW9kZWwuZW5jb2RpbmcueSkge1xuICAgICAgLy8gaWYgd2UgaGF2ZSBuZWl0aGVyIHggb3IgeSwgc2hvdyBub3RoaW5nXG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1peGlucy5tYXJrRGVmUHJvcGVydGllcyhtb2RlbC5tYXJrRGVmLCB0cnVlKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIG9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3plcm9Pck1pbicgOiByZWYubWlkKHdpZHRoKSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneScsIG1vZGVsLCBvcmllbnQgPT09ICd2ZXJ0aWNhbCcgPyAnemVyb09yTWluJyA6IHJlZi5taWQoaGVpZ2h0KSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbjIobW9kZWwsICd6ZXJvT3JNYXgnKSxcblxuICAgICAgLi4ubWl4aW5zLmNvbG9yKG1vZGVsKSxcbiAgICAgIC4uLm1peGlucy50ZXh0KG1vZGVsLCAndG9vbHRpcCcpLFxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdvcGFjaXR5JywgbW9kZWwpLFxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtcbiAgICAgICAgdmdDaGFubmVsOiAnc3Ryb2tlV2lkdGgnICAvLyBWTCdzIHJ1bGUgc2l6ZSBpcyBzdHJva2VXaWR0aFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59O1xuIl19