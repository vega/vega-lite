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
var common_1 = require("../common");
var mixins = require("./mixins");
var ref = require("./valueref");
function encodeEntry(model, fixedShape) {
    var config = model.config, width = model.width, height = model.height;
    return __assign({}, mixins.baseEncodeEntry(model, true), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape));
}
function shapeMixins(model, config, fixedShape) {
    if (fixedShape) {
        return { shape: { value: fixedShape } };
    }
    return mixins.nonPosition('shape', model, { defaultValue: common_1.getMarkConfig('shape', model.markDef, config) });
}
exports.shapeMixins = shapeMixins;
exports.point = {
    vgMark: 'symbol',
    encodeEntry: function (model) {
        return encodeEntry(model);
    }
};
exports.circle = {
    vgMark: 'symbol',
    encodeEntry: function (model) {
        return encodeEntry(model, 'circle');
    }
};
exports.square = {
    vgMark: 'symbol',
    encodeEntry: function (model) {
        return encodeEntry(model, 'square');
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQSxvQ0FBd0M7QUFHeEMsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdsQyxxQkFBcUIsS0FBZ0IsRUFBRSxVQUFnQztJQUM5RCxJQUFBLHFCQUFNLEVBQUUsbUJBQUssRUFBRSxxQkFBTSxDQUFVO0lBRXRDLE1BQU0sY0FDRCxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFDbkMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDaEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFDakQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLEVBQ2pDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxFQUN6QztBQUNKLENBQUM7QUFFRCxxQkFBNEIsS0FBZ0IsRUFBRSxNQUFjLEVBQUUsVUFBZ0M7SUFDNUYsRUFBRSxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztRQUNmLE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxVQUFVLEVBQUMsRUFBQyxDQUFDO0lBQ3RDLENBQUM7SUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxPQUFPLEVBQUUsS0FBSyxFQUFFLEVBQUMsWUFBWSxFQUFFLHNCQUFhLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFXLEVBQUMsQ0FBQyxDQUFDO0FBQ3JILENBQUM7QUFMRCxrQ0FLQztBQUVZLFFBQUEsS0FBSyxHQUFpQjtJQUNqQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRixDQUFDO0FBRVcsUUFBQSxNQUFNLEdBQWlCO0lBQ2xDLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRixDQUFDO0FBRVcsUUFBQSxNQUFNLEdBQWlCO0lBQ2xDLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge1ZnRW5jb2RlRW50cnl9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuXG5mdW5jdGlvbiBlbmNvZGVFbnRyeShtb2RlbDogVW5pdE1vZGVsLCBmaXhlZFNoYXBlPzogJ2NpcmNsZScgfCAnc3F1YXJlJykge1xuICBjb25zdCB7Y29uZmlnLCB3aWR0aCwgaGVpZ2h0fSA9IG1vZGVsO1xuXG4gIHJldHVybiB7XG4gICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwgdHJ1ZSksXG4gICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3gnLCBtb2RlbCwgcmVmLm1pZCh3aWR0aCkpLFxuICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSksXG4gICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwpLFxuICAgIC4uLnNoYXBlTWl4aW5zKG1vZGVsLCBjb25maWcsIGZpeGVkU2hhcGUpLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hhcGVNaXhpbnMobW9kZWw6IFVuaXRNb2RlbCwgY29uZmlnOiBDb25maWcsIGZpeGVkU2hhcGU/OiAnY2lyY2xlJyB8ICdzcXVhcmUnKTogVmdFbmNvZGVFbnRyeSB7XG4gIGlmIChmaXhlZFNoYXBlKSB7XG4gICAgcmV0dXJuIHtzaGFwZToge3ZhbHVlOiBmaXhlZFNoYXBlfX07XG4gIH1cbiAgcmV0dXJuIG1peGlucy5ub25Qb3NpdGlvbignc2hhcGUnLCBtb2RlbCwge2RlZmF1bHRWYWx1ZTogZ2V0TWFya0NvbmZpZygnc2hhcGUnLCBtb2RlbC5tYXJrRGVmLCBjb25maWcpIGFzIHN0cmluZ30pO1xufVxuXG5leHBvcnQgY29uc3QgcG9pbnQ6IE1hcmtDb21waWxlciA9IHtcbiAgdmdNYXJrOiAnc3ltYm9sJyxcbiAgZW5jb2RlRW50cnk6IChtb2RlbDogVW5pdE1vZGVsKSA9PiB7XG4gICAgcmV0dXJuIGVuY29kZUVudHJ5KG1vZGVsKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IGNpcmNsZTogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdzeW1ib2wnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICByZXR1cm4gZW5jb2RlRW50cnkobW9kZWwsICdjaXJjbGUnKTtcbiAgfVxufTtcblxuZXhwb3J0IGNvbnN0IHNxdWFyZTogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdzeW1ib2wnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICByZXR1cm4gZW5jb2RlRW50cnkobW9kZWwsICdzcXVhcmUnKTtcbiAgfVxufTtcbiJdfQ==