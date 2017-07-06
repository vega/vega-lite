"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
var vega_schema_1 = require("../../vega.schema");
// FIXME: rename this file to assemble.ts
// TODO: rewrite this such that we merge redundant signals
function assembleLayoutLayerSignals(model) {
    return [
        { name: model.getName('width'), update: layerSizeExpr(model, 'width') },
        { name: model.getName('height'), update: layerSizeExpr(model, 'height') }
    ];
}
exports.assembleLayoutLayerSignals = assembleLayoutLayerSignals;
function layerSizeExpr(model, sizeType) {
    var childrenSizeSignals = model.children.map(function (child) { return child.getName(sizeType); }).join(', ');
    return "max(" + childrenSizeSignals + ")";
}
exports.layerSizeExpr = layerSizeExpr;
function assembleLayoutUnitSignals(model) {
    return [
        { name: model.getName('width'), update: unitSizeExpr(model, 'width') },
        { name: model.getName('height'), update: unitSizeExpr(model, 'height') }
    ];
}
exports.assembleLayoutUnitSignals = assembleLayoutUnitSignals;
function unitSizeExpr(model, sizeType) {
    var channel = sizeType === 'width' ? 'x' : 'y';
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
    return "" + model.component.layoutSize.get(sizeType);
}
exports.unitSizeExpr = unitSizeExpr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXQvYXNzZW1ibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxxQ0FBK0Q7QUFFL0QsaURBQW1HO0FBT25HLHlDQUF5QztBQUN6QywwREFBMEQ7QUFDMUQsb0NBQTJDLEtBQWlCO0lBQzFELE1BQU0sQ0FBQztRQUNMLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEVBQUM7UUFDckUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsYUFBYSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQztLQUN4RSxDQUFDO0FBQ0osQ0FBQztBQUxELGdFQUtDO0FBRUQsdUJBQThCLEtBQWlCLEVBQUUsUUFBNEI7SUFDM0UsSUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLEtBQUssSUFBSSxPQUFBLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQXZCLENBQXVCLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUYsTUFBTSxDQUFDLFNBQU8sbUJBQW1CLE1BQUcsQ0FBQztBQUN2QyxDQUFDO0FBSEQsc0NBR0M7QUFFRCxtQ0FBMEMsS0FBZ0I7SUFDeEQsTUFBTSxDQUFDO1FBQ0wsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFBQztRQUNwRSxFQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsS0FBSyxFQUFFLFFBQVEsQ0FBQyxFQUFDO0tBQ3ZFLENBQUM7QUFDSixDQUFDO0FBTEQsOERBS0M7QUFFRCxzQkFBNkIsS0FBZ0IsRUFBRSxRQUE0QjtJQUN6RSxJQUFNLE9BQU8sR0FBRyxRQUFRLEtBQUcsT0FBTyxHQUFHLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFFL0MsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLEVBQUUsQ0FBQyxDQUFDLHlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLDJCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFM0MsSUFBTSxXQUFXLEdBQUcsYUFBVyxTQUFTLGNBQVcsQ0FBQztZQUNwRCxJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDdEQsWUFBWSxHQUFHLFlBQVksS0FBSyxTQUFTLEdBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQztZQUVuRSxJQUFJLFlBQVksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQ3RELFlBQVksR0FBRyxJQUFJLEtBQUssTUFBTTtnQkFDNUIsa0NBQWtDO2dCQUNsQyxDQUFDLFlBQVksS0FBSyxTQUFTLEdBQUcsWUFBWSxHQUFHLE9BQU8sQ0FBQztnQkFDckQsK0ZBQStGO2dCQUMvRiwyRkFBMkY7Z0JBQzNGLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxlQUFhLFdBQVcsVUFBSyxZQUFZLFVBQUssWUFBWSxZQUFPLEtBQUssQ0FBQyxJQUFNLENBQUM7UUFDdkYsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsS0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFHLENBQUM7QUFDdkQsQ0FBQztBQTVCRCxvQ0E0QkMifQ==