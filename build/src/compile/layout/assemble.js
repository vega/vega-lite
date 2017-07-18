"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
function assembleLayoutSignals(model) {
    var signals = [];
    var width = sizeExpr(model, 'width');
    if (width !== undefined) {
        signals.push({ name: model.getName('width'), update: width });
    }
    var height = sizeExpr(model, 'height');
    if (height !== undefined) {
        signals.push({ name: model.getName('height'), update: height });
    }
    return signals;
}
exports.assembleLayoutSignals = assembleLayoutSignals;
function sizeExpr(model, sizeType) {
    var channel = sizeType === 'width' ? 'x' : 'y';
    var size = model.component.layoutSize.get(sizeType);
    if (size === 'merged') {
        return undefined;
    }
    else if (size === 'range-step') {
        var scaleComponent = model.getScaleComponent(channel);
        if (scaleComponent) {
            var type = scaleComponent.get('type');
            var range = scaleComponent.get('range');
            if (scale_1.hasDiscreteDomain(type) && vega_schema_1.isVgRangeStep(range)) {
                var scaleName = model.scaleName(channel);
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
                return "bandspace(" + cardinality + ", " + paddingInner + ", " + paddingOuter + ") * " + range.step;
            }
        }
        /* istanbul ignore next: Condition should not happen -- only for warning in development. */
        throw new Error('layout size is range step although there is no rangeStep.');
    }
    return size ? "" + size : undefined;
}
exports.sizeExpr = sizeExpr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxQ0FBK0Q7QUFFL0QsaURBQW1HO0FBT25HLCtCQUFzQyxLQUFZO0lBQ2hELElBQU0sT0FBTyxHQUFlLEVBQUUsQ0FBQztJQUMvQixJQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLEVBQUUsQ0FBQyxDQUFDLEtBQUssS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0QsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN6QyxFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUNELE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDakIsQ0FBQztBQVhELHNEQVdDO0FBRUQsa0JBQXlCLEtBQVksRUFBRSxRQUE0QjtJQUNqRSxJQUFNLE9BQU8sR0FBRyxRQUFRLEtBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDL0MsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLEtBQUssWUFBWSxDQUFDLENBQUMsQ0FBQztRQUNqQyxJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEQsRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsRUFBRSxDQUFDLENBQUMseUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksMkJBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTNDLElBQU0sV0FBVyxHQUFHLGFBQVcsU0FBUyxjQUFXLENBQUM7Z0JBQ3BELElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQzlDLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3RELFlBQVksR0FBRyxZQUFZLEtBQUssU0FBUyxHQUFHLFlBQVksR0FBRyxPQUFPLENBQUM7Z0JBRW5FLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQ3RELFlBQVksR0FBRyxJQUFJLEtBQUssTUFBTTtvQkFDNUIsa0NBQWtDO29CQUNsQyxDQUFDLFlBQVksS0FBSyxTQUFTLEdBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQztvQkFDckQsK0ZBQStGO29CQUMvRiwyRkFBMkY7b0JBQzNGLENBQUMsQ0FBQztnQkFFSixNQUFNLENBQUMsZUFBYSxXQUFXLFVBQUssWUFBWSxVQUFLLFlBQVksWUFBTyxLQUFLLENBQUMsSUFBTSxDQUFDO1lBQ3ZGLENBQUM7UUFDSCxDQUFDO1FBQ0QsMkZBQTJGO1FBQzNGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQ0QsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFHLElBQU0sR0FBRyxTQUFTLENBQUM7QUFDdEMsQ0FBQztBQW5DRCw0QkFtQ0MifQ==