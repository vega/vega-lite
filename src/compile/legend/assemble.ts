import {Legend as VgLegend, LegendEncode} from 'vega';
import {Config} from '../../config.js';
import {LEGEND_SCALE_CHANNELS} from '../../legend.js';
import {hasDiscreteDomain} from '../../scale.js';
import {keys, replaceAll, stringify, vals} from '../../util.js';
import {isSignalRef, VgEncodeChannel, VgValueRef} from '../../vega.schema.js';
import {isUnitModel, Model} from '../model.js';
import {getFieldFromNonUnionDomains} from '../scale/domain.js';
import {LegendComponent} from './component.js';
import {mergeLegendComponent} from './parse.js';

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

function findModelWithLocalScale(model: Model, channel: any): Model | undefined {
  let m: Model = model;
  while (m) {
    const scales = (m as any).component?.scales;
    if (scales && (scales as any)[channel]) {
      return m;
    }
    m = (m as any).parent;
  }
  return undefined;
}

type FieldKeyInfo = {field?: string; explicit: boolean};

function getFieldKeyForChannel(model: Model, channel: any): FieldKeyInfo {
  if (isUnitModel(model)) {
    const fd = model.fieldDef(channel as any);
    if (fd?.field) {
      return {field: fd.field, explicit: true};
    }
  }

  // Use explicit fields from children first
  const childExplicit = (model.children ?? [])
    .map((child) => getFieldKeyForChannel(child, channel))
    .filter((r) => r.explicit && !!r.field)
    .map((r) => r.field as string);

  if (childExplicit.length > 0) {
    const unique = Array.from(new Set(childExplicit));
    if (unique.length === 1) {
      return {field: unique[0], explicit: true};
    }
    return {field: undefined, explicit: false};
  }

  // Otherwise, attempt to infer from children's local scale domains quietly
  const childDomainFields = (model.children ?? [])
    .map((child) => {
      const scales = (child as any).component?.scales;
      const sc = scales ? (scales as any)[channel] : undefined;
      if (!sc) return undefined;
      return getFieldFromNonUnionDomains(sc.get('domains'));
    })
    .filter((f): f is string => !!f);

  if (childDomainFields.length > 0) {
    const unique = Array.from(new Set(childDomainFields));
    if (unique.length === 1) {
      return {field: unique[0], explicit: false};
    }
  }

  // Fallback: infer from this model's local scale domains
  const owner = findModelWithLocalScale(model, channel as any);
  if (owner) {
    const scales = (owner as any).component?.scales;
    const sc = scales ? (scales as any)[channel] : undefined;
    if (sc) {
      const f = getFieldFromNonUnionDomains(sc.get('domains'));
      if (f) return {field: f, explicit: false};
    }
  }
  return {field: undefined, explicit: false};
}

type LegendEntry = {channel: any; cmpt: LegendComponent};

function legendsAreMergeCompatible(model: Model, channelA: any, channelB: any): boolean {
  if (channelA === channelB) return true;
  const typeA = model.getScaleType(channelA as any);
  const typeB = model.getScaleType(channelB as any);
  if (!typeA || !typeB) return false;
  // Check discrete/continuous compatibility
  const aIsDiscrete = hasDiscreteDomain(typeA);
  const bIsDiscrete = hasDiscreteDomain(typeB);
  return aIsDiscrete === bIsDiscrete;
}

export function assembleLegends(model: Model): VgLegend[] {
  const legendComponentIndex = model.component.legends;
  const legendsByGroup: Record<string, LegendEntry[]> = {};

  for (const channel of keys(legendComponentIndex)) {
    //Grouping by the underlying field used by the encoding
    const {field: fieldKey, explicit: fieldExplicit} = getFieldKeyForChannel(model, channel);

    //If we still cannot determine the field, fall back to the old domain-hash grouping
    //Include channel only when we don't have a field, or when the field is inferred (to avoid cross-channel merges on derived fields)
    let groupKey: string;
    if (fieldKey) {
      groupKey = fieldExplicit ? `field:${fieldKey}` : `field:${fieldKey}:${channel}`;
    } else {
      const scaleComponent = model.getScaleComponent(channel);
      if (scaleComponent) {
        const domainHash = stringify(scaleComponent.get('domains'));
        groupKey = `domain:${domainHash}:${channel}`;
      } else {
        groupKey = `noscale:${String(channel)}`;
      }
    }

    if (!legendsByGroup[groupKey]) {
      legendsByGroup[groupKey] = [{channel, cmpt: legendComponentIndex[channel].clone()}];
      continue;
    }

    // Within the same field group, attempt to merge legends. If merge fails, keep separate.
    let mergedIntoExisting = false;
    for (const existing of legendsByGroup[groupKey]) {
      if (!legendsAreMergeCompatible(model, existing.channel, channel)) {
        continue;
      }
      const merged = mergeLegendComponent(existing.cmpt, legendComponentIndex[channel]);
      if (merged) {
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
