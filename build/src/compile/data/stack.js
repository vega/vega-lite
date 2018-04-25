import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { vgField } from '../../fielddef';
import { duplicate } from '../../util';
import { sortParams } from '../common';
import { DataFlowNode } from './dataflow';
function getStackByFields(model) {
    return model.stack.stackBy.reduce(function (fields, by) {
        var fieldDef = by.fieldDef;
        var _field = vgField(fieldDef);
        if (_field) {
            fields.push(_field);
        }
        return fields;
    }, []);
}
var StackNode = /** @class */ (function (_super) {
    tslib_1.__extends(StackNode, _super);
    function StackNode(parent, stack) {
        var _this = _super.call(this, parent) || this;
        _this._stack = stack;
        return _this;
    }
    StackNode.prototype.clone = function () {
        return new StackNode(null, duplicate(this._stack));
    };
    StackNode.make = function (parent, model) {
        var stackProperties = model.stack;
        if (!stackProperties) {
            return null;
        }
        var dimensionFieldDef;
        if (stackProperties.groupbyChannel) {
            dimensionFieldDef = model.fieldDef(stackProperties.groupbyChannel);
        }
        var stackby = getStackByFields(model);
        var orderDef = model.encoding.order;
        var sort;
        if (orderDef) {
            sort = sortParams(orderDef);
        }
        else {
            // default = descending by stackFields
            // FIXME is the default here correct for binned fields?
            sort = stackby.reduce(function (s, field) {
                s.field.push(field);
                s.order.push('descending');
                return s;
            }, { field: [], order: [] });
        }
        return new StackNode(parent, {
            dimensionFieldDef: dimensionFieldDef,
            field: model.vgField(stackProperties.fieldChannel),
            facetby: [],
            stackby: stackby,
            sort: sort,
            offset: stackProperties.offset,
            impute: stackProperties.impute,
        });
    };
    Object.defineProperty(StackNode.prototype, "stack", {
        get: function () {
            return this._stack;
        },
        enumerable: true,
        configurable: true
    });
    StackNode.prototype.addDimensions = function (fields) {
        this._stack.facetby = this._stack.facetby.concat(fields);
    };
    StackNode.prototype.dependentFields = function () {
        var out = {};
        out[this._stack.field] = true;
        this.getGroupbyFields().forEach(function (f) { return out[f] = true; });
        this._stack.facetby.forEach(function (f) { return out[f] = true; });
        var field = this._stack.sort.field;
        isArray(field) ? field.forEach(function (f) { return out[f] = true; }) : out[field] = true;
        return out;
    };
    StackNode.prototype.producedFields = function () {
        var out = {};
        out[this._stack.field + '_start'] = true;
        out[this._stack.field + '_end'] = true;
        return out;
    };
    StackNode.prototype.getGroupbyFields = function () {
        var _a = this._stack, dimensionFieldDef = _a.dimensionFieldDef, impute = _a.impute;
        if (dimensionFieldDef) {
            if (dimensionFieldDef.bin) {
                if (impute) {
                    // For binned group by field with impute, we calculate bin_mid
                    // as we cannot impute two fields simultaneously
                    return [vgField(dimensionFieldDef, { binSuffix: 'mid' })];
                }
                return [
                    // For binned group by field without impute, we need both bin (start) and bin_end
                    vgField(dimensionFieldDef, {}),
                    vgField(dimensionFieldDef, { binSuffix: 'end' })
                ];
            }
            return [vgField(dimensionFieldDef)];
        }
        return [];
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var _a = this._stack, facetby = _a.facetby, stackField = _a.field, dimensionFieldDef = _a.dimensionFieldDef, impute = _a.impute, offset = _a.offset, sort = _a.sort, stackby = _a.stackby;
        // Impute
        if (impute && dimensionFieldDef) {
            var dimensionField = dimensionFieldDef ? vgField(dimensionFieldDef, { binSuffix: 'mid' }) : undefined;
            if (dimensionFieldDef.bin) {
                // As we can only impute one field at a time, we need to calculate
                // mid point for a binned field
                transform.push({
                    type: 'formula',
                    expr: '(' +
                        vgField(dimensionFieldDef, { expr: 'datum' }) +
                        '+' +
                        vgField(dimensionFieldDef, { expr: 'datum', binSuffix: 'end' }) +
                        ')/2',
                    as: dimensionField
                });
            }
            transform.push({
                type: 'impute',
                field: stackField,
                groupby: stackby,
                key: dimensionField,
                method: 'value',
                value: 0
            });
        }
        // Stack
        transform.push({
            type: 'stack',
            groupby: this.getGroupbyFields().concat(facetby),
            field: stackField,
            sort: sort,
            as: [
                stackField + '_start',
                stackField + '_end'
            ],
            offset: offset
        });
        return transform;
    };
    return StackNode;
}(DataFlowNode));
export { StackNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sRUFBVyxPQUFPLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUVqRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFFckMsT0FBTyxFQUFDLFlBQVksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUd4QywwQkFBMEIsS0FBZ0I7SUFDeEMsT0FBTyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsRUFBRTtRQUMzQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBRTdCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckI7UUFDRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLEVBQUUsRUFBYyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQWtDRDtJQUErQixxQ0FBWTtJQU96QyxtQkFBWSxNQUFvQixFQUFFLEtBQXFCO1FBQXZELFlBQ0Usa0JBQU0sTUFBTSxDQUFDLFNBR2Q7UUFEQyxLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQzs7SUFDdEIsQ0FBQztJQVJNLHlCQUFLLEdBQVo7UUFDRSxPQUFPLElBQUksU0FBUyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQVFhLGNBQUksR0FBbEIsVUFBbUIsTUFBb0IsRUFBRSxLQUFn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dCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge1N0YWNrT2Zmc2V0fSBmcm9tICcuLi8uLi9zdGFjayc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU29ydCwgVmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7c29ydFBhcmFtc30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLy4uL3VuaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmZ1bmN0aW9uIGdldFN0YWNrQnlGaWVsZHMobW9kZWw6IFVuaXRNb2RlbCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIG1vZGVsLnN0YWNrLnN0YWNrQnkucmVkdWNlKChmaWVsZHMsIGJ5KSA9PiB7XG4gICAgY29uc3QgZmllbGREZWYgPSBieS5maWVsZERlZjtcblxuICAgIGNvbnN0IF9maWVsZCA9IHZnRmllbGQoZmllbGREZWYpO1xuICAgIGlmIChfZmllbGQpIHtcbiAgICAgIGZpZWxkcy5wdXNoKF9maWVsZCk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sIFtdIGFzIHN0cmluZ1tdKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGFja0NvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBGYWNldGVkIGZpZWxkLlxuICAgKi9cbiAgZmFjZXRieTogc3RyaW5nW107XG5cbiAgZGltZW5zaW9uRmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG5cbiAgLyoqXG4gICAqIFN0YWNrIG1lYXN1cmUncyBmaWVsZFxuICAgKi9cbiAgZmllbGQ6IHN0cmluZztcblxuICAvKipcbiAgICogTGV2ZWwgb2YgZGV0YWlsIGZpZWxkcyBmb3IgZWFjaCBsZXZlbCBpbiB0aGUgc3RhY2tlZCBjaGFydHMgc3VjaCBhcyBjb2xvciBvciBkZXRhaWwuXG4gICAqL1xuICBzdGFja2J5OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRmllbGQgdGhhdCBkZXRlcm1pbmVzIG9yZGVyIG9mIGxldmVscyBpbiB0aGUgc3RhY2tlZCBjaGFydHMuXG4gICAqL1xuICBzb3J0OiBWZ1NvcnQ7XG5cbiAgLyoqIE1vZGUgZm9yIHN0YWNraW5nIG1hcmtzLiAqL1xuICBvZmZzZXQ6IFN0YWNrT2Zmc2V0O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGltcHV0ZSB0aGUgZGF0YSBiZWZvcmUgc3RhY2tpbmcuXG4gICAqL1xuICBpbXB1dGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBTdGFja05vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9zdGFjazogU3RhY2tDb21wb25lbnQ7XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgU3RhY2tOb2RlKG51bGwsIGR1cGxpY2F0ZSh0aGlzLl9zdGFjaykpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHN0YWNrOiBTdGFja0NvbXBvbmVudCkge1xuICAgIHN1cGVyKHBhcmVudCk7XG5cbiAgICB0aGlzLl9zdGFjayA9IHN0YWNrO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKSB7XG5cbiAgICBjb25zdCBzdGFja1Byb3BlcnRpZXMgPSBtb2RlbC5zdGFjaztcblxuICAgIGlmICghc3RhY2tQcm9wZXJ0aWVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZGltZW5zaW9uRmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG4gICAgaWYgKHN0YWNrUHJvcGVydGllcy5ncm91cGJ5Q2hhbm5lbCkge1xuICAgICAgZGltZW5zaW9uRmllbGREZWYgPSBtb2RlbC5maWVsZERlZihzdGFja1Byb3BlcnRpZXMuZ3JvdXBieUNoYW5uZWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrYnkgPSBnZXRTdGFja0J5RmllbGRzKG1vZGVsKTtcbiAgICBjb25zdCBvcmRlckRlZiA9IG1vZGVsLmVuY29kaW5nLm9yZGVyO1xuXG4gICAgbGV0IHNvcnQ6IFZnU29ydDtcbiAgICBpZiAob3JkZXJEZWYpIHtcbiAgICAgIHNvcnQgPSBzb3J0UGFyYW1zKG9yZGVyRGVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCA9IGRlc2NlbmRpbmcgYnkgc3RhY2tGaWVsZHNcbiAgICAgIC8vIEZJWE1FIGlzIHRoZSBkZWZhdWx0IGhlcmUgY29ycmVjdCBmb3IgYmlubmVkIGZpZWxkcz9cbiAgICAgIHNvcnQgPSBzdGFja2J5LnJlZHVjZSgocywgZmllbGQpID0+IHtcbiAgICAgICAgcy5maWVsZC5wdXNoKGZpZWxkKTtcbiAgICAgICAgcy5vcmRlci5wdXNoKCdkZXNjZW5kaW5nJyk7XG4gICAgICAgIHJldHVybiBzO1xuICAgICAgfSwge2ZpZWxkOltdLCBvcmRlcjogW119KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFN0YWNrTm9kZShwYXJlbnQsIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoc3RhY2tQcm9wZXJ0aWVzLmZpZWxkQ2hhbm5lbCksXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIHN0YWNrYnksXG4gICAgICBzb3J0LFxuICAgICAgb2Zmc2V0OiBzdGFja1Byb3BlcnRpZXMub2Zmc2V0LFxuICAgICAgaW1wdXRlOiBzdGFja1Byb3BlcnRpZXMuaW1wdXRlLFxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHN0YWNrKCk6IFN0YWNrQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhY2s7XG4gIH1cblxuICBwdWJsaWMgYWRkRGltZW5zaW9ucyhmaWVsZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fc3RhY2suZmFjZXRieSA9IHRoaXMuX3N0YWNrLmZhY2V0YnkuY29uY2F0KGZpZWxkcyk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgb3V0W3RoaXMuX3N0YWNrLmZpZWxkXSA9IHRydWU7XG5cbiAgICB0aGlzLmdldEdyb3VwYnlGaWVsZHMoKS5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAgdGhpcy5fc3RhY2suZmFjZXRieS5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAgY29uc3QgZmllbGQgPSB0aGlzLl9zdGFjay5zb3J0LmZpZWxkO1xuICAgIGlzQXJyYXkoZmllbGQpID8gZmllbGQuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpIDogb3V0W2ZpZWxkXSA9IHRydWU7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgb3V0W3RoaXMuX3N0YWNrLmZpZWxkICsgJ19zdGFydCddID0gdHJ1ZTtcbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGQgKyAnX2VuZCddID0gdHJ1ZTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwcml2YXRlIGdldEdyb3VwYnlGaWVsZHMoKSB7XG4gICAgY29uc3Qge2RpbWVuc2lvbkZpZWxkRGVmLCBpbXB1dGV9ID0gdGhpcy5fc3RhY2s7XG4gICAgaWYgKGRpbWVuc2lvbkZpZWxkRGVmKSB7XG4gICAgICBpZiAoZGltZW5zaW9uRmllbGREZWYuYmluKSB7XG4gICAgICAgIGlmIChpbXB1dGUpIHtcbiAgICAgICAgICAvLyBGb3IgYmlubmVkIGdyb3VwIGJ5IGZpZWxkIHdpdGggaW1wdXRlLCB3ZSBjYWxjdWxhdGUgYmluX21pZFxuICAgICAgICAgIC8vIGFzIHdlIGNhbm5vdCBpbXB1dGUgdHdvIGZpZWxkcyBzaW11bHRhbmVvdXNseVxuICAgICAgICAgIHJldHVybiBbdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ21pZCd9KV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAvLyBGb3IgYmlubmVkIGdyb3VwIGJ5IGZpZWxkIHdpdGhvdXQgaW1wdXRlLCB3ZSBuZWVkIGJvdGggYmluIChzdGFydCkgYW5kIGJpbl9lbmRcbiAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7fSksXG4gICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ2VuZCd9KVxuICAgICAgICBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFt2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmKV07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ1RyYW5zZm9ybVtdIHtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFZnVHJhbnNmb3JtW10gPSBbXTtcblxuICAgIGNvbnN0IHtmYWNldGJ5LCBmaWVsZDogc3RhY2tGaWVsZCwgZGltZW5zaW9uRmllbGREZWYsIGltcHV0ZSwgb2Zmc2V0LCBzb3J0LCBzdGFja2J5fSA9IHRoaXMuX3N0YWNrO1xuXG4gICAgLy8gSW1wdXRlXG4gICAgaWYgKGltcHV0ZSAmJiBkaW1lbnNpb25GaWVsZERlZikge1xuICAgICAgY29uc3QgZGltZW5zaW9uRmllbGQgPSBkaW1lbnNpb25GaWVsZERlZiA/IHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtiaW5TdWZmaXg6ICdtaWQnfSk6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKGRpbWVuc2lvbkZpZWxkRGVmLmJpbikge1xuICAgICAgICAvLyBBcyB3ZSBjYW4gb25seSBpbXB1dGUgb25lIGZpZWxkIGF0IGEgdGltZSwgd2UgbmVlZCB0byBjYWxjdWxhdGVcbiAgICAgICAgLy8gbWlkIHBvaW50IGZvciBhIGJpbm5lZCBmaWVsZFxuICAgICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgIGV4cHI6ICcoJyArXG4gICAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pICtcbiAgICAgICAgICAgICcrJyArXG4gICAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJywgYmluU3VmZml4OiAnZW5kJ30pICtcbiAgICAgICAgICAgICcpLzInLFxuICAgICAgICAgIGFzOiBkaW1lbnNpb25GaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnaW1wdXRlJyxcbiAgICAgICAgZmllbGQ6IHN0YWNrRmllbGQsXG4gICAgICAgIGdyb3VwYnk6IHN0YWNrYnksXG4gICAgICAgIGtleTogZGltZW5zaW9uRmllbGQsXG4gICAgICAgIG1ldGhvZDogJ3ZhbHVlJyxcbiAgICAgICAgdmFsdWU6IDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFN0YWNrXG4gICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgIGdyb3VwYnk6IHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmNvbmNhdChmYWNldGJ5KSxcbiAgICAgIGZpZWxkOiBzdGFja0ZpZWxkLFxuICAgICAgc29ydCxcbiAgICAgIGFzOiBbXG4gICAgICAgIHN0YWNrRmllbGQgKyAnX3N0YXJ0JyxcbiAgICAgICAgc3RhY2tGaWVsZCArICdfZW5kJ1xuICAgICAgXSxcbiAgICAgIG9mZnNldFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgfVxufVxuIl19