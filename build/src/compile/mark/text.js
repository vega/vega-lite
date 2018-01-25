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
        return __assign({}, mixins.baseEncodeEntry(model, true), mixins.pointPosition('x', model, xDefault(config, textDef)), mixins.pointPosition('y', model, ref.mid(height)), mixins.text(model), mixins.nonPosition('size', model, {
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
    var a = markDef.align || common_1.getMarkConfig('align', markDef, config);
    if (a === undefined) {
        return encoding_1.channelHasField(encoding, channel_1.X) ? 'center' : 'right';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQWdDO0FBRWhDLDJDQUF5RDtBQUN6RCwyQ0FBc0Q7QUFFdEQsbUNBQXdDO0FBRXhDLG9DQUF3QztBQUd4QyxpQ0FBbUM7QUFDbkMsZ0NBQWtDO0FBR3JCLFFBQUEsSUFBSSxHQUFpQjtJQUNoQyxNQUFNLEVBQUUsTUFBTTtJQUVkLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQ3JCLElBQUEscUJBQU0sRUFBRSx5QkFBUSxFQUFFLHFCQUFNLENBQVU7UUFDekMsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQztRQUU5QixNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQ25DLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQzNELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2xCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtZQUNuQyxTQUFTLEVBQUUsVUFBVSxDQUFFLDZCQUE2QjtTQUNyRCxDQUFDLEVBQ0MsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQ3pFO0lBQ0osQ0FBQztDQUNGLENBQUM7QUFFRixrQkFBa0IsTUFBYyxFQUFFLE9BQTJCO0lBQzNELEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsT0FBTyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksS0FBSyxtQkFBWSxDQUFDLENBQUMsQ0FBQztRQUN6RCxNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsRUFBQyxLQUFLLEVBQUUsT0FBTyxFQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFDLENBQUM7SUFDL0MsQ0FBQztJQUNELDBEQUEwRDtJQUMxRCxNQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLEdBQUcsQ0FBQyxFQUFDLENBQUM7QUFDbEQsQ0FBQztBQUVELGVBQWUsT0FBZ0IsRUFBRSxRQUEwQixFQUFFLE1BQWM7SUFDekUsSUFBTSxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssSUFBSSxzQkFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDbkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLDBCQUFlLENBQUMsUUFBUSxFQUFFLFdBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUMzRCxDQUFDO0lBQ0QsK0RBQStEO0lBQy9ELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7WH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSAnLi4vLi4vY29uZmlnJztcbmltcG9ydCB7Y2hhbm5lbEhhc0ZpZWxkLCBFbmNvZGluZ30gZnJvbSAnLi4vLi4vZW5jb2RpbmcnO1xuaW1wb3J0IHtDaGFubmVsRGVmLCBpc0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge01hcmtEZWZ9IGZyb20gJy4uLy4uL21hcmsnO1xuaW1wb3J0IHtRVUFOVElUQVRJVkV9IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtWZ1ZhbHVlUmVmfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2dldE1hcmtDb25maWd9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge01hcmtDb21waWxlcn0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCAqIGFzIG1peGlucyBmcm9tICcuL21peGlucyc7XG5pbXBvcnQgKiBhcyByZWYgZnJvbSAnLi92YWx1ZXJlZic7XG5cblxuZXhwb3J0IGNvbnN0IHRleHQ6IE1hcmtDb21waWxlciA9IHtcbiAgdmdNYXJrOiAndGV4dCcsXG5cbiAgZW5jb2RlRW50cnk6IChtb2RlbDogVW5pdE1vZGVsKSA9PiB7XG4gICAgY29uc3Qge2NvbmZpZywgZW5jb2RpbmcsIGhlaWdodH0gPSBtb2RlbDtcbiAgICBjb25zdCB0ZXh0RGVmID0gZW5jb2RpbmcudGV4dDtcblxuICAgIHJldHVybiB7XG4gICAgICAuLi5taXhpbnMuYmFzZUVuY29kZUVudHJ5KG1vZGVsLCB0cnVlKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd4JywgbW9kZWwsIHhEZWZhdWx0KGNvbmZpZywgdGV4dERlZikpLFxuICAgICAgLi4ubWl4aW5zLnBvaW50UG9zaXRpb24oJ3knLCBtb2RlbCwgcmVmLm1pZChoZWlnaHQpKSxcbiAgICAgIC4uLm1peGlucy50ZXh0KG1vZGVsKSxcbiAgICAgIC4uLm1peGlucy5ub25Qb3NpdGlvbignc2l6ZScsIG1vZGVsLCB7XG4gICAgICAgIHZnQ2hhbm5lbDogJ2ZvbnRTaXplJyAgLy8gVkwncyB0ZXh0IHNpemUgaXMgZm9udFNpemVcbiAgICAgIH0pLFxuICAgICAgLi4ubWl4aW5zLnZhbHVlSWZEZWZpbmVkKCdhbGlnbicsIGFsaWduKG1vZGVsLm1hcmtEZWYsIGVuY29kaW5nLCBjb25maWcpKVxuICAgIH07XG4gIH1cbn07XG5cbmZ1bmN0aW9uIHhEZWZhdWx0KGNvbmZpZzogQ29uZmlnLCB0ZXh0RGVmOiBDaGFubmVsRGVmPHN0cmluZz4pOiBWZ1ZhbHVlUmVmIHtcbiAgaWYgKGlzRmllbGREZWYodGV4dERlZikgJiYgdGV4dERlZi50eXBlID09PSBRVUFOVElUQVRJVkUpIHtcbiAgICByZXR1cm4ge2ZpZWxkOiB7Z3JvdXA6ICd3aWR0aCd9LCBvZmZzZXQ6IC01fTtcbiAgfVxuICAvLyBUT0RPOiBhbGxvdyB0aGlzIHRvIGZpdCAoQmUgY29uc2lzdGVudCB3aXRoIHJlZi5taWRYKCkpXG4gIHJldHVybiB7dmFsdWU6IGNvbmZpZy5zY2FsZS50ZXh0WFJhbmdlU3RlcCAvIDJ9O1xufVxuXG5mdW5jdGlvbiBhbGlnbihtYXJrRGVmOiBNYXJrRGVmLCBlbmNvZGluZzogRW5jb2Rpbmc8c3RyaW5nPiwgY29uZmlnOiBDb25maWcpIHtcbiAgY29uc3QgYSA9IG1hcmtEZWYuYWxpZ24gfHwgZ2V0TWFya0NvbmZpZygnYWxpZ24nLCBtYXJrRGVmLCBjb25maWcpO1xuICBpZiAoYSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgcmV0dXJuIGNoYW5uZWxIYXNGaWVsZChlbmNvZGluZywgWCkgPyAnY2VudGVyJyA6ICdyaWdodCc7XG4gIH1cbiAgLy8gSWYgdGhlcmUgaXMgYSBjb25maWcsIFZlZ2EtcGFyc2VyIHdpbGwgcHJvY2VzcyB0aGlzIGFscmVhZHkuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=