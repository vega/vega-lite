import {MAIN, RAW} from '../../data';
import {Dict} from '../../util';
import {FacetModel} from '../facet';
import {LayerModel} from '../layer';
import {Model, ModelWithField} from '../model';
import {UnitModel} from '../unit';
import {AggregateNode} from './aggregate';
import {BinNode} from './bin';
import {DataFlowNode, OutputNode} from './dataflow';
import {FacetNode} from './facet';
import {ParseNode} from './formatparse';
import {DataComponent} from './index';
import {NonPositiveFilterNode} from './nonpositivefilter';
import {NullFilterNode} from './nullfilter';
import {OrderNode} from './pathorder';
import {SourceNode} from './source';
import {StackNode} from './stack';
import {TimeUnitNode} from './timeunit';
import {parseTransformArray} from './transforms';

function parseRoot(model: Model, sources: Dict<SourceNode>): DataFlowNode {
  if (model.data || !model.parent) {
    // if the model defines a data source or is the root, create a source node
    const source = new SourceNode(model);
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

/*
Description of the dataflow (http://asciiflow.com/):

     +--------+
     | Source |
     +---+----+
         |
         v
       Parse
         |
         v
     Transforms
(Filter, Compute, ...)
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

  // the current head of the tree that we are appending to
  let head = root;

  const parse = ParseNode.make(model);
  if (parse) {
    parse.parent = root;
    head = parse;
  }

  // HACK: This is equivalent for merging bin extent for union scale.
  // FIXME(https://github.com/vega/vega-lite/issues/2270): Correctly merge extent / bin node for shared bin scale
  const parentIsLayer = model.parent && (model.parent instanceof LayerModel);
  if (model instanceof ModelWithField) {
    if (parentIsLayer) {
      const bin = BinNode.make(model);
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

  if (model instanceof ModelWithField) {
    const nullFilter = NullFilterNode.make(model);
    if (nullFilter) {
      nullFilter.parent = head;
      head = nullFilter;
    }

    if (!parentIsLayer) {
      const bin = BinNode.make(model);
      if (bin) {
        bin.parent = head;
        head = bin;
      }
    }

    const tu = TimeUnitNode.make(model);
    if (tu) {
      tu.parent = head;
      head = tu;
    }
  }

  // add an output node pre aggregation
  const rawName = model.getName(RAW);
  const raw = new OutputNode(rawName, RAW);
  outputNodes[rawName] = raw;
  raw.parent = head;
  head = raw;

  if (model instanceof UnitModel) {
    const agg = AggregateNode.make(model);
    if (agg) {
      agg.parent = head;
      head = agg;
    }

    const stack = StackNode.make(model);
    if (stack) {
      stack.parent = head;
      head = stack;
    }

    const nonPosFilter = NonPositiveFilterNode.make(model);
    if (nonPosFilter) {
      nonPosFilter.parent = head;
      head = nonPosFilter;
    }
  }

  if (model instanceof UnitModel) {
    const order = OrderNode.make(model);
    if (order) {
      order.parent = head;
      head = order;
    }
  }

  // output node for marks
  const mainName = model.getName(MAIN);
  const main = new OutputNode(mainName, MAIN);
  outputNodes[mainName] = main;
  main.parent = head;
  head = main;

  // add facet marker
  let facetRoot = null;
  if (model instanceof FacetModel) {
    const facetName = model.getName('facet');
    facetRoot = new FacetNode(model, facetName, main.source);
    outputNodes[facetName] = facetRoot;
    facetRoot.parent = head;
    head = facetRoot;
  }

  return {
    sources: model.component.data.sources,
    outputNodes,
    main,
    facetRoot
  };
}
