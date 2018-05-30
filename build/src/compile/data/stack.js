import * as tslib_1 from "tslib";
import { isArray, isString } from 'vega-util';
import { isFieldDef, vgField } from '../../fielddef';
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
function isValidAsArray(as) {
    return isArray(as) && as.every(function (s) { return isString(s); }) && as.length > 1;
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
        else if (isString(as)) {
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
        if (isArray(orderDef) || isFieldDef(orderDef)) {
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
        isArray(field) ? field.forEach(function (f) { return out[f] = true; }) : out[field] = true;
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
        return groupby || [];
    };
    StackNode.prototype.assemble = function () {
        var transform = [];
        var _a = this._stack, facetby = _a.facetby, dimensionFieldDef = _a.dimensionFieldDef, field = _a.stackField, stackby = _a.stackby, sort = _a.sort, offset = _a.offset, impute = _a.impute, as = _a.as;
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
}(DataFlowNode));
export { StackNode };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsT0FBTyxFQUFFLFFBQVEsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUM1QyxPQUFPLEVBQVcsVUFBVSxFQUFFLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRzdELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFFckMsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVyQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBRXhDLDBCQUEwQixLQUFnQjtJQUN4QyxPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxFQUFFO1FBQzNDLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFFN0IsSUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ2pDLElBQUksTUFBTSxFQUFFO1lBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNyQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsRUFBRSxFQUFjLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBZ0RELHdCQUF3QixFQUFxQjtJQUMzQyxPQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFYLENBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxNQUFNLEdBQUUsQ0FBQyxDQUFDO0FBQ25FLENBQUM7QUFFRDtJQUErQixxQ0FBWTtJQU96QyxtQkFBWSxNQUFvQixFQUFFLEtBQXFCO1FBQXZELFlBQ0Usa0JBQU0sTUFBTSxD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QUFLLE9BQUE7Z0JBQ0wsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLEdBQUcsRUFBRSxjQUFjO2dCQUNuQixNQUFNLEVBQUUsT0FBTztnQkFDZixLQUFLLEVBQUUsQ0FBQzthQUNULENBQUMsQ0FBQztTQUNKO1FBRUQsUUFBUTtRQUNSLFNBQVMsQ0FBQyxJQUFJLENBQUM7WUFDYixJQUFJLEVBQUUsT0FBTztZQUNiLE9BQU8sRUFBRSxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDO1lBQ2hELEtBQUssT0FBQTtZQUNMLElBQUksTUFBQTtZQUNKLEVBQUUsSUFBQTtZQUNGLE1BQU0sUUFBQTtTQUNQLENBQUMsQ0FBQztRQUVILE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUF4TEQsQ0FBK0IsWUFBWSxHQXdMMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXksIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtGaWVsZERlZiwgaXNGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0IHtTdGFja09mZnNldH0gZnJvbSAnLi4vLi4vc3RhY2snO1xuaW1wb3J0IHtTdGFja1RyYW5zZm9ybX0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7ZHVwbGljYXRlfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdDb21wYXJhdG9yT3JkZXIsIFZnU29ydCwgVmdUcmFuc2Zvcm19IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7c29ydFBhcmFtc30gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLy4uL3VuaXQnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuXG5mdW5jdGlvbiBnZXRTdGFja0J5RmllbGRzKG1vZGVsOiBVbml0TW9kZWwpOiBzdHJpbmdbXSB7XG4gIHJldHVybiBtb2RlbC5zdGFjay5zdGFja0J5LnJlZHVjZSgoZmllbGRzLCBieSkgPT4ge1xuICAgIGNvbnN0IGZpZWxkRGVmID0gYnkuZmllbGREZWY7XG5cbiAgICBjb25zdCBfZmllbGQgPSB2Z0ZpZWxkKGZpZWxkRGVmKTtcbiAgICBpZiAoX2ZpZWxkKSB7XG4gICAgICBmaWVsZHMucHVzaChfZmllbGQpO1xuICAgIH1cbiAgICByZXR1cm4gZmllbGRzO1xuICB9LCBbXSBhcyBzdHJpbmdbXSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU3RhY2tDb21wb25lbnQge1xuXG4gIC8qKlxuICAgKiBGYWNldGVkIGZpZWxkLlxuICAgKi9cbiAgZmFjZXRieTogc3RyaW5nW107XG5cbiAgZGltZW5zaW9uRmllbGREZWY/OiBGaWVsZERlZjxzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBTdGFjayBtZWFzdXJlJ3MgZmllbGQuIFVzZWQgaW4gbWFrZUZyb21FbmNvZGluZy5cbiAgICovXG4gIHN0YWNrRmllbGQ6IHN0cmluZztcblxuICAvKipcbiAgICogTGV2ZWwgb2YgZGV0YWlsIGZpZWxkcyBmb3IgZWFjaCBsZXZlbCBpbiB0aGUgc3RhY2tlZCBjaGFydHMgc3VjaCBhcyBjb2xvciBvciBkZXRhaWwuXG4gICAqIFVzZWQgaW4gbWFrZUZyb21FbmNvZGluZy5cbiAgICovXG4gIHN0YWNrYnk/OiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogRmllbGQgdGhhdCBkZXRlcm1pbmVzIG9yZGVyIG9mIGxldmVscyBpbiB0aGUgc3RhY2tlZCBjaGFydHMuXG4gICAqIFVzZWQgaW4gYm90aCBidXQgb3B0aW9uYWwgaW4gdHJhbnNmb3JtLlxuICAgKi9cbiAgc29ydDogVmdTb3J0O1xuXG4gIC8qKiBNb2RlIGZvciBzdGFja2luZyBtYXJrcy5cbiAgICovXG4gIG9mZnNldDogU3RhY2tPZmZzZXQ7XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gaW1wdXRlIHRoZSBkYXRhIGJlZm9yZSBzdGFja2luZy4gVXNlZCBvbmx5IGluIG1ha2VGcm9tRW5jb2RpbmcuXG4gICAqL1xuICBpbXB1dGU/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBUaGUgZGF0YSBmaWVsZHMgdG8gZ3JvdXAgYnkuXG4gICAqL1xuICBncm91cGJ5Pzogc3RyaW5nW107XG4gIC8qKlxuICAgKiBPdXRwdXQgZmllbGQgbmFtZXMgb2YgZWFjaCBzdGFjayBmaWVsZC5cbiAgICovXG4gIGFzOiBzdHJpbmdbXTtcblxufVxuXG5mdW5jdGlvbiBpc1ZhbGlkQXNBcnJheShhczogc3RyaW5nW10gfCBzdHJpbmcpOiBhcyBpcyBzdHJpbmdbXSB7XG4gIHJldHVybiBpc0FycmF5KGFzKSAmJiBhcy5ldmVyeShzID0+IGlzU3RyaW5nKHMpKSAmJiBhcy5sZW5ndGggPjE7XG59XG5cbmV4cG9ydCBjbGFzcyBTdGFja05vZGUgZXh0ZW5kcyBEYXRhRmxvd05vZGUge1xuICBwcml2YXRlIF9zdGFjazogU3RhY2tDb21wb25lbnQ7XG5cbiAgcHVibGljIGNsb25lKCkge1xuICAgIHJldHVybiBuZXcgU3RhY2tOb2RlKG51bGwsIGR1cGxpY2F0ZSh0aGlzLl9zdGFjaykpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocGFyZW50OiBEYXRhRmxvd05vZGUsIHN0YWNrOiBTdGFja0NvbXBvbmVudCkge1xuICAgIHN1cGVyKHBhcmVudCk7XG5cbiAgICB0aGlzLl9zdGFjayA9IHN0YWNrO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgc3RhY2tUcmFuc2Zvcm06IFN0YWNrVHJhbnNmb3JtKSB7XG5cbiAgICBjb25zdCB7c3RhY2ssIGdyb3VwYnksIGFzLCBvZmZzZXQ9J3plcm8nfSA9IHN0YWNrVHJhbnNmb3JtO1xuXG4gICAgY29uc3Qgc29ydEZpZWxkczogc3RyaW5nW10gPSBbXTtcbiAgICBjb25zdCBzb3J0T3JkZXI6IFZnQ29tcGFyYXRvck9yZGVyW10gPSBbXTtcbiAgICBpZiAoc3RhY2tUcmFuc2Zvcm0uc29ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKGNvbnN0IHNvcnRGaWVsZCBvZiBzdGFja1RyYW5zZm9ybS5zb3J0KSB7XG4gICAgICAgIHNvcnRGaWVsZHMucHVzaChzb3J0RmllbGQuZmllbGQpO1xuICAgICAgICBzb3J0T3JkZXIucHVzaChzb3J0RmllbGQub3JkZXIgPT09IHVuZGVmaW5lZCA/ICdhc2NlbmRpbmcnIDogc29ydEZpZWxkLm9yZGVyIGFzIFZnQ29tcGFyYXRvck9yZGVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgY29uc3Qgc29ydDogVmdTb3J0ID0ge1xuICAgICAgZmllbGQ6IHNvcnRGaWVsZHMsXG4gICAgICBvcmRlcjogc29ydE9yZGVyLFxuICAgIH07XG4gICAgbGV0IG5vcm1hbGl6ZWRBczogQXJyYXk8c3RyaW5nPjtcbiAgICBpZiAoaXNWYWxpZEFzQXJyYXkoYXMpKSB7XG4gICAgICBub3JtYWxpemVkQXMgPSBhcztcbiAgICB9IGVsc2UgaWYoaXNTdHJpbmcoYXMpKSB7XG4gICAgICBub3JtYWxpemVkQXMgPSBbYXMsIGFzICsgJ19lbmQnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbm9ybWFsaXplZEFzID0gW3N0YWNrVHJhbnNmb3JtLnN0YWNrICsgJ19zdGFydCcsIHN0YWNrVHJhbnNmb3JtLnN0YWNrICsgJ19lbmQnXTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFN0YWNrTm9kZSAocGFyZW50LCB7XG4gICAgICBzdGFja0ZpZWxkOiBzdGFjayxcbiAgICAgIGdyb3VwYnksXG4gICAgICBvZmZzZXQsXG4gICAgICBzb3J0LFxuICAgICAgZmFjZXRieTogW10sXG4gICAgICBhczogbm9ybWFsaXplZEFzXG4gICAgfSk7XG5cbiAgfVxuICBwdWJsaWMgc3RhdGljIG1ha2VGcm9tRW5jb2RpbmcocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBVbml0TW9kZWwpIHtcblxuICAgIGNvbnN0IHN0YWNrUHJvcGVydGllcyA9IG1vZGVsLnN0YWNrO1xuXG4gICAgaWYgKCFzdGFja1Byb3BlcnRpZXMpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCBkaW1lbnNpb25GaWVsZERlZjogRmllbGREZWY8c3RyaW5nPjtcbiAgICBpZiAoc3RhY2tQcm9wZXJ0aWVzLmdyb3VwYnlDaGFubmVsKSB7XG4gICAgICBkaW1lbnNpb25GaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKHN0YWNrUHJvcGVydGllcy5ncm91cGJ5Q2hhbm5lbCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhY2tieSA9IGdldFN0YWNrQnlGaWVsZHMobW9kZWwpO1xuICAgIGNvbnN0IG9yZGVyRGVmID0gbW9kZWwuZW5jb2Rpbmcub3JkZXI7XG5cbiAgICBsZXQgc29ydDogVmdTb3J0O1xuICAgIGlmIChpc0FycmF5KG9yZGVyRGVmKSB8fCBpc0ZpZWxkRGVmKG9yZGVyRGVmKSkge1xuICAgICAgc29ydCA9IHNvcnRQYXJhbXMob3JkZXJEZWYpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBkZWZhdWx0ID0gZGVzY2VuZGluZyBieSBzdGFja0ZpZWxkc1xuICAgICAgLy8gRklYTUUgaXMgdGhlIGRlZmF1bHQgaGVyZSBjb3JyZWN0IGZvciBiaW5uZWQgZmllbGRzP1xuICAgICAgc29ydCA9IHN0YWNrYnkucmVkdWNlKChzLCBmaWVsZCkgPT4ge1xuICAgICAgICBzLmZpZWxkLnB1c2goZmllbGQpO1xuICAgICAgICBzLm9yZGVyLnB1c2goJ2Rlc2NlbmRpbmcnKTtcbiAgICAgICAgcmV0dXJuIHM7XG4gICAgICB9LCB7ZmllbGQ6W10sIG9yZGVyOiBbXX0pO1xuICAgIH1cbiAgICAvLyBSZWZhY3RvcmVkIHRvIGFkZCBcImFzXCIgaW4gdGhlIG1ha2UgcGhhc2Ugc28gdGhhdCB3ZSBjYW4gZ2V0IHByb2R1Y2VkRmllbGRzXG4gICAgLy8gZnJvbSB0aGUgYXMgcHJvcGVydHlcbiAgICBjb25zdCBmaWVsZCA9IG1vZGVsLnZnRmllbGQoc3RhY2tQcm9wZXJ0aWVzLmZpZWxkQ2hhbm5lbCk7XG5cbiAgICByZXR1cm4gbmV3IFN0YWNrTm9kZShwYXJlbnQsIHtcbiAgICAgIGRpbWVuc2lvbkZpZWxkRGVmLFxuICAgICAgc3RhY2tGaWVsZDpmaWVsZCxcbiAgICAgIGZhY2V0Ynk6IFtdLFxuICAgICAgc3RhY2tieSxcbiAgICAgIHNvcnQsXG4gICAgICBvZmZzZXQ6IHN0YWNrUHJvcGVydGllcy5vZmZzZXQsXG4gICAgICBpbXB1dGU6IHN0YWNrUHJvcGVydGllcy5pbXB1dGUsXG4gICAgICBhczogW2ZpZWxkICsgJ19zdGFydCcsIGZpZWxkICsgJ19lbmQnXVxuICAgIH0pO1xuICB9XG5cbiAgZ2V0IHN0YWNrKCk6IFN0YWNrQ29tcG9uZW50IHtcbiAgICByZXR1cm4gdGhpcy5fc3RhY2s7XG4gIH1cblxuICBwdWJsaWMgYWRkRGltZW5zaW9ucyhmaWVsZHM6IHN0cmluZ1tdKSB7XG4gICAgdGhpcy5fc3RhY2suZmFjZXRieSA9IHRoaXMuX3N0YWNrLmZhY2V0YnkuY29uY2F0KGZpZWxkcyk7XG4gIH1cblxuICBwdWJsaWMgZGVwZW5kZW50RmllbGRzKCkge1xuICAgIGNvbnN0IG91dCA9IHt9O1xuXG4gICAgb3V0W3RoaXMuX3N0YWNrLnN0YWNrRmllbGRdID0gdHJ1ZTtcblxuICAgIHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICB0aGlzLl9zdGFjay5mYWNldGJ5LmZvckVhY2goZiA9PiBvdXRbZl0gPSB0cnVlKTtcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuX3N0YWNrLnNvcnQuZmllbGQ7XG4gICAgaXNBcnJheShmaWVsZCkgPyBmaWVsZC5mb3JFYWNoKGYgPT4gb3V0W2ZdID0gdHJ1ZSkgOiBvdXRbZmllbGRdID0gdHJ1ZTtcblxuICAgIHJldHVybiBvdXQ7XG4gIH1cblxuICBwdWJsaWMgcHJvZHVjZWRGaWVsZHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3N0YWNrLmFzLnJlZHVjZSgocmVzdWx0LCBpdGVtKSA9PiB7XG4gICAgICByZXN1bHRbaXRlbV0gPSB0cnVlO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9LCB7fSk7XG4gIH1cblxuICBwcml2YXRlIGdldEdyb3VwYnlGaWVsZHMoKSB7XG4gICAgY29uc3Qge2RpbWVuc2lvbkZpZWxkRGVmLCBpbXB1dGUsIGdyb3VwYnl9ID0gdGhpcy5fc3RhY2s7XG4gICAgaWYgKGRpbWVuc2lvbkZpZWxkRGVmKSB7XG4gICAgICBpZiAoZGltZW5zaW9uRmllbGREZWYuYmluKSB7XG4gICAgICAgIGlmIChpbXB1dGUpIHtcbiAgICAgICAgICAvLyBGb3IgYmlubmVkIGdyb3VwIGJ5IGZpZWxkIHdpdGggaW1wdXRlLCB3ZSBjYWxjdWxhdGUgYmluX21pZFxuICAgICAgICAgIC8vIGFzIHdlIGNhbm5vdCBpbXB1dGUgdHdvIGZpZWxkcyBzaW11bHRhbmVvdXNseVxuICAgICAgICAgIHJldHVybiBbdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ21pZCd9KV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICAvLyBGb3IgYmlubmVkIGdyb3VwIGJ5IGZpZWxkIHdpdGhvdXQgaW1wdXRlLCB3ZSBuZWVkIGJvdGggYmluIChzdGFydCkgYW5kIGJpbl9lbmRcbiAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7fSksXG4gICAgICAgICAgdmdGaWVsZChkaW1lbnNpb25GaWVsZERlZiwge2JpblN1ZmZpeDogJ2VuZCd9KVxuICAgICAgICBdO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFt2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmKV07XG4gICAgfVxuICAgIHJldHVybiBncm91cGJ5IHx8IFtdO1xuICB9XG5cbiAgcHVibGljIGFzc2VtYmxlKCk6IFZnVHJhbnNmb3JtW10ge1xuICAgIGNvbnN0IHRyYW5zZm9ybTogVmdUcmFuc2Zvcm1bXSA9IFtdO1xuICAgIGNvbnN0IHtmYWNldGJ5LCBkaW1lbnNpb25GaWVsZERlZiwgc3RhY2tGaWVsZDogZmllbGQsIHN0YWNrYnksIHNvcnQsIG9mZnNldCwgaW1wdXRlLCBhc30gPSB0aGlzLl9zdGFjaztcblxuICAgICAgLy8gSW1wdXRlXG4gICAgaWYgKGltcHV0ZSAmJiBkaW1lbnNpb25GaWVsZERlZikge1xuICAgICAgY29uc3QgZGltZW5zaW9uRmllbGQgPSBkaW1lbnNpb25GaWVsZERlZiA/IHZnRmllbGQoZGltZW5zaW9uRmllbGREZWYsIHtiaW5TdWZmaXg6ICdtaWQnfSk6IHVuZGVmaW5lZDtcblxuICAgICAgaWYgKGRpbWVuc2lvbkZpZWxkRGVmLmJpbikge1xuICAgICAgICAvLyBBcyB3ZSBjYW4gb25seSBpbXB1dGUgb25lIGZpZWxkIGF0IGEgdGltZSwgd2UgbmVlZCB0byBjYWxjdWxhdGVcbiAgICAgICAgLy8gbWlkIHBvaW50IGZvciBhIGJpbm5lZCBmaWVsZFxuICAgICAgICB0cmFuc2Zvcm0ucHVzaCh7XG4gICAgICAgICAgdHlwZTogJ2Zvcm11bGEnLFxuICAgICAgICAgIGV4cHI6ICcoJyArXG4gICAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJ30pICtcbiAgICAgICAgICAgICcrJyArXG4gICAgICAgICAgICB2Z0ZpZWxkKGRpbWVuc2lvbkZpZWxkRGVmLCB7ZXhwcjogJ2RhdHVtJywgYmluU3VmZml4OiAnZW5kJ30pICtcbiAgICAgICAgICAgICcpLzInLFxuICAgICAgICAgIGFzOiBkaW1lbnNpb25GaWVsZFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgICB0eXBlOiAnaW1wdXRlJyxcbiAgICAgICAgZmllbGQsXG4gICAgICAgIGdyb3VwYnk6IHN0YWNrYnksXG4gICAgICAgIGtleTogZGltZW5zaW9uRmllbGQsXG4gICAgICAgIG1ldGhvZDogJ3ZhbHVlJyxcbiAgICAgICAgdmFsdWU6IDBcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIFN0YWNrXG4gICAgdHJhbnNmb3JtLnB1c2goe1xuICAgICAgdHlwZTogJ3N0YWNrJyxcbiAgICAgIGdyb3VwYnk6IHRoaXMuZ2V0R3JvdXBieUZpZWxkcygpLmNvbmNhdChmYWNldGJ5KSxcbiAgICAgIGZpZWxkLFxuICAgICAgc29ydCxcbiAgICAgIGFzLFxuICAgICAgb2Zmc2V0XG4gICAgfSk7XG5cbiAgICByZXR1cm4gdHJhbnNmb3JtO1xuICB9XG59XG4iXX0=