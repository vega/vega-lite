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