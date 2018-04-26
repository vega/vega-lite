"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
function getStackByFields(model) {
    return model.stack.stackBy.reduce(function (fields, by) {
        var fieldDef = by.fieldDef;
        var _field = fielddef_1.vgField(fieldDef);
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
        return new StackNode(null, util_1.duplicate(this._stack));
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
            sort = common_1.sortParams(orderDef);
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
        vega_util_1.isArray(field) ? field.forEach(function (f) { return out[f] = true; }) : out[field] = true;
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
                    return [fielddef_1.vgField(dimensionFieldDef, { binSuffix: 'mid' })];
                }
                return [
                    // For binned group by field without impute, we need both bin (start) and bin_end
                    fielddef_1.vgField(dimensionFieldDef, {}),
                    fielddef_1.vgField(dimensionFieldDef, { binSuffix: 'end' })
                ];
            }
            return [fielddef_1.vgField(dimensionFieldDef)];
        }
        return [];
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var _a = this._stack, facetby = _a.facetby, stackField = _a.field, dimensionFieldDef = _a.dimensionFieldDef, impute = _a.impute, offset = _a.offset, sort = _a.sort, stackby = _a.stackby;
        // Impute
        if (impute && dimensionFieldDef) {
            var dimensionField = dimensionFieldDef ? fielddef_1.vgField(dimensionFieldDef, { binSuffix: 'mid' }) : undefined;
            if (dimensionFieldDef.bin) {
                // As we can only impute one field at a time, we need to calculate
                // mid point for a binned field
                transform.push({
                    type: 'formula',
                    expr: '(' +
                        fielddef_1.vgField(dimensionFieldDef, { expr: 'datum' }) +
                        '+' +
                        fielddef_1.vgField(dimensionFieldDef, { expr: 'datum', binSuffix: 'end' }) +
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
}(dataflow_1.DataFlowNode));
exports.StackNode = StackNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUNsQywyQ0FBaUQ7QUFFakQsbUNBQXFDO0FBRXJDLG9DQUFxQztBQUVyQyx1Q0FBd0M7QUFHeEMsMEJBQTBCLEtBQWdCO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEVBQUU7UUFDM0MsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUU3QixJQUFNLE1BQU0sR0FBRyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsRUFBRSxFQUFjLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBa0NEO0lBQStCLHFDQUFZO0lBT3pDLG1CQUFZLE1BQW9CLEVBQUUsS0FBcUI7UUFBdkQsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FHZDtRQURDLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztJQUN0QixDQUFDO0lBUk0seUJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQVFhLGNBQUksR0FBbEIsVUFBbUIsTUFBb0IsRUFBRSxLQUFnQjtRQUV2RCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRXBDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksaUJBQW1DLENBQUM7UUFDeEMsSUFBSSxlQUFlLENBQUMs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LElBQUksQ0FBQztvQkFDYixJQUFJLEVBQUUsU0FBUztvQkFDZixJQUFJLEVBQUUsR0FBRzt3QkFDUCxrQkFBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxDQUFDO3dCQUMzQyxHQUFHO3dCQUNILGtCQUFPLENBQUMsaUJBQWlCLEVBQUUsRUFBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQzt3QkFDN0QsS0FBSztvQkFDUCxFQUFFLEVBQUUsY0FBYztpQkFDbkIsQ0FBQyxDQUFDO2FBQ0o7WUFFRCxTQUFTLENBQUMsSUFBSSxDQUFDO2dCQUNiLElBQUksRUFBRSxRQUFRO2dCQUNkLEtBQUssRUFBRSxVQUFVO2dCQUNqQixPQUFPLEVBQUUsT0FBTztnQkFDaEIsR0FBRyxFQUFFLGNBQWM7Z0JBQ25CLE1BQU0sRUFBRSxPQUFPO2dCQUNmLEtBQUssRUFBRSxDQUFDO2FBQ1QsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxRQUFRO1FBQ1IsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNiLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDaEQsS0FBSyxFQUFFLFVBQVU7WUFDakIsSUFBSSxNQUFBO1lBQ0osRUFBRSxFQUFFO2dCQUNGLFVBQVUsR0FBRyxRQUFRO2dCQUNyQixVQUFVLEdBQUcsTUFBTTthQUNwQjtZQUNELE1BQU0sUUFBQTtTQUNQLENBQUMsQ0FBQztRQUVILE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF2SkQsQ0FBK0IsdUJBQVksR0F1SjFDO0FBdkpZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5fSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtTdGFja09mZnNldH0gZnJvbSAnLi4vLi4vc3RhY2snO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NvcnQsIFZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3NvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi8uLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5mdW5jdGlvbiBnZXRTdGFja0J5RmllbGRzKG1vZGVsOiBVbml0TW9kZWwpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBtb2RlbC5zdGFjay5zdGFja0J5LnJlZHVjZSgoZmllbGRzLCBieSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gYnkuZmllbGREZWY7XG5cbiAgICBjb25zdCBfZmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcbiAgICBpZiAoX2ZpZWxkKSB7XG4gICAgICBmaWVsZHMucHVzaChfZmllbGQpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzO1xuICB9LCBbXSBhcyBzdHJpbmdbXSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tDb21wb25lbnQge1xuICAvKipcbiAgICogRmFjZXRlZCBmaWVsZC5cbiAgICovXG4gIGZhY2V0Ynk6IHN0cmluZ1tdO1xuXG4gIGRpbWVuc2lvbkZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBTdGFjayBtZWFzdXJlJ3MgZmllbGRcbiAgICovXG4gIGZpZWxkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIExldmVsIG9mIGRldGFpbCBmaWVsZHMgZm9yIGVhY2ggbGV2ZWwgaW4gdGhlIHN0YWNrZWQgY2hhcnRzIHN1Y2ggYXMgY29sb3Igb3IgZGV0YWlsLlxuICAgKi9cbiAgc3RhY2tieTogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEZpZWxkIHRoYXQgZGV0ZXJtaW5lcyBvcmRlciBvZiBsZXZlbHMgaW4gdGhlIHN0YWNrZWQgY2hhcnRzLlxuICAgKi9cbiAgc29ydDogVmdTb3J0O1xuXG4gIC8qKiBNb2RlIGZvciBzdGFja2luZyBtYXJrcy4gKi9cbiAgb2Zmc2V0OiBTdGFja09mZnNldDtcblxuICAvKipcbiAgICogV2hldGhlciB0byBpbXB1dGUgdGhlIGRhdGEgYmVmb3JlIHN0YWNraW5nLlxuICAgKi9cbiAgaW1wdXRlOiBib29sZWFuO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfc3RhY2s6IFN0YWNrQ29tcG9uZW50O1xuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFN0YWNrTm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5fc3RhY2spKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBzdGFjazogU3RhY2tDb21wb25lbnQpIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgdGhpcy5fc3RhY2sgPSBzdGFjaztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IFVuaXRNb2RlbCkge1xuXG4gICAgY29uc3Qgc3RhY2tQcm9wZXJ0aWVzID0gbW9kZWwuc3RhY2s7XG5cbiAgICBpZiAoIXN0YWNrUHJvcGVydGllcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGRpbWVuc2lvbkZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgIGlmIChzdGFja1Byb3BlcnRpZXMuZ3JvdXBieUNoYW5uZWwpIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoc3RhY2tQcm9wZXJ0aWVzLmdyb3VwYnlDaGFubmVsKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFja2J5ID0gZ2V0U3RhY2tCeUZpZWxkcyhtb2RlbCk7XG4gICAgY29uc3Qgb3JkZXJEZWYgPSBtb2RlbC5lbmNvZGluZy5vcmRlcjtcblxuICAgIGxldCBzb3J0OiBWZ1NvcnQ7XG4gICAgaWYgKG9yZGVyRGVmKSB7XG4gICAgICBzb3J0ID0gc29ydFBhcmFtcyhvcmRlckRlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgPSBkZXNjZW5kaW5nIGJ5IHN0YWNrRmllbGRzXG4gICAgICAvLyBGSVhNRSBpcyB0aGUgZGVmYXVsdCBoZXJlIGNvcnJlY3QgZm9yIGJpbm5lZCBmaWVsZHM/XG4gICAgICBzb3J0ID0gc3RhY2tieS5yZWR1Y2UoKHMsIGZpZWxkKSA9PiB7XG4gICAgICAgIHMuZmllbGQucHVzaChmaWVsZCk7XG4gICAgICAgIHMub3JkZXIucHVzaCgnZGVzY2VuZGluZycpO1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTdGFja05vZGUocGFyZW50LCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZixcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKHN0YWNrUHJvcGVydGllcy5maWVsZENoYW5uZWwpLFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBzdGFja2J5LFxuICAgICAgc29ydCxcbiAgICAgIG9mZnNldDogc3RhY2tQcm9wZXJ0aWVzLm9mZnNldCxcbiAgICAgIGltcHV0ZTogc3RhY2tQcm9wZXJ0aWVzLmltcHV0ZSxcbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzdGFjaygpOiBTdGFja0NvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrO1xuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3N0YWNrLmZhY2V0YnkgPSB0aGlzLl9zdGFjay5mYWNldGJ5LmNvbmNhdChmaWVsZHMpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIG91dFt0aGlzLl9zdGFjay5maWVsZF0gPSB0cnVlO1xuXG4gICAgdGhpcy5nZXRHcm91cGJ5RmllbGRzKCkuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpO1xuICAgIHRoaXMuX3N0YWNrLmZhY2V0YnkuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpO1xuICAgIGNvbnN0IGZpZWxkID0gdGhpcy5fc3RhY2suc29ydC5maWVsZDtcbiAgICBpc0FycmF5KGZpZWxkKSA/IGZpZWxkLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKSA6IG91dFtmaWVsZF0gPSB0cnVlO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHB1YmxpYyBwcm9kdWNlZEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIG91dFt0aGlzLl9zdGFjay5maWVsZCArICdfc3RhcnQnXSA9IHRydWU7XG4gICAgb3V0W3RoaXMuX3N0YWNrLmZpZWxkICsgJ19lbmQnXSA9IHRydWU7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcm91cGJ5RmllbGRzKCkge1xuICAgIGNvbnN0IHtkaW1lbnNpb25GaWVsZERlZiwgaW1wdXRlfSA9IHRoaXMuX3N0YWNrO1xuICAgIGlmIChkaW1lbnNpb25GaWVsZERlZikge1xuICAgICAgaWYgKGRpbWVuc2lvbkZpZWxkRGVmLmJpbikge1xuICAgICAgICBpZiAoaW1wdXRlKSB7XG4gICAgICAgICAgLy8gRm9yIGJpbm5lZCBncm91cCBieSBmaWVsZCB3aXRoIGltcHV0ZSwgd2UgY2FsY3VsYXRlIGJpbl9taWRcbiAgICAgICAgICAvLyBhcyB3ZSBjYW5ub3QgaW1wdXRlIHR3byBmaWVsZHMgc2ltdWx0YW5lb3VzbHlcbiAgICAgICAgICByZXR1cm4gW3ZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtiaW5TdWZmaXg6ICdtaWQnfSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgLy8gRm9yIGJpbm5lZCBncm91cCBieSBmaWVsZCB3aXRob3V0IGltcHV0ZSwgd2UgbmVlZCBib3RoIGJpbiAoc3RhcnQpIGFuZCBiaW5fZW5kXG4gICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge30pLFxuICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnfSlcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZildO1xuICAgIH1cbiAgICByZXR1cm4gW107XG4gIH1cblxuICBwdWJsaWMgYXNzZW1ibGUoKTogVmdUcmFuc2Zvcm1bXSB7XG4gICAgY29uc3QgdHJhbnNmb3JtOiBWZ1RyYW5zZm9ybVtdID0gW107XG5cbiAgICBjb25zdCB7ZmFjZXRieSwgZmllbGQ6IHN0YWNrRmllbGQsIGRpbWVuc2lvbkZpZWxkRGVmLCBpbXB1dGUsIG9mZnNldCwgc29ydCwgc3RhY2tieX0gPSB0aGlzLl9zdGFjaztcblxuICAgIC8vIEltcHV0ZVxuICAgIGlmIChpbXB1dGUgJiYgZGltZW5zaW9uRmllbGREZWYpIHtcbiAgICAgIGNvbnN0IGRpbWVuc2lvbkZpZWxkID0gZGltZW5zaW9uRmllbGREZWYgPyB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnbWlkJ30pOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChkaW1lbnNpb25GaWVsZERlZi5iaW4pIHtcbiAgICAgICAgLy8gQXMgd2UgY2FuIG9ubHkgaW1wdXRlIG9uZSBmaWVsZCBhdCBhIHRpbWUsIHdlIG5lZWQgdG8gY2FsY3VsYXRlXG4gICAgICAgIC8vIG1pZCBwb2ludCBmb3IgYSBiaW5uZWQgZmllbGRcbiAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByOiAnKCcgK1xuICAgICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2V4cHI6ICdkYXR1bSd9KSArXG4gICAgICAgICAgICAnKycgK1xuICAgICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2V4cHI6ICdkYXR1bScsIGJpblN1ZmZpeDogJ2VuZCd9KSArXG4gICAgICAgICAgICAnKS8yJyxcbiAgICAgICAgICBhczogZGltZW5zaW9uRmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2ltcHV0ZScsXG4gICAgICAgIGZpZWxkOiBzdGFja0ZpZWxkLFxuICAgICAgICBncm91cGJ5OiBzdGFja2J5LFxuICAgICAgICBrZXk6IGRpbWVuc2lvbkZpZWxkLFxuICAgICAgICBtZXRob2Q6ICd2YWx1ZScsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTdGFja1xuICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICBncm91cGJ5OiB0aGlzLmdldEdyb3VwYnlGaWVsZHMoKS5jb25jYXQoZmFjZXRieSksXG4gICAgICBmaWVsZDogc3RhY2tGaWVsZCxcbiAgICAgIHNvcnQsXG4gICAgICBhczogW1xuICAgICAgICBzdGFja0ZpZWxkICsgJ19zdGFydCcsXG4gICAgICAgIHN0YWNrRmllbGQgKyAnX2VuZCdcbiAgICAgIF0sXG4gICAgICBvZmZzZXRcbiAgICB9KTtcblxuICAgIHJldHVybiB0cmFuc2Zvcm07XG4gIH1cbn1cbiJdfQ==