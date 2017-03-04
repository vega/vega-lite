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
                as: [fielddef_1.field(fieldDef, { binSuffix: 'start' }), fielddef_1.field(fieldDef, { binSuffix: 'end' })]
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
            var hasDiscreteDomainOrHasLegend = scale_1.hasDiscreteDomain(model.scale(channel).type) || model.legend(channel);
            if (hasDiscreteDomainOrHasLegend) {
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
            var key = util_1.hash(bin) + '_' + fieldDef.field + 'oc:' + hasDiscreteDomainOrHasLegend;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9iaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxpQ0FBc0M7QUFFdEMsMkNBQStDO0FBQy9DLG1DQUE2RDtBQUU3RCxxQ0FBOEM7QUFPOUMsMEJBQTBCLElBQVksRUFBRSxNQUFjO0lBQ3BELE1BQU0sQ0FBQyxZQUFVLElBQUksV0FBTSxNQUFNLE9BQUksQ0FBQztBQUN4QyxDQUFDO0FBRUQsZUFBZSxLQUFZO0lBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLFVBQVMsWUFBaUMsRUFBRSxRQUFrQixFQUFFLE9BQWdCO1FBQzFHLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDO1FBQ3hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFFUixJQUFJLFFBQVEsR0FBZ0IsYUFBTSxDQUFDO2dCQUNqQyxJQUFJLEVBQUUsS0FBSztnQkFDWCxLQUFLLEVBQUUsUUFBUSxDQUFDLEtBQUs7Z0JBQ3JCLEVBQUUsRUFBRSxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUsZ0JBQUssQ0FBQyxRQUFRLEVBQUUsRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQzthQUNqRjtZQUNDLDRDQUE0QztZQUM1QyxPQUFPLEdBQUcsS0FBSyxTQUFTLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FDcEMsQ0FBQztZQUVGLElBQU0sU0FBUyxHQUFrQixFQUFFLENBQUM7WUFDcEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztnQkFDckIsSUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxD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