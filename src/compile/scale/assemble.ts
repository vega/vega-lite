import {isObject} from 'vega-util';
import {isXorY, ScaleChannel} from '../../channel.js';
import {keys} from '../../util.js';
import {isDataRefDomain, isVgRangeStep, VgRange, VgScale} from '../../vega.schema.js';
import {isConcatModel, isLayerModel, Model} from '../model.js';
import {assembleSelectionScaleDomain} from '../selection/assemble.js';
import {assembleDomain} from './domain.js';

export function assembleScales(model: Model): VgScale[] {
  if (isLayerModel(model) || isConcatModel(model)) {
    // For concat and layer, include scales of children too
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
  return keys(model.component.scales).reduce((scales: VgScale[], channel: ScaleChannel) => {
    const scaleComponent = model.component.scales[channel];
    if (scaleComponent.merged) {
      // Skipped merged scales
      return scales;
    }

    const scale = scaleComponent.combine();
    const {name, type, selectionExtent, domains: _d, range: _r, reverse, ...otherScaleProps} = scale;
    const range = assembleScaleRange(scale.range, name, channel, model);

    const domain = assembleDomain(model, channel);
    const domainRaw = selectionExtent
      ? assembleSelectionScaleDomain(model, selectionExtent, scaleComponent, domain)
      : null;

    scales.push({
      name,
      type,
      ...(domain ? {domain} : {}),
      ...(domainRaw ? {domainRaw} : {}),
      range,
      ...(reverse !== undefined ? {reverse: reverse as any} : {}),
      ...otherScaleProps,
    });

    return scales;
  }, [] as VgScale[]);
}

export function assembleScaleRange(
  scaleRange: VgRange,
  scaleName: string,
  channel: ScaleChannel,
  model?: Model,
): VgRange {
  // add signals to x/y range
  if (isXorY(channel)) {
    if (isVgRangeStep(scaleRange)) {
      // For width/height step, use a signal created in layout assemble instead of a constant step.
      return {
        step: {signal: `${scaleName}_step`},
      };
    }
  } else if (isObject(scaleRange) && isDataRefDomain(scaleRange)) {
    return {
      ...scaleRange,
      data: model.lookupDataSource(scaleRange.data),
    };
  }
  return scaleRange;
}
