"use strict";
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
    return model.reduce(function (aggregator, fieldDef) {
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
        var childDataComponent = model.child().component.data;
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
        model.children().forEach(function (child) {
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
//# sourceMappingURL=nullfilter.js.map