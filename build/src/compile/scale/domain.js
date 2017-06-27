"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var aggregate_1 = require("../../aggregate");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var log = require("../../log");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var util = require("../../util");
var util_1 = require("../../util");
var vega_schema_1 = require("../../vega.schema");
var assemble_1 = require("../data/assemble");
var facet_1 = require("../facet");
var selection_1 = require("../selection/selection");
var unit_1 = require("../unit");
function parseScaleDomain(model) {
    if (model instanceof unit_1.UnitModel) {
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
    util_1.keys(localScaleComponents).forEach(function (channel) {
        var specifiedScale = scales[channel];
        var specifiedDomain = specifiedScale ? specifiedScale.domain : undefined;
        var hasSpecifiedDomain = specifiedDomain && !scale_1.isSelectionDomain(specifiedDomain);
        var domain = parseDomainForChannel(model, channel);
        var localScaleCmpt = localScaleComponents[channel];
        localScaleCmpt.set('domain', domain, hasSpecifiedDomain);
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
    util_1.keys(localScaleComponents).forEach(function (channel) {
        // FIXME: Arvind -- Please revise logic for merging selectionDomain / domainRaw
        var domain;
        for (var _i = 0, _a = model.children; _i < _a.length; _i++) {
            var child = _a[_i];
            var childComponent = child.component.scales[channel];
            if (childComponent) {
                var childDomain = childComponent.get('domain');
                if (domain === undefined) {
                    domain = childDomain;
                }
                else {
                    domain = unionDomains(domain, childDomain);
                }
            }
        }
        if (model instanceof facet_1.FacetModel) {
            // Replace the scale domain with data output from a cloned subtree after the facet.
            if (vega_schema_1.isDataRefDomain(domain) || vega_schema_1.isFieldRefUnionDomain(domain)) {
                domain.data = assemble_1.FACET_SCALE_PREFIX + model.getName(domain.data);
            }
            else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
                domain.fields = domain.fields.map(function (f) {
                    return tslib_1.__assign({}, f, { data: assemble_1.FACET_SCALE_PREFIX + model.getName(f.data) });
                });
            }
        }
        localScaleComponents[channel].set('domain', domain, true);
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
// FIXME: Domoritz --  please change this to return VgDomain[] and union one at the end in assemble
function parseDomainForChannel(model, channel) {
    var scaleType = model.getScaleComponent(channel).get('type');
    var domain = normalizeUnaggregatedDomain(model.scaleDomain(channel), model.fieldDef(channel), scaleType, model.config.scale);
    if (domain !== model.scaleDomain(channel)) {
        model.specifiedScales[channel] = tslib_1.__assign({}, model.specifiedScales[channel], { domain: domain });
    }
    // If channel is either X or Y then union them with X2 & Y2 if they exist
    if (channel === 'x' && model.channelHasField('x2')) {
        if (model.channelHasField('x')) {
            return unionDomains(parseSingleChannelDomain(scaleType, domain, model, 'x'), parseSingleChannelDomain(scaleType, domain, model, 'x2'));
        }
        else {
            return parseSingleChannelDomain(scaleType, domain, model, 'x2');
        }
    }
    else if (channel === 'y' && model.channelHasField('y2')) {
        if (model.channelHasField('y')) {
            return unionDomains(parseSingleChannelDomain(scaleType, domain, model, 'y'), parseSingleChannelDomain(scaleType, domain, model, 'y2'));
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
                    return { signal: datetime_1.dateTimeExpr(dt, true) };
                });
            }
            return domain;
        }
    }
    var stack = model.stack;
    if (stack && channel === stack.fieldChannel) {
        if (stack.offset === 'normalize') {
            return [0, 1];
        }
        return {
            data: model.requestDataName(data_1.MAIN),
            fields: [
                model.field(channel, { suffix: 'start' }),
                model.field(channel, { suffix: 'end' })
            ]
        };
    }
    var sort = channel_1.isScaleChannel(channel) ? domainSort(model, channel, scaleType) : undefined;
    if (domain === 'unaggregated') {
        return {
            data: model.requestDataName(data_1.MAIN),
            fields: [
                model.field(channel, { aggregate: 'min' }),
                model.field(channel, { aggregate: 'max' })
            ]
        };
    }
    else if (fieldDef.bin) {
        if (scale_1.isBinScale(scaleType)) {
            var signal = model.getName(bin_1.binToString(fieldDef.bin) + "_" + fieldDef.field + "_bins");
            return { signal: "sequence(" + signal + ".start, " + signal + ".stop + " + signal + ".step, " + signal + ".step)" };
        }
        if (scale_1.hasDiscreteDomain(scaleType)) {
            // ordinal bin scale takes domain from bin_range, ordered by bin_start
            // This is useful for both axis-based scale (x, y, column, and row) and legend-based scale (other channels).
            return {
                data: model.requestDataName(data_1.MAIN),
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
                    data: model.requestDataName(data_1.MAIN),
                    fields: [
                        model.field(channel, { binSuffix: 'start' }),
                        model.field(channel, { binSuffix: 'end' })
                    ]
                };
            }
            else {
                // TODO: use bin_mid
                return {
                    data: model.requestDataName(data_1.MAIN),
                    field: model.field(channel, { binSuffix: 'start' })
                };
            }
        }
    }
    else if (sort) {
        return {
            // If sort by aggregation of a specified sort field, we need to use RAW table,
            // so we can aggregate values for the scale independently from the main aggregation.
            data: util.isBoolean(sort) ? model.requestDataName(data_1.MAIN) : model.requestDataName(data_1.RAW),
            field: model.field(channel),
            sort: sort
        };
    }
    else {
        return {
            data: model.requestDataName(data_1.MAIN),
            field: model.field(channel)
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
 * Convert the domain to an array of data refs or an array of values. Also, throw
 * away sorting information since we always sort the domain when we union two domains.
 */
function normalizeDomain(domain) {
    if (util.isArray(domain)) {
        return [domain];
    }
    else if (vega_schema_1.isSignalRefDomain(domain)) {
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
        return domain.fields;
    }
    /* istanbul ignore next: This should never happen. */
    throw new Error(log.message.INVAID_DOMAIN);
}
/**
 * Union two data domains. A unioned domain is always sorted.
 */
function unionDomains(domain1, domain2) {
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
            // create a union domain of different fields with a single data source
            var domain = {
                data: allData[0],
                fields: domains.map(function (d) { return d.field; })
            };
            return domain;
        }
        return { fields: domains, sort: true };
    }
    else {
        return domains[0];
    }
}
exports.unionDomains = unionDomains;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDZDQUF1RDtBQUN2RCxpQ0FBc0M7QUFDdEMseUNBQW9FO0FBQ3BFLG1DQUFxQztBQUNyQywyQ0FBa0U7QUFFbEUsK0JBQWlDO0FBQ2pDLHFDQUFvSDtBQUNwSCxtQ0FBdUM7QUFDdkMsaUNBQW1DO0FBQ25DLG1DQUFnQztBQUVoQyxpREFTMkI7QUFDM0IsNkNBQW9EO0FBQ3BELGtDQUFvQztBQUVwQyxvREFBd0Q7QUFDeEQsZ0NBQWtDO0FBR2xDLDBCQUFpQyxLQUFZO0lBQzNDLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxnQkFBUyxDQUFDLENBQUMsQ0FBQztRQUMvQixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0FBQ0gsQ0FBQztBQU5ELDRDQU1DO0FBRUQsOEJBQThCLEtBQWdCO0lBQzVDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7SUFDckMsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsV0FBSSxDQUFDLG9CQUFvQixDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUMsT0FBcUI7UUFDdkQsSUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3ZDLElBQU0sZUFBZSxHQUFHLGNBQWMsR0FBRyxjQUFjLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUUzRSxJQUFNLGtCQUFrQixHQUFHLGVBQWUsSUFBSSxDQUFDLHlCQUFpQixDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBRWxGLElBQU0sTUFBTSxHQUFHLHFCQUFxQixDQUFDLEtBQUssRUFB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