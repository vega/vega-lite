import * as tslib_1 from "tslib";
import { extend } from 'vega';
import { isBinning } from '../../bin';
import { isScaleChannel } from '../../channel';
import { vgField } from '../../fielddef';
import * as log from '../../log';
import { duplicate, hash, isEqual, keys, replacePathInField } from '../../util';
import { binRequiresRange } from '../common';
import { DataFlowNode } from './dataflow';
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
    var _a;
    for (var field in childMeasures) {
        if (childMeasures.hasOwnProperty(field)) {
            // when we merge a measure, we either have to add an aggregation operator or even a new field
            var ops = childMeasures[field];
            for (var op in ops) {
                if (ops.hasOwnProperty(op)) {
                    if (field in parentMeasures) {
                        // add operator to existing measure field
                        parentMeasures[field][op] = tslib_1.__assign({}, parentMeasures[field][op], ops[op]);
                    }
                    else {
                        parentMeasures[field] = (_a = {}, _a[op] = ops[op], _a);
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
    Object.defineProperty(AggregateNode.prototype, "groupBy", {
        get: function () {
            return this.dimensions;
        },
        enumerable: true,
        configurable: true
    });
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
            var _a, _b, _c, _d;
            var aggregate = fieldDef.aggregate, field = fieldDef.field;
            if (aggregate) {
                if (aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = (_a = {}, _a[vgField(fieldDef, { forAs: true })] = true, _a);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][aggregate] = (_b = {}, _b[vgField(fieldDef, { forAs: true })] = true, _b);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[field]['min'] = (_c = {}, _c[vgField({ field: field, aggregate: 'min' }, { forAs: true })] = true, _c);
                        meas[field]['max'] = (_d = {}, _d[vgField({ field: field, aggregate: 'max' }, { forAs: true })] = true, _d);
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
        var _a, _b, _c, _d;
        var dims = {};
        var meas = {};
        for (var _i = 0, _e = t.aggregate; _i < _e.length; _i++) {
            var s = _e[_i];
            var op = s.op, field = s.field, as = s.as;
            if (op) {
                if (op === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = (_a = {}, _a[as] = true, _a) || (_b = {}, _b[vgField(s, { forAs: true })] = true, _b);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][op] = (_c = {}, _c[as] = true, _c) || (_d = {}, _d[vgField(s, { forAs: true })] = true, _d);
                }
            }
        }
        for (var _f = 0, _g = t.groupby || []; _f < _g.length; _f++) {
            var s = _g[_f];
            dims[s] = true;
        }
        if (keys(dims).length + keys(meas).length === 0) {
            return null;
        }
        return new AggregateNode(parent, dims, meas);
    };
    AggregateNode.prototype.merge = function (other) {
        if (isEqual(this.dimensions, other.dimensions)) {
            mergeMeasures(this.measures, other.measures);
            return true;
        }
        else {
            log.debug('different dimensions, cannot merge');
            return false;
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
                if (keys(this.measures[field][op]).length === 0) {
                    out[op + "_" + field] = true;
                }
                else {
                    extend(out, this.measures[field][op]);
                }
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
                for (var _d = 0, _e = keys(this.measures[field][op]); _d < _e.length; _d++) {
                    var alias = _e[_d];
                    as.push(alias);
                    ops.push(op);
                    fields.push(replacePathInField(field));
                }
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
}(DataFlowNode));
export { AggregateNode };
//# sourceMappingURL=aggregate.js.map