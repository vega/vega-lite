"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
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
                return [
                    stepSignal(scaleName, range),
                    {
                        name: name,
                        update: sizeExpr(scaleName, scaleComponent)
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
function sizeExpr(scaleName, scaleComponent) {
    var type = scaleComponent.get('type');
    var cardinality = "domain('" + scaleName + "').length";
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxQ0FBK0Q7QUFFL0QsaURBQWdIO0FBT2hILCtCQUFzQyxLQUFZO0lBQ2hELE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUNkLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEVBQzNCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQzdCLENBQUM7QUFDSixDQUFDO0FBTEQsc0RBS0M7QUFFRCxxQkFBNEIsS0FBWSxFQUFFLFFBQTRCO0lBQ3BFLElBQU0sT0FBTyxHQUFHLFFBQVEsS0FBRyxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUMvQyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLEVBQUUsQ0FBQztJQUNaLENBQUM7SUFFRCxzR0FBc0c7SUFDdEcsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sQ0FBQztJQUVyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsRUFBRSxDQUFDLENBQUMseUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksMkJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTNDLE1BQU0sQ0FBQztvQkFDTCxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQztvQkFDNUI7d0JBQ0UsSUFBSSxNQUFBO3dCQUNKLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FBUyxFQUFFLGNBQWMsQ0FBQztxQkFDNUM7aUJBQ0YsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO1FBQ0QsMkZBQTJGO1FBQzNGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsQ0FBQztnQkFDTixJQUFJLE1BQUE7Z0JBQ0osTUFBTSxFQUFFLEtBQUcsSUFBTTthQUNsQixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQXJDRCxrQ0FxQ0M7QUFFRCxvQkFBb0IsU0FBaUIsRUFBRSxLQUFrQjtJQUN2RCxNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUUsU0FBUyxHQUFHLE9BQU87UUFDekIsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJO0tBQ2xCLENBQUM7QUFDSixDQUFDO0FBRUQsa0JBQWtCLFNBQWlCLEVBQUUsY0FBOEI7SUFDakUsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxJQUFNLFdBQVcsR0FBRyxhQUFXLFNBQVMsY0FBVyxDQUFDO0lBQ3BELElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsSUFBSSxZQUFZLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0RCxZQUFZLEdBQUcsWUFBWSxLQUFLLFNBQVMsR0FBRyxZQUFZLEdBQUcsT0FBTyxDQUFDO0lBRW5FLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEQsWUFBWSxHQUFHLElBQUksS0FBSyxNQUFNO1FBQzVCLGtDQUFrQztRQUNsQyxDQUFDLFlBQVksS0FBSyxTQUFTLEdBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQztRQUNyRCwrRkFBK0Y7UUFDL0YsMkZBQTJGO1FBQzNGLENBQUMsQ0FBQztJQUNKLE1BQU0sQ0FBQyxlQUFhLFdBQVcsVUFBSyxZQUFZLFVBQUssWUFBWSxZQUFPLFNBQVMsVUFBTyxDQUFDO0FBQzNGLENBQUMifQ==