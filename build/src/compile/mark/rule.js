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
        return __assign({}, mixins.baseEncodeEntry(model, true), mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)), mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)), (orient !== 'vertical' ? mixins.pointPosition2(model, 'zeroOrMax', 'x2') : {}), (orient !== 'horizontal' ? mixins.pointPosition2(model, 'zeroOrMax', 'y2') : {}), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUVyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHNCQUFlLEVBQUUsdUJBQU8sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7UUFDeEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLDBDQUEwQztZQUMxQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVELE1BQU0sY0FDRCxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsRUFDbkMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUN4RixNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBR3ZGLENBQUMsTUFBTSxLQUFLLFVBQVUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFHOUUsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUVoRixNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDbkMsU0FBUyxFQUFFLGFBQWEsQ0FBRSxnQ0FBZ0M7U0FDM0QsQ0FBQyxFQUNGO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge01hcmtDb21waWxlcn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCAqIGFzIG1peGlucyBmcm9tICcuL21peGlucyc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cbmV4cG9ydCBjb25zdCBydWxlOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3J1bGUnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICBjb25zdCB7Y29uZmlnOiBfY29uZmlnLCBtYXJrRGVmLCB3aWR0aCwgaGVpZ2h0fSA9IG1vZGVsO1xuICAgIGNvbnN0IG9yaWVudCA9IG1hcmtEZWYub3JpZW50O1xuXG4gICAgaWYgKCFtb2RlbC5lbmNvZGluZy54ICYmICFtb2RlbC5lbmNvZGluZy55KSB7XG4gICAgICAvLyBpZiB3ZSBoYXZlIG5laXRoZXIgeCBvciB5LCBzaG93IG5vdGhpbmdcbiAgICAgIHJldHVybiB7fTtcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwgdHJ1ZSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneCcsIG1vZGVsLCBvcmllbnQgPT09ICdob3Jpem9udGFsJyA/ICd6ZXJvT3JNaW4nIDogcmVmLm1pZCh3aWR0aCkpLFxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3knLCBtb2RlbCwgb3JpZW50ID09PSAndmVydGljYWwnID8gJ3plcm9Pck1pbicgOiByZWYubWlkKGhlaWdodCkpLFxuXG4gICAgICAvLyBpbmNsdWRlIHgyIGZvciBob3Jpem9udGFsIG9yIGxpbmUgc2VnbWVudCBydWxlXG4gICAgICAuLi4ob3JpZW50ICE9PSAndmVydGljYWwnID8gbWl4aW5zLnBvaW50UG9zaXRpb24yKG1vZGVsLCAnemVyb09yTWF4JywgJ3gyJykgOiB7fSksXG5cbiAgICAgIC8vIGluY2x1ZGUgeTIgZm9yIHZlcnRpY2FsIG9yIGxpbmUgc2VnbWVudCBydWxlXG4gICAgICAuLi4ob3JpZW50ICE9PSAnaG9yaXpvbnRhbCcgPyBtaXhpbnMucG9pbnRQb3NpdGlvbjIobW9kZWwsICd6ZXJvT3JNYXgnLCAneTInKSA6IHt9KSxcblxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtcbiAgICAgICAgdmdDaGFubmVsOiAnc3Ryb2tlV2lkdGgnICAvLyBWTCdzIHJ1bGUgc2l6ZSBpcyBzdHJva2VXaWR0aFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59O1xuIl19