"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
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
        else if (transform_1.isWindow(t)) {
            parent = new window_1.WindowTransformNode(parent, t);
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
Formula From Sort Array
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
    var ancestorParse = tslib_1.__assign({}, model.component.data.ancestorParse, (parse ? parse.parse : {}));
    return tslib_1.__assign({}, model.component.data, { outputNodes: outputNodes,
        outputNodeRefCounts: outputNodeRefCounts,
        raw: raw,
        main: main,
        facetRoot: facetRoot,
        ancestorParse: ancestorParse });
}
exports.parseData = parseData;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUE2QztBQUM3QyxtQ0FBcUM7QUFDckMsMkNBQW9EO0FBQ3BELCtCQUFpQztBQUNqQyw2Q0FBb0c7QUFDcEcsNkNBQTBHO0FBQzFHLG1DQUFzQztBQUN0QyxrQ0FBd0U7QUFDeEUsb0RBQTJEO0FBQzNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMscUNBQXNDO0FBQ3RDLHVDQUF3QztBQUN4Qyw2Q0FBNkM7QUFFN0MsbUNBQW9DO0FBQ3BDLG1DQUFvQztBQUNwQyxpQ0FBa0M7QUFDbEMsdUNBQXdDO0FBQ3hDLG1DQUE2QztBQUU3QyxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDL0IsMEVBQTBFO1FBQzFFLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLElBQUksSUFBSSxJQUFJLE9BQU8sRUFBRTtZQUNuQiw4Q0FBOEM7WUFDOUMsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7S0FDRjtTQUFNO1FBQ0wscUdBQXFHO1FBQ3JHLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNB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LENBQUMsQ0FBQztJQUN2RSxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzdCLElBQUksR0FBRyxJQUFJLENBQUM7SUFFWixtQkFBbUI7SUFDbkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksb0JBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsR0FBRyxJQUFJLGlCQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDcEUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNuQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0tBQ2xCO0lBRUQseUZBQXlGO0lBQ3pGLElBQU0sYUFBYSx3QkFBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0YsNEJBQ0ssS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQ3ZCLFdBQVcsYUFBQTtRQUNYLG1CQUFtQixxQkFBQTtRQUNuQixHQUFHLEtBQUE7UUFDSCxJQUFJLE1BQUE7UUFDSixTQUFTLFdBQUE7UUFDVCxhQUFhLGVBQUEsSUFDYjtBQUNKLENBQUM7QUFuR0QsOEJBbUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlciwgaXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge01BSU4sIFJBV30gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0RhdGVUaW1lLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7aXNGaWVsZEVxdWFsUHJlZGljYXRlLCBpc0ZpZWxkT25lT2ZQcmVkaWNhdGUsIGlzRmllbGRSYW5nZVByZWRpY2F0ZX0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7aXNBZ2dyZWdhdGUsIGlzQmluLCBpc0NhbGN1bGF0ZSwgaXNGaWx0ZXIsIGlzTG9va3VwLCBpc1RpbWVVbml0LCBpc1dpbmRvd30gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7cmVxdWlyZXNTZWxlY3Rpb25JZH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0dlb0pTT05Ob2RlfSBmcm9tICcuL2dlb2pzb24nO1xuaW1wb3J0IHtHZW9Qb2ludE5vZGV9IGZyb20gJy4vZ2VvcG9pbnQnO1xuaW1wb3J0IHtJZGVudGlmaWVyTm9kZX0gZnJvbSAnLi9pbmRlbnRpZmllcic7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi93aW5kb3cnO1xuXG5mdW5jdGlvbiBwYXJzZVJvb3QobW9kZWw6IE1vZGVsLCBzb3VyY2VzOiBEaWN0PFNvdXJjZU5vZGU+KTogRGF0YUZsb3dOb2RlIHtcbiAgaWYgKG1vZGVsLmRhdGEgfHwgIW1vZGVsLnBhcmVudCkge1xuICAgIC8vIGlmIHRoZSBtb2RlbCBkZWZpbmVzIGEgZGF0YSBzb3VyY2Ugb3IgaXMgdGhlIHJvb3QsIGNyZWF0ZSBhIHNvdXJjZSBub2RlXG4gICAgY29uc3Qgc291cmNlID0gbmV3IFNvdXJjZU5vZGUobW9kZWwuZGF0YSk7XG4gICAgY29uc3QgaGFzaCA9IHNvdXJjZS5oYXNoKCk7XG4gICAgaWYgKGhhc2ggaW4gc291cmNlcykge1xuICAgICAgLy8gdXNlIGEgcmVmZXJlbmNlIGlmIHdlIGFscmVhZHkgaGF2ZSBhIHNvdXJjZVxuICAgICAgcmV0dXJuIHNvdXJjZXNbaGFzaF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBhZGQgYSBuZXcgb25lXG4gICAgICBzb3VyY2VzW2hhc2hdID0gc291cmNlO1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHNvdXJjZSBkZWZpbmVkIChvdmVycmlkaW5nIHBhcmVudCdzIGRhdGEpLCB1c2UgdGhlIHBhcmVudCdzIGZhY2V0IHJvb3Qgb3IgbWFpbi5cbiAgICByZXR1cm4gbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdCA/IG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgOiBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEubWFpbjtcbiAgfVxufVxuXG5cbi8qKlxuICogUGFyc2VzIGEgdHJhbnNmb3JtcyBhcnJheSBpbnRvIGEgY2hhaW4gb2YgY29ubmVjdGVkIGRhdGFmbG93IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2Zvcm1BcnJheShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsKTogRGF0YUZsb3dOb2RlIHtcbiAgbGV0IGxvb2t1cENvdW50ZXIgPSAwO1xuXG4gIG1vZGVsLnRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcbiAgICBpZiAoaXNDYWxjdWxhdGUodCkpIHtcbiAgICAgIHBhcmVudCA9IG5ldyBDYWxjdWxhdGVOb2RlKHBhcmVudCwgdCk7XG4gICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0KSkge1xuICAgICAgLy8gQXV0b21hdGljYWxseSBhZGQgYSBwYXJzZSBub2RlIGZvciBmaWx0ZXJzIHdpdGggZmlsdGVyIG9iamVjdHNcbiAgICAgIGNvbnN0IHBhcnNlID0ge307XG4gICAgICBjb25zdCBmaWx0ZXIgPSB0LmZpbHRlcjtcbiAgICAgIGxldCB2YWw6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBEYXRlVGltZSA9IG51bGw7XG4gICAgICAvLyBGb3IgRXF1YWxGaWx0ZXIsIGp1c3QgdXNlIHRoZSBlcXVhbCBwcm9wZXJ0eS5cbiAgICAgIC8vIEZvciBSYW5nZUZpbHRlciBhbmQgT25lT2ZGaWx0ZXIsIGFsbCBhcnJheSBtZW1iZXJzIHNob3VsZCBoYXZlXG4gICAgICAvLyB0aGUgc2FtZSB0eXBlLCBzbyB3ZSBvbmx5IHVzZSB0aGUgZmlyc3Qgb25lLlxuICAgICAgaWYgKGlzRmllbGRFcXVhbFByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIHZhbCA9IGZpbHRlci5lcXVhbDtcbiAgICAgIH0gZWxzZSBpZiAoaXNGaWVsZFJhbmdlUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gZmlsdGVyLnJhbmdlWzBdO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkT25lT2ZQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICB2YWwgPSAoZmlsdGVyLm9uZU9mIHx8IGZpbHRlclsnaW4nXSlbMF07XG4gICAgICB9IC8vIGVsc2UgLS0gZm9yIGZpbHRlciBleHByZXNzaW9uLCB3ZSBjYW4ndCBpbmZlciBhbnl0aGluZ1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBpZiAoaXNEYXRlVGltZSh2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdudW1iZXInO1xuICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICBwYXJzZVtmaWx0ZXJbJ2ZpZWxkJ11dID0gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGFyZW50ID0gbmV3IFBhcnNlTm9kZShwYXJlbnQsIHBhcnNlKTtcbiAgICAgIH1cblxuICAgICAgcGFyZW50ID0gbmV3IEZpbHRlck5vZGUocGFyZW50LCBtb2RlbCwgdC5maWx0ZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNCaW4odCkpIHtcbiAgICAgIHBhcmVudCA9IEJpbk5vZGUubWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50LCB0LCBtb2RlbCk7XG4gICAgfSBlbHNlIGlmIChpc1RpbWVVbml0KHQpKSB7XG4gICAgICBwYXJlbnQgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50LCB0KTtcbiAgICB9IGVsc2UgaWYgKGlzQWdncmVnYXRlKHQpKSB7XG4gICAgICBwYXJlbnQgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKHBhcmVudCwgdCk7XG5cbiAgICAgIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSkge1xuICAgICAgICBwYXJlbnQgPSBuZXcgSWRlbnRpZmllck5vZGUocGFyZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTG9va3VwKHQpKSB7XG4gICAgICBwYXJlbnQgPSBMb29rdXBOb2RlLm1ha2UocGFyZW50LCBtb2RlbCwgdCwgbG9va3VwQ291bnRlcisrKTtcbiAgICB9IGVsc2UgaWYgKGlzV2luZG93KHQpKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShwYXJlbnQsIHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkVHJhbnNmb3JtSWdub3JlZCh0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vKlxuRGVzY3JpcHRpb24gb2YgdGhlIGRhdGFmbG93IChodHRwOi8vYXNjaWlmbG93LmNvbS8pOlxuICAgICArLS0tLS0tLS0rXG4gICAgIHwgU291cmNlIHxcbiAgICAgKy0tLSstLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBUcmFuc2Zvcm1zXG4oRmlsdGVyLCBDYWxjdWxhdGUsIC4uLilcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgRm9ybWF0UGFyc2VcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIEJpbm5pbmdcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIFRpbWV1bml0XG4gICAgICAgICB8XG4gICAgICAgICB2XG5Gb3JtdWxhIEZyb20gU29ydCBBcnJheVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgKy0tKy0tK1xuICAgICAgfCBSYXcgfFxuICAgICAgKy0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBBZ2dyZWdhdGVcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgICBTdGFja1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICBJbnZhbGlkIEZpbHRlclxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgKy0tLS0tLS0tLS0rXG4gICB8ICAgTWFpbiAgIHxcbiAgICstLS0tLS0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICArLS0tLS0tLStcbiAgICAgfCBGYWNldCB8LS0tLT4gXCJjb2x1bW5cIiwgXCJjb2x1bW4tbGF5b3V0XCIsIGFuZCBcInJvd1wiXG4gICAgICstLS0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAuLi5DaGlsZCBkYXRhLi4uXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEYXRhKG1vZGVsOiBNb2RlbCk6IERhdGFDb21wb25lbnQge1xuICBsZXQgaGVhZCA9IHBhcnNlUm9vdChtb2RlbCwgbW9kZWwuY29tcG9uZW50LmRhdGEuc291cmNlcyk7XG5cbiAgY29uc3Qgb3V0cHV0Tm9kZXMgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlcztcbiAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHM7XG5cbiAgLy8gRGVmYXVsdCBkaXNjcmV0ZSBzZWxlY3Rpb25zIHJlcXVpcmUgYW4gaWRlbnRpZmllciB0cmFuc2Zvcm0gdG9cbiAgLy8gdW5pcXVlbHkgaWRlbnRpZnkgZGF0YSBwb2ludHMgYXMgdGhlIF9pZCBmaWVsZCBpcyB2b2xhdGlsZS4gQWRkXG4gIC8vIHRoaXMgdHJhbnNmb3JtIGF0IHRoZSBoZWFkIG9mIG91ciBwaXBlbGluZSBzdWNoIHRoYXQgdGhlIGlkZW50aWZpZXJcbiAgLy8gZmllbGQgaXMgYXZhaWxhYmxlIGZvciBhbGwgc3Vic2VxdWVudCBkYXRhc2V0cy4gQWRkaXRpb25hbCBpZGVudGlmaWVyXG4gIC8vIHRyYW5zZm9ybXMgd2lsbCBiZSBuZWNlc3Nhcnkgd2hlbiBuZXcgdHVwbGVzIGFyZSBjb25zdHJ1Y3RlZFxuICAvLyAoZS5nLiwgcG9zdC1hZ2dyZWdhdGlvbikuXG4gIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSAmJiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzTGF5ZXJNb2RlbChtb2RlbCkpKSB7XG4gICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgfVxuXG4gIC8vIEhBQ0s6IFRoaXMgaXMgZXF1aXZhbGVudCBmb3IgbWVyZ2luZyBiaW4gZXh0ZW50IGZvciB1bmlvbiBzY2FsZS5cbiAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMjcwKTogQ29ycmVjdGx5IG1lcmdlIGV4dGVudCAvIGJpbiBub2RlIGZvciBzaGFyZWQgYmluIHNjYWxlXG4gIGNvbnN0IHBhcmVudElzTGF5ZXIgPSBtb2RlbC5wYXJlbnQgJiYgaXNMYXllck1vZGVsKG1vZGVsLnBhcmVudCk7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGlmIChwYXJlbnRJc0xheWVyKSB7XG4gICAgICBoZWFkID0gQmluTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtb2RlbC50cmFuc2Zvcm1zLmxlbmd0aCA+IDApIHtcbiAgICBoZWFkID0gcGFyc2VUcmFuc2Zvcm1BcnJheShoZWFkLCBtb2RlbCk7XG4gIH1cblxuICBjb25zdCBwYXJzZSA9IFBhcnNlTm9kZS5tYWtlKGhlYWQsIG1vZGVsKTtcbiAgaWYgKHBhcnNlKSB7XG4gICAgaGVhZCA9IHBhcnNlO1xuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGhlYWQgPSBHZW9KU09OTm9kZS5wYXJzZUFsbChoZWFkLCBtb2RlbCk7XG4gICAgaGVhZCA9IEdlb1BvaW50Tm9kZS5wYXJzZUFsbChoZWFkLCBtb2RlbCk7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcblxuICAgIGlmICghcGFyZW50SXNMYXllcikge1xuICAgICAgaGVhZCA9IEJpbk5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICB9XG5cbiAgICBoZWFkID0gVGltZVVuaXROb2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgaGVhZCA9IENhbGN1bGF0ZU5vZGUucGFyc2VBbGxGb3JTb3J0SW5kZXgoaGVhZCwgbW9kZWwpO1xuICB9XG5cbiAgLy8gYWRkIGFuIG91dHB1dCBub2RlIHByZSBhZ2dyZWdhdGlvblxuICBjb25zdCByYXdOYW1lID0gbW9kZWwuZ2V0TmFtZShSQVcpO1xuICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZShoZWFkLCByYXdOYW1lLCBSQVcsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1tyYXdOYW1lXSA9IHJhdztcbiAgaGVhZCA9IHJhdztcblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKTtcbiAgICBpZiAoYWdnKSB7XG4gICAgICBoZWFkID0gYWdnO1xuXG4gICAgICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkpIHtcbiAgICAgICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWFkID0gU3RhY2tOb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgaGVhZCA9IEZpbHRlckludmFsaWROb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICAvLyBvdXRwdXQgbm9kZSBmb3IgbWFya3NcbiAgY29uc3QgbWFpbk5hbWUgPSBtb2RlbC5nZXROYW1lKE1BSU4pO1xuICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUoaGVhZCwgbWFpbk5hbWUsIE1BSU4sIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1ttYWluTmFtZV0gPSBtYWluO1xuICBoZWFkID0gbWFpbjtcblxuICAvLyBhZGQgZmFjZXQgbWFya2VyXG4gIGxldCBmYWNldFJvb3QgPSBudWxsO1xuICBpZiAoaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGZhY2V0TmFtZSA9IG1vZGVsLmdldE5hbWUoJ2ZhY2V0Jyk7XG4gICAgZmFjZXRSb290ID0gbmV3IEZhY2V0Tm9kZShoZWFkLCBtb2RlbCwgZmFjZXROYW1lLCBtYWluLmdldFNvdXJjZSgpKTtcbiAgICBvdXRwdXROb2Rlc1tmYWNldE5hbWVdID0gZmFjZXRSb290O1xuICAgIGhlYWQgPSBmYWNldFJvb3Q7XG4gIH1cblxuICAvLyBhZGQgdGhlIGZvcm1hdCBwYXJzZSBmcm9tIHRoaXMgbW9kZWwgc28gdGhhdCBjaGlsZHJlbiBkb24ndCBwYXJzZSB0aGUgc2FtZSBmaWVsZCBhZ2FpblxuICBjb25zdCBhbmNlc3RvclBhcnNlID0gey4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UsIC4uLihwYXJzZSA/IHBhcnNlLnBhcnNlIDoge30pfTtcblxuICByZXR1cm4ge1xuICAgIC4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLFxuICAgIG91dHB1dE5vZGVzLFxuICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgcmF3LFxuICAgIG1haW4sXG4gICAgZmFjZXRSb290LFxuICAgIGFuY2VzdG9yUGFyc2VcbiAgfTtcbn1cbiJdfQ==