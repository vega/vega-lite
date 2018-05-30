import * as tslib_1 from "tslib";
import { isString } from 'vega-util';
import { SHARED_DOMAIN_OP_INDEX } from '../../aggregate';
import { binToString, isBinParams } from '../../bin';
import { isScaleChannel } from '../../channel';
import { MAIN, RAW } from '../../data';
import { dateTimeExpr, isDateTime } from '../../datetime';
import { vgField } from '../../fielddef';
import * as log from '../../log';
import { hasDiscreteDomain, isBinScale, isSelectionDomain } from '../../scale';
import { isSortArray, isSortField } from '../../sort';
import * as util from '../../util';
import { isDataRefDomain, isDataRefUnionedDomain, isFieldRefUnionDomain } from '../../vega.schema';
import { binRequiresRange } from '../common';
import { sortArrayIndexField } from '../data/calculate';
import { FACET_SCALE_PREFIX } from '../data/optimize';
import { isFacetModel, isUnitModel } from '../model';
import { SELECTION_DOMAIN } from '../selection/selection';
export function parseScaleDomain(model) {
    if (isUnitModel(model)) {
        parseUnitScaleDomain(model);
    }
    else {
        parseNonUnitScaleDomain(model);
    }
}
function parseUnitScaleDomain(model) {
    var scales = model.specifiedScales;
    var localScaleComponents = model.component.scales;
    util.keys(localScaleComponents).forEach(function (channel) {
        var specifiedScale = scales[channel];
        var specifiedDomain = specifiedScale ? specifiedScale.domain : undefined;
        var domains = parseDomainForChannel(model, channel);
        var localScaleCmpt = localScaleComponents[channel];
        localScaleCmpt.domains = domains;
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
            var facetParent = model;
            while (!isFacetModel(facetParent) && facetParent.parent) {
                facetParent = facetParent.parent;
            }
            var resolve = facetParent.component.resolve.scale[channel];
            if (resolve === 'shared') {
                for (var _i = 0, domains_1 = domains; _i < domains_1.length; _i++) {
                    var domain = domains_1[_i];
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
    for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
        var child = _a[_i];
        parseScaleDomain(child);
    }
    var localScaleComponents = model.component.scales;
    util.keys(localScaleComponents).forEach(function (channel) {
        var domains;
        var domainRaw = null;
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childComponent = child.component.scales[channel];
            if (childComponent) {
                if (domains === undefined) {
                    domains = childComponent.domains;
                }
                else {
                    domains = domains.concat(childComponent.domains);
                }
                var dr = childComponent.get('domainRaw');
                if (domainRaw && dr && domainRaw.signal !== dr.signal) {
                    log.warn('The same selection must be used to override scale domains in a layered view.');
                }
                domainRaw = dr;
            }
        }
        localScaleComponents[channel].domains = domains;
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
        var _a = canUseUnaggregatedDomain(fieldDef, scaleType), valid = _a.valid, reason = _a.reason;
        if (!valid) {
            log.warn(reason);
            return undefined;
        }
    }
    else if (domain === undefined && scaleConfig.useUnaggregatedDomain) {
        // Apply config if domain is not specified.
        var valid = canUseUnaggregatedDomain(fieldDef, scaleType).valid;
        if (valid) {
            return 'unaggregated';
        }
    }
    return domain;
}
export function parseDomainForChannel(model, channel) {
    var scaleType = model.getScaleComponent(channel).get('type');
    var domain = normalizeUnaggregatedDomain(model.scaleDomain(channel), model.fieldDef(channel), scaleType, model.config.scale);
    if (domain !== model.scaleDomain(channel)) {
        model.specifiedScales[channel] = tslib_1.__assign({}, model.specifiedScales[channel], { domain: domain });
    }
    // If channel is either X or Y then union them with X2 & Y2 if they exist
    if (channel === 'x' && model.channelHasField('x2')) {
        if (model.channelHasField('x')) {
            return parseSingleChannelDomain(scaleType, domain, model, 'x').concat(parseSingleChannelDomain(scaleType, domain, model, 'x2'));
        }
        else {
            return parseSingleChannelDomain(scaleType, domain, model, 'x2');
        }
    }
    else if (channel === 'y' && model.channelHasField('y2')) {
        if (model.channelHasField('y')) {
            return parseSingleChannelDomain(scaleType, domain, model, 'y').concat(parseSingleChannelDomain(scaleType, domain, model, 'y2'));
        }
        else {
            return parseSingleChannelDomain(scaleType, domain, model, 'y2');
        }
    }
    return parseSingleChannelDomain(scaleType, domain, model, channel);
}
function parseSingleChannelDomain(scaleType, domain, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (domain && domain !== 'unaggregated' && !isSelectionDomain(domain)) { // explicit value
        if (isDateTime(domain[0])) {
            return domain.map(function (dt) {
                return { signal: "{data: " + dateTimeExpr(dt, true) + "}" };
            });
        }
        return [domain];
    }
    var stack = model.stack;
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return [[0, 1]];
        }
        var data = model.requestDataName(MAIN);
        return [{
                data: data,
                field: model.vgField(channel, { suffix: 'start' })
            }, {
                data: data,
                field: model.vgField(channel, { suffix: 'end' })
            }];
    }
    var sort = isScaleChannel(channel) ? domainSort(model, channel, scaleType) : undefined;
    if (domain === 'unaggregated') {
        var data = model.requestDataName(MAIN);
        var field = fieldDef.field;
        return [{
                data: data,
                field: vgField({ field: field, aggregate: 'min' })
            }, {
                data: data,
                field: vgField({ field: field, aggregate: 'max' })
            }];
    }
    else if (fieldDef.bin) { // bin
        if (isBinScale(scaleType)) {
            var signal = model.getName(binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
            return [{ signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" }];
        }
        if (hasDiscreteDomain(scaleType)) {
            // ordinal bin scale takes domain from bin_range, ordered by bin start
            // This is useful for both axis-based scale (x/y) and legend-based scale (other channels).
            return [{
                    // If sort by aggregation of a specified sort field, we need to use RAW table,
                    // so we can aggregate values for the scale independently from the main aggregation.
                    data: util.isBoolean(sort) ? model.requestDataName(MAIN) : model.requestDataName(RAW),
                    // Use range if we added it and the scale does not support computing a range as a signal.
                    field: model.vgField(channel, binRequiresRange(fieldDef, channel) ? { binSuffix: 'range' } : {}),
                    // we have to use a sort object if sort = true to make the sort correct by bin start
                    sort: sort === true || !isSortField(sort) ? {
                        field: model.vgField(channel, {}),
                        op: 'min' // min or max doesn't matter since we sort by the start of the bin range
                    } : sort
                }];
        }
        else { // continuous scales
            if (channel === 'x' || channel === 'y') {
                if (isBinParams(fieldDef.bin) && fieldDef.bin.extent) {
                    return [fieldDef.bin.extent];
                }
                // X/Y position have to include start and end for non-ordinal scale
                var data = model.requestDataName(MAIN);
                return [{
                        data: data,
                        field: model.vgField(channel, {})
                    }, {
                        data: data,
                        field: model.vgField(channel, { binSuffix: 'end' })
                    }];
            }
            else {
                // TODO: use bin_mid
                return [{
                        data: model.requestDataName(MAIN),
                        field: model.vgField(channel, {})
                    }];
            }
        }
    }
    else if (sort) {
        return [{
                // If sort by aggregation of a specified sort field, we need to use RAW table,
                // so we can aggregate values for the scale independently from the main aggregation.
                data: util.isBoolean(sort) ? model.requestDataName(MAIN) : model.requestDataName(RAW),
                field: model.vgField(channel),
                sort: sort
            }];
    }
    else {
        return [{
                data: model.requestDataName(MAIN),
                field: model.vgField(channel)
            }];
    }
}
export function domainSort(model, channel, scaleType) {
    if (!hasDiscreteDomain(scaleType)) {
        return undefined;
    }
    var fieldDef = model.fieldDef(channel);
    var sort = fieldDef.sort;
    // if the sort is specified with array, use the derived sort index field
    if (isSortArray(sort)) {
        return {
            op: 'min',
            field: sortArrayIndexField(model, channel),
            order: 'ascending'
        };
    }
    // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
    if (isSortField(sort)) {
        // flatten nested fields
        return tslib_1.__assign({}, sort, (sort.field ? { field: util.replacePathInField(sort.field) } : {}));
    }
    if (sort === 'descending') {
        return {
            op: 'min',
            field: model.vgField(channel),
            order: 'descending'
        };
    }
    if (util.contains(['ascending', undefined /* default =ascending*/], sort)) {
        return true;
    }
    // sort == null
    return undefined;
}
/**
 * Determine if a scale can use unaggregated domain.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `scale.domain` is `unaggregated`
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
export function canUseUnaggregatedDomain(fieldDef, scaleType) {
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
    return { valid: true };
}
/**
 * Converts an array of domains to a single Vega scale domain.
 */
export function mergeDomains(domains) {
    var uniqueDomains = util.unique(domains.map(function (domain) {
        // ignore sort property when computing the unique domains
        if (isDataRefDomain(domain)) {
            var _s = domain.sort, domainWithoutSort = tslib_1.__rest(domain, ["sort"]);
            return domainWithoutSort;
        }
        return domain;
    }), util.hash);
    var sorts = util.unique(domains.map(function (d) {
        if (isDataRefDomain(d)) {
            var s = d.sort;
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
    }).filter(function (s) { return s !== undefined; }), util.hash);
    if (uniqueDomains.length === 1) {
        var domain = domains[0];
        if (isDataRefDomain(domain) && sorts.length > 0) {
            var sort_1 = sorts[0];
            if (sorts.length > 1) {
                log.warn(log.message.MORE_THAN_ONE_SORT);
                sort_1 = true;
            }
            return tslib_1.__assign({}, domain, { sort: sort_1 });
        }
        return domain;
    }
    // only keep simple sort properties that work with unioned domains
    var simpleSorts = util.unique(sorts.map(function (s) {
        if (s === true) {
            return s;
        }
        if (s.op === 'count') {
            return s;
        }
        log.warn(log.message.domainSortDropped(s));
        return true;
    }), util.hash);
    var sort = undefined;
    if (simpleSorts.length === 1) {
        sort = simpleSorts[0];
    }
    else if (simpleSorts.length > 1) {
        log.warn(log.message.MORE_THAN_ONE_SORT);
        sort = true;
    }
    var allData = util.unique(domains.map(function (d) {
        if (isDataRefDomain(d)) {
            return d.data;
        }
        return null;
    }), function (x) { return x; });
    if (allData.length === 1 && allData[0] !== null) {
        // create a union domain of different fields with a single data source
        var domain = tslib_1.__assign({ data: allData[0], fields: uniqueDomains.map(function (d) { return d.field; }) }, (sort ? { sort: sort } : {}));
        return domain;
    }
    return tslib_1.__assign({ fields: uniqueDomains }, (sort ? { sort: sort } : {}));
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
        var field = void 0;
        for (var _i = 0, _a = domain.fields; _i < _a.length; _i++) {
            var nonUnionDomain = _a[_i];
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
        var field = domain.fields[0];
        return isString(field) ? field : undefined;
    }
    return undefined;
}
export function assembleDomain(model, channel) {
    var scaleComponent = model.component.scales[channel];
    var domains = scaleComponent.domains.map(function (domain) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ25DLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxXQUFXLEVBQUUsV0FBVyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ25ELE9BQU8sRUFBQyxjQUFjLEVBQWUsTUFBTSxlQUFlLENBQUM7QUFDM0QsT0FBTyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFXLFlBQVksRUFBRSxVQUFVLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQztBQUNsRSxPQUFPLEVBQTBCLE9BQU8sRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBQ2hFLE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBUyxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQXlCLE1BQU0sYUFBYSxDQUFDO0FBQzdHLE9BQU8sRUFBb0IsV0FBVyxFQUFFLFdBQVcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN2RSxPQUFPLEtBQUssSUFBSSxNQUFNLFlBQVksQ0FBQztBQUNuQyxPQUFPLEVBQUMsZUFBZSxFQUFFLHNCQUFzQixFQUFFLHFCQUFxQixFQUE4RixNQUFNLG1CQUFtQixDQUFDO0FBQzlMLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUMzQyxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RCxPQUFPLEVBQUMsa0JBQWtCLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsWUFBWSxFQUFFLFdBQVcsRUFBUSxNQUFNLFVBQVUsQ0FBQztBQUMxRCxP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LGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0VBQXNFO0lBQ3RFLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtTSEFSRURfRE9NQUlOX09QX0lOREVYfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZywgaXNCaW5QYXJhbXN9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge2lzU2NhbGVDaGFubmVsLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgZGF0ZVRpbWVFeHByLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmLCBTY2FsZUZpZWxkRGVmLCB2Z0ZpZWxkfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7RG9tYWluLCBoYXNEaXNjcmV0ZURvbWFpbiwgaXNCaW5TY2FsZSwgaXNTZWxlY3Rpb25Eb21haW4sIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7RW5jb2RpbmdTb3J0RmllbGQsIGlzU29ydEFycmF5LCBpc1NvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc0RhdGFSZWZEb21haW4sIGlzRGF0YVJlZlVuaW9uZWREb21haW4sIGlzRmllbGRSZWZVbmlvbkRvbWFpbiwgVmdEYXRhUmVmLCBWZ0RvbWFpbiwgVmdGaWVsZFJlZlVuaW9uRG9tYWluLCBWZ05vblVuaW9uRG9tYWluLCBWZ1NvcnRGaWVsZCwgVmdVbmlvblNvcnRGaWVsZH0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtzb3J0QXJyYXlJbmRleEZpZWxkfSBmcm9tICcuLi9kYXRhL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0ZBQ0VUX1NDQUxFX1BSRUZJWH0gZnJvbSAnLi4vZGF0YS9vcHRpbWl6ZSc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1NFTEVDVElPTl9ET01BSU59IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtTY2FsZUNvbXBvbmVudEluZGV4fSBmcm9tICcuL2NvbXBvbmVudCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVEb21haW4obW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBwYXJzZVVuaXRTY2FsZURvbWFpbihtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VOb25Vbml0U2NhbGVEb21haW4obW9kZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdFNjYWxlRG9tYWluKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3Qgc2NhbGVzID0gbW9kZWwuc3BlY2lmaWVkU2NhbGVzO1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgdXRpbC5rZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBjb25zdCBzcGVjaWZpZWRTY2FsZSA9IHNjYWxlc1tjaGFubmVsXTtcbiAgICBjb25zdCBzcGVjaWZpZWREb21haW4gPSBzcGVjaWZpZWRTY2FsZSA/IHNwZWNpZmllZFNjYWxlLmRvbWFpbiA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGRvbWFpbnMgPSBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsIGNoYW5uZWwpO1xuICAgIGNvbnN0IGxvY2FsU2NhbGVDbXB0ID0gbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF07XG4gICAgbG9jYWxTY2FsZUNtcHQuZG9tYWlucyA9IGRvbWFpbnM7XG5cbiAgICBpZiAoaXNTZWxlY3Rpb25Eb21haW4oc3BlY2lmaWVkRG9tYWluKSkge1xuICAgICAgLy8gQXMgc2NhbGUgcGFyc2luZyBvY2N1cnMgYmVmb3JlIHNlbGVjdGlvbiBwYXJzaW5nLCB3ZSB1c2UgYSB0ZW1wb3JhcnlcbiAgICAgIC8vIHNpZ25hbCBoZXJlIGFuZCBhcHBlbmQgdGhlIHNjYWxlLmRvbWFpbiBkZWZpbml0aW9uLiBUaGlzIGlzIHJlcGxhY2VkXG4gICAgICAvLyB3aXRoIHRoZSBjb3JyZWN0IGRvbWFpblJhdyBzaWduYWwgZHVyaW5nIHNjYWxlIGFzc2VtYmx5LlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBpc1Jhd1NlbGVjdGlvbkRvbWFpbiBpbiBzZWxlY3Rpb24udHMuXG5cbiAgICAgIC8vIEZJWE1FOiByZXBsYWNlIHRoaXMgd2l0aCBhIHNwZWNpYWwgcHJvcGVydHkgaW4gdGhlIHNjYWxlQ29tcG9uZW50XG4gICAgICBsb2NhbFNjYWxlQ21wdC5zZXQoJ2RvbWFpblJhdycsIHtcbiAgICAgICAgc2lnbmFsOiBTRUxFQ1RJT05fRE9NQUlOICsgdXRpbC5oYXNoKHNwZWNpZmllZERvbWFpbilcbiAgICAgIH0sIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5jb21wb25lbnQuZGF0YS5pc0ZhY2V0ZWQpIHtcbiAgICAgIC8vIGdldCByZXNvbHZlIGZyb20gY2xvc2VzdCBmYWNldCBwYXJlbnQgYXMgdGhpcyBkZWNpZGVzIHdoZXRoZXIgd2UgbmVlZCB0byByZWZlciB0byBjbG9uZWQgc3VidHJlZSBvciBub3RcbiAgICAgIGxldCBmYWNldFBhcmVudDogTW9kZWwgPSBtb2RlbDtcbiAgICAgIHdoaWxlICghaXNGYWNldE1vZGVsKGZhY2V0UGFyZW50KSAmJiBmYWNldFBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgZmFjZXRQYXJlbnQgPSBmYWNldFBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmYWNldFBhcmVudC5jb21wb25lbnQucmVzb2x2ZS5zY2FsZVtjaGFubmVsXTtcblxuICAgICAgaWYgKHJlc29sdmUgPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIGZvciAoY29uc3QgZG9tYWluIG9mIGRvbWFpbnMpIHtcbiAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBzY2FsZSBkb21haW4gd2l0aCBkYXRhIG91dHB1dCBmcm9tIGEgY2xvbmVkIHN1YnRyZWUgYWZ0ZXIgdGhlIGZhY2V0LlxuICAgICAgICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgICAgICAgLy8gdXNlIGRhdGEgZnJvbSBjbG9uZWQgc3VidHJlZSAod2hpY2ggaXMgdGhlIHNhbWUgYXMgZGF0YSBidXQgd2l0aCBhIHByZWZpeCBhZGRlZCBvbmNlKVxuICAgICAgICAgICAgZG9tYWluLmRhdGEgPSBGQUNFVF9TQ0FMRV9QUkVGSVggKyBkb21haW4uZGF0YS5yZXBsYWNlKEZBQ0VUX1NDQUxFX1BSRUZJWCwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgcGFyc2VTY2FsZURvbWFpbihjaGlsZCk7XG4gIH1cblxuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgdXRpbC5rZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBsZXQgZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdO1xuICAgIGxldCBkb21haW5SYXcgPSBudWxsO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgIGlmIChkb21haW5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkb21haW5zID0gY2hpbGRDb21wb25lbnQuZG9tYWlucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb21haW5zID0gZG9tYWlucy5jb25jYXQoY2hpbGRDb21wb25lbnQuZG9tYWlucyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkciA9IGNoaWxkQ29tcG9uZW50LmdldCgnZG9tYWluUmF3Jyk7XG4gICAgICAgIGlmIChkb21haW5SYXcgJiYgZHIgJiYgZG9tYWluUmF3LnNpZ25hbCAhPT0gZHIuc2lnbmFsKSB7XG4gICAgICAgICAgbG9nLndhcm4oJ1RoZSBzYW1lIHNlbGVjdGlvbiBtdXN0IGJlIHVzZWQgdG8gb3ZlcnJpZGUgc2NhbGUgZG9tYWlucyBpbiBhIGxheWVyZWQgdmlldy4nKTtcbiAgICAgICAgfVxuICAgICAgICBkb21haW5SYXcgPSBkcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5kb21haW5zID0gZG9tYWlucztcblxuICAgIGlmIChkb21haW5SYXcpIHtcbiAgICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLnNldCgnZG9tYWluUmF3JywgZG9tYWluUmF3LCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIHVuYWdncmVnYXRlZCBkb21haW4gaWYgaXQgaXMgbm90IGFwcGxpY2FibGVcbiAqIEFkZCB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGRvbWFpbiBpcyBub3Qgc3BlY2lmaWVkIGFuZCBjb25maWcuc2NhbGUudXNlVW5hZ2dyZWdhdGVkRG9tYWluIGlzIHRydWUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVuYWdncmVnYXRlZERvbWFpbihkb21haW46IERvbWFpbiwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICBjb25zdCB7dmFsaWQsIHJlYXNvbn0gPSBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWYsIHNjYWxlVHlwZSk7XG4gICAgaWYoIXZhbGlkKSB7XG4gICAgICBsb2cud2FybihyZWFzb24pO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZG9tYWluID09PSB1bmRlZmluZWQgJiYgc2NhbGVDb25maWcudXNlVW5hZ2dyZWdhdGVkRG9tYWluKSB7XG4gICAgLy8gQXBwbHkgY29uZmlnIGlmIGRvbWFpbiBpcyBub3Qgc3BlY2lmaWVkLlxuICAgIGNvbnN0IHt2YWxpZH0gPSBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWYsIHNjYWxlVHlwZSk7XG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICByZXR1cm4gJ3VuYWdncmVnYXRlZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRvbWFpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBWZ05vblVuaW9uRG9tYWluW10ge1xuICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcblxuICBjb25zdCBkb21haW4gPSBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4obW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCksIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLCBzY2FsZVR5cGUsIG1vZGVsLmNvbmZpZy5zY2FsZSk7XG4gIGlmIChkb21haW4gIT09IG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpKSB7XG4gICAgbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdID0ge1xuICAgICAgLi4ubW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdLFxuICAgICAgZG9tYWluXG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGNoYW5uZWwgaXMgZWl0aGVyIFggb3IgWSB0aGVuIHVuaW9uIHRoZW0gd2l0aCBYMiAmIFkyIGlmIHRoZXkgZXhpc3RcbiAgaWYgKGNoYW5uZWwgPT09ICd4JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3gyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneCcpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneDInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneDInKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3knICYmIG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneTInKSkge1xuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3knKSkge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5JykuY29uY2F0KHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5MicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5MicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgY2hhbm5lbCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZG9tYWluOiBEb21haW4sIG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCB8ICd4MicgfCAneTInKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZiAoZG9tYWluICYmIGRvbWFpbiAhPT0gJ3VuYWdncmVnYXRlZCcgJiYgIWlzU2VsZWN0aW9uRG9tYWluKGRvbWFpbikpIHsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICBpZiAoaXNEYXRlVGltZShkb21haW5bMF0pKSB7XG4gICAgICByZXR1cm4gKGRvbWFpbiBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAgIHJldHVybiB7c2lnbmFsOiBge2RhdGE6ICR7ZGF0ZVRpbWVFeHByKGR0LCB0cnVlKX19YH07XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIFtkb21haW5dO1xuICB9XG5cbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaztcbiAgaWYgKHN0YWNrICYmIGNoYW5uZWwgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgIGlmKHN0YWNrLm9mZnNldCA9PT0gJ25vcm1hbGl6ZScpIHtcbiAgICAgIHJldHVybiBbWzAsIDFdXTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtzdWZmaXg6ICdzdGFydCd9KVxuICAgIH0sIHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7c3VmZml4OiAnZW5kJ30pXG4gICAgfV07XG4gIH1cblxuICBjb25zdCBzb3J0ID0gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgPyBkb21haW5Tb3J0KG1vZGVsLCBjaGFubmVsLCBzY2FsZVR5cGUpIDogdW5kZWZpbmVkO1xuXG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICBjb25zdCB7ZmllbGR9ID0gZmllbGREZWY7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IHZnRmllbGQoe2ZpZWxkLCBhZ2dyZWdhdGU6ICdtaW4nfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IHZnRmllbGQoe2ZpZWxkLCBhZ2dyZWdhdGU6ICdtYXgnfSlcbiAgICB9XTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi5iaW4pIHsgLy8gYmluXG4gICAgaWYgKGlzQmluU2NhbGUoc2NhbGVUeXBlKSkge1xuICAgICAgY29uc3Qgc2lnbmFsID0gbW9kZWwuZ2V0TmFtZShgJHtiaW5Ub1N0cmluZyhmaWVsZERlZi5iaW4pfV8ke2ZpZWxkRGVmLmZpZWxkfV9iaW5zYCk7XG4gICAgICByZXR1cm4gW3tzaWduYWw6IGBzZXF1ZW5jZSgke3NpZ25hbH0uc3RhcnQsICR7c2lnbmFsfS5zdG9wICsgJHtzaWduYWx9LnN0ZXAsICR7c2lnbmFsfS5zdGVwKWB9XTtcbiAgICB9XG5cbiAgICBpZiAoaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgICAgLy8gb3JkaW5hbCBiaW4gc2NhbGUgdGFrZXMgZG9tYWluIGZyb20gYmluX3JhbmdlLCBvcmRlcmVkIGJ5IGJpbiBzdGFydFxuICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgZm9yIGJvdGggYXhpcy1iYXNlZCBzY2FsZSAoeC95KSBhbmQgbGVnZW5kLWJhc2VkIHNjYWxlIChvdGhlciBjaGFubmVscykuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBSQVcgdGFibGUsXG4gICAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgICBkYXRhOiB1dGlsLmlzQm9vbGVhbihzb3J0KSA/IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSA6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShSQVcpLFxuICAgICAgICAvLyBVc2UgcmFuZ2UgaWYgd2UgYWRkZWQgaXQgYW5kIHRoZSBzY2FsZSBkb2VzIG5vdCBzdXBwb3J0IGNvbXB1dGluZyBhIHJhbmdlIGFzIGEgc2lnbmFsLlxuICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCBiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSA/IHtiaW5TdWZmaXg6ICdyYW5nZSd9IDoge30pLFxuICAgICAgICAvLyB3ZSBoYXZlIHRvIHVzZSBhIHNvcnQgb2JqZWN0IGlmIHNvcnQgPSB0cnVlIHRvIG1ha2UgdGhlIHNvcnQgY29ycmVjdCBieSBiaW4gc3RhcnRcbiAgICAgICAgc29ydDogc29ydCA9PT0gdHJ1ZSB8fCAhaXNTb3J0RmllbGQoc29ydCkgPyB7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pLFxuICAgICAgICAgIG9wOiAnbWluJyAvLyBtaW4gb3IgbWF4IGRvZXNuJ3QgbWF0dGVyIHNpbmNlIHdlIHNvcnQgYnkgdGhlIHN0YXJ0IG9mIHRoZSBiaW4gcmFuZ2VcbiAgICAgICAgfSA6IHNvcnRcbiAgICAgIH1dO1xuICAgIH0gZWxzZSB7IC8vIGNvbnRpbnVvdXMgc2NhbGVzXG4gICAgICBpZiAoY2hhbm5lbCA9PT0gJ3gnIHx8IGNoYW5uZWwgPT09ICd5Jykge1xuICAgICAgICBpZiAoaXNCaW5QYXJhbXMoZmllbGREZWYuYmluKSAmJiBmaWVsZERlZi5iaW4uZXh0ZW50KSB7XG4gICAgICAgICAgcmV0dXJuIFtmaWVsZERlZi5iaW4uZXh0ZW50XTtcbiAgICAgICAgfVxuICAgICAgICAvLyBYL1kgcG9zaXRpb24gaGF2ZSB0byBpbmNsdWRlIHN0YXJ0IGFuZCBlbmQgZm9yIG5vbi1vcmRpbmFsIHNjYWxlXG4gICAgICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtiaW5TdWZmaXg6ICdlbmQnfSlcbiAgICAgICAgfV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiB1c2UgYmluX21pZFxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pXG4gICAgICAgIH1dO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChzb3J0KSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFJBVyB0YWJsZSxcbiAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpLFxuICAgICAgc29ydDogc29ydFxuICAgIH1dO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbClcbiAgICB9XTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkb21haW5Tb3J0KG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB0cnVlIHwgRW5jb2RpbmdTb3J0RmllbGQ8c3RyaW5nPiB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBmaWVsZERlZjogU2NhbGVGaWVsZERlZjxzdHJpbmc+ID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG4gIGNvbnN0IHNvcnQgPSBmaWVsZERlZi5zb3J0O1xuXG4gIC8vIGlmIHRoZSBzb3J0IGlzIHNwZWNpZmllZCB3aXRoIGFycmF5LCB1c2UgdGhlIGRlcml2ZWQgc29ydCBpbmRleCBmaWVsZFxuICBpZiAoaXNTb3J0QXJyYXkoc29ydCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3A6ICdtaW4nLFxuICAgICAgZmllbGQ6IHNvcnRBcnJheUluZGV4RmllbGQobW9kZWwsIGNoYW5uZWwpLFxuICAgICAgb3JkZXI6ICdhc2NlbmRpbmcnXG4gICAgfTtcbiAgfVxuXG4gIC8vIFNvcnRlZCBiYXNlZCBvbiBhbiBhZ2dyZWdhdGUgY2FsY3VsYXRpb24gb3ZlciBhIHNwZWNpZmllZCBzb3J0IGZpZWxkIChvbmx5IGZvciBvcmRpbmFsIHNjYWxlKVxuICBpZiAoaXNTb3J0RmllbGQoc29ydCkpIHtcbiAgICAvLyBmbGF0dGVuIG5lc3RlZCBmaWVsZHNcbiAgICByZXR1cm4ge1xuICAgICAgLi4uc29ydCxcbiAgICAgIC4uLihzb3J0LmZpZWxkID8ge2ZpZWxkOiB1dGlsLnJlcGxhY2VQYXRoSW5GaWVsZChzb3J0LmZpZWxkKX0gOiB7fSlcbiAgICB9O1xuICB9XG5cbiAgaWYgKHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICBvcDogJ21pbicsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKSxcbiAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICB9O1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoWydhc2NlbmRpbmcnLCB1bmRlZmluZWQgLyogZGVmYXVsdCA9YXNjZW5kaW5nKi9dLCBzb3J0KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gc29ydCA9PSBudWxsXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHNjYWxlIGNhbiB1c2UgdW5hZ2dyZWdhdGVkIGRvbWFpbi5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRvbnMgYXBwbGllczpcbiAqIDEuIGBzY2FsZS5kb21haW5gIGlzIGB1bmFnZ3JlZ2F0ZWRgXG4gKiAyLiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBpcyBub3QgYGNvdW50YCBvciBgc3VtYFxuICogMy4gVGhlIHNjYWxlIGlzIHF1YW50aXRhdGl2ZSBvciB0aW1lIHNjYWxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6IHt2YWxpZDogYm9vbGVhbiwgcmVhc29uPzogc3RyaW5nfSB7XG4gIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVEb21haW5IYXNOb0VmZmVjdEZvclJhd0ZpZWxkKGZpZWxkRGVmKVxuICAgIH07XG4gIH1cblxuICBpZiAoIVNIQVJFRF9ET01BSU5fT1BfSU5ERVhbZmllbGREZWYuYWdncmVnYXRlXSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSlcbiAgICB9O1xuICB9XG5cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZWREb21haW5XaXRoTG9nU2NhbGUoZmllbGREZWYpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7dmFsaWQ6IHRydWV9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGRvbWFpbnMgdG8gYSBzaW5nbGUgVmVnYSBzY2FsZSBkb21haW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURvbWFpbnMoZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdKTogVmdEb21haW4ge1xuICBjb25zdCB1bmlxdWVEb21haW5zID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBpZ25vcmUgc29ydCBwcm9wZXJ0eSB3aGVuIGNvbXB1dGluZyB0aGUgdW5pcXVlIGRvbWFpbnNcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgIGNvbnN0IHtzb3J0OiBfcywgLi4uZG9tYWluV2l0aG91dFNvcnR9ID0gZG9tYWluO1xuICAgICAgcmV0dXJuIGRvbWFpbldpdGhvdXRTb3J0O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KSwgdXRpbC5oYXNoKTtcblxuICBjb25zdCBzb3J0czogVmdTb3J0RmllbGRbXSA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGQgPT4ge1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZCkpIHtcbiAgICAgIGNvbnN0IHMgPSBkLnNvcnQ7XG4gICAgICBpZiAocyAhPT0gdW5kZWZpbmVkICYmICF1dGlsLmlzQm9vbGVhbihzKSkge1xuICAgICAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGF0IGlmIG9wIGlzIGNvdW50LCB3ZSBkb24ndCB1c2UgYSBmaWVsZFxuICAgICAgICAgIGRlbGV0ZSBzLmZpZWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzLm9yZGVyID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgICAgIC8vIGRyb3Agb3JkZXI6IGFzY2VuZGluZyBhcyBpdCBpcyB0aGUgZGVmYXVsdFxuICAgICAgICAgIGRlbGV0ZSBzLm9yZGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSkuZmlsdGVyKHMgPT4gcyAhPT0gdW5kZWZpbmVkKSwgdXRpbC5oYXNoKTtcblxuICBpZiAodW5pcXVlRG9tYWlucy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCBkb21haW4gPSBkb21haW5zWzBdO1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSAmJiBzb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgc29ydCA9IHNvcnRzWzBdO1xuICAgICAgaWYgKHNvcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICAgICAgc29ydCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kb21haW4sXG4gICAgICAgIHNvcnRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICAvLyBvbmx5IGtlZXAgc2ltcGxlIHNvcnQgcHJvcGVydGllcyB0aGF0IHdvcmsgd2l0aCB1bmlvbmVkIGRvbWFpbnNcbiAgY29uc3Qgc2ltcGxlU29ydHMgPSB1dGlsLnVuaXF1ZShzb3J0cy5tYXAocyA9PiB7XG4gICAgaWYgKHMgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRvbWFpblNvcnREcm9wcGVkKHMpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSksIHV0aWwuaGFzaCkgYXMgVmdVbmlvblNvcnRGaWVsZFtdO1xuXG4gIGxldCBzb3J0OiBWZ1VuaW9uU29ydEZpZWxkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChzaW1wbGVTb3J0cy5sZW5ndGggPT09IDEpIHtcbiAgICBzb3J0ID0gc2ltcGxlU29ydHNbMF07XG4gIH0gZWxzZSBpZiAoc2ltcGxlU29ydHMubGVuZ3RoID4gMSkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgc29ydCA9IHRydWU7XG4gIH1cblxuICBjb25zdCBhbGxEYXRhID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZCA9PiB7XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkKSkge1xuICAgICAgcmV0dXJuIGQuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pLCB4ID0+IHgpO1xuXG4gIGlmIChhbGxEYXRhLmxlbmd0aCA9PT0gMSAmJiBhbGxEYXRhWzBdICE9PSBudWxsKSB7XG4gICAgLy8gY3JlYXRlIGEgdW5pb24gZG9tYWluIG9mIGRpZmZlcmVudCBmaWVsZHMgd2l0aCBhIHNpbmdsZSBkYXRhIHNvdXJjZVxuICAgIGNvbnN0IGRvbWFpbjogVmdGaWVsZFJlZlVuaW9uRG9tYWluID0ge1xuICAgICAgZGF0YTogYWxsRGF0YVswXSxcbiAgICAgIGZpZWxkczogdW5pcXVlRG9tYWlucy5tYXAoZCA9PiAoZCBhcyBWZ0RhdGFSZWYpLmZpZWxkKSxcbiAgICAgIC4uLihzb3J0ID8ge3NvcnR9IDoge30pXG4gICAgfTtcblxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICByZXR1cm4ge2ZpZWxkczogdW5pcXVlRG9tYWlucywgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSl9O1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZpZWxkIGlmIGEgc2NhbGUgc2luZ2xlIGZpZWxkLlxuICogUmV0dXJuIGB1bmRlZmluZWRgIG90aGVyd2lzZS5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluOiBWZ0RvbWFpbik6IHN0cmluZyB7XG4gIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSAmJiBpc1N0cmluZyhkb21haW4uZmllbGQpKSB7XG4gICAgcmV0dXJuIGRvbWFpbi5maWVsZDtcbiAgfSBlbHNlIGlmIChpc0RhdGFSZWZVbmlvbmVkRG9tYWluKGRvbWFpbikpIHtcbiAgICBsZXQgZmllbGQ7XG4gICAgZm9yIChjb25zdCBub25VbmlvbkRvbWFpbiBvZiBkb21haW4uZmllbGRzKSB7XG4gICAgICBpZiAoaXNEYXRhUmVmRG9tYWluKG5vblVuaW9uRG9tYWluKSAmJiBpc1N0cmluZyhub25VbmlvbkRvbWFpbi5maWVsZCkpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gbm9uVW5pb25Eb21haW4uZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQgIT09IG5vblVuaW9uRG9tYWluLmZpZWxkKSB7XG4gICAgICAgICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIG11bHRpcGxlIGZpZWxkcyBmcm9tIGRpZmZlcmVudCBkYXRhIHNvdXJjZXMuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgICAgICAgIHJldHVybiBmaWVsZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgaWRlbnRpY2FsIGZpZWxkcyBmcm9tIGRpZmZlcmVudCBzb3VyY2UgZGV0ZWN0ZWQuICBXZSB3aWxsIGFzc3VtZSB0aGF0IHRoaXMgaXMgdGhlIHNhbWUgZmllbGQgZnJvbSBhIGRpZmZlcmVudCBmb3JrIG9mIHRoZSBzYW1lIGRhdGEgc291cmNlLiAgSG93ZXZlciwgaWYgdGhpcyBpcyBub3QgY2FzZSwgdGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5YmUgaW5jb3JyZWN0LicpO1xuICAgIHJldHVybiBmaWVsZDtcbiAgfSBlbHNlIGlmIChpc0ZpZWxkUmVmVW5pb25Eb21haW4oZG9tYWluKSkge1xuICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIFdlIHdpbGwgdXNlIHRoZSBmaXJzdCBmaWVsZC4gIFRoZSByZXN1bHQgdmlldyBzaXplIG1heSBiZSBpbmNvcnJlY3QuJyk7XG4gICAgY29uc3QgZmllbGQgPSBkb21haW4uZmllbGRzWzBdO1xuICAgIHJldHVybiBpc1N0cmluZyhmaWVsZCkgPyBmaWVsZCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZURvbWFpbihtb2RlbDogTW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkge1xuICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gIGNvbnN0IGRvbWFpbnMgPSBzY2FsZUNvbXBvbmVudC5kb21haW5zLm1hcChkb21haW4gPT4ge1xuICAgIC8vIENvcnJlY3QgcmVmZXJlbmNlcyB0byBkYXRhIGFzIHRoZSBvcmlnaW5hbCBkb21haW4ncyBkYXRhIHdhcyBkZXRlcm1pbmVkXG4gICAgLy8gaW4gcGFyc2VTY2FsZSwgd2hpY2ggaGFwcGVucyBiZWZvcmUgcGFyc2VEYXRhLiBUaHVzIHRoZSBvcmlnaW5hbCBkYXRhXG4gICAgLy8gcmVmZXJlbmNlIGNhbiBiZSBpbmNvcnJlY3QuXG5cbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgIGRvbWFpbi5kYXRhID0gbW9kZWwubG9va3VwRGF0YVNvdXJjZShkb21haW4uZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH0pO1xuXG4gIC8vIGRvbWFpbnMgaXMgYW4gYXJyYXkgdGhhdCBoYXMgdG8gYmUgbWVyZ2VkIGludG8gYSBzaW5nbGUgdmVnYSBkb21haW5cbiAgcmV0dXJuIG1lcmdlRG9tYWlucyhkb21haW5zKTtcbn1cbiJdfQ==