import { hasDiscreteDomain } from '../../scale';
import { isVgRangeStep } from '../../vega.schema';
import { isFacetModel } from '../model';
export function assembleLayoutSignals(model) {
    return [].concat(sizeSignals(model, 'width'), sizeSignals(model, 'height'));
}
export function sizeSignals(model, sizeType) {
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
            if (hasDiscreteDomain(type) && isVgRangeStep(range)) {
                var scaleName = model.scaleName(channel);
                if (isFacetModel(model.parent)) {
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
function stepSignal(scaleName, range) {
    return {
        name: scaleName + '_step',
        value: range.step,
    };
}
export function sizeExpr(scaleName, scaleComponent, cardinality) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9sYXlvdXRzaXplL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUM5QyxPQUFPLEVBQUMsYUFBYSxFQUF3QixNQUFNLG1CQUFtQixDQUFDO0FBQ3ZFLE9BQU8sRUFBQyxZQUFZLEVBQVEsTUFBTSxVQUFVLENBQUM7QUFHN0MsTUFBTSxnQ0FBZ0MsS0FBWTtJQUNoRCxPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQ2QsV0FBVyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsRUFDM0IsV0FBVyxDQUFDLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FDN0IsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLHNCQUFzQixLQUFZLEVBQUUsUUFBNEI7SUFDcEUsSUFBTSxPQUFPLEdBQUcsUUFBUSxLQUFLLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RELElBQUksQ0FBQyxJQUFJLElBQUksSUFBSSxLQUFLLFFBQVEsRUFBRTtRQUM5QixPQUFPLEVBQUUsQ0FBQztLQUNYO0lBRUQsc0dBQXNHO0lBQ3RHLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7SUFFckQsSUFBSSxJQUFJLEtBQUssWUFBWSxFQUFFO1FBQ3pCLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV4RCxJQUFJLGNBQWMsRUFBRTtZQUNsQixJQUFNLElBQUksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3hDLElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFMUMsSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ25ELElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBRTNDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRTtvQkFDOUIsaUZBQWlGO29CQUNqRixvRUFBb0U7b0JBQ3BFLDBEQUEwRDtvQkFDMUQsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO29CQUNyRCxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssYUFBYSxFQUFFO3dCQUNsRCxPQUFPLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO3FCQUN2QztpQkFDRjtnQkFFRCxPQUFPO29CQUNMLFVBQVUsQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDO29CQUM1Qjt3QkFDRSxJQUFJLE1BQUE7d0JBQ0osTUFBTSxFQUFFLFFBQVEsQ0FBQyxTQUFTLEVBQUUsY0FBYyxFQUFFLGFBQVcsU0FBUyxjQUFXLENBQUM7cUJBQzdFO2lCQUNGLENBQUM7YUFDSDtTQUNGO1FBQ0QsMkZBQTJGO1FBQzNGLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztLQUM5RTtTQUFNO1FBQ0wsT0FBTyxDQUFDO2dCQUNOLElBQUksTUFBQTtnQkFDSixLQUFLLEVBQUUsSUFBSTthQUNaLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQUVELG9CQUFvQixTQUFpQixFQUFFLEtBQWtCO0lBQ3ZELE9BQU87UUFDTCxJQUFJLEVBQUUsU0FBUyxHQUFHLE9BQU87UUFDekIsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJO0tBQ2xCLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxtQkFBbUIsU0FBaUIsRUFBRSxjQUE4QixFQUFFLFdBQW1CO0lBQzdGLElBQU0sSUFBSSxHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEMsSUFBTSxPQUFPLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM5QyxJQUFJLFlBQVksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RELFlBQVksR0FBRyxZQUFZLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUVuRSxJQUFJLFlBQVksR0FBRyxjQUFjLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQ3RELFlBQVksR0FBRyxJQUFJLEtBQUssTUFBTSxDQUFDLENBQUM7UUFDOUIsa0NBQWtDO1FBQ2xDLENBQUMsWUFBWSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELCtGQUErRjtRQUMvRiwyRkFBMkY7UUFDM0YsQ0FBQyxDQUFDO0lBQ0osT0FBTyxlQUFhLFdBQVcsVUFBSyxZQUFZLFVBQUssWUFBWSxZQUFPLFNBQVMsVUFBTyxDQUFDO0FBQzNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7aGFzRGlzY3JldGVEb21haW59IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7aXNWZ1JhbmdlU3RlcCwgVmdSYW5nZVN0ZXAsIFZnU2lnbmFsfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7U2NhbGVDb21wb25lbnR9IGZyb20gJy4uL3NjYWxlL2NvbXBvbmVudCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZUxheW91dFNpZ25hbHMobW9kZWw6IE1vZGVsKTogVmdTaWduYWxbXSB7XG4gIHJldHVybiBbXS5jb25jYXQoXG4gICAgc2l6ZVNpZ25hbHMobW9kZWwsICd3aWR0aCcpLFxuICAgIHNpemVTaWduYWxzKG1vZGVsLCAnaGVpZ2h0JylcbiAgKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNpemVTaWduYWxzKG1vZGVsOiBNb2RlbCwgc2l6ZVR5cGU6ICd3aWR0aCcgfCAnaGVpZ2h0Jyk6IFZnU2lnbmFsW10ge1xuICBjb25zdCBjaGFubmVsID0gc2l6ZVR5cGUgPT09ICd3aWR0aCcgPyAneCcgOiAneSc7XG4gIGNvbnN0IHNpemUgPSBtb2RlbC5jb21wb25lbnQubGF5b3V0U2l6ZS5nZXQoc2l6ZVR5cGUpO1xuICBpZiAoIXNpemUgfHwgc2l6ZSA9PT0gJ21lcmdlZCcpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICAvLyBSZWFkIHNpemUgc2lnbmFsIG5hbWUgZnJvbSBuYW1lIG1hcCwganVzdCBpbiBjYXNlIGl0IGlzIHRoZSB0b3AtbGV2ZWwgc2l6ZSBzaWduYWwgdGhhdCBnb3QgcmVuYW1lZC5cbiAgY29uc3QgbmFtZSA9IG1vZGVsLmdldFNpemVTaWduYWxSZWYoc2l6ZVR5cGUpLnNpZ25hbDtcblxuICBpZiAoc2l6ZSA9PT0gJ3JhbmdlLXN0ZXAnKSB7XG4gICAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKTtcblxuICAgIGlmIChzY2FsZUNvbXBvbmVudCkge1xuICAgICAgY29uc3QgdHlwZSA9IHNjYWxlQ29tcG9uZW50LmdldCgndHlwZScpO1xuICAgICAgY29uc3QgcmFuZ2UgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3JhbmdlJyk7XG5cbiAgICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbih0eXBlKSAmJiBpc1ZnUmFuZ2VTdGVwKHJhbmdlKSkge1xuICAgICAgICBjb25zdCBzY2FsZU5hbWUgPSBtb2RlbC5zY2FsZU5hbWUoY2hhbm5lbCk7XG5cbiAgICAgICAgaWYgKGlzRmFjZXRNb2RlbChtb2RlbC5wYXJlbnQpKSB7XG4gICAgICAgICAgLy8gSWYgcGFyZW50IGlzIGZhY2V0IGFuZCB0aGlzIGlzIGFuIGluZGVwZW5kZW50IHNjYWxlLCByZXR1cm4gb25seSBzaWduYWwgc2lnbmFsXG4gICAgICAgICAgLy8gYXMgdGhlIHdpZHRoL2hlaWdodCB3aWxsIGJlIGNhbGN1bGF0ZWQgdXNpbmcgdGhlIGNhcmRpbmFsaXR5IGZyb21cbiAgICAgICAgICAvLyBmYWNldCdzIGFnZ3JlZ2F0ZSByYXRoZXIgdGhhbiByZWFkaW5nIGZyb20gc2NhbGUgZG9tYWluXG4gICAgICAgICAgY29uc3QgcGFyZW50UmVzb2x2ZSA9IG1vZGVsLnBhcmVudC5jb21wb25lbnQucmVzb2x2ZTtcbiAgICAgICAgICBpZiAocGFyZW50UmVzb2x2ZS5zY2FsZVtjaGFubmVsXSA9PT0gJ2luZGVwZW5kZW50Jykge1xuICAgICAgICAgICAgcmV0dXJuIFtzdGVwU2lnbmFsKHNjYWxlTmFtZSwgcmFuZ2UpXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgIHN0ZXBTaWduYWwoc2NhbGVOYW1lLCByYW5nZSksXG4gICAgICAgICAge1xuICAgICAgICAgICAgbmFtZSxcbiAgICAgICAgICAgIHVwZGF0ZTogc2l6ZUV4cHIoc2NhbGVOYW1lLCBzY2FsZUNvbXBvbmVudCwgYGRvbWFpbignJHtzY2FsZU5hbWV9JykubGVuZ3RoYClcbiAgICAgICAgICB9XG4gICAgICAgIF07XG4gICAgICB9XG4gICAgfVxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0OiBDb25kaXRpb24gc2hvdWxkIG5vdCBoYXBwZW4gLS0gb25seSBmb3Igd2FybmluZyBpbiBkZXZlbG9wbWVudC4gKi9cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2xheW91dCBzaXplIGlzIHJhbmdlIHN0ZXAgYWx0aG91Z2ggdGhlcmUgaXMgbm8gcmFuZ2VTdGVwLicpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbe1xuICAgICAgbmFtZSxcbiAgICAgIHZhbHVlOiBzaXplXG4gICAgfV07XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RlcFNpZ25hbChzY2FsZU5hbWU6IHN0cmluZywgcmFuZ2U6IFZnUmFuZ2VTdGVwKTogVmdTaWduYWwge1xuICByZXR1cm4ge1xuICAgIG5hbWU6IHNjYWxlTmFtZSArICdfc3RlcCcsXG4gICAgdmFsdWU6IHJhbmdlLnN0ZXAsXG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaXplRXhwcihzY2FsZU5hbWU6IHN0cmluZywgc2NhbGVDb21wb25lbnQ6IFNjYWxlQ29tcG9uZW50LCBjYXJkaW5hbGl0eTogc3RyaW5nKSB7XG4gIGNvbnN0IHR5cGUgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3R5cGUnKTtcbiAgY29uc3QgcGFkZGluZyA9IHNjYWxlQ29tcG9uZW50LmdldCgncGFkZGluZycpO1xuICBsZXQgcGFkZGluZ091dGVyID0gc2NhbGVDb21wb25lbnQuZ2V0KCdwYWRkaW5nT3V0ZXInKTtcbiAgcGFkZGluZ091dGVyID0gcGFkZGluZ091dGVyICE9PSB1bmRlZmluZWQgPyBwYWRkaW5nT3V0ZXIgOiBwYWRkaW5nO1xuXG4gIGxldCBwYWRkaW5nSW5uZXIgPSBzY2FsZUNvbXBvbmVudC5nZXQoJ3BhZGRpbmdJbm5lcicpO1xuICBwYWRkaW5nSW5uZXIgPSB0eXBlID09PSAnYmFuZCcgP1xuICAgIC8vIG9ubHkgYmFuZCBoYXMgcmVhbCBwYWRkaW5nSW5uZXJcbiAgICAocGFkZGluZ0lubmVyICE9PSB1bmRlZmluZWQgPyBwYWRkaW5nSW5uZXIgOiBwYWRkaW5nKSA6XG4gICAgLy8gRm9yIHBvaW50LCBhcyBjYWxjdWxhdGVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2Etc2NhbGUvYmxvYi9tYXN0ZXIvc3JjL2JhbmQuanMjTDEyOCxcbiAgICAvLyBpdCdzIGVxdWl2YWxlbnQgdG8gaGF2ZSBwYWRkaW5nSW5uZXIgPSAxIHNpbmNlIHRoZXJlIGlzIG9ubHkgbi0xIHN0ZXBzIGJldHdlZW4gbiBwb2ludHMuXG4gICAgMTtcbiAgcmV0dXJuIGBiYW5kc3BhY2UoJHtjYXJkaW5hbGl0eX0sICR7cGFkZGluZ0lubmVyfSwgJHtwYWRkaW5nT3V0ZXJ9KSAqICR7c2NhbGVOYW1lfV9zdGVwYDtcbn1cblxuXG4iXX0=