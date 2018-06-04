"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var util_1 = require("../../util");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var calculate_1 = require("./calculate");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var filter_1 = require("./filter");
var filterinvalid_1 = require("./filterinvalid");
var formatparse_1 = require("./formatparse");
var geojson_1 = require("./geojson");
var geopoint_1 = require("./geopoint");
var indentifier_1 = require("./indentifier");
var lookup_1 = require("./lookup");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var window_1 = require("./window");
/**
 * Print debug information for dataflow tree.
 */
// tslint:disable-next-line
function debug(node) {
    console.log("" + node.constructor.name + (node.debugName ? " (" + node.debugName + ")" : '') + " -> " + (node.children.map(function (c) {
        return "" + c.constructor.name + (c.debugName ? " (" + c.debugName + ")" : '');
    })));
    console.log(node);
    node.children.forEach(debug);
}
function makeWalkTree(data) {
    // to name datasources
    var datasetIndex = 0;
    /**
     * Recursively walk down the tree.
     */
    function walkTree(node, dataSource) {
        if (node instanceof source_1.SourceNode) {
            // If the source is a named data source or a data source with values, we need
            // to put it in a different data source. Otherwise, Vega may override the data.
            if (!data_1.isUrlData(node.data)) {
                data.push(dataSource);
                var newData = {
                    name: null,
                    source: dataSource.name,
                    transform: []
                };
                dataSource = newData;
            }
        }
        if (node instanceof formatparse_1.ParseNode) {
            if (node.parent instanceof source_1.SourceNode && !dataSource.source) {
                // If node's parent is a root source and the data source does not refer to another data source, use normal format parse
                dataSource.format = tslib_1.__assign({}, dataSource.format || {}, { parse: node.assembleFormatParse() });
                // add calculates for all nested fields
                dataSource.transform = dataSource.transform.concat(node.assembleTransforms(true));
            }
            else {
                // Otherwise use Vega expression to parse
                dataSource.transform = dataSource.transform.concat(node.assembleTransforms());
            }
        }
        if (node instanceof facet_1.FacetNode) {
            if (!dataSource.name) {
                dataSource.name = "data_" + datasetIndex++;
            }
            if (!dataSource.source || dataSource.transform.length > 0) {
                data.push(dataSource);
                node.data = dataSource.name;
            }
            else {
                node.data = dataSource.source;
            }
            node.assemble().forEach(function (d) { return data.push(d); });
            // break here because the rest of the tree has to be taken care of by the facet.
            return;
        }
        if (node instanceof filter_1.FilterNode ||
            node instanceof calculate_1.CalculateNode ||
            node instanceof geopoint_1.GeoPointNode ||
            node instanceof geojson_1.GeoJSONNode ||
            node instanceof aggregate_1.AggregateNode ||
            node instanceof lookup_1.LookupNode ||
            node instanceof window_1.WindowTransformNode ||
            node instanceof indentifier_1.IdentifierNode) {
            dataSource.transform.push(node.assemble());
        }
        if (node instanceof filterinvalid_1.FilterInvalidNode ||
            node instanceof bin_1.BinNode ||
            node instanceof timeunit_1.TimeUnitNode ||
            node instanceof stack_1.StackNode) {
            dataSource.transform = dataSource.transform.concat(node.assemble());
        }
        if (node instanceof aggregate_1.AggregateNode) {
            if (!dataSource.name) {
                dataSource.name = "data_" + datasetIndex++;
            }
        }
        if (node instanceof dataflow_1.OutputNode) {
            if (dataSource.source && dataSource.transform.length === 0) {
                node.setSource(dataSource.source);
            }
            else if (node.parent instanceof dataflow_1.OutputNode) {
                // Note that an output node may be required but we still do not assemble a
                // separate data source for it.
                node.setSource(dataSource.name);
            }
            else {
                if (!dataSource.name) {
                    dataSource.name = "data_" + datasetIndex++;
                }
                // Here we set the name of the datasource we generated. From now on
                // other assemblers can use it.
                node.setSource(dataSource.name);
                // if this node has more than one child, we will add a datasource automatically
                if (node.numChildren() === 1) {
                    data.push(dataSource);
                    var newData = {
                        name: null,
                        source: dataSource.name,
                        transform: []
                    };
                    dataSource = newData;
                }
            }
        }
        switch (node.numChildren()) {
            case 0:
                // done
                if (node instanceof dataflow_1.OutputNode && (!dataSource.source || dataSource.transform.length > 0)) {
                    // do not push empty datasources that are simply references
                    data.push(dataSource);
                }
                break;
            case 1:
                walkTree(node.children[0], dataSource);
                break;
            default:
                if (!dataSource.name) {
                    dataSource.name = "data_" + datasetIndex++;
                }
                var source_2 = dataSource.name;
                if (!dataSource.source || dataSource.transform.length > 0) {
                    data.push(dataSource);
                }
                else {
                    source_2 = dataSource.source;
                }
                node.children.forEach(function (child) {
                    var newData = {
                        name: null,
                        source: source_2,
                        transform: []
                    };
                    walkTree(child, newData);
                });
                break;
        }
    }
    return walkTree;
}
/**
 * Assemble data sources that are derived from faceted data.
 */
function assembleFacetData(root) {
    var data = [];
    var walkTree = makeWalkTree(data);
    root.children.forEach(function (child) { return walkTree(child, {
        source: root.name,
        name: null,
        transform: []
    }); });
    return data;
}
exports.assembleFacetData = assembleFacetData;
/**
 * Create Vega Data array from a given compiled model and append all of them to the given array
 *
 * @param  model
 * @param  data array
 * @return modified data array
 */
function assembleRootData(dataComponent, datasets) {
    var roots = util_1.vals(dataComponent.sources);
    var data = [];
    // roots.forEach(debug);
    var walkTree = makeWalkTree(data);
    var sourceIndex = 0;
    roots.forEach(function (root) {
        // assign a name if the source does not have a name yet
        if (!root.hasName()) {
            root.dataName = "source_" + sourceIndex++;
        }
        var newData = root.assemble();
        walkTree(root, newData);
    });
    // remove empty transform arrays for cleaner output
    data.forEach(function (d) {
        if (d.transform.length === 0) {
            delete d.transform;
        }
    });
    // move sources without transforms (the ones that are potentially used in lookups) to the beginning
    var whereTo = 0;
    for (var i = 0; i < data.length; i++) {
        var d = data[i];
        if ((d.transform || []).length === 0 && !d.source) {
            data.splice(whereTo++, 0, data.splice(i, 1)[0]);
        }
    }
    // now fix the from references in lookup transforms
    for (var _i = 0, data_2 = data; _i < data_2.length; _i++) {
        var d = data_2[_i];
        for (var _a = 0, _b = d.transform || []; _a < _b.length; _a++) {
            var t = _b[_a];
            if (t.type === 'lookup') {
                t.from = dataComponent.outputNodes[t.from].getSource();
            }
        }
    }
    // inline values for datasets that are in the datastore
    for (var _c = 0, data_3 = data; _c < data_3.length; _c++) {
        var d = data_3[_c];
        if (d.name in datasets) {
            d.values = datasets[d.name];
        }
    }
    return data;
}
exports.assembleRootData = assembleRootData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvRDtBQUNwRCxtQ0FBc0M7QUFHdEMseUNBQTBDO0FBQzFDLDZCQUE4QjtBQUM5Qix5Q0FBMEM7QUFDMUMsdUNBQW9EO0FBQ3BELGlDQUFrQztBQUNsQyxtQ0FBb0M7QUFDcEMsaURBQWtEO0FBQ2xELDZDQUF3QztBQUN4QyxxQ0FBc0M7QUFDdEMsdUNBQXdDO0FBQ3hDLDZDQUE2QztBQUM3QyxtQ0FBb0M7QUFDcEMsbUNBQW9DO0FBQ3BDLGlDQUFrQztBQUNsQyx1Q0FBd0M7QUFDeEMsbUNBQTZDO0FBRTdDOztHQUVHO0FBQ0gsMkJBQTJCO0FBQzNCLGVBQWUsSUFBa0I7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLElBQUksQ0FBQyxXQUFtQixDQUFDLElBQUksSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFLLElBQUksQ0FBQyxTQUFTLE1BQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUMxRixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztRQUNsQixPQUFPLEtBQUksQ0FBQyxDQUFDLFdBQW1CLENBQUMsSUFBSSxJQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQUssQ0FBQyxDQUFDLFNBQVMsTUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUNuRixDQUFDLENBQUMsQ0FDRixDQUFDLENBQUM7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxzQkFBc0IsSUFBYztJQUNsQyxzQkFBc0I7SUFDdEIsSUFBSSxZ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QXRERCw0Q0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0lubGluZURhdGFzZXQsIGlzVXJsRGF0YX0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0RpY3QsIHZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RGF0YUNvbXBvbmVudH0gZnJvbSAnLi8nO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4vYmluJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi9jYWxjdWxhdGUnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGUsIE91dHB1dE5vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuaW1wb3J0IHtGYWNldE5vZGV9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtGaWx0ZXJOb2RlfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQge0ZpbHRlckludmFsaWROb2RlfSBmcm9tICcuL2ZpbHRlcmludmFsaWQnO1xuaW1wb3J0IHtQYXJzZU5vZGV9IGZyb20gJy4vZm9ybWF0cGFyc2UnO1xuaW1wb3J0IHtHZW9KU09OTm9kZX0gZnJvbSAnLi9nZW9qc29uJztcbmltcG9ydCB7R2VvUG9pbnROb2RlfSBmcm9tICcuL2dlb3BvaW50JztcbmltcG9ydCB7SWRlbnRpZmllck5vZGV9IGZyb20gJy4vaW5kZW50aWZpZXInO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi93aW5kb3cnO1xuXG4vKipcbiAqIFByaW50IGRlYnVnIGluZm9ybWF0aW9uIGZvciBkYXRhZmxvdyB0cmVlLlxuICovXG4vLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmVcbmZ1bmN0aW9uIGRlYnVnKG5vZGU6IERhdGFGbG93Tm9kZSkge1xuICBjb25zb2xlLmxvZyhgJHsobm9kZS5jb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWV9JHtub2RlLmRlYnVnTmFtZSA/IGAgKCR7bm9kZS5kZWJ1Z05hbWV9KWAgOiAnJ30gLT4gJHtcbiAgICAobm9kZS5jaGlsZHJlbi5tYXAoYyA9PiB7XG4gICAgICByZXR1cm4gYCR7KGMuY29uc3RydWN0b3IgYXMgYW55KS5uYW1lfSR7Yy5kZWJ1Z05hbWUgPyBgICgke2MuZGVidWdOYW1lfSlgIDogJyd9YDtcbiAgICB9KSlcbiAgfWApO1xuICBjb25zb2xlLmxvZyhub2RlKTtcbiAgbm9kZS5jaGlsZHJlbi5mb3JFYWNoKGRlYnVnKTtcbn1cblxuZnVuY3Rpb24gbWFrZVdhbGtUcmVlKGRhdGE6IFZnRGF0YVtdKSB7XG4gIC8vIHRvIG5hbWUgZGF0YXNvdXJjZXNcbiAgbGV0IGRhdGFzZXRJbmRleCA9IDA7XG5cbiAgLyoqXG4gICAqIFJlY3Vyc2l2ZWx5IHdhbGsgZG93biB0aGUgdHJlZS5cbiAgICovXG4gIGZ1bmN0aW9uIHdhbGtUcmVlKG5vZGU6IERhdGFGbG93Tm9kZSwgZGF0YVNvdXJjZTogVmdEYXRhKSB7XG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBTb3VyY2VOb2RlKSB7XG4gICAgICAvLyBJZiB0aGUgc291cmNlIGlzIGEgbmFtZWQgZGF0YSBzb3VyY2Ugb3IgYSBkYXRhIHNvdXJjZSB3aXRoIHZhbHVlcywgd2UgbmVlZFxuICAgICAgLy8gdG8gcHV0IGl0IGluIGEgZGlmZmVyZW50IGRhdGEgc291cmNlLiBPdGhlcndpc2UsIFZlZ2EgbWF5IG92ZXJyaWRlIHRoZSBkYXRhLlxuICAgICAgaWYgKCFpc1VybERhdGEobm9kZS5kYXRhKSkge1xuICAgICAgICBkYXRhLnB1c2goZGF0YVNvdXJjZSk7XG4gICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgIHNvdXJjZTogZGF0YVNvdXJjZS5uYW1lLFxuICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgfTtcbiAgICAgICAgZGF0YVNvdXJjZSA9IG5ld0RhdGE7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBQYXJzZU5vZGUpIHtcbiAgICAgIGlmIChub2RlLnBhcmVudCBpbnN0YW5jZW9mIFNvdXJjZU5vZGUgJiYgIWRhdGFTb3VyY2Uuc291cmNlKSB7XG4gICAgICAgIC8vIElmIG5vZGUncyBwYXJlbnQgaXMgYSByb290IHNvdXJjZSBhbmQgdGhlIGRhdGEgc291cmNlIGRvZXMgbm90IHJlZmVyIHRvIGFub3RoZXIgZGF0YSBzb3VyY2UsIHVzZSBub3JtYWwgZm9ybWF0IHBhcnNlXG4gICAgICAgIGRhdGFTb3VyY2UuZm9ybWF0ID0ge1xuICAgICAgICAgIC4uLmRhdGFTb3VyY2UuZm9ybWF0IHx8IHt9LFxuICAgICAgICAgIHBhcnNlOiBub2RlLmFzc2VtYmxlRm9ybWF0UGFyc2UoKVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGFkZCBjYWxjdWxhdGVzIGZvciBhbGwgbmVzdGVkIGZpZWxkc1xuICAgICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlVHJhbnNmb3Jtcyh0cnVlKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UgdXNlIFZlZ2EgZXhwcmVzc2lvbiB0byBwYXJzZVxuICAgICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlVHJhbnNmb3JtcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEZhY2V0Tm9kZSkge1xuICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGFTb3VyY2Uuc291cmNlIHx8IGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICBub2RlLmRhdGEgPSBkYXRhU291cmNlLm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLmRhdGEgPSBkYXRhU291cmNlLnNvdXJjZTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5hc3NlbWJsZSgpLmZvckVhY2goZCA9PiBkYXRhLnB1c2goZCkpO1xuXG4gICAgICAvLyBicmVhayBoZXJlIGJlY2F1c2UgdGhlIHJlc3Qgb2YgdGhlIHRyZWUgaGFzIHRvIGJlIHRha2VuIGNhcmUgb2YgYnkgdGhlIGZhY2V0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmlsdGVyTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIENhbGN1bGF0ZU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBHZW9Qb2ludE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBHZW9KU09OTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEFnZ3JlZ2F0ZU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBMb29rdXBOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgV2luZG93VHJhbnNmb3JtTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIElkZW50aWZpZXJOb2RlKSB7XG4gICAgICBkYXRhU291cmNlLnRyYW5zZm9ybS5wdXNoKG5vZGUuYXNzZW1ibGUoKSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGaWx0ZXJJbnZhbGlkTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEJpbk5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBUaW1lVW5pdE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBTdGFja05vZGUpIHtcbiAgICAgIGRhdGFTb3VyY2UudHJhbnNmb3JtID0gZGF0YVNvdXJjZS50cmFuc2Zvcm0uY29uY2F0KG5vZGUuYXNzZW1ibGUoKSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICBpZiAoZGF0YVNvdXJjZS5zb3VyY2UgJiYgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2Uuc291cmNlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCBhbiBvdXRwdXQgbm9kZSBtYXkgYmUgcmVxdWlyZWQgYnV0IHdlIHN0aWxsIGRvIG5vdCBhc3NlbWJsZSBhXG4gICAgICAgIC8vIHNlcGFyYXRlIGRhdGEgc291cmNlIGZvciBpdC5cbiAgICAgICAgbm9kZS5zZXRTb3VyY2UoZGF0YVNvdXJjZS5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZGF0YVNvdXJjZS5uYW1lKSB7XG4gICAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGVyZSB3ZSBzZXQgdGhlIG5hbWUgb2YgdGhlIGRhdGFzb3VyY2Ugd2UgZ2VuZXJhdGVkLiBGcm9tIG5vdyBvblxuICAgICAgICAvLyBvdGhlciBhc3NlbWJsZXJzIGNhbiB1c2UgaXQuXG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2UubmFtZSk7XG5cbiAgICAgICAgLy8gaWYgdGhpcyBub2RlIGhhcyBtb3JlIHRoYW4gb25lIGNoaWxkLCB3ZSB3aWxsIGFkZCBhIGRhdGFzb3VyY2UgYXV0b21hdGljYWxseVxuICAgICAgICBpZiAobm9kZS5udW1DaGlsZHJlbigpID09PSAxKSB7XG4gICAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IGRhdGFTb3VyY2UubmFtZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGRhdGFTb3VyY2UgPSBuZXdEYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dpdGNoIChub2RlLm51bUNoaWxkcmVuKCkpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgLy8gZG9uZVxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgJiYgKCFkYXRhU291cmNlLnNvdXJjZSB8fCBkYXRhU291cmNlLnRyYW5zZm9ybS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgIC8vIGRvIG5vdCBwdXNoIGVtcHR5IGRhdGFzb3VyY2VzIHRoYXQgYXJlIHNpbXBseSByZWZlcmVuY2VzXG4gICAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB3YWxrVHJlZShub2RlLmNoaWxkcmVuWzBdLCBkYXRhU291cmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzb3VyY2UgPSBkYXRhU291cmNlLm5hbWU7XG4gICAgICAgIGlmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb3VyY2UgPSBkYXRhU291cmNlLnNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0ge1xuICAgICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgd2Fsa1RyZWUoY2hpbGQsIG5ld0RhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdhbGtUcmVlO1xufVxuXG4vKipcbiAqIEFzc2VtYmxlIGRhdGEgc291cmNlcyB0aGF0IGFyZSBkZXJpdmVkIGZyb20gZmFjZXRlZCBkYXRhLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVGYWNldERhdGEocm9vdDogRmFjZXROb2RlKTogVmdEYXRhW10ge1xuICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuICBjb25zdCB3YWxrVHJlZSA9IG1ha2VXYWxrVHJlZShkYXRhKTtcblxuICByb290LmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gd2Fsa1RyZWUoY2hpbGQsIHtcbiAgICBzb3VyY2U6IHJvb3QubmFtZSxcbiAgICBuYW1lOiBudWxsLFxuICAgIHRyYW5zZm9ybTogW11cbiAgfSkpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIENyZWF0ZSBWZWdhIERhdGEgYXJyYXkgZnJvbSBhIGdpdmVuIGNvbXBpbGVkIG1vZGVsIGFuZCBhcHBlbmQgYWxsIG9mIHRoZW0gdG8gdGhlIGdpdmVuIGFycmF5XG4gKlxuICogQHBhcmFtICBtb2RlbFxuICogQHBhcmFtICBkYXRhIGFycmF5XG4gKiBAcmV0dXJuIG1vZGlmaWVkIGRhdGEgYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlUm9vdERhdGEoZGF0YUNvbXBvbmVudDogRGF0YUNvbXBvbmVudCwgZGF0YXNldHM6IERpY3Q8SW5saW5lRGF0YXNldD4pOiBWZ0RhdGFbXSB7XG4gIGNvbnN0IHJvb3RzOiBTb3VyY2VOb2RlW10gPSB2YWxzKGRhdGFDb21wb25lbnQuc291cmNlcyk7XG4gIGNvbnN0IGRhdGE6IFZnRGF0YVtdID0gW107XG5cbiAgLy8gcm9vdHMuZm9yRWFjaChkZWJ1Zyk7XG5cbiAgY29uc3Qgd2Fsa1RyZWUgPSBtYWtlV2Fsa1RyZWUoZGF0YSk7XG5cbiAgbGV0IHNvdXJjZUluZGV4ID0gMDtcblxuICByb290cy5mb3JFYWNoKHJvb3QgPT4ge1xuICAgIC8vIGFzc2lnbiBhIG5hbWUgaWYgdGhlIHNvdXJjZSBkb2VzIG5vdCBoYXZlIGEgbmFtZSB5ZXRcbiAgICBpZiAoIXJvb3QuaGFzTmFtZSgpKSB7XG4gICAgICByb290LmRhdGFOYW1lID0gYHNvdXJjZV8ke3NvdXJjZUluZGV4Kyt9YDtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSByb290LmFzc2VtYmxlKCk7XG5cbiAgICB3YWxrVHJlZShyb290LCBuZXdEYXRhKTtcbiAgfSk7XG5cbiAgLy8gcmVtb3ZlIGVtcHR5IHRyYW5zZm9ybSBhcnJheXMgZm9yIGNsZWFuZXIgb3V0cHV0XG4gIGRhdGEuZm9yRWFjaChkID0+IHtcbiAgICBpZiAoZC50cmFuc2Zvcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBkZWxldGUgZC50cmFuc2Zvcm07XG4gICAgfVxuICB9KTtcblxuICAvLyBtb3ZlIHNvdXJjZXMgd2l0aG91dCB0cmFuc2Zvcm1zICh0aGUgb25lcyB0aGF0IGFyZSBwb3RlbnRpYWxseSB1c2VkIGluIGxvb2t1cHMpIHRvIHRoZSBiZWdpbm5pbmdcbiAgbGV0IHdoZXJlVG8gPSAwO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBkID0gZGF0YVtpXTtcbiAgICBpZiAoKGQudHJhbnNmb3JtIHx8IFtdKS5sZW5ndGggPT09IDAgJiYgIWQuc291cmNlKSB7XG4gICAgICBkYXRhLnNwbGljZSh3aGVyZVRvKyssIDAsIGRhdGEuc3BsaWNlKGksIDEpWzBdKTtcbiAgICB9XG4gIH1cblxuICAvLyBub3cgZml4IHRoZSBmcm9tIHJlZmVyZW5jZXMgaW4gbG9va3VwIHRyYW5zZm9ybXNcbiAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICBmb3IgKGNvbnN0IHQgb2YgZC50cmFuc2Zvcm0gfHwgW10pIHtcbiAgICAgIGlmICh0LnR5cGUgPT09ICdsb29rdXAnKSB7XG4gICAgICAgIHQuZnJvbSA9IGRhdGFDb21wb25lbnQub3V0cHV0Tm9kZXNbdC5mcm9tXS5nZXRTb3VyY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBpbmxpbmUgdmFsdWVzIGZvciBkYXRhc2V0cyB0aGF0IGFyZSBpbiB0aGUgZGF0YXN0b3JlXG4gIGZvciAoY29uc3QgZCBvZiBkYXRhKSB7XG4gICAgaWYgKGQubmFtZSBpbiBkYXRhc2V0cykge1xuICAgICAgZC52YWx1ZXMgPSBkYXRhc2V0c1tkLm5hbWVdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuIl19