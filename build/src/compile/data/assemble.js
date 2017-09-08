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
var formatparse_1 = require("./formatparse");
var indentifier_1 = require("./indentifier");
var lookup_1 = require("./lookup");
var nonpositivefilter_1 = require("./nonpositivefilter");
var nullfilter_1 = require("./nullfilter");
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
                dataSource.format = tslib_1.__assign({}, dataSource.format || {}, { parse: node.assembleFormatParse() });
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
            node instanceof nullfilter_1.NullFilterNode ||
            node instanceof calculate_1.CalculateNode ||
            node instanceof aggregate_1.AggregateNode ||
            node instanceof lookup_1.LookupNode ||
            node instanceof indentifier_1.IdentifierNode) {
            dataSource.transform.push(node.assemble());
        }
        if (node instanceof nonpositivefilter_1.NonPositiveFilterNode ||
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNzZW1ibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL2Fzc2VtYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxQztBQUNyQyxtQ0FBZ0M7QUFHaEMseUNBQTBDO0FBQzFDLDZCQUE4QjtBQUM5Qix5Q0FBMEM7QUFDMUMsdUNBQW9EO0FBQ3BELGlDQUFrQztBQUNsQyxtQ0FBb0M7QUFDcEMsNkNBQXdDO0FBQ3hDLDZDQUE2QztBQUM3QyxtQ0FBb0M7QUFDcEMseURBQTBEO0FBQzFELDJDQUE0QztBQUM1QyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUV4Qzs7R0FFRztBQUNILDJCQUEyQjtBQUMzQixlQUFlLElBQWtCO0lBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSSxJQUFJLENBQUMsV0FBbUIsQ0FBQyxJQUFJLElBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFLLElBQUksQ0FBQyxTQUFTLE1BQUcsR0FBRyxFQUFFLGFBQzFGLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsVUFBQSxDQUFDO1FBQ2xCLE1BQU0sQ0FBQyxLQUFJLENBQUMsQ0FBQyxXQUFtQixDQUFDLElBQUksSUFBRyxDQUFDLENBQUMsU0FBUyxHQUFHLE9BQUssQ0FBQyxDQUFDLFNBQVMsTUFBRyxHQUFHLEVBQUUsQ0FBRSxDQUFDO0lBQ25GLENBQUMsQ0FBQyxDQUNGLENBQUMsQ0FBQztJQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0IsQ0FBQztBQUVELHNCQUFzQixJQUFjO0lBQ2xDLHNCQUFzQjtJQUN0QixJQUFJLFlBQVksR0FBRyxDQUFDLENBQUM7SUFFckI7O09BRUc7SUFDSCxrQkFBa0IsSUFBa0IsRUFBRSxVQUFrQjtR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