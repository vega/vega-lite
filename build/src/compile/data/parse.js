"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("../../data");
var facet_1 = require("../facet");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQXFDO0FBRXJDLGtDQUFvQztBQUNwQyxrQ0FBK0M7QUFDL0MsZ0NBQWtDO0FBQ2xDLHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIsdUNBQW9EO0FBQ3BELGlDQUFrQztBQUNsQyw2Q0FBd0M7QUFFeEMseURBQTBEO0FBQzFELDJDQUE0QztBQUM1Qyx5Q0FBc0M7QUFDdEMsbUNBQW9DO0FBQ3BDLGlDQUFrQztBQUNsQyx1Q0FBd0M7QUFDeEMsMkNBQWlEO0FBRWpELG1CQUFtQixLQUFZLEVBQUUsT0FBeUI7SUFDeEQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLDBFQUEwRTtRQUMxRSxJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDckMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHFHQUFxRztRQUNyRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDMUgsQ0FBQztBQUNILENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFxREU7QUFFRixtQkFBMEIsS0FBWTtJQUNwQyxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRTVELElBQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUVyRCx3REFBd0Q7SUFDeEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRWhCLElBQU0sS0FBSyxHQUFHLHVCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDVixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNwQixJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ2YsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBQSw0Q0FBMEMsRUFBekMsZ0JBQUssRUFBRSxjQUFJLENBQStCO1FBQ2pELEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLHNCQUFjLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLElBQU0sVUFBVSxHQUFHLDJCQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7WUFDZixVQUFVLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUN6QixJQUFJLEdBQUcsVUFBVSxDQUFDO1FBQ3BCLENBQUM7UUFFRCxJQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ2IsQ0FBQztRQUVELElBQU0sRUFBRSxHQUFHLHVCQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDUCxFQUFFLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ1osQ0FBQztJQUNILENBQUM7SUFFRCxxQ0FBcUM7SUFDckMsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFHLENBQUMsQ0FBQztJQUNuQyxJQUFNLEdBQUcsR0FBRyxJQUFJLHFCQUFVLENBQUMsT0FBTyxFQUFFLFVBQUcsQ0FBQyxDQUFDO0lBQ3pDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDM0IsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztJQUVYLEVBQUUsQ0FBQyxDQUFDLEtBQUssWUFBWSxnQkFBUyxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFNLEdBQUcsR0FBRyx5QkFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1IsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNiLENBQUM7UUFFRCxJQUFNLEtBQUssR0FBRyxpQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNmLENBQUM7UUFFRCxJQUFNLFlBQVksR0FBRyx5Q0FBcUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdkQsRUFBRSxDQUFDLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztZQUNqQixZQUFZLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUMzQixJQUFJLEdBQUcsWUFBWSxDQUFDO1FBQ3RCLENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLGdCQUFTLENBQUMsQ0FBQyxDQUFDO1FBQy9CLElBQU0sS0FBSyxHQUFHLHFCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsQ0FBQztJQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLHFCQUFVLENBQUMsUUFBUSxFQUFFLFdBQUksQ0FBQyxDQUFDO0lBQzVDLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBSSxHQUFHLElBQUksQ0FBQztJQUVaLG1CQUFtQjtJQUNuQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDckIsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLGtCQUFVLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsU0FBUyxHQUFHLElBQUksaUJBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN6RCxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQ25DLFNBQVMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksR0FBRyxTQUFTLENBQUM7SUFDbkIsQ0FBQztJQUVELE1BQU0sQ0FBQztRQUNMLE9BQU8sRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPO1FBQ3JDLFdBQVcsYUFBQTtRQUNYLElBQUksTUFBQTtRQUNKLFNBQVMsV0FBQTtLQUNWLENBQUM7QUFDSixDQUFDO0FBbEdELDhCQWtHQyJ9