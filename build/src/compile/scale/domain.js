"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var aggregate_1 = require("../../aggregate");
var bin_1 = require("../../bin");
var channel_1 = require("../../channel");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var fielddef_1 = require("../../fielddef");
var log = tslib_1.__importStar(require("../../log"));
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var util = tslib_1.__importStar(require("../../util"));
var vega_schema_1 = require("../../vega.schema");
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
                signal: selection_1.SELECTION_DOMAIN + util.hash(specifiedDomain)
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
                    if (vega_schema_1.isDataRefDomain(domain)) {
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
        var field = fieldDef.field;
        return [{
                data: data,
                field: fielddef_1.vgField({ field: field, aggregate: 'min' })
            }, {
                data: data,
                field: fielddef_1.vgField({ field: field, aggregate: 'max' })
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
    var fieldDef = model.fieldDef(channel);
    var sort = fieldDef.sort;
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
        // flatten nested fields
        return tslib_1.__assign({}, sort, (sort.field ? { field: util.replacePathInField(sort.field) } : {}));
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
    if (vega_schema_1.isDataRefDomain(domain) && vega_util_1.isString(domain.field)) {
        return domain.field;
    }
    else if (vega_schema_1.isDataRefUnionedDomain(domain)) {
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
        if (vega_schema_1.isDataRefDomain(domain)) {
            domain.data = model.lookupDataSource(domain.data);
        }
        return domain;
    });
    // domains is an array that has to be merged into a single vega domain
    return mergeDomains(domains);
}
exports.assembleDomain = assembleDomain;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tYWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvc2NhbGUvZG9tYWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUFtQztBQUNuQyw2Q0FBdUQ7QUFDdkQsaUNBQW1EO0FBQ25ELHlDQUEyRDtBQUMzRCxtQ0FBcUM7QUFDckMsMkNBQWtFO0FBQ2xFLDJDQUFnRTtBQUNoRSxxREFBaUM7QUFDakMscUNBQTZHO0FBQzdHLG1DQUF1RTtBQUN2RSx1REFBbUM7QUFDbkMsaURBQThMO0FBQzlMLG9DQUEyQztBQUMzQywrQ0FBc0Q7QUFDdEQsNkNBQW9EO0FBQ3BELGtDQUEwRDtBQUMxRCxvREFBd0Q7QUFLeEQsMEJBQWlDLEtBQVk7SUFDM0MsSUFBSSxtQkFBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzdCO1NBQU07UUFDTCx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNoQztBQUNILENBQUM7QUFORCw0Q0FNQztBQUVELDhCQUE4QixLQUFnQjtJQUM1QyxJQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsZUFBZSxDQUFDO0lBQ3JDLElBQU0sb0JBQW9CLEdBQXdCLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXpFLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQyxPQUFxQjtRQUM1RCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDdkMsSUFBTSxlQUFlLEdBQUcsY0FBYyxDQUFDLENBQUMsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFFM0UsSUFBTSxPQUFPLEdBQUcscUJBQXFCLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3RELElBQU0sY0FBYyxHQUFHLG9CQUFvQixDQUFD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QztRQUMvQixPQUFPLG9CQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO0tBQzVDO0lBRUQsT0FBTyxTQUFTLENBQUM7QUFDbkIsQ0FBQztBQXhCRCxnREF3QkM7QUFFRCx3QkFBK0IsS0FBWSxFQUFFLE9BQXFCO0lBQ2hFLElBQU0sY0FBYyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZELElBQU0sT0FBTyxHQUFHLGNBQWMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUEsTUFBTTtRQUMvQywwRUFBMEU7UUFDMUUsd0VBQXdFO1FBQ3hFLDhCQUE4QjtRQUU5QixJQUFJLDZCQUFlLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDM0IsTUFBTSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsT0FBTyxNQUFNLENBQUM7SUFDaEIsQ0FBQyxDQUFDLENBQUM7SUFFSCxzRUFBc0U7SUFDdEUsT0FBTyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQWZELHdDQWVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1N0cmluZ30gZnJvbSAndmVnYS11dGlsJztcbmltcG9ydCB7U0hBUkVEX0RPTUFJTl9PUF9JTkRFWH0gZnJvbSAnLi4vLi4vYWdncmVnYXRlJztcbmltcG9ydCB7YmluVG9TdHJpbmcsIGlzQmluUGFyYW1zfSBmcm9tICcuLi8uLi9iaW4nO1xuaW1wb3J0IHtpc1NjYWxlQ2hhbm5lbCwgU2NhbGVDaGFubmVsfSBmcm9tICcuLi8uLi9jaGFubmVsJztcbmltcG9ydCB7TUFJTiwgUkFXfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7RGF0ZVRpbWUsIGRhdGVUaW1lRXhwciwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0IHtGaWVsZERlZiwgU2NhbGVGaWVsZERlZiwgdmdGaWVsZH0gZnJvbSAnLi4vLi4vZmllbGRkZWYnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge0RvbWFpbiwgaGFzRGlzY3JldGVEb21haW4sIGlzQmluU2NhbGUsIGlzU2VsZWN0aW9uRG9tYWluLCBTY2FsZUNvbmZpZywgU2NhbGVUeXBlfSBmcm9tICcuLi8uLi9zY2FsZSc7XG5pbXBvcnQge0VuY29kaW5nU29ydEZpZWxkLCBpc1NvcnRBcnJheSwgaXNTb3J0RmllbGR9IGZyb20gJy4uLy4uL3NvcnQnO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7aXNEYXRhUmVmRG9tYWluLCBpc0RhdGFSZWZVbmlvbmVkRG9tYWluLCBpc0ZpZWxkUmVmVW5pb25Eb21haW4sIFZnRGF0YVJlZiwgVmdEb21haW4sIFZnRmllbGRSZWZVbmlvbkRvbWFpbiwgVmdOb25VbmlvbkRvbWFpbiwgVmdTb3J0RmllbGQsIFZnVW5pb25Tb3J0RmllbGR9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7YmluUmVxdWlyZXNSYW5nZX0gZnJvbSAnLi4vY29tbW9uJztcbmltcG9ydCB7c29ydEFycmF5SW5kZXhGaWVsZH0gZnJvbSAnLi4vZGF0YS9jYWxjdWxhdGUnO1xuaW1wb3J0IHtGQUNFVF9TQ0FMRV9QUkVGSVh9IGZyb20gJy4uL2RhdGEvb3B0aW1pemUnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtTRUxFQ1RJT05fRE9NQUlOfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7VW5pdE1vZGVsfSBmcm9tICcuLi91bml0JztcbmltcG9ydCB7U2NhbGVDb21wb25lbnRJbmRleH0gZnJvbSAnLi9jb21wb25lbnQnO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVNjYWxlRG9tYWluKG1vZGVsOiBNb2RlbCkge1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgcGFyc2VVbml0U2NhbGVEb21haW4obW9kZWwpO1xuICB9IGVsc2Uge1xuICAgIHBhcnNlTm9uVW5pdFNjYWxlRG9tYWluKG1vZGVsKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBwYXJzZVVuaXRTY2FsZURvbWFpbihtb2RlbDogVW5pdE1vZGVsKSB7XG4gIGNvbnN0IHNjYWxlcyA9IG1vZGVsLnNwZWNpZmllZFNjYWxlcztcbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgY29uc3Qgc3BlY2lmaWVkU2NhbGUgPSBzY2FsZXNbY2hhbm5lbF07XG4gICAgY29uc3Qgc3BlY2lmaWVkRG9tYWluID0gc3BlY2lmaWVkU2NhbGUgPyBzcGVjaWZpZWRTY2FsZS5kb21haW4gOiB1bmRlZmluZWQ7XG5cbiAgICBjb25zdCBkb21haW5zID0gcGFyc2VEb21haW5Gb3JDaGFubmVsKG1vZGVsLCBjaGFubmVsKTtcbiAgICBjb25zdCBsb2NhbFNjYWxlQ21wdCA9IGxvY2FsU2NhbGVDb21wb25lbnRzW2NoYW5uZWxdO1xuICAgIGxvY2FsU2NhbGVDbXB0LmRvbWFpbnMgPSBkb21haW5zO1xuXG4gICAgaWYgKGlzU2VsZWN0aW9uRG9tYWluKHNwZWNpZmllZERvbWFpbikpIHtcbiAgICAgIC8vIEFzIHNjYWxlIHBhcnNpbmcgb2NjdXJzIGJlZm9yZSBzZWxlY3Rpb24gcGFyc2luZywgd2UgdXNlIGEgdGVtcG9yYXJ5XG4gICAgICAvLyBzaWduYWwgaGVyZSBhbmQgYXBwZW5kIHRoZSBzY2FsZS5kb21haW4gZGVmaW5pdGlvbi4gVGhpcyBpcyByZXBsYWNlZFxuICAgICAgLy8gd2l0aCB0aGUgY29ycmVjdCBkb21haW5SYXcgc2lnbmFsIGR1cmluZyBzY2FsZSBhc3NlbWJseS5cbiAgICAgIC8vIEZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWUgaXNSYXdTZWxlY3Rpb25Eb21haW4gaW4gc2VsZWN0aW9uLnRzLlxuXG4gICAgICAvLyBGSVhNRTogcmVwbGFjZSB0aGlzIHdpdGggYSBzcGVjaWFsIHByb3BlcnR5IGluIHRoZSBzY2FsZUNvbXBvbmVudFxuICAgICAgbG9jYWxTY2FsZUNtcHQuc2V0KCdkb21haW5SYXcnLCB7XG4gICAgICAgIHNpZ25hbDogU0VMRUNUSU9OX0RPTUFJTiArIHV0aWwuaGFzaChzcGVjaWZpZWREb21haW4pXG4gICAgICB9LCB0cnVlKTtcbiAgICB9XG5cbiAgICBpZiAobW9kZWwuY29tcG9uZW50LmRhdGEuaXNGYWNldGVkKSB7XG4gICAgICAvLyBnZXQgcmVzb2x2ZSBmcm9tIGNsb3Nlc3QgZmFjZXQgcGFyZW50IGFzIHRoaXMgZGVjaWRlcyB3aGV0aGVyIHdlIG5lZWQgdG8gcmVmZXIgdG8gY2xvbmVkIHN1YnRyZWUgb3Igbm90XG4gICAgICBsZXQgZmFjZXRQYXJlbnQ6IE1vZGVsID0gbW9kZWw7XG4gICAgICB3aGlsZSAoIWlzRmFjZXRNb2RlbChmYWNldFBhcmVudCkgJiYgZmFjZXRQYXJlbnQucGFyZW50KSB7XG4gICAgICAgIGZhY2V0UGFyZW50ID0gZmFjZXRQYXJlbnQucGFyZW50O1xuICAgICAgfVxuXG4gICAgICBjb25zdCByZXNvbHZlID0gZmFjZXRQYXJlbnQuY29tcG9uZW50LnJlc29sdmUuc2NhbGVbY2hhbm5lbF07XG5cbiAgICAgIGlmIChyZXNvbHZlID09PSAnc2hhcmVkJykge1xuICAgICAgICBmb3IgKGNvbnN0IGRvbWFpbiBvZiBkb21haW5zKSB7XG4gICAgICAgICAgLy8gUmVwbGFjZSB0aGUgc2NhbGUgZG9tYWluIHdpdGggZGF0YSBvdXRwdXQgZnJvbSBhIGNsb25lZCBzdWJ0cmVlIGFmdGVyIHRoZSBmYWNldC5cbiAgICAgICAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikpIHtcbiAgICAgICAgICAgIC8vIHVzZSBkYXRhIGZyb20gY2xvbmVkIHN1YnRyZWUgKHdoaWNoIGlzIHRoZSBzYW1lIGFzIGRhdGEgYnV0IHdpdGggYSBwcmVmaXggYWRkZWQgb25jZSlcbiAgICAgICAgICAgIGRvbWFpbi5kYXRhID0gRkFDRVRfU0NBTEVfUFJFRklYICsgZG9tYWluLmRhdGEucmVwbGFjZShGQUNFVF9TQ0FMRV9QUkVGSVgsICcnKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBwYXJzZU5vblVuaXRTY2FsZURvbWFpbihtb2RlbDogTW9kZWwpIHtcbiAgZm9yIChjb25zdCBjaGlsZCBvZiBtb2RlbC5jaGlsZHJlbikge1xuICAgIHBhcnNlU2NhbGVEb21haW4oY2hpbGQpO1xuICB9XG5cbiAgY29uc3QgbG9jYWxTY2FsZUNvbXBvbmVudHM6IFNjYWxlQ29tcG9uZW50SW5kZXggPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzO1xuXG4gIHV0aWwua2V5cyhsb2NhbFNjYWxlQ29tcG9uZW50cykuZm9yRWFjaCgoY2hhbm5lbDogU2NhbGVDaGFubmVsKSA9PiB7XG4gICAgbGV0IGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXTtcbiAgICBsZXQgZG9tYWluUmF3ID0gbnVsbDtcblxuICAgIGZvciAoY29uc3QgY2hpbGQgb2YgbW9kZWwuY2hpbGRyZW4pIHtcbiAgICAgIGNvbnN0IGNoaWxkQ29tcG9uZW50ID0gY2hpbGQuY29tcG9uZW50LnNjYWxlc1tjaGFubmVsXTtcbiAgICAgIGlmIChjaGlsZENvbXBvbmVudCkge1xuICAgICAgICBpZiAoZG9tYWlucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgZG9tYWlucyA9IGNoaWxkQ29tcG9uZW50LmRvbWFpbnM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9tYWlucyA9IGRvbWFpbnMuY29uY2F0KGNoaWxkQ29tcG9uZW50LmRvbWFpbnMpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgZHIgPSBjaGlsZENvbXBvbmVudC5nZXQoJ2RvbWFpblJhdycpO1xuICAgICAgICBpZiAoZG9tYWluUmF3ICYmIGRyICYmIGRvbWFpblJhdy5zaWduYWwgIT09IGRyLnNpZ25hbCkge1xuICAgICAgICAgIGxvZy53YXJuKCdUaGUgc2FtZSBzZWxlY3Rpb24gbXVzdCBiZSB1c2VkIHRvIG92ZXJyaWRlIHNjYWxlIGRvbWFpbnMgaW4gYSBsYXllcmVkIHZpZXcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgZG9tYWluUmF3ID0gZHI7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbG9jYWxTY2FsZUNvbXBvbmVudHNbY2hhbm5lbF0uZG9tYWlucyA9IGRvbWFpbnM7XG5cbiAgICBpZiAoZG9tYWluUmF3KSB7XG4gICAgICBsb2NhbFNjYWxlQ29tcG9uZW50c1tjaGFubmVsXS5zZXQoJ2RvbWFpblJhdycsIGRvbWFpblJhdywgdHJ1ZSk7XG4gICAgfVxuICB9KTtcbn1cblxuXG4vKipcbiAqIFJlbW92ZSB1bmFnZ3JlZ2F0ZWQgZG9tYWluIGlmIGl0IGlzIG5vdCBhcHBsaWNhYmxlXG4gKiBBZGQgdW5hZ2dyZWdhdGVkIGRvbWFpbiBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZCBhbmQgY29uZmlnLnNjYWxlLnVzZVVuYWdncmVnYXRlZERvbWFpbiBpcyB0cnVlLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemVVbmFnZ3JlZ2F0ZWREb21haW4oZG9tYWluOiBEb21haW4sIGZpZWxkRGVmOiBGaWVsZERlZjxzdHJpbmc+LCBzY2FsZVR5cGU6IFNjYWxlVHlwZSwgc2NhbGVDb25maWc6IFNjYWxlQ29uZmlnKSB7XG4gIGlmIChkb21haW4gPT09ICd1bmFnZ3JlZ2F0ZWQnKSB7XG4gICAgY29uc3Qge3ZhbGlkLCByZWFzb259ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmKCF2YWxpZCkge1xuICAgICAgbG9nLndhcm4ocmVhc29uKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICB9IGVsc2UgaWYgKGRvbWFpbiA9PT0gdW5kZWZpbmVkICYmIHNjYWxlQ29uZmlnLnVzZVVuYWdncmVnYXRlZERvbWFpbikge1xuICAgIC8vIEFwcGx5IGNvbmZpZyBpZiBkb21haW4gaXMgbm90IHNwZWNpZmllZC5cbiAgICBjb25zdCB7dmFsaWR9ID0gY2FuVXNlVW5hZ2dyZWdhdGVkRG9tYWluKGZpZWxkRGVmLCBzY2FsZVR5cGUpO1xuICAgIGlmICh2YWxpZCkge1xuICAgICAgcmV0dXJuICd1bmFnZ3JlZ2F0ZWQnO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkb21haW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURvbWFpbkZvckNoYW5uZWwobW9kZWw6IFVuaXRNb2RlbCwgY2hhbm5lbDogU2NhbGVDaGFubmVsKTogVmdOb25VbmlvbkRvbWFpbltdIHtcbiAgY29uc3Qgc2NhbGVUeXBlID0gbW9kZWwuZ2V0U2NhbGVDb21wb25lbnQoY2hhbm5lbCkuZ2V0KCd0eXBlJyk7XG5cbiAgY29uc3QgZG9tYWluID0gbm9ybWFsaXplVW5hZ2dyZWdhdGVkRG9tYWluKG1vZGVsLnNjYWxlRG9tYWluKGNoYW5uZWwpLCBtb2RlbC5maWVsZERlZihjaGFubmVsKSwgc2NhbGVUeXBlLCBtb2RlbC5jb25maWcuc2NhbGUpO1xuICBpZiAoZG9tYWluICE9PSBtb2RlbC5zY2FsZURvbWFpbihjaGFubmVsKSkge1xuICAgIG1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSA9IHtcbiAgICAgIC4uLm1vZGVsLnNwZWNpZmllZFNjYWxlc1tjaGFubmVsXSxcbiAgICAgIGRvbWFpblxuICAgIH07XG4gIH1cblxuICAvLyBJZiBjaGFubmVsIGlzIGVpdGhlciBYIG9yIFkgdGhlbiB1bmlvbiB0aGVtIHdpdGggWDIgJiBZMiBpZiB0aGV5IGV4aXN0XG4gIGlmIChjaGFubmVsID09PSAneCcgJiYgbW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd4MicpKSB7XG4gICAgaWYgKG1vZGVsLmNoYW5uZWxIYXNGaWVsZCgneCcpKSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gnKS5jb25jYXQocGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJykpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyc2VTaW5nbGVDaGFubmVsRG9tYWluKHNjYWxlVHlwZSwgZG9tYWluLCBtb2RlbCwgJ3gyJyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGNoYW5uZWwgPT09ICd5JyAmJiBtb2RlbC5jaGFubmVsSGFzRmllbGQoJ3kyJykpIHtcbiAgICBpZiAobW9kZWwuY2hhbm5lbEhhc0ZpZWxkKCd5JykpIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneScpLmNvbmNhdChwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlLCBkb21haW4sIG1vZGVsLCAneTInKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBhcnNlU2luZ2xlQ2hhbm5lbERvbWFpbihzY2FsZVR5cGUsIGRvbWFpbiwgbW9kZWwsIGNoYW5uZWwpO1xufVxuXG5mdW5jdGlvbiBwYXJzZVNpbmdsZUNoYW5uZWxEb21haW4oc2NhbGVUeXBlOiBTY2FsZVR5cGUsIGRvbWFpbjogRG9tYWluLCBtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwgfCAneDInIHwgJ3kyJyk6IFZnTm9uVW5pb25Eb21haW5bXSB7XG4gIGNvbnN0IGZpZWxkRGVmID0gbW9kZWwuZmllbGREZWYoY2hhbm5lbCk7XG5cbiAgaWYgKGRvbWFpbiAmJiBkb21haW4gIT09ICd1bmFnZ3JlZ2F0ZWQnICYmICFpc1NlbGVjdGlvbkRvbWFpbihkb21haW4pKSB7IC8vIGV4cGxpY2l0IHZhbHVlXG4gICAgaWYgKGlzRGF0ZVRpbWUoZG9tYWluWzBdKSkge1xuICAgICAgcmV0dXJuIChkb21haW4gYXMgRGF0ZVRpbWVbXSkubWFwKChkdCkgPT4ge1xuICAgICAgICByZXR1cm4ge3NpZ25hbDogYHtkYXRhOiAke2RhdGVUaW1lRXhwcihkdCwgdHJ1ZSl9fWB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBbZG9tYWluXTtcbiAgfVxuXG4gIGNvbnN0IHN0YWNrID0gbW9kZWwuc3RhY2s7XG4gIGlmIChzdGFjayAmJiBjaGFubmVsID09PSBzdGFjay5maWVsZENoYW5uZWwpIHtcbiAgICBpZihzdGFjay5vZmZzZXQgPT09ICdub3JtYWxpemUnKSB7XG4gICAgICByZXR1cm4gW1swLCAxXV07XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKTtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGEsXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7c3VmZml4OiAnc3RhcnQnfSlcbiAgICB9LCB7XG4gICAgICBkYXRhLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwge3N1ZmZpeDogJ2VuZCd9KVxuICAgIH1dO1xuICB9XG5cbiAgY29uc3Qgc29ydCA9IGlzU2NhbGVDaGFubmVsKGNoYW5uZWwpID8gZG9tYWluU29ydChtb2RlbCwgY2hhbm5lbCwgc2NhbGVUeXBlKSA6IHVuZGVmaW5lZDtcblxuICBpZiAoZG9tYWluID09PSAndW5hZ2dyZWdhdGVkJykge1xuICAgIGNvbnN0IGRhdGEgPSBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTik7XG4gICAgY29uc3Qge2ZpZWxkfSA9IGZpZWxkRGVmO1xuICAgIHJldHVybiBbe1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiB2Z0ZpZWxkKHtmaWVsZCwgYWdncmVnYXRlOiAnbWluJ30pXG4gICAgfSwge1xuICAgICAgZGF0YSxcbiAgICAgIGZpZWxkOiB2Z0ZpZWxkKHtmaWVsZCwgYWdncmVnYXRlOiAnbWF4J30pXG4gICAgfV07XG4gIH0gZWxzZSBpZiAoZmllbGREZWYuYmluKSB7IC8vIGJpblxuICAgIGlmIChpc0JpblNjYWxlKHNjYWxlVHlwZSkpIHtcbiAgICAgIGNvbnN0IHNpZ25hbCA9IG1vZGVsLmdldE5hbWUoYCR7YmluVG9TdHJpbmcoZmllbGREZWYuYmluKX1fJHtmaWVsZERlZi5maWVsZH1fYmluc2ApO1xuICAgICAgcmV0dXJuIFt7c2lnbmFsOiBgc2VxdWVuY2UoJHtzaWduYWx9LnN0YXJ0LCAke3NpZ25hbH0uc3RvcCArICR7c2lnbmFsfS5zdGVwLCAke3NpZ25hbH0uc3RlcClgfV07XG4gICAgfVxuXG4gICAgaWYgKGhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICAgIC8vIG9yZGluYWwgYmluIHNjYWxlIHRha2VzIGRvbWFpbiBmcm9tIGJpbl9yYW5nZSwgb3JkZXJlZCBieSBiaW4gc3RhcnRcbiAgICAgIC8vIFRoaXMgaXMgdXNlZnVsIGZvciBib3RoIGF4aXMtYmFzZWQgc2NhbGUgKHgveSkgYW5kIGxlZ2VuZC1iYXNlZCBzY2FsZSAob3RoZXIgY2hhbm5lbHMpLlxuICAgICAgcmV0dXJuIFt7XG4gICAgICAgIC8vIElmIHNvcnQgYnkgYWdncmVnYXRpb24gb2YgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCwgd2UgbmVlZCB0byB1c2UgUkFXIHRhYmxlLFxuICAgICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgICAgZGF0YTogdXRpbC5pc0Jvb2xlYW4oc29ydCkgPyBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoTUFJTikgOiBtb2RlbC5yZXF1ZXN0RGF0YU5hbWUoUkFXKSxcbiAgICAgICAgLy8gVXNlIHJhbmdlIGlmIHdlIGFkZGVkIGl0IGFuZCB0aGUgc2NhbGUgZG9lcyBub3Qgc3VwcG9ydCBjb21wdXRpbmcgYSByYW5nZSBhcyBhIHNpZ25hbC5cbiAgICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCwgYmluUmVxdWlyZXNSYW5nZShmaWVsZERlZiwgY2hhbm5lbCkgPyB7YmluU3VmZml4OiAncmFuZ2UnfSA6IHt9KSxcbiAgICAgICAgLy8gd2UgaGF2ZSB0byB1c2UgYSBzb3J0IG9iamVjdCBpZiBzb3J0ID0gdHJ1ZSB0byBtYWtlIHRoZSBzb3J0IGNvcnJlY3QgYnkgYmluIHN0YXJ0XG4gICAgICAgIHNvcnQ6IHNvcnQgPT09IHRydWUgfHwgIWlzU29ydEZpZWxkKHNvcnQpID8ge1xuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KSxcbiAgICAgICAgICBvcDogJ21pbicgLy8gbWluIG9yIG1heCBkb2Vzbid0IG1hdHRlciBzaW5jZSB3ZSBzb3J0IGJ5IHRoZSBzdGFydCBvZiB0aGUgYmluIHJhbmdlXG4gICAgICAgIH0gOiBzb3J0XG4gICAgICB9XTtcbiAgICB9IGVsc2UgeyAvLyBjb250aW51b3VzIHNjYWxlc1xuICAgICAgaWYgKGNoYW5uZWwgPT09ICd4JyB8fCBjaGFubmVsID09PSAneScpIHtcbiAgICAgICAgaWYgKGlzQmluUGFyYW1zKGZpZWxkRGVmLmJpbikgJiYgZmllbGREZWYuYmluLmV4dGVudCkge1xuICAgICAgICAgIHJldHVybiBbZmllbGREZWYuYmluLmV4dGVudF07XG4gICAgICAgIH1cbiAgICAgICAgLy8gWC9ZIHBvc2l0aW9uIGhhdmUgdG8gaW5jbHVkZSBzdGFydCBhbmQgZW5kIGZvciBub24tb3JkaW5hbCBzY2FsZVxuICAgICAgICBjb25zdCBkYXRhID0gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pO1xuICAgICAgICByZXR1cm4gW3tcbiAgICAgICAgICBkYXRhLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9LCB7XG4gICAgICAgICAgZGF0YSxcbiAgICAgICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsLCB7YmluU3VmZml4OiAnZW5kJ30pXG4gICAgICAgIH1dO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVE9ETzogdXNlIGJpbl9taWRcbiAgICAgICAgcmV0dXJuIFt7XG4gICAgICAgICAgZGF0YTogbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pLFxuICAgICAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwsIHt9KVxuICAgICAgICB9XTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSBpZiAoc29ydCkge1xuICAgIHJldHVybiBbe1xuICAgICAgLy8gSWYgc29ydCBieSBhZ2dyZWdhdGlvbiBvZiBhIHNwZWNpZmllZCBzb3J0IGZpZWxkLCB3ZSBuZWVkIHRvIHVzZSBSQVcgdGFibGUsXG4gICAgICAvLyBzbyB3ZSBjYW4gYWdncmVnYXRlIHZhbHVlcyBmb3IgdGhlIHNjYWxlIGluZGVwZW5kZW50bHkgZnJvbSB0aGUgbWFpbiBhZ2dyZWdhdGlvbi5cbiAgICAgIGRhdGE6IHV0aWwuaXNCb29sZWFuKHNvcnQpID8gbW9kZWwucmVxdWVzdERhdGFOYW1lKE1BSU4pIDogbW9kZWwucmVxdWVzdERhdGFOYW1lKFJBVyksXG4gICAgICBmaWVsZDogbW9kZWwudmdGaWVsZChjaGFubmVsKSxcbiAgICAgIHNvcnQ6IHNvcnRcbiAgICB9XTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gW3tcbiAgICAgIGRhdGE6IG1vZGVsLnJlcXVlc3REYXRhTmFtZShNQUlOKSxcbiAgICAgIGZpZWxkOiBtb2RlbC52Z0ZpZWxkKGNoYW5uZWwpXG4gICAgfV07XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZG9tYWluU29ydChtb2RlbDogVW5pdE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwsIHNjYWxlVHlwZTogU2NhbGVUeXBlKTogdHJ1ZSB8IEVuY29kaW5nU29ydEZpZWxkPHN0cmluZz4ge1xuICBpZiAoIWhhc0Rpc2NyZXRlRG9tYWluKHNjYWxlVHlwZSkpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgY29uc3QgZmllbGREZWY6IFNjYWxlRmllbGREZWY8c3RyaW5nPiA9IG1vZGVsLmZpZWxkRGVmKGNoYW5uZWwpO1xuICBjb25zdCBzb3J0ID0gZmllbGREZWYuc29ydDtcblxuICAvLyBpZiB0aGUgc29ydCBpcyBzcGVjaWZpZWQgd2l0aCBhcnJheSwgdXNlIHRoZSBkZXJpdmVkIHNvcnQgaW5kZXggZmllbGRcbiAgaWYgKGlzU29ydEFycmF5KHNvcnQpKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG9wOiAnbWluJyxcbiAgICAgIGZpZWxkOiBzb3J0QXJyYXlJbmRleEZpZWxkKG1vZGVsLCBjaGFubmVsKSxcbiAgICAgIG9yZGVyOiAnYXNjZW5kaW5nJ1xuICAgIH07XG4gIH1cblxuICAvLyBTb3J0ZWQgYmFzZWQgb24gYW4gYWdncmVnYXRlIGNhbGN1bGF0aW9uIG92ZXIgYSBzcGVjaWZpZWQgc29ydCBmaWVsZCAob25seSBmb3Igb3JkaW5hbCBzY2FsZSlcbiAgaWYgKGlzU29ydEZpZWxkKHNvcnQpKSB7XG4gICAgLy8gZmxhdHRlbiBuZXN0ZWQgZmllbGRzXG4gICAgcmV0dXJuIHtcbiAgICAgIC4uLnNvcnQsXG4gICAgICAuLi4oc29ydC5maWVsZCA/IHtmaWVsZDogdXRpbC5yZXBsYWNlUGF0aEluRmllbGQoc29ydC5maWVsZCl9IDoge30pXG4gICAgfTtcbiAgfVxuXG4gIGlmIChzb3J0ID09PSAnZGVzY2VuZGluZycpIHtcbiAgICByZXR1cm4ge1xuICAgICAgb3A6ICdtaW4nLFxuICAgICAgZmllbGQ6IG1vZGVsLnZnRmllbGQoY2hhbm5lbCksXG4gICAgICBvcmRlcjogJ2Rlc2NlbmRpbmcnXG4gICAgfTtcbiAgfVxuXG4gIGlmICh1dGlsLmNvbnRhaW5zKFsnYXNjZW5kaW5nJywgdW5kZWZpbmVkIC8qIGRlZmF1bHQgPWFzY2VuZGluZyovXSwgc29ydCkpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIC8vIHNvcnQgPT0gbnVsbFxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgYSBzY2FsZSBjYW4gdXNlIHVuYWdncmVnYXRlZCBkb21haW4uXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIHRydWUgaWYgYWxsIG9mIHRoZSBmb2xsb3dpbmcgY29uZGl0b25zIGFwcGxpZXM6XG4gKiAxLiBgc2NhbGUuZG9tYWluYCBpcyBgdW5hZ2dyZWdhdGVkYFxuICogMi4gQWdncmVnYXRpb24gZnVuY3Rpb24gaXMgbm90IGBjb3VudGAgb3IgYHN1bWBcbiAqIDMuIFRoZSBzY2FsZSBpcyBxdWFudGl0YXRpdmUgb3IgdGltZSBzY2FsZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblVzZVVuYWdncmVnYXRlZERvbWFpbihmaWVsZERlZjogRmllbGREZWY8c3RyaW5nPiwgc2NhbGVUeXBlOiBTY2FsZVR5cGUpOiB7dmFsaWQ6IGJvb2xlYW4sIHJlYXNvbj86IHN0cmluZ30ge1xuICBpZiAoIWZpZWxkRGVmLmFnZ3JlZ2F0ZSkge1xuICAgIHJldHVybiB7XG4gICAgICB2YWxpZDogZmFsc2UsXG4gICAgICByZWFzb246IGxvZy5tZXNzYWdlLnVuYWdncmVnYXRlRG9tYWluSGFzTm9FZmZlY3RGb3JSYXdGaWVsZChmaWVsZERlZilcbiAgICB9O1xuICB9XG5cbiAgaWYgKCFTSEFSRURfRE9NQUlOX09QX0lOREVYW2ZpZWxkRGVmLmFnZ3JlZ2F0ZV0pIHtcbiAgICByZXR1cm4ge1xuICAgICAgdmFsaWQ6IGZhbHNlLFxuICAgICAgcmVhc29uOiBsb2cubWVzc2FnZS51bmFnZ3JlZ2F0ZURvbWFpbldpdGhOb25TaGFyZWREb21haW5PcChmaWVsZERlZi5hZ2dyZWdhdGUpXG4gICAgfTtcbiAgfVxuXG4gIGlmIChmaWVsZERlZi50eXBlID09PSAncXVhbnRpdGF0aXZlJykge1xuICAgIGlmIChzY2FsZVR5cGUgPT09ICdsb2cnKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB2YWxpZDogZmFsc2UsXG4gICAgICAgIHJlYXNvbjogbG9nLm1lc3NhZ2UudW5hZ2dyZWdhdGVkRG9tYWluV2l0aExvZ1NjYWxlKGZpZWxkRGVmKVxuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge3ZhbGlkOiB0cnVlfTtcbn1cblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBhcnJheSBvZiBkb21haW5zIHRvIGEgc2luZ2xlIFZlZ2Egc2NhbGUgZG9tYWluLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2VEb21haW5zKGRvbWFpbnM6IFZnTm9uVW5pb25Eb21haW5bXSk6IFZnRG9tYWluIHtcbiAgY29uc3QgdW5pcXVlRG9tYWlucyA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGRvbWFpbiA9PiB7XG4gICAgLy8gaWdub3JlIHNvcnQgcHJvcGVydHkgd2hlbiBjb21wdXRpbmcgdGhlIHVuaXF1ZSBkb21haW5zXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBjb25zdCB7c29ydDogX3MsIC4uLmRvbWFpbldpdGhvdXRTb3J0fSA9IGRvbWFpbjtcbiAgICAgIHJldHVybiBkb21haW5XaXRob3V0U29ydDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbWFpbjtcbiAgfSksIHV0aWwuaGFzaCk7XG5cbiAgY29uc3Qgc29ydHM6IFZnU29ydEZpZWxkW10gPSB1dGlsLnVuaXF1ZShkb21haW5zLm1hcChkID0+IHtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGQpKSB7XG4gICAgICBjb25zdCBzID0gZC5zb3J0O1xuICAgICAgaWYgKHMgIT09IHVuZGVmaW5lZCAmJiAhdXRpbC5pc0Jvb2xlYW4ocykpIHtcbiAgICAgICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgICAgICAvLyBsZXQncyBtYWtlIHN1cmUgdGhhdCBpZiBvcCBpcyBjb3VudCwgd2UgZG9uJ3QgdXNlIGEgZmllbGRcbiAgICAgICAgICBkZWxldGUgcy5maWVsZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAocy5vcmRlciA9PT0gJ2FzY2VuZGluZycpIHtcbiAgICAgICAgICAvLyBkcm9wIG9yZGVyOiBhc2NlbmRpbmcgYXMgaXQgaXMgdGhlIGRlZmF1bHRcbiAgICAgICAgICBkZWxldGUgcy5vcmRlcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHM7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pLmZpbHRlcihzID0+IHMgIT09IHVuZGVmaW5lZCksIHV0aWwuaGFzaCk7XG5cbiAgaWYgKHVuaXF1ZURvbWFpbnMubGVuZ3RoID09PSAxKSB7XG4gICAgY29uc3QgZG9tYWluID0gZG9tYWluc1swXTtcbiAgICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgc29ydHMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IHNvcnQgPSBzb3J0c1swXTtcbiAgICAgIGlmIChzb3J0cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLk1PUkVfVEhBTl9PTkVfU09SVCk7XG4gICAgICAgIHNvcnQgPSB0cnVlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZG9tYWluLFxuICAgICAgICBzb3J0XG4gICAgICB9O1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgLy8gb25seSBrZWVwIHNpbXBsZSBzb3J0IHByb3BlcnRpZXMgdGhhdCB3b3JrIHdpdGggdW5pb25lZCBkb21haW5zXG4gIGNvbnN0IHNpbXBsZVNvcnRzID0gdXRpbC51bmlxdWUoc29ydHMubWFwKHMgPT4ge1xuICAgIGlmIChzID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gcztcbiAgICB9XG4gICAgaWYgKHMub3AgPT09ICdjb3VudCcpIHtcbiAgICAgIHJldHVybiBzO1xuICAgIH1cbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5kb21haW5Tb3J0RHJvcHBlZChzKSk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0pLCB1dGlsLmhhc2gpIGFzIFZnVW5pb25Tb3J0RmllbGRbXTtcblxuICBsZXQgc29ydDogVmdVbmlvblNvcnRGaWVsZCA9IHVuZGVmaW5lZDtcblxuICBpZiAoc2ltcGxlU29ydHMubGVuZ3RoID09PSAxKSB7XG4gICAgc29ydCA9IHNpbXBsZVNvcnRzWzBdO1xuICB9IGVsc2UgaWYgKHNpbXBsZVNvcnRzLmxlbmd0aCA+IDEpIHtcbiAgICBsb2cud2Fybihsb2cubWVzc2FnZS5NT1JFX1RIQU5fT05FX1NPUlQpO1xuICAgIHNvcnQgPSB0cnVlO1xuICB9XG5cbiAgY29uc3QgYWxsRGF0YSA9IHV0aWwudW5pcXVlKGRvbWFpbnMubWFwKGQgPT4ge1xuICAgIGlmIChpc0RhdGFSZWZEb21haW4oZCkpIHtcbiAgICAgIHJldHVybiBkLmRhdGE7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9KSwgeCA9PiB4KTtcblxuICBpZiAoYWxsRGF0YS5sZW5ndGggPT09IDEgJiYgYWxsRGF0YVswXSAhPT0gbnVsbCkge1xuICAgIC8vIGNyZWF0ZSBhIHVuaW9uIGRvbWFpbiBvZiBkaWZmZXJlbnQgZmllbGRzIHdpdGggYSBzaW5nbGUgZGF0YSBzb3VyY2VcbiAgICBjb25zdCBkb21haW46IFZnRmllbGRSZWZVbmlvbkRvbWFpbiA9IHtcbiAgICAgIGRhdGE6IGFsbERhdGFbMF0sXG4gICAgICBmaWVsZHM6IHVuaXF1ZURvbWFpbnMubWFwKGQgPT4gKGQgYXMgVmdEYXRhUmVmKS5maWVsZCksXG4gICAgICAuLi4oc29ydCA/IHtzb3J0fSA6IHt9KVxuICAgIH07XG5cbiAgICByZXR1cm4gZG9tYWluO1xuICB9XG5cbiAgcmV0dXJuIHtmaWVsZHM6IHVuaXF1ZURvbWFpbnMsIC4uLihzb3J0ID8ge3NvcnR9IDoge30pfTtcbn1cblxuLyoqXG4gKiBSZXR1cm4gYSBmaWVsZCBpZiBhIHNjYWxlIHNpbmdsZSBmaWVsZC5cbiAqIFJldHVybiBgdW5kZWZpbmVkYCBvdGhlcndpc2UuXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmllbGRGcm9tRG9tYWluKGRvbWFpbjogVmdEb21haW4pOiBzdHJpbmcge1xuICBpZiAoaXNEYXRhUmVmRG9tYWluKGRvbWFpbikgJiYgaXNTdHJpbmcoZG9tYWluLmZpZWxkKSkge1xuICAgIHJldHVybiBkb21haW4uZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNEYXRhUmVmVW5pb25lZERvbWFpbihkb21haW4pKSB7XG4gICAgbGV0IGZpZWxkO1xuICAgIGZvciAoY29uc3Qgbm9uVW5pb25Eb21haW4gb2YgZG9tYWluLmZpZWxkcykge1xuICAgICAgaWYgKGlzRGF0YVJlZkRvbWFpbihub25VbmlvbkRvbWFpbikgJiYgaXNTdHJpbmcobm9uVW5pb25Eb21haW4uZmllbGQpKSB7XG4gICAgICAgIGlmICghZmllbGQpIHtcbiAgICAgICAgICBmaWVsZCA9IG5vblVuaW9uRG9tYWluLmZpZWxkO1xuICAgICAgICB9IGVsc2UgaWYgKGZpZWxkICE9PSBub25VbmlvbkRvbWFpbi5maWVsZCkge1xuICAgICAgICAgIGxvZy53YXJuKCdEZXRlY3RlZCBmYWNldGVkIGluZGVwZW5kZW50IHNjYWxlcyB0aGF0IHVuaW9uIGRvbWFpbiBvZiBtdWx0aXBsZSBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgZGF0YSBzb3VyY2VzLiAgV2Ugd2lsbCB1c2UgdGhlIGZpcnN0IGZpZWxkLiAgVGhlIHJlc3VsdCB2aWV3IHNpemUgbWF5IGJlIGluY29ycmVjdC4nKTtcbiAgICAgICAgICByZXR1cm4gZmllbGQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgbG9nLndhcm4oJ0RldGVjdGVkIGZhY2V0ZWQgaW5kZXBlbmRlbnQgc2NhbGVzIHRoYXQgdW5pb24gZG9tYWluIG9mIGlkZW50aWNhbCBmaWVsZHMgZnJvbSBkaWZmZXJlbnQgc291cmNlIGRldGVjdGVkLiAgV2Ugd2lsbCBhc3N1bWUgdGhhdCB0aGlzIGlzIHRoZSBzYW1lIGZpZWxkIGZyb20gYSBkaWZmZXJlbnQgZm9yayBvZiB0aGUgc2FtZSBkYXRhIHNvdXJjZS4gIEhvd2V2ZXIsIGlmIHRoaXMgaXMgbm90IGNhc2UsIHRoZSByZXN1bHQgdmlldyBzaXplIG1heWJlIGluY29ycmVjdC4nKTtcbiAgICByZXR1cm4gZmllbGQ7XG4gIH0gZWxzZSBpZiAoaXNGaWVsZFJlZlVuaW9uRG9tYWluKGRvbWFpbikpIHtcbiAgICBsb2cud2FybignRGV0ZWN0ZWQgZmFjZXRlZCBpbmRlcGVuZGVudCBzY2FsZXMgdGhhdCB1bmlvbiBkb21haW4gb2YgbXVsdGlwbGUgZmllbGRzIGZyb20gdGhlIHNhbWUgZGF0YSBzb3VyY2UuICBXZSB3aWxsIHVzZSB0aGUgZmlyc3QgZmllbGQuICBUaGUgcmVzdWx0IHZpZXcgc2l6ZSBtYXkgYmUgaW5jb3JyZWN0LicpO1xuICAgIGNvbnN0IGZpZWxkID0gZG9tYWluLmZpZWxkc1swXTtcbiAgICByZXR1cm4gaXNTdHJpbmcoZmllbGQpID8gZmllbGQgOiB1bmRlZmluZWQ7XG4gIH1cblxuICByZXR1cm4gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVEb21haW4obW9kZWw6IE1vZGVsLCBjaGFubmVsOiBTY2FsZUNoYW5uZWwpIHtcbiAgY29uc3Qgc2NhbGVDb21wb25lbnQgPSBtb2RlbC5jb21wb25lbnQuc2NhbGVzW2NoYW5uZWxdO1xuICBjb25zdCBkb21haW5zID0gc2NhbGVDb21wb25lbnQuZG9tYWlucy5tYXAoZG9tYWluID0+IHtcbiAgICAvLyBDb3JyZWN0IHJlZmVyZW5jZXMgdG8gZGF0YSBhcyB0aGUgb3JpZ2luYWwgZG9tYWluJ3MgZGF0YSB3YXMgZGV0ZXJtaW5lZFxuICAgIC8vIGluIHBhcnNlU2NhbGUsIHdoaWNoIGhhcHBlbnMgYmVmb3JlIHBhcnNlRGF0YS4gVGh1cyB0aGUgb3JpZ2luYWwgZGF0YVxuICAgIC8vIHJlZmVyZW5jZSBjYW4gYmUgaW5jb3JyZWN0LlxuXG4gICAgaWYgKGlzRGF0YVJlZkRvbWFpbihkb21haW4pKSB7XG4gICAgICBkb21haW4uZGF0YSA9IG1vZGVsLmxvb2t1cERhdGFTb3VyY2UoZG9tYWluLmRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gZG9tYWluO1xuICB9KTtcblxuICAvLyBkb21haW5zIGlzIGFuIGFycmF5IHRoYXQgaGFzIHRvIGJlIG1lcmdlZCBpbnRvIGEgc2luZ2xlIHZlZ2EgZG9tYWluXG4gIHJldHVybiBtZXJnZURvbWFpbnMoZG9tYWlucyk7XG59XG4iXX0=