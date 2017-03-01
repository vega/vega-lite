"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var fielddef_1 = require("../../fielddef");
var util_1 = require("../../util");
var summary;
(function (summary) {
    function addDimension(dims, fieldDef) {
        if (fieldDef.bin) {
            dims[fielddef_1.field(fieldDef, { binSuffix: 'start' })] = true;
            dims[fielddef_1.field(fieldDef, { binSuffix: 'end' })] = true;
            // const scale = model.scale(channel);
            // if (scaleType(scale, fieldDef, channel, model.mark()) === ScaleType.ORDINAL) {
            // also produce bin_range if the binned field use ordinal scale
            dims[fielddef_1.field(fieldDef, { binSuffix: 'range' })] = true;
            // }
        }
        else {
            dims[fielddef_1.field(fieldDef)] = true;
        }
        return dims;
    }
    function parseUnit(model) {
        /* string set for dimensions */
        var dims = {};
        /* dictionary mapping field name => dict set of aggregation functions */
        var meas = {};
        model.forEachFieldDef(function (fieldDef, channel) {
            if (fieldDef.aggregate) {
                if (fieldDef.aggregate === 'count') {
                    meas['*'] = meas['*'] || {};
                    /* tslint:disable:no-string-literal */
                    meas['*']['count'] = true;
                    /* tslint:enable:no-string-literal */
                }
                else {
                    meas[fieldDef.field] = meas[fieldDef.field] || {};
                    meas[fieldDef.field][fieldDef.aggregate] = true;
                    // add min/max so we can use their union as unaggregated domain
                    var scale = model.scale(channel);
                    if (scale && scale.domain === 'unaggregated') {
                        meas[fieldDef.field]['min'] = true;
                        meas[fieldDef.field]['max'] = true;
                    }
                }
            }
            else {
                addDimension(dims, fieldDef);
            }
            ;
        });
        return [{
                name: model.dataName(data_1.SUMMARY),
                dimensions: dims,
                measures: meas
            }];
    }
    summary.parseUnit = parseUnit;
    function parseFacet(model) {
        var childDataComponent = model.child.component.data;
        // FIXME: this could be incorrect for faceted layer charts.
        // If child doesn't have its own data source but has a summary data source, merge
        if (!childDataComponent.source && childDataComponent.summary) {
            var summaryComponents = childDataComponent.summary.map(function (summaryComponent) {
                // add facet fields as dimensions
                summaryComponent.dimensions = model.reduceFieldDef(addDimension, summaryComponent.dimensions);
                var summaryNameWithoutPrefix = summaryComponent.name.substr(model.child.getName('').length);
                model.child.renameData(summaryComponent.name, summaryNameWithoutPrefix);
                summaryComponent.name = summaryNameWithoutPrefix;
                return summaryComponent;
            });
            delete childDataComponent.summary;
            return summaryComponents;
        }
        return [];
    }
    summary.parseFacet = parseFacet;
    function mergeMeasures(parentMeasures, childMeasures) {
        for (var field_1 in childMeasures) {
            if (childMeasures.hasOwnProperty(field_1)) {
                // when we merge a measure, we either have to add an aggregation operator or even a new field
                var ops = childMeasures[field_1];
                for (var op in ops) {
                    if (ops.hasOwnProperty(op)) {
                        if (field_1 in parentMeasures) {
                            // add operator to existing measure field
                            parentMeasures[field_1][op] = true;
                        }
                        else {
                            parentMeasures[field_1] = { op: true };
                        }
                    }
                }
            }
        }
    }
    function parseLayer(model) {
        // Index by the fields we are grouping by
        var summaries = {};
        // Combine summaries for children that don't have a distinct source
        // (either having its own data source, or its own tranformation of the same data source).
        model.children.forEach(function (child) {
            var childDataComponent = child.component.data;
            if (!childDataComponent.source && childDataComponent.summary) {
                // Merge the summaries if we can
                childDataComponent.summary.forEach(function (childSummary) {
                    // The key is a hash based on the dimensions;
                    // we use it to find out whether we have a summary that uses the same group by fields.
                    var key = util_1.hash(childSummary.dimensions);
                    if (key in summaries) {
                        // yes, there is a summary hat we need to merge into
                        // we know that the dimensions are the same so we only need to merge the measures
                        mergeMeasures(summaries[key].measures, childSummary.measures);
                    }
                    else {
                        // give the summary a new name
                        childSummary.name = model.dataName(data_1.SUMMARY) + '_' + util_1.keys(summaries).length;
                        summaries[key] = childSummary;
                    }
                    // remove summary from child
                    child.renameData(child.dataName(data_1.SUMMARY), summaries[key].name);
                    delete childDataComponent.summary;
                });
            }
        });
        return util_1.vals(summaries);
    }
    summary.parseLayer = parseLayer;
    /**
     * Assemble the summary. Needs a rename function because we cannot guarantee that the
     * parent data before the children data.
     */
    function assemble(component, sourceName) {
        return component.reduce(function (summaryData, summaryComponent) {
            var dims = summaryComponent.dimensions;
            var meas = summaryComponent.measures;
            if (util_1.keys(meas).length > 0) {
                var groupby = util_1.keys(dims);
                var transform = util_1.reduce(meas, function (t, fnDictSet, field) {
                    var ops = util_1.keys(fnDictSet);
                    for (var _i = 0, ops_1 = ops; _i < ops_1.length; _i++) {
                        var op = ops_1[_i];
                        t.fields.push(field);
                        t.ops.push(op);
                    }
                    return t;
                }, {
                    type: 'aggregate',
                    groupby: groupby,
                    fields: [],
                    ops: []
                });
                summaryData.push({
                    name: summaryComponent.name,
                    source: sourceName,
                    transform: [transform]
                });
            }
            return summaryData;
        }, []);
    }
    summary.assemble = assemble;
})(summary = exports.summary || (exports.summary = {}));
//# sourceMappingURL=summary.js.map