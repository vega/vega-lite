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
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var GeoPointNode = /** @class */ (function (_super) {
    __extends(GeoPointNode, _super);
    function GeoPointNode(parent, projection, fields, as) {
        var _this = _super.call(this, parent) || this;
        _this.projection = projection;
        _this.fields = fields;
        _this.as = as;
        return _this;
    }
    GeoPointNode.prototype.clone = function () {
        return new GeoPointNode(null, this.projection, util_1.duplicate(this.fields), util_1.duplicate(this.as));
    };
    GeoPointNode.parseAll = function (parent, model) {
        if (!model.projectionName()) {
            return parent;
        }
        [[channel_1.LONGITUDE, channel_1.LATITUDE], [channel_1.LONGITUDE2, channel_1.LATITUDE2]].forEach(function (coordinates) {
            var pair = coordinates.map(function (channel) { return model.channelHasField(channel) ? model.fieldDef(channel).field : undefined; });
            var suffix = coordinates[0] === channel_1.LONGITUDE2 ? '2' : '';
            if (pair[0] || pair[1]) {
                parent = new GeoPointNode(parent, model.projectionName(), pair, [model.getName('x' + suffix), model.getName('y' + suffix)]);
            }
        });
        return parent;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvcG9pbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2dlb3BvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHlDQUE2RjtBQUM3RixtQ0FBcUM7QUFHckMsdUNBQXdDO0FBR3hDO0lBQWtDLGdDQUFZO0lBSzVDLHNCQUFZLE1BQW9CLEVBQVUsVUFBa0IsRUFBVSxNQUFnQixFQUFVLEVBQVk7UUFBNUcsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FDZDtRQUZ5QyxnQkFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFVLFlBQU0sR0FBTixNQUFNLENBQVU7UUFBVSxRQUFFLEdBQUYsRUFBRSxDQUFVOztJQUU1RyxDQUFDO0lBTk0sNEJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxnQkFBUyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFNYSxxQkFBUSxHQUF0QixVQUF1QixNQUFvQixFQUFFLEtBQWdCO1FBQzNELEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7UUFFRCxDQUFDLENBQUMsbUJBQVMsRUFBRSxrQkFBUSxDQUFDLEVBQUUsQ0FBQyxvQkFBVSxFQUFFLG1CQUFTLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFdBQWlDO1lBQ3pGLElBQU0sSUFBSSxHQUFHLFdBQVcsQ0FBQyxHQUFHLENBQzFCLFVBQUEsT0FBTyxJQUFJLE9BQUEsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLFNBQVMsRUFBMUUsQ0FBMEUsQ0FDdEYsQ0FBQztZQUVGLElBQU0sTUFBTSxHQUFHLFdBQVcsQ0FBQyxDQUFDLENBQUMsS0FBSyxvQkFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUV4RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxHQUFHLElBQUksWUFBWSxDQUN2QixNQUFNLEVBQ04sS0FBSyxDQUFDLGNBQWMsRUFBRSxFQUN0QixJQUFJLEVBQ0osQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUMzRCxDQUFDO1lBQ0osQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBRU0sK0JBQVEsR0FBZjtRQUNFLE1BQU0sQ0FBQztZQUNMLElBQUksRUFBRSxVQUFVO1lBQ2hCLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVTtZQUMzQixNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU07WUFDbkIsRUFBRSxFQUFFLElBQUksQ0FBQyxFQUFFO1NBQ1osQ0FBQztJQUNKLENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUExQ0QsQ0FBa0MsdUJBQVksR0EwQzdDO0FBMUNZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtHZW9Qb3NpdGlvbkNoYW5uZWwsIExBVElUVURFLCBMQVRJVFVERTIsIExPTkdJVFVERSwgTE9OR0lUVURFMn0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnR2VvUG9pbnRUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5leHBvcnQgY2xhc3MgR2VvUG9pbnROb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgR2VvUG9pbnROb2RlKG51bGwsIHRoaXMucHJvamVjdGlvbiwgZHVwbGljYXRlKHRoaXMuZmllbGRzKSwgZHVwbGljYXRlKHRoaXMuYXMpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIHByb2plY3Rpb246IHN0cmluZywgcHJpdmF0ZSBmaWVsZHM6IHN0cmluZ1tdLCBwcml2YXRlIGFzOiBzdHJpbmdbXSkge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHBhcnNlQWxsKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKTogRGF0YUZsb3dOb2RlIHtcbiAgICBpZiAoIW1vZGVsLnByb2plY3Rpb25OYW1lKCkpIHtcbiAgICAgIHJldHVybiBwYXJlbnQ7XG4gICAgfVxuXG4gICAgW1tMT05HSVRVREUsIExBVElUVURFXSwgW0xPTkdJVFVERTIsIExBVElUVURFMl1dLmZvckVhY2goKGNvb3JkaW5hdGVzOiBHZW9Qb3NpdGlvbkNoYW5uZWxbXSkgPT4ge1xuICAgICAgY29uc3QgcGFpciA9IGNvb3JkaW5hdGVzLm1hcChcbiAgICAgICAgY2hhbm5lbCA9PiBtb2RlbC5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkgPyBtb2RlbC5maWVsZERlZihjaGFubmVsKS5maWVsZCA6IHVuZGVmaW5lZFxuICAgICAgKTtcblxuICAgICAgY29uc3Qgc3VmZml4ID0gY29vcmRpbmF0ZXNbMF0gPT09IExPTkdJVFVERTIgPyAnMicgOiAnJztcblxuICAgICAgaWYgKHBhaXJbMF0gfHwgcGFpclsxXSkge1xuICAgICAgICBwYXJlbnQgPSBuZXcgR2VvUG9pbnROb2RlKFxuICAgICAgICAgIHBhcmVudCxcbiAgICAgICAgICBtb2RlbC5wcm9qZWN0aW9uTmFtZSgpLFxuICAgICAgICAgIHBhaXIsXG4gICAgICAgICAgW21vZGVsLmdldE5hbWUoJ3gnICsgc3VmZml4KSwgbW9kZWwuZ2V0TmFtZSgneScgKyBzdWZmaXgpXVxuICAgICAgICApO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHBhcmVudDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0dlb1BvaW50VHJhbnNmb3JtIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dlb3BvaW50JyxcbiAgICAgIHByb2plY3Rpb246IHRoaXMucHJvamVjdGlvbixcbiAgICAgIGZpZWxkczogdGhpcy5maWVsZHMsXG4gICAgICBhczogdGhpcy5hc1xuICAgIH07XG4gIH1cbn1cbiJdfQ==