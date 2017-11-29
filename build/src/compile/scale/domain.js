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
                signal: selection_1.SELECTION_DOMAIN + JSON.stringify(specifiedDomain)
            }, true);
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
        if (model_1.isFacetModel(model)) {
            domains.forEach(function (domain) {
                // Replace the scale domain with data output from a cloned subtree after the facet.
                if (vega_schema_1.isDataRefDomain(domain)) {
                    // use data from cloned subtree (which is the same as data but with a prefix added once)
                    domain.data = optimize_1.FACET_SCALE_PREFIX + domain.data.replace(optimize_1.FACET_SCALE_PREFIX, '');
                }
            });
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
                field: model.field(channel, { suffix: 'start' })
            }, {
                data: data,
                field: model.field(channel, { suffix: 'end' })
            }];
    }
    var sort = channel_1.isScaleChannel(channel) ? domainSort(model, channel, scaleType) : undefined;
    if (domain === 'unaggregated') {
        var data = model.requestDataName(data_1.MAIN);
        return [{
                data: data,
                field: model.field(channel, { aggregate: 'min' })
            }, {
                data: data,
                field: model.field(channel, { aggregate: 'max' })
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
                    field: model.field(channel, common_1.binRequiresRange(fieldDef, channel) ? { binSuffix: 'range' } : {}),
                    // we have to use a sort object if sort = true to make the sort correct by bin start
                    sort: sort === true || !sort_1.isSortField(sort) ? {
                        field: model.field(channel, {}),
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
                        field: model.field(channel, {})
                    }, {
                        data: data,
                        field: model.field(channel, { binSuffix: 'end' })
                    }];
            }
            else {
                // TODO: use bin_mid
                return [{
                        data: model.requestDataName(data_1.MAIN),
                        field: model.field(channel, {})
                    }];
            }
        }
    }
    else if (sort) {
        return [{
                // If sort by aggregation of a specified sort field, we need to use RAW table,
                // so we can aggregate values for the scale independently from the main aggregation.
                data: util.isBoolean(sort) ? model.requestDataName(data_1.MAIN) : model.requestDataName(data_1.RAW),
                field: model.field(channel),
                sort: sort
            }];
    }
    else {
        return [{
                data: model.requestDataName(data_1.MAIN),
                field: model.field(channel)
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
        if (vega_schema_1.isDataRefDomain(domain)) {
            var _s = domain.sort, domainWithoutSort = __rest(domain, ["sort"]);
            return domainWithoutSort;
        }
        return domain;
    }), util.hash);
    var sorts = util.unique(domains.map(function (d) {
        if (vega_schema_1.isDataRefDomain(d)) {
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
        if (vega_schema_1.isDataRefDomain(domain) && sorts.length > 0) {
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
    var onlySimpleSorts = sorts.filter(function (s) {
        if (util.isBoolean(s)) {
            return true;
        }
        if (s.op === 'count') {
            return true;
        }
        log.warn(log.message.domainSortDropped(s));
        return false;
    });
    var sort = true;
    if (onlySimpleSorts.length === 1) {
        sort = onlySimpleSorts[0];
    }
    else if (onlySimpleSorts.length > 1) {
        // ignore sort = false if we have another sort property
        var filteredSorts = onlySimpleSorts.filter(function (s) { return s !== false; });
        if (filteredSorts.length > 1) {
            log.warn(log.message.MORE_THAN_ONE_SORT);
            sort = true;
        }
        else {
            sort = filteredSorts[0];
        }
    }
    var allData = util.unique(domains.map(function (d) {
        if (vega_schema_1.isDataRefDomain(d)) {
            return d.data;
        }
        return null;
    }), function (x) { return x; });
    if (allData.length === 1 && allData[0] !== null) {
        // create a union domain of different fields with a single data source
        var domain = {
            data: allData[0],
            fields: uniqueDomains.map(function (d) { return d.field; }),
            sort: sort
        };
        return domain;
    }
    return { fields: uniqueDomains, sort: sort };
}
exports.mergeDomains = mergeDomains;
/**
 * Return a field if a scale single field.
 * Return `undefined` otherwise.
 *
 */
function getFieldFromDomain(domain) {
    if (vega_schema_1.isDataRefDomain(domain) && vega_util_1.isString(domain.field)) {
        return domain.field;
    }
    else if (vega_schema_2.isDataRefUnionedDomain(domain)) {
        var field = void 0;
        for (var _i = 0, _a = domain.fields; _i < _a.length; _i++) {
            var nonUnionDomain = _a[_i];
            if (vega_schema_1.isDataRefDomain(nonUnionDomain) && vega_util_1.isString(nonUnionDomain.field)) {
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
    else if (vega_schema_2.isFieldRefUnionDomain(domain) && vega_util_1.isString) {
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
        if (vega_schema_1.isDataRefDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
        }
        return domain;
    });
    // domains is an array that has to be merged into a single vega domain
    return mergeDomains(domains);
}
exports.assembleDomain = assembleDomain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1Q0FBbUM7QUFDbkMsNkNBQXVEO0FBQ3ZELGlDQUFzQztBQUN0Qyx5Q0FBMkQ7QUFDM0QsbUNBQXFDO0FBQ3JDLDJDQUFrRTtBQUVsRSwrQkFBaUM7QUFDakMscUNBQTZHO0FBQzdHLG1DQUFrRDtBQUNsRCxpQ0FBbUM7QUFDbkMsaURBUTJCO0FBQzNCLGlEQUFnRjtBQUNoRixvQ0FBMkM7QUFDM0MsNkNBQW9EO0FBQ3BELGtDQUEwRDtBQUMxRCxvREFBd0Q7QUFLeEQsMEJBQWlDLEtBQVk7SUFDM0MsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUM7QUFORCw0Q0FNQztBQUVELDhCQUE4QixLQUFnQjtJQUM1QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO0lBQ3JDLElBQU0sb0JBQW9CLEdBQXdCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXpFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFxQjtRQUM1RCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsSUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFM0UsSUFBTSxPQUFPLEdBQUcscUJBQXFCLENBQUMsS0FBSyxFQUFF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QyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsTUFBTSxDQUFDLG9CQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBQzdDLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDO0FBQ25CLENBQUM7QUF4QkQsZ0RBd0JDO0FBRUQsd0JBQStCLEtBQVksRUFBRSxPQUFxQjtJQUNoRSxJQUFNLGNBQWMsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2RCxJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU07UUFDL0MsMEVBQTBFO1FBQzFFLHdFQUF3RTtRQUN4RSw4QkFBOEI7UUFFOUIsRUFBRSxDQUFDLENBQUMsNkJBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDNUIsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFDRCxNQUFNLENBQUMsTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0VBQXNFO0lBQ3RFLE1BQU0sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWZELHdDQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7U0hBUkVEX0RPTUFJTl9PUF9JTkRFWH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7YmluVG9TdHJpbmd9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge2lzU2NhbGVDaGFubmVsLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgZGF0ZVRpbWVFeHByLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7RG9tYWluLCBoYXNEaXNjcmV0ZURvbWFpbiwgaXNCaW5TY2FsZSwgaXNTZWxlY3Rpb25Eb21haW4sIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7aXNTb3J0RmllbGQsIFNvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtcbiAgaXNEYXRhUmVmRG9tYWluLFxuICBWZ0RhdGFSZWYsXG4gIFZnRG9tYWluLFxuICBWZ0ZpZWxkUmVmVW5pb25Eb21haW4sXG4gIFZnTm9uVW5pb25Eb21haW4sXG4gIFZnU29ydEZpZWxkLFxuICBWZ1VuaW9uU29ydEZpZWxkLFxufSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzRGF0YVJlZlVuaW9uZWREb21haW4sIGlzRmllbGRSZWZVbmlvbkRvbWFpbn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtGQUNFVF9TQ0FMRV9QUkVGSVh9IGZyb20gJy4uL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnQsIFNjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZURvbWFpbihtb2RlbDogTW9kZWwpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIHBhcnNlVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZU5vblVuaXRTY2FsZURvbWFpbihtb2RlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBzY2FsZXMgPSBtb2RlbC5zcGVjaWZpZWRTY2FsZXM7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICB1dGlsLmtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gc2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHNwZWNpZmllZERvbWFpbiA9IHNwZWNpZmllZFNjYWxlID8gc3BlY2lmaWVkU2NhbGUuZG9tYWluIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZG9tYWlucyA9IHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCk7XG4gICAgY29uc3QgbG9jYWxTY2FsZUNtcHQgPSBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXTtcbiAgICBsb2NhbFNjYWxlQ21wdC5kb21haW5zID0gZG9tYWlucztcblxuICAgIGlmIChpc1NlbGVjdGlvbkRvbWFpbihzcGVjaWZpZWREb21haW4pKSB7XG4gICAgICAvLyBBcyBzY2FsZSBwYXJzaW5nIG9jY3VycyBiZWZvcmUgc2VsZWN0aW9uIHBhcnNpbmcsIHdlIHVzZSBhIHRlbXBvcmFyeVxuICAgICAgLy8gc2lnbmFsIGhlcmUgYW5kIGFwcGVuZCB0aGUgc2NhbGUuZG9tYWluIGRlZmluaXRpb24uIFRoaXMgaXMgcmVwbGFjZWRcbiAgICAgIC8vIHdpdGggdGhlIGNvcnJlY3QgZG9tYWluUmF3IHNpZ25hbCBkdXJpbmcgc2NhbGUgYXNzZW1ibHkuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIGlzUmF3U2VsZWN0aW9uRG9tYWluIGluIHNlbGVjdGlvbi50cy5cblxuICAgICAgLy8gRklYTUU6IHJlcGxhY2UgdGhpcyB3aXRoIGEgc3BlY2lhbCBwcm9wZXJ0eSBpbiB0aGUgc2NhbGVDb21wb25lbnRcbiAgICAgIGxvY2FsU2NhbGVDbXB0LnNldCgnZG9tYWluUmF3Jywge1xuICAgICAgICBzaWduYWw6IFNFTEVDVElPTl9ET01BSU4gKyBKU09OLnN0cmluZ2lmeShzcGVjaWZpZWREb21haW4pXG4gICAgICB9LCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZURvbWFpbihtb2RlbDogTW9kZWwpIHtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIHBhcnNlU2NhbGVEb21haW4oY2hpbGQpO1xuICB9XG5cbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgLy8gRklYTUU6IEFydmluZCAtLSBQbGVhc2UgcmV2aXNlIGxvZ2ljIGZvciBtZXJnaW5nIHNlbGVjdGlvbkRvbWFpbiAvIGRvbWFpblJhd1xuXG4gICAgbGV0IGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXTtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZENvbXBvbmVudCkge1xuICAgICAgICBpZiAoZG9tYWlucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZG9tYWlucyA9IGNoaWxkQ29tcG9uZW50LmRvbWFpbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9tYWlucyA9IGRvbWFpbnMuY29uY2F0KGNoaWxkQ29tcG9uZW50LmRvbWFpbnMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICAgIGRvbWFpbnMuZm9yRWFjaCgoZG9tYWluKSA9PiB7XG4gICAgICAgIC8vIFJlcGxhY2UgdGhlIHNjYWxlIGRvbWFpbiB3aXRoIGRhdGEgb3V0cHV0IGZyb20gYSBjbG9uZWQgc3VidHJlZSBhZnRlciB0aGUgZmFjZXQuXG4gICAgICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgICAgIC8vIHVzZSBkYXRhIGZyb20gY2xvbmVkIHN1YnRyZWUgKHdoaWNoIGlzIHRoZSBzYW1lIGFzIGRhdGEgYnV0IHdpdGggYSBwcmVmaXggYWRkZWQgb25jZSlcbiAgICAgICAgICBkb21haW4uZGF0YSA9IEZBQ0VUX1NDQUxFX1BSRUZJWCArIGRvbWFpbi5kYXRhLnJlcGxhY2UoRkFDRVRfU0NBTEVfUFJFRklYLCAnJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLmRvbWFpbnMgPSBkb21haW5zO1xuICB9KTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGl0IGlzIG5vdCBhcHBsaWNhYmxlXG4gKiBBZGQgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZCBhbmQgY29uZmlnLnNjYWxlLnVzZVVuYWdncmVnYXRlZERvbWFpbiBpcyB0cnVlLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4oZG9tYWluOiBEb21haW4sIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3Qge3ZhbGlkLCByZWFzb259ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmKCF2YWxpZCkge1xuICAgICAgbG9nLndhcm4ocmVhc29uKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRvbWFpbiA9PT0gdW5kZWZpbmVkICYmIHNjYWxlQ29uZmlnLnVzZVVuYWdncmVnYXRlZERvbWFpbikge1xuICAgIC8vIEFwcGx5IGNvbmZpZyBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZC5cbiAgICBjb25zdCB7dmFsaWR9ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmICh2YWxpZCkge1xuICAgICAgcmV0dXJuICd1bmFnZ3JlZ2F0ZWQnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb21haW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG5cbiAgY29uc3QgZG9tYWluID0gbm9ybWFsaXplVW5hZ2dyZWdhdGVkRG9tYWluKG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpLCBtb2RlbC5maWVsZERlZihjaGFubmVsKSwgc2NhbGVUeXBlLCBtb2RlbC5jb25maWcuc2NhbGUpO1xuICBpZiAoZG9tYWluICE9PSBtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSkge1xuICAgIG1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSA9IHtcbiAgICAgIC4uLm1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSxcbiAgICAgIGRvbWFpblxuICAgIH07XG4gIH1cblxuICAvLyBJZiBjaGFubmVsIGlzIGVpdGhlciBYIG9yIFkgdGhlbiB1bmlvbiB0aGVtIHdpdGggWDIgJiBZMiBpZiB0aGV5IGV4aXN0XG4gIGlmIChjaGFubmVsID09PSAneCcgJiYgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4MicpKSB7XG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneCcpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gnKS5jb25jYXQocGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3kyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd5JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneScpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRvbWFpbjogRG9tYWluLCBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwgfCAneDInIHwgJ3kyJyk6IFZnTm9uVW5pb25Eb21haW5bXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKGRvbWFpbiAmJiBkb21haW4gIT09ICd1bmFnZ3JlZ2F0ZWQnICYmICFpc1NlbGVjdGlvbkRvbWFpbihkb21haW4pKSB7IC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgaWYgKGZpZWxkRGVmLmJpbikge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuY29uZmxpY3RlZERvbWFpbihjaGFubmVsKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChpc0RhdGVUaW1lKGRvbWFpblswXSkpIHtcbiAgICAgICAgcmV0dXJuIChkb21haW4gYXMgRGF0ZVRpbWVbXSkubWFwKChkdCkgPT4ge1xuICAgICAgICAgIHJldHVybiB7c2lnbmFsOiBge2RhdGE6ICR7ZGF0ZVRpbWVFeHByKGR0LCB0cnVlKX19YH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIFtkb21haW5dO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2s7XG4gIGlmIChzdGFjayAmJiBjaGFubmVsID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICBpZihzdGFjay5vZmZzZXQgPT09ICdub3JtYWxpemUnKSB7XG4gICAgICByZXR1cm4gW1swLCAxXV07XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge3N1ZmZpeDogJ3N0YXJ0J30pXG4gICAgfSwge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7c3VmZml4OiAnZW5kJ30pXG4gICAgfV07XG4gIH1cblxuICBjb25zdCBzb3J0ID0gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgPyBkb21haW5Tb3J0KG1vZGVsLCBjaGFubmVsLCBzY2FsZVR5cGUpIDogdW5kZWZpbmVkO1xuXG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge2FnZ3JlZ2F0ZTogJ21pbid9KVxuICAgIH0sIHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge2FnZ3JlZ2F0ZTogJ21heCd9KVxuICAgIH1dO1xuICB9IGVsc2UgaWYgKGZpZWxkRGVmLmJpbikgeyAvLyBiaW5cbiAgICBpZiAoaXNCaW5TY2FsZShzY2FsZVR5cGUpKSB7XG4gICAgICBjb25zdCBzaWduYWwgPSBtb2RlbC5nZXROYW1lKGAke2JpblRvU3RyaW5nKGZpZWxkRGVmLmJpbil9XyR7ZmllbGREZWYuZmllbGR9X2JpbnNgKTtcbiAgICAgIHJldHVybiBbe3NpZ25hbDogYHNlcXVlbmNlKCR7c2lnbmFsfS5zdGFydCwgJHtzaWduYWx9LnN0b3AgKyAke3NpZ25hbH0uc3RlcCwgJHtzaWduYWx9LnN0ZXApYH1dO1xuICAgIH1cblxuICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgICAvLyBvcmRpbmFsIGJpbiBzY2FsZSB0YWtlcyBkb21haW4gZnJvbSBiaW5fcmFuZ2UsIG9yZGVyZWQgYnkgYmluIHN0YXJ0XG4gICAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgYm90aCBheGlzLWJhc2VkIHNjYWxlICh4L3kpIGFuZCBsZWdlbmQtYmFzZWQgc2NhbGUgKG90aGVyIGNoYW5uZWxzKS5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFJBVyB0YWJsZSxcbiAgICAgICAgLy8gc28gd2UgY2FuIGFnZ3JlZ2F0ZSB2YWx1ZXMgZm9yIHRoZSBzY2FsZSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIG1haW4gYWdncmVnYXRpb24uXG4gICAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICAgIC8vIFVzZSByYW5nZSBpZiB3ZSBhZGRlZCBpdCBhbmQgdGhlIHNjYWxlIGRvZXMgbm90IHN1cHBvcnQgY29tcHV0aW5nIGEgcmFuZ2UgYXMgYSBzaWduYWwuXG4gICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCBiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSA/IHtiaW5TdWZmaXg6ICdyYW5nZSd9IDoge30pLFxuICAgICAgICAvLyB3ZSBoYXZlIHRvIHVzZSBhIHNvcnQgb2JqZWN0IGlmIHNvcnQgPSB0cnVlIHRvIG1ha2UgdGhlIHNvcnQgY29ycmVjdCBieSBiaW4gc3RhcnRcbiAgICAgICAgc29ydDogc29ydCA9PT0gdHJ1ZSB8fCAhaXNTb3J0RmllbGQoc29ydCkgPyB7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHt9KSxcbiAgICAgICAgICBvcDogJ21pbicgLy8gbWluIG9yIG1heCBkb2Vzbid0IG1hdHRlciBzaW5jZSB3ZSBzb3J0IGJ5IHRoZSBzdGFydCBvZiB0aGUgYmluIHJhbmdlXG4gICAgICAgIH0gOiBzb3J0XG4gICAgICB9XTtcbiAgICB9IGVsc2UgeyAvLyBjb250aW51b3VzIHNjYWxlc1xuICAgICAgaWYgKGNoYW5uZWwgPT09ICd4JyB8fCBjaGFubmVsID09PSAneScpIHtcbiAgICAgICAgLy8gWC9ZIHBvc2l0aW9uIGhhdmUgdG8gaW5jbHVkZSBzdGFydCBhbmQgZW5kIGZvciBub24tb3JkaW5hbCBzY2FsZVxuICAgICAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7fSlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtiaW5TdWZmaXg6ICdlbmQnfSlcbiAgICAgICAgfV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiB1c2UgYmluX21pZFxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoc29ydCkge1xuICAgIHJldHVybiBbe1xuICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBSQVcgdGFibGUsXG4gICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICBzb3J0OiBzb3J0XG4gICAgfV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbClcbiAgICB9XTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkb21haW5Tb3J0KG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB0cnVlIHwgU29ydEZpZWxkPHN0cmluZz4ge1xuICBpZiAoIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3Qgc29ydCA9IG1vZGVsLnNvcnQoY2hhbm5lbCk7XG5cbiAgLy8gU29ydGVkIGJhc2VkIG9uIGFuIGFnZ3JlZ2F0ZSBjYWxjdWxhdGlvbiBvdmVyIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQgKG9ubHkgZm9yIG9yZGluYWwgc2NhbGUpXG4gIGlmIChpc1NvcnRGaWVsZChzb3J0KSkge1xuICAgIHJldHVybiBzb3J0O1xuICB9XG5cbiAgaWYgKHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICBvcDogJ21pbicsXG4gICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCksXG4gICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFsnYXNjZW5kaW5nJywgdW5kZWZpbmVkIC8qIGRlZmF1bHQgPWFzY2VuZGluZyovXSwgc29ydCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHNvcnQgPT09ICdub25lJ1xuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBzY2FsZSBjYW4gdXNlIHVuYWdncmVnYXRlZCBkb21haW4uXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0b25zIGFwcGxpZXM6XG4gKiAxLiBgc2NhbGUuZG9tYWluYCBpcyBgdW5hZ2dyZWdhdGVkYFxuICogMi4gQWdncmVnYXRpb24gZnVuY3Rpb24gaXMgbm90IGBjb3VudGAgb3IgYHN1bWBcbiAqIDMuIFRoZSBzY2FsZSBpcyBxdWFudGl0YXRpdmUgb3IgdGltZSBzY2FsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB7dmFsaWQ6IGJvb2xlYW4sIHJlYXNvbj86IHN0cmluZ30ge1xuICBpZiAoIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZilcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFTSEFSRURfRE9NQUlOX09QX0lOREVYW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcChmaWVsZERlZi5hZ2dyZWdhdGUpXG4gICAgfTtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIGlmIChzY2FsZVR5cGUgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVkRG9tYWluV2l0aExvZ1NjYWxlKGZpZWxkRGVmKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge3ZhbGlkOiB0cnVlfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBkb21haW5zIHRvIGEgc2luZ2xlIFZlZ2Egc2NhbGUgZG9tYWluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEb21haW5zKGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXSk6IFZnRG9tYWluIHtcbiAgY29uc3QgdW5pcXVlRG9tYWlucyA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGRvbWFpbiA9PiB7XG4gICAgLy8gaWdub3JlIHNvcnQgcHJvcGVydHkgd2hlbiBjb21wdXRpbmcgdGhlIHVuaXF1ZSBkb21haW5zXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBjb25zdCB7c29ydDogX3MsIC4uLmRvbWFpbldpdGhvdXRTb3J0fSA9IGRvbWFpbjtcbiAgICAgIHJldHVybiBkb21haW5XaXRob3V0U29ydDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfSksIHV0aWwuaGFzaCk7XG5cbiAgY29uc3Qgc29ydHM6IFZnU29ydEZpZWxkW10gPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkID0+IHtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGQpKSB7XG4gICAgICBjb25zdCBzID0gZC5zb3J0O1xuICAgICAgaWYgKHMgIT09IHVuZGVmaW5lZCAmJiAhdXRpbC5pc0Jvb2xlYW4ocykpIHtcbiAgICAgICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICAvLyBsZXQncyBtYWtlIHN1cmUgdGhhdCBpZiBvcCBpcyBjb3VudCwgd2UgZG9uJ3QgdXNlIGEgZmllbGRcbiAgICAgICAgICBkZWxldGUgcy5maWVsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5vcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAvLyBkcm9wIG9yZGVyOiBhc2NlbmRpbmcgYXMgaXQgaXMgdGhlIGRlZmF1bHRcbiAgICAgICAgICBkZWxldGUgcy5vcmRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pLmZpbHRlcihzID0+IHMgIT09IHVuZGVmaW5lZCksIHV0aWwuaGFzaCk7XG5cbiAgaWYgKHVuaXF1ZURvbWFpbnMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgZG9tYWluID0gZG9tYWluc1swXTtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgc29ydHMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHNvcnQgPSBzb3J0c1swXTtcbiAgICAgIGlmIChzb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgICAgIHNvcnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZG9tYWluLFxuICAgICAgICBzb3J0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgLy8gb25seSBrZWVwIHNpbXBsZSBzb3J0IHByb3BlcnRpZXMgdGhhdCB3b3JrIHdpdGggdW5pb25lZCBkb21haW5zXG4gIGNvbnN0IG9ubHlTaW1wbGVTb3J0cyA9IHNvcnRzLmZpbHRlcihzID0+IHtcbiAgICBpZiAodXRpbC5pc0Jvb2xlYW4ocykpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRvbWFpblNvcnREcm9wcGVkKHMpKTtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0pIGFzIFZnVW5pb25Tb3J0RmllbGRbXTtcblxuICBsZXQgc29ydDogVmdVbmlvblNvcnRGaWVsZCA9IHRydWU7XG5cbiAgaWYgKG9ubHlTaW1wbGVTb3J0cy5sZW5ndGggPT09IDEpIHtcbiAgICBzb3J0ID0gb25seVNpbXBsZVNvcnRzWzBdO1xuICB9IGVsc2UgaWYgKG9ubHlTaW1wbGVTb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgLy8gaWdub3JlIHNvcnQgPSBmYWxzZSBpZiB3ZSBoYXZlIGFub3RoZXIgc29ydCBwcm9wZXJ0eVxuICAgIGNvbnN0IGZpbHRlcmVkU29ydHMgPSBvbmx5U2ltcGxlU29ydHMuZmlsdGVyKHMgPT4gcyAhPT0gZmFsc2UpO1xuXG4gICAgaWYgKGZpbHRlcmVkU29ydHMubGVuZ3RoID4gMSkge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICAgIHNvcnQgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBzb3J0ID0gZmlsdGVyZWRTb3J0c1swXTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBhbGxEYXRhID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZCA9PiB7XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkKSkge1xuICAgICAgcmV0dXJuIGQuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pLCB4ID0+IHgpO1xuXG4gIGlmIChhbGxEYXRhLmxlbmd0aCA9PT0gMSAmJiBhbGxEYXRhWzBdICE9PSBudWxsKSB7XG4gICAgLy8gY3JlYXRlIGEgdW5pb24gZG9tYWluIG9mIGRpZmZlcmVudCBmaWVsZHMgd2l0aCBhIHNpbmdsZSBkYXRhIHNvdXJjZVxuICAgIGNvbnN0IGRvbWFpbjogVmdGaWVsZFJlZlVuaW9uRG9tYWluID0ge1xuICAgICAgZGF0YTogYWxsRGF0YVswXSxcbiAgICAgIGZpZWxkczogdW5pcXVlRG9tYWlucy5tYXAoZCA9PiAoZCBhcyBWZ0RhdGFSZWYpLmZpZWxkKSxcbiAgICAgIHNvcnRcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIHJldHVybiB7ZmllbGRzOiB1bmlxdWVEb21haW5zLCBzb3J0fTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmaWVsZCBpZiBhIHNjYWxlIHNpbmdsZSBmaWVsZC5cbiAqIFJldHVybiBgdW5kZWZpbmVkYCBvdGhlcndpc2UuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbjogVmdEb21haW4pOiBzdHJpbmcge1xuICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgaXNTdHJpbmcoZG9tYWluLmZpZWxkKSkge1xuICAgIHJldHVybiBkb21haW4uZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNEYXRhUmVmVW5pb25lZERvbWFpbihkb21haW4pKSB7XG4gICAgbGV0IGZpZWxkO1xuICAgIGZvciAoY29uc3Qgbm9uVW5pb25Eb21haW4gb2YgZG9tYWluLmZpZWxkcykge1xuICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihub25VbmlvbkRvbWFpbikgJiYgaXNTdHJpbmcobm9uVW5pb25Eb21haW4uZmllbGQpKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9IG5vblVuaW9uRG9tYWluLmZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkICE9PSBub25VbmlvbkRvbWFpbi5maWVsZCkge1xuICAgICAgICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzLiAgV2Ugd2lsbCB1c2UgdGhlIGZpcnN0IGZpZWxkLiAgVGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5IGJlIGluY29ycmVjdC4nKTtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIGlkZW50aWNhbCBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgc291cmNlIGRldGVjdGVkLiAgV2Ugd2lsbCBhc3N1bWUgdGhhdCB0aGlzIGlzIHRoZSBzYW1lIGZpZWxkIGZyb20gYSBkaWZmZXJlbnQgZm9yayBvZiB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIEhvd2V2ZXIsIGlmIHRoaXMgaXMgbm90IGNhc2UsIHRoZSByZXN1bHQgdmlldyBzaXplIG1heWJlIGluY29ycmVjdC4nKTtcbiAgICByZXR1cm4gZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZFJlZlVuaW9uRG9tYWluKGRvbWFpbikgJiYgaXNTdHJpbmcpIHtcbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgbXVsdGlwbGUgZmllbGRzIGZyb20gdGhlIHNhbWUgZGF0YSBzb3VyY2UuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9tYWluLmZpZWxkc1swXTtcbiAgICByZXR1cm4gaXNTdHJpbmcoZmllbGQpID8gZmllbGQgOiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVEb21haW4obW9kZWw6IE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpIHtcbiAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICBjb25zdCBkb21haW5zID0gc2NhbGVDb21wb25lbnQuZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBDb3JyZWN0IHJlZmVyZW5jZXMgdG8gZGF0YSBhcyB0aGUgb3JpZ2luYWwgZG9tYWluJ3MgZGF0YSB3YXMgZGV0ZXJtaW5lZFxuICAgIC8vIGluIHBhcnNlU2NhbGUsIHdoaWNoIGhhcHBlbnMgYmVmb3JlIHBhcnNlRGF0YS4gVGh1cyB0aGUgb3JpZ2luYWwgZGF0YVxuICAgIC8vIHJlZmVyZW5jZSBjYW4gYmUgaW5jb3JyZWN0LlxuXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBkb21haW4uZGF0YSA9IG1vZGVsLmxvb2t1cERhdGFTb3VyY2UoZG9tYWluLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KTtcblxuICAvLyBkb21haW5zIGlzIGFuIGFycmF5IHRoYXQgaGFzIHRvIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIHZlZ2EgZG9tYWluXG4gIHJldHVybiBtZXJnZURvbWFpbnMoZG9tYWlucyk7XG59XG4iXX0=