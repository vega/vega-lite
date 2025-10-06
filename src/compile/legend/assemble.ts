import {Legend as VgLegend, LegendEncode} from 'vega';
import {Config} from '../../config.js';
import {LEGEND_SCALE_CHANNELS} from '../../legend.js';
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

function getFieldKeyForChannel(model: Model, channel: any): string | undefined {
  if (isUnitModel(model)) {
    return model.fieldDef(channel as any)?.field;
  }

  // Try to infer from children; only use if all non-empty child results agree
  const childFields = (model.children ?? [])
    .map((child) => {
      const direct = getFieldKeyForChannel(child, channel);
      if (direct) return direct;
      const scales = (child as any).component?.scales;
      const sc = scales ? (scales as any)[channel] : undefined;
      if (!sc) return undefined;
      const domains = sc.get('domains');
      return getFieldFromNonUnionDomains(domains);
    })
    .filter((f): f is string => !!f);

  if (childFields.length > 0) {
    const unique = Array.from(new Set(childFields));
    if (unique.length === 1) {
      return unique[0];
    }
    return undefined;
  }

  // Fallback: infer from this model's local scale domains
  const owner = findModelWithLocalScale(model, channel as any);
  if (owner) {
    const scales = (owner as any).component?.scales;
    const sc = scales ? (scales as any)[channel] : undefined;
    if (sc) {
      return getFieldFromNonUnionDomains(sc.get('domains'));
    }
  }
  return undefined;
}

export function assembleLegends(model: Model): VgLegend[] {
  const legendComponentIndex = model.component.legends;
  const legendsByGroup: Record<string, LegendComponent[]> = {};

  for (const channel of keys(legendComponentIndex)) {
    //Grouping by the underlying field used by the encoding
    const fieldKey = getFieldKeyForChannel(model, channel);

    //If we still cannot determine the field, fall back to the old domain-hash grouping
    let groupKey: string;
    if (fieldKey) {
      groupKey = `field:${fieldKey}`;
    } else {
      const scaleComponent = model.getScaleComponent(channel);
      if (scaleComponent) {
        const domainHash = stringify(scaleComponent.get('domains'));
        groupKey = `domain:${domainHash}`;
      } else {
        groupKey = `noscale:${String(channel)}`;
      }
    }

    if (!legendsByGroup[groupKey]) {
      legendsByGroup[groupKey] = [legendComponentIndex[channel].clone()];
      continue;
    }

    // Within the same field group, attempt to merge legends. If merge fails, keep separate.
    let mergedIntoExisting = false;
    for (const existing of legendsByGroup[groupKey]) {
      const merged = mergeLegendComponent(existing, legendComponentIndex[channel]);
      if (merged) {
        mergedIntoExisting = true;
        break;
      }
    }
    if (!mergedIntoExisting) {
      legendsByGroup[groupKey].push(legendComponentIndex[channel].clone());
    }
  }

  const legends = vals(legendsByGroup)
    .flat()
    .map((l) => assembleLegend(l, model.config))
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
