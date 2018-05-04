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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBVSxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFXLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBTyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBWSxNQUFNLFlBQVksQ0FBQztBQUVwRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFM0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QyxzQkFBc0IsSUFBZ0MsRUFBRSxPQUFnQixFQUFFLFFBQTBCO0lBQ2xHLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdEQ7S0FDRjtTQUFNO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNoQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHVCQUF1QixjQUFrQyxFQUFFLGFBQWlDO0lBQzFGLEtBQUss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QTBCO2dCQUF0QyxJQUFNLEVBQUUsU0FBQTtnQkFDWCxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbEMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BCO1NBQ0Y7UUFFRCxJQUFNLE1BQU0sR0FBeUI7WUFDbkMsSUFBSSxFQUFFLFdBQVc7WUFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQzlCLEdBQUcsS0FBQTtZQUNILE1BQU0sUUFBQTtZQUNOLEVBQUUsSUFBQTtTQUNILENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBNUlELENBQW1DLFlBQVksR0E0STlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtBZ2dyZWdhdGVPcH0gZnJvbSAndmVnYSc7XG5cbmltcG9ydCB7Q2hhbm5lbCwgaXNTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwgZGlmZmVyLCBkdXBsaWNhdGUsIGtleXMsIFN0cmluZ1NldH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQWdncmVnYXRlVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2JpblJlcXVpcmVzUmFuZ2V9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi8uLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZnVuY3Rpb24gYWRkRGltZW5zaW9uKGRpbXM6IHtbZmllbGQ6IHN0cmluZ106IGJvb2xlYW59LCBjaGFubmVsOiBDaGFubmVsLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPikge1xuICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7fSldID0gdHJ1ZTtcbiAgICBkaW1zW3ZnRmllbGQoZmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnfSldID0gdHJ1ZTtcblxuICAgIGlmIChiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSkge1xuICAgICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAncmFuZ2UnfSldID0gdHJ1ZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmKV0gPSB0cnVlO1xuICB9XG4gIHJldHVybiBkaW1zO1xufVxuXG5mdW5jdGlvbiBtZXJnZU1lYXN1cmVzKHBhcmVudE1lYXN1cmVzOiBEaWN0PERpY3Q8c3RyaW5nPj4sIGNoaWxkTWVhc3VyZXM6IERpY3Q8RGljdDxzdHJpbmc+Pikge1xuICBmb3IgKGNvbnN0IGYgaW4gY2hpbGRNZWFzdXJlcykge1xuICAgIGlmIChjaGlsZE1lYXN1cmVzLmhhc093blByb3BlcnR5KGYpKSB7XG4gICAgICAvLyB3aGVuIHdlIG1lcmdlIGEgbWVhc3VyZSwgd2UgZWl0aGVyIGhhdmUgdG8gYWRkIGFuIGFnZ3JlZ2F0aW9uIG9wZXJhdG9yIG9yIGV2ZW4gYSBuZXcgZmllbGRcbiAgICAgIGNvbnN0IG9wcyA9IGNoaWxkTWVhc3VyZXNbZl07XG4gICAgICBmb3IgKGNvbnN0IG9wIGluIG9wcykge1xuICAgICAgICBpZiAob3BzLmhhc093blByb3BlcnR5KG9wKSkge1xuICAgICAgICAgIGlmIChmIGluIHBhcmVudE1lYXN1cmVzKSB7XG4gICAgICAgICAgICAvLyBhZGQgb3BlcmF0b3IgdG8gZXhpc3RpbmcgbWVhc3VyZSBmaWVsZFxuICAgICAgICAgICAgcGFyZW50TWVhc3VyZXNbZl1bb3BdID0gb3BzW29wXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50TWVhc3VyZXNbZl0gPSB7b3A6IG9wc1tvcF19O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgY2xhc3MgQWdncmVnYXRlTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUobnVsbCwgey4uLnRoaXMuZGltZW5zaW9uc30sIGR1cGxpY2F0ZSh0aGlzLm1lYXN1cmVzKSk7XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIGRpbWVuc2lvbnMgc3RyaW5nIHNldCBmb3IgZGltZW5zaW9uc1xuICAgKiBAcGFyYW0gbWVhc3VyZXMgZGljdGlvbmFyeSBtYXBwaW5nIGZpZWxkIG5hbWUgPT4gZGljdCBvZiBhZ2dyZWdhdGlvbiBmdW5jdGlvbnMgYW5kIG5hbWVzIHRvIHVzZVxuICAgKi9cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHByaXZhdGUgZGltZW5zaW9uczogU3RyaW5nU2V0LCBwcml2YXRlIG1lYXN1cmVzOiBEaWN0PHtba2V5IGluIEFnZ3JlZ2F0ZU9wXT86IHN0cmluZ30+KSB7XG4gICAgc3VwZXIocGFyZW50KTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21FbmNvZGluZyhwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IFVuaXRNb2RlbCk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGxldCBpc0FnZ3JlZ2F0ZSA9IGZhbHNlO1xuICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZihmZCA9PiB7XG4gICAgICBpZiAoZmQuYWdncmVnYXRlKSB7XG4gICAgICAgIGlzQWdncmVnYXRlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNvbnN0IG1lYXMgPSB7fTtcbiAgICBjb25zdCBkaW1zID0ge307XG5cbiAgICBpZiAoIWlzQWdncmVnYXRlKSB7XG4gICAgICAvLyBubyBuZWVkIHRvIGNyZWF0ZSB0aGlzIG5vZGUgaWYgdGhlIG1vZGVsIGhhcyBubyBhZ2dyZWdhdGlvblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbW9kZWwuZm9yRWFjaEZpZWxkRGVmKChmaWVsZERlZiwgY2hhbm5lbCkgPT4ge1xuICAgICAgaWYgKGZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBpZiAoZmllbGREZWYuYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IHZnRmllbGQoZmllbGREZWYsIHthZ2dyZWdhdGU6ICdjb3VudCd9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZWFzW2ZpZWxkRGVmLmZpZWxkXSA9IG1lYXNbZmllbGREZWYuZmllbGRdIHx8IHt9O1xuICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0gPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcblxuICAgICAgICAgIC8vIEZvciBzY2FsZSBjaGFubmVsIHdpdGggZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJywgYWRkIG1pbi9tYXggc28gd2UgY2FuIHVzZSB0aGVpciB1bmlvbiBhcyB1bmFnZ3JlZ2F0ZWQgZG9tYWluXG4gICAgICAgICAgaWYgKGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpICYmIG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgICAgICAgICAgbWVhc1tmaWVsZERlZi5maWVsZF1bJ21pbiddID0gdmdGaWVsZChmaWVsZERlZiwge2FnZ3JlZ2F0ZTogJ21pbid9KTtcbiAgICAgICAgICAgIG1lYXNbZmllbGREZWYuZmllbGRdWydtYXgnXSA9IHZnRmllbGQoZmllbGREZWYsIHthZ2dyZWdhdGU6ICdtYXgnfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZGREaW1lbnNpb24oZGltcywgY2hhbm5lbCwgZmllbGREZWYpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKHBhcmVudCwgZGltcywgbWVhcyk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tVHJhbnNmb3JtKHBhcmVudDogRGF0YUZsb3dOb2RlLCB0OiBBZ2dyZWdhdGVUcmFuc2Zvcm0pOiBBZ2dyZWdhdGVOb2RlIHtcbiAgICBjb25zdCBkaW1zID0ge307XG4gICAgY29uc3QgbWVhcyA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBzIG9mIHQuYWdncmVnYXRlKSB7XG4gICAgICBpZiAocy5vcCkge1xuICAgICAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIG1lYXNbJyonXSA9IG1lYXNbJyonXSB8fCB7fTtcbiAgICAgICAgICBtZWFzWycqJ11bJ2NvdW50J10gPSBzLmFzIHx8IHZnRmllbGQocyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVhc1tzLmZpZWxkXSA9IG1lYXNbcy5maWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tzLmZpZWxkXVtzLm9wXSA9IHMuYXMgfHwgdmdGaWVsZChzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcyBvZiB0Lmdyb3VwYnkgfHwgW10pIHtcbiAgICAgIGRpbXNbc10gPSB0cnVlO1xuICAgIH1cblxuICAgIGlmICgoa2V5cyhkaW1zKS5sZW5ndGggKyBrZXlzKG1lYXMpLmxlbmd0aCkgPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgQWdncmVnYXRlTm9kZShwYXJlbnQsIGRpbXMsIG1lYXMpO1xuICB9XG5cbiAgcHVibGljIG1lcmdlKG90aGVyOiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgaWYgKCFkaWZmZXIodGhpcy5kaW1lbnNpb25zLCBvdGhlci5kaW1lbnNpb25zKSkge1xuICAgICAgbWVyZ2VNZWFzdXJlcyh0aGlzLm1lYXN1cmVzLCBvdGhlci5tZWFzdXJlcyk7XG4gICAgICBvdGhlci5yZW1vdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLmRlYnVnKCdkaWZmZXJlbnQgZGltZW5zaW9ucywgY2Fubm90IG1lcmdlJyk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIGZpZWxkcy5mb3JFYWNoKGYgPT4gdGhpcy5kaW1lbnNpb25zW2ZdID0gdHJ1ZSk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAga2V5cyh0aGlzLmRpbWVuc2lvbnMpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2gobSA9PiBvdXRbbV0gPSB0cnVlKTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMubWVhc3VyZXMpLmZvckVhY2goZmllbGQgPT4ge1xuICAgICAga2V5cyh0aGlzLm1lYXN1cmVzW2ZpZWxkXSkuZm9yRWFjaChvcCA9PiB7XG4gICAgICAgIG91dFtgJHtvcH1fJHtmaWVsZH1gXSA9IHRydWU7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0ge1xuICAgIGNvbnN0IG9wczogQWdncmVnYXRlT3BbXSA9IFtdO1xuICAgIGNvbnN0IGZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBhczogc3RyaW5nW10gPSBbXTtcblxuICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyh0aGlzLm1lYXN1cmVzKSkge1xuICAgICAgZm9yIChjb25zdCBvcCBvZiBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKSkge1xuICAgICAgICBhcy5wdXNoKHRoaXMubWVhc3VyZXNbZmllbGRdW29wXSk7XG4gICAgICAgIG9wcy5wdXNoKG9wKTtcbiAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHJlc3VsdDogVmdBZ2dyZWdhdGVUcmFuc2Zvcm0gPSB7XG4gICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgIGdyb3VwYnk6IGtleXModGhpcy5kaW1lbnNpb25zKSxcbiAgICAgIG9wcyxcbiAgICAgIGZpZWxkcyxcbiAgICAgIGFzXG4gICAgfTtcblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cbiJdfQ==