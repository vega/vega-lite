"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vega_util_1 = require("vega-util");
var aggregate_1 = require("../../aggregate");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var log = require("../../log");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var util_1 = require("../../util");
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var vega_schema_2 = require("../../vega.schema");
var common_1 = require("../common");
var optimize_1 = require("../data/optimize");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
function parseScaleDomain(model) {
    if (model_1.isUnitModel(model)) {
        parseUnitScaleDomain(model);
    }
    else {
        parseNonUnitScaleDomain(model);
    }
}
exports.parseScaleDomain = parseScaleDomain;
function parseUnitScaleDomain(model) {
    var scales = model.specifiedScales;
    var localScaleComponents = model.component.scales;
    util.keys(localScaleComponents).forEach(function (channel) {
        var specifiedScale = scales[channel];
        var specifiedDomain = specifiedScale ? specifiedScale.domain : undefined;
        var domains = parseDomainForChannel(model, channel);
        var localScaleCmpt = localScaleComponents[channel];
        localScaleCmpt.domains = domains;
        if (scale_1.isSelectionDomain(specifiedDomain)) {
            // As scale parsing occurs before selection parsing, we use a temporary
            // signal here and append the scale.domain definition. This is replaced
            // with the correct domainRaw signal during scale assembly.
            // For more information, see isRawSelectionDomain in selection.ts.
            // FIXME: replace this with a special property in the scaleComponent
            localScaleCmpt.set('domainRaw', {
                signal: selection_1.SELECTION_DOMAIN + util_1.hash(specifiedDomain)
            }, true);
        }
        if (model.component.data.isFaceted) {
            // get resolve from closest facet parent as this decides whether we need to refer to cloned subtree or not
            var facetParent = model;
            while (!model_1.isFacetModel(facetParent) && facetParent.parent) {
                facetParent = facetParent.parent;
            }
            var resolve = facetParent.component.resolve.scale[channel];
            if (resolve === 'shared') {
                for (var _i = 0, domains_1 = domains; _i < domains_1.length; _i++) {
                    var domain = domains_1[_i];
                    // Replace the scale domain with data output from a cloned subtree after the facet.
                    if (vega_schema_2.isDataRefDomain(domain)) {
                        // use data from cloned subtree (which is the same as data but with a prefix added once)
                        domain.data = optimize_1.FACET_SCALE_PREFIX + domain.data.replace(optimize_1.FACET_SCALE_PREFIX, '');
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
        // FIXME: Arvind -- Please revise logic for merging selectionDomain / domainRaw
        var domains;
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
            }
        }
        localScaleComponents[channel].domains = domains;
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
function parseDomainForChannel(model, channel) {
    var scaleType = model.getScaleComponent(channel).get('type');
    var domain = normalizeUnaggregatedDomain(model.scaleDomain(channel), model.fieldDef(channel), scaleType, model.config.scale);
    if (domain !== model.scaleDomain(channel)) {
        model.specifiedScales[channel] = __assign({}, model.specifiedScales[channel], { domain: domain });
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
exports.parseDomainForChannel = parseDomainForChannel;
function parseSingleChannelDomain(scaleType, domain, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (domain && domain !== 'unaggregated' && !scale_1.isSelectionDomain(domain)) {
        if (fieldDef.bin) {
            log.warn(log.message.conflictedDomain(channel));
        }
        else {
            if (datetime_1.isDateTime(domain[0])) {
                return domain.map(function (dt) {
                    return { signal: "{data: " + datetime_1.dateTimeExpr(dt, true) + "}" };
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
        var data = model.requestDataName(data_1.MAIN);
        return [{
                data: data,
                field: model.vgField(channel, { suffix: 'start' })
            }, {
                data: data,
                field: model.vgField(channel, { suffix: 'end' })
            }];
    }
    var sort = channel_1.isScaleChannel(channel) ? domainSort(model, channel, scaleType) : undefined;
    if (domain === 'unaggregated') {
        var data = model.requestDataName(data_1.MAIN);
        return [{
                data: data,
                field: model.vgField(channel, { aggregate: 'min' })
            }, {
                data: data,
                field: model.vgField(channel, { aggregate: 'max' })
            }];
    }
    else if (fieldDef.bin) {
        if (scale_1.isBinScale(scaleType)) {
            var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
            return [{ signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" }];
        }
        if (scale_1.hasDiscreteDomain(scaleType)) {
            // ordinal bin scale takes domain from bin_range, ordered by bin start
            // This is useful for both axis-based scale (x/y) and legend-based scale (other channels).
            return [{
                    // If sort by aggregation of a specified sort field, we need to use RAW table,
                    // so we can aggregate values for the scale independently from the main aggregation.
                    data: util.isBoolean(sort) ? model.requestDataName(data_1.MAIN) : model.requestDataName(data_1.RAW),
                    // Use range if we added it and the scale does not support computing a range as a signal.
                    field: model.vgField(channel, common_1.binRequiresRange(fieldDef, channel) ? { binSuffix: 'range' } : {}),
                    // we have to use a sort object if sort = true to make the sort correct by bin start
                    sort: sort === true || !sort_1.isSortField(sort) ? {
                        field: model.vgField(channel, {}),
                        op: 'min' // min or max doesn't matter since we sort by the start of the bin range
                    } : sort
                }];
        }
        else {
            if (channel === 'x' || channel === 'y') {
                // X/Y position have to include start and end for non-ordinal scale
                var data = model.requestDataName(data_1.MAIN);
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
                        data: model.requestDataName(data_1.MAIN),
                        field: model.vgField(channel, {})
                    }];
            }
        }
    }
    else if (sort) {
        return [{
                // If sort by aggregation of a specified sort field, we need to use RAW table,
                // so we can aggregate values for the scale independently from the main aggregation.
                data: util.isBoolean(sort) ? model.requestDataName(data_1.MAIN) : model.requestDataName(data_1.RAW),
                field: model.vgField(channel),
                sort: sort
            }];
    }
    else {
        return [{
                data: model.requestDataName(data_1.MAIN),
                field: model.vgField(channel)
            }];
    }
}
function domainSort(model, channel, scaleType) {
    if (!scale_1.hasDiscreteDomain(scaleType)) {
        return undefined;
    }
    var sort = model.sort(channel);
    // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
    if (sort_1.isSortField(sort)) {
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
exports.domainSort = domainSort;
/**
 * Determine if a scale can use unaggregated domain.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `scale.domain` is `unaggregated`
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
function canUseUnaggregatedDomain(fieldDef, scaleType) {
    if (!fieldDef.aggregate) {
        return {
            valid: false,
            reason: log.message.unaggregateDomainHasNoEffectForRawField(fieldDef)
        };
    }
    if (!aggregate_1.SHARED_DOMAIN_OP_INDEX[fieldDef.aggregate]) {
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
exports.canUseUnaggregatedDomain = canUseUnaggregatedDomain;
/**
 * Converts an array of domains to a single Vega scale domain.
 */
function mergeDomains(domains) {
    var uniqueDomains = util.unique(domains.map(function (domain) {
        // ignore sort property when computing the unique domains
        if (vega_schema_2.isDataRefDomain(domain)) {
            var _s = domain.sort, domainWithoutSort = __rest(domain, ["sort"]);
            return domainWithoutSort;
        }
        return domain;
    }), util.hash);
    var sorts = util.unique(domains.map(function (d) {
        if (vega_schema_2.isDataRefDomain(d)) {
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
        if (vega_schema_2.isDataRefDomain(domain) && sorts.length > 0) {
            var sort_2 = sorts[0];
            if (sorts.length > 1) {
                log.warn(log.message.MORE_THAN_ONE_SORT);
                sort_2 = true;
            }
            return __assign({}, domain, { sort: sort_2 });
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
        if (vega_schema_2.isDataRefDomain(d)) {
            return d.data;
        }
        return null;
    }), function (x) { return x; });
    if (allData.length === 1 && allData[0] !== null) {
        // create a union domain of different fields with a single data source
        var domain = __assign({ data: allData[0], fields: uniqueDomains.map(function (d) { return d.field; }) }, (sort ? { sort: sort } : {}));
        return domain;
    }
    return __assign({ fields: uniqueDomains }, (sort ? { sort: sort } : {}));
}
exports.mergeDomains = mergeDomains;
/**
 * Return a field if a scale single field.
 * Return `undefined` otherwise.
 *
 */
function getFieldFromDomain(domain) {
    if (vega_schema_2.isDataRefDomain(domain) && vega_util_1.isString(domain.field)) {
        return domain.field;
    }
    else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
        var field = void 0;
        for (var _i = 0, _a = domain.fields; _i < _a.length; _i++) {
            var nonUnionDomain = _a[_i];
            if (vega_schema_2.isDataRefDomain(nonUnionDomain) && vega_util_1.isString(nonUnionDomain.field)) {
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
    else if (vega_schema_1.isFieldRefUnionDomain(domain)) {
        log.warn('Detected faceted independent scales that union domain of multiple fields from the same data source.  We will use the first field.  The result view size may be incorrect.');
        var field = domain.fields[0];
        return vega_util_1.isString(field) ? field : undefined;
    }
    return undefined;
}
exports.getFieldFromDomain = getFieldFromDomain;
function assembleDomain(model, channel) {
    var scaleComponent = model.component.scales[channel];
    var domains = scaleComponent.domains.map(function (domain) {
        // Correct references to data as the original domain's data was determined
        // in parseScale, which happens before parseData. Thus the original data
        // reference can be incorrect.
        if (vega_schema_2.isDataRefDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
        }
        return domain;
    });
    // domains is an array that has to be merged into a single vega domain
    return mergeDomains(domains);
}
exports.assembleDomain = assembleDomain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBbUM7QUFDbkMsNkNBQXVEO0FBQ3ZELGlDQUFzQztBQUN0Qyx5Q0FBMkQ7QUFDM0QsbUNBQXFDO0FBQ3JDLDJDQUFrRTtBQUVsRSwrQkFBaUM7QUFDakMscUNBQTZHO0FBQzdHLG1DQUFrRDtBQUNsRCxtQ0FBZ0M7QUFDaEMsaUNBQW1DO0FBQ25DLGlEQUFnRjtBQUNoRixpREFRMkI7QUFDM0Isb0NBQTJDO0FBQzNDLDZDQUFvRDtBQUNwRCxrQ0FBMEQ7QUFDMUQsb0RBQXdEO0FBS3hELDBCQUFpQyxLQUFZO0lBQzNDLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7QUFDSCxDQUFDO0FBTkQsNENBTUM7QUFFRCw4QkFBOEIsS0FBZ0I7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztJQUNyQyxJQUFNLG9CQUFvQixHQUF3QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUV6RSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDNUQsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRTNFLElBQU0sT0FBTyxHQUFHLHFCQUFxQixD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IHtTSEFSRURfRE9NQUlOX09QX0lOREVYfSBmcm9tICcuLi8uLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtiaW5Ub1N0cmluZ30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7aXNTY2FsZUNoYW5uZWwsIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge01BSU4sIFJBV30gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtEb21haW4sIGhhc0Rpc2NyZXRlRG9tYWluLCBpc0JpblNjYWxlLCBpc1NlbGVjdGlvbkRvbWFpbiwgU2NhbGVDb25maWcsIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1NvcnRGaWVsZCwgU29ydEZpZWxkfSBmcm9tICcuLi8uLi9zb3J0JztcbmltcG9ydCB7aGFzaH0gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc0RhdGFSZWZVbmlvbmVkRG9tYWluLCBpc0ZpZWxkUmVmVW5pb25Eb21haW59IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7XG4gIGlzRGF0YVJlZkRvbWFpbixcbiAgVmdEYXRhUmVmLFxuICBWZ0RvbWFpbixcbiAgVmdGaWVsZFJlZlVuaW9uRG9tYWluLFxuICBWZ05vblVuaW9uRG9tYWluLFxuICBWZ1NvcnRGaWVsZCxcbiAgVmdVbmlvblNvcnRGaWVsZCxcbn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtGQUNFVF9TQ0FMRV9QUkVGSVh9IGZyb20gJy4uL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZURvbWFpbihtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlcyA9IG1vZGVsLnNwZWNpZmllZFNjYWxlcztcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBzY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3Qgc3BlY2lmaWVkRG9tYWluID0gc3BlY2lmaWVkU2NhbGUgPyBzcGVjaWZpZWRTY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBkb21haW5zID0gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKTtcbiAgICBjb25zdCBsb2NhbFNjYWxlQ21wdCA9IGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdO1xuICAgIGxvY2FsU2NhbGVDbXB0LmRvbWFpbnMgPSBkb21haW5zO1xuXG4gICAgaWYgKGlzU2VsZWN0aW9uRG9tYWluKHNwZWNpZmllZERvbWFpbikpIHtcbiAgICAgIC8vIEFzIHNjYWxlIHBhcnNpbmcgb2NjdXJzIGJlZm9yZSBzZWxlY3Rpb24gcGFyc2luZywgd2UgdXNlIGEgdGVtcG9yYXJ5XG4gICAgICAvLyBzaWduYWwgaGVyZSBhbmQgYXBwZW5kIHRoZSBzY2FsZS5kb21haW4gZGVmaW5pdGlvbi4gVGhpcyBpcyByZXBsYWNlZFxuICAgICAgLy8gd2l0aCB0aGUgY29ycmVjdCBkb21haW5SYXcgc2lnbmFsIGR1cmluZyBzY2FsZSBhc3NlbWJseS5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaXNSYXdTZWxlY3Rpb25Eb21haW4gaW4gc2VsZWN0aW9uLnRzLlxuXG4gICAgICAvLyBGSVhNRTogcmVwbGFjZSB0aGlzIHdpdGggYSBzcGVjaWFsIHByb3BlcnR5IGluIHRoZSBzY2FsZUNvbXBvbmVudFxuICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KCdkb21haW5SYXcnLCB7XG4gICAgICAgIHNpZ25hbDogU0VMRUNUSU9OX0RPTUFJTiArIGhhc2goc3BlY2lmaWVkRG9tYWluKVxuICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmNvbXBvbmVudC5kYXRhLmlzRmFjZXRlZCkge1xuICAgICAgLy8gZ2V0IHJlc29sdmUgZnJvbSBjbG9zZXN0IGZhY2V0IHBhcmVudCBhcyB0aGlzIGRlY2lkZXMgd2hldGhlciB3ZSBuZWVkIHRvIHJlZmVyIHRvIGNsb25lZCBzdWJ0cmVlIG9yIG5vdFxuICAgICAgbGV0IGZhY2V0UGFyZW50OiBNb2RlbCA9IG1vZGVsO1xuICAgICAgd2hpbGUgKCFpc0ZhY2V0TW9kZWwoZmFjZXRQYXJlbnQpICYmIGZhY2V0UGFyZW50LnBhcmVudCkge1xuICAgICAgICBmYWNldFBhcmVudCA9IGZhY2V0UGFyZW50LnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZhY2V0UGFyZW50LmNvbXBvbmVudC5yZXNvbHZlLnNjYWxlW2NoYW5uZWxdO1xuXG4gICAgICBpZiAocmVzb2x2ZSA9PT0gJ3NoYXJlZCcpIHtcbiAgICAgICAgZm9yIChjb25zdCBkb21haW4gb2YgZG9tYWlucykge1xuICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHNjYWxlIGRvbWFpbiB3aXRoIGRhdGEgb3V0cHV0IGZyb20gYSBjbG9uZWQgc3VidHJlZSBhZnRlciB0aGUgZmFjZXQuXG4gICAgICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICAgICAgICAvLyB1c2UgZGF0YSBmcm9tIGNsb25lZCBzdWJ0cmVlICh3aGljaCBpcyB0aGUgc2FtZSBhcyBkYXRhIGJ1dCB3aXRoIGEgcHJlZml4IGFkZGVkIG9uY2UpXG4gICAgICAgICAgICBkb21haW4uZGF0YSA9IEZBQ0VUX1NDQUxFX1BSRUZJWCArIGRvbWFpbi5kYXRhLnJlcGxhY2UoRkFDRVRfU0NBTEVfUFJFRklYLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0U2NhbGVEb21haW4obW9kZWw6IE1vZGVsKSB7XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBwYXJzZVNjYWxlRG9tYWluKGNoaWxkKTtcbiAgfVxuXG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICB1dGlsLmtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIC8vIEZJWE1FOiBBcnZpbmQgLS0gUGxlYXNlIHJldmlzZSBsb2dpYyBmb3IgbWVyZ2luZyBzZWxlY3Rpb25Eb21haW4gLyBkb21haW5SYXdcblxuICAgIGxldCBkb21haW5zOiBWZ05vblVuaW9uRG9tYWluW107XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjaGlsZENvbXBvbmVudCA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGRvbWFpbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRvbWFpbnMgPSBjaGlsZENvbXBvbmVudC5kb21haW5zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbWFpbnMgPSBkb21haW5zLmNvbmNhdChjaGlsZENvbXBvbmVudC5kb21haW5zKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLmRvbWFpbnMgPSBkb21haW5zO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGl0IGlzIG5vdCBhcHBsaWNhYmxlXG4gKiBBZGQgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZCBhbmQgY29uZmlnLnNjYWxlLnVzZVVuYWdncmVnYXRlZERvbWFpbiBpcyB0cnVlLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4oZG9tYWluOiBEb21haW4sIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3Qge3ZhbGlkLCByZWFzb259ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmKCF2YWxpZCkge1xuICAgICAgbG9nLndhcm4ocmVhc29uKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRvbWFpbiA9PT0gdW5kZWZpbmVkICYmIHNjYWxlQ29uZmlnLnVzZVVuYWdncmVnYXRlZERvbWFpbikge1xuICAgIC8vIEFwcGx5IGNvbmZpZyBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZC5cbiAgICBjb25zdCB7dmFsaWR9ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmICh2YWxpZCkge1xuICAgICAgcmV0dXJuICd1bmFnZ3JlZ2F0ZWQnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb21haW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG5cbiAgY29uc3QgZG9tYWluID0gbm9ybWFsaXplVW5hZ2dyZWdhdGVkRG9tYWluKG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpLCBtb2RlbC5maWVsZERlZihjaGFubmVsKSwgc2NhbGVUeXBlLCBtb2RlbC5jb25maWcuc2NhbGUpO1xuICBpZiAoZG9tYWluICE9PSBtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSkge1xuICAgIG1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSA9IHtcbiAgICAgIC4uLm1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSxcbiAgICAgIGRvbWFpblxuICAgIH07XG4gIH1cblxuICAvLyBJZiBjaGFubmVsIGlzIGVpdGhlciBYIG9yIFkgdGhlbiB1bmlvbiB0aGVtIHdpdGggWDIgJiBZMiBpZiB0aGV5IGV4aXN0XG4gIGlmIChjaGFubmVsID09PSAneCcgJiYgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4MicpKSB7XG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneCcpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gnKS5jb25jYXQocGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3kyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd5JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneScpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRvbWFpbjogRG9tYWluLCBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwgfCAneDInIHwgJ3kyJyk6IFZnTm9uVW5pb25Eb21haW5bXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKGRvbWFpbiAmJiBkb21haW4gIT09ICd1bmFnZ3JlZ2F0ZWQnICYmICFpc1NlbGVjdGlvbkRvbWFpbihkb21haW4pKSB7IC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY29uZmxpY3RlZERvbWFpbihjaGFubmVsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc0RhdGVUaW1lKGRvbWFpblswXSkpIHtcbiAgICAgICAgcmV0dXJuIChkb21haW4gYXMgRGF0ZVRpbWVbXSkubWFwKChkdCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7c2lnbmFsOiBge2RhdGE6ICR7ZGF0ZVRpbWVFeHByKGR0LCB0cnVlKX19YH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtkb21haW5dO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2s7XG4gIGlmIChzdGFjayAmJiBjaGFubmVsID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICBpZihzdGFjay5vZmZzZXQgPT09ICdub3JtYWxpemUnKSB7XG4gICAgICByZXR1cm4gW1swLCAxXV07XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7c3VmZml4OiAnc3RhcnQnfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge3N1ZmZpeDogJ2VuZCd9KVxuICAgIH1dO1xuICB9XG5cbiAgY29uc3Qgc29ydCA9IGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpID8gZG9tYWluU29ydChtb2RlbCwgY2hhbm5lbCwgc2NhbGVUeXBlKSA6IHVuZGVmaW5lZDtcblxuICBpZiAoZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2FnZ3JlZ2F0ZTogJ21pbid9KVxuICAgIH0sIHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7YWdncmVnYXRlOiAnbWF4J30pXG4gICAgfV07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYuYmluKSB7IC8vIGJpblxuICAgIGlmIChpc0JpblNjYWxlKHNjYWxlVHlwZSkpIHtcbiAgICAgIGNvbnN0IHNpZ25hbCA9IG1vZGVsLmdldE5hbWUoYCR7YmluVG9TdHJpbmcoZmllbGREZWYuYmluKX1fJHtmaWVsZERlZi5maWVsZH1fYmluc2ApO1xuICAgICAgcmV0dXJuIFt7c2lnbmFsOiBgc2VxdWVuY2UoJHtzaWduYWx9LnN0YXJ0LCAke3NpZ25hbH0uc3RvcCArICR7c2lnbmFsfS5zdGVwLCAke3NpZ25hbH0uc3RlcClgfV07XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICAgIC8vIG9yZGluYWwgYmluIHNjYWxlIHRha2VzIGRvbWFpbiBmcm9tIGJpbl9yYW5nZSwgb3JkZXJlZCBieSBiaW4gc3RhcnRcbiAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBib3RoIGF4aXMtYmFzZWQgc2NhbGUgKHgveSkgYW5kIGxlZ2VuZC1iYXNlZCBzY2FsZSAob3RoZXIgY2hhbm5lbHMpLlxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgUkFXIHRhYmxlLFxuICAgICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgICAgLy8gVXNlIHJhbmdlIGlmIHdlIGFkZGVkIGl0IGFuZCB0aGUgc2NhbGUgZG9lcyBub3Qgc3VwcG9ydCBjb21wdXRpbmcgYSByYW5nZSBhcyBhIHNpZ25hbC5cbiAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwgYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZiwgY2hhbm5lbCkgPyB7YmluU3VmZml4OiAncmFuZ2UnfSA6IHt9KSxcbiAgICAgICAgLy8gd2UgaGF2ZSB0byB1c2UgYSBzb3J0IG9iamVjdCBpZiBzb3J0ID0gdHJ1ZSB0byBtYWtlIHRoZSBzb3J0IGNvcnJlY3QgYnkgYmluIHN0YXJ0XG4gICAgICAgIHNvcnQ6IHNvcnQgPT09IHRydWUgfHwgIWlzU29ydEZpZWxkKHNvcnQpID8ge1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KSxcbiAgICAgICAgICBvcDogJ21pbicgLy8gbWluIG9yIG1heCBkb2Vzbid0IG1hdHRlciBzaW5jZSB3ZSBzb3J0IGJ5IHRoZSBzdGFydCBvZiB0aGUgYmluIHJhbmdlXG4gICAgICAgIH0gOiBzb3J0XG4gICAgICB9XTtcbiAgICB9IGVsc2UgeyAvLyBjb250aW51b3VzIHNjYWxlc1xuICAgICAgaWYgKGNoYW5uZWwgPT09ICd4JyB8fCBjaGFubmVsID09PSAneScpIHtcbiAgICAgICAgLy8gWC9ZIHBvc2l0aW9uIGhhdmUgdG8gaW5jbHVkZSBzdGFydCBhbmQgZW5kIGZvciBub24tb3JkaW5hbCBzY2FsZVxuICAgICAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnZW5kJ30pXG4gICAgICAgIH1dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogdXNlIGJpbl9taWRcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoc29ydCkge1xuICAgIHJldHVybiBbe1xuICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBSQVcgdGFibGUsXG4gICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKSxcbiAgICAgIHNvcnQ6IHNvcnRcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpXG4gICAgfV07XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluU29ydChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlKTogdHJ1ZSB8IFNvcnRGaWVsZDxzdHJpbmc+IHtcbiAgaWYgKCFoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGNvbnN0IHNvcnQgPSBtb2RlbC5zb3J0KGNoYW5uZWwpO1xuXG4gIC8vIFNvcnRlZCBiYXNlZCBvbiBhbiBhZ2dyZWdhdGUgY2FsY3VsYXRpb24gb3ZlciBhIHNwZWNpZmllZCBzb3J0IGZpZWxkIChvbmx5IGZvciBvcmRpbmFsIHNjYWxlKVxuICBpZiAoaXNTb3J0RmllbGQoc29ydCkpIHtcbiAgICByZXR1cm4gc29ydDtcbiAgfVxuXG4gIGlmIChzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3A6ICdtaW4nLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCksXG4gICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFsnYXNjZW5kaW5nJywgdW5kZWZpbmVkIC8qIGRlZmF1bHQgPWFzY2VuZGluZyovXSwgc29ydCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHNvcnQgPT0gbnVsbFxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBzY2FsZSBjYW4gdXNlIHVuYWdncmVnYXRlZCBkb21haW4uXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0b25zIGFwcGxpZXM6XG4gKiAxLiBgc2NhbGUuZG9tYWluYCBpcyBgdW5hZ2dyZWdhdGVkYFxuICogMi4gQWdncmVnYXRpb24gZnVuY3Rpb24gaXMgbm90IGBjb3VudGAgb3IgYHN1bWBcbiAqIDMuIFRoZSBzY2FsZSBpcyBxdWFudGl0YXRpdmUgb3IgdGltZSBzY2FsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB7dmFsaWQ6IGJvb2xlYW4sIHJlYXNvbj86IHN0cmluZ30ge1xuICBpZiAoIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZilcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFTSEFSRURfRE9NQUlOX09QX0lOREVYW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcChmaWVsZERlZi5hZ2dyZWdhdGUpXG4gICAgfTtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIGlmIChzY2FsZVR5cGUgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVkRG9tYWluV2l0aExvZ1NjYWxlKGZpZWxkRGVmKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge3ZhbGlkOiB0cnVlfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBkb21haW5zIHRvIGEgc2luZ2xlIFZlZ2Egc2NhbGUgZG9tYWluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEb21haW5zKGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXSk6IFZnRG9tYWluIHtcbiAgY29uc3QgdW5pcXVlRG9tYWlucyA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGRvbWFpbiA9PiB7XG4gICAgLy8gaWdub3JlIHNvcnQgcHJvcGVydHkgd2hlbiBjb21wdXRpbmcgdGhlIHVuaXF1ZSBkb21haW5zXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBjb25zdCB7c29ydDogX3MsIC4uLmRvbWFpbldpdGhvdXRTb3J0fSA9IGRvbWFpbjtcbiAgICAgIHJldHVybiBkb21haW5XaXRob3V0U29ydDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfSksIHV0aWwuaGFzaCk7XG5cbiAgY29uc3Qgc29ydHM6IFZnU29ydEZpZWxkW10gPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkID0+IHtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGQpKSB7XG4gICAgICBjb25zdCBzID0gZC5zb3J0O1xuICAgICAgaWYgKHMgIT09IHVuZGVmaW5lZCAmJiAhdXRpbC5pc0Jvb2xlYW4ocykpIHtcbiAgICAgICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICAvLyBsZXQncyBtYWtlIHN1cmUgdGhhdCBpZiBvcCBpcyBjb3VudCwgd2UgZG9uJ3QgdXNlIGEgZmllbGRcbiAgICAgICAgICBkZWxldGUgcy5maWVsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5vcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAvLyBkcm9wIG9yZGVyOiBhc2NlbmRpbmcgYXMgaXQgaXMgdGhlIGRlZmF1bHRcbiAgICAgICAgICBkZWxldGUgcy5vcmRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pLmZpbHRlcihzID0+IHMgIT09IHVuZGVmaW5lZCksIHV0aWwuaGFzaCk7XG5cbiAgaWYgKHVuaXF1ZURvbWFpbnMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgZG9tYWluID0gZG9tYWluc1swXTtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgc29ydHMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHNvcnQgPSBzb3J0c1swXTtcbiAgICAgIGlmIChzb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgICAgIHNvcnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZG9tYWluLFxuICAgICAgICBzb3J0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgLy8gb25seSBrZWVwIHNpbXBsZSBzb3J0IHByb3BlcnRpZXMgdGhhdCB3b3JrIHdpdGggdW5pb25lZCBkb21haW5zXG4gIGNvbnN0IHNpbXBsZVNvcnRzID0gdXRpbC51bmlxdWUoc29ydHMubWFwKHMgPT4ge1xuICAgIGlmIChzID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kb21haW5Tb3J0RHJvcHBlZChzKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pLCB1dGlsLmhhc2gpIGFzIFZnVW5pb25Tb3J0RmllbGRbXTtcblxuICBsZXQgc29ydDogVmdVbmlvblNvcnRGaWVsZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoc2ltcGxlU29ydHMubGVuZ3RoID09PSAxKSB7XG4gICAgc29ydCA9IHNpbXBsZVNvcnRzWzBdO1xuICB9IGVsc2UgaWYgKHNpbXBsZVNvcnRzLmxlbmd0aCA+IDEpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgIHNvcnQgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgYWxsRGF0YSA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGQgPT4ge1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZCkpIHtcbiAgICAgIHJldHVybiBkLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9KSwgeCA9PiB4KTtcblxuICBpZiAoYWxsRGF0YS5sZW5ndGggPT09IDEgJiYgYWxsRGF0YVswXSAhPT0gbnVsbCkge1xuICAgIC8vIGNyZWF0ZSBhIHVuaW9uIGRvbWFpbiBvZiBkaWZmZXJlbnQgZmllbGRzIHdpdGggYSBzaW5nbGUgZGF0YSBzb3VyY2VcbiAgICBjb25zdCBkb21haW46IFZnRmllbGRSZWZVbmlvbkRvbWFpbiA9IHtcbiAgICAgIGRhdGE6IGFsbERhdGFbMF0sXG4gICAgICBmaWVsZHM6IHVuaXF1ZURvbWFpbnMubWFwKGQgPT4gKGQgYXMgVmdEYXRhUmVmKS5maWVsZCksXG4gICAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KVxuICAgIH07XG5cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVuaXF1ZURvbWFpbnMsIC4uLihzb3J0ID8ge3NvcnR9IDoge30pfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmaWVsZCBpZiBhIHNjYWxlIHNpbmdsZSBmaWVsZC5cbiAqIFJldHVybiBgdW5kZWZpbmVkYCBvdGhlcndpc2UuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbjogVmdEb21haW4pOiBzdHJpbmcge1xuICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgaXNTdHJpbmcoZG9tYWluLmZpZWxkKSkge1xuICAgIHJldHVybiBkb21haW4uZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNEYXRhUmVmVW5pb25lZERvbWFpbihkb21haW4pKSB7XG4gICAgbGV0IGZpZWxkO1xuICAgIGZvciAoY29uc3Qgbm9uVW5pb25Eb21haW4gb2YgZG9tYWluLmZpZWxkcykge1xuICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihub25VbmlvbkRvbWFpbikgJiYgaXNTdHJpbmcobm9uVW5pb25Eb21haW4uZmllbGQpKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9IG5vblVuaW9uRG9tYWluLmZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkICE9PSBub25VbmlvbkRvbWFpbi5maWVsZCkge1xuICAgICAgICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzLiAgV2Ugd2lsbCB1c2UgdGhlIGZpcnN0IGZpZWxkLiAgVGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5IGJlIGluY29ycmVjdC4nKTtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIGlkZW50aWNhbCBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgc291cmNlIGRldGVjdGVkLiAgV2Ugd2lsbCBhc3N1bWUgdGhhdCB0aGlzIGlzIHRoZSBzYW1lIGZpZWxkIGZyb20gYSBkaWZmZXJlbnQgZm9yayBvZiB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIEhvd2V2ZXIsIGlmIHRoaXMgaXMgbm90IGNhc2UsIHRoZSByZXN1bHQgdmlldyBzaXplIG1heWJlIGluY29ycmVjdC4nKTtcbiAgICByZXR1cm4gZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZFJlZlVuaW9uRG9tYWluKGRvbWFpbikpIHtcbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgbXVsdGlwbGUgZmllbGRzIGZyb20gdGhlIHNhbWUgZGF0YSBzb3VyY2UuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9tYWluLmZpZWxkc1swXTtcbiAgICByZXR1cm4gaXNTdHJpbmcoZmllbGQpID8gZmllbGQgOiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVEb21haW4obW9kZWw6IE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpIHtcbiAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICBjb25zdCBkb21haW5zID0gc2NhbGVDb21wb25lbnQuZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBDb3JyZWN0IHJlZmVyZW5jZXMgdG8gZGF0YSBhcyB0aGUgb3JpZ2luYWwgZG9tYWluJ3MgZGF0YSB3YXMgZGV0ZXJtaW5lZFxuICAgIC8vIGluIHBhcnNlU2NhbGUsIHdoaWNoIGhhcHBlbnMgYmVmb3JlIHBhcnNlRGF0YS4gVGh1cyB0aGUgb3JpZ2luYWwgZGF0YVxuICAgIC8vIHJlZmVyZW5jZSBjYW4gYmUgaW5jb3JyZWN0LlxuXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBkb21haW4uZGF0YSA9IG1vZGVsLmxvb2t1cERhdGFTb3VyY2UoZG9tYWluLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KTtcblxuICAvLyBkb21haW5zIGlzIGFuIGFycmF5IHRoYXQgaGFzIHRvIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIHZlZ2EgZG9tYWluXG4gIHJldHVybiBtZXJnZURvbWFpbnMoZG9tYWlucyk7XG59XG4iXX0=