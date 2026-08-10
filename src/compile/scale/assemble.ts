import {isArray, isObject} from 'vega-util';
import {isXorY, ScaleChannel, TIME} from '../../channel.js';
import {keys} from '../../util.js';
import {isDataRefDomain, isVgRangeStep, VgRange, VgScale} from '../../vega.schema.js';
import {isConcatModel, isLayerModel, isUnitModel, Model} from '../model.js';
import {assembleSelectionScaleDomain} from '../selection/assemble.js';
import {assembleDomain} from './domain.js';
import {animationKey, NEXT} from '../animation.js';
import {CURR} from '../selection/point.js';
import {TimeFieldDef} from '../../channeldef.js';

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

    const assembled: VgScale = {
      name,
      type,
      ...(domain ? {domain} : {}),
      ...(domainRaw ? {domainRaw} : {}),
      range,
      ...(reverse !== undefined ? {reverse: reverse as any} : {}),
      ...otherScaleProps,
    };

    scales.push(assembled);

    const next = assembleNextFrameScale(model, channel, assembled);
    if (next) {
      scales.push(next);
    }

    return scales;
  }, [] as VgScale[]);
}

/**
 * A copy of a scale whose domain comes from the frame the animation is heading
 * towards, or null if one is not needed.
 *
 * Interpolation and rescaling together require this scale. Rescaling moves the
 * domain every frame, so a mark tweening towards its successor has to read the
 * successor's position off the successor's scale. Measuring that position
 * against the current frame's domain would aim the mark at the wrong place.
 */
function assembleNextFrameScale(model: Model, channel: ScaleChannel, scale: VgScale): VgScale | null {
  if (!isUnitModel(model) || !animationKey(model) || channel === TIME) {
    return null;
  }

  if (!(model.encoding.time as TimeFieldDef<string>)?.rescale) {
    return null;
  }

  // Both the single-field and multi-field forms give their dataset in `data`.
  // A domain reading anything other than the frame dataset stays where it is.
  const domain = scale.domain as {data?: string};
  if (!isObject(domain) || isArray(domain) || !domain.data?.endsWith(CURR)) {
    return null;
  }

  return {
    ...scale,
    name: scale.name + NEXT,
    domain: {...domain, data: domain.data.slice(0, -CURR.length) + NEXT} as typeof scale.domain,
  };
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
