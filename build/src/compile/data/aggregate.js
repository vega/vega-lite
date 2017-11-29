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
        dims[fielddef_1.field(fieldDef, {})] = true;
        dims[fielddef_1.field(fieldDef, { binSuffix: 'end' })] = true;
        if (common_1.binRequiresRange(fieldDef, channel)) {
            dims[fielddef_1.field(fieldDef, { binSuffix: 'range' })] = true;
        }
    }
    else {
        dims[fielddef_1.field(fieldDef)] = true;
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
                    meas['*']['count'] = fielddef_1.field(fieldDef, { aggregate: 'count' });
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = fielddef_1.field(fieldDef);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (channel_1.isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[fieldDef.field]['min'] = fielddef_1.field(fieldDef, { aggregate: 'min' });
                        meas[fieldDef.field]['max'] = fielddef_1.field(fieldDef, { aggregate: 'max' });
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
                    meas['*']['count'] = s.as || fielddef_1.field(s);
                }
                else {
                    meas[s.field] = meas[s.field] || {};
                    meas[s.field][s.op] = s.as || fielddef_1.field(s);
                }
            }
        }
        for (var _b = 0, _c = t.groupby; _b < _c.length; _b++) {
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
            var field_1 = _a[_i];
            for (var _b = 0, _c = util_1.keys(this.measures[field_1]); _b < _c.length; _b++) {
                var op = _c[_b];
                as.push(this.measures[field_1][op]);
                ops.push(op);
                fields.push(field_1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5Q0FBc0Q7QUFDdEQsMkNBQStDO0FBQy9DLCtCQUFpQztBQUVqQyxtQ0FBb0U7QUFFcEUsb0NBQTJDO0FBRTNDLHVDQUF3QztBQUV4QyxzQkFBc0IsSUFBZ0MsRUFBRSxPQUFnQixFQUFFLFFBQTBCO0lBQ2xHLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2pCLElBQUksQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNqQyxJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVqRCxFQUFFLENBQUMsQ0FBQyx5QkFBZ0IsQ0FBQyxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLElBQUksQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3JELENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUMvQixDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCx1QkFBdUIsY0FBa0MsRUFBRSxhQUFpQztJQUMxRixHQUFHLENBQUMsQ0FBQyxJQUFNLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsQ0FB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QyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVNLGdDQUFRLEdBQWY7UUFDRSxJQUFNLEdBQUcsR0FBa0IsRUFBRSxDQUFDO1FBQzlCLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFNLEVBQUUsR0FBYSxFQUFFLENBQUM7UUFFeEIsR0FBRyxDQUFDLENBQWdCLFVBQW1CLEVBQW5CLEtBQUEsV0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBbkIsY0FBbUIsRUFBbkIsSUFBbUI7WUFBbEMsSUFBTSxPQUFLLFNBQUE7WUFDZCxHQUFHLENBQUMsQ0FBYSxVQUEwQixFQUExQixLQUFBLFdBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQUssQ0FBQyxDQUFDLEVBQTFCLGNBQTBCLEVBQTFCLElBQTBCO2dCQUF0QyxJQUFNLEVBQUUsU0FBQTtnQkFDWCxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQUssQ0FBQyxDQUFDO2FBQ3BCO1NBQ0Y7UUFFRCxJQUFNLE1BQU0sR0FBeUI7WUFDbkMsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLFdBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzlCLEdBQUcsS0FBQTtZQUNILE1BQU0sUUFBQTtZQUNOLEVBQUUsSUFBQTtTQUNILENBQUM7UUFFRixNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUEzSUQsQ0FBbUMsdUJBQVksR0EySTlDO0FBM0lZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtmaWVsZCwgRmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBZ2dyZWdhdGVUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGRpZmZlciwgZHVwbGljYXRlLCBrZXlzLCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vLi4vdW5pdCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmZ1bmN0aW9uIGFkZERpbWVuc2lvbihkaW1zOiB7W2ZpZWxkOiBzdHJpbmddOiBib29sZWFufSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGRpbXNbZmllbGQoZmllbGREZWYsIHt9KV0gPSB0cnVlO1xuICAgIGRpbXNbZmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnfSldID0gdHJ1ZTtcblxuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgZGltc1tmaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ3JhbmdlJ30pXSA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRpbXNbZmllbGQoZmllbGREZWYpXSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGRpbXM7XG59XG5cbmZ1bmN0aW9uIG1lcmdlTWVhc3VyZXMocGFyZW50TWVhc3VyZXM6IERpY3Q8RGljdDxzdHJpbmc+PiwgY2hpbGRNZWFzdXJlczogRGljdDxEaWN0PHN0cmluZz4+KSB7XG4gIGZvciAoY29uc3QgZiBpbiBjaGlsZE1lYXN1cmVzKSB7XG4gICAgaWYgKGNoaWxkTWVhc3VyZXMuaGFzT3duUHJvcGVydHkoZikpIHtcbiAgICAgIC8vIHdoZW4gd2UgbWVyZ2UgYSBtZWFzdXJlLCB3ZSBlaXRoZXIgaGF2ZSB0byBhZGQgYW4gYWdncmVnYXRpb24gb3BlcmF0b3Igb3IgZXZlbiBhIG5ldyBmaWVsZFxuICAgICAgY29uc3Qgb3BzID0gY2hpbGRNZWFzdXJlc1tmXTtcbiAgICAgIGZvciAoY29uc3Qgb3AgaW4gb3BzKSB7XG4gICAgICAgIGlmIChvcHMuaGFzT3duUHJvcGVydHkob3ApKSB7XG4gICAgICAgICAgaWYgKGYgaW4gcGFyZW50TWVhc3VyZXMpIHtcbiAgICAgICAgICAgIC8vIGFkZCBvcGVyYXRvciB0byBleGlzdGluZyBtZWFzdXJlIGZpZWxkXG4gICAgICAgICAgICBwYXJlbnRNZWFzdXJlc1tmXVtvcF0gPSBvcHNbb3BdO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnRNZWFzdXJlc1tmXSA9IHtvcDogb3BzW29wXX07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBjbGFzcyBBZ2dyZWdhdGVOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZSh7Li4udGhpcy5kaW1lbnNpb25zfSwgZHVwbGljYXRlKHRoaXMubWVhc3VyZXMpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0gZGltZW5zaW9ucyBzdHJpbmcgc2V0IGZvciBkaW1lbnNpb25zXG4gICAqIEBwYXJhbSBtZWFzdXJlcyBkaWN0aW9uYXJ5IG1hcHBpbmcgZmllbGQgbmFtZSA9PiBkaWN0IG9mIGFnZ3JlZ2F0aW9uIGZ1bmN0aW9ucyBhbmQgbmFtZXMgdG8gdXNlXG4gICAqL1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRpbWVuc2lvbnM6IFN0cmluZ1NldCwgcHJpdmF0ZSBtZWFzdXJlczogRGljdDx7W2tleSBpbiBBZ2dyZWdhdGVPcF0/OiBzdHJpbmd9Pikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcobW9kZWw6IFVuaXRNb2RlbCk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGxldCBpc0FnZ3JlZ2F0ZSA9IGZhbHNlO1xuICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZihmZCA9PiB7XG4gICAgICBpZiAoZmQuYWdncmVnYXRlKSB7XG4gICAgICAgIGlzQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG1lYXMgPSB7fTtcbiAgICBjb25zdCBkaW1zID0ge307XG5cbiAgICBpZiAoIWlzQWdncmVnYXRlKSB7XG4gICAgICAvLyBubyBuZWVkIHRvIGNyZWF0ZSB0aGlzIG5vZGUgaWYgdGhlIG1vZGVsIGhhcyBubyBhZ2dyZWdhdGlvblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKChmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IGZpZWxkKGZpZWxkRGVmLCB7YWdncmVnYXRlOiAnY291bnQnfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF0gPSBtZWFzW2ZpZWxkRGVmLmZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXVtmaWVsZERlZi5hZ2dyZWdhdGVdID0gZmllbGQoZmllbGREZWYpO1xuXG4gICAgICAgICAgLy8gRm9yIHNjYWxlIGNoYW5uZWwgd2l0aCBkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnLCBhZGQgbWluL21heCBzbyB3ZSBjYW4gdXNlIHRoZWlyIHVuaW9uIGFzIHVuYWdncmVnYXRlZCBkb21haW5cbiAgICAgICAgICBpZiAoaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgbW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCkgPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXVsnbWluJ10gPSBmaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ21pbid9KTtcbiAgICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdWydtYXgnXSA9IGZpZWxkKGZpZWxkRGVmLCB7YWdncmVnYXRlOiAnbWF4J30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkRGltZW5zaW9uKGRpbXMsIGNoYW5uZWwsIGZpZWxkRGVmKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgoa2V5cyhkaW1zKS5sZW5ndGggKyBrZXlzKG1lYXMpLmxlbmd0aCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShkaW1zLCBtZWFzKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0odDogQWdncmVnYXRlVHJhbnNmb3JtKTogQWdncmVnYXRlTm9kZSB7XG4gICAgY29uc3QgZGltcyA9IHt9O1xuICAgIGNvbnN0IG1lYXMgPSB7fTtcbiAgICBmb3IoY29uc3QgcyBvZiB0LmFnZ3JlZ2F0ZSkge1xuICAgICAgaWYgKHMub3ApIHtcbiAgICAgICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddWydjb3VudCddID0gcy5hcyB8fCBmaWVsZChzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW3MuZmllbGRdID0gbWVhc1tzLmZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW3MuZmllbGRdW3Mub3BdID0gcy5hcyB8fCBmaWVsZChzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvcihjb25zdCBzIG9mIHQuZ3JvdXBieSkge1xuICAgICAgZGltc1tzXSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgaWYgKCFkaWZmZXIodGhpcy5kaW1lbnNpb25zLCBvdGhlci5kaW1lbnNpb25zKSkge1xuICAgICAgbWVyZ2VNZWFzdXJlcyh0aGlzLm1lYXN1cmVzLCBvdGhlci5tZWFzdXJlcyk7XG4gICAgICBvdGhlci5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdkaWZmZXJlbnQgZGltZW5zaW9ucywgY2Fubm90IG1lcmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIGZpZWxkcy5mb3JFYWNoKGYgPT4gdGhpcy5kaW1lbnNpb25zW2ZdID0gdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLmRpbWVuc2lvbnMpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2gobSA9PiBvdXRbbV0gPSB0cnVlKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgIG91dFtgJHtvcH1fJHtmaWVsZH1gXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBhczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyh0aGlzLm1lYXN1cmVzKSkge1xuICAgICAgZm9yIChjb25zdCBvcCBvZiBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKSkge1xuICAgICAgICBhcy5wdXNoKHRoaXMubWVhc3VyZXNbZmllbGRdW29wXSk7XG4gICAgICAgIG9wcy5wdXNoKG9wKTtcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGtleXModGhpcy5kaW1lbnNpb25zKSxcbiAgICAgIG9wcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGFzXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==