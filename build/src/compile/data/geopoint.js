"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
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
//# sourceMappingURL=geopoint.js.map