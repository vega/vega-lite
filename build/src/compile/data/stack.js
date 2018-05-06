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
        if (vega_util_1.isArray(orderDef) || fielddef_1.isFieldDef(orderDef)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFrQztBQUNsQywyQ0FBNkQ7QUFFN0QsbUNBQXFDO0FBRXJDLG9DQUFxQztBQUVyQyx1Q0FBd0M7QUFHeEMsMEJBQTBCLEtBQWdCO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEVBQUU7UUFDM0MsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUU3QixJQUFNLE1BQU0sR0FBRyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsRUFBRSxFQUFjLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBa0NEO0lBQStCLHFDQUFZO0lBT3pDLG1CQUFZLE1BQW9CLEVBQUUsS0FBcUI7UUFBdkQsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FHZDtRQURDLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztJQUN0QixDQUFDO0lBUk0seUJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQVFhLGNBQUksR0FBbEIsVUFBbUIsTUFBb0IsRUFBRSxLQUFnQjtRQUV2RCxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBRXBDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELElBQUksaUJBQW1DLENBQUM7UUFDeEMsSUFBSSxlQUFlLENBQUMs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QkFDekIsa0VBQWtFO2dCQUNsRSwrQkFBK0I7Z0JBQy9CLFNBQVMsQ0FBQyxJQUFJLENBQUM7b0JBQ2IsSUFBSSxFQUFFLFNBQVM7b0JBQ2YsSUFBSSxFQUFFLEdBQUc7d0JBQ1Asa0JBQU8sQ0FBQyxpQkFBaUIsRUFBRSxFQUFDLElBQUksRUFBRSxPQUFPLEVBQUMsQ0FBQzt3QkFDM0MsR0FBRzt3QkFDSCxrQkFBTyxDQUFDLGlCQUFpQixFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUM7d0JBQzdELEtBQUs7b0JBQ1AsRUFBRSxFQUFFLGNBQWM7aUJBQ25CLENBQUMsQ0FBQzthQUNKO1lBRUQsU0FBUyxDQUFDLElBQUksQ0FBQztnQkFDYixJQUFJLEVBQUUsUUFBUTtnQkFDZCxLQUFLLEVBQUUsVUFBVTtnQkFDakIsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLEdBQUcsRUFBRSxjQUFjO2dCQUNuQixNQUFNLEVBQUUsT0FBTztnQkFDZixLQUFLLEVBQUUsQ0FBQzthQUNULENBQUMsQ0FBQztTQUNKO1FBRUQsUUFBUTtRQUNSLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDYixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2hELEtBQUssRUFBRSxVQUFVO1lBQ2pCLElBQUksTUFBQTtZQUNKLEVBQUUsRUFBRTtnQkFDRixVQUFVLEdBQUcsUUFBUTtnQkFDckIsVUFBVSxHQUFHLE1BQU07YUFDcEI7WUFDRCxNQUFNLFFBQUE7U0FDUCxDQUFDLENBQUM7UUFFSCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBdkpELENBQStCLHVCQUFZLEdBdUoxQztBQXZKWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNBcnJheX0gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7RmllbGREZWYsIGlzRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7U3RhY2tPZmZzZXR9IGZyb20gJy4uLy4uL3N0YWNrJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdTb3J0LCBWZ1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtzb3J0UGFyYW1zfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4vLi4vdW5pdCc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5cblxuZnVuY3Rpb24gZ2V0U3RhY2tCeUZpZWxkcyhtb2RlbDogVW5pdE1vZGVsKTogc3RyaW5nW10ge1xuICByZXR1cm4gbW9kZWwuc3RhY2suc3RhY2tCeS5yZWR1Y2UoKGZpZWxkcywgYnkpID0+IHtcbiAgICBjb25zdCBmaWVsZERlZiA9IGJ5LmZpZWxkRGVmO1xuXG4gICAgY29uc3QgX2ZpZWxkID0gdmdGaWVsZChmaWVsZERlZik7XG4gICAgaWYgKF9maWVsZCkge1xuICAgICAgZmllbGRzLnB1c2goX2ZpZWxkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcztcbiAgfSwgW10gYXMgc3RyaW5nW10pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIEZhY2V0ZWQgZmllbGQuXG4gICAqL1xuICBmYWNldGJ5OiBzdHJpbmdbXTtcblxuICBkaW1lbnNpb25GaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcblxuICAvKipcbiAgICogU3RhY2sgbWVhc3VyZSdzIGZpZWxkXG4gICAqL1xuICBmaWVsZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMZXZlbCBvZiBkZXRhaWwgZmllbGRzIGZvciBlYWNoIGxldmVsIGluIHRoZSBzdGFja2VkIGNoYXJ0cyBzdWNoIGFzIGNvbG9yIG9yIGRldGFpbC5cbiAgICovXG4gIHN0YWNrYnk6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBGaWVsZCB0aGF0IGRldGVybWluZXMgb3JkZXIgb2YgbGV2ZWxzIGluIHRoZSBzdGFja2VkIGNoYXJ0cy5cbiAgICovXG4gIHNvcnQ6IFZnU29ydDtcblxuICAvKiogTW9kZSBmb3Igc3RhY2tpbmcgbWFya3MuICovXG4gIG9mZnNldDogU3RhY2tPZmZzZXQ7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaW1wdXRlIHRoZSBkYXRhIGJlZm9yZSBzdGFja2luZy5cbiAgICovXG4gIGltcHV0ZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YWNrTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX3N0YWNrOiBTdGFja0NvbXBvbmVudDtcblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBTdGFja05vZGUobnVsbCwgZHVwbGljYXRlKHRoaXMuX3N0YWNrKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwYXJlbnQ6IERhdGFGbG93Tm9kZSwgc3RhY2s6IFN0YWNrQ29tcG9uZW50KSB7XG4gICAgc3VwZXIocGFyZW50KTtcblxuICAgIHRoaXMuX3N0YWNrID0gc3RhY2s7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2UocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBVbml0TW9kZWwpIHtcblxuICAgIGNvbnN0IHN0YWNrUHJvcGVydGllcyA9IG1vZGVsLnN0YWNrO1xuXG4gICAgaWYgKCFzdGFja1Byb3BlcnRpZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBkaW1lbnNpb25GaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcbiAgICBpZiAoc3RhY2tQcm9wZXJ0aWVzLmdyb3VwYnlDaGFubmVsKSB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKHN0YWNrUHJvcGVydGllcy5ncm91cGJ5Q2hhbm5lbCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhY2tieSA9IGdldFN0YWNrQnlGaWVsZHMobW9kZWwpO1xuICAgIGNvbnN0IG9yZGVyRGVmID0gbW9kZWwuZW5jb2Rpbmcub3JkZXI7XG5cbiAgICBsZXQgc29ydDogVmdTb3J0O1xuICAgIGlmIChpc0FycmF5KG9yZGVyRGVmKSB8fCBpc0ZpZWxkRGVmKG9yZGVyRGVmKSkge1xuICAgICAgc29ydCA9IHNvcnRQYXJhbXMob3JkZXJEZWYpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0ID0gZGVzY2VuZGluZyBieSBzdGFja0ZpZWxkc1xuICAgICAgLy8gRklYTUUgaXMgdGhlIGRlZmF1bHQgaGVyZSBjb3JyZWN0IGZvciBiaW5uZWQgZmllbGRzP1xuICAgICAgc29ydCA9IHN0YWNrYnkucmVkdWNlKChzLCBmaWVsZCkgPT4ge1xuICAgICAgICBzLmZpZWxkLnB1c2goZmllbGQpO1xuICAgICAgICBzLm9yZGVyLnB1c2goJ2Rlc2NlbmRpbmcnKTtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICB9LCB7ZmllbGQ6W10sIG9yZGVyOiBbXX0pO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgU3RhY2tOb2RlKHBhcmVudCwge1xuICAgICAgZGltZW5zaW9uRmllbGREZWYsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChzdGFja1Byb3BlcnRpZXMuZmllbGRDaGFubmVsKSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgc3RhY2tieSxcbiAgICAgIHNvcnQsXG4gICAgICBvZmZzZXQ6IHN0YWNrUHJvcGVydGllcy5vZmZzZXQsXG4gICAgICBpbXB1dGU6IHN0YWNrUHJvcGVydGllcy5pbXB1dGUsXG4gICAgfSk7XG4gIH1cblxuICBnZXQgc3RhY2soKTogU3RhY2tDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9zdGFjaztcbiAgfVxuXG4gIHB1YmxpYyBhZGREaW1lbnNpb25zKGZpZWxkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5ID0gdGhpcy5fc3RhY2suZmFjZXRieS5jb25jYXQoZmllbGRzKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGRdID0gdHJ1ZTtcblxuICAgIHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5LmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuX3N0YWNrLnNvcnQuZmllbGQ7XG4gICAgaXNBcnJheShmaWVsZCkgPyBmaWVsZC5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSkgOiBvdXRbZmllbGRdID0gdHJ1ZTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGQgKyAnX3N0YXJ0J10gPSB0cnVlO1xuICAgIG91dFt0aGlzLl9zdGFjay5maWVsZCArICdfZW5kJ10gPSB0cnVlO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R3JvdXBieUZpZWxkcygpIHtcbiAgICBjb25zdCB7ZGltZW5zaW9uRmllbGREZWYsIGltcHV0ZX0gPSB0aGlzLl9zdGFjaztcbiAgICBpZiAoZGltZW5zaW9uRmllbGREZWYpIHtcbiAgICAgIGlmIChkaW1lbnNpb25GaWVsZERlZi5iaW4pIHtcbiAgICAgICAgaWYgKGltcHV0ZSkge1xuICAgICAgICAgIC8vIEZvciBiaW5uZWQgZ3JvdXAgYnkgZmllbGQgd2l0aCBpbXB1dGUsIHdlIGNhbGN1bGF0ZSBiaW5fbWlkXG4gICAgICAgICAgLy8gYXMgd2UgY2Fubm90IGltcHV0ZSB0d28gZmllbGRzIHNpbXVsdGFuZW91c2x5XG4gICAgICAgICAgcmV0dXJuIFt2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnbWlkJ30pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIC8vIEZvciBiaW5uZWQgZ3JvdXAgYnkgZmllbGQgd2l0aG91dCBpbXB1dGUsIHdlIG5lZWQgYm90aCBiaW4gKHN0YXJ0KSBhbmQgYmluX2VuZFxuICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHt9KSxcbiAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnZW5kJ30pXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gW3ZnRmllbGQoZGltZW5zaW9uRmllbGREZWYpXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnVHJhbnNmb3JtW10ge1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVmdUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gICAgY29uc3Qge2ZhY2V0YnksIGZpZWxkOiBzdGFja0ZpZWxkLCBkaW1lbnNpb25GaWVsZERlZiwgaW1wdXRlLCBvZmZzZXQsIHNvcnQsIHN0YWNrYnl9ID0gdGhpcy5fc3RhY2s7XG5cbiAgICAvLyBJbXB1dGVcbiAgICBpZiAoaW1wdXRlICYmIGRpbWVuc2lvbkZpZWxkRGVmKSB7XG4gICAgICBjb25zdCBkaW1lbnNpb25GaWVsZCA9IGRpbWVuc2lvbkZpZWxkRGVmID8gdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ21pZCd9KTogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoZGltZW5zaW9uRmllbGREZWYuYmluKSB7XG4gICAgICAgIC8vIEFzIHdlIGNhbiBvbmx5IGltcHV0ZSBvbmUgZmllbGQgYXQgYSB0aW1lLCB3ZSBuZWVkIHRvIGNhbGN1bGF0ZVxuICAgICAgICAvLyBtaWQgcG9pbnQgZm9yIGEgYmlubmVkIGZpZWxkXG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZXhwcjogJygnICtcbiAgICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtleHByOiAnZGF0dW0nfSkgK1xuICAgICAgICAgICAgJysnICtcbiAgICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtleHByOiAnZGF0dW0nLCBiaW5TdWZmaXg6ICdlbmQnfSkgK1xuICAgICAgICAgICAgJykvMicsXG4gICAgICAgICAgYXM6IGRpbWVuc2lvbkZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgICAgICBmaWVsZDogc3RhY2tGaWVsZCxcbiAgICAgICAgZ3JvdXBieTogc3RhY2tieSxcbiAgICAgICAga2V5OiBkaW1lbnNpb25GaWVsZCxcbiAgICAgICAgbWV0aG9kOiAndmFsdWUnLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU3RhY2tcbiAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgZ3JvdXBieTogdGhpcy5nZXRHcm91cGJ5RmllbGRzKCkuY29uY2F0KGZhY2V0YnkpLFxuICAgICAgZmllbGQ6IHN0YWNrRmllbGQsXG4gICAgICBzb3J0LFxuICAgICAgYXM6IFtcbiAgICAgICAgc3RhY2tGaWVsZCArICdfc3RhcnQnLFxuICAgICAgICBzdGFja0ZpZWxkICsgJ19lbmQnXG4gICAgICBdLFxuICAgICAgb2Zmc2V0XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9XG59XG4iXX0=