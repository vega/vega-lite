"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("../../log");
var aggregate_1 = require("../../aggregate");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var vega_schema_1 = require("../../vega.schema");
var util = require("../../util");
var util_1 = require("../../util");
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
    // For stack, use STACKED data.
    var stack = model.stack;
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return [0, 1];
        }
        return {
            data: model.dataName('stacked'),
            fields: [
                model.field(channel, { suffix: 'start' }),
                model.field(channel, { suffix: 'end' })
            ]
        };
    }
    var sort = domainSort(model, channel, scale.type);
    if (scale.domain === 'unaggregated') {
        return {
            data: model.dataTable(),
            fields: [
                model.field(channel, { aggregate: 'min' }),
                model.field(channel, { aggregate: 'max' })
            ]
        };
    }
    else if (fieldDef.bin) {
        if (scale_1.isBinScale(scale.type)) {
            var field = util_1.varName(model.getName(fieldDef.field + '_bins'));
            return { signal: "sequence(" + field + ".start, " + field + ".stop + " + field + ".step, " + field + ".step)" };
        }
        if (scale_1.hasDiscreteDomain(scale.type)) {
            // ordinal bin scale takes domain from bin_range, ordered by bin_start
            // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
            return {
                data: model.dataTable(),
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
                    data: model.dataTable(),
                    fields: [
                        model.field(channel, { binSuffix: 'start' }),
                        model.field(channel, { binSuffix: 'end' })
                    ]
                };
            }
            else {
                // TODO: use bin_mid
                return {
                    data: model.dataTable(),
                    field: model.field(channel, { binSuffix: 'start' })
                };
            }
        }
    }
    else if (sort) {
        return {
            // If sort by aggregation of a specified sort field, we need to use SOURCE table,
            // so we can aggregate values for the scale independently from the main aggregation.
            data: util.isBoolean(sort) ? model.dataTable() : data_1.SOURCE,
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.dataTable(),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0JBQWlDO0FBRWpDLDZDQUFrRDtBQUVsRCxtQ0FBa0M7QUFDbEMsMkNBQStEO0FBQy9ELHFDQUFpRztBQUNqRyxtQ0FBdUM7QUFDdkMsaURBVTJCO0FBRTNCLGlDQUFtQztBQUduQyxtQ0FBbUM7QUFHbkMsb0JBQTJCLE1BQWMsRUFBRSxRQUFrQixFQUFFLEtBQWdCLEVBQUUsV0FBd0I7SUFDdkcsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBQSw4Q0FBMkQsRUFBMUQsZ0JBQUssRUFBRSxrQkFBTSxDQUE4QztRQUNsRSxFQUFFLENBQUEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxTQUFTLENBQUM7UUFDbkIsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsSUFBSSxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLDJDQUEyQztRQUNwQyxJQUFBLHVEQUFLLENBQThDO1FBQzFELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixNQUFNLENBQUMsY0FBYyxDQUFDO1FBQ3hCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUNoQixDQUFDO0FBaEJELGdDQWdCQztBQUdELHFCQUE0QixLQUFZLEVBQUUsT0FBZ0I7SUFDeEQsSUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUVuQyx5RUFBeUU7SUFDekUsRUFBRSxDQUFDLENBQUMsT0FB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