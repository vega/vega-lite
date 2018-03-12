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
function parseTransformArray(parent, model) {
    var lookupCounter = 0;
    model.transforms.forEach(function (t) {
        if (transform_1.isCalculate(t)) {
            parent = new calculate_1.CalculateNode(parent, t);
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
                parent = new formatparse_1.ParseNode(parent, parse);
            }
            parent = new filter_1.FilterNode(parent, model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            parent = bin_1.BinNode.makeFromTransform(parent, t, model);
        }
        else if (transform_1.isTimeUnit(t)) {
            parent = timeunit_1.TimeUnitNode.makeFromTransform(parent, t);
        }
        else if (transform_1.isAggregate(t)) {
            parent = aggregate_1.AggregateNode.makeFromTransform(parent, t);
            if (selection_1.requiresSelectionId(model)) {
                parent = new indentifier_1.IdentifierNode(parent);
            }
        }
        else if (transform_1.isLookup(t)) {
            parent = lookup_1.LookupNode.make(parent, model, t, lookupCounter++);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
    });
    return parent;
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
    var head = parseRoot(model, model.component.data.sources);
    var outputNodes = model.component.data.outputNodes;
    var outputNodeRefCounts = model.component.data.outputNodeRefCounts;
    // Default discrete selections require an identifier transform to
    // uniquely identify data points as the _id field is volatile. Add
    // this transform at the head of our pipeline such that the identifier
    // field is available for all subsequent datasets. Additional identifier
    // transforms will be necessary when new tuples are constructed
    // (e.g., post-aggregation).
    if (selection_1.requiresSelectionId(model) && !model.parent) {
        head = new indentifier_1.IdentifierNode(head);
    }
    // HACK: This is equivalent for merging bin extent for union scale.
    // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
    var parentIsLayer = model.parent && model_1.isLayerModel(model.parent);
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        if (parentIsLayer) {
            head = bin_1.BinNode.makeFromEncoding(head, model) || head;
        }
    }
    if (model.transforms.length > 0) {
        head = parseTransformArray(head, model);
    }
    var parse = formatparse_1.ParseNode.make(head, model);
    if (parse) {
        head = parse;
    }
    if (model_1.isUnitModel(model)) {
        head = geojson_1.GeoJSONNode.parseAll(head, model);
        head = geopoint_1.GeoPointNode.parseAll(head, model);
    }
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        if (!parentIsLayer) {
            head = bin_1.BinNode.makeFromEncoding(head, model) || head;
        }
        head = timeunit_1.TimeUnitNode.makeFromEncoding(head, model) || head;
    }
    // add an output node pre aggregation
    var rawName = model.getName(data_1.RAW);
    var raw = new dataflow_1.OutputNode(head, rawName, data_1.RAW, outputNodeRefCounts);
    outputNodes[rawName] = raw;
    head = raw;
    if (model_1.isUnitModel(model)) {
        var agg = aggregate_1.AggregateNode.makeFromEncoding(head, model);
        if (agg) {
            head = agg;
            if (selection_1.requiresSelectionId(model)) {
                head = new indentifier_1.IdentifierNode(head);
            }
        }
        head = stack_1.StackNode.make(head, model) || head;
    }
    if (model_1.isUnitModel(model)) {
        head = filterinvalid_1.FilterInvalidNode.make(head, model) || head;
    }
    // output node for marks
    var mainName = model.getName(data_1.MAIN);
    var main = new dataflow_1.OutputNode(head, mainName, data_1.MAIN, outputNodeRefCounts);
    outputNodes[mainName] = main;
    head = main;
    // add facet marker
    var facetRoot = null;
    if (model_1.isFacetModel(model)) {
        var facetName = model.getName('facet');
        facetRoot = new facet_1.FacetNode(head, model, facetName, main.getSource());
        outputNodes[facetName] = facetRoot;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSx1Q0FBNkM7QUFDN0MsbUNBQXFDO0FBQ3JDLDJDQUFvRDtBQUNwRCwrQkFBaUM7QUFDakMsNkNBQW9HO0FBQ3BHLDZDQUFnRztBQUNoRyxtQ0FBc0M7QUFDdEMsa0NBQXdFO0FBQ3hFLG9EQUEyRDtBQUMzRCx5Q0FBMEM7QUFDMUMsNkJBQThCO0FBQzlCLHlDQUEwQztBQUMxQyx1Q0FBb0Q7QUFDcEQsaUNBQWtDO0FBQ2xDLG1DQUFvQztBQUNwQyxpREFBa0Q7QUFDbEQsNkNBQXdDO0FBQ3hDLHFDQUFzQztBQUN0Qyx1Q0FBd0M7QUFDeEMsNkNBQTZDO0FBRTdDLG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUV4QyxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNoQywwRUFBMEU7UUFDMUUsSUFBTSxNQUFNLEdBQUcsSUFBSSxtQkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDcEIsOENBQThDO1lBQzlDLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUFDLElBQUksQ0FBQyxDQUFDO1lBQ04sMEJBQTBCO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdkIsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNoQixDQUFDO0lBQ0gs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LE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxTQUFTLEdBQUcsSUFBSSxpQkFBUyxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDO1FBQ3BFLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxTQUFTLENBQUM7UUFDbkMsSUFBSSxHQUFHLFNBQVMsQ0FBQztJQUNuQixDQUFDO0lBRUQseUZBQXlGO0lBQ3pGLElBQU0sYUFBYSxnQkFBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0YsTUFBTSxjQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUN2QixXQUFXLGFBQUE7UUFDWCxtQkFBbUIscUJBQUE7UUFDbkIsR0FBRyxLQUFBO1FBQ0gsSUFBSSxNQUFBO1FBQ0osU0FBUyxXQUFBO1FBQ1QsYUFBYSxlQUFBLElBQ2I7QUFDSixDQUFDO0FBbEdELDhCQWtHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXIsIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2lzRmllbGRFcXVhbFByZWRpY2F0ZSwgaXNGaWVsZE9uZU9mUHJlZGljYXRlLCBpc0ZpZWxkUmFuZ2VQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBpc0JpbiwgaXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBpc0xvb2t1cCwgaXNUaW1lVW5pdH0gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7cmVxdWlyZXNTZWxlY3Rpb25JZH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0dlb0pTT05Ob2RlfSBmcm9tICcuL2dlb2pzb24nO1xuaW1wb3J0IHtHZW9Qb2ludE5vZGV9IGZyb20gJy4vZ2VvcG9pbnQnO1xuaW1wb3J0IHtJZGVudGlmaWVyTm9kZX0gZnJvbSAnLi9pbmRlbnRpZmllcic7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcblxuZnVuY3Rpb24gcGFyc2VSb290KG1vZGVsOiBNb2RlbCwgc291cmNlczogRGljdDxTb3VyY2VOb2RlPik6IERhdGFGbG93Tm9kZSB7XG4gIGlmIChtb2RlbC5kYXRhIHx8ICFtb2RlbC5wYXJlbnQpIHtcbiAgICAvLyBpZiB0aGUgbW9kZWwgZGVmaW5lcyBhIGRhdGEgc291cmNlIG9yIGlzIHRoZSByb290LCBjcmVhdGUgYSBzb3VyY2Ugbm9kZVxuICAgIGNvbnN0IHNvdXJjZSA9IG5ldyBTb3VyY2VOb2RlKG1vZGVsLmRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBzb3VyY2UuaGFzaCgpO1xuICAgIGlmIChoYXNoIGluIHNvdXJjZXMpIHtcbiAgICAgIC8vIHVzZSBhIHJlZmVyZW5jZSBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzb3VyY2VcbiAgICAgIHJldHVybiBzb3VyY2VzW2hhc2hdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2UgYWRkIGEgbmV3IG9uZVxuICAgICAgc291cmNlc1toYXNoXSA9IHNvdXJjZTtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBzb3VyY2UgZGVmaW5lZCAob3ZlcnJpZGluZyBwYXJlbnQncyBkYXRhKSwgdXNlIHRoZSBwYXJlbnQncyBmYWNldCByb290IG9yIG1haW4uXG4gICAgcmV0dXJuIG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgPyBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEuZmFjZXRSb290IDogbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLm1haW47XG4gIH1cbn1cblxuXG4vKipcbiAqIFBhcnNlcyBhIHRyYW5zZm9ybXMgYXJyYXkgaW50byBhIGNoYWluIG9mIGNvbm5lY3RlZCBkYXRhZmxvdyBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtQXJyYXkocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbCk6IERhdGFGbG93Tm9kZSB7XG4gIGxldCBsb29rdXBDb3VudGVyID0gMDtcblxuICBtb2RlbC50cmFuc2Zvcm1zLmZvckVhY2godCA9PiB7XG4gICAgaWYgKGlzQ2FsY3VsYXRlKHQpKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgQ2FsY3VsYXRlTm9kZShwYXJlbnQsIHQpO1xuICAgIH0gZWxzZSBpZiAoaXNGaWx0ZXIodCkpIHtcbiAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRkIGEgcGFyc2Ugbm9kZSBmb3IgZmlsdGVycyB3aXRoIGZpbHRlciBvYmplY3RzXG4gICAgICBjb25zdCBwYXJzZSA9IHt9O1xuICAgICAgY29uc3QgZmlsdGVyID0gdC5maWx0ZXI7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgRGF0ZVRpbWUgPSBudWxsO1xuICAgICAgLy8gRm9yIEVxdWFsRmlsdGVyLCBqdXN0IHVzZSB0aGUgZXF1YWwgcHJvcGVydHkuXG4gICAgICAvLyBGb3IgUmFuZ2VGaWx0ZXIgYW5kIE9uZU9mRmlsdGVyLCBhbGwgYXJyYXkgbWVtYmVycyBzaG91bGQgaGF2ZVxuICAgICAgLy8gdGhlIHNhbWUgdHlwZSwgc28gd2Ugb25seSB1c2UgdGhlIGZpcnN0IG9uZS5cbiAgICAgIGlmIChpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICB2YWwgPSBmaWx0ZXIuZXF1YWw7XG4gICAgICB9IGVsc2UgaWYgKGlzRmllbGRSYW5nZVByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIHZhbCA9IGZpbHRlci5yYW5nZVswXTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGaWVsZE9uZU9mUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gKGZpbHRlci5vbmVPZiB8fCBmaWx0ZXJbJ2luJ10pWzBdO1xuICAgICAgfSAvLyBlbHNlIC0tIGZvciBmaWx0ZXIgZXhwcmVzc2lvbiwgd2UgY2FuJ3QgaW5mZXIgYW55dGhpbmdcblxuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBpZiAoaXNEYXRlVGltZSh2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdudW1iZXInO1xuICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICBwYXJzZVtmaWx0ZXJbJ2ZpZWxkJ11dID0gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGFyZW50ID0gbmV3IFBhcnNlTm9kZShwYXJlbnQsIHBhcnNlKTtcbiAgICAgIH1cblxuXG4gICAgICBwYXJlbnQgPSBuZXcgRmlsdGVyTm9kZShwYXJlbnQsIG1vZGVsLCB0LmZpbHRlcik7XG4gICAgfSBlbHNlIGlmIChpc0Jpbih0KSkge1xuICAgICAgcGFyZW50ID0gQmluTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQsIHQsIG1vZGVsKTtcbiAgICB9IGVsc2UgaWYgKGlzVGltZVVuaXQodCkpIHtcbiAgICAgIHBhcmVudCA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQsIHQpO1xuICAgIH0gZWxzZSBpZiAoaXNBZ2dyZWdhdGUodCkpIHtcbiAgICAgIHBhcmVudCA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50LCB0KTtcblxuICAgICAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpKSB7XG4gICAgICAgIHBhcmVudCA9IG5ldyBJZGVudGlmaWVyTm9kZShwYXJlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNMb29rdXAodCkpIHtcbiAgICAgIHBhcmVudCA9IExvb2t1cE5vZGUubWFrZShwYXJlbnQsIG1vZGVsLCB0LCBsb29rdXBDb3VudGVyKyspO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkVHJhbnNmb3JtSWdub3JlZCh0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vKlxuRGVzY3JpcHRpb24gb2YgdGhlIGRhdGFmbG93IChodHRwOi8vYXNjaWlmbG93LmNvbS8pOlxuICAgICArLS0tLS0tLS0rXG4gICAgIHwgU291cmNlIHxcbiAgICAgKy0tLSstLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBUcmFuc2Zvcm1zXG4oRmlsdGVyLCBDYWxjdWxhdGUsIC4uLilcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgRm9ybWF0UGFyc2VcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIEJpbm5pbmdcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIFRpbWV1bml0XG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICArLS0rLS0rXG4gICAgICB8IFJhdyB8XG4gICAgICArLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIEFnZ3JlZ2F0ZVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgIFN0YWNrXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIFBhdGggT3JkZXJcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgSW52YWxpZCBGaWx0ZXJcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICstLS0tLS0tLS0tK1xuICAgfCAgIE1haW4gICB8XG4gICArLS0tLS0tLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgKy0tLS0tLS0rXG4gICAgIHwgRmFjZXQgfC0tLS0+IFwiY29sdW1uXCIsIFwiY29sdW1uLWxheW91dFwiLCBhbmQgXCJyb3dcIlxuICAgICArLS0tLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgLi4uQ2hpbGQgZGF0YS4uLlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGF0YShtb2RlbDogTW9kZWwpOiBEYXRhQ29tcG9uZW50IHtcbiAgbGV0IGhlYWQgPSBwYXJzZVJvb3QobW9kZWwsIG1vZGVsLmNvbXBvbmVudC5kYXRhLnNvdXJjZXMpO1xuXG4gIGNvbnN0IG91dHB1dE5vZGVzID0gbW9kZWwuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZXM7XG4gIGNvbnN0IG91dHB1dE5vZGVSZWZDb3VudHMgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlUmVmQ291bnRzO1xuXG4gIC8vIERlZmF1bHQgZGlzY3JldGUgc2VsZWN0aW9ucyByZXF1aXJlIGFuIGlkZW50aWZpZXIgdHJhbnNmb3JtIHRvXG4gIC8vIHVuaXF1ZWx5IGlkZW50aWZ5IGRhdGEgcG9pbnRzIGFzIHRoZSBfaWQgZmllbGQgaXMgdm9sYXRpbGUuIEFkZFxuICAvLyB0aGlzIHRyYW5zZm9ybSBhdCB0aGUgaGVhZCBvZiBvdXIgcGlwZWxpbmUgc3VjaCB0aGF0IHRoZSBpZGVudGlmaWVyXG4gIC8vIGZpZWxkIGlzIGF2YWlsYWJsZSBmb3IgYWxsIHN1YnNlcXVlbnQgZGF0YXNldHMuIEFkZGl0aW9uYWwgaWRlbnRpZmllclxuICAvLyB0cmFuc2Zvcm1zIHdpbGwgYmUgbmVjZXNzYXJ5IHdoZW4gbmV3IHR1cGxlcyBhcmUgY29uc3RydWN0ZWRcbiAgLy8gKGUuZy4sIHBvc3QtYWdncmVnYXRpb24pLlxuICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkgJiYgIW1vZGVsLnBhcmVudCkge1xuICAgIGhlYWQgPSBuZXcgSWRlbnRpZmllck5vZGUoaGVhZCk7XG4gIH1cblxuICAvLyBIQUNLOiBUaGlzIGlzIGVxdWl2YWxlbnQgZm9yIG1lcmdpbmcgYmluIGV4dGVudCBmb3IgdW5pb24gc2NhbGUuXG4gIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjI3MCk6IENvcnJlY3RseSBtZXJnZSBleHRlbnQgLyBiaW4gbm9kZSBmb3Igc2hhcmVkIGJpbiBzY2FsZVxuICBjb25zdCBwYXJlbnRJc0xheWVyID0gbW9kZWwucGFyZW50ICYmIGlzTGF5ZXJNb2RlbChtb2RlbC5wYXJlbnQpO1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICBpZiAocGFyZW50SXNMYXllcikge1xuICAgICAgaGVhZCA9IEJpbk5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICB9XG4gIH1cblxuICBpZiAobW9kZWwudHJhbnNmb3Jtcy5sZW5ndGggPiAwKSB7XG4gICAgaGVhZCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkoaGVhZCwgbW9kZWwpO1xuICB9XG5cbiAgY29uc3QgcGFyc2UgPSBQYXJzZU5vZGUubWFrZShoZWFkLCBtb2RlbCk7XG4gIGlmIChwYXJzZSkge1xuICAgIGhlYWQgPSBwYXJzZTtcbiAgfVxuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBoZWFkID0gR2VvSlNPTk5vZGUucGFyc2VBbGwoaGVhZCwgbW9kZWwpO1xuICAgIGhlYWQgPSBHZW9Qb2ludE5vZGUucGFyc2VBbGwoaGVhZCwgbW9kZWwpO1xuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG5cbiAgICBpZiAoIXBhcmVudElzTGF5ZXIpIHtcbiAgICAgIGhlYWQgPSBCaW5Ob2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgfVxuXG4gICAgaGVhZCA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICB9XG5cbiAgLy8gYWRkIGFuIG91dHB1dCBub2RlIHByZSBhZ2dyZWdhdGlvblxuICBjb25zdCByYXdOYW1lID0gbW9kZWwuZ2V0TmFtZShSQVcpO1xuICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZShoZWFkLCByYXdOYW1lLCBSQVcsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1tyYXdOYW1lXSA9IHJhdztcbiAgaGVhZCA9IHJhdztcblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKTtcbiAgICBpZiAoYWdnKSB7XG4gICAgICBoZWFkID0gYWdnO1xuXG4gICAgICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkpIHtcbiAgICAgICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWFkID0gU3RhY2tOb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgaGVhZCA9IEZpbHRlckludmFsaWROb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICAvLyBvdXRwdXQgbm9kZSBmb3IgbWFya3NcbiAgY29uc3QgbWFpbk5hbWUgPSBtb2RlbC5nZXROYW1lKE1BSU4pO1xuICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUoaGVhZCwgbWFpbk5hbWUsIE1BSU4sIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1ttYWluTmFtZV0gPSBtYWluO1xuICBoZWFkID0gbWFpbjtcblxuICAvLyBhZGQgZmFjZXQgbWFya2VyXG4gIGxldCBmYWNldFJvb3QgPSBudWxsO1xuICBpZiAoaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGZhY2V0TmFtZSA9IG1vZGVsLmdldE5hbWUoJ2ZhY2V0Jyk7XG4gICAgZmFjZXRSb290ID0gbmV3IEZhY2V0Tm9kZShoZWFkLCBtb2RlbCwgZmFjZXROYW1lLCBtYWluLmdldFNvdXJjZSgpKTtcbiAgICBvdXRwdXROb2Rlc1tmYWNldE5hbWVdID0gZmFjZXRSb290O1xuICAgIGhlYWQgPSBmYWNldFJvb3Q7XG4gIH1cblxuICAvLyBhZGQgdGhlIGZvcm1hdCBwYXJzZSBmcm9tIHRoaXMgbW9kZWwgc28gdGhhdCBjaGlsZHJlbiBkb24ndCBwYXJzZSB0aGUgc2FtZSBmaWVsZCBhZ2FpblxuICBjb25zdCBhbmNlc3RvclBhcnNlID0gey4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UsIC4uLihwYXJzZSA/IHBhcnNlLnBhcnNlIDoge30pfTtcblxuICByZXR1cm4ge1xuICAgIC4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLFxuICAgIG91dHB1dE5vZGVzLFxuICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgcmF3LFxuICAgIG1haW4sXG4gICAgZmFjZXRSb290LFxuICAgIGFuY2VzdG9yUGFyc2VcbiAgfTtcbn1cbiJdfQ==