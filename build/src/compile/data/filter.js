"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var filter_1 = require("../../filter");
var util_1 = require("../../util");
/**
 * @param v value to be converted into Vega Expression
 * @param timeUnit
 * @return Vega Expression of the value v. This could be one of:
 * - a timestamp value of datetime object
 * - a timestamp value of casted single time unit value
 * - stringified value
 */
function parse(model) {
    var filter = model.filter();
    if (util_1.isArray(filter)) {
        return '(' +
            filter.map(function (f) { return filter_1.expression(f); })
                .filter(function (f) { return f !== undefined; })
                .join(') && (') +
            ')';
    }
    else if (filter) {
        return filter_1.expression(filter);
    }
    return undefined;
}
exports.filter = {
    parseUnit: parse,
    parseFacet: function (model) {
        var filterComponent = parse(model);
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source but has filter, then merge
        if (!childDataComponent.source && childDataComponent.filter) {
            // merge by adding &&
            filterComponent =
                (filterComponent ? filterComponent + ' && ' : '') +
                    childDataComponent.filter;
            delete childDataComponent.filter;
        }
        return filterComponent;
    },
    parseLayer: function (model) {
        // Note that this `filter.parseLayer` method is called before `source.parseLayer`
        var filterComponent = parse(model);
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && childDataComponent.filter && childDataComponent.filter === filterComponent) {
                // same filter in child so we can just delete it
                delete childDataComponent.filter;
            }
        });
        return filterComponent;
    },
    assemble: function (filterComponent) {
        return filterComponent ? [{
                type: 'filter',
                expr: filterComponent
            }] : [];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9maWx0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSx1Q0FBd0M7QUFDeEMsbUNBQW1DO0FBTW5DOzs7Ozs7O0dBT0c7QUFFSCxlQUFlLEtBQVk7SUFDekIsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQzlCLEVBQUUsQ0FBQyxDQUFDLGNBQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLEdBQUc7WUFDUixNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxJQUFLLE9BQUEsbUJBQVUsQ0FBQyxDQUFDLENBQUMsRUFBYixDQUFhLENBQUM7aUJBQzdCLE1BQU0sQ0FBQyxVQUFDLENBQUMsSUFBSyxPQUFBLENBQUMsS0FBSSxTQUFTLEVBQWQsQ0FBYyxDQUFDO2lCQUM3QixJQUFJLENBQUMsUUFBUSxDQUFDO1lBQ2pCLEdBQUcsQ0FBQztJQUNSLENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNsQixNQUFNLENBQUMsbUJBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQztBQUNuQixDQUFDO0FBRVksUUFBQSxNQUFNLEdBQWtDO0lBQ25ELFNBQVMsRUFBRSxLQUFLO0lBRWhCLFVBQVUsRUFBRSxVQUFTLEtBQWlCO1FBQ3BDLElBQUksZUFBZSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUVuQyxJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUV0RCx1RUFBdUU7UUFDdkUsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUM1RCxxQkFBcUI7WUFDckIsZUFBZTtnQkFDYixDQUFDLGVBQWUsR0FBRyxlQUFlLEdBQUcsTUFBTSxHQUFHLEVBQUUsQ0FBQztvQkFDakQsa0JBQWtCLENBQUMsTUFBTSxDQUFDO1lBQzVCLE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNLENBQUMsZUFBZSxDQUFDO0lBQ3pCLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFpQjtRQUNwQyxpRkFBaUY7UUFDakYsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ25DLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMzQixJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLElBQUksa0JBQWtCLENBQUMsTUFBTSxLQUFLLGVBQWUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hILGdEQUFnRDtnQkFDaEQsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDbkMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLGVBQWUsQ0FBQztJQUN6QixDQUFDO0lBRUQsUUFBUSxFQUFFLFVBQVMsZUFBdUI7UUFDeEMsTUFBTSxDQUFDLGVBQWUsR0FBRyxDQUFDO2dCQUN4QixJQUFJLEVBQUUsUUFBUTtnQkFDZCxJQUFJLEVBQUUsZUFBZTthQUN0QixDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ1YsQ0FBQztDQUNGLENBQUMifQ==