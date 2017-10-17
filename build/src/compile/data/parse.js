"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var vega_util_1 = require("vega-util");
var data_1 = require("../../data");
var datetime_1 = require("../../datetime");
var filter_1 = require("../../filter");
var log = require("../../log");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
var aggregate_1 = require("./aggregate");
var bin_1 = require("./bin");
var calculate_1 = require("./calculate");
var dataflow_1 = require("./dataflow");
var facet_1 = require("./facet");
var filter_2 = require("./filter");
var filterinvalid_1 = require("./filterinvalid");
var formatparse_1 = require("./formatparse");
var indentifier_1 = require("./indentifier");
var lookup_1 = require("./lookup");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
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
/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
function parseTransformArray(model) {
    var first = null;
    var node;
    var previous;
    var lookupCounter = 0;
    function insert(newNode) {
        if (!first) {
            // A parent may be inserted during node construction
            // (e.g., selection FilterNodes may add a TimeUnitNode).
            first = newNode.parent || newNode;
        }
        else if (newNode.parent) {
            previous.insertAsParentOf(newNode);
        }
        else {
            newNode.parent = previous;
        }
        previous = newNode;
    }
    model.transforms.forEach(function (t) {
        if (transform_1.isCalculate(t)) {
            node = new calculate_1.CalculateNode(t);
        }
        else if (transform_1.isFilter(t)) {
            // Automatically add a parse node for filters with filter objects
            var parse = {};
            var filter = t.filter;
            var val = null;
            // For EqualFilter, just use the equal property.
            // For RangeFilter and OneOfFilter, all array members should have
            // the same type, so we only use the first one.
            if (filter_1.isEqualFilter(filter)) {
                val = filter.equal;
            }
            else if (filter_1.isRangeFilter(filter)) {
                val = filter.range[0];
            }
            else if (filter_1.isOneOfFilter(filter)) {
                val = (filter.oneOf || filter['in'])[0];
            } // else -- for filter expression, we can't infer anything
            if (val) {
                if (datetime_1.isDateTime(val)) {
                    parse[filter['field']] = 'date';
                }
                else if (vega_util_1.isNumber(val)) {
                    parse[filter['field']] = 'number';
                }
                else if (vega_util_1.isString(val)) {
                    parse[filter['field']] = 'string';
                }
            }
            if (util_1.keys(parse).length > 0) {
                var parseNode = new formatparse_1.ParseNode(parse);
                insert(parseNode);
            }
            node = new filter_2.FilterNode(model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            node = bin_1.BinNode.makeFromTransform(t, { model: model });
        }
        else if (transform_1.isTimeUnit(t)) {
            node = timeunit_1.TimeUnitNode.makeFromTransform(t);
        }
        else if (transform_1.isSummarize(t)) {
            node = aggregate_1.AggregateNode.makeFromTransform(t);
            if (selection_1.requiresSelectionId(model)) {
                insert(node);
                node = new indentifier_1.IdentifierNode();
            }
        }
        else if (transform_1.isLookup(t)) {
            node = lookup_1.LookupNode.make(model, t, lookupCounter++);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
        insert(node);
    });
    var last = node;
    return { first: first, last: last };
}
exports.parseTransformArray = parseTransformArray;
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
     Path Order
         |
         v
  Invalid Filter
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
        var ident = new indentifier_1.IdentifierNode();
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
        var _a = parseTransformArray(model), first = _a.first, last = _a.last;
        first.parent = head;
        head = last;
    }
    var parse = formatparse_1.ParseNode.make(model);
    if (parse) {
        parse.parent = head;
        head = parse;
    }
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
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
                var ident = new indentifier_1.IdentifierNode();
                ident.parent = head;
                head = ident;
            }
        }
        var stack = stack_1.StackNode.make(model);
        if (stack) {
            stack.parent = head;
            head = stack;
        }
    }
    if (model_1.isUnitModel(model)) {
        var filter = filterinvalid_1.FilterInvalidNode.make(model);
        if (filter) {
            filter.parent = head;
            head = filter;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUE2QztBQUM3QyxtQ0FBcUM7QUFDckMsMkNBQW9EO0FBQ3BELHVDQUF5RTtBQUN6RSwrQkFBaUM7QUFDakMsNkNBQWdHO0FBQ2hHLG1DQUFzQztBQUN0QyxrQ0FBd0U7QUFDeEUsb0RBQTJEO0FBQzNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMsNkNBQTZDO0FBRTdDLG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUV4QyxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoQywwRUFBMEU7UUFDMUUsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEIsOENBQThDO1lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sMEJBQTBCO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0lBQ0gsQ0FBQztJQUFDLElBQUksQ0FBQyxDQUFDO1FBQ04scUdBQXFHO1FBQ3JHLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzFILENBQUM7QUFDSCxDQUFDO0FBR0Q7O0dBRUc7QUFDSCw2QkFBb0MsS0FBWTtJQUM5QyxJQUFJLEtBQUssR0FBaUIsSUFBSSxDQUFDO0lBQy9CLElBQUksSUFBa0IsQ0FBQztJQUN2QixJQUFJLFFBQXNCLENBQUM7SUFDM0IsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBRXRCLGdCQUFnQixPQUFxQjtRQUNuQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDWCxvREFBb0Q7WUFDcEQsd0RBQXdEO1lBQ3hELEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQztRQUNwQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQzFCLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNyQyxDQUFDO1FBQUMsSUFBSSxDQUFDLENBQUM7WUFDTixPQUFPLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztRQUM1QixDQUFDO1FBRUQsUUFBUSxHQUFHLE9BQU8sQ0FBQztJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsVUFBQSxDQUFDO1FBQ3hCLEVBQUUsQ0FBQyxDQUFDLHVCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksR0FBRyxJQUFJLHlCQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixpRUFBaUU7WUFDakUsSUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUM7WUFDeEIsSUFBSSxHQUFHLEdBQXlDLElBQUksQ0FBQztZQUNyRCxnREFBZ0Q7WUFDaEQsaUVBQWlFO1lBQ2pFLCtDQUErQztZQUMvQyxFQUFFLENBQUMsQ0FBQyxzQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUM7WUFDckIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxzQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQztZQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxzQkFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDakMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQyxDQUFDLENBQUMseURBQXlEO1lBRTNELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsRUFBRSxDQUFDLENBQUMscUJBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3BCLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUM7Z0JBQ2xDLENBQUM7Z0JBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG9CQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN6QixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO2dCQUNwQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDcEMsQ0FBQztZQUNILENBQUM7WUFFRCxFQUFFLENBQUMsQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzNCLElBQU0sU0FBUyxHQUFHLElBQUksdUJBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3BCLENBQUM7WUFFRCxJQUFJLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxpQkFBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixJQUFJLEdBQUcsYUFBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsRUFBRSxFQUFDLEtBQUssT0FBQSxFQUFDLENBQUMsQ0FBQztRQUMvQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHNCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksR0FBRyx1QkFBWSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsdUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxHQUFHLHlCQUFhLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFFMUMsRUFBRSxDQUFDLENBQUMsK0JBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxHQUFHLElBQUksNEJBQWMsRUFBRSxDQUFDO1lBQzlCLENBQUM7UUFDSCxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLG9CQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksR0FBRyxtQkFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFDcEQsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNmLENBQUMsQ0FBQyxDQUFDO0lBRUgsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRWxCLE1BQU0sQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUM7QUFDdkIsQ0FBQztBQS9FRCxrREErRUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBZ0RFO0FBRUYsbUJBQTBCLEtBQVk7SUFDcEMsSUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUU1RCxJQUFNLFdBQVcsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDckQsSUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQUVyRSx3REFBd0Q7SUFDeEQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRWhCLGlFQUFpRTtJQUNqRSxrRUFBa0U7SUFDbEUsc0VBQXNFO0lBQ3RFLHdFQUF3RTtJQUN4RSwrREFBK0Q7SUFDL0QsNEJBQTRCO0lBQzVCLEVBQUUsQ0FBQyxDQUFDLCtCQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBYyxFQUFFLENBQUM7UUFDbkMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxtRUFBbUU7SUFDbkUsK0dBQStHO0lBQy9HLElBQU0sYUFBYSxHQUFHLEtBQUssQ0FBQyxNQUFNLElBQUksb0JBQVksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDakUsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxvQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QyxFQUFFLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLElBQU0sR0FBRyxHQUFHLGFBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUMvQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNsQixJQUFJLEdBQUcsR0FBRyxDQUFDO1lBQ2IsQ0FBQztRQUNILENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxQixJQUFBLCtCQUEwQyxFQUF6QyxnQkFBSyxFQUFFLGNBQUksQ0FBK0I7UUFDakQsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNkLENBQUM7SUFFRCxJQUFNLEtBQUssR0FBRyx1QkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ1YsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDcEIsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNmLENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLG9CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlDLEVBQUUsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNiLENBQUM7UUFDSCxDQUFDO1FBRUQsSUFBTSxFQUFFLEdBQUcsdUJBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ1AsRUFBRSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDakIsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNaLENBQUM7SUFDSCxDQUFDO0lBRUQscUNBQXFDO0lBQ3JDLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBRyxDQUFDLENBQUM7SUFDbkMsSUFBTSxHQUFHLEdBQUcsSUFBSSxxQkFBVSxDQUFDLE9BQU8sRUFBRSxVQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUM5RCxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzNCLEdBQUcsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ2xCLElBQUksR0FBRyxHQUFHLENBQUM7SUFFWCxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFNLEdBQUcsR0FBRyx5QkFBYSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xELEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDUixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNsQixJQUFJLEdBQUcsR0FBRyxDQUFDO1lBRVgsRUFBRSxDQUFDLENBQUMsK0JBQW1CLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMvQixJQUFNLEtBQUssR0FBRyxJQUFJLDRCQUFjLEVBQUUsQ0FBQztnQkFDbkMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxLQUFLLENBQUM7WUFDZixDQUFDO1FBQ0gsQ0FBQztRQUVELElBQU0sS0FBSyxHQUFHLGlCQUFTLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDVixLQUFLLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNwQixJQUFJLEdBQUcsS0FBSyxDQUFDO1FBQ2YsQ0FBQztJQUNILENBQUM7SUFFRCxFQUFFLENBQUMsQ0FBQyxtQkFBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QixJQUFNLE1BQU0sR0FBRyxpQ0FBaUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNYLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ3JCLElBQUksR0FBRyxNQUFNLENBQUM7UUFDaEIsQ0FBQztJQUNILENBQUM7SUFFRCx3QkFBd0I7SUFDeEIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsQ0FBQztJQUNyQyxJQUFNLElBQUksR0FBRyxJQUFJLHFCQUFVLENBQUMsUUFBUSxFQUFFLFdBQUksRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0lBQ2pFLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDN0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDbkIsSUFBSSxHQUFHLElBQUksQ0FBQztJQUVaLG1CQUFtQjtJQUNuQixJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUM7SUFDckIsRUFBRSxDQUFDLENBQUMsb0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEIsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxTQUFTLEdBQUcsSUFBSSxpQkFBUyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDOUQsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNuQyxTQUFTLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFRCx5RkFBeUY7SUFDekYsSUFBTSxhQUFhLHdCQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU3RixNQUFNLHNCQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUN2QixXQUFXLGFBQUE7UUFDWCxtQkFBbUIscUJBQUE7UUFDbkIsR0FBRyxLQUFBO1FBQ0gsSUFBSSxNQUFBO1FBQ0osU0FBUyxXQUFBO1FBQ1QsYUFBYSxlQUFBLElBQ2I7QUFDSixDQUFDO0FBL0hELDhCQStIQyJ9