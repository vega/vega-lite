import {Channel, ScaleChannel} from '../../channel';
import {keys} from '../../util';
import {isVgRangeStep, VgRange, VgScale} from '../../vega.schema';
import {isConcatModel, isLayerModel, isRepeatModel, Model} from '../model';
import {isRawSelectionDomain} from '../selection';
import {assembleSelectionScaleDomain} from '../selection/assemble';
import {assembleDomain} from './domain';

export function assembleScales(model: Model): VgScale[] {
  if (isLayerModel(model) || isConcatModel(model) || isRepeatModel(model)) {
    // For concat / layer / repeat, include scales of children too
    return model.children.reduce((scales, child) => {
      return scales.concat(assembleScales(child));
    }, assembleScalesForModel(model));
  } else {
    // For facet, child scales would not be included in the parent's scope.
    // For unit, there is no child.
    return assembleScalesForModel(model);
  }
}

export function assembleScalesForModel(model: Model): VgScale[] {
  return keys(model.component.scales).reduce(
    (scales: VgScale[], channel: ScaleChannel) => {
      const scaleComponent = model.component.scales[channel];
      if (scaleComponent.merged) {
        // Skipped merged scales
        return scales;
      }

      const scale = scaleComponent.combine();

      // need to separate const and non const object destruction
      let {domainRaw} = scale;
      const {name, type, domains: _d, domainRaw: _dr, range: _r, ...otherScaleProps} = scale;

      const range = assembleScaleRange(scale.range, name, channel);

      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        domainRaw = assembleSelectionScaleDomain(model, domainRaw);
      }

      const domain = assembleDomain(model, channel);

      scales.push({
        name,
        type,
        ...(domain ? {domain} : {}),
        ...(domainRaw ? {domainRaw} : {}),
        range: range,
        ...otherScaleProps
      });

      return scales;
    },
    [] as VgScale[]
  );
}

export function assembleScaleRange(scaleRange: VgRange, scaleName: string, channel: Channel): VgRange {
  // add signals to x/y range
  if (channel === 'x' || channel === 'y') {
    if (isVgRangeStep(scaleRange)) {
      // For x/y range step, use a signal created in layout assemble instead of a constant range step.
      return {
        step: {signal: scaleName + '_step'}
      };
    }
  }
  return scaleRange;
}
