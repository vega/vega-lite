"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
var model_1 = require("../model");
function assembleLayoutSignals(model) {
    return [].concat(sizeSignals(model, 'width'), sizeSignals(model, 'height'));
}
exports.assembleLayoutSignals = assembleLayoutSignals;
function sizeSignals(model, sizeType) {
    var channel = sizeType === 'width' ? 'x' : 'y';
    var size = model.component.layoutSize.get(sizeType);
    if (!size || size === 'merged') {
        return [];
    }
    // Read size signal name from name map, just in case it is the top-level size signal that got renamed.
    var name = model.getSizeSignalRef(sizeType).signal;
    if (size === 'range-step') {
        var scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
            var type = scaleComponent.get('type');
            var range = scaleComponent.get('range');
            if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                var scaleName = model.scaleName(channel);
                if (model_1.isFacetModel(model.parent)) {
                    // If parent is facet and this is an independent scale, return only signal signal
                    // as the width/height will be calculated using the cardinality from
                    // facet's aggregate rather than reading from scale domain
                    var parentResolve = model.parent.component.resolve;
                    if (parentResolve.scale[channel] === 'independent') {
                        return [stepSignal(scaleName, range)];
                    }
                }
                return [
                    stepSignal(scaleName, range),
                    {
                        name: name,
                        update: sizeExpr(scaleName, scaleComponent, "domain('" + scaleName + "').length")
                    }
                ];
            }
        }
        /* istanbul ignore next: Condition should not happen -- only for warning in development. */
        throw new Error('layout size is range step although there is no rangeStep.');
    }
    else {
        return [{
                name: name,
                value: size
            }];
    }
}
exports.sizeSignals = sizeSignals;
function stepSignal(scaleName, range) {
    return {
        name: scaleName + '_step',
        value: range.step,
    };
}
function sizeExpr(scaleName, scaleComponent, cardinality) {
    var type = scaleComponent.get('type');
    var padding = scaleComponent.get('padding');
    var paddingOuter = scaleComponent.get('paddingOuter');
    paddingOuter = paddingOuter !== undefined ? paddingOuter : padding;
    var paddingInner = scaleComponent.get('paddingInner');
    paddingInner = type === 'band' ?
        // only band has real paddingInner
        (paddingInner !== undefined ? paddingInner : padding) :
        // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
        // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
        1;
    return "bandspace(" + cardinality + ", " + paddingInner + ", " + paddingOuter + ") * " + scaleName + "_step";
}
exports.sizeExpr = sizeExpr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQThDO0FBQzlDLGlEQUF1RTtBQUN2RSxrQ0FBNkM7QUFHN0MsK0JBQXNDLEtBQVk7SUFDaEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQ2QsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFDM0IsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FDN0IsQ0FBQztBQUNKLENBQUM7QUFMRCxzREFLQztBQUVELHFCQUE0QixLQUFZLEVBQUUsUUFBNEI7SUFDcEUsSUFBTSxPQUFPLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsc0dBQXNHO0lBQ3RHLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFckQsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZ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