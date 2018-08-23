import * as tslib_1 from "tslib";
import { isBinning } from '../../bin';
import { isScaleChannel } from '../../channel';
import { vgField } from '../../fielddef';
import * as log from '../../log';
import { differ, duplicate, hash, keys, replacePathInField } from '../../util';
import { binRequiresRange } from '../common';
import { TransformNode } from './dataflow';
function addDimension(dims, channel, fieldDef) {
    if (isBinning(fieldDef.bin)) {
        dims[vgField(fieldDef, {})] = true;
        dims[vgField(fieldDef, { binSuffix: 'end' })] = true;
        if (binRequiresRange(fieldDef, channel)) {
            dims[vgField(fieldDef, { binSuffix: 'range' })] = true;
        }
    }
    else {
        dims[vgField(fieldDef)] = true;
    }
    return dims;
}
function mergeMeasures(parentMeasures, childMeasures) {
    for (var f in childMeasures) {
        if (childMeasures.hasOwnProperty(f)) {
            // when we merge a measure, we either have to add an aggregation operator or even a new field
            var ops = childMeasures[f];
            for (var op in ops) {
                if (ops.hasOwnProperty(op)) {
                    if (f in parentMeasures) {
                        // add operator to existing measure field
                        parentMeasures[f][op] = ops[op];
                    }
                    else {
                        parentMeasures[f] = { op: ops[op] };
                    }
                }
            }
        }
    }
}
var AggregateNode = /** @class */ (function (_super) {
    tslib_1.__extends(AggregateNode, _super);
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    function AggregateNode(parent, dimensions, measures) {
        var _this = _super.call(this, parent) || this;
        _this.dimensions = dimensions;
        _this.measures = measures;
        return _this;
    }
    AggregateNode.prototype.clone = function () {
        return new AggregateNode(null, tslib_1.__assign({}, this.dimensions), duplicate(this.measures));
    };
    AggregateNode.makeFromEncoding = function (parent, model) {
        var isAggregate = false;
        model.forEachFieldDef(function (fd) {
            if (fd.aggregate) {
                isAggregate = true;
            }
        });
        var meas = {};
        var dims = {};
        if (!isAggregate) {
            // no need to create this node if the model has no aggregation
            return null;
        }
        model.forEachFieldDef(function (fieldDef, channel) {
            var aggregate = fieldDef.aggregate, field = fieldDef.field;
            if (aggregate) {
                if (aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = vgField(fieldDef, { forAs: true });
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][aggregate] = vgField(fieldDef, { forAs: true });
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[field]['min'] = vgField({ field: field, aggregate: 'min' }, { forAs: true });
                        meas[field]['max'] = vgField({ field: field, aggregate: 'max' }, { forAs: true });
                    }
                }
            }
            else {
                addDimension(dims, channel, fieldDef);
            }
        });
        if (keys(dims).length + keys(meas).length === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    };
    AggregateNode.makeFromTransform = function (parent, t) {
        var dims = {};
        var meas = {};
        for (var _i = 0, _a = t.aggregate; _i < _a.length; _i++) {
            var s = _a[_i];
            var op = s.op, field = s.field, as = s.as;
            if (op) {
                if (op === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = as || vgField(s, { forAs: true });
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][op] = as || vgField(s, { forAs: true });
                }
            }
        }
        for (var _b = 0, _c = t.groupby || []; _b < _c.length; _b++) {
            var s = _c[_b];
            dims[s] = true;
        }
        if (keys(dims).length + keys(meas).length === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    };
    AggregateNode.prototype.merge = function (other) {
        if (!differ(this.dimensions, other.dimensions)) {
            mergeMeasures(this.measures, other.measures);
            other.remove();
        }
        else {
            log.debug('different dimensions, cannot merge');
        }
    };
    AggregateNode.prototype.addDimensions = function (fields) {
        var _this = this;
        fields.forEach(function (f) { return (_this.dimensions[f] = true); });
    };
    AggregateNode.prototype.dependentFields = function () {
        var out = {};
        keys(this.dimensions).forEach(function (f) { return (out[f] = true); });
        keys(this.measures).forEach(function (m) { return (out[m] = true); });
        return out;
    };
    AggregateNode.prototype.producedFields = function () {
        var out = {};
        for (var _i = 0, _a = keys(this.measures); _i < _a.length; _i++) {
            var field = _a[_i];
            for (var _b = 0, _c = keys(this.measures[field]); _b < _c.length; _b++) {
                var op = _c[_b];
                out[this.measures[field][op] || op + "_" + field] = true;
            }
        }
        return out;
    };
    AggregateNode.prototype.hash = function () {
        return "Aggregate " + hash({ dimensions: this.dimensions, measures: this.measures });
    };
    AggregateNode.prototype.assemble = function () {
        var ops = [];
        var fields = [];
        var as = [];
        for (var _i = 0, _a = keys(this.measures); _i < _a.length; _i++) {
            var field = _a[_i];
            for (var _b = 0, _c = keys(this.measures[field]); _b < _c.length; _b++) {
                var op = _c[_b];
                as.push(this.measures[field][op]);
                ops.push(op);
                fields.push(replacePathInField(field));
            }
        }
        var result = {
            type: 'aggregate',
            groupby: keys(this.dimensions),
            ops: ops,
            fields: fields,
            as: as
        };
        return result;
    };
    return AggregateNode;
}(TransformNode));
export { AggregateNode };
//# sourceMappingURL=aggregate.js.map