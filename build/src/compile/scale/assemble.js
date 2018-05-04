import * as tslib_1 from "tslib";
import { isArray } from 'vega-util';
import { keys } from '../../util';
import { isVgRangeStep, isVgSignalRef } from '../../vega.schema';
import { isConcatModel, isLayerModel, isRepeatModel } from '../model';
import { isRawSelectionDomain, selectionScaleDomain } from '../selection/selection';
import { assembleDomain } from './domain';
export function assembleScales(model) {
    if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
        // For concat / layer / repeat, include scales of children too
        return model.children.reduce(function (scales, child) {
            return scales.concat(assembleScales(child));
        }, assembleScalesForModel(model));
    }
    else {
        // For facet, child scales would not be included in the parent's scope.
        // For unit, there is no child.
        return assembleScalesForModel(model);
    }
}
export function assembleScalesForModel(model) {
    return keys(model.component.scales).reduce(function (scales, channel) {
        var scaleComponent = model.component.scales[channel];
        if (scaleComponent.merged) {
            // Skipped merged scales
            return scales;
        }
        var scale = scaleComponent.combine();
        // need to separate const and non const object destruction
        var domainRaw = scale.domainRaw, range = scale.range;
        var name = scale.name, type = scale.type, _d = scale.domainRaw, _r = scale.range, otherScaleProps = tslib_1.__rest(scale, ["name", "type", "domainRaw", "range"]);
        range = assembleScaleRange(range, name, model, channel);
        // As scale parsing occurs before selection parsing, a temporary signal
        // is used for domainRaw. Here, we detect if this temporary signal
        // is set, and replace it with the correct domainRaw signal.
        // For more information, see isRawSelectionDomain in selection.ts.
        if (domainRaw && isRawSelectionDomain(domainRaw)) {
            domainRaw = selectionScaleDomain(model, domainRaw);
        }
        scales.push(tslib_1.__assign({ name: name,
            type: type, domain: assembleDomain(model, channel) }, (domainRaw ? { domainRaw: domainRaw } : {}), { range: range }, otherScaleProps));
        return scales;
    }, []);
}
export function assembleScaleRange(scaleRange, scaleName, model, channel) {
    // add signals to x/y range
    if (channel === 'x' || channel === 'y') {
        if (isVgRangeStep(scaleRange)) {
            // For x/y range step, use a signal created in layout assemble instead of a constant range step.
            return {
                step: { signal: scaleName + '_step' }
            };
        }
        else if (isArray(scaleRange) && scaleRange.length === 2) {
            var r0 = scaleRange[0];
            var r1 = scaleRange[1];
            if (r0 === 0 && isVgSignalRef(r1)) {
                // Replace width signal just in case it is renamed.
                return [0, { signal: model.getSizeName(r1.signal) }];
            }
            else if (isVgSignalRef(r0) && r1 === 0) {
                // Replace height signal just in case it is renamed.
                return [{ signal: model.getSizeName(r0.signal) }, 0];
            }
        }
    }
    return scaleRange;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9zY2FsZS9hc3NlbWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUVsQyxPQUFPLEVBQUMsSUFBSSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ2hDLE9BQU8sRUFBQyxhQUFhLEVBQUUsYUFBYSxFQUFtQixNQUFNLG1CQUFtQixDQUFDO0FBQ2pGLE9BQU8sRUFBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBUSxNQUFNLFVBQVUsQ0FBQztBQUMzRSxPQUFPLEVBQUMsb0JBQW9CLEVBQUUsb0JBQW9CLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNsRixPQUFPLEVBQUMsY0FBYyxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBRXhDLE1BQU0seUJBQXlCLEtBQVk7SUFDekMsSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2RSw4REFBOEQ7UUFDOUQsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFDLE1BQU0sRUFBRSxLQUFLO1lBQ3pDLE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUM5QyxDQUFDLEVBQUUsc0JBQXNCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNuQztTQUFNO1FBQ0wsdUVBQXVFO1FBQ3ZFLCtCQUErQjtRQUMvQixPQUFPLHNCQUFzQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3RDO0FBQ0gsQ0FBQztBQUVELE1BQU0saUNBQWlDLEtBQVk7SUFDL0MsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQyxNQUFpQixFQUFFLE9BQXFCO1FBQ2xGLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZELElBQUksY0FBYyxDQUFDLE1BQU0sRUFBRTtZQUN6Qix3QkFBd0I7WUFDeEIsT0FBTyxNQUFNLENBQUM7U0FDZjtRQUVELElBQU0sS0FBSyxHQUFHLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUV2QywwREFBMEQ7UUFDckQsSUFBQSwyQkFBUyxFQUFFLG1CQUFLLENBQVU7UUFDeEIsSUFBQSxpQkFBSSxFQUFFLGlCQUFJLEVBQUUsb0JBQWEsRUFBRSxnQkFBUyxFQUFFLCtFQUFrQixDQUFVO1FBRXpFLEtBQUssR0FBRyxrQkFBa0IsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4RCx1RUFBdUU7UUFDdkUsa0VBQWtFO1FBQ2xFLDREQUE0RDtRQUM1RCxrRUFBa0U7UUFDbEUsSUFBSSxTQUFTLElBQUksb0JBQW9CLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDaEQsU0FBUyxHQUFHLG9CQUFvQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztTQUNwRDtRQUdELE1BQU0sQ0FBQyxJQUFJLG9CQUNULElBQUksTUFBQTtZQUNKLElBQUksTUFBQSxFQUNKLE1BQU0sRUFBRSxjQUFjLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxJQUNuQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFDakMsS0FBSyxFQUFFLEtBQUssSUFDVCxlQUFlLEVBQ2xCLENBQUM7UUFFSCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDLEVBQUUsRUFBZSxDQUFDLENBQUM7QUFDeEIsQ0FBQztBQUVELE1BQU0sNkJBQTZCLFVBQW1CLEVBQUUsU0FBaUIsRUFBRSxLQUFZLEVBQUUsT0FBZ0I7SUFDdkcsMkJBQTJCO0lBQzNCLElBQUksT0FBTyxLQUFLLEdBQUcsSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO1FBQ3RDLElBQUksYUFBYSxDQUFDLFVBQVUsQ0FBQyxFQUFFO1lBQzdCLGdHQUFnRztZQUNoRyxPQUFPO2dCQUNMLElBQUksRUFBRSxFQUFDLE1BQU0sRUFBRSxTQUFTLEdBQUcsT0FBTyxFQUFDO2FBQ3BDLENBQUM7U0FDSDthQUFNLElBQUksT0FBTyxDQUFDLFVBQVUsQ0FBQyxJQUFJLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pELElBQU0sRUFBRSxHQUFHLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFNLEVBQUUsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDakMsbURBQW1EO2dCQUNuRCxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsQ0FBQzthQUNwRDtpQkFBTSxJQUFJLGFBQWEsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dCQUN4QyxvREFBb0Q7Z0JBQ3BELE9BQU8sQ0FBQyxFQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2FBQ3BEO1NBQ0Y7S0FDRjtJQUNELE9BQU8sVUFBVSxDQUFDO0FBQ3BCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzQXJyYXl9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge0NoYW5uZWwsIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge2tleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc1ZnUmFuZ2VTdGVwLCBpc1ZnU2lnbmFsUmVmLCBWZ1JhbmdlLCBWZ1NjYWxlfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzQ29uY2F0TW9kZWwsIGlzTGF5ZXJNb2RlbCwgaXNSZXBlYXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7aXNSYXdTZWxlY3Rpb25Eb21haW4sIHNlbGVjdGlvblNjYWxlRG9tYWlufSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7YXNzZW1ibGVEb21haW59IGZyb20gJy4vZG9tYWluJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlU2NhbGVzKG1vZGVsOiBNb2RlbCk6IFZnU2NhbGVbXSB7XG4gIGlmIChpc0xheWVyTW9kZWwobW9kZWwpIHx8IGlzQ29uY2F0TW9kZWwobW9kZWwpIHx8IGlzUmVwZWF0TW9kZWwobW9kZWwpKSB7XG4gICAgLy8gRm9yIGNvbmNhdCAvIGxheWVyIC8gcmVwZWF0LCBpbmNsdWRlIHNjYWxlcyBvZiBjaGlsZHJlbiB0b29cbiAgICByZXR1cm4gbW9kZWwuY2hpbGRyZW4ucmVkdWNlKChzY2FsZXMsIGNoaWxkKSA9PiB7XG4gICAgICByZXR1cm4gc2NhbGVzLmNvbmNhdChhc3NlbWJsZVNjYWxlcyhjaGlsZCkpO1xuICAgIH0sIGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWwpKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBGb3IgZmFjZXQsIGNoaWxkIHNjYWxlcyB3b3VsZCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIHBhcmVudCdzIHNjb3BlLlxuICAgIC8vIEZvciB1bml0LCB0aGVyZSBpcyBubyBjaGlsZC5cbiAgICByZXR1cm4gYXNzZW1ibGVTY2FsZXNGb3JNb2RlbChtb2RlbCk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlU2NhbGVzRm9yTW9kZWwobW9kZWw6IE1vZGVsKTogVmdTY2FsZVtdIHtcbiAgICByZXR1cm4ga2V5cyhtb2RlbC5jb21wb25lbnQuc2NhbGVzKS5yZWR1Y2UoKHNjYWxlczogVmdTY2FsZVtdLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICAgIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChzY2FsZUNvbXBvbmVudC5tZXJnZWQpIHtcbiAgICAgICAgLy8gU2tpcHBlZCBtZXJnZWQgc2NhbGVzXG4gICAgICAgIHJldHVybiBzY2FsZXM7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHNjYWxlID0gc2NhbGVDb21wb25lbnQuY29tYmluZSgpO1xuXG4gICAgICAvLyBuZWVkIHRvIHNlcGFyYXRlIGNvbnN0IGFuZCBub24gY29uc3Qgb2JqZWN0IGRlc3RydWN0aW9uXG4gICAgICBsZXQge2RvbWFpblJhdywgcmFuZ2V9ID0gc2NhbGU7XG4gICAgICBjb25zdCB7bmFtZSwgdHlwZSwgZG9tYWluUmF3OiBfZCwgcmFuZ2U6IF9yLCAuLi5vdGhlclNjYWxlUHJvcHN9ID0gc2NhbGU7XG5cbiAgICAgIHJhbmdlID0gYXNzZW1ibGVTY2FsZVJhbmdlKHJhbmdlLCBuYW1lLCBtb2RlbCwgY2hhbm5lbCk7XG5cbiAgICAgIC8vIEFzIHNjYWxlIHBhcnNpbmcgb2NjdXJzIGJlZm9yZSBzZWxlY3Rpb24gcGFyc2luZywgYSB0ZW1wb3Jhcnkgc2lnbmFsXG4gICAgICAvLyBpcyB1c2VkIGZvciBkb21haW5SYXcuIEhlcmUsIHdlIGRldGVjdCBpZiB0aGlzIHRlbXBvcmFyeSBzaWduYWxcbiAgICAgIC8vIGlzIHNldCwgYW5kIHJlcGxhY2UgaXQgd2l0aCB0aGUgY29ycmVjdCBkb21haW5SYXcgc2lnbmFsLlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBpc1Jhd1NlbGVjdGlvbkRvbWFpbiBpbiBzZWxlY3Rpb24udHMuXG4gICAgICBpZiAoZG9tYWluUmF3ICYmIGlzUmF3U2VsZWN0aW9uRG9tYWluKGRvbWFpblJhdykpIHtcbiAgICAgICAgZG9tYWluUmF3ID0gc2VsZWN0aW9uU2NhbGVEb21haW4obW9kZWwsIGRvbWFpblJhdyk7XG4gICAgICB9XG5cblxuICAgICAgc2NhbGVzLnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICB0eXBlLFxuICAgICAgICBkb21haW46IGFzc2VtYmxlRG9tYWluKG1vZGVsLCBjaGFubmVsKSxcbiAgICAgICAgLi4uKGRvbWFpblJhdyA/IHtkb21haW5SYXd9IDoge30pLFxuICAgICAgICByYW5nZTogcmFuZ2UsXG4gICAgICAgIC4uLm90aGVyU2NhbGVQcm9wc1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiBzY2FsZXM7XG4gICAgfSwgW10gYXMgVmdTY2FsZVtdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlU2NhbGVSYW5nZShzY2FsZVJhbmdlOiBWZ1JhbmdlLCBzY2FsZU5hbWU6IHN0cmluZywgbW9kZWw6IE1vZGVsLCBjaGFubmVsOiBDaGFubmVsKSB7XG4gIC8vIGFkZCBzaWduYWxzIHRvIHgveSByYW5nZVxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnIHx8IGNoYW5uZWwgPT09ICd5Jykge1xuICAgIGlmIChpc1ZnUmFuZ2VTdGVwKHNjYWxlUmFuZ2UpKSB7XG4gICAgICAvLyBGb3IgeC95IHJhbmdlIHN0ZXAsIHVzZSBhIHNpZ25hbCBjcmVhdGVkIGluIGxheW91dCBhc3NlbWJsZSBpbnN0ZWFkIG9mIGEgY29uc3RhbnQgcmFuZ2Ugc3RlcC5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHN0ZXA6IHtzaWduYWw6IHNjYWxlTmFtZSArICdfc3RlcCd9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShzY2FsZVJhbmdlKSAmJiBzY2FsZVJhbmdlLmxlbmd0aCA9PT0gMikge1xuICAgICAgY29uc3QgcjAgPSBzY2FsZVJhbmdlWzBdO1xuICAgICAgY29uc3QgcjEgPSBzY2FsZVJhbmdlWzFdO1xuICAgICAgaWYgKHIwID09PSAwICYmIGlzVmdTaWduYWxSZWYocjEpKSB7XG4gICAgICAgIC8vIFJlcGxhY2Ugd2lkdGggc2lnbmFsIGp1c3QgaW4gY2FzZSBpdCBpcyByZW5hbWVkLlxuICAgICAgICByZXR1cm4gWzAsIHtzaWduYWw6IG1vZGVsLmdldFNpemVOYW1lKHIxLnNpZ25hbCl9XTtcbiAgICAgIH0gZWxzZSBpZiAoaXNWZ1NpZ25hbFJlZihyMCkgJiYgcjEgPT09IDApIHtcbiAgICAgICAgLy8gUmVwbGFjZSBoZWlnaHQgc2lnbmFsIGp1c3QgaW4gY2FzZSBpdCBpcyByZW5hbWVkLlxuICAgICAgICByZXR1cm4gW3tzaWduYWw6IG1vZGVsLmdldFNpemVOYW1lKHIwLnNpZ25hbCl9LCAwXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNjYWxlUmFuZ2U7XG59XG4iXX0=