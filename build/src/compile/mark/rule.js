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
        return __assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, orient === 'horizontal' ? 'zeroOrMin' : ref.mid(width)), mixins.pointPosition('y', model, orient === 'vertical' ? 'zeroOrMin' : ref.mid(height)), (orient !== 'vertical' ? mixins.pointPosition2(model, 'zeroOrMax', 'x2') : {}), (orient !== 'horizontal' ? mixins.pointPosition2(model, 'zeroOrMax', 'y2') : {}), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's rule size is strokeWidth
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvcnVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUVyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLHNCQUFlLEVBQUUsdUJBQU8sRUFBRSxtQkFBSyxFQUFFLHFCQUFNLENBQVU7UUFDeEQsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztRQUU5QixFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzNDLDBDQUEwQztZQUMxQyxNQUFNLENBQUMsRUFBRSxDQUFDO1FBQ1osQ0FBQztRQUVELE1BQU0sY0FDRCxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQ2pFLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxNQUFNLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDeEYsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUd2RixDQUFDLE1BQU0sS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBRzlFLENBQUMsTUFBTSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFFaEYsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBQ25DLFNBQVMsRUFBRSxhQUFhLENBQUUsZ0NBQWdDO1NBQzNELENBQUMsRUFDRjtJQUNKLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgKiBhcyBtaXhpbnMgZnJvbSAnLi9taXhpbnMnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5leHBvcnQgY29uc3QgcnVsZTogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdydWxlJyxcbiAgZW5jb2RlRW50cnk6IChtb2RlbDogVW5pdE1vZGVsKSA9PiB7XG4gICAgY29uc3Qge2NvbmZpZzogX2NvbmZpZywgbWFya0RlZiwgd2lkdGgsIGhlaWdodH0gPSBtb2RlbDtcbiAgICBjb25zdCBvcmllbnQgPSBtYXJrRGVmLm9yaWVudDtcblxuICAgIGlmICghbW9kZWwuZW5jb2RpbmcueCAmJiAhbW9kZWwuZW5jb2RpbmcueSkge1xuICAgICAgLy8gaWYgd2UgaGF2ZSBuZWl0aGVyIHggb3IgeSwgc2hvdyBub3RoaW5nXG4gICAgICByZXR1cm4ge307XG4gICAgfVxuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1peGlucy5iYXNlRW5jb2RlRW50cnkobW9kZWwsIHtzaXplOiAnaWdub3JlJywgb3JpZW50OiAnaWdub3JlJ30pLFxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3gnLCBtb2RlbCwgb3JpZW50ID09PSAnaG9yaXpvbnRhbCcgPyAnemVyb09yTWluJyA6IHJlZi5taWQod2lkdGgpKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIG9yaWVudCA9PT0gJ3ZlcnRpY2FsJyA/ICd6ZXJvT3JNaW4nIDogcmVmLm1pZChoZWlnaHQpKSxcblxuICAgICAgLy8gaW5jbHVkZSB4MiBmb3IgaG9yaXpvbnRhbCBvciBsaW5lIHNlZ21lbnQgcnVsZVxuICAgICAgLi4uKG9yaWVudCAhPT0gJ3ZlcnRpY2FsJyA/IG1peGlucy5wb2ludFBvc2l0aW9uMihtb2RlbCwgJ3plcm9Pck1heCcsICd4MicpIDoge30pLFxuXG4gICAgICAvLyBpbmNsdWRlIHkyIGZvciB2ZXJ0aWNhbCBvciBsaW5lIHNlZ21lbnQgcnVsZVxuICAgICAgLi4uKG9yaWVudCAhPT0gJ2hvcml6b250YWwnID8gbWl4aW5zLnBvaW50UG9zaXRpb24yKG1vZGVsLCAnemVyb09yTWF4JywgJ3kyJykgOiB7fSksXG5cbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7XG4gICAgICAgIHZnQ2hhbm5lbDogJ3N0cm9rZVdpZHRoJyAgLy8gVkwncyBydWxlIHNpemUgaXMgc3Ryb2tlV2lkdGhcbiAgICAgIH0pXG4gICAgfTtcbiAgfVxufTtcbiJdfQ==