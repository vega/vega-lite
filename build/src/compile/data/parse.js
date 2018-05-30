"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
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
var filter_1 = require("./filter");
var filterinvalid_1 = require("./filterinvalid");
var formatparse_1 = require("./formatparse");
var geojson_1 = require("./geojson");
var geopoint_1 = require("./geopoint");
var indentifier_1 = require("./indentifier");
var index_1 = require("./index");
var lookup_1 = require("./lookup");
var source_1 = require("./source");
var stack_1 = require("./stack");
var timeunit_1 = require("./timeunit");
var window_1 = require("./window");
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
function parseTransformArray(head, model, ancestorParse) {
    var lookupCounter = 0;
    model.transforms.forEach(function (t) {
        if (transform_1.isCalculate(t)) {
            head = new calculate_1.CalculateNode(head, t);
            ancestorParse.set(t.as, 'derived', false);
        }
        else if (transform_1.isFilter(t)) {
            head = formatparse_1.ParseNode.makeImplicitFromFilterTransform(head, t, ancestorParse) || head;
            head = new filter_1.FilterNode(head, model, t.filter);
        }
        else if (transform_1.isBin(t)) {
            head = bin_1.BinNode.makeFromTransform(head, t, model);
            ancestorParse.set(t.as, 'number', false);
        }
        else if (transform_1.isTimeUnit(t)) {
            head = timeunit_1.TimeUnitNode.makeFromTransform(head, t);
            ancestorParse.set(t.as, 'date', false);
        }
        else if (transform_1.isAggregate(t)) {
            var agg = head = aggregate_1.AggregateNode.makeFromTransform(head, t);
            if (selection_1.requiresSelectionId(model)) {
                head = new indentifier_1.IdentifierNode(head);
            }
            for (var _i = 0, _a = util_1.keys(agg.producedFields()); _i < _a.length; _i++) {
                var field = _a[_i];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (transform_1.isLookup(t)) {
            var lookup = head = lookup_1.LookupNode.make(head, model, t, lookupCounter++);
            for (var _b = 0, _c = util_1.keys(lookup.producedFields()); _b < _c.length; _b++) {
                var field = _c[_b];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (transform_1.isWindow(t)) {
            var window_2 = head = new window_1.WindowTransformNode(head, t);
            for (var _d = 0, _e = util_1.keys(window_2.producedFields()); _d < _e.length; _d++) {
                var field = _e[_d];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (transform_1.isStack(t)) {
            var stack = head = stack_1.StackNode.makeFromTransform(head, t);
            for (var _f = 0, _g = util_1.keys(stack.producedFields()); _f < _g.length; _f++) {
                var field = _g[_f];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
    });
    return head;
}
exports.parseTransformArray = parseTransformArray;
/*
Description of the dataflow (http://asciiflow.com/):
     +--------+
     | Source |
     +---+----+
         |
         v
     FormatParse
     (explicit)
         |
         v
     Transforms
(Filter, Calculate, Binning, TimeUnit, Aggregate, Window, ...)
         |
         v
     FormatParse
     (implicit)
         |
         v
 Binning (in `encoding`)
         |
         v
 Timeunit (in `encoding`)
         |
         v
Formula From Sort Array
         |
         v
      +--+--+
      | Raw |
      +-----+
         |
         v
  Aggregate (in `encoding`)
         |
         v
  Stack (in `encoding`)
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
    var _a = model.component.data, outputNodes = _a.outputNodes, outputNodeRefCounts = _a.outputNodeRefCounts;
    var ancestorParse = model.parent ? model.parent.component.data.ancestorParse.clone() : new index_1.AncestorParse();
    // format.parse: null means disable parsing
    if (model.data && model.data.format && model.data.format.parse === null) {
        ancestorParse.parseNothing = true;
    }
    head = formatparse_1.ParseNode.makeExplicit(head, model, ancestorParse) || head;
    // Default discrete selections require an identifier transform to
    // uniquely identify data points as the _id field is volatile. Add
    // this transform at the head of our pipeline such that the identifier
    // field is available for all subsequent datasets. Additional identifier
    // transforms will be necessary when new tuples are constructed
    // (e.g., post-aggregation).
    if (selection_1.requiresSelectionId(model) && (model_1.isUnitModel(model) || model_1.isLayerModel(model))) {
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
        head = parseTransformArray(head, model, ancestorParse);
    }
    head = formatparse_1.ParseNode.makeImplicitFromEncoding(head, model, ancestorParse) || head;
    if (model_1.isUnitModel(model)) {
        head = geojson_1.GeoJSONNode.parseAll(head, model);
        head = geopoint_1.GeoPointNode.parseAll(head, model);
    }
    if (model_1.isUnitModel(model) || model_1.isFacetModel(model)) {
        if (!parentIsLayer) {
            head = bin_1.BinNode.makeFromEncoding(head, model) || head;
        }
        head = timeunit_1.TimeUnitNode.makeFromEncoding(head, model) || head;
        head = calculate_1.CalculateNode.parseAllForSortIndex(head, model);
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
        head = stack_1.StackNode.makeFromEncoding(head, model) || head;
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
    return tslib_1.__assign({}, model.component.data, { outputNodes: outputNodes,
        outputNodeRefCounts: outputNodeRefCounts,
        raw: raw,
        main: main,
        facetRoot: facetRoot,
        ancestorParse: ancestorParse });
}
exports.parseData = parseData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxQztBQUNyQywrQkFBaUM7QUFDakMsNkNBQW1IO0FBQ25ILG1DQUFzQztBQUN0QyxrQ0FBd0U7QUFDeEUsb0RBQTJEO0FBQzNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMscUNBQXNDO0FBQ3RDLHVDQUF3QztBQUN4Qyw2Q0FBNkM7QUFDN0MsaUNBQXFEO0FBQ3JELG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUN4QyxtQ0FBNkM7QUFFN0MsbUJBQW1CLEtBQVksRUFBRSxPQUF5QjtJQUN4RCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQy9CLDBFQUEwRTtRQUMxRSxJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7WUFDbkIsOENBQThDO1lBQzlDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO2FBQU07WUFDTCwwQkFBMEI7WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QixPQUFPLE1BQU0sQ0FBQztTQUNmO0tBQ0Y7U0FBTTtRQUNMLHFHQUFxRztRQUNyRyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FB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O0tBQ2xCO0lBRUQsNEJBQ0ssS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQ3ZCLFdBQVcsYUFBQTtRQUNYLG1CQUFtQixxQkFBQTtRQUNuQixHQUFHLEtBQUE7UUFDSCxJQUFJLE1BQUE7UUFDSixTQUFTLFdBQUE7UUFDVCxhQUFhLGVBQUEsSUFDYjtBQUNKLENBQUM7QUFwR0QsOEJBb0dDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBpc0JpbiwgaXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBpc0xvb2t1cCwgaXNTdGFjaywgaXNUaW1lVW5pdCwgaXNXaW5kb3d9IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzTGF5ZXJNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge3JlcXVpcmVzU2VsZWN0aW9uSWR9IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4vYmluJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi9jYWxjdWxhdGUnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGUsIE91dHB1dE5vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuaW1wb3J0IHtGYWNldE5vZGV9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtGaWx0ZXJOb2RlfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQge0ZpbHRlckludmFsaWROb2RlfSBmcm9tICcuL2ZpbHRlcmludmFsaWQnO1xuaW1wb3J0IHtQYXJzZU5vZGV9IGZyb20gJy4vZm9ybWF0cGFyc2UnO1xuaW1wb3J0IHtHZW9KU09OTm9kZX0gZnJvbSAnLi9nZW9qc29uJztcbmltcG9ydCB7R2VvUG9pbnROb2RlfSBmcm9tICcuL2dlb3BvaW50JztcbmltcG9ydCB7SWRlbnRpZmllck5vZGV9IGZyb20gJy4vaW5kZW50aWZpZXInO1xuaW1wb3J0IHtBbmNlc3RvclBhcnNlLCBEYXRhQ29tcG9uZW50fSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi9sb29rdXAnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuL3NvdXJjZSc7XG5pbXBvcnQge1N0YWNrTm9kZX0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi90aW1ldW5pdCc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4vd2luZG93JztcblxuZnVuY3Rpb24gcGFyc2VSb290KG1vZGVsOiBNb2RlbCwgc291cmNlczogRGljdDxTb3VyY2VOb2RlPik6IERhdGFGbG93Tm9kZSB7XG4gIGlmIChtb2RlbC5kYXRhIHx8ICFtb2RlbC5wYXJlbnQpIHtcbiAgICAvLyBpZiB0aGUgbW9kZWwgZGVmaW5lcyBhIGRhdGEgc291cmNlIG9yIGlzIHRoZSByb290LCBjcmVhdGUgYSBzb3VyY2Ugbm9kZVxuICAgIGNvbnN0IHNvdXJjZSA9IG5ldyBTb3VyY2VOb2RlKG1vZGVsLmRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBzb3VyY2UuaGFzaCgpO1xuICAgIGlmIChoYXNoIGluIHNvdXJjZXMpIHtcbiAgICAgIC8vIHVzZSBhIHJlZmVyZW5jZSBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzb3VyY2VcbiAgICAgIHJldHVybiBzb3VyY2VzW2hhc2hdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2UgYWRkIGEgbmV3IG9uZVxuICAgICAgc291cmNlc1toYXNoXSA9IHNvdXJjZTtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBzb3VyY2UgZGVmaW5lZCAob3ZlcnJpZGluZyBwYXJlbnQncyBkYXRhKSwgdXNlIHRoZSBwYXJlbnQncyBmYWNldCByb290IG9yIG1haW4uXG4gICAgcmV0dXJuIG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgPyBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEuZmFjZXRSb290IDogbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLm1haW47XG4gIH1cbn1cblxuXG4vKipcbiAqIFBhcnNlcyBhIHRyYW5zZm9ybXMgYXJyYXkgaW50byBhIGNoYWluIG9mIGNvbm5lY3RlZCBkYXRhZmxvdyBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtQXJyYXkoaGVhZDogRGF0YUZsb3dOb2RlLCBtb2RlbDogTW9kZWwsIGFuY2VzdG9yUGFyc2U6IEFuY2VzdG9yUGFyc2UpOiBEYXRhRmxvd05vZGUge1xuICBsZXQgbG9va3VwQ291bnRlciA9IDA7XG5cbiAgbW9kZWwudHJhbnNmb3Jtcy5mb3JFYWNoKHQgPT4ge1xuICAgIGlmIChpc0NhbGN1bGF0ZSh0KSkge1xuICAgICAgaGVhZCA9IG5ldyBDYWxjdWxhdGVOb2RlKGhlYWQsIHQpO1xuICAgICAgYW5jZXN0b3JQYXJzZS5zZXQodC5hcywgJ2Rlcml2ZWQnLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0KSkge1xuICAgICAgaGVhZCA9IFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRmlsdGVyVHJhbnNmb3JtKGhlYWQsIHQsIGFuY2VzdG9yUGFyc2UpIHx8IGhlYWQ7XG5cbiAgICAgIGhlYWQgPSBuZXcgRmlsdGVyTm9kZShoZWFkLCBtb2RlbCwgdC5maWx0ZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNCaW4odCkpIHtcbiAgICAgIGhlYWQgPSBCaW5Ob2RlLm1ha2VGcm9tVHJhbnNmb3JtKGhlYWQsIHQsIG1vZGVsKTtcblxuICAgICAgYW5jZXN0b3JQYXJzZS5zZXQodC5hcywgJ251bWJlcicsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKGlzVGltZVVuaXQodCkpIHtcbiAgICAgIGhlYWQgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21UcmFuc2Zvcm0oaGVhZCwgdCk7XG5cbiAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KHQuYXMsICdkYXRlJywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoaXNBZ2dyZWdhdGUodCkpIHtcbiAgICAgIGNvbnN0IGFnZyA9IGhlYWQgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKGhlYWQsIHQpO1xuXG4gICAgICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkpIHtcbiAgICAgICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKGFnZy5wcm9kdWNlZEZpZWxkcygpKSkge1xuICAgICAgICBhbmNlc3RvclBhcnNlLnNldChmaWVsZCwgJ2Rlcml2ZWQnLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc0xvb2t1cCh0KSkge1xuICAgICAgY29uc3QgbG9va3VwID0gaGVhZCA9IExvb2t1cE5vZGUubWFrZShoZWFkLCBtb2RlbCwgdCwgbG9va3VwQ291bnRlcisrKTtcblxuICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKGxvb2t1cC5wcm9kdWNlZEZpZWxkcygpKSkge1xuICAgICAgICBhbmNlc3RvclBhcnNlLnNldChmaWVsZCwgJ2Rlcml2ZWQnLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChpc1dpbmRvdyh0KSkge1xuICAgICAgY29uc3Qgd2luZG93ID0gaGVhZCA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKGhlYWQsIHQpO1xuXG4gICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXMod2luZG93LnByb2R1Y2VkRmllbGRzKCkpKSB7XG4gICAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KGZpZWxkLCAnZGVyaXZlZCcsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzU3RhY2sodCkpIHtcbiAgICAgIGNvbnN0IHN0YWNrID0gaGVhZCA9IFN0YWNrTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShoZWFkLCB0KTtcblxuICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKHN0YWNrLnByb2R1Y2VkRmllbGRzKCkpKSB7XG4gICAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KGZpZWxkLCAnZGVyaXZlZCcsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbG9nLndhcm4obG9nLm1lc3NhZ2UuaW52YWxpZFRyYW5zZm9ybUlnbm9yZWQodCkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIGhlYWQ7XG59XG5cbi8qXG5EZXNjcmlwdGlvbiBvZiB0aGUgZGF0YWZsb3cgKGh0dHA6Ly9hc2NpaWZsb3cuY29tLyk6XG4gICAgICstLS0tLS0tLStcbiAgICAgfCBTb3VyY2UgfFxuICAgICArLS0tKy0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIEZvcm1hdFBhcnNlXG4gICAgIChleHBsaWNpdClcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgVHJhbnNmb3Jtc1xuKEZpbHRlciwgQ2FsY3VsYXRlLCBCaW5uaW5nLCBUaW1lVW5pdCwgQWdncmVnYXRlLCBXaW5kb3csIC4uLilcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgRm9ybWF0UGFyc2VcbiAgICAgKGltcGxpY2l0KVxuICAgICAgICAgfFxuICAgICAgICAgdlxuIEJpbm5pbmcgKGluIGBlbmNvZGluZ2ApXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gVGltZXVuaXQgKGluIGBlbmNvZGluZ2ApXG4gICAgICAgICB8XG4gICAgICAgICB2XG5Gb3JtdWxhIEZyb20gU29ydCBBcnJheVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgKy0tKy0tK1xuICAgICAgfCBSYXcgfFxuICAgICAgKy0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICBBZ2dyZWdhdGUgKGluIGBlbmNvZGluZ2ApXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIFN0YWNrIChpbiBgZW5jb2RpbmdgKVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICBJbnZhbGlkIEZpbHRlclxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgKy0tLS0tLS0tLS0rXG4gICB8ICAgTWFpbiAgIHxcbiAgICstLS0tLS0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICArLS0tLS0tLStcbiAgICAgfCBGYWNldCB8LS0tLT4gXCJjb2x1bW5cIiwgXCJjb2x1bW4tbGF5b3V0XCIsIGFuZCBcInJvd1wiXG4gICAgICstLS0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAuLi5DaGlsZCBkYXRhLi4uXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEYXRhKG1vZGVsOiBNb2RlbCk6IERhdGFDb21wb25lbnQge1xuICBsZXQgaGVhZCA9IHBhcnNlUm9vdChtb2RlbCwgbW9kZWwuY29tcG9uZW50LmRhdGEuc291cmNlcyk7XG5cbiAgY29uc3Qge291dHB1dE5vZGVzLCBvdXRwdXROb2RlUmVmQ291bnRzfSA9IG1vZGVsLmNvbXBvbmVudC5kYXRhO1xuICBjb25zdCBhbmNlc3RvclBhcnNlID0gbW9kZWwucGFyZW50ID8gbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UuY2xvbmUoKSA6IG5ldyBBbmNlc3RvclBhcnNlKCk7XG5cbiAgLy8gZm9ybWF0LnBhcnNlOiBudWxsIG1lYW5zIGRpc2FibGUgcGFyc2luZ1xuICBpZiAobW9kZWwuZGF0YSAmJiBtb2RlbC5kYXRhLmZvcm1hdCAmJiBtb2RlbC5kYXRhLmZvcm1hdC5wYXJzZSA9PT0gbnVsbCkge1xuICAgIGFuY2VzdG9yUGFyc2UucGFyc2VOb3RoaW5nID0gdHJ1ZTtcbiAgfVxuXG4gIGhlYWQgPSBQYXJzZU5vZGUubWFrZUV4cGxpY2l0KGhlYWQsIG1vZGVsLCBhbmNlc3RvclBhcnNlKSB8fCBoZWFkO1xuXG4gIC8vIERlZmF1bHQgZGlzY3JldGUgc2VsZWN0aW9ucyByZXF1aXJlIGFuIGlkZW50aWZpZXIgdHJhbnNmb3JtIHRvXG4gIC8vIHVuaXF1ZWx5IGlkZW50aWZ5IGRhdGEgcG9pbnRzIGFzIHRoZSBfaWQgZmllbGQgaXMgdm9sYXRpbGUuIEFkZFxuICAvLyB0aGlzIHRyYW5zZm9ybSBhdCB0aGUgaGVhZCBvZiBvdXIgcGlwZWxpbmUgc3VjaCB0aGF0IHRoZSBpZGVudGlmaWVyXG4gIC8vIGZpZWxkIGlzIGF2YWlsYWJsZSBmb3IgYWxsIHN1YnNlcXVlbnQgZGF0YXNldHMuIEFkZGl0aW9uYWwgaWRlbnRpZmllclxuICAvLyB0cmFuc2Zvcm1zIHdpbGwgYmUgbmVjZXNzYXJ5IHdoZW4gbmV3IHR1cGxlcyBhcmUgY29uc3RydWN0ZWRcbiAgLy8gKGUuZy4sIHBvc3QtYWdncmVnYXRpb24pLlxuICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkgJiYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0xheWVyTW9kZWwobW9kZWwpKSkge1xuICAgIGhlYWQgPSBuZXcgSWRlbnRpZmllck5vZGUoaGVhZCk7XG4gIH1cblxuICAvLyBIQUNLOiBUaGlzIGlzIGVxdWl2YWxlbnQgZm9yIG1lcmdpbmcgYmluIGV4dGVudCBmb3IgdW5pb24gc2NhbGUuXG4gIC8vIEZJWE1FKGh0dHBzOi8vZ2l0aHViLmNvbS92ZWdhL3ZlZ2EtbGl0ZS9pc3N1ZXMvMjI3MCk6IENvcnJlY3RseSBtZXJnZSBleHRlbnQgLyBiaW4gbm9kZSBmb3Igc2hhcmVkIGJpbiBzY2FsZVxuICBjb25zdCBwYXJlbnRJc0xheWVyID0gbW9kZWwucGFyZW50ICYmIGlzTGF5ZXJNb2RlbChtb2RlbC5wYXJlbnQpO1xuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICBpZiAocGFyZW50SXNMYXllcikge1xuICAgICAgaGVhZCA9IEJpbk5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICB9XG4gIH1cblxuICBpZiAobW9kZWwudHJhbnNmb3Jtcy5sZW5ndGggPiAwKSB7XG4gICAgaGVhZCA9IHBhcnNlVHJhbnNmb3JtQXJyYXkoaGVhZCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpO1xuICB9XG5cbiAgaGVhZCA9IFBhcnNlTm9kZS5tYWtlSW1wbGljaXRGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpIHx8IGhlYWQ7XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGhlYWQgPSBHZW9KU09OTm9kZS5wYXJzZUFsbChoZWFkLCBtb2RlbCk7XG4gICAgaGVhZCA9IEdlb1BvaW50Tm9kZS5wYXJzZUFsbChoZWFkLCBtb2RlbCk7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcblxuICAgIGlmICghcGFyZW50SXNMYXllcikge1xuICAgICAgaGVhZCA9IEJpbk5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICB9XG5cbiAgICBoZWFkID0gVGltZVVuaXROb2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgaGVhZCA9IENhbGN1bGF0ZU5vZGUucGFyc2VBbGxGb3JTb3J0SW5kZXgoaGVhZCwgbW9kZWwpO1xuICB9XG5cbiAgLy8gYWRkIGFuIG91dHB1dCBub2RlIHByZSBhZ2dyZWdhdGlvblxuICBjb25zdCByYXdOYW1lID0gbW9kZWwuZ2V0TmFtZShSQVcpO1xuICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZShoZWFkLCByYXdOYW1lLCBSQVcsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1tyYXdOYW1lXSA9IHJhdztcbiAgaGVhZCA9IHJhdztcblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKTtcbiAgICBpZiAoYWdnKSB7XG4gICAgICBoZWFkID0gYWdnO1xuXG4gICAgICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkpIHtcbiAgICAgICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWFkID0gU3RhY2tOb2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgaGVhZCA9IEZpbHRlckludmFsaWROb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICAvLyBvdXRwdXQgbm9kZSBmb3IgbWFya3NcbiAgY29uc3QgbWFpbk5hbWUgPSBtb2RlbC5nZXROYW1lKE1BSU4pO1xuICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUoaGVhZCwgbWFpbk5hbWUsIE1BSU4sIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1ttYWluTmFtZV0gPSBtYWluO1xuICBoZWFkID0gbWFpbjtcblxuICAvLyBhZGQgZmFjZXQgbWFya2VyXG4gIGxldCBmYWNldFJvb3QgPSBudWxsO1xuICBpZiAoaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGZhY2V0TmFtZSA9IG1vZGVsLmdldE5hbWUoJ2ZhY2V0Jyk7XG4gICAgZmFjZXRSb290ID0gbmV3IEZhY2V0Tm9kZShoZWFkLCBtb2RlbCwgZmFjZXROYW1lLCBtYWluLmdldFNvdXJjZSgpKTtcbiAgICBvdXRwdXROb2Rlc1tmYWNldE5hbWVdID0gZmFjZXRSb290O1xuICAgIGhlYWQgPSBmYWNldFJvb3Q7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIC4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLFxuICAgIG91dHB1dE5vZGVzLFxuICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgcmF3LFxuICAgIG1haW4sXG4gICAgZmFjZXRSb290LFxuICAgIGFuY2VzdG9yUGFyc2VcbiAgfTtcbn1cbiJdfQ==