import * as tslib_1 from "tslib";
import { isScaleChannel } from '../../channel';
import { vgField as fieldRef } from '../../fielddef';
import { isPathMark } from '../../mark';
import { hasContinuousDomain } from '../../scale';
import { keys } from '../../util';
import { DataFlowNode } from './dataflow';
var FilterInvalidNode = /** @class */ (function (_super) {
    tslib_1.__extends(FilterInvalidNode, _super);
    function FilterInvalidNode(parent, fieldDefs) {
        var _this = _super.call(this, parent) || this;
        _this.fieldDefs = fieldDefs;
        return _this;
    }
    FilterInvalidNode.prototype.clone = function () {
        return new FilterInvalidNode(null, tslib_1.__assign({}, this.fieldDefs));
    };
    FilterInvalidNode.make = function (parent, model) {
        var config = model.config, mark = model.mark;
        if (config.invalidValues !== 'filter') {
            return null;
        }
        var filter = model.reduceFieldDef(function (aggregator, fieldDef, channel) {
            var scaleComponent = isScaleChannel(channel) && model.getScaleComponent(channel);
            if (scaleComponent) {
                var scaleType = scaleComponent.get('type');
                // While discrete domain scales can handle invalid values, continuous scales can't.
                // Thus, for non-path marks, we have to filter null for scales with continuous domains.
                // (For path marks, we will use "defined" property and skip these values instead.)
                if (hasContinuousDomain(scaleType) && !fieldDef.aggregate && !isPathMark(mark)) {
                    aggregator[fieldDef.field] = fieldDef;
                }
            }
            return aggregator;
        }, {});
        if (!keys(filter).length) {
            return null;
        }
        return new FilterInvalidNode(parent, filter);
    };
    Object.defineProperty(FilterInvalidNode.prototype, "filter", {
        get: function () {
            return this.fieldDefs;
        },
        enumerable: true,
        configurable: true
    });
    // create the VgTransforms for each of the filtered fields
    FilterInvalidNode.prototype.assemble = function () {
        var _this = this;
        var filters = keys(this.filter).reduce(function (vegaFilters, field) {
            var fieldDef = _this.fieldDefs[field];
            var ref = fieldRef(fieldDef, { expr: 'datum' });
            if (fieldDef !== null) {
                vegaFilters.push(ref + " !== null");
                vegaFilters.push("!isNaN(" + ref + ")");
            }
            return vegaFilters;
        }, []);
        return filters.length > 0
            ? {
                type: 'filter',
                expr: filters.join(' && ')
            }
            : null;
    };
    return FilterInvalidNode;
}(DataFlowNode));
export { FilterInvalidNode };
//# sourceMappingURL=filterinvalid.js.map