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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxtQ0FBcUM7QUFDckMsbUNBQWdDO0FBR2hDLHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMsNkNBQTZDO0FBQzdDLG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUV4Qzs7R0FFRztBQUNILDJCQUEyQjtBQUMzQixlQUFlLElBQWtCO0lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxJQUFJLENBQUMsV0FBbUIsQ0FBQyxJQUFJLElBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBSyxJQUFJLENBQUMsU0FBUyxNQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFDMUYsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxVQUFBLENBQUM7UUFDbEIsTUFBTSxDQUFDLEtBQUksQ0FBQyxDQUFDLFdBQW1CLENBQUMsSUFBSSxJQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLE9BQUssQ0FBQyxDQUFDLFNBQVMsTUFBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBQztJQUNuRixDQUFDLENBQUMsQ0FDRixDQUFDLENBQUM7SUFDSixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQy9CLENBQUM7QUFFRCxzQkFBc0IsSUFBYztJQUNsQyxzQkFBc0I7SUFDdEIsSUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0lBRXJCOztP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LENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDeEIsQ0FBQyxDQUFDLElBQUksR0FBRyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUN6RCxDQUFDO1NBQ0Y7S0FDRjtJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUM7QUFDZCxDQUFDO0FBekNELDRDQXlDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNVcmxEYXRhfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCB7dmFsc30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge1ZnRGF0YX0gZnJvbSAnLi4vLi4vdmVnYS5zY2hlbWEnO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuLyc7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0lkZW50aWZpZXJOb2RlfSBmcm9tICcuL2luZGVudGlmaWVyJztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi9sb29rdXAnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuL3NvdXJjZSc7XG5pbXBvcnQge1N0YWNrTm9kZX0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi90aW1ldW5pdCc7XG5cbi8qKlxuICogUHJpbnQgZGVidWcgaW5mb3JtYXRpb24gZm9yIGRhdGFmbG93IHRyZWUuXG4gKi9cbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZVxuZnVuY3Rpb24gZGVidWcobm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gIGNvbnNvbGUubG9nKGAkeyhub2RlLmNvbnN0cnVjdG9yIGFzIGFueSkubmFtZX0ke25vZGUuZGVidWdOYW1lID8gYCAoJHtub2RlLmRlYnVnTmFtZX0pYCA6ICcnfSAtPiAke1xuICAgIChub2RlLmNoaWxkcmVuLm1hcChjID0+IHtcbiAgICAgIHJldHVybiBgJHsoYy5jb25zdHJ1Y3RvciBhcyBhbnkpLm5hbWV9JHtjLmRlYnVnTmFtZSA/IGAgKCR7Yy5kZWJ1Z05hbWV9KWAgOiAnJ31gO1xuICAgIH0pKVxuICB9YCk7XG4gIGNvbnNvbGUubG9nKG5vZGUpO1xuICBub2RlLmNoaWxkcmVuLmZvckVhY2goZGVidWcpO1xufVxuXG5mdW5jdGlvbiBtYWtlV2Fsa1RyZWUoZGF0YTogVmdEYXRhW10pIHtcbiAgLy8gdG8gbmFtZSBkYXRhc291cmNlc1xuICBsZXQgZGF0YXNldEluZGV4ID0gMDtcblxuICAvKipcbiAgICogUmVjdXJzaXZlbHkgd2FsayBkb3duIHRoZSB0cmVlLlxuICAgKi9cbiAgZnVuY3Rpb24gd2Fsa1RyZWUobm9kZTogRGF0YUZsb3dOb2RlLCBkYXRhU291cmNlOiBWZ0RhdGEpIHtcbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFNvdXJjZU5vZGUpIHtcbiAgICAgIC8vIElmIHRoZSBzb3VyY2UgaXMgYSBuYW1lZCBkYXRhIHNvdXJjZSBvciBhIGRhdGEgc291cmNlIHdpdGggdmFsdWVzLCB3ZSBuZWVkXG4gICAgICAvLyB0byBwdXQgaXQgaW4gYSBkaWZmZXJlbnQgZGF0YSBzb3VyY2UuIE90aGVyd2lzZSwgVmVnYSBtYXkgb3ZlcnJpZGUgdGhlIGRhdGEuXG4gICAgICBpZiAoIWlzVXJsRGF0YShub2RlLmRhdGEpKSB7XG4gICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0ge1xuICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgc291cmNlOiBkYXRhU291cmNlLm5hbWUsXG4gICAgICAgICAgdHJhbnNmb3JtOiBbXVxuICAgICAgICB9O1xuICAgICAgICBkYXRhU291cmNlID0gbmV3RGF0YTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIFBhcnNlTm9kZSkge1xuICAgICAgaWYgKG5vZGUucGFyZW50IGluc3RhbmNlb2YgU291cmNlTm9kZSAmJiAhZGF0YVNvdXJjZS5zb3VyY2UpIHtcbiAgICAgICAgLy8gSWYgbm9kZSdzIHBhcmVudCBpcyBhIHJvb3Qgc291cmNlIGFuZCB0aGUgZGF0YSBzb3VyY2UgZG9lcyBub3QgcmVmZXIgdG8gYW5vdGhlciBkYXRhIHNvdXJjZSwgdXNlIG5vcm1hbCBmb3JtYXQgcGFyc2VcbiAgICAgICAgZGF0YVNvdXJjZS5mb3JtYXQgPSB7XG4gICAgICAgICAgLi4uZGF0YVNvdXJjZS5mb3JtYXQgfHwge30sXG4gICAgICAgICAgcGFyc2U6IG5vZGUuYXNzZW1ibGVGb3JtYXRQYXJzZSgpXG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBPdGhlcndpc2UgdXNlIFZlZ2EgZXhwcmVzc2lvbiB0byBwYXJzZVxuICAgICAgICBkYXRhU291cmNlLnRyYW5zZm9ybSA9IGRhdGFTb3VyY2UudHJhbnNmb3JtLmNvbmNhdChub2RlLmFzc2VtYmxlVHJhbnNmb3JtcygpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobm9kZSBpbnN0YW5jZW9mIEZhY2V0Tm9kZSkge1xuICAgICAgaWYgKCFkYXRhU291cmNlLm5hbWUpIHtcbiAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWRhdGFTb3VyY2Uuc291cmNlIHx8IGRhdGFTb3VyY2UudHJhbnNmb3JtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICBub2RlLmRhdGEgPSBkYXRhU291cmNlLm5hbWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBub2RlLmRhdGEgPSBkYXRhU291cmNlLnNvdXJjZTtcbiAgICAgIH1cblxuICAgICAgbm9kZS5hc3NlbWJsZSgpLmZvckVhY2goZCA9PiBkYXRhLnB1c2goZCkpO1xuXG4gICAgICAvLyBicmVhayBoZXJlIGJlY2F1c2UgdGhlIHJlc3Qgb2YgdGhlIHRyZWUgaGFzIHRvIGJlIHRha2VuIGNhcmUgb2YgYnkgdGhlIGZhY2V0LlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChub2RlIGluc3RhbmNlb2YgRmlsdGVyTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIENhbGN1bGF0ZU5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlIHx8XG4gICAgICBub2RlIGluc3RhbmNlb2YgTG9va3VwTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIElkZW50aWZpZXJOb2RlKSB7XG4gICAgICBkYXRhU291cmNlLnRyYW5zZm9ybS5wdXNoKG5vZGUuYXNzZW1ibGUoKSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBGaWx0ZXJJbnZhbGlkTm9kZSB8fFxuICAgICAgbm9kZSBpbnN0YW5jZW9mIEJpbk5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBUaW1lVW5pdE5vZGUgfHxcbiAgICAgIG5vZGUgaW5zdGFuY2VvZiBTdGFja05vZGUpIHtcbiAgICAgIGRhdGFTb3VyY2UudHJhbnNmb3JtID0gZGF0YVNvdXJjZS50cmFuc2Zvcm0uY29uY2F0KG5vZGUuYXNzZW1ibGUoKSk7XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBBZ2dyZWdhdGVOb2RlKSB7XG4gICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICBkYXRhU291cmNlLm5hbWUgPSBgZGF0YV8ke2RhdGFzZXRJbmRleCsrfWA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG5vZGUgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICBpZiAoZGF0YVNvdXJjZS5zb3VyY2UgJiYgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2Uuc291cmNlKTtcbiAgICAgIH0gZWxzZSBpZiAobm9kZS5wYXJlbnQgaW5zdGFuY2VvZiBPdXRwdXROb2RlKSB7XG4gICAgICAgIC8vIE5vdGUgdGhhdCBhbiBvdXRwdXQgbm9kZSBtYXkgYmUgcmVxdWlyZWQgYnV0IHdlIHN0aWxsIGRvIG5vdCBhc3NlbWJsZSBhXG4gICAgICAgIC8vIHNlcGFyYXRlIGRhdGEgc291cmNlIGZvciBpdC5cbiAgICAgICAgbm9kZS5zZXRTb3VyY2UoZGF0YVNvdXJjZS5uYW1lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghZGF0YVNvdXJjZS5uYW1lKSB7XG4gICAgICAgICAgZGF0YVNvdXJjZS5uYW1lID0gYGRhdGFfJHtkYXRhc2V0SW5kZXgrK31gO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gSGVyZSB3ZSBzZXQgdGhlIG5hbWUgb2YgdGhlIGRhdGFzb3VyY2Ugd2UgZ2VuZXJhdGVkLiBGcm9tIG5vdyBvblxuICAgICAgICAvLyBvdGhlciBhc3NlbWJsZXJzIGNhbiB1c2UgaXQuXG4gICAgICAgIG5vZGUuc2V0U291cmNlKGRhdGFTb3VyY2UubmFtZSk7XG5cbiAgICAgICAgLy8gaWYgdGhpcyBub2RlIGhhcyBtb3JlIHRoYW4gb25lIGNoaWxkLCB3ZSB3aWxsIGFkZCBhIGRhdGFzb3VyY2UgYXV0b21hdGljYWxseVxuICAgICAgICBpZiAobm9kZS5udW1DaGlsZHJlbigpID09PSAxKSB7XG4gICAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHtcbiAgICAgICAgICAgIG5hbWU6IG51bGwsXG4gICAgICAgICAgICBzb3VyY2U6IGRhdGFTb3VyY2UubmFtZSxcbiAgICAgICAgICAgIHRyYW5zZm9ybTogW11cbiAgICAgICAgICB9O1xuICAgICAgICAgIGRhdGFTb3VyY2UgPSBuZXdEYXRhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3dpdGNoIChub2RlLm51bUNoaWxkcmVuKCkpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgLy8gZG9uZVxuICAgICAgICBpZiAobm9kZSBpbnN0YW5jZW9mIE91dHB1dE5vZGUgJiYgKCFkYXRhU291cmNlLnNvdXJjZSB8fCBkYXRhU291cmNlLnRyYW5zZm9ybS5sZW5ndGggPiAwKSkge1xuICAgICAgICAgIC8vIGRvIG5vdCBwdXNoIGVtcHR5IGRhdGFzb3VyY2VzIHRoYXQgYXJlIHNpbXBseSByZWZlcmVuY2VzXG4gICAgICAgICAgZGF0YS5wdXNoKGRhdGFTb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB3YWxrVHJlZShub2RlLmNoaWxkcmVuWzBdLCBkYXRhU291cmNlKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICBpZiAoIWRhdGFTb3VyY2UubmFtZSkge1xuICAgICAgICAgIGRhdGFTb3VyY2UubmFtZSA9IGBkYXRhXyR7ZGF0YXNldEluZGV4Kyt9YDtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzb3VyY2UgPSBkYXRhU291cmNlLm5hbWU7XG4gICAgICAgIGlmICghZGF0YVNvdXJjZS5zb3VyY2UgfHwgZGF0YVNvdXJjZS50cmFuc2Zvcm0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIGRhdGEucHVzaChkYXRhU291cmNlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzb3VyY2UgPSBkYXRhU291cmNlLnNvdXJjZTtcbiAgICAgICAgfVxuXG4gICAgICAgIG5vZGUuY2hpbGRyZW4uZm9yRWFjaChjaGlsZCA9PiB7XG4gICAgICAgICAgY29uc3QgbmV3RGF0YTogVmdEYXRhID0ge1xuICAgICAgICAgICAgbmFtZTogbnVsbCxcbiAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgdHJhbnNmb3JtOiBbXVxuICAgICAgICAgIH07XG4gICAgICAgICAgd2Fsa1RyZWUoY2hpbGQsIG5ld0RhdGEpO1xuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHdhbGtUcmVlO1xufVxuXG4vKipcbiAqIEFzc2VtYmxlIGRhdGEgc291cmNlcyB0aGF0IGFyZSBkZXJpdmVkIGZyb20gZmFjZXRlZCBkYXRhLlxuICovXG5leHBvcnQgZnVuY3Rpb24gYXNzZW1ibGVGYWNldERhdGEocm9vdDogRmFjZXROb2RlKTogVmdEYXRhW10ge1xuICBjb25zdCBkYXRhOiBWZ0RhdGFbXSA9IFtdO1xuICBjb25zdCB3YWxrVHJlZSA9IG1ha2VXYWxrVHJlZShkYXRhKTtcblxuICByb290LmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gd2Fsa1RyZWUoY2hpbGQsIHtcbiAgICBzb3VyY2U6IHJvb3QubmFtZSxcbiAgICBuYW1lOiBudWxsLFxuICAgIHRyYW5zZm9ybTogW11cbiAgfSkpO1xuXG4gIHJldHVybiBkYXRhO1xufVxuXG4vKipcbiAqIENyZWF0ZSBWZWdhIERhdGEgYXJyYXkgZnJvbSBhIGdpdmVuIGNvbXBpbGVkIG1vZGVsIGFuZCBhcHBlbmQgYWxsIG9mIHRoZW0gdG8gdGhlIGdpdmVuIGFycmF5XG4gKlxuICogQHBhcmFtICBtb2RlbFxuICogQHBhcmFtICBkYXRhIGFycmF5XG4gKiBAcmV0dXJuIG1vZGlmaWVkIGRhdGEgYXJyYXlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VtYmxlUm9vdERhdGEoZGF0YUNvbXBvbmVudDogRGF0YUNvbXBvbmVudCk6IFZnRGF0YVtdIHtcbiAgY29uc3Qgcm9vdHM6IFNvdXJjZU5vZGVbXSA9IHZhbHMoZGF0YUNvbXBvbmVudC5zb3VyY2VzKTtcbiAgY29uc3QgZGF0YTogVmdEYXRhW10gPSBbXTtcblxuICAvLyByb290cy5mb3JFYWNoKGRlYnVnKTtcblxuICBjb25zdCB3YWxrVHJlZSA9IG1ha2VXYWxrVHJlZShkYXRhKTtcblxuICBsZXQgc291cmNlSW5kZXggPSAwO1xuXG4gIHJvb3RzLmZvckVhY2gocm9vdCA9PiB7XG4gICAgLy8gYXNzaWduIGEgbmFtZSBpZiB0aGUgc291cmNlIGRvZXMgbm90IGhhdmUgYSBuYW1lIHlldFxuICAgIGlmICghcm9vdC5oYXNOYW1lKCkpIHtcbiAgICAgIHJvb3QuZGF0YU5hbWUgPSBgc291cmNlXyR7c291cmNlSW5kZXgrK31gO1xuICAgIH1cblxuICAgIGNvbnN0IG5ld0RhdGE6IFZnRGF0YSA9IHJvb3QuYXNzZW1ibGUoKTtcblxuICAgIHdhbGtUcmVlKHJvb3QsIG5ld0RhdGEpO1xuICB9KTtcblxuICAvLyByZW1vdmUgZW1wdHkgdHJhbnNmb3JtIGFycmF5cyBmb3IgY2xlYW5lciBvdXRwdXRcbiAgZGF0YS5mb3JFYWNoKGQgPT4ge1xuICAgIGlmIChkLnRyYW5zZm9ybS5sZW5ndGggPT09IDApIHtcbiAgICAgIGRlbGV0ZSBkLnRyYW5zZm9ybTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIG1vdmUgc291cmNlcyB3aXRob3V0IHRyYW5zZm9ybXMgKHRoZSBvbmVzIHRoYXQgYXJlIHBvdGVudGlhbGx5IHVzZWQgaW4gbG9va3VwcykgdG8gdGhlIGJlZ2lubmluZ1xuICBkYXRhLnNvcnQoKGEsIGIpID0+IChhLnRyYW5zZm9ybSB8fCBbXSkubGVuZ3RoID09PSAwID8gLTEgOiAoKGIudHJhbnNmb3JtIHx8IFtdKS5sZW5ndGggPT09IDAgPyAxIDogMCkpO1xuXG4gIC8vIG5vdyBmaXggdGhlIGZyb20gcmVmZXJlbmNlcyBpbiBsb29rdXAgdHJhbnNmb3Jtc1xuICBmb3IgKGNvbnN0IGQgb2YgZGF0YSkge1xuICAgIGZvciAoY29uc3QgdCBvZiBkLnRyYW5zZm9ybSB8fCBbXSkge1xuICAgICAgaWYgKHQudHlwZSA9PT0gJ2xvb2t1cCcpIHtcbiAgICAgICAgdC5mcm9tID0gZGF0YUNvbXBvbmVudC5vdXRwdXROb2Rlc1t0LmZyb21dLmdldFNvdXJjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkYXRhO1xufVxuIl19