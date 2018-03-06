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
var log = require("../../log");
var predicate_1 = require("../../predicate");
var transform_1 = require("../../transform");
var util_1 = require("../../util");
var model_1 = require("../model");
var selection_1 = require("../selection/selection");
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
            if (predicate_1.isFieldEqualPredicate(filter)) {
                val = filter.equal;
            }
            else if (predicate_1.isFieldRangePredicate(filter)) {
                val = filter.range[0];
            }
            else if (predicate_1.isFieldOneOfPredicate(filter)) {
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
            node = new filter_1.FilterNode(model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            node = bin_1.BinNode.makeFromTransform(t, model);
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
        for (var _i = 0, _b = geojson_1.GeoJSONNode.makeAll(model); _i < _b.length; _i++) {
            var geojson = _b[_i];
            geojson.parent = head;
            head = geojson;
        }
        for (var _c = 0, _d = geopoint_1.GeoPointNode.makeAll(model); _c < _d.length; _c++) {
            var geopoint = _d[_c];
            geopoint.parent = head;
            head = geopoint;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsbUNBQXFDO0FBQ3JDLDJDQUFvRDtBQUNwRCwrQkFBaUM7QUFDakMsNkNBQW9HO0FBQ3BHLDZDQUFnRztBQUNoRyxtQ0FBc0M7QUFDdEMsa0NBQXdFO0FBQ3hFLG9EQUEyRDtBQUMzRCx5Q0FBMEM7QUFDMUMsNkJBQThCO0FBQzlCLHlDQUEwQztBQUMxQyx1Q0FBb0Q7QUFDcEQsaUNBQWtDO0FBQ2xDLG1DQUFvQztBQUNwQyxpREFBa0Q7QUFDbEQsNkNBQXdDO0FBQ3hDLHFDQUFzQztBQUN0Qyx1Q0FBd0M7QUFDeEMsNkNBQTZDO0FBRTdDLG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUV4QyxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoQywwRUFBMEU7UUFDMUUsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEIsOENBQThDO1lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sMEJBQTBCO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0lBQ0gs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LEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0YsTUFBTSxjQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUN2QixXQUFXLGFBQUE7UUFDWCxtQkFBbUIscUJBQUE7UUFDbkIsR0FBRyxLQUFBO1FBQ0gsSUFBSSxNQUFBO1FBQ0osU0FBUyxXQUFBO1FBQ1QsYUFBYSxlQUFBLElBQ2I7QUFDSixDQUFDO0FBeklELDhCQXlJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXIsIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2lzRmllbGRFcXVhbFByZWRpY2F0ZSwgaXNGaWVsZE9uZU9mUHJlZGljYXRlLCBpc0ZpZWxkUmFuZ2VQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBpc0JpbiwgaXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBpc0xvb2t1cCwgaXNUaW1lVW5pdH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7cmVxdWlyZXNTZWxlY3Rpb25JZH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0dlb0pTT05Ob2RlfSBmcm9tICcuL2dlb2pzb24nO1xuaW1wb3J0IHtHZW9Qb2ludE5vZGV9IGZyb20gJy4vZ2VvcG9pbnQnO1xuaW1wb3J0IHtJZGVudGlmaWVyTm9kZX0gZnJvbSAnLi9pbmRlbnRpZmllcic7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcblxuZnVuY3Rpb24gcGFyc2VSb290KG1vZGVsOiBNb2RlbCwgc291cmNlczogRGljdDxTb3VyY2VOb2RlPik6IERhdGFGbG93Tm9kZSB7XG4gIGlmIChtb2RlbC5kYXRhIHx8ICFtb2RlbC5wYXJlbnQpIHtcbiAgICAvLyBpZiB0aGUgbW9kZWwgZGVmaW5lcyBhIGRhdGEgc291cmNlIG9yIGlzIHRoZSByb290LCBjcmVhdGUgYSBzb3VyY2Ugbm9kZVxuICAgIGNvbnN0IHNvdXJjZSA9IG5ldyBTb3VyY2VOb2RlKG1vZGVsLmRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBzb3VyY2UuaGFzaCgpO1xuICAgIGlmIChoYXNoIGluIHNvdXJjZXMpIHtcbiAgICAgIC8vIHVzZSBhIHJlZmVyZW5jZSBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzb3VyY2VcbiAgICAgIHJldHVybiBzb3VyY2VzW2hhc2hdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2UgYWRkIGEgbmV3IG9uZVxuICAgICAgc291cmNlc1toYXNoXSA9IHNvdXJjZTtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBzb3VyY2UgZGVmaW5lZCAob3ZlcnJpZGluZyBwYXJlbnQncyBkYXRhKSwgdXNlIHRoZSBwYXJlbnQncyBmYWNldCByb290IG9yIG1haW4uXG4gICAgcmV0dXJuIG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgPyBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEuZmFjZXRSb290IDogbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLm1haW47XG4gIH1cbn1cblxuXG4vKipcbiAqIFBhcnNlcyBhIHRyYW5zZm9ybXMgYXJyYXkgaW50byBhIGNoYWluIG9mIGNvbm5lY3RlZCBkYXRhZmxvdyBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtQXJyYXkobW9kZWw6IE1vZGVsKSB7XG4gIGxldCBmaXJzdDogRGF0YUZsb3dOb2RlID0gbnVsbDtcbiAgbGV0IG5vZGU6IERhdGFGbG93Tm9kZTtcbiAgbGV0IHByZXZpb3VzOiBEYXRhRmxvd05vZGU7XG4gIGxldCBsb29rdXBDb3VudGVyID0gMDtcblxuICBmdW5jdGlvbiBpbnNlcnQobmV3Tm9kZTogRGF0YUZsb3dOb2RlKSB7XG4gICAgaWYgKCFmaXJzdCkge1xuICAgICAgLy8gQSBwYXJlbnQgbWF5IGJlIGluc2VydGVkIGR1cmluZyBub2RlIGNvbnN0cnVjdGlvblxuICAgICAgLy8gKGUuZy4sIHNlbGVjdGlvbiBGaWx0ZXJOb2RlcyBtYXkgYWRkIGEgVGltZVVuaXROb2RlKS5cbiAgICAgIGZpcnN0ID0gbmV3Tm9kZS5wYXJlbnQgfHwgbmV3Tm9kZTtcbiAgICB9IGVsc2UgaWYgKG5ld05vZGUucGFyZW50KSB7XG4gICAgICBwcmV2aW91cy5pbnNlcnRBc1BhcmVudE9mKG5ld05vZGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdOb2RlLnBhcmVudCA9IHByZXZpb3VzO1xuICAgIH1cblxuICAgIHByZXZpb3VzID0gbmV3Tm9kZTtcbiAgfVxuXG4gIG1vZGVsLnRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcbiAgICBpZiAoaXNDYWxjdWxhdGUodCkpIHtcbiAgICAgIG5vZGUgPSBuZXcgQ2FsY3VsYXRlTm9kZSh0KTtcbiAgICB9IGVsc2UgaWYgKGlzRmlsdGVyKHQpKSB7XG4gICAgICAvLyBBdXRvbWF0aWNhbGx5IGFkZCBhIHBhcnNlIG5vZGUgZm9yIGZpbHRlcnMgd2l0aCBmaWx0ZXIgb2JqZWN0c1xuICAgICAgY29uc3QgcGFyc2UgPSB7fTtcbiAgICAgIGNvbnN0IGZpbHRlciA9IHQuZmlsdGVyO1xuICAgICAgbGV0IHZhbDogc3RyaW5nIHwgbnVtYmVyIHwgYm9vbGVhbiB8IERhdGVUaW1lID0gbnVsbDtcbiAgICAgIC8vIEZvciBFcXVhbEZpbHRlciwganVzdCB1c2UgdGhlIGVxdWFsIHByb3BlcnR5LlxuICAgICAgLy8gRm9yIFJhbmdlRmlsdGVyIGFuZCBPbmVPZkZpbHRlciwgYWxsIGFycmF5IG1lbWJlcnMgc2hvdWxkIGhhdmVcbiAgICAgIC8vIHRoZSBzYW1lIHR5cGUsIHNvIHdlIG9ubHkgdXNlIHRoZSBmaXJzdCBvbmUuXG4gICAgICBpZiAoaXNGaWVsZEVxdWFsUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gZmlsdGVyLmVxdWFsO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkUmFuZ2VQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICB2YWwgPSBmaWx0ZXIucmFuZ2VbMF07XG4gICAgICB9IGVsc2UgaWYgKGlzRmllbGRPbmVPZlByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIHZhbCA9IChmaWx0ZXIub25lT2YgfHwgZmlsdGVyWydpbiddKVswXTtcbiAgICAgIH0gLy8gZWxzZSAtLSBmb3IgZmlsdGVyIGV4cHJlc3Npb24sIHdlIGNhbid0IGluZmVyIGFueXRoaW5nXG5cbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgaWYgKGlzRGF0ZVRpbWUodmFsKSkge1xuICAgICAgICAgIHBhcnNlW2ZpbHRlclsnZmllbGQnXV0gPSAnZGF0ZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIodmFsKSkge1xuICAgICAgICAgIHBhcnNlW2ZpbHRlclsnZmllbGQnXV0gPSAnbnVtYmVyJztcbiAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlzKHBhcnNlKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGNvbnN0IHBhcnNlTm9kZSA9IG5ldyBQYXJzZU5vZGUocGFyc2UpO1xuICAgICAgICBpbnNlcnQocGFyc2VOb2RlKTtcbiAgICAgIH1cblxuICAgICAgbm9kZSA9IG5ldyBGaWx0ZXJOb2RlKG1vZGVsLCB0LmZpbHRlcik7XG4gICAgfSBlbHNlIGlmIChpc0Jpbih0KSkge1xuICAgICAgbm9kZSA9IEJpbk5vZGUubWFrZUZyb21UcmFuc2Zvcm0odCwgbW9kZWwpO1xuICAgIH0gZWxzZSBpZiAoaXNUaW1lVW5pdCh0KSkge1xuICAgICAgbm9kZSA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbVRyYW5zZm9ybSh0KTtcbiAgICB9IGVsc2UgaWYgKGlzQWdncmVnYXRlKHQpKSB7XG4gICAgICBub2RlID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbVRyYW5zZm9ybSh0KTtcblxuICAgICAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpKSB7XG4gICAgICAgIGluc2VydChub2RlKTtcbiAgICAgICAgbm9kZSA9IG5ldyBJZGVudGlmaWVyTm9kZSgpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNMb29rdXAodCkpIHtcbiAgICAgIG5vZGUgPSBMb29rdXBOb2RlLm1ha2UobW9kZWwsIHQsIGxvb2t1cENvdW50ZXIrKyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRUcmFuc2Zvcm1JZ25vcmVkKHQpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpbnNlcnQobm9kZSk7XG4gIH0pO1xuXG4gIGNvbnN0IGxhc3QgPSBub2RlO1xuXG4gIHJldHVybiB7Zmlyc3QsIGxhc3R9O1xufVxuXG4vKlxuRGVzY3JpcHRpb24gb2YgdGhlIGRhdGFmbG93IChodHRwOi8vYXNjaWlmbG93LmNvbS8pOlxuICAgICArLS0tLS0tLS0rXG4gICAgIHwgU291cmNlIHxcbiAgICAgKy0tLSstLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBUcmFuc2Zvcm1zXG4oRmlsdGVyLCBDYWxjdWxhdGUsIC4uLilcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgRm9ybWF0UGFyc2VcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIEJpbm5pbmdcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIFRpbWV1bml0XG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICArLS0rLS0rXG4gICAgICB8IFJhdyB8XG4gICAgICArLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIEFnZ3JlZ2F0ZVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgIFN0YWNrXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIFBhdGggT3JkZXJcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgSW52YWxpZCBGaWx0ZXJcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICstLS0tLS0tLS0tK1xuICAgfCAgIE1haW4gICB8XG4gICArLS0tLS0tLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgKy0tLS0tLS0rXG4gICAgIHwgRmFjZXQgfC0tLS0+IFwiY29sdW1uXCIsIFwiY29sdW1uLWxheW91dFwiLCBhbmQgXCJyb3dcIlxuICAgICArLS0tLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgLi4uQ2hpbGQgZGF0YS4uLlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGF0YShtb2RlbDogTW9kZWwpOiBEYXRhQ29tcG9uZW50IHtcbiAgY29uc3Qgcm9vdCA9IHBhcnNlUm9vdChtb2RlbCwgbW9kZWwuY29tcG9uZW50LmRhdGEuc291cmNlcyk7XG5cbiAgY29uc3Qgb3V0cHV0Tm9kZXMgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlcztcbiAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHM7XG5cbiAgLy8gdGhlIGN1cnJlbnQgaGVhZCBvZiB0aGUgdHJlZSB0aGF0IHdlIGFyZSBhcHBlbmRpbmcgdG9cbiAgbGV0IGhlYWQgPSByb290O1xuXG4gIC8vIERlZmF1bHQgZGlzY3JldGUgc2VsZWN0aW9ucyByZXF1aXJlIGFuIGlkZW50aWZpZXIgdHJhbnNmb3JtIHRvXG4gIC8vIHVuaXF1ZWx5IGlkZW50aWZ5IGRhdGEgcG9pbnRzIGFzIHRoZSBfaWQgZmllbGQgaXMgdm9sYXRpbGUuIEFkZFxuICAvLyB0aGlzIHRyYW5zZm9ybSBhdCB0aGUgaGVhZCBvZiBvdXIgcGlwZWxpbmUgc3VjaCB0aGF0IHRoZSBpZGVudGlmaWVyXG4gIC8vIGZpZWxkIGlzIGF2YWlsYWJsZSBmb3IgYWxsIHN1YnNlcXVlbnQgZGF0YXNldHMuIEFkZGl0aW9uYWwgaWRlbnRpZmllclxuICAvLyB0cmFuc2Zvcm1zIHdpbGwgYmUgbmVjZXNzYXJ5IHdoZW4gbmV3IHR1cGxlcyBhcmUgY29uc3RydWN0ZWRcbiAgLy8gKGUuZy4sIHBvc3QtYWdncmVnYXRpb24pLlxuICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkgJiYgIW1vZGVsLnBhcmVudCkge1xuICAgIGNvbnN0IGlkZW50ID0gbmV3IElkZW50aWZpZXJOb2RlKCk7XG4gICAgaWRlbnQucGFyZW50ID0gaGVhZDtcbiAgICBoZWFkID0gaWRlbnQ7XG4gIH1cblxuICAvLyBIQUNLOiBUaGlzIGlzIGVxdWl2YWxlbnQgZm9yIG1lcmdpbmcgYmluIGV4dGVudCBmb3IgdW5pb24gc2NhbGUuXG4gIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjI3MCk6IENvcnJlY3RseSBtZXJnZSBleHRlbnQgLyBiaW4gbm9kZSBmb3Igc2hhcmVkIGJpbiBzY2FsZVxuICBjb25zdCBwYXJlbnRJc0xheWVyID0gbW9kZWwucGFyZW50ICYmIGlzTGF5ZXJNb2RlbChtb2RlbC5wYXJlbnQpO1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICBpZiAocGFyZW50SXNMYXllcikge1xuICAgICAgY29uc3QgYmluID0gQmluTm9kZS5tYWtlQmluRnJvbUVuY29kaW5nKG1vZGVsKTtcbiAgICAgIGlmIChiaW4pIHtcbiAgICAgICAgYmluLnBhcmVudCA9IGhlYWQ7XG4gICAgICAgIGhlYWQgPSBiaW47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaWYgKG1vZGVsLnRyYW5zZm9ybXMubGVuZ3RoID4gMCkge1xuICAgIGNvbnN0IHtmaXJzdCwgbGFzdH0gPSBwYXJzZVRyYW5zZm9ybUFycmF5KG1vZGVsKTtcbiAgICBmaXJzdC5wYXJlbnQgPSBoZWFkO1xuICAgIGhlYWQgPSBsYXN0O1xuICB9XG5cbiAgY29uc3QgcGFyc2UgPSBQYXJzZU5vZGUubWFrZShtb2RlbCk7XG4gIGlmIChwYXJzZSkge1xuICAgIHBhcnNlLnBhcmVudCA9IGhlYWQ7XG4gICAgaGVhZCA9IHBhcnNlO1xuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG5cbiAgICBpZiAoIXBhcmVudElzTGF5ZXIpIHtcbiAgICAgIGNvbnN0IGJpbiA9IEJpbk5vZGUubWFrZUJpbkZyb21FbmNvZGluZyhtb2RlbCk7XG4gICAgICBpZiAoYmluKSB7XG4gICAgICAgIGJpbi5wYXJlbnQgPSBoZWFkO1xuICAgICAgICBoZWFkID0gYmluO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgZ2VvanNvbiBvZiBHZW9KU09OTm9kZS5tYWtlQWxsKG1vZGVsKSkge1xuICAgICAgZ2VvanNvbi5wYXJlbnQgPSBoZWFkO1xuICAgICAgaGVhZCA9IGdlb2pzb247XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBnZW9wb2ludCBvZiBHZW9Qb2ludE5vZGUubWFrZUFsbChtb2RlbCkpIHtcbiAgICAgIGdlb3BvaW50LnBhcmVudCA9IGhlYWQ7XG4gICAgICBoZWFkID0gZ2VvcG9pbnQ7XG4gICAgfVxuXG4gICAgY29uc3QgdHUgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21FbmNvZGluZyhtb2RlbCk7XG4gICAgaWYgKHR1KSB7XG4gICAgICB0dS5wYXJlbnQgPSBoZWFkO1xuICAgICAgaGVhZCA9IHR1O1xuICAgIH1cbiAgfVxuXG4gIC8vIGFkZCBhbiBvdXRwdXQgbm9kZSBwcmUgYWdncmVnYXRpb25cbiAgY29uc3QgcmF3TmFtZSA9IG1vZGVsLmdldE5hbWUoUkFXKTtcbiAgY29uc3QgcmF3ID0gbmV3IE91dHB1dE5vZGUocmF3TmFtZSwgUkFXLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgb3V0cHV0Tm9kZXNbcmF3TmFtZV0gPSByYXc7XG4gIHJhdy5wYXJlbnQgPSBoZWFkO1xuICBoZWFkID0gcmF3O1xuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcobW9kZWwpO1xuICAgIGlmIChhZ2cpIHtcbiAgICAgIGFnZy5wYXJlbnQgPSBoZWFkO1xuICAgICAgaGVhZCA9IGFnZztcblxuICAgICAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpKSB7XG4gICAgICAgIGNvbnN0IGlkZW50ID0gbmV3IElkZW50aWZpZXJOb2RlKCk7XG4gICAgICAgIGlkZW50LnBhcmVudCA9IGhlYWQ7XG4gICAgICAgIGhlYWQgPSBpZGVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBzdGFjayA9IFN0YWNrTm9kZS5tYWtlKG1vZGVsKTtcbiAgICBpZiAoc3RhY2spIHtcbiAgICAgIHN0YWNrLnBhcmVudCA9IGhlYWQ7XG4gICAgICBoZWFkID0gc3RhY2s7XG4gICAgfVxuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGZpbHRlciA9IEZpbHRlckludmFsaWROb2RlLm1ha2UobW9kZWwpO1xuICAgIGlmIChmaWx0ZXIpIHtcbiAgICAgIGZpbHRlci5wYXJlbnQgPSBoZWFkO1xuICAgICAgaGVhZCA9IGZpbHRlcjtcbiAgICB9XG4gIH1cblxuICAvLyBvdXRwdXQgbm9kZSBmb3IgbWFya3NcbiAgY29uc3QgbWFpbk5hbWUgPSBtb2RlbC5nZXROYW1lKE1BSU4pO1xuICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUobWFpbk5hbWUsIE1BSU4sIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1ttYWluTmFtZV0gPSBtYWluO1xuICBtYWluLnBhcmVudCA9IGhlYWQ7XG4gIGhlYWQgPSBtYWluO1xuXG4gIC8vIGFkZCBmYWNldCBtYXJrZXJcbiAgbGV0IGZhY2V0Um9vdCA9IG51bGw7XG4gIGlmIChpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgZmFjZXROYW1lID0gbW9kZWwuZ2V0TmFtZSgnZmFjZXQnKTtcbiAgICBmYWNldFJvb3QgPSBuZXcgRmFjZXROb2RlKG1vZGVsLCBmYWNldE5hbWUsIG1haW4uZ2V0U291cmNlKCkpO1xuICAgIG91dHB1dE5vZGVzW2ZhY2V0TmFtZV0gPSBmYWNldFJvb3Q7XG4gICAgZmFjZXRSb290LnBhcmVudCA9IGhlYWQ7XG4gICAgaGVhZCA9IGZhY2V0Um9vdDtcbiAgfVxuXG4gIC8vIGFkZCB0aGUgZm9ybWF0IHBhcnNlIGZyb20gdGhpcyBtb2RlbCBzbyB0aGF0IGNoaWxkcmVuIGRvbid0IHBhcnNlIHRoZSBzYW1lIGZpZWxkIGFnYWluXG4gIGNvbnN0IGFuY2VzdG9yUGFyc2UgPSB7Li4ubW9kZWwuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZSwgLi4uKHBhcnNlID8gcGFyc2UucGFyc2UgOiB7fSl9O1xuXG4gIHJldHVybiB7XG4gICAgLi4ubW9kZWwuY29tcG9uZW50LmRhdGEsXG4gICAgb3V0cHV0Tm9kZXMsXG4gICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICByYXcsXG4gICAgbWFpbixcbiAgICBmYWNldFJvb3QsXG4gICAgYW5jZXN0b3JQYXJzZVxuICB9O1xufVxuIl19