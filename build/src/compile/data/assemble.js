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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFvRDtBQUNwRCxtQ0FBc0M7QUFHdEMseUNBQTBDO0FBQzFDLDZCQUE4QjtBQUM5Qix5Q0FBMEM7QUFDMUMsdUNBQW9EO0FBQ3BELGlDQUFrQztBQUNsQyxtQ0FBb0M7QUFDcEMsaURBQWtEO0FBQ2xELDZDQUF3QztBQUN4QyxxQ0FBc0M7QUFDdEMsdUNBQXdDO0FBQ3hDLDZDQUE2QztBQUM3QyxtQ0FBb0M7QUFDcEMsbUNBQW9DO0FBQ3BDLGlDQUFrQztBQUNsQyx1Q0FBd0M7QUFDeEMsbUNBQTZDO0FBRTdDOztHQUVHO0FBQ0gsMkJBQTJCO0FBQzNCLGVBQWUsSUFBa0I7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLElBQUksQ0FBQyxXQUFtQixDQUFDLElBQUksSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFLLElBQUksQ0FBQyxTQUFTLE1BQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUMxRixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztRQUNsQixPQUFPLEtBQUksQ0FBQyxDQUFDLFdBQW1CLENBQUMsSUFBSSxJQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQUssQ0FBQyxDQUFDLFNBQVMsTUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUNuRixDQUFDLENBQUMsQ0FDRixDQUFDLENBQUM7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxzQkFBc0IsSUFBYztJQUNsQyxzQkFBc0I7SUFDdEIsSUFBSSxZ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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmxpbmVEYXRhc2V0LCBpc1VybERhdGF9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEaWN0LCB2YWxzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7VmdEYXRhfSBmcm9tICcuLi8uLi92ZWdhLnNjaGVtYSc7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vJztcbmltcG9ydCB7QWdncmVnYXRlTm9kZX0gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtCaW5Ob2RlfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NhbGN1bGF0ZU5vZGV9IGZyb20gJy4vY2FsY3VsYXRlJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlLCBPdXRwdXROb2RlfSBmcm9tICcuL2RhdGFmbG93JztcbmltcG9ydCB7RmFjZXROb2RlfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7RmlsdGVyTm9kZX0gZnJvbSAnLi9maWx0ZXInO1xuaW1wb3J0IHtGaWx0ZXJJbnZhbGlkTm9kZX0gZnJvbSAnLi9maWx0ZXJpbnZhbGlkJztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7R2VvSlNPTk5vZGV9IGZyb20gJy4vZ2VvanNvbic7XG5pbXBvcnQge0dlb1BvaW50Tm9kZX0gZnJvbSAnLi9nZW9wb2ludCc7XG5pbXBvcnQge0lkZW50aWZpZXJOb2RlfSBmcm9tICcuL2luZGVudGlmaWVyJztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi9sb29rdXAnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuL3NvdXJjZSc7XG5pbXBvcnQge1N0YWNrTm9kZX0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi90aW1ldW5pdCc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4vd2luZG93JztcblxuLyoqXG4gKiBQcmludCBkZWJ1ZyBpbmZvcm1hdGlvbiBmb3IgZGF0YWZsb3cgdHJlZS5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5mdW5jdGlvbiBkZWJ1Zyhub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgY29uc29sZS5sb2coYCR7KG5vZGUuY29uc3RydWN0b3IgYXMgYW55KS5uYW1lfSR7bm9kZS5kZWJ1Z05hbWUgPyBgICgke25vZGUuZGVidWdOYW1lfSlgIDogJyd9IC0+ICR7XG4gICAgKG5vZGUuY2hpbGRyZW4ubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIGAkeyhjLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0ke2MuZGVidWdOYW1lID8gYCAoJHtjLmRlYnVnTmFtZX0pYCA6ICcnfWA7XG4gICAgfSkpXG4gIH1gKTtcbiAgY29uc29sZS5sb2cobm9kZSk7XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChkZWJ1Zyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VXYWxrVHJlZShkYXRhOiBWZ0RhdGFbXSkge1xuICAvLyB0byBuYW1lIGRhdGFzb3VyY2VzXG4gIGxldCBkYXRhc2V0SW5kZXggPSAwO1xuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSB3YWxrIGRvd24gdGhlIHRyZWUuXG4gICAqL1xuICBmdW5jdGlvbiB3YWxrVHJlZShub2RlOiBEYXRhRmxvd05vZGUsIGRhdGFTb3VyY2U6IFZnRGF0YSkge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgU291cmNlTm9kZSkge1xuICAgICAgLy8gSWYgdGhlIHNvdXJjZSBpcyBhIG5hbWVkIGRhdGEgc291cmNlIG9yIGEgZGF0YSBzb3VyY2Ugd2l0aCB2YWx1ZXMsIHdlIG5lZWRcbiAgICAgIC8vIHRvIHB1dCBpdCBpbiBhIGRpZmZlcmVudCBkYXRhIHNvdXJjZS4gT3RoZXJ3aXNlLCBWZWdhIG1heSBvdmVycmlkZSB0aGUgZGF0YS5cbiAgICAgIGlmICghaXNVcmxEYXRhKG5vZGUuZGF0YSkpIHtcbiAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSB7XG4gICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICBzb3VyY2U6IGRhdGFTb3VyY2UubmFtZSxcbiAgICAgICAgICB0cmFuc2Zvcm06IFtdXG4gICAgICAgIH07XG4gICAgICAgIGRhdGFTb3VyY2UgPSBuZXdEYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgICBpZiAobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBTb3VyY2VOb2RlICYmICFkYXRhU291cmNlLnNvdXJjZSkge1xuICAgICAgICAvLyBJZiBub2RlJ3MgcGFyZW50IGlzIGEgcm9vdCBzb3VyY2UgYW5kIHRoZSBkYXRhIHNvdXJjZSBkb2VzIG5vdCByZWZlciB0byBhbm90aGVyIGRhdGEgc291cmNlLCB1c2Ugbm9ybWFsIGZvcm1hdCBwYXJzZVxuICAgICAgICBkYXRhU291cmNlLmZvcm1hdCA9IHtcbiAgICAgICAgICAuLi5kYXRhU291cmNlLmZvcm1hdCB8fCB7fSxcbiAgICAgICAgICBwYXJzZTogbm9kZS5hc3NlbWJsZUZvcm1hdFBhcnNlKClcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBhZGQgY2FsY3VsYXRlcyBmb3IgYWxsIG5lc3RlZCBmaWVsZHNcbiAgICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0gPSBkYXRhU291cmNlLnRyYW5zZm9ybS5jb25jYXQobm9kZS5hc3NlbWJsZVRyYW5zZm9ybXModHJ1ZSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gT3RoZXJ3aXNlIHVzZSBWZWdhIGV4cHJlc3Npb24gdG8gcGFyc2VcbiAgICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0gPSBkYXRhU291cmNlLnRyYW5zZm9ybS5jb25jYXQobm9kZS5hc3NlbWJsZVRyYW5zZm9ybXMoKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGYWNldE5vZGUpIHtcbiAgICAgIGlmICghZGF0YVNvdXJjZS5uYW1lKSB7XG4gICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFkYXRhU291cmNlLnNvdXJjZSB8fCBkYXRhU291cmNlLnRyYW5zZm9ybS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgbm9kZS5kYXRhID0gZGF0YVNvdXJjZS5uYW1lO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbm9kZS5kYXRhID0gZGF0YVNvdXJjZS5zb3VyY2U7XG4gICAgICB9XG5cbiAgICAgIG5vZGUuYXNzZW1ibGUoKS5mb3JFYWNoKGQgPT4gZGF0YS5wdXNoKGQpKTtcblxuICAgICAgLy8gYnJlYWsgaGVyZSBiZWNhdXNlIHRoZSByZXN0IG9mIHRoZSB0cmVlIGhhcyB0byBiZSB0YWtlbiBjYXJlIG9mIGJ5IHRoZSBmYWNldC5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEZpbHRlck5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBDYWxjdWxhdGVOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgR2VvUG9pbnROb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgR2VvSlNPTk5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgTG9va3VwTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIFdpbmRvd1RyYW5zZm9ybU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBJZGVudGlmaWVyTm9kZSkge1xuICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0ucHVzaChub2RlLmFzc2VtYmxlKCkpO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmlsdGVySW52YWxpZE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBCaW5Ob2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgVGltZVVuaXROb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgU3RhY2tOb2RlKSB7XG4gICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlKCkpO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSkge1xuICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgT3V0cHV0Tm9kZSkge1xuICAgICAgaWYgKGRhdGFTb3VyY2Uuc291cmNlICYmIGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub2RlLnNldFNvdXJjZShkYXRhU291cmNlLnNvdXJjZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50IGluc3RhbmNlb2YgT3V0cHV0Tm9kZSkge1xuICAgICAgICAvLyBOb3RlIHRoYXQgYW4gb3V0cHV0IG5vZGUgbWF5IGJlIHJlcXVpcmVkIGJ1dCB3ZSBzdGlsbCBkbyBub3QgYXNzZW1ibGUgYVxuICAgICAgICAvLyBzZXBhcmF0ZSBkYXRhIHNvdXJjZSBmb3IgaXQuXG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2UubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhlcmUgd2Ugc2V0IHRoZSBuYW1lIG9mIHRoZSBkYXRhc291cmNlIHdlIGdlbmVyYXRlZC4gRnJvbSBub3cgb25cbiAgICAgICAgLy8gb3RoZXIgYXNzZW1ibGVycyBjYW4gdXNlIGl0LlxuICAgICAgICBub2RlLnNldFNvdXJjZShkYXRhU291cmNlLm5hbWUpO1xuXG4gICAgICAgIC8vIGlmIHRoaXMgbm9kZSBoYXMgbW9yZSB0aGFuIG9uZSBjaGlsZCwgd2Ugd2lsbCBhZGQgYSBkYXRhc291cmNlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgaWYgKG5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gMSkge1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSB7XG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgc291cmNlOiBkYXRhU291cmNlLm5hbWUsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBkYXRhU291cmNlID0gbmV3RGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAobm9kZS5udW1DaGlsZHJlbigpKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIC8vIGRvbmVcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlICYmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAvLyBkbyBub3QgcHVzaCBlbXB0eSBkYXRhc291cmNlcyB0aGF0IGFyZSBzaW1wbHkgcmVmZXJlbmNlc1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgd2Fsa1RyZWUobm9kZS5jaGlsZHJlblswXSwgZGF0YVNvdXJjZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc291cmNlID0gZGF0YVNvdXJjZS5uYW1lO1xuICAgICAgICBpZiAoIWRhdGFTb3VyY2Uuc291cmNlIHx8IGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXRhLnB1c2goZGF0YVNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc291cmNlID0gZGF0YVNvdXJjZS5zb3VyY2U7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHdhbGtUcmVlKGNoaWxkLCBuZXdEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3YWxrVHJlZTtcbn1cblxuLyoqXG4gKiBBc3NlbWJsZSBkYXRhIHNvdXJjZXMgdGhhdCBhcmUgZGVyaXZlZCBmcm9tIGZhY2V0ZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlRmFjZXREYXRhKHJvb3Q6IEZhY2V0Tm9kZSk6IFZnRGF0YVtdIHtcbiAgY29uc3QgZGF0YTogVmdEYXRhW10gPSBbXTtcbiAgY29uc3Qgd2Fsa1RyZWUgPSBtYWtlV2Fsa1RyZWUoZGF0YSk7XG5cbiAgcm9vdC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHdhbGtUcmVlKGNoaWxkLCB7XG4gICAgc291cmNlOiByb290Lm5hbWUsXG4gICAgbmFtZTogbnVsbCxcbiAgICB0cmFuc2Zvcm06IFtdXG4gIH0pKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgVmVnYSBEYXRhIGFycmF5IGZyb20gYSBnaXZlbiBjb21waWxlZCBtb2RlbCBhbmQgYXBwZW5kIGFsbCBvZiB0aGVtIHRvIHRoZSBnaXZlbiBhcnJheVxuICpcbiAqIEBwYXJhbSAgbW9kZWxcbiAqIEBwYXJhbSAgZGF0YSBhcnJheVxuICogQHJldHVybiBtb2RpZmllZCBkYXRhIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVJvb3REYXRhKGRhdGFDb21wb25lbnQ6IERhdGFDb21wb25lbnQsIGRhdGFzZXRzOiBEaWN0PElubGluZURhdGFzZXQ+KTogVmdEYXRhW10ge1xuICBjb25zdCByb290czogU291cmNlTm9kZVtdID0gdmFscyhkYXRhQ29tcG9uZW50LnNvdXJjZXMpO1xuICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuXG4gIC8vIHJvb3RzLmZvckVhY2goZGVidWcpO1xuXG4gIGNvbnN0IHdhbGtUcmVlID0gbWFrZVdhbGtUcmVlKGRhdGEpO1xuXG4gIGxldCBzb3VyY2VJbmRleCA9IDA7XG5cbiAgcm9vdHMuZm9yRWFjaChyb290ID0+IHtcbiAgICAvLyBhc3NpZ24gYSBuYW1lIGlmIHRoZSBzb3VyY2UgZG9lcyBub3QgaGF2ZSBhIG5hbWUgeWV0XG4gICAgaWYgKCFyb290Lmhhc05hbWUoKSkge1xuICAgICAgcm9vdC5kYXRhTmFtZSA9IGBzb3VyY2VfJHtzb3VyY2VJbmRleCsrfWA7XG4gICAgfVxuXG4gICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0gcm9vdC5hc3NlbWJsZSgpO1xuXG4gICAgd2Fsa1RyZWUocm9vdCwgbmV3RGF0YSk7XG4gIH0pO1xuXG4gIC8vIHJlbW92ZSBlbXB0eSB0cmFuc2Zvcm0gYXJyYXlzIGZvciBjbGVhbmVyIG91dHB1dFxuICBkYXRhLmZvckVhY2goZCA9PiB7XG4gICAgaWYgKGQudHJhbnNmb3JtLmxlbmd0aCA9PT0gMCkge1xuICAgICAgZGVsZXRlIGQudHJhbnNmb3JtO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gbW92ZSBzb3VyY2VzIHdpdGhvdXQgdHJhbnNmb3JtcyAodGhlIG9uZXMgdGhhdCBhcmUgcG90ZW50aWFsbHkgdXNlZCBpbiBsb29rdXBzKSB0byB0aGUgYmVnaW5uaW5nXG4gIGxldCB3aGVyZVRvID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgZCA9IGRhdGFbaV07XG4gICAgaWYgKChkLnRyYW5zZm9ybSB8fCBbXSkubGVuZ3RoID09PSAwICYmICFkLnNvdXJjZSkge1xuICAgICAgZGF0YS5zcGxpY2Uod2hlcmVUbysrLCAwLCBkYXRhLnNwbGljZShpLCAxKVswXSk7XG4gICAgfVxuICB9XG5cbiAgLy8gbm93IGZpeCB0aGUgZnJvbSByZWZlcmVuY2VzIGluIGxvb2t1cCB0cmFuc2Zvcm1zXG4gIGZvciAoY29uc3QgZCBvZiBkYXRhKSB7XG4gICAgZm9yIChjb25zdCB0IG9mIGQudHJhbnNmb3JtIHx8IFtdKSB7XG4gICAgICBpZiAodC50eXBlID09PSAnbG9va3VwJykge1xuICAgICAgICB0LmZyb20gPSBkYXRhQ29tcG9uZW50Lm91dHB1dE5vZGVzW3QuZnJvbV0uZ2V0U291cmNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gaW5saW5lIHZhbHVlcyBmb3IgZGF0YXNldHMgdGhhdCBhcmUgaW4gdGhlIGRhdGFzdG9yZVxuICBmb3IgKGNvbnN0IGQgb2YgZGF0YSkge1xuICAgIGlmIChkLm5hbWUgaW4gZGF0YXNldHMpIHtcbiAgICAgIGQudmFsdWVzID0gZGF0YXNldHNbZC5uYW1lXTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cbiJdfQ==