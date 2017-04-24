"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var facet_1 = require("../facet");
var layer_1 = require("../layer");
var model_1 = require("../model");
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
   |   Main   |
   +----------+
         |
         v
     +-------+
     | Facet |----> "column", "column-layout", and "row"
     +-------+
         |
         v
  ...Child data...

*/
function parseData(model) {
    var root = parseRoot(model, model.component.data.sources);
    var outputNodes = model.component.data.outputNodes;
    // the current head of the tree that we are appending to
    var head = root;
    var parse = formatparse_1.ParseNode.make(model);
    if (parse) {
        parse.parent = root;
        head = parse;
    }
    // HACK: This is equivalent for merging bin extent for union scale.
    // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
    var parentIsLayer = model.parent && (model.parent instanceof layer_1.LayerModel);
    if (model instanceof model_1.ModelWithField) {
        if (parentIsLayer) {
            var bin = bin_1.BinNode.make(model);
            if (bin) {
                bin.parent = head;
                head = bin;
            }
        }
    }
    if (model.transforms.length > 0) {
        var _a = transforms_1.parseTransformArray(model), first = _a.first, last = _a.last;
        first.parent = head;
        head = last;
    }
    if (model instanceof model_1.ModelWithField) {
        var nullFilter = nullfilter_1.NullFilterNode.make(model);
        if (nullFilter) {
            nullFilter.parent = head;
            head = nullFilter;
        }
        if (!parentIsLayer) {
            var bin = bin_1.BinNode.make(model);
            if (bin) {
                bin.parent = head;
                head = bin;
            }
        }
        var tu = timeunit_1.TimeUnitNode.make(model);
        if (tu) {
            tu.parent = head;
            head = tu;
        }
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
        var stack = stack_1.StackNode.make(model);
        if (stack) {
            stack.parent = head;
            head = stack;
        }
        var nonPosFilter = nonpositivefilter_1.NonPositiveFilterNode.make(model);
        if (nonPosFilter) {
            nonPosFilter.parent = head;
            head = nonPosFilter;
        }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXFDO0FBRXJDLGtDQUFvQztBQUNwQyxrQ0FBb0M7QUFDcEMsa0NBQStDO0FBQy9DLGdDQUFrQztBQUNsQyx5Q0FBMEM7QUFDMUMsNkJBQThCO0FBQzlCLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsNkNBQXdDO0FBRXhDLHlEQUEwRDtBQUMxRCwyQ0FBNEM7QUFDNUMseUNBQXNDO0FBQ3RDLG1DQUFvQztBQUNwQyxpQ0FBa0M7QUFDbEMsdUNBQXdDO0FBQ3hDLDJDQUFpRDtBQUVqRCxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoQywwRUFBMEU7UUFDMUUsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixFQUFFLENBQUMsQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNwQiw4Q0FBOEM7WUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTiwwQkFBMEI7WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QixNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ2hCLENBQUM7SUFDSCxDQUFDO0lBQUMsSUFBSSxDQUFDLENBQUM7UUFDTixxR0FBcUc7UUFDckcsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxD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