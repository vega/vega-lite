"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var data_1 = require("../../data");
var log = tslib_1.__importStar(require("../../log"));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLG1DQUFxQztBQUNyQyxxREFBaUM7QUFDakMsNkNBQW1IO0FBQ25ILG1DQUFzQztBQUN0QyxrQ0FBd0U7QUFDeEUsb0RBQTJEO0FBQzNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMscUNBQXNDO0FBQ3RDLHVDQUF3QztBQUN4Qyw2Q0FBNkM7QUFDN0MsaUNBQXFEO0FBQ3JELG1DQUFvQztBQUNwQyxtQ0FBb0M7QUFDcEMsaUNBQWtDO0FBQ2xDLHVDQUF3QztBQUN4QyxtQ0FBNkM7QUFFN0MsbUJBQW1CLEtBQVksRUFBRSxPQUF5QjtJQUN4RCxJQUFJLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1FBQy9CLDBFQUEwRTtRQUMxRSxJQUFNLE1BQU0sR0FBRyxJQUFJLG1CQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUMzQixJQUFJLElBQUksSUFBSSxPQUFPLEVBQUU7WUFDbkIsOENBQThDO1lBQzlDLE9BQU8sT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3RCO2FBQU07WUFDTCwwQkFBMEI7WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQztZQUN2QixPQUFPLE1BQU0sQ0FBQztTQUNmO0tBQ0Y7U0FBTTtRQUNMLHFHQUFxRztRQUNyRyxPQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FB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LElBQUksR0FBRyxTQUFTLENBQUM7S0FDbEI7SUFFRCw0QkFDSyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksSUFDdkIsV0FBVyxhQUFBO1FBQ1gsbUJBQW1CLHFCQUFBO1FBQ25CLEdBQUcsS0FBQTtRQUNILElBQUksTUFBQTtRQUNKLFNBQVMsV0FBQTtRQUNULGFBQWEsZUFBQSxJQUNiO0FBQ0osQ0FBQztBQXBHRCw4QkFvR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge01BSU4sIFJBV30gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7aXNBZ2dyZWdhdGUsIGlzQmluLCBpc0NhbGN1bGF0ZSwgaXNGaWx0ZXIsIGlzTG9va3VwLCBpc1N0YWNrLCBpc1RpbWVVbml0LCBpc1dpbmRvd30gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7cmVxdWlyZXNTZWxlY3Rpb25JZH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0dlb0pTT05Ob2RlfSBmcm9tICcuL2dlb2pzb24nO1xuaW1wb3J0IHtHZW9Qb2ludE5vZGV9IGZyb20gJy4vZ2VvcG9pbnQnO1xuaW1wb3J0IHtJZGVudGlmaWVyTm9kZX0gZnJvbSAnLi9pbmRlbnRpZmllcic7XG5pbXBvcnQge0FuY2VzdG9yUGFyc2UsIERhdGFDb21wb25lbnR9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi93aW5kb3cnO1xuXG5mdW5jdGlvbiBwYXJzZVJvb3QobW9kZWw6IE1vZGVsLCBzb3VyY2VzOiBEaWN0PFNvdXJjZU5vZGU+KTogRGF0YUZsb3dOb2RlIHtcbiAgaWYgKG1vZGVsLmRhdGEgfHwgIW1vZGVsLnBhcmVudCkge1xuICAgIC8vIGlmIHRoZSBtb2RlbCBkZWZpbmVzIGEgZGF0YSBzb3VyY2Ugb3IgaXMgdGhlIHJvb3QsIGNyZWF0ZSBhIHNvdXJjZSBub2RlXG4gICAgY29uc3Qgc291cmNlID0gbmV3IFNvdXJjZU5vZGUobW9kZWwuZGF0YSk7XG4gICAgY29uc3QgaGFzaCA9IHNvdXJjZS5oYXNoKCk7XG4gICAgaWYgKGhhc2ggaW4gc291cmNlcykge1xuICAgICAgLy8gdXNlIGEgcmVmZXJlbmNlIGlmIHdlIGFscmVhZHkgaGF2ZSBhIHNvdXJjZVxuICAgICAgcmV0dXJuIHNvdXJjZXNbaGFzaF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBhZGQgYSBuZXcgb25lXG4gICAgICBzb3VyY2VzW2hhc2hdID0gc291cmNlO1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHNvdXJjZSBkZWZpbmVkIChvdmVycmlkaW5nIHBhcmVudCdzIGRhdGEpLCB1c2UgdGhlIHBhcmVudCdzIGZhY2V0IHJvb3Qgb3IgbWFpbi5cbiAgICByZXR1cm4gbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdCA/IG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgOiBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEubWFpbjtcbiAgfVxufVxuXG5cbi8qKlxuICogUGFyc2VzIGEgdHJhbnNmb3JtcyBhcnJheSBpbnRvIGEgY2hhaW4gb2YgY29ubmVjdGVkIGRhdGFmbG93IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2Zvcm1BcnJheShoZWFkOiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbCwgYW5jZXN0b3JQYXJzZTogQW5jZXN0b3JQYXJzZSk6IERhdGFGbG93Tm9kZSB7XG4gIGxldCBsb29rdXBDb3VudGVyID0gMDtcblxuICBtb2RlbC50cmFuc2Zvcm1zLmZvckVhY2godCA9PiB7XG4gICAgaWYgKGlzQ2FsY3VsYXRlKHQpKSB7XG4gICAgICBoZWFkID0gbmV3IENhbGN1bGF0ZU5vZGUoaGVhZCwgdCk7XG4gICAgICBhbmNlc3RvclBhcnNlLnNldCh0LmFzLCAnZGVyaXZlZCcsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKGlzRmlsdGVyKHQpKSB7XG4gICAgICBoZWFkID0gUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21GaWx0ZXJUcmFuc2Zvcm0oaGVhZCwgdCwgYW5jZXN0b3JQYXJzZSkgfHwgaGVhZDtcblxuICAgICAgaGVhZCA9IG5ldyBGaWx0ZXJOb2RlKGhlYWQsIG1vZGVsLCB0LmZpbHRlcik7XG4gICAgfSBlbHNlIGlmIChpc0Jpbih0KSkge1xuICAgICAgaGVhZCA9IEJpbk5vZGUubWFrZUZyb21UcmFuc2Zvcm0oaGVhZCwgdCwgbW9kZWwpO1xuXG4gICAgICBhbmNlc3RvclBhcnNlLnNldCh0LmFzLCAnbnVtYmVyJywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoaXNUaW1lVW5pdCh0KSkge1xuICAgICAgaGVhZCA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbVRyYW5zZm9ybShoZWFkLCB0KTtcblxuICAgICAgYW5jZXN0b3JQYXJzZS5zZXQodC5hcywgJ2RhdGUnLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChpc0FnZ3JlZ2F0ZSh0KSkge1xuICAgICAgY29uc3QgYWdnID0gaGVhZCA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21UcmFuc2Zvcm0oaGVhZCwgdCk7XG5cbiAgICAgIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSkge1xuICAgICAgICBoZWFkID0gbmV3IElkZW50aWZpZXJOb2RlKGhlYWQpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXMoYWdnLnByb2R1Y2VkRmllbGRzKCkpKSB7XG4gICAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KGZpZWxkLCAnZGVyaXZlZCcsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTG9va3VwKHQpKSB7XG4gICAgICBjb25zdCBsb29rdXAgPSBoZWFkID0gTG9va3VwTm9kZS5tYWtlKGhlYWQsIG1vZGVsLCB0LCBsb29rdXBDb3VudGVyKyspO1xuXG4gICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXMobG9va3VwLnByb2R1Y2VkRmllbGRzKCkpKSB7XG4gICAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KGZpZWxkLCAnZGVyaXZlZCcsIGZhbHNlKTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzV2luZG93KHQpKSB7XG4gICAgICBjb25zdCB3aW5kb3cgPSBoZWFkID0gbmV3IFdpbmRvd1RyYW5zZm9ybU5vZGUoaGVhZCwgdCk7XG5cbiAgICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyh3aW5kb3cucHJvZHVjZWRGaWVsZHMoKSkpIHtcbiAgICAgICAgYW5jZXN0b3JQYXJzZS5zZXQoZmllbGQsICdkZXJpdmVkJywgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNTdGFjayh0KSkge1xuICAgICAgY29uc3Qgc3RhY2sgPSBoZWFkID0gU3RhY2tOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKGhlYWQsIHQpO1xuXG4gICAgICBmb3IgKGNvbnN0IGZpZWxkIG9mIGtleXMoc3RhY2sucHJvZHVjZWRGaWVsZHMoKSkpIHtcbiAgICAgICAgYW5jZXN0b3JQYXJzZS5zZXQoZmllbGQsICdkZXJpdmVkJywgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkVHJhbnNmb3JtSWdub3JlZCh0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gaGVhZDtcbn1cblxuLypcbkRlc2NyaXB0aW9uIG9mIHRoZSBkYXRhZmxvdyAoaHR0cDovL2FzY2lpZmxvdy5jb20vKTpcbiAgICAgKy0tLS0tLS0tK1xuICAgICB8IFNvdXJjZSB8XG4gICAgICstLS0rLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgRm9ybWF0UGFyc2VcbiAgICAgKGV4cGxpY2l0KVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBUcmFuc2Zvcm1zXG4oRmlsdGVyLCBDYWxjdWxhdGUsIEJpbm5pbmcsIFRpbWVVbml0LCBBZ2dyZWdhdGUsIFdpbmRvdywgLi4uKVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBGb3JtYXRQYXJzZVxuICAgICAoaW1wbGljaXQpXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gQmlubmluZyAoaW4gYGVuY29kaW5nYClcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiBUaW1ldW5pdCAoaW4gYGVuY29kaW5nYClcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbkZvcm11bGEgRnJvbSBTb3J0IEFycmF5XG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICArLS0rLS0rXG4gICAgICB8IFJhdyB8XG4gICAgICArLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIEFnZ3JlZ2F0ZSAoaW4gYGVuY29kaW5nYClcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgU3RhY2sgKGluIGBlbmNvZGluZ2ApXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIEludmFsaWQgRmlsdGVyXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICArLS0tLS0tLS0tLStcbiAgIHwgICBNYWluICAgfFxuICAgKy0tLS0tLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICstLS0tLS0tK1xuICAgICB8IEZhY2V0IHwtLS0tPiBcImNvbHVtblwiLCBcImNvbHVtbi1sYXlvdXRcIiwgYW5kIFwicm93XCJcbiAgICAgKy0tLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIC4uLkNoaWxkIGRhdGEuLi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURhdGEobW9kZWw6IE1vZGVsKTogRGF0YUNvbXBvbmVudCB7XG4gIGxldCBoZWFkID0gcGFyc2VSb290KG1vZGVsLCBtb2RlbC5jb21wb25lbnQuZGF0YS5zb3VyY2VzKTtcblxuICBjb25zdCB7b3V0cHV0Tm9kZXMsIG91dHB1dE5vZGVSZWZDb3VudHN9ID0gbW9kZWwuY29tcG9uZW50LmRhdGE7XG4gIGNvbnN0IGFuY2VzdG9yUGFyc2UgPSBtb2RlbC5wYXJlbnQgPyBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZS5jbG9uZSgpIDogbmV3IEFuY2VzdG9yUGFyc2UoKTtcblxuICAvLyBmb3JtYXQucGFyc2U6IG51bGwgbWVhbnMgZGlzYWJsZSBwYXJzaW5nXG4gIGlmIChtb2RlbC5kYXRhICYmIG1vZGVsLmRhdGEuZm9ybWF0ICYmIG1vZGVsLmRhdGEuZm9ybWF0LnBhcnNlID09PSBudWxsKSB7XG4gICAgYW5jZXN0b3JQYXJzZS5wYXJzZU5vdGhpbmcgPSB0cnVlO1xuICB9XG5cbiAgaGVhZCA9IFBhcnNlTm9kZS5tYWtlRXhwbGljaXQoaGVhZCwgbW9kZWwsIGFuY2VzdG9yUGFyc2UpIHx8IGhlYWQ7XG5cbiAgLy8gRGVmYXVsdCBkaXNjcmV0ZSBzZWxlY3Rpb25zIHJlcXVpcmUgYW4gaWRlbnRpZmllciB0cmFuc2Zvcm0gdG9cbiAgLy8gdW5pcXVlbHkgaWRlbnRpZnkgZGF0YSBwb2ludHMgYXMgdGhlIF9pZCBmaWVsZCBpcyB2b2xhdGlsZS4gQWRkXG4gIC8vIHRoaXMgdHJhbnNmb3JtIGF0IHRoZSBoZWFkIG9mIG91ciBwaXBlbGluZSBzdWNoIHRoYXQgdGhlIGlkZW50aWZpZXJcbiAgLy8gZmllbGQgaXMgYXZhaWxhYmxlIGZvciBhbGwgc3Vic2VxdWVudCBkYXRhc2V0cy4gQWRkaXRpb25hbCBpZGVudGlmaWVyXG4gIC8vIHRyYW5zZm9ybXMgd2lsbCBiZSBuZWNlc3Nhcnkgd2hlbiBuZXcgdHVwbGVzIGFyZSBjb25zdHJ1Y3RlZFxuICAvLyAoZS5nLiwgcG9zdC1hZ2dyZWdhdGlvbikuXG4gIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSAmJiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzTGF5ZXJNb2RlbChtb2RlbCkpKSB7XG4gICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgfVxuXG4gIC8vIEhBQ0s6IFRoaXMgaXMgZXF1aXZhbGVudCBmb3IgbWVyZ2luZyBiaW4gZXh0ZW50IGZvciB1bmlvbiBzY2FsZS5cbiAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMjcwKTogQ29ycmVjdGx5IG1lcmdlIGV4dGVudCAvIGJpbiBub2RlIGZvciBzaGFyZWQgYmluIHNjYWxlXG4gIGNvbnN0IHBhcmVudElzTGF5ZXIgPSBtb2RlbC5wYXJlbnQgJiYgaXNMYXllck1vZGVsKG1vZGVsLnBhcmVudCk7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGlmIChwYXJlbnRJc0xheWVyKSB7XG4gICAgICBoZWFkID0gQmluTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtb2RlbC50cmFuc2Zvcm1zLmxlbmd0aCA+IDApIHtcbiAgICBoZWFkID0gcGFyc2VUcmFuc2Zvcm1BcnJheShoZWFkLCBtb2RlbCwgYW5jZXN0b3JQYXJzZSk7XG4gIH1cblxuICBoZWFkID0gUGFyc2VOb2RlLm1ha2VJbXBsaWNpdEZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCwgYW5jZXN0b3JQYXJzZSkgfHwgaGVhZDtcblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgaGVhZCA9IEdlb0pTT05Ob2RlLnBhcnNlQWxsKGhlYWQsIG1vZGVsKTtcbiAgICBoZWFkID0gR2VvUG9pbnROb2RlLnBhcnNlQWxsKGhlYWQsIG1vZGVsKTtcbiAgfVxuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuXG4gICAgaWYgKCFwYXJlbnRJc0xheWVyKSB7XG4gICAgICBoZWFkID0gQmluTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICAgIH1cblxuICAgIGhlYWQgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICBoZWFkID0gQ2FsY3VsYXRlTm9kZS5wYXJzZUFsbEZvclNvcnRJbmRleChoZWFkLCBtb2RlbCk7XG4gIH1cblxuICAvLyBhZGQgYW4gb3V0cHV0IG5vZGUgcHJlIGFnZ3JlZ2F0aW9uXG4gIGNvbnN0IHJhd05hbWUgPSBtb2RlbC5nZXROYW1lKFJBVyk7XG4gIGNvbnN0IHJhdyA9IG5ldyBPdXRwdXROb2RlKGhlYWQsIHJhd05hbWUsIFJBVywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gIG91dHB1dE5vZGVzW3Jhd05hbWVdID0gcmF3O1xuICBoZWFkID0gcmF3O1xuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpO1xuICAgIGlmIChhZ2cpIHtcbiAgICAgIGhlYWQgPSBhZ2c7XG5cbiAgICAgIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSkge1xuICAgICAgICBoZWFkID0gbmV3IElkZW50aWZpZXJOb2RlKGhlYWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlYWQgPSBTdGFja05vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgfVxuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBoZWFkID0gRmlsdGVySW52YWxpZE5vZGUubWFrZShoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgfVxuXG4gIC8vIG91dHB1dCBub2RlIGZvciBtYXJrc1xuICBjb25zdCBtYWluTmFtZSA9IG1vZGVsLmdldE5hbWUoTUFJTik7XG4gIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShoZWFkLCBtYWluTmFtZSwgTUFJTiwgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gIG91dHB1dE5vZGVzW21haW5OYW1lXSA9IG1haW47XG4gIGhlYWQgPSBtYWluO1xuXG4gIC8vIGFkZCBmYWNldCBtYXJrZXJcbiAgbGV0IGZhY2V0Um9vdCA9IG51bGw7XG4gIGlmIChpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgZmFjZXROYW1lID0gbW9kZWwuZ2V0TmFtZSgnZmFjZXQnKTtcbiAgICBmYWNldFJvb3QgPSBuZXcgRmFjZXROb2RlKGhlYWQsIG1vZGVsLCBmYWNldE5hbWUsIG1haW4uZ2V0U291cmNlKCkpO1xuICAgIG91dHB1dE5vZGVzW2ZhY2V0TmFtZV0gPSBmYWNldFJvb3Q7XG4gICAgaGVhZCA9IGZhY2V0Um9vdDtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgLi4ubW9kZWwuY29tcG9uZW50LmRhdGEsXG4gICAgb3V0cHV0Tm9kZXMsXG4gICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICByYXcsXG4gICAgbWFpbixcbiAgICBmYWNldFJvb3QsXG4gICAgYW5jZXN0b3JQYXJzZVxuICB9O1xufVxuIl19