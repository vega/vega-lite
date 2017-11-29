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
var channel_1 = require("../../channel");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
var common_1 = require("../common");
var mixins = require("./mixins");
var ref = require("./valueref");
exports.text = {
    vgMark: 'text',
    encodeEntry: function (model) {
        var config = model.config, encoding = model.encoding, height = model.height;
        var textDef = encoding.text;
        return __assign({}, mixins.markDefProperties(model.markDef, true), mixins.pointPosition('x', model, xDefault(config, textDef)), mixins.pointPosition('y', model, ref.mid(height)), mixins.text(model), mixins.color(model), mixins.text(model, 'tooltip'), mixins.nonPosition('opacity', model), mixins.nonPosition('size', model, {
            vgChannel: 'fontSize' // VL's text size is fontSize
        }), mixins.valueIfDefined('align', align(model.markDef, encoding, config)));
    }
};
function xDefault(config, textDef) {
    if (fielddef_1.isFieldDef(textDef) && textDef.type === type_1.QUANTITATIVE) {
        return { field: { group: 'width' }, offset: -5 };
    }
    // TODO: allow this to fit (Be consistent with ref.midX())
    return { value: config.scale.textXRangeStep / 2 };
}
function align(markDef, encoding, config) {
    var align = markDef.align || common_1.getMarkConfig('align', markDef, config);
    if (align === undefined) {
        return encoding_1.channelHasField(encoding, channel_1.X) ? 'center' : 'right';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQWdDO0FBRWhDLDJDQUF5RDtBQUN6RCwyQ0FBc0Q7QUFFdEQsbUNBQXdDO0FBRXhDLG9DQUF3QztBQUd4QyxpQ0FBbUM7QUFDbkMsZ0NBQWtDO0FBR3JCLFFBQUEsSUFBSSxHQUFpQjtJQUNoQyxNQUFNLEVBQUUsTUFBTTtJQUVkLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQ3JCLElBQUEscUJBQU0sRUFBRSx5QkFBUSxFQUFFLHFCQUFNLENBQVU7UUFDekMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUU5QixNQUFNLGNBQ0QsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQzdDLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQzNELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2xCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUM3QixNQUFNLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsRUFDcEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFO1lBQ25DLFNBQVMsRUFBRSxVQUFVLENBQUUsNkJBQTZCO1NBQ3JELENBQUMsRUFDQyxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFDekU7SUFDSixDQUFDO0NBQ0YsQ0FBQztBQUVGLGtCQUFrQixNQUFjLEVBQUUsT0FBMkI7SUFDM0QsRUFBRSxDQUFDLENBQUMscUJBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxPQUFPLENBQUMsSUFBSSxLQUFLLG1CQUFZLENBQUMsQ0FBQyxDQUFDO1FBQ3pELE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxFQUFDLEtBQUssRUFBRSxPQUFPLEVBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQztJQUMvQyxDQUFDO0lBQ0QsMERBQTBEO0lBQzFELE1BQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLGNBQWMsR0FBRyxDQUFDLEVBQUMsQ0FBQztBQUNsRCxDQUFDO0FBRUQsZUFBZSxPQUFnQixFQUFFLFFBQTBCLEVBQUUsTUFBYztJQUN6RSxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxJQUFJLHNCQUFhLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN2RSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN4QixNQUFNLENBQUMsMEJBQWUsQ0FBQyxRQUFRLEVBQUUsV0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzNELENBQUM7SUFDRCwrREFBK0Q7SUFDL0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtYfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7Q29uZmlnfSBmcm9tICcuLi8uLi9jb25maWcnO1xuaW1wb3J0IHtjaGFubmVsSGFzRmllbGQsIEVuY29kaW5nfSBmcm9tICcuLi8uLi9lbmNvZGluZyc7XG5pbXBvcnQge0NoYW5uZWxEZWYsIGlzRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7TWFya0RlZn0gZnJvbSAnLi4vLi4vbWFyayc7XG5pbXBvcnQge1FVQU5USVRBVElWRX0gZnJvbSAnLi4vLi4vdHlwZSc7XG5pbXBvcnQge1ZnVmFsdWVSZWZ9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7Z2V0TWFya0NvbmZpZ30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7TWFya0NvbXBpbGVyfSBmcm9tICcuL2Jhc2UnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcbmltcG9ydCAqIGFzIHJlZiBmcm9tICcuL3ZhbHVlcmVmJztcblxuXG5leHBvcnQgY29uc3QgdGV4dDogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICd0ZXh0JyxcblxuICBlbmNvZGVFbnRyeTogKG1vZGVsOiBVbml0TW9kZWwpID0+IHtcbiAgICBjb25zdCB7Y29uZmlnLCBlbmNvZGluZywgaGVpZ2h0fSA9IG1vZGVsO1xuICAgIGNvbnN0IHRleHREZWYgPSBlbmNvZGluZy50ZXh0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLm1peGlucy5tYXJrRGVmUHJvcGVydGllcyhtb2RlbC5tYXJrRGVmLCB0cnVlKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIHhEZWZhdWx0KGNvbmZpZywgdGV4dERlZikpLFxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3knLCBtb2RlbCwgcmVmLm1pZChoZWlnaHQpKSxcbiAgICAgIC4uLm1peGlucy50ZXh0KG1vZGVsKSxcbiAgICAgIC4uLm1peGlucy5jb2xvcihtb2RlbCksXG4gICAgICAuLi5taXhpbnMudGV4dChtb2RlbCwgJ3Rvb2x0aXAnKSxcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignb3BhY2l0eScsIG1vZGVsKSxcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7XG4gICAgICAgIHZnQ2hhbm5lbDogJ2ZvbnRTaXplJyAgLy8gVkwncyB0ZXh0IHNpemUgaXMgZm9udFNpemVcbiAgICAgIH0pLFxuICAgICAgLi4ubWl4aW5zLnZhbHVlSWZEZWZpbmVkKCdhbGlnbicsIGFsaWduKG1vZGVsLm1hcmtEZWYsIGVuY29kaW5nLCBjb25maWcpKVxuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHhEZWZhdWx0KGNvbmZpZzogQ29uZmlnLCB0ZXh0RGVmOiBDaGFubmVsRGVmPHN0cmluZz4pOiBWZ1ZhbHVlUmVmIHtcbiAgaWYgKGlzRmllbGREZWYodGV4dERlZikgJiYgdGV4dERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICByZXR1cm4ge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9LCBvZmZzZXQ6IC01fTtcbiAgfVxuICAvLyBUT0RPOiBhbGxvdyB0aGlzIHRvIGZpdCAoQmUgY29uc2lzdGVudCB3aXRoIHJlZi5taWRYKCkpXG4gIHJldHVybiB7dmFsdWU6IGNvbmZpZy5zY2FsZS50ZXh0WFJhbmdlU3RlcCAvIDJ9O1xufVxuXG5mdW5jdGlvbiBhbGlnbihtYXJrRGVmOiBNYXJrRGVmLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgYWxpZ24gPSBtYXJrRGVmLmFsaWduIHx8IGdldE1hcmtDb25maWcoJ2FsaWduJywgbWFya0RlZiwgY29uZmlnKTtcbiAgaWYgKGFsaWduID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY2hhbm5lbEhhc0ZpZWxkKGVuY29kaW5nLCBYKSA/ICdjZW50ZXInIDogJ3JpZ2h0JztcbiAgfVxuICAvLyBJZiB0aGVyZSBpcyBhIGNvbmZpZywgVmVnYS1wYXJzZXIgd2lsbCBwcm9jZXNzIHRoaXMgYWxyZWFkeS5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cbiJdfQ==