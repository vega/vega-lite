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
    return __assign({}, mixins.markDefProperties(model.markDef, true), mixins.pointPosition('x', model, ref.mid(width)), mixins.pointPosition('y', model, ref.mid(height)), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('size', model), shapeMixins(model, config, fixedShape), mixins.nonPosition('opacity', model));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFFQSxvQ0FBd0M7QUFHeEMsaUNBQW1DO0FBQ25DLGdDQUFrQztBQUdsQyxxQkFBcUIsS0FBZ0IsRUFBRSxVQUFnQztJQUM5RCxJQUFBLHFCQUFNLEVBQUUsbUJBQUssRUFBRSxxQkFBTSxDQUFVO0lBRXRDLE1BQU0sY0FDRCxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFDN0MsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFDaEQsTUFBTSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsRUFFakQsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEVBQzdCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUNqQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsRUFDdEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQ3ZDO0FBQ0osQ0FBQztBQUVELHFCQUE0QixLQUFnQixFQUFFLE1BQWMsRUFBRSxVQUFnQztJQUM1RixFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBQyxFQUFDLENBQUM7SUFDdEMsQ0FBQztJQUNELE1BQU0sQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsRUFBQyxZQUFZLEVBQUUsc0JBQWEsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQVcsRUFBQyxDQUFDLENBQUM7QUFDckgsQ0FBQztBQUxELGtDQUtDO0FBRVksUUFBQSxLQUFLLEdBQWlCO0lBQ2pDLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQzVCLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztDQUNGLENBQUM7QUFFVyxRQUFBLE1BQU0sR0FBaUI7SUFDbEMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGLENBQUM7QUFFVyxRQUFBLE1BQU0sR0FBaUI7SUFDbEMsTUFBTSxFQUFFLFFBQVE7SUFDaEIsV0FBVyxFQUFFLFVBQUMsS0FBZ0I7UUFDNUIsTUFBTSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQztDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7VmdFbmNvZGVFbnRyeX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgKiBhcyBtaXhpbnMgZnJvbSAnLi9taXhpbnMnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmZ1bmN0aW9uIGVuY29kZUVudHJ5KG1vZGVsOiBVbml0TW9kZWwsIGZpeGVkU2hhcGU/OiAnY2lyY2xlJyB8ICdzcXVhcmUnKSB7XG4gIGNvbnN0IHtjb25maWcsIHdpZHRoLCBoZWlnaHR9ID0gbW9kZWw7XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5taXhpbnMubWFya0RlZlByb3BlcnRpZXMobW9kZWwubWFya0RlZiwgdHJ1ZSksXG4gICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3gnLCBtb2RlbCwgcmVmLm1pZCh3aWR0aCkpLFxuICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSksXG5cbiAgICAuLi5taXhpbnMuY29sb3IobW9kZWwpLFxuICAgIC4uLm1peGlucy50ZXh0KG1vZGVsLCAndG9vbHRpcCcpLFxuICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsKSxcbiAgICAuLi5zaGFwZU1peGlucyhtb2RlbCwgY29uZmlnLCBmaXhlZFNoYXBlKSxcbiAgICAuLi5taXhpbnMubm9uUG9zaXRpb24oJ29wYWNpdHknLCBtb2RlbCksXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaGFwZU1peGlucyhtb2RlbDogVW5pdE1vZGVsLCBjb25maWc6IENvbmZpZywgZml4ZWRTaGFwZT86ICdjaXJjbGUnIHwgJ3NxdWFyZScpOiBWZ0VuY29kZUVudHJ5IHtcbiAgaWYgKGZpeGVkU2hhcGUpIHtcbiAgICByZXR1cm4ge3NoYXBlOiB7dmFsdWU6IGZpeGVkU2hhcGV9fTtcbiAgfVxuICByZXR1cm4gbWl4aW5zLm5vblBvc2l0aW9uKCdzaGFwZScsIG1vZGVsLCB7ZGVmYXVsdFZhbHVlOiBnZXRNYXJrQ29uZmlnKCdzaGFwZScsIG1vZGVsLm1hcmtEZWYsIGNvbmZpZykgYXMgc3RyaW5nfSk7XG59XG5cbmV4cG9ydCBjb25zdCBwb2ludDogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdzeW1ib2wnLFxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICByZXR1cm4gZW5jb2RlRW50cnkobW9kZWwpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3QgY2lyY2xlOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3N5bWJvbCcsXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIHJldHVybiBlbmNvZGVFbnRyeShtb2RlbCwgJ2NpcmNsZScpO1xuICB9XG59O1xuXG5leHBvcnQgY29uc3Qgc3F1YXJlOiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3N5bWJvbCcsXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIHJldHVybiBlbmNvZGVFbnRyeShtb2RlbCwgJ3NxdWFyZScpO1xuICB9XG59O1xuIl19