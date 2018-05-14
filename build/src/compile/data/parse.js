import * as tslib_1 from "tslib";
import { MAIN, RAW } from '../../data';
import * as log from '../../log';
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
import { AncestorParse } from './index';
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
export function parseTransformArray(head, model, ancestorParse) {
    var lookupCounter = 0;
    model.transforms.forEach(function (t) {
        if (isCalculate(t)) {
            head = new CalculateNode(head, t);
            ancestorParse.set(t.as, 'derived', false);
        }
        else if (isFilter(t)) {
            head = ParseNode.makeImplicitFromFilterTransform(head, t, ancestorParse) || head;
            head = new FilterNode(head, model, t.filter);
        }
        else if (isBin(t)) {
            head = BinNode.makeFromTransform(head, t, model);
            ancestorParse.set(t.as, 'number', false);
        }
        else if (isTimeUnit(t)) {
            head = TimeUnitNode.makeFromTransform(head, t);
            ancestorParse.set(t.as, 'date', false);
        }
        else if (isAggregate(t)) {
            var agg = head = AggregateNode.makeFromTransform(head, t);
            if (requiresSelectionId(model)) {
                head = new IdentifierNode(head);
            }
            for (var _i = 0, _a = keys(agg.producedFields()); _i < _a.length; _i++) {
                var field = _a[_i];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (isLookup(t)) {
            var lookup = head = LookupNode.make(head, model, t, lookupCounter++);
            for (var _b = 0, _c = keys(lookup.producedFields()); _b < _c.length; _b++) {
                var field = _c[_b];
                ancestorParse.set(field, 'derived', false);
            }
        }
        else if (isWindow(t)) {
            var window_1 = head = new WindowTransformNode(head, t);
            for (var _d = 0, _e = keys(window_1.producedFields()); _d < _e.length; _d++) {
                var field = _e[_d];
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
export function parseData(model) {
    var head = parseRoot(model, model.component.data.sources);
    var _a = model.component.data, outputNodes = _a.outputNodes, outputNodeRefCounts = _a.outputNodeRefCounts;
    var ancestorParse = model.parent ? model.parent.component.data.ancestorParse.clone() : new AncestorParse();
    // format.parse: null means disable parsing
    if (model.data && model.data.format && model.data.format.parse === null) {
        ancestorParse.parseNothing = true;
    }
    head = ParseNode.makeExplicit(head, model, ancestorParse) || head;
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
        head = parseTransformArray(head, model, ancestorParse);
    }
    head = ParseNode.makeImplicitFromEncoding(head, model, ancestorParse) || head;
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
    return tslib_1.__assign({}, model.component.data, { outputNodes: outputNodes,
        outputNodeRefCounts: outputNodeRefCounts,
        raw: raw,
        main: main,
        facetRoot: facetRoot,
        ancestorParse: ancestorParse });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvY29tcGlsZS9kYXRhL3BhcnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNyQyxPQUFPLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQztBQUNqQyxPQUFPLEVBQUMsV0FBVyxFQUFFLEtBQUssRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDMUcsT0FBTyxFQUFPLElBQUksRUFBQyxNQUFNLFlBQVksQ0FBQztBQUN0QyxPQUFPLEVBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxXQUFXLEVBQVEsTUFBTSxVQUFVLENBQUM7QUFDeEUsT0FBTyxFQUFDLG1CQUFtQixFQUFDLE1BQU0sd0JBQXdCLENBQUM7QUFDM0QsT0FBTyxFQUFDLGFBQWEsRUFBQyxNQUFNLGFBQWEsQ0FBQztBQUMxQyxPQUFPLEVBQUMsT0FBTyxFQUFDLE1BQU0sT0FBTyxDQUFDO0FBQzlCLE9BQU8sRUFBQyxhQUFhLEVBQUMsTUFBTSxhQUFhLENBQUM7QUFDMUMsT0FBTyxFQUFlLFVBQVUsRUFBQyxNQUFNLFlBQVksQ0FBQztBQUNwRCxPQUFPLEVBQUMsU0FBUyxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBQ2xDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFDbEQsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN4QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0sV0FBVyxDQUFDO0FBQ3RDLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxZQUFZLENBQUM7QUFDeEMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUM3QyxPQUFPLEVBQUMsYUFBYSxFQUFnQixNQUFNLFNBQVMsQ0FBQztBQUNyRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sVUFBVSxDQUFDO0FBQ3BDLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxVQUFVLENBQUM7QUFDcEMsT0FBTyxFQUFDLFNBQVMsRUFBQyxNQUFNLFNBQVMsQ0FBQztBQUNsQyxPQUFPLEVBQUMsWUFBWSxFQUFDLE1BQU0sWUFBWSxDQUFDO0FBQ3hDLE9BQU8sRUFBQyxtQkFBbUIsRUFBQyxNQUFNLFVBQVUsQ0FBQztBQUU3QyxtQkFBbUIsS0FBWSxFQUFFLE9BQXlCO0lBQ3hELElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7UUFDL0IsMEVBQTBFO1FBQzFFLElBQU0sTUFBTSxHQUFHLElBQUksVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDM0IsSUFBSSxJQUFJLElBQUksT0FBTyxFQUFFO1lBQ25CLDhDQUE4QztZQUM5QyxPQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsMEJBQTBCO1lBQzFCLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7WUFDdkIsT0FBTyxNQUFNLENBQUM7U0FDZjtLQUNGO1NBQU07UUFDTCxxR0FBcUc7UUFDckcsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQ3pIO0FBQ0gsQ0FBQztBQUdEOztHQUVHO0FBQ0gsTUFBTSw4QkFBOEIsSUFBa0IsRUFBRSxLQUFZLEVBQUUsYUFBNEI7SUFDaEcsSUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFDO0lBRXRCLEtBQUssQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUEsQ0FBQztRQUN4QixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDM0M7YUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixJQUFJLEdBQUcsU0FBUyxDQUFDLCtCQUErQixDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsYUFBYSxDQUFDLElBQUksSUFBSSxDQUFDO1lBRWpGLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5QzthQUFNLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25CLElBQUksR0FBRyxPQUFPLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsRUFBRSxLQUFLLENBQUMsQ0FBQztZQUVqRCxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzFDO2FBQU0sSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxHQUFHLFlBQVksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFL0MsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLENBQUMsQ0FBQztTQUN4QzthQUFNLElBQUksV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3pCLElBQU0sR0FBRyxHQUFHLElBQUksR0FBRyxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRTVELElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlCLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztZQUVELEtBQW9CLFVBQTBCLEVBQTFCLEtBQUEsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUExQixjQUEwQixFQUExQixJQUEwQjtnQkFBekMsSUFBTSxLQUFLLFNBQUE7Z0JBQ2QsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzVDO1NBQ0Y7YUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixJQUFNLE1BQU0sR0FBRyxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxDQUFDO1lBRXZFLEtBQW9CLFVBQTZCLEVBQTdCLEtBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEVBQUUsQ0FBQyxFQUE3QixjQUE2QixFQUE3QixJQUE2QjtnQkFBNUMsSUFBTSxLQUFLLFNBQUE7Z0JBQ2QsYUFBYSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzVDO1NBQ0Y7YUFBTSxJQUFJLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUN0QixJQUFNLFFBQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFdkQsS0FBb0IsVUFBNkIsRUFBN0IsS0FBQSxJQUFJLENBQUMsUUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDLEVBQTdCLGNBQTZCLEVBQTdCLElBQTZCO2dCQUE1QyxJQUFNLEtBQUssU0FBQTtnQkFDZCxhQUFhLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUM7YUFDNUM7U0FDRjthQUFNO1lBQ0wsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakQsT0FBTztTQUNSO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFSCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7RUFxREU7QUFFRixNQUFNLG9CQUFvQixLQUFZO0lBQ3BDLElBQUksSUFBSSxHQUFHLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFcEQsSUFBQSx5QkFBeUQsRUFBeEQsNEJBQVcsRUFBRSw0Q0FBbUIsQ0FBeUI7SUFDaEUsSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxhQUFhLEVBQUUsQ0FBQztJQUU3RywyQ0FBMkM7SUFDM0MsSUFBSSxLQUFLLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxJQUFJLEVBQUU7UUFDdkUsYUFBYSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7S0FDbkM7SUFFRCxJQUFJLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUVsRSxpRUFBaUU7SUFDakUsa0VBQWtFO0lBQ2xFLHNFQUFzRTtJQUN0RSx3RUFBd0U7SUFDeEUsK0RBQStEO0lBQy9ELDRCQUE0QjtJQUM1QixJQUFJLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQzdFLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNqQztJQUVELG1FQUFtRTtJQUNuRSwrR0FBK0c7SUFDL0csSUFBTSxhQUFhLEdBQUcsS0FBSyxDQUFDLE1BQU0sSUFBSSxZQUFZLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2pFLElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUM3QyxJQUFJLGFBQWEsRUFBRTtZQUNqQixJQUFJLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUM7U0FDdEQ7S0FDRjtJQUVELElBQUksS0FBSyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQy9CLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO0tBQ3hEO0lBRUQsSUFBSSxHQUFHLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLGFBQWEsQ0FBQyxJQUFJLElBQUksQ0FBQztJQUU5RSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixJQUFJLEdBQUcsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsSUFBSSxHQUFHLFlBQVksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzNDO0lBRUQsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBRTdDLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDbEIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO1NBQ3REO1FBRUQsSUFBSSxHQUFHLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDO1FBQzFELElBQUksR0FBRyxhQUFhLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQ3hEO0lBRUQscUNBQXFDO0lBQ3JDLElBQU0sT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbkMsSUFBTSxHQUFHLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztJQUNwRSxXQUFXLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQzNCLElBQUksR0FBRyxHQUFHLENBQUM7SUFFWCxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN0QixJQUFNLEdBQUcsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hELElBQUksR0FBRyxFQUFFO1lBQ1AsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUVYLElBQUksbUJBQW1CLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQzlCLElBQUksR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQztTQUNGO1FBRUQsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQztLQUM1QztJQUVELElBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3RCLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQztLQUNwRDtJQUVELHdCQUF3QjtJQUN4QixJQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLElBQU0sSUFBSSxHQUFHLElBQUksVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixDQUFDLENBQUM7SUFDdkUsV0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUM3QixJQUFJLEdBQUcsSUFBSSxDQUFDO0lBRVosbUJBQW1CO0lBQ25CLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQztJQUNyQixJQUFJLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUN2QixJQUFNLFNBQVMsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztRQUNwRSxXQUFXLENBQUMsU0FBUyxDQUFDLEdBQUcsU0FBUyxDQUFDO1FBQ25DLElBQUksR0FBRyxTQUFTLENBQUM7S0FDbEI7SUFFRCw0QkFDSyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksSUFDdkIsV0FBVyxhQUFBO1FBQ1gsbUJBQW1CLHFCQUFBO1FBQ25CLEdBQUcsS0FBQTtRQUNILElBQUksTUFBQTtRQUNKLFNBQVMsV0FBQTtRQUNULGFBQWEsZUFBQSxJQUNiO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7TUFJTiwgUkFXfSBmcm9tICcuLi8uLi9kYXRhJztcbmltcG9ydCAqIGFzIGxvZyBmcm9tICcuLi8uLi9sb2cnO1xuaW1wb3J0IHtpc0FnZ3JlZ2F0ZSwgaXNCaW4sIGlzQ2FsY3VsYXRlLCBpc0ZpbHRlciwgaXNMb29rdXAsIGlzVGltZVVuaXQsIGlzV2luZG93fSBmcm9tICcuLi8uLi90cmFuc2Zvcm0nO1xuaW1wb3J0IHtEaWN0LCBrZXlzfSBmcm9tICcuLi8uLi91dGlsJztcbmltcG9ydCB7aXNGYWNldE1vZGVsLCBpc0xheWVyTW9kZWwsIGlzVW5pdE1vZGVsLCBNb2RlbH0gZnJvbSAnLi4vbW9kZWwnO1xuaW1wb3J0IHtyZXF1aXJlc1NlbGVjdGlvbklkfSBmcm9tICcuLi9zZWxlY3Rpb24vc2VsZWN0aW9uJztcbmltcG9ydCB7QWdncmVnYXRlTm9kZX0gZnJvbSAnLi9hZ2dyZWdhdGUnO1xuaW1wb3J0IHtCaW5Ob2RlfSBmcm9tICcuL2Jpbic7XG5pbXBvcnQge0NhbGN1bGF0ZU5vZGV9IGZyb20gJy4vY2FsY3VsYXRlJztcbmltcG9ydCB7RGF0YUZsb3dOb2RlLCBPdXRwdXROb2RlfSBmcm9tICcuL2RhdGFmbG93JztcbmltcG9ydCB7RmFjZXROb2RlfSBmcm9tICcuL2ZhY2V0JztcbmltcG9ydCB7RmlsdGVyTm9kZX0gZnJvbSAnLi9maWx0ZXInO1xuaW1wb3J0IHtGaWx0ZXJJbnZhbGlkTm9kZX0gZnJvbSAnLi9maWx0ZXJpbnZhbGlkJztcbmltcG9ydCB7UGFyc2VOb2RlfSBmcm9tICcuL2Zvcm1hdHBhcnNlJztcbmltcG9ydCB7R2VvSlNPTk5vZGV9IGZyb20gJy4vZ2VvanNvbic7XG5pbXBvcnQge0dlb1BvaW50Tm9kZX0gZnJvbSAnLi9nZW9wb2ludCc7XG5pbXBvcnQge0lkZW50aWZpZXJOb2RlfSBmcm9tICcuL2luZGVudGlmaWVyJztcbmltcG9ydCB7QW5jZXN0b3JQYXJzZSwgRGF0YUNvbXBvbmVudH0gZnJvbSAnLi9pbmRleCc7XG5pbXBvcnQge0xvb2t1cE5vZGV9IGZyb20gJy4vbG9va3VwJztcbmltcG9ydCB7U291cmNlTm9kZX0gZnJvbSAnLi9zb3VyY2UnO1xuaW1wb3J0IHtTdGFja05vZGV9IGZyb20gJy4vc3RhY2snO1xuaW1wb3J0IHtUaW1lVW5pdE5vZGV9IGZyb20gJy4vdGltZXVuaXQnO1xuaW1wb3J0IHtXaW5kb3dUcmFuc2Zvcm1Ob2RlfSBmcm9tICcuL3dpbmRvdyc7XG5cbmZ1bmN0aW9uIHBhcnNlUm9vdChtb2RlbDogTW9kZWwsIHNvdXJjZXM6IERpY3Q8U291cmNlTm9kZT4pOiBEYXRhRmxvd05vZGUge1xuICBpZiAobW9kZWwuZGF0YSB8fCAhbW9kZWwucGFyZW50KSB7XG4gICAgLy8gaWYgdGhlIG1vZGVsIGRlZmluZXMgYSBkYXRhIHNvdXJjZSBvciBpcyB0aGUgcm9vdCwgY3JlYXRlIGEgc291cmNlIG5vZGVcbiAgICBjb25zdCBzb3VyY2UgPSBuZXcgU291cmNlTm9kZShtb2RlbC5kYXRhKTtcbiAgICBjb25zdCBoYXNoID0gc291cmNlLmhhc2goKTtcbiAgICBpZiAoaGFzaCBpbiBzb3VyY2VzKSB7XG4gICAgICAvLyB1c2UgYSByZWZlcmVuY2UgaWYgd2UgYWxyZWFkeSBoYXZlIGEgc291cmNlXG4gICAgICByZXR1cm4gc291cmNlc1toYXNoXTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gb3RoZXJ3aXNlIGFkZCBhIG5ldyBvbmVcbiAgICAgIHNvdXJjZXNbaGFzaF0gPSBzb3VyY2U7XG4gICAgICByZXR1cm4gc291cmNlO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBJZiB3ZSBkb24ndCBoYXZlIGEgc291cmNlIGRlZmluZWQgKG92ZXJyaWRpbmcgcGFyZW50J3MgZGF0YSksIHVzZSB0aGUgcGFyZW50J3MgZmFjZXQgcm9vdCBvciBtYWluLlxuICAgIHJldHVybiBtb2RlbC5wYXJlbnQuY29tcG9uZW50LmRhdGEuZmFjZXRSb290ID8gbW9kZWwucGFyZW50LmNvbXBvbmVudC5kYXRhLmZhY2V0Um9vdCA6IG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5tYWluO1xuICB9XG59XG5cblxuLyoqXG4gKiBQYXJzZXMgYSB0cmFuc2Zvcm1zIGFycmF5IGludG8gYSBjaGFpbiBvZiBjb25uZWN0ZWQgZGF0YWZsb3cgbm9kZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZVRyYW5zZm9ybUFycmF5KGhlYWQ6IERhdGFGbG93Tm9kZSwgbW9kZWw6IE1vZGVsLCBhbmNlc3RvclBhcnNlOiBBbmNlc3RvclBhcnNlKTogRGF0YUZsb3dOb2RlIHtcbiAgbGV0IGxvb2t1cENvdW50ZXIgPSAwO1xuXG4gIG1vZGVsLnRyYW5zZm9ybXMuZm9yRWFjaCh0ID0+IHtcbiAgICBpZiAoaXNDYWxjdWxhdGUodCkpIHtcbiAgICAgIGhlYWQgPSBuZXcgQ2FsY3VsYXRlTm9kZShoZWFkLCB0KTtcbiAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KHQuYXMsICdkZXJpdmVkJywgZmFsc2UpO1xuICAgIH0gZWxzZSBpZiAoaXNGaWx0ZXIodCkpIHtcbiAgICAgIGhlYWQgPSBQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUZpbHRlclRyYW5zZm9ybShoZWFkLCB0LCBhbmNlc3RvclBhcnNlKSB8fCBoZWFkO1xuXG4gICAgICBoZWFkID0gbmV3IEZpbHRlck5vZGUoaGVhZCwgbW9kZWwsIHQuZmlsdGVyKTtcbiAgICB9IGVsc2UgaWYgKGlzQmluKHQpKSB7XG4gICAgICBoZWFkID0gQmluTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShoZWFkLCB0LCBtb2RlbCk7XG5cbiAgICAgIGFuY2VzdG9yUGFyc2Uuc2V0KHQuYXMsICdudW1iZXInLCBmYWxzZSk7XG4gICAgfSBlbHNlIGlmIChpc1RpbWVVbml0KHQpKSB7XG4gICAgICBoZWFkID0gVGltZVVuaXROb2RlLm1ha2VGcm9tVHJhbnNmb3JtKGhlYWQsIHQpO1xuXG4gICAgICBhbmNlc3RvclBhcnNlLnNldCh0LmFzLCAnZGF0ZScsIGZhbHNlKTtcbiAgICB9IGVsc2UgaWYgKGlzQWdncmVnYXRlKHQpKSB7XG4gICAgICBjb25zdCBhZ2cgPSBoZWFkID0gQWdncmVnYXRlTm9kZS5tYWtlRnJvbVRyYW5zZm9ybShoZWFkLCB0KTtcblxuICAgICAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpKSB7XG4gICAgICAgIGhlYWQgPSBuZXcgSWRlbnRpZmllck5vZGUoaGVhZCk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyhhZ2cucHJvZHVjZWRGaWVsZHMoKSkpIHtcbiAgICAgICAgYW5jZXN0b3JQYXJzZS5zZXQoZmllbGQsICdkZXJpdmVkJywgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNMb29rdXAodCkpIHtcbiAgICAgIGNvbnN0IGxvb2t1cCA9IGhlYWQgPSBMb29rdXBOb2RlLm1ha2UoaGVhZCwgbW9kZWwsIHQsIGxvb2t1cENvdW50ZXIrKyk7XG5cbiAgICAgIGZvciAoY29uc3QgZmllbGQgb2Yga2V5cyhsb29rdXAucHJvZHVjZWRGaWVsZHMoKSkpIHtcbiAgICAgICAgYW5jZXN0b3JQYXJzZS5zZXQoZmllbGQsICdkZXJpdmVkJywgZmFsc2UpO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoaXNXaW5kb3codCkpIHtcbiAgICAgIGNvbnN0IHdpbmRvdyA9IGhlYWQgPSBuZXcgV2luZG93VHJhbnNmb3JtTm9kZShoZWFkLCB0KTtcblxuICAgICAgZm9yIChjb25zdCBmaWVsZCBvZiBrZXlzKHdpbmRvdy5wcm9kdWNlZEZpZWxkcygpKSkge1xuICAgICAgICBhbmNlc3RvclBhcnNlLnNldChmaWVsZCwgJ2Rlcml2ZWQnLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxvZy53YXJuKGxvZy5tZXNzYWdlLmludmFsaWRUcmFuc2Zvcm1JZ25vcmVkKHQpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBoZWFkO1xufVxuXG4vKlxuRGVzY3JpcHRpb24gb2YgdGhlIGRhdGFmbG93IChodHRwOi8vYXNjaWlmbG93LmNvbS8pOlxuICAgICArLS0tLS0tLS0rXG4gICAgIHwgU291cmNlIHxcbiAgICAgKy0tLSstLS0tK1xuICAgICAgICAgfFxuICAgICAgICAgdlxuICAgICBGb3JtYXRQYXJzZVxuICAgICAoZXhwbGljaXQpXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIFRyYW5zZm9ybXNcbihGaWx0ZXIsIENhbGN1bGF0ZSwgQmlubmluZywgVGltZVVuaXQsIEFnZ3JlZ2F0ZSwgV2luZG93LCAuLi4pXG4gICAgICAgICB8XG4gICAgICAgICB2XG4gICAgIEZvcm1hdFBhcnNlXG4gICAgIChpbXBsaWNpdClcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiBCaW5uaW5nIChpbiBgZW5jb2RpbmdgKVxuICAgICAgICAgfFxuICAgICAgICAgdlxuIFRpbWV1bml0IChpbiBgZW5jb2RpbmdgKVxuICAgICAgICAgfFxuICAgICAgICAgdlxuRm9ybXVsYSBGcm9tIFNvcnQgQXJyYXlcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgICstLSstLStcbiAgICAgIHwgUmF3IHxcbiAgICAgICstLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgQWdncmVnYXRlIChpbiBgZW5jb2RpbmdgKVxuICAgICAgICAgfFxuICAgICAgICAgdlxuICBTdGFjayAoaW4gYGVuY29kaW5nYClcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgSW52YWxpZCBGaWx0ZXJcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICstLS0tLS0tLS0tK1xuICAgfCAgIE1haW4gICB8XG4gICArLS0tLS0tLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgICAgKy0tLS0tLS0rXG4gICAgIHwgRmFjZXQgfC0tLS0+IFwiY29sdW1uXCIsIFwiY29sdW1uLWxheW91dFwiLCBhbmQgXCJyb3dcIlxuICAgICArLS0tLS0tLStcbiAgICAgICAgIHxcbiAgICAgICAgIHZcbiAgLi4uQ2hpbGQgZGF0YS4uLlxuKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlRGF0YShtb2RlbDogTW9kZWwpOiBEYXRhQ29tcG9uZW50IHtcbiAgbGV0IGhlYWQgPSBwYXJzZVJvb3QobW9kZWwsIG1vZGVsLmNvbXBvbmVudC5kYXRhLnNvdXJjZXMpO1xuXG4gIGNvbnN0IHtvdXRwdXROb2Rlcywgb3V0cHV0Tm9kZVJlZkNvdW50c30gPSBtb2RlbC5jb21wb25lbnQuZGF0YTtcbiAgY29uc3QgYW5jZXN0b3JQYXJzZSA9IG1vZGVsLnBhcmVudCA/IG1vZGVsLnBhcmVudC5jb21wb25lbnQuZGF0YS5hbmNlc3RvclBhcnNlLmNsb25lKCkgOiBuZXcgQW5jZXN0b3JQYXJzZSgpO1xuXG4gIC8vIGZvcm1hdC5wYXJzZTogbnVsbCBtZWFucyBkaXNhYmxlIHBhcnNpbmdcbiAgaWYgKG1vZGVsLmRhdGEgJiYgbW9kZWwuZGF0YS5mb3JtYXQgJiYgbW9kZWwuZGF0YS5mb3JtYXQucGFyc2UgPT09IG51bGwpIHtcbiAgICBhbmNlc3RvclBhcnNlLnBhcnNlTm90aGluZyA9IHRydWU7XG4gIH1cblxuICBoZWFkID0gUGFyc2VOb2RlLm1ha2VFeHBsaWNpdChoZWFkLCBtb2RlbCwgYW5jZXN0b3JQYXJzZSkgfHwgaGVhZDtcblxuICAvLyBEZWZhdWx0IGRpc2NyZXRlIHNlbGVjdGlvbnMgcmVxdWlyZSBhbiBpZGVudGlmaWVyIHRyYW5zZm9ybSB0b1xuICAvLyB1bmlxdWVseSBpZGVudGlmeSBkYXRhIHBvaW50cyBhcyB0aGUgX2lkIGZpZWxkIGlzIHZvbGF0aWxlLiBBZGRcbiAgLy8gdGhpcyB0cmFuc2Zvcm0gYXQgdGhlIGhlYWQgb2Ygb3VyIHBpcGVsaW5lIHN1Y2ggdGhhdCB0aGUgaWRlbnRpZmllclxuICAvLyBmaWVsZCBpcyBhdmFpbGFibGUgZm9yIGFsbCBzdWJzZXF1ZW50IGRhdGFzZXRzLiBBZGRpdGlvbmFsIGlkZW50aWZpZXJcbiAgLy8gdHJhbnNmb3JtcyB3aWxsIGJlIG5lY2Vzc2FyeSB3aGVuIG5ldyB0dXBsZXMgYXJlIGNvbnN0cnVjdGVkXG4gIC8vIChlLmcuLCBwb3N0LWFnZ3JlZ2F0aW9uKS5cbiAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpICYmIChpc1VuaXRNb2RlbChtb2RlbCkgfHwgaXNMYXllck1vZGVsKG1vZGVsKSkpIHtcbiAgICBoZWFkID0gbmV3IElkZW50aWZpZXJOb2RlKGhlYWQpO1xuICB9XG5cbiAgLy8gSEFDSzogVGhpcyBpcyBlcXVpdmFsZW50IGZvciBtZXJnaW5nIGJpbiBleHRlbnQgZm9yIHVuaW9uIHNjYWxlLlxuICAvLyBGSVhNRShodHRwczovL2dpdGh1Yi5jb20vdmVnYS92ZWdhLWxpdGUvaXNzdWVzLzIyNzApOiBDb3JyZWN0bHkgbWVyZ2UgZXh0ZW50IC8gYmluIG5vZGUgZm9yIHNoYXJlZCBiaW4gc2NhbGVcbiAgY29uc3QgcGFyZW50SXNMYXllciA9IG1vZGVsLnBhcmVudCAmJiBpc0xheWVyTW9kZWwobW9kZWwucGFyZW50KTtcbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG4gICAgaWYgKHBhcmVudElzTGF5ZXIpIHtcbiAgICAgIGhlYWQgPSBCaW5Ob2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgfVxuICB9XG5cbiAgaWYgKG1vZGVsLnRyYW5zZm9ybXMubGVuZ3RoID4gMCkge1xuICAgIGhlYWQgPSBwYXJzZVRyYW5zZm9ybUFycmF5KGhlYWQsIG1vZGVsLCBhbmNlc3RvclBhcnNlKTtcbiAgfVxuXG4gIGhlYWQgPSBQYXJzZU5vZGUubWFrZUltcGxpY2l0RnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsLCBhbmNlc3RvclBhcnNlKSB8fCBoZWFkO1xuXG4gIGlmIChpc1VuaXRNb2RlbChtb2RlbCkpIHtcbiAgICBoZWFkID0gR2VvSlNPTk5vZGUucGFyc2VBbGwoaGVhZCwgbW9kZWwpO1xuICAgIGhlYWQgPSBHZW9Qb2ludE5vZGUucGFyc2VBbGwoaGVhZCwgbW9kZWwpO1xuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSB8fCBpc0ZhY2V0TW9kZWwobW9kZWwpKSB7XG5cbiAgICBpZiAoIXBhcmVudElzTGF5ZXIpIHtcbiAgICAgIGhlYWQgPSBCaW5Ob2RlLm1ha2VGcm9tRW5jb2RpbmcoaGVhZCwgbW9kZWwpIHx8IGhlYWQ7XG4gICAgfVxuXG4gICAgaGVhZCA9IFRpbWVVbml0Tm9kZS5tYWtlRnJvbUVuY29kaW5nKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICAgIGhlYWQgPSBDYWxjdWxhdGVOb2RlLnBhcnNlQWxsRm9yU29ydEluZGV4KGhlYWQsIG1vZGVsKTtcbiAgfVxuXG4gIC8vIGFkZCBhbiBvdXRwdXQgbm9kZSBwcmUgYWdncmVnYXRpb25cbiAgY29uc3QgcmF3TmFtZSA9IG1vZGVsLmdldE5hbWUoUkFXKTtcbiAgY29uc3QgcmF3ID0gbmV3IE91dHB1dE5vZGUoaGVhZCwgcmF3TmFtZSwgUkFXLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgb3V0cHV0Tm9kZXNbcmF3TmFtZV0gPSByYXc7XG4gIGhlYWQgPSByYXc7XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGNvbnN0IGFnZyA9IEFnZ3JlZ2F0ZU5vZGUubWFrZUZyb21FbmNvZGluZyhoZWFkLCBtb2RlbCk7XG4gICAgaWYgKGFnZykge1xuICAgICAgaGVhZCA9IGFnZztcblxuICAgICAgaWYgKHJlcXVpcmVzU2VsZWN0aW9uSWQobW9kZWwpKSB7XG4gICAgICAgIGhlYWQgPSBuZXcgSWRlbnRpZmllck5vZGUoaGVhZCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaGVhZCA9IFN0YWNrTm9kZS5tYWtlKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICB9XG5cbiAgaWYgKGlzVW5pdE1vZGVsKG1vZGVsKSkge1xuICAgIGhlYWQgPSBGaWx0ZXJJbnZhbGlkTm9kZS5tYWtlKGhlYWQsIG1vZGVsKSB8fCBoZWFkO1xuICB9XG5cbiAgLy8gb3V0cHV0IG5vZGUgZm9yIG1hcmtzXG4gIGNvbnN0IG1haW5OYW1lID0gbW9kZWwuZ2V0TmFtZShNQUlOKTtcbiAgY29uc3QgbWFpbiA9IG5ldyBPdXRwdXROb2RlKGhlYWQsIG1haW5OYW1lLCBNQUlOLCBvdXRwdXROb2RlUmVmQ291bnRzKTtcbiAgb3V0cHV0Tm9kZXNbbWFpbk5hbWVdID0gbWFpbjtcbiAgaGVhZCA9IG1haW47XG5cbiAgLy8gYWRkIGZhY2V0IG1hcmtlclxuICBsZXQgZmFjZXRSb290ID0gbnVsbDtcbiAgaWYgKGlzRmFjZXRNb2RlbChtb2RlbCkpIHtcbiAgICBjb25zdCBmYWNldE5hbWUgPSBtb2RlbC5nZXROYW1lKCdmYWNldCcpO1xuICAgIGZhY2V0Um9vdCA9IG5ldyBGYWNldE5vZGUoaGVhZCwgbW9kZWwsIGZhY2V0TmFtZSwgbWFpbi5nZXRTb3VyY2UoKSk7XG4gICAgb3V0cHV0Tm9kZXNbZmFjZXROYW1lXSA9IGZhY2V0Um9vdDtcbiAgICBoZWFkID0gZmFjZXRSb290O1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICAuLi5tb2RlbC5jb21wb25lbnQuZGF0YSxcbiAgICBvdXRwdXROb2RlcyxcbiAgICBvdXRwdXROb2RlUmVmQ291bnRzLFxuICAgIHJhdyxcbiAgICBtYWluLFxuICAgIGZhY2V0Um9vdCxcbiAgICBhbmNlc3RvclBhcnNlXG4gIH07XG59XG4iXX0=