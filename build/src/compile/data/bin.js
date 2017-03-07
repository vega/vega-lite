"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var scale_1 = require("../../scale");
function numberFormatExpr(expr, format) {
    return "format(" + expr + ", '" + format + "')";
}
function parse(model) {
    return model.reduceFieldDef(function (binComponent, fieldDef, channel) {
        var bin = model.fieldDef(channel).bin;
        if (bin) {
            var binTrans = util_1.extend({
                type: 'bin',
                field: fieldDef.field,
                as: [fielddef_1.field(fieldDef, { binSuffix: 'start' }), fielddef_1.field(fieldDef, { binSuffix: 'end' })],
                signal: model.getName(fieldDef.field + '_bins')
            }, 
            // if bin is an object, load parameter here!
            typeof bin === 'boolean' ? {} : bin);
            var transform = [];
            if (!binTrans.extent) {
                var extentSignal = model.getName(fieldDef.field + '_extent');
                transform.push({
                    type: 'extent',
                    field: fieldDef.field,
                    signal: extentSignal
                });
                binTrans.extent = { signal: extentSignal };
            }
            if (!binTrans.maxbins && !binTrans.step) {
                // if both maxbins and step are not specified, need to automatically determine bin
                binTrans.maxbins = bin_1.autoMaxBins(channel);
            }
            transform.push(binTrans);
            var discreteDomain = scale_1.hasDiscreteDomain(model.scale(channel).type);
            if (discreteDomain) {
                // read format from axis or legend, if there is no format then use config.numberFormat
                var format = (model.axis(channel) || model.legend(channel) || {}).format ||
                    model.config.numberFormat;
                var startField = fielddef_1.field(fieldDef, { datum: true, binSuffix: 'start' });
                var endField = fielddef_1.field(fieldDef, { datum: true, binSuffix: 'end' });
                transform.push({
                    type: 'formula',
                    as: fielddef_1.field(fieldDef, { binSuffix: 'range' }),
                    expr: numberFormatExpr(startField, format) + " + ' - ' + " + numberFormatExpr(endField, format)
                });
            }
            // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
            var key = util_1.hash(bin) + '_' + fieldDef.field + 'oc:' + discreteDomain;
            binComponent[key] = transform;
        }
        return binComponent;
    }, {});
}
exports.bin = {
    parseUnit: parse,
    parseFacet: function (model) {
        var binComponent = parse(model);
        var childDataComponent = model.child.component.data;
        // If child doesn't have its own data source, then merge
        if (!childDataComponent.source) {
            // FIXME: current merging logic can produce redundant transforms when a field is binned for color and for non-color
            util_1.extend(binComponent, childDataComponent.bin);
            delete childDataComponent.bin;
        }
        return binComponent;
    },
    parseLayer: function (model) {
        var binComponent = parse(model);
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            // If child doesn't have its own data source, then merge
            if (!childDataComponent.source) {
                util_1.extend(binComponent, childDataComponent.bin);
                delete childDataComponent.bin;
            }
        });
        return binComponent;
    },
    assemble: function (component) {
        return util_1.flatten(util_1.vals(component));
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBc0M7QUFFdEMsMkNBQStDO0FBQy9DLG1DQUE2RDtBQUU3RCxxQ0FBOEM7QUFPOUMsMEJBQTBCLElBQVksRUFBRSxNQUFjO0lBQ3BELE1BQU0sQ0FBQyxZQUFVLElBQUksV0FBTSxNQUFNLE9BQUksQ0FBQztBQUN4QyxDQUFDO0FBRUQsZUFBZSxLQUFZO0lBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVMsWUFBaUMsRUFBRSxRQUFrQixFQUFFLE9BQWdCO1FBQzFHLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFUixJQUFJLFFBQVEsR0FBZ0IsYUFBTSxDQUFDO2dCQUNqQyxJQUFJLEVBQUUsS0FBSztnQkFDWCxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7Z0JBQ3JCLEVBQUUsRUFBRSxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztnQkFDaEYsTUFBTSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7YUFDaEQ7WUFDQyw0Q0FBNEM7WUFDNUMsT0FBTyxHQUFHLEtBQUssU0FBUyxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQ3BDLENBQUM7WUFFRixJQUFNLFNBQVMsR0FBa0IsRUFBRSxDQUFDO1lBQ3BDLEVBQUUsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7Z0JBQ3JC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