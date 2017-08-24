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
                update: "" + size
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQThDO0FBQzlDLGlEQUF1RTtBQUN2RSxrQ0FBNkM7QUFHN0MsK0JBQXNDLEtBQVk7SUFDaEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQ2QsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFDM0IsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FDN0IsQ0FBQztBQUNKLENBQUM7QUFMRCxzREFLQztBQUVELHFCQUE0QixLQUFZLEVBQUUsUUFBNEI7SUFDcEUsSUFBTSxPQUFPLEdBQUcsUUFBUSxLQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQy9DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ1osQ0FBQztJQUVELHNHQUFzRztJQUN0RyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRXJELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxZQUFZLENBQUMsQ0FBQyxDQUFDO1FBQzFCLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDeEMsSUFBTSxLQUFLLEdBQUcs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