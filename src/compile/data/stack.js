"use strict";
var common_1 = require("../common");
var data_1 = require("../../data");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function getStackByFields(model) {
    var stackProperties = model.stack();
    return stackProperties.stackBy.reduce(function (fields, by) {
        var channel = by.channel;
        var fieldDef = by.fieldDef;
        var scale = model.scale(channel);
        var _field = fielddef_1.field(fieldDef, {
            binSuffix: scale && scale_1.hasDiscreteDomain(scale.type) ? 'range' : 'start'
        });
        if (!!_field) {
            fields.push(_field);
        }
        return fields;
    }, []);
}
/**
 * Stack data compiler
 */
exports.stack = {
    parseUnit: function (model) {
        var stackProperties = model.stack();
        if (!stackProperties) {
            return undefined;
        }
        var groupby = [];
        if (stackProperties.groupbyChannel) {
            var groupbyFieldDef = model.fieldDef(stackProperties.groupbyChannel);
            if (groupbyFieldDef.bin) {
                // For Bin, we need to add both start and end to ensure that both get imputed
                // and included in the stack output (https://github.com/vega/vega-lite/issues/1805).
                groupby.push(model.field(stackProperties.groupbyChannel, { binSuffix: 'start' }));
                groupby.push(model.field(stackProperties.groupbyChannel, { binSuffix: 'end' }));
            }
            else {
                groupby.push(model.field(stackProperties.groupbyChannel));
            }
        }
        var stackby = getStackByFields(model);
        var orderDef = model.encoding().order;
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
        return {
            name: model.dataName(data_1.STACKED),
            source: model.dataName(data_1.SUMMARY),
            groupby: groupby,
            field: model.field(stackProperties.fieldChannel),
            stackby: stackby,
            sort: sort,
            offset: stackProperties.offset,
            impute: util_1.contains(['area', 'line'], model.mark())
        };
    },
    parseLayer: function (_) {
        // FIXME: merge if identical
        // FIXME: Correctly support facet of layer of stack.
        return undefined;
    },
    parseFacet: function (model) {
        var child = model.child();
        var childDataComponent = child.component.data;
        // FIXME: Correctly support facet of layer of stack.
        if (childDataComponent.stack) {
            var stackComponent = childDataComponent.stack;
            var newName = model.dataName(data_1.STACKED);
            child.renameData(stackComponent.name, newName);
            stackComponent.name = newName;
            // Refer to facet's summary instead (always summary because stacked only works with aggregation)
            stackComponent.source = model.dataName(data_1.SUMMARY);
            // Add faceted field to groupby
            stackComponent.groupby = model.reduce(function (groupby, fieldDef) {
                var facetedField = fielddef_1.field(fieldDef, { binSuffix: 'start' });
                if (!util_1.contains(groupby, facetedField)) {
                    groupby.push(facetedField);
                }
                return groupby;
            }, stackComponent.groupby);
            delete childDataComponent.stack;
            return stackComponent;
        }
        return undefined;
    },
    assemble: function (stackComponent) {
        if (!stackComponent) {
            return undefined;
        }
        var transform = [];
        // Impute
        if (stackComponent.impute) {
            transform.push({
                type: 'impute',
                field: stackComponent.field,
                groupby: stackComponent.stackby,
                orderby: stackComponent.groupby,
                method: 'value',
                value: 0
            });
        }
        // Stack
        transform.push({
            type: 'stack',
            groupby: stackComponent.groupby,
            field: stackComponent.field,
            sort: stackComponent.sort,
            as: [
                stackComponent.field + '_start',
                stackComponent.field + '_end'
            ],
            offset: stackComponent.offset
        });
        return {
            name: stackComponent.name,
            source: stackComponent.source,
            transform: transform
        };
    }
};
//# sourceMappingURL=stack.js.map