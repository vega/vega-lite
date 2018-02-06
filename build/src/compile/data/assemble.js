"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                dataSource.format = __assign({}, dataSource.format || {}, { parse: node.assembleFormatParse() });
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
function assembleRootData(dataComponent) {
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
    data.sort(function (a, b) { return (a.transform || []).length === 0 ? -1 : ((b.transform || []).length === 0 ? 1 : 0); });
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
    return data;
}
exports.assembleRootData = assembleRootData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBcUM7QUFDckMsbUNBQWdDO0FBR2hDLHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMscUNBQXNDO0FBQ3RDLHVDQUF3QztBQUN4Qyw2Q0FBNkM7QUFDN0MsbUNBQW9DO0FBQ3BDLG1DQUFvQztBQUNwQyxpQ0FBa0M7QUFDbEMsdUNBQXdDO0FBRXhDOztHQUVHO0FBQ0gsMkJBQTJCO0FBQzNCLGVBQWUsSUFBa0I7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFJLElBQUksQ0FBQyxXQUFtQixDQUFDLElBQUksSUFBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFLLElBQUksQ0FBQyxTQUFTLE1BQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxhQUMxRixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLFVBQUEsQ0FBQztRQUNsQixNQUFNLENBQUMsS0FBSSxDQUFDLENBQUMsV0FBbUIsQ0FBQyxJQUFJLElBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBSyxDQUFDLENBQUMsU0FBUyxNQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFDO0lBQ25GLENBQUMsQ0FBQyxDQUNGLENBQUMsQ0FBQztJQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVELHNCQUFzQixJQUFjO0lBQ2xDLHNCQUFzQjtJQUN0QixJQUFJLFlB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LEVBQUUsRUFBakIsY0FBaUIsRUFBakIsSUFBaUI7WUFBNUIsSUFBTSxDQUFDLFNBQUE7WUFDVixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUM7Z0JBQ3hCLENBQUMsQ0FBQyxJQUFJLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7WUFDekQsQ0FBQztTQUNGO0tBQ0Y7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQXpDRCw0Q0F5Q0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2lzVXJsRGF0YX0gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge3ZhbHN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtWZ0RhdGF9IGZyb20gJy4uLy4uL3ZlZ2Euc2NoZW1hJztcbmltcG9ydCB7RGF0YUNvbXBvbmVudH0gZnJvbSAnLi8nO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4vYmluJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi9jYWxjdWxhdGUnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGUsIE91dHB1dE5vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuaW1wb3J0IHtGYWNldE5vZGV9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtGaWx0ZXJOb2RlfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQge0ZpbHRlckludmFsaWROb2RlfSBmcm9tICcuL2ZpbHRlcmludmFsaWQnO1xuaW1wb3J0IHtQYXJzZU5vZGV9IGZyb20gJy4vZm9ybWF0cGFyc2UnO1xuaW1wb3J0IHtHZW9KU09OTm9kZX0gZnJvbSAnLi9nZW9qc29uJztcbmltcG9ydCB7R2VvUG9pbnROb2RlfSBmcm9tICcuL2dlb3BvaW50JztcbmltcG9ydCB7SWRlbnRpZmllck5vZGV9IGZyb20gJy4vaW5kZW50aWZpZXInO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcblxuLyoqXG4gKiBQcmludCBkZWJ1ZyBpbmZvcm1hdGlvbiBmb3IgZGF0YWZsb3cgdHJlZS5cbiAqL1xuLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lXG5mdW5jdGlvbiBkZWJ1Zyhub2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgY29uc29sZS5sb2coYCR7KG5vZGUuY29uc3RydWN0b3IgYXMgYW55KS5uYW1lfSR7bm9kZS5kZWJ1Z05hbWUgPyBgICgke25vZGUuZGVidWdOYW1lfSlgIDogJyd9IC0+ICR7XG4gICAgKG5vZGUuY2hpbGRyZW4ubWFwKGMgPT4ge1xuICAgICAgcmV0dXJuIGAkeyhjLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0ke2MuZGVidWdOYW1lID8gYCAoJHtjLmRlYnVnTmFtZX0pYCA6ICcnfWA7XG4gICAgfSkpXG4gIH1gKTtcbiAgY29uc29sZS5sb2cobm9kZSk7XG4gIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChkZWJ1Zyk7XG59XG5cbmZ1bmN0aW9uIG1ha2VXYWxrVHJlZShkYXRhOiBWZ0RhdGFbXSkge1xuICAvLyB0byBuYW1lIGRhdGFzb3VyY2VzXG4gIGxldCBkYXRhc2V0SW5kZXggPSAwO1xuXG4gIC8qKlxuICAgKiBSZWN1cnNpdmVseSB3YWxrIGRvd24gdGhlIHRyZWUuXG4gICAqL1xuICBmdW5jdGlvbiB3YWxrVHJlZShub2RlOiBEYXRhRmxvd05vZGUsIGRhdGFTb3VyY2U6IFZnRGF0YSkge1xuICAgIGlmIChub2RlIGluc3RhbmNlb2YgU291cmNlTm9kZSkge1xuICAgICAgLy8gSWYgdGhlIHNvdXJjZSBpcyBhIG5hbWVkIGRhdGEgc291cmNlIG9yIGEgZGF0YSBzb3VyY2Ugd2l0aCB2YWx1ZXMsIHdlIG5lZWRcbiAgICAgIC8vIHRvIHB1dCBpdCBpbiBhIGRpZmZlcmVudCBkYXRhIHNvdXJjZS4gT3RoZXJ3aXNlLCBWZWdhIG1heSBvdmVycmlkZSB0aGUgZGF0YS5cbiAgICAgIGlmICghaXNVcmxEYXRhKG5vZGUuZGF0YSkpIHtcbiAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSB7XG4gICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICBzb3VyY2U6IGRhdGFTb3VyY2UubmFtZSxcbiAgICAgICAgICB0cmFuc2Zvcm06IFtdXG4gICAgICAgIH07XG4gICAgICAgIGRhdGFTb3VyY2UgPSBuZXdEYXRhO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgUGFyc2VOb2RlKSB7XG4gICAgICBpZiAobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBTb3VyY2VOb2RlICYmICFkYXRhU291cmNlLnNvdXJjZSkge1xuICAgICAgICAvLyBJZiBub2RlJ3MgcGFyZW50IGlzIGEgcm9vdCBzb3VyY2UgYW5kIHRoZSBkYXRhIHNvdXJjZSBkb2VzIG5vdCByZWZlciB0byBhbm90aGVyIGRhdGEgc291cmNlLCB1c2Ugbm9ybWFsIGZvcm1hdCBwYXJzZVxuICAgICAgICBkYXRhU291cmNlLmZvcm1hdCA9IHtcbiAgICAgICAgICAuLi5kYXRhU291cmNlLmZvcm1hdCB8fCB7fSxcbiAgICAgICAgICBwYXJzZTogbm9kZS5hc3NlbWJsZUZvcm1hdFBhcnNlKClcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE90aGVyd2lzZSB1c2UgVmVnYSBleHByZXNzaW9uIHRvIHBhcnNlXG4gICAgICAgIGRhdGFTb3VyY2UudHJhbnNmb3JtID0gZGF0YVNvdXJjZS50cmFuc2Zvcm0uY29uY2F0KG5vZGUuYXNzZW1ibGVUcmFuc2Zvcm1zKCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmFjZXROb2RlKSB7XG4gICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICB9XG5cbiAgICAgIGlmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkge1xuICAgICAgICBkYXRhLnB1c2goZGF0YVNvdXJjZSk7XG4gICAgICAgIG5vZGUuZGF0YSA9IGRhdGFTb3VyY2UubmFtZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG5vZGUuZGF0YSA9IGRhdGFTb3VyY2Uuc291cmNlO1xuICAgICAgfVxuXG4gICAgICBub2RlLmFzc2VtYmxlKCkuZm9yRWFjaChkID0+IGRhdGEucHVzaChkKSk7XG5cbiAgICAgIC8vIGJyZWFrIGhlcmUgYmVjYXVzZSB0aGUgcmVzdCBvZiB0aGUgdHJlZSBoYXMgdG8gYmUgdGFrZW4gY2FyZSBvZiBieSB0aGUgZmFjZXQuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGaWx0ZXJOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgQ2FsY3VsYXRlTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEdlb1BvaW50Tm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEdlb0pTT05Ob2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIExvb2t1cE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBJZGVudGlmaWVyTm9kZSkge1xuICAgICAgZGF0YVNvdXJjZS50cmFuc2Zvcm0ucHVzaChub2RlLmFzc2VtYmxlKCkpO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmlsdGVySW52YWxpZE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBCaW5Ob2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgVGltZVVuaXROb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgU3RhY2tOb2RlKSB7XG4gICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlKCkpO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgQWdncmVnYXRlTm9kZSkge1xuICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgT3V0cHV0Tm9kZSkge1xuICAgICAgaWYgKGRhdGFTb3VyY2Uuc291cmNlICYmIGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBub2RlLnNldFNvdXJjZShkYXRhU291cmNlLnNvdXJjZSk7XG4gICAgICB9IGVsc2UgaWYgKG5vZGUucGFyZW50IGluc3RhbmNlb2YgT3V0cHV0Tm9kZSkge1xuICAgICAgICAvLyBOb3RlIHRoYXQgYW4gb3V0cHV0IG5vZGUgbWF5IGJlIHJlcXVpcmVkIGJ1dCB3ZSBzdGlsbCBkbyBub3QgYXNzZW1ibGUgYVxuICAgICAgICAvLyBzZXBhcmF0ZSBkYXRhIHNvdXJjZSBmb3IgaXQuXG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2UubmFtZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEhlcmUgd2Ugc2V0IHRoZSBuYW1lIG9mIHRoZSBkYXRhc291cmNlIHdlIGdlbmVyYXRlZC4gRnJvbSBub3cgb25cbiAgICAgICAgLy8gb3RoZXIgYXNzZW1ibGVycyBjYW4gdXNlIGl0LlxuICAgICAgICBub2RlLnNldFNvdXJjZShkYXRhU291cmNlLm5hbWUpO1xuXG4gICAgICAgIC8vIGlmIHRoaXMgbm9kZSBoYXMgbW9yZSB0aGFuIG9uZSBjaGlsZCwgd2Ugd2lsbCBhZGQgYSBkYXRhc291cmNlIGF1dG9tYXRpY2FsbHlcbiAgICAgICAgaWYgKG5vZGUubnVtQ2hpbGRyZW4oKSA9PT0gMSkge1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSB7XG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAgc291cmNlOiBkYXRhU291cmNlLm5hbWUsXG4gICAgICAgICAgICB0cmFuc2Zvcm06IFtdXG4gICAgICAgICAgfTtcbiAgICAgICAgICBkYXRhU291cmNlID0gbmV3RGF0YTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHN3aXRjaCAobm9kZS5udW1DaGlsZHJlbigpKSB7XG4gICAgICBjYXNlIDA6XG4gICAgICAgIC8vIGRvbmVcbiAgICAgICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlICYmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkpIHtcbiAgICAgICAgICAvLyBkbyBub3QgcHVzaCBlbXB0eSBkYXRhc291cmNlcyB0aGF0IGFyZSBzaW1wbHkgcmVmZXJlbmNlc1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgd2Fsa1RyZWUobm9kZS5jaGlsZHJlblswXSwgZGF0YVNvdXJjZSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc291cmNlID0gZGF0YVNvdXJjZS5uYW1lO1xuICAgICAgICBpZiAoIWRhdGFTb3VyY2Uuc291cmNlIHx8IGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICBkYXRhLnB1c2goZGF0YVNvdXJjZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc291cmNlID0gZGF0YVNvdXJjZS5zb3VyY2U7XG4gICAgICAgIH1cblxuICAgICAgICBub2RlLmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IHNvdXJjZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgICB9O1xuICAgICAgICAgIHdhbGtUcmVlKGNoaWxkLCBuZXdEYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB3YWxrVHJlZTtcbn1cblxuLyoqXG4gKiBBc3NlbWJsZSBkYXRhIHNvdXJjZXMgdGhhdCBhcmUgZGVyaXZlZCBmcm9tIGZhY2V0ZWQgZGF0YS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlRmFjZXREYXRhKHJvb3Q6IEZhY2V0Tm9kZSk6IFZnRGF0YVtdIHtcbiAgY29uc3QgZGF0YTogVmdEYXRhW10gPSBbXTtcbiAgY29uc3Qgd2Fsa1RyZWUgPSBtYWtlV2Fsa1RyZWUoZGF0YSk7XG5cbiAgcm9vdC5jaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHdhbGtUcmVlKGNoaWxkLCB7XG4gICAgc291cmNlOiByb290Lm5hbWUsXG4gICAgbmFtZTogbnVsbCxcbiAgICB0cmFuc2Zvcm06IFtdXG4gIH0pKTtcblxuICByZXR1cm4gZGF0YTtcbn1cblxuLyoqXG4gKiBDcmVhdGUgVmVnYSBEYXRhIGFycmF5IGZyb20gYSBnaXZlbiBjb21waWxlZCBtb2RlbCBhbmQgYXBwZW5kIGFsbCBvZiB0aGVtIHRvIHRoZSBnaXZlbiBhcnJheVxuICpcbiAqIEBwYXJhbSAgbW9kZWxcbiAqIEBwYXJhbSAgZGF0YSBhcnJheVxuICogQHJldHVybiBtb2RpZmllZCBkYXRhIGFycmF5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhc3NlbWJsZVJvb3REYXRhKGRhdGFDb21wb25lbnQ6IERhdGFDb21wb25lbnQpOiBWZ0RhdGFbXSB7XG4gIGNvbnN0IHJvb3RzOiBTb3VyY2VOb2RlW10gPSB2YWxzKGRhdGFDb21wb25lbnQuc291cmNlcyk7XG4gIGNvbnN0IGRhdGE6IFZnRGF0YVtdID0gW107XG5cbiAgLy8gcm9vdHMuZm9yRWFjaChkZWJ1Zyk7XG5cbiAgY29uc3Qgd2Fsa1RyZWUgPSBtYWtlV2Fsa1RyZWUoZGF0YSk7XG5cbiAgbGV0IHNvdXJjZUluZGV4ID0gMDtcblxuICByb290cy5mb3JFYWNoKHJvb3QgPT4ge1xuICAgIC8vIGFzc2lnbiBhIG5hbWUgaWYgdGhlIHNvdXJjZSBkb2VzIG5vdCBoYXZlIGEgbmFtZSB5ZXRcbiAgICBpZiAoIXJvb3QuaGFzTmFtZSgpKSB7XG4gICAgICByb290LmRhdGFOYW1lID0gYHNvdXJjZV8ke3NvdXJjZUluZGV4Kyt9YDtcbiAgICB9XG5cbiAgICBjb25zdCBuZXdEYXRhOiBWZ0RhdGEgPSByb290LmFzc2VtYmxlKCk7XG5cbiAgICB3YWxrVHJlZShyb290LCBuZXdEYXRhKTtcbiAgfSk7XG5cbiAgLy8gcmVtb3ZlIGVtcHR5IHRyYW5zZm9ybSBhcnJheXMgZm9yIGNsZWFuZXIgb3V0cHV0XG4gIGRhdGEuZm9yRWFjaChkID0+IHtcbiAgICBpZiAoZC50cmFuc2Zvcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICBkZWxldGUgZC50cmFuc2Zvcm07XG4gICAgfVxuICB9KTtcblxuICAvLyBtb3ZlIHNvdXJjZXMgd2l0aG91dCB0cmFuc2Zvcm1zICh0aGUgb25lcyB0aGF0IGFyZSBwb3RlbnRpYWxseSB1c2VkIGluIGxvb2t1cHMpIHRvIHRoZSBiZWdpbm5pbmdcbiAgZGF0YS5zb3J0KChhLCBiKSA9PiAoYS50cmFuc2Zvcm0gfHwgW10pLmxlbmd0aCA9PT0gMCA/IC0xIDogKChiLnRyYW5zZm9ybSB8fCBbXSkubGVuZ3RoID09PSAwID8gMSA6IDApKTtcblxuICAvLyBub3cgZml4IHRoZSBmcm9tIHJlZmVyZW5jZXMgaW4gbG9va3VwIHRyYW5zZm9ybXNcbiAgZm9yIChjb25zdCBkIG9mIGRhdGEpIHtcbiAgICBmb3IgKGNvbnN0IHQgb2YgZC50cmFuc2Zvcm0gfHwgW10pIHtcbiAgICAgIGlmICh0LnR5cGUgPT09ICdsb29rdXAnKSB7XG4gICAgICAgIHQuZnJvbSA9IGRhdGFDb21wb25lbnQub3V0cHV0Tm9kZXNbdC5mcm9tXS5nZXRTb3VyY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGF0YTtcbn1cbiJdfQ==