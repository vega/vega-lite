import * as tslib_1 from "tslib";
import { isScaleChannel } from '../../channel';
import { vgField } from '../../fielddef';
import * as log from '../../log';
import { differ, duplicate, keys } from '../../util';
import { binRequiresRange } from '../common';
import { DataFlowNode } from './dataflow';
function addDimension(dims, channel, fieldDef) {
    if (fieldDef.bin) {
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
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = vgField(fieldDef, { aggregate: 'count' });
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = vgField(fieldDef);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[fieldDef.field]['min'] = vgField(fieldDef, { aggregate: 'min' });
                        meas[fieldDef.field]['max'] = vgField(fieldDef, { aggregate: 'max' });
                    }
                }
            }
            else {
                addDimension(dims, channel, fieldDef);
            }
        });
        if ((keys(dims).length + keys(meas).length) === 0) {
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
                    meas['*']['count'] = s.as || vgField(s);
                }
                else {
                    meas[s.field] = meas[s.field] || {};
                    meas[s.field][s.op] = s.as || vgField(s);
                }
            }
        }
        for (var _b = 0, _c = t.groupby || []; _b < _c.length; _b++) {
            var s = _c[_b];
            dims[s] = true;
        }
        if ((keys(dims).length + keys(meas).length) === 0) {
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
        fields.forEach(function (f) { return _this.dimensions[f] = true; });
    };
    AggregateNode.prototype.dependentFields = function () {
        var out = {};
        keys(this.dimensions).forEach(function (f) { return out[f] = true; });
        keys(this.measures).forEach(function (m) { return out[m] = true; });
        return out;
    };
    AggregateNode.prototype.producedFields = function () {
        var _this = this;
        var out = {};
        keys(this.measures).forEach(function (field) {
            keys(_this.measures[field]).forEach(function (op) {
                out[op + "_" + field] = true;
            });
        });
        return out;
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
                fields.push(field);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLE9BQU8sRUFBVSxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFXLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBTyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBWSxNQUFNLFlBQVksQ0FBQztBQUVwRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFM0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QyxzQkFBc0IsSUFBZ0MsRUFBRSxPQUFnQixFQUFFLFFBQTBCO0lBQ2xHLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdEQ7S0FDRjtTQUFNO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNoQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHVCQUF1QixjQUFrQyxFQUFFLGFBQWlDO0lBQzFGLEtBQUss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QTBCO2dCQUF0QyxJQUFNLEVBQUUsU0FBQTtnQkFDWCxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BCO1NBQ0Y7UUFFRCxJQUFNLE1BQU0sR0FBeUI7WUFDbkMsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzlCLEdBQUcsS0FBQTtZQUNILE1BQU0sUUFBQTtZQUNOLEVBQUUsSUFBQTtTQUNILENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBNUlELENBQW1DLFlBQVksR0E0STlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5pbXBvcnQge0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBZ2dyZWdhdGVUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGRpZmZlciwgZHVwbGljYXRlLCBrZXlzLCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vLi4vdW5pdCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmZ1bmN0aW9uIGFkZERpbWVuc2lvbihkaW1zOiB7W2ZpZWxkOiBzdHJpbmddOiBib29sZWFufSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge30pXSA9IHRydWU7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnZW5kJ30pXSA9IHRydWU7XG5cbiAgICBpZiAoYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZiwgY2hhbm5lbCkpIHtcbiAgICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ3JhbmdlJ30pXSA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZildID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZGltcztcbn1cblxuZnVuY3Rpb24gbWVyZ2VNZWFzdXJlcyhwYXJlbnRNZWFzdXJlczogRGljdDxEaWN0PHN0cmluZz4+LCBjaGlsZE1lYXN1cmVzOiBEaWN0PERpY3Q8c3RyaW5nPj4pIHtcbiAgZm9yIChjb25zdCBmIGluIGNoaWxkTWVhc3VyZXMpIHtcbiAgICBpZiAoY2hpbGRNZWFzdXJlcy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgLy8gd2hlbiB3ZSBtZXJnZSBhIG1lYXN1cmUsIHdlIGVpdGhlciBoYXZlIHRvIGFkZCBhbiBhZ2dyZWdhdGlvbiBvcGVyYXRvciBvciBldmVuIGEgbmV3IGZpZWxkXG4gICAgICBjb25zdCBvcHMgPSBjaGlsZE1lYXN1cmVzW2ZdO1xuICAgICAgZm9yIChjb25zdCBvcCBpbiBvcHMpIHtcbiAgICAgICAgaWYgKG9wcy5oYXNPd25Qcm9wZXJ0eShvcCkpIHtcbiAgICAgICAgICBpZiAoZiBpbiBwYXJlbnRNZWFzdXJlcykge1xuICAgICAgICAgICAgLy8gYWRkIG9wZXJhdG9yIHRvIGV4aXN0aW5nIG1lYXN1cmUgZmllbGRcbiAgICAgICAgICAgIHBhcmVudE1lYXN1cmVzW2ZdW29wXSA9IG9wc1tvcF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE1lYXN1cmVzW2ZdID0ge29wOiBvcHNbb3BdfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0ZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKG51bGwsIHsuLi50aGlzLmRpbWVuc2lvbnN9LCBkdXBsaWNhdGUodGhpcy5tZWFzdXJlcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBkaW1lbnNpb25zIHN0cmluZyBzZXQgZm9yIGRpbWVuc2lvbnNcbiAgICogQHBhcmFtIG1lYXN1cmVzIGRpY3Rpb25hcnkgbWFwcGluZyBmaWVsZCBuYW1lID0+IGRpY3Qgb2YgYWdncmVnYXRpb24gZnVuY3Rpb25zIGFuZCBuYW1lcyB0byB1c2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIGRpbWVuc2lvbnM6IFN0cmluZ1NldCwgcHJpdmF0ZSBtZWFzdXJlczogRGljdDx7W2tleSBpbiBBZ2dyZWdhdGVPcF0/OiBzdHJpbmd9Pikge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBVbml0TW9kZWwpOiBBZ2dyZWdhdGVOb2RlIHtcbiAgICBsZXQgaXNBZ2dyZWdhdGUgPSBmYWxzZTtcbiAgICBtb2RlbC5mb3JFYWNoRmllbGREZWYoZmQgPT4ge1xuICAgICAgaWYgKGZkLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBpc0FnZ3JlZ2F0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBtZWFzID0ge307XG4gICAgY29uc3QgZGltcyA9IHt9O1xuXG4gICAgaWYgKCFpc0FnZ3JlZ2F0ZSkge1xuICAgICAgLy8gbm8gbmVlZCB0byBjcmVhdGUgdGhpcyBub2RlIGlmIHRoZSBtb2RlbCBoYXMgbm8gYWdncmVnYXRpb25cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZigoZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGlmIChmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICAgICAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ11bJ2NvdW50J10gPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7YWdncmVnYXRlOiAnY291bnQnfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF0gPSBtZWFzW2ZpZWxkRGVmLmZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXVtmaWVsZERlZi5hZ2dyZWdhdGVdID0gdmdGaWVsZChmaWVsZERlZik7XG5cbiAgICAgICAgICAvLyBGb3Igc2NhbGUgY2hhbm5lbCB3aXRoIGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcsIGFkZCBtaW4vbWF4IHNvIHdlIGNhbiB1c2UgdGhlaXIgdW5pb24gYXMgdW5hZ2dyZWdhdGVkIGRvbWFpblxuICAgICAgICAgIGlmIChpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSAmJiBtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdWydtaW4nXSA9IHZnRmllbGQoZmllbGREZWYsIHthZ2dyZWdhdGU6ICdtaW4nfSk7XG4gICAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXVsnbWF4J10gPSB2Z0ZpZWxkKGZpZWxkRGVmLCB7YWdncmVnYXRlOiAnbWF4J30pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYWRkRGltZW5zaW9uKGRpbXMsIGNoYW5uZWwsIGZpZWxkRGVmKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGlmICgoa2V5cyhkaW1zKS5sZW5ndGggKyBrZXlzKG1lYXMpLmxlbmd0aCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShwYXJlbnQsIGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgdDogQWdncmVnYXRlVHJhbnNmb3JtKTogQWdncmVnYXRlTm9kZSB7XG4gICAgY29uc3QgZGltcyA9IHt9O1xuICAgIGNvbnN0IG1lYXMgPSB7fTtcblxuICAgIGZvciAoY29uc3QgcyBvZiB0LmFnZ3JlZ2F0ZSkge1xuICAgICAgaWYgKHMub3ApIHtcbiAgICAgICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICBtZWFzWycqJ10gPSBtZWFzWycqJ10gfHwge307XG4gICAgICAgICAgbWVhc1snKiddWydjb3VudCddID0gcy5hcyB8fCB2Z0ZpZWxkKHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbcy5maWVsZF0gPSBtZWFzW3MuZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbcy5maWVsZF1bcy5vcF0gPSBzLmFzIHx8IHZnRmllbGQocyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHMgb2YgdC5ncm91cGJ5IHx8IFtdKSB7XG4gICAgICBkaW1zW3NdID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoKGtleXMoZGltcykubGVuZ3RoICsga2V5cyhtZWFzKS5sZW5ndGgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUocGFyZW50LCBkaW1zLCBtZWFzKTtcbiAgfVxuXG4gIHB1YmxpYyBtZXJnZShvdGhlcjogQWdncmVnYXRlTm9kZSkge1xuICAgIGlmICghZGlmZmVyKHRoaXMuZGltZW5zaW9ucywgb3RoZXIuZGltZW5zaW9ucykpIHtcbiAgICAgIG1lcmdlTWVhc3VyZXModGhpcy5tZWFzdXJlcywgb3RoZXIubWVhc3VyZXMpO1xuICAgICAgb3RoZXIucmVtb3ZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy5kZWJ1ZygnZGlmZmVyZW50IGRpbWVuc2lvbnMsIGNhbm5vdCBtZXJnZScpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBhZGREaW1lbnNpb25zKGZpZWxkczogc3RyaW5nW10pIHtcbiAgICBmaWVsZHMuZm9yRWFjaChmID0+IHRoaXMuZGltZW5zaW9uc1tmXSA9IHRydWUpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIGtleXModGhpcy5kaW1lbnNpb25zKS5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAga2V5cyh0aGlzLm1lYXN1cmVzKS5mb3JFYWNoKG0gPT4gb3V0W21dID0gdHJ1ZSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLm1lYXN1cmVzKS5mb3JFYWNoKGZpZWxkID0+IHtcbiAgICAgIGtleXModGhpcy5tZWFzdXJlc1tmaWVsZF0pLmZvckVhY2gob3AgPT4ge1xuICAgICAgICBvdXRbYCR7b3B9XyR7ZmllbGR9YF0gPSB0cnVlO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnQWdncmVnYXRlVHJhbnNmb3JtIHtcbiAgICBjb25zdCBvcHM6IEFnZ3JlZ2F0ZU9wW10gPSBbXTtcbiAgICBjb25zdCBmaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3QgYXM6IHN0cmluZ1tdID0gW107XG5cbiAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXModGhpcy5tZWFzdXJlcykpIHtcbiAgICAgIGZvciAoY29uc3Qgb3Agb2Yga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkpIHtcbiAgICAgICAgYXMucHVzaCh0aGlzLm1lYXN1cmVzW2ZpZWxkXVtvcF0pO1xuICAgICAgICBvcHMucHVzaChvcCk7XG4gICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCByZXN1bHQ6IFZnQWdncmVnYXRlVHJhbnNmb3JtID0ge1xuICAgICAgdHlwZTogJ2FnZ3JlZ2F0ZScsXG4gICAgICBncm91cGJ5OiBrZXlzKHRoaXMuZGltZW5zaW9ucyksXG4gICAgICBvcHMsXG4gICAgICBmaWVsZHMsXG4gICAgICBhc1xuICAgIH07XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG4iXX0=