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
    return __assign({}, mixins.baseEncodeEntry(model, { size: 'include', orient: 'ignore' }), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQSxvQ0FBd0M7QUFHeEMsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdsQyxxQkFBcUIsS0FBZ0IsRUFBRSxVQUFnQztJQUM5RCxJQUFBLHFCQUFNLEVBQUUsbUJBQUssRUFBRSxxQkFBTSxDQUFVO0lBRXRDLE1BQU0sY0FDRCxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQ2xFLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQ2hELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2pELE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUNqQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFDekM7QUFDSixDQUFDO0FBRUQscUJBQTRCLEtBQWdCLEVBQUUsTUFBYyxFQUFFLFVBQWdDO0lBQzVGLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDZixNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFDLEVBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFDLFlBQVksRUFBRSxzQkFBYSxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBVyxFQUFDLENBQUMsQ0FBQztBQUNySCxDQUFDO0FBTEQsa0NBS0M7QUFFWSxRQUFBLEtBQUssR0FBaUI7SUFDakMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQ0YsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFpQjtJQUNsQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQztBQUVXLFFBQUEsTUFBTSxHQUFpQjtJQUNsQyxNQUFNLEVBQUUsUUFBUTtJQUNoQixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtWZ0VuY29kZUVudHJ5fSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtDb25maWd9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge01hcmtDb21waWxlcn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCAqIGFzIG1peGlucyBmcm9tICcuL21peGlucyc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cblxuZnVuY3Rpb24gZW5jb2RlRW50cnkobW9kZWw6IFVuaXRNb2RlbCwgZml4ZWRTaGFwZT86ICdjaXJjbGUnIHwgJ3NxdWFyZScpIHtcbiAgY29uc3Qge2NvbmZpZywgd2lkdGgsIGhlaWdodH0gPSBtb2RlbDtcblxuICByZXR1cm4ge1xuICAgIC4uLm1peGlucy5iYXNlRW5jb2RlRW50cnkobW9kZWwsIHtzaXplOiAnaW5jbHVkZScsIG9yaWVudDogJ2lnbm9yZSd9KSxcbiAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneCcsIG1vZGVsLCByZWYubWlkKHdpZHRoKSksXG4gICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3knLCBtb2RlbCwgcmVmLm1pZChoZWlnaHQpKSxcbiAgICAuLi5taXhpbnMubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCksXG4gICAgLi4uc2hhcGVNaXhpbnMobW9kZWwsIGNvbmZpZywgZml4ZWRTaGFwZSksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaGFwZU1peGlucyhtb2RlbDogVW5pdE1vZGVsLCBjb25maWc6IENvbmZpZywgZml4ZWRTaGFwZT86ICdjaXJjbGUnIHwgJ3NxdWFyZScpOiBWZ0VuY29kZUVudHJ5IHtcbiAgaWYgKGZpeGVkU2hhcGUpIHtcbiAgICByZXR1cm4ge3NoYXBlOiB7dmFsdWU6IGZpeGVkU2hhcGV9fTtcbiAgfVxuICByZXR1cm4gbWl4aW5zLm5vblBvc2l0aW9uKCdzaGFwZScsIG1vZGVsLCB7ZGVmYXVsdFZhbHVlOiBnZXRNYXJrQ29uZmlnKCdzaGFwZScsIG1vZGVsLm1hcmtEZWYsIGNvbmZpZykgYXMgc3RyaW5nfSk7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludDogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdzeW1ib2wnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICByZXR1cm4gZW5jb2RlRW50cnkobW9kZWwpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgY2lyY2xlOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3N5bWJvbCcsXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIHJldHVybiBlbmNvZGVFbnRyeShtb2RlbCwgJ2NpcmNsZScpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3F1YXJlOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3N5bWJvbCcsXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIHJldHVybiBlbmNvZGVFbnRyeShtb2RlbCwgJ3NxdWFyZScpO1xuICB9XG59O1xuIl19