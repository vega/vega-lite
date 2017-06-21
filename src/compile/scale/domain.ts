import {SHARED_DOMAIN_OP_INDEX} from '../../aggregate';
import {binToString} from '../../bin';
import {Channel, isScaleChannel, ScaleChannel} from '../../channel';
import {MAIN, RAW} from '../../data';
import {DateTime, dateTimeExpr, isDateTime} from '../../datetime';
import {FieldDef} from '../../fielddef';
import * as log from '../../log';
import {Domain, hasDiscreteDomain, isBinScale, isSelectionDomain, Scale, ScaleConfig, ScaleType} from '../../scale';
import {isSortField} from '../../sort';
import * as util from '../../util';
import {keys} from '../../util';
import {VgSignalRef} from '../../vega.schema';
import {
  FieldRefUnionDomain,
  isDataRefDomain,
  isDataRefUnionedDomain,
  isFieldRefUnionDomain,
  isSignalRefDomain,
  VgDataRef,
  VgDomain,
  VgSortField
} from '../../vega.schema';
import {FACET_SCALE_PREFIX} from '../data/assemble';
import {FacetModel} from '../facet';
import {Model} from '../model';
import {SELECTION_DOMAIN} from '../selection/selection';
import {UnitModel} from '../unit';
import {ScaleComponentIndex} from './component';

export function parseScaleDomain(model: Model) {
  if (model instanceof UnitModel) {
    parseUnitScaleDomain(model);
  } else {
    parseNonUnitScaleDomain(model);
  }
}

function parseUnitScaleDomain(model: UnitModel) {
  const scales = model.specifiedScales;
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  keys(localScaleComponents).forEach((channel: ScaleChannel) => {
    const specifiedScale = scales[channel];
    const specifiedDomain = specifiedScale ? specifiedScale.domain : undefined;

    const hasSpecifiedDomain = specifiedDomain && !isSelectionDomain(specifiedDomain);

    const domain = parseDomainForChannel(model, channel);
    const localScaleCmpt = localScaleComponents[channel];
    localScaleCmpt.set('domain', domain, hasSpecifiedDomain);

    if (isSelectionDomain(specifiedDomain)) {
      // As scale parsing occurs before selection parsing, we use a temporary
      // signal here and append the scale.domain definition. This is replaced
      // with the correct domainRaw signal during scale assembly.
      // For more information, see isRawSelectionDomain in selection.ts.

      // FIXME: replace this with a special property in the scaleComponent
      localScaleCmpt.set('domainRaw', {
        signal: SELECTION_DOMAIN + JSON.stringify(specifiedDomain)
      }, true);
    }
  });
}

function parseNonUnitScaleDomain(model: Model) {
  for (const child of model.children) {
    parseScaleDomain(child);
  }

  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  keys(localScaleComponents).forEach((channel: ScaleChannel) => {
    // FIXME: Arvind -- Please revise logic for merging selectionDomain / domainRaw

    let domain: VgDomain;

    for (const child of model.children) {
      const childComponent = child.component.scales[channel];
      if (childComponent) {
        const childDomain = childComponent.get('domain');
        if (domain === undefined) {
          domain = childDomain;
        } else {
          domain = unionDomains(domain, childDomain);
        }
      }
    }

    if (model instanceof FacetModel) {
      // Replace the scale domain with data output from a cloned subtree after the facet.
      if (isDataRefDomain(domain) || isFieldRefUnionDomain(domain)) {
        domain.data = FACET_SCALE_PREFIX + model.getName(domain.data);
      } else if (isDataRefUnionedDomain(domain)) {
        domain.fields = domain.fields.map((f: VgDataRef) => {
          return {
            ...f,
            data: FACET_SCALE_PREFIX + model.getName(f.data)
          };
        });
      }
    }

    localScaleComponents[channel].set('domain', domain, true);
  });
}


/**
 * Remove unaggregated domain if it is not applicable
 * Add unaggregated domain if domain is not specified and config.scale.useUnaggregatedDomain is true.
 */
function normalizeUnaggregatedDomain(domain: Domain, fieldDef: FieldDef<string>, scaleType: ScaleType, scaleConfig: ScaleConfig) {
  if (domain === 'unaggregated') {
    const {valid, reason} = canUseUnaggregatedDomain(fieldDef, scaleType);
    if(!valid) {
      log.warn(reason);
      return undefined;
    }
  } else if (domain === undefined && scaleConfig.useUnaggregatedDomain) {
    // Apply config if domain is not specified.
    const {valid} = canUseUnaggregatedDomain(fieldDef, scaleType);
    if (valid) {
      return 'unaggregated';
    }
  }

  return domain;
}

// FIXME: Domoritz --  please change this to return VgDomain[] and union one at the end in assemble
export function parseDomainForChannel(model: UnitModel, channel: ScaleChannel): VgDomain {
  const scaleType = model.getScaleComponent(channel).get('type');

  const domain = normalizeUnaggregatedDomain(model.scaleDomain(channel), model.fieldDef(channel), scaleType, model.config.scale);
  if (domain !== model.scaleDomain(channel)) {
    model.specifiedScales[channel] = {
      ...model.specifiedScales[channel],
      domain
    };
  }

  // If channel is either X or Y then union them with X2 & Y2 if they exist
  if (channel === 'x' && model.channelHasField('x2')) {
    if (model.channelHasField('x')) {
      return unionDomains(parseSingleChannelDomain(scaleType, domain, model, 'x'), parseSingleChannelDomain(scaleType, domain, model, 'x2'));
    } else {
      return parseSingleChannelDomain(scaleType, domain, model, 'x2');
    }
  } else if (channel === 'y' && model.channelHasField('y2')) {
    if (model.channelHasField('y')) {
      return unionDomains(parseSingleChannelDomain(scaleType, domain, model, 'y'), parseSingleChannelDomain(scaleType, domain, model, 'y2'));
    } else {
      return parseSingleChannelDomain(scaleType, domain, model, 'y2');
    }
  }
  return parseSingleChannelDomain(scaleType, domain, model, channel);
}

function parseSingleChannelDomain(scaleType: ScaleType, domain: Domain, model: UnitModel, channel: ScaleChannel | 'x2' | 'y2'): VgDomain {
  const fieldDef = model.fieldDef(channel);

  if (domain && domain !== 'unaggregated' && !isSelectionDomain(domain)) { // explicit value
    if (fieldDef.bin) {
      log.warn(log.message.conflictedDomain(channel));
    } else {
      if (isDateTime(domain[0])) {
        return (domain as DateTime[]).map((dt) => {
          return {signal: dateTimeExpr(dt, true)};
        });
      }
      return domain;
    }
  }

  const stack = model.stack;
  if (stack && channel === stack.fieldChannel) {
    if(stack.offset === 'normalize') {
      return [0, 1];
    }
    return {
      data: model.requestDataName(MAIN),
      fields: [
        model.field(channel, {suffix: 'start'}),
        model.field(channel, {suffix: 'end'})
      ]
    };
  }

  const sort = isScaleChannel(channel) ? domainSort(model, channel, scaleType) : undefined;

  if (domain === 'unaggregated') {
    return {
      data: model.requestDataName(MAIN),
      fields: [
        model.field(channel, {aggregate: 'min'}),
        model.field(channel, {aggregate: 'max'})
      ]
    };
  } else if (fieldDef.bin) { // bin
    if (isBinScale(scaleType)) {
      const signal = model.getName(`${binToString(fieldDef.bin)}_${fieldDef.field}_bins`);
      return {signal: `sequence(${signal}.start, ${signal}.stop + ${signal}.step, ${signal}.step)`};
    }

    if (hasDiscreteDomain(scaleType)) {
      // ordinal bin scale takes domain from bin_range, ordered by bin_start
      // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
      return {
        data: model.requestDataName(MAIN),
        field: model.field(channel, {binSuffix: 'range'}),
        sort: {
          field: model.field(channel, {binSuffix: 'start'}),
          op: 'min' // min or max doesn't matter since same _range would have the same _start
        }
      };
    } else { // continuous scales
      if (channel === 'x' || channel === 'y') {
        // X/Y position have to include start and end for non-ordinal scale
        return {
          data: model.requestDataName(MAIN),
          fields: [
            model.field(channel, {binSuffix: 'start'}),
            model.field(channel, {binSuffix: 'end'})
          ]
        };
      } else {
        // TODO: use bin_mid
        return {
          data: model.requestDataName(MAIN),
          field: model.field(channel, {binSuffix: 'start'})
        };
      }
    }
  } else if (sort) {
    return {
      // If sort by aggregation of a specified sort field, we need to use RAW table,
      // so we can aggregate values for the scale independently from the main aggregation.
      data: util.isBoolean(sort) ? model.requestDataName(MAIN) : model.requestDataName(RAW),
      field: model.field(channel),
      sort: sort
    };
  } else {
    return {
      data: model.requestDataName(MAIN),
      field: model.field(channel)
    };
  }
}


export function domainSort(model: UnitModel, channel: ScaleChannel, scaleType: ScaleType): VgSortField {
  if (!hasDiscreteDomain(scaleType)) {
    return undefined;
  }

  const sort = model.sort(channel);

  // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
  if (isSortField(sort)) {
    return sort;
  }

  if (sort === 'descending') {
    return {
      op: 'min',
      field: model.field(channel),
      order: 'descending'
    };
  }

  if (util.contains(['ascending', undefined /* default =ascending*/], sort)) {
    return true;
  }

  // sort === 'none'
  return undefined;
}



/**
 * Determine if a scale can use unaggregated domain.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `scale.domain` is `unaggregated`
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
export function canUseUnaggregatedDomain(fieldDef: FieldDef<string>, scaleType: ScaleType): {valid: boolean, reason?: string} {
  if (!fieldDef.aggregate) {
    return {
      valid: false,
      reason: log.message.unaggregateDomainHasNoEffectForRawField(fieldDef)
    };
  }

  if (!SHARED_DOMAIN_OP_INDEX[fieldDef.aggregate]) {
    return {
      valid: false,
      reason: log.message.unaggregateDomainWithNonSharedDomainOp(fieldDef.aggregate)
    };
  }

  if (fieldDef.type === 'quantitative') {
    if (scaleType === 'log') {
      return {
        valid: false,
        reason: log.message.unaggregatedDomainWithLogScale(fieldDef)
      };
    }
  }

  return {valid: true};
}

/**
 * Convert the domain to an array of data refs or an array of values. Also, throw
 * away sorting information since we always sort the domain when we union two domains.
 */
function normalizeDomain(domain: VgDomain): (any[] | VgDataRef | VgSignalRef)[] {
  if (util.isArray(domain)) {
    return [domain];
  } else if (isSignalRefDomain(domain)) {
    return [domain];
  } else if (isDataRefDomain(domain)) {
    delete domain.sort;
    return [domain];
  } else if(isFieldRefUnionDomain(domain)) {
    return domain.fields.map(d => {
      return {
        data: domain.data,
        field: d
      };
    });
  } else if (isDataRefUnionedDomain(domain)) {
    return domain.fields;
  }
  /* istanbul ignore next: This should never happen. */
  throw new Error(log.message.INVAID_DOMAIN);
}

/**
 * Union two data domains. A unioned domain is always sorted.
 */
export function unionDomains(domain1: VgDomain, domain2: VgDomain): VgDomain {
  const normalizedDomain1 = normalizeDomain(domain1);
  const normalizedDomain2 = normalizeDomain(domain2);

  let domains = normalizedDomain1.concat(normalizedDomain2);
  domains = util.unique(domains, util.hash);

  if (domains.length > 1) {
    const allData = domains.map(d => {
      if (isDataRefDomain(d)) {
        return d.data;
      }
      return null;
    });

    if (util.unique(allData, x => x).length === 1 && allData[0] !== null) {
      // create a union domain of different fields with a single data source
      const domain: FieldRefUnionDomain = {
        data: allData[0],
        fields: domains.map(d => (d as VgDataRef).field)
      };
      return domain;
    }

    return {fields: domains, sort: true};
  } else {
    return domains[0];
  }
}
