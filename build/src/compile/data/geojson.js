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
    function GeoJSONNode(parent, fields, geojson, signal) {
        var _this = _super.call(this, parent) || this;
        _this.fields = fields;
        _this.geojson = geojson;
        _this.signal = signal;
        return _this;
    }
    GeoJSONNode.prototype.clone = function () {
        return new GeoJSONNode(null, util_1.duplicate(this.fields), this.geojson, this.signal);
    };
    GeoJSONNode.parseAll = function (parent, model) {
        var geoJsonCounter = 0;
        [[channel_1.LONGITUDE, channel_1.LATITUDE], [channel_1.LONGITUDE2, channel_1.LATITUDE2]].forEach(function (coordinates) {
            var pair = coordinates.map(function (channel) { return model.channelHasField(channel) ? model.fieldDef(channel).field : undefined; });
            if (pair[0] || pair[1]) {
                parent = new GeoJSONNode(parent, pair, null, model.getName("geojson_" + geoJsonCounter++));
            }
        });
        if (model.channelHasField(channel_1.SHAPE)) {
            var fieldDef = model.fieldDef(channel_1.SHAPE);
            if (fieldDef.type === type_1.GEOJSON) {
                parent = new GeoJSONNode(parent, null, fieldDef.field, model.getName("geojson_" + geoJsonCounter++));
            }
        }
        return parent;
    };
    GeoJSONNode.prototype.assemble = function () {
        return __assign({ type: 'geojson' }, (this.fields ? { fields: this.fields } : {}), (this.geojson ? { geojson: this.geojson } : {}), { signal: this.signal });
    };
    return GeoJSONNode;
}(dataflow_1.DataFlowNode));
exports.GeoJSONNode = GeoJSONNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VvanNvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvZ2VvanNvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHlDQUFvRztBQUNwRyxtQ0FBbUM7QUFDbkMsbUNBQXFDO0FBR3JDLHVDQUF3QztBQUV4QztJQUFpQywrQkFBWTtJQTRCM0MscUJBQVksTUFBb0IsRUFBVSxNQUFpQixFQUFVLE9BQWdCLEVBQVUsTUFBZTtRQUE5RyxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxTQUNkO1FBRnlDLFlBQU0sR0FBTixNQUFNLENBQVc7UUFBVSxhQUFPLEdBQVAsT0FBTyxDQUFTO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBUzs7SUFFOUcsQ0FBQztJQTdCTSwyQkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksV0FBVyxDQUFDLElBQUksRUFBRSxnQkFBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBRWEsb0JBQVEsR0FBdEIsVUFBdUIsTUFBb0IsRUFBRSxLQUFnQjtRQUMzRCxJQUFJLGNBQWMsR0FBRyxDQUFDLENBQUM7UUFFdkIsQ0FBQyxDQUFDLG1CQUFTLEVBQUUsa0JBQVEsQ0FBQyxFQUFFLENBQUMsb0JBQVUsRUFBRSxtQkFBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxXQUFpQztZQUN6RixJQUFNLElBQUksR0FBRyxXQUFXLENBQUMsR0FBRyxDQUMxQixVQUFBLE9BQU8sSUFBSSxPQUFBLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLEVBQTFFLENBQTBFLENBQ3RGLENBQUM7WUFFRixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkIsTUFBTSxHQUFHLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsYUFBVyxjQUFjLEVBQUksQ0FBQyxDQUFDLENBQUM7WUFDN0YsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxlQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxlQUFLLENBQUMsQ0FBQztZQUN2QyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGNBQU8sQ0FBQyxDQUFDLENBQUM7Z0JBQzlCLE1BQU0sR0FBRyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxhQUFXLGNBQWMsRUFBSSxDQUFDLENBQUMsQ0FBQztZQUN2RyxDQUFDO1FBQ0gsQ0FBQztRQUVELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQU1NLDhCQUFRLEdBQWY7UUFDRSxNQUFNLFlBQ0osSUFBSSxFQUFFLFNBQVMsSUFDWixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQzFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDaEQsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLElBQ25CO0lBQ0osQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQXhDRCxDQUFpQyx1QkFBWSxHQXdDNUM7QUF4Q1ksa0NBQVciLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0dlb1Bvc2l0aW9uQ2hhbm5lbCwgTEFUSVRVREUsIExBVElUVURFMiwgTE9OR0lUVURFLCBMT05HSVRVREUyLCBTSEFQRX0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0dFT0pTT059IGZyb20gJy4uLy4uL3R5cGUnO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0dlb0pTT05UcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZXhwb3J0IGNsYXNzIEdlb0pTT05Ob2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgR2VvSlNPTk5vZGUobnVsbCwgZHVwbGljYXRlKHRoaXMuZmllbGRzKSwgdGhpcy5nZW9qc29uLCB0aGlzLnNpZ25hbCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHBhcnNlQWxsKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKTogRGF0YUZsb3dOb2RlIHtcbiAgICBsZXQgZ2VvSnNvbkNvdW50ZXIgPSAwO1xuXG4gICAgW1tMT05HSVRVREUsIExBVElUVURFXSwgW0xPTkdJVFVERTIsIExBVElUVURFMl1dLmZvckVhY2goKGNvb3JkaW5hdGVzOiBHZW9Qb3NpdGlvbkNoYW5uZWxbXSkgPT4ge1xuICAgICAgY29uc3QgcGFpciA9IGNvb3JkaW5hdGVzLm1hcChcbiAgICAgICAgY2hhbm5lbCA9PiBtb2RlbC5jaGFubmVsSGFzRmllbGQoY2hhbm5lbCkgPyBtb2RlbC5maWVsZERlZihjaGFubmVsKS5maWVsZCA6IHVuZGVmaW5lZFxuICAgICAgKTtcblxuICAgICAgaWYgKHBhaXJbMF0gfHwgcGFpclsxXSkge1xuICAgICAgICBwYXJlbnQgPSBuZXcgR2VvSlNPTk5vZGUocGFyZW50LCBwYWlyLCBudWxsLCBtb2RlbC5nZXROYW1lKGBnZW9qc29uXyR7Z2VvSnNvbkNvdW50ZXIrK31gKSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKFNIQVBFKSkge1xuICAgICAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihTSEFQRSk7XG4gICAgICBpZiAoZmllbGREZWYudHlwZSA9PT0gR0VPSlNPTikge1xuICAgICAgICBwYXJlbnQgPSBuZXcgR2VvSlNPTk5vZGUocGFyZW50LCBudWxsLCBmaWVsZERlZi5maWVsZCwgbW9kZWwuZ2V0TmFtZShgZ2VvanNvbl8ke2dlb0pzb25Db3VudGVyKyt9YCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBwYXJlbnQ7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSBmaWVsZHM/OiBzdHJpbmdbXSwgcHJpdmF0ZSBnZW9qc29uPzogc3RyaW5nLCBwcml2YXRlIHNpZ25hbD86IHN0cmluZykge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdHZW9KU09OVHJhbnNmb3JtIHtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogJ2dlb2pzb24nLFxuICAgICAgLi4uKHRoaXMuZmllbGRzID8ge2ZpZWxkczogdGhpcy5maWVsZHN9IDoge30pLFxuICAgICAgLi4uKHRoaXMuZ2VvanNvbiA/IHtnZW9qc29uOiB0aGlzLmdlb2pzb259IDoge30pLFxuICAgICAgc2lnbmFsOiB0aGlzLnNpZ25hbFxuICAgIH07XG4gIH1cbn1cbiJdfQ==