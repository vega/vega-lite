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
function isValidAsArray(as) {
    return vega_util_1.isArray(as) && as.every(function (s) { return vega_util_1.isString(s); }) && as.length > 1;
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
    StackNode.makeFromTransform = function (parent, stackTransform) {
        var stack = stackTransform.stack, groupby = stackTransform.groupby, as = stackTransform.as, _a = stackTransform.offset, offset = _a === void 0 ? 'zero' : _a;
        var sortFields = [];
        var sortOrder = [];
        if (stackTransform.sort !== undefined) {
            for (var _i = 0, _b = stackTransform.sort; _i < _b.length; _i++) {
                var sortField = _b[_i];
                sortFields.push(sortField.field);
                sortOrder.push(sortField.order === undefined ? 'ascending' : sortField.order);
            }
        }
        var sort = {
            field: sortFields,
            order: sortOrder,
        };
        var normalizedAs;
        if (isValidAsArray(as)) {
            normalizedAs = as;
        }
        else if (vega_util_1.isString(as)) {
            normalizedAs = [as, as + '_end'];
        }
        else {
            normalizedAs = [stackTransform.stack + '_start', stackTransform.stack + '_end'];
        }
        return new StackNode(parent, {
            stackField: stack,
            groupby: groupby,
            offset: offset,
            sort: sort,
            facetby: [],
            as: normalizedAs
        });
    };
    StackNode.makeFromEncoding = function (parent, model) {
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
        // Refactored to add "as" in the make phase so that we can get producedFields
        // from the as property
        var field = model.vgField(stackProperties.fieldChannel);
        return new StackNode(parent, {
            dimensionFieldDef: dimensionFieldDef,
            stackField: field,
            facetby: [],
            stackby: stackby,
            sort: sort,
            offset: stackProperties.offset,
            impute: stackProperties.impute,
            as: [field + '_start', field + '_end']
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
        out[this._stack.stackField] = true;
        this.getGroupbyFields().forEach(function (f) { return out[f] = true; });
        this._stack.facetby.forEach(function (f) { return out[f] = true; });
        var field = this._stack.sort.field;
        vega_util_1.isArray(field) ? field.forEach(function (f) { return out[f] = true; }) : out[field] = true;
        return out;
    };
    StackNode.prototype.producedFields = function () {
        return this._stack.as.reduce(function (result, item) {
            result[item] = true;
            return result;
        }, {});
    };
    StackNode.prototype.getGroupbyFields = function () {
        var _a = this._stack, dimensionFieldDef = _a.dimensionFieldDef, impute = _a.impute, groupby = _a.groupby;
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
        return groupby || [];
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var _a = this._stack, facetby = _a.facetby, dimensionFieldDef = _a.dimensionFieldDef, field = _a.stackField, stackby = _a.stackby, sort = _a.sort, offset = _a.offset, impute = _a.impute, as = _a.as;
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
                field: field,
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
            field: field,
            sort: sort,
            as: as,
            offset: offset
        });
        return transform;
    };
    return StackNode;
}(dataflow_1.DataFlowNode));
exports.StackNode = StackNode;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUE0QztBQUM1QywyQ0FBNkQ7QUFHN0QsbUNBQXFDO0FBRXJDLG9DQUFxQztBQUVyQyx1Q0FBd0M7QUFFeEMsMEJBQTBCLEtBQWdCO0lBQ3hDLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQUMsTUFBTSxFQUFFLEVBQUU7UUFDM0MsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztRQUU3QixJQUFNLE1BQU0sR0FBRyxrQkFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsRUFBRSxFQUFjLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBZ0RELHdCQUF3QixFQUFxQjtJQUMzQyxPQUFPLG1CQUFPLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFBLG9CQUFRLENBQUMsQ0FBQyxDQUFDLEVBQVgsQ0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRSxDQUFDLENBQUM7QUFDbkUsQ0FBQztBQUVEO0lBQStCLHFDQUFZO0lBT3pDLG1CQUFZLE1BQW9CLEVBQUUsS0FBcUI7UUFBdkQsWUFDRSxrQkFBTSxNQUFNLENBQUMsU0FHZDtRQURDLEtBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDOztJQUN0QixDQUFDO0lBUk0seUJBQUssR0FBWjtRQUNFLE9BQU8sSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFLGdCQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FB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LENBQUM7WUFDYixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2hELEtBQUssT0FBQTtZQUNMLElBQUksTUFBQTtZQUNKLEVBQUUsSUFBQTtZQUNGLE1BQU0sUUFBQTtTQUNQLENBQUMsQ0FBQztRQUVILE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF4TEQsQ0FBK0IsdUJBQVksR0F3TDFDO0FBeExZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc0FycmF5LCBpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7RmllbGREZWYsIGlzRmllbGREZWYsIHZnRmllbGR9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCB7U3RhY2tPZmZzZXR9IGZyb20gJy4uLy4uL3N0YWNrJztcbmltcG9ydCB7U3RhY2tUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge2R1cGxpY2F0ZX0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnQ29tcGFyYXRvck9yZGVyLCBWZ1NvcnQsIFZnVHJhbnNmb3JtfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge3NvcnRQYXJhbXN9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi8uLi91bml0JztcbmltcG9ydCB7RGF0YUZsb3dOb2RlfSBmcm9tICcuL2RhdGFmbG93JztcblxuZnVuY3Rpb24gZ2V0U3RhY2tCeUZpZWxkcyhtb2RlbDogVW5pdE1vZGVsKTogc3RyaW5nW10ge1xuICByZXR1cm4gbW9kZWwuc3RhY2suc3RhY2tCeS5yZWR1Y2UoKGZpZWxkcywgYnkpID0+IHtcbiAgICBjb25zdCBmaWVsZERlZiA9IGJ5LmZpZWxkRGVmO1xuXG4gICAgY29uc3QgX2ZpZWxkID0gdmdGaWVsZChmaWVsZERlZik7XG4gICAgaWYgKF9maWVsZCkge1xuICAgICAgZmllbGRzLnB1c2goX2ZpZWxkKTtcbiAgICB9XG4gICAgcmV0dXJuIGZpZWxkcztcbiAgfSwgW10gYXMgc3RyaW5nW10pO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0YWNrQ29tcG9uZW50IHtcblxuICAvKipcbiAgICogRmFjZXRlZCBmaWVsZC5cbiAgICovXG4gIGZhY2V0Ynk6IHN0cmluZ1tdO1xuXG4gIGRpbWVuc2lvbkZpZWxkRGVmPzogRmllbGREZWY8c3RyaW5nPjtcblxuICAvKipcbiAgICogU3RhY2sgbWVhc3VyZSdzIGZpZWxkLiBVc2VkIGluIG1ha2VGcm9tRW5jb2RpbmcuXG4gICAqL1xuICBzdGFja0ZpZWxkOiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIExldmVsIG9mIGRldGFpbCBmaWVsZHMgZm9yIGVhY2ggbGV2ZWwgaW4gdGhlIHN0YWNrZWQgY2hhcnRzIHN1Y2ggYXMgY29sb3Igb3IgZGV0YWlsLlxuICAgKiBVc2VkIGluIG1ha2VGcm9tRW5jb2RpbmcuXG4gICAqL1xuICBzdGFja2J5Pzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIEZpZWxkIHRoYXQgZGV0ZXJtaW5lcyBvcmRlciBvZiBsZXZlbHMgaW4gdGhlIHN0YWNrZWQgY2hhcnRzLlxuICAgKiBVc2VkIGluIGJvdGggYnV0IG9wdGlvbmFsIGluIHRyYW5zZm9ybS5cbiAgICovXG4gIHNvcnQ6IFZnU29ydDtcblxuICAvKiogTW9kZSBmb3Igc3RhY2tpbmcgbWFya3MuXG4gICAqL1xuICBvZmZzZXQ6IFN0YWNrT2Zmc2V0O1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGltcHV0ZSB0aGUgZGF0YSBiZWZvcmUgc3RhY2tpbmcuIFVzZWQgb25seSBpbiBtYWtlRnJvbUVuY29kaW5nLlxuICAgKi9cbiAgaW1wdXRlPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogVGhlIGRhdGEgZmllbGRzIHRvIGdyb3VwIGJ5LlxuICAgKi9cbiAgZ3JvdXBieT86IHN0cmluZ1tdO1xuICAvKipcbiAgICogT3V0cHV0IGZpZWxkIG5hbWVzIG9mIGVhY2ggc3RhY2sgZmllbGQuXG4gICAqL1xuICBhczogc3RyaW5nW107XG5cbn1cblxuZnVuY3Rpb24gaXNWYWxpZEFzQXJyYXkoYXM6IHN0cmluZ1tdIHwgc3RyaW5nKTogYXMgaXMgc3RyaW5nW10ge1xuICByZXR1cm4gaXNBcnJheShhcykgJiYgYXMuZXZlcnkocyA9PiBpc1N0cmluZyhzKSkgJiYgYXMubGVuZ3RoID4xO1xufVxuXG5leHBvcnQgY2xhc3MgU3RhY2tOb2RlIGV4dGVuZHMgRGF0YUZsb3dOb2RlIHtcbiAgcHJpdmF0ZSBfc3RhY2s6IFN0YWNrQ29tcG9uZW50O1xuXG4gIHB1YmxpYyBjbG9uZSgpIHtcbiAgICByZXR1cm4gbmV3IFN0YWNrTm9kZShudWxsLCBkdXBsaWNhdGUodGhpcy5fc3RhY2spKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHBhcmVudDogRGF0YUZsb3dOb2RlLCBzdGFjazogU3RhY2tDb21wb25lbnQpIHtcbiAgICBzdXBlcihwYXJlbnQpO1xuXG4gICAgdGhpcy5fc3RhY2sgPSBzdGFjaztcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50OiBEYXRhRmxvd05vZGUsIHN0YWNrVHJhbnNmb3JtOiBTdGFja1RyYW5zZm9ybSkge1xuXG4gICAgY29uc3Qge3N0YWNrLCBncm91cGJ5LCBhcywgb2Zmc2V0PSd6ZXJvJ30gPSBzdGFja1RyYW5zZm9ybTtcblxuICAgIGNvbnN0IHNvcnRGaWVsZHM6IHN0cmluZ1tdID0gW107XG4gICAgY29uc3Qgc29ydE9yZGVyOiBWZ0NvbXBhcmF0b3JPcmRlcltdID0gW107XG4gICAgaWYgKHN0YWNrVHJhbnNmb3JtLnNvcnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgZm9yIChjb25zdCBzb3J0RmllbGQgb2Ygc3RhY2tUcmFuc2Zvcm0uc29ydCkge1xuICAgICAgICBzb3J0RmllbGRzLnB1c2goc29ydEZpZWxkLmZpZWxkKTtcbiAgICAgICAgc29ydE9yZGVyLnB1c2goc29ydEZpZWxkLm9yZGVyID09PSB1bmRlZmluZWQgPyAnYXNjZW5kaW5nJyA6IHNvcnRGaWVsZC5vcmRlciBhcyBWZ0NvbXBhcmF0b3JPcmRlcik7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IHNvcnQ6IFZnU29ydCA9IHtcbiAgICAgIGZpZWxkOiBzb3J0RmllbGRzLFxuICAgICAgb3JkZXI6IHNvcnRPcmRlcixcbiAgICB9O1xuICAgIGxldCBub3JtYWxpemVkQXM6IEFycmF5PHN0cmluZz47XG4gICAgaWYgKGlzVmFsaWRBc0FycmF5KGFzKSkge1xuICAgICAgbm9ybWFsaXplZEFzID0gYXM7XG4gICAgfSBlbHNlIGlmKGlzU3RyaW5nKGFzKSkge1xuICAgICAgbm9ybWFsaXplZEFzID0gW2FzLCBhcyArICdfZW5kJ107XG4gICAgfSBlbHNlIHtcbiAgICAgIG5vcm1hbGl6ZWRBcyA9IFtzdGFja1RyYW5zZm9ybS5zdGFjayArICdfc3RhcnQnLCBzdGFja1RyYW5zZm9ybS5zdGFjayArICdfZW5kJ107XG4gICAgfVxuXG4gICAgcmV0dXJuIG5ldyBTdGFja05vZGUgKHBhcmVudCwge1xuICAgICAgc3RhY2tGaWVsZDogc3RhY2ssXG4gICAgICBncm91cGJ5LFxuICAgICAgb2Zmc2V0LFxuICAgICAgc29ydCxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgYXM6IG5vcm1hbGl6ZWRBc1xuICAgIH0pO1xuXG4gIH1cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbUVuY29kaW5nKHBhcmVudDogRGF0YUZsb3dOb2RlLCBtb2RlbDogVW5pdE1vZGVsKSB7XG5cbiAgICBjb25zdCBzdGFja1Byb3BlcnRpZXMgPSBtb2RlbC5zdGFjaztcblxuICAgIGlmICghc3RhY2tQcm9wZXJ0aWVzKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgZGltZW5zaW9uRmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz47XG4gICAgaWYgKHN0YWNrUHJvcGVydGllcy5ncm91cGJ5Q2hhbm5lbCkge1xuICAgICAgZGltZW5zaW9uRmllbGREZWYgPSBtb2RlbC5maWVsZERlZihzdGFja1Byb3BlcnRpZXMuZ3JvdXBieUNoYW5uZWwpO1xuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrYnkgPSBnZXRTdGFja0J5RmllbGRzKG1vZGVsKTtcbiAgICBjb25zdCBvcmRlckRlZiA9IG1vZGVsLmVuY29kaW5nLm9yZGVyO1xuXG4gICAgbGV0IHNvcnQ6IFZnU29ydDtcbiAgICBpZiAoaXNBcnJheShvcmRlckRlZikgfHwgaXNGaWVsZERlZihvcmRlckRlZikpIHtcbiAgICAgIHNvcnQgPSBzb3J0UGFyYW1zKG9yZGVyRGVmKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gZGVmYXVsdCA9IGRlc2NlbmRpbmcgYnkgc3RhY2tGaWVsZHNcbiAgICAgIC8vIEZJWE1FIGlzIHRoZSBkZWZhdWx0IGhlcmUgY29ycmVjdCBmb3IgYmlubmVkIGZpZWxkcz9cbiAgICAgIHNvcnQgPSBzdGFja2J5LnJlZHVjZSgocywgZmllbGQpID0+IHtcbiAgICAgICAgcy5maWVsZC5wdXNoKGZpZWxkKTtcbiAgICAgICAgcy5vcmRlci5wdXNoKCdkZXNjZW5kaW5nJyk7XG4gICAgICAgIHJldHVybiBzO1xuICAgICAgfSwge2ZpZWxkOltdLCBvcmRlcjogW119KTtcbiAgICB9XG4gICAgLy8gUmVmYWN0b3JlZCB0byBhZGQgXCJhc1wiIGluIHRoZSBtYWtlIHBoYXNlIHNvIHRoYXQgd2UgY2FuIGdldCBwcm9kdWNlZEZpZWxkc1xuICAgIC8vIGZyb20gdGhlIGFzIHByb3BlcnR5XG4gICAgY29uc3QgZmllbGQgPSBtb2RlbC52Z0ZpZWxkKHN0YWNrUHJvcGVydGllcy5maWVsZENoYW5uZWwpO1xuXG4gICAgcmV0dXJuIG5ldyBTdGFja05vZGUocGFyZW50LCB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZixcbiAgICAgIHN0YWNrRmllbGQ6ZmllbGQsXG4gICAgICBmYWNldGJ5OiBbXSxcbiAgICAgIHN0YWNrYnksXG4gICAgICBzb3J0LFxuICAgICAgb2Zmc2V0OiBzdGFja1Byb3BlcnRpZXMub2Zmc2V0LFxuICAgICAgaW1wdXRlOiBzdGFja1Byb3BlcnRpZXMuaW1wdXRlLFxuICAgICAgYXM6IFtmaWVsZCArICdfc3RhcnQnLCBmaWVsZCArICdfZW5kJ11cbiAgICB9KTtcbiAgfVxuXG4gIGdldCBzdGFjaygpOiBTdGFja0NvbXBvbmVudCB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrO1xuICB9XG5cbiAgcHVibGljIGFkZERpbWVuc2lvbnMoZmllbGRzOiBzdHJpbmdbXSkge1xuICAgIHRoaXMuX3N0YWNrLmZhY2V0YnkgPSB0aGlzLl9zdGFjay5mYWNldGJ5LmNvbmNhdChmaWVsZHMpO1xuICB9XG5cbiAgcHVibGljIGRlcGVuZGVudEZpZWxkcygpIHtcbiAgICBjb25zdCBvdXQgPSB7fTtcblxuICAgIG91dFt0aGlzLl9zdGFjay5zdGFja0ZpZWxkXSA9IHRydWU7XG5cbiAgICB0aGlzLmdldEdyb3VwYnlGaWVsZHMoKS5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAgdGhpcy5fc3RhY2suZmFjZXRieS5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSk7XG4gICAgY29uc3QgZmllbGQgPSB0aGlzLl9zdGFjay5zb3J0LmZpZWxkO1xuICAgIGlzQXJyYXkoZmllbGQpID8gZmllbGQuZm9yRWFjaChmID0+IG91dFtmXSA9IHRydWUpIDogb3V0W2ZpZWxkXSA9IHRydWU7XG5cbiAgICByZXR1cm4gb3V0O1xuICB9XG5cbiAgcHVibGljIHByb2R1Y2VkRmllbGRzKCkge1xuICAgIHJldHVybiB0aGlzLl9zdGFjay5hcy5yZWR1Y2UoKHJlc3VsdCwgaXRlbSkgPT4ge1xuICAgICAgcmVzdWx0W2l0ZW1dID0gdHJ1ZTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSwge30pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRHcm91cGJ5RmllbGRzKCkge1xuICAgIGNvbnN0IHtkaW1lbnNpb25GaWVsZERlZiwgaW1wdXRlLCBncm91cGJ5fSA9IHRoaXMuX3N0YWNrO1xuICAgIGlmIChkaW1lbnNpb25GaWVsZERlZikge1xuICAgICAgaWYgKGRpbWVuc2lvbkZpZWxkRGVmLmJpbikge1xuICAgICAgICBpZiAoaW1wdXRlKSB7XG4gICAgICAgICAgLy8gRm9yIGJpbm5lZCBncm91cCBieSBmaWVsZCB3aXRoIGltcHV0ZSwgd2UgY2FsY3VsYXRlIGJpbl9taWRcbiAgICAgICAgICAvLyBhcyB3ZSBjYW5ub3QgaW1wdXRlIHR3byBmaWVsZHMgc2ltdWx0YW5lb3VzbHlcbiAgICAgICAgICByZXR1cm4gW3ZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtiaW5TdWZmaXg6ICdtaWQnfSldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgLy8gRm9yIGJpbm5lZCBncm91cCBieSBmaWVsZCB3aXRob3V0IGltcHV0ZSwgd2UgbmVlZCBib3RoIGJpbiAoc3RhcnQpIGFuZCBiaW5fZW5kXG4gICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge30pLFxuICAgICAgICAgIHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtiaW5TdWZmaXg6ICdlbmQnfSlcbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZildO1xuICAgIH1cbiAgICByZXR1cm4gZ3JvdXBieSB8fCBbXTtcbiAgfVxuXG4gIHB1YmxpYyBhc3NlbWJsZSgpOiBWZ1RyYW5zZm9ybVtdIHtcbiAgICBjb25zdCB0cmFuc2Zvcm06IFZnVHJhbnNmb3JtW10gPSBbXTtcbiAgICBjb25zdCB7ZmFjZXRieSwgZGltZW5zaW9uRmllbGREZWYsIHN0YWNrRmllbGQ6IGZpZWxkLCBzdGFja2J5LCBzb3J0LCBvZmZzZXQsIGltcHV0ZSwgYXN9ID0gdGhpcy5fc3RhY2s7XG5cbiAgICAgIC8vIEltcHV0ZVxuICAgIGlmIChpbXB1dGUgJiYgZGltZW5zaW9uRmllbGREZWYpIHtcbiAgICAgIGNvbnN0IGRpbWVuc2lvbkZpZWxkID0gZGltZW5zaW9uRmllbGREZWYgPyB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7YmluU3VmZml4OiAnbWlkJ30pOiB1bmRlZmluZWQ7XG5cbiAgICAgIGlmIChkaW1lbnNpb25GaWVsZERlZi5iaW4pIHtcbiAgICAgICAgLy8gQXMgd2UgY2FuIG9ubHkgaW1wdXRlIG9uZSBmaWVsZCBhdCBhIHRpbWUsIHdlIG5lZWQgdG8gY2FsY3VsYXRlXG4gICAgICAgIC8vIG1pZCBwb2ludCBmb3IgYSBiaW5uZWQgZmllbGRcbiAgICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICAgIHR5cGU6ICdmb3JtdWxhJyxcbiAgICAgICAgICBleHByOiAnKCcgK1xuICAgICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2V4cHI6ICdkYXR1bSd9KSArXG4gICAgICAgICAgICAnKycgK1xuICAgICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2V4cHI6ICdkYXR1bScsIGJpblN1ZmZpeDogJ2VuZCd9KSArXG4gICAgICAgICAgICAnKS8yJyxcbiAgICAgICAgICBhczogZGltZW5zaW9uRmllbGRcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgICAgdHlwZTogJ2ltcHV0ZScsXG4gICAgICAgIGZpZWxkLFxuICAgICAgICBncm91cGJ5OiBzdGFja2J5LFxuICAgICAgICBrZXk6IGRpbWVuc2lvbkZpZWxkLFxuICAgICAgICBtZXRob2Q6ICd2YWx1ZScsXG4gICAgICAgIHZhbHVlOiAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyBTdGFja1xuICAgIHRyYW5zZm9ybS5wdXNoKHtcbiAgICAgIHR5cGU6ICdzdGFjaycsXG4gICAgICBncm91cGJ5OiB0aGlzLmdldEdyb3VwYnlGaWVsZHMoKS5jb25jYXQoZmFjZXRieSksXG4gICAgICBmaWVsZCxcbiAgICAgIHNvcnQsXG4gICAgICBhcyxcbiAgICAgIG9mZnNldFxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHRyYW5zZm9ybTtcbiAgfVxufVxuIl19