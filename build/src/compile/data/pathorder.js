"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var stringify = require("json-stable-stringify");
var encoding_1 = require("../../encoding");
var fielddef_1 = require("../../fielddef");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var common_1 = require("../common");
exports.pathOrder = {
    parseUnit: function (model) {
        if (util_1.contains(['line', 'area'], model.mark())) {
            if (model.mark() === 'line' && model.channelHasField('order')) {
                // For only line, sort by the order field if it is specified.
                return common_1.sortParams(model.encoding.order);
            }
            else {
                // For both line and area, we sort values based on dimension by default
                var dimensionChannel = model.markDef.orient === 'horizontal' ? 'y' : 'x';
                var sort = model.sort(dimensionChannel);
                var sortField = sort_1.isSortField(sort) ?
                    fielddef_1.field({
                        // FIXME: this op might not already exist?
                        // FIXME: what if dimensionChannel (x or y) contains custom domain?
                        aggregate: encoding_1.isAggregate(model.encoding) ? sort.op : undefined,
                        field: sort.field
                    }) :
                    model.field(dimensionChannel, { binSuffix: 'start' });
                return {
                    field: sortField,
                    order: 'descending'
                };
            }
        }
        return null;
    },
    parseFacet: function (model) {
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then consider merging
        if (!childDataComponent.source) {
            // For now, let's assume it always has union scale
            var pathOrderComponent = childDataComponent.pathOrder;
            delete childDataComponent.pathOrder;
            return pathOrderComponent;
        }
        return null;
    },
    parseLayer: function (model) {
        // note that we run this before source.parseLayer
        var pathOrderComponent = null;
        var stringifiedPathOrder = null;
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && childDataComponent.pathOrder !== null) {
                if (pathOrderComponent === null) {
                    pathOrderComponent = childDataComponent.pathOrder;
                    stringifiedPathOrder = stringify(pathOrderComponent);
                }
                else if (stringifiedPathOrder !== stringify(childDataComponent.pathOrder)) {
                    pathOrderComponent = null;
                    break;
                }
            }
        }
        if (pathOrderComponent !== null) {
            // If we merge pathOrderComponent, remove them from children.
            for (var _b = 0, _c = model.children; _b < _c.length; _b++) {
                var child = _c[_b];
                delete child.component.data.pathOrder;
            }
        }
        return pathOrderComponent;
    },
    assemble: function (pathOrderComponent) {
        if (pathOrderComponent) {
            return {
                type: 'collect',
                sort: pathOrderComponent
            };
        }
        return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGF0aG9yZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9wYXRob3JkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBbUQ7QUFJbkQsMkNBQTJDO0FBQzNDLDJDQUFxQztBQUNyQyxtQ0FBdUM7QUFDdkMsbUNBQW9DO0FBR3BDLG9DQUFxQztBQUt4QixRQUFBLFNBQVMsR0FBa0M7SUFDdEQsU0FBUyxFQUFFLFVBQVMsS0FBZ0I7UUFDbEMsRUFBRSxDQUFDLENBQUMsZUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM5RCw2REFBNkQ7Z0JBQzdELE1BQU0sQ0FBQyxtQkFBVSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDMUMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLHVFQUF1RTtnQkFDdkUsSUFBTSxnQkFBZ0IsR0FBYyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxZQUFZLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztnQkFDdEYsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2dCQUMxQyxJQUFNLFNBQVMsR0FBRyxrQkFBVyxDQUFDLElBQUksQ0FBQztvQkFDakMsZ0JBQUssQ0FBQzt3QkFDSiwwQ0FBMEM7d0JBQzFDLG1FQUFtRTt3QkFDbkUsU0FBUyxFQUFFLHNCQUFXLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEdBQUcsU0FBUzt3QkFDNUQsS0FB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