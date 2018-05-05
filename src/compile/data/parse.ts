import {isNumber, isString} from 'vega-util';
import {MAIN, RAW} from '../../data';
import {DateTime, isDateTime} from '../../datetime';
import * as log from '../../log';
import {forEachLeaf} from '../../logical';
import {isFieldEqualPredicate, isFieldOneOfPredicate, isFieldPredicate, isFieldRangePredicate} from '../../predicate';
import {isAggregate, isBin, isCalculate, isFilter, isLookup, isTimeUnit, isWindow} from '../../transform';
import {Dict, keys} from '../../util';
import {isFacetModel, isLayerModel, isUnitModel, Model} from '../model';
import {requiresSelectionId} from '../selection/selection';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {CalculateNode} from './calculate';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {FilterNode} from './filter';
import {FilterInvalidNode} from './filterinvalid';
import {ParseNode} from './formatparse';
import {GeoJSONNode} from './geojson';
import {GeoPointNode} from './geopoint';
import {IdentifierNode} from './indentifier';
import {AncestorParse, DataComponent} from './index';
import {LookupNode} from './lookup';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {WindowTransformNode} from './window';

function parseRoot(model: Model, sources: Dict<SourceNode>): DataFlowNode {
  if (model.data || !model.parent) {
    // if the model defines a data source or is the root, create a source node
    const source = new SourceNode(model.data);
    const hash = source.hash();
    if (hash in sources) {
      // use a reference if we already have a source
      return sources[hash];
    } else {
      // otherwise add a new one
      sources[hash] = source;
      return source;
    }
  } else {
    // If we don't have a source defined (overriding parent's data), use the parent's facet root or main.
    return model.parent.component.data.facetRoot ? model.parent.component.data.facetRoot : model.parent.component.data.main;
  }
}


/**
 * Parses a transforms array into a chain of connected dataflow nodes.
 */
export function parseTransformArray(parent: DataFlowNode, model: Model, ancestorParse: AncestorParse): DataFlowNode {
  let lookupCounter = 0;

  model.transforms.forEach(t => {
    if (isCalculate(t)) {
      parent = new CalculateNode(parent, t);
      ancestorParse.set(t.as, 'derived', false);
    } else if (isFilter(t)) {
      const parse = {};
      forEachLeaf(t.filter, filter => {
        if (isFieldPredicate(filter)) {
          // Automatically add a parse node for filters with filter objects
          let val: string | number | boolean | DateTime = null;

          // For EqualFilter, just use the equal property.
          // For RangeFilter and OneOfFilter, all array members should have
          // the same type, so we only use the first one.
          if (isFieldEqualPredicate(filter)) {
            val = filter.equal;
          } else if (isFieldRangePredicate(filter)) {
            val = filter.range[0];
          } else if (isFieldOneOfPredicate(filter)) {
            val = (filter.oneOf || filter['in'])[0];
          } // else -- for filter expression, we can't infer anything
          if (val) {
            if (isDateTime(val)) {
              parse[filter.field] = 'date';
            } else if (isNumber(val)) {
              parse[filter.field] = 'number';
            } else if (isString(val)) {
              parse[filter.field] = 'string';
            }
          }

          if (filter.timeUnit) {
            parse[filter.field] = 'date';
          }
        }
      });

      if (keys(parse).length) {
        parent = ParseNode.makeWithAncestors(parent, {}, parse, ancestorParse) || parent;
      }

      parent = new FilterNode(parent, model, t.filter);
    } else if (isBin(t)) {
      parent = BinNode.makeFromTransform(parent, t, model);

      ancestorParse.set(t.as, 'number', false);
    } else if (isTimeUnit(t)) {
      parent = TimeUnitNode.makeFromTransform(parent, t);

      ancestorParse.set(t.as, 'date', false);
    } else if (isAggregate(t)) {
      const agg = parent = AggregateNode.makeFromTransform(parent, t);

      if (requiresSelectionId(model)) {
        parent = new IdentifierNode(parent);
      }

      for (const field of keys(agg.producedFields())) {
        ancestorParse.set(field, 'derived', false);
      }
    } else if (isLookup(t)) {
      const lookup = parent = LookupNode.make(parent, model, t, lookupCounter++);

      for (const field of keys(lookup.producedFields())) {
        ancestorParse.set(field, 'derived', false);
      }
    } else if (isWindow(t)) {
      const window = parent = new WindowTransformNode(parent, t);

      for (const field of keys(window.producedFields())) {
        ancestorParse.set(field, 'derived', false);
      }
    } else {
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
     FormatParse
     (explicit)
         |
         v
     Transforms
(Filter, Calculate, ...)
         |
         v
     FormatParse
     (implicit)
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

export function parseData(model: Model): DataComponent {
  let head = parseRoot(model, model.component.data.sources);

  const {outputNodes, outputNodeRefCounts} = model.component.data;
  const ancestorParse = model.parent ? model.parent.component.data.ancestorParse.clone() : new AncestorParse();

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
  const parentIsLayer = model.parent && isLayerModel(model.parent);
  if (isUnitModel(model) || isFacetModel(model)) {
    if (parentIsLayer) {
      head = BinNode.makeFromEncoding(head, model) || head;
    }
  }

  if (model.transforms.length > 0) {
    head = parseTransformArray(head, model, ancestorParse);
  }

  head = ParseNode.makeImplicit(head, model, ancestorParse) || head;

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
  const rawName = model.getName(RAW);
  const raw = new OutputNode(head, rawName, RAW, outputNodeRefCounts);
  outputNodes[rawName] = raw;
  head = raw;

  if (isUnitModel(model)) {
    const agg = AggregateNode.makeFromEncoding(head, model);
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
  const mainName = model.getName(MAIN);
  const main = new OutputNode(head, mainName, MAIN, outputNodeRefCounts);
  outputNodes[mainName] = main;
  head = main;

  // add facet marker
  let facetRoot = null;
  if (isFacetModel(model)) {
    const facetName = model.getName('facet');
    facetRoot = new FacetNode(head, model, facetName, main.getSource());
    outputNodes[facetName] = facetRoot;
    head = facetRoot;
  }

  return {
    ...model.component.data,
    outputNodes,
    outputNodeRefCounts,
    raw,
    main,
    facetRoot,
    ancestorParse
  };
}
