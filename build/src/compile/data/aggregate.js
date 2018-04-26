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
        return new AggregateNode(parent, dims, meas);
    };
    AggregateNode.makeFromTransform = function (parent, t) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EseUNBQXNEO0FBQ3RELDJDQUFpRDtBQUNqRCwrQkFBaUM7QUFFakMsbUNBQW9FO0FBRXBFLG9DQUEyQztBQUUzQyx1Q0FBd0M7QUFFeEMsc0JBQXNCLElBQWdDLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQjtJQUNsRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDaEIsSUFBSSxDQUFDLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUkseUJBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3REO0tBQ0Y7U0FBTTtRQUNMLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsdUJBQXVCLGNBQWtDLEVBQUUsYUFBaUM7SUFDMUYsS0FBSyxJQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDN0IsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25DLDZGQUE2RjtZQUM3RixJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxJQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksR0FB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QyxLQUFLLENBQUMsQ0FBQzthQUNwQjtTQUNGO1FBRUQsSUFBTSxNQUFNLEdBQXlCO1lBQ25DLElBQUksRUFBRSxXQUFXO1lBQ2pCLE9BQU8sRUFBRSxXQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QixHQUFHLEtBQUE7WUFDSCxNQUFNLFFBQUE7WUFDTixFQUFFLElBQUE7U0FDSCxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTVJRCxDQUFtQyx1QkFBWSxHQTRJOUM7QUE1SVksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZGlmZmVyLCBkdXBsaWNhdGUsIGtleXMsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2JpblJlcXVpcmVzUmFuZ2V9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi8uLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZnVuY3Rpb24gYWRkRGltZW5zaW9uKGRpbXM6IHtbZmllbGQ6IHN0cmluZ106IGJvb2xlYW59LCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7fSldID0gdHJ1ZTtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnfSldID0gdHJ1ZTtcblxuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAncmFuZ2UnfSldID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmKV0gPSB0cnVlO1xuICB9XG4gIHJldHVybiBkaW1zO1xufVxuXG5mdW5jdGlvbiBtZXJnZU1lYXN1cmVzKHBhcmVudE1lYXN1cmVzOiBEaWN0PERpY3Q8c3RyaW5nPj4sIGNoaWxkTWVhc3VyZXM6IERpY3Q8RGljdDxzdHJpbmc+Pikge1xuICBmb3IgKGNvbnN0IGYgaW4gY2hpbGRNZWFzdXJlcykge1xuICAgIGlmIChjaGlsZE1lYXN1cmVzLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAvLyB3aGVuIHdlIG1lcmdlIGEgbWVhc3VyZSwgd2UgZWl0aGVyIGhhdmUgdG8gYWRkIGFuIGFnZ3JlZ2F0aW9uIG9wZXJhdG9yIG9yIGV2ZW4gYSBuZXcgZmllbGRcbiAgICAgIGNvbnN0IG9wcyA9IGNoaWxkTWVhc3VyZXNbZl07XG4gICAgICBmb3IgKGNvbnN0IG9wIGluIG9wcykge1xuICAgICAgICBpZiAob3BzLmhhc093blByb3BlcnR5KG9wKSkge1xuICAgICAgICAgIGlmIChmIGluIHBhcmVudE1lYXN1cmVzKSB7XG4gICAgICAgICAgICAvLyBhZGQgb3BlcmF0b3IgdG8gZXhpc3RpbmcgbWVhc3VyZSBmaWVsZFxuICAgICAgICAgICAgcGFyZW50TWVhc3VyZXNbZl1bb3BdID0gb3BzW29wXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50TWVhc3VyZXNbZl0gPSB7b3A6IG9wc1tvcF19O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWdncmVnYXRlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUobnVsbCwgey4uLnRoaXMuZGltZW5zaW9uc30sIGR1cGxpY2F0ZSh0aGlzLm1lYXN1cmVzKSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGRpbWVuc2lvbnMgc3RyaW5nIHNldCBmb3IgZGltZW5zaW9uc1xuICAgKiBAcGFyYW0gbWVhc3VyZXMgZGljdGlvbmFyeSBtYXBwaW5nIGZpZWxkIG5hbWUgPT4gZGljdCBvZiBhZ2dyZWdhdGlvbiBmdW5jdGlvbnMgYW5kIG5hbWVzIHRvIHVzZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgZGltZW5zaW9uczogU3RyaW5nU2V0LCBwcml2YXRlIG1lYXN1cmVzOiBEaWN0PHtba2V5IGluIEFnZ3JlZ2F0ZU9wXT86IHN0cmluZ30+KSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21FbmNvZGluZyhwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IFVuaXRNb2RlbCk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGxldCBpc0FnZ3JlZ2F0ZSA9IGZhbHNlO1xuICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZihmZCA9PiB7XG4gICAgICBpZiAoZmQuYWdncmVnYXRlKSB7XG4gICAgICAgIGlzQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG1lYXMgPSB7fTtcbiAgICBjb25zdCBkaW1zID0ge307XG5cbiAgICBpZiAoIWlzQWdncmVnYXRlKSB7XG4gICAgICAvLyBubyBuZWVkIHRvIGNyZWF0ZSB0aGlzIG5vZGUgaWYgdGhlIG1vZGVsIGhhcyBubyBhZ2dyZWdhdGlvblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKChmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IHZnRmllbGQoZmllbGREZWYsIHthZ2dyZWdhdGU6ICdjb3VudCd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXSA9IG1lYXNbZmllbGREZWYuZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0gPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcblxuICAgICAgICAgIC8vIEZvciBzY2FsZSBjaGFubmVsIHdpdGggZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJywgYWRkIG1pbi9tYXggc28gd2UgY2FuIHVzZSB0aGVpciB1bmlvbiBhcyB1bmFnZ3JlZ2F0ZWQgZG9tYWluXG4gICAgICAgICAgaWYgKGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpICYmIG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bJ21pbiddID0gdmdGaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ21pbid9KTtcbiAgICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdWydtYXgnXSA9IHZnRmllbGQoZmllbGREZWYsIHthZ2dyZWdhdGU6ICdtYXgnfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGREaW1lbnNpb24oZGltcywgY2hhbm5lbCwgZmllbGREZWYpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKHBhcmVudCwgZGltcywgbWVhcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tVHJhbnNmb3JtKHBhcmVudDogRGF0YUZsb3dOb2RlLCB0OiBBZ2dyZWdhdGVUcmFuc2Zvcm0pOiBBZ2dyZWdhdGVOb2RlIHtcbiAgICBjb25zdCBkaW1zID0ge307XG4gICAgY29uc3QgbWVhcyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBzIG9mIHQuYWdncmVnYXRlKSB7XG4gICAgICBpZiAocy5vcCkge1xuICAgICAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ11bJ2NvdW50J10gPSBzLmFzIHx8IHZnRmllbGQocyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVhc1tzLmZpZWxkXSA9IG1lYXNbcy5maWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tzLmZpZWxkXVtzLm9wXSA9IHMuYXMgfHwgdmdGaWVsZChzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcyBvZiB0Lmdyb3VwYnkgfHwgW10pIHtcbiAgICAgIGRpbXNbc10gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgoa2V5cyhkaW1zKS5sZW5ndGggKyBrZXlzKG1lYXMpLmxlbmd0aCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShwYXJlbnQsIGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgaWYgKCFkaWZmZXIodGhpcy5kaW1lbnNpb25zLCBvdGhlci5kaW1lbnNpb25zKSkge1xuICAgICAgbWVyZ2VNZWFzdXJlcyh0aGlzLm1lYXN1cmVzLCBvdGhlci5tZWFzdXJlcyk7XG4gICAgICBvdGhlci5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdkaWZmZXJlbnQgZGltZW5zaW9ucywgY2Fubm90IG1lcmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIGZpZWxkcy5mb3JFYWNoKGYgPT4gdGhpcy5kaW1lbnNpb25zW2ZdID0gdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLmRpbWVuc2lvbnMpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2gobSA9PiBvdXRbbV0gPSB0cnVlKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgIG91dFtgJHtvcH1fJHtmaWVsZH1gXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBhczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyh0aGlzLm1lYXN1cmVzKSkge1xuICAgICAgZm9yIChjb25zdCBvcCBvZiBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKSkge1xuICAgICAgICBhcy5wdXNoKHRoaXMubWVhc3VyZXNbZmllbGRdW29wXSk7XG4gICAgICAgIG9wcy5wdXNoKG9wKTtcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGtleXModGhpcy5kaW1lbnNpb25zKSxcbiAgICAgIG9wcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGFzXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==