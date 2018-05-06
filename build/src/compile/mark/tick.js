"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
        return tslib_1.__assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width), 'xc'), mixins.pointPosition('y', model, ref.mid(height), 'yc'), mixins.nonPosition('size', model, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGljay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGljay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxpREFBZ0Q7QUFHaEQsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFFZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHFCQUFNLEVBQUUsdUJBQU8sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7UUFDL0MsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixJQUFNLGFBQWEsR0FBRyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUNuRSxJQUFNLGtCQUFrQixHQUFHLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO1FBRXhFLDRCQUNLLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFDLENBQUMsRUFFakUsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxDQUFDLEVBQ3RELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUd2RCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDbkMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxLQUFLLENBQUM7WUFDaEMsU0FBUyxFQUFFLGFBQWE7U0FDekIsQ0FBQyxlQUNELGtCQUFrQixJQUFHLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDLE9BQ3BEOztJQUNKLENBQUM7Q0FDRixDQUFDO0FBRUYscUJBQXFCLEtBQWdCO0lBQzVCLElBQUEscUJBQU0sRUFBRSx1QkFBTyxDQUFVO0lBQ2hDLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDOUIsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFFM0UsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUM5QixPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUM7S0FDckI7U0FBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsRUFBRTtRQUM3QyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQzdCO1NBQU07UUFDTCxJQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUMxRCxJQUFNLFNBQVMsR0FBRyxVQUFVLElBQUksMkJBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3pELFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNqQixNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQztRQUN6QixJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUNqQyw2QkFBNkI7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyxnREFBZ0QsQ0FBQyxDQUFDO1NBQ25FO1FBQ0QsT0FBTyxTQUFTLEdBQUcsR0FBRyxDQUFDO0tBQ3hCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNWZ1JhbmdlU3RlcH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgKiBhcyBtaXhpbnMgZnJvbSAnLi9taXhpbnMnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmV4cG9ydCBjb25zdCB0aWNrOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3JlY3QnLFxuXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIGNvbnN0IHtjb25maWcsIG1hcmtEZWYsIHdpZHRoLCBoZWlnaHR9ID0gbW9kZWw7XG4gICAgY29uc3Qgb3JpZW50ID0gbWFya0RlZi5vcmllbnQ7XG5cbiAgICBjb25zdCB2Z1NpemVDaGFubmVsID0gb3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAnd2lkdGgnIDogJ2hlaWdodCc7XG4gICAgY29uc3QgdmdUaGlja25lc3NDaGFubmVsID0gb3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAnaGVpZ2h0JyA6ICd3aWR0aCc7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwge3NpemU6ICdpZ25vcmUnLCBvcmllbnQ6ICdpZ25vcmUnfSksXG5cbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIHJlZi5taWQod2lkdGgpLCAneGMnKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSwgJ3ljJyksXG5cbiAgICAgIC8vIHNpemUgLyB0aGlja25lc3MgPT4gd2lkdGggLyBoZWlnaHRcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7XG4gICAgICAgIGRlZmF1bHRWYWx1ZTogZGVmYXVsdFNpemUobW9kZWwpLFxuICAgICAgICB2Z0NoYW5uZWw6IHZnU2l6ZUNoYW5uZWxcbiAgICAgIH0pLFxuICAgICAgW3ZnVGhpY2tuZXNzQ2hhbm5lbF06IHt2YWx1ZTogY29uZmlnLnRpY2sudGhpY2tuZXNzfSxcbiAgICB9O1xuICB9XG59O1xuXG5mdW5jdGlvbiBkZWZhdWx0U2l6ZShtb2RlbDogVW5pdE1vZGVsKTogbnVtYmVyIHtcbiAgY29uc3Qge2NvbmZpZywgbWFya0RlZn0gPSBtb2RlbDtcbiAgY29uc3Qgb3JpZW50ID0gbWFya0RlZi5vcmllbnQ7XG4gIGNvbnN0IHNjYWxlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQob3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAneCcgOiAneScpO1xuXG4gIGlmIChtYXJrRGVmLnNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBtYXJrRGVmLnNpemU7XG4gIH0gZWxzZSBpZiAoY29uZmlnLnRpY2suYmFuZFNpemUgIT09IHVuZGVmaW5lZCkge1xuICAgIHJldHVybiBjb25maWcudGljay5iYW5kU2l6ZTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBzY2FsZVJhbmdlID0gc2NhbGUgPyBzY2FsZS5nZXQoJ3JhbmdlJykgOiB1bmRlZmluZWQ7XG4gICAgY29uc3QgcmFuZ2VTdGVwID0gc2NhbGVSYW5nZSAmJiBpc1ZnUmFuZ2VTdGVwKHNjYWxlUmFuZ2UpID9cbiAgICAgIHNjYWxlUmFuZ2Uuc3RlcCA6XG4gICAgICBjb25maWcuc2NhbGUucmFuZ2VTdGVwO1xuICAgIGlmICh0eXBlb2YgcmFuZ2VTdGVwICE9PSAnbnVtYmVyJykge1xuICAgICAgLy8gRklYTUUgY29uc29saWRhdGUgdGhpcyBsb2dcbiAgICAgIHRocm93IG5ldyBFcnJvcignRnVuY3Rpb24gZG9lcyBub3QgaGFuZGxlIG5vbi1udW1lcmljIHJhbmdlU3RlcCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmFuZ2VTdGVwIC8gMS41O1xuICB9XG59XG4iXX0=