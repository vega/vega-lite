import * as tslib_1 from "tslib";
import { isNumber, isString } from 'vega-util';
import { MAIN, RAW } from '../../data';
import { isDateTime } from '../../datetime';
import * as log from '../../log';
import { isFieldEqualPredicate, isFieldOneOfPredicate, isFieldRangePredicate } from '../../predicate';
import { isAggregate, isBin, isCalculate, isFilter, isLookup, isTimeUnit, isWindow } from '../../transform';
import { keys } from '../../util';
import { isFacetModel, isLayerModel, isUnitModel } from '../model';
import { requiresSelectionId } from '../selection/selection';
import { AggregateNode } from './aggregate';
import { BinNode } from './bin';
import { CalculateNode } from './calculate';
import { OutputNode } from './dataflow';
import { FacetNode } from './facet';
import { FilterNode } from './filter';
import { FilterInvalidNode } from './filterinvalid';
import { ParseNode } from './formatparse';
import { GeoJSONNode } from './geojson';
import { GeoPointNode } from './geopoint';
import { IdentifierNode } from './indentifier';
import { LookupNode } from './lookup';
import { SourceNode } from './source';
import { StackNode } from './stack';
import { TimeUnitNode } from './timeunit';
import { WindowTransformNode } from './window';
function parseRoot(model, sources) {
    if (model.data || !model.parent) {
        // if the model defines a data source or is the root, create a source node
        var source = new SourceNode(model.data);
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
export function parseTransformArray(parent, model) {
    var lookupCounter = 0;
    model.transforms.forEach(function (t) {
        if (isCalculate(t)) {
            parent = new CalculateNode(parent, t);
        }
        else if (isFilter(t)) {
            // Automatically add a parse node for filters with filter objects
            var parse = {};
            var filter = t.filter;
            var val = null;
            // For EqualFilter, just use the equal property.
            // For RangeFilter and OneOfFilter, all array members should have
            // the same type, so we only use the first one.
            if (isFieldEqualPredicate(filter)) {
                val = filter.equal;
            }
            else if (isFieldRangePredicate(filter)) {
                val = filter.range[0];
            }
            else if (isFieldOneOfPredicate(filter)) {
                val = (filter.oneOf || filter['in'])[0];
            } // else -- for filter expression, we can't infer anything
            if (val) {
                if (isDateTime(val)) {
                    parse[filter['field']] = 'date';
                }
                else if (isNumber(val)) {
                    parse[filter['field']] = 'number';
                }
                else if (isString(val)) {
                    parse[filter['field']] = 'string';
                }
            }
            if (keys(parse).length > 0) {
                parent = new ParseNode(parent, parse);
            }
            parent = new FilterNode(parent, model, t.filter);
        }
        else if (isBin(t)) {
            parent = BinNode.makeFromTransform(parent, t, model);
        }
        else if (isTimeUnit(t)) {
            parent = TimeUnitNode.makeFromTransform(parent, t);
        }
        else if (isAggregate(t)) {
            parent = AggregateNode.makeFromTransform(parent, t);
            if (requiresSelectionId(model)) {
                parent = new IdentifierNode(parent);
            }
        }
        else if (isLookup(t)) {
            parent = LookupNode.make(parent, model, t, lookupCounter++);
        }
        else if (isWindow(t)) {
            parent = new WindowTransformNode(parent, t);
        }
        else {
            log.warn(log.message.invalidTransformIgnored(t));
            return;
        }
    });
    return parent;
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
export function parseData(model) {
    var head = parseRoot(model, model.component.data.sources);
    var outputNodes = model.component.data.outputNodes;
    var outputNodeRefCounts = model.component.data.outputNodeRefCounts;
    // Default discrete selections require an identifier transform to
    // uniquely identify data points as the _id field is volatile. Add
    // this transform at the head of our pipeline such that the identifier
    // field is available for all subsequent datasets. Additional identifier
    // transforms will be necessary when new tuples are constructed
    // (e.g., post-aggregation).
    if (requiresSelectionId(model) && (isUnitModel(model) || isLayerModel(model))) {
        head = new IdentifierNode(head);
    }
    // HACK: This is equivalent for merging bin extent for union scale.
    // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
    var parentIsLayer = model.parent && isLayerModel(model.parent);
    if (isUnitModel(model) || isFacetModel(model)) {
        if (parentIsLayer) {
            head = BinNode.makeFromEncoding(head, model) || head;
        }
    }
    if (model.transforms.length > 0) {
        head = parseTransformArray(head, model);
    }
    var parse = ParseNode.make(head, model);
    if (parse) {
        head = parse;
    }
    if (isUnitModel(model)) {
        head = GeoJSONNode.parseAll(head, model);
        head = GeoPointNode.parseAll(head, model);
    }
    if (isUnitModel(model) || isFacetModel(model)) {
        if (!parentIsLayer) {
            head = BinNode.makeFromEncoding(head, model) || head;
        }
        head = TimeUnitNode.makeFromEncoding(head, model) || head;
        head = CalculateNode.parseAllForSortIndex(head, model);
    }
    // add an output node pre aggregation
    var rawName = model.getName(RAW);
    var raw = new OutputNode(head, rawName, RAW, outputNodeRefCounts);
    outputNodes[rawName] = raw;
    head = raw;
    if (isUnitModel(model)) {
        var agg = AggregateNode.makeFromEncoding(head, model);
        if (agg) {
            head = agg;
            if (requiresSelectionId(model)) {
                head = new IdentifierNode(head);
            }
        }
        head = StackNode.make(head, model) || head;
    }
    if (isUnitModel(model)) {
        head = FilterInvalidNode.make(head, model) || head;
    }
    // output node for marks
    var mainName = model.getName(MAIN);
    var main = new OutputNode(head, mainName, MAIN, outputNodeRefCounts);
    outputNodes[mainName] = main;
    head = main;
    // add facet marker
    var facetRoot = null;
    if (isFacetModel(model)) {
        var facetName = model.getName('facet');
        facetRoot = new FacetNode(head, model, facetName, main.getSource());
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsUUFBUSxFQUFFLFFBQVEsRUFBQyxNQUFNLFdBQVcsQ0FBQztBQUM3QyxPQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEVBQVcsVUFBVSxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDcEQsT0FBTyxLQUFLLEdBQUcsTUFBTSxXQUFXLENBQUM7QUFDakMsT0FBTyxFQUFDLHFCQUFxQixFQUFFLHFCQUFxQixFQUFFLHFCQUFxQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDcEcsT0FBTyxFQUFDLFdBQVcsRUFBRSxLQUFLLEVBQUUsV0FBVyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzFHLE9BQU8sRUFBTyxJQUFJLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFDLFlBQVksRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFRLE1BQU0sVUFBVSxDQUFDO0FBQ3hFLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQzNELE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFDLE9BQU8sRUFBQyxNQUFNLE9BQU8sQ0FBQztBQUM5QixPQUFPLEVBQUMsYUFBYSxFQUFDLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBZSxVQUFVLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDcEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNsQyxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFN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QUFHLElBQUksQ0FBQztJQUNyQixJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNwRSxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQ25DLElBQUksR0FBRyxTQUFTLENBQUM7S0FDbEI7SUFFRCx5RkFBeUY7SUFDekYsSUFBTSxhQUFhLHdCQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUU3Riw0QkFDSyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksSUFDdkIsV0FBVyxhQUFBO1FBQ1gsbUJBQW1CLHFCQUFBO1FBQ25CLEdBQUcsS0FBQTtRQUNILElBQUksTUFBQTtRQUNKLFNBQVMsV0FBQTtRQUNULGFBQWEsZUFBQSxJQUNiO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNOdW1iZXIsIGlzU3RyaW5nfSBmcm9tICd2ZWdhLXV0aWwnO1xuaW1wb3J0IHtNQUlOLCBSQVd9IGZyb20gJy4uLy4uL2RhdGEnO1xuaW1wb3J0IHtEYXRlVGltZSwgaXNEYXRlVGltZX0gZnJvbSAnLi4vLi4vZGF0ZXRpbWUnO1xuaW1wb3J0ICogYXMgbG9nIGZyb20gJy4uLy4uL2xvZyc7XG5pbXBvcnQge2lzRmllbGRFcXVhbFByZWRpY2F0ZSwgaXNGaWVsZE9uZU9mUHJlZGljYXRlLCBpc0ZpZWxkUmFuZ2VQcmVkaWNhdGV9IGZyb20gJy4uLy4uL3ByZWRpY2F0ZSc7XG5pbXBvcnQge2lzQWdncmVnYXRlLCBpc0JpbiwgaXNDYWxjdWxhdGUsIGlzRmlsdGVyLCBpc0xvb2t1cCwgaXNUaW1lVW5pdCwgaXNXaW5kb3d9IGZyb20gJy4uLy4uL3RyYW5zZm9ybSc7XG5pbXBvcnQge0RpY3QsIGtleXN9IGZyb20gJy4uLy4uL3V0aWwnO1xuaW1wb3J0IHtpc0ZhY2V0TW9kZWwsIGlzTGF5ZXJNb2RlbCwgaXNVbml0TW9kZWwsIE1vZGVsfSBmcm9tICcuLi9tb2RlbCc7XG5pbXBvcnQge3JlcXVpcmVzU2VsZWN0aW9uSWR9IGZyb20gJy4uL3NlbGVjdGlvbi9zZWxlY3Rpb24nO1xuaW1wb3J0IHtBZ2dyZWdhdGVOb2RlfSBmcm9tICcuL2FnZ3JlZ2F0ZSc7XG5pbXBvcnQge0Jpbk5vZGV9IGZyb20gJy4vYmluJztcbmltcG9ydCB7Q2FsY3VsYXRlTm9kZX0gZnJvbSAnLi9jYWxjdWxhdGUnO1xuaW1wb3J0IHtEYXRhRmxvd05vZGUsIE91dHB1dE5vZGV9IGZyb20gJy4vZGF0YWZsb3cnO1xuaW1wb3J0IHtGYWNldE5vZGV9IGZyb20gJy4vZmFjZXQnO1xuaW1wb3J0IHtGaWx0ZXJOb2RlfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQge0ZpbHRlckludmFsaWROb2RlfSBmcm9tICcuL2ZpbHRlcmludmFsaWQnO1xuaW1wb3J0IHtQYXJzZU5vZGV9IGZyb20gJy4vZm9ybWF0cGFyc2UnO1xuaW1wb3J0IHtHZW9KU09OTm9kZX0gZnJvbSAnLi9nZW9qc29uJztcbmltcG9ydCB7R2VvUG9pbnROb2RlfSBmcm9tICcuL2dlb3BvaW50JztcbmltcG9ydCB7SWRlbnRpZmllck5vZGV9IGZyb20gJy4vaW5kZW50aWZpZXInO1xuaW1wb3J0IHtEYXRhQ29tcG9uZW50fSBmcm9tICcuL2luZGV4JztcbmltcG9ydCB7TG9va3VwTm9kZX0gZnJvbSAnLi9sb29rdXAnO1xuaW1wb3J0IHtTb3VyY2VOb2RlfSBmcm9tICcuL3NvdXJjZSc7XG5pbXBvcnQge1N0YWNrTm9kZX0gZnJvbSAnLi9zdGFjayc7XG5pbXBvcnQge1RpbWVVbml0Tm9kZX0gZnJvbSAnLi90aW1ldW5pdCc7XG5pbXBvcnQge1dpbmRvd1RyYW5zZm9ybU5vZGV9IGZyb20gJy4vd2luZG93JztcblxuZnVuY3Rpb24gcGFyc2VSb290KG1vZGVsOiBNb2RlbCwgc291cmNlczogRGljdDxTb3VyY2VOb2RlPik6IERhdGFGbG93Tm9kZSB7XG4gIGlmIChtb2RlbC5kYXRhIHx8ICFtb2RlbC5wYXJlbnQpIHtcbiAgICAvLyBpZiB0aGUgbW9kZWwgZGVmaW5lcyBhIGRhdGEgc291cmNlIG9yIGlzIHRoZSByb290LCBjcmVhdGUgYSBzb3VyY2Ugbm9kZVxuICAgIGNvbnN0IHNvdXJjZSA9IG5ldyBTb3VyY2VOb2RlKG1vZGVsLmRhdGEpO1xuICAgIGNvbnN0IGhhc2ggPSBzb3VyY2UuaGFzaCgpO1xuICAgIGlmIChoYXNoIGluIHNvdXJjZXMpIHtcbiAgICAgIC8vIHVzZSBhIHJlZmVyZW5jZSBpZiB3ZSBhbHJlYWR5IGhhdmUgYSBzb3VyY2VcbiAgICAgIHJldHVybiBzb3VyY2VzW2hhc2hdO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBvdGhlcndpc2UgYWRkIGEgbmV3IG9uZVxuICAgICAgc291cmNlc1toYXNoXSA9IHNvdXJjZTtcbiAgICAgIHJldHVybiBzb3VyY2U7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIElmIHdlIGRvbid0IGhhdmUgYSBzb3VyY2UgZGVmaW5lZCAob3ZlcnJpZGluZyBwYXJlbnQncyBkYXRhKSwgdXNlIHRoZSBwYXJlbnQncyBmYWNldCByb290IG9yIG1haW4uXG4gICAgcmV0dXJuIG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5mYWNldFJvb3QgPyBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEuZmFjZXRSb290IDogbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLm1haW47XG4gIH1cbn1cblxuXG4vKipcbiAqIFBhcnNlcyBhIHRyYW5zZm9ybXMgYXJyYXkgaW50byBhIGNoYWluIG9mIGNvbm5lY3RlZCBkYXRhZmxvdyBub2Rlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlVHJhbnNmb3JtQXJyYXkocGFyZW50OiBEYXRhRmxvd05vZGUsIG1vZGVsOiBNb2RlbCk6IERhdGFGbG93Tm9kZSB7XG4gIGxldCBsb29rdXBDb3VudGVyID0gMDtcblxuICBtb2RlbC50cmFuc2Zvcm1zLmZvckVhY2godCA9PiB7XG4gICAgaWYgKGlzQ2FsY3VsYXRlKHQpKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgQ2FsY3VsYXRlTm9kZShwYXJlbnQsIHQpO1xuICAgIH0gZWxzZSBpZiAoaXNGaWx0ZXIodCkpIHtcbiAgICAgIC8vIEF1dG9tYXRpY2FsbHkgYWRkIGEgcGFyc2Ugbm9kZSBmb3IgZmlsdGVycyB3aXRoIGZpbHRlciBvYmplY3RzXG4gICAgICBjb25zdCBwYXJzZSA9IHt9O1xuICAgICAgY29uc3QgZmlsdGVyID0gdC5maWx0ZXI7XG4gICAgICBsZXQgdmFsOiBzdHJpbmcgfCBudW1iZXIgfCBib29sZWFuIHwgRGF0ZVRpbWUgPSBudWxsO1xuICAgICAgLy8gRm9yIEVxdWFsRmlsdGVyLCBqdXN0IHVzZSB0aGUgZXF1YWwgcHJvcGVydHkuXG4gICAgICAvLyBGb3IgUmFuZ2VGaWx0ZXIgYW5kIE9uZU9mRmlsdGVyLCBhbGwgYXJyYXkgbWVtYmVycyBzaG91bGQgaGF2ZVxuICAgICAgLy8gdGhlIHNhbWUgdHlwZSwgc28gd2Ugb25seSB1c2UgdGhlIGZpcnN0IG9uZS5cbiAgICAgIGlmIChpc0ZpZWxkRXF1YWxQcmVkaWNhdGUoZmlsdGVyKSkge1xuICAgICAgICB2YWwgPSBmaWx0ZXIuZXF1YWw7XG4gICAgICB9IGVsc2UgaWYgKGlzRmllbGRSYW5nZVByZWRpY2F0ZShmaWx0ZXIpKSB7XG4gICAgICAgIHZhbCA9IGZpbHRlci5yYW5nZVswXTtcbiAgICAgIH0gZWxzZSBpZiAoaXNGaWVsZE9uZU9mUHJlZGljYXRlKGZpbHRlcikpIHtcbiAgICAgICAgdmFsID0gKGZpbHRlci5vbmVPZiB8fCBmaWx0ZXJbJ2luJ10pWzBdO1xuICAgICAgfSAvLyBlbHNlIC0tIGZvciBmaWx0ZXIgZXhwcmVzc2lvbiwgd2UgY2FuJ3QgaW5mZXIgYW55dGhpbmdcbiAgICAgIGlmICh2YWwpIHtcbiAgICAgICAgaWYgKGlzRGF0ZVRpbWUodmFsKSkge1xuICAgICAgICAgIHBhcnNlW2ZpbHRlclsnZmllbGQnXV0gPSAnZGF0ZSc7XG4gICAgICAgIH0gZWxzZSBpZiAoaXNOdW1iZXIodmFsKSkge1xuICAgICAgICAgIHBhcnNlW2ZpbHRlclsnZmllbGQnXV0gPSAnbnVtYmVyJztcbiAgICAgICAgfSBlbHNlIGlmIChpc1N0cmluZyh2YWwpKSB7XG4gICAgICAgICAgcGFyc2VbZmlsdGVyWydmaWVsZCddXSA9ICdzdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChrZXlzKHBhcnNlKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHBhcmVudCA9IG5ldyBQYXJzZU5vZGUocGFyZW50LCBwYXJzZSk7XG4gICAgICB9XG5cblxuICAgICAgcGFyZW50ID0gbmV3IEZpbHRlck5vZGUocGFyZW50LCBtb2RlbCwgdC5maWx0ZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNCaW4odCkpIHtcbiAgICAgIHBhcmVudCA9IEJpbk5vZGUubWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50LCB0LCBtb2RlbCk7XG4gICAgfSBlbHNlIGlmIChpc1RpbWVVbml0KHQpKSB7XG4gICAgICBwYXJlbnQgPSBUaW1lVW5pdE5vZGUubWFrZUZyb21UcmFuc2Zvcm0ocGFyZW50LCB0KTtcbiAgICB9IGVsc2UgaWYgKGlzQWdncmVnYXRlKHQpKSB7XG4gICAgICBwYXJlbnQgPSBBZ2dyZWdhdGVOb2RlLm1ha2VGcm9tVHJhbnNmb3JtKHBhcmVudCwgdCk7XG5cbiAgICAgIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSkge1xuICAgICAgICBwYXJlbnQgPSBuZXcgSWRlbnRpZmllck5vZGUocGFyZW50KTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGlzTG9va3VwKHQpKSB7XG4gICAgICBwYXJlbnQgPSBMb29rdXBOb2RlLm1ha2UocGFyZW50LCBtb2RlbCwgdCwgbG9va3VwQ291bnRlcisrKTtcbiAgICB9IGVsc2UgaWYgKGlzV2luZG93KHQpKSB7XG4gICAgICBwYXJlbnQgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShwYXJlbnQsIHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBsb2cud2Fybihsb2cubWVzc2FnZS5pbnZhbGlkVHJhbnNmb3JtSWdub3JlZCh0KSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gcGFyZW50O1xufVxuXG4vKlxuRGVzY3JpcHRpb24gb2YgdGhlIGRhdGFmbG93IChodHRwOi8vYXNjaWlmbG93LmNvbS8pOlxuICAgICArLS0tLS0tLS0rXG4gICAgIHwgU291cmNlIHxcbiAgICAgKy0tLSstLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBUcmFuc2Zvcm1zXG4oRmlsdGVyLCBDYWxjdWxhdGUsIC4uLilcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgRm9ybWF0UGFyc2VcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIEJpbm5pbmdcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgIFRpbWV1bml0XG4gICAgICAgICB8XG4gICAgICAgICB2XG5Gb3JtdWxhIEZyb20gU29ydCBBcnJheVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICAgKy0tKy0tK1xuICAgICAgfCBSYXcgfFxuICAgICAgKy0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBBZ2dyZWdhdGVcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgICBTdGFja1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICBJbnZhbGlkIEZpbHRlclxuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgKy0tLS0tLS0tLS0rXG4gICB8ICAgTWFpbiAgIHxcbiAgICstLS0tLS0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICArLS0tLS0tLStcbiAgICAgfCBGYWNldCB8LS0tLT4gXCJjb2x1bW5cIiwgXCJjb2x1bW4tbGF5b3V0XCIsIGFuZCBcInJvd1wiXG4gICAgICstLS0tLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAuLi5DaGlsZCBkYXRhLi4uXG4qL1xuXG5leHBvcnQgZnVuY3Rpb24gcGFyc2VEYXRhKG1vZGVsOiBNb2RlbCk6IERhdGFDb21wb25lbnQge1xuICBsZXQgaGVhZCA9IHBhcnNlUm9vdChtb2RlbCwgbW9kZWwuY29tcG9uZW50LmRhdGEuc291cmNlcyk7XG5cbiAgY29uc3Qgb3V0cHV0Tm9kZXMgPSBtb2RlbC5jb21wb25lbnQuZGF0YS5vdXRwdXROb2RlcztcbiAgY29uc3Qgb3V0cHV0Tm9kZVJlZkNvdW50cyA9IG1vZGVsLmNvbXBvbmVudC5kYXRhLm91dHB1dE5vZGVSZWZDb3VudHM7XG5cbiAgLy8gRGVmYXVsdCBkaXNjcmV0ZSBzZWxlY3Rpb25zIHJlcXVpcmUgYW4gaWRlbnRpZmllciB0cmFuc2Zvcm0gdG9cbiAgLy8gdW5pcXVlbHkgaWRlbnRpZnkgZGF0YSBwb2ludHMgYXMgdGhlIF9pZCBmaWVsZCBpcyB2b2xhdGlsZS4gQWRkXG4gIC8vIHRoaXMgdHJhbnNmb3JtIGF0IHRoZSBoZWFkIG9mIG91ciBwaXBlbGluZSBzdWNoIHRoYXQgdGhlIGlkZW50aWZpZXJcbiAgLy8gZmllbGQgaXMgYXZhaWxhYmxlIGZvciBhbGwgc3Vic2VxdWVudCBkYXRhc2V0cy4gQWRkaXRpb25hbCBpZGVudGlmaWVyXG4gIC8vIHRyYW5zZm9ybXMgd2lsbCBiZSBuZWNlc3Nhcnkgd2hlbiBuZXcgdHVwbGVzIGFyZSBjb25zdHJ1Y3RlZFxuICAvLyAoZS5nLiwgcG9zdC1hZ2dyZWdhdGlvbikuXG4gIGlmIChyZXF1aXJlc1NlbGVjdGlvbklkKG1vZGVsKSAmJiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzTGF5ZXJNb2RlbChtb2RlbCkpKSB7XG4gICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgfVxuXG4gIC8vIEhBQ0s6IFRoaXMgaXMgZXF1aXZhbGVudCBmb3IgbWVyZ2luZyBiaW4gZXh0ZW50IGZvciB1bmlvbiBzY2FsZS5cbiAgLy8gRklYTUUoaHR0cHM6Ly9naXRodWIuY29tL3ZlZ2EvdmVnYS1saXRlL2lzc3Vlcy8yMjcwKTogQ29ycmVjdGx5IG1lcmdlIGV4dGVudCAvIGJpbiBub2RlIGZvciBzaGFyZWQgYmluIHNjYWxlXG4gIGNvbnN0IHBhcmVudElzTGF5ZXIgPSBtb2RlbC5wYXJlbnQgJiYgaXNMYXllck1vZGVsKG1vZGVsLnBhcmVudCk7XG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGlmIChwYXJlbnRJc0xheWVyKSB7XG4gICAgICBoZWFkID0gQmluTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICAgIH1cbiAgfVxuXG4gIGlmIChtb2RlbC50cmFuc2Zvcm1zLmxlbmd0aCA+IDApIHtcbiAgICBoZWFkID0gcGFyc2VUcmFuc2Zvcm1BcnJheShoZWFkLCBtb2RlbCk7XG4gIH1cblxuICBjb25zdCBwYXJzZSA9IFBhcnNlTm9kZS5tYWtlKGhlYWQsIG1vZGVsKTtcbiAgaWYgKHBhcnNlKSB7XG4gICAgaGVhZCA9IHBhcnNlO1xuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGhlYWQgPSBHZW9KU09OTm9kZS5wYXJzZUFsbChoZWFkLCBtb2RlbCk7XG4gICAgaGVhZCA9IEdlb1BvaW50Tm9kZS5wYXJzZUFsbChoZWFkLCBtb2RlbCk7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpIHx8IGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcblxuICAgIGlmICghcGFyZW50SXNMYXllcikge1xuICAgICAgaGVhZCA9IEJpbk5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCkgfHwgaGVhZDtcbiAgICB9XG5cbiAgICBoZWFkID0gVGltZVVuaXROb2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgaGVhZCA9IENhbGN1bGF0ZU5vZGUucGFyc2VBbGxGb3JTb3J0SW5kZXgoaGVhZCwgbW9kZWwpO1xuICB9XG5cbiAgLy8gYWRkIGFuIG91dHB1dCBub2RlIHByZSBhZ2dyZWdhdGlvblxuICBjb25zdCByYXdOYW1lID0gbW9kZWwuZ2V0TmFtZShSQVcpO1xuICBjb25zdCByYXcgPSBuZXcgT3V0cHV0Tm9kZShoZWFkLCByYXdOYW1lLCBSQVcsIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1tyYXdOYW1lXSA9IHJhdztcbiAgaGVhZCA9IHJhdztcblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgY29uc3QgYWdnID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKTtcbiAgICBpZiAoYWdnKSB7XG4gICAgICBoZWFkID0gYWdnO1xuXG4gICAgICBpZiAocmVxdWlyZXNTZWxlY3Rpb25JZChtb2RlbCkpIHtcbiAgICAgICAgaGVhZCA9IG5ldyBJZGVudGlmaWVyTm9kZShoZWFkKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBoZWFkID0gU3RhY2tOb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICBpZiAoaXNVbml0TW9kZWwobW9kZWwpKSB7XG4gICAgaGVhZCA9IEZpbHRlckludmFsaWROb2RlLm1ha2UoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gIH1cblxuICAvLyBvdXRwdXQgbm9kZSBmb3IgbWFya3NcbiAgY29uc3QgbWFpbk5hbWUgPSBtb2RlbC5nZXROYW1lKE1BSU4pO1xuICBjb25zdCBtYWluID0gbmV3IE91dHB1dE5vZGUoaGVhZCwgbWFpbk5hbWUsIE1BSU4sIG91dHB1dE5vZGVSZWZDb3VudHMpO1xuICBvdXRwdXROb2Rlc1ttYWluTmFtZV0gPSBtYWluO1xuICBoZWFkID0gbWFpbjtcblxuICAvLyBhZGQgZmFjZXQgbWFya2VyXG4gIGxldCBmYWNldFJvb3QgPSBudWxsO1xuICBpZiAoaXNGYWNldE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGZhY2V0TmFtZSA9IG1vZGVsLmdldE5hbWUoJ2ZhY2V0Jyk7XG4gICAgZmFjZXRSb290ID0gbmV3IEZhY2V0Tm9kZShoZWFkLCBtb2RlbCwgZmFjZXROYW1lLCBtYWluLmdldFNvdXJjZSgpKTtcbiAgICBvdXRwdXROb2Rlc1tmYWNldE5hbWVdID0gZmFjZXRSb290O1xuICAgIGhlYWQgPSBmYWNldFJvb3Q7XG4gIH1cblxuICAvLyBhZGQgdGhlIGZvcm1hdCBwYXJzZSBmcm9tIHRoaXMgbW9kZWwgc28gdGhhdCBjaGlsZHJlbiBkb24ndCBwYXJzZSB0aGUgc2FtZSBmaWVsZCBhZ2FpblxuICBjb25zdCBhbmNlc3RvclBhcnNlID0gey4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLmFuY2VzdG9yUGFyc2UsIC4uLihwYXJzZSA/IHBhcnNlLnBhcnNlIDoge30pfTtcblxuICByZXR1cm4ge1xuICAgIC4uLm1vZGVsLmNvbXBvbmVudC5kYXRhLFxuICAgIG91dHB1dE5vZGVzLFxuICAgIG91dHB1dE5vZGVSZWZDb3VudHMsXG4gICAgcmF3LFxuICAgIG1haW4sXG4gICAgZmFjZXRSb290LFxuICAgIGFuY2VzdG9yUGFyc2VcbiAgfTtcbn1cbiJdfQ==