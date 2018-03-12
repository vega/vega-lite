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
        return __assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model, {
            vgChannel: 'strokeWidth' // VL's line size is strokeWidth
        }));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvbGluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUVyQixRQUFBLElBQUksR0FBaUI7SUFDaEMsTUFBTSxFQUFFLE1BQU07SUFDZCxXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUNyQixJQUFBLG1CQUFLLEVBQUUscUJBQU0sQ0FBVTtRQUU5QixNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsRUFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUMsQ0FBQyxFQUNqRSxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUNoRCxNQUFNLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUNqRCxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUU7WUFDbkMsU0FBUyxFQUFFLGFBQWEsQ0FBRSxnQ0FBZ0M7U0FDM0QsQ0FBQyxFQUNGO0lBQ0osQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge01hcmtDb21waWxlcn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCAqIGFzIG1peGlucyBmcm9tICcuL21peGlucyc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cbmV4cG9ydCBjb25zdCBsaW5lOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ2xpbmUnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBtb2RlbDtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5taXhpbnMuYmFzZUVuY29kZUVudHJ5KG1vZGVsLCB7c2l6ZTogJ2lnbm9yZScsIG9yaWVudDogJ2lnbm9yZSd9KSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIHJlZi5taWQod2lkdGgpKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSksXG4gICAgICAuLi5taXhpbnMubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCwge1xuICAgICAgICB2Z0NoYW5uZWw6ICdzdHJva2VXaWR0aCcgIC8vIFZMJ3MgbGluZSBzaXplIGlzIHN0cm9rZVdpZHRoXG4gICAgICB9KVxuICAgIH07XG4gIH1cbn07XG4iXX0=