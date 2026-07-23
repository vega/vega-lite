import type {SignalRef} from 'vega';
import {hasOwnProperty, isObject, isString} from 'vega-util';
import {
  Aggregate,
  isAggregateOp,
  isArgmaxDef,
  isArgminDef,
  NonArgAggregateOp,
  SHARED_DOMAIN_OPS,
  MULTIDOMAIN_SORT_OP_INDEX as UNIONDOMAIN_SORT_OP_INDEX,
} from '../../aggregate.js';
import {isBinning, isBinParams, isParameterExtent} from '../../bin.js';
import {getScaleChannelForKey, getSecondaryRangeChannel, isXorY, ScaleKey} from '../../channel.js';
import {
  binRequiresRange,
  getBandPosition,
  getFieldOrDatumDef,
  hasBandEnd,
  isDatumDef,
  isFieldDef,
  ScaleDatumDef,
  ScaleFieldDef,
  TypedFieldDef,
  valueExpr,
  vgField,
} from '../../channeldef.js';
import {CompositeAggregate} from '../../compositemark/index.js';
import {DataSourceType} from '../../data.js';
import {DateTime} from '../../datetime.js';
import {ExprRef} from '../../expr.js';
import * as log from '../../log/index.js';
import {isPathMark, isRectBasedMark} from '../../mark.js';
import {Domain, hasDiscreteDomain, isDomainUnionWith, isParameterDomain, ScaleConfig, ScaleType} from '../../scale.js';
import {ParameterExtent} from '../../selection.js';
import {DEFAULT_SORT_OP, EncodingSortField, isSortArray, isSortByEncoding, isSortField} from '../../sort.js';
import {normalizeTimeUnit, TimeUnit, TimeUnitTransformParams} from '../../timeunit.js';
import {Type} from '../../type.js';
import * as util from '../../util.js';
import {
  isDataRefDomain,
  isDataRefUnionedDomain,
  isFieldRefUnionDomain,
  isSignalRef,
  VgDomain,
  VgMultiFieldsRefWithSort,
  VgNonUnionDomain,
  VgScaleDataRefWithSort,
  VgSortField,
  VgUnionSortField,
} from '../../vega.schema.js';
import {getMarkConfig} from '../common.js';
import {getBinSignalName} from '../data/bin.js';
import {sortArrayIndexField} from '../data/calculate.js';
import {FACET_SCALE_PREFIX} from '../data/optimize.js';
import {OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX} from '../data/timeunit.js';
import {getScaleDataSourceForHandlingInvalidValues} from '../invalid/datasources.js';
import {isFacetModel, isUnitModel, Model} from '../model.js';
import {SignalRefWrapper} from '../signal.js';
import {Explicit, makeExplicit, makeImplicit, mergeValuesWithExplicit} from '../split.js';
import {UnitModel} from '../unit.js';
import {ScaleComponent, ScaleComponentIndex} from './component.js';

export function parseScaleDomain(model: Model) {
  if (isUnitModel(model)) {
    parseUnitScaleDomain(model);
  } else {
    parseNonUnitScaleDomain(model);
  }
}

function parseUnitScaleDomain(model: UnitModel) {
  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  for (const key of util.keys(localScaleComponents) as ScaleKey[]) {
    const channel = getScaleChannelForKey(key);
    const domains = parseDomainForChannel(model, key);
    const localScaleCmpt = localScaleComponents[key];
    localScaleCmpt.setWithExplicit('domains', domains);
    parseSelectionDomain(model, key);

    if (model.component.data.isFaceted) {
      // get resolve from closest facet parent as this decides whether we need to refer to cloned subtree or not
      let facetParent: Model = model;
      while (!isFacetModel(facetParent) && facetParent.parent) {
        facetParent = facetParent.parent;
      }

      const resolve = facetParent.component.resolve.scale[channel];

      if (resolve === 'shared') {
        for (const domain of domains.value) {
          // Replace the scale domain with data output from a cloned subtree after the facet.
          if (isDataRefDomain(domain)) {
            // use data from cloned subtree (which is the same as data but with a prefix added once)
            domain.data = FACET_SCALE_PREFIX + domain.data.replace(FACET_SCALE_PREFIX, '');
          }
        }
      }
    }
  }
}

function parseNonUnitScaleDomain(model: Model) {
  for (const child of model.children) {
    parseScaleDomain(child);
  }

  const localScaleComponents: ScaleComponentIndex = model.component.scales;

  for (const channel of util.keys(localScaleComponents) as ScaleKey[]) {
    let domains: Explicit<VgNonUnionDomain[]>;
    let selectionExtent: ParameterExtent = null;

    for (const child of model.children) {
      const childComponent = child.component.scales[channel];
      if (childComponent) {
        if (domains === undefined) {
          domains = childComponent.getWithExplicit('domains');
        } else {
          domains = mergeValuesWithExplicit(
            domains,
            childComponent.getWithExplicit('domains'),
            'domains',
            'scale',
            domainsTieBreaker,
          );
        }

        const se = childComponent.get('selectionExtent');
        if (selectionExtent && se && selectionExtent.param !== se.param) {
          log.warn(log.message.NEEDS_SAME_SELECTION);
        }
        selectionExtent = se;
      }
    }

    localScaleComponents[channel].setWithExplicit('domains', domains);

    if (selectionExtent) {
      localScaleComponents[channel].set('selectionExtent', selectionExtent, true);
    }
  }
}

/**
 * Remove unaggregated domain if it is not applicable
 * Add unaggregated domain if domain is not specified and config.scale.useUnaggregatedDomain is true.
 */
function normalizeUnaggregatedDomain(
  domain: Domain,
  fieldDef: TypedFieldDef<string>,
  scaleType: ScaleType,
  scaleConfig: ScaleConfig<SignalRef>,
) {
  if (domain === 'unaggregated') {
    const {valid, reason} = canUseUnaggregatedDomain(fieldDef, scaleType);
    if (!valid) {
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

export function parseDomainForChannel(model: UnitModel, key: ScaleKey): Explicit<VgNonUnionDomain[]> {
  const channel = getScaleChannelForKey(key);
  const scaleType = model.getScaleComponent(key).get('type');
  const {encoding} = model;
  const fieldDef = model.scaleDef(key) as TypedFieldDef<string>;

  const domain = normalizeUnaggregatedDomain(
    model.specifiedScale(key)?.domain,
    fieldDef,
    scaleType,
    model.config.scale,
  );
  if (domain !== model.specifiedScale(key)?.domain) {
    model.specifiedScales[key] = {
      ...model.specifiedScales[key],
      domain,
    };
  }

  // If channel is either X or Y then union them with X2 & Y2 if they exist
  if (channel === 'x' && getFieldOrDatumDef(encoding.x2)) {
    if (getFieldOrDatumDef(encoding.x)) {
      return mergeValuesWithExplicit(
        parseSingleChannelDomain(scaleType, domain, model, 'x'),
        parseSingleChannelDomain(scaleType, domain, model, 'x2'),
        'domain',
        'scale',
        domainsTieBreaker,
      );
    } else {
      return parseSingleChannelDomain(scaleType, domain, model, 'x2');
    }
  } else if (channel === 'y' && getFieldOrDatumDef(encoding.y2)) {
    if (getFieldOrDatumDef(encoding.y)) {
      return mergeValuesWithExplicit(
        parseSingleChannelDomain(scaleType, domain, model, 'y'),
        parseSingleChannelDomain(scaleType, domain, model, 'y2'),
        'domain',
        'scale',
        domainsTieBreaker,
      );
    } else {
      return parseSingleChannelDomain(scaleType, domain, model, 'y2');
    }
  }
  return parseSingleChannelDomain(scaleType, domain, model, key);
}

function mapDomainToDataSignal(
  domain: (number | string | boolean | DateTime | ExprRef | SignalRef | number[])[],
  type: Type,
  timeUnit: TimeUnit,
) {
  return domain.map((v) => {
    const data = valueExpr(v, {timeUnit, type});
    return {signal: `{data: ${data}}`};
  });
}

function convertDomainIfItIsDateTime(
  domain: (number | string | boolean | DateTime | ExprRef | SignalRef | number[])[],
  type: Type,
  timeUnit: TimeUnit | TimeUnitTransformParams,
): [number[]] | [string[]] | [boolean[]] | SignalRef[] {
  // explicit value
  const normalizedTimeUnit = normalizeTimeUnit(timeUnit)?.unit;
  if (type === 'temporal' || normalizedTimeUnit) {
    return mapDomainToDataSignal(domain, type, normalizedTimeUnit);
  }

  return [domain] as [number[]] | [string[]] | [boolean[]]; // Date time won't make sense
}

function parseSingleChannelDomain(
  scaleType: ScaleType,
  domain: Domain,
  model: UnitModel,
  channel: ScaleKey | 'x2' | 'y2',
): Explicit<VgNonUnionDomain[]> {
  const {encoding, markDef, mark, config, stack} = model;
  const scaleChannel = channel === 'x2' || channel === 'y2' ? channel : getScaleChannelForKey(channel);
  const fieldOrDatumDef = (
    channel === 'x2' || channel === 'y2' ? getFieldOrDatumDef(encoding[channel]) : model.scaleDef(channel)
  ) as ScaleDatumDef<string> | ScaleFieldDef<string>;

  const {type} = fieldOrDatumDef;
  const timeUnit = (fieldOrDatumDef as any)['timeUnit'];

  const dataSourceTypeForScaleDomain = getScaleDataSourceForHandlingInvalidValues({
    invalid: getMarkConfig('invalid', markDef, config),
    isPath: isPathMark(mark),
  });

  if (isDomainUnionWith(domain)) {
    const defaultDomain = parseSingleChannelDomain(scaleType, undefined, model, channel);

    const unionWith = convertDomainIfItIsDateTime(domain.unionWith, type, timeUnit);

    return makeExplicit([...unionWith, ...defaultDomain.value]);
  } else if (isSignalRef(domain)) {
    return makeExplicit([domain]);
  } else if (domain && domain !== 'unaggregated' && !isParameterDomain(domain)) {
    return makeExplicit(convertDomainIfItIsDateTime(domain, type, timeUnit));
  }

  if (stack && scaleChannel === stack.fieldChannel) {
    if (stack.offset === 'normalize') {
      return makeImplicit([[0, 1]]);
    }

    const data = model.requestDataName(dataSourceTypeForScaleDomain);
    return makeImplicit([
      {
        data,
        field: vgField(fieldOrDatumDef as ScaleFieldDef<string>, {suffix: 'start'}),
      },
      {
        data,
        field: vgField(fieldOrDatumDef as ScaleFieldDef<string>, {suffix: 'end'}),
      },
    ]);
  }

  // Secondary channels contribute values to the primary scale domain but inherit its sort.
  const sort: undefined | true | VgSortField =
    channel !== 'x2' && channel !== 'y2' && isFieldDef(fieldOrDatumDef)
      ? domainSort(model, channel as ScaleKey, scaleType)
      : undefined;

  if (isDatumDef(fieldOrDatumDef)) {
    const d = convertDomainIfItIsDateTime([fieldOrDatumDef.datum], type, timeUnit);
    return makeImplicit(d);
  }

  const fieldDef = fieldOrDatumDef; // now we can be sure it's a fieldDef
  if (domain === 'unaggregated') {
    const {field} = fieldOrDatumDef;
    return makeImplicit([
      {
        data: model.requestDataName(dataSourceTypeForScaleDomain),
        field: vgField({field, aggregate: 'min'}),
      },
      {
        data: model.requestDataName(dataSourceTypeForScaleDomain),
        field: vgField({field, aggregate: 'max'}),
      },
    ]);
  } else if (isBinning(fieldDef.bin)) {
    if (hasDiscreteDomain(scaleType)) {
      if (scaleType === 'bin-ordinal') {
        // we can omit the domain as it is inferred from the `bins` property
        return makeImplicit([]);
      }

      // ordinal bin scale takes domain from bin_range, ordered by bin start
      // This is useful for both axis-based scale (x/y) and legend-based scale (other channels).
      return makeImplicit([
        {
          // If sort by aggregation of a specified sort field, we need to use RAW table,
          // so we can aggregate values for the scale independently from the main aggregation.
          data: util.isBoolean(sort)
            ? model.requestDataName(dataSourceTypeForScaleDomain)
            : model.requestDataName(DataSourceType.Raw),
          // Use range if we added it and the scale does not support computing a range as a signal.
          field: vgField(fieldDef, binRequiresRange(fieldDef, scaleChannel) ? {binSuffix: 'range'} : {}),
          // we have to use a sort object if sort = true to make the sort correct by bin start
          sort:
            sort === true || !isObject(sort)
              ? {
                  field: vgField(fieldDef),
                  op: 'min',
                }
              : sort,
        },
      ]);
    } else {
      // continuous scales
      const {bin} = fieldDef;
      if (isBinning(bin)) {
        const binSignal = getBinSignalName(model, fieldDef.field, bin);
        return makeImplicit([
          new SignalRefWrapper(() => {
            const signal = model.getSignalName(binSignal);
            return `[${signal}.start, ${signal}.stop]`;
          }),
        ]);
      } else {
        return makeImplicit([
          {
            data: model.requestDataName(dataSourceTypeForScaleDomain),
            field: vgField(fieldDef),
          },
        ]);
      }
    }
  } else if (fieldDef.timeUnit && util.contains(['time', 'utc'], scaleType)) {
    const fieldDef2 = encoding[getSecondaryRangeChannel(scaleChannel)];

    if (hasBandEnd(fieldDef, fieldDef2, markDef, config)) {
      const data = model.requestDataName(dataSourceTypeForScaleDomain);

      const bandPosition = getBandPosition({fieldDef, fieldDef2, markDef, config});
      const isRectWithOffset = isRectBasedMark(mark) && bandPosition !== 0.5 && isXorY(scaleChannel);
      return makeImplicit([
        {
          data,
          field: vgField(fieldDef, isRectWithOffset ? {suffix: OFFSETTED_RECT_START_SUFFIX} : {}),
        },
        {
          data,
          field: vgField(fieldDef, {suffix: isRectWithOffset ? OFFSETTED_RECT_END_SUFFIX : 'end'}),
        },
      ]);
    }
  }
  if (sort) {
    return makeImplicit([
      {
        // If sort by aggregation of a specified sort field, we need to use RAW table,
        // so we can aggregate values for the scale independently from the main aggregation.
        data: util.isBoolean(sort)
          ? model.requestDataName(dataSourceTypeForScaleDomain)
          : model.requestDataName(DataSourceType.Raw),
        field: vgField(fieldDef),
        sort,
      },
    ]);
  } else {
    return makeImplicit([
      {
        data: model.requestDataName(dataSourceTypeForScaleDomain),
        field: vgField(fieldDef),
      },
    ]);
  }
}

function normalizeSortField(sort: EncodingSortField<string>, isStackedMeasure: boolean): VgSortField {
  const {op, field, order} = sort;
  return {
    // Apply default op
    op: op ?? (isStackedMeasure ? 'sum' : DEFAULT_SORT_OP),
    // flatten nested fields
    ...(field ? {field: util.replacePathInField(field)} : {}),

    ...(order ? {order} : {}),
  };
}

function parseSelectionDomain(model: UnitModel, key: ScaleKey) {
  const scale = model.component.scales[key];
  const spec = model.specifiedScale(key)?.domain;
  const bin = (model.scaleDef(key) as ScaleFieldDef<string>)?.bin;
  const domain = isParameterDomain(spec) ? spec : undefined;
  const extent = isBinParams(bin) && isParameterExtent(bin.extent) ? bin.extent : undefined;

  if (domain || extent) {
    // As scale parsing occurs before selection parsing, we cannot set
    // domainRaw directly. So instead, we store the selectionExtent on
    // the scale component, and then add domainRaw during scale assembly.
    scale.set('selectionExtent', domain ?? extent, true);
  }
}

export function domainSort(model: UnitModel, channel: ScaleKey, scaleType: ScaleType): undefined | true | VgSortField {
  if (!hasDiscreteDomain(scaleType)) {
    return undefined;
  }

  // save to cast as the only exception is the geojson type for shape, which would not generate a scale
  const fieldDef = model.scaleDef(channel) as ScaleFieldDef<string>;
  const sort = fieldDef.sort;

  // if the sort is specified with array, use the derived sort index field
  if (isSortArray(sort)) {
    return {
      op: 'min',
      field: sortArrayIndexField(fieldDef, channel),
      order: 'ascending',
    };
  }

  const {stack} = model;
  const stackDimensions = stack
    ? new Set([...stack.groupbyFields, ...stack.stackBy.map((s) => s.fieldDef.field)])
    : undefined;

  // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
  if (isSortField(sort)) {
    const isStackedMeasure = stack && !stackDimensions.has(sort.field);
    return normalizeSortField(sort, isStackedMeasure);
  } else if (isSortByEncoding(sort)) {
    const {encoding, order} = sort;
    const fieldDefToSortBy = model.fieldDef(encoding);
    const {aggregate, field} = fieldDefToSortBy;

    const isStackedMeasure = stack && !stackDimensions.has(field);

    if (isArgminDef(aggregate) || isArgmaxDef(aggregate)) {
      return normalizeSortField(
        {
          field: vgField(fieldDefToSortBy),
          order,
        },
        isStackedMeasure,
      );
    } else if (isAggregateOp(aggregate) || !aggregate) {
      return normalizeSortField(
        {
          op: aggregate as NonArgAggregateOp, // can't be argmin/argmax since we don't support them in encoding field def
          field,
          order,
        },
        isStackedMeasure,
      );
    }
  } else if (sort === 'descending') {
    return {
      op: 'min',
      field: vgField(fieldDef),
      order: 'descending',
    };
  } else if (util.contains(['ascending', undefined /* default =ascending*/], sort)) {
    return true;
  }

  // sort == null
  return undefined;
}

/**
 * Determine if a scale can use unaggregated domain.
 * @return {Boolean} Returns true if all of the following conditions apply:
 * 1. `scale.domain` is `unaggregated`
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
export function canUseUnaggregatedDomain(
  fieldDef: TypedFieldDef<string>,
  scaleType: ScaleType,
): {valid: boolean; reason?: string} {
  const {aggregate, type} = fieldDef;

  if (!aggregate) {
    return {
      valid: false,
      reason: log.message.unaggregateDomainHasNoEffectForRawField(fieldDef),
    };
  }

  if (isString(aggregate) && !(SHARED_DOMAIN_OPS as Set<Aggregate | CompositeAggregate>).has(aggregate)) {
    return {
      valid: false,
      reason: log.message.unaggregateDomainWithNonSharedDomainOp(aggregate),
    };
  }

  if (type === 'quantitative') {
    if (scaleType === 'log') {
      return {
        valid: false,
        reason: log.message.unaggregatedDomainWithLogScale(fieldDef),
      };
    }
  }

  return {valid: true};
}

/**
 * Tie breaker for mergeValuesWithExplicit for domains. We concat the specified values.
 */
function domainsTieBreaker(
  v1: Explicit<VgNonUnionDomain[]>,
  v2: Explicit<VgNonUnionDomain[]>,
  property: 'domains',
  propertyOf: 'scale',
) {
  if (v1.explicit && v2.explicit) {
    log.warn(log.message.mergeConflictingDomainProperty(property, propertyOf, v1.value, v2.value));
  }
  // If equal score, concat the domains so that we union them later.
  return {explicit: v1.explicit, value: [...v1.value, ...v2.value]};
}

/**
 * Converts an array of domains to a single Vega scale domain.
 */
export function mergeDomains(domains: VgNonUnionDomain[]): VgDomain {
  const uniqueDomains = util.unique(
    domains.map((domain) => {
      // ignore sort property when computing the unique domains
      if (isDataRefDomain(domain)) {
        const {sort: _s, ...domainWithoutSort} = domain;
        return domainWithoutSort;
      }
      return domain;
    }),
    util.hash,
  );

  const sorts: VgSortField[] = util.unique(
    domains
      .map((d) => {
        if (isDataRefDomain(d)) {
          const s = d.sort;
          if (s !== undefined && !util.isBoolean(s)) {
            if ('op' in s && s.op === 'count') {
              // let's make sure that if op is count, we don't use a field
              delete s.field;
            }
            if (s.order === 'ascending') {
              // drop order: ascending as it is the default
              delete s.order;
            }
          }
          return s;
        }
        return undefined;
      })
      .filter((s) => s !== undefined),
    util.hash,
  );

  if (uniqueDomains.length === 0) {
    return undefined;
  } else if (uniqueDomains.length === 1) {
    const domain = domains[0];
    if (isDataRefDomain(domain) && sorts.length > 0) {
      let sort = sorts[0];
      if (sorts.length > 1) {
        log.warn(log.message.MORE_THAN_ONE_SORT);
        // Get sorts with non-default ops
        const filteredSorts = sorts.filter((s) => isObject(s) && 'op' in s && s.op !== 'min');
        if (sorts.every((s) => isObject(s) && 'op' in s) && filteredSorts.length === 1) {
          sort = filteredSorts[0];
        } else {
          sort = true;
        }
      } else {
        // Simplify domain sort by removing field and op when the field is the same as the domain field.
        if (isObject(sort) && 'field' in sort) {
          const sortField = sort.field;
          if (domain.field === sortField) {
            sort = sort.order ? {order: sort.order} : true;
          }
        }
      }
      return {
        ...domain,
        sort,
      };
    }
    return domain;
  }

  // only keep sort properties that work with unioned domains
  const unionDomainSorts = util.unique<VgUnionSortField>(
    sorts.map((s) => {
      if (util.isBoolean(s) || !('op' in s) || (isString(s.op) && hasOwnProperty(UNIONDOMAIN_SORT_OP_INDEX, s.op))) {
        return s as VgUnionSortField;
      }
      log.warn(log.message.domainSortDropped(s));
      return true;
    }),
    util.hash,
  ) as VgUnionSortField[];

  let sort: VgUnionSortField;

  if (unionDomainSorts.length === 1) {
    sort = unionDomainSorts[0];
  } else if (unionDomainSorts.length > 1) {
    log.warn(log.message.MORE_THAN_ONE_SORT);
    sort = true;
  }

  const allData = util.unique(
    domains.map((d) => {
      if (isDataRefDomain(d)) {
        return d.data;
      }
      return null;
    }),
    (x) => x,
  );

  if (allData.length === 1 && allData[0] !== null) {
    // create a union domain of different fields with a single data source
    const domain: VgMultiFieldsRefWithSort = {
      data: allData[0],
      fields: uniqueDomains.map((d) => (d as VgScaleDataRefWithSort).field),
      ...(sort ? {sort} : {}),
    };

    return domain;
  }

  return {fields: uniqueDomains, ...(sort ? {sort} : {})};
}

/**
 * Return a field if a scale uses a single field.
 * Return `undefined` otherwise.
 */
export function getFieldFromDomain(domain: VgDomain): string {
  if (isDataRefDomain(domain) && isString(domain.field)) {
    return domain.field;
  } else if (isDataRefUnionedDomain(domain)) {
    let field;
    for (const nonUnionDomain of domain.fields) {
      if (isDataRefDomain(nonUnionDomain) && isString(nonUnionDomain.field)) {
        if (!field) {
          field = nonUnionDomain.field;
        } else if (field !== nonUnionDomain.field) {
          log.warn(log.message.FACETED_INDEPENDENT_DIFFERENT_SOURCES);
          return field;
        }
      }
    }
    log.warn(log.message.FACETED_INDEPENDENT_SAME_FIELDS_DIFFERENT_SOURCES);
    return field;
  } else if (isFieldRefUnionDomain(domain)) {
    log.warn(log.message.FACETED_INDEPENDENT_SAME_SOURCE);
    const field = domain.fields[0];
    return isString(field) ? field : undefined;
  }

  return undefined;
}

export function assembleDomain(model: Model, channel: ScaleKey) {
  const scaleComponent: ScaleComponent = model.component.scales[channel];

  const domains = scaleComponent.get('domains').map((domain: VgNonUnionDomain) => {
    // Correct references to data as the original domain's data was determined
    // in parseScale, which happens before parseData. Thus the original data
    // reference can be incorrect.
    if (isDataRefDomain(domain)) {
      domain.data = model.lookupDataSource(domain.data);
    }

    return domain;
  });

  // domains is an array that has to be merged into a single vega domain
  return mergeDomains(domains);
}
