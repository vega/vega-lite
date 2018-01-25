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
    if (vega_schema_2.isDataRefDomain(domain) && util.isString(domain.field)) {
        return domain.field;
    }
    else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
        var field = void 0;
        for (var _i = 0, _a = domain.fields; _i < _a.length; _i++) {
            var nonUnionDomain = _a[_i];
            if (vega_schema_2.isDataRefDomain(nonUnionDomain) && util.isString(nonUnionDomain.field)) {
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
        return util.isString(field) ? field : undefined;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBdUQ7QUFDdkQsaUNBQXNDO0FBQ3RDLHlDQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsMkNBQWtFO0FBRWxFLCtCQUFpQztBQUNqQyxxQ0FBNkc7QUFDN0csbUNBQWtEO0FBQ2xELG1DQUFnQztBQUNoQyxpQ0FBbUM7QUFDbkMsaURBQWdGO0FBQ2hGLGlEQVEyQjtBQUMzQixvQ0FBMkM7QUFDM0MsNkNBQW9EO0FBQ3BELGtDQUEwRDtBQUMxRCxvREFBd0Q7QUFLeEQsMEJBQWlDLEtBQVk7SUFDM0MsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04sdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztBQUNILENBQUM7QUFORCw0Q0FNQztBQUVELDhCQUE4QixLQUFnQjtJQUM1QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO0lBQ3JDLElBQU0sb0JBQW9CLEdBQXdCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXpFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFxQjtRQUM1RCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsSUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFM0UsSUFBTSxPQUFPLEdBQUcscUJBQXFCLENBQUMsS0FBSyxFQUFF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WH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7YmluVG9TdHJpbmd9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge2lzU2NhbGVDaGFubmVsLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgZGF0ZVRpbWVFeHByLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7RG9tYWluLCBoYXNEaXNjcmV0ZURvbWFpbiwgaXNCaW5TY2FsZSwgaXNTZWxlY3Rpb25Eb21haW4sIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7aXNTb3J0RmllbGQsIFNvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2hhc2h9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7aXNEYXRhUmVmVW5pb25lZERvbWFpbiwgaXNGaWVsZFJlZlVuaW9uRG9tYWlufSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1xuICBpc0RhdGFSZWZEb21haW4sXG4gIFZnRGF0YVJlZixcbiAgVmdEb21haW4sXG4gIFZnRmllbGRSZWZVbmlvbkRvbWFpbixcbiAgVmdOb25VbmlvbkRvbWFpbixcbiAgVmdTb3J0RmllbGQsXG4gIFZnVW5pb25Tb3J0RmllbGQsXG59IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7RkFDRVRfU0NBTEVfUFJFRklYfSBmcm9tICcuLi9kYXRhL29wdGltaXplJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7U0VMRUNUSU9OX0RPTUFJTn0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZURvbWFpbihtb2RlbDogTW9kZWwpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIHBhcnNlVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZU5vblVuaXRTY2FsZURvbWFpbihtb2RlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBzY2FsZXMgPSBtb2RlbC5zcGVjaWZpZWRTY2FsZXM7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICB1dGlsLmtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gc2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHNwZWNpZmllZERvbWFpbiA9IHNwZWNpZmllZFNjYWxlID8gc3BlY2lmaWVkU2NhbGUuZG9tYWluIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZG9tYWlucyA9IHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCk7XG4gICAgY29uc3QgbG9jYWxTY2FsZUNtcHQgPSBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXTtcbiAgICBsb2NhbFNjYWxlQ21wdC5kb21haW5zID0gZG9tYWlucztcblxuICAgIGlmIChpc1NlbGVjdGlvbkRvbWFpbihzcGVjaWZpZWREb21haW4pKSB7XG4gICAgICAvLyBBcyBzY2FsZSBwYXJzaW5nIG9jY3VycyBiZWZvcmUgc2VsZWN0aW9uIHBhcnNpbmcsIHdlIHVzZSBhIHRlbXBvcmFyeVxuICAgICAgLy8gc2lnbmFsIGhlcmUgYW5kIGFwcGVuZCB0aGUgc2NhbGUuZG9tYWluIGRlZmluaXRpb24uIFRoaXMgaXMgcmVwbGFjZWRcbiAgICAgIC8vIHdpdGggdGhlIGNvcnJlY3QgZG9tYWluUmF3IHNpZ25hbCBkdXJpbmcgc2NhbGUgYXNzZW1ibHkuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIGlzUmF3U2VsZWN0aW9uRG9tYWluIGluIHNlbGVjdGlvbi50cy5cblxuICAgICAgLy8gRklYTUU6IHJlcGxhY2UgdGhpcyB3aXRoIGEgc3BlY2lhbCBwcm9wZXJ0eSBpbiB0aGUgc2NhbGVDb21wb25lbnRcbiAgICAgIGxvY2FsU2NhbGVDbXB0LnNldCgnZG9tYWluUmF3Jywge1xuICAgICAgICBzaWduYWw6IFNFTEVDVElPTl9ET01BSU4gKyBoYXNoKHNwZWNpZmllZERvbWFpbilcbiAgICAgIH0sIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5jb21wb25lbnQuZGF0YS5pc0ZhY2V0ZWQpIHtcbiAgICAgIC8vIGdldCByZXNvbHZlIGZyb20gY2xvc2VzdCBmYWNldCBwYXJlbnQgYXMgdGhpcyBkZWNpZGVzIHdoZXRoZXIgd2UgbmVlZCB0byByZWZlciB0byBjbG9uZWQgc3VidHJlZSBvciBub3RcbiAgICAgIGxldCBmYWNldFBhcmVudDogTW9kZWwgPSBtb2RlbDtcbiAgICAgIHdoaWxlICghaXNGYWNldE1vZGVsKGZhY2V0UGFyZW50KSAmJiBmYWNldFBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgZmFjZXRQYXJlbnQgPSBmYWNldFBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmYWNldFBhcmVudC5jb21wb25lbnQucmVzb2x2ZS5zY2FsZVtjaGFubmVsXTtcblxuICAgICAgaWYgKHJlc29sdmUgPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIGZvciAoY29uc3QgZG9tYWluIG9mIGRvbWFpbnMpIHtcbiAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBzY2FsZSBkb21haW4gd2l0aCBkYXRhIG91dHB1dCBmcm9tIGEgY2xvbmVkIHN1YnRyZWUgYWZ0ZXIgdGhlIGZhY2V0LlxuICAgICAgICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgICAgICAgLy8gdXNlIGRhdGEgZnJvbSBjbG9uZWQgc3VidHJlZSAod2hpY2ggaXMgdGhlIHNhbWUgYXMgZGF0YSBidXQgd2l0aCBhIHByZWZpeCBhZGRlZCBvbmNlKVxuICAgICAgICAgICAgZG9tYWluLmRhdGEgPSBGQUNFVF9TQ0FMRV9QUkVGSVggKyBkb21haW4uZGF0YS5yZXBsYWNlKEZBQ0VUX1NDQUxFX1BSRUZJWCwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgcGFyc2VTY2FsZURvbWFpbihjaGlsZCk7XG4gIH1cblxuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgdXRpbC5rZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICAvLyBGSVhNRTogQXJ2aW5kIC0tIFBsZWFzZSByZXZpc2UgbG9naWMgZm9yIG1lcmdpbmcgc2VsZWN0aW9uRG9tYWluIC8gZG9tYWluUmF3XG5cbiAgICBsZXQgZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgIGlmIChkb21haW5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkb21haW5zID0gY2hpbGRDb21wb25lbnQuZG9tYWlucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb21haW5zID0gZG9tYWlucy5jb25jYXQoY2hpbGRDb21wb25lbnQuZG9tYWlucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5kb21haW5zID0gZG9tYWlucztcbiAgfSk7XG59XG5cblxuLyoqXG4gKiBSZW1vdmUgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiBpdCBpcyBub3QgYXBwbGljYWJsZVxuICogQWRkIHVuYWdncmVnYXRlZCBkb21haW4gaWYgZG9tYWluIGlzIG5vdCBzcGVjaWZpZWQgYW5kIGNvbmZpZy5zY2FsZS51c2VVbmFnZ3JlZ2F0ZWREb21haW4gaXMgdHJ1ZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplVW5hZ2dyZWdhdGVkRG9tYWluKGRvbWFpbjogRG9tYWluLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZykge1xuICBpZiAoZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgIGNvbnN0IHt2YWxpZCwgcmVhc29ufSA9IGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZiwgc2NhbGVUeXBlKTtcbiAgICBpZighdmFsaWQpIHtcbiAgICAgIGxvZy53YXJuKHJlYXNvbik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIGlmIChkb21haW4gPT09IHVuZGVmaW5lZCAmJiBzY2FsZUNvbmZpZy51c2VVbmFnZ3JlZ2F0ZWREb21haW4pIHtcbiAgICAvLyBBcHBseSBjb25maWcgaWYgZG9tYWluIGlzIG5vdCBzcGVjaWZpZWQuXG4gICAgY29uc3Qge3ZhbGlkfSA9IGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZiwgc2NhbGVUeXBlKTtcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHJldHVybiAndW5hZ2dyZWdhdGVkJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZG9tYWluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IFZnTm9uVW5pb25Eb21haW5bXSB7XG4gIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuXG4gIGNvbnN0IGRvbWFpbiA9IG5vcm1hbGl6ZVVuYWdncmVnYXRlZERvbWFpbihtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSwgbW9kZWwuZmllbGREZWYoY2hhbm5lbCksIHNjYWxlVHlwZSwgbW9kZWwuY29uZmlnLnNjYWxlKTtcbiAgaWYgKGRvbWFpbiAhPT0gbW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCkpIHtcbiAgICBtb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF0gPSB7XG4gICAgICAuLi5tb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF0sXG4gICAgICBkb21haW5cbiAgICB9O1xuICB9XG5cbiAgLy8gSWYgY2hhbm5lbCBpcyBlaXRoZXIgWCBvciBZIHRoZW4gdW5pb24gdGhlbSB3aXRoIFgyICYgWTIgaWYgdGhleSBleGlzdFxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnICYmIG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneDInKSkge1xuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3gnKSkge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd4JykuY29uY2F0KHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd4MicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd4MicpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneScgJiYgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd5MicpKSB7XG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneScpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3knKS5jb25jYXQocGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3kyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3kyJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCBjaGFubmVsKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBkb21haW46IERvbWFpbiwgbW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsIHwgJ3gyJyB8ICd5MicpOiBWZ05vblVuaW9uRG9tYWluW10ge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmIChkb21haW4gJiYgZG9tYWluICE9PSAndW5hZ2dyZWdhdGVkJyAmJiAhaXNTZWxlY3Rpb25Eb21haW4oZG9tYWluKSkgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIGlmIChmaWVsZERlZi5iaW4pIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmNvbmZsaWN0ZWREb21haW4oY2hhbm5lbCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaXNEYXRlVGltZShkb21haW5bMF0pKSB7XG4gICAgICAgIHJldHVybiAoZG9tYWluIGFzIERhdGVUaW1lW10pLm1hcCgoZHQpID0+IHtcbiAgICAgICAgICByZXR1cm4ge3NpZ25hbDogYHtkYXRhOiAke2RhdGVUaW1lRXhwcihkdCwgdHJ1ZSl9fWB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBbZG9tYWluXTtcbiAgICB9XG4gIH1cblxuICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrO1xuICBpZiAoc3RhY2sgJiYgY2hhbm5lbCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgaWYoc3RhY2sub2Zmc2V0ID09PSAnbm9ybWFsaXplJykge1xuICAgICAgcmV0dXJuIFtbMCwgMV1dO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge3N1ZmZpeDogJ3N0YXJ0J30pXG4gICAgfSwge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtzdWZmaXg6ICdlbmQnfSlcbiAgICB9XTtcbiAgfVxuXG4gIGNvbnN0IHNvcnQgPSBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSA/IGRvbWFpblNvcnQobW9kZWwsIGNoYW5uZWwsIHNjYWxlVHlwZSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHthZ2dyZWdhdGU6ICdtaW4nfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2FnZ3JlZ2F0ZTogJ21heCd9KVxuICAgIH1dO1xuICB9IGVsc2UgaWYgKGZpZWxkRGVmLmJpbikgeyAvLyBiaW5cbiAgICBpZiAoaXNCaW5TY2FsZShzY2FsZVR5cGUpKSB7XG4gICAgICBjb25zdCBzaWduYWwgPSBtb2RlbC5nZXROYW1lKGAke2JpblRvU3RyaW5nKGZpZWxkRGVmLmJpbil9XyR7ZmllbGREZWYuZmllbGR9X2JpbnNgKTtcbiAgICAgIHJldHVybiBbe3NpZ25hbDogYHNlcXVlbmNlKCR7c2lnbmFsfS5zdGFydCwgJHtzaWduYWx9LnN0b3AgKyAke3NpZ25hbH0uc3RlcCwgJHtzaWduYWx9LnN0ZXApYH1dO1xuICAgIH1cblxuICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgICAvLyBvcmRpbmFsIGJpbiBzY2FsZSB0YWtlcyBkb21haW4gZnJvbSBiaW5fcmFuZ2UsIG9yZGVyZWQgYnkgYmluIHN0YXJ0XG4gICAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgYm90aCBheGlzLWJhc2VkIHNjYWxlICh4L3kpIGFuZCBsZWdlbmQtYmFzZWQgc2NhbGUgKG90aGVyIGNoYW5uZWxzKS5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFJBVyB0YWJsZSxcbiAgICAgICAgLy8gc28gd2UgY2FuIGFnZ3JlZ2F0ZSB2YWx1ZXMgZm9yIHRoZSBzY2FsZSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIG1haW4gYWdncmVnYXRpb24uXG4gICAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICAgIC8vIFVzZSByYW5nZSBpZiB3ZSBhZGRlZCBpdCBhbmQgdGhlIHNjYWxlIGRvZXMgbm90IHN1cHBvcnQgY29tcHV0aW5nIGEgcmFuZ2UgYXMgYSBzaWduYWwuXG4gICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWYsIGNoYW5uZWwpID8ge2JpblN1ZmZpeDogJ3JhbmdlJ30gOiB7fSksXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gdXNlIGEgc29ydCBvYmplY3QgaWYgc29ydCA9IHRydWUgdG8gbWFrZSB0aGUgc29ydCBjb3JyZWN0IGJ5IGJpbiBzdGFydFxuICAgICAgICBzb3J0OiBzb3J0ID09PSB0cnVlIHx8ICFpc1NvcnRGaWVsZChzb3J0KSA/IHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSksXG4gICAgICAgICAgb3A6ICdtaW4nIC8vIG1pbiBvciBtYXggZG9lc24ndCBtYXR0ZXIgc2luY2Ugd2Ugc29ydCBieSB0aGUgc3RhcnQgb2YgdGhlIGJpbiByYW5nZVxuICAgICAgICB9IDogc29ydFxuICAgICAgfV07XG4gICAgfSBlbHNlIHsgLy8gY29udGludW91cyBzY2FsZXNcbiAgICAgIGlmIChjaGFubmVsID09PSAneCcgfHwgY2hhbm5lbCA9PT0gJ3knKSB7XG4gICAgICAgIC8vIFgvWSBwb3NpdGlvbiBoYXZlIHRvIGluY2x1ZGUgc3RhcnQgYW5kIGVuZCBmb3Igbm9uLW9yZGluYWwgc2NhbGVcbiAgICAgICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ2VuZCd9KVxuICAgICAgICB9XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHVzZSBiaW5fbWlkXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSlcbiAgICAgICAgfV07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHNvcnQpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgUkFXIHRhYmxlLFxuICAgICAgLy8gc28gd2UgY2FuIGFnZ3JlZ2F0ZSB2YWx1ZXMgZm9yIHRoZSBzY2FsZSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIG1haW4gYWdncmVnYXRpb24uXG4gICAgICBkYXRhOiB1dGlsLmlzQm9vbGVhbihzb3J0KSA/IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSA6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShSQVcpLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCksXG4gICAgICBzb3J0OiBzb3J0XG4gICAgfV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKVxuICAgIH1dO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnQobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6IHRydWUgfCBTb3J0RmllbGQ8c3RyaW5nPiB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBzb3J0ID0gbW9kZWwuc29ydChjaGFubmVsKTtcblxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcbiAgaWYgKGlzU29ydEZpZWxkKHNvcnQpKSB7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cblxuICBpZiAoc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wOiAnbWluJyxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpLFxuICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgIH07XG4gIH1cblxuICBpZiAodXRpbC5jb250YWlucyhbJ2FzY2VuZGluZycsIHVuZGVmaW5lZCAvKiBkZWZhdWx0ID1hc2NlbmRpbmcqL10sIHNvcnQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBzb3J0ID09IG51bGxcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgc2NhbGUgY2FuIHVzZSB1bmFnZ3JlZ2F0ZWQgZG9tYWluLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdG9ucyBhcHBsaWVzOlxuICogMS4gYHNjYWxlLmRvbWFpbmAgaXMgYHVuYWdncmVnYXRlZGBcbiAqIDIuIEFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIGlzIG5vdCBgY291bnRgIG9yIGBzdW1gXG4gKiAzLiBUaGUgc2NhbGUgaXMgcXVhbnRpdGF0aXZlIG9yIHRpbWUgc2NhbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlKToge3ZhbGlkOiBib29sZWFuLCByZWFzb24/OiBzdHJpbmd9IHtcbiAgaWYgKCFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbkhhc05vRWZmZWN0Rm9yUmF3RmllbGQoZmllbGREZWYpXG4gICAgfTtcbiAgfVxuXG4gIGlmICghU0hBUkVEX0RPTUFJTl9PUF9JTkRFWFtmaWVsZERlZi5hZ2dyZWdhdGVdKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVEb21haW5XaXRoTm9uU2hhcmVkRG9tYWluT3AoZmllbGREZWYuYWdncmVnYXRlKVxuICAgIH07XG4gIH1cblxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICBpZiAoc2NhbGVUeXBlID09PSAnbG9nJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlZERvbWFpbldpdGhMb2dTY2FsZShmaWVsZERlZilcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHt2YWxpZDogdHJ1ZX07XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgb2YgZG9tYWlucyB0byBhIHNpbmdsZSBWZWdhIHNjYWxlIGRvbWFpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRG9tYWlucyhkb21haW5zOiBWZ05vblVuaW9uRG9tYWluW10pOiBWZ0RvbWFpbiB7XG4gIGNvbnN0IHVuaXF1ZURvbWFpbnMgPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkb21haW4gPT4ge1xuICAgIC8vIGlnbm9yZSBzb3J0IHByb3BlcnR5IHdoZW4gY29tcHV0aW5nIHRoZSB1bmlxdWUgZG9tYWluc1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgY29uc3Qge3NvcnQ6IF9zLCAuLi5kb21haW5XaXRob3V0U29ydH0gPSBkb21haW47XG4gICAgICByZXR1cm4gZG9tYWluV2l0aG91dFNvcnQ7XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH0pLCB1dGlsLmhhc2gpO1xuXG4gIGNvbnN0IHNvcnRzOiBWZ1NvcnRGaWVsZFtdID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZCA9PiB7XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkKSkge1xuICAgICAgY29uc3QgcyA9IGQuc29ydDtcbiAgICAgIGlmIChzICE9PSB1bmRlZmluZWQgJiYgIXV0aWwuaXNCb29sZWFuKHMpKSB7XG4gICAgICAgIGlmIChzLm9wID09PSAnY291bnQnKSB7XG4gICAgICAgICAgLy8gbGV0J3MgbWFrZSBzdXJlIHRoYXQgaWYgb3AgaXMgY291bnQsIHdlIGRvbid0IHVzZSBhIGZpZWxkXG4gICAgICAgICAgZGVsZXRlIHMuZmllbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMub3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XG4gICAgICAgICAgLy8gZHJvcCBvcmRlcjogYXNjZW5kaW5nIGFzIGl0IGlzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgZGVsZXRlIHMub3JkZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KS5maWx0ZXIocyA9PiBzICE9PSB1bmRlZmluZWQpLCB1dGlsLmhhc2gpO1xuXG4gIGlmICh1bmlxdWVEb21haW5zLmxlbmd0aCA9PT0gMSkge1xuICAgIGNvbnN0IGRvbWFpbiA9IGRvbWFpbnNbMF07XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pICYmIHNvcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBzb3J0ID0gc29ydHNbMF07XG4gICAgICBpZiAoc29ydHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgICAgICBzb3J0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRvbWFpbixcbiAgICAgICAgc29ydFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIC8vIG9ubHkga2VlcCBzaW1wbGUgc29ydCBwcm9wZXJ0aWVzIHRoYXQgd29yayB3aXRoIHVuaW9uZWQgZG9tYWluc1xuICBjb25zdCBzaW1wbGVTb3J0cyA9IHV0aWwudW5pcXVlKHNvcnRzLm1hcChzID0+IHtcbiAgICBpZiAocyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIGlmIChzLm9wID09PSAnY291bnQnKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZG9tYWluU29ydERyb3BwZWQocykpO1xuICAgIHJldHVybiB0cnVlO1xuICB9KSwgdXRpbC5oYXNoKSBhcyBWZ1VuaW9uU29ydEZpZWxkW107XG5cbiAgbGV0IHNvcnQ6IFZnVW5pb25Tb3J0RmllbGQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKHNpbXBsZVNvcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHNvcnQgPSBzaW1wbGVTb3J0c1swXTtcbiAgfSBlbHNlIGlmIChzaW1wbGVTb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICBzb3J0ID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGFsbERhdGEgPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkID0+IHtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGQpKSB7XG4gICAgICByZXR1cm4gZC5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSksIHggPT4geCk7XG5cbiAgaWYgKGFsbERhdGEubGVuZ3RoID09PSAxICYmIGFsbERhdGFbMF0gIT09IG51bGwpIHtcbiAgICAvLyBjcmVhdGUgYSB1bmlvbiBkb21haW4gb2YgZGlmZmVyZW50IGZpZWxkcyB3aXRoIGEgc2luZ2xlIGRhdGEgc291cmNlXG4gICAgY29uc3QgZG9tYWluOiBWZ0ZpZWxkUmVmVW5pb25Eb21haW4gPSB7XG4gICAgICBkYXRhOiBhbGxEYXRhWzBdLFxuICAgICAgZmllbGRzOiB1bmlxdWVEb21haW5zLm1hcChkID0+IChkIGFzIFZnRGF0YVJlZikuZmllbGQpLFxuICAgICAgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSlcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIHJldHVybiB7ZmllbGRzOiB1bmlxdWVEb21haW5zLCAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KX07XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZmllbGQgaWYgYSBzY2FsZSBzaW5nbGUgZmllbGQuXG4gKiBSZXR1cm4gYHVuZGVmaW5lZGAgb3RoZXJ3aXNlLlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkRnJvbURvbWFpbihkb21haW46IFZnRG9tYWluKTogc3RyaW5nIHtcbiAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pICYmIHV0aWwuaXNTdHJpbmcoZG9tYWluLmZpZWxkKSkge1xuICAgIHJldHVybiBkb21haW4uZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNEYXRhUmVmVW5pb25lZERvbWFpbihkb21haW4pKSB7XG4gICAgbGV0IGZpZWxkO1xuICAgIGZvciAoY29uc3Qgbm9uVW5pb25Eb21haW4gb2YgZG9tYWluLmZpZWxkcykge1xuICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihub25VbmlvbkRvbWFpbikgJiYgdXRpbC5pc1N0cmluZyhub25VbmlvbkRvbWFpbi5maWVsZCkpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gbm9uVW5pb25Eb21haW4uZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQgIT09IG5vblVuaW9uRG9tYWluLmZpZWxkKSB7XG4gICAgICAgICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIG11bHRpcGxlIGZpZWxkcyBmcm9tIGRpZmZlcmVudCBkYXRhIHNvdXJjZXMuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgICAgICAgIHJldHVybiBmaWVsZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgaWRlbnRpY2FsIGZpZWxkcyBmcm9tIGRpZmZlcmVudCBzb3VyY2UgZGV0ZWN0ZWQuICBXZSB3aWxsIGFzc3VtZSB0aGF0IHRoaXMgaXMgdGhlIHNhbWUgZmllbGQgZnJvbSBhIGRpZmZlcmVudCBmb3JrIG9mIHRoZSBzYW1lIGRhdGEgc291cmNlLiAgSG93ZXZlciwgaWYgdGhpcyBpcyBub3QgY2FzZSwgdGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5YmUgaW5jb3JyZWN0LicpO1xuICAgIHJldHVybiBmaWVsZDtcbiAgfSBlbHNlIGlmIChpc0ZpZWxkUmVmVW5pb25Eb21haW4oZG9tYWluKSkge1xuICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIFdlIHdpbGwgdXNlIHRoZSBmaXJzdCBmaWVsZC4gIFRoZSByZXN1bHQgdmlldyBzaXplIG1heSBiZSBpbmNvcnJlY3QuJyk7XG4gICAgY29uc3QgZmllbGQgPSBkb21haW4uZmllbGRzWzBdO1xuICAgIHJldHVybiB1dGlsLmlzU3RyaW5nKGZpZWxkKSA/IGZpZWxkIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlRG9tYWluKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKSB7XG4gIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgY29uc3QgZG9tYWlucyA9IHNjYWxlQ29tcG9uZW50LmRvbWFpbnMubWFwKGRvbWFpbiA9PiB7XG4gICAgLy8gQ29ycmVjdCByZWZlcmVuY2VzIHRvIGRhdGEgYXMgdGhlIG9yaWdpbmFsIGRvbWFpbidzIGRhdGEgd2FzIGRldGVybWluZWRcbiAgICAvLyBpbiBwYXJzZVNjYWxlLCB3aGljaCBoYXBwZW5zIGJlZm9yZSBwYXJzZURhdGEuIFRodXMgdGhlIG9yaWdpbmFsIGRhdGFcbiAgICAvLyByZWZlcmVuY2UgY2FuIGJlIGluY29ycmVjdC5cblxuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgZG9tYWluLmRhdGEgPSBtb2RlbC5sb29rdXBEYXRhU291cmNlKGRvbWFpbi5kYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfSk7XG5cbiAgLy8gZG9tYWlucyBpcyBhbiBhcnJheSB0aGF0IGhhcyB0byBiZSBtZXJnZWQgaW50byBhIHNpbmdsZSB2ZWdhIGRvbWFpblxuICByZXR1cm4gbWVyZ2VEb21haW5zKGRvbWFpbnMpO1xufVxuIl19