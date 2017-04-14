"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var aggregate_1 = require("../../aggregate");
var bin_1 = require("../../bin");
var datetime_1 = require("../../datetime");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var util = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var data_1 = require("../../data");
function initDomain(domain, fieldDef, scale, scaleConfig) {
    if (domain === 'unaggregated') {
        var _a = canUseUnaggregatedDomain(fieldDef, scale), valid = _a.valid, reason = _a.reason;
        if (!valid) {
            log.warn(reason);
            return undefined;
        }
    }
    else if (domain === undefined && scaleConfig.useUnaggregatedDomain) {
        // Apply config if domain is not specified.
        var valid = canUseUnaggregatedDomain(fieldDef, scale).valid;
        if (valid) {
            return 'unaggregated';
        }
    }
    return domain;
}
exports.initDomain = initDomain;
function parseDomain(model, channel) {
    var scale = model.scale(channel);
    // If channel is either X or Y then union them with X2 & Y2 if they exist
    if (channel === 'x' && model.channelHasField('x2')) {
        if (model.channelHasField('x')) {
            return unionDomains(parseSingleChannelDomain(scale, model, 'x'), parseSingleChannelDomain(scale, model, 'x2'));
        }
        else {
            return parseSingleChannelDomain(scale, model, 'x2');
        }
    }
    else if (channel === 'y' && model.channelHasField('y2')) {
        if (model.channelHasField('y')) {
            return unionDomains(parseSingleChannelDomain(scale, model, 'y'), parseSingleChannelDomain(scale, model, 'y2'));
        }
        else {
            return parseSingleChannelDomain(scale, model, 'y2');
        }
    }
    return parseSingleChannelDomain(scale, model, channel);
}
exports.parseDomain = parseDomain;
function parseSingleChannelDomain(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (scale.domain && scale.domain !== 'unaggregated') {
        if (datetime_1.isDateTime(scale.domain[0])) {
            return scale.domain.map(function (dt) {
                return datetime_1.timestamp(dt, true);
            });
        }
        return scale.domain;
    }
    var stack = model.stack;
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return [0, 1];
        }
        return {
            data: model.getDataName(data_1.MAIN),
            fields: [
                model.field(channel, { suffix: 'start' }),
                model.field(channel, { suffix: 'end' })
            ]
        };
    }
    var sort = domainSort(model, channel, scale.type);
    if (scale.domain === 'unaggregated') {
        return {
            data: model.getDataName(data_1.MAIN),
            fields: [
                model.field(channel, { aggregate: 'min' }),
                model.field(channel, { aggregate: 'max' })
            ]
        };
    }
    else if (fieldDef.bin) {
        if (scale_1.isBinScale(scale.type)) {
            var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
            return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
        }
        if (scale_1.hasDiscreteDomain(scale.type)) {
            // ordinal bin scale takes domain from bin_range, ordered by bin_start
            // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
            return {
                data: model.getDataName(data_1.MAIN),
                field: model.field(channel, { binSuffix: 'range' }),
                sort: {
                    field: model.field(channel, { binSuffix: 'start' }),
                    op: 'min' // min or max doesn't matter since same _range would have the same _start
                }
            };
        }
        else {
            if (channel === 'x' || channel === 'y') {
                // X/Y position have to include start and end for non-ordinal scale
                return {
                    data: model.getDataName(data_1.MAIN),
                    fields: [
                        model.field(channel, { binSuffix: 'start' }),
                        model.field(channel, { binSuffix: 'end' })
                    ]
                };
            }
            else {
                // TODO: use bin_mid
                return {
                    data: model.getDataName(data_1.MAIN),
                    field: model.field(channel, { binSuffix: 'start' })
                };
            }
        }
    }
    else if (sort) {
        return {
            // If sort by aggregation of a specified sort field, we need to use RAW table,
            // so we can aggregate values for the scale independently from the main aggregation.
            data: util.isBoolean(sort) ? model.getDataName(data_1.MAIN) : model.getDataName(data_1.RAW),
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.getDataName(data_1.MAIN),
            field: model.field(channel),
        };
    }
}
function domainSort(model, channel, scaleType) {
    if (!scale_1.hasDiscreteDomain(scaleType)) {
        return undefined;
    }
    var sort = model.sort(channel);
    // Sorted based on an aggregate calculation over a specified sort field (only for ordinal scale)
    if (sort_1.isSortField(sort)) {
        return {
            op: sort.op,
            field: sort.field
        };
    }
    if (util.contains(['ascending', 'descending', undefined /* default =ascending*/], sort)) {
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
    if (aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) === -1) {
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
 * Convert the domain to an array of data refs or an array of values. Also, throw
 * away sorting information since we always sort the domain when we union two domains.
 */
function normalizeDomain(domain) {
    if (util.isArray(domain)) {
        return [domain];
    }
    else if (vega_schema_1.isDataRefDomain(domain)) {
        delete domain.sort;
        return [domain];
    }
    else if (vega_schema_1.isFieldRefUnionDomain(domain)) {
        return domain.fields.map(function (d) {
            return {
                data: domain.data,
                field: d
            };
        });
    }
    else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
        return domain.fields.map(function (d) {
            if (util.isArray(d)) {
                return d;
            }
            return {
                field: d.field,
                data: d.data
            };
        });
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVAID_DOMAIN);
}
/**
 * Union two data domains. A unioned domain is always sorted.
 */
function unionDomains(domain1, domain2) {
    if (vega_schema_1.isSignalRefDomain(domain1) || vega_schema_1.isSignalRefDomain(domain2)) {
        if (!vega_schema_1.isSignalRefDomain(domain1) || !vega_schema_1.isSignalRefDomain(domain2) || domain1.signal !== domain2.signal) {
            throw new Error(log.message.UNABLE_TO_MERGE_DOMAINS);
        }
        return domain1;
    }
    var normalizedDomain1 = normalizeDomain(domain1);
    var normalizedDomain2 = normalizeDomain(domain2);
    var domains = normalizedDomain1.concat(normalizedDomain2);
    domains = util.unique(domains, util.hash);
    if (domains.length > 1) {
        var allData = domains.map(function (d) {
            if (vega_schema_1.isDataRefDomain(d)) {
                return d.data;
            }
            return null;
        });
        if (util.unique(allData, function (x) { return x; }).length === 1 && allData[0] !== null) {
            return {
                data: allData[0],
                fields: domains.map(function (d) { return d.field; })
            };
        }
        return { fields: domains, sort: true };
    }
    else {
        return domains[0];
    }
}
exports.unionDomains = unionDomains;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBRWpDLDZDQUFrRDtBQUNsRCxpQ0FBc0M7QUFFdEMsMkNBQStEO0FBRS9ELHFDQUFpRztBQUNqRyxtQ0FBdUM7QUFDdkMsaUNBQW1DO0FBQ25DLGlEQVUyQjtBQUUzQixtQ0FBcUM7QUFJckMsb0JBQTJCLE1BQWMsRUFBRSxRQUFrQixFQUFFLEtBQWdCLEVBQUUsV0FBd0I7SUFDdkcsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBQSw4Q0FBMkQsRUFBMUQsZ0JBQUssRUFBRSxrQkFBTSxDQUE4QztRQUNsRSxFQUFFLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLDJDQUEyQztRQUNwQyxJQUFBLHVEQUFLLENBQThDO1FBQzFELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLENBQUMsY0FBYyxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBaEJELGdDQWdCQztBQUdELHFCQUE0QixLQUFZLEVBQUUsT0FBZ0I7SUFDeEQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVuQyx5RUFBeUU7SUFDekUsRUFBRSxDQUFDLENBQUMsT0FB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