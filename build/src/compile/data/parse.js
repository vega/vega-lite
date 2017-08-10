"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var formatparse_1 = require("./formatparse");
var nonpositivefilter_1 = require("./nonpositivefilter");
var nullfilter_1 = require("./nullfilter");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var transforms_1 = require("./transforms");
function parseRoot(model, sources) {
    if (model.data || !model.parent) {
        // if the model defines a data source or is the root, create a source node
        var source = new source_1.SourceNode(model.data);
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
     Transforms
(Filter, Calculate, ...)
         |
         v
     FormatParse
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
    var outputNodeRefCounts = model.component.data.outputNodeRefCounts;
    // the current head of the tree that we are appending to
    var head = root;
    // Default discrete selections require an identifier transform to
    // uniquely identify data points as the _id field is volatile. Add
    // this transform at the head of our pipeline such that the identifier
    // field is available for all subsequent datasets. Additional identifier
    // transforms will be necessary when new tuples are constructed
    // (e.g., post-aggregation).
    if (selection_1.requiresSelectionId(model) && !model.parent) {
        var ident = new transforms_1.IdentifierNode();
        ident.parent = head;
        head = ident;
    }
    // HACK: This is equivalent for merging bin extent for union scale.
    // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
    var parentIsLayer = model.parent && model_1.isLayerModel(model.parent);
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        if (parentIsLayer) {
            var bin = bin_1.BinNode.makeBinFromEncoding(model);
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
    var parse = formatparse_1.ParseNode.make(model);
    if (parse) {
        parse.parent = head;
        head = parse;
    }
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        var nullFilter = nullfilter_1.NullFilterNode.make(model);
        if (nullFilter) {
            nullFilter.parent = head;
            head = nullFilter;
        }
        if (!parentIsLayer) {
            var bin = bin_1.BinNode.makeBinFromEncoding(model);
            if (bin) {
                bin.parent = head;
                head = bin;
            }
        }
        var tu = timeunit_1.TimeUnitNode.makeFromEncoding(model);
        if (tu) {
            tu.parent = head;
            head = tu;
        }
    }
    // add an output node pre aggregation
    var rawName = model.getName(data_1.RAW);
    var raw = new dataflow_1.OutputNode(rawName, data_1.RAW, outputNodeRefCounts);
    outputNodes[rawName] = raw;
    raw.parent = head;
    head = raw;
    if (model_1.isUnitModel(model)) {
        var agg = aggregate_1.AggregateNode.makeFromEncoding(model);
        if (agg) {
            agg.parent = head;
            head = agg;
            if (selection_1.requiresSelectionId(model)) {
                var ident = new transforms_1.IdentifierNode();
                ident.parent = head;
                head = ident;
            }
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
    // output node for marks
    var mainName = model.getName(data_1.MAIN);
    var main = new dataflow_1.OutputNode(mainName, data_1.MAIN, outputNodeRefCounts);
    outputNodes[mainName] = main;
    main.parent = head;
    head = main;
    // add facet marker
    var facetRoot = null;
    if (model_1.isFacetModel(model)) {
        var facetName = model.getName('facet');
        facetRoot = new facet_1.FacetNode(model, facetName, main.getSource());
        outputNodes[facetName] = facetRoot;
        facetRoot.parent = head;
        head = facetRoot;
    }
    // add the format parse from this model so that children don't parse the same field again
    var ancestorParse = tslib_1.__assign({}, model.component.data.ancestorParse, (parse ? parse.parse : {}));
    return tslib_1.__assign({}, model.component.data, { outputNodes: outputNodes,
        outputNodeRefCounts: outputNodeRefCounts,
        raw: raw,
        main: main,
        facetRoot: facetRoot,
        ancestorParse: ancestorParse });
}
exports.parseData = parseData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxQztBQUlyQyxrQ0FBd0Y7QUFDeEYsb0RBQTJEO0FBRTNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIsdUNBQW9EO0FBQ3BELGlDQUFrQztBQUNsQyw2Q0FBd0M7QUFFeEMseURBQTBEO0FBQzFELDJDQUE0QztBQUM1QyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUN4QywyQ0FBaUU7QUFHakUsbUJBQW1CLEtBQVksRUFBRSxPQUF5QjtJQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEMsMEVBQTBFO1FBQzFFLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHFHQUFxRztRQUNyRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJ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