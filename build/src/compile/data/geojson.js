import * as tslib_1 from "tslib";
import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2, SHAPE } from '../../channel';
import { GEOJSON } from '../../type';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
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
        return new GeoJSONNode(null, duplicate(this.fields), this.geojson, this.signal);
    };
    GeoJSONNode.parseAll = function (parent, model) {
        var geoJsonCounter = 0;
        [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach(function (coordinates) {
            var pair = coordinates.map(function (channel) { return (model.channelHasField(channel) ? model.fieldDef(channel).field : undefined); });
            if (pair[0] || pair[1]) {
                parent = new GeoJSONNode(parent, pair, null, model.getName("geojson_" + geoJsonCounter++));
            }
        });
        if (model.channelHasField(SHAPE)) {
            var fieldDef = model.fieldDef(SHAPE);
            if (fieldDef.type === GEOJSON) {
                parent = new GeoJSONNode(parent, null, fieldDef.field, model.getName("geojson_" + geoJsonCounter++));
            }
        }
        return parent;
    };
    GeoJSONNode.prototype.assemble = function () {
        return tslib_1.__assign({ type: 'geojson' }, (this.fields ? { fields: this.fields } : {}), (this.geojson ? { geojson: this.geojson } : {}), { signal: this.signal });
    };
    return GeoJSONNode;
}(DataFlowNode));
export { GeoJSONNode };
//# sourceMappingURL=geojson.js.map