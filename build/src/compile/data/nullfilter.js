"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var type_1 = require("../../type");
var util_1 = require("../../util");
var DEFAULT_NULL_FILTERS = {
    nominal: false,
    ordinal: false,
    quantitative: true,
    temporal: true
};
/** Return Hashset of fields for null filtering (key=field, value = true). */
function parse(model) {
    var filterInvalid = model.filterInvalid();
    return model.reduceFieldDef(function (aggregator, fieldDef) {
        if (fieldDef.field !== '*') {
            if (filterInvalid ||
                (filterInvalid === undefined && fieldDef.field && DEFAULT_NULL_FILTERS[fieldDef.type])) {
                aggregator[fieldDef.field] = fieldDef;
            }
            else {
                // define this so we know that we don't filter nulls for this field
                // this makes it easier to merge into parents
                aggregator[fieldDef.field] = null;
            }
        }
        return aggregator;
    }, {});
}
exports.nullFilter = {
    parseUnit: parse,
    parseFacet: function (model) {
        var nullFilterComponent = parse(model);
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then merge
        if (!childDataComponent.source) {
            util_1.extend(nullFilterComponent, childDataComponent.nullFilter);
            delete childDataComponent.nullFilter;
        }
        return nullFilterComponent;
    },
    parseLayer: function (model) {
        // note that we run this before source.parseLayer
        // FIXME: null filters are not properly propagated right now
        var nullFilterComponent = parse(model);
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (model.compatibleSource(child) && !util_1.differ(childDataComponent.nullFilter, nullFilterComponent)) {
                util_1.extend(nullFilterComponent, childDataComponent.nullFilter);
                delete childDataComponent.nullFilter;
            }
        });
        return nullFilterComponent;
    },
    assemble: function (component) {
        var filters = util_1.keys(component).reduce(function (_filters, field) {
            var fieldDef = component[field];
            if (fieldDef !== null) {
                _filters.push('datum["' + fieldDef.field + '"] !== null');
                if (util_1.contains([type_1.QUANTITATIVE, type_1.TEMPORAL], fieldDef.type)) {
                    // TODO(https://github.com/vega/vega-lite/issues/1436):
                    // We can be even smarter and add NaN filter for N,O that are numbers
                    // based on the `parse` property once we have it.
                    _filters.push('!isNaN(datum["' + fieldDef.field + '"])');
                }
            }
            return _filters;
        }, []);
        return filters.length > 0 ?
            [{
                    type: 'filter',
                    expr: filters.join(' && ')
                }] : [];
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibnVsbGZpbHRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvbnVsbGZpbHRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG1DQUFrRDtBQUNsRCxtQ0FBZ0U7QUFNaEUsSUFBTSxvQkFBb0IsR0FBRztJQUMzQixPQUFPLEVBQUUsS0FBSztJQUNkLE9BQU8sRUFBRSxLQUFLO0lBQ2QsWUFBWSxFQUFFLElBQUk7SUFDbEIsUUFBUSxFQUFFLElBQUk7Q0FDZixDQUFDO0FBRUYsNkVBQTZFO0FBQzdFLGVBQWUsS0FBWTtJQUN6QixJQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUM7SUFFNUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsVUFBUyxVQUEwQixFQUFFLFFBQWtCO1FBQ2pGLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQixFQUFFLENBQUMsQ0FBQyxhQUFhO2dCQUNmLENBQUMsYUFBYSxLQUFLLFNBQVMsSUFBSSxRQUFRLENBQUMsS0FBSyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDekYsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxRQUFRLENBQUM7WUFDeEMsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLG1FQUFtRTtnQkFDbkUsNkNBQTZDO2dCQUM3QyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksQ0FBQztZQUNwQyxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxVQUFVLENBQUM7SUFDcEIsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ1QsQ0FBQztBQUVZLFFBQUEsVUFBVSxHQUEwQztJQUMvRCxTQUFTLEVBQUUsS0FBSztJQUVoQixVQUFVLEVBQUUsVUFBUyxLQUFpQjtRQUNwQyxJQUFNLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV6QyxJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUV0RCx3REFBd0Q7UUFDeEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQy9CLGFBQU0sQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUMzRCxPQUFPLGtCQUFrQixDQUFDLFVBQVUsQ0FBQztRQUN2QyxDQUFDO1FBQ0QsTUFBTSxDQUFDLG1CQUFtQixDQUFDO0lBQzdCLENBQUM7SUFFRCxVQUFVLEVBQUUsVUFBUyxLQUFpQjtRQUNwQyxpREFBaUQ7UUFFakQsNERBQTREO1FBQzVELElBQUksbUJBQW1CLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRXZDLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsS0FBSztZQUMzQixJQUFNLGtCQUFrQixHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGFBQU0sQ0FBVyxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNHLGFBQU0sQ0FBQyxtQkFBbUIsRUFBRSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDM0QsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUM7WUFDdkMsQ0FBQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLG1CQUFtQixDQUFDO0lBQzdCLENBQUM7SUFFRCxRQUFRLEVBQUUsVUFBUyxTQUF5QjtRQUMxQyxJQUFNLE9BQU8sR0FBRyxXQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQUMsUUFBUSxFQUFFLEtBQUs7WUFDckQsSUFBTSxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xDLEVBQUUsQ0FBQyxDQUFDLFFBQVEsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO2dCQUN0QixRQUFRLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxDQUFDO2dCQUMxRCxFQUFFLENBQUMsQ0FBQyxlQUFRLENBQUMsQ0FBQyxtQkFBWSxFQUFFLGVBQVEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3RELHVEQUF1RDtvQkFDdkQscUVBQXFFO29CQUNyRSxpREFBaUQ7b0JBQ2pELFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUUsUUFBUSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQztnQkFDMUQsQ0FBQztZQUNILENBQUM7WUFDRCxNQUFNLENBQUMsUUFBUSxDQUFDO1FBQ2xCLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVQLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7WUFDdkIsQ0FBQztvQkFDQyxJQUFJLEVBQUUsUUFBUTtvQkFDZCxJQUFJLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7aUJBQzNCLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDWixDQUFDO0NBQ0YsQ0FBQyJ9