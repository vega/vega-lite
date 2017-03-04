"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var common_1 = require("../common");
var data_1 = require("../../data");
var fielddef_1 = require("../../fielddef");
var scale_1 = require("../../scale");
var util_1 = require("../../util");
function getStackByFields(model) {
    return model.stack.stackBy.reduce(function (fields, by) {
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
        var stackProperties = model.stack;
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
    parseLayer: function (model) {
        // FIXME: merge if identical
        // FIXME: Correctly support facet of layer of stack.
        return undefined;
    },
    parseFacet: function (model) {
        var child = model.child;
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
            stackComponent.groupby = model.reduceFieldDef(function (groupby, fieldDef) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3N0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBTUEsb0NBQXFDO0FBQ3JDLG1DQUE0QztBQUM1QywyQ0FBK0M7QUFDL0MscUNBQThDO0FBRTlDLG1DQUFvQztBQTRDcEMsMEJBQTBCLEtBQWdCO0lBQ3hDLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFNLEVBQUUsRUFBRTtRQUMzQyxJQUFNLE9BQU8sR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDO1FBQzNCLElBQU0sUUFBUSxHQUFHLEVBQUUsQ0FBQyxRQUFRLENBQUM7UUFFN0IsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQyxJQUFNLE1BQU0sR0FBRyxnQkFBSyxDQUFDLFFBQVEsRUFBRTtZQUM3QixTQUFTLEVBQUUsS0FBSyxJQUFJLHlCQUFpQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLEdBQUcsT0FBTztTQUN0RSxDQUFDLENBQUM7UUFDSCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNiLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEIsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxFQUFFLEVBQWMsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFFRDs7R0FFRztBQUNVLFFBQUEsS0FBSyxHQUEwQztJQUUxRCxTQUFTLEVBQUUsVUFBUyxLQUFnQjtRQUNsQyxJQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUNyQixNQUFNLENBQUMsU0FBUyxDQUFDO1FB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