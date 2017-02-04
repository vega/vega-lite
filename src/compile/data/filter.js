"use strict";
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
        var childDataComponent = model.child().component.data;
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
        model.children().forEach(function (child) {
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
//# sourceMappingURL=filter.js.map