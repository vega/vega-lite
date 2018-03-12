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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQThDO0FBQzlDLGlEQUF1RTtBQUN2RSxrQ0FBNkM7QUFHN0MsK0JBQXNDLEtBQVk7SUFDaEQsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQ2QsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFDM0IsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FDN0IsQ0FBQztBQUNKLENBQUM7QUFMRCxzREFLQztBQUVELHFCQUE0QixLQUFZLEVBQUUsUUFBNEI7SUFDcEUsSUFBTSxPQUFPLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQy9CLE1BQU0sQ0FBQyxFQUFFLENBQUM7SUFDWixDQUFDO0lBRUQsc0dBQXNHO0lBQ3RHLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFckQsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRXhELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLEVBQUUsQ0FBQyxDQUFDLHlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLDJCQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwRCxJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUUzQyxFQUFFLENBQUMsQ0FBQyxvQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQy9CLGlGQUFpRjtvQkFDakYsb0VBQW9FO29CQUNwRSwwREFBMEQ7b0JBQzFELElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQztvQkFDckQsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsS0FBSyxhQUFhLENBQUMsQ0FBQyxDQUFDO3dCQUNuRCxNQUFNLENBQUMsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7b0JBQ3hDLENBQUM7Z0JBQ0gsQ0FBQztnQkFFRCxNQUFNLENBQUM7b0JBQ0wsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUM7b0JBQzVCO3dCQUNFLElBQUksTUFBQTt3QkFDSixNQUFNLEVBQUUsUUFBUSxDQUFDLFNBQVMsRUFBRSxjQUFjLEVBQUUsYUFBVyxTQUFTLGNBQVcsQ0FBQztxQkFDN0U7aUJBQ0YsQ0FBQztZQUNKLENBQUM7UUFDSCxDQUFDO1FBQ0QsMkZBQTJGO1FBQzNGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixNQUFNLENBQUMsQ0FBQztnQkFDTixJQUFJLE1BQUE7Z0JBQ0osS0FBSyxFQUFFLElBQUk7YUFDWixDQUFDLENBQUM7SUFDTCxDQUFDO0FBQ0gsQ0FBQztBQS9DRCxrQ0ErQ0M7QUFFRCxvQkFBb0IsU0FBaUIsRUFBRSxLQUFrQjtJQUN2RCxNQUFNLENBQUM7UUFDTCxJQUFJLEVBQUUsU0FBUyxHQUFHLE9BQU87UUFDekIsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJO0tBQ2xCLENBQUM7QUFDSixDQUFDO0FBRUQsa0JBQXlCLFNBQWlCLEVBQUUsY0FBOEIsRUFBRSxXQUFtQjtJQUM3RixJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hDLElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUMsSUFBSSxZQUFZLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0RCxZQUFZLEdBQUcsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUM7SUFFbkUsSUFBSSxZQUFZLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUN0RCxZQUFZLEdBQUcsSUFBSSxLQUFLLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLGtDQUFrQztRQUNsQyxDQUFDLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztRQUN2RCwrRkFBK0Y7UUFDL0YsMkZBQTJGO1FBQzNGLENBQUMsQ0FBQztJQUNKLE1BQU0sQ0FBQyxlQUFhLFdBQVcsVUFBSyxZQUFZLFVBQUssWUFBWSxZQUFPLFNBQVMsVUFBTyxDQUFDO0FBQzNGLENBQUM7QUFkRCw0QkFjQyIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHtoYXNEaXNjcmV0ZURvbWFpbn0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBWZ1JhbmdlU3RlcCwgVmdTaWduYWx9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTY2FsZUNvbXBvbmVudH0gZnJvbSAnLi4vc2NhbGUvY29tcG9uZW50JztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlTGF5b3V0U2lnbmFscyhtb2RlbDogTW9kZWwpOiBWZ1NpZ25hbFtdIHtcbiAgcmV0dXJuIFtdLmNvbmNhdChcbiAgICBzaXplU2lnbmFscyhtb2RlbCwgJ3dpZHRoJyksXG4gICAgc2l6ZVNpZ25hbHMobW9kZWwsICdoZWlnaHQnKVxuICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2l6ZVNpZ25hbHMobW9kZWw6IE1vZGVsLCBzaXplVHlwZTogJ3dpZHRoJyB8ICdoZWlnaHQnKTogVmdTaWduYWxbXSB7XG4gIGNvbnN0IGNoYW5uZWwgPSBzaXplVHlwZSA9PT0gJ3dpZHRoJyA/ICd4JyA6ICd5JztcbiAgY29uc3Qgc2l6ZSA9IG1vZGVsLmNvbXBvbmVudC5sYXlvdXRTaXplLmdldChzaXplVHlwZSk7XG4gIGlmICghc2l6ZSB8fCBzaXplID09PSAnbWVyZ2VkJykge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIC8vIFJlYWQgc2l6ZSBzaWduYWwgbmFtZSBmcm9tIG5hbWUgbWFwLCBqdXN0IGluIGNhc2UgaXQgaXMgdGhlIHRvcC1sZXZlbCBzaXplIHNpZ25hbCB0aGF0IGdvdCByZW5hbWVkLlxuICBjb25zdCBuYW1lID0gbW9kZWwuZ2V0U2l6ZVNpZ25hbFJlZihzaXplVHlwZSkuc2lnbmFsO1xuXG4gIGlmIChzaXplID09PSAncmFuZ2Utc3RlcCcpIHtcbiAgICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpO1xuXG4gICAgaWYgKHNjYWxlQ29tcG9uZW50KSB7XG4gICAgICBjb25zdCB0eXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gICAgICBjb25zdCByYW5nZSA9IHNjYWxlQ29tcG9uZW50LmdldCgncmFuZ2UnKTtcblxuICAgICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHR5cGUpICYmIGlzVmdSYW5nZVN0ZXAocmFuZ2UpKSB7XG4gICAgICAgIGNvbnN0IHNjYWxlTmFtZSA9IG1vZGVsLnNjYWxlTmFtZShjaGFubmVsKTtcblxuICAgICAgICBpZiAoaXNGYWNldE1vZGVsKG1vZGVsLnBhcmVudCkpIHtcbiAgICAgICAgICAvLyBJZiBwYXJlbnQgaXMgZmFjZXQgYW5kIHRoaXMgaXMgYW4gaW5kZXBlbmRlbnQgc2NhbGUsIHJldHVybiBvbmx5IHNpZ25hbCBzaWduYWxcbiAgICAgICAgICAvLyBhcyB0aGUgd2lkdGgvaGVpZ2h0IHdpbGwgYmUgY2FsY3VsYXRlZCB1c2luZyB0aGUgY2FyZGluYWxpdHkgZnJvbVxuICAgICAgICAgIC8vIGZhY2V0J3MgYWdncmVnYXRlIHJhdGhlciB0aGFuIHJlYWRpbmcgZnJvbSBzY2FsZSBkb21haW5cbiAgICAgICAgICBjb25zdCBwYXJlbnRSZXNvbHZlID0gbW9kZWwucGFyZW50LmNvbXBvbmVudC5yZXNvbHZlO1xuICAgICAgICAgIGlmIChwYXJlbnRSZXNvbHZlLnNjYWxlW2NoYW5uZWxdID09PSAnaW5kZXBlbmRlbnQnKSB7XG4gICAgICAgICAgICByZXR1cm4gW3N0ZXBTaWduYWwoc2NhbGVOYW1lLCByYW5nZSldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgc3RlcFNpZ25hbChzY2FsZU5hbWUsIHJhbmdlKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgdXBkYXRlOiBzaXplRXhwcihzY2FsZU5hbWUsIHNjYWxlQ29tcG9uZW50LCBgZG9tYWluKCcke3NjYWxlTmFtZX0nKS5sZW5ndGhgKVxuICAgICAgICAgIH1cbiAgICAgICAgXTtcbiAgICAgIH1cbiAgICB9XG4gICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQ6IENvbmRpdGlvbiBzaG91bGQgbm90IGhhcHBlbiAtLSBvbmx5IGZvciB3YXJuaW5nIGluIGRldmVsb3BtZW50LiAqL1xuICAgIHRocm93IG5ldyBFcnJvcignbGF5b3V0IHNpemUgaXMgcmFuZ2Ugc3RlcCBhbHRob3VnaCB0aGVyZSBpcyBubyByYW5nZVN0ZXAuJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBuYW1lLFxuICAgICAgdmFsdWU6IHNpemVcbiAgICB9XTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdGVwU2lnbmFsKHNjYWxlTmFtZTogc3RyaW5nLCByYW5nZTogVmdSYW5nZVN0ZXApOiBWZ1NpZ25hbCB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogc2NhbGVOYW1lICsgJ19zdGVwJyxcbiAgICB2YWx1ZTogcmFuZ2Uuc3RlcCxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpemVFeHByKHNjYWxlTmFtZTogc3RyaW5nLCBzY2FsZUNvbXBvbmVudDogU2NhbGVDb21wb25lbnQsIGNhcmRpbmFsaXR5OiBzdHJpbmcpIHtcbiAgY29uc3QgdHlwZSA9IHNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICBjb25zdCBwYWRkaW5nID0gc2NhbGVDb21wb25lbnQuZ2V0KCdwYWRkaW5nJyk7XG4gIGxldCBwYWRkaW5nT3V0ZXIgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3BhZGRpbmdPdXRlcicpO1xuICBwYWRkaW5nT3V0ZXIgPSBwYWRkaW5nT3V0ZXIgIT09IHVuZGVmaW5lZCA/IHBhZGRpbmdPdXRlciA6IHBhZGRpbmc7XG5cbiAgbGV0IHBhZGRpbmdJbm5lciA9IHNjYWxlQ29tcG9uZW50LmdldCgncGFkZGluZ0lubmVyJyk7XG4gIHBhZGRpbmdJbm5lciA9IHR5cGUgPT09ICdiYW5kJyA/XG4gICAgLy8gb25seSBiYW5kIGhhcyByZWFsIHBhZGRpbmdJbm5lclxuICAgIChwYWRkaW5nSW5uZXIgIT09IHVuZGVmaW5lZCA/IHBhZGRpbmdJbm5lciA6IHBhZGRpbmcpIDpcbiAgICAvLyBGb3IgcG9pbnQsIGFzIGNhbGN1bGF0ZWQgaW4gaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1zY2FsZS9ibG9iL21hc3Rlci9zcmMvYmFuZC5qcyNMMTI4LFxuICAgIC8vIGl0J3MgZXF1aXZhbGVudCB0byBoYXZlIHBhZGRpbmdJbm5lciA9IDEgc2luY2UgdGhlcmUgaXMgb25seSBuLTEgc3RlcHMgYmV0d2VlbiBuIHBvaW50cy5cbiAgICAxO1xuICByZXR1cm4gYGJhbmRzcGFjZSgke2NhcmRpbmFsaXR5fSwgJHtwYWRkaW5nSW5uZXJ9LCAke3BhZGRpbmdPdXRlcn0pICogJHtzY2FsZU5hbWV9X3N0ZXBgO1xufVxuXG5cbiJdfQ==