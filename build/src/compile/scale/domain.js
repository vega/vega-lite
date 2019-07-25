import * as tslib_1 from "tslib";
import { isObject, isString } from 'vega-util';
import { SHARED_DOMAIN_OP_INDEX } from '../../aggregate';
import { isBinning } from '../../bin';
import { isScaleChannel } from '../../channel';
import { binRequiresRange, valueExpr, vgField } from '../../channeldef';
import { MAIN, RAW } from '../../data';
import * as log from '../../log';
import { hasDiscreteDomain, isSelectionDomain } from '../../scale';
import { DEFAULT_SORT_OP, isSortArray, isSortByEncoding, isSortField } from '../../sort';
import * as util from '../../util';
import { isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain } from '../../vega.schema';
import { getBinSignalName } from '../data/bin';
import { sortArrayIndexField } from '../data/calculate';
import { FACET_SCALE_PREFIX } from '../data/optimize';
import { isFacetModel, isUnitModel } from '../model';
import { SELECTION_DOMAIN } from '../selection';
import { SignalRefWrapper } from '../signal';
import { mergeValuesWithExplicit, makeExplicit, makeImplicit } from '../split';
export function parseScaleDomain(model) {
    if (isUnitModel(model)) {
        parseUnitScaleDomain(model);
    }
    else {
        parseNonUnitScaleDomain(model);
    }
}
function parseUnitScaleDomain(model) {
    const scales = model.specifiedScales;
    const localScaleComponents = model.component.scales;
    util.keys(localScaleComponents).forEach((channel) => {
        const specifiedScale = scales[channel];
        const specifiedDomain = specifiedScale ? specifiedScale.domain : undefined;
        const domains = parseDomainForChannel(model, channel);
        const localScaleCmpt = localScaleComponents[channel];
        localScaleCmpt.setWithExplicit('domains', domains);
        if (isSelectionDomain(specifiedDomain)) {
            // As scale parsing occurs before selection parsing, we use a temporary
            // signal here and append the scale.domain definition. This is replaced
            // with the correct domainRaw signal during scale assembly.
            // For more information, see isRawSelectionDomain in selection.ts.
            // FIXME: replace this with a special property in the scaleComponent
            localScaleCmpt.set('domainRaw', {
                signal: SELECTION_DOMAIN + util.hash(specifiedDomain)
            }, true);
        }
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
    });
}
function parseNonUnitScaleDomain(model) {
    for (const child of model.children) {
        parseScaleDomain(child);
    }
    const localScaleComponents = model.component.scales;
    util.keys(localScaleComponents).forEach((channel) => {
        let domains;
        let domainRaw = null;
        for (const child of model.children) {
            const childComponent = child.component.scales[channel];
            if (childComponent) {
                if (domains === undefined) {
                    domains = childComponent.getWithExplicit('domains');
                }
                else {
                    domains = mergeValuesWithExplicit(domains, childComponent.getWithExplicit('domains'), 'domains', 'scale', domainsTieBreaker);
                }
                const dr = childComponent.get('domainRaw');
                if (domainRaw && dr && domainRaw.signal !== dr.signal) {
                    log.warn('The same selection must be used to override scale domains in a layered view.');
                }
                domainRaw = dr;
            }
        }
        localScaleComponents[channel].setWithExplicit('domains', domains);
        if (domainRaw) {
            localScaleComponents[channel].set('domainRaw', domainRaw, true);
        }
    });
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
    const domain = normalizeUnaggregatedDomain(model.scaleDomain(channel), model.fieldDef(channel), scaleType, model.config.scale);
    if (domain !== model.scaleDomain(channel)) {
        model.specifiedScales[channel] = Object.assign({}, model.specifiedScales[channel], { domain });
    }
    // If channel is either X or Y then union them with X2 & Y2 if they exist
    if (channel === 'x' && model.channelHasField('x2')) {
        if (model.channelHasField('x')) {
            return mergeValuesWithExplicit(parseSingleChannelDomain(scaleType, domain, model, 'x'), parseSingleChannelDomain(scaleType, domain, model, 'x2'), 'domain', 'scale', domainsTieBreaker);
        }
        else {
            return parseSingleChannelDomain(scaleType, domain, model, 'x2');
        }
    }
    else if (channel === 'y' && model.channelHasField('y2')) {
        if (model.channelHasField('y')) {
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
function parseSingleChannelDomain(scaleType, domain, model, channel) {
    const fieldDef = model.fieldDef(channel);
    if (domain && domain !== 'unaggregated' && !isSelectionDomain(domain)) {
        // explicit value
        const { type, timeUnit } = fieldDef;
        if (type === 'temporal' || timeUnit) {
            return makeExplicit(mapDomainToDataSignal(domain, type, timeUnit));
        }
        return makeExplicit([domain]);
    }
    const stack = model.stack;
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return makeImplicit([[0, 1]]);
        }
        const data = model.requestDataName(MAIN);
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
    const sort = isScaleChannel(channel)
        ? domainSort(model, channel, scaleType)
        : undefined;
    if (domain === 'unaggregated') {
        const data = model.requestDataName(MAIN);
        const { field } = fieldDef;
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
                    data: util.isBoolean(sort) ? model.requestDataName(MAIN) : model.requestDataName(RAW),
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
                        data: model.requestDataName(MAIN),
                        field: model.vgField(channel, {})
                    }
                ]);
            }
        }
    }
    else if (sort) {
        return makeImplicit([
            {
                // If sort by aggregation of a specified sort field, we need to use RAW table,
                // so we can aggregate values for the scale independently from the main aggregation.
                data: util.isBoolean(sort) ? model.requestDataName(MAIN) : model.requestDataName(RAW),
                field: model.vgField(channel),
                sort: sort
            }
        ]);
    }
    else {
        return makeImplicit([
            {
                data: model.requestDataName(MAIN),
                field: model.vgField(channel)
            }
        ]);
    }
}
function normalizeSortField(sort, isStacked) {
    const { op, field, order } = sort;
    return Object.assign({ 
        // Apply default op
        op: op || (isStacked ? 'sum' : DEFAULT_SORT_OP) }, (field ? { field: util.replacePathInField(field) } : {}), (order ? { order } : {}));
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
    const isStacked = model.stack !== null;
    // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
    if (isSortField(sort)) {
        return normalizeSortField(sort, isStacked);
    }
    else if (isSortByEncoding(sort)) {
        const { encoding, order } = sort;
        const { aggregate, field } = model.fieldDef(encoding);
        const sortField = {
            op: aggregate,
            field,
            order
        };
        return normalizeSortField(sortField, isStacked);
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
    if (isString(aggregate) && !SHARED_DOMAIN_OP_INDEX[aggregate]) {
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
            const { sort: _s } = domain, domainWithoutSort = tslib_1.__rest(domain, ["sort"]);
            return domainWithoutSort;
        }
        return domain;
    }), util.hash);
    const sorts = util.unique(domains
        .map(d => {
        if (isDataRefDomain(d)) {
            const s = d.sort;
            if (s !== undefined && !util.isBoolean(s)) {
                if (s.op === 'count') {
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
                sort = true;
            }
            return Object.assign({}, domain, { sort });
        }
        return domain;
    }
    // only keep simple sort properties that work with unioned domains
    const simpleSorts = util.unique(sorts.map(s => {
        if (util.isBoolean(s) || s.op === 'count') {
            return s;
        }
        log.warn(log.message.domainSortDropped(s));
        return true;
    }), util.hash);
    let sort;
    if (simpleSorts.length === 1) {
        sort = simpleSorts[0];
    }
    else if (simpleSorts.length > 1) {
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
        const domain = Object.assign({ data: allData[0], fields: uniqueDomains.map(d => d.field) }, (sort ? { sort } : {}));
        return domain;
    }
    return Object.assign({ fields: uniqueDomains }, (sort ? { sort } : {}));
}
/**
 * Return a field if a scale single field.
 * Return `undefined` otherwise.
 *
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
                    log.warn('Detected faceted independent scales that union domain of multiple fields from different data sources.  We will use the first field.  The result view size may be incorrect.');
                    return field;
                }
            }
        }
        log.warn('Detected faceted independent scales that union domain of identical fields from different source detected.  We will assume that this is the same field from a different fork of the same data source.  However, if this is not case, the result view size maybe incorrect.');
        return field;
    }
    else if (isFieldRefUnionDomain(domain)) {
        log.warn('Detected faceted independent scales that union domain of multiple fields from the same data source.  We will use the first field.  The result view size may be incorrect.');
        const field = domain.fields[0];
        return isString(field) ? field : undefined;
    }
    return undefined;
}
export function assembleDomain(model, channel) {
    const scaleComponent = model.component.scales[channel];
    const domains = scaleComponent.get('domains').map(domain => {
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