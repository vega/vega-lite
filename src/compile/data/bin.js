"use strict";
var bin_1 = require("../../bin");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var scale_1 = require("../../scale");
function numberFormatExpr(expr, format) {
    return "format(" + expr + ", '" + format + "')";
}
function parse(model) {
    return model.reduce(function (binComponent, fieldDef, channel) {
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
                var extentSignal = model.name(fieldDef.field + '_extent');
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
                    model.config().numberFormat;
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
        var childDataComponent = model.child().component.data;
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
        model.children().forEach(function (child) {
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
//# sourceMappingURL=bin.js.map