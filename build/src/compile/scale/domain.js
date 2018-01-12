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
        if (vega_schema_1.isDataRefDomain(d)) {
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
    if (vega_schema_1.isDataRefDomain(domain) && util.isString(domain.field)) {
        return domain.field;
    }
    else if (vega_schema_2.isDataRefUnionedDomain(domain)) {
        var field = void 0;
        for (var _i = 0, _a = domain.fields; _i < _a.length; _i++) {
            var nonUnionDomain = _a[_i];
            if (vega_schema_1.isDataRefDomain(nonUnionDomain) && util.isString(nonUnionDomain.field)) {
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
    else if (vega_schema_2.isFieldRefUnionDomain(domain)) {
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
        if (vega_schema_1.isDataRefDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
        }
        return domain;
    });
    // domains is an array that has to be merged into a single vega domain
    return mergeDomains(domains);
}
exports.assembleDomain = assembleDomain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBdUQ7QUFDdkQsaUNBQXNDO0FBQ3RDLHlDQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsMkNBQWtFO0FBRWxFLCtCQUFpQztBQUNqQyxxQ0FBNkc7QUFDN0csbUNBQWtEO0FBQ2xELGlDQUFtQztBQUNuQyxpREFRMkI7QUFDM0IsaURBQWdGO0FBQ2hGLG9DQUEyQztBQUMzQyw2Q0FBb0Q7QUFDcEQsa0NBQTBEO0FBQzFELG9EQUF3RDtBQUt4RCwwQkFBaUMsS0FBWTtJQUMzQyxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixvQkFBb0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTix1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0FBQ0gsQ0FBQztBQU5ELDRDQU1DO0FBRUQsOEJBQThCLEtBQWdCO0lBQzVDLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUM7SUFDckMsSUFBTSxvQkFBb0IsR0FBd0IsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7SUFFekUsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLE9BQXFCO1FBQzVELElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN2QyxJQUFNLGVBQWUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztRQUUzRSxJQUFNLE9BQU8sR0FBRyxxQkFBcUIsQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENB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QztJQUVELE1BQU0sQ0FBQyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXhCRCxnREF3QkM7QUFFRCx3QkFBK0IsS0FBWSxFQUFFLE9BQXFCO0lBQ2hFLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTTtRQUMvQywwRUFBMEU7UUFDMUUsd0VBQXdFO1FBQ3hFLDhCQUE4QjtRQUU5QixFQUFFLENBQUMsQ0FBQyw2QkFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixNQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUNELE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxzRUFBc0U7SUFDdEUsTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQixDQUFDO0FBZkQsd0NBZUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1NIQVJFRF9ET01BSU5fT1BfSU5ERVh9IGZyb20gJy4uLy4uL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge2JpblRvU3RyaW5nfSBmcm9tICcuLi8uLi9iaW4nO1xuaW1wb3J0IHtpc1NjYWxlQ2hhbm5lbCwgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7TUFJTiwgUkFXfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7RGF0ZVRpbWUsIGRhdGVUaW1lRXhwciwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0IHtGaWVsZERlZn0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0RvbWFpbiwgaGFzRGlzY3JldGVEb21haW4sIGlzQmluU2NhbGUsIGlzU2VsZWN0aW9uRG9tYWluLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge2lzU29ydEZpZWxkLCBTb3J0RmllbGR9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7XG4gIGlzRGF0YVJlZkRvbWFpbixcbiAgVmdEYXRhUmVmLFxuICBWZ0RvbWFpbixcbiAgVmdGaWVsZFJlZlVuaW9uRG9tYWluLFxuICBWZ05vblVuaW9uRG9tYWluLFxuICBWZ1NvcnRGaWVsZCxcbiAgVmdVbmlvblNvcnRGaWVsZFxufSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge2lzRGF0YVJlZlVuaW9uZWREb21haW4sIGlzRmllbGRSZWZVbmlvbkRvbWFpbn0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtiaW5SZXF1aXJlc1JhbmdlfSBmcm9tICcuLi9jb21tb24nO1xuaW1wb3J0IHtGQUNFVF9TQ0FMRV9QUkVGSVh9IGZyb20gJy4uL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZURvbWFpbihtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlcyA9IG1vZGVsLnNwZWNpZmllZFNjYWxlcztcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBzY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3Qgc3BlY2lmaWVkRG9tYWluID0gc3BlY2lmaWVkU2NhbGUgPyBzcGVjaWZpZWRTY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBkb21haW5zID0gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKTtcbiAgICBjb25zdCBsb2NhbFNjYWxlQ21wdCA9IGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdO1xuICAgIGxvY2FsU2NhbGVDbXB0LmRvbWFpbnMgPSBkb21haW5zO1xuXG4gICAgaWYgKGlzU2VsZWN0aW9uRG9tYWluKHNwZWNpZmllZERvbWFpbikpIHtcbiAgICAgIC8vIEFzIHNjYWxlIHBhcnNpbmcgb2NjdXJzIGJlZm9yZSBzZWxlY3Rpb24gcGFyc2luZywgd2UgdXNlIGEgdGVtcG9yYXJ5XG4gICAgICAvLyBzaWduYWwgaGVyZSBhbmQgYXBwZW5kIHRoZSBzY2FsZS5kb21haW4gZGVmaW5pdGlvbi4gVGhpcyBpcyByZXBsYWNlZFxuICAgICAgLy8gd2l0aCB0aGUgY29ycmVjdCBkb21haW5SYXcgc2lnbmFsIGR1cmluZyBzY2FsZSBhc3NlbWJseS5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaXNSYXdTZWxlY3Rpb25Eb21haW4gaW4gc2VsZWN0aW9uLnRzLlxuXG4gICAgICAvLyBGSVhNRTogcmVwbGFjZSB0aGlzIHdpdGggYSBzcGVjaWFsIHByb3BlcnR5IGluIHRoZSBzY2FsZUNvbXBvbmVudFxuICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KCdkb21haW5SYXcnLCB7XG4gICAgICAgIHNpZ25hbDogU0VMRUNUSU9OX0RPTUFJTiArIEpTT04uc3RyaW5naWZ5KHNwZWNpZmllZERvbWFpbilcbiAgICAgIH0sIHRydWUpO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBmb3IgKGNvbnN0IGNoaWxkIG9mIG1vZGVsLmNoaWxkcmVuKSB7XG4gICAgcGFyc2VTY2FsZURvbWFpbihjaGlsZCk7XG4gIH1cblxuICBjb25zdCBsb2NhbFNjYWxlQ29tcG9uZW50czogU2NhbGVDb21wb25lbnRJbmRleCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXM7XG5cbiAgdXRpbC5rZXlzKGxvY2FsU2NhbGVDb21wb25lbnRzKS5mb3JFYWNoKChjaGFubmVsOiBTY2FsZUNoYW5uZWwpID0+IHtcbiAgICAvLyBGSVhNRTogQXJ2aW5kIC0tIFBsZWFzZSByZXZpc2UgbG9naWMgZm9yIG1lcmdpbmcgc2VsZWN0aW9uRG9tYWluIC8gZG9tYWluUmF3XG5cbiAgICBsZXQgZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdO1xuXG4gICAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgICAgY29uc3QgY2hpbGRDb21wb25lbnQgPSBjaGlsZC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICAgICAgaWYgKGNoaWxkQ29tcG9uZW50KSB7XG4gICAgICAgIGlmIChkb21haW5zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkb21haW5zID0gY2hpbGRDb21wb25lbnQuZG9tYWlucztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb21haW5zID0gZG9tYWlucy5jb25jYXQoY2hpbGRDb21wb25lbnQuZG9tYWlucyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgICAgZG9tYWlucy5mb3JFYWNoKChkb21haW4pID0+IHtcbiAgICAgICAgLy8gUmVwbGFjZSB0aGUgc2NhbGUgZG9tYWluIHdpdGggZGF0YSBvdXRwdXQgZnJvbSBhIGNsb25lZCBzdWJ0cmVlIGFmdGVyIHRoZSBmYWNldC5cbiAgICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICAgICAgLy8gdXNlIGRhdGEgZnJvbSBjbG9uZWQgc3VidHJlZSAod2hpY2ggaXMgdGhlIHNhbWUgYXMgZGF0YSBidXQgd2l0aCBhIHByZWZpeCBhZGRlZCBvbmNlKVxuICAgICAgICAgIGRvbWFpbi5kYXRhID0gRkFDRVRfU0NBTEVfUFJFRklYICsgZG9tYWluLmRhdGEucmVwbGFjZShGQUNFVF9TQ0FMRV9QUkVGSVgsICcnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0uZG9tYWlucyA9IGRvbWFpbnM7XG4gIH0pO1xufVxuXG5cbi8qKlxuICogUmVtb3ZlIHVuYWdncmVnYXRlZCBkb21haW4gaWYgaXQgaXMgbm90IGFwcGxpY2FibGVcbiAqIEFkZCB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGRvbWFpbiBpcyBub3Qgc3BlY2lmaWVkIGFuZCBjb25maWcuc2NhbGUudXNlVW5hZ2dyZWdhdGVkRG9tYWluIGlzIHRydWUuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZVVuYWdncmVnYXRlZERvbWFpbihkb21haW46IERvbWFpbiwgZmllbGREZWY6IEZpZWxkRGVmPHN0cmluZz4sIHNjYWxlVHlwZTogU2NhbGVUeXBlLCBzY2FsZUNvbmZpZzogU2NhbGVDb25maWcpIHtcbiAgaWYgKGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICBjb25zdCB7dmFsaWQsIHJlYXNvbn0gPSBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWYsIHNjYWxlVHlwZSk7XG4gICAgaWYoIXZhbGlkKSB7XG4gICAgICBsb2cud2FybihyZWFzb24pO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gZWxzZSBpZiAoZG9tYWluID09PSB1bmRlZmluZWQgJiYgc2NhbGVDb25maWcudXNlVW5hZ2dyZWdhdGVkRG9tYWluKSB7XG4gICAgLy8gQXBwbHkgY29uZmlnIGlmIGRvbWFpbiBpcyBub3Qgc3BlY2lmaWVkLlxuICAgIGNvbnN0IHt2YWxpZH0gPSBjYW5Vc2VVbmFnZ3JlZ2F0ZWREb21haW4oZmllbGREZWYsIHNjYWxlVHlwZSk7XG4gICAgaWYgKHZhbGlkKSB7XG4gICAgICByZXR1cm4gJ3VuYWdncmVnYXRlZCc7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGRvbWFpbjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRG9tYWluRm9yQ2hhbm5lbChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpOiBWZ05vblVuaW9uRG9tYWluW10ge1xuICBjb25zdCBzY2FsZVR5cGUgPSBtb2RlbC5nZXRTY2FsZUNvbXBvbmVudChjaGFubmVsKS5nZXQoJ3R5cGUnKTtcblxuICBjb25zdCBkb21haW4gPSBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4obW9kZWwuc2NhbGVEb21haW4oY2hhbm5lbCksIG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpLCBzY2FsZVR5cGUsIG1vZGVsLmNvbmZpZy5zY2FsZSk7XG4gIGlmIChkb21haW4gIT09IG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpKSB7XG4gICAgbW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdID0ge1xuICAgICAgLi4ubW9kZWwuc3BlY2lmaWVkU2NhbGVzW2NoYW5uZWxdLFxuICAgICAgZG9tYWluXG4gICAgfTtcbiAgfVxuXG4gIC8vIElmIGNoYW5uZWwgaXMgZWl0aGVyIFggb3IgWSB0aGVuIHVuaW9uIHRoZW0gd2l0aCBYMiAmIFkyIGlmIHRoZXkgZXhpc3RcbiAgaWYgKGNoYW5uZWwgPT09ICd4JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3gyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneCcpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneDInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneDInKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoY2hhbm5lbCA9PT0gJ3knICYmIG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneTInKSkge1xuICAgIGlmIChtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3knKSkge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5JykuY29uY2F0KHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5MicpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsICd5MicpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgY2hhbm5lbCk7XG59XG5cbmZ1bmN0aW9uIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGU6IFNjYWxlVHlwZSwgZG9tYWluOiBEb21haW4sIG1vZGVsOiBVbml0TW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCB8ICd4MicgfCAneTInKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3QgZmllbGREZWYgPSBtb2RlbC5maWVsZERlZihjaGFubmVsKTtcblxuICBpZiAoZG9tYWluICYmIGRvbWFpbiAhPT0gJ3VuYWdncmVnYXRlZCcgJiYgIWlzU2VsZWN0aW9uRG9tYWluKGRvbWFpbikpIHsgLy8gZXhwbGljaXQgdmFsdWVcbiAgICBpZiAoZmllbGREZWYuYmluKSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5jb25mbGljdGVkRG9tYWluKGNoYW5uZWwpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGlzRGF0ZVRpbWUoZG9tYWluWzBdKSkge1xuICAgICAgICByZXR1cm4gKGRvbWFpbiBhcyBEYXRlVGltZVtdKS5tYXAoKGR0KSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHtzaWduYWw6IGB7ZGF0YTogJHtkYXRlVGltZUV4cHIoZHQsIHRydWUpfX1gfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gW2RvbWFpbl07XG4gICAgfVxuICB9XG5cbiAgY29uc3Qgc3RhY2sgPSBtb2RlbC5zdGFjaztcbiAgaWYgKHN0YWNrICYmIGNoYW5uZWwgPT09IHN0YWNrLmZpZWxkQ2hhbm5lbCkge1xuICAgIGlmKHN0YWNrLm9mZnNldCA9PT0gJ25vcm1hbGl6ZScpIHtcbiAgICAgIHJldHVybiBbWzAsIDFdXTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7c3VmZml4OiAnc3RhcnQnfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHtzdWZmaXg6ICdlbmQnfSlcbiAgICB9XTtcbiAgfVxuXG4gIGNvbnN0IHNvcnQgPSBpc1NjYWxlQ2hhbm5lbChjaGFubmVsKSA/IGRvbWFpblNvcnQobW9kZWwsIGNoYW5uZWwsIHNjYWxlVHlwZSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKGRvbWFpbiA9PT0gJ3VuYWdncmVnYXRlZCcpIHtcbiAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7YWdncmVnYXRlOiAnbWluJ30pXG4gICAgfSwge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsLCB7YWdncmVnYXRlOiAnbWF4J30pXG4gICAgfV07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYuYmluKSB7IC8vIGJpblxuICAgIGlmIChpc0JpblNjYWxlKHNjYWxlVHlwZSkpIHtcbiAgICAgIGNvbnN0IHNpZ25hbCA9IG1vZGVsLmdldE5hbWUoYCR7YmluVG9TdHJpbmcoZmllbGREZWYuYmluKX1fJHtmaWVsZERlZi5maWVsZH1fYmluc2ApO1xuICAgICAgcmV0dXJuIFt7c2lnbmFsOiBgc2VxdWVuY2UoJHtzaWduYWx9LnN0YXJ0LCAke3NpZ25hbH0uc3RvcCArICR7c2lnbmFsfS5zdGVwLCAke3NpZ25hbH0uc3RlcClgfV07XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICAgIC8vIG9yZGluYWwgYmluIHNjYWxlIHRha2VzIGRvbWFpbiBmcm9tIGJpbl9yYW5nZSwgb3JkZXJlZCBieSBiaW4gc3RhcnRcbiAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBib3RoIGF4aXMtYmFzZWQgc2NhbGUgKHgveSkgYW5kIGxlZ2VuZC1iYXNlZCBzY2FsZSAob3RoZXIgY2hhbm5lbHMpLlxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgUkFXIHRhYmxlLFxuICAgICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgICAgLy8gVXNlIHJhbmdlIGlmIHdlIGFkZGVkIGl0IGFuZCB0aGUgc2NhbGUgZG9lcyBub3Qgc3VwcG9ydCBjb21wdXRpbmcgYSByYW5nZSBhcyBhIHNpZ25hbC5cbiAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIGJpblJlcXVpcmVzUmFuZ2UoZmllbGREZWYsIGNoYW5uZWwpID8ge2JpblN1ZmZpeDogJ3JhbmdlJ30gOiB7fSksXG4gICAgICAgIC8vIHdlIGhhdmUgdG8gdXNlIGEgc29ydCBvYmplY3QgaWYgc29ydCA9IHRydWUgdG8gbWFrZSB0aGUgc29ydCBjb3JyZWN0IGJ5IGJpbiBzdGFydFxuICAgICAgICBzb3J0OiBzb3J0ID09PSB0cnVlIHx8ICFpc1NvcnRGaWVsZChzb3J0KSA/IHtcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge30pLFxuICAgICAgICAgIG9wOiAnbWluJyAvLyBtaW4gb3IgbWF4IGRvZXNuJ3QgbWF0dGVyIHNpbmNlIHdlIHNvcnQgYnkgdGhlIHN0YXJ0IG9mIHRoZSBiaW4gcmFuZ2VcbiAgICAgICAgfSA6IHNvcnRcbiAgICAgIH1dO1xuICAgIH0gZWxzZSB7IC8vIGNvbnRpbnVvdXMgc2NhbGVzXG4gICAgICBpZiAoY2hhbm5lbCA9PT0gJ3gnIHx8IGNoYW5uZWwgPT09ICd5Jykge1xuICAgICAgICAvLyBYL1kgcG9zaXRpb24gaGF2ZSB0byBpbmNsdWRlIHN0YXJ0IGFuZCBlbmQgZm9yIG5vbi1vcmRpbmFsIHNjYWxlXG4gICAgICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgZmllbGQ6IG1vZGVsLmZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge2JpblN1ZmZpeDogJ2VuZCd9KVxuICAgICAgICB9XTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRPRE86IHVzZSBiaW5fbWlkXG4gICAgICAgIHJldHVybiBbe1xuICAgICAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwuZmllbGQoY2hhbm5lbCwge30pXG4gICAgICAgIH1dO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIGlmIChzb3J0KSB7XG4gICAgcmV0dXJuIFt7XG4gICAgICAvLyBJZiBzb3J0IGJ5IGFnZ3JlZ2F0aW9uIG9mIGEgc3BlY2lmaWVkIHNvcnQgZmllbGQsIHdlIG5lZWQgdG8gdXNlIFJBVyB0YWJsZSxcbiAgICAgIC8vIHNvIHdlIGNhbiBhZ2dyZWdhdGUgdmFsdWVzIGZvciB0aGUgc2NhbGUgaW5kZXBlbmRlbnRseSBmcm9tIHRoZSBtYWluIGFnZ3JlZ2F0aW9uLlxuICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKSxcbiAgICAgIHNvcnQ6IHNvcnRcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKVxuICAgIH1dO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRvbWFpblNvcnQobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsLCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6IHRydWUgfCBTb3J0RmllbGQ8c3RyaW5nPiB7XG4gIGlmICghaGFzRGlzY3JldGVEb21haW4oc2NhbGVUeXBlKSkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBjb25zdCBzb3J0ID0gbW9kZWwuc29ydChjaGFubmVsKTtcblxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcbiAgaWYgKGlzU29ydEZpZWxkKHNvcnQpKSB7XG4gICAgcmV0dXJuIHNvcnQ7XG4gIH1cblxuICBpZiAoc29ydCA9PT0gJ2Rlc2NlbmRpbmcnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wOiAnbWluJyxcbiAgICAgIGZpZWxkOiBtb2RlbC5maWVsZChjaGFubmVsKSxcbiAgICAgIG9yZGVyOiAnZGVzY2VuZGluZydcbiAgICB9O1xuICB9XG5cbiAgaWYgKHV0aWwuY29udGFpbnMoWydhc2NlbmRpbmcnLCB1bmRlZmluZWQgLyogZGVmYXVsdCA9YXNjZW5kaW5nKi9dLCBzb3J0KSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gc29ydCA9PSBudWxsXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cblxuXG4vKipcbiAqIERldGVybWluZSBpZiBhIHNjYWxlIGNhbiB1c2UgdW5hZ2dyZWdhdGVkIGRvbWFpbi5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBhbGwgb2YgdGhlIGZvbGxvd2luZyBjb25kaXRvbnMgYXBwbGllczpcbiAqIDEuIGBzY2FsZS5kb21haW5gIGlzIGB1bmFnZ3JlZ2F0ZWRgXG4gKiAyLiBBZ2dyZWdhdGlvbiBmdW5jdGlvbiBpcyBub3QgYGNvdW50YCBvciBgc3VtYFxuICogMy4gVGhlIHNjYWxlIGlzIHF1YW50aXRhdGl2ZSBvciB0aW1lIHNjYWxlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSk6IHt2YWxpZDogYm9vbGVhbiwgcmVhc29uPzogc3RyaW5nfSB7XG4gIGlmICghZmllbGREZWYuYWdncmVnYXRlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVEb21haW5IYXNOb0VmZmVjdEZvclJhd0ZpZWxkKGZpZWxkRGVmKVxuICAgIH07XG4gIH1cblxuICBpZiAoIVNIQVJFRF9ET01BSU5fT1BfSU5ERVhbZmllbGREZWYuYWdncmVnYXRlXSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluV2l0aE5vblNoYXJlZERvbWFpbk9wKGZpZWxkRGVmLmFnZ3JlZ2F0ZSlcbiAgICB9O1xuICB9XG5cbiAgaWYgKGZpZWxkRGVmLnR5cGUgPT09ICdxdWFudGl0YXRpdmUnKSB7XG4gICAgaWYgKHNjYWxlVHlwZSA9PT0gJ2xvZycpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbGlkOiBmYWxzZSxcbiAgICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZWREb21haW5XaXRoTG9nU2NhbGUoZmllbGREZWYpXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7dmFsaWQ6IHRydWV9O1xufVxuXG4vKipcbiAqIENvbnZlcnRzIGFuIGFycmF5IG9mIGRvbWFpbnMgdG8gYSBzaW5nbGUgVmVnYSBzY2FsZSBkb21haW4uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZURvbWFpbnMoZG9tYWluczogVmdOb25VbmlvbkRvbWFpbltdKTogVmdEb21haW4ge1xuICBjb25zdCB1bmlxdWVEb21haW5zID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBpZ25vcmUgc29ydCBwcm9wZXJ0eSB3aGVuIGNvbXB1dGluZyB0aGUgdW5pcXVlIGRvbWFpbnNcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgIGNvbnN0IHtzb3J0OiBfcywgLi4uZG9tYWluV2l0aG91dFNvcnR9ID0gZG9tYWluO1xuICAgICAgcmV0dXJuIGRvbWFpbldpdGhvdXRTb3J0O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KSwgdXRpbC5oYXNoKTtcblxuICBjb25zdCBzb3J0czogVmdTb3J0RmllbGRbXSA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGQgPT4ge1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZCkpIHtcbiAgICAgIGNvbnN0IHMgPSBkLnNvcnQ7XG4gICAgICBpZiAocyAhPT0gdW5kZWZpbmVkICYmICF1dGlsLmlzQm9vbGVhbihzKSkge1xuICAgICAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgICAgIC8vIGxldCdzIG1ha2Ugc3VyZSB0aGF0IGlmIG9wIGlzIGNvdW50LCB3ZSBkb24ndCB1c2UgYSBmaWVsZFxuICAgICAgICAgIGRlbGV0ZSBzLmZpZWxkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzLm9yZGVyID09PSAnYXNjZW5kaW5nJykge1xuICAgICAgICAgIC8vIGRyb3Agb3JkZXI6IGFzY2VuZGluZyBhcyBpdCBpcyB0aGUgZGVmYXVsdFxuICAgICAgICAgIGRlbGV0ZSBzLm9yZGVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSkuZmlsdGVyKHMgPT4gcyAhPT0gdW5kZWZpbmVkKSwgdXRpbC5oYXNoKTtcblxuICBpZiAodW5pcXVlRG9tYWlucy5sZW5ndGggPT09IDEpIHtcbiAgICBjb25zdCBkb21haW4gPSBkb21haW5zWzBdO1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSAmJiBzb3J0cy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgc29ydCA9IHNvcnRzWzBdO1xuICAgICAgaWYgKHNvcnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuTU9SRV9USEFOX09ORV9TT1JUKTtcbiAgICAgICAgc29ydCA9IHRydWU7XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5kb21haW4sXG4gICAgICAgIHNvcnRcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICAvLyBvbmx5IGtlZXAgc2ltcGxlIHNvcnQgcHJvcGVydGllcyB0aGF0IHdvcmsgd2l0aCB1bmlvbmVkIGRvbWFpbnNcbiAgY29uc3Qgc2ltcGxlU29ydHMgPSB1dGlsLnVuaXF1ZShzb3J0cy5tYXAocyA9PiB7XG4gICAgaWYgKHMgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBpZiAocy5vcCA9PT0gJ2NvdW50Jykge1xuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmRvbWFpblNvcnREcm9wcGVkKHMpKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSksIHV0aWwuaGFzaCkgYXMgVmdVbmlvblNvcnRGaWVsZFtdO1xuXG4gIGxldCBzb3J0OiBWZ1VuaW9uU29ydEZpZWxkID0gdW5kZWZpbmVkO1xuXG4gIGlmIChzaW1wbGVTb3J0cy5sZW5ndGggPT09IDEpIHtcbiAgICBzb3J0ID0gc2ltcGxlU29ydHNbMF07XG4gIH0gZWxzZSBpZiAoc2ltcGxlU29ydHMubGVuZ3RoID4gMSkge1xuICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgc29ydCA9IHRydWU7XG4gIH1cblxuICBjb25zdCBhbGxEYXRhID0gdXRpbC51bmlxdWUoZG9tYWlucy5tYXAoZCA9PiB7XG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkKSkge1xuICAgICAgcmV0dXJuIGQuZGF0YTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH0pLCB4ID0+IHgpO1xuXG4gIGlmIChhbGxEYXRhLmxlbmd0aCA9PT0gMSAmJiBhbGxEYXRhWzBdICE9PSBudWxsKSB7XG4gICAgLy8gY3JlYXRlIGEgdW5pb24gZG9tYWluIG9mIGRpZmZlcmVudCBmaWVsZHMgd2l0aCBhIHNpbmdsZSBkYXRhIHNvdXJjZVxuICAgIGNvbnN0IGRvbWFpbjogVmdGaWVsZFJlZlVuaW9uRG9tYWluID0ge1xuICAgICAgZGF0YTogYWxsRGF0YVswXSxcbiAgICAgIGZpZWxkczogdW5pcXVlRG9tYWlucy5tYXAoZCA9PiAoZCBhcyBWZ0RhdGFSZWYpLmZpZWxkKSxcbiAgICAgIC4uLihzb3J0ID8ge3NvcnR9IDoge30pXG4gICAgfTtcblxuICAgIHJldHVybiBkb21haW47XG4gIH1cblxuICByZXR1cm4ge2ZpZWxkczogdW5pcXVlRG9tYWlucywgLi4uKHNvcnQgPyB7c29ydH0gOiB7fSl9O1xufVxuXG4vKipcbiAqIFJldHVybiBhIGZpZWxkIGlmIGEgc2NhbGUgc2luZ2xlIGZpZWxkLlxuICogUmV0dXJuIGB1bmRlZmluZWRgIG90aGVyd2lzZS5cbiAqXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZEZyb21Eb21haW4oZG9tYWluOiBWZ0RvbWFpbik6IHN0cmluZyB7XG4gIGlmIChpc0RhdGFSZWZEb21haW4oZG9tYWluKSAmJiB1dGlsLmlzU3RyaW5nKGRvbWFpbi5maWVsZCkpIHtcbiAgICByZXR1cm4gZG9tYWluLmZpZWxkO1xuICB9IGVsc2UgaWYgKGlzRGF0YVJlZlVuaW9uZWREb21haW4oZG9tYWluKSkge1xuICAgIGxldCBmaWVsZDtcbiAgICBmb3IgKGNvbnN0IG5vblVuaW9uRG9tYWluIG9mIGRvbWFpbi5maWVsZHMpIHtcbiAgICAgIGlmIChpc0RhdGFSZWZEb21haW4obm9uVW5pb25Eb21haW4pICYmIHV0aWwuaXNTdHJpbmcobm9uVW5pb25Eb21haW4uZmllbGQpKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9IG5vblVuaW9uRG9tYWluLmZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkICE9PSBub25VbmlvbkRvbWFpbi5maWVsZCkge1xuICAgICAgICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzLiAgV2Ugd2lsbCB1c2UgdGhlIGZpcnN0IGZpZWxkLiAgVGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5IGJlIGluY29ycmVjdC4nKTtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIGlkZW50aWNhbCBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgc291cmNlIGRldGVjdGVkLiAgV2Ugd2lsbCBhc3N1bWUgdGhhdCB0aGlzIGlzIHRoZSBzYW1lIGZpZWxkIGZyb20gYSBkaWZmZXJlbnQgZm9yayBvZiB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIEhvd2V2ZXIsIGlmIHRoaXMgaXMgbm90IGNhc2UsIHRoZSByZXN1bHQgdmlldyBzaXplIG1heWJlIGluY29ycmVjdC4nKTtcbiAgICByZXR1cm4gZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZFJlZlVuaW9uRG9tYWluKGRvbWFpbikpIHtcbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgbXVsdGlwbGUgZmllbGRzIGZyb20gdGhlIHNhbWUgZGF0YSBzb3VyY2UuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9tYWluLmZpZWxkc1swXTtcbiAgICByZXR1cm4gdXRpbC5pc1N0cmluZyhmaWVsZCkgPyBmaWVsZCA6IHVuZGVmaW5lZDtcbiAgfVxuXG4gIHJldHVybiB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZURvbWFpbihtb2RlbDogTW9kZWwsIGNoYW5uZWw6IFNjYWxlQ2hhbm5lbCkge1xuICBjb25zdCBzY2FsZUNvbXBvbmVudCA9IG1vZGVsLmNvbXBvbmVudC5zY2FsZXNbY2hhbm5lbF07XG4gIGNvbnN0IGRvbWFpbnMgPSBzY2FsZUNvbXBvbmVudC5kb21haW5zLm1hcChkb21haW4gPT4ge1xuICAgIC8vIENvcnJlY3QgcmVmZXJlbmNlcyB0byBkYXRhIGFzIHRoZSBvcmlnaW5hbCBkb21haW4ncyBkYXRhIHdhcyBkZXRlcm1pbmVkXG4gICAgLy8gaW4gcGFyc2VTY2FsZSwgd2hpY2ggaGFwcGVucyBiZWZvcmUgcGFyc2VEYXRhLiBUaHVzIHRoZSBvcmlnaW5hbCBkYXRhXG4gICAgLy8gcmVmZXJlbmNlIGNhbiBiZSBpbmNvcnJlY3QuXG5cbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgIGRvbWFpbi5kYXRhID0gbW9kZWwubG9va3VwRGF0YVNvdXJjZShkb21haW4uZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiBkb21haW47XG4gIH0pO1xuXG4gIC8vIGRvbWFpbnMgaXMgYW4gYXJyYXkgdGhhdCBoYXMgdG8gYmUgbWVyZ2VkIGludG8gYSBzaW5nbGUgdmVnYSBkb21haW5cbiAgcmV0dXJuIG1lcmdlRG9tYWlucyhkb21haW5zKTtcbn1cbiJdfQ==