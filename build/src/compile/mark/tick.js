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
var vega_schema_1 = require("../../vega.schema");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.tick = {
    vgMark: 'rect',
    encodeEntry: function (model) {
        var config = model.config, markDef = model.markDef, width = model.width, height = model.height;
        var orient = markDef.orient;
        var vgSizeChannel = orient === 'horizontal' ? 'width' : 'height';
        var vgThicknessChannel = orient === 'horizontal' ? 'height' : 'width';
        return __assign({}, mixins.baseEncodeEntry(model, true), mixins.pointPosition('x', model, ref.mid(width), 'xc'), mixins.pointPosition('y', model, ref.mid(height), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a));
        var _a;
    }
};
function defaultSize(model) {
    var config = model.config;
    var orient = model.markDef.orient;
    var scale = model.getScaleComponent(orient === 'horizontal' ? 'x' : 'y');
    if (config.tick.bandSize !== undefined) {
        return config.tick.bandSize;
    }
    else {
        var scaleRange = scale ? scale.get('range') : undefined;
        var rangeStep = scaleRange && vega_schema_1.isVgRangeStep(scaleRange) ?
            scaleRange.step :
            config.scale.rangeStep;
        if (typeof rangeStep !== 'number') {
            // FIXME consolidate this log
            throw new Error('Function does not handle non-numeric rangeStep');
        }
        return rangeStep / 1.5;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaURBQWdEO0FBR2hELGlDQUFtQztBQUNuQyxnQ0FBa0M7QUFHckIsUUFBQSxJQUFJLEdBQWlCO0lBQ2hDLE1BQU0sRUFBRSxNQUFNO0lBRWQsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDckIsSUFBQSxxQkFBTSxFQUFFLHVCQUFPLEVBQUUsbUJBQUssRUFBRSxxQkFBTSxDQUFVO1FBQy9DLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFOUIsSUFBTSxhQUFhLEdBQUcsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDbkUsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV4RSxNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBRW5DLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUN0RCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsRUFHdkQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBQ25DLFlBQVksRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ2hDLFNBQVMsRUFBRSxhQUFhO1NBQ3pCLENBQUMsZUFDRCxrQkFBa0IsSUFBRyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxPQUNwRDs7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLHFCQUFxQixLQUFnQjtJQUM1QixJQUFBLHFCQUFNLENBQVU7SUFDdkIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDcEMsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFM0UsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN2QyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDMUQsSUFBTSxTQUFTLEdBQUcsVUFBVSxJQUFJLDJCQUFhLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztZQUN6RCxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakIsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7UUFDekIsRUFBRSxDQUFDLENBQUMsT0FBTyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNsQyw2QkFBNkI7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1FBQ3BFLENBQUM7UUFDRCxNQUFNLENBQUMsU0FBUyxHQUFHLEdBQUcsQ0FBQztJQUN6QixDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNWZ1JhbmdlU3RlcH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgKiBhcyBtaXhpbnMgZnJvbSAnLi9taXhpbnMnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmV4cG9ydCBjb25zdCB0aWNrOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3JlY3QnLFxuXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIGNvbnN0IHtjb25maWcsIG1hcmtEZWYsIHdpZHRoLCBoZWlnaHR9ID0gbW9kZWw7XG4gICAgY29uc3Qgb3JpZW50ID0gbWFya0RlZi5vcmllbnQ7XG5cbiAgICBjb25zdCB2Z1NpemVDaGFubmVsID0gb3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gICAgY29uc3QgdmdUaGlja25lc3NDaGFubmVsID0gb3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwgdHJ1ZSksXG5cbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIHJlZi5taWQod2lkdGgpLCAneGMnKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSwgJ3ljJyksXG5cbiAgICAgIC8vIHNpemUgLyB0aGlja25lc3MgPT4gd2lkdGggLyBoZWlnaHRcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFNpemUobW9kZWwpLFxuICAgICAgICB2Z0NoYW5uZWw6IHZnU2l6ZUNoYW5uZWxcbiAgICAgIH0pLFxuICAgICAgW3ZnVGhpY2tuZXNzQ2hhbm5lbF06IHt2YWx1ZTogY29uZmlnLnRpY2sudGhpY2tuZXNzfSxcbiAgICB9O1xuICB9XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2l6ZShtb2RlbDogVW5pdE1vZGVsKTogbnVtYmVyIHtcbiAgY29uc3Qge2NvbmZpZ30gPSBtb2RlbDtcbiAgY29uc3Qgb3JpZW50ID0gbW9kZWwubWFya0RlZi5vcmllbnQ7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneCcgOiAneScpO1xuXG4gIGlmIChjb25maWcudGljay5iYW5kU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbmZpZy50aWNrLmJhbmRTaXplO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNjYWxlUmFuZ2UgPSBzY2FsZSA/IHNjYWxlLmdldCgncmFuZ2UnKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCByYW5nZVN0ZXAgPSBzY2FsZVJhbmdlICYmIGlzVmdSYW5nZVN0ZXAoc2NhbGVSYW5nZSkgP1xuICAgICAgc2NhbGVSYW5nZS5zdGVwIDpcbiAgICAgIGNvbmZpZy5zY2FsZS5yYW5nZVN0ZXA7XG4gICAgaWYgKHR5cGVvZiByYW5nZVN0ZXAgIT09ICdudW1iZXInKSB7XG4gICAgICAvLyBGSVhNRSBjb25zb2xpZGF0ZSB0aGlzIGxvZ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBkb2VzIG5vdCBoYW5kbGUgbm9uLW51bWVyaWMgcmFuZ2VTdGVwJyk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZVN0ZXAgLyAxLjU7XG4gIH1cbn1cbiJdfQ==