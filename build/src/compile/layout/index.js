"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var scale_1 = require("../../scale");
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
    var scale = model.scale(channel);
    if (scale) {
        if (scale_1.hasDiscreteDomain(scale.type) && scale.rangeStep) {
            var scaleName = model.scaleName(channel);
            var cardinality = "domain('" + scaleName + "').length";
            var paddingOuter = scale.paddingOuter !== undefined ? scale.paddingOuter : scale.padding;
            var paddingInner = scale.type === 'band' ?
                // only band has real paddingInner
                (scale.paddingInner !== undefined ? scale.paddingInner : scale.padding) :
                // For point, as calculated in https://github.com/vega/vega-scale/blob/master/src/band.js#L128,
                // it's equivalent to have paddingInner = 1 since there is only n-1 steps between n points.
                1;
            return "bandspace(" + cardinality + ", " + paddingInner + ", " + paddingOuter + ") * " + scale.rangeStep;
        }
    }
    return "" + model[sizeType];
}
exports.unitSizeExpr = unitSizeExpr;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXQvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxxQ0FBOEM7QUFVOUMsMERBQTBEO0FBQzFELG9DQUEyQyxLQUFpQjtJQUMxRCxNQUFNLENBQUM7UUFDTCxFQUFDLElBQUksRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxFQUFDO1FBQ3JFLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLEVBQUM7S0FDeEUsQ0FBQztBQUNKLENBQUM7QUFMRCxnRUFLQztBQUVELHVCQUE4QixLQUFpQixFQUFFLFFBQTRCO0lBQzNFLElBQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxLQUFLLElBQUksT0FBQSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVGLE1BQU0sQ0FBQyxTQUFPLG1CQUFtQixNQUFHLENBQUM7QUFDdkMsQ0FBQztBQUhELHNDQUdDO0FBRUQsbUNBQTBDLEtBQWdCO0lBQ3hELE1BQU0sQ0FBQztRQUNMLEVBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEVBQUM7UUFDcEUsRUFBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLEVBQUUsWUFBWSxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsRUFBQztLQUN2RSxDQUFDO0FBQ0osQ0FBQztBQUxELDhEQUtDO0FBRUQsc0JBQTZCLEtBQWdCLEVBQUUsUUFBNEI7SUFDekUsSUFBTSxPQUFPLEdBQUcsUUFBUSxLQUFHLE9BQU8sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQy9DLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNWLEVBQUUsQ0FBQyxDQUFDLHlCQUFpQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNyRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTNDLElBQU0sV0FBVyxHQUFHLGFBQVcsU0FBUyxjQUFXLENBQUM7WUFDcEQsSUFBTSxZQUFZLEdBQUcsS0FBSyxDQUFDLFlBQVksS0FBSyxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO1lBQzNGLElBQU0sWUFBWSxHQUFHLEtBQUssQ0FBQyxJQUFJLEtBQUssTUFBTTtnQkFDeEMsa0NBQWtDO2dCQUNsQyxDQUFDLEtBQUssQ0FBQyxZQUFZLEtBQUssU0FBUyxHQUFHLEtBQUssQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQztnQkFDdkUsK0ZBQStGO2dCQUMvRiwyRkFBMkY7Z0JBQzNGLENBQUMsQ0FBQztZQUVKLE1BQU0sQ0FBQyxlQUFhLFdBQVcsVUFBSyxZQUFZLFVBQUssWUFBWSxZQUFPLEtBQUssQ0FBQyxTQUFXLENBQUM7UUFDNUYsQ0FBQztJQUNILENBQUM7SUFDRCxNQUFNLENBQUMsS0FBRyxLQUFLLENBQUMsUUFBUSxDQUFHLENBQUM7QUFDOUIsQ0FBQztBQXBCRCxvQ0FvQkMifQ==