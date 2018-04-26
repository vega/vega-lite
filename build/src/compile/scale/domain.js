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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtQztBQUNuQyw2Q0FBdUQ7QUFDdkQsaUNBQXNDO0FBQ3RDLHlDQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsMkNBQWtFO0FBRWxFLCtCQUFpQztBQUNqQyxxQ0FBNkc7QUFDN0csbUNBQStEO0FBQy9ELG1DQUFnQztBQUNoQyxpQ0FBbUM7QUFDbkMsaURBQWdGO0FBQ2hGLGlEQVEyQjtBQUMzQixvQ0FBMkM7QUFDM0MsK0NBQXNEO0FBQ3RELDZDQUFvRDtBQUNwRCxrQ0FBMEQ7QUFDMUQsb0RBQXdEO0FBS3hELDBCQUFpQyxLQUFZO0lBQzNDLElBQUksbUJBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUM3QjtTQUFNO1FBQ0wsdUJBQXVCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEM7QUFDSCxDQUFDO0FBTkQsNENBTUM7QUFFRCw4QkFBOEIsS0FBZ0I7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztJQUNyQyxJQUFNLG9CQUFvQixHQUF3QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUV6RSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDNUQsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQU0sZUFBZSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO1FBRTNFLElBQU0sT0FBTyxHQUFHLHFCQUFxQixDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztRQUN0RCxJQUFNLGNBQWMsR0FBRyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyRCxjQUFjLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUVqQyxJQUFJLHlCQUFpQixDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQ3RDLHVFQUF1RTtZQUN2RSx1RUFBdUU7WUFDdkUsMkRBQTJEO1lBQzNELGtFQUFrRTtZQUVsRSxvRUFBb0U7WUFDcEUsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUU7Z0JBQzlCLE1BQU0sRUFBRSw0QkFBZ0IsR0FBRyxXQUFJLENBQUMsZUFBZSxDQUFDO2FBQ2pELEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDVjtRQUVELElBQUksS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xDLDBHQUEwRztZQUMxRyxJQUFJLFdBQVcsR0FBVSxLQUFLLENBQUM7WUFDL0IsT0FBTyxDQUFDLG9CQUFZLENBQUMsV0FBVyxDQUFDLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtnQkFDdkQsV0FBVyxHQUFHLFdBQVcsQ0FBQyxNQUFNLENBQUM7YUFDbEM7WUFFRCxJQUFNLE9BQU8sR0FBRyxXQUFXLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFN0QsSUFBSSxPQUFPLEtBQUssUUFBUSxFQUFFO2dCQUN4QixLQUFxQixVQUFPLEVBQVAsbUJBQU8sRUFBUCxxQkFBTyxFQUFQLElBQU87b0JBQXZCLElBQU0sTUFBTSxnQkFBQTtvQkFDZixtRkFBbUY7b0JBQ25GLElBQUksNkJBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRTt3QkFDM0Isd0ZBQXdGO3dCQUN4RixNQUFNLENBQUMsSUFBSSxHQUFHLDZCQUFrQixHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLDZCQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDO3FCQUNoRjtpQkFDRjthQUNGO1NBQ0Y7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxpQ0FBaUMsS0FBWTtJQUMzQyxLQUFvQixVQUFjLEVBQWQsS0FBQSxLQUFLLENBQUMsUUFBUSxFQUFkLGNBQWMsRUFBZCxJQUFjO1FBQTdCLElBQU0sS0FBSyxTQUFBO1FBQ2QsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekI7SUFFRCxJQUFNLG9CQUFvQixHQUF3QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUV6RSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDNUQsSUFBSSxPQUEyQixDQUFDO1FBQ2hDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztRQUVyQixLQUFvQixVQUFjLEVBQWQsS0FBQSxLQUFLLENBQUMsUUFBUSxFQUFkLGNBQWMsRUFBZCxJQUFjO1lBQTdCLElBQU0sS0FBSyxTQUFBO1lBQ2QsSUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDdkQsSUFBSSxjQUFjLEVBQUU7Z0JBQ2xCLElBQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtvQkFDekIsT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUM7aUJBQ2xDO3FCQUFNO29CQUNMLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDbEQ7Z0JBRUQsSUFBTSxFQUFFLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxTQUFTLElBQUksRUFBRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssRUFBRSxDQUFDLE1BQU0sRUFBRTtvQkFDckQsR0FBRyxDQUFDLElBQUksQ0FBQyw4RUFBOEUsQ0FBQyxDQUFDO2lCQUMxRjtnQkFDRCxTQUFTLEdBQUcsRUFBRSxDQUFDO2FBQ2hCO1NBQ0Y7UUFFRCxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRWhELElBQUksU0FBUyxFQUFFO1lBQ2Isb0JBQW9CLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDakU7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFHRDs7O0dBR0c7QUFDSCxxQ0FBcUMsTUFBYyxFQUFFLFFBQTBCLEVBQUUsU0FBb0IsRUFBRSxXQUF3QjtJQUM3SCxJQUFJLE1BQU0sS0FBSyxjQUFjLEVBQUU7UUFDdkIsSUFBQSxrREFBK0QsRUFBOUQsZ0JBQUssRUFBRSxrQkFBTSxDQUFrRDtRQUN0RSxJQUFHLENBQUMsS0FBSyxFQUFFO1lBQ1QsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqQixPQUFPLFNBQVMsQ0FBQztTQUNsQjtLQUNGO1NBQU0sSUFBSSxNQUFNLEtBQUssU0FBUyxJQUFJLFdBQVcsQ0FBQyxxQkFBcUIsRUFBRTtRQUNwRSwyQ0FBMkM7UUFDcEMsSUFBQSwyREFBSyxDQUFrRDtRQUM5RCxJQUFJLEtBQUssRUFBRTtZQUNULE9BQU8sY0FBYyxDQUFDO1NBQ3ZCO0tBQ0Y7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBRUQsK0JBQXNDLEtBQWdCLEVBQUUsT0FBcUI7SUFDM0UsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUUvRCxJQUFNLE1BQU0sR0FBRywyQkFBMkIsQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0gsSUFBSSxNQUFNLEtBQUssS0FBSyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtRQUN6QyxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyx3QkFDekIsS0FBSyxDQUFDLGVBQWUsQ0FBQyxPQUFPLENBQUMsSUFDakMsTUFBTSxRQUFBLEdBQ1AsQ0FBQztLQUNIO0lBRUQseUVBQXlFO0lBQ3pFLElBQUksT0FBTyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ2xELElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUM5QixPQUFPLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQ2pJO2FBQU07WUFDTCxPQUFPLHdCQUF3QixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ2pFO0tBQ0Y7U0FBTSxJQUFJLE9BQU8sS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUN6RCxJQUFJLEtBQUssQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLEVBQUU7WUFDOUIsT0FBTyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQztTQUNqSTthQUFNO1lBQ0wsT0FBTyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqRTtLQUNGO0lBQ0QsT0FBTyx3QkFBd0IsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBMUJELHNEQTBCQztBQUVELGtDQUFrQyxTQUFvQixFQUFFLE1BQWMsRUFBRSxLQUFnQixFQUFFLE9BQW1DO0lBQzNILElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFekMsSUFBSSxNQUFNLElBQUksTUFBTSxLQUFLLGNBQWMsSUFBSSxDQUFDLHlCQUFpQixDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsaUJBQWlCO1FBQ3hGLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRTtZQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNqRDthQUFNO1lBQ0wsSUFBSSxxQkFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO2dCQUN6QixPQUFRLE1BQXFCLENBQUMsR0FBRyxDQUFDLFVBQUMsRUFBRTtvQkFDbkMsT0FBTyxFQUFDLE1BQU0sRUFBRSxZQUFVLHVCQUFZLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFHLEVBQUMsQ0FBQztnQkFDdkQsQ0FBQyxDQUFDLENBQUM7YUFDSjtZQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNqQjtLQUNGO0lBRUQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQztJQUMxQixJQUFJLEtBQUssSUFBSSxPQUFPLEtBQUssS0FBSyxDQUFDLFlBQVksRUFBRTtRQUMzQyxJQUFHLEtBQUssQ0FBQyxNQUFNLEtBQUssV0FBVyxFQUFFO1lBQy9CLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO1FBRUQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUMsQ0FBQztRQUN6QyxPQUFPLENBQUM7Z0JBQ04sSUFBSSxNQUFBO2dCQUNKLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUMsQ0FBQzthQUNqRCxFQUFFO2dCQUNELElBQUksTUFBQTtnQkFDSixLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFDLENBQUM7YUFDL0MsQ0FBQyxDQUFDO0tBQ0o7SUFFRCxJQUFNLElBQUksR0FBRyx3QkFBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0lBRXpGLElBQUksTUFBTSxLQUFLLGNBQWMsRUFBRTtRQUM3QixJQUFNLElBQUksR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDLFdBQUksQ0FBQyxDQUFDO1FBQ3pDLE9BQU8sQ0FBQztnQkFDTixJQUFJLE1BQUE7Z0JBQ0osS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDO2FBQ2xELEVBQUU7Z0JBQ0QsSUFBSSxNQUFBO2dCQUNKLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQzthQUNsRCxDQUFDLENBQUM7S0FDSjtTQUFNLElBQUksUUFBUSxDQUFDLEdBQUcsRUFBRSxFQUFFLE1BQU07UUFDL0IsSUFBSSxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ3pCLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUksaUJBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQUksUUFBUSxDQUFDLEtBQUssVUFBTyxDQUFDLENBQUM7WUFDcEYsT0FBTyxDQUFDLEVBQUMsTUFBTSxFQUFFLGNBQVksTUFBTSxnQkFBVyxNQUFNLGdCQUFXLE1BQU0sZUFBVSxNQUFNLFdBQVEsRUFBQyxDQUFDLENBQUM7U0FDakc7UUFFRCxJQUFJLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2hDLHNFQUFzRTtZQUN0RSwwRkFBMEY7WUFDMUYsT0FBTyxDQUFDO29CQUNOLDhFQUE4RTtvQkFDOUUsb0ZBQW9GO29CQUNwRixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFHLENBQUM7b0JBQ3JGLHlGQUF5RjtvQkFDekYsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLHlCQUFnQixDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztvQkFDOUYsb0ZBQW9GO29CQUNwRixJQUFJLEVBQUUsSUFBSSxLQUFLLElBQUksSUFBSSxDQUFDLGtCQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUMxQyxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDO3dCQUNqQyxFQUFFLEVBQUUsS0FBSyxDQUFDLHdFQUF3RTtxQkFDbkYsQ0FBQyxDQUFDLENBQUMsSUFBSTtpQkFDVCxDQUFDLENBQUM7U0FDSjthQUFNLEVBQUUsb0JBQW9CO1lBQzNCLElBQUksT0FBTyxLQUFLLEdBQUcsSUFBSSxPQUFPLEtBQUssR0FBRyxFQUFFO2dCQUN0QyxtRUFBbUU7Z0JBQ25FLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsV0FBSSxDQUFDLENBQUM7Z0JBQ3pDLE9BQU8sQ0FBQzt3QkFDTixJQUFJLE1BQUE7d0JBQ0osS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQztxQkFDbEMsRUFBRTt3QkFDRCxJQUFJLE1BQUE7d0JBQ0osS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDO3FCQUNsRCxDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxvQkFBb0I7Z0JBQ3BCLE9BQU8sQ0FBQzt3QkFDTixJQUFJLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUM7d0JBQ2pDLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7cUJBQ2xDLENBQUMsQ0FBQzthQUNKO1NBQ0Y7S0FDRjtTQUFNLElBQUksSUFBSSxFQUFFO1FBQ2YsT0FBTyxDQUFDO2dCQUNOLDhFQUE4RTtnQkFDOUUsb0ZBQW9GO2dCQUNwRixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxXQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFHLENBQUM7Z0JBQ3JGLEtBQUssRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQztnQkFDN0IsSUFBSSxFQUFFLElBQUk7YUFDWCxDQUFDLENBQUM7S0FDSjtTQUFNO1FBQ0wsT0FBTyxDQUFDO2dCQUNOLElBQUksRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLFdBQUksQ0FBQztnQkFDakMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDO2FBQzlCLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQUdELG9CQUEyQixLQUFnQixFQUFFLE9BQXFCLEVBQUUsU0FBb0I7SUFDdEYsSUFBSSxDQUFDLHlCQUFpQixDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQ2pDLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBRUQsSUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVqQyx3RUFBd0U7SUFDeEUsSUFBSSxrQkFBVyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3JCLE9BQU87WUFDTCxFQUFFLEVBQUUsS0FBSztZQUNULEtBQUssRUFBRSwrQkFBbUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDO1lBQzFDLEtBQUssRUFBRSxXQUFXO1NBQ25CLENBQUM7S0FDSDtJQUVELGdHQUFnRztJQUNoRyxJQUFJLGtCQUFXLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDckIsT0FBTyxJQUFJLENBQUM7S0FDYjtJQUVELElBQUksSUFBSSxLQUFLLFlBQVksRUFBRTtRQUN6QixPQUFPO1lBQ0wsRUFBRSxFQUFFLEtBQUs7WUFDVCxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUM7WUFDN0IsS0FBSyxFQUFFLFlBQVk7U0FDcEIsQ0FBQztLQUNIO0lBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyx1QkFBdUIsQ0FBQyxFQUFFLElBQUksQ0FBQyxFQUFFO1FBQ3pFLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFFRCxlQUFlO0lBQ2YsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQW5DRCxnQ0FtQ0M7QUFJRDs7Ozs7O0dBTUc7QUFDSCxrQ0FBeUMsUUFBMEIsRUFBRSxTQUFvQjtJQUN2RixJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtRQUN2QixPQUFPO1lBQ0wsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1Q0FBdUMsQ0FBQyxRQUFRLENBQUM7U0FDdEUsQ0FBQztLQUNIO0lBRUQsSUFBSSxDQUFDLGtDQUFzQixDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMvQyxPQUFPO1lBQ0wsS0FBSyxFQUFFLEtBQUs7WUFDWixNQUFNLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxzQ0FBc0MsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDO1NBQy9FLENBQUM7S0FDSDtJQUVELElBQUksUUFBUSxDQUFDLElBQUksS0FBSyxjQUFjLEVBQUU7UUFDcEMsSUFBSSxTQUFTLEtBQUssS0FBSyxFQUFFO1lBQ3ZCLE9BQU87Z0JBQ0wsS0FBSyxFQUFFLEtBQUs7Z0JBQ1osTUFBTSxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsOEJBQThCLENBQUMsUUFBUSxDQUFDO2FBQzdELENBQUM7U0FDSDtLQUNGO0lBRUQsT0FBTyxFQUFDLEtBQUssRUFBRSxJQUFJLEVBQUMsQ0FBQztBQUN2QixDQUFDO0FBekJELDREQXlCQztBQUVEOztHQUVHO0FBQ0gsc0JBQTZCLE9BQTJCO0lBQ3RELElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFBLE1BQU07UUFDbEQseURBQXlEO1FBQ3pELElBQUksNkJBQWUsQ0FBQyxNQUFNLENBQUMsRUFBRTtZQUNwQixJQUFBLGdCQUFRLEVBQUUsb0RBQW9CLENBQVc7WUFDaEQsT0FBTyxpQkFBaUIsQ0FBQztTQUMxQjtRQUNELE9BQU8sTUFBTSxDQUFDO0lBQ2hCLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUVmLElBQU0sS0FBSyxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1FBQ3BELElBQUksNkJBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixJQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLFNBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3pDLElBQUksQ0FBQyxDQUFDLEVBQUUsS0FBSyxPQUFPLEVBQUU7b0JBQ3BCLDREQUE0RDtvQkFDNUQsT0FBTyxDQUFDLENBQUMsS0FBSyxDQUFDO2lCQUNoQjtnQkFDRCxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssV0FBVyxFQUFFO29CQUMzQiw2Q0FBNkM7b0JBQzdDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQztpQkFDaEI7YUFDRjtZQUNELE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7UUFDRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEtBQUssU0FBUyxFQUFmLENBQWUsQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUU1QyxJQUFJLGFBQWEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzlCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFJLDZCQUFlLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDL0MsSUFBSSxNQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ3BCLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO2dCQUN6QyxNQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ2I7WUFDRCw0QkFDSyxNQUFNLElBQ1QsSUFBSSxRQUFBLElBQ0o7U0FDSDtRQUNELE9BQU8sTUFBTSxDQUFDO0tBQ2Y7SUFFRCxrRUFBa0U7SUFDbEUsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztRQUN6QyxJQUFJLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDZCxPQUFPLENBQUMsQ0FBQztTQUNWO1FBQ0QsSUFBSSxDQUFDLENBQUMsRUFBRSxLQUFLLE9BQU8sRUFBRTtZQUNwQixPQUFPLENBQUMsQ0FBQztTQUNWO1FBQ0QsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0MsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUF1QixDQUFDO0lBRXJDLElBQUksSUFBSSxHQUFxQixTQUFTLENBQUM7SUFFdkMsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUM1QixJQUFJLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZCO1NBQU0sSUFBSSxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNqQyxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUN6QyxJQUFJLEdBQUcsSUFBSSxDQUFDO0tBQ2I7SUFFRCxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1FBQ3ZDLElBQUksNkJBQWUsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUM7U0FDZjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQyxDQUFDLEVBQUUsVUFBQSxDQUFDLElBQUksT0FBQSxDQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7SUFFWixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7UUFDL0Msc0VBQXNFO1FBQ3RFLElBQU0sTUFBTSxzQkFDVixJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUNoQixNQUFNLEVBQUUsYUFBYSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUMsSUFBSSxPQUFDLENBQWUsQ0FBQyxLQUFLLEVBQXRCLENBQXNCLENBQUMsSUFDbkQsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsSUFBSSxNQUFBLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQ3hCLENBQUM7UUFFRixPQUFPLE1BQU0sQ0FBQztLQUNmO0lBRUQsMEJBQVEsTUFBTSxFQUFFLGFBQWEsSUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBQyxJQUFJLE1BQUEsRUFBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRTtBQUMxRCxDQUFDO0FBcEZELG9DQW9GQztBQUVEOzs7O0dBSUc7QUFDSCw0QkFBbUMsTUFBZ0I7SUFDakQsSUFBSSw2QkFBZSxDQUFDLE1BQU0sQ0FBQyxJQUFJLG9CQUFRLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3JELE9BQU8sTUFBTSxDQUFDLEtBQUssQ0FBQztLQUNyQjtTQUFNLElBQUksb0NBQXNCLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDekMsSUFBSSxLQUFLLFNBQUEsQ0FBQztRQUNWLEtBQTZCLFVBQWEsRUFBYixLQUFBLE1BQU0sQ0FBQyxNQUFNLEVBQWIsY0FBYSxFQUFiLElBQWE7WUFBckMsSUFBTSxjQUFjLFNBQUE7WUFDdkIsSUFBSSw2QkFBZSxDQUFDLGNBQWMsQ0FBQyxJQUFJLG9CQUFRLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUNyRSxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNWLEtBQUssR0FBRyxjQUFjLENBQUMsS0FBSyxDQUFDO2lCQUM5QjtxQkFBTSxJQUFJLEtBQUssS0FBSyxjQUFjLENBQUMsS0FBSyxFQUFFO29CQUN6QyxHQUFHLENBQUMsSUFBSSxDQUFDLDZLQUE2SyxDQUFDLENBQUM7b0JBQ3hMLE9BQU8sS0FBSyxDQUFDO2lCQUNkO2FBQ0Y7U0FDRjtRQUNELEdBQUcsQ0FBQyxJQUFJLENBQUMsMlFBQTJRLENBQUMsQ0FBQztRQUN0UixPQUFPLEtBQUssQ0FBQztLQUNkO1NBQU0sSUFBSSxtQ0FBcUIsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUN4QyxHQUFHLENBQUMsSUFBSSxDQUFDLDJLQUEySyxDQUFDLENBQUM7UUFDdEwsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvQixPQUFPLG9CQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQzVDO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXhCRCxnREF3QkM7QUFFRCx3QkFBK0IsS0FBWSxFQUFFLE9BQXFCO0lBQ2hFLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTTtRQUMvQywwRUFBMEU7UUFDMUUsd0VBQXdFO1FBQ3hFLDhCQUE4QjtRQUU5QixJQUFJLDZCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDM0IsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxzRUFBc0U7SUFDdEUsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWZELHdDQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7U0hBUkVEX0RPTUFJTl9PUF9JTkRFWH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7YmluVG9TdHJpbmd9IGZyb20gJy4uLy4uL2Jpbic7XG5pbXBvcnQge2lzU2NhbGVDaGFubmVsLCBTY2FsZUNoYW5uZWx9IGZyb20gJy4uLy4uL2NoYW5uZWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgZGF0ZVRpbWVFeHByLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQge0ZpZWxkRGVmfSBmcm9tICcuLi8uLi9maWVsZGRlZic7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7RG9tYWluLCBoYXNEaXNjcmV0ZURvbWFpbiwgaXNCaW5TY2FsZSwgaXNTZWxlY3Rpb25Eb21haW4sIFNjYWxlQ29uZmlnLCBTY2FsZVR5cGV9IGZyb20gJy4uLy4uL3NjYWxlJztcbmltcG9ydCB7aXNTb3J0QXJyYXksIGlzU29ydEZpZWxkLCBTb3J0RmllbGR9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0IHtoYXNofSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCAqIGFzIHV0aWwgZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRGF0YVJlZlVuaW9uZWREb21haW4sIGlzRmllbGRSZWZVbmlvbkRvbWFpbn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtcbiAgaXNEYXRhUmVmRG9tYWluLFxuICBWZ0RhdGFSZWYsXG4gIFZnRG9tYWluLFxuICBWZ0ZpZWxkUmVmVW5pb25Eb21haW4sXG4gIFZnTm9uVW5pb25Eb21haW4sXG4gIFZnU29ydEZpZWxkLFxuICBWZ1VuaW9uU29ydEZpZWxkLFxufSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2JpblJlcXVpcmVzUmFuZ2V9IGZyb20gJy4uL2NvbW1vbic7XG5pbXBvcnQge3NvcnRBcnJheUluZGV4RmllbGR9IGZyb20gJy4uL2RhdGEvY2FsY3VsYXRlJztcbmltcG9ydCB7RkFDRVRfU0NBTEVfUFJFRklYfSBmcm9tICcuLi9kYXRhL29wdGltaXplJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7U0VMRUNUSU9OX0RPTUFJTn0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge1VuaXRNb2RlbH0gZnJvbSAnLi4vdW5pdCc7XG5pbXBvcnQge1NjYWxlQ29tcG9uZW50SW5kZXh9IGZyb20gJy4vY29tcG9uZW50JztcblxuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VTY2FsZURvbWFpbihtb2RlbDogTW9kZWwpIHtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIHBhcnNlVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfSBlbHNlIHtcbiAgICBwYXJzZU5vblVuaXRTY2FsZURvbWFpbihtb2RlbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWw6IFVuaXRNb2RlbCkge1xuICBjb25zdCBzY2FsZXMgPSBtb2RlbC5zcGVjaWZpZWRTY2FsZXM7XG4gIGNvbnN0IGxvY2FsU2NhbGVDb21wb25lbnRzOiBTY2FsZUNvbXBvbmVudEluZGV4ID0gbW9kZWwuY29tcG9uZW50LnNjYWxlcztcblxuICB1dGlsLmtleXMobG9jYWxTY2FsZUNvbXBvbmVudHMpLmZvckVhY2goKGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkgPT4ge1xuICAgIGNvbnN0IHNwZWNpZmllZFNjYWxlID0gc2NhbGVzW2NoYW5uZWxdO1xuICAgIGNvbnN0IHNwZWNpZmllZERvbWFpbiA9IHNwZWNpZmllZFNjYWxlID8gc3BlY2lmaWVkU2NhbGUuZG9tYWluIDogdW5kZWZpbmVkO1xuXG4gICAgY29uc3QgZG9tYWlucyA9IHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbCwgY2hhbm5lbCk7XG4gICAgY29uc3QgbG9jYWxTY2FsZUNtcHQgPSBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXTtcbiAgICBsb2NhbFNjYWxlQ21wdC5kb21haW5zID0gZG9tYWlucztcblxuICAgIGlmIChpc1NlbGVjdGlvbkRvbWFpbihzcGVjaWZpZWREb21haW4pKSB7XG4gICAgICAvLyBBcyBzY2FsZSBwYXJzaW5nIG9jY3VycyBiZWZvcmUgc2VsZWN0aW9uIHBhcnNpbmcsIHdlIHVzZSBhIHRlbXBvcmFyeVxuICAgICAgLy8gc2lnbmFsIGhlcmUgYW5kIGFwcGVuZCB0aGUgc2NhbGUuZG9tYWluIGRlZmluaXRpb24uIFRoaXMgaXMgcmVwbGFjZWRcbiAgICAgIC8vIHdpdGggdGhlIGNvcnJlY3QgZG9tYWluUmF3IHNpZ25hbCBkdXJpbmcgc2NhbGUgYXNzZW1ibHkuXG4gICAgICAvLyBGb3IgbW9yZSBpbmZvcm1hdGlvbiwgc2VlIGlzUmF3U2VsZWN0aW9uRG9tYWluIGluIHNlbGVjdGlvbi50cy5cblxuICAgICAgLy8gRklYTUU6IHJlcGxhY2UgdGhpcyB3aXRoIGEgc3BlY2lhbCBwcm9wZXJ0eSBpbiB0aGUgc2NhbGVDb21wb25lbnRcbiAgICAgIGxvY2FsU2NhbGVDbXB0LnNldCgnZG9tYWluUmF3Jywge1xuICAgICAgICBzaWduYWw6IFNFTEVDVElPTl9ET01BSU4gKyBoYXNoKHNwZWNpZmllZERvbWFpbilcbiAgICAgIH0sIHRydWUpO1xuICAgIH1cblxuICAgIGlmIChtb2RlbC5jb21wb25lbnQuZGF0YS5pc0ZhY2V0ZWQpIHtcbiAgICAgIC8vIGdldCByZXNvbHZlIGZyb20gY2xvc2VzdCBmYWNldCBwYXJlbnQgYXMgdGhpcyBkZWNpZGVzIHdoZXRoZXIgd2UgbmVlZCB0byByZWZlciB0byBjbG9uZWQgc3VidHJlZSBvciBub3RcbiAgICAgIGxldCBmYWNldFBhcmVudDogTW9kZWwgPSBtb2RlbDtcbiAgICAgIHdoaWxlICghaXNGYWNldE1vZGVsKGZhY2V0UGFyZW50KSAmJiBmYWNldFBhcmVudC5wYXJlbnQpIHtcbiAgICAgICAgZmFjZXRQYXJlbnQgPSBmYWNldFBhcmVudC5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlc29sdmUgPSBmYWNldFBhcmVudC5jb21wb25lbnQucmVzb2x2ZS5zY2FsZVtjaGFubmVsXTtcblxuICAgICAgaWYgKHJlc29sdmUgPT09ICdzaGFyZWQnKSB7XG4gICAgICAgIGZvciAoY29uc3QgZG9tYWluIG9mIGRvbWFpbnMpIHtcbiAgICAgICAgICAvLyBSZXBsYWNlIHRoZSBzY2FsZSBkb21haW4gd2l0aCBkYXRhIG91dHB1dCBmcm9tIGEgY2xvbmVkIHN1YnRyZWUgYWZ0ZXIgdGhlIGZhY2V0LlxuICAgICAgICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSkge1xuICAgICAgICAgICAgLy8gdXNlIGRhdGEgZnJvbSBjbG9uZWQgc3VidHJlZSAod2hpY2ggaXMgdGhlIHNhbWUgYXMgZGF0YSBidXQgd2l0aCBhIHByZWZpeCBhZGRlZCBvbmNlKVxuICAgICAgICAgICAgZG9tYWluLmRhdGEgPSBGQUNFVF9TQ0FMRV9QUkVGSVggKyBkb21haW4uZGF0YS5yZXBsYWNlKEZBQ0VUX1NDQUxFX1BSRUZJWCwgJycpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgcGFyc2VTY2FsZURvbWFpbihjaGlsZCk7XG4gIH1cblxuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgdXRpbC5rZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICBsZXQgZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdO1xuICAgIGxldCBkb21haW5SYXcgPSBudWxsO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgIGlmIChkb21haW5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkb21haW5zID0gY2hpbGRDb21wb25lbnQuZG9tYWlucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb21haW5zID0gZG9tYWlucy5jb25jYXQoY2hpbGRDb21wb25lbnQuZG9tYWlucyk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBkciA9IGNoaWxkQ29tcG9uZW50LmdldCgnZG9tYWluUmF3Jyk7XG4gICAgICAgIGlmIChkb21haW5SYXcgJiYgZHIgJiYgZG9tYWluUmF3LnNpZ25hbCAhPT0gZHIuc2lnbmFsKSB7XG4gICAgICAgICAgbG9nLndhcm4oJ1RoZSBzYW1lIHNlbGVjdGlvbiBtdXN0IGJlIHVzZWQgdG8gb3ZlcnJpZGUgc2NhbGUgZG9tYWlucyBpbiBhIGxheWVyZWQgdmlldy4nKTtcbiAgICAgICAgfVxuICAgICAgICBkb21haW5SYXcgPSBkcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5kb21haW5zID0gZG9tYWlucztcblxuICAgIGlmIChkb21haW5SYXcpIHtcbiAgICAgIGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdLnNldCgnZG9tYWluUmF3JywgZG9tYWluUmF3LCB0cnVlKTtcbiAgICB9XG4gIH0pO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIHVuYWdncmVnYXRlZCBkb21haW4gaWYgaXQgaXMgbm90IGFwcGxpY2FibGVcbiAqIEFkZCB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGRvbWFpbiBpcyBub3Qgc3BlY2lmaWVkIGFuZCBjb25maWcuc2NhbGUudXNlVW5hZ2dyZWdhdGVkRG9tYWluIGlzIHRydWUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVuYWdncmVnYXRlZERvbWFpbihkb21haW46IERvbWFpbiwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICBjb25zdCB7dmFsaWQsIHJlYXNvbn0gPSBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWYsIHNjYWxlVHlwZSk7XG4gICAgaWYoIXZhbGlkKSB7XG4gICAgICBsb2cud2FybihyZWFzb24pO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZG9tYWluID09PSB1bmRlZmluZWQgJiYgc2NhbGVDb25maWcudXNlVW5hZ2dyZWdhdGVkRG9tYWluKSB7XG4gICAgLy8gQXBwbHkgY29uZmlnIGlmIGRvbWFpbiBpcyBub3Qgc3BlY2lmaWVkLlxuICAgIGNvbnN0IHt2YWxpZH0gPSBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWYsIHNjYWxlVHlwZSk7XG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICByZXR1cm4gJ3VuYWdncmVnYXRlZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRvbWFpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBWZ05vblVuaW9uRG9tYWluW10ge1xuICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcblxuICBjb25zdCBkb21haW4gPSBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4obW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCksIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLCBzY2FsZVR5cGUsIG1vZGVsLmNvbmZpZy5zY2FsZSk7XG4gIGlmIChkb21haW4gIT09IG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpKSB7XG4gICAgbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdID0ge1xuICAgICAgLi4ubW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdLFxuICAgICAgZG9tYWluXG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGNoYW5uZWwgaXMgZWl0aGVyIFggb3IgWSB0aGVuIHVuaW9uIHRoZW0gd2l0aCBYMiAmIFkyIGlmIHRoZXkgZXhpc3RcbiAgaWYgKGNoYW5uZWwgPT09ICd4JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3gyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneCcpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneDInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneDInKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3knICYmIG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneTInKSkge1xuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3knKSkge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5JykuY29uY2F0KHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5MicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5MicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgY2hhbm5lbCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZG9tYWluOiBEb21haW4sIG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCB8ICd4MicgfCAneTInKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZiAoZG9tYWluICYmIGRvbWFpbiAhPT0gJ3VuYWdncmVnYXRlZCcgJiYgIWlzU2VsZWN0aW9uRG9tYWluKGRvbWFpbikpIHsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jb25mbGljdGVkRG9tYWluKGNoYW5uZWwpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzRGF0ZVRpbWUoZG9tYWluWzBdKSkge1xuICAgICAgICByZXR1cm4gKGRvbWFpbiBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtzaWduYWw6IGB7ZGF0YTogJHtkYXRlVGltZUV4cHIoZHQsIHRydWUpfX1gfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW2RvbWFpbl07XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaztcbiAgaWYgKHN0YWNrICYmIGNoYW5uZWwgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgIGlmKHN0YWNrLm9mZnNldCA9PT0gJ25vcm1hbGl6ZScpIHtcbiAgICAgIHJldHVybiBbWzAsIDFdXTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtzdWZmaXg6ICdzdGFydCd9KVxuICAgIH0sIHtcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7c3VmZml4OiAnZW5kJ30pXG4gICAgfV07XG4gIH1cblxuICBjb25zdCBzb3J0ID0gaXNTY2FsZUNoYW5uZWwoY2hhbm5lbCkgPyBkb21haW5Tb3J0KG1vZGVsLCBjaGFubmVsLCBzY2FsZVR5cGUpIDogdW5kZWZpbmVkO1xuXG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7YWdncmVnYXRlOiAnbWluJ30pXG4gICAgfSwge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHthZ2dyZWdhdGU6ICdtYXgnfSlcbiAgICB9XTtcbiAgfSBlbHNlIGlmIChmaWVsZERlZi5iaW4pIHsgLy8gYmluXG4gICAgaWYgKGlzQmluU2NhbGUoc2NhbGVUeXBlKSkge1xuICAgICAgY29uc3Qgc2lnbmFsID0gbW9kZWwuZ2V0TmFtZShgJHtiaW5Ub1N0cmluZyhmaWVsZERlZi5iaW4pfV8ke2ZpZWxkRGVmLmZpZWxkfV9iaW5zYCk7XG4gICAgICByZXR1cm4gW3tzaWduYWw6IGBzZXF1ZW5jZSgke3NpZ25hbH0uc3RhcnQsICR7c2lnbmFsfS5zdG9wICsgJHtzaWduYWx9LnN0ZXAsICR7c2lnbmFsfS5zdGVwKWB9XTtcbiAgICB9XG5cbiAgICBpZiAoaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgICAgLy8gb3JkaW5hbCBiaW4gc2NhbGUgdGFrZXMgZG9tYWluIGZyb20gYmluX3JhbmdlLCBvcmRlcmVkIGJ5IGJpbiBzdGFydFxuICAgICAgLy8gVGhpcyBpcyB1c2VmdWwgZm9yIGJvdGggYXhpcy1iYXNlZCBzY2FsZSAoeC95KSBhbmQgbGVnZW5kLWJhc2VkIHNjYWxlIChvdGhlciBjaGFubmVscykuXG4gICAgICByZXR1cm4gW3tcbiAgICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBSQVcgdGFibGUsXG4gICAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgICBkYXRhOiB1dGlsLmlzQm9vbGVhbihzb3J0KSA/IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSA6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShSQVcpLFxuICAgICAgICAvLyBVc2UgcmFuZ2UgaWYgd2UgYWRkZWQgaXQgYW5kIHRoZSBzY2FsZSBkb2VzIG5vdCBzdXBwb3J0IGNvbXB1dGluZyBhIHJhbmdlIGFzIGEgc2lnbmFsLlxuICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCBiaW5SZXF1aXJlc1JhbmdlKGZpZWxkRGVmLCBjaGFubmVsKSA/IHtiaW5TdWZmaXg6ICdyYW5nZSd9IDoge30pLFxuICAgICAgICAvLyB3ZSBoYXZlIHRvIHVzZSBhIHNvcnQgb2JqZWN0IGlmIHNvcnQgPSB0cnVlIHRvIG1ha2UgdGhlIHNvcnQgY29ycmVjdCBieSBiaW4gc3RhcnRcbiAgICAgICAgc29ydDogc29ydCA9PT0gdHJ1ZSB8fCAhaXNTb3J0RmllbGQoc29ydCkgPyB7XG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pLFxuICAgICAgICAgIG9wOiAnbWluJyAvLyBtaW4gb3IgbWF4IGRvZXNuJ3QgbWF0dGVyIHNpbmNlIHdlIHNvcnQgYnkgdGhlIHN0YXJ0IG9mIHRoZSBiaW4gcmFuZ2VcbiAgICAgICAgfSA6IHNvcnRcbiAgICAgIH1dO1xuICAgIH0gZWxzZSB7IC8vIGNvbnRpbnVvdXMgc2NhbGVzXG4gICAgICBpZiAoY2hhbm5lbCA9PT0gJ3gnIHx8IGNoYW5uZWwgPT09ICd5Jykge1xuICAgICAgICAvLyBYL1kgcG9zaXRpb24gaGF2ZSB0byBpbmNsdWRlIHN0YXJ0IGFuZCBlbmQgZm9yIG5vbi1vcmRpbmFsIHNjYWxlXG4gICAgICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHtiaW5TdWZmaXg6ICdlbmQnfSlcbiAgICAgICAgfV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUT0RPOiB1c2UgYmluX21pZFxuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTiksXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge30pXG4gICAgICAgIH1dO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChzb3J0KSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFJBVyB0YWJsZSxcbiAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpLFxuICAgICAgc29ydDogc29ydFxuICAgIH1dO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbClcbiAgICB9XTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkb21haW5Tb3J0KG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB0cnVlIHwgU29ydEZpZWxkPHN0cmluZz4ge1xuICBpZiAoIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3Qgc29ydCA9IG1vZGVsLnNvcnQoY2hhbm5lbCk7XG5cbiAgLy8gaWYgdGhlIHNvcnQgaXMgc3BlY2lmaWVkIHdpdGggYXJyYXksIHVzZSB0aGUgZGVyaXZlZCBzb3J0IGluZGV4IGZpZWxkXG4gIGlmIChpc1NvcnRBcnJheShzb3J0KSkge1xuICAgIHJldHVybiB7XG4gICAgICBvcDogJ21pbicsXG4gICAgICBmaWVsZDogc29ydEFycmF5SW5kZXhGaWVsZChtb2RlbCwgY2hhbm5lbCksXG4gICAgICBvcmRlcjogJ2FzY2VuZGluZydcbiAgICB9O1xuICB9XG5cbiAgLy8gU29ydGVkIGJhc2VkIG9uIGFuIGFnZ3JlZ2F0ZSBjYWxjdWxhdGlvbiBvdmVyIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQgKG9ubHkgZm9yIG9yZGluYWwgc2NhbGUpXG4gIGlmIChpc1NvcnRGaWVsZChzb3J0KSkge1xuICAgIHJldHVybiBzb3J0O1xuICB9XG5cbiAgaWYgKHNvcnQgPT09ICdkZXNjZW5kaW5nJykge1xuICAgIHJldHVybiB7XG4gICAgICBvcDogJ21pbicsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKSxcbiAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICB9O1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoWydhc2NlbmRpbmcnLCB1bmRlZmluZWQgLyogZGVmYXVsdCA9YXNjZW5kaW5nKi9dLCBzb3J0KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gc29ydCA9PSBudWxsXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHNjYWxlIGNhbiB1c2UgdW5hZ2dyZWdhdGVkIGRvbWFpbi5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRvbnMgYXBwbGllczpcbiAqIDEuIGBzY2FsZS5kb21haW5gIGlzIGB1bmFnZ3JlZ2F0ZWRgXG4gKiAyLiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBpcyBub3QgYGNvdW50YCBvciBgc3VtYFxuICogMy4gVGhlIHNjYWxlIGlzIHF1YW50aXRhdGl2ZSBvciB0aW1lIHNjYWxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6IHt2YWxpZDogYm9vbGVhbiwgcmVhc29uPzogc3RyaW5nfSB7XG4gIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVEb21haW5IYXNOb0VmZmVjdEZvclJhd0ZpZWxkKGZpZWxkRGVmKVxuICAgIH07XG4gIH1cblxuICBpZiAoIVNIQVJFRF9ET01BSU5fT1BfSU5ERVhbZmllbGREZWYuYWdncmVnYXRlXSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSlcbiAgICB9O1xuICB9XG5cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZWREb21haW5XaXRoTG9nU2NhbGUoZmllbGREZWYpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7dmFsaWQ6IHRydWV9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGRvbWFpbnMgdG8gYSBzaW5nbGUgVmVnYSBzY2FsZSBkb21haW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURvbWFpbnMoZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdKTogVmdEb21haW4ge1xuICBjb25zdCB1bmlxdWVEb21haW5zID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBpZ25vcmUgc29ydCBwcm9wZXJ0eSB3aGVuIGNvbXB1dGluZyB0aGUgdW5pcXVlIGRvbWFpbnNcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgIGNvbnN0IHtzb3J0OiBfcywgLi4uZG9tYWluV2l0aG91dFNvcnR9ID0gZG9tYWluO1xuICAgICAgcmV0dXJuIGRvbWFpbldpdGhvdXRTb3J0O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KSwgdXRpbC5oYXNoKTtcblxuICBjb25zdCBzb3J0czogVmdTb3J0RmllbGRbXSA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGQgPT4ge1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZCkpIHtcbiAgICAgIGNvbnN0IHMgPSBkLnNvcnQ7XG4gICAgICBpZiAocyAhPT0gdW5kZWZpbmVkICYmICF1dGlsLmlzQm9vbGVhbihzKSkge1xuICAgICAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGF0IGlmIG9wIGlzIGNvdW50LCB3ZSBkb24ndCB1c2UgYSBmaWVsZFxuICAgICAgICAgIGRlbGV0ZSBzLmZpZWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzLm9yZGVyID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgICAgIC8vIGRyb3Agb3JkZXI6IGFzY2VuZGluZyBhcyBpdCBpcyB0aGUgZGVmYXVsdFxuICAgICAgICAgIGRlbGV0ZSBzLm9yZGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSkuZmlsdGVyKHMgPT4gcyAhPT0gdW5kZWZpbmVkKSwgdXRpbC5oYXNoKTtcblxuICBpZiAodW5pcXVlRG9tYWlucy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCBkb21haW4gPSBkb21haW5zWzBdO1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSAmJiBzb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgc29ydCA9IHNvcnRzWzBdO1xuICAgICAgaWYgKHNvcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICAgICAgc29ydCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kb21haW4sXG4gICAgICAgIHNvcnRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICAvLyBvbmx5IGtlZXAgc2ltcGxlIHNvcnQgcHJvcGVydGllcyB0aGF0IHdvcmsgd2l0aCB1bmlvbmVkIGRvbWFpbnNcbiAgY29uc3Qgc2ltcGxlU29ydHMgPSB1dGlsLnVuaXF1ZShzb3J0cy5tYXAocyA9PiB7XG4gICAgaWYgKHMgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRvbWFpblNvcnREcm9wcGVkKHMpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSksIHV0aWwuaGFzaCkgYXMgVmdVbmlvblNvcnRGaWVsZFtdO1xuXG4gIGxldCBzb3J0OiBWZ1VuaW9uU29ydEZpZWxkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChzaW1wbGVTb3J0cy5sZW5ndGggPT09IDEpIHtcbiAgICBzb3J0ID0gc2ltcGxlU29ydHNbMF07XG4gIH0gZWxzZSBpZiAoc2ltcGxlU29ydHMubGVuZ3RoID4gMSkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgc29ydCA9IHRydWU7XG4gIH1cblxuICBjb25zdCBhbGxEYXRhID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZCA9PiB7XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkKSkge1xuICAgICAgcmV0dXJuIGQuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pLCB4ID0+IHgpO1xuXG4gIGlmIChhbGxEYXRhLmxlbmd0aCA9PT0gMSAmJiBhbGxEYXRhWzBdICE9PSBudWxsKSB7XG4gICAgLy8gY3JlYXRlIGEgdW5pb24gZG9tYWluIG9mIGRpZmZlcmVudCBmaWVsZHMgd2l0aCBhIHNpbmdsZSBkYXRhIHNvdXJjZVxuICAgIGNvbnN0IGRvbWFpbjogVmdGaWVsZFJlZlVuaW9uRG9tYWluID0ge1xuICAgICAgZGF0YTogYWxsRGF0YVswXSxcbiAgICAgIGZpZWxkczogdW5pcXVlRG9tYWlucy5tYXAoZCA9PiAoZCBhcyBWZ0RhdGFSZWYpLmZpZWxkKSxcbiAgICAgIC4uLihzb3J0ID8ge3NvcnR9IDoge30pXG4gICAgfTtcblxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICByZXR1cm4ge2ZpZWxkczogdW5pcXVlRG9tYWlucywgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSl9O1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZpZWxkIGlmIGEgc2NhbGUgc2luZ2xlIGZpZWxkLlxuICogUmV0dXJuIGB1bmRlZmluZWRgIG90aGVyd2lzZS5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluOiBWZ0RvbWFpbik6IHN0cmluZyB7XG4gIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSAmJiBpc1N0cmluZyhkb21haW4uZmllbGQpKSB7XG4gICAgcmV0dXJuIGRvbWFpbi5maWVsZDtcbiAgfSBlbHNlIGlmIChpc0RhdGFSZWZVbmlvbmVkRG9tYWluKGRvbWFpbikpIHtcbiAgICBsZXQgZmllbGQ7XG4gICAgZm9yIChjb25zdCBub25VbmlvbkRvbWFpbiBvZiBkb21haW4uZmllbGRzKSB7XG4gICAgICBpZiAoaXNEYXRhUmVmRG9tYWluKG5vblVuaW9uRG9tYWluKSAmJiBpc1N0cmluZyhub25VbmlvbkRvbWFpbi5maWVsZCkpIHtcbiAgICAgICAgaWYgKCFmaWVsZCkge1xuICAgICAgICAgIGZpZWxkID0gbm9uVW5pb25Eb21haW4uZmllbGQ7XG4gICAgICAgIH0gZWxzZSBpZiAoZmllbGQgIT09IG5vblVuaW9uRG9tYWluLmZpZWxkKSB7XG4gICAgICAgICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIG11bHRpcGxlIGZpZWxkcyBmcm9tIGRpZmZlcmVudCBkYXRhIHNvdXJjZXMuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgICAgICAgIHJldHVybiBmaWVsZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgaWRlbnRpY2FsIGZpZWxkcyBmcm9tIGRpZmZlcmVudCBzb3VyY2UgZGV0ZWN0ZWQuICBXZSB3aWxsIGFzc3VtZSB0aGF0IHRoaXMgaXMgdGhlIHNhbWUgZmllbGQgZnJvbSBhIGRpZmZlcmVudCBmb3JrIG9mIHRoZSBzYW1lIGRhdGEgc291cmNlLiAgSG93ZXZlciwgaWYgdGhpcyBpcyBub3QgY2FzZSwgdGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5YmUgaW5jb3JyZWN0LicpO1xuICAgIHJldHVybiBmaWVsZDtcbiAgfSBlbHNlIGlmIChpc0ZpZWxkUmVmVW5pb25Eb21haW4oZG9tYWluKSkge1xuICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIFdlIHdpbGwgdXNlIHRoZSBmaXJzdCBmaWVsZC4gIFRoZSByZXN1bHQgdmlldyBzaXplIG1heSBiZSBpbmNvcnJlY3QuJyk7XG4gICAgY29uc3QgZmllbGQgPSBkb21haW4uZmllbGRzWzBdO1xuICAgIHJldHVybiBpc1N0cmluZyhmaWVsZCkgPyBmaWVsZCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZURvbWFpbihtb2RlbDogTW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkge1xuICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gIGNvbnN0IGRvbWFpbnMgPSBzY2FsZUNvbXBvbmVudC5kb21haW5zLm1hcChkb21haW4gPT4ge1xuICAgIC8vIENvcnJlY3QgcmVmZXJlbmNlcyB0byBkYXRhIGFzIHRoZSBvcmlnaW5hbCBkb21haW4ncyBkYXRhIHdhcyBkZXRlcm1pbmVkXG4gICAgLy8gaW4gcGFyc2VTY2FsZSwgd2hpY2ggaGFwcGVucyBiZWZvcmUgcGFyc2VEYXRhLiBUaHVzIHRoZSBvcmlnaW5hbCBkYXRhXG4gICAgLy8gcmVmZXJlbmNlIGNhbiBiZSBpbmNvcnJlY3QuXG5cbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgIGRvbWFpbi5kYXRhID0gbW9kZWwubG9va3VwRGF0YVNvdXJjZShkb21haW4uZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH0pO1xuXG4gIC8vIGRvbWFpbnMgaXMgYW4gYXJyYXkgdGhhdCBoYXMgdG8gYmUgbWVyZ2VkIGludG8gYSBzaW5nbGUgdmVnYSBkb21haW5cbiAgcmV0dXJuIG1lcmdlRG9tYWlucyhkb21haW5zKTtcbn1cbiJdfQ==