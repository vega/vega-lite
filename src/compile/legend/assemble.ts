import {Legend as VgLegend, LegendEncode} from 'vega';
import {Config} from '../../config.js';
import {LEGEND_SCALE_CHANNELS} from '../../legend.js';
import {hasDiscreteDomain} from '../../scale.js';
import {keys, replaceAll, vals} from '../../util.js';
import {isDataRefUnionedDomain, isSignalRef, VgDomain, VgEncodeChannel, VgValueRef} from '../../vega.schema.js';
import {isUnitModel, Model} from '../model.js';
import * as util from '../../util.js';
import {LegendComponent} from './component.js';
import {mergeLegendComponent} from './parse.js';
import {ScaleChannel} from '../../channel.js';
import {assembleDomain} from '../scale/domain.js';

function setLegendEncode(
  legend: VgLegend,
  part: keyof LegendEncode,
  vgProp: VgEncodeChannel,
  vgRef: VgValueRef | VgValueRef[],
) {
  legend.encode ??= {};
  legend.encode[part] ??= {};
  legend.encode[part].update ??= {};
  // @ts-expect-error expression is too complex for typescript to understand
  legend.encode[part].update[vgProp] = vgRef;
}

/**
 * Determines the underlying field name for a given scale channel within a model hierarchy.
 *
 *
 * @param model - The model to search for the field definition
 * @param channel - The scale channel (e.g., 'color', 'size', 'shape') to find the field for
 * @returns The field name if found; otherwise undefined
 */
function getFieldKeyForChannel(model: Model, channel: ScaleChannel): string | undefined {
  if (isUnitModel(model)) {
    const fd = model.fieldDef(channel);
    if (fd?.field) {
      return fd.field;
    }
  }
  // Use explicit fields from children
  const childFields = (model.children ?? [])
    .map((child) => getFieldKeyForChannel(child, channel))
    .filter((f): f is string => !!f);

  if (childFields.length > 0) {
    const unique = util.unique(childFields, (x) => x);
    if (unique.length === 1) {
      return unique[0];
    }
    return undefined;
  }

  return undefined;
}

type LegendEntry = {channel: ScaleChannel; cmpt: LegendComponent};

function legendsAreMergeCompatible(model: Model, channelA: ScaleChannel, channelB: ScaleChannel): boolean {
  if (channelA === channelB) return true;
  const typeA = model.getScaleType(channelA);
  const typeB = model.getScaleType(channelB);
  if (!typeA || !typeB) return false;
  // Only require discrete/continuous compatibility here. Domain handling is done later.
  const aIsDiscrete = hasDiscreteDomain(typeA);
  const bIsDiscrete = hasDiscreteDomain(typeB);
  return aIsDiscrete === bIsDiscrete;
}

function isPrimitive(v: unknown): v is string | number | boolean {
  return typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean';
}

function extractDiscreteValuesFromDomain(domain: VgDomain): (string | number | boolean)[] | null {
  if (Array.isArray(domain)) {
    const primitives = domain.filter(isPrimitive) as (string | number | boolean)[];
    return primitives.length > 0 ? primitives : null;
  }

  if (isDataRefUnionedDomain(domain)) {
    const values: (string | number | boolean)[] = [];
    for (const f of domain.fields) {
      if (Array.isArray(f)) {
        values.push(...(f.filter(isPrimitive) as (string | number | boolean)[]));
      }
    }
    if (values.length > 0) {
      return util.unique(values, (x) => util.hash(x));
    }
  }
  return null;
}

/**
 * Compute the union of discrete values from the domains of two channels.
 *
 * @param model - The model to compute the union of discrete values for
 * @param channelA - The first channel to compute the union of discrete values for
 * @param channelB - The second channel to compute the union of discrete values for
 * @returns The union of discrete values
 */
function computeUnionDiscreteValues(
  model: Model,
  channelA: ScaleChannel,
  channelB: ScaleChannel,
): (string | number | boolean)[] | null {
  try {
    const dA = assembleDomain(model, channelA);
    const dB = assembleDomain(model, channelB);
    const vA = extractDiscreteValuesFromDomain(dA);
    const vB = extractDiscreteValuesFromDomain(dB);
    if (vA && vB) {
      return util.unique([...vA, ...vB], (x) => util.hash(x));
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Assemble legends for a model. We group legends by the underlying field used by the encoding.
 *
 * @param model - The model to assemble legends for
 * @returns The assembled legends
 */
export function assembleLegends(model: Model): VgLegend[] {
  const legendComponentIndex = model.component.legends;
  const legendsByGroup: Record<string, LegendEntry[]> = {};

  for (const channel of keys(legendComponentIndex)) {
    const fieldKey = getFieldKeyForChannel(model, channel);

    let groupKey: string;
    if (fieldKey) {
      groupKey = `field:${fieldKey}`;
    } else {
      groupKey = `channel:${String(channel)}`;
    }

    if (!legendsByGroup[groupKey]) {
      legendsByGroup[groupKey] = [{channel, cmpt: legendComponentIndex[channel].clone()}];
      continue;
    }

    let mergedIntoExisting = false;
    for (const existing of legendsByGroup[groupKey]) {
      if (!legendsAreMergeCompatible(model, existing.channel, channel)) {
        continue;
      }
      const merged = mergeLegendComponent(existing.cmpt, legendComponentIndex[channel]);
      if (merged) {
        const typeA = model.getScaleType(existing.channel);
        const typeB = model.getScaleType(channel);
        if (typeA && typeB && hasDiscreteDomain(typeA) && hasDiscreteDomain(typeB)) {
          const unionValues = computeUnionDiscreteValues(model, existing.channel, channel);
          if (unionValues && unionValues.length > 0) {
            const valuesProp = existing.cmpt.getWithExplicit('values');
            if (!valuesProp?.explicit) {
              existing.cmpt.set('values', unionValues, false);
            }
          }
        }
        mergedIntoExisting = true;
        break;
      }
    }
    if (!mergedIntoExisting) {
      legendsByGroup[groupKey].push({channel, cmpt: legendComponentIndex[channel].clone()});
    }
  }

  const legends = vals(legendsByGroup)
    .flat()
    .map((entry) => assembleLegend(entry.cmpt, model.config))
    .filter((l) => l !== undefined);

  return legends;
}

export function assembleLegend(legendCmpt: LegendComponent, config: Config) {
  const {disable, labelExpr, selections, ...legend} = legendCmpt.combine();

  if (disable) {
    return undefined;
  }

  if (config.aria === false && legend.aria == undefined) {
    legend.aria = false;
  }

  if (legend.encode?.symbols) {
    const out = legend.encode.symbols.update;
    if (out.fill && (out.fill as any)['value'] !== 'transparent' && !out.stroke && !legend.stroke) {
      // For non color channel's legend, we need to override symbol stroke config from Vega config if stroke channel is not used.
      out.stroke = {value: 'transparent'};
    }

    // Remove properties that the legend is encoding.
    for (const property of LEGEND_SCALE_CHANNELS) {
      if (legend[property]) {
        delete out[property];
      }
    }
  }

  if (!legend.title) {
    // title schema doesn't include null, ''
    delete legend.title;
  }

  if (labelExpr !== undefined) {
    let expr = labelExpr;
    if (legend.encode?.labels?.update && isSignalRef(legend.encode.labels.update.text)) {
      expr = replaceAll(labelExpr, 'datum.label', legend.encode.labels.update.text.signal);
    }
    setLegendEncode(legend, 'labels', 'text', {signal: expr});
  }

  return legend;
}
