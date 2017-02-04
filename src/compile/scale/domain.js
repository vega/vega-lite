"use strict";
var log = require("../../log");
var aggregate_1 = require("../../aggregate");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var scale_1 = require("../../scale");
var sort_1 = require("../../sort");
var vega_schema_1 = require("../../vega.schema");
var util = require("../../util");
function domain(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    if (scale.domain) {
        if (datetime_1.isDateTime(scale.domain[0])) {
            return scale.domain.map(function (dt) {
                return datetime_1.timestamp(dt, true);
            });
        }
        return scale.domain;
    }
    // special case for temporal scale
    if (fieldDef.type === 'temporal') {
        return {
            data: model.dataTable(),
            field: model.field(channel),
            sort: {
                field: model.field(channel),
                op: 'min'
            }
        };
    }
    // For stack, use STACKED data.
    var stack = model.stack();
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
    // FIXME refactor _useRawDomain's signature
    var useRawDomain = _useRawDomain(scale, model, channel);
    var sort = domainSort(model, channel, scale.type);
    if (useRawDomain) {
        return {
            data: data_1.SOURCE,
            field: model.field(channel, {
                // no aggregate rather than nofn as bin and timeUnit is fine
                noAggregate: true
            })
        };
    }
    else if (fieldDef.bin) {
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = domain;
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
 * Determine if useRawDomain should be activated for this scale.
 * @return {Boolean} Returns true if all of the following conditons applies:
 * 1. `useRawDomain` is enabled either through scale or config
 * 2. Aggregation function is not `count` or `sum`
 * 3. The scale is quantitative or time scale.
 */
function _useRawDomain(scale, model, channel) {
    var fieldDef = model.fieldDef(channel);
    return scale.useRawDomain &&
        // only applied to aggregate table
        fieldDef.aggregate &&
        // only activated if used with aggregate functions that produces values ranging in the domain of the source data
        aggregate_1.SHARED_DOMAIN_OPS.indexOf(fieldDef.aggregate) >= 0 &&
        (
        // Q always uses quantitative scale except when it's binned.
        // Binned field has similar values in both the source table and the summary table
        // but the summary table has fewer values, therefore binned fields draw
        // domain values from the summary table.
        // Meanwhile, we rely on non-positive filter inside summary data source, thus
        // we can't use raw domain to feed into log scale
        // FIXME(https://github.com/vega/vega-lite/issues/1537):
        // consider allowing useRawDomain for log scale once we reimplement data sources
        (fieldDef.type === 'quantitative' && !fieldDef.bin && scale.type !== scale_1.ScaleType.LOG) ||
            // T uses non-ordinal scale when there's no unit or when the unit is not ordinal.
            (fieldDef.type === 'temporal' && util.contains([scale_1.ScaleType.TIME, scale_1.ScaleType.UTC], scale.type)));
}
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
//# sourceMappingURL=domain.js.map