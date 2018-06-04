"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var channel_1 = require("../../channel");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBRUEseUNBQXNEO0FBQ3RELDJDQUFpRDtBQUNqRCxxREFBaUM7QUFFakMsbUNBQW9FO0FBRXBFLG9DQUEyQztBQUUzQyx1Q0FBd0M7QUFFeEMsc0JBQXNCLElBQWdDLEVBQUUsT0FBZ0IsRUFBRSxRQUEwQjtJQUNsRyxJQUFJLFFBQVEsQ0FBQyxHQUFHLEVBQUU7UUFDaEIsSUFBSSxDQUFDLGtCQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25DLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUkseUJBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3REO0tBQ0Y7U0FBTTtRQUNMLElBQUksQ0FBQyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsdUJBQXVCLGNBQWtDLEVBQUUsYUFBaUM7SUFDMUYsS0FBSyxJQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7UUFDN0IsSUFBSSxhQUFhLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25DLDZGQUE2RjtZQUM3RixJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDN0IsS0FBSyxJQUFNLEVBQUUsSUFBSSxHQUFHLEVBQUU7Z0JBQ3BCLElBQUksR0FB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QUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QixHQUFHLEtBQUE7WUFDSCxNQUFNLFFBQUE7WUFDTixFQUFFLElBQUE7U0FDSCxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTlJRCxDQUFtQyx1QkFBWSxHQThJOUM7QUE5SVksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcblxuaW1wb3J0IHtDaGFubmVsLCBpc1NjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7QWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBkaWZmZXIsIGR1cGxpY2F0ZSwga2V5cywgU3RyaW5nU2V0fSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdBZ2dyZWdhdGVUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLy4uL3VuaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5mdW5jdGlvbiBhZGREaW1lbnNpb24oZGltczoge1tmaWVsZDogc3RyaW5nXTogYm9vbGVhbn0sIGNoYW5uZWw6IENoYW5uZWwsIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+KSB7XG4gIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHt9KV0gPSB0cnVlO1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ2VuZCd9KV0gPSB0cnVlO1xuXG4gICAgaWYgKGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWYsIGNoYW5uZWwpKSB7XG4gICAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdyYW5nZSd9KV0gPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYpXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGRpbXM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlTWVhc3VyZXMocGFyZW50TWVhc3VyZXM6IERpY3Q8RGljdDxzdHJpbmc+PiwgY2hpbGRNZWFzdXJlczogRGljdDxEaWN0PHN0cmluZz4+KSB7XG4gIGZvciAoY29uc3QgZiBpbiBjaGlsZE1lYXN1cmVzKSB7XG4gICAgaWYgKGNoaWxkTWVhc3VyZXMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgIC8vIHdoZW4gd2UgbWVyZ2UgYSBtZWFzdXJlLCB3ZSBlaXRoZXIgaGF2ZSB0byBhZGQgYW4gYWdncmVnYXRpb24gb3BlcmF0b3Igb3IgZXZlbiBhIG5ldyBmaWVsZFxuICAgICAgY29uc3Qgb3BzID0gY2hpbGRNZWFzdXJlc1tmXTtcbiAgICAgIGZvciAoY29uc3Qgb3AgaW4gb3BzKSB7XG4gICAgICAgIGlmIChvcHMuaGFzT3duUHJvcGVydHkob3ApKSB7XG4gICAgICAgICAgaWYgKGYgaW4gcGFyZW50TWVhc3VyZXMpIHtcbiAgICAgICAgICAgIC8vIGFkZCBvcGVyYXRvciB0byBleGlzdGluZyBtZWFzdXJlIGZpZWxkXG4gICAgICAgICAgICBwYXJlbnRNZWFzdXJlc1tmXVtvcF0gPSBvcHNbb3BdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnRNZWFzdXJlc1tmXSA9IHtvcDogb3BzW29wXX07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBZ2dyZWdhdGVOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShudWxsLCB7Li4udGhpcy5kaW1lbnNpb25zfSwgZHVwbGljYXRlKHRoaXMubWVhc3VyZXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gZGltZW5zaW9ucyBzdHJpbmcgc2V0IGZvciBkaW1lbnNpb25zXG4gICAqIEBwYXJhbSBtZWFzdXJlcyBkaWN0aW9uYXJ5IG1hcHBpbmcgZmllbGQgbmFtZSA9PiBkaWN0IG9mIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9ucyBhbmQgbmFtZXMgdG8gdXNlXG4gICAqL1xuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgcHJpdmF0ZSBkaW1lbnNpb25zOiBTdHJpbmdTZXQsIHByaXZhdGUgbWVhc3VyZXM6IERpY3Q8e1trZXkgaW4gQWdncmVnYXRlT3BdPzogc3RyaW5nfT4pIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbUVuY29kaW5nKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKTogQWdncmVnYXRlTm9kZSB7XG4gICAgbGV0IGlzQWdncmVnYXRlID0gZmFsc2U7XG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKGZkID0+IHtcbiAgICAgIGlmIChmZC5hZ2dyZWdhdGUpIHtcbiAgICAgICAgaXNBZ2dyZWdhdGUgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY29uc3QgbWVhcyA9IHt9O1xuICAgIGNvbnN0IGRpbXMgPSB7fTtcblxuICAgIGlmICghaXNBZ2dyZWdhdGUpIHtcbiAgICAgIC8vIG5vIG5lZWQgdG8gY3JlYXRlIHRoaXMgbm9kZSBpZiB0aGUgbW9kZWwgaGFzIG5vIGFnZ3JlZ2F0aW9uXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBtb2RlbC5mb3JFYWNoRmllbGREZWYoKGZpZWxkRGVmLCBjaGFubmVsKSA9PiB7XG4gICAgICBjb25zdCB7YWdncmVnYXRlLCBmaWVsZH0gPSBmaWVsZERlZjtcbiAgICAgIGlmIChhZ2dyZWdhdGUpIHtcbiAgICAgICAgaWYgKGFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ11bJ2NvdW50J10gPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW2ZpZWxkXSA9IG1lYXNbZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbZmllbGRdW2FnZ3JlZ2F0ZV0gPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcblxuICAgICAgICAgIC8vIEZvciBzY2FsZSBjaGFubmVsIHdpdGggZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJywgYWRkIG1pbi9tYXggc28gd2UgY2FuIHVzZSB0aGVpciB1bmlvbiBhcyB1bmFnZ3JlZ2F0ZWQgZG9tYWluXG4gICAgICAgICAgaWYgKGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpICYmIG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgICAgICAgICAgbWVhc1tmaWVsZF1bJ21pbiddID0gdmdGaWVsZCh7ZmllbGQsIGFnZ3JlZ2F0ZTogJ21pbid9KTtcbiAgICAgICAgICAgIG1lYXNbZmllbGRdWydtYXgnXSA9IHZnRmllbGQoe2ZpZWxkLCBhZ2dyZWdhdGU6ICdtYXgnfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGREaW1lbnNpb24oZGltcywgY2hhbm5lbCwgZmllbGREZWYpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKHBhcmVudCwgZGltcywgbWVhcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tVHJhbnNmb3JtKHBhcmVudDogRGF0YUZsb3dOb2RlLCB0OiBBZ2dyZWdhdGVUcmFuc2Zvcm0pOiBBZ2dyZWdhdGVOb2RlIHtcbiAgICBjb25zdCBkaW1zID0ge307XG4gICAgY29uc3QgbWVhcyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBzIG9mIHQuYWdncmVnYXRlKSB7XG4gICAgICBjb25zdCB7b3AsIGZpZWxkLCBhc30gPSBzO1xuICAgICAgaWYgKG9wKSB7XG4gICAgICAgIGlmIChvcCA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ11bJ2NvdW50J10gPSBhcyB8fCB2Z0ZpZWxkKHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbZmllbGRdID0gbWVhc1tmaWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tmaWVsZF1bb3BdID0gYXMgfHwgdmdGaWVsZChzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcyBvZiB0Lmdyb3VwYnkgfHwgW10pIHtcbiAgICAgIGRpbXNbc10gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgoa2V5cyhkaW1zKS5sZW5ndGggKyBrZXlzKG1lYXMpLmxlbmd0aCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShwYXJlbnQsIGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgaWYgKCFkaWZmZXIodGhpcy5kaW1lbnNpb25zLCBvdGhlci5kaW1lbnNpb25zKSkge1xuICAgICAgbWVyZ2VNZWFzdXJlcyh0aGlzLm1lYXN1cmVzLCBvdGhlci5tZWFzdXJlcyk7XG4gICAgICBvdGhlci5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdkaWZmZXJlbnQgZGltZW5zaW9ucywgY2Fubm90IG1lcmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIGZpZWxkcy5mb3JFYWNoKGYgPT4gdGhpcy5kaW1lbnNpb25zW2ZdID0gdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLmRpbWVuc2lvbnMpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2gobSA9PiBvdXRbbV0gPSB0cnVlKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgIG91dFtgJHtvcH1fJHtmaWVsZH1gXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBhczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyh0aGlzLm1lYXN1cmVzKSkge1xuICAgICAgZm9yIChjb25zdCBvcCBvZiBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKSkge1xuICAgICAgICBhcy5wdXNoKHRoaXMubWVhc3VyZXNbZmllbGRdW29wXSk7XG4gICAgICAgIG9wcy5wdXNoKG9wKTtcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGtleXModGhpcy5kaW1lbnNpb25zKSxcbiAgICAgIG9wcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGFzXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==