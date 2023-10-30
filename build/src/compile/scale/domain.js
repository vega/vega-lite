import { isObject, isString } from 'vega-util';
import { isAggregateOp, isArgmaxDef, isArgminDef, MULTIDOMAIN_SORT_OP_INDEX as UNIONDOMAIN_SORT_OP_INDEX, SHARED_DOMAIN_OPS } from '../../aggregate';
import { isBinning, isBinParams, isParameterExtent } from '../../bin';
import { getSecondaryRangeChannel, isScaleChannel } from '../../channel';
import { binRequiresRange, getBandPosition, getFieldOrDatumDef, hasBandEnd, isDatumDef, isFieldDef, valueExpr, vgField } from '../../channeldef';
import { DataSourceType } from '../../data';
import * as log from '../../log';
import { hasDiscreteDomain, isDomainUnionWith, isParameterDomain } from '../../scale';
import { DEFAULT_SORT_OP, isSortArray, isSortByEncoding, isSortField } from '../../sort';
import { normalizeTimeUnit } from '../../timeunit';
import * as util from '../../util';
import { isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain, isSignalRef } from '../../vega.schema';
import { getBinSignalName } from '../data/bin';
import { sortArrayIndexField } from '../data/calculate';
import { FACET_SCALE_PREFIX } from '../data/optimize';
import { isFacetModel, isUnitModel } from '../model';
import { SignalRefWrapper } from '../signal';
import { makeExplicit, makeImplicit, mergeValuesWithExplicit } from '../split';
import { isRectBasedMark } from '../../mark';
import { OFFSETTED_RECT_END_SUFFIX, OFFSETTED_RECT_START_SUFFIX } from '../data/timeunit';
export function parseScaleDomain(model) {
    if (isUnitModel(model)) {
        parseUnitScaleDomain(model);
    }
    else {
        parseNonUnitScaleDomain(model);
    }
}
function parseUnitScaleDomain(model) {
    const localScaleComponents = model.component.scales;
    for (const channel of util.keys(localScaleComponents)) {
        const domains = parseDomainForChannel(model, channel);
        const localScaleCmpt = localScaleComponents[channel];
        localScaleCmpt.setWithExplicit('domains', domains);
        parseSelectionDomain(model, channel);
        if (model.component.data.isFaceted) {
            // get resolve from closest facet parent as this decides whether we need to refer to cloned subtree or not
            let facetParent = model;
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
function parseNonUnitScaleDomain(model) {
    for (const child of model.children) {
        parseScaleDomain(child);
    }
    const localScaleComponents = model.component.scales;
    for (const channel of util.keys(localScaleComponents)) {
        let domains;
        let selectionExtent = null;
        for (const child of model.children) {
            const childComponent = child.component.scales[channel];
            if (childComponent) {
                if (domains === undefined) {
                    domains = childComponent.getWithExplicit('domains');
                }
                else {
                    domains = mergeValuesWithExplicit(domains, childComponent.getWithExplicit('domains'), 'domains', 'scale', domainsTieBreaker);
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
function normalizeUnaggregatedDomain(domain, fieldDef, scaleType, scaleConfig) {
    if (domain === 'unaggregated') {
        const { valid, reason } = canUseUnaggregatedDomain(fieldDef, scaleType);
        if (!valid) {
            log.warn(reason);
            return undefined;
        }
    }
    else if (domain === undefined && scaleConfig.useUnaggregatedDomain) {
        // Apply config if domain is not specified.
        const { valid } = canUseUnaggregatedDomain(fieldDef, scaleType);
        if (valid) {
            return 'unaggregated';
        }
    }
    return domain;
}
export function parseDomainForChannel(model, channel) {
    const scaleType = model.getScaleComponent(channel).get('type');
    const { encoding } = model;
    const domain = normalizeUnaggregatedDomain(model.scaleDomain(channel), model.typedFieldDef(channel), scaleType, model.config.scale);
    if (domain !== model.scaleDomain(channel)) {
        model.specifiedScales[channel] = {
            ...model.specifiedScales[channel],
            domain
        };
    }
    // If channel is either X or Y then union them with X2 & Y2 if they exist
    if (channel === 'x' && getFieldOrDatumDef(encoding.x2)) {
        if (getFieldOrDatumDef(encoding.x)) {
            return mergeValuesWithExplicit(parseSingleChannelDomain(scaleType, domain, model, 'x'), parseSingleChannelDomain(scaleType, domain, model, 'x2'), 'domain', 'scale', domainsTieBreaker);
        }
        else {
            return parseSingleChannelDomain(scaleType, domain, model, 'x2');
        }
    }
    else if (channel === 'y' && getFieldOrDatumDef(encoding.y2)) {
        if (getFieldOrDatumDef(encoding.y)) {
            return mergeValuesWithExplicit(parseSingleChannelDomain(scaleType, domain, model, 'y'), parseSingleChannelDomain(scaleType, domain, model, 'y2'), 'domain', 'scale', domainsTieBreaker);
        }
        else {
            return parseSingleChannelDomain(scaleType, domain, model, 'y2');
        }
    }
    return parseSingleChannelDomain(scaleType, domain, model, channel);
}
function mapDomainToDataSignal(domain, type, timeUnit) {
    return domain.map(v => {
        const data = valueExpr(v, { timeUnit, type });
        return { signal: `{data: ${data}}` };
    });
}
function convertDomainIfItIsDateTime(domain, type, timeUnit) {
    // explicit value
    const normalizedTimeUnit = normalizeTimeUnit(timeUnit)?.unit;
    if (type === 'temporal' || normalizedTimeUnit) {
        return mapDomainToDataSignal(domain, type, normalizedTimeUnit);
    }
    return [domain]; // Date time won't make sense
}
function parseSingleChannelDomain(scaleType, domain, model, channel) {
    const { encoding, markDef, mark, config, stack } = model;
    const fieldOrDatumDef = getFieldOrDatumDef(encoding[channel]);
    const { type } = fieldOrDatumDef;
    const timeUnit = fieldOrDatumDef['timeUnit'];
    if (isDomainUnionWith(domain)) {
        const defaultDomain = parseSingleChannelDomain(scaleType, undefined, model, channel);
        const unionWith = convertDomainIfItIsDateTime(domain.unionWith, type, timeUnit);
        return makeExplicit([...unionWith, ...defaultDomain.value]);
    }
    else if (isSignalRef(domain)) {
        return makeExplicit([domain]);
    }
    else if (domain && domain !== 'unaggregated' && !isParameterDomain(domain)) {
        return makeExplicit(convertDomainIfItIsDateTime(domain, type, timeUnit));
    }
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return makeImplicit([[0, 1]]);
        }
        const data = model.requestDataName(DataSourceType.Main);
        return makeImplicit([
            {
                data,
                field: model.vgField(channel, { suffix: 'start' })
            },
            {
                data,
                field: model.vgField(channel, { suffix: 'end' })
            }
        ]);
    }
    const sort = isScaleChannel(channel) && isFieldDef(fieldOrDatumDef) ? domainSort(model, channel, scaleType) : undefined;
    if (isDatumDef(fieldOrDatumDef)) {
        const d = convertDomainIfItIsDateTime([fieldOrDatumDef.datum], type, timeUnit);
        return makeImplicit(d);
    }
    const fieldDef = fieldOrDatumDef; // now we can be sure it's a fieldDef
    if (domain === 'unaggregated') {
        const data = model.requestDataName(DataSourceType.Main);
        const { field } = fieldOrDatumDef;
        return makeImplicit([
            {
                data,
                field: vgField({ field, aggregate: 'min' })
            },
            {
                data,
                field: vgField({ field, aggregate: 'max' })
            }
        ]);
    }
    else if (isBinning(fieldDef.bin)) {
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
                        ? model.requestDataName(DataSourceType.Main)
                        : model.requestDataName(DataSourceType.Raw),
                    // Use range if we added it and the scale does not support computing a range as a signal.
                    field: model.vgField(channel, binRequiresRange(fieldDef, channel) ? { binSuffix: 'range' } : {}),
                    // we have to use a sort object if sort = true to make the sort correct by bin start
                    sort: sort === true || !isObject(sort)
                        ? {
                            field: model.vgField(channel, {}),
                            op: 'min' // min or max doesn't matter since we sort by the start of the bin range
                        }
                        : sort
                }
            ]);
        }
        else {
            // continuous scales
            const { bin } = fieldDef;
            if (isBinning(bin)) {
                const binSignal = getBinSignalName(model, fieldDef.field, bin);
                return makeImplicit([
                    new SignalRefWrapper(() => {
                        const signal = model.getSignalName(binSignal);
                        return `[${signal}.start, ${signal}.stop]`;
                    })
                ]);
            }
            else {
                return makeImplicit([
                    {
                        data: model.requestDataName(DataSourceType.Main),
                        field: model.vgField(channel, {})
                    }
                ]);
            }
        }
    }
    else if (fieldDef.timeUnit && util.contains(['time', 'utc'], scaleType)) {
        const fieldDef2 = encoding[getSecondaryRangeChannel(channel)];
        if (hasBandEnd(fieldDef, fieldDef2, markDef, config)) {
            const data = model.requestDataName(DataSourceType.Main);
            const bandPosition = getBandPosition({ fieldDef, fieldDef2, markDef, config });
            const isRectWithOffset = isRectBasedMark(mark) && bandPosition !== 0.5;
            return makeImplicit([
                {
                    data,
                    field: model.vgField(channel, isRectWithOffset ? { suffix: OFFSETTED_RECT_START_SUFFIX } : {})
                },
                {
                    data,
                    field: model.vgField(channel, { suffix: isRectWithOffset ? OFFSETTED_RECT_END_SUFFIX : 'end' })
                }
            ]);
        }
    }
    if (sort) {
        return makeImplicit([
            {
                // If sort by aggregation of a specified sort field, we need to use RAW table,
                // so we can aggregate values for the scale independently from the main aggregation.
                data: util.isBoolean(sort)
                    ? model.requestDataName(DataSourceType.Main)
                    : model.requestDataName(DataSourceType.Raw),
                field: model.vgField(channel),
                sort
            }
        ]);
    }
    else {
        return makeImplicit([
            {
                data: model.requestDataName(DataSourceType.Main),
                field: model.vgField(channel)
            }
        ]);
    }
}
function normalizeSortField(sort, isStackedMeasure) {
    const { op, field, order } = sort;
    return {
        // Apply default op
        op: op ?? (isStackedMeasure ? 'sum' : DEFAULT_SORT_OP),
        // flatten nested fields
        ...(field ? { field: util.replacePathInField(field) } : {}),
        ...(order ? { order } : {})
    };
}
function parseSelectionDomain(model, channel) {
    const scale = model.component.scales[channel];
    const spec = model.specifiedScales[channel].domain;
    const bin = model.fieldDef(channel)?.bin;
    const domain = isParameterDomain(spec) && spec;
    const extent = isBinParams(bin) && isParameterExtent(bin.extent) && bin.extent;
    if (domain || extent) {
        // As scale parsing occurs before selection parsing, we cannot set
        // domainRaw directly. So instead, we store the selectionExtent on
        // the scale component, and then add domainRaw during scale assembly.
        scale.set('selectionExtent', domain ?? extent, true);
    }
}
export function domainSort(model, channel, scaleType) {
    if (!hasDiscreteDomain(scaleType)) {
        return undefined;
    }
    // save to cast as the only exception is the geojson type for shape, which would not generate a scale
    const fieldDef = model.fieldDef(channel);
    const sort = fieldDef.sort;
    // if the sort is specified with array, use the derived sort index field
    if (isSortArray(sort)) {
        return {
            op: 'min',
            field: sortArrayIndexField(fieldDef, channel),
            order: 'ascending'
        };
    }
    const { stack } = model;
    const stackDimensions = stack
        ? new Set([...stack.groupbyFields, ...stack.stackBy.map(s => s.fieldDef.field)])
        : undefined;
    // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
    if (isSortField(sort)) {
        const isStackedMeasure = stack && !stackDimensions.has(sort.field);
        return normalizeSortField(sort, isStackedMeasure);
    }
    else if (isSortByEncoding(sort)) {
        const { encoding, order } = sort;
        const fieldDefToSortBy = model.fieldDef(encoding);
        const { aggregate, field } = fieldDefToSortBy;
        const isStackedMeasure = stack && !stackDimensions.has(field);
        if (isArgminDef(aggregate) || isArgmaxDef(aggregate)) {
            return normalizeSortField({
                field: vgField(fieldDefToSortBy),
                order
            }, isStackedMeasure);
        }
        else if (isAggregateOp(aggregate) || !aggregate) {
            return normalizeSortField({
                op: aggregate,
                field,
                order
            }, isStackedMeasure);
        }
    }
    else if (sort === 'descending') {
        return {
            op: 'min',
            field: model.vgField(channel),
            order: 'descending'
        };
    }
    else if (util.contains(['ascending', undefined /* default =ascending*/], sort)) {
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
export function canUseUnaggregatedDomain(fieldDef, scaleType) {
    const { aggregate, type } = fieldDef;
    if (!aggregate) {
        return {
            valid: false,
            reason: log.message.unaggregateDomainHasNoEffectForRawField(fieldDef)
        };
    }
    if (isString(aggregate) && !SHARED_DOMAIN_OPS.has(aggregate)) {
        return {
            valid: false,
            reason: log.message.unaggregateDomainWithNonSharedDomainOp(aggregate)
        };
    }
    if (type === 'quantitative') {
        if (scaleType === 'log') {
            return {
                valid: false,
                reason: log.message.unaggregatedDomainWithLogScale(fieldDef)
            };
        }
    }
    return { valid: true };
}
/**
 * Tie breaker for mergeValuesWithExplicit for domains. We concat the specified values.
 */
function domainsTieBreaker(v1, v2, property, propertyOf) {
    if (v1.explicit && v2.explicit) {
        log.warn(log.message.mergeConflictingDomainProperty(property, propertyOf, v1.value, v2.value));
    }
    // If equal score, concat the domains so that we union them later.
    return { explicit: v1.explicit, value: [...v1.value, ...v2.value] };
}
/**
 * Converts an array of domains to a single Vega scale domain.
 */
export function mergeDomains(domains) {
    const uniqueDomains = util.unique(domains.map(domain => {
        // ignore sort property when computing the unique domains
        if (isDataRefDomain(domain)) {
            const { sort: _s, ...domainWithoutSort } = domain;
            return domainWithoutSort;
        }
        return domain;
    }), util.hash);
    const sorts = util.unique(domains
        .map(d => {
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
        .filter(s => s !== undefined), util.hash);
    if (uniqueDomains.length === 0) {
        return undefined;
    }
    else if (uniqueDomains.length === 1) {
        const domain = domains[0];
        if (isDataRefDomain(domain) && sorts.length > 0) {
            let sort = sorts[0];
            if (sorts.length > 1) {
                log.warn(log.message.MORE_THAN_ONE_SORT);
                // Get sorts with non-default ops
                const filteredSorts = sorts.filter(s => isObject(s) && 'op' in s && s.op !== 'min');
                if (sorts.every(s => isObject(s) && 'op' in s) && filteredSorts.length === 1) {
                    sort = filteredSorts[0];
                }
                else {
                    sort = true;
                }
            }
            else {
                // Simplify domain sort by removing field and op when the field is the same as the domain field.
                if (isObject(sort) && 'field' in sort) {
                    const sortField = sort.field;
                    if (domain.field === sortField) {
                        sort = sort.order ? { order: sort.order } : true;
                    }
                }
            }
            return {
                ...domain,
                sort
            };
        }
        return domain;
    }
    // only keep sort properties that work with unioned domains
    const unionDomainSorts = util.unique(sorts.map(s => {
        if (util.isBoolean(s) || !('op' in s) || (isString(s.op) && s.op in UNIONDOMAIN_SORT_OP_INDEX)) {
            return s;
        }
        log.warn(log.message.domainSortDropped(s));
        return true;
    }), util.hash);
    let sort;
    if (unionDomainSorts.length === 1) {
        sort = unionDomainSorts[0];
    }
    else if (unionDomainSorts.length > 1) {
        log.warn(log.message.MORE_THAN_ONE_SORT);
        sort = true;
    }
    const allData = util.unique(domains.map(d => {
        if (isDataRefDomain(d)) {
            return d.data;
        }
        return null;
    }), x => x);
    if (allData.length === 1 && allData[0] !== null) {
        // create a union domain of different fields with a single data source
        const domain = {
            data: allData[0],
            fields: uniqueDomains.map(d => d.field),
            ...(sort ? { sort } : {})
        };
        return domain;
    }
    return { fields: uniqueDomains, ...(sort ? { sort } : {}) };
}
/**
 * Return a field if a scale uses a single field.
 * Return `undefined` otherwise.
 */
export function getFieldFromDomain(domain) {
    if (isDataRefDomain(domain) && isString(domain.field)) {
        return domain.field;
    }
    else if (isDataRefUnionedDomain(domain)) {
        let field;
        for (const nonUnionDomain of domain.fields) {
            if (isDataRefDomain(nonUnionDomain) && isString(nonUnionDomain.field)) {
                if (!field) {
                    field = nonUnionDomain.field;
                }
                else if (field !== nonUnionDomain.field) {
                    log.warn(log.message.FACETED_INDEPENDENT_DIFFERENT_SOURCES);
                    return field;
                }
            }
        }
        log.warn(log.message.FACETED_INDEPENDENT_SAME_FIELDS_DIFFERENT_SOURCES);
        return field;
    }
    else if (isFieldRefUnionDomain(domain)) {
        log.warn(log.message.FACETED_INDEPENDENT_SAME_SOURCE);
        const field = domain.fields[0];
        return isString(field) ? field : undefined;
    }
    return undefined;
}
export function assembleDomain(model, channel) {
    const scaleComponent = model.component.scales[channel];
    const domains = scaleComponent.get('domains').map((domain) => {
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
//# sourceMappingURL=domain.js.map