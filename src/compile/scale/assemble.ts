import {isArray} from 'vega-util';
import {Channel, ScaleChannel} from '../../channel';
import {keys} from '../../util';
import {isSignalRef, isVgRangeStep, VgRange, VgScale} from '../../vega.schema';
import {isConcatModel, isLayerModel, isRepeatModel, Model} from '../model';
import {isRawSelectionDomain, selectionScaleDomain} from '../selection/selection';
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
      let {domainRaw, range} = scale;
      const {name, type, domainRaw: _d, range: _r, ...otherScaleProps} = scale;

      range = assembleScaleRange(range, name, model, channel);

      // As scale parsing occurs before selection parsing, a temporary signal
      // is used for domainRaw. Here, we detect if this temporary signal
      // is set, and replace it with the correct domainRaw signal.
      // For more information, see isRawSelectionDomain in selection.ts.
      if (domainRaw && isRawSelectionDomain(domainRaw)) {
        domainRaw = selectionScaleDomain(model, domainRaw);
      }

      scales.push({
        name,
        type,
        domain: assembleDomain(model, channel),
        ...(domainRaw ? {domainRaw} : {}),
        range: range,
        ...otherScaleProps
      });

      return scales;
    },
    [] as VgScale[]
  );
}

export function assembleScaleRange(scaleRange: VgRange, scaleName: string, model: Model, channel: Channel) {
  // add signals to x/y range
  if (channel === 'x' || channel === 'y') {
    if (isVgRangeStep(scaleRange)) {
      // For x/y range step, use a signal created in layout assemble instead of a constant range step.
      return {
        step: {signal: scaleName + '_step'}
      };
    } else if (isArray(scaleRange) && scaleRange.length === 2) {
      const r0 = scaleRange[0];
      const r1 = scaleRange[1];
      if (r0 === 0 && isSignalRef(r1)) {
        // Replace width signal just in case it is renamed.
        return [0, {signal: model.getSizeName(r1.signal)}];
      } else if (isSignalRef(r0) && r1 === 0) {
        // Replace height signal just in case it is renamed.
        return [{signal: model.getSizeName(r0.signal)}, 0];
      }
    }
  }
  return scaleRange;
}
