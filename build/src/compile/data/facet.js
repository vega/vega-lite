import * as tslib_1 from "tslib";
import { COLUMN, ROW } from '../../channel';
import * as log from '../../log';
import { hasDiscreteDomain } from '../../scale';
import { isVgRangeStep } from '../../vega.schema';
import { assembleDomain, getFieldFromDomain } from '../scale/domain';
import { DataFlowNode } from './dataflow';
/**
 * A node that helps us track what fields we are faceting by.
 */
var FacetNode = /** @class */ (function (_super) {
    tslib_1.__extends(FacetNode, _super);
    /**
     * @param model The facet model.
     * @param name The name that this facet source will have.
     * @param data The source data for this facet data.
     */
    function FacetNode(parent, model, name, data) {
        var _this = _super.call(this, parent) || this;
        _this.model = model;
        _this.name = name;
        _this.data = data;
        if (model.facet.column) {
            _this.columnFields = [model.vgField(COLUMN)];
            _this.columnName = model.getName('column_domain');
            if (model.fieldDef(COLUMN).bin) {
                _this.columnFields.push(model.vgField(COLUMN, { binSuffix: 'end' }));
            }
        }
        if (model.facet.row) {
            _this.rowFields = [model.vgField(ROW)];
            _this.rowName = model.getName('row_domain');
            if (model.fieldDef(ROW).bin) {
                _this.rowFields.push(model.vgField(ROW, { binSuffix: 'end' }));
            }
        }
        _this.childModel = model.child;
        return _this;
    }
    Object.defineProperty(FacetNode.prototype, "fields", {
        get: function () {
            var fields = [];
            if (this.columnFields) {
                fields = fields.concat(this.columnFields);
            }
            if (this.rowFields) {
                fields = fields.concat(this.rowFields);
            }
            return fields;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * The name to reference this source is its name.
     */
    FacetNode.prototype.getSource = function () {
        return this.name;
    };
    FacetNode.prototype.getChildIndependentFieldsWithStep = function () {
        var childIndependentFieldsWithStep = {};
        for (var _i = 0, _a = ['x', 'y']; _i < _a.length; _i++) {
            var channel = _a[_i];
            var childScaleComponent = this.childModel.component.scales[channel];
            if (childScaleComponent && !childScaleComponent.merged) {
                var type = childScaleComponent.get('type');
                var range = childScaleComponent.get('range');
                if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                    var domain = assembleDomain(this.childModel, channel);
                    var field = getFieldFromDomain(domain);
                    if (field) {
                        childIndependentFieldsWithStep[channel] = field;
                    }
                    else {
                        log.warn('Unknown field for ${channel}.  Cannot calculate view size.');
                    }
                }
            }
        }
        return childIndependentFieldsWithStep;
    };
    FacetNode.prototype.assembleRowColumnData = function (channel, crossedDataName, childIndependentFieldsWithStep) {
        var aggregateChildField = {};
        var childChannel = channel === 'row' ? 'y' : 'x';
        if (childIndependentFieldsWithStep[childChannel]) {
            if (crossedDataName) {
                aggregateChildField = {
                    // If there is a crossed data, calculate max
                    fields: ["distinct_" + childIndependentFieldsWithStep[childChannel]],
                    ops: ['max'],
                    // Although it is technically a max, just name it distinct so it's easier to refer to it
                    as: ["distinct_" + childIndependentFieldsWithStep[childChannel]]
                };
            }
            else {
                aggregateChildField = {
                    // If there is no crossed data, just calculate distinct
                    fields: [childIndependentFieldsWithStep[childChannel]],
                    ops: ['distinct']
                };
            }
        }
        return {
            name: channel === 'row' ? this.rowName : this.columnName,
            // Use data from the crossed one if it exist
            source: crossedDataName || this.data,
            transform: [tslib_1.__assign({ type: 'aggregate', groupby: channel === 'row' ? this.rowFields : this.columnFields }, aggregateChildField)]
        };
    };
    FacetNode.prototype.assemble = function () {
        var data = [];
        var crossedDataName = null;
        var childIndependentFieldsWithStep = this.getChildIndependentFieldsWithStep();
        if (this.columnName && this.rowName && (childIndependentFieldsWithStep.x || childIndependentFieldsWithStep.y)) {
            // Need to create a cross dataset to correctly calculate cardinality
            crossedDataName = "cross_" + this.columnName + "_" + this.rowName;
            var fields = [].concat(childIndependentFieldsWithStep.x ? [childIndependentFieldsWithStep.x] : [], childIndependentFieldsWithStep.y ? [childIndependentFieldsWithStep.y] : []);
            var ops = fields.map(function () { return 'distinct'; });
            data.push({
                name: crossedDataName,
                source: this.data,
                transform: [{
                        type: 'aggregate',
                        groupby: this.columnFields.concat(this.rowFields),
                        fields: fields,
                        ops: ops
                    }]
            });
        }
        if (this.columnName) {
            data.push(this.assembleRowColumnData('column', crossedDataName, childIndependentFieldsWithStep));
        }
        if (this.rowName) {
            data.push(this.assembleRowColumnData('row', crossedDataName, childIndependentFieldsWithStep));
        }
        return data;
    };
    return FacetNode;
}(DataFlowNode));
export { FacetNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2ZhY2V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBZSxNQUFNLGVBQWUsQ0FBQztBQUN4RCxPQUFPLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsaUJBQWlCLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDOUMsT0FBTyxFQUFDLGFBQWEsRUFBK0IsTUFBTSxtQkFBbUIsQ0FBQztBQUc5RSxPQUFPLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbkUsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQU94Qzs7R0FFRztBQUNIO0lBQStCLHFDQUFZO0lBU3pDOzs7O09BSUc7SUFDSCxtQkFBbUIsTUFBb0IsRUFBa0IsS0FBaUIsRUFBa0IsSUFBWSxFQUFTLElBQVk7UUFBN0gsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FtQmQ7UUFwQndELFdBQUssR0FBTCxLQUFLLENBQVk7UUFBa0IsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUksR0FBSixJQUFJLENBQVE7UUFHM0gsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRTtZQUN0QixLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzVDLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqRCxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxFQUFFO2dCQUM5QixLQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLENBQUM7YUFDbkU7U0FDRjtRQUVELElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUU7WUFDbkIsS0FBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUN0QyxLQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDM0MsSUFBSSxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRTtnQkFDM0IsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzdEO1NBQ0Y7UUFFRCxLQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7O0lBQ2hDLENBQUM7SUFFRCxzQkFBSSw2QkFBTTthQUFWO1lBQ0UsSUFBSSxNQUFNLEdBQWEsRUFBRSxDQUFDO1lBQzFCLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtnQkFDckIsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQzNDO1lBQ0QsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7YUFDeEM7WUFDRCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDOzs7T0FBQTtJQUVEOztPQUVHO0lBQ0ksNkJBQVMsR0FBaEI7UUFDRSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDbkIsQ0FBQztJQUVPLHFEQUFpQyxHQUF6QztRQUNFLElBQU0sOEJBQThCLEdBQW1DLEVBQUUsQ0FBQztRQUUxRSxLQUFzQixVQUE0QixFQUE1QixLQUFBLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBbUIsRUFBNUIsY0FBNEIsRUFBNUIsSUFBNEI7WUFBN0MsSUFBTSxPQUFPLFNBQUE7WUFDaEIsSUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdEUsSUFBSSxtQkFBbUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRTtnQkFDdEQsSUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUM3QyxJQUFNLEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRS9DLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUNuRCxJQUFNLE1BQU0sR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxPQUFPLENBQUMsQ0FBQztvQkFDeEQsSUFBTSxLQUFLLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQ3pDLElBQUksS0FBSyxFQUFFO3dCQUNULDhCQUE4QixDQUFDLE9BQU8sQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDakQ7eUJBQU07d0JBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyw0REFBNEQsQ0FBQyxDQUFDO3FCQUN4RTtpQkFDRjthQUNGO1NBQ0Y7UUFFRCxPQUFPLDhCQUE4QixDQUFDO0lBQ3hDLENBQUM7SUFFTyx5Q0FBcUIsR0FBN0IsVUFBOEIsT0FBeUIsRUFBRSxlQUF1QixFQUFFLDhCQUE4RDtRQUM5SSxJQUFJLG1CQUFtQixHQUFrQyxFQUFFLENBQUM7UUFDNUQsSUFBTSxZQUFZLEdBQUcsT0FBTyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFFbkQsSUFBSSw4QkFBOEIsQ0FBQyxZQUFZLENBQUMsRUFBRTtZQUNoRCxJQUFJLGVBQWUsRUFBRTtnQkFDbkIsbUJBQW1CLEdBQUc7b0JBQ3BCLDRDQUE0QztvQkFDNUMsTUFBTSxFQUFFLENBQUMsY0FBWSw4QkFBOEIsQ0FBQyxZQUFZLENBQUcsQ0FBQztvQkFDcEUsR0FBRyxFQUFFLENBQUMsS0FBSyxDQUFDO29CQUNaLHdGQUF3RjtvQkFDeEYsRUFBRSxFQUFFLENBQUMsY0FBWSw4QkFBOEIsQ0FBQyxZQUFZLENBQUcsQ0FBQztpQkFDakUsQ0FBQzthQUNIO2lCQUFNO2dCQUNMLG1CQUFtQixHQUFHO29CQUNwQix1REFBdUQ7b0JBQ3ZELE1BQU0sRUFBRSxDQUFDLDhCQUE4QixDQUFDLFlBQVksQ0FBQyxDQUFDO29CQUN0RCxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7aUJBQ2xCLENBQUM7YUFDSDtTQUNGO1FBRUQsT0FBTztZQUNMLElBQUksRUFBRSxPQUFPLEtBQUssS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVTtZQUN4RCw0Q0FBNEM7WUFDNUMsTUFBTSxFQUFFLGVBQWUsSUFBSSxJQUFJLENBQUMsSUFBSTtZQUNwQyxTQUFTLEVBQUUsb0JBQ1QsSUFBSSxFQUFFLFdBQVcsRUFDakIsT0FBTyxFQUFFLE9BQU8sS0FBSyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQzVELG1CQUFtQixFQUN0QjtTQUNILENBQUM7SUFDSixDQUFDO0lBRU0sNEJBQVEsR0FBZjtRQUNFLElBQU0sSUFBSSxHQUFhLEVBQUUsQ0FBQztRQUMxQixJQUFJLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDM0IsSUFBTSw4QkFBOEIsR0FBRyxJQUFJLENBQUMsaUNBQWlDLEVBQUUsQ0FBQztRQUVoRixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUMsSUFBSSw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUM3RyxvRUFBb0U7WUFDcEUsZUFBZSxHQUFHLFdBQVMsSUFBSSxDQUFDLFVBQVUsU0FBSSxJQUFJLENBQUMsT0FBUyxDQUFDO1lBRTdELElBQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQ3RCLDhCQUE4QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUMxRSw4QkFBOEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsOEJBQThCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FDM0UsQ0FBQztZQUNGLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsY0FBbUIsT0FBQSxVQUFVLEVBQVYsQ0FBVSxDQUFDLENBQUM7WUFFdEQsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDUixJQUFJLEVBQUUsZUFBZTtnQkFDckIsTUFBTSxFQUFFLElBQUksQ0FBQyxJQUFJO2dCQUNqQixTQUFTLEVBQUUsQ0FBQzt3QkFDVixJQUFJLEVBQUUsV0FBVzt3QkFDakIsT0FBTyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7d0JBQ2pELE1BQU0sRUFBRSxNQUFNO3dCQUNkLEdBQUcsS0FBQTtxQkFDSixDQUFDO2FBQ0gsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7U0FDbEc7UUFFRCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLGVBQWUsRUFBRSw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7U0FDL0Y7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFySkQsQ0FBK0IsWUFBWSxHQXFKMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FnZ3JlZ2F0ZU9wfSBmcm9tICd2ZWdhJztcbmltcG9ydCB7Q09MVU1OLCBST1csIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7aXNWZ1JhbmdlU3RlcCwgVmdBZ2dyZWdhdGVUcmFuc2Zvcm0sIFZnRGF0YX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtGYWNldE1vZGVsfSBmcm9tICcuLi9mYWNldCc7XG5pbXBvcnQge01vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge2Fzc2VtYmxlRG9tYWluLCBnZXRGaWVsZEZyb21Eb21haW59IGZyb20gJy4uL3NjYWxlL2RvbWFpbic7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cbnR5cGUgQ2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwID0ge1xuICB4Pzogc3RyaW5nLFxuICB5Pzogc3RyaW5nXG59O1xuXG4vKipcbiAqIEEgbm9kZSB0aGF0IGhlbHBzIHVzIHRyYWNrIHdoYXQgZmllbGRzIHdlIGFyZSBmYWNldGluZyBieS5cbiAqL1xuZXhwb3J0IGNsYXNzIEZhY2V0Tm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgcmVhZG9ubHkgY29sdW1uRmllbGRzOiBzdHJpbmdbXTtcbiAgcHJpdmF0ZSByZWFkb25seSBjb2x1bW5OYW1lOiBzdHJpbmc7XG5cbiAgcHJpdmF0ZSByZWFkb25seSByb3dGaWVsZHM6IHN0cmluZ1tdO1xuICBwcml2YXRlIHJlYWRvbmx5IHJvd05hbWU6IHN0cmluZztcblxuICBwcml2YXRlIHJlYWRvbmx5IGNoaWxkTW9kZWw6IE1vZGVsO1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gbW9kZWwgVGhlIGZhY2V0IG1vZGVsLlxuICAgKiBAcGFyYW0gbmFtZSBUaGUgbmFtZSB0aGF0IHRoaXMgZmFjZXQgc291cmNlIHdpbGwgaGF2ZS5cbiAgICogQHBhcmFtIGRhdGEgVGhlIHNvdXJjZSBkYXRhIGZvciB0aGlzIGZhY2V0IGRhdGEuXG4gICAqL1xuICBwdWJsaWMgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHB1YmxpYyByZWFkb25seSBtb2RlbDogRmFjZXRNb2RlbCwgcHVibGljIHJlYWRvbmx5IG5hbWU6IHN0cmluZywgcHVibGljIGRhdGE6IHN0cmluZykge1xuICAgIHN1cGVyKHBhcmVudCk7XG5cbiAgICBpZiAobW9kZWwuZmFjZXQuY29sdW1uKSB7XG4gICAgICB0aGlzLmNvbHVtbkZpZWxkcyA9IFttb2RlbC52Z0ZpZWxkKENPTFVNTildO1xuICAgICAgdGhpcy5jb2x1bW5OYW1lID0gbW9kZWwuZ2V0TmFtZSgnY29sdW1uX2RvbWFpbicpO1xuICAgICAgaWYgKG1vZGVsLmZpZWxkRGVmKENPTFVNTikuYmluKSB7XG4gICAgICAgIHRoaXMuY29sdW1uRmllbGRzLnB1c2gobW9kZWwudmdGaWVsZChDT0xVTU4sIHtiaW5TdWZmaXg6ICdlbmQnfSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtb2RlbC5mYWNldC5yb3cpIHtcbiAgICAgIHRoaXMucm93RmllbGRzID0gW21vZGVsLnZnRmllbGQoUk9XKV07XG4gICAgICB0aGlzLnJvd05hbWUgPSBtb2RlbC5nZXROYW1lKCdyb3dfZG9tYWluJyk7XG4gICAgICBpZiAobW9kZWwuZmllbGREZWYoUk9XKS5iaW4pIHtcbiAgICAgICAgdGhpcy5yb3dGaWVsZHMucHVzaChtb2RlbC52Z0ZpZWxkKFJPVywge2JpblN1ZmZpeDogJ2VuZCd9KSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZE1vZGVsID0gbW9kZWwuY2hpbGQ7XG4gIH1cblxuICBnZXQgZmllbGRzKCkge1xuICAgIGxldCBmaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgaWYgKHRoaXMuY29sdW1uRmllbGRzKSB7XG4gICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KHRoaXMuY29sdW1uRmllbGRzKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucm93RmllbGRzKSB7XG4gICAgICBmaWVsZHMgPSBmaWVsZHMuY29uY2F0KHRoaXMucm93RmllbGRzKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcztcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgbmFtZSB0byByZWZlcmVuY2UgdGhpcyBzb3VyY2UgaXMgaXRzIG5hbWUuXG4gICAqL1xuICBwdWJsaWMgZ2V0U291cmNlKCkge1xuICAgIHJldHVybiB0aGlzLm5hbWU7XG4gIH1cblxuICBwcml2YXRlIGdldENoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCgpIHtcbiAgICBjb25zdCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXA6IENoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBjaGFubmVsIG9mIFsneCcsICd5J10gYXMgU2NhbGVDaGFubmVsW10pIHtcbiAgICAgIGNvbnN0IGNoaWxkU2NhbGVDb21wb25lbnQgPSB0aGlzLmNoaWxkTW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZFNjYWxlQ29tcG9uZW50ICYmICFjaGlsZFNjYWxlQ29tcG9uZW50Lm1lcmdlZCkge1xuICAgICAgICBjb25zdCB0eXBlID0gY2hpbGRTY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICAgICAgY29uc3QgcmFuZ2UgPSBjaGlsZFNjYWxlQ29tcG9uZW50LmdldCgncmFuZ2UnKTtcblxuICAgICAgICBpZiAoaGFzRGlzY3JldGVEb21haW4odHlwZSkgJiYgaXNWZ1JhbmdlU3RlcChyYW5nZSkpIHtcbiAgICAgICAgICBjb25zdCBkb21haW4gPSBhc3NlbWJsZURvbWFpbih0aGlzLmNoaWxkTW9kZWwsIGNoYW5uZWwpO1xuICAgICAgICAgIGNvbnN0IGZpZWxkID0gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbik7XG4gICAgICAgICAgaWYgKGZpZWxkKSB7XG4gICAgICAgICAgICBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hhbm5lbF0gPSBmaWVsZDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbG9nLndhcm4oJ1Vua25vd24gZmllbGQgZm9yICR7Y2hhbm5lbH0uICBDYW5ub3QgY2FsY3VsYXRlIHZpZXcgc2l6ZS4nKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3NlbWJsZVJvd0NvbHVtbkRhdGEoY2hhbm5lbDogJ3JvdycgfCAnY29sdW1uJywgY3Jvc3NlZERhdGFOYW1lOiBzdHJpbmcsIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcDogQ2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwKTogVmdEYXRhIHtcbiAgICBsZXQgYWdncmVnYXRlQ2hpbGRGaWVsZDogUGFydGlhbDxWZ0FnZ3JlZ2F0ZVRyYW5zZm9ybT4gPSB7fTtcbiAgICBjb25zdCBjaGlsZENoYW5uZWwgPSBjaGFubmVsID09PSAncm93JyA/ICd5JyA6ICd4JztcblxuICAgIGlmIChjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hpbGRDaGFubmVsXSkge1xuICAgICAgaWYgKGNyb3NzZWREYXRhTmFtZSkge1xuICAgICAgICBhZ2dyZWdhdGVDaGlsZEZpZWxkID0ge1xuICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgY3Jvc3NlZCBkYXRhLCBjYWxjdWxhdGUgbWF4XG4gICAgICAgICAgZmllbGRzOiBbYGRpc3RpbmN0XyR7Y2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwW2NoaWxkQ2hhbm5lbF19YF0sXG4gICAgICAgICAgb3BzOiBbJ21heCddLFxuICAgICAgICAgIC8vIEFsdGhvdWdoIGl0IGlzIHRlY2huaWNhbGx5IGEgbWF4LCBqdXN0IG5hbWUgaXQgZGlzdGluY3Qgc28gaXQncyBlYXNpZXIgdG8gcmVmZXIgdG8gaXRcbiAgICAgICAgICBhczogW2BkaXN0aW5jdF8ke2NoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcFtjaGlsZENoYW5uZWxdfWBdXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhZ2dyZWdhdGVDaGlsZEZpZWxkID0ge1xuICAgICAgICAgIC8vIElmIHRoZXJlIGlzIG5vIGNyb3NzZWQgZGF0YSwganVzdCBjYWxjdWxhdGUgZGlzdGluY3RcbiAgICAgICAgICBmaWVsZHM6IFtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXBbY2hpbGRDaGFubmVsXV0sXG4gICAgICAgICAgb3BzOiBbJ2Rpc3RpbmN0J11cbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogY2hhbm5lbCA9PT0gJ3JvdycgPyB0aGlzLnJvd05hbWUgOiB0aGlzLmNvbHVtbk5hbWUsXG4gICAgICAvLyBVc2UgZGF0YSBmcm9tIHRoZSBjcm9zc2VkIG9uZSBpZiBpdCBleGlzdFxuICAgICAgc291cmNlOiBjcm9zc2VkRGF0YU5hbWUgfHwgdGhpcy5kYXRhLFxuICAgICAgdHJhbnNmb3JtOiBbe1xuICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgZ3JvdXBieTogY2hhbm5lbCA9PT0gJ3JvdycgPyB0aGlzLnJvd0ZpZWxkcyA6IHRoaXMuY29sdW1uRmllbGRzLFxuICAgICAgICAuLi5hZ2dyZWdhdGVDaGlsZEZpZWxkXG4gICAgICB9XVxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKSB7XG4gICAgY29uc3QgZGF0YTogVmdEYXRhW10gPSBbXTtcbiAgICBsZXQgY3Jvc3NlZERhdGFOYW1lID0gbnVsbDtcbiAgICBjb25zdCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAgPSB0aGlzLmdldENoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCgpO1xuXG4gICAgaWYgKHRoaXMuY29sdW1uTmFtZSAmJiB0aGlzLnJvd05hbWUgJiYgKGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC54IHx8IGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcC55KSkge1xuICAgICAgLy8gTmVlZCB0byBjcmVhdGUgYSBjcm9zcyBkYXRhc2V0IHRvIGNvcnJlY3RseSBjYWxjdWxhdGUgY2FyZGluYWxpdHlcbiAgICAgIGNyb3NzZWREYXRhTmFtZSA9IGBjcm9zc18ke3RoaXMuY29sdW1uTmFtZX1fJHt0aGlzLnJvd05hbWV9YDtcblxuICAgICAgY29uc3QgZmllbGRzID0gW10uY29uY2F0KFxuICAgICAgICBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueCA/IFtjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXAueF0gOiBbXSxcbiAgICAgICAgY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnkgPyBbY2hpbGRJbmRlcGVuZGVudEZpZWxkc1dpdGhTdGVwLnldIDogW10sXG4gICAgICApO1xuICAgICAgY29uc3Qgb3BzID0gZmllbGRzLm1hcCgoKTogQWdncmVnYXRlT3AgPT4gJ2Rpc3RpbmN0Jyk7XG5cbiAgICAgIGRhdGEucHVzaCh7XG4gICAgICAgIG5hbWU6IGNyb3NzZWREYXRhTmFtZSxcbiAgICAgICAgc291cmNlOiB0aGlzLmRhdGEsXG4gICAgICAgIHRyYW5zZm9ybTogW3tcbiAgICAgICAgICB0eXBlOiAnYWdncmVnYXRlJyxcbiAgICAgICAgICBncm91cGJ5OiB0aGlzLmNvbHVtbkZpZWxkcy5jb25jYXQodGhpcy5yb3dGaWVsZHMpLFxuICAgICAgICAgIGZpZWxkczogZmllbGRzLFxuICAgICAgICAgIG9wc1xuICAgICAgICB9XVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuY29sdW1uTmFtZSkge1xuICAgICAgZGF0YS5wdXNoKHRoaXMuYXNzZW1ibGVSb3dDb2x1bW5EYXRhKCdjb2x1bW4nLCBjcm9zc2VkRGF0YU5hbWUsIGNoaWxkSW5kZXBlbmRlbnRGaWVsZHNXaXRoU3RlcCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJvd05hbWUpIHtcbiAgICAgIGRhdGEucHVzaCh0aGlzLmFzc2VtYmxlUm93Q29sdW1uRGF0YSgncm93JywgY3Jvc3NlZERhdGFOYW1lLCBjaGlsZEluZGVwZW5kZW50RmllbGRzV2l0aFN0ZXApKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGF0YTtcbiAgfVxufVxuIl19