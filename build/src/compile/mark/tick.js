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
        return __assign({}, mixins.markDefProperties(model.markDef, true), mixins.pointPosition('x', model, ref.mid(width), 'xc'), mixins.pointPosition('y', model, ref.mid(height), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a), mixins.color(model), mixins.nonPosition('opacity', model));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaURBQWdEO0FBR2hELGlDQUFtQztBQUNuQyxnQ0FBa0M7QUFHckIsUUFBQSxJQUFJLEdBQWlCO0lBQ2hDLE1BQU0sRUFBRSxNQUFNO0lBRWQsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDckIsSUFBQSxxQkFBTSxFQUFFLHVCQUFPLEVBQUUsbUJBQUssRUFBRSxxQkFBTSxDQUFVO1FBQy9DLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFOUIsSUFBTSxhQUFhLEdBQUcsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDbkUsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV4RSxNQUFNLGNBQ0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUN0RCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsRUFHdkQsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBQ25DLFlBQVksRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQ2hDLFNBQVMsRUFBRSxhQUFhO1NBQ3pCLENBQUMsZUFDRCxrQkFBa0IsSUFBRyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBQyxPQUVqRCxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUNuQixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFDdkM7O0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFRixxQkFBcUIsS0FBZ0I7SUFDNUIsSUFBQSxxQkFBTSxDQUFVO0lBQ3ZCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO0lBQ3BDLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRTNFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0lBQzlCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLElBQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBQzFELElBQU0sU0FBUyxHQUFHLFVBQVUsSUFBSSwyQkFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDekQsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO1FBQ3pCLEVBQUUsQ0FBQyxDQUFDLE9BQU8sU0FBUyxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7WUFDbEMsNkJBQTZCO1lBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0RBQWdELENBQUMsQ0FBQztRQUNwRSxDQUFDO1FBQ0QsTUFBTSxDQUFDLFNBQVMsR0FBRyxHQUFHLENBQUM7SUFDekIsQ0FBQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzVmdSYW5nZVN0ZXB9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuXG5leHBvcnQgY29uc3QgdGljazogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdyZWN0JyxcblxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICBjb25zdCB7Y29uZmlnLCBtYXJrRGVmLCB3aWR0aCwgaGVpZ2h0fSA9IG1vZGVsO1xuICAgIGNvbnN0IG9yaWVudCA9IG1hcmtEZWYub3JpZW50O1xuXG4gICAgY29uc3QgdmdTaXplQ2hhbm5lbCA9IG9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ3dpZHRoJyA6ICdoZWlnaHQnO1xuICAgIGNvbnN0IHZnVGhpY2tuZXNzQ2hhbm5lbCA9IG9yaWVudCA9PT0gJ2hvcml6b250YWwnID8gJ2hlaWdodCcgOiAnd2lkdGgnO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1peGlucy5tYXJrRGVmUHJvcGVydGllcyhtb2RlbC5tYXJrRGVmLCB0cnVlKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIHJlZi5taWQod2lkdGgpLCAneGMnKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSwgJ3ljJyksXG5cbiAgICAgIC8vIHNpemUgLyB0aGlja25lc3MgPT4gd2lkdGggLyBoZWlnaHRcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFNpemUobW9kZWwpLFxuICAgICAgICB2Z0NoYW5uZWw6IHZnU2l6ZUNoYW5uZWxcbiAgICAgIH0pLFxuICAgICAgW3ZnVGhpY2tuZXNzQ2hhbm5lbF06IHt2YWx1ZTogY29uZmlnLnRpY2sudGhpY2tuZXNzfSxcblxuICAgICAgLi4ubWl4aW5zLmNvbG9yKG1vZGVsKSxcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignb3BhY2l0eScsIG1vZGVsKSxcbiAgICB9O1xuICB9XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2l6ZShtb2RlbDogVW5pdE1vZGVsKTogbnVtYmVyIHtcbiAgY29uc3Qge2NvbmZpZ30gPSBtb2RlbDtcbiAgY29uc3Qgb3JpZW50ID0gbW9kZWwubWFya0RlZi5vcmllbnQ7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneCcgOiAneScpO1xuXG4gIGlmIChjb25maWcudGljay5iYW5kU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbmZpZy50aWNrLmJhbmRTaXplO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNjYWxlUmFuZ2UgPSBzY2FsZSA/IHNjYWxlLmdldCgncmFuZ2UnKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCByYW5nZVN0ZXAgPSBzY2FsZVJhbmdlICYmIGlzVmdSYW5nZVN0ZXAoc2NhbGVSYW5nZSkgP1xuICAgICAgc2NhbGVSYW5nZS5zdGVwIDpcbiAgICAgIGNvbmZpZy5zY2FsZS5yYW5nZVN0ZXA7XG4gICAgaWYgKHR5cGVvZiByYW5nZVN0ZXAgIT09ICdudW1iZXInKSB7XG4gICAgICAvLyBGSVhNRSBjb25zb2xpZGF0ZSB0aGlzIGxvZ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBkb2VzIG5vdCBoYW5kbGUgbm9uLW51bWVyaWMgcmFuZ2VTdGVwJyk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZVN0ZXAgLyAxLjU7XG4gIH1cbn1cbiJdfQ==