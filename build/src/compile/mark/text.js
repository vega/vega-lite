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
        var config = model.config, encoding = model.encoding, height = model.height, markDef = model.markDef;
        var textDef = encoding.text;
        return __assign({}, mixins.baseEncodeEntry(model, { size: 'ignore', orient: 'ignore' }), mixins.pointPosition('x', model, xDefault(config, textDef)), mixins.pointPosition('y', model, ref.mid(height)), mixins.text(model), mixins.nonPosition('size', model, __assign({}, (markDef.size ? { defaultValue: markDef.size } : {}), { vgChannel: 'fontSize' // VL's text size is fontSize
         })), mixins.valueIfDefined('align', align(model.markDef, encoding, config)));
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
        return encoding_1.channelHasField(encoding, channel_1.X) || encoding_1.channelHasField(encoding, channel_1.LONGITUDE) ? 'center' : 'right';
    }
    // If there is a config, Vega-parser will process this already.
    return undefined;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL21hcmsvdGV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEseUNBQTJDO0FBRTNDLDJDQUF5RDtBQUN6RCwyQ0FBc0Q7QUFFdEQsbUNBQXdDO0FBRXhDLG9DQUF3QztBQUd4QyxpQ0FBbUM7QUFDbkMsZ0NBQWtDO0FBR3JCLFFBQUEsSUFBSSxHQUFpQjtJQUNoQyxNQUFNLEVBQUUsTUFBTTtJQUVkLFdBQVcsRUFBRSxVQUFDLEtBQWdCO1FBQ3JCLElBQUEscUJBQU0sRUFBRSx5QkFBUSxFQUFFLHFCQUFNLEVBQUUsdUJBQU8sQ0FBVTtRQUNsRCxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBRTlCLE1BQU0sY0FDRCxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxFQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBQyxDQUFDLEVBQ2pFLE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQzNELE1BQU0sQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ2pELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQ2xCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLEtBQUssZUFDOUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUNyRCxTQUFTLEVBQUUsVUFBVSxDQUFFLDZCQUE2QjtZQUNwRCxFQUNDLE1BQU0sQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUN6RTtJQUNKLENBQUM7Q0FDRixDQUFDO0FBRUYsa0JBQWtCLE1BQWMsRUFBRSxPQUEyQjtJQUMzRCxFQUFFLENBQUMsQ0FBQyxxQkFBVSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssbUJBQVksQ0FBQyxDQUFDLENBQUM7UUFDekQsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLEVBQUMsS0FBSyxFQUFFLE9BQU8sRUFBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBQyxDQUFDO0lBQy9DLENBQUM7SUFDRCwwREFBMEQ7SUFDMUQsTUFBTSxDQUFDLEVBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxHQUFHLENBQUMsRUFBQyxDQUFDO0FBQ2xELENBQUM7QUFFRCxlQUFlLE9BQWdCLEVBQUUsUUFBMEIsRUFBRSxNQUFjO0lBQ3pFLElBQU0sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksc0JBQWEsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3BCLE1BQU0sQ0FBQywwQkFBZSxDQUFDLFFBQVEsRUFBRSxXQUFDLENBQUMsSUFBSSwwQkFBZSxDQUFDLFFBQVEsRUFBRSxtQkFBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQ25HLENBQUM7SUFDRCwrREFBK0Q7SUFDL0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtMT05HSVRVREUsIFh9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtDb25maWd9IGZyb20gJy4uLy4uL2NvbmZpZyc7XG5pbXBvcnQge2NoYW5uZWxIYXNGaWVsZCwgRW5jb2Rpbmd9IGZyb20gJy4uLy4uL2VuY29kaW5nJztcbmltcG9ydCB7Q2hhbm5lbERlZiwgaXNGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtNYXJrRGVmfSBmcm9tICcuLi8uLi9tYXJrJztcbmltcG9ydCB7UVVBTlRJVEFUSVZFfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7VmdWYWx1ZVJlZn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtnZXRNYXJrQ29uZmlnfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5pbXBvcnQgKiBhcyBtaXhpbnMgZnJvbSAnLi9taXhpbnMnO1xuaW1wb3J0ICogYXMgcmVmIGZyb20gJy4vdmFsdWVyZWYnO1xuXG5cbmV4cG9ydCBjb25zdCB0ZXh0OiBNYXJrQ29tcGlsZXIgPSB7XG4gIHZnTWFyazogJ3RleHQnLFxuXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIGNvbnN0IHtjb25maWcsIGVuY29kaW5nLCBoZWlnaHQsIG1hcmtEZWZ9ID0gbW9kZWw7XG4gICAgY29uc3QgdGV4dERlZiA9IGVuY29kaW5nLnRleHQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgLi4ubWl4aW5zLmJhc2VFbmNvZGVFbnRyeShtb2RlbCwge3NpemU6ICdpZ25vcmUnLCBvcmllbnQ6ICdpZ25vcmUnfSksXG4gICAgICAuLi5taXhpbnMucG9pbnRQb3NpdGlvbigneCcsIG1vZGVsLCB4RGVmYXVsdChjb25maWcsIHRleHREZWYpKSxcbiAgICAgIC4uLm1peGlucy5wb2ludFBvc2l0aW9uKCd5JywgbW9kZWwsIHJlZi5taWQoaGVpZ2h0KSksXG4gICAgICAuLi5taXhpbnMudGV4dChtb2RlbCksXG4gICAgICAuLi5taXhpbnMubm9uUG9zaXRpb24oJ3NpemUnLCBtb2RlbCwge1xuICAgICAgICAuLi4obWFya0RlZi5zaXplID8ge2RlZmF1bHRWYWx1ZTogbWFya0RlZi5zaXplfSA6IHt9KSxcbiAgICAgICAgdmdDaGFubmVsOiAnZm9udFNpemUnICAvLyBWTCdzIHRleHQgc2l6ZSBpcyBmb250U2l6ZVxuICAgICAgfSksXG4gICAgICAuLi5taXhpbnMudmFsdWVJZkRlZmluZWQoJ2FsaWduJywgYWxpZ24obW9kZWwubWFya0RlZiwgZW5jb2RpbmcsIGNvbmZpZykpXG4gICAgfTtcbiAgfVxufTtcblxuZnVuY3Rpb24geERlZmF1bHQoY29uZmlnOiBDb25maWcsIHRleHREZWY6IENoYW5uZWxEZWY8c3RyaW5nPik6IFZnVmFsdWVSZWYge1xuICBpZiAoaXNGaWVsZERlZih0ZXh0RGVmKSAmJiB0ZXh0RGVmLnR5cGUgPT09IFFVQU5USVRBVElWRSkge1xuICAgIHJldHVybiB7ZmllbGQ6IHtncm91cDogJ3dpZHRoJ30sIG9mZnNldDogLTV9O1xuICB9XG4gIC8vIFRPRE86IGFsbG93IHRoaXMgdG8gZml0IChCZSBjb25zaXN0ZW50IHdpdGggcmVmLm1pZFgoKSlcbiAgcmV0dXJuIHt2YWx1ZTogY29uZmlnLnNjYWxlLnRleHRYUmFuZ2VTdGVwIC8gMn07XG59XG5cbmZ1bmN0aW9uIGFsaWduKG1hcmtEZWY6IE1hcmtEZWYsIGVuY29kaW5nOiBFbmNvZGluZzxzdHJpbmc+LCBjb25maWc6IENvbmZpZykge1xuICBjb25zdCBhID0gbWFya0RlZi5hbGlnbiB8fCBnZXRNYXJrQ29uZmlnKCdhbGlnbicsIG1hcmtEZWYsIGNvbmZpZyk7XG4gIGlmIChhID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gY2hhbm5lbEhhc0ZpZWxkKGVuY29kaW5nLCBYKSB8fCBjaGFubmVsSGFzRmllbGQoZW5jb2RpbmcsIExPTkdJVFVERSkgPyAnY2VudGVyJyA6ICdyaWdodCc7XG4gIH1cbiAgLy8gSWYgdGhlcmUgaXMgYSBjb25maWcsIFZlZ2EtcGFyc2VyIHdpbGwgcHJvY2VzcyB0aGlzIGFscmVhZHkuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG4iXX0=