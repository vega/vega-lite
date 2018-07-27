import * as tslib_1 from "tslib";
import { LATITUDE, LATITUDE2, LONGITUDE, LONGITUDE2 } from '../../channel';
import { duplicate } from '../../util';
import { DataFlowNode } from './dataflow';
var GeoPointNode = /** @class */ (function (_super) {
    tslib_1.__extends(GeoPointNode, _super);
    function GeoPointNode(parent, projection, fields, as) {
        var _this = _super.call(this, parent) || this;
        _this.projection = projection;
        _this.fields = fields;
        _this.as = as;
        return _this;
    }
    GeoPointNode.prototype.clone = function () {
        return new GeoPointNode(null, this.projection, duplicate(this.fields), duplicate(this.as));
    };
    GeoPointNode.parseAll = function (parent, model) {
        if (!model.projectionName()) {
            return parent;
        }
        [[LONGITUDE, LATITUDE], [LONGITUDE2, LATITUDE2]].forEach(function (coordinates) {
            var pair = coordinates.map(function (channel) { return (model.channelHasField(channel) ? model.fieldDef(channel).field : undefined); });
            var suffix = coordinates[0] === LONGITUDE2 ? '2' : '';
            if (pair[0] || pair[1]) {
                parent = new GeoPointNode(parent, model.projectionName(), pair, [
                    model.getName('x' + suffix),
                    model.getName('y' + suffix)
                ]);
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
}(DataFlowNode));
export { GeoPointNode };
//# sourceMappingURL=geopoint.js.map