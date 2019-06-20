"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
var GeoJSONNode = /** @class */ (function (_super) {
    tslib_1.__extends(GeoJSONNode, _super);
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
        return tslib_1.__assign({ type: 'geojson' }, (this.fields ? { fields: this.fields } : {}), (this.geojson ? { geojson: this.geojson } : {}), { signal: this.signal });
    };
    return GeoJSONNode;
}(dataflow_1.DataFlowNode));
exports.GeoJSONNode = GeoJSONNode;
//# sourceMappingURL=geojson.js.map