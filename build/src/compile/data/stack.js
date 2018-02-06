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
        var _field = fielddef_1.vgField(fieldDef);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztBQUFBLHVDQUFrQztBQUNsQywyQ0FBaUQ7QUFFakQsbUNBQXFDO0FBRXJDLG9DQUFxQztBQUVyQyx1Q0FBd0M7QUFHeEMsMEJBQTBCLEtBQWdCO0lBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsRUFBRTtRQUMzQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDO1FBRTdCLElBQU0sTUFBTSxHQUFHLGtCQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxFQUFFLEVBQWMsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFrQ0Q7SUFBK0IsNkJBQVk7SUFPekMsbUJBQVksS0FBcUI7UUFBakMsWUFDRSxpQkFBTyxTQUdSO1FBREMsS0FBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7O0lBQ3RCLENBQUM7SUFSTSx5QkFBSyxHQUFaO1FBQ0UsTUFBTSxDQUFDLElBQUksU0FBUyxDQUFDLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQVFhLGNBQUksR0FBbEIsVUFBbUIsS0FBZ0I7UUFFakMsSUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUVwQyxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCxJ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LEdBQUcsTUFBTTthQUNwQjtZQUNELE1BQU0sUUFBQTtTQUNQLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUNILGdCQUFDO0FBQUQsQ0FBQyxBQXZKRCxDQUErQix1QkFBWSxHQXVKMUM7QUF2SlksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0ZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQge1N0YWNrT2Zmc2V0fSBmcm9tICcuLi8uLi9zdGFjayc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnU29ydCwgVmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7c29ydFBhcmFtc30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLy4uL3VuaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5cbmZ1bmN0aW9uIGdldFN0YWNrQnlGaWVsZHMobW9kZWw6IFVuaXRNb2RlbCk6IHN0cmluZ1tdIHtcbiAgcmV0dXJuIG1vZGVsLnN0YWNrLnN0YWNrQnkucmVkdWNlKChmaWVsZHMsIGJ5KSA9PiB7XG4gICAgY29uc3QgZmllbGREZWYgPSBieS5maWVsZERlZjtcblxuICAgIGNvbnN0IF9maWVsZCA9IHZnRmllbGQoZmllbGREZWYpO1xuICAgIGlmIChfZmllbGQpIHtcbiAgICAgIGZpZWxkcy5wdXNoKF9maWVsZCk7XG4gICAgfVxuICAgIHJldHVybiBmaWVsZHM7XG4gIH0sIFtdIGFzIHN0cmluZ1tdKTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdGFja0NvbXBvbmVudCB7XG4gIC8qKlxuICAgKiBGYWNldGVkIGZpZWxkLlxuICAgKi9cbiAgZmFjZXRieTogc3RyaW5nW107XG5cbiAgZGltZW5zaW9uRmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG5cbiAgLyoqXG4gICAqIFN0YWNrIG1lYXN1cmUncyBmaWVsZFxuICAgKi9cbiAgZmllbGQ6IHN0cmluZztcblxuICAvKipcbiAgICogTGV2ZWwgb2YgZGV0YWlsIGZpZWxkcyBmb3IgZWFjaCBsZXZlbCBpbiB0aGUgc3RhY2tlZCBjaGFydHMgc3VjaCBhcyBjb2xvciBvciBkZXRhaWwuXG4gICAqL1xuICBzdGFja2J5OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRmllbGQgdGhhdCBkZXRlcm1pbmVzIG9yZGVyIG9mIGxldmVscyBpbiB0aGUgc3RhY2tlZCBjaGFydHMuXG4gICAqL1xuICBzb3J0OiBWZ1NvcnQ7XG5cbiAgLyoqIE1vZGUgZm9yIHN0YWNraW5nIG1hcmtzLiAqL1xuICBvZmZzZXQ6IFN0YWNrT2Zmc2V0O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGltcHV0ZSB0aGUgZGF0YSBiZWZvcmUgc3RhY2tpbmcuXG4gICAqL1xuICBpbXB1dGU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBTdGFja05vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9zdGFjazogU3RhY2tDb21wb25lbnQ7XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgU3RhY2tOb2RlKGR1cGxpY2F0ZSh0aGlzLl9zdGFjaykpO1xuICB9XG5cbiAgY29uc3RydWN0b3Ioc3RhY2s6IFN0YWNrQ29tcG9uZW50KSB7XG4gICAgc3VwZXIoKTtcblxuICAgIHRoaXMuX3N0YWNrID0gc3RhY2s7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIG1ha2UobW9kZWw6IFVuaXRNb2RlbCkge1xuXG4gICAgY29uc3Qgc3RhY2tQcm9wZXJ0aWVzID0gbW9kZWwuc3RhY2s7XG5cbiAgICBpZiAoIXN0YWNrUHJvcGVydGllcykge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IGRpbWVuc2lvbkZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+O1xuICAgIGlmIChzdGFja1Byb3BlcnRpZXMuZ3JvdXBieUNoYW5uZWwpIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoc3RhY2tQcm9wZXJ0aWVzLmdyb3VwYnlDaGFubmVsKTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFja2J5ID0gZ2V0U3RhY2tCeUZpZWxkcyhtb2RlbCk7XG4gICAgY29uc3Qgb3JkZXJEZWYgPSBtb2RlbC5lbmNvZGluZy5vcmRlcjtcblxuICAgIGxldCBzb3J0OiBWZ1NvcnQ7XG4gICAgaWYgKG9yZGVyRGVmKSB7XG4gICAgICBzb3J0ID0gc29ydFBhcmFtcyhvcmRlckRlZik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGRlZmF1bHQgPSBkZXNjZW5kaW5nIGJ5IHN0YWNrRmllbGRzXG4gICAgICAvLyBGSVhNRSBpcyB0aGUgZGVmYXVsdCBoZXJlIGNvcnJlY3QgZm9yIGJpbm5lZCBmaWVsZHM/XG4gICAgICBzb3J0ID0gc3RhY2tieS5yZWR1Y2UoKHMsIGZpZWxkKSA9PiB7XG4gICAgICAgIHMuZmllbGQucHVzaChmaWVsZCk7XG4gICAgICAgIHMub3JkZXIucHVzaCgnZGVzY2VuZGluZycpO1xuICAgICAgICByZXR1cm4gcztcbiAgICAgIH0sIHtmaWVsZDpbXSwgb3JkZXI6IFtdfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTdGFja05vZGUoe1xuICAgICAgZGltZW5zaW9uRmllbGREZWYsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChzdGFja1Byb3BlcnRpZXMuZmllbGRDaGFubmVsKSxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgc3RhY2tieSxcbiAgICAgIHNvcnQsXG4gICAgICBvZmZzZXQ6IHN0YWNrUHJvcGVydGllcy5vZmZzZXQsXG4gICAgICBpbXB1dGU6IHN0YWNrUHJvcGVydGllcy5pbXB1dGUsXG4gICAgfSk7XG4gIH1cblxuICBnZXQgc3RhY2soKTogU3RhY2tDb21wb25lbnQge1xuICAgIHJldHVybiB0aGlzLl9zdGFjaztcbiAgfVxuXG4gIHB1YmxpYyBhZGREaW1lbnNpb25zKGZpZWxkczogc3RyaW5nW10pIHtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5ID0gdGhpcy5fc3RhY2suZmFjZXRieS5jb25jYXQoZmllbGRzKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXBlbmRlbnRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGRdID0gdHJ1ZTtcblxuICAgIHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5LmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuX3N0YWNrLnNvcnQuZmllbGQ7XG4gICAgaXNBcnJheShmaWVsZCkgPyBmaWVsZC5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSkgOiBvdXRbZmllbGRdID0gdHJ1ZTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgY29uc3Qgb3V0ID0ge307XG5cbiAgICBvdXRbdGhpcy5fc3RhY2suZmllbGQgKyAnX3N0YXJ0J10gPSB0cnVlO1xuICAgIG91dFt0aGlzLl9zdGFjay5maWVsZCArICdfZW5kJ10gPSB0cnVlO1xuXG4gICAgcmV0dXJuIG91dDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0R3JvdXBieUZpZWxkcygpIHtcbiAgICBjb25zdCB7ZGltZW5zaW9uRmllbGREZWYsIGltcHV0ZX0gPSB0aGlzLl9zdGFjaztcbiAgICBpZiAoZGltZW5zaW9uRmllbGREZWYpIHtcbiAgICAgIGlmIChkaW1lbnNpb25GaWVsZERlZi5iaW4pIHtcbiAgICAgICAgaWYgKGltcHV0ZSkge1xuICAgICAgICAgIC8vIEZvciBiaW5uZWQgZ3JvdXAgYnkgZmllbGQgd2l0aCBpbXB1dGUsIHdlIGNhbGN1bGF0ZSBiaW5fbWlkXG4gICAgICAgICAgLy8gYXMgd2UgY2Fubm90IGltcHV0ZSB0d28gZmllbGRzIHNpbXVsdGFuZW91c2x5XG4gICAgICAgICAgcmV0dXJuIFt2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnbWlkJ30pXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIC8vIEZvciBiaW5uZWQgZ3JvdXAgYnkgZmllbGQgd2l0aG91dCBpbXB1dGUsIHdlIG5lZWQgYm90aCBiaW4gKHN0YXJ0KSBhbmQgYmluX2VuZFxuICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHt9KSxcbiAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnZW5kJ30pXG4gICAgICAgIF07XG4gICAgICB9XG4gICAgICByZXR1cm4gW3ZnRmllbGQoZGltZW5zaW9uRmllbGREZWYpXTtcbiAgICB9XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnVHJhbnNmb3JtW10ge1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVmdUcmFuc2Zvcm1bXSA9IFtdO1xuXG4gICAgY29uc3Qge2ZhY2V0YnksIGZpZWxkOiBzdGFja0ZpZWxkLCBkaW1lbnNpb25GaWVsZERlZiwgaW1wdXRlLCBvZmZzZXQsIHNvcnQsIHN0YWNrYnl9ID0gdGhpcy5fc3RhY2s7XG5cbiAgICAvLyBJbXB1dGVcbiAgICBpZiAoaW1wdXRlICYmIGRpbWVuc2lvbkZpZWxkRGVmKSB7XG4gICAgICBjb25zdCBkaW1lbnNpb25GaWVsZCA9IGRpbWVuc2lvbkZpZWxkRGVmID8gdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ21pZCd9KTogdW5kZWZpbmVkO1xuXG4gICAgICBpZiAoZGltZW5zaW9uRmllbGREZWYuYmluKSB7XG4gICAgICAgIC8vIEFzIHdlIGNhbiBvbmx5IGltcHV0ZSBvbmUgZmllbGQgYXQgYSB0aW1lLCB3ZSBuZWVkIHRvIGNhbGN1bGF0ZVxuICAgICAgICAvLyBtaWQgcG9pbnQgZm9yIGEgYmlubmVkIGZpZWxkXG4gICAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgICB0eXBlOiAnZm9ybXVsYScsXG4gICAgICAgICAgZXhwcjogJygnICtcbiAgICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtleHByOiAnZGF0dW0nfSkgK1xuICAgICAgICAgICAgJysnICtcbiAgICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtleHByOiAnZGF0dW0nLCBiaW5TdWZmaXg6ICdlbmQnfSkgK1xuICAgICAgICAgICAgJykvMicsXG4gICAgICAgICAgYXM6IGRpbWVuc2lvbkZpZWxkXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgIHR5cGU6ICdpbXB1dGUnLFxuICAgICAgICBmaWVsZDogc3RhY2tGaWVsZCxcbiAgICAgICAgZ3JvdXBieTogc3RhY2tieSxcbiAgICAgICAga2V5OiBkaW1lbnNpb25GaWVsZCxcbiAgICAgICAgbWV0aG9kOiAndmFsdWUnLFxuICAgICAgICB2YWx1ZTogMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU3RhY2tcbiAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICB0eXBlOiAnc3RhY2snLFxuICAgICAgZ3JvdXBieTogdGhpcy5nZXRHcm91cGJ5RmllbGRzKCkuY29uY2F0KGZhY2V0YnkpLFxuICAgICAgZmllbGQ6IHN0YWNrRmllbGQsXG4gICAgICBzb3J0LFxuICAgICAgYXM6IFtcbiAgICAgICAgc3RhY2tGaWVsZCArICdfc3RhcnQnLFxuICAgICAgICBzdGFja0ZpZWxkICsgJ19lbmQnXG4gICAgICBdLFxuICAgICAgb2Zmc2V0XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9XG59XG4iXX0=