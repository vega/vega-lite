"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
var calculate_1 = require("../data/calculate");
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
function parseDomainForChannel(model, channel) {
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
exports.parseDomainForChannel = parseDomainForChannel;
function parseSingleChannelDomain(scaleType, domain, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (domain && domain !== 'unaggregated' && !scale_1.isSelectionDomain(domain)) { // explicit value
        if (datetime_1.isDateTime(domain[0])) {
            return domain.map(function (dt) {
                return { signal: "{data: " + datetime_1.dateTimeExpr(dt, true) + "}" };
            });
        }
        return [domain];
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
    else if (fieldDef.bin) { // bin
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
        else { // continuous scales
            if (channel === 'x' || channel === 'y') {
                if (bin_1.isBinParams(fieldDef.bin) && fieldDef.bin.extent) {
                    return [fieldDef.bin.extent];
                }
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
    // if the sort is specified with array, use the derived sort index field
    if (sort_1.isSortArray(sort)) {
        return {
            op: 'min',
            field: calculate_1.sortArrayIndexField(model, channel),
            order: 'ascending'
        };
    }
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
            var _s = domain.sort, domainWithoutSort = tslib_1.__rest(domain, ["sort"]);
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
            return tslib_1.__assign({}, domain, { sort: sort_2 });
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
        var domain = tslib_1.__assign({ data: allData[0], fields: uniqueDomains.map(function (d) { return d.field; }) }, (sort ? { sort: sort } : {}));
        return domain;
    }
    return tslib_1.__assign({ fields: uniqueDomains }, (sort ? { sort: sort } : {}));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtQztBQUNuQyw2Q0FBdUQ7QUFDdkQsaUNBQW1EO0FBQ25ELHlDQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsMkNBQWtFO0FBRWxFLCtCQUFpQztBQUNqQyxxQ0FBNkc7QUFDN0csbUNBQStEO0FBQy9ELG1DQUFnQztBQUNoQyxpQ0FBbUM7QUFDbkMsaURBQWdGO0FBQ2hGLGlEQVEyQjtBQUMzQixvQ0FBMkM7QUFDM0MsK0NBQXNEO0FBQ3RELDZDQUFvRDtBQUNwRCxrQ0FBMEQ7QUFDMUQsb0RBQXdEO0FBS3hELDBCQUFpQyxLQUFZO0lBQzNDLElBQUksbUJBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3QjtTQUFNO1FBQ0wsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7QUFDSCxDQUFDO0FBTkQsNENBTUM7QUFFRCw4QkFBOEIsS0FBZ0I7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztJQUNyQyxJQUFNLG9CQUFvQixHQUF3QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUV6RSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDNUQsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRTNFLElBQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLGNBQWMsR0FB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QUMsQ0FBQztJQUN2RCxJQUFNLE9BQU8sR0FBRyxjQUFjLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU07UUFDL0MsMEVBQTBFO1FBQzFFLHdFQUF3RTtRQUN4RSw4QkFBOEI7UUFFOUIsSUFBSSw2QkFBZSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQzNCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuRDtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxDQUFDO0lBRUgsc0VBQXNFO0lBQ3RFLE9BQU8sWUFBWSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFmRCx3Q0FlQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge1NIQVJFRF9ET01BSU5fT1BfSU5ERVh9IGZyb20gJy4uLy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2JpblRvU3RyaW5nLCBpc0JpblBhcmFtc30gZnJvbSAnLi4vLi4vYmluJztcbmltcG9ydCB7aXNTY2FsZUNoYW5uZWwsIFNjYWxlQ2hhbm5lbH0gZnJvbSAnLi4vLi4vY2hhbm5lbCc7XG5pbXBvcnQge01BSU4sIFJBV30gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0RhdGVUaW1lLCBkYXRlVGltZUV4cHIsIGlzRGF0ZVRpbWV9IGZyb20gJy4uLy4uL2RhdGV0aW1lJztcbmltcG9ydCB7RmllbGREZWZ9IGZyb20gJy4uLy4uL2ZpZWxkZGVmJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtEb21haW4sIGhhc0Rpc2NyZXRlRG9tYWluLCBpc0JpblNjYWxlLCBpc1NlbGVjdGlvbkRvbWFpbiwgU2NhbGVDb25maWcsIFNjYWxlVHlwZX0gZnJvbSAnLi4vLi4vc2NhbGUnO1xuaW1wb3J0IHtpc1NvcnRBcnJheSwgaXNTb3J0RmllbGQsIFNvcnRGaWVsZH0gZnJvbSAnLi4vLi4vc29ydCc7XG5pbXBvcnQge2hhc2h9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7aXNEYXRhUmVmVW5pb25lZERvbWFpbiwgaXNGaWVsZFJlZlVuaW9uRG9tYWlufSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge1xuICBpc0RhdGFSZWZEb21haW4sXG4gIFZnRGF0YVJlZixcbiAgVmdEb21haW4sXG4gIFZnRmllbGRSZWZVbmlvbkRvbWFpbixcbiAgVmdOb25VbmlvbkRvbWFpbixcbiAgVmdTb3J0RmllbGQsXG4gIFZnVW5pb25Tb3J0RmllbGQsXG59IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7c29ydEFycmF5SW5kZXhGaWVsZH0gZnJvbSAnLi4vZGF0YS9jYWxjdWxhdGUnO1xuaW1wb3J0IHtGQUNFVF9TQ0FMRV9QUkVGSVh9IGZyb20gJy4uL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZURvbWFpbihtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlcyA9IG1vZGVsLnNwZWNpZmllZFNjYWxlcztcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBzY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3Qgc3BlY2lmaWVkRG9tYWluID0gc3BlY2lmaWVkU2NhbGUgPyBzcGVjaWZpZWRTY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBkb21haW5zID0gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKTtcbiAgICBjb25zdCBsb2NhbFNjYWxlQ21wdCA9IGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdO1xuICAgIGxvY2FsU2NhbGVDbXB0LmRvbWFpbnMgPSBkb21haW5zO1xuXG4gICAgaWYgKGlzU2VsZWN0aW9uRG9tYWluKHNwZWNpZmllZERvbWFpbikpIHtcbiAgICAgIC8vIEFzIHNjYWxlIHBhcnNpbmcgb2NjdXJzIGJlZm9yZSBzZWxlY3Rpb24gcGFyc2luZywgd2UgdXNlIGEgdGVtcG9yYXJ5XG4gICAgICAvLyBzaWduYWwgaGVyZSBhbmQgYXBwZW5kIHRoZSBzY2FsZS5kb21haW4gZGVmaW5pdGlvbi4gVGhpcyBpcyByZXBsYWNlZFxuICAgICAgLy8gd2l0aCB0aGUgY29ycmVjdCBkb21haW5SYXcgc2lnbmFsIGR1cmluZyBzY2FsZSBhc3NlbWJseS5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaXNSYXdTZWxlY3Rpb25Eb21haW4gaW4gc2VsZWN0aW9uLnRzLlxuXG4gICAgICAvLyBGSVhNRTogcmVwbGFjZSB0aGlzIHdpdGggYSBzcGVjaWFsIHByb3BlcnR5IGluIHRoZSBzY2FsZUNvbXBvbmVudFxuICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KCdkb21haW5SYXcnLCB7XG4gICAgICAgIHNpZ25hbDogU0VMRUNUSU9OX0RPTUFJTiArIGhhc2goc3BlY2lmaWVkRG9tYWluKVxuICAgICAgfSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKG1vZGVsLmNvbXBvbmVudC5kYXRhLmlzRmFjZXRlZCkge1xuICAgICAgLy8gZ2V0IHJlc29sdmUgZnJvbSBjbG9zZXN0IGZhY2V0IHBhcmVudCBhcyB0aGlzIGRlY2lkZXMgd2hldGhlciB3ZSBuZWVkIHRvIHJlZmVyIHRvIGNsb25lZCBzdWJ0cmVlIG9yIG5vdFxuICAgICAgbGV0IGZhY2V0UGFyZW50OiBNb2RlbCA9IG1vZGVsO1xuICAgICAgd2hpbGUgKCFpc0ZhY2V0TW9kZWwoZmFjZXRQYXJlbnQpICYmIGZhY2V0UGFyZW50LnBhcmVudCkge1xuICAgICAgICBmYWNldFBhcmVudCA9IGZhY2V0UGFyZW50LnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgY29uc3QgcmVzb2x2ZSA9IGZhY2V0UGFyZW50LmNvbXBvbmVudC5yZXNvbHZlLnNjYWxlW2NoYW5uZWxdO1xuXG4gICAgICBpZiAocmVzb2x2ZSA9PT0gJ3NoYXJlZCcpIHtcbiAgICAgICAgZm9yIChjb25zdCBkb21haW4gb2YgZG9tYWlucykge1xuICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHNjYWxlIGRvbWFpbiB3aXRoIGRhdGEgb3V0cHV0IGZyb20gYSBjbG9uZWQgc3VidHJlZSBhZnRlciB0aGUgZmFjZXQuXG4gICAgICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICAgICAgICAvLyB1c2UgZGF0YSBmcm9tIGNsb25lZCBzdWJ0cmVlICh3aGljaCBpcyB0aGUgc2FtZSBhcyBkYXRhIGJ1dCB3aXRoIGEgcHJlZml4IGFkZGVkIG9uY2UpXG4gICAgICAgICAgICBkb21haW4uZGF0YSA9IEZBQ0VUX1NDQUxFX1BSRUZJWCArIGRvbWFpbi5kYXRhLnJlcGxhY2UoRkFDRVRfU0NBTEVfUFJFRklYLCAnJyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gcGFyc2VOb25Vbml0U2NhbGVEb21haW4obW9kZWw6IE1vZGVsKSB7XG4gIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICBwYXJzZVNjYWxlRG9tYWluKGNoaWxkKTtcbiAgfVxuXG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICB1dGlsLmtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGxldCBkb21haW5zOiBWZ05vblVuaW9uRG9tYWluW107XG4gICAgbGV0IGRvbWFpblJhdyA9IG51bGw7XG5cbiAgICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgICBjb25zdCBjaGlsZENvbXBvbmVudCA9IGNoaWxkLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gICAgICBpZiAoY2hpbGRDb21wb25lbnQpIHtcbiAgICAgICAgaWYgKGRvbWFpbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRvbWFpbnMgPSBjaGlsZENvbXBvbmVudC5kb21haW5zO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGRvbWFpbnMgPSBkb21haW5zLmNvbmNhdChjaGlsZENvbXBvbmVudC5kb21haW5zKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRyID0gY2hpbGRDb21wb25lbnQuZ2V0KCdkb21haW5SYXcnKTtcbiAgICAgICAgaWYgKGRvbWFpblJhdyAmJiBkciAmJiBkb21haW5SYXcuc2lnbmFsICE9PSBkci5zaWduYWwpIHtcbiAgICAgICAgICBsb2cud2FybignVGhlIHNhbWUgc2VsZWN0aW9uIG11c3QgYmUgdXNlZCB0byBvdmVycmlkZSBzY2FsZSBkb21haW5zIGluIGEgbGF5ZXJlZCB2aWV3LicpO1xuICAgICAgICB9XG4gICAgICAgIGRvbWFpblJhdyA9IGRyO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLmRvbWFpbnMgPSBkb21haW5zO1xuXG4gICAgaWYgKGRvbWFpblJhdykge1xuICAgICAgbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0uc2V0KCdkb21haW5SYXcnLCBkb21haW5SYXcsIHRydWUpO1xuICAgIH1cbiAgfSk7XG59XG5cblxuLyoqXG4gKiBSZW1vdmUgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiBpdCBpcyBub3QgYXBwbGljYWJsZVxuICogQWRkIHVuYWdncmVnYXRlZCBkb21haW4gaWYgZG9tYWluIGlzIG5vdCBzcGVjaWZpZWQgYW5kIGNvbmZpZy5zY2FsZS51c2VVbmFnZ3JlZ2F0ZWREb21haW4gaXMgdHJ1ZS5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplVW5hZ2dyZWdhdGVkRG9tYWluKGRvbWFpbjogRG9tYWluLCBmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUsIHNjYWxlQ29uZmlnOiBTY2FsZUNvbmZpZykge1xuICBpZiAoZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgIGNvbnN0IHt2YWxpZCwgcmVhc29ufSA9IGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZiwgc2NhbGVUeXBlKTtcbiAgICBpZighdmFsaWQpIHtcbiAgICAgIGxvZy53YXJuKHJlYXNvbik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIGlmIChkb21haW4gPT09IHVuZGVmaW5lZCAmJiBzY2FsZUNvbmZpZy51c2VVbmFnZ3JlZ2F0ZWREb21haW4pIHtcbiAgICAvLyBBcHBseSBjb25maWcgaWYgZG9tYWluIGlzIG5vdCBzcGVjaWZpZWQuXG4gICAgY29uc3Qge3ZhbGlkfSA9IGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZiwgc2NhbGVUeXBlKTtcbiAgICBpZiAodmFsaWQpIHtcbiAgICAgIHJldHVybiAndW5hZ2dyZWdhdGVkJztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZG9tYWluO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCk6IFZnTm9uVW5pb25Eb21haW5bXSB7XG4gIGNvbnN0IHNjYWxlVHlwZSA9IG1vZGVsLmdldFNjYWxlQ29tcG9uZW50KGNoYW5uZWwpLmdldCgndHlwZScpO1xuXG4gIGNvbnN0IGRvbWFpbiA9IG5vcm1hbGl6ZVVuYWdncmVnYXRlZERvbWFpbihtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSwgbW9kZWwuZmllbGREZWYoY2hhbm5lbCksIHNjYWxlVHlwZSwgbW9kZWwuY29uZmlnLnNjYWxlKTtcbiAgaWYgKGRvbWFpbiAhPT0gbW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCkpIHtcbiAgICBtb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF0gPSB7XG4gICAgICAuLi5tb2RlbC5zcGVjaWZpZWRTY2FsZXNbY2hhbm5lbF0sXG4gICAgICBkb21haW5cbiAgICB9O1xuICB9XG5cbiAgLy8gSWYgY2hhbm5lbCBpcyBlaXRoZXIgWCBvciBZIHRoZW4gdW5pb24gdGhlbSB3aXRoIFgyICYgWTIgaWYgdGhleSBleGlzdFxuICBpZiAoY2hhbm5lbCA9PT0gJ3gnICYmIG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneDInKSkge1xuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3gnKSkge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd4JykuY29uY2F0KHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd4MicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd4MicpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChjaGFubmVsID09PSAneScgJiYgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd5MicpKSB7XG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneScpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3knKS5jb25jYXQocGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3kyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3kyJyk7XG4gICAgfVxuICB9XG4gIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCBjaGFubmVsKTtcbn1cblxuZnVuY3Rpb24gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZTogU2NhbGVUeXBlLCBkb21haW46IERvbWFpbiwgbW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsIHwgJ3gyJyB8ICd5MicpOiBWZ05vblVuaW9uRG9tYWluW10ge1xuICBjb25zdCBmaWVsZERlZiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuXG4gIGlmIChkb21haW4gJiYgZG9tYWluICE9PSAndW5hZ2dyZWdhdGVkJyAmJiAhaXNTZWxlY3Rpb25Eb21haW4oZG9tYWluKSkgeyAvLyBleHBsaWNpdCB2YWx1ZVxuICAgIGlmIChpc0RhdGVUaW1lKGRvbWFpblswXSkpIHtcbiAgICAgIHJldHVybiAoZG9tYWluIGFzIERhdGVUaW1lW10pLm1hcCgoZHQpID0+IHtcbiAgICAgICAgcmV0dXJuIHtzaWduYWw6IGB7ZGF0YTogJHtkYXRlVGltZUV4cHIoZHQsIHRydWUpfX1gfTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gW2RvbWFpbl07XG4gIH1cblxuICBjb25zdCBzdGFjayA9IG1vZGVsLnN0YWNrO1xuICBpZiAoc3RhY2sgJiYgY2hhbm5lbCA9PT0gc3RhY2suZmllbGRDaGFubmVsKSB7XG4gICAgaWYoc3RhY2sub2Zmc2V0ID09PSAnbm9ybWFsaXplJykge1xuICAgICAgcmV0dXJuIFtbMCwgMV1dO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge3N1ZmZpeDogJ3N0YXJ0J30pXG4gICAgfSwge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtzdWZmaXg6ICdlbmQnfSlcbiAgICB9XTtcbiAgfVxuXG4gIGNvbnN0IHNvcnQgPSBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSA/IGRvbWFpblNvcnQobW9kZWwsIGNoYW5uZWwsIHNjYWxlVHlwZSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHthZ2dyZWdhdGU6ICdtaW4nfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2FnZ3JlZ2F0ZTogJ21heCd9KVxuICAgIH1dO1xuICB9IGVsc2UgaWYgKGZpZWxkRGVmLmJpbikgeyAvLyBiaW5cbiAgICBpZiAoaXNCaW5TY2FsZShzY2FsZVR5cGUpKSB7XG4gICAgICBjb25zdCBzaWduYWwgPSBtb2RlbC5nZXROYW1lKGAke2JpblRvU3RyaW5nKGZpZWxkRGVmLmJpbil9XyR7ZmllbGREZWYuZmllbGR9X2JpbnNgKTtcbiAgICAgIHJldHVybiBbe3NpZ25hbDogYHNlcXVlbmNlKCR7c2lnbmFsfS5zdGFydCwgJHtzaWduYWx9LnN0b3AgKyAke3NpZ25hbH0uc3RlcCwgJHtzaWduYWx9LnN0ZXApYH1dO1xuICAgIH1cblxuICAgIGlmIChoYXNEaXNjcmV0ZURvbWFpbihzY2FsZVR5cGUpKSB7XG4gICAgICAvLyBvcmRpbmFsIGJpbiBzY2FsZSB0YWtlcyBkb21haW4gZnJvbSBiaW5fcmFuZ2UsIG9yZGVyZWQgYnkgYmluIHN0YXJ0XG4gICAgICAvLyBUaGlzIGlzIHVzZWZ1bCBmb3IgYm90aCBheGlzLWJhc2VkIHNjYWxlICh4L3kpIGFuZCBsZWdlbmQtYmFzZWQgc2NhbGUgKG90aGVyIGNoYW5uZWxzKS5cbiAgICAgIHJldHVybiBbe1xuICAgICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFJBVyB0YWJsZSxcbiAgICAgICAgLy8gc28gd2UgY2FuIGFnZ3JlZ2F0ZSB2YWx1ZXMgZm9yIHRoZSBzY2FsZSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIG1haW4gYWdncmVnYXRpb24uXG4gICAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICAgIC8vIFVzZSByYW5nZSBpZiB3ZSBhZGRlZCBpdCBhbmQgdGhlIHNjYWxlIGRvZXMgbm90IHN1cHBvcnQgY29tcHV0aW5nIGEgcmFuZ2UgYXMgYSBzaWduYWwuXG4gICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWYsIGNoYW5uZWwpID8ge2JpblN1ZmZpeDogJ3JhbmdlJ30gOiB7fSksXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gdXNlIGEgc29ydCBvYmplY3QgaWYgc29ydCA9IHRydWUgdG8gbWFrZSB0aGUgc29ydCBjb3JyZWN0IGJ5IGJpbiBzdGFydFxuICAgICAgICBzb3J0OiBzb3J0ID09PSB0cnVlIHx8ICFpc1NvcnRGaWVsZChzb3J0KSA/IHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSksXG4gICAgICAgICAgb3A6ICdtaW4nIC8vIG1pbiBvciBtYXggZG9lc24ndCBtYXR0ZXIgc2luY2Ugd2Ugc29ydCBieSB0aGUgc3RhcnQgb2YgdGhlIGJpbiByYW5nZVxuICAgICAgICB9IDogc29ydFxuICAgICAgfV07XG4gICAgfSBlbHNlIHsgLy8gY29udGludW91cyBzY2FsZXNcbiAgICAgIGlmIChjaGFubmVsID09PSAneCcgfHwgY2hhbm5lbCA9PT0gJ3knKSB7XG4gICAgICAgIGlmIChpc0JpblBhcmFtcyhmaWVsZERlZi5iaW4pICYmIGZpZWxkRGVmLmJpbi5leHRlbnQpIHtcbiAgICAgICAgICByZXR1cm4gW2ZpZWxkRGVmLmJpbi5leHRlbnRdO1xuICAgICAgICB9XG4gICAgICAgIC8vIFgvWSBwb3NpdGlvbiBoYXZlIHRvIGluY2x1ZGUgc3RhcnQgYW5kIGVuZCBmb3Igbm9uLW9yZGluYWwgc2NhbGVcbiAgICAgICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSlcbiAgICAgICAgfSwge1xuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ2VuZCd9KVxuICAgICAgICB9XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHVzZSBiaW5fbWlkXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7fSlcbiAgICAgICAgfV07XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKHNvcnQpIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgUkFXIHRhYmxlLFxuICAgICAgLy8gc28gd2UgY2FuIGFnZ3JlZ2F0ZSB2YWx1ZXMgZm9yIHRoZSBzY2FsZSBpbmRlcGVuZGVudGx5IGZyb20gdGhlIG1haW4gYWdncmVnYXRpb24uXG4gICAgICBkYXRhOiB1dGlsLmlzQm9vbGVhbihzb3J0KSA/IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSA6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShSQVcpLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCksXG4gICAgICBzb3J0OiBzb3J0XG4gICAgfV07XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKVxuICAgIH1dO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnQobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6IHRydWUgfCBTb3J0RmllbGQ8c3RyaW5nPiB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBzb3J0ID0gbW9kZWwuc29ydChjaGFubmVsKTtcblxuICAvLyBpZiB0aGUgc29ydCBpcyBzcGVjaWZpZWQgd2l0aCBhcnJheSwgdXNlIHRoZSBkZXJpdmVkIHNvcnQgaW5kZXggZmllbGRcbiAgaWYgKGlzU29ydEFycmF5KHNvcnQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wOiAnbWluJyxcbiAgICAgIGZpZWxkOiBzb3J0QXJyYXlJbmRleEZpZWxkKG1vZGVsLCBjaGFubmVsKSxcbiAgICAgIG9yZGVyOiAnYXNjZW5kaW5nJ1xuICAgIH07XG4gIH1cblxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcbiAgaWYgKGlzU29ydEZpZWxkKHNvcnQpKSB7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cblxuICBpZiAoc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wOiAnbWluJyxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpLFxuICAgICAgb3JkZXI6ICdkZXNjZW5kaW5nJ1xuICAgIH07XG4gIH1cblxuICBpZiAodXRpbC5jb250YWlucyhbJ2FzY2VuZGluZycsIHVuZGVmaW5lZCAvKiBkZWZhdWx0ID1hc2NlbmRpbmcqL10sIHNvcnQpKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBzb3J0ID09IG51bGxcbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuXG5cbi8qKlxuICogRGV0ZXJtaW5lIGlmIGEgc2NhbGUgY2FuIHVzZSB1bmFnZ3JlZ2F0ZWQgZG9tYWluLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGFsbCBvZiB0aGUgZm9sbG93aW5nIGNvbmRpdG9ucyBhcHBsaWVzOlxuICogMS4gYHNjYWxlLmRvbWFpbmAgaXMgYHVuYWdncmVnYXRlZGBcbiAqIDIuIEFnZ3JlZ2F0aW9uIGZ1bmN0aW9uIGlzIG5vdCBgY291bnRgIG9yIGBzdW1gXG4gKiAzLiBUaGUgc2NhbGUgaXMgcXVhbnRpdGF0aXZlIG9yIHRpbWUgc2NhbGUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlKToge3ZhbGlkOiBib29sZWFuLCByZWFzb24/OiBzdHJpbmd9IHtcbiAgaWYgKCFmaWVsZERlZi5hZ2dyZWdhdGUpIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbkhhc05vRWZmZWN0Rm9yUmF3RmllbGQoZmllbGREZWYpXG4gICAgfTtcbiAgfVxuXG4gIGlmICghU0hBUkVEX0RPTUFJTl9PUF9JTkRFWFtmaWVsZERlZi5hZ2dyZWdhdGVdKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVEb21haW5XaXRoTm9uU2hhcmVkRG9tYWluT3AoZmllbGREZWYuYWdncmVnYXRlKVxuICAgIH07XG4gIH1cblxuICBpZiAoZmllbGREZWYudHlwZSA9PT0gJ3F1YW50aXRhdGl2ZScpIHtcbiAgICBpZiAoc2NhbGVUeXBlID09PSAnbG9nJykge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlZERvbWFpbldpdGhMb2dTY2FsZShmaWVsZERlZilcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHt2YWxpZDogdHJ1ZX07XG59XG5cbi8qKlxuICogQ29udmVydHMgYW4gYXJyYXkgb2YgZG9tYWlucyB0byBhIHNpbmdsZSBWZWdhIHNjYWxlIGRvbWFpbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlRG9tYWlucyhkb21haW5zOiBWZ05vblVuaW9uRG9tYWluW10pOiBWZ0RvbWFpbiB7XG4gIGNvbnN0IHVuaXF1ZURvbWFpbnMgPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkb21haW4gPT4ge1xuICAgIC8vIGlnbm9yZSBzb3J0IHByb3BlcnR5IHdoZW4gY29tcHV0aW5nIHRoZSB1bmlxdWUgZG9tYWluc1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgY29uc3Qge3NvcnQ6IF9zLCAuLi5kb21haW5XaXRob3V0U29ydH0gPSBkb21haW47XG4gICAgICByZXR1cm4gZG9tYWluV2l0aG91dFNvcnQ7XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH0pLCB1dGlsLmhhc2gpO1xuXG4gIGNvbnN0IHNvcnRzOiBWZ1NvcnRGaWVsZFtdID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZCA9PiB7XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkKSkge1xuICAgICAgY29uc3QgcyA9IGQuc29ydDtcbiAgICAgIGlmIChzICE9PSB1bmRlZmluZWQgJiYgIXV0aWwuaXNCb29sZWFuKHMpKSB7XG4gICAgICAgIGlmIChzLm9wID09PSAnY291bnQnKSB7XG4gICAgICAgICAgLy8gbGV0J3MgbWFrZSBzdXJlIHRoYXQgaWYgb3AgaXMgY291bnQsIHdlIGRvbid0IHVzZSBhIGZpZWxkXG4gICAgICAgICAgZGVsZXRlIHMuZmllbGQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHMub3JkZXIgPT09ICdhc2NlbmRpbmcnKSB7XG4gICAgICAgICAgLy8gZHJvcCBvcmRlcjogYXNjZW5kaW5nIGFzIGl0IGlzIHRoZSBkZWZhdWx0XG4gICAgICAgICAgZGVsZXRlIHMub3JkZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KS5maWx0ZXIocyA9PiBzICE9PSB1bmRlZmluZWQpLCB1dGlsLmhhc2gpO1xuXG4gIGlmICh1bmlxdWVEb21haW5zLmxlbmd0aCA9PT0gMSkge1xuICAgIGNvbnN0IGRvbWFpbiA9IGRvbWFpbnNbMF07XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pICYmIHNvcnRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBzb3J0ID0gc29ydHNbMF07XG4gICAgICBpZiAoc29ydHMubGVuZ3RoID4gMSkge1xuICAgICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgICAgICBzb3J0ID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmRvbWFpbixcbiAgICAgICAgc29ydFxuICAgICAgfTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIC8vIG9ubHkga2VlcCBzaW1wbGUgc29ydCBwcm9wZXJ0aWVzIHRoYXQgd29yayB3aXRoIHVuaW9uZWQgZG9tYWluc1xuICBjb25zdCBzaW1wbGVTb3J0cyA9IHV0aWwudW5pcXVlKHNvcnRzLm1hcChzID0+IHtcbiAgICBpZiAocyA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIGlmIChzLm9wID09PSAnY291bnQnKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuZG9tYWluU29ydERyb3BwZWQocykpO1xuICAgIHJldHVybiB0cnVlO1xuICB9KSwgdXRpbC5oYXNoKSBhcyBWZ1VuaW9uU29ydEZpZWxkW107XG5cbiAgbGV0IHNvcnQ6IFZnVW5pb25Tb3J0RmllbGQgPSB1bmRlZmluZWQ7XG5cbiAgaWYgKHNpbXBsZVNvcnRzLmxlbmd0aCA9PT0gMSkge1xuICAgIHNvcnQgPSBzaW1wbGVTb3J0c1swXTtcbiAgfSBlbHNlIGlmIChzaW1wbGVTb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICBzb3J0ID0gdHJ1ZTtcbiAgfVxuXG4gIGNvbnN0IGFsbERhdGEgPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkID0+IHtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGQpKSB7XG4gICAgICByZXR1cm4gZC5kYXRhO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfSksIHggPT4geCk7XG5cbiAgaWYgKGFsbERhdGEubGVuZ3RoID09PSAxICYmIGFsbERhdGFbMF0gIT09IG51bGwpIHtcbiAgICAvLyBjcmVhdGUgYSB1bmlvbiBkb21haW4gb2YgZGlmZmVyZW50IGZpZWxkcyB3aXRoIGEgc2luZ2xlIGRhdGEgc291cmNlXG4gICAgY29uc3QgZG9tYWluOiBWZ0ZpZWxkUmVmVW5pb25Eb21haW4gPSB7XG4gICAgICBkYXRhOiBhbGxEYXRhWzBdLFxuICAgICAgZmllbGRzOiB1bmlxdWVEb21haW5zLm1hcChkID0+IChkIGFzIFZnRGF0YVJlZikuZmllbGQpLFxuICAgICAgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSlcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfVxuXG4gIHJldHVybiB7ZmllbGRzOiB1bmlxdWVEb21haW5zLCAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KX07XG59XG5cbi8qKlxuICogUmV0dXJuIGEgZmllbGQgaWYgYSBzY2FsZSBzaW5nbGUgZmllbGQuXG4gKiBSZXR1cm4gYHVuZGVmaW5lZGAgb3RoZXJ3aXNlLlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpZWxkRnJvbURvbWFpbihkb21haW46IFZnRG9tYWluKTogc3RyaW5nIHtcbiAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pICYmIGlzU3RyaW5nKGRvbWFpbi5maWVsZCkpIHtcbiAgICByZXR1cm4gZG9tYWluLmZpZWxkO1xuICB9IGVsc2UgaWYgKGlzRGF0YVJlZlVuaW9uZWREb21haW4oZG9tYWluKSkge1xuICAgIGxldCBmaWVsZDtcbiAgICBmb3IgKGNvbnN0IG5vblVuaW9uRG9tYWluIG9mIGRvbWFpbi5maWVsZHMpIHtcbiAgICAgIGlmIChpc0RhdGFSZWZEb21haW4obm9uVW5pb25Eb21haW4pICYmIGlzU3RyaW5nKG5vblVuaW9uRG9tYWluLmZpZWxkKSkge1xuICAgICAgICBpZiAoIWZpZWxkKSB7XG4gICAgICAgICAgZmllbGQgPSBub25VbmlvbkRvbWFpbi5maWVsZDtcbiAgICAgICAgfSBlbHNlIGlmIChmaWVsZCAhPT0gbm9uVW5pb25Eb21haW4uZmllbGQpIHtcbiAgICAgICAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgbXVsdGlwbGUgZmllbGRzIGZyb20gZGlmZmVyZW50IGRhdGEgc291cmNlcy4gIFdlIHdpbGwgdXNlIHRoZSBmaXJzdCBmaWVsZC4gIFRoZSByZXN1bHQgdmlldyBzaXplIG1heSBiZSBpbmNvcnJlY3QuJyk7XG4gICAgICAgICAgcmV0dXJuIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBpZGVudGljYWwgZmllbGRzIGZyb20gZGlmZmVyZW50IHNvdXJjZSBkZXRlY3RlZC4gIFdlIHdpbGwgYXNzdW1lIHRoYXQgdGhpcyBpcyB0aGUgc2FtZSBmaWVsZCBmcm9tIGEgZGlmZmVyZW50IGZvcmsgb2YgdGhlIHNhbWUgZGF0YSBzb3VyY2UuICBIb3dldmVyLCBpZiB0aGlzIGlzIG5vdCBjYXNlLCB0aGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXliZSBpbmNvcnJlY3QuJyk7XG4gICAgcmV0dXJuIGZpZWxkO1xuICB9IGVsc2UgaWYgKGlzRmllbGRSZWZVbmlvbkRvbWFpbihkb21haW4pKSB7XG4gICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIG11bHRpcGxlIGZpZWxkcyBmcm9tIHRoZSBzYW1lIGRhdGEgc291cmNlLiAgV2Ugd2lsbCB1c2UgdGhlIGZpcnN0IGZpZWxkLiAgVGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5IGJlIGluY29ycmVjdC4nKTtcbiAgICBjb25zdCBmaWVsZCA9IGRvbWFpbi5maWVsZHNbMF07XG4gICAgcmV0dXJuIGlzU3RyaW5nKGZpZWxkKSA/IGZpZWxkIDogdW5kZWZpbmVkO1xuICB9XG5cbiAgcmV0dXJuIHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlRG9tYWluKG1vZGVsOiBNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKSB7XG4gIGNvbnN0IHNjYWxlQ29tcG9uZW50ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgY29uc3QgZG9tYWlucyA9IHNjYWxlQ29tcG9uZW50LmRvbWFpbnMubWFwKGRvbWFpbiA9PiB7XG4gICAgLy8gQ29ycmVjdCByZWZlcmVuY2VzIHRvIGRhdGEgYXMgdGhlIG9yaWdpbmFsIGRvbWFpbidzIGRhdGEgd2FzIGRldGVybWluZWRcbiAgICAvLyBpbiBwYXJzZVNjYWxlLCB3aGljaCBoYXBwZW5zIGJlZm9yZSBwYXJzZURhdGEuIFRodXMgdGhlIG9yaWdpbmFsIGRhdGFcbiAgICAvLyByZWZlcmVuY2UgY2FuIGJlIGluY29ycmVjdC5cblxuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgZG9tYWluLmRhdGEgPSBtb2RlbC5sb29rdXBEYXRhU291cmNlKGRvbWFpbi5kYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfSk7XG5cbiAgLy8gZG9tYWlucyBpcyBhbiBhcnJheSB0aGF0IGhhcyB0byBiZSBtZXJnZWQgaW50byBhIHNpbmdsZSB2ZWdhIGRvbWFpblxuICByZXR1cm4gbWVyZ2VEb21haW5zKGRvbWFpbnMpO1xufVxuIl19