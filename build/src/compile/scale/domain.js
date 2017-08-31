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
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
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
            var _s = domain.sort, domainWithoutSort = tslib_1.__rest(domain, ["sort"]);
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
            return tslib_1.__assign({}, domain, { sort: sort_2 });
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
function getFieldFromDomains(domains) {
    var domain = mergeDomains(domains);
    if (vega_schema_1.isDataRefDomain(domain) && vega_util_1.isString(domain.field)) {
        return domain.field;
    }
    return undefined;
}
exports.getFieldFromDomains = getFieldFromDomains;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtQztBQUVuQyw2Q0FBdUQ7QUFDdkQsaUNBQXNDO0FBQ3RDLHlDQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsMkNBQWtFO0FBRWxFLCtCQUFpQztBQUNqQyxxQ0FBNkc7QUFDN0csbUNBQWtEO0FBQ2xELGlDQUFtQztBQUNuQyxpREFRMkI7QUFDM0Isb0NBQTJDO0FBQzNDLDZDQUFvRDtBQUNwRCxrQ0FBMEQ7QUFDMUQsb0RBQXdEO0FBS3hELDBCQUFpQyxLQUFZO0lBQzNDLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHVCQUF1QixDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7QUFDSCxDQUFDO0FBTkQsNENBTUM7QUFFRCw4QkFBOEIsS0FBZ0I7SUFDNUMsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQztJQUNyQyxJQUFNLG9CQUFvQixHQUF3QixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUV6RSxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDNUQsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQU0sZUFBZSxHQUFHLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUUzRSxJQUFNLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDdEQsSUFBTSxjQUFjLEdBQUcsb0JBQW9CLENBQUMs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