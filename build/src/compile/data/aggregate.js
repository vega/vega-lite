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
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
function addDimension(dims, channel, fieldDef) {
    if (fieldDef.bin) {
        dims[fielddef_1.vgField(fieldDef, {})] = true;
        dims[fielddef_1.vgField(fieldDef, { binSuffix: 'end' })] = true;
        if (common_1.binRequiresRange(fieldDef, channel)) {
            dims[fielddef_1.vgField(fieldDef, { binSuffix: 'range' })] = true;
        }
    }
    else {
        dims[fielddef_1.vgField(fieldDef)] = true;
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
    __extends(AggregateNode, _super);
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict of aggregation functions and names to use
     */
    function AggregateNode(dimensions, measures) {
        var _this = _super.call(this) || this;
        _this.dimensions = dimensions;
        _this.measures = measures;
        return _this;
    }
    AggregateNode.prototype.clone = function () {
        return new AggregateNode(__assign({}, this.dimensions), util_1.duplicate(this.measures));
    };
    AggregateNode.makeFromEncoding = function (model) {
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
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = fielddef_1.vgField(fieldDef, { aggregate: 'count' });
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = fielddef_1.vgField(fieldDef);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (channel_1.isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[fieldDef.field]['min'] = fielddef_1.vgField(fieldDef, { aggregate: 'min' });
                        meas[fieldDef.field]['max'] = fielddef_1.vgField(fieldDef, { aggregate: 'max' });
                    }
                }
            }
            else {
                addDimension(dims, channel, fieldDef);
            }
        });
        if ((util_1.keys(dims).length + util_1.keys(meas).length) === 0) {
            return null;
        }
        return new AggregateNode(dims, meas);
    };
    AggregateNode.makeFromTransform = function (t) {
        var dims = {};
        var meas = {};
        for (var _i = 0, _a = t.aggregate; _i < _a.length; _i++) {
            var s = _a[_i];
            if (s.op) {
                if (s.op === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = s.as || fielddef_1.vgField(s);
                }
                else {
                    meas[s.field] = meas[s.field] || {};
                    meas[s.field][s.op] = s.as || fielddef_1.vgField(s);
                }
            }
        }
        for (var _b = 0, _c = t.groupby || []; _b < _c.length; _b++) {
            var s = _c[_b];
            dims[s] = true;
        }
        if ((util_1.keys(dims).length + util_1.keys(meas).length) === 0) {
            return null;
        }
        return new AggregateNode(dims, meas);
    };
    AggregateNode.prototype.merge = function (other) {
        if (!util_1.differ(this.dimensions, other.dimensions)) {
            mergeMeasures(this.measures, other.measures);
            other.remove();
        }
        else {
            log.debug('different dimensions, cannot merge');
        }
    };
    AggregateNode.prototype.addDimensions = function (fields) {
        var _this = this;
        fields.forEach(function (f) { return _this.dimensions[f] = true; });
    };
    AggregateNode.prototype.dependentFields = function () {
        var out = {};
        util_1.keys(this.dimensions).forEach(function (f) { return out[f] = true; });
        util_1.keys(this.measures).forEach(function (m) { return out[m] = true; });
        return out;
    };
    AggregateNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        util_1.keys(this.measures).forEach(function (field) {
            util_1.keys(_this.measures[field]).forEach(function (op) {
                out[op + "_" + field] = true;
            });
        });
        return out;
    };
    AggregateNode.prototype.assemble = function () {
        var ops = [];
        var fields = [];
        var as = [];
        for (var _i = 0, _a = util_1.keys(this.measures); _i < _a.length; _i++) {
            var field = _a[_i];
            for (var _b = 0, _c = util_1.keys(this.measures[field]); _b < _c.length; _b++) {
                var op = _c[_b];
                as.push(this.measures[field][op]);
                ops.push(op);
                fields.push(field);
            }
        }
        var result = {
            type: 'aggregate',
            groupby: util_1.keys(this.dimensions),
            ops: ops,
            fields: fields,
            as: as
        };
        return result;
    };
    return AggregateNode;
}(dataflow_1.DataFlowNode));
exports.AggregateNode = AggregateNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5Q0FBc0Q7QUFDdEQsMkNBQWlEO0FBQ2pELCtCQUFpQztBQUVqQyxtQ0FBb0U7QUFFcEUsb0NBQTJDO0FBRTNDLHVDQUF3QztBQUV4QyxzQkFBc0IsSUFBZ0MsRUFBRSxPQUFnQixFQUFFLFFBQTBCO0lBQ2xHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsa0JBQU8sQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVuRCxFQUFFLENBQUMsQ0FBQyx5QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3ZELENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFJLENBQUMsa0JBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNqQyxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCx1QkFBdUIsY0FBa0MsRUFBRSxhQUFpQztJQUMxRixHQUFHLENBQUMsQ0FBQyxJQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FB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XG5pbXBvcnQge0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBZ2dyZWdhdGVUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGRpZmZlciwgZHVwbGljYXRlLCBrZXlzLCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vLi4vdW5pdCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmZ1bmN0aW9uIGFkZERpbWVuc2lvbihkaW1zOiB7W2ZpZWxkOiBzdHJpbmddOiBib29sZWFufSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge30pXSA9IHRydWU7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnZW5kJ30pXSA9IHRydWU7XG5cbiAgICBpZiAoYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZiwgY2hhbm5lbCkpIHtcbiAgICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ3JhbmdlJ30pXSA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZildID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZGltcztcbn1cblxuZnVuY3Rpb24gbWVyZ2VNZWFzdXJlcyhwYXJlbnRNZWFzdXJlczogRGljdDxEaWN0PHN0cmluZz4+LCBjaGlsZE1lYXN1cmVzOiBEaWN0PERpY3Q8c3RyaW5nPj4pIHtcbiAgZm9yIChjb25zdCBmIGluIGNoaWxkTWVhc3VyZXMpIHtcbiAgICBpZiAoY2hpbGRNZWFzdXJlcy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgLy8gd2hlbiB3ZSBtZXJnZSBhIG1lYXN1cmUsIHdlIGVpdGhlciBoYXZlIHRvIGFkZCBhbiBhZ2dyZWdhdGlvbiBvcGVyYXRvciBvciBldmVuIGEgbmV3IGZpZWxkXG4gICAgICBjb25zdCBvcHMgPSBjaGlsZE1lYXN1cmVzW2ZdO1xuICAgICAgZm9yIChjb25zdCBvcCBpbiBvcHMpIHtcbiAgICAgICAgaWYgKG9wcy5oYXNPd25Qcm9wZXJ0eShvcCkpIHtcbiAgICAgICAgICBpZiAoZiBpbiBwYXJlbnRNZWFzdXJlcykge1xuICAgICAgICAgICAgLy8gYWRkIG9wZXJhdG9yIHRvIGV4aXN0aW5nIG1lYXN1cmUgZmllbGRcbiAgICAgICAgICAgIHBhcmVudE1lYXN1cmVzW2ZdW29wXSA9IG9wc1tvcF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE1lYXN1cmVzW2ZdID0ge29wOiBvcHNbb3BdfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0ZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKHsuLi50aGlzLmRpbWVuc2lvbnN9LCBkdXBsaWNhdGUodGhpcy5tZWFzdXJlcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBkaW1lbnNpb25zIHN0cmluZyBzZXQgZm9yIGRpbWVuc2lvbnNcbiAgICogQHBhcmFtIG1lYXN1cmVzIGRpY3Rpb25hcnkgbWFwcGluZyBmaWVsZCBuYW1lID0+IGRpY3Qgb2YgYWdncmVnYXRpb24gZnVuY3Rpb25zIGFuZCBuYW1lcyB0byB1c2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGltZW5zaW9uczogU3RyaW5nU2V0LCBwcml2YXRlIG1lYXN1cmVzOiBEaWN0PHtba2V5IGluIEFnZ3JlZ2F0ZU9wXT86IHN0cmluZ30+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21FbmNvZGluZyhtb2RlbDogVW5pdE1vZGVsKTogQWdncmVnYXRlTm9kZSB7XG4gICAgbGV0IGlzQWdncmVnYXRlID0gZmFsc2U7XG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZkID0+IHtcbiAgICAgIGlmIChmZC5hZ2dyZWdhdGUpIHtcbiAgICAgICAgaXNBZ2dyZWdhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgbWVhcyA9IHt9O1xuICAgIGNvbnN0IGRpbXMgPSB7fTtcblxuICAgIGlmICghaXNBZ2dyZWdhdGUpIHtcbiAgICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIHRoaXMgbm9kZSBpZiB0aGUgbW9kZWwgaGFzIG5vIGFnZ3JlZ2F0aW9uXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBtb2RlbC5mb3JFYWNoRmllbGREZWYoKGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddWydjb3VudCddID0gdmdGaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ2NvdW50J30pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdID0gbWVhc1tmaWVsZERlZi5maWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bZmllbGREZWYuYWdncmVnYXRlXSA9IHZnRmllbGQoZmllbGREZWYpO1xuXG4gICAgICAgICAgLy8gRm9yIHNjYWxlIGNoYW5uZWwgd2l0aCBkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnLCBhZGQgbWluL21heCBzbyB3ZSBjYW4gdXNlIHRoZWlyIHVuaW9uIGFzIHVuYWdncmVnYXRlZCBkb21haW5cbiAgICAgICAgICBpZiAoaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgbW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCkgPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXVsnbWluJ10gPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7YWdncmVnYXRlOiAnbWluJ30pO1xuICAgICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bJ21heCddID0gdmdGaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ21heCd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZERpbWVuc2lvbihkaW1zLCBjaGFubmVsLCBmaWVsZERlZik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoKGtleXMoZGltcykubGVuZ3RoICsga2V5cyhtZWFzKS5sZW5ndGgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUoZGltcywgbWVhcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tVHJhbnNmb3JtKHQ6IEFnZ3JlZ2F0ZVRyYW5zZm9ybSk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGNvbnN0IGRpbXMgPSB7fTtcbiAgICBjb25zdCBtZWFzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHMgb2YgdC5hZ2dyZWdhdGUpIHtcbiAgICAgIGlmIChzLm9wKSB7XG4gICAgICAgIGlmIChzLm9wID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IHMuYXMgfHwgdmdGaWVsZChzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW3MuZmllbGRdID0gbWVhc1tzLmZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW3MuZmllbGRdW3Mub3BdID0gcy5hcyB8fCB2Z0ZpZWxkKHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzIG9mIHQuZ3JvdXBieSB8fCBbXSkge1xuICAgICAgZGltc1tzXSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgaWYgKCFkaWZmZXIodGhpcy5kaW1lbnNpb25zLCBvdGhlci5kaW1lbnNpb25zKSkge1xuICAgICAgbWVyZ2VNZWFzdXJlcyh0aGlzLm1lYXN1cmVzLCBvdGhlci5tZWFzdXJlcyk7XG4gICAgICBvdGhlci5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdkaWZmZXJlbnQgZGltZW5zaW9ucywgY2Fubm90IG1lcmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIGZpZWxkcy5mb3JFYWNoKGYgPT4gdGhpcy5kaW1lbnNpb25zW2ZdID0gdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLmRpbWVuc2lvbnMpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2gobSA9PiBvdXRbbV0gPSB0cnVlKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgIG91dFtgJHtvcH1fJHtmaWVsZH1gXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBhczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyh0aGlzLm1lYXN1cmVzKSkge1xuICAgICAgZm9yIChjb25zdCBvcCBvZiBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKSkge1xuICAgICAgICBhcy5wdXNoKHRoaXMubWVhc3VyZXNbZmllbGRdW29wXSk7XG4gICAgICAgIG9wcy5wdXNoKG9wKTtcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGtleXModGhpcy5kaW1lbnNpb25zKSxcbiAgICAgIG9wcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGFzXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==