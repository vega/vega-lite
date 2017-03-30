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
                        // FIXME: make sure that we don't have multiple datasets with the same name
                        childSummary.name = model.dataName(data_1.SUMMARY);
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
    function assemble(components) {
        return components
            .filter(function (comp) { return util_1.keys(comp.measures).length > 0; })
            .map(function (summaryComponent) {
            var ops = [];
            var fields = [];
            util_1.keys(summaryComponent.measures).forEach(function (field) {
                util_1.keys(summaryComponent.measures[field]).forEach(function (op) {
                    ops.push(op);
                    fields.push(field);
                });
            });
            return {
                type: 'aggregate',
                groupby: util_1.keys(summaryComponent.dimensions),
                ops: ops,
                fields: fields
            };
        });
    }
    summary.assemble = assemble;
})(summary = exports.summary || (exports.summary = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWdncmVnYXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2NvbXBpbGUvZGF0YS9hZ2dyZWdhdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxtQ0FBbUM7QUFDbkMsMkNBQStDO0FBQy9DLG1DQUE2RDtBQVE3RCxJQUFpQixPQUFPLENBNEp2QjtBQTVKRCxXQUFpQixPQUFPO0lBQ3RCLHNCQUFzQixJQUFnQyxFQUFFLFFBQWtCO1FBQ3hFLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ2pCLElBQUksQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ25ELElBQUksQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBRWpELHNDQUFzQztZQUN0QyxpRkFBaUY7WUFDakYsK0RBQStEO1lBQy9ELElBQUksQ0FBQyxnQkFBSyxDQUFDLFFBQVEsRUFBRSxFQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1lBQ25ELElBQUk7UUFDTixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixJQUFJLENBQUMsZ0JBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUMvQixDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxtQkFBMEIsS0FBWTtRQUNwQywrQkFBK0I7UUFDL0IsSUFBTSxJQUFJLEdBQWMsRUFBRSxDQUFDO1FBRTNCLHdFQUF3RTtRQUN4RSxJQUFNLElBQUksR0FBb0IsRUFBRSxDQUFDO1FBRWpDLEtBQUssQ0FBQyxlQUFlLENBQUMsVUFBUyxRQUFRLEVBQUUsT0FBTztZQUM5QyxFQUFFLENB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