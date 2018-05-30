"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
        return new AggregateNode(null, tslib_1.__assign({}, this.dimensions), util_1.duplicate(this.measures));
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
                    meas['*']['count'] = fielddef_1.vgField(fieldDef);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][aggregate] = fielddef_1.vgField(fieldDef);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (channel_1.isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[field]['min'] = fielddef_1.vgField({ field: field, aggregate: 'min' });
                        meas[field]['max'] = fielddef_1.vgField({ field: field, aggregate: 'max' });
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
                    meas['*']['count'] = as || fielddef_1.vgField(s);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][op] = as || fielddef_1.vgField(s);
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
        return new AggregateNode(parent, dims, meas);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEseUNBQXNEO0FBQ3RELDJDQUFpRDtBQUNqRCwrQkFBaUM7QUFFakMsbUNBQW9FO0FBRXBFLG9DQUEyQztBQUUzQyx1Q0FBd0M7QUFFeEMsc0JBQXNCLElBQWdDLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQjtJQUNsRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDaEIsSUFBSSxDQUFDLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUkseUJBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3REO0tBQ0Y7U0FBTTtRQUNMLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsdUJBQXVCLGNBQWtDLEVBQUUsYUFBaUM7SUFDMUYsS0FBSyxJQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDN0IsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25DLDZGQUE2RjtZQUM3RixJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxJQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksR0FB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QUFVLENBQUM7WUFDOUIsR0FBRyxLQUFBO1lBQ0gsTUFBTSxRQUFBO1lBQ04sRUFBRSxJQUFBO1NBQ0gsQ0FBQztRQUVGLE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUE5SUQsQ0FBbUMsdUJBQVksR0E4STlDO0FBOUlZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5cbmltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZGlmZmVyLCBkdXBsaWNhdGUsIGtleXMsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2JpblJlcXVpcmVzUmFuZ2V9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi8uLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZnVuY3Rpb24gYWRkRGltZW5zaW9uKGRpbXM6IHtbZmllbGQ6IHN0cmluZ106IGJvb2xlYW59LCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7fSldID0gdHJ1ZTtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnfSldID0gdHJ1ZTtcblxuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAncmFuZ2UnfSldID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmKV0gPSB0cnVlO1xuICB9XG4gIHJldHVybiBkaW1zO1xufVxuXG5mdW5jdGlvbiBtZXJnZU1lYXN1cmVzKHBhcmVudE1lYXN1cmVzOiBEaWN0PERpY3Q8c3RyaW5nPj4sIGNoaWxkTWVhc3VyZXM6IERpY3Q8RGljdDxzdHJpbmc+Pikge1xuICBmb3IgKGNvbnN0IGYgaW4gY2hpbGRNZWFzdXJlcykge1xuICAgIGlmIChjaGlsZE1lYXN1cmVzLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAvLyB3aGVuIHdlIG1lcmdlIGEgbWVhc3VyZSwgd2UgZWl0aGVyIGhhdmUgdG8gYWRkIGFuIGFnZ3JlZ2F0aW9uIG9wZXJhdG9yIG9yIGV2ZW4gYSBuZXcgZmllbGRcbiAgICAgIGNvbnN0IG9wcyA9IGNoaWxkTWVhc3VyZXNbZl07XG4gICAgICBmb3IgKGNvbnN0IG9wIGluIG9wcykge1xuICAgICAgICBpZiAob3BzLmhhc093blByb3BlcnR5KG9wKSkge1xuICAgICAgICAgIGlmIChmIGluIHBhcmVudE1lYXN1cmVzKSB7XG4gICAgICAgICAgICAvLyBhZGQgb3BlcmF0b3IgdG8gZXhpc3RpbmcgbWVhc3VyZSBmaWVsZFxuICAgICAgICAgICAgcGFyZW50TWVhc3VyZXNbZl1bb3BdID0gb3BzW29wXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50TWVhc3VyZXNbZl0gPSB7b3A6IG9wc1tvcF19O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWdncmVnYXRlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUobnVsbCwgey4uLnRoaXMuZGltZW5zaW9uc30sIGR1cGxpY2F0ZSh0aGlzLm1lYXN1cmVzKSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGRpbWVuc2lvbnMgc3RyaW5nIHNldCBmb3IgZGltZW5zaW9uc1xuICAgKiBAcGFyYW0gbWVhc3VyZXMgZGljdGlvbmFyeSBtYXBwaW5nIGZpZWxkIG5hbWUgPT4gZGljdCBvZiBhZ2dyZWdhdGlvbiBmdW5jdGlvbnMgYW5kIG5hbWVzIHRvIHVzZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgZGltZW5zaW9uczogU3RyaW5nU2V0LCBwcml2YXRlIG1lYXN1cmVzOiBEaWN0PHtba2V5IGluIEFnZ3JlZ2F0ZU9wXT86IHN0cmluZ30+KSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21FbmNvZGluZyhwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IFVuaXRNb2RlbCk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGxldCBpc0FnZ3JlZ2F0ZSA9IGZhbHNlO1xuICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZihmZCA9PiB7XG4gICAgICBpZiAoZmQuYWdncmVnYXRlKSB7XG4gICAgICAgIGlzQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG1lYXMgPSB7fTtcbiAgICBjb25zdCBkaW1zID0ge307XG5cbiAgICBpZiAoIWlzQWdncmVnYXRlKSB7XG4gICAgICAvLyBubyBuZWVkIHRvIGNyZWF0ZSB0aGlzIG5vZGUgaWYgdGhlIG1vZGVsIGhhcyBubyBhZ2dyZWdhdGlvblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKChmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgY29uc3Qge2FnZ3JlZ2F0ZSwgZmllbGR9ID0gZmllbGREZWY7XG4gICAgICBpZiAoYWdncmVnYXRlKSB7XG4gICAgICAgIGlmIChhZ2dyZWdhdGUgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddWydjb3VudCddID0gdmdGaWVsZChmaWVsZERlZik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVhc1tmaWVsZF0gPSBtZWFzW2ZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW2ZpZWxkXVthZ2dyZWdhdGVdID0gdmdGaWVsZChmaWVsZERlZik7XG5cbiAgICAgICAgICAvLyBGb3Igc2NhbGUgY2hhbm5lbCB3aXRoIGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcsIGFkZCBtaW4vbWF4IHNvIHdlIGNhbiB1c2UgdGhlaXIgdW5pb24gYXMgdW5hZ2dyZWdhdGVkIGRvbWFpblxuICAgICAgICAgIGlmIChpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICAgICAgICAgIG1lYXNbZmllbGRdWydtaW4nXSA9IHZnRmllbGQoe2ZpZWxkLCBhZ2dyZWdhdGU6ICdtaW4nfSk7XG4gICAgICAgICAgICBtZWFzW2ZpZWxkXVsnbWF4J10gPSB2Z0ZpZWxkKHtmaWVsZCwgYWdncmVnYXRlOiAnbWF4J30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkRGltZW5zaW9uKGRpbXMsIGNoYW5uZWwsIGZpZWxkRGVmKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgoa2V5cyhkaW1zKS5sZW5ndGggKyBrZXlzKG1lYXMpLmxlbmd0aCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShwYXJlbnQsIGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgdDogQWdncmVnYXRlVHJhbnNmb3JtKTogQWdncmVnYXRlTm9kZSB7XG4gICAgY29uc3QgZGltcyA9IHt9O1xuICAgIGNvbnN0IG1lYXMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgcyBvZiB0LmFnZ3JlZ2F0ZSkge1xuICAgICAgY29uc3Qge29wLCBmaWVsZCwgYXN9ID0gcztcbiAgICAgIGlmIChvcCkge1xuICAgICAgICBpZiAob3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddWydjb3VudCddID0gYXMgfHwgdmdGaWVsZChzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW2ZpZWxkXSA9IG1lYXNbZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbZmllbGRdW29wXSA9IGFzIHx8IHZnRmllbGQocyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHMgb2YgdC5ncm91cGJ5IHx8IFtdKSB7XG4gICAgICBkaW1zW3NdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoKGtleXMoZGltcykubGVuZ3RoICsga2V5cyhtZWFzKS5sZW5ndGgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUocGFyZW50LCBkaW1zLCBtZWFzKTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZShvdGhlcjogQWdncmVnYXRlTm9kZSkge1xuICAgIGlmICghZGlmZmVyKHRoaXMuZGltZW5zaW9ucywgb3RoZXIuZGltZW5zaW9ucykpIHtcbiAgICAgIG1lcmdlTWVhc3VyZXModGhpcy5tZWFzdXJlcywgb3RoZXIubWVhc3VyZXMpO1xuICAgICAgb3RoZXIucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5kZWJ1ZygnZGlmZmVyZW50IGRpbWVuc2lvbnMsIGNhbm5vdCBtZXJnZScpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGREaW1lbnNpb25zKGZpZWxkczogc3RyaW5nW10pIHtcbiAgICBmaWVsZHMuZm9yRWFjaChmID0+IHRoaXMuZGltZW5zaW9uc1tmXSA9IHRydWUpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIGtleXModGhpcy5kaW1lbnNpb25zKS5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAga2V5cyh0aGlzLm1lYXN1cmVzKS5mb3JFYWNoKG0gPT4gb3V0W21dID0gdHJ1ZSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLm1lYXN1cmVzKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGtleXModGhpcy5tZWFzdXJlc1tmaWVsZF0pLmZvckVhY2gob3AgPT4ge1xuICAgICAgICBvdXRbYCR7b3B9XyR7ZmllbGR9YF0gPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnQWdncmVnYXRlVHJhbnNmb3JtIHtcbiAgICBjb25zdCBvcHM6IEFnZ3JlZ2F0ZU9wW10gPSBbXTtcbiAgICBjb25zdCBmaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgYXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXModGhpcy5tZWFzdXJlcykpIHtcbiAgICAgIGZvciAoY29uc3Qgb3Agb2Yga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkpIHtcbiAgICAgICAgYXMucHVzaCh0aGlzLm1lYXN1cmVzW2ZpZWxkXVtvcF0pO1xuICAgICAgICBvcHMucHVzaChvcCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IFZnQWdncmVnYXRlVHJhbnNmb3JtID0ge1xuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBrZXlzKHRoaXMuZGltZW5zaW9ucyksXG4gICAgICBvcHMsXG4gICAgICBmaWVsZHMsXG4gICAgICBhc1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=