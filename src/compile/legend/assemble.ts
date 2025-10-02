import {Legend as VgLegend, LegendEncode} from 'vega';
import {isString} from 'vega-util';
import {NonPositionScaleChannel} from '../../channel.js';
import {Config} from '../../config.js';
import {LEGEND_SCALE_CHANNELS} from '../../legend.js';
import {keys, replaceAll, stringify, vals} from '../../util.js';
import {isDataRefDomain, isSignalRef, VgEncodeChannel, VgNonUnionDomain, VgValueRef} from '../../vega.schema.js';
import {Model} from '../model.js';
import {ScaleComponent} from '../scale/component.js';
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

/**
 * Extracts a field name from scale domains if they reference data.
 * Returns the field name or undefined if the domains don't reference a single field.
 */
function getFieldFromDomains(domains: VgNonUnionDomain[]): string | undefined {
  // Check if all domains reference the same field
  let field: string | undefined;
  for (const domain of domains) {
    if (isDataRefDomain(domain) && isString(domain.field)) {
      if (field === undefined) {
        field = domain.field;
      } else if (field !== domain.field) {
        // Different fields referenced, cannot determine a single field
        return undefined;
      }
    }
  }
  return field;
}

/**
 * Creates a grouping key for legends based on their domains.
 * Legends that encode the same field should be grouped together even if
 * one has an explicit domain and another has a data-reference domain.
 */
function getDomainGroupingKey(
  channel: NonPositionScaleChannel,
  scaleComponent: ScaleComponent,
  allScaleComponents: Partial<Record<NonPositionScaleChannel, ScaleComponent>>,
): string {
  const domains = scaleComponent.get('domains');
  const field = getFieldFromDomains(domains);

  console.log("fields: ", field)

  // If this scale references a field, use the field name as part of the grouping key
  // This allows scales with explicit domains to merge with scales that have data-reference domains
  if (field) {
    // Check if any other scale also references the same field
    // If so, they should be grouped together regardless of domain representation
    for (const otherChannel of keys(allScaleComponents)) {
      if (otherChannel !== channel) {
        const otherDomains = allScaleComponents[otherChannel].get('domains');
        const otherField = getFieldFromDomains(otherDomains);
        if (otherField === field) {
          // Use the field name as the grouping key so both scales are grouped together
          return `field:${field}`;
        }
      }
    }
  }

  console.log("no field match is found")
  // Fall back to the domain hash if no field match is found
  // return `domain:${stringify(domains)}`;
}

export function assembleLegends(model: Model): VgLegend[] {
  const legendComponentIndex = model.component.legends;
  const legendByDomain: Record<string, LegendComponent[]> = {};

  for (const channel of keys(legendComponentIndex)) {
    const scaleComponent = model.getScaleComponent(channel);
    const domainKey = getDomainGroupingKey(channel, scaleComponent, model.component.scales);

    if (legendByDomain[domainKey]) {
      for (const mergedLegendComponent of legendByDomain[domainKey]) {
        const merged = mergeLegendComponent(mergedLegendComponent, legendComponentIndex[channel]);
        // if (!merged) {
        //   // If cannot merge, need to add this legend separately
        //   legendByDomain[domainKey].push(legendComponentIndex[channel]);
        // }
      }
    } else {
      legendByDomain[domainKey] = [legendComponentIndex[channel].clone()];
    }
  }

  const legends = vals(legendByDomain)
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
