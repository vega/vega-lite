import * as tslib_1 from "tslib";
import { isString } from 'vega-util';
import { SHARED_DOMAIN_OP_INDEX } from '../../aggregate';
import { binToString } from '../../bin';
import { isScaleChannel } from '../../channel';
import { MAIN, RAW } from '../../data';
import { dateTimeExpr, isDateTime } from '../../datetime';
import * as log from '../../log';
import { hasDiscreteDomain, isBinScale, isSelectionDomain } from '../../scale';
import { isSortArray, isSortField } from '../../sort';
import { hash } from '../../util';
import * as util from '../../util';
import { isDataRefUnionedDomain, isFieldRefUnionDomain } from '../../vega.schema';
import { isDataRefDomain, } from '../../vega.schema';
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
                signal: SELECTION_DOMAIN + hash(specifiedDomain)
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
        if (fieldDef.bin) {
            log.warn(log.message.conflictedDomain(channel));
        }
        else {
            if (isDateTime(domain[0])) {
                return domain.map(function (dt) {
                    return { signal: "{data: " + dateTimeExpr(dt, true) + "}" };
                });
            }
            return [domain];
        }
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
        return [{
                data: data,
                field: model.vgField(channel, { aggregate: 'min' })
            }, {
                data: data,
                field: model.vgField(channel, { aggregate: 'max' })
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
    var sort = model.sort(channel);
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
        return sort;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ25DLE9BQU8sRUFBQyxzQkFBc0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQ3ZELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUFDLGNBQWMsRUFBZSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQVcsWUFBWSxFQUFFLFVBQVUsRUFBQyxNQUFNLGdCQUFnQixDQUFDO0FBRWxFLE9BQU8sS0FBSyxHQUFHLE1BQU0sV0FBVyxDQUFDO0FBQ2pDLE9BQU8sRUFBUyxpQkFBaUIsRUFBRSxVQUFVLEVBQUUsaUJBQWlCLEVBQXlCLE1BQU0sYUFBYSxDQUFDO0FBQzdHLE9BQU8sRUFBQyxXQUFXLEVBQUUsV0FBVyxFQUFZLE1BQU0sWUFBWSxDQUFDO0FBQy9ELE9BQU8sRUFBQyxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDaEMsT0FBTyxLQUFLLElBQUksTUFBTSxZQUFZLENBQUM7QUFDbkMsT0FBTyxFQUFDLHNCQUFzQixFQUFFLHFCQUFxQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDaEYsT0FBTyxFQUNMLGVBQWUsR0FPaEIsTUFBTSxtQkFBbUIsQ0FBQztBQUMzQixPQUFPLEVBQUMsZ0JBQWdCLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDM0MsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFDdEQsT0FBTyxFQUFDLGtCQUFrQixFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDcEQsT0FBTyxFQUFDLFlBQVksRUFBRSxXQUFXLEVBQVEsTUFB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bCc7XG5pbXBvcnQge1NIQVJFRF9ET01BSU5fT1BfSU5ERVh9IGZyb20gJy4uLy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2JpblRvU3RyaW5nfSBmcm9tICcuLi8uLi9iaW4nO1xuaW1wb3J0IHtpc1NjYWxlQ2hhbm5lbCwgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7TUFJTiwgUkFXfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7RGF0ZVRpbWUsIGRhdGVUaW1lRXhwciwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0RvbWFpbiwgaGFzRGlzY3JldGVEb21haW4sIGlzQmluU2NhbGUsIGlzU2VsZWN0aW9uRG9tYWluLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2lzU29ydEFycmF5LCBpc1NvcnRGaWVsZCwgU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7aGFzaH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc0RhdGFSZWZVbmlvbmVkRG9tYWluLCBpc0ZpZWxkUmVmVW5pb25Eb21haW59IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7XG4gIGlzRGF0YVJlZkRvbWFpbixcbiAgVmdEYXRhUmVmLFxuICBWZ0RvbWFpbixcbiAgVmdGaWVsZFJlZlVuaW9uRG9tYWluLFxuICBWZ05vblVuaW9uRG9tYWluLFxuICBWZ1NvcnRGaWVsZCxcbiAgVmdVbmlvblNvcnRGaWVsZCxcbn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtzb3J0QXJyYXlJbmRleEZpZWxkfSBmcm9tICcuLi9kYXRhL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0ZBQ0VUX1NDQUxFX1BSRUZJWH0gZnJvbSAnLi4vZGF0YS9vcHRpbWl6ZSc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge1NFTEVDVElPTl9ET01BSU59IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtVbml0TW9kZWx9IGZyb20gJy4uL3VuaXQnO1xuaW1wb3J0IHtTY2FsZUNvbXBvbmVudEluZGV4fSBmcm9tICcuL2NvbXBvbmVudCc7XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlU2NhbGVEb21haW4obW9kZWw6IE1vZGVsKSB7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBwYXJzZVVuaXRTY2FsZURvbWFpbihtb2RlbCk7XG4gIH0gZWxzZSB7XG4gICAgcGFyc2VOb25Vbml0U2NhbGVEb21haW4obW9kZWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHBhcnNlVW5pdFNjYWxlRG9tYWluKG1vZGVsOiBVbml0TW9kZWwpIHtcbiAgY29uc3Qgc2NhbGVzID0gbW9kZWwuc3BlY2lmaWVkU2NhbGVzO1xuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgdXRpbC5rZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBjb25zdCBzcGVjaWZpZWRTY2FsZSA9IHNjYWxlc1tjaGFubmVsXTtcbiAgICBjb25zdCBzcGVjaWZpZWREb21haW4gPSBzcGVjaWZpZWRTY2FsZSA/IHNwZWNpZmllZFNjYWxlLmRvbWFpbiA6IHVuZGVmaW5lZDtcblxuICAgIGNvbnN0IGRvbWFpbnMgPSBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWwsIGNoYW5uZWwpO1xuICAgIGNvbnN0IGxvY2FsU2NhbGVDbXB0ID0gbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF07XG4gICAgbG9jYWxTY2FsZUNtcHQuZG9tYWlucyA9IGRvbWFpbnM7XG5cbiAgICBpZiAoaXNTZWxlY3Rpb25Eb21haW4oc3BlY2lmaWVkRG9tYWluKSkge1xuICAgICAgLy8gQXMgc2NhbGUgcGFyc2luZyBvY2N1cnMgYmVmb3JlIHNlbGVjdGlvbiBwYXJzaW5nLCB3ZSB1c2UgYSB0ZW1wb3JhcnlcbiAgICAgIC8vIHNpZ25hbCBoZXJlIGFuZCBhcHBlbmQgdGhlIHNjYWxlLmRvbWFpbiBkZWZpbml0aW9uLiBUaGlzIGlzIHJlcGxhY2VkXG4gICAgICAvLyB3aXRoIHRoZSBjb3JyZWN0IGRvbWFpblJhdyBzaWduYWwgZHVyaW5nIHNjYWxlIGFzc2VtYmx5LlxuICAgICAgLy8gRm9yIG1vcmUgaW5mb3JtYXRpb24sIHNlZSBpc1Jhd1NlbGVjdGlvbkRvbWFpbiBpbiBzZWxlY3Rpb24udHMuXG5cbiAgICAgIC8vIEZJWE1FOiByZXBsYWNlIHRoaXMgd2l0aCBhIHNwZWNpYWwgcHJvcGVydHkgaW4gdGhlIHNjYWxlQ29tcG9uZW50XG4gICAgICBsb2NhbFNjYWxlQ21wdC5zZXQoJ2RvbWFpblJhdycsIHtcbiAgICAgICAgc2lnbmFsOiBTRUxFQ1RJT05fRE9NQUlOICsgaGFzaChzcGVjaWZpZWREb21haW4pXG4gICAgICB9LCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuY29tcG9uZW50LmRhdGEuaXNGYWNldGVkKSB7XG4gICAgICAvLyBnZXQgcmVzb2x2ZSBmcm9tIGNsb3Nlc3QgZmFjZXQgcGFyZW50IGFzIHRoaXMgZGVjaWRlcyB3aGV0aGVyIHdlIG5lZWQgdG8gcmVmZXIgdG8gY2xvbmVkIHN1YnRyZWUgb3Igbm90XG4gICAgICBsZXQgZmFjZXRQYXJlbnQ6IE1vZGVsID0gbW9kZWw7XG4gICAgICB3aGlsZSAoIWlzRmFjZXRNb2RlbChmYWNldFBhcmVudCkgJiYgZmFjZXRQYXJlbnQucGFyZW50KSB7XG4gICAgICAgIGZhY2V0UGFyZW50ID0gZmFjZXRQYXJlbnQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZmFjZXRQYXJlbnQuY29tcG9uZW50LnJlc29sdmUuc2NhbGVbY2hhbm5lbF07XG5cbiAgICAgIGlmIChyZXNvbHZlID09PSAnc2hhcmVkJykge1xuICAgICAgICBmb3IgKGNvbnN0IGRvbWFpbiBvZiBkb21haW5zKSB7XG4gICAgICAgICAgLy8gUmVwbGFjZSB0aGUgc2NhbGUgZG9tYWluIHdpdGggZGF0YSBvdXRwdXQgZnJvbSBhIGNsb25lZCBzdWJ0cmVlIGFmdGVyIHRoZSBmYWNldC5cbiAgICAgICAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgICAgICAgIC8vIHVzZSBkYXRhIGZyb20gY2xvbmVkIHN1YnRyZWUgKHdoaWNoIGlzIHRoZSBzYW1lIGFzIGRhdGEgYnV0IHdpdGggYSBwcmVmaXggYWRkZWQgb25jZSlcbiAgICAgICAgICAgIGRvbWFpbi5kYXRhID0gRkFDRVRfU0NBTEVfUFJFRklYICsgZG9tYWluLmRhdGEucmVwbGFjZShGQUNFVF9TQ0FMRV9QUkVGSVgsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZURvbWFpbihtb2RlbDogTW9kZWwpIHtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIHBhcnNlU2NhbGVEb21haW4oY2hpbGQpO1xuICB9XG5cbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgbGV0IGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXTtcbiAgICBsZXQgZG9tYWluUmF3ID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZENvbXBvbmVudCkge1xuICAgICAgICBpZiAoZG9tYWlucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZG9tYWlucyA9IGNoaWxkQ29tcG9uZW50LmRvbWFpbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9tYWlucyA9IGRvbWFpbnMuY29uY2F0KGNoaWxkQ29tcG9uZW50LmRvbWFpbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHIgPSBjaGlsZENvbXBvbmVudC5nZXQoJ2RvbWFpblJhdycpO1xuICAgICAgICBpZiAoZG9tYWluUmF3ICYmIGRyICYmIGRvbWFpblJhdy5zaWduYWwgIT09IGRyLnNpZ25hbCkge1xuICAgICAgICAgIGxvZy53YXJuKCdUaGUgc2FtZSBzZWxlY3Rpb24gbXVzdCBiZSB1c2VkIHRvIG92ZXJyaWRlIHNjYWxlIGRvbWFpbnMgaW4gYSBsYXllcmVkIHZpZXcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZG9tYWluUmF3ID0gZHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0uZG9tYWlucyA9IGRvbWFpbnM7XG5cbiAgICBpZiAoZG9tYWluUmF3KSB7XG4gICAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5zZXQoJ2RvbWFpblJhdycsIGRvbWFpblJhdywgdHJ1ZSk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGl0IGlzIG5vdCBhcHBsaWNhYmxlXG4gKiBBZGQgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZCBhbmQgY29uZmlnLnNjYWxlLnVzZVVuYWdncmVnYXRlZERvbWFpbiBpcyB0cnVlLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4oZG9tYWluOiBEb21haW4sIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3Qge3ZhbGlkLCByZWFzb259ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmKCF2YWxpZCkge1xuICAgICAgbG9nLndhcm4ocmVhc29uKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRvbWFpbiA9PT0gdW5kZWZpbmVkICYmIHNjYWxlQ29uZmlnLnVzZVVuYWdncmVnYXRlZERvbWFpbikge1xuICAgIC8vIEFwcGx5IGNvbmZpZyBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZC5cbiAgICBjb25zdCB7dmFsaWR9ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmICh2YWxpZCkge1xuICAgICAgcmV0dXJuICd1bmFnZ3JlZ2F0ZWQnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb21haW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG5cbiAgY29uc3QgZG9tYWluID0gbm9ybWFsaXplVW5hZ2dyZWdhdGVkRG9tYWluKG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpLCBtb2RlbC5maWVsZERlZihjaGFubmVsKSwgc2NhbGVUeXBlLCBtb2RlbC5jb25maWcuc2NhbGUpO1xuICBpZiAoZG9tYWluICE9PSBtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSkge1xuICAgIG1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSA9IHtcbiAgICAgIC4uLm1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSxcbiAgICAgIGRvbWFpblxuICAgIH07XG4gIH1cblxuICAvLyBJZiBjaGFubmVsIGlzIGVpdGhlciBYIG9yIFkgdGhlbiB1bmlvbiB0aGVtIHdpdGggWDIgJiBZMiBpZiB0aGV5IGV4aXN0XG4gIGlmIChjaGFubmVsID09PSAneCcgJiYgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4MicpKSB7XG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneCcpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gnKS5jb25jYXQocGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3kyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd5JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneScpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRvbWFpbjogRG9tYWluLCBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwgfCAneDInIHwgJ3kyJyk6IFZnTm9uVW5pb25Eb21haW5bXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKGRvbWFpbiAmJiBkb21haW4gIT09ICd1bmFnZ3JlZ2F0ZWQnICYmICFpc1NlbGVjdGlvbkRvbWFpbihkb21haW4pKSB7IC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY29uZmxpY3RlZERvbWFpbihjaGFubmVsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc0RhdGVUaW1lKGRvbWFpblswXSkpIHtcbiAgICAgICAgcmV0dXJuIChkb21haW4gYXMgRGF0ZVRpbWVbXSkubWFwKChkdCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7c2lnbmFsOiBge2RhdGE6ICR7ZGF0ZVRpbWVFeHByKGR0LCB0cnVlKX19YH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtkb21haW5dO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2s7XG4gIGlmIChzdGFjayAmJiBjaGFubmVsID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICBpZihzdGFjay5vZmZzZXQgPT09ICdub3JtYWxpemUnKSB7XG4gICAgICByZXR1cm4gW1swLCAxXV07XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7c3VmZml4OiAnc3RhcnQnfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge3N1ZmZpeDogJ2VuZCd9KVxuICAgIH1dO1xuICB9XG5cbiAgY29uc3Qgc29ydCA9IGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpID8gZG9tYWluU29ydChtb2RlbCwgY2hhbm5lbCwgc2NhbGVUeXBlKSA6IHVuZGVmaW5lZDtcblxuICBpZiAoZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2FnZ3JlZ2F0ZTogJ21pbid9KVxuICAgIH0sIHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7YWdncmVnYXRlOiAnbWF4J30pXG4gICAgfV07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYuYmluKSB7IC8vIGJpblxuICAgIGlmIChpc0JpblNjYWxlKHNjYWxlVHlwZSkpIHtcbiAgICAgIGNvbnN0IHNpZ25hbCA9IG1vZGVsLmdldE5hbWUoYCR7YmluVG9TdHJpbmcoZmllbGREZWYuYmluKX1fJHtmaWVsZERlZi5maWVsZH1fYmluc2ApO1xuICAgICAgcmV0dXJuIFt7c2lnbmFsOiBgc2VxdWVuY2UoJHtzaWduYWx9LnN0YXJ0LCAke3NpZ25hbH0uc3RvcCArICR7c2lnbmFsfS5zdGVwLCAke3NpZ25hbH0uc3RlcClgfV07XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICAgIC8vIG9yZGluYWwgYmluIHNjYWxlIHRha2VzIGRvbWFpbiBmcm9tIGJpbl9yYW5nZSwgb3JkZXJlZCBieSBiaW4gc3RhcnRcbiAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBib3RoIGF4aXMtYmFzZWQgc2NhbGUgKHgveSkgYW5kIGxlZ2VuZC1iYXNlZCBzY2FsZSAob3RoZXIgY2hhbm5lbHMpLlxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgUkFXIHRhYmxlLFxuICAgICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgICAgLy8gVXNlIHJhbmdlIGlmIHdlIGFkZGVkIGl0IGFuZCB0aGUgc2NhbGUgZG9lcyBub3Qgc3VwcG9ydCBjb21wdXRpbmcgYSByYW5nZSBhcyBhIHNpZ25hbC5cbiAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwgYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZiwgY2hhbm5lbCkgPyB7YmluU3VmZml4OiAncmFuZ2UnfSA6IHt9KSxcbiAgICAgICAgLy8gd2UgaGF2ZSB0byB1c2UgYSBzb3J0IG9iamVjdCBpZiBzb3J0ID0gdHJ1ZSB0byBtYWtlIHRoZSBzb3J0IGNvcnJlY3QgYnkgYmluIHN0YXJ0XG4gICAgICAgIHNvcnQ6IHNvcnQgPT09IHRydWUgfHwgIWlzU29ydEZpZWxkKHNvcnQpID8ge1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KSxcbiAgICAgICAgICBvcDogJ21pbicgLy8gbWluIG9yIG1heCBkb2Vzbid0IG1hdHRlciBzaW5jZSB3ZSBzb3J0IGJ5IHRoZSBzdGFydCBvZiB0aGUgYmluIHJhbmdlXG4gICAgICAgIH0gOiBzb3J0XG4gICAgICB9XTtcbiAgICB9IGVsc2UgeyAvLyBjb250aW51b3VzIHNjYWxlc1xuICAgICAgaWYgKGNoYW5uZWwgPT09ICd4JyB8fCBjaGFubmVsID09PSAneScpIHtcbiAgICAgICAgLy8gWC9ZIHBvc2l0aW9uIGhhdmUgdG8gaW5jbHVkZSBzdGFydCBhbmQgZW5kIGZvciBub24tb3JkaW5hbCBzY2FsZVxuICAgICAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnZW5kJ30pXG4gICAgICAgIH1dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogdXNlIGJpbl9taWRcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoc29ydCkge1xuICAgIHJldHVybiBbe1xuICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBSQVcgdGFibGUsXG4gICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKSxcbiAgICAgIHNvcnQ6IHNvcnRcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpXG4gICAgfV07XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluU29ydChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlKTogdHJ1ZSB8IFNvcnRGaWVsZDxzdHJpbmc+IHtcbiAgaWYgKCFoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHNvcnQgPSBtb2RlbC5zb3J0KGNoYW5uZWwpO1xuXG4gIC8vIGlmIHRoZSBzb3J0IGlzIHNwZWNpZmllZCB3aXRoIGFycmF5LCB1c2UgdGhlIGRlcml2ZWQgc29ydCBpbmRleCBmaWVsZFxuICBpZiAoaXNTb3J0QXJyYXkoc29ydCkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3A6ICdtaW4nLFxuICAgICAgZmllbGQ6IHNvcnRBcnJheUluZGV4RmllbGQobW9kZWwsIGNoYW5uZWwpLFxuICAgICAgb3JkZXI6ICdhc2NlbmRpbmcnXG4gICAgfTtcbiAgfVxuXG4gIC8vIFNvcnRlZCBiYXNlZCBvbiBhbiBhZ2dyZWdhdGUgY2FsY3VsYXRpb24gb3ZlciBhIHNwZWNpZmllZCBzb3J0IGZpZWxkIChvbmx5IGZvciBvcmRpbmFsIHNjYWxlKVxuICBpZiAoaXNTb3J0RmllbGQoc29ydCkpIHtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuXG4gIGlmIChzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3A6ICdtaW4nLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCksXG4gICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFsnYXNjZW5kaW5nJywgdW5kZWZpbmVkIC8qIGRlZmF1bHQgPWFzY2VuZGluZyovXSwgc29ydCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHNvcnQgPT0gbnVsbFxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBzY2FsZSBjYW4gdXNlIHVuYWdncmVnYXRlZCBkb21haW4uXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0b25zIGFwcGxpZXM6XG4gKiAxLiBgc2NhbGUuZG9tYWluYCBpcyBgdW5hZ2dyZWdhdGVkYFxuICogMi4gQWdncmVnYXRpb24gZnVuY3Rpb24gaXMgbm90IGBjb3VudGAgb3IgYHN1bWBcbiAqIDMuIFRoZSBzY2FsZSBpcyBxdWFudGl0YXRpdmUgb3IgdGltZSBzY2FsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB7dmFsaWQ6IGJvb2xlYW4sIHJlYXNvbj86IHN0cmluZ30ge1xuICBpZiAoIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZilcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFTSEFSRURfRE9NQUlOX09QX0lOREVYW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcChmaWVsZERlZi5hZ2dyZWdhdGUpXG4gICAgfTtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIGlmIChzY2FsZVR5cGUgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVkRG9tYWluV2l0aExvZ1NjYWxlKGZpZWxkRGVmKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge3ZhbGlkOiB0cnVlfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBkb21haW5zIHRvIGEgc2luZ2xlIFZlZ2Egc2NhbGUgZG9tYWluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEb21haW5zKGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXSk6IFZnRG9tYWluIHtcbiAgY29uc3QgdW5pcXVlRG9tYWlucyA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGRvbWFpbiA9PiB7XG4gICAgLy8gaWdub3JlIHNvcnQgcHJvcGVydHkgd2hlbiBjb21wdXRpbmcgdGhlIHVuaXF1ZSBkb21haW5zXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBjb25zdCB7c29ydDogX3MsIC4uLmRvbWFpbldpdGhvdXRTb3J0fSA9IGRvbWFpbjtcbiAgICAgIHJldHVybiBkb21haW5XaXRob3V0U29ydDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfSksIHV0aWwuaGFzaCk7XG5cbiAgY29uc3Qgc29ydHM6IFZnU29ydEZpZWxkW10gPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkID0+IHtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGQpKSB7XG4gICAgICBjb25zdCBzID0gZC5zb3J0O1xuICAgICAgaWYgKHMgIT09IHVuZGVmaW5lZCAmJiAhdXRpbC5pc0Jvb2xlYW4ocykpIHtcbiAgICAgICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICAvLyBsZXQncyBtYWtlIHN1cmUgdGhhdCBpZiBvcCBpcyBjb3VudCwgd2UgZG9uJ3QgdXNlIGEgZmllbGRcbiAgICAgICAgICBkZWxldGUgcy5maWVsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5vcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAvLyBkcm9wIG9yZGVyOiBhc2NlbmRpbmcgYXMgaXQgaXMgdGhlIGRlZmF1bHRcbiAgICAgICAgICBkZWxldGUgcy5vcmRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pLmZpbHRlcihzID0+IHMgIT09IHVuZGVmaW5lZCksIHV0aWwuaGFzaCk7XG5cbiAgaWYgKHVuaXF1ZURvbWFpbnMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgZG9tYWluID0gZG9tYWluc1swXTtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgc29ydHMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHNvcnQgPSBzb3J0c1swXTtcbiAgICAgIGlmIChzb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgICAgIHNvcnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZG9tYWluLFxuICAgICAgICBzb3J0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgLy8gb25seSBrZWVwIHNpbXBsZSBzb3J0IHByb3BlcnRpZXMgdGhhdCB3b3JrIHdpdGggdW5pb25lZCBkb21haW5zXG4gIGNvbnN0IHNpbXBsZVNvcnRzID0gdXRpbC51bmlxdWUoc29ydHMubWFwKHMgPT4ge1xuICAgIGlmIChzID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kb21haW5Tb3J0RHJvcHBlZChzKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pLCB1dGlsLmhhc2gpIGFzIFZnVW5pb25Tb3J0RmllbGRbXTtcblxuICBsZXQgc29ydDogVmdVbmlvblNvcnRGaWVsZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoc2ltcGxlU29ydHMubGVuZ3RoID09PSAxKSB7XG4gICAgc29ydCA9IHNpbXBsZVNvcnRzWzBdO1xuICB9IGVsc2UgaWYgKHNpbXBsZVNvcnRzLmxlbmd0aCA+IDEpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgIHNvcnQgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgYWxsRGF0YSA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGQgPT4ge1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZCkpIHtcbiAgICAgIHJldHVybiBkLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9KSwgeCA9PiB4KTtcblxuICBpZiAoYWxsRGF0YS5sZW5ndGggPT09IDEgJiYgYWxsRGF0YVswXSAhPT0gbnVsbCkge1xuICAgIC8vIGNyZWF0ZSBhIHVuaW9uIGRvbWFpbiBvZiBkaWZmZXJlbnQgZmllbGRzIHdpdGggYSBzaW5nbGUgZGF0YSBzb3VyY2VcbiAgICBjb25zdCBkb21haW46IFZnRmllbGRSZWZVbmlvbkRvbWFpbiA9IHtcbiAgICAgIGRhdGE6IGFsbERhdGFbMF0sXG4gICAgICBmaWVsZHM6IHVuaXF1ZURvbWFpbnMubWFwKGQgPT4gKGQgYXMgVmdEYXRhUmVmKS5maWVsZCksXG4gICAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KVxuICAgIH07XG5cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVuaXF1ZURvbWFpbnMsIC4uLihzb3J0ID8ge3NvcnR9IDoge30pfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmaWVsZCBpZiBhIHNjYWxlIHNpbmdsZSBmaWVsZC5cbiAqIFJldHVybiBgdW5kZWZpbmVkYCBvdGhlcndpc2UuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbjogVmdEb21haW4pOiBzdHJpbmcge1xuICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgaXNTdHJpbmcoZG9tYWluLmZpZWxkKSkge1xuICAgIHJldHVybiBkb21haW4uZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNEYXRhUmVmVW5pb25lZERvbWFpbihkb21haW4pKSB7XG4gICAgbGV0IGZpZWxkO1xuICAgIGZvciAoY29uc3Qgbm9uVW5pb25Eb21haW4gb2YgZG9tYWluLmZpZWxkcykge1xuICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihub25VbmlvbkRvbWFpbikgJiYgaXNTdHJpbmcobm9uVW5pb25Eb21haW4uZmllbGQpKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9IG5vblVuaW9uRG9tYWluLmZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkICE9PSBub25VbmlvbkRvbWFpbi5maWVsZCkge1xuICAgICAgICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzLiAgV2Ugd2lsbCB1c2UgdGhlIGZpcnN0IGZpZWxkLiAgVGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5IGJlIGluY29ycmVjdC4nKTtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIGlkZW50aWNhbCBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgc291cmNlIGRldGVjdGVkLiAgV2Ugd2lsbCBhc3N1bWUgdGhhdCB0aGlzIGlzIHRoZSBzYW1lIGZpZWxkIGZyb20gYSBkaWZmZXJlbnQgZm9yayBvZiB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIEhvd2V2ZXIsIGlmIHRoaXMgaXMgbm90IGNhc2UsIHRoZSByZXN1bHQgdmlldyBzaXplIG1heWJlIGluY29ycmVjdC4nKTtcbiAgICByZXR1cm4gZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZFJlZlVuaW9uRG9tYWluKGRvbWFpbikpIHtcbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgbXVsdGlwbGUgZmllbGRzIGZyb20gdGhlIHNhbWUgZGF0YSBzb3VyY2UuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9tYWluLmZpZWxkc1swXTtcbiAgICByZXR1cm4gaXNTdHJpbmcoZmllbGQpID8gZmllbGQgOiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVEb21haW4obW9kZWw6IE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpIHtcbiAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICBjb25zdCBkb21haW5zID0gc2NhbGVDb21wb25lbnQuZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBDb3JyZWN0IHJlZmVyZW5jZXMgdG8gZGF0YSBhcyB0aGUgb3JpZ2luYWwgZG9tYWluJ3MgZGF0YSB3YXMgZGV0ZXJtaW5lZFxuICAgIC8vIGluIHBhcnNlU2NhbGUsIHdoaWNoIGhhcHBlbnMgYmVmb3JlIHBhcnNlRGF0YS4gVGh1cyB0aGUgb3JpZ2luYWwgZGF0YVxuICAgIC8vIHJlZmVyZW5jZSBjYW4gYmUgaW5jb3JyZWN0LlxuXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBkb21haW4uZGF0YSA9IG1vZGVsLmxvb2t1cERhdGFTb3VyY2UoZG9tYWluLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KTtcblxuICAvLyBkb21haW5zIGlzIGFuIGFycmF5IHRoYXQgaGFzIHRvIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIHZlZ2EgZG9tYWluXG4gIHJldHVybiBtZXJnZURvbWFpbnMoZG9tYWlucyk7XG59XG4iXX0=