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
Object.defineProperty(exports, "__esModule", { value: true });
var channel_1 = require("../../channel");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var GeoPointNode = /** @class */ (function (_super) {
    __extends(GeoPointNode, _super);
    function GeoPointNode(projection, fields, as) {
        var _this = _super.call(this) || this;
        _this.projection = projection;
        _this.fields = fields;
        _this.as = as;
        return _this;
    }
    GeoPointNode.prototype.clone = function () {
        return new GeoPointNode(this.projection, util_1.duplicate(this.fields), util_1.duplicate(this.as));
    };
    GeoPointNode.makeAll = function (model) {
        var nodes = [];
        if (!model.projectionName()) {
            return nodes;
        }
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
                nodes.push(new GeoPointNode(model.projectionName(), [pair[type_1.LONGITUDE], pair[type_1.LATITUDE]], [pair[type_1.LONGITUDE] + '_geo', pair[type_1.LATITUDE] + '_geo']));
            }
        }
        return nodes;
    };
    GeoPointNode.prototype.assemble = function () {
        return {
            type: 'geopoint',
            projection: this.projection,
            fields: this.fields,
            as: this.as
        };
    };
    return GeoPointNode;
}(dataflow_1.DataFlowNode));
exports.GeoPointNode = GeoPointNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2dlb3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUEyQztBQUMzQyxtQ0FBK0M7QUFDL0MsbUNBQXFEO0FBR3JELHVDQUF3QztBQUd4QztJQUFrQyxnQ0FBWTtJQUs1QyxzQkFBb0IsVUFBa0IsRUFBVSxNQUFnQixFQUFVLEVBQVk7UUFBdEYsWUFDRSxpQkFBTyxTQUNSO1FBRm1CLGdCQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBVTtRQUFVLFFBQUUsR0FBRixFQUFFLENBQVU7O0lBRXRGLENBQUM7SUFOTSw0QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksWUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsZ0JBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBTWEsb0JBQU8sR0FBckIsVUFBc0IsS0FBcUI7UUFDekMsSUFBTSxLQUFLLEdBQW1CLEVBQUUsQ0FBQztRQUVqQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxHQUFHLENBQUMsQ0FBc0IsVUFBa0IsRUFBbEIsTUFBQyxDQUFDLFdBQUMsRUFBRSxXQUFDLENBQUMsRUFBRSxDQUFDLFlBQUUsRUFBRSxZQUFFLENBQUMsQ0FBQyxFQUFsQixjQUFrQixFQUFsQixJQUFrQjtZQUF2QyxJQUFNLFdBQVcsU0FBQTtZQUNwQixJQUFNLElBQUksR0FBaUIsRUFBRSxDQUFDO1lBQzlCLEdBQUcsQ0FBQyxDQUFrQixVQUFXLEVBQVgsMkJBQVcsRUFBWCx5QkFBVyxFQUFYLElBQVc7Z0JBQTVCLElBQU0sT0FBTyxvQkFBQTtnQkFDaEIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ25DLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3pDLEVBQUUsQ0FBQyxDQUFDLGVBQVEsQ0FBQyxDQUFDLGVBQVEsRUFBRSxnQkFBUyxDQUFDLEVBQUUsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt3QkFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO29CQUN2QyxDQUFDO2dCQUNILENBQUM7YUFDRjtZQUVELEVBQUUsQ0FBQyxDQUFDLGdCQUFTLElBQUksSUFBSSxJQUFJLGVBQVEsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxnQkFBUyxDQUFDLEVBQUUsSUFBSSxDQUFDLGVBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsZ0JBQVMsQ0FBQyxHQUFHLE1BQU0sRUFBRSxJQUFJLENBQUMsZUFBUSxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9JLENBQUM7U0FDRjtRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxVQUFVO1lBQ2hCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ1osQ0FBQztJQUNKLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUEzQ0QsQ0FBa0MsdUJBQVksR0EyQzdDO0FBM0NZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtYLCBYMiwgWSwgWTJ9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtMQVRJVFVERSwgTE9OR0lUVURFfSBmcm9tICcuLi8uLi90eXBlJztcbmltcG9ydCB7Y29udGFpbnMsIERpY3QsIGR1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnR2VvUG9pbnRUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7TW9kZWxXaXRoRmllbGR9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5leHBvcnQgY2xhc3MgR2VvUG9pbnROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgR2VvUG9pbnROb2RlKHRoaXMucHJvamVjdGlvbiwgZHVwbGljYXRlKHRoaXMuZmllbGRzKSwgZHVwbGljYXRlKHRoaXMuYXMpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJvamVjdGlvbjogc3RyaW5nLCBwcml2YXRlIGZpZWxkczogc3RyaW5nW10sIHByaXZhdGUgYXM6IHN0cmluZ1tdKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUFsbChtb2RlbDogTW9kZWxXaXRoRmllbGQpOiBHZW9Qb2ludE5vZGVbXSB7XG4gICAgY29uc3Qgbm9kZXM6IEdlb1BvaW50Tm9kZVtdID0gW107XG5cbiAgICBpZiAoIW1vZGVsLnByb2plY3Rpb25OYW1lKCkpIHtcbiAgICAgIHJldHVybiBub2RlcztcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGNvb3JkaW5hdGVzIG9mIFtbWCwgWV0sIFtYMiwgWTJdXSkge1xuICAgICAgY29uc3QgcGFpcjogRGljdDxzdHJpbmc+ID0ge307XG4gICAgICBmb3IgKGNvbnN0IGNoYW5uZWwgb2YgY29vcmRpbmF0ZXMpIHtcbiAgICAgICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZChjaGFubmVsKSkge1xuICAgICAgICAgIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gICAgICAgICAgaWYgKGNvbnRhaW5zKFtMQVRJVFVERSwgTE9OR0lUVURFXSwgZmllbGREZWYudHlwZSkpIHtcbiAgICAgICAgICAgIHBhaXJbZmllbGREZWYudHlwZV0gPSBmaWVsZERlZi5maWVsZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKExPTkdJVFVERSBpbiBwYWlyIHx8IExBVElUVURFIGluIHBhaXIpIHtcbiAgICAgICAgbm9kZXMucHVzaChuZXcgR2VvUG9pbnROb2RlKG1vZGVsLnByb2plY3Rpb25OYW1lKCksIFtwYWlyW0xPTkdJVFVERV0sIHBhaXJbTEFUSVRVREVdXSwgW3BhaXJbTE9OR0lUVURFXSArICdfZ2VvJywgcGFpcltMQVRJVFVERV0gKyAnX2dlbyddKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG5vZGVzO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnR2VvUG9pbnRUcmFuc2Zvcm0ge1xuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiAnZ2VvcG9pbnQnLFxuICAgICAgcHJvamVjdGlvbjogdGhpcy5wcm9qZWN0aW9uLFxuICAgICAgZmllbGRzOiB0aGlzLmZpZWxkcyxcbiAgICAgIGFzOiB0aGlzLmFzXG4gICAgfTtcbiAgfVxufVxuIl19