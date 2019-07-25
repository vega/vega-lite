import * as tslib_1 from "tslib";
import { keys } from '../../util';
import { isVgRangeStep } from '../../vega.schema';
import { isConcatModel, isLayerModel, isRepeatModel } from '../model';
import { isRawSelectionDomain } from '../selection';
import { assembleSelectionScaleDomain } from '../selection/assemble';
import { assembleDomain } from './domain';
export function assembleScales(model) {
    if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
        // For concat / layer / repeat, include scales of children too
        return model.children.reduce((scales, child) => {
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
    return keys(model.component.scales).reduce((scales, channel) => {
        const scaleComponent = model.component.scales[channel];
        if (scaleComponent.merged) {
            // Skipped merged scales
            return scales;
        }
        const scale = scaleComponent.combine();
        // need to separate const and non const object destruction
        let { domainRaw } = scale;
        const { name, type, domains: _d, domainRaw: _dr, range: _r } = scale, otherScaleProps = tslib_1.__rest(scale, ["name", "type", "domains", "domainRaw", "range"]);
        const range = assembleScaleRange(scale.range, name, channel);
        // As scale parsing occurs before selection parsing, a temporary signal
        // is used for domainRaw. Here, we detect if this temporary signal
        // is set, and replace it with the correct domainRaw signal.
        // For more information, see isRawSelectionDomain in selection.ts.
        if (domainRaw && isRawSelectionDomain(domainRaw)) {
            domainRaw = assembleSelectionScaleDomain(model, domainRaw);
        }
        const domain = assembleDomain(model, channel);
        scales.push(Object.assign({ name,
            type }, (domain ? { domain } : {}), (domainRaw ? { domainRaw } : {}), { range: range }, otherScaleProps));
        return scales;
    }, []);
}
export function assembleScaleRange(scaleRange, scaleName, channel) {
    // add signals to x/y range
    if (channel === 'x' || channel === 'y') {
        if (isVgRangeStep(scaleRange)) {
            // For x/y range step, use a signal created in layout assemble instead of a constant range step.
            return {
                step: { signal: scaleName + '_step' }
            };
        }
    }
    return scaleRange;
}
//# sourceMappingURL=assemble.js.map