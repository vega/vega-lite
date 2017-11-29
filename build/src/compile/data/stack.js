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
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var common_1 = require("../common");
var dataflow_1 = require("./dataflow");
function getStackByFields(model) {
    return model.stack.stackBy.reduce(function (fields, by) {
        var fieldDef = by.fieldDef;
        var _field = fielddef_1.field(fieldDef);
        if (_field) {
            fields.push(_field);
        }
        return fields;
    }, []);
}
var StackNode = /** @class */ (function (_super) {
    __extends(StackNode, _super);
    function StackNode(stack) {
        var _this = _super.call(this) || this;
        _this._stack = stack;
        return _this;
    }
    StackNode.prototype.clone = function () {
        return new StackNode(util_1.duplicate(this._stack));
    };
    StackNode.make = function (model) {
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
        return new StackNode({
            dimensionFieldDef: dimensionFieldDef,
            field: model.field(stackProperties.fieldChannel),
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
                    return [fielddef_1.field(dimensionFieldDef, { binSuffix: 'mid' })];
                }
                return [
                    // For binned group by field without impute, we need both bin (start) and bin_end
                    fielddef_1.field(dimensionFieldDef, {}),
                    fielddef_1.field(dimensionFieldDef, { binSuffix: 'end' })
                ];
            }
            return [fielddef_1.field(dimensionFieldDef)];
        }
        return [];
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var _a = this._stack, facetby = _a.facetby, stackField = _a.field, dimensionFieldDef = _a.dimensionFieldDef, impute = _a.impute, offset = _a.offset, sort = _a.sort, stackby = _a.stackby;
        // Impute
        if (impute && dimensionFieldDef) {
            var dimensionField = dimensionFieldDef ? fielddef_1.field(dimensionFieldDef, { binSuffix: 'mid' }) : undefined;
            if (dimensionFieldDef.bin) {
                // As we can only impute one field at a time, we need to calculate
                // mid point for a binned field
                transform.push({
                    type: 'formula',
                    expr: '(' +
                        fielddef_1.field(dimensionFieldDef, { expr: 'datum' }) +
                        '+' +
                        fielddef_1.field(dimensionFieldDef, { expr: 'datum', binSuffix: 'end' }) +
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFrQztBQUNsQywyQ0FBK0M7QUFFL0MsbUNBQXFDO0FBRXJDLG9DQUFxQztBQUVyQyx1Q0FBd0M7QUFHeEMsMEJBQTBCLEtBQWdCO0lBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsRUFBRTtRQUMzQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBRTdCLElBQU0sTUFBTSxHQUFHLGdCQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxFQUFFLEVBQWMsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFrQ0Q7SUFBK0IsNkJBQVk7SUFPekMsbUJBQVksS0FBcUI7UUFBakMsWUFDRSxpQkFBTyxTQUdSO1FBREMsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0lBQ3RCLENBQUM7SUFSTSx5QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQVFhLGNBQUksR0FBbEIsVUFBbUIsS0FBZ0I7UUFFakMsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxJ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LEdBQUcsTUFBTTthQUNwQjtZQUNELE1BQU0sUUFBQTtTQUNQLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXZKRCxDQUErQix1QkFBWSxHQXVKMUM7QUF2SlksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge2ZpZWxkLCBGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtTdGFja09mZnNldH0gZnJvbSAnLi4vLi4vc3RhY2snO1xuaW1wb3J0IHtkdXBsaWNhdGV9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ1NvcnQsIFZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3NvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi8uLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuXG5mdW5jdGlvbiBnZXRTdGFja0J5RmllbGRzKG1vZGVsOiBVbml0TW9kZWwpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBtb2RlbC5zdGFjay5zdGFja0J5LnJlZHVjZSgoZmllbGRzLCBieSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gYnkuZmllbGREZWY7XG5cbiAgICBjb25zdCBfZmllbGQgPSBmaWVsZChmaWVsZERlZik7XG4gICAgaWYgKF9maWVsZCkge1xuICAgICAgZmllbGRzLnB1c2goX2ZpZWxkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcztcbiAgfSwgW10gYXMgc3RyaW5nW10pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrQ29tcG9uZW50IHtcbiAgLyoqXG4gICAqIEZhY2V0ZWQgZmllbGQuXG4gICAqL1xuICBmYWNldGJ5OiBzdHJpbmdbXTtcblxuICBkaW1lbnNpb25GaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcblxuICAvKipcbiAgICogU3RhY2sgbWVhc3VyZSdzIGZpZWxkXG4gICAqL1xuICBmaWVsZDogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBMZXZlbCBvZiBkZXRhaWwgZmllbGRzIGZvciBlYWNoIGxldmVsIGluIHRoZSBzdGFja2VkIGNoYXJ0cyBzdWNoIGFzIGNvbG9yIG9yIGRldGFpbC5cbiAgICovXG4gIHN0YWNrYnk6IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBGaWVsZCB0aGF0IGRldGVybWluZXMgb3JkZXIgb2YgbGV2ZWxzIGluIHRoZSBzdGFja2VkIGNoYXJ0cy5cbiAgICovXG4gIHNvcnQ6IFZnU29ydDtcblxuICAvKiogTW9kZSBmb3Igc3RhY2tpbmcgbWFya3MuICovXG4gIG9mZnNldDogU3RhY2tPZmZzZXQ7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaW1wdXRlIHRoZSBkYXRhIGJlZm9yZSBzdGFja2luZy5cbiAgICovXG4gIGltcHV0ZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNsYXNzIFN0YWNrTm9kZSBleHRlbmRzIERhdGFGbG93Tm9kZSB7XG4gIHByaXZhdGUgX3N0YWNrOiBTdGFja0NvbXBvbmVudDtcblxuICBwdWJsaWMgY2xvbmUoKSB7XG4gICAgcmV0dXJuIG5ldyBTdGFja05vZGUoZHVwbGljYXRlKHRoaXMuX3N0YWNrKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihzdGFjazogU3RhY2tDb21wb25lbnQpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5fc3RhY2sgPSBzdGFjaztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZShtb2RlbDogVW5pdE1vZGVsKSB7XG5cbiAgICBjb25zdCBzdGFja1Byb3BlcnRpZXMgPSBtb2RlbC5zdGFjaztcblxuICAgIGlmICghc3RhY2tQcm9wZXJ0aWVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZGltZW5zaW9uRmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG4gICAgaWYgKHN0YWNrUHJvcGVydGllcy5ncm91cGJ5Q2hhbm5lbCkge1xuICAgICAgZGltZW5zaW9uRmllbGREZWYgPSBtb2RlbC5maWVsZERlZihzdGFja1Byb3BlcnRpZXMuZ3JvdXBieUNoYW5uZWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrYnkgPSBnZXRTdGFja0J5RmllbGRzKG1vZGVsKTtcbiAgICBjb25zdCBvcmRlckRlZiA9IG1vZGVsLmVuY29kaW5nLm9yZGVyO1xuXG4gICAgbGV0IHNvcnQ6IFZnU29ydDtcbiAgICBpZiAob3JkZXJEZWYpIHtcbiAgICAgIHNvcnQgPSBzb3J0UGFyYW1zKG9yZGVyRGVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCA9IGRlc2NlbmRpbmcgYnkgc3RhY2tGaWVsZHNcbiAgICAgIC8vIEZJWE1FIGlzIHRoZSBkZWZhdWx0IGhlcmUgY29ycmVjdCBmb3IgYmlubmVkIGZpZWxkcz9cbiAgICAgIHNvcnQgPSBzdGFja2J5LnJlZHVjZSgocywgZmllbGQpID0+IHtcbiAgICAgICAgcy5maWVsZC5wdXNoKGZpZWxkKTtcbiAgICAgICAgcy5vcmRlci5wdXNoKCdkZXNjZW5kaW5nJyk7XG4gICAgICAgIHJldHVybiBzO1xuICAgICAgfSwge2ZpZWxkOltdLCBvcmRlcjogW119KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFN0YWNrTm9kZSh7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZixcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChzdGFja1Byb3BlcnRpZXMuZmllbGRDaGFubmVsKSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgc3RhY2tieSxcbiAgICAgIHNvcnQsXG4gICAgICBvZmZzZXQ6IHN0YWNrUHJvcGVydGllcy5vZmZzZXQsXG4gICAgICBpbXB1dGU6IHN0YWNrUHJvcGVydGllcy5pbXB1dGUsXG4gICAgfSk7XG4gIH1cblxuICBnZXQgc3RhY2soKTogU3RhY2tDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9zdGFjaztcbiAgfVxuXG4gIHB1YmxpYyBhZGREaW1lbnNpb25zKGZpZWxkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5ID0gdGhpcy5fc3RhY2suZmFjZXRieS5jb25jYXQoZmllbGRzKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGRdID0gdHJ1ZTtcblxuICAgIHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5LmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuX3N0YWNrLnNvcnQuZmllbGQ7XG4gICAgaXNBcnJheShmaWVsZCkgPyBmaWVsZC5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSkgOiBvdXRbZmllbGRdID0gdHJ1ZTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGQgKyAnX3N0YXJ0J10gPSB0cnVlO1xuICAgIG91dFt0aGlzLl9zdGFjay5maWVsZCArICdfZW5kJ10gPSB0cnVlO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R3JvdXBieUZpZWxkcygpIHtcbiAgICBjb25zdCB7ZGltZW5zaW9uRmllbGREZWYsIGltcHV0ZX0gPSB0aGlzLl9zdGFjaztcbiAgICBpZiAoZGltZW5zaW9uRmllbGREZWYpIHtcbiAgICAgIGlmIChkaW1lbnNpb25GaWVsZERlZi5iaW4pIHtcbiAgICAgICAgaWYgKGltcHV0ZSkge1xuICAgICAgICAgIC8vIEZvciBiaW5uZWQgZ3JvdXAgYnkgZmllbGQgd2l0aCBpbXB1dGUsIHdlIGNhbGN1bGF0ZSBiaW5fbWlkXG4gICAgICAgICAgLy8gYXMgd2UgY2Fubm90IGltcHV0ZSB0d28gZmllbGRzIHNpbXVsdGFuZW91c2x5XG4gICAgICAgICAgcmV0dXJuIFtmaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ21pZCd9KV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAvLyBGb3IgYmlubmVkIGdyb3VwIGJ5IGZpZWxkIHdpdGhvdXQgaW1wdXRlLCB3ZSBuZWVkIGJvdGggYmluIChzdGFydCkgYW5kIGJpbl9lbmRcbiAgICAgICAgICBmaWVsZChkaW1lbnNpb25GaWVsZERlZiwge30pLFxuICAgICAgICAgIGZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnZW5kJ30pXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gW2ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmKV07XG4gICAgfVxuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ1RyYW5zZm9ybVtdIHtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFZnVHJhbnNmb3JtW10gPSBbXTtcblxuICAgIGNvbnN0IHtmYWNldGJ5LCBmaWVsZDogc3RhY2tGaWVsZCwgZGltZW5zaW9uRmllbGREZWYsIGltcHV0ZSwgb2Zmc2V0LCBzb3J0LCBzdGFja2J5fSA9IHRoaXMuX3N0YWNrO1xuXG4gICAgLy8gSW1wdXRlXG4gICAgaWYgKGltcHV0ZSAmJiBkaW1lbnNpb25GaWVsZERlZikge1xuICAgICAgY29uc3QgZGltZW5zaW9uRmllbGQgPSBkaW1lbnNpb25GaWVsZERlZiA/IGZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnbWlkJ30pOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChkaW1lbnNpb25GaWVsZERlZi5iaW4pIHtcbiAgICAgICAgLy8gQXMgd2UgY2FuIG9ubHkgaW1wdXRlIG9uZSBmaWVsZCBhdCBhIHRpbWUsIHdlIG5lZWQgdG8gY2FsY3VsYXRlXG4gICAgICAgIC8vIG1pZCBwb2ludCBmb3IgYSBiaW5uZWQgZmllbGRcbiAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByOiAnKCcgK1xuICAgICAgICAgICAgZmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtleHByOiAnZGF0dW0nfSkgK1xuICAgICAgICAgICAgJysnICtcbiAgICAgICAgICAgIGZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJywgYmluU3VmZml4OiAnZW5kJ30pICtcbiAgICAgICAgICAgICcpLzInLFxuICAgICAgICAgIGFzOiBkaW1lbnNpb25GaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnaW1wdXRlJyxcbiAgICAgICAgZmllbGQ6IHN0YWNrRmllbGQsXG4gICAgICAgIGdyb3VwYnk6IHN0YWNrYnksXG4gICAgICAgIGtleTogZGltZW5zaW9uRmllbGQsXG4gICAgICAgIG1ldGhvZDogJ3ZhbHVlJyxcbiAgICAgICAgdmFsdWU6IDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFN0YWNrXG4gICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgIGdyb3VwYnk6IHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmNvbmNhdChmYWNldGJ5KSxcbiAgICAgIGZpZWxkOiBzdGFja0ZpZWxkLFxuICAgICAgc29ydCxcbiAgICAgIGFzOiBbXG4gICAgICAgIHN0YWNrRmllbGQgKyAnX3N0YXJ0JyxcbiAgICAgICAgc3RhY2tGaWVsZCArICdfZW5kJ1xuICAgICAgXSxcbiAgICAgIG9mZnNldFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgfVxufVxuIl19