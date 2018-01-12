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
exports.line = {
    vgMark: 'line',
    encodeEntry: function (model) {
        var width = model.width, height = model.height;
        return __assign({}, mixins.markDefProperties(model.markDef, true), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLG1CQUFLLEVBQUUscUJBQU0sQ0FBVTtRQUU5QixNQUFNLGNBQ0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ2hELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2pELE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFDcEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBQ25DLFNBQVMsRUFBRSxhQUFhLENBQUUsZ0NBQWdDO1NBQzNELENBQUMsRUFDRjtJQUNKLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgKiBhcyBtaXhpbnMgZnJvbSAnLi9taXhpbnMnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmV4cG9ydCBjb25zdCBsaW5lOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ2xpbmUnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBtb2RlbDtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5taXhpbnMubWFya0RlZlByb3BlcnRpZXMobW9kZWwubWFya0RlZiwgdHJ1ZSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneCcsIG1vZGVsLCByZWYubWlkKHdpZHRoKSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneScsIG1vZGVsLCByZWYubWlkKGhlaWdodCkpLFxuICAgICAgLi4ubWl4aW5zLmNvbG9yKG1vZGVsKSxcbiAgICAgIC4uLm1peGlucy50ZXh0KG1vZGVsLCAndG9vbHRpcCcpLFxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdvcGFjaXR5JywgbW9kZWwpLFxuICAgICAgLi4ubWl4aW5zLm5vblBvc2l0aW9uKCdzaXplJywgbW9kZWwsIHtcbiAgICAgICAgdmdDaGFubmVsOiAnc3Ryb2tlV2lkdGgnICAvLyBWTCdzIGxpbmUgc2l6ZSBpcyBzdHJva2VXaWR0aFxuICAgICAgfSlcbiAgICB9O1xuICB9XG59O1xuIl19