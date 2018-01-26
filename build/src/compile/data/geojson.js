"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var GeoJSONNode = /** @class */ (function (_super) {
    __extends(GeoJSONNode, _super);
    function GeoJSONNode(fields, geojson, signal) {
        var _this = _super.call(this) || this;
        _this.fields = fields;
        _this.geojson = geojson;
        _this.signal = signal;
        return _this;
    }
    GeoJSONNode.prototype.clone = function () {
        return new GeoJSONNode(util_1.duplicate(this.fields), this.geojson, this.signal);
    };
    GeoJSONNode.makeAll = function (model) {
        var nodes = [];
        for (var _i = 0, _a = [[channel_1.X, channel_1.Y], [channel_1.X2, channel_1.Y2]]; _i < _a.length; _i++) {
            var coordinates = _a[_i];
            var pair = {};
            for (var _b = 0, coordinates_1 = coordinates; _b < coordinates_1.length; _b++) {
                var channel = coordinates_1[_b];
                if (model.channelHasField(channel)) {
                    var fieldDef = model.fieldDef(channel);
                    if (util_1.contains([type_1.LATITUDE, type_1.LONGITUDE], fieldDef.type)) {
                        pair[fieldDef.type] = fieldDef.field;
                    }
                }
            }
            if (type_1.LONGITUDE in pair || type_1.LATITUDE in pair) {
                nodes.push(new GeoJSONNode([pair[type_1.LONGITUDE], pair[type_1.LATITUDE]], null, model.getName("geojson_" + nodes.length)));
            }
        }
        if (model.channelHasField(channel_1.SHAPE)) {
            var fieldDef = model.fieldDef(channel_1.SHAPE);
            if (fieldDef.type === type_1.GEOJSON) {
                nodes.push(new GeoJSONNode(null, fieldDef.field, model.getName("geojson_" + nodes.length)));
            }
        }
        return nodes;
    };
    GeoJSONNode.prototype.assemble = function () {
        return __assign({ type: 'geojson' }, (this.fields ? { fields: this.fields } : {}), (this.geojson ? { geojson: this.geojson } : {}), { signal: this.signal });
    };
    return GeoJSONNode;
}(dataflow_1.DataFlowNode));
exports.GeoJSONNode = GeoJSONNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvanNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZ2VvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFrRDtBQUNsRCxtQ0FBd0Q7QUFDeEQsbUNBQXFEO0FBR3JELHVDQUF3QztBQUV4QztJQUFpQywrQkFBWTtJQWtDM0MscUJBQW9CLE1BQWlCLEVBQVUsT0FBZ0IsRUFBVSxNQUFlO1FBQXhGLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixZQUFNLEdBQU4sTUFBTSxDQUFXO1FBQVUsYUFBTyxHQUFQLE9BQU8sQ0FBUztRQUFVLFlBQU0sR0FBTixNQUFNLENBQVM7O0lBRXhGLENBQUM7SUFuQ00sMkJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBRWEsbUJBQU8sR0FBckIsVUFBc0IsS0FBcUI7UUFDekMsSUFBTSxLQUFLLEdBQWtCLEVBQUUsQ0FBQztRQUVoQyxHQUFHLENBQUMsQ0FBc0IsVUFBa0IsRUFBbEIsTUFBQyxDQUFDLFdBQUMsRUFBRSxXQUFDLENBQUMsRUFBRSxDQUFDLFlBQUUsRUFBRSxZQUFFLENBQUMsQ0FBQyxFQUFsQixjQUFrQixFQUFsQixJQUFrQjtZQUF2QyxJQUFNLFdBQVcsU0FBQTtZQUNwQixJQUFNLElBQUksR0FBaUIsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxDQUFrQixVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVc7Z0JBQTVCLElBQU0sT0FBTyxvQkFBQTtnQkFDaEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLGVBQVEsRUFBRSxnQkFBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO29CQUN2QyxDQUFDO2dCQUNILENBQUM7YUFDRjtZQUVELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLElBQUksSUFBSSxJQUFJLGVBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLENBQUMsSUFBSSxDQUFDLGdCQUFTLENBQUMsRUFBRSxJQUFJLENBQUMsZUFBUSxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFXLEtBQUssQ0FBQyxNQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakgsQ0FBQztTQUNGO1FBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxlQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFXLEtBQUssQ0FBQyxNQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUYsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQU1NLDhCQUFRLEdBQWY7UUFDRSxNQUFNLFlBQ0osSUFBSSxFQUFFLFNBQVMsSUFDWixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDaEQsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQ25CO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQTlDRCxDQUFpQyx1QkFBWSxHQThDNUM7QUE5Q1ksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NIQVBFLCBYLCBYMiwgWSwgWTJ9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtHRU9KU09OLCBMQVRJVFVERSwgTE9OR0lUVURFfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIERpY3QsIGR1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnR2VvSlNPTlRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtNb2RlbFdpdGhGaWVsZH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5leHBvcnQgY2xhc3MgR2VvSlNPTk5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBHZW9KU09OTm9kZShkdXBsaWNhdGUodGhpcy5maWVsZHMpLCB0aGlzLmdlb2pzb24sIHRoaXMuc2lnbmFsKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUFsbChtb2RlbDogTW9kZWxXaXRoRmllbGQpOiBHZW9KU09OTm9kZVtdIHtcbiAgICBjb25zdCBub2RlczogR2VvSlNPTk5vZGVbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBjb29yZGluYXRlcyBvZiBbW1gsIFldLCBbWDIsIFkyXV0pIHtcbiAgICAgIGNvbnN0IHBhaXI6IERpY3Q8c3RyaW5nPiA9IHt9O1xuICAgICAgZm9yIChjb25zdCBjaGFubmVsIG9mIGNvb3JkaW5hdGVzKSB7XG4gICAgICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkpIHtcbiAgICAgICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICAgICAgICAgIGlmIChjb250YWlucyhbTEFUSVRVREUsIExPTkdJVFVERV0sIGZpZWxkRGVmLnR5cGUpKSB7XG4gICAgICAgICAgICBwYWlyW2ZpZWxkRGVmLnR5cGVdID0gZmllbGREZWYuZmllbGQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChMT05HSVRVREUgaW4gcGFpciB8fCBMQVRJVFVERSBpbiBwYWlyKSB7XG4gICAgICAgIG5vZGVzLnB1c2gobmV3IEdlb0pTT05Ob2RlKFtwYWlyW0xPTkdJVFVERV0sIHBhaXJbTEFUSVRVREVdXSwgbnVsbCwgbW9kZWwuZ2V0TmFtZShgZ2VvanNvbl8ke25vZGVzLmxlbmd0aH1gKSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoU0hBUEUpKSB7XG4gICAgICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKFNIQVBFKTtcbiAgICAgIGlmIChmaWVsZERlZi50eXBlID09PSBHRU9KU09OKSB7XG4gICAgICAgIG5vZGVzLnB1c2gobmV3IEdlb0pTT05Ob2RlKG51bGwsIGZpZWxkRGVmLmZpZWxkLCBtb2RlbC5nZXROYW1lKGBnZW9qc29uXyR7bm9kZXMubGVuZ3RofWApKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBmaWVsZHM/OiBzdHJpbmdbXSwgcHJpdmF0ZSBnZW9qc29uPzogc3RyaW5nLCBwcml2YXRlIHNpZ25hbD86IHN0cmluZykge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdHZW9KU09OVHJhbnNmb3JtIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dlb2pzb24nLFxuICAgICAgLi4uKHRoaXMuZmllbGRzID8ge2ZpZWxkczogdGhpcy5maWVsZHN9IDoge30pLFxuICAgICAgLi4uKHRoaXMuZ2VvanNvbiA/IHtnZW9qc29uOiB0aGlzLmdlb2pzb259IDoge30pLFxuICAgICAgc2lnbmFsOiB0aGlzLnNpZ25hbFxuICAgIH07XG4gIH1cbn1cbiJdfQ==