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
            var aggregate = fieldDef.aggregate, field = fieldDef.field;
            if (aggregate) {
                if (aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = vgField(fieldDef);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][aggregate] = vgField(fieldDef);
                    // For scale channel with domain === 'unaggregated', add min/max so we can use their union as unaggregated domain
                    if (isScaleChannel(channel) && model.scaleDomain(channel) === 'unaggregated') {
                        meas[field]['min'] = vgField({ field: field, aggregate: 'min' });
                        meas[field]['max'] = vgField({ field: field, aggregate: 'max' });
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
            var op = s.op, field = s.field, as = s.as;
            if (op) {
                if (op === 'count') {
                    meas['*'] = meas['*'] || {};
                    meas['*']['count'] = as || vgField(s);
                }
                else {
                    meas[field] = meas[field] || {};
                    meas[field][op] = as || vgField(s);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUVBLE9BQU8sRUFBVSxjQUFjLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFDdEQsT0FBTyxFQUFXLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2pELE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBRWpDLE9BQU8sRUFBTyxNQUFNLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBWSxNQUFNLFlBQVksQ0FBQztBQUVwRSxPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFM0MsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUV4QyxzQkFBc0IsSUFBZ0MsRUFBRSxPQUFnQixFQUFFLFFBQTBCO0lBQ2xHLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtRQUNoQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBRW5ELElBQUksZ0JBQWdCLENBQUMsUUFBUSxFQUFFLE9BQU8sQ0FBQyxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7U0FDdEQ7S0FDRjtTQUFNO1FBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNoQztJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHVCQUF1QixjQUFrQyxFQUFFLGFBQWlDO0lBQzFGLEtBQUssSUFBTSxDQUFDLElBQUksYUFBYSxFQUFFO1FBQzdCLElBQUksYUFBYSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuQyw2RkFBNkY7WUFDN0YsSUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLEtBQUssSUFBTSxFQUFFLElBQUksR0FBRyxFQUFFO2dCQUNwQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLEVBQUU7b0JBQzFCLElBQUksQ0FBQyxJQUFJLGNBQWMsRUFBRTt3QkFDdkIseUNBQXlDO3dCQUN6QyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO3FCQUNqQzt5QkFBTTt3QkFDTCxjQUFjLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUM7cUJBQ25DO2lCQUNGO2FBQ0Y7U0FDRjtLQUNGO0FBQ0gsQ0FBQztBQUVEO0lBQW1DLHlDQUFZO0lBSzdDOzs7T0FHRztJQUNILHVCQUFZLE1BQW9CLEVBQVUsVUFBcUIsRUFBVSxRQUErQztRQUF4SCxZQUNFLGtCQUFNLE1BQU0sQ0FBQyxTQUNkO1FBRnlDLGdCQUFVLEdBQVYsVUFBVSxDQUFXO1FBQVUsY0FBUSxHQUFSLFFBQVEsQ0FBdUM7O0lBRXhILENBQUM7SUFWTSw2QkFBSyxHQUFaO1FBQ0UsT0FBTyxJQUFJLGFBQWEsQ0FBQyxJQUFJLHVCQUFNLElBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2pGLENBQUM7SUFVYSw4QkFBZ0IsR0FBOUIsVUFBK0IsTUFBb0IsRUFBRSxLQUFnQjtRQUNuRSxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDeEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFBLEVBQUU7WUFDdEIsSUFBSSxFQUFFLENBQUMsU0FBUyxFQUFFO2dCQUNoQixXQUFXLEdBQUcsSUFBSSxDQUFDO2FBQ3BCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBRWhCLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDaEIsOERBQThEO1lBQzlELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxLQUFLLENBQUMsZUFBZSxDQUFDLFVBQUMsUUFBUSxFQUFFLE9BQU87WUFDL0IsSUFBQSw4QkFBUyxFQUFFLHNCQUFLLENBQWE7WUFDcEMsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsSUFBSSxTQUFTLEtBQUssT0FBTyxFQUFFO29CQUN6QixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztpQkFDeEM7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ2hDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBRTNDLGlIQUFpSDtvQkFDakgsSUFBSSxjQUFjLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsS0FBSyxjQUFjLEVBQUU7d0JBQzVFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzt3QkFDeEQsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO3FCQUN6RDtpQkFDRjthQUNGO2lCQUFNO2dCQUNMLFlBQVksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2FBQ3ZDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2pELE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFFRCxPQUFPLElBQUksYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVhLCtCQUFpQixHQUEvQixVQUFnQyxNQUFvQixFQUFFLENBQXFCO1FBQ3pFLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNoQixJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFFaEIsS0FBZ0IsVUFBVyxFQUFYLEtBQUEsQ0FBQyxDQUFDLFNBQVMsRUFBWCxjQUFXLEVBQVgsSUFBVztZQUF0QixJQUFNLENBQUMsU0FBQTtZQUNILElBQUEsU0FBRSxFQUFFLGVBQUssRUFBRSxTQUFFLENBQU07WUFDMUIsSUFBSSxFQUFFLEVBQUU7Z0JBQ04sSUFBSSxFQUFFLEtBQUssT0FBTyxFQUFFO29CQUNsQixJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDNUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZDO3FCQUFNO29CQUNMLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEM7YUFDRjtTQUNGO1FBRUQsS0FBZ0IsVUFBZSxFQUFmLEtBQUEsQ0FBQyxDQUFDLE9BQU8sSUFBSSxFQUFFLEVBQWYsY0FBZSxFQUFmLElBQWU7WUFBMUIsSUFBTSxDQUFDLFNBQUE7WUFDVixJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ2hCO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUNqRCxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFTSw2QkFBSyxHQUFaLFVBQWEsS0FBb0I7UUFDL0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUM5QyxhQUFhLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDN0MsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO1NBQ2hCO2FBQU07WUFDTCxHQUFHLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBRU0scUNBQWEsR0FBcEIsVUFBcUIsTUFBZ0I7UUFBckMsaUJBRUM7UUFEQyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsS0FBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQXpCLENBQXlCLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRU0sdUNBQWUsR0FBdEI7UUFDRSxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQWIsQ0FBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFiLENBQWEsQ0FBQyxDQUFDO1FBRWhELE9BQU8sR0FBRyxDQUFDO0lBQ2IsQ0FBQztJQUVNLHNDQUFjLEdBQXJCO1FBQUEsaUJBVUM7UUFUQyxJQUFNLEdBQUcsR0FBRyxFQUFFLENBQUM7UUFFZixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLEtBQUs7WUFDL0IsSUFBSSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxFQUFFO2dCQUNuQyxHQUFHLENBQUksRUFBRSxTQUFJLEtBQU8sQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMvQixDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sZ0NBQVEsR0FBZjtRQUNFLElBQU0sR0FBRyxHQUFrQixFQUFFLENBQUM7UUFDOUIsSUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO1FBQzVCLElBQU0sRUFBRSxHQUFhLEVBQUUsQ0FBQztRQUV4QixLQUFvQixVQUFtQixFQUFuQixLQUFBLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQW5CLGNBQW1CLEVBQW5CLElBQW1CO1lBQWxDLElBQU0sS0FBSyxTQUFBO1lBQ2QsS0FBaUIsVUFBMEIsRUFBMUIsS0FBQSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQjtnQkFBdEMsSUFBTSxFQUFFLFNBQUE7Z0JBQ1gsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2xDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNwQjtTQUNGO1FBRUQsSUFBTSxNQUFNLEdBQXlCO1lBQ25DLElBQUksRUFBRSxXQUFXO1lBQ2pCLE9BQU8sRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUM5QixHQUFHLEtBQUE7WUFDSCxNQUFNLFFBQUE7WUFDTixFQUFFLElBQUE7U0FDSCxDQUFDO1FBRUYsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTlJRCxDQUFtQyxZQUFZLEdBOEk5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QWdncmVnYXRlT3B9IGZyb20gJ3ZlZ2EnO1xuXG5pbXBvcnQge0NoYW5uZWwsIGlzU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7RmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtBZ2dyZWdhdGVUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGRpZmZlciwgZHVwbGljYXRlLCBrZXlzLCBTdHJpbmdTZXR9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vLi4vdW5pdCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbmZ1bmN0aW9uIGFkZERpbWVuc2lvbihkaW1zOiB7W2ZpZWxkOiBzdHJpbmddOiBib29sZWFufSwgY2hhbm5lbDogQ2hhbm5lbCwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4pIHtcbiAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge30pXSA9IHRydWU7XG4gICAgZGltc1t2Z0ZpZWxkKGZpZWxkRGVmLCB7YmluU3VmZml4OiAnZW5kJ30pXSA9IHRydWU7XG5cbiAgICBpZiAoYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZiwgY2hhbm5lbCkpIHtcbiAgICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZiwge2JpblN1ZmZpeDogJ3JhbmdlJ30pXSA9IHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRpbXNbdmdGaWVsZChmaWVsZERlZildID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZGltcztcbn1cblxuZnVuY3Rpb24gbWVyZ2VNZWFzdXJlcyhwYXJlbnRNZWFzdXJlczogRGljdDxEaWN0PHN0cmluZz4+LCBjaGlsZE1lYXN1cmVzOiBEaWN0PERpY3Q8c3RyaW5nPj4pIHtcbiAgZm9yIChjb25zdCBmIGluIGNoaWxkTWVhc3VyZXMpIHtcbiAgICBpZiAoY2hpbGRNZWFzdXJlcy5oYXNPd25Qcm9wZXJ0eShmKSkge1xuICAgICAgLy8gd2hlbiB3ZSBtZXJnZSBhIG1lYXN1cmUsIHdlIGVpdGhlciBoYXZlIHRvIGFkZCBhbiBhZ2dyZWdhdGlvbiBvcGVyYXRvciBvciBldmVuIGEgbmV3IGZpZWxkXG4gICAgICBjb25zdCBvcHMgPSBjaGlsZE1lYXN1cmVzW2ZdO1xuICAgICAgZm9yIChjb25zdCBvcCBpbiBvcHMpIHtcbiAgICAgICAgaWYgKG9wcy5oYXNPd25Qcm9wZXJ0eShvcCkpIHtcbiAgICAgICAgICBpZiAoZiBpbiBwYXJlbnRNZWFzdXJlcykge1xuICAgICAgICAgICAgLy8gYWRkIG9wZXJhdG9yIHRvIGV4aXN0aW5nIG1lYXN1cmUgZmllbGRcbiAgICAgICAgICAgIHBhcmVudE1lYXN1cmVzW2ZdW29wXSA9IG9wc1tvcF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudE1lYXN1cmVzW2ZdID0ge29wOiBvcHNbb3BdfTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIEFnZ3JlZ2F0ZU5vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKG51bGwsIHsuLi50aGlzLmRpbWVuc2lvbnN9LCBkdXBsaWNhdGUodGhpcy5tZWFzdXJlcykpO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSBkaW1lbnNpb25zIHN0cmluZyBzZXQgZm9yIGRpbWVuc2lvbnNcbiAgICogQHBhcmFtIG1lYXN1cmVzIGRpY3Rpb25hcnkgbWFwcGluZyBmaWVsZCBuYW1lID0+IGRpY3Qgb2YgYWdncmVnYXRpb24gZnVuY3Rpb25zIGFuZCBuYW1lcyB0byB1c2VcbiAgICovXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBwcml2YXRlIGRpbWVuc2lvbnM6IFN0cmluZ1NldCwgcHJpdmF0ZSBtZWFzdXJlczogRGljdDx7W2tleSBpbiBBZ2dyZWdhdGVPcF0/OiBzdHJpbmd9Pikge1xuICAgIHN1cGVyKHBhcmVudCk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBVbml0TW9kZWwpOiBBZ2dyZWdhdGVOb2RlIHtcbiAgICBsZXQgaXNBZ2dyZWdhdGUgPSBmYWxzZTtcbiAgICBtb2RlbC5mb3JFYWNoRmllbGREZWYoZmQgPT4ge1xuICAgICAgaWYgKGZkLmFnZ3JlZ2F0ZSkge1xuICAgICAgICBpc0FnZ3JlZ2F0ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBtZWFzID0ge307XG4gICAgY29uc3QgZGltcyA9IHt9O1xuXG4gICAgaWYgKCFpc0FnZ3JlZ2F0ZSkge1xuICAgICAgLy8gbm8gbmVlZCB0byBjcmVhdGUgdGhpcyBub2RlIGlmIHRoZSBtb2RlbCBoYXMgbm8gYWdncmVnYXRpb25cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIG1vZGVsLmZvckVhY2hGaWVsZERlZigoZmllbGREZWYsIGNoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IHthZ2dyZWdhdGUsIGZpZWxkfSA9IGZpZWxkRGVmO1xuICAgICAgaWYgKGFnZ3JlZ2F0ZSkge1xuICAgICAgICBpZiAoYWdncmVnYXRlID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IHZnRmllbGQoZmllbGREZWYpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1lYXNbZmllbGRdID0gbWVhc1tmaWVsZF0gfHwge307XG4gICAgICAgICAgbWVhc1tmaWVsZF1bYWdncmVnYXRlXSA9IHZnRmllbGQoZmllbGREZWYpO1xuXG4gICAgICAgICAgLy8gRm9yIHNjYWxlIGNoYW5uZWwgd2l0aCBkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnLCBhZGQgbWluL21heCBzbyB3ZSBjYW4gdXNlIHRoZWlyIHVuaW9uIGFzIHVuYWdncmVnYXRlZCBkb21haW5cbiAgICAgICAgICBpZiAoaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgJiYgbW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCkgPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgICAgICAgICBtZWFzW2ZpZWxkXVsnbWluJ10gPSB2Z0ZpZWxkKHtmaWVsZCwgYWdncmVnYXRlOiAnbWluJ30pO1xuICAgICAgICAgICAgbWVhc1tmaWVsZF1bJ21heCddID0gdmdGaWVsZCh7ZmllbGQsIGFnZ3JlZ2F0ZTogJ21heCd9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGFkZERpbWVuc2lvbihkaW1zLCBjaGFubmVsLCBmaWVsZERlZik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBpZiAoKGtleXMoZGltcykubGVuZ3RoICsga2V5cyhtZWFzKS5sZW5ndGgpID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IEFnZ3JlZ2F0ZU5vZGUocGFyZW50LCBkaW1zLCBtZWFzKTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHQ6IEFnZ3JlZ2F0ZVRyYW5zZm9ybSk6IEFnZ3JlZ2F0ZU5vZGUge1xuICAgIGNvbnN0IGRpbXMgPSB7fTtcbiAgICBjb25zdCBtZWFzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IHMgb2YgdC5hZ2dyZWdhdGUpIHtcbiAgICAgIGNvbnN0IHtvcCwgZmllbGQsIGFzfSA9IHM7XG4gICAgICBpZiAob3ApIHtcbiAgICAgICAgaWYgKG9wID09PSAnY291bnQnKSB7XG4gICAgICAgICAgbWVhc1snKiddID0gbWVhc1snKiddIHx8IHt9O1xuICAgICAgICAgIG1lYXNbJyonXVsnY291bnQnXSA9IGFzIHx8IHZnRmllbGQocyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWVhc1tmaWVsZF0gPSBtZWFzW2ZpZWxkXSB8fCB7fTtcbiAgICAgICAgICBtZWFzW2ZpZWxkXVtvcF0gPSBhcyB8fCB2Z0ZpZWxkKHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBzIG9mIHQuZ3JvdXBieSB8fCBbXSkge1xuICAgICAgZGltc1tzXSA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKChrZXlzKGRpbXMpLmxlbmd0aCArIGtleXMobWVhcykubGVuZ3RoKSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBBZ2dyZWdhdGVOb2RlKHBhcmVudCwgZGltcywgbWVhcyk7XG4gIH1cblxuICBwdWJsaWMgbWVyZ2Uob3RoZXI6IEFnZ3JlZ2F0ZU5vZGUpIHtcbiAgICBpZiAoIWRpZmZlcih0aGlzLmRpbWVuc2lvbnMsIG90aGVyLmRpbWVuc2lvbnMpKSB7XG4gICAgICBtZXJnZU1lYXN1cmVzKHRoaXMubWVhc3VyZXMsIG90aGVyLm1lYXN1cmVzKTtcbiAgICAgIG90aGVyLnJlbW92ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cuZGVidWcoJ2RpZmZlcmVudCBkaW1lbnNpb25zLCBjYW5ub3QgbWVyZ2UnKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYWRkRGltZW5zaW9ucyhmaWVsZHM6IHN0cmluZ1tdKSB7XG4gICAgZmllbGRzLmZvckVhY2goZiA9PiB0aGlzLmRpbWVuc2lvbnNbZl0gPSB0cnVlKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBrZXlzKHRoaXMuZGltZW5zaW9ucykuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpO1xuICAgIGtleXModGhpcy5tZWFzdXJlcykuZm9yRWFjaChtID0+IG91dFttXSA9IHRydWUpO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIGtleXModGhpcy5tZWFzdXJlcykuZm9yRWFjaChmaWVsZCA9PiB7XG4gICAgICBrZXlzKHRoaXMubWVhc3VyZXNbZmllbGRdKS5mb3JFYWNoKG9wID0+IHtcbiAgICAgICAgb3V0W2Ake29wfV8ke2ZpZWxkfWBdID0gdHJ1ZTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSB7XG4gICAgY29uc3Qgb3BzOiBBZ2dyZWdhdGVPcFtdID0gW107XG4gICAgY29uc3QgZmllbGRzOiBzdHJpbmdbXSA9IFtdO1xuICAgIGNvbnN0IGFzOiBzdHJpbmdbXSA9IFtdO1xuXG4gICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKHRoaXMubWVhc3VyZXMpKSB7XG4gICAgICBmb3IgKGNvbnN0IG9wIG9mIGtleXModGhpcy5tZWFzdXJlc1tmaWVsZF0pKSB7XG4gICAgICAgIGFzLnB1c2godGhpcy5tZWFzdXJlc1tmaWVsZF1bb3BdKTtcbiAgICAgICAgb3BzLnB1c2gob3ApO1xuICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgcmVzdWx0OiBWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybSA9IHtcbiAgICAgIHR5cGU6ICdhZ2dyZWdhdGUnLFxuICAgICAgZ3JvdXBieToga2V5cyh0aGlzLmRpbWVuc2lvbnMpLFxuICAgICAgb3BzLFxuICAgICAgZmllbGRzLFxuICAgICAgYXNcbiAgICB9O1xuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuIl19