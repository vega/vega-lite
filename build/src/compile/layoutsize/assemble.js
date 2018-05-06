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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscUNBQThDO0FBQzlDLGlEQUF1RTtBQUN2RSxrQ0FBNkM7QUFHN0MsK0JBQXNDLEtBQVk7SUFDaEQsT0FBTyxFQUFFLENBQUMsTUFBTSxDQUNkLFdBQVcsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLEVBQzNCLFdBQVcsQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQzdCLENBQUM7QUFDSixDQUFDO0FBTEQsc0RBS0M7QUFFRCxxQkFBNEIsS0FBWSxFQUFFLFFBQTRCO0lBQ3BFLElBQU0sT0FBTyxHQUFHLFFBQVEsS0FBSyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDO0lBQ2pELElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN0RCxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksS0FBSyxRQUFRLEVBQUU7UUFDOUIsT0FBTyxFQUFFLENBQUM7S0FDWDtJQUVELHNHQUFzRztJQUN0RyxJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxDQUFDO0lBRXJELElBQUksSUFBSSxLQUFLLFlBQVksRUFBRTtRQUN6QixJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFeEQsSUFBSSxjQUFjLEVBQUU7WUFDbEIsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUN4QyxJQUFNLEtBQUssR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRTFDLElBQUkseUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksMkJBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDbkQsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFFM0MsSUFBSSxvQkFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDOUIsaUZBQWlGO29CQUNqRixvRUFBb0U7b0JBQ3BFLDBEQUEwRDtvQkFDMUQsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUNyRCxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssYUFBYSxFQUFFO3dCQUNsRCxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztpQkFDRjtnQkFFRCxPQUFPO29CQUNMLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO29CQUM1Qjt3QkFDRSxJQUFJLE1BQUE7d0JBQ0osTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLGFBQVcsU0FBUyxjQUFXLENBQUM7cUJBQzdFO2lCQUNGLENBQUM7YUFDSDtTQUNGO1FBQ0QsMkZBQTJGO1FBQzNGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztLQUM5RTtTQUFNO1FBQ0wsT0FBTyxDQUFDO2dCQUNOLElBQUksTUFBQTtnQkFDSixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQS9DRCxrQ0ErQ0M7QUFFRCxvQkFBb0IsU0FBaUIsRUFBRSxLQUFrQjtJQUN2RCxPQUFPO1FBQ0wsSUFBSSxFQUFFLFNBQVMsR0FBRyxPQUFPO1FBQ3pCLEtBQUssRUFBRSxLQUFLLENBQUMsSUFBSTtLQUNsQixDQUFDO0FBQ0osQ0FBQztBQUVELGtCQUF5QixTQUFpQixFQUFFLGNBQThCLEVBQUUsV0FBbUI7SUFDN0YsSUFBTSxJQUFJLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN4QyxJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEQsWUFBWSxHQUFHLFlBQVksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDO0lBRW5FLElBQUksWUFBWSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDdEQsWUFBWSxHQUFHLElBQUksS0FBSyxNQUFNLENBQUMsQ0FBQztRQUM5QixrQ0FBa0M7UUFDbEMsQ0FBQyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDdkQsK0ZBQStGO1FBQy9GLDJGQUEyRjtRQUMzRixDQUFDLENBQUM7SUFDSixPQUFPLGVBQWEsV0FBVyxVQUFLLFlBQVksVUFBSyxZQUFZLFlBQU8sU0FBUyxVQUFPLENBQUM7QUFDM0YsQ0FBQztBQWRELDRCQWNDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQge2hhc0Rpc2NyZXRlRG9tYWlufSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2lzVmdSYW5nZVN0ZXAsIFZnUmFuZ2VTdGVwLCBWZ1NpZ25hbH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50fSBmcm9tICcuLi9zY2FsZS9jb21wb25lbnQnO1xuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVMYXlvdXRTaWduYWxzKG1vZGVsOiBNb2RlbCk6IFZnU2lnbmFsW10ge1xuICByZXR1cm4gW10uY29uY2F0KFxuICAgIHNpemVTaWduYWxzKG1vZGVsLCAnd2lkdGgnKSxcbiAgICBzaXplU2lnbmFscyhtb2RlbCwgJ2hlaWdodCcpXG4gICk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaXplU2lnbmFscyhtb2RlbDogTW9kZWwsIHNpemVUeXBlOiAnd2lkdGgnIHwgJ2hlaWdodCcpOiBWZ1NpZ25hbFtdIHtcbiAgY29uc3QgY2hhbm5lbCA9IHNpemVUeXBlID09PSAnd2lkdGgnID8gJ3gnIDogJ3knO1xuICBjb25zdCBzaXplID0gbW9kZWwuY29tcG9uZW50LmxheW91dFNpemUuZ2V0KHNpemVUeXBlKTtcbiAgaWYgKCFzaXplIHx8IHNpemUgPT09ICdtZXJnZWQnKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG5cbiAgLy8gUmVhZCBzaXplIHNpZ25hbCBuYW1lIGZyb20gbmFtZSBtYXAsIGp1c3QgaW4gY2FzZSBpdCBpcyB0aGUgdG9wLWxldmVsIHNpemUgc2lnbmFsIHRoYXQgZ290IHJlbmFtZWQuXG4gIGNvbnN0IG5hbWUgPSBtb2RlbC5nZXRTaXplU2lnbmFsUmVmKHNpemVUeXBlKS5zaWduYWw7XG5cbiAgaWYgKHNpemUgPT09ICdyYW5nZS1zdGVwJykge1xuICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCk7XG5cbiAgICBpZiAoc2NhbGVDb21wb25lbnQpIHtcbiAgICAgIGNvbnN0IHR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgICAgIGNvbnN0IHJhbmdlID0gc2NhbGVDb21wb25lbnQuZ2V0KCdyYW5nZScpO1xuXG4gICAgICBpZiAoaGFzRGlzY3JldGVEb21haW4odHlwZSkgJiYgaXNWZ1JhbmdlU3RlcChyYW5nZSkpIHtcbiAgICAgICAgY29uc3Qgc2NhbGVOYW1lID0gbW9kZWwuc2NhbGVOYW1lKGNoYW5uZWwpO1xuXG4gICAgICAgIGlmIChpc0ZhY2V0TW9kZWwobW9kZWwucGFyZW50KSkge1xuICAgICAgICAgIC8vIElmIHBhcmVudCBpcyBmYWNldCBhbmQgdGhpcyBpcyBhbiBpbmRlcGVuZGVudCBzY2FsZSwgcmV0dXJuIG9ubHkgc2lnbmFsIHNpZ25hbFxuICAgICAgICAgIC8vIGFzIHRoZSB3aWR0aC9oZWlnaHQgd2lsbCBiZSBjYWxjdWxhdGVkIHVzaW5nIHRoZSBjYXJkaW5hbGl0eSBmcm9tXG4gICAgICAgICAgLy8gZmFjZXQncyBhZ2dyZWdhdGUgcmF0aGVyIHRoYW4gcmVhZGluZyBmcm9tIHNjYWxlIGRvbWFpblxuICAgICAgICAgIGNvbnN0IHBhcmVudFJlc29sdmUgPSBtb2RlbC5wYXJlbnQuY29tcG9uZW50LnJlc29sdmU7XG4gICAgICAgICAgaWYgKHBhcmVudFJlc29sdmUuc2NhbGVbY2hhbm5lbF0gPT09ICdpbmRlcGVuZGVudCcpIHtcbiAgICAgICAgICAgIHJldHVybiBbc3RlcFNpZ25hbChzY2FsZU5hbWUsIHJhbmdlKV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFtcbiAgICAgICAgICBzdGVwU2lnbmFsKHNjYWxlTmFtZSwgcmFuZ2UpLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICAgICB1cGRhdGU6IHNpemVFeHByKHNjYWxlTmFtZSwgc2NhbGVDb21wb25lbnQsIGBkb21haW4oJyR7c2NhbGVOYW1lfScpLmxlbmd0aGApXG4gICAgICAgICAgfVxuICAgICAgICBdO1xuICAgICAgfVxuICAgIH1cbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dDogQ29uZGl0aW9uIHNob3VsZCBub3QgaGFwcGVuIC0tIG9ubHkgZm9yIHdhcm5pbmcgaW4gZGV2ZWxvcG1lbnQuICovXG4gICAgdGhyb3cgbmV3IEVycm9yKCdsYXlvdXQgc2l6ZSBpcyByYW5nZSBzdGVwIGFsdGhvdWdoIHRoZXJlIGlzIG5vIHJhbmdlU3RlcC4nKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIG5hbWUsXG4gICAgICB2YWx1ZTogc2l6ZVxuICAgIH1dO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0ZXBTaWduYWwoc2NhbGVOYW1lOiBzdHJpbmcsIHJhbmdlOiBWZ1JhbmdlU3RlcCk6IFZnU2lnbmFsIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiBzY2FsZU5hbWUgKyAnX3N0ZXAnLFxuICAgIHZhbHVlOiByYW5nZS5zdGVwLFxuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2l6ZUV4cHIoc2NhbGVOYW1lOiBzdHJpbmcsIHNjYWxlQ29tcG9uZW50OiBTY2FsZUNvbXBvbmVudCwgY2FyZGluYWxpdHk6IHN0cmluZykge1xuICBjb25zdCB0eXBlID0gc2NhbGVDb21wb25lbnQuZ2V0KCd0eXBlJyk7XG4gIGNvbnN0IHBhZGRpbmcgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3BhZGRpbmcnKTtcbiAgbGV0IHBhZGRpbmdPdXRlciA9IHNjYWxlQ29tcG9uZW50LmdldCgncGFkZGluZ091dGVyJyk7XG4gIHBhZGRpbmdPdXRlciA9IHBhZGRpbmdPdXRlciAhPT0gdW5kZWZpbmVkID8gcGFkZGluZ091dGVyIDogcGFkZGluZztcblxuICBsZXQgcGFkZGluZ0lubmVyID0gc2NhbGVDb21wb25lbnQuZ2V0KCdwYWRkaW5nSW5uZXInKTtcbiAgcGFkZGluZ0lubmVyID0gdHlwZSA9PT0gJ2JhbmQnID9cbiAgICAvLyBvbmx5IGJhbmQgaGFzIHJlYWwgcGFkZGluZ0lubmVyXG4gICAgKHBhZGRpbmdJbm5lciAhPT0gdW5kZWZpbmVkID8gcGFkZGluZ0lubmVyIDogcGFkZGluZykgOlxuICAgIC8vIEZvciBwb2ludCwgYXMgY2FsY3VsYXRlZCBpbiBodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLXNjYWxlL2Jsb2IvbWFzdGVyL3NyYy9iYW5kLmpzI0wxMjgsXG4gICAgLy8gaXQncyBlcXVpdmFsZW50IHRvIGhhdmUgcGFkZGluZ0lubmVyID0gMSBzaW5jZSB0aGVyZSBpcyBvbmx5IG4tMSBzdGVwcyBiZXR3ZWVuIG4gcG9pbnRzLlxuICAgIDE7XG4gIHJldHVybiBgYmFuZHNwYWNlKCR7Y2FyZGluYWxpdHl9LCAke3BhZGRpbmdJbm5lcn0sICR7cGFkZGluZ091dGVyfSkgKiAke3NjYWxlTmFtZX1fc3RlcGA7XG59XG5cblxuIl19