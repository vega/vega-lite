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
        if (!model.encoding.x && !model.encoding.y && !model.encoding.latitude && !model.encoding.longitude) {
            // Show nothing if we have none of x, y, lat, and long.
            return {};
        }
        return __assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)), mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)), (orient !== 'vertical' ? mixins.pointPosition2(model, 'zeroOrMax', 'x2') : {}), (orient !== 'horizontal' ? mixins.pointPosition2(model, 'zeroOrMax', 'y2') : {}), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUVyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHNCQUFlLEVBQUUsdUJBQU8sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7UUFDeEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNwRyx1REFBdUQ7WUFDdkQsTUFBTSxDQUFDLEVBQUUsQ0FBQztRQUNaLENBQUM7UUFFRCxNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUNqRSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ3hGLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFHdkYsQ0FBQyxNQUFNLEtBQUssVUFBVSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUc5RSxDQUFDLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBRWhGLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNuQyxTQUFTLEVBQUUsYUFBYSxDQUFFLGdDQUFnQztTQUMzRCxDQUFDLEVBQ0Y7SUFDSixDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuZXhwb3J0IGNvbnN0IHJ1bGU6IE1hcmtDb21waWxlciA9IHtcbiAgdmdNYXJrOiAncnVsZScsXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIGNvbnN0IHtjb25maWc6IF9jb25maWcsIG1hcmtEZWYsIHdpZHRoLCBoZWlnaHR9ID0gbW9kZWw7XG4gICAgY29uc3Qgb3JpZW50ID0gbWFya0RlZi5vcmllbnQ7XG5cbiAgICBpZiAoIW1vZGVsLmVuY29kaW5nLnggJiYgIW1vZGVsLmVuY29kaW5nLnkgJiYgIW1vZGVsLmVuY29kaW5nLmxhdGl0dWRlICYmICFtb2RlbC5lbmNvZGluZy5sb25naXR1ZGUpIHtcbiAgICAgIC8vIFNob3cgbm90aGluZyBpZiB3ZSBoYXZlIG5vbmUgb2YgeCwgeSwgbGF0LCBhbmQgbG9uZy5cbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwge3NpemU6ICdpZ25vcmUnLCBvcmllbnQ6ICdpZ25vcmUnfSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneCcsIG1vZGVsLCBvcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd6ZXJvT3JNaW4nIDogcmVmLm1pZCh3aWR0aCkpLFxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3knLCBtb2RlbCwgb3JpZW50ID09PSAndmVydGljYWwnID8gJ3plcm9Pck1pbicgOiByZWYubWlkKGhlaWdodCkpLFxuXG4gICAgICAvLyBpbmNsdWRlIHgyIGZvciBob3Jpem9udGFsIG9yIGxpbmUgc2VnbWVudCBydWxlXG4gICAgICAuLi4ob3JpZW50ICE9PSAndmVydGljYWwnID8gbWl4aW5zLnBvaW50UG9zaXRpb24yKG1vZGVsLCAnemVyb09yTWF4JywgJ3gyJykgOiB7fSksXG5cbiAgICAgIC8vIGluY2x1ZGUgeTIgZm9yIHZlcnRpY2FsIG9yIGxpbmUgc2VnbWVudCBydWxlXG4gICAgICAuLi4ob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcgPyBtaXhpbnMucG9pbnRQb3NpdGlvbjIobW9kZWwsICd6ZXJvT3JNYXgnLCAneTInKSA6IHt9KSxcblxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtcbiAgICAgICAgdmdDaGFubmVsOiAnc3Ryb2tlV2lkdGgnICAvLyBWTCdzIHJ1bGUgc2l6ZSBpcyBzdHJva2VXaWR0aFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59O1xuIl19