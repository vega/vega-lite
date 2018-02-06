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
var fielddef_1 = require("../../fielddef");
var type_1 = require("../../type");
exports.geoshape = {
    vgMark: 'shape',
    encodeEntry: function (model) {
        return __assign({}, mixins.baseEncodeEntry(model, true));
    },
    postEncodingTransform: function (model) {
        var encoding = model.encoding;
        var shapeDef = encoding.shape;
        var transform = __assign({ type: 'geoshape', projection: model.projectionName() }, (shapeDef && fielddef_1.isFieldDef(shapeDef) && shapeDef.type === type_1.GEOJSON ? { field: fielddef_1.vgField(shapeDef, { expr: 'datum' }) } : {}));
        return [transform];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2Vvc2hhcGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9tYXJrL2dlb3NoYXBlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFDQSxpQ0FBbUM7QUFFbkMsMkNBQW1EO0FBQ25ELG1DQUFtQztBQUl0QixRQUFBLFFBQVEsR0FBaUI7SUFDcEMsTUFBTSxFQUFFLE9BQU87SUFDZixXQUFXLEVBQUUsVUFBQyxLQUFnQjtRQUM1QixNQUFNLGNBQ0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEVBQ3RDO0lBQ0osQ0FBQztJQUNELHFCQUFxQixFQUFFLFVBQUMsS0FBZ0I7UUFDL0IsSUFBQSx5QkFBUSxDQUFVO1FBQ3pCLElBQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7UUFFaEMsSUFBTSxTQUFTLGNBQ2IsSUFBSSxFQUFFLFVBQVUsRUFDaEIsVUFBVSxFQUFFLEtBQUssQ0FBQyxjQUFjLEVBQUUsSUFFL0IsQ0FBQyxRQUFRLElBQUkscUJBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxLQUFLLEVBQUUsa0JBQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FDdEgsQ0FBQztRQUNGLE1BQU0sQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0ICogYXMgbWl4aW5zIGZyb20gJy4vbWl4aW5zJztcblxuaW1wb3J0IHtpc0ZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge0dFT0pTT059IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtWZ0dlb1NoYXBlVHJhbnNmb3JtLCBWZ1Bvc3RFbmNvZGluZ1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNYXJrQ29tcGlsZXJ9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBjb25zdCBnZW9zaGFwZTogTWFya0NvbXBpbGVyID0ge1xuICB2Z01hcms6ICdzaGFwZScsXG4gIGVuY29kZUVudHJ5OiAobW9kZWw6IFVuaXRNb2RlbCkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICAuLi5taXhpbnMuYmFzZUVuY29kZUVudHJ5KG1vZGVsLCB0cnVlKVxuICAgIH07XG4gIH0sXG4gIHBvc3RFbmNvZGluZ1RyYW5zZm9ybTogKG1vZGVsOiBVbml0TW9kZWwpOiBWZ1Bvc3RFbmNvZGluZ1RyYW5zZm9ybVtdID0+IHtcbiAgICBjb25zdCB7ZW5jb2Rpbmd9ID0gbW9kZWw7XG4gICAgY29uc3Qgc2hhcGVEZWYgPSBlbmNvZGluZy5zaGFwZTtcblxuICAgIGNvbnN0IHRyYW5zZm9ybTogVmdHZW9TaGFwZVRyYW5zZm9ybSA9IHtcbiAgICAgIHR5cGU6ICdnZW9zaGFwZScsXG4gICAgICBwcm9qZWN0aW9uOiBtb2RlbC5wcm9qZWN0aW9uTmFtZSgpLFxuICAgICAgLy8gYXM6ICdzaGFwZScsXG4gICAgICAuLi4oc2hhcGVEZWYgJiYgaXNGaWVsZERlZihzaGFwZURlZikgJiYgc2hhcGVEZWYudHlwZSA9PT0gR0VPSlNPTiA/IHtmaWVsZDogdmdGaWVsZChzaGFwZURlZiwge2V4cHI6ICdkYXR1bSd9KX0gOiB7fSlcbiAgICB9O1xuICAgIHJldHVybiBbdHJhbnNmb3JtXTtcbiAgfVxufTtcbiJdfQ==