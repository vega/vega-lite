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
        else if (transform_1.isAggregate(t)) {
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
    var ancestorParse = __assign({}, model.component.data.ancestorParse, (parse ? parse.parse : {}));
    return __assign({}, model.component.data, { outputNodes: outputNodes,
        outputNodeRefCounts: outputNodeRefCounts,
        raw: raw,
        main: main,
        facetRoot: facetRoot,
        ancestorParse: ancestorParse });
}
exports.parseData = parseData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsbUNBQXFDO0FBQ3JDLDJDQUFvRDtBQUNwRCx1Q0FBeUU7QUFDekUsK0JBQWlDO0FBQ2pDLDZDQUFnRztBQUNoRyxtQ0FBc0M7QUFDdEMsa0NBQXdFO0FBQ3hFLG9EQUEyRDtBQUMzRCx5Q0FBMEM7QUFDMUMsNkJBQThCO0FBQzlCLHlDQUEwQztBQUMxQyx1Q0FBb0Q7QUFDcEQsaUNBQWtDO0FBQ2xDLG1DQUFvQztBQUNwQyxpREFBa0Q7QUFDbEQsNkNBQXdDO0FBQ3hDLDZDQUE2QztBQUU3QyxtQ0FBb0M7QUFDcEMsbUNBQW9DO0FBQ3BDLGlDQUFrQztBQUNsQyx1Q0FBd0M7QUFFeEMsbUJBQW1CLEtBQVksRUFBRSxPQUF5QjtJQUN4RCxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDaEMsMEVBQTBFO1FBQzFFLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLDhDQUE4QztZQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDaEIsQ0FBQztJQUNILENBQUM7SUFBQyxJQUFJLENBQUMsQ0FBQztRQUNOLHFHQUFxRztRQUNyRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztJQUMxSCxDQUFDO0FBQ0gsQ0FBQztBQUdEOztHQUVHO0FBQ0gsNkJBQW9DLEtBQVk7SUFDOUMsSUFBSSxLQUFLLEdBQWlCLElBQUksQ0FBQztJQUMvQixJQUFJLElBQWtCLENBQUM7SUFDdkIsSUFBSSxRQUFzQixDQUFDO0lBQzNCLElBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztJQUV0QixnQkFBZ0IsT0FBcUI7UUFDbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1gsb0RBQW9EO1lBQ3BELHdEQUF3RDtZQUN4RCxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sSUFBSSxPQUFPLENBQUM7UUFDcEMsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUMxQixRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDckMsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sT0FBTyxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDNUIsQ0FBQztRQUVELFFBQVEsR0FBRyxPQUFPLENBQUM7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztRQUN4QixFQUFFLENBQUMsQ0FBQyx1QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixJQUFJLEdBQUcsSUFBSSx5QkFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlCLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsb0JBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsaUVBQWlFO1lBQ2pFLElBQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztZQUNqQixJQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDO1lBQ3hCLElBQUksR0FBRyxHQUF5QyxJQUFJLENBQUM7WUFDckQsZ0RBQWdEO1lBQ2hELGlFQUFpRTtZQUNqRSwrQ0FBK0M7WUFDL0MsRUFBRSxDQUFDLENBQUMsc0JBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzFCLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDO1lBQ3JCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsc0JBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLEdBQUcsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUM7WUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsc0JBQWEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2pDLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUMsQ0FBQyxDQUFDLHlEQUF5RDtZQUUzRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNSLEVBQUUsQ0FBQyxDQUFDLHFCQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDO2dCQUNsQyxDQUFDO2dCQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztnQkFDcEMsQ0FBQztnQkFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsb0JBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUM7Z0JBQ3BDLENBQUM7WUFDSCxDQUFDO1lBRUQsRUFBRSxDQUFDLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUMzQixJQUFNLFNBQVMsR0FBRyxJQUFJLHVCQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUNwQixDQUFDO1lBRUQsSUFBSSxHQUFHLElBQUksbUJBQVUsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUM7UUFBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsaUJBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEIsSUFBSSxHQUFHLGFBQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEVBQUUsRUFBQyxLQUFLLE9BQUEsRUFBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxzQkFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN6QixJQUFJLEdBQUcsdUJBQVksQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMzQyxDQUFDO1FBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLHVCQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksR0FBRyx5QkFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBRTFDLEVBQUUsQ0FBQyxDQUFDLCtCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNiLElBQUksR0FBRyxJQUFJLDRCQUFjLEVBQUUsQ0FBQztZQUM5QixDQUFDO1FBQ0gsQ0FBQztRQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxvQkFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QixJQUFJLEdBQUcsbUJBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1FBQ3BELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE1BQU0sQ0FBQztRQUNULENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDZixDQUFDLENBQUMsQ0FBQztJQUVILElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQztJQUVsQixNQUFNLENBQUMsRUFBQyxLQUFLLE9BQUEsRUFBRSxJQUFJLE1BQUEsRUFBQyxDQUFDO0FBQ3ZCLENBQUM7QUEvRUQsa0RBK0VDO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztFQWdERTtBQUVGLG1CQUEwQixLQUFZO0lBQ3BDLElBQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFNUQsSUFBTSxXQUFXLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3JELElBQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7SUFFckUsd0RBQXdEO0lBQ3hELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUVoQixpRUFBaUU7SUFDakUsa0VBQWtFO0lBQ2xFLHNFQUFzRTtJQUN0RSx3RUFBd0U7SUFDeEUsK0RBQStEO0lBQy9ELDRCQUE0QjtJQUM1QixFQUFFLENBQUMsQ0FBQywrQkFBbUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1FBQ2hELElBQU0sS0FBSyxHQUFHLElBQUksNEJBQWMsRUFBRSxDQUFDO1FBQ25DLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsbUVBQW1FO0lBQ25FLCtHQUErRztJQUMvRyxJQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsTUFBTSxJQUFJLG9CQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLEVBQUUsQ0FBQyxDQUFDLG1CQUFXLENBQUMsS0FBSyxDQUFDLElBQUksb0JBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztZQUNsQixJQUFNLEdBQUcsR0FBRyxhQUFPLENBQUMsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDL0MsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztnQkFDUixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUNiLENBQUM7UUFDSCxDQUFDO0lBQ0gsQ0FBQztJQUVELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsSUFBQSwrQkFBMEMsRUFBekMsZ0JBQUssRUFBRSxjQUFJLENBQStCO1FBQ2pELEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBRUQsSUFBTSxLQUFLLEdBQUcsdUJBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNWLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksR0FBRyxLQUFLLENBQUM7SUFDZixDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxvQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU5QyxFQUFFLENBQUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7WUFDbkIsSUFBTSxHQUFHLEdBQUcsYUFBTyxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ1IsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ2xCLElBQUksR0FBRyxHQUFHLENBQUM7WUFDYixDQUFDO1FBQ0gsQ0FBQztRQUVELElBQU0sRUFBRSxHQUFHLHVCQUFZLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEQsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNQLEVBQUUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ2pCLElBQUksR0FBRyxFQUFFLENBQUM7UUFDWixDQUFDO0lBQ0gsQ0FBQztJQUVELHFDQUFxQztJQUNyQyxJQUFNLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQUcsQ0FBQyxDQUFDO0lBQ25DLElBQU0sR0FBRyxHQUFHLElBQUkscUJBQVUsQ0FBQyxPQUFPLEVBQUUsVUFBRyxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDOUQsV0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsQ0FBQztJQUMzQixHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNsQixJQUFJLEdBQUcsR0FBRyxDQUFDO0lBRVgsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBTSxHQUFHLEdBQUcseUJBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsRCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQ1IsR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUVYLEVBQUUsQ0FBQyxDQUFDLCtCQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsSUFBTSxLQUFLLEdBQUcsSUFBSSw0QkFBYyxFQUFFLENBQUM7Z0JBQ25DLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNwQixJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQ2YsQ0FBQztRQUNILENBQUM7UUFFRCxJQUFNLEtBQUssR0FBRyxpQkFBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQyxFQUFFLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ1YsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxHQUFHLEtBQUssQ0FBQztRQUNmLENBQUM7SUFDSCxDQUFDO0lBRUQsRUFBRSxDQUFDLENBQUMsbUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkIsSUFBTSxNQUFNLEdBQUcsaUNBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzdDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDWCxNQUFNLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLEdBQUcsTUFBTSxDQUFDO1FBQ2hCLENBQUM7SUFDSCxDQUFDO0lBRUQsd0JBQXdCO0lBQ3hCLElBQU0sUUFBUSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsV0FBSSxDQUFDLENBQUM7SUFDckMsSUFBTSxJQUFJLEdBQUcsSUFBSSxxQkFBVSxDQUFDLFFBQVEsRUFBRSxXQUFJLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNqRSxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ25CLElBQUksR0FBRyxJQUFJLENBQUM7SUFFWixtQkFBbUI7SUFDbkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLEVBQUUsQ0FBQyxDQUFDLG9CQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hCLElBQU0sU0FBUyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDekMsU0FBUyxHQUFHLElBQUksaUJBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQzlELFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDbkMsU0FBUyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDeEIsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQseUZBQXlGO0lBQ3pGLElBQU0sYUFBYSxnQkFBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0YsTUFBTSxjQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUN2QixXQUFXLGFBQUE7UUFDWCxtQkFBbUIscUJBQUE7UUFDbkIsR0FBRyxLQUFBO1FBQ0gsSUFBSSxNQUFBO1FBQ0osU0FBUyxXQUFBO1FBQ1QsYUFBYSxlQUFBLElBQ2I7QUFDSixDQUFDO0FBL0hELDhCQStIQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXIsIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0IHtpc0VxdWFsRmlsdGVyLCBpc09uZU9mRmlsdGVyLCBpc1JhbmdlRmlsdGVyfSBmcm9tICcuLi8uLi9maWx0ZXInO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBpc0JpbiwgaXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBpc0xvb2t1cCwgaXNUaW1lVW5pdH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7cmVxdWlyZXNTZWxlY3Rpb25JZH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0lkZW50aWZpZXJOb2RlfSBmcm9tICcuL2luZGVudGlmaWVyJztcbmltcG9ydCB7RGF0YUNvbXBvbmVudH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQge0xvb2t1cE5vZGV9IGZyb20gJy4vbG9va3VwJztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHtTdGFja05vZGV9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4vdGltZXVuaXQnO1xuXG5mdW5jdGlvbiBwYXJzZVJvb3QobW9kZWw6IE1vZGVsLCBzb3VyY2VzOiBEaWN0PFNvdXJjZU5vZGU+KTogRGF0YUZsb3dOb2RlIHtcbiAgaWYgKG1vZGVsLmRhdGEgfHwgIW1vZGVsLnBhcmVudCkge1xuICAgIC8vIGlmIHRoZSBtb2RlbCBkZWZpbmVzIGEgZGF0YSBzb3VyY2Ugb3IgaXMgdGhlIHJvb3QsIGNyZWF0ZSBhIHNvdXJjZSBub2RlXG4gICAgY29uc3Qgc291cmNlID0gbmV3IFNvdXJjZU5vZGUobW9kZWwuZGF0YSk7XG4gICAgY29uc3QgaGFzaCA9IHNvdXJjZS5oYXNoKCk7XG4gICAgaWYgKGhhc2ggaW4gc291cmNlcykge1xuICAgICAgLy8gdXNlIGEgcmVmZXJlbmNlIGlmIHdlIGFscmVhZHkgaGF2ZSBhIHNvdXJjZVxuICAgICAgcmV0dXJuIHNvdXJjZXNbaGFzaF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBhZGQgYSBuZXcgb25lXG4gICAgICBzb3VyY2VzW2hhc2hdID0gc291cmNlO1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHNvdXJjZSBkZWZpbmVkIChvdmVycmlkaW5nIHBhcmVudCdzIGRhdGEpLCB1c2UgdGhlIHBhcmVudCdzIGZhY2V0IHJvb3Qgb3IgbWFpbi5cbiAgICByZXR1cm4gbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdCA/IG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgOiBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEubWFpbjtcbiAgfVxufVxuXG5cbi8qKlxuICogUGFyc2VzIGEgdHJhbnNmb3JtcyBhcnJheSBpbnRvIGEgY2hhaW4gb2YgY29ubmVjdGVkIGRhdGFmbG93IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2Zvcm1BcnJheShtb2RlbDogTW9kZWwpIHtcbiAgbGV0IGZpcnN0OiBEYXRhRmxvd05vZGUgPSBudWxsO1xuICBsZXQgbm9kZTogRGF0YUZsb3dOb2RlO1xuICBsZXQgcHJldmlvdXM6IERhdGFGbG93Tm9kZTtcbiAgbGV0IGxvb2t1cENvdW50ZXIgPSAwO1xuXG4gIGZ1bmN0aW9uIGluc2VydChuZXdOb2RlOiBEYXRhRmxvd05vZGUpIHtcbiAgICBpZiAoIWZpcnN0KSB7XG4gICAgICAvLyBBIHBhcmVudCBtYXkgYmUgaW5zZXJ0ZWQgZHVyaW5nIG5vZGUgY29uc3RydWN0aW9uXG4gICAgICAvLyAoZS5nLiwgc2VsZWN0aW9uIEZpbHRlck5vZGVzIG1heSBhZGQgYSBUaW1lVW5pdE5vZGUpLlxuICAgICAgZmlyc3QgPSBuZXdOb2RlLnBhcmVudCB8fCBuZXdOb2RlO1xuICAgIH0gZWxzZSBpZiAobmV3Tm9kZS5wYXJlbnQpIHtcbiAgICAgIHByZXZpb3VzLmluc2VydEFzUGFyZW50T2YobmV3Tm9kZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld05vZGUucGFyZW50ID0gcHJldmlvdXM7XG4gICAgfVxuXG4gICAgcHJldmlvdXMgPSBuZXdOb2RlO1xuICB9XG5cbiAgbW9kZWwudHJhbnNmb3Jtcy5mb3JFYWNoKHQgPT4ge1xuICAgIGlmIChpc0NhbGN1bGF0ZSh0KSkge1xuICAgICAgbm9kZSA9IG5ldyBDYWxjdWxhdGVOb2RlKHQpO1xuICAgIH0gZWxzZSBpZiAoaXNGaWx0ZXIodCkpIHtcbiAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRkIGEgcGFyc2Ugbm9kZSBmb3IgZmlsdGVycyB3aXRoIGZpbHRlciBvYmplY3RzXG4gICAgICBjb25zdCBwYXJzZSA9IHt9O1xuICAgICAgY29uc3QgZmlsdGVyID0gdC5maWx0ZXI7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgRGF0ZVRpbWUgPSBudWxsO1xuICAgICAgLy8gRm9yIEVxdWFsRmlsdGVyLCBqdXN0IHVzZSB0aGUgZXF1YWwgcHJvcGVydHkuXG4gICAgICAvLyBGb3IgUmFuZ2VGaWx0ZXIgYW5kIE9uZU9mRmlsdGVyLCBhbGwgYXJyYXkgbWVtYmVycyBzaG91bGQgaGF2ZVxuICAgICAgLy8gdGhlIHNhbWUgdHlwZSwgc28gd2Ugb25seSB1c2UgdGhlIGZpcnN0IG9uZS5cbiAgICAgIGlmIChpc0VxdWFsRmlsdGVyKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gZmlsdGVyLmVxdWFsO1xuICAgICAgfSBlbHNlIGlmIChpc1JhbmdlRmlsdGVyKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gZmlsdGVyLnJhbmdlWzBdO1xuICAgICAgfSBlbHNlIGlmIChpc09uZU9mRmlsdGVyKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gKGZpbHRlci5vbmVPZiB8fCBmaWx0ZXJbJ2luJ10pWzBdO1xuICAgICAgfSAvLyBlbHNlIC0tIGZvciBmaWx0ZXIgZXhwcmVzc2lvbiwgd2UgY2FuJ3QgaW5mZXIgYW55dGhpbmdcblxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBpZiAoaXNEYXRlVGltZSh2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdudW1iZXInO1xuICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICBwYXJzZVtmaWx0ZXJbJ2ZpZWxkJ11dID0gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY29uc3QgcGFyc2VOb2RlID0gbmV3IFBhcnNlTm9kZShwYXJzZSk7XG4gICAgICAgIGluc2VydChwYXJzZU5vZGUpO1xuICAgICAgfVxuXG4gICAgICBub2RlID0gbmV3IEZpbHRlck5vZGUobW9kZWwsIHQuZmlsdGVyKTtcbiAgICB9IGVsc2UgaWYgKGlzQmluKHQpKSB7XG4gICAgICBub2RlID0gQmluTm9kZS5tYWtlRnJvbVRyYW5zZm9ybSh0LCB7bW9kZWx9KTtcbiAgICB9IGVsc2UgaWYgKGlzVGltZVVuaXQodCkpIHtcbiAgICAgIG5vZGUgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21UcmFuc2Zvcm0odCk7XG4gICAgfSBlbHNlIGlmIChpc0FnZ3JlZ2F0ZSh0KSkge1xuICAgICAgbm9kZSA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21UcmFuc2Zvcm0odCk7XG5cbiAgICAgIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSkge1xuICAgICAgICBpbnNlcnQobm9kZSk7XG4gICAgICAgIG5vZGUgPSBuZXcgSWRlbnRpZmllck5vZGUoKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTG9va3VwKHQpKSB7XG4gICAgICBub2RlID0gTG9va3VwTm9kZS5tYWtlKG1vZGVsLCB0LCBsb29rdXBDb3VudGVyKyspO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkVHJhbnNmb3JtSWdub3JlZCh0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaW5zZXJ0KG5vZGUpO1xuICB9KTtcblxuICBjb25zdCBsYXN0ID0gbm9kZTtcblxuICByZXR1cm4ge2ZpcnN0LCBsYXN0fTtcbn1cblxuLypcbkRlc2NyaXB0aW9uIG9mIHRoZSBkYXRhZmxvdyAoaHR0cDovL2FzY2lpZmxvdy5jb20vKTpcbiAgICAgKy0tLS0tLS0tK1xuICAgICB8IFNvdXJjZSB8XG4gICAgICstLS0rLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgVHJhbnNmb3Jtc1xuKEZpbHRlciwgQ2FsY3VsYXRlLCAuLi4pXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIEZvcm1hdFBhcnNlXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICBCaW5uaW5nXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICBUaW1ldW5pdFxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgKy0tKy0tK1xuICAgICAgfCBSYXcgfFxuICAgICAgKy0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBBZ2dyZWdhdGVcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgICBTdGFja1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBQYXRoIE9yZGVyXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIEludmFsaWQgRmlsdGVyXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICArLS0tLS0tLS0tLStcbiAgIHwgICBNYWluICAgfFxuICAgKy0tLS0tLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICstLS0tLS0tK1xuICAgICB8IEZhY2V0IHwtLS0tPiBcImNvbHVtblwiLCBcImNvbHVtbi1sYXlvdXRcIiwgYW5kIFwicm93XCJcbiAgICAgKy0tLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIC4uLkNoaWxkIGRhdGEuLi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURhdGEobW9kZWw6IE1vZGVsKTogRGF0YUNvbXBvbmVudCB7XG4gIGNvbnN0IHJvb3QgPSBwYXJzZVJvb3QobW9kZWwsIG1vZGVsLmNvbXBvbmVudC5kYXRhLnNvdXJjZXMpO1xuXG4gIGNvbnN0IG91dHB1dE5vZGVzID0gbW9kZWwuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXM7XG4gIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlUmVmQ291bnRzO1xuXG4gIC8vIHRoZSBjdXJyZW50IGhlYWQgb2YgdGhlIHRyZWUgdGhhdCB3ZSBhcmUgYXBwZW5kaW5nIHRvXG4gIGxldCBoZWFkID0gcm9vdDtcblxuICAvLyBEZWZhdWx0IGRpc2NyZXRlIHNlbGVjdGlvbnMgcmVxdWlyZSBhbiBpZGVudGlmaWVyIHRyYW5zZm9ybSB0b1xuICAvLyB1bmlxdWVseSBpZGVudGlmeSBkYXRhIHBvaW50cyBhcyB0aGUgX2lkIGZpZWxkIGlzIHZvbGF0aWxlLiBBZGRcbiAgLy8gdGhpcyB0cmFuc2Zvcm0gYXQgdGhlIGhlYWQgb2Ygb3VyIHBpcGVsaW5lIHN1Y2ggdGhhdCB0aGUgaWRlbnRpZmllclxuICAvLyBmaWVsZCBpcyBhdmFpbGFibGUgZm9yIGFsbCBzdWJzZXF1ZW50IGRhdGFzZXRzLiBBZGRpdGlvbmFsIGlkZW50aWZpZXJcbiAgLy8gdHJhbnNmb3JtcyB3aWxsIGJlIG5lY2Vzc2FyeSB3aGVuIG5ldyB0dXBsZXMgYXJlIGNvbnN0cnVjdGVkXG4gIC8vIChlLmcuLCBwb3N0LWFnZ3JlZ2F0aW9uKS5cbiAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpICYmICFtb2RlbC5wYXJlbnQpIHtcbiAgICBjb25zdCBpZGVudCA9IG5ldyBJZGVudGlmaWVyTm9kZSgpO1xuICAgIGlkZW50LnBhcmVudCA9IGhlYWQ7XG4gICAgaGVhZCA9IGlkZW50O1xuICB9XG5cbiAgLy8gSEFDSzogVGhpcyBpcyBlcXVpdmFsZW50IGZvciBtZXJnaW5nIGJpbiBleHRlbnQgZm9yIHVuaW9uIHNjYWxlLlxuICAvLyBGSVhNRShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzIyNzApOiBDb3JyZWN0bHkgbWVyZ2UgZXh0ZW50IC8gYmluIG5vZGUgZm9yIHNoYXJlZCBiaW4gc2NhbGVcbiAgY29uc3QgcGFyZW50SXNMYXllciA9IG1vZGVsLnBhcmVudCAmJiBpc0xheWVyTW9kZWwobW9kZWwucGFyZW50KTtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgaWYgKHBhcmVudElzTGF5ZXIpIHtcbiAgICAgIGNvbnN0IGJpbiA9IEJpbk5vZGUubWFrZUJpbkZyb21FbmNvZGluZyhtb2RlbCk7XG4gICAgICBpZiAoYmluKSB7XG4gICAgICAgIGJpbi5wYXJlbnQgPSBoZWFkO1xuICAgICAgICBoZWFkID0gYmluO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGlmIChtb2RlbC50cmFuc2Zvcm1zLmxlbmd0aCA+IDApIHtcbiAgICBjb25zdCB7Zmlyc3QsIGxhc3R9ID0gcGFyc2VUcmFuc2Zvcm1BcnJheShtb2RlbCk7XG4gICAgZmlyc3QucGFyZW50ID0gaGVhZDtcbiAgICBoZWFkID0gbGFzdDtcbiAgfVxuXG4gIGNvbnN0IHBhcnNlID0gUGFyc2VOb2RlLm1ha2UobW9kZWwpO1xuICBpZiAocGFyc2UpIHtcbiAgICBwYXJzZS5wYXJlbnQgPSBoZWFkO1xuICAgIGhlYWQgPSBwYXJzZTtcbiAgfVxuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuXG4gICAgaWYgKCFwYXJlbnRJc0xheWVyKSB7XG4gICAgICBjb25zdCBiaW4gPSBCaW5Ob2RlLm1ha2VCaW5Gcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgICAgaWYgKGJpbikge1xuICAgICAgICBiaW4ucGFyZW50ID0gaGVhZDtcbiAgICAgICAgaGVhZCA9IGJpbjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCB0dSA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbUVuY29kaW5nKG1vZGVsKTtcbiAgICBpZiAodHUpIHtcbiAgICAgIHR1LnBhcmVudCA9IGhlYWQ7XG4gICAgICBoZWFkID0gdHU7XG4gICAgfVxuICB9XG5cbiAgLy8gYWRkIGFuIG91dHB1dCBub2RlIHByZSBhZ2dyZWdhdGlvblxuICBjb25zdCByYXdOYW1lID0gbW9kZWwuZ2V0TmFtZShSQVcpO1xuICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZShyYXdOYW1lLCBSQVcsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1tyYXdOYW1lXSA9IHJhdztcbiAgcmF3LnBhcmVudCA9IGhlYWQ7XG4gIGhlYWQgPSByYXc7XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGFnZyA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21FbmNvZGluZyhtb2RlbCk7XG4gICAgaWYgKGFnZykge1xuICAgICAgYWdnLnBhcmVudCA9IGhlYWQ7XG4gICAgICBoZWFkID0gYWdnO1xuXG4gICAgICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkpIHtcbiAgICAgICAgY29uc3QgaWRlbnQgPSBuZXcgSWRlbnRpZmllck5vZGUoKTtcbiAgICAgICAgaWRlbnQucGFyZW50ID0gaGVhZDtcbiAgICAgICAgaGVhZCA9IGlkZW50O1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YWNrID0gU3RhY2tOb2RlLm1ha2UobW9kZWwpO1xuICAgIGlmIChzdGFjaykge1xuICAgICAgc3RhY2sucGFyZW50ID0gaGVhZDtcbiAgICAgIGhlYWQgPSBzdGFjaztcbiAgICB9XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgZmlsdGVyID0gRmlsdGVySW52YWxpZE5vZGUubWFrZShtb2RlbCk7XG4gICAgaWYgKGZpbHRlcikge1xuICAgICAgZmlsdGVyLnBhcmVudCA9IGhlYWQ7XG4gICAgICBoZWFkID0gZmlsdGVyO1xuICAgIH1cbiAgfVxuXG4gIC8vIG91dHB1dCBub2RlIGZvciBtYXJrc1xuICBjb25zdCBtYWluTmFtZSA9IG1vZGVsLmdldE5hbWUoTUFJTik7XG4gIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShtYWluTmFtZSwgTUFJTiwgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gIG91dHB1dE5vZGVzW21haW5OYW1lXSA9IG1haW47XG4gIG1haW4ucGFyZW50ID0gaGVhZDtcbiAgaGVhZCA9IG1haW47XG5cbiAgLy8gYWRkIGZhY2V0IG1hcmtlclxuICBsZXQgZmFjZXRSb290ID0gbnVsbDtcbiAgaWYgKGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICBjb25zdCBmYWNldE5hbWUgPSBtb2RlbC5nZXROYW1lKCdmYWNldCcpO1xuICAgIGZhY2V0Um9vdCA9IG5ldyBGYWNldE5vZGUobW9kZWwsIGZhY2V0TmFtZSwgbWFpbi5nZXRTb3VyY2UoKSk7XG4gICAgb3V0cHV0Tm9kZXNbZmFjZXROYW1lXSA9IGZhY2V0Um9vdDtcbiAgICBmYWNldFJvb3QucGFyZW50ID0gaGVhZDtcbiAgICBoZWFkID0gZmFjZXRSb290O1xuICB9XG5cbiAgLy8gYWRkIHRoZSBmb3JtYXQgcGFyc2UgZnJvbSB0aGlzIG1vZGVsIHNvIHRoYXQgY2hpbGRyZW4gZG9uJ3QgcGFyc2UgdGhlIHNhbWUgZmllbGQgYWdhaW5cbiAgY29uc3QgYW5jZXN0b3JQYXJzZSA9IHsuLi5tb2RlbC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlLCAuLi4ocGFyc2UgPyBwYXJzZS5wYXJzZSA6IHt9KX07XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5tb2RlbC5jb21wb25lbnQuZGF0YSxcbiAgICBvdXRwdXROb2RlcyxcbiAgICBvdXRwdXROb2RlUmVmQ291bnRzLFxuICAgIHJhdyxcbiAgICBtYWluLFxuICAgIGZhY2V0Um9vdCxcbiAgICBhbmNlc3RvclBhcnNlXG4gIH07XG59XG4iXX0=