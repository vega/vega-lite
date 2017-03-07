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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VtbWFyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21waWxlL2RhdGEvc3VtbWFyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQywyQ0FBK0M7QUFDL0MsbUNBQXFFO0FBVXJFLElBQWlCLE9BQU8sQ0FvS3ZCO0FBcEtELFdBQWlCLE9BQU87SUFDdEIsc0JBQXNCLElBQWdDLEVBQUUsUUFBa0I7UUFDeEUsRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDakIsSUFBSSxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbkQsSUFBSSxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFFakQsc0NBQXNDO1lBQ3RDLGlGQUFpRjtZQUNqRiwrREFBK0Q7WUFDL0QsSUFBSSxDQUFDLGdCQUFLLENBQUMsUUFBUSxFQUFFLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDbkQsSUFBSTtRQUNOLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLElBQUksQ0FBQyxnQkFBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQy9CLENBQUM7UUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVELG1CQUEwQixLQUFZO1FBQ3BDLCtCQUErQjtRQUMvQixJQUFNLElBQUksR0FBYyxFQUFFLENBQUM7UUFFM0Isd0VBQXdFO1FBQ3hFLElBQU0sSUFBSSxHQUFvQixFQUFFLENBQUM7UUFFakMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxVQUFTLFFBQVEsRUFBRSxPQUFPO1lBQzlDLEVBQUUsQ0FBQyxD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