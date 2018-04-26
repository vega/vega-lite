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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVDQUE2QztBQUM3QyxtQ0FBcUM7QUFDckMsMkNBQW9EO0FBQ3BELCtCQUFpQztBQUNqQyw2Q0FBb0c7QUFDcEcsNkNBQTBHO0FBQzFHLG1DQUFzQztBQUN0QyxrQ0FBd0U7QUFDeEUsb0RBQTJEO0FBQzNELHlDQUEwQztBQUMxQyw2QkFBOEI7QUFDOUIseUNBQTBDO0FBQzFDLHVDQUFvRDtBQUNwRCxpQ0FBa0M7QUFDbEMsbUNBQW9DO0FBQ3BDLGlEQUFrRDtBQUNsRCw2Q0FBd0M7QUFDeEMscUNBQXNDO0FBQ3RDLHVDQUF3QztBQUN4Qyw2Q0FBNkM7QUFFN0MsbUNBQW9DO0FBQ3BDLG1DQUFvQztBQUNwQyxpQ0FBa0M7QUFDbEMsdUNBQXdDO0FBQ3hDLG1DQUE2QztBQUU3QyxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDL0IsMEVBQTBFO1FBQzFFLElBQU0sTUFBTSxHQUFHLElBQUksbUJBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzNCLElBQUksSUFBSSxJQUFJLE9BQU8sRUFBRTtZQUNuQiw4Q0FBOEM7WUFDOUMsT0FBTyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLDBCQUEwQjtZQUMxQixPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsTUFBTSxDQUFDO1lBQ3ZCLE9BQU8sTUFBTSxDQUFDO1NBQ2Y7S0FDRjtTQUFNO1FBQ0wscUdBQXFHO1FBQ3JHLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNB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LENBQUMsQ0FBQztJQUN2RSxXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDO0lBQzdCLElBQUksR0FBRyxJQUFJLENBQUM7SUFFWixtQkFBbUI7SUFDbkIsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQ3JCLElBQUksb0JBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsR0FBRyxJQUFJLGlCQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFDcEUsV0FBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLFNBQVMsQ0FBQztRQUNuQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0tBQ2xCO0lBRUQseUZBQXlGO0lBQ3pGLElBQU0sYUFBYSx3QkFBTyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0YsNEJBQ0ssS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQ3ZCLFdBQVcsYUFBQTtRQUNYLG1CQUFtQixxQkFBQTtRQUNuQixHQUFHLEtBQUE7UUFDSCxJQUFJLE1BQUE7UUFDSixTQUFTLFdBQUE7UUFDVCxhQUFhLGVBQUEsSUFDYjtBQUNKLENBQUM7QUFuR0QsOEJBbUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc051bWJlciwgaXNTdHJpbmd9IGZyb20gJ3ZlZ2EtdXRpbCc7XG5pbXBvcnQge01BSU4sIFJBV30gZnJvbSAnLi4vLi4vZGF0YSc7XG5pbXBvcnQge0RhdGVUaW1lLCBpc0RhdGVUaW1lfSBmcm9tICcuLi8uLi9kYXRldGltZSc7XG5pbXBvcnQgKiBhcyBsb2cgZnJvbSAnLi4vLi4vbG9nJztcbmltcG9ydCB7aXNGaWVsZEVxdWFsUHJlZGljYXRlLCBpc0ZpZWxkT25lT2ZQcmVkaWNhdGUsIGlzRmllbGRSYW5nZVByZWRpY2F0ZX0gZnJvbSAnLi4vLi4vcHJlZGljYXRlJztcbmltcG9ydCB7aXNBZ2dyZWdhdGUsIGlzQmluLCBpc0NhbGN1bGF0ZSwgaXNGaWx0ZXIsIGlzTG9va3VwLCBpc1RpbWVVbml0LCBpc1dpbmRvd30gZnJvbSAnLi4vLi4vdHJhbnNmb3JtJztcbmltcG9ydCB7RGljdCwga2V5c30gZnJvbSAnLi4vLi4vdXRpbCc7XG5pbXBvcnQge2lzRmFjZXRNb2RlbCwgaXNMYXllck1vZGVsLCBpc1VuaXRNb2RlbCwgTW9kZWx9IGZyb20gJy4uL21vZGVsJztcbmltcG9ydCB7cmVxdWlyZXNTZWxlY3Rpb25JZH0gZnJvbSAnLi4vc2VsZWN0aW9uL3NlbGVjdGlvbic7XG5pbXBvcnQge0FnZ3JlZ2F0ZU5vZGV9IGZyb20gJy4vYWdncmVnYXRlJztcbmltcG9ydCB7QmluTm9kZX0gZnJvbSAnLi9iaW4nO1xuaW1wb3J0IHtDYWxjdWxhdGVOb2RlfSBmcm9tICcuL2NhbGN1bGF0ZSc7XG5pbXBvcnQge0RhdGFGbG93Tm9kZSwgT3V0cHV0Tm9kZX0gZnJvbSAnLi9kYXRhZmxvdyc7XG5pbXBvcnQge0ZhY2V0Tm9kZX0gZnJvbSAnLi9mYWNldCc7XG5pbXBvcnQge0ZpbHRlck5vZGV9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7RmlsdGVySW52YWxpZE5vZGV9IGZyb20gJy4vZmlsdGVyaW52YWxpZCc7XG5pbXBvcnQge1BhcnNlTm9kZX0gZnJvbSAnLi9mb3JtYXRwYXJzZSc7XG5pbXBvcnQge0dlb0pTT05Ob2RlfSBmcm9tICcuL2dlb2pzb24nO1xuaW1wb3J0IHtHZW9Qb2ludE5vZGV9IGZyb20gJy4vZ2VvcG9pbnQnO1xuaW1wb3J0IHtJZGVudGlmaWVyTm9kZX0gZnJvbSAnLi9pbmRlbnRpZmllcic7XG5pbXBvcnQge0RhdGFDb21wb25lbnR9IGZyb20gJy4vaW5kZXgnO1xuaW1wb3J0IHtMb29rdXBOb2RlfSBmcm9tICcuL2xvb2t1cCc7XG5pbXBvcnQge1NvdXJjZU5vZGV9IGZyb20gJy4vc291cmNlJztcbmltcG9ydCB7U3RhY2tOb2RlfSBmcm9tICcuL3N0YWNrJztcbmltcG9ydCB7VGltZVVuaXROb2RlfSBmcm9tICcuL3RpbWV1bml0JztcbmltcG9ydCB7V2luZG93VHJhbnNmb3JtTm9kZX0gZnJvbSAnLi93aW5kb3cnO1xuXG5mdW5jdGlvbiBwYXJzZVJvb3QobW9kZWw6IE1vZGVsLCBzb3VyY2VzOiBEaWN0PFNvdXJjZU5vZGU+KTogRGF0YUZsb3dOb2RlIHtcbiAgaWYgKG1vZGVsLmRhdGEgfHwgIW1vZGVsLnBhcmVudCkge1xuICAgIC8vIGlmIHRoZSBtb2RlbCBkZWZpbmVzIGEgZGF0YSBzb3VyY2Ugb3IgaXMgdGhlIHJvb3QsIGNyZWF0ZSBhIHNvdXJjZSBub2RlXG4gICAgY29uc3Qgc291cmNlID0gbmV3IFNvdXJjZU5vZGUobW9kZWwuZGF0YSk7XG4gICAgY29uc3QgaGFzaCA9IHNvdXJjZS5oYXNoKCk7XG4gICAgaWYgKGhhc2ggaW4gc291cmNlcykge1xuICAgICAgLy8gdXNlIGEgcmVmZXJlbmNlIGlmIHdlIGFscmVhZHkgaGF2ZSBhIHNvdXJjZVxuICAgICAgcmV0dXJuIHNvdXJjZXNbaGFzaF07XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIG90aGVyd2lzZSBhZGQgYSBuZXcgb25lXG4gICAgICBzb3VyY2VzW2hhc2hdID0gc291cmNlO1xuICAgICAgcmV0dXJuIHNvdXJjZTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gSWYgd2UgZG9uJ3QgaGF2ZSBhIHNvdXJjZSBkZWZpbmVkIChvdmVycmlkaW5nIHBhcmVudCdzIGRhdGEpLCB1c2UgdGhlIHBhcmVudCdzIGZhY2V0IHJvb3Qgb3IgbWFpbi5cbiAgICByZXR1cm4gbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdCA/IG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgOiBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEubWFpbjtcbiAgfVxufVxuXG5cbi8qKlxuICogUGFyc2VzIGEgdHJhbnNmb3JtcyBhcnJheSBpbnRvIGEgY2hhaW4gb2YgY29ubmVjdGVkIGRhdGFmbG93IG5vZGVzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VUcmFuc2Zvcm1BcnJheShwYXJlbnQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsKTogRGF0YUZsb3dOb2RlIHtcbiAgbGV0IGxvb2t1cENvdW50ZXIgPSAwO1xuXG4gIG1vZGVsLnRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcbiAgICBpZiAoaXNDYWxjdWxhdGUodCkpIHtcbiAgICAgIHBhcmVudCA9IG5ldyBDYWxjdWxhdGVOb2RlKHBhcmVudCwgdCk7XG4gICAgfSBlbHNlIGlmIChpc0ZpbHRlcih0KSkge1xuICAgICAgLy8gQXV0b21hdGljYWxseSBhZGQgYSBwYXJzZSBub2RlIGZvciBmaWx0ZXJzIHdpdGggZmlsdGVyIG9iamVjdHNcbiAgICAgIGNvbnN0IHBhcnNlID0ge307XG4gICAgICBjb25zdCBmaWx0ZXIgPSB0LmZpbHRlcjtcbiAgICAgIGxldCB2YWw6IHN0cmluZyB8IG51bWJlciB8IGJvb2xlYW4gfCBEYXRlVGltZSA9IG51bGw7XG4gICAgICAvLyBGb3IgRXF1YWxGaWx0ZXIsIGp1c3QgdXNlIHRoZSBlcXVhbCBwcm9wZXJ0eS5cbiAgICAgIC8vIEZvciBSYW5nZUZpbHRlciBhbmQgT25lT2ZGaWx0ZXIsIGFsbCBhcnJheSBtZW1iZXJzIHNob3VsZCBoYXZlXG4gICAgICAvLyB0aGUgc2FtZSB0eXBlLCBzbyB3ZSBvbmx5IHVzZSB0aGUgZmlyc3Qgb25lLlxuICAgICAgaWYgKGlzRmllbGRFcXVhbFByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIHZhbCA9IGZpbHRlci5lcXVhbDtcbiAgICAgIH0gZWxzZSBpZiAoaXNGaWVsZFJhbmdlUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gZmlsdGVyLnJhbmdlWzBdO1xuICAgICAgfSBlbHNlIGlmIChpc0ZpZWxkT25lT2ZQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICB2YWwgPSAoZmlsdGVyLm9uZU9mIHx8IGZpbHRlclsnaW4nXSlbMF07XG4gICAgICB9IC8vIGVsc2UgLS0gZm9yIGZpbHRlciBleHByZXNzaW9uLCB3ZSBjYW4ndCBpbmZlciBhbnl0aGluZ1xuICAgICAgaWYgKHZhbCkge1xuICAgICAgICBpZiAoaXNEYXRlVGltZSh2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdkYXRlJztcbiAgICAgICAgfSBlbHNlIGlmIChpc051bWJlcih2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdudW1iZXInO1xuICAgICAgICB9IGVsc2UgaWYgKGlzU3RyaW5nKHZhbCkpIHtcbiAgICAgICAgICBwYXJzZVtmaWx0ZXJbJ2ZpZWxkJ11dID0gJ3N0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKGtleXMocGFyc2UpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgcGFyZW50ID0gbmV3IFBhcnNlTm9kZShwYXJlbnQsIHBhcnNlKTtcbiAgICAgIH1cblxuXG4gICAgICBwYXJlbnQgPSBuZXcgRmlsdGVyTm9kZShwYXJlbnQsIG1vZGVsLCB0LmZpbHRlcik7XG4gICAgfSBlbHNlIGlmIChpc0Jpbih0KSkge1xuICAgICAgcGFyZW50ID0gQmluTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQsIHQsIG1vZGVsKTtcbiAgICB9IGVsc2UgaWYgKGlzVGltZVVuaXQodCkpIHtcbiAgICAgIHBhcmVudCA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbVRyYW5zZm9ybShwYXJlbnQsIHQpO1xuICAgIH0gZWxzZSBpZiAoaXNBZ2dyZWdhdGUodCkpIHtcbiAgICAgIHBhcmVudCA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50LCB0KTtcblxuICAgICAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpKSB7XG4gICAgICAgIHBhcmVudCA9IG5ldyBJZGVudGlmaWVyTm9kZShwYXJlbnQpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNMb29rdXAodCkpIHtcbiAgICAgIHBhcmVudCA9IExvb2t1cE5vZGUubWFrZShwYXJlbnQsIG1vZGVsLCB0LCBsb29rdXBDb3VudGVyKyspO1xuICAgIH0gZWxzZSBpZiAoaXNXaW5kb3codCkpIHtcbiAgICAgIHBhcmVudCA9IG5ldyBXaW5kb3dUcmFuc2Zvcm1Ob2RlKHBhcmVudCwgdCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRUcmFuc2Zvcm1JZ25vcmVkKHQpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwYXJlbnQ7XG59XG5cbi8qXG5EZXNjcmlwdGlvbiBvZiB0aGUgZGF0YWZsb3cgKGh0dHA6Ly9hc2NpaWZsb3cuY29tLyk6XG4gICAgICstLS0tLS0tLStcbiAgICAgfCBTb3VyY2UgfFxuICAgICArLS0tKy0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIFRyYW5zZm9ybXNcbihGaWx0ZXIsIENhbGN1bGF0ZSwgLi4uKVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBGb3JtYXRQYXJzZVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgQmlubmluZ1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgVGltZXVuaXRcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbkZvcm11bGEgRnJvbSBTb3J0IEFycmF5XG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICArLS0rLS0rXG4gICAgICB8IFJhdyB8XG4gICAgICArLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIEFnZ3JlZ2F0ZVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgIFN0YWNrXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIEludmFsaWQgRmlsdGVyXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICArLS0tLS0tLS0tLStcbiAgIHwgICBNYWluICAgfFxuICAgKy0tLS0tLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgICstLS0tLS0tK1xuICAgICB8IEZhY2V0IHwtLS0tPiBcImNvbHVtblwiLCBcImNvbHVtbi1sYXlvdXRcIiwgYW5kIFwicm93XCJcbiAgICAgKy0tLS0tLS0rXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gIC4uLkNoaWxkIGRhdGEuLi5cbiovXG5cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZURhdGEobW9kZWw6IE1vZGVsKTogRGF0YUNvbXBvbmVudCB7XG4gIGxldCBoZWFkID0gcGFyc2VSb290KG1vZGVsLCBtb2RlbC5jb21wb25lbnQuZGF0YS5zb3VyY2VzKTtcblxuICBjb25zdCBvdXRwdXROb2RlcyA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVzO1xuICBjb25zdCBvdXRwdXROb2RlUmVmQ291bnRzID0gbW9kZWwuY29tcG9uZW50LmRhdGEub3V0cHV0Tm9kZVJlZkNvdW50cztcblxuICAvLyBEZWZhdWx0IGRpc2NyZXRlIHNlbGVjdGlvbnMgcmVxdWlyZSBhbiBpZGVudGlmaWVyIHRyYW5zZm9ybSB0b1xuICAvLyB1bmlxdWVseSBpZGVudGlmeSBkYXRhIHBvaW50cyBhcyB0aGUgX2lkIGZpZWxkIGlzIHZvbGF0aWxlLiBBZGRcbiAgLy8gdGhpcyB0cmFuc2Zvcm0gYXQgdGhlIGhlYWQgb2Ygb3VyIHBpcGVsaW5lIHN1Y2ggdGhhdCB0aGUgaWRlbnRpZmllclxuICAvLyBmaWVsZCBpcyBhdmFpbGFibGUgZm9yIGFsbCBzdWJzZXF1ZW50IGRhdGFzZXRzLiBBZGRpdGlvbmFsIGlkZW50aWZpZXJcbiAgLy8gdHJhbnNmb3JtcyB3aWxsIGJlIG5lY2Vzc2FyeSB3aGVuIG5ldyB0dXBsZXMgYXJlIGNvbnN0cnVjdGVkXG4gIC8vIChlLmcuLCBwb3N0LWFnZ3JlZ2F0aW9uKS5cbiAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpICYmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNMYXllck1vZGVsKG1vZGVsKSkpIHtcbiAgICBoZWFkID0gbmV3IElkZW50aWZpZXJOb2RlKGhlYWQpO1xuICB9XG5cbiAgLy8gSEFDSzogVGhpcyBpcyBlcXVpdmFsZW50IGZvciBtZXJnaW5nIGJpbiBleHRlbnQgZm9yIHVuaW9uIHNjYWxlLlxuICAvLyBGSVhNRShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzIyNzApOiBDb3JyZWN0bHkgbWVyZ2UgZXh0ZW50IC8gYmluIG5vZGUgZm9yIHNoYXJlZCBiaW4gc2NhbGVcbiAgY29uc3QgcGFyZW50SXNMYXllciA9IG1vZGVsLnBhcmVudCAmJiBpc0xheWVyTW9kZWwobW9kZWwucGFyZW50KTtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgaWYgKHBhcmVudElzTGF5ZXIpIHtcbiAgICAgIGhlYWQgPSBCaW5Ob2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1vZGVsLnRyYW5zZm9ybXMubGVuZ3RoID4gMCkge1xuICAgIGhlYWQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KGhlYWQsIG1vZGVsKTtcbiAgfVxuXG4gIGNvbnN0IHBhcnNlID0gUGFyc2VOb2RlLm1ha2UoaGVhZCwgbW9kZWwpO1xuICBpZiAocGFyc2UpIHtcbiAgICBoZWFkID0gcGFyc2U7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgaGVhZCA9IEdlb0pTT05Ob2RlLnBhcnNlQWxsKGhlYWQsIG1vZGVsKTtcbiAgICBoZWFkID0gR2VvUG9pbnROb2RlLnBhcnNlQWxsKGhlYWQsIG1vZGVsKTtcbiAgfVxuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuXG4gICAgaWYgKCFwYXJlbnRJc0xheWVyKSB7XG4gICAgICBoZWFkID0gQmluTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICAgIH1cblxuICAgIGhlYWQgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICBoZWFkID0gQ2FsY3VsYXRlTm9kZS5wYXJzZUFsbEZvclNvcnRJbmRleChoZWFkLCBtb2RlbCk7XG4gIH1cblxuICAvLyBhZGQgYW4gb3V0cHV0IG5vZGUgcHJlIGFnZ3JlZ2F0aW9uXG4gIGNvbnN0IHJhd05hbWUgPSBtb2RlbC5nZXROYW1lKFJBVyk7XG4gIGNvbnN0IHJhdyA9IG5ldyBPdXRwdXROb2RlKGhlYWQsIHJhd05hbWUsIFJBVywgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gIG91dHB1dE5vZGVzW3Jhd05hbWVdID0gcmF3O1xuICBoZWFkID0gcmF3O1xuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBjb25zdCBhZ2cgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpO1xuICAgIGlmIChhZ2cpIHtcbiAgICAgIGhlYWQgPSBhZ2c7XG5cbiAgICAgIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSkge1xuICAgICAgICBoZWFkID0gbmV3IElkZW50aWZpZXJOb2RlKGhlYWQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGhlYWQgPSBTdGFja05vZGUubWFrZShoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgfVxuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBoZWFkID0gRmlsdGVySW52YWxpZE5vZGUubWFrZShoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgfVxuXG4gIC8vIG91dHB1dCBub2RlIGZvciBtYXJrc1xuICBjb25zdCBtYWluTmFtZSA9IG1vZGVsLmdldE5hbWUoTUFJTik7XG4gIGNvbnN0IG1haW4gPSBuZXcgT3V0cHV0Tm9kZShoZWFkLCBtYWluTmFtZSwgTUFJTiwgb3V0cHV0Tm9kZVJlZkNvdW50cyk7XG4gIG91dHB1dE5vZGVzW21haW5OYW1lXSA9IG1haW47XG4gIGhlYWQgPSBtYWluO1xuXG4gIC8vIGFkZCBmYWNldCBtYXJrZXJcbiAgbGV0IGZhY2V0Um9vdCA9IG51bGw7XG4gIGlmIChpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgZmFjZXROYW1lID0gbW9kZWwuZ2V0TmFtZSgnZmFjZXQnKTtcbiAgICBmYWNldFJvb3QgPSBuZXcgRmFjZXROb2RlKGhlYWQsIG1vZGVsLCBmYWNldE5hbWUsIG1haW4uZ2V0U291cmNlKCkpO1xuICAgIG91dHB1dE5vZGVzW2ZhY2V0TmFtZV0gPSBmYWNldFJvb3Q7XG4gICAgaGVhZCA9IGZhY2V0Um9vdDtcbiAgfVxuXG4gIC8vIGFkZCB0aGUgZm9ybWF0IHBhcnNlIGZyb20gdGhpcyBtb2RlbCBzbyB0aGF0IGNoaWxkcmVuIGRvbid0IHBhcnNlIHRoZSBzYW1lIGZpZWxkIGFnYWluXG4gIGNvbnN0IGFuY2VzdG9yUGFyc2UgPSB7Li4ubW9kZWwuY29tcG9uZW50LmRhdGEuYW5jZXN0b3JQYXJzZSwgLi4uKHBhcnNlID8gcGFyc2UucGFyc2UgOiB7fSl9O1xuXG4gIHJldHVybiB7XG4gICAgLi4ubW9kZWwuY29tcG9uZW50LmRhdGEsXG4gICAgb3V0cHV0Tm9kZXMsXG4gICAgb3V0cHV0Tm9kZVJlZkNvdW50cyxcbiAgICByYXcsXG4gICAgbWFpbixcbiAgICBmYWNldFJvb3QsXG4gICAgYW5jZXN0b3JQYXJzZVxuICB9O1xufVxuIl19