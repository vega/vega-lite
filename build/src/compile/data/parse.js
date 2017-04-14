"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var facet_1 = require("../facet");
var unit_1 = require("../unit");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var dataflow_1 = require("./dataflow");
var facet_2 = require("./facet");
var formatparse_1 = require("./formatparse");
var nonpositivefilter_1 = require("./nonpositivefilter");
var nullfilter_1 = require("./nullfilter");
var pathorder_1 = require("./pathorder");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var transforms_1 = require("./transforms");
function parseRoot(model, sources) {
    if (model.data || !model.parent) {
        // if the model defines a data source or is the root, create a source node
        var source = new source_1.SourceNode(model);
        var hash = source.hash();
        if (hash in sources) {
            // use a reference if we already have a source
            return sources[hash];
        }
        else {
            // otherwise add a new one
            sources[hash] = source;
            return source;
        }
    }
    else {
        // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
        return model.parent.component.data.facetRoot ? model.parent.component.data.facetRoot : model.parent.component.data.main;
    }
}
/*
Description of the dataflow (http://asciiflow.com/):

     +--------+
     | Source |
     +---+----+
         |
         v
       Parse
         |
         v
     Transforms
(Filter, Compute, ...)
         |
         v
     Null Filter
         |
         v
      Binning
         |
         v
     Timeunit
         |
         v
      +--+--+
      | Raw |
      +-----+
         |
         v
     Aggregate
         |
         v
       Stack
         |
         v
      >0 Filter
         |
         v
     Path Order
         |
         v
   +----------+
   |   Main   +----> Layout
   +----------+
         |
         v
     +-------+
     | Facet |----> Child data...
     +-------+

*/
function parseData(model) {
    var root = parseRoot(model, model.component.data.sources);
    var outputNodes = model.component.data.outputNodes;
    // the current head of the tree that we are appending to
    var head = root;
    var parse = formatparse_1.ParseNode.make(model);
    parse.parent = root;
    head = parse;
    if (model.transforms.length > 0) {
        var _a = transforms_1.parseTransformArray(model), first = _a.first, last = _a.last;
        first.parent = head;
        head = last;
    }
    var nullFilter = nullfilter_1.NullFilterNode.make(model);
    if (nullFilter) {
        nullFilter.parent = head;
        head = nullFilter;
    }
    var bin = bin_1.BinNode.make(model);
    if (bin) {
        bin.parent = head;
        head = bin;
    }
    var tu = timeunit_1.TimeUnitNode.make(model);
    if (tu) {
        tu.parent = head;
        head = tu;
    }
    // add an output node pre aggregation
    var rawName = model.getName(data_1.RAW);
    var raw = new dataflow_1.OutputNode(rawName, data_1.RAW);
    outputNodes[rawName] = raw;
    raw.parent = head;
    head = raw;
    if (model instanceof unit_1.UnitModel) {
        var agg = aggregate_1.AggregateNode.make(model);
        if (agg) {
            agg.parent = head;
            head = agg;
        }
    }
    if (model instanceof unit_1.UnitModel) {
        var stack = stack_1.StackNode.make(model);
        if (stack) {
            stack.parent = head;
            head = stack;
        }
    }
    var nonPosFilter = nonpositivefilter_1.NonPositiveFilterNode.make(model);
    if (nonPosFilter) {
        nonPosFilter.parent = head;
        head = nonPosFilter;
    }
    if (model instanceof unit_1.UnitModel) {
        var order = pathorder_1.OrderNode.make(model);
        if (order) {
            order.parent = head;
            head = order;
        }
    }
    // output node for marks
    var mainName = model.getName(data_1.MAIN);
    var main = new dataflow_1.OutputNode(mainName, data_1.MAIN);
    outputNodes[mainName] = main;
    main.parent = head;
    head = main;
    // add facet marker
    var facetRoot = null;
    if (model instanceof facet_1.FacetModel) {
        var facetName = model.getName('facet');
        facetRoot = new facet_2.FacetNode(model, facetName, main.source);
        outputNodes[facetName] = facetRoot;
        facetRoot.parent = head;
        head = facetRoot;
    }
    return {
        sources: model.component.data.sources,
        outputNodes: outputNodes,
        main: main,
        facetRoot: facetRoot
    };
}
exports.parseData = parseData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXFDO0FBRXJDLGtDQUFvQztBQUVwQyxnQ0FBa0M7QUFDbEMseUNBQTBDO0FBQzFDLDZCQUE4QjtBQUM5Qix1Q0FBb0Q7QUFDcEQsaUNBQWtDO0FBQ2xDLDZDQUF3QztBQUV4Qyx5REFBMEQ7QUFDMUQsMkNBQTRDO0FBQzVDLHlDQUFzQztBQUN0QyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUN4QywyQ0FBaUQ7QUFFakQsbUJBQW1CLEtBQVksRUFBRSxPQUF5QjtJQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEMsMEVBQTBFO1FBQzFFLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEIsOENBQThDO1lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sMEJBQTBCO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04scUdBQXFHO1FBQ3JHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElB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