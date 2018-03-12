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
        return __assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width), 'xc'), mixins.pointPosition('y', model, ref.mid(height), 'yc'), mixins.nonPosition('size', model, {
            defaultValue: defaultSize(model),
            vgChannel: vgSizeChannel
        }), (_a = {}, _a[vgThicknessChannel] = { value: config.tick.thickness }, _a));
        var _a;
    }
};
function defaultSize(model) {
    var config = model.config, markDef = model.markDef;
    var orient = markDef.orient;
    var scale = model.getScaleComponent(orient === 'horizontal' ? 'x' : 'y');
    if (markDef.size !== undefined) {
        return markDef.size;
    }
    else if (config.tick.bandSize !== undefined) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsaURBQWdEO0FBR2hELGlDQUFtQztBQUNuQyxnQ0FBa0M7QUFHckIsUUFBQSxJQUFJLEdBQWlCO0lBQ2hDLE1BQU0sRUFBRSxNQUFNO0lBRWQsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDckIsSUFBQSxxQkFBTSxFQUFFLHVCQUFPLEVBQUUsbUJBQUssRUFBRSxxQkFBTSxDQUFVO1FBQy9DLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFFOUIsSUFBTSxhQUFhLEdBQUcsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7UUFDbkUsSUFBTSxrQkFBa0IsR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUV4RSxNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUVqRSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxJQUFJLENBQUMsRUFDdEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBR3ZELE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNuQyxZQUFZLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQztZQUNoQyxTQUFTLEVBQUUsYUFBYTtTQUN6QixDQUFDLGVBQ0Qsa0JBQWtCLElBQUcsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUMsT0FDcEQ7O0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFRixxQkFBcUIsS0FBZ0I7SUFDNUIsSUFBQSxxQkFBTSxFQUFFLHVCQUFPLENBQVU7SUFDaEMsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztJQUM5QixJQUFNLEtBQUssR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUUzRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUM5QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMxRCxJQUFNLFNBQVMsR0FBRyxVQUFVLElBQUksMkJBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3pELFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUN6QixFQUFFLENBQUMsQ0FBQyxPQUFPLFNBQVMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLDZCQUE2QjtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLGdEQUFnRCxDQUFDLENBQUM7UUFDcEUsQ0FBQztRQUNELE1BQU0sQ0FBQyxTQUFTLEdBQUcsR0FBRyxDQUFDO0lBQ3pCLENBQUM7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge01hcmtDb21waWxlcn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCAqIGFzIG1peGlucyBmcm9tICcuL21peGlucyc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cblxuZXhwb3J0IGNvbnN0IHRpY2s6IE1hcmtDb21waWxlciA9IHtcbiAgdmdNYXJrOiAncmVjdCcsXG5cbiAgZW5jb2RlRW50cnk6IChtb2RlbDogVW5pdE1vZGVsKSA9PiB7XG4gICAgY29uc3Qge2NvbmZpZywgbWFya0RlZiwgd2lkdGgsIGhlaWdodH0gPSBtb2RlbDtcbiAgICBjb25zdCBvcmllbnQgPSBtYXJrRGVmLm9yaWVudDtcblxuICAgIGNvbnN0IHZnU2l6ZUNoYW5uZWwgPSBvcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd3aWR0aCcgOiAnaGVpZ2h0JztcbiAgICBjb25zdCB2Z1RoaWNrbmVzc0NoYW5uZWwgPSBvcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICdoZWlnaHQnIDogJ3dpZHRoJztcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5taXhpbnMuYmFzZUVuY29kZUVudHJ5KG1vZGVsLCB7c2l6ZTogJ2lnbm9yZScsIG9yaWVudDogJ2lnbm9yZSd9KSxcblxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3gnLCBtb2RlbCwgcmVmLm1pZCh3aWR0aCksICd4YycpLFxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3knLCBtb2RlbCwgcmVmLm1pZChoZWlnaHQpLCAneWMnKSxcblxuICAgICAgLy8gc2l6ZSAvIHRoaWNrbmVzcyA9PiB3aWR0aCAvIGhlaWdodFxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtcbiAgICAgICAgZGVmYXVsdFZhbHVlOiBkZWZhdWx0U2l6ZShtb2RlbCksXG4gICAgICAgIHZnQ2hhbm5lbDogdmdTaXplQ2hhbm5lbFxuICAgICAgfSksXG4gICAgICBbdmdUaGlja25lc3NDaGFubmVsXToge3ZhbHVlOiBjb25maWcudGljay50aGlja25lc3N9LFxuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGRlZmF1bHRTaXplKG1vZGVsOiBVbml0TW9kZWwpOiBudW1iZXIge1xuICBjb25zdCB7Y29uZmlnLCBtYXJrRGVmfSA9IG1vZGVsO1xuICBjb25zdCBvcmllbnQgPSBtYXJrRGVmLm9yaWVudDtcbiAgY29uc3Qgc2NhbGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChvcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd4JyA6ICd5Jyk7XG5cbiAgaWYgKG1hcmtEZWYuc2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIG1hcmtEZWYuc2l6ZTtcbiAgfSBlbHNlIGlmIChjb25maWcudGljay5iYW5kU2l6ZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNvbmZpZy50aWNrLmJhbmRTaXplO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNjYWxlUmFuZ2UgPSBzY2FsZSA/IHNjYWxlLmdldCgncmFuZ2UnKSA6IHVuZGVmaW5lZDtcbiAgICBjb25zdCByYW5nZVN0ZXAgPSBzY2FsZVJhbmdlICYmIGlzVmdSYW5nZVN0ZXAoc2NhbGVSYW5nZSkgP1xuICAgICAgc2NhbGVSYW5nZS5zdGVwIDpcbiAgICAgIGNvbmZpZy5zY2FsZS5yYW5nZVN0ZXA7XG4gICAgaWYgKHR5cGVvZiByYW5nZVN0ZXAgIT09ICdudW1iZXInKSB7XG4gICAgICAvLyBGSVhNRSBjb25zb2xpZGF0ZSB0aGlzIGxvZ1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGdW5jdGlvbiBkb2VzIG5vdCBoYW5kbGUgbm9uLW51bWVyaWMgcmFuZ2VTdGVwJyk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZVN0ZXAgLyAxLjU7XG4gIH1cbn1cbiJdfQ==