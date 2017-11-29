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
exports.area = {
    vgMark: 'area',
    encodeEntry: function (model) {
        return __assign({}, mixins.markDefProperties(model.markDef), mixins.pointPosition('x', model, 'zeroOrMin'), mixins.pointPosition('y', model, 'zeroOrMin'), mixins.pointPosition2(model, 'zeroOrMin'), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('opacity', model));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJlYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvYXJlYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBR3RCLFFBQUEsSUFBSSxHQUFpQjtJQUNoQyxNQUFNLEVBQUUsTUFBTTtJQUNkLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQzVCLE1BQU0sY0FDRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxFQUN2QyxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxXQUFXLENBQUMsRUFDN0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLEVBRXpDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFDdkM7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcblxuXG5leHBvcnQgY29uc3QgYXJlYTogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdhcmVhJyxcbiAgZW5jb2RlRW50cnk6IChtb2RlbDogVW5pdE1vZGVsKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1peGlucy5tYXJrRGVmUHJvcGVydGllcyhtb2RlbC5tYXJrRGVmKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsICd6ZXJvT3JNaW4nKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsICd6ZXJvT3JNaW4nKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uMihtb2RlbCwgJ3plcm9Pck1pbicpLFxuXG4gICAgICAuLi5taXhpbnMuY29sb3IobW9kZWwpLFxuICAgICAgLi4ubWl4aW5zLnRleHQobW9kZWwsICd0b29sdGlwJyksXG4gICAgICAuLi5taXhpbnMubm9uUG9zaXRpb24oJ29wYWNpdHknLCBtb2RlbCksXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==