import {isNumber, isString} from 'vega-util';
import {MAIN, RAW} from '../../data';
import {DateTime, isDateTime} from '../../datetime';
import {isEqualFilter, isOneOfFilter, isRangeFilter} from '../../filter';
import * as log from '../../log';
import {isBin, isCalculate, isFilter, isLookup, isSummarize, isTimeUnit} from '../../transform';
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
import {IdentifierNode} from './indentifier';
import {DataComponent} from './index';
import {LookupNode} from './lookup';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';

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
export function parseTransformArray(model: Model) {
  let first: DataFlowNode = null;
  let node: DataFlowNode;
  let previous: DataFlowNode;
  let lookupCounter = 0;

  function insert(newNode: DataFlowNode) {
    if (!first) {
      // A parent may be inserted during node construction
      // (e.g., selection FilterNodes may add a TimeUnitNode).
      first = newNode.parent || newNode;
    } else if (newNode.parent) {
      previous.insertAsParentOf(newNode);
    } else {
      newNode.parent = previous;
    }

    previous = newNode;
  }

  model.transforms.forEach(t => {
    if (isCalculate(t)) {
      node = new CalculateNode(t);
    } else if (isFilter(t)) {
      // Automatically add a parse node for filters with filter objects
      const parse = {};
      const filter = t.filter;
      let val: string | number | boolean | DateTime = null;
      // For EqualFilter, just use the equal property.
      // For RangeFilter and OneOfFilter, all array members should have
      // the same type, so we only use the first one.
      if (isEqualFilter(filter)) {
        val = filter.equal;
      } else if (isRangeFilter(filter)) {
        val = filter.range[0];
      } else if (isOneOfFilter(filter)) {
        val = (filter.oneOf || filter['in'])[0];
      } // else -- for filter expression, we can't infer anything

      if (val) {
        if (isDateTime(val)) {
          parse[filter['field']] = 'date';
        } else if (isNumber(val)) {
          parse[filter['field']] = 'number';
        } else if (isString(val)) {
          parse[filter['field']] = 'string';
        }
      }

      if (keys(parse).length > 0) {
        const parseNode = new ParseNode(parse);
        insert(parseNode);
      }

      node = new FilterNode(model, t.filter);
    } else if (isBin(t)) {
      node = BinNode.makeFromTransform(t, {model});
    } else if (isTimeUnit(t)) {
      node = TimeUnitNode.makeFromTransform(t);
    } else if (isSummarize(t)) {
      node = AggregateNode.makeFromTransform(t);

      if (requiresSelectionId(model)) {
        insert(node);
        node = new IdentifierNode();
      }
    } else if (isLookup(t)) {
      node = LookupNode.make(model, t, lookupCounter++);
    } else {
      log.warn(log.message.invalidTransformIgnored(t));
      return;
    }

    insert(node);
  });

  const last = node;

  return {first, last};
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
     Null Filter
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
      >0 Filter
         |
         v
     Path Order
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
  const root = parseRoot(model, model.component.data.sources);

  const outputNodes = model.component.data.outputNodes;
  const outputNodeRefCounts = model.component.data.outputNodeRefCounts;

  // the current head of the tree that we are appending to
  let head = root;

  // Default discrete selections require an identifier transform to
  // uniquely identify data points as the _id field is volatile. Add
  // this transform at the head of our pipeline such that the identifier
  // field is available for all subsequent datasets. Additional identifier
  // transforms will be necessary when new tuples are constructed
  // (e.g., post-aggregation).
  if (requiresSelectionId(model) && !model.parent) {
    const ident = new IdentifierNode();
    ident.parent = head;
    head = ident;
  }

  // HACK: This is equivalent for merging bin extent for union scale.
  // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
  const parentIsLayer = model.parent && isLayerModel(model.parent);
  if (isUnitModel(model) || isFacetModel(model)) {
    if (parentIsLayer) {
      const bin = BinNode.makeBinFromEncoding(model);
      if (bin) {
        bin.parent = head;
        head = bin;
      }
    }
  }

  if (model.transforms.length > 0) {
    const {first, last} = parseTransformArray(model);
    first.parent = head;
    head = last;
  }

  const parse = ParseNode.make(model);
  if (parse) {
    parse.parent = head;
    head = parse;
  }

  if (isUnitModel(model) || isFacetModel(model)) {

    if (!parentIsLayer) {
      const bin = BinNode.makeBinFromEncoding(model);
      if (bin) {
        bin.parent = head;
        head = bin;
      }
    }

    const tu = TimeUnitNode.makeFromEncoding(model);
    if (tu) {
      tu.parent = head;
      head = tu;
    }
  }

  // add an output node pre aggregation
  const rawName = model.getName(RAW);
  const raw = new OutputNode(rawName, RAW, outputNodeRefCounts);
  outputNodes[rawName] = raw;
  raw.parent = head;
  head = raw;

  if (isUnitModel(model)) {
    const agg = AggregateNode.makeFromEncoding(model);
    if (agg) {
      agg.parent = head;
      head = agg;

      if (requiresSelectionId(model)) {
        const ident = new IdentifierNode();
        ident.parent = head;
        head = ident;
      }
    }

    const stack = StackNode.make(model);
    if (stack) {
      stack.parent = head;
      head = stack;
    }
  }

  if (isUnitModel(model)) {
    const filter = FilterInvalidNode.make(model);
    if (filter) {
      filter.parent = head;
      head = filter;
    }
  }

  // output node for marks
  const mainName = model.getName(MAIN);
  const main = new OutputNode(mainName, MAIN, outputNodeRefCounts);
  outputNodes[mainName] = main;
  main.parent = head;
  head = main;

  // add facet marker
  let facetRoot = null;
  if (isFacetModel(model)) {
    const facetName = model.getName('facet');
    facetRoot = new FacetNode(model, facetName, main.getSource());
    outputNodes[facetName] = facetRoot;
    facetRoot.parent = head;
    head = facetRoot;
  }

  // add the format parse from this model so that children don't parse the same field again
  const ancestorParse = {...model.component.data.ancestorParse, ...(parse ? parse.parse : {})};

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
