"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var fielddef_1 = require("../../fielddef");
var log = require("../../log");
var type_1 = require("../../type");
var util_1 = require("../../util");
var dataflow_1 = require("./dataflow");
function addDimension(dims, fieldDef) {
    if (fieldDef.bin) {
        dims[fielddef_1.field(fieldDef, { binSuffix: 'start' })] = true;
        dims[fielddef_1.field(fieldDef, { binSuffix: 'end' })] = true;
        // We need the range only when the user explicitly forces a binned field to be ordinal (range used in axis and legend labels).
        // We could check whether the axis or legend exists but that seems overkill. In axes and legends, we check hasDiscreteDomain(scaleType).
        if (fieldDef.type === type_1.ORDINAL) {
            dims[fielddef_1.field(fieldDef, { binSuffix: 'range' })] = true;
        }
    }
    else {
        dims[fielddef_1.field(fieldDef)] = true;
    }
    return dims;
}
function mergeMeasures(parentMeasures, childMeasures) {
    for (var field_1 in childMeasures) {
        if (childMeasures.hasOwnProperty(field_1)) {
            // when we merge a measure, we either have to add an aggregation operator or even a new field
            var ops = childMeasures[field_1];
            for (var op in ops) {
                if (ops.hasOwnProperty(op)) {
                    if (field_1 in parentMeasures) {
                        // add operator to existing measure field
                        parentMeasures[field_1][op] = true;
                    }
                    else {
                        parentMeasures[field_1] = { op: true };
                    }
                }
            }
        }
    }
}
var AggregateNode = (function (_super) {
    tslib_1.__extends(AggregateNode, _super);
    /**
     * @param dimensions string set for dimensions
     * @param measures dictionary mapping field name => dict set of aggregation functions
     */
    function AggregateNode(dimensions, measures) {
        var _this = _super.call(this) || this;
        _this.dimensions = dimensions;
        _this.measures = measures;
        return _this;
    }
    AggregateNode.prototype.clone = function () {
        return new AggregateNode(util_1.extend({}, this.dimensions), util_1.duplicate(this.measures));
    };
    AggregateNode.make = function (model) {
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
                    /* tslint:disable:no-string-literal */
                    meas['*']['count'] = true;
                    /* tslint:enable:no-string-literal */
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                    // add min/max so we can use their union as unaggregated domain
                    var scale = model.scale(channel);
                    if (scale && scale.domain === 'unaggregated') {
                        meas[fieldDef.field]['min'] = true;
                        meas[fieldDef.field]['max'] = true;
                    }
                }
            }
            else {
                addDimension(dims, fieldDef);
            }
        });
        if ((Object.keys(dims).length + Object.keys(meas).length) === 0) {
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
        var _this = this;
        var ops = [];
        var fields = [];
        util_1.keys(this.measures).forEach(function (field) {
            util_1.keys(_this.measures[field]).forEach(function (op) {
                ops.push(op);
                fields.push(field);
            });
        });
        return {
            type: 'aggregate',
            groupby: util_1.keys(this.dimensions),
            ops: ops,
            fields: fields
        };
    };
    return AggregateNode;
}(dataflow_1.DataFlowNode));
exports.AggregateNode = AggregateNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQStDO0FBQy9DLCtCQUFpQztBQUNqQyxtQ0FBbUM7QUFDbkMsbUNBQTRFO0FBSTVFLHVDQUF3QztBQUV4QyxzQkFBc0IsSUFBZ0MsRUFBRSxRQUEwQjtJQUNoRixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqQixJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNuRCxJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUVqRCw4SEFBOEg7UUFDOUgsd0lBQXdJO1FBQ3hJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssY0FBTyxDQUFDLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNyRCxDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sSUFBSSxDQUFDLGdCQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDL0IsQ0FBQztJQUNELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBRUQsdUJBQXVCLGNBQW1DLEVBQUUsYUFBa0M7SUFDNUYsR0FBRyxDQUFDLENBQUMsSUFBTSxPQUFLLElBQUksYUFBYSxDQUFDLENBQUMsQ0FBQztRQUNsQyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsY0FBYyxDQUFDLE9BQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN4Qyw2RkFBNkY7WUFDN0YsSUFBTSxHQUFHLEdBQUcsYUFBYSxDQUFDLE9BQUssQ0FBQyxDQUFDO1lBQ2pDLEdBQUcsQ0FBQyxDQUFDLElBQU0sRUFBRSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMzQixFQUFFLENBQUMsQ0FBQyxPQUFLLElBQUksY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDNUIseUNBQXlDO3dCQUN6QyxjQUFjLENBQUMsT0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNuQyxDQUFDO29CQUFDLElBQUksQ0FBQyxDQUFDO3dCQUNOLGNBQWMsQ0FBQyxPQUFLLENBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUMsQ0FBQztvQkFDckMsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0FBQ0gsQ0FBQztBQUVEO0lBQW1DLHlDQUFZO0lBSzdDOzs7T0FHRztJQUNILHVCQUFvQixVQUFxQixFQUFVLFFBQXlCO1FBQTVFLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixnQkFBVSxHQUFWLFVBQVUsQ0FBVztRQUFVLGNBQVEsR0FBUixRQUFRLENBQWlCOztJQUU1RSxDQUFDO0lBVk0sNkJBQUssR0FBWjtRQUNFLE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxhQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxnQkFBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7SUFVYSxrQkFBSSxHQUFsQixVQUFtQixLQUFnQjtRQUNqQyxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUM7UUFDeEIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFBLEVBQUU7WUFDdEIsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pCLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDckIsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUVoQixFQUFFLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDakIsOERBQThEO1lBQzlELE1BQU0sQ0FBQyxJQUFJLENBQUM7UUFDZCxDQUFDO1FBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFDLFFBQVEsRUFBRSxPQUFPO1lBQ3RDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO2dCQUN2QixFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0JBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUM1QixzQ0FBc0M7b0JBQ3RDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQzFCLHFDQUFxQztnQkFDdkMsQ0FBQztnQkFBQyxJQUFJLENBQUMsQ0FBQztvQkFDTixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO29CQUNsRCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBRWhELCtEQUErRDtvQkFDL0QsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztvQkFDbkMsRUFBRSxDQUFDLENBQUMsS0FBSyxJQUFJLEtBQUssQ0FBQyxNQUFNLEtBQUssY0FBYyxDQUFDLENBQUMsQ0FBQzt3QkFDN0MsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ25DLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDO29CQUNyQyxDQUFDO2dCQUNILENBQUM7WUFDSCxDQUFDO1lBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ04sWUFBWSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQixDQUFDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoRSxNQUFNLENBQUMsSUFBSSxDQUFDO1FBQ2QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLGFBQWEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVNLDZCQUFLLEdBQVosVUFBYSxLQUFvQjtRQUMvQixFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDL0MsYUFBYSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzdDLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNqQixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixHQUFHLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7UUFDbEQsQ0FBQztJQUNILENBQUM7SUFFTSxxQ0FBYSxHQUFwQixVQUFxQixNQUFnQjtRQUFyQyxpQkFFQztRQURDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxLQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBekIsQ0FBeUIsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSx1Q0FBZSxHQUF0QjtRQUNFLElBQU0sR0FBRyxHQUFHLEVBQUUsQ0FBQztRQUVmLFdBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksRUFBYixDQUFhLENBQUMsQ0FBQztRQUNsRCxXQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQWIsQ0FBYSxDQUFDLENBQUM7UUFFaEQsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFTSxzQ0FBYyxHQUFyQjtRQUFBLGlCQVVDO1FBVEMsSUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDO1FBRWYsV0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQy9CLFdBQUksQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtnQkFDbkMsR0FBRyxDQUFJLEVBQUUsU0FBSSxLQUFPLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDL0IsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDYixDQUFDO0lBRU0sZ0NBQVEsR0FBZjtRQUFBLGlCQWdCQztRQWZDLElBQU0sR0FBRyxHQUFhLEVBQUUsQ0FBQztRQUN6QixJQUFNLE1BQU0sR0FBYSxFQUFFLENBQUM7UUFDNUIsV0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxLQUFLO1lBQy9CLFdBQUksQ0FBQyxLQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsRUFBRTtnQkFDbkMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDYixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUM7WUFDTCxJQUFJLEVBQUUsV0FBVztZQUNqQixPQUFPLEVBQUUsV0FBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDOUIsR0FBRyxLQUFBO1lBQ0gsTUFBTSxRQUFBO1NBQ1AsQ0FBQztJQUNKLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUE5R0QsQ0FBbUMsdUJBQVksR0E4RzlDO0FBOUdZLHNDQUFhIn0=