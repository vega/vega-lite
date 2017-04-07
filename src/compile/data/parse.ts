import {MAIN, RAW} from '../../data';
import {Dict} from '../../util';
import {FacetModel} from '../facet';
import {Model} from '../model';
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
  if (model.data) {
    // If we have data, try to insert it into existing sources.
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
    // If we don't have a source defined, use the parent's facet root or main.
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
     Path Order
         |
         v
      >0 Filter
         |
         v
   +----------+----> Child data...
   |   Main   |
   +----------+----> Layout
         |
         v
     +-------+
     | Facet |
     +-------+

*/

export function parseData(model: Model): DataComponent {
  const root = parseRoot(model, model.component.data.sources);

  const outputNodes = model.component.data.outputNodes;

  // the current head of the tree that we are appending to
  let head = root;

  // add format parse
  const parse = new ParseNode(model);
  parse.parent = root;
  head = parse;

  // handle transforms array
  if (model.transforms.length > 0) {
    const transforms = parseTransformArray(model);
    transforms.first.parent = head;
    head = transforms.last;
  }

  // add nullfilter
  const nullFilter = new NullFilterNode(model);
  if (Object.keys(nullFilter.aggregator).length) {
    nullFilter.parent = head;
    head = nullFilter;
  }

  // handle binning
  const bin = new BinNode(model);
  if (bin.size() > 0) {
    bin.parent = head;
    head = bin;
  }

  // handle time unit
  const tu = new TimeUnitNode(model);
  if (tu.size()) {
    tu.parent = head;
    head = tu;
  }

  // add an output node pre aggregation
  const rawName = model.getName(RAW);
  const raw = new OutputNode(rawName);
  outputNodes[rawName] = raw;
  raw.parent = head;
  head = raw;

  // handle aggregation
  if (model instanceof UnitModel) {
    const agg = new AggregateNode(model);
    if (agg.hasAggregation()) {
      agg.parent = head;
      head = agg;
    }
  }

  if (model instanceof UnitModel && model.stack) {
    // handle stacking
    const stackTransforms = new StackNode(model);
    stackTransforms.parent = head;
    head = stackTransforms;
  }

  if (model instanceof UnitModel) {
    const order = new OrderNode(model);
    if (order.hasSort()) {
      order.parent = head;
      head = order;
    }
  }

  // add filter for non-positive data if needed
  const nonPosFilter = new NonPositiveFilterNode(model);
  if (nonPosFilter.size() > 0) {
    nonPosFilter.parent = head;
    head = nonPosFilter;
  }

  // output node for marks
  const mainName = model.getName(MAIN);
  const main = new OutputNode(mainName);
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
